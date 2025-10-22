"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var http_1 = require("http");
var path_1 = require("path");
var electron_1 = require("electron");
var fs_extra_1 = require("fs-extra");
var promise_retry_1 = require("promise-retry");
var menu_1 = require("./menu");
var window_state_1 = require("./window-state");
require("./security");
var BUILD_ROOT = "".concat(__dirname, "/..");
var isPlaywrightTest = process.env.EXECUTION_CONTEXT === 'playwright';
var isDev = !isPlaywrightTest && !electron_1.app.isPackaged; // dev mode if not packaged and not playwright
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
var clientWin;
var serverProcess;
var syncServerProcess;
var oAuthServer;
var queuedClientWinLogs = []; // logs that are queued up until the client window is ready
var logMessage = function (loglevel, message) {
    // Electron main process logs
    var trimmedMessage = JSON.stringify(message.trim()); // ensure line endings are removed
    console[loglevel](trimmedMessage);
    if (!clientWin) {
        // queue up the logs until the client window is ready
        queuedClientWinLogs.push("console.".concat(loglevel, "(").concat(trimmedMessage, ")"));
    }
    else {
        // Send the queued up logs to the devtools console
        clientWin.webContents.executeJavaScript("console.".concat(loglevel, "(").concat(trimmedMessage, ")"));
    }
};
var createOAuthServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var port;
    return __generator(this, function (_a) {
        port = 3010;
        logMessage('info', "OAuth server running on port: ".concat(port));
        if (oAuthServer) {
            return [2 /*return*/, { url: "http://localhost:".concat(port), server: oAuthServer }];
        }
        return [2 /*return*/, new Promise(function (resolve) {
                var server = (0, http_1.createServer)(function (req, res) {
                    var query = new URL(req.url || '', "http://localhost:".concat(port))
                        .searchParams;
                    var code = query.get('token');
                    if (code && clientWin) {
                        if (isDev) {
                            clientWin.loadURL("http://localhost:3001/openid-cb?token=".concat(code));
                        }
                        else {
                            clientWin.loadURL("app://actual/openid-cb?token=".concat(code));
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
                server.listen(port, '127.0.0.1', function () {
                    resolve({ url: "http://localhost:".concat(port), server: server });
                });
            })];
    });
}); };
if (isDev) {
    process.traceProcessWarnings = true;
}
function loadGlobalPrefs() {
    return __awaiter(this, void 0, void 0, function () {
        var state;
        return __generator(this, function (_a) {
            state = {};
            try {
                state = JSON.parse(fs_1.default.readFileSync(path_1.default.join(process.env.ACTUAL_DATA_DIR, 'global-store.json'), 'utf8'));
            }
            catch (e) {
                logMessage('info', 'Could not load global state - using defaults');
                state = {};
            }
            return [2 /*return*/, state];
        });
    });
}
function createBackgroundProcess() {
    return __awaiter(this, void 0, void 0, function () {
        var globalPrefs, envVariables, forkOptions;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, loadGlobalPrefs()];
                case 1:
                    globalPrefs = _c.sent();
                    envVariables = __assign({}, process.env);
                    if (globalPrefs['server-self-signed-cert']) {
                        envVariables = __assign(__assign({}, envVariables), { NODE_EXTRA_CA_CERTS: globalPrefs['server-self-signed-cert'] });
                    }
                    forkOptions = {
                        stdio: 'pipe',
                        env: envVariables,
                    };
                    if (isDev) {
                        forkOptions = __assign(__assign({}, forkOptions), { execArgv: ['--inspect'] });
                    }
                    serverProcess = electron_1.utilityProcess.fork(__dirname + '/server.js', ['--subprocess', electron_1.app.getVersion()], forkOptions);
                    (_a = serverProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (chunk) {
                        // Send the Server log messages to the main browser window
                        logMessage('info', "Server Log: ".concat(chunk.toString('utf8')));
                    });
                    (_b = serverProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (chunk) {
                        // Send the Server log messages out to the main browser window
                        logMessage('error', "Server Log: ".concat(chunk.toString('utf8')));
                    });
                    serverProcess.on('message', function (msg) {
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
                    return [2 /*return*/];
            }
        });
    });
}
function startSyncServer() {
    return __awaiter(this, void 0, void 0, function () {
        var globalPrefs, syncServerConfig, serverPath_1, webRoot, envVariables, forkOptions_1, syncServerStarted_1, syncServerPromise, SYNC_SERVER_WAIT_TIMEOUT_1, syncServerTimeout, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    if (syncServerProcess) {
                        logMessage('info', 'Sync-Server: Already started! Ignoring request to start.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, loadGlobalPrefs()];
                case 1:
                    globalPrefs = _b.sent();
                    syncServerConfig = {
                        port: ((_a = globalPrefs.syncServerConfig) === null || _a === void 0 ? void 0 : _a.port) || 5007,
                        hostname: 'localhost',
                        ACTUAL_SERVER_DATA_DIR: path_1.default.resolve(process.env.ACTUAL_DATA_DIR, 'actual-server'),
                        ACTUAL_SERVER_FILES: path_1.default.resolve(process.env.ACTUAL_DATA_DIR, 'actual-server', 'server-files'),
                        ACTUAL_USER_FILES: path_1.default.resolve(process.env.ACTUAL_DATA_DIR, 'actual-server', 'user-files'),
                    };
                    serverPath_1 = path_1.default.join(
                    // require.resolve will recursively search up the workspace for the module
                    path_1.default.dirname(require.resolve('@actual-app/sync-server/package.json')), 'build', 'app.js');
                    webRoot = path_1.default.join(
                    // require.resolve will recursively search up the workspace for the module
                    path_1.default.dirname(require.resolve('@actual-app/web/package.json')), 'build');
                    envVariables = __assign(__assign({}, process.env), { ACTUAL_PORT: "".concat(syncServerConfig.port), ACTUAL_HOSTNAME: "".concat(syncServerConfig.hostname), ACTUAL_SERVER_FILES: "".concat(syncServerConfig.ACTUAL_SERVER_FILES), ACTUAL_USER_FILES: "".concat(syncServerConfig.ACTUAL_USER_FILES), ACTUAL_DATA_DIR: "".concat(syncServerConfig.ACTUAL_SERVER_DATA_DIR), ACTUAL_WEB_ROOT: webRoot });
                    // ACTUAL_SERVER_DATA_DIR is the root directory for the sync-server
                    if (!fs_1.default.existsSync(syncServerConfig.ACTUAL_SERVER_DATA_DIR)) {
                        (0, fs_extra_1.mkdir)(syncServerConfig.ACTUAL_SERVER_DATA_DIR, { recursive: true });
                    }
                    forkOptions_1 = {
                        stdio: 'pipe',
                        env: envVariables,
                    };
                    if (isDev) {
                        forkOptions_1 = __assign(__assign({}, forkOptions_1), { execArgv: ['--inspect'] });
                    }
                    syncServerStarted_1 = false;
                    syncServerPromise = new Promise(function (resolve) {
                        var _a, _b;
                        syncServerProcess = electron_1.utilityProcess.fork(serverPath_1, [], forkOptions_1);
                        (_a = syncServerProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (chunk) {
                            // Send the Server console.log messages to the main browser window
                            logMessage('info', "Sync-Server: ".concat(chunk.toString('utf8')));
                        });
                        (_b = syncServerProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (chunk) {
                            // Send the Server console.error messages out to the main browser window
                            logMessage('error', "Sync-Server: ".concat(chunk.toString('utf8')));
                        });
                        syncServerProcess.on('message', function (msg) {
                            switch (msg.type) {
                                case 'server-started':
                                    logMessage('info', 'Sync-Server: Actual Sync Server has started!');
                                    syncServerStarted_1 = true;
                                    resolve();
                                    break;
                                default:
                                    logMessage('info', 'Sync-Server: Unknown server message: ' + msg.type);
                            }
                        });
                    });
                    SYNC_SERVER_WAIT_TIMEOUT_1 = 20000;
                    syncServerTimeout = new Promise(function (_, reject) {
                        setTimeout(function () {
                            if (!syncServerStarted_1) {
                                var errorMessage = "Sync-Server: Failed to start within ".concat(SYNC_SERVER_WAIT_TIMEOUT_1 / 1000, " seconds. Something is wrong. Please raise a github issue.");
                                logMessage('error', errorMessage);
                                reject(new Error(errorMessage));
                            }
                        }, SYNC_SERVER_WAIT_TIMEOUT_1);
                    });
                    return [4 /*yield*/, Promise.race([syncServerPromise, syncServerTimeout])];
                case 2: return [2 /*return*/, _b.sent()]; // Either the server has started or the timeout is reached
                case 3:
                    error_1 = _b.sent();
                    logMessage('error', "Sync-Server: Error starting sync server: ".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function stopSyncServer() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            syncServerProcess === null || syncServerProcess === void 0 ? void 0 : syncServerProcess.kill();
            syncServerProcess = null;
            logMessage('info', 'Sync-Server: Stopped');
            return [2 /*return*/];
        });
    });
}
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var windowState, win, unlistenToState;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, window_state_1.get)()];
                case 1:
                    windowState = _a.sent();
                    win = new electron_1.BrowserWindow({
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
                    unlistenToState = (0, window_state_1.listen)(win, windowState);
                    if (isDev) {
                        win.loadURL("file://".concat(__dirname, "/loading.html"));
                        // Wait for the development server to start
                        setTimeout(function () {
                            (0, promise_retry_1.default)(function (retry) { return win.loadURL('http://localhost:3001/').catch(retry); });
                        }, 3000);
                    }
                    else {
                        win.loadURL("app://actual/");
                    }
                    win.on('closed', function () {
                        clientWin = null;
                        unlistenToState();
                    });
                    win.on('unresponsive', function () {
                        logMessage('info', 'browser window went unresponsive (maybe because of a modal)');
                    });
                    win.on('focus', function () { return __awaiter(_this, void 0, void 0, function () {
                        var url;
                        return __generator(this, function (_a) {
                            if (clientWin) {
                                url = clientWin.webContents.getURL();
                                if (url.includes('app://') || url.includes('localhost:')) {
                                    clientWin.webContents.executeJavaScript('window.__actionsForMenu.appFocused()');
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    // hit when middle-clicking buttons or <a href/> with a target set to _blank
                    // always deny, optionally redirect to browser
                    win.webContents.setWindowOpenHandler(function (_a) {
                        var url = _a.url;
                        if (isExternalUrl(url)) {
                            electron_1.shell.openExternal(url);
                        }
                        return { action: 'deny' };
                    });
                    // hit when clicking <a href/> with no target
                    // optionally redirect to browser
                    win.webContents.on('will-navigate', function (event, url) {
                        if (isExternalUrl(url)) {
                            electron_1.shell.openExternal(url);
                            event.preventDefault();
                        }
                    });
                    electron_1.Menu.setApplicationMenu((0, menu_1.getMenu)());
                    clientWin = win;
                    // Execute queued logs - displaying them in the client window
                    queuedClientWinLogs.map(function (log) {
                        return win.webContents.executeJavaScript(log);
                    });
                    queuedClientWinLogs = [];
                    return [2 /*return*/];
            }
        });
    });
}
function isExternalUrl(url) {
    return !url.includes('localhost:') && !url.includes('app://');
}
electron_1.app.setAppUserModelId('com.actualbudget.actual');
electron_1.app.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    var globalPrefs;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, loadGlobalPrefs()];
            case 1:
                globalPrefs = _b.sent();
                if (!((_a = globalPrefs.syncServerConfig) === null || _a === void 0 ? void 0 : _a.autoStart)) return [3 /*break*/, 3];
                // wait for the server to start before starting the Actual client to ensure server is available
                return [4 /*yield*/, startSyncServer()];
            case 2:
                // wait for the server to start before starting the Actual client to ensure server is available
                _b.sent();
                _b.label = 3;
            case 3:
                electron_1.protocol.handle('app', function (request) {
                    if (request.method !== 'GET') {
                        return new Response(null, {
                            status: 405,
                            statusText: 'Method Not Allowed',
                        });
                    }
                    var parsedUrl = new URL(request.url);
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
                    var pathname = parsedUrl.pathname;
                    var filePath = path_1.default.normalize("".concat(BUILD_ROOT, "/client-build/index.html")); // default web path
                    if (pathname.startsWith('/static')) {
                        // static assets
                        filePath = path_1.default.normalize("".concat(BUILD_ROOT, "/client-build").concat(pathname));
                        var resolvedPath = path_1.default.resolve(filePath);
                        var clientBuildPath = path_1.default.resolve(BUILD_ROOT, 'client-build');
                        // Ensure filePath is within client-build directory - prevents directory traversal vulnerability
                        if (!resolvedPath.startsWith(clientBuildPath)) {
                            return new Response(null, {
                                status: 403,
                                statusText: 'Forbidden',
                            });
                        }
                    }
                    return electron_1.net.fetch("file:///".concat(filePath));
                });
                if (!(process.argv[1] !== '--server')) return [3 /*break*/, 5];
                return [4 /*yield*/, createWindow()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                // This is mainly to aid debugging Sentry errors - it will add a
                // breadcrumb
                electron_1.powerMonitor.on('suspend', function () {
                    logMessage('info', 'Suspending: ' + new Date());
                });
                return [4 /*yield*/, createBackgroundProcess()];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
electron_1.app.on('window-all-closed', function () {
    // On macOS, closing all windows shouldn't exit the process
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('before-quit', function () {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
});
electron_1.app.on('activate', function () {
    if (clientWin === null) {
        createWindow();
    }
});
electron_1.ipcMain.on('get-bootstrap-data', function (event) {
    var payload = {
        version: electron_1.app.getVersion(),
        isDev: isDev,
    };
    event.returnValue = payload;
});
electron_1.ipcMain.handle('start-sync-server', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, startSyncServer()];
}); }); });
electron_1.ipcMain.handle('stop-sync-server', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, stopSyncServer()];
}); }); });
electron_1.ipcMain.handle('is-sync-server-running', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, syncServerProcess ? true : false];
}); }); });
electron_1.ipcMain.handle('start-oauth-server', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, url, newServer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, createOAuthServer()];
            case 1:
                _a = _b.sent(), url = _a.url, newServer = _a.server;
                oAuthServer = newServer;
                return [2 /*return*/, url];
        }
    });
}); });
electron_1.ipcMain.handle('restart-server', function () {
    if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
    }
    createBackgroundProcess();
});
electron_1.ipcMain.handle('relaunch', function () {
    electron_1.app.relaunch();
    electron_1.app.exit();
});
electron_1.ipcMain.handle('open-file-dialog', function (_event, _a) {
    var filters = _a.filters, properties = _a.properties;
    return electron_1.dialog.showOpenDialogSync({
        properties: properties || ['openFile'],
        filters: filters,
    });
});
electron_1.ipcMain.handle('save-file-dialog', function (_event_1, _a) { return __awaiter(void 0, [_event_1, _a], void 0, function (_event, _b) {
    var fileLocation;
    var title = _b.title, defaultPath = _b.defaultPath, fileContents = _b.fileContents;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showSaveDialog({ title: title, defaultPath: defaultPath })];
            case 1:
                fileLocation = _c.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (fileLocation) {
                            var contents = typeof fileContents === 'string'
                                ? fileContents
                                : new Uint8Array(fileContents.buffer);
                            fs_1.default.writeFile(fileLocation.filePath, contents, function (error) {
                                return reject(error);
                            });
                        }
                        resolve();
                    })];
        }
    });
}); });
electron_1.ipcMain.handle('open-external-url', function (event, url) {
    electron_1.shell.openExternal(url);
});
electron_1.ipcMain.on('message', function (_event, msg) {
    if (!serverProcess) {
        return;
    }
    serverProcess.postMessage(msg.args);
});
electron_1.ipcMain.on('set-theme', function (_event, theme) {
    var obj = { theme: theme };
    if (clientWin) {
        clientWin.webContents.executeJavaScript("window.__actionsForMenu && window.__actionsForMenu.saveGlobalPrefs({ prefs: ".concat(JSON.stringify(obj), " })"));
    }
});
electron_1.ipcMain.handle('move-budget-directory', function (_event, currentBudgetDirectory, newDirectory) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!currentBudgetDirectory || !newDirectory) {
                    throw new Error('The from and to directories must be provided');
                }
                if (newDirectory.startsWith(currentBudgetDirectory)) {
                    throw new Error('The destination must not be a subdirectory of the current directory');
                }
                return [4 /*yield*/, (0, fs_extra_1.exists)(newDirectory)];
            case 1:
                if (!(_a.sent())) {
                    throw new Error('The destination directory does not exist');
                }
                return [4 /*yield*/, (0, fs_extra_1.copy)(currentBudgetDirectory, newDirectory, {
                        overwrite: true,
                        preserveTimestamps: true,
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                logMessage('error', "There was an error moving your directory:  ".concat(error_2));
                throw error_2;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, promise_retry_1.default)(function (retry) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, fs_extra_1.remove)(currentBudgetDirectory)];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_4 = _a.sent();
                                    logMessage('info', "Retrying: Clean up old directory: ".concat(currentBudgetDirectory));
                                    retry(error_4);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, { minTimeout: 200, maxTimeout: 500, factor: 1.25 })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                // Fail silently. The move worked, but the old directory wasn't cleaned up - most likely a permission issue.
                // This call needs to succeed to allow the user to continue using the app with the files in the new location.
                logMessage('error', "There was an error removing the old directory: ".concat(error_3));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
