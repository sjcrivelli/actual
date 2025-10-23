"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const { version: VERSION, isDev: IS_DEV } = electron_1.ipcRenderer.sendSync('get-bootstrap-data');
electron_1.contextBridge.exposeInMainWorld('Actual', {
    IS_DEV,
    ACTUAL_VERSION: VERSION,
    logToTerminal: console.log,
    ipcConnect: (func) => {
        func({
            on(name, handler) {
                return electron_1.ipcRenderer.on(name, (_event, value) => handler(value));
            },
            emit(name, data) {
                return electron_1.ipcRenderer.send('message', { name, args: data });
            },
        });
    },
    startSyncServer: () => electron_1.ipcRenderer.invoke('start-sync-server'),
    stopSyncServer: () => electron_1.ipcRenderer.invoke('stop-sync-server'),
    isSyncServerRunning: () => electron_1.ipcRenderer.invoke('is-sync-server-running'),
    startOAuthServer: () => electron_1.ipcRenderer.invoke('start-oauth-server'),
    relaunch: () => {
        electron_1.ipcRenderer.invoke('relaunch');
    },
    restartElectronServer: () => {
        electron_1.ipcRenderer.invoke('restart-server');
    },
    openFileDialog: (opts) => {
        return electron_1.ipcRenderer.invoke('open-file-dialog', opts);
    },
    saveFile: async (contents, filename, dialogTitle) => {
        await electron_1.ipcRenderer.invoke('save-file-dialog', {
            title: dialogTitle,
            defaultPath: filename,
            fileContents: contents,
        });
    },
    openURLInBrowser: (url) => {
        electron_1.ipcRenderer.invoke('open-external-url', url);
    },
    onEventFromMain: (type, handler) => {
        electron_1.ipcRenderer.on(type, handler);
    },
    // No auto-updates in the desktop app
    isUpdateReadyForDownload: () => false,
    waitForUpdateReadyForDownload: () => new Promise(() => { }),
    getServerSocket: async () => {
        return null;
    },
    setTheme: (theme) => {
        electron_1.ipcRenderer.send('set-theme', theme);
    },
    moveBudgetDirectory: (currentBudgetDirectory, newDirectory) => {
        return electron_1.ipcRenderer.invoke('move-budget-directory', currentBudgetDirectory, newDirectory);
    },
    reload: async () => {
        throw new Error('Reload not implemented in electron app');
    },
    applyAppUpdate: async () => {
        throw new Error('applyAppUpdate not implemented in electron app');
    },
});
