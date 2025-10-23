"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const fs_extra_1 = require("fs-extra");
const promise_retry_1 = __importDefault(require("promise-retry"));
const menu_1 = require("./menu");
const window_state_1 = require("./window-state");
require("./security");
const BUILD_ROOT = `${__dirname}/..`;
const isPlaywrightTest = process.env.EXECUTION_CONTEXT === 'playwright';
const isDev = !isPlaywrightTest && !electron_1.app.isPackaged; // dev mode if not packaged and not playwright
process.env.lootCoreScript = isDev
    ? 'loot-core/lib-dist/electron/bundle.desktop.js' // serve from local output in development (provides hot-reloading)
    : path_1.default.resolve(BUILD_ROOT, 'loot-core/lib-dist/electron/bundle.desktop.js'); // serve from build in production
// This allows relative URLs to be resolved to app:// which makes
// local assets load correctly
electron_1.protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { standard: true } },
]);
if (isPlaywrightTest) {
    if (!process.env.ACTUAL_DOCUMENT_DIR || !process.env.ACTUAL_DATA_DIR) {
        throw new Error('ACTUAL_DOCUMENT_DIR and ACTUAL_DATA_DIR must be set in the environment for playwright tests');
    }
}
else {
    if (!isDev || !process.env.ACTUAL_DOCUMENT_DIR) {
        process.env.ACTUAL_DOCUMENT_DIR = electron_1.app.getPath('documents');
    }
    if (!isDev || !process.env.ACTUAL_DATA_DIR) {
        process.env.ACTUAL_DATA_DIR = electron_1.app.getPath('userData');
    }
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let clientWin;
let serverProcess;
let syncServerProcess;
let oAuthServer;
let queuedClientWinLogs = []; // logs that are queued up until the client window is ready
const logMessage = (loglevel, message) => {
    // Electron main process logs
    const trimmedMessage = JSON.stringify(message.trim()); // ensure line endings are removed
    console[loglevel](trimmedMessage);
    if (!clientWin) {
        // queue up the logs until the client window is ready
        queuedClientWinLogs.push(`console.${loglevel}(${trimmedMessage})`);
    }
    else {
        // Send the queued up logs to the devtools console
        clientWin.webContents.executeJavaScript(`console.${loglevel}(${trimmedMessage})`);
    }
};
const createOAuthServer = async () => {
    const port = 3010;
    logMessage('info', `OAuth server running on port: ${port}`);
    if (oAuthServer) {
        return { url: `http://localhost:${port}`, server: oAuthServer };
    }
    return new Promise(resolve => {
        const server = (0, http_1.createServer)((req, res) => {
            const query = new URL(req.url || '', `http://localhost:${port}`)
                .searchParams;
            const code = query.get('token');
            if (code && clientWin) {
                if (isDev) {
                    clientWin.loadURL(`http://localhost:3001/openid-cb?token=${code}`);
                }
                else {
                    clientWin.loadURL(`app://actual/openid-cb?token=${code}`);
                }
                // Respond to the browser
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('OpenID login successful! You can close this tab.');
                // Clean up the server after receiving the code
                server.close();
            }
            else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No token received.');
            }
        });
        server.listen(port, '127.0.0.1', () => {
            resolve({ url: `http://localhost:${port}`, server });
        });
    });
};
if (isDev) {
    process.traceProcessWarnings = true;
}
async function loadGlobalPrefs() {
    let state = {};
    try {
        state = JSON.parse(fs_1.default.readFileSync(path_1.default.join(process.env.ACTUAL_DATA_DIR, 'global-store.json'), 'utf8'));
    }
    catch (e) {
        logMessage('info', 'Could not load global state - using defaults');
        state = {};
    }
    return state;
}
async function createBackgroundProcess() {
    const globalPrefs = await loadGlobalPrefs(); // ensures we have the latest settings - even when restarting the server
    let envVariables = {
        ...process.env, // required
    };
    if (globalPrefs['server-self-signed-cert']) {
        envVariables = {
            ...envVariables,
            NODE_EXTRA_CA_CERTS: globalPrefs['server-self-signed-cert'], // add self signed cert to env - fetch can pick it up
        };
    }
    let forkOptions = {
        stdio: 'pipe',
        env: envVariables,
    };
    if (isDev) {
        forkOptions = { ...forkOptions, execArgv: ['--inspect'] };
    }
    serverProcess = electron_1.utilityProcess.fork(__dirname + '/server.js', ['--subprocess', electron_1.app.getVersion()], forkOptions);
    serverProcess.stdout?.on('data', (chunk) => {
        // Send the Server log messages to the main browser window
        logMessage('info', `Server Log: ${chunk.toString('utf8')}`);
    });
    serverProcess.stderr?.on('data', (chunk) => {
        // Send the Server log messages out to the main browser window
        logMessage('error', `Server Log: ${chunk.toString('utf8')}`);
    });
    serverProcess.on('message', msg => {
        switch (msg.type) {
            case 'captureEvent':
            case 'captureBreadcrumb':
                break;
            case 'reply':
            case 'error':
            case 'push':
                if (clientWin) {
                    clientWin.webContents.send('message', msg);
                }
                break;
            default:
                logMessage('info', 'Unknown server message: ' + msg.type);
        }
    });
}
async function startSyncServer() {
    try {
        if (syncServerProcess) {
            logMessage('info', 'Sync-Server: Already started! Ignoring request to start.');
            return;
        }
        const globalPrefs = await loadGlobalPrefs();
        const syncServerConfig = {
            port: globalPrefs.syncServerConfig?.port || 5007,
            hostname: 'localhost',
            ACTUAL_SERVER_DATA_DIR: path_1.default.resolve(process.env.ACTUAL_DATA_DIR, 'actual-server'),
            ACTUAL_SERVER_FILES: path_1.default.resolve(process.env.ACTUAL_DATA_DIR, 'actual-server', 'server-files'),
            ACTUAL_USER_FILES: path_1.default.resolve(process.env.ACTUAL_DATA_DIR, 'actual-server', 'user-files'),
        };
        const serverPath = path_1.default.join(
        // require.resolve will recursively search up the workspace for the module
        path_1.default.dirname(require.resolve('@actual-app/sync-server/package.json')), 'build', 'app.js');
        const webRoot = path_1.default.join(
        // require.resolve will recursively search up the workspace for the module
        path_1.default.dirname(require.resolve('@actual-app/web/package.json')), 'build');
        // Use env variables to configure the server
        const envVariables = {
            ...process.env, // required
            ACTUAL_PORT: `${syncServerConfig.port}`,
            ACTUAL_HOSTNAME: `${syncServerConfig.hostname}`,
            ACTUAL_SERVER_FILES: `${syncServerConfig.ACTUAL_SERVER_FILES}`,
            ACTUAL_USER_FILES: `${syncServerConfig.ACTUAL_USER_FILES}`,
            ACTUAL_DATA_DIR: `${syncServerConfig.ACTUAL_SERVER_DATA_DIR}`,
            ACTUAL_WEB_ROOT: webRoot,
        };
        // ACTUAL_SERVER_DATA_DIR is the root directory for the sync-server
        if (!fs_1.default.existsSync(syncServerConfig.ACTUAL_SERVER_DATA_DIR)) {
            (0, fs_extra_1.mkdir)(syncServerConfig.ACTUAL_SERVER_DATA_DIR, { recursive: true });
        }
        let forkOptions = {
            stdio: 'pipe',
            env: envVariables,
        };
        if (isDev) {
            forkOptions = { ...forkOptions, execArgv: ['--inspect'] };
        }
        let syncServerStarted = false;
        const syncServerPromise = new Promise(resolve => {
            syncServerProcess = electron_1.utilityProcess.fork(serverPath, [], forkOptions);
            syncServerProcess.stdout?.on('data', (chunk) => {
                // Send the Server console.log messages to the main browser window
                logMessage('info', `Sync-Server: ${chunk.toString('utf8')}`);
            });
            syncServerProcess.stderr?.on('data', (chunk) => {
                // Send the Server console.error messages out to the main browser window
                logMessage('error', `Sync-Server: ${chunk.toString('utf8')}`);
            });
            syncServerProcess.on('message', msg => {
                switch (msg.type) {
                    case 'server-started':
                        logMessage('info', 'Sync-Server: Actual Sync Server has started!');
                        syncServerStarted = true;
                        resolve();
                        break;
                    default:
                        logMessage('info', 'Sync-Server: Unknown server message: ' + msg.type);
                }
            });
        });
        const SYNC_SERVER_WAIT_TIMEOUT = 20000; // wait 20 seconds for the server to start - if it doesn't, throw an error
        const syncServerTimeout = new Promise((_, reject) => {
            setTimeout(() => {
                if (!syncServerStarted) {
                    const errorMessage = `Sync-Server: Failed to start within ${SYNC_SERVER_WAIT_TIMEOUT / 1000} seconds. Something is wrong. Please raise a github issue.`;
                    logMessage('error', errorMessage);
                    reject(new Error(errorMessage));
                }
            }, SYNC_SERVER_WAIT_TIMEOUT);
        });
        return await Promise.race([syncServerPromise, syncServerTimeout]); // Either the server has started or the timeout is reached
    }
    catch (error) {
        logMessage('error', `Sync-Server: Error starting sync server: ${error}`);
    }
}
async function stopSyncServer() {
    syncServerProcess?.kill();
    syncServerProcess = null;
    logMessage('info', 'Sync-Server: Stopped');
}
async function createWindow() {
    const windowState = await (0, window_state_1.get)();
    // Create the browser window.
    const win = new electron_1.BrowserWindow({
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        title: 'Actual',
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            preload: __dirname + '/preload.js',
        },
        autoHideMenuBar: true, // Alt key shows the menu
    });
    win.setBackgroundColor('#E8ECF0');
    if (isDev) {
        win.webContents.openDevTools();
    }
    const unlistenToState = (0, window_state_1.listen)(win, windowState);
    if (isDev) {
        win.loadURL(`file://${__dirname}/loading.html`);
        // Wait for the development server to start
        setTimeout(() => {
            (0, promise_retry_1.default)(retry => win.loadURL('http://localhost:3001/').catch(retry));
        }, 3000);
    }
    else {
        win.loadURL(`app://actual/`);
    }
    win.on('closed', () => {
        clientWin = null;
        unlistenToState();
    });
    win.on('unresponsive', () => {
        logMessage('info', 'browser window went unresponsive (maybe because of a modal)');
    });
    win.on('focus', async () => {
        if (clientWin) {
            const url = clientWin.webContents.getURL();
            if (url.includes('app://') || url.includes('localhost:')) {
                clientWin.webContents.executeJavaScript('window.__actionsForMenu.appFocused()');
            }
        }
    });
    // hit when middle-clicking buttons or <a href/> with a target set to _blank
    // always deny, optionally redirect to browser
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (isExternalUrl(url)) {
            electron_1.shell.openExternal(url);
        }
        return { action: 'deny' };
    });
    // hit when clicking <a href/> with no target
    // optionally redirect to browser
    win.webContents.on('will-navigate', (event, url) => {
        if (isExternalUrl(url)) {
            electron_1.shell.openExternal(url);
            event.preventDefault();
        }
    });
    electron_1.Menu.setApplicationMenu((0, menu_1.getMenu)());
    clientWin = win;
    // Execute queued logs - displaying them in the client window
    queuedClientWinLogs.map((log) => win.webContents.executeJavaScript(log));
    queuedClientWinLogs = [];
}
function isExternalUrl(url) {
    return !url.includes('localhost:') && !url.includes('app://');
}
electron_1.app.setAppUserModelId('com.actualbudget.actual');
electron_1.app.on('ready', async () => {
    // Install an `app://` protocol that always returns the base HTML
    // file no matter what URL it is. This allows us to use react-router
    // on the frontend
    const globalPrefs = await loadGlobalPrefs();
    if (globalPrefs.syncServerConfig?.autoStart) {
        // wait for the server to start before starting the Actual client to ensure server is available
        await startSyncServer();
    }
    electron_1.protocol.handle('app', request => {
        if (request.method !== 'GET') {
            return new Response(null, {
                status: 405,
                statusText: 'Method Not Allowed',
            });
        }
        const parsedUrl = new URL(request.url);
        if (parsedUrl.protocol !== 'app:') {
            return new Response(null, {
                status: 404,
                statusText: 'Unknown URL Scheme',
            });
        }
        if (parsedUrl.host !== 'actual') {
            return new Response(null, {
                status: 404,
                statusText: 'Host Not Resolved',
            });
        }
        const pathname = parsedUrl.pathname;
        let filePath = path_1.default.normalize(`${BUILD_ROOT}/client-build/index.html`); // default web path
        if (pathname.startsWith('/static')) {
            // static assets
            filePath = path_1.default.normalize(`${BUILD_ROOT}/client-build${pathname}`);
            const resolvedPath = path_1.default.resolve(filePath);
            const clientBuildPath = path_1.default.resolve(BUILD_ROOT, 'client-build');
            // Ensure filePath is within client-build directory - prevents directory traversal vulnerability
            if (!resolvedPath.startsWith(clientBuildPath)) {
                return new Response(null, {
                    status: 403,
                    statusText: 'Forbidden',
                });
            }
        }
        return electron_1.net.fetch(`file:///${filePath}`);
    });
    if (process.argv[1] !== '--server') {
        await createWindow();
    }
    // This is mainly to aid debugging Sentry errors - it will add a
    // breadcrumb
    electron_1.powerMonitor.on('suspend', () => {
        logMessage('info', 'Suspending: ' + new Date());
    });
    await createBackgroundProcess();
});
electron_1.app.on('window-all-closed', () => {
    // On macOS, closing all windows shouldn't exit the process
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
});
electron_1.app.on('activate', () => {
    if (clientWin === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('get-bootstrap-data', event => {
    const payload = {
        version: electron_1.app.getVersion(),
        isDev,
    };
    event.returnValue = payload;
});
electron_1.ipcMain.handle('start-sync-server', async () => startSyncServer());
electron_1.ipcMain.handle('stop-sync-server', async () => stopSyncServer());
electron_1.ipcMain.handle('is-sync-server-running', async () => syncServerProcess ? true : false);
electron_1.ipcMain.handle('start-oauth-server', async () => {
    const { url, server: newServer } = await createOAuthServer();
    oAuthServer = newServer;
    return url;
});
electron_1.ipcMain.handle('restart-server', () => {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
    createBackgroundProcess();
});
electron_1.ipcMain.handle('relaunch', () => {
    electron_1.app.relaunch();
    electron_1.app.exit();
});
electron_1.ipcMain.handle('open-file-dialog', (_event, { filters, properties }) => {
    return electron_1.dialog.showOpenDialogSync({
        properties: properties || ['openFile'],
        filters,
    });
});
electron_1.ipcMain.handle('save-file-dialog', async (_event, { title, defaultPath, fileContents }) => {
    const fileLocation = await electron_1.dialog.showSaveDialog({ title, defaultPath });
    return new Promise((resolve, reject) => {
        if (fileLocation) {
            const contents = typeof fileContents === 'string'
                ? fileContents
                : new Uint8Array(fileContents.buffer);
            fs_1.default.writeFile(fileLocation.filePath, contents, error => {
                return reject(error);
            });
        }
        resolve();
    });
});
electron_1.ipcMain.handle('open-external-url', (event, url) => {
    electron_1.shell.openExternal(url);
});
electron_1.ipcMain.on('message', (_event, msg) => {
    if (!serverProcess) {
        return;
    }
    serverProcess.postMessage(msg.args);
});
electron_1.ipcMain.on('set-theme', (_event, theme) => {
    const obj = { theme };
    if (clientWin) {
        clientWin.webContents.executeJavaScript(`window.__actionsForMenu && window.__actionsForMenu.saveGlobalPrefs({ prefs: ${JSON.stringify(obj)} })`);
    }
});
electron_1.ipcMain.handle('move-budget-directory', async (_event, currentBudgetDirectory, newDirectory) => {
    try {
        if (!currentBudgetDirectory || !newDirectory) {
            throw new Error('The from and to directories must be provided');
        }
        if (newDirectory.startsWith(currentBudgetDirectory)) {
            throw new Error('The destination must not be a subdirectory of the current directory');
        }
        if (!(await (0, fs_extra_1.exists)(newDirectory))) {
            throw new Error('The destination directory does not exist');
        }
        await (0, fs_extra_1.copy)(currentBudgetDirectory, newDirectory, {
            overwrite: true,
            preserveTimestamps: true,
        });
    }
    catch (error) {
        logMessage('error', `There was an error moving your directory:  ${error}`);
        throw error;
    }
    try {
        await (0, promise_retry_1.default)(async (retry) => {
            try {
                return await (0, fs_extra_1.remove)(currentBudgetDirectory);
            }
            catch (error) {
                logMessage('info', `Retrying: Clean up old directory: ${currentBudgetDirectory}`);
                retry(error);
            }
        }, { minTimeout: 200, maxTimeout: 500, factor: 1.25 });
    }
    catch (error) {
        // Fail silently. The move worked, but the old directory wasn't cleaned up - most likely a permission issue.
        // This call needs to succeed to allow the user to continue using the app with the files in the new location.
        logMessage('error', `There was an error removing the old directory: ${error}`);
    }
});
