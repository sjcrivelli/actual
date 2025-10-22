"use strict";
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
var electron_1 = require("electron");
var _a = electron_1.ipcRenderer.sendSync('get-bootstrap-data'), VERSION = _a.version, IS_DEV = _a.isDev;
electron_1.contextBridge.exposeInMainWorld('Actual', {
    IS_DEV: IS_DEV,
    ACTUAL_VERSION: VERSION,
    logToTerminal: console.log,
    ipcConnect: function (func) {
        func({
            on: function (name, handler) {
                return electron_1.ipcRenderer.on(name, function (_event, value) { return handler(value); });
            },
            emit: function (name, data) {
                return electron_1.ipcRenderer.send('message', { name: name, args: data });
            },
        });
    },
    startSyncServer: function () { return electron_1.ipcRenderer.invoke('start-sync-server'); },
    stopSyncServer: function () { return electron_1.ipcRenderer.invoke('stop-sync-server'); },
    isSyncServerRunning: function () { return electron_1.ipcRenderer.invoke('is-sync-server-running'); },
    startOAuthServer: function () { return electron_1.ipcRenderer.invoke('start-oauth-server'); },
    relaunch: function () {
        electron_1.ipcRenderer.invoke('relaunch');
    },
    restartElectronServer: function () {
        electron_1.ipcRenderer.invoke('restart-server');
    },
    openFileDialog: function (opts) {
        return electron_1.ipcRenderer.invoke('open-file-dialog', opts);
    },
    saveFile: function (contents, filename, dialogTitle) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.ipcRenderer.invoke('save-file-dialog', {
                        title: dialogTitle,
                        defaultPath: filename,
                        fileContents: contents,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    openURLInBrowser: function (url) {
        electron_1.ipcRenderer.invoke('open-external-url', url);
    },
    onEventFromMain: function (type, handler) {
        electron_1.ipcRenderer.on(type, handler);
    },
    // No auto-updates in the desktop app
    isUpdateReadyForDownload: function () { return false; },
    waitForUpdateReadyForDownload: function () { return new Promise(function () { }); },
    getServerSocket: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, null];
        });
    }); },
    setTheme: function (theme) {
        electron_1.ipcRenderer.send('set-theme', theme);
    },
    moveBudgetDirectory: function (currentBudgetDirectory, newDirectory) {
        return electron_1.ipcRenderer.invoke('move-budget-directory', currentBudgetDirectory, newDirectory);
    },
    reload: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('Reload not implemented in electron app');
        });
    }); },
    applyAppUpdate: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('applyAppUpdate not implemented in electron app');
        });
    }); },
});
