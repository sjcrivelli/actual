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
exports.setAllFiles = exports.setRemoteFiles = exports.setBudgets = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.makeBackup = exports.loadBackup = exports.downloadBudget = exports.closeAndDownloadBudget = exports.closeAndLoadBudget = exports.uploadBudget = exports.importBudget = exports.duplicateBudget = exports.createBudget = exports.deleteBudget = exports.closeBudgetUI = exports.closeBudget = exports.loadBudget = exports.loadAllFiles = exports.loadRemoteFiles = exports.loadBudgets = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var i18next_1 = require("i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var appSlice_1 = require("@desktop-client/app/appSlice");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
var sliceName = 'budgetfiles';
exports.loadBudgets = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadBudgets"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var budgets;
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('get-budgets')];
            case 1:
                budgets = _c.sent();
                return [4 /*yield*/, dispatch((0, exports.setBudgets)({ budgets: budgets }))];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.loadRemoteFiles = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadRemoteFiles"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var files;
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('get-remote-files')];
            case 1:
                files = _c.sent();
                return [4 /*yield*/, dispatch((0, exports.setRemoteFiles)({ remoteFiles: files }))];
            case 2:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.loadAllFiles = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadAllFiles"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var budgets, files;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('get-budgets')];
            case 1:
                budgets = _c.sent();
                return [4 /*yield*/, (0, fetch_1.send)('get-remote-files')];
            case 2:
                files = _c.sent();
                return [4 /*yield*/, dispatch((0, exports.setAllFiles)({ budgets: budgets, remoteFiles: files }))];
            case 3:
                _c.sent();
                return [2 /*return*/, getState().budgetfiles.allFiles];
        }
    });
}); });
exports.loadBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var error, message, showBackups;
    var id = _c.id, _e = _c.options, options = _e === void 0 ? {} : _e;
    var dispatch = _d.dispatch;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: (0, i18next_1.t)('Loading...') }))];
            case 1:
                _f.sent();
                return [4 /*yield*/, (0, fetch_1.send)('load-budget', __assign({ id: id }, options))];
            case 2:
                error = (_f.sent()).error;
                if (!error) return [3 /*break*/, 11];
                message = (0, errors_1.getSyncError)(error, id);
                if (!(error === 'out-of-sync-migrations')) return [3 /*break*/, 4];
                return [4 /*yield*/, dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'out-of-sync-migrations' } }))];
            case 3:
                _f.sent();
                return [3 /*break*/, 10];
            case 4:
                if (!(error === 'out-of-sync-data')) return [3 /*break*/, 9];
                if (!(typeof window.confirm !== 'undefined')) return [3 /*break*/, 7];
                showBackups = window.confirm(message +
                    ' ' +
                    (0, i18next_1.t)('Make sure the app is up-to-date. Do you want to load a backup?'));
                if (!showBackups) return [3 /*break*/, 6];
                return [4 /*yield*/, dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'load-backup', options: {} } }))];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                alert(message + ' ' + (0, i18next_1.t)('Make sure the app is up-to-date.'));
                _f.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                alert(message);
                _f.label = 10;
            case 10: return [3 /*break*/, 14];
            case 11: return [4 /*yield*/, dispatch((0, modalsSlice_1.closeModal)())];
            case 12:
                _f.sent();
                return [4 /*yield*/, dispatch((0, prefsSlice_1.loadPrefs)())];
            case 13:
                _f.sent();
                _f.label = 14;
            case 14: return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 15:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.closeBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/closeBudget"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var prefs;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                prefs = getState().prefs.local;
                if (!(prefs && prefs.id)) return [3 /*break*/, 5];
                return [4 /*yield*/, dispatch((0, appSlice_1.resetApp)())];
            case 1:
                _c.sent();
                return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: (0, i18next_1.t)('Closing...') }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, fetch_1.send)('close-budget')];
            case 3:
                _c.sent();
                return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 4:
                _c.sent();
                if (localStorage.getItem('SharedArrayBufferOverride')) {
                    window.location.reload();
                }
                _c.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.closeBudgetUI = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/closeBudgetUI"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var prefs;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                prefs = getState().prefs.local;
                if (!(prefs && prefs.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, dispatch((0, appSlice_1.resetApp)())];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
exports.deleteBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/deleteBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var id = _c.id, cloudFileId = _c.cloudFileId;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('delete-budget', { id: id, cloudFileId: cloudFileId })];
            case 1:
                _e.sent();
                return [4 /*yield*/, dispatch((0, exports.loadAllFiles)())];
            case 2:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.createBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/createBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var _e = _c.testMode, testMode = _e === void 0 ? false : _e, _f = _c.demoMode, demoMode = _f === void 0 ? false : _f;
    var dispatch = _d.dispatch;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({
                    loadingText: testMode || demoMode ? (0, i18next_1.t)('Making demo...') : (0, i18next_1.t)('Creating budget...'),
                }))];
            case 1:
                _g.sent();
                if (!demoMode) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, fetch_1.send)('create-demo-budget')];
            case 2:
                _g.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, fetch_1.send)('create-budget', { testMode: testMode })];
            case 4:
                _g.sent();
                _g.label = 5;
            case 5: return [4 /*yield*/, dispatch((0, modalsSlice_1.closeModal)())];
            case 6:
                _g.sent();
                return [4 /*yield*/, dispatch((0, exports.loadAllFiles)())];
            case 7:
                _g.sent();
                return [4 /*yield*/, dispatch((0, prefsSlice_1.loadPrefs)())];
            case 8:
                _g.sent();
                // Set the loadingText to null after we've loaded the budget prefs
                // so that the existing manager page doesn't flash
                return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 9:
                // Set the loadingText to null after we've loaded the budget prefs
                // so that the existing manager page doesn't flash
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.duplicateBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/duplicateBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var error_1;
    var id = _c.id, oldName = _c.oldName, newName = _c.newName, managePage = _c.managePage, _e = _c.loadBudget, loadBudget = _e === void 0 ? 'none' : _e, cloudSync = _c.cloudSync;
    var dispatch = _d.dispatch;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (!id) {
                    throw new Error('Unable to duplicate a budget that is not local.');
                }
                _f.label = 1;
            case 1:
                _f.trys.push([1, 7, 8, 10]);
                return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({
                        loadingText: (0, i18next_1.t)('Duplicating: {{oldName}} to: {{newName}}', {
                            oldName: oldName,
                            newName: newName,
                        }),
                    }))];
            case 2:
                _f.sent();
                return [4 /*yield*/, (0, fetch_1.send)('duplicate-budget', {
                        id: id,
                        newName: newName,
                        cloudSync: cloudSync,
                        open: loadBudget,
                    })];
            case 3:
                _f.sent();
                return [4 /*yield*/, dispatch((0, modalsSlice_1.closeModal)())];
            case 4:
                _f.sent();
                if (!managePage) return [3 /*break*/, 6];
                return [4 /*yield*/, dispatch((0, exports.loadAllFiles)())];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6: return [3 /*break*/, 10];
            case 7:
                error_1 = _f.sent();
                console.error('Error duplicating budget:', error_1);
                throw error_1 instanceof Error
                    ? error_1
                    : new Error('Error duplicating budget: ' + String(error_1));
            case 8: return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 9:
                _f.sent();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
exports.importBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/importBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var error;
    var filepath = _c.filepath, type = _c.type;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('import-budget', { filepath: filepath, type: type })];
            case 1:
                error = (_e.sent()).error;
                if (error) {
                    throw new Error(error);
                }
                return [4 /*yield*/, dispatch((0, modalsSlice_1.closeModal)())];
            case 2:
                _e.sent();
                return [4 /*yield*/, dispatch((0, prefsSlice_1.loadPrefs)())];
            case 3:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.uploadBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/uploadBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var error;
    var id = _c.id;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('upload-budget', { id: id })];
            case 1:
                error = (_e.sent()).error;
                if (error) {
                    return [2 /*return*/, { error: error }];
                }
                return [4 /*yield*/, dispatch((0, exports.loadAllFiles)())];
            case 2:
                _e.sent();
                return [2 /*return*/, {}];
        }
    });
}); });
exports.closeAndLoadBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/closeAndLoadBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var fileId = _c.fileId;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, dispatch((0, exports.closeBudget)())];
            case 1:
                _e.sent();
                return [4 /*yield*/, dispatch((0, exports.loadBudget)({ id: fileId }))];
            case 2:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.closeAndDownloadBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/closeAndDownloadBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var cloudFileId = _c.cloudFileId;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, dispatch((0, exports.closeBudget)())];
            case 1:
                _e.sent();
                return [4 /*yield*/, dispatch((0, exports.downloadBudget)({ cloudFileId: cloudFileId, replace: true }))];
            case 2:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.downloadBudget = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/downloadBudget"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var _e, id, error, opts;
    var cloudFileId = _c.cloudFileId, _f = _c.replace, replace = _f === void 0 ? false : _f;
    var dispatch = _d.dispatch;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({
                    loadingText: (0, i18next_1.t)('Downloading...'),
                }))];
            case 1:
                _g.sent();
                return [4 /*yield*/, (0, fetch_1.send)('download-budget', {
                        cloudFileId: cloudFileId,
                    })];
            case 2:
                _e = _g.sent(), id = _e.id, error = _e.error;
                if (!error) return [3 /*break*/, 10];
                if (!(error.reason === 'decrypt-failure')) return [3 /*break*/, 5];
                opts = {
                    hasExistingKey: Boolean(error.meta &&
                        typeof error.meta === 'object' &&
                        'isMissingKey' in error.meta &&
                        error.meta.isMissingKey),
                    cloudFileId: cloudFileId,
                    onSuccess: function () {
                        dispatch((0, exports.downloadBudget)({ cloudFileId: cloudFileId, replace: replace }));
                    },
                };
                return [4 /*yield*/, dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'fix-encryption-key', options: opts } }))];
            case 3:
                _g.sent();
                return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 4:
                _g.sent();
                return [3 /*break*/, 9];
            case 5:
                if (!(error.reason === 'file-exists')) return [3 /*break*/, 7];
                alert((0, i18next_1.t)('A file with id “{{id}}” already exists with the name “{{name}}”. ' +
                    'This file will be replaced. This probably happened because files were manually ' +
                    'moved around outside of Actual.', {
                    id: error.meta &&
                        typeof error.meta === 'object' &&
                        'id' in error.meta &&
                        error.meta.id,
                    name: error.meta &&
                        typeof error.meta === 'object' &&
                        'name' in error.meta &&
                        error.meta.name,
                }));
                return [4 /*yield*/, dispatch((0, exports.downloadBudget)({ cloudFileId: cloudFileId, replace: true })).unwrap()];
            case 6: return [2 /*return*/, _g.sent()];
            case 7: return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 8:
                _g.sent();
                alert((0, errors_1.getDownloadError)(error));
                _g.label = 9;
            case 9: return [2 /*return*/, null];
            case 10:
                if (!id) {
                    throw new Error('No id returned from download.');
                }
                return [4 /*yield*/, Promise.all([
                        dispatch((0, prefsSlice_1.loadGlobalPrefs)()),
                        dispatch((0, exports.loadAllFiles)()),
                        dispatch((0, exports.loadBudget)({ id: id })),
                    ])];
            case 11:
                _g.sent();
                return [4 /*yield*/, dispatch((0, appSlice_1.setAppState)({ loadingText: null }))];
            case 12:
                _g.sent();
                return [2 /*return*/, id];
        }
    });
}); });
// Take in the budget id so that backups can be loaded when a budget isn't opened
exports.loadBackup = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadBackup"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var prefs;
    var budgetId = _c.budgetId, backupId = _c.backupId;
    var dispatch = _d.dispatch, getState = _d.getState;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                prefs = getState().prefs.local;
                if (!(prefs && prefs.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, dispatch((0, exports.closeBudget)())];
            case 1:
                _e.sent();
                _e.label = 2;
            case 2: return [4 /*yield*/, (0, fetch_1.send)('backup-load', { id: budgetId, backupId: backupId })];
            case 3:
                _e.sent();
                return [4 /*yield*/, dispatch((0, exports.loadBudget)({ id: budgetId }))];
            case 4:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.makeBackup = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/makeBackup"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var prefs;
    var getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                prefs = getState().prefs.local;
                if (!(prefs && prefs.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, fetch_1.send)('backup-make', { id: prefs.id })];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
var initialState = {
    budgets: [],
    remoteFiles: null,
    allFiles: null,
};
var budgetfilesSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        setBudgets: function (state, action) {
            state.budgets = action.payload.budgets;
            state.allFiles = reconcileFiles(action.payload.budgets, state.remoteFiles);
        },
        setRemoteFiles: function (state, action) {
            state.remoteFiles = action.payload.remoteFiles;
            state.allFiles = reconcileFiles(state.budgets, action.payload.remoteFiles);
        },
        setAllFiles: function (state, action) {
            state.budgets = action.payload.budgets;
            state.remoteFiles = action.payload.remoteFiles;
            state.allFiles = reconcileFiles(action.payload.budgets, action.payload.remoteFiles);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(usersSlice_1.signOut.fulfilled, function (state) {
            state.allFiles = null;
        });
        builder.addCase(appSlice_1.resetApp, function (state) { return state || initialState; });
    },
});
exports.name = budgetfilesSlice.name, exports.reducer = budgetfilesSlice.reducer, exports.getInitialState = budgetfilesSlice.getInitialState;
exports.actions = __assign(__assign({}, budgetfilesSlice.actions), { loadBudgets: exports.loadBudgets, loadRemoteFiles: exports.loadRemoteFiles, loadAllFiles: exports.loadAllFiles, loadBudget: exports.loadBudget, closeBudget: exports.closeBudget, closeBudgetUI: exports.closeBudgetUI, deleteBudget: exports.deleteBudget, createBudget: exports.createBudget, duplicateBudget: exports.duplicateBudget, importBudget: exports.importBudget, uploadBudget: exports.uploadBudget, closeAndLoadBudget: exports.closeAndLoadBudget, closeAndDownloadBudget: exports.closeAndDownloadBudget, downloadBudget: exports.downloadBudget, loadBackup: exports.loadBackup, makeBackup: exports.makeBackup });
exports.setBudgets = exports.actions.setBudgets, exports.setRemoteFiles = exports.actions.setRemoteFiles, exports.setAllFiles = exports.actions.setAllFiles;
function sortFiles(arr) {
    arr.sort(function (x, y) {
        var name1 = x.name.toLowerCase();
        var name2 = y.name.toLowerCase();
        var i = name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
        if (i === 0) {
            var xId = x.state === 'remote' ? x.cloudFileId : x.id;
            var yId = y.state === 'remote' ? y.cloudFileId : y.id;
            i = xId < yId ? -1 : xId > yId ? 1 : 0;
        }
        return i;
    });
    return arr;
}
// States of a file:
// 1. local - Only local (not uploaded/synced)
// 2. remote - Unavailable locally, available to download
// 3. synced - Downloaded & synced
// 4. detached - Downloaded but broken group id (reset sync state)
// 5. broken - user shouldn't have access to this file
// 6. unknown - user is offline so can't determine the status
function reconcileFiles(localFiles, remoteFiles) {
    var reconciled = new Set();
    var files = localFiles.map(function (localFile) {
        var cloudFileId = localFile.cloudFileId, groupId = localFile.groupId;
        if (cloudFileId && groupId) {
            // This is the case where for some reason getting the files from
            // the server failed. We don't want to scare the user, just show
            // an unknown state and tell them it'll be OK once they come
            // back online
            if (remoteFiles == null) {
                return __assign(__assign({}, localFile), { cloudFileId: cloudFileId, groupId: groupId, deleted: false, state: 'unknown', hasKey: true, owner: '' });
            }
            var remote = remoteFiles.find(function (f) { return localFile.cloudFileId === f.fileId; });
            if (remote) {
                // Mark reconciled
                reconciled.add(remote.fileId);
                if (remote.groupId === localFile.groupId) {
                    return __assign(__assign({}, localFile), { cloudFileId: cloudFileId, groupId: groupId, name: remote.name, deleted: remote.deleted, encryptKeyId: remote.encryptKeyId, hasKey: remote.hasKey, state: 'synced', owner: remote.owner, usersWithAccess: remote.usersWithAccess });
                }
                else {
                    return __assign(__assign({}, localFile), { cloudFileId: cloudFileId, groupId: groupId, name: remote.name, deleted: remote.deleted, encryptKeyId: remote.encryptKeyId, hasKey: remote.hasKey, state: 'detached', owner: remote.owner, usersWithAccess: remote.usersWithAccess });
                }
            }
            else {
                return __assign(__assign({}, localFile), { cloudFileId: cloudFileId, groupId: groupId, deleted: false, state: 'broken', hasKey: true, owner: '' });
            }
        }
        else {
            return __assign(__assign({}, localFile), { deleted: false, state: 'local', hasKey: true });
        }
    });
    var sorted = sortFiles(files
        .concat((remoteFiles || [])
        .filter(function (f) { return !reconciled.has(f.fileId); })
        .map(function (f) {
        return {
            cloudFileId: f.fileId,
            groupId: f.groupId,
            name: f.name,
            deleted: f.deleted,
            encryptKeyId: f.encryptKeyId,
            hasKey: f.hasKey,
            state: 'remote',
            owner: f.owner,
            usersWithAccess: f.usersWithAccess,
        };
    }))
        .filter(function (f) { return !f.deleted; }));
    // One last pass to list all the broken (unauthorized) files at the
    // bottom
    return sorted
        .filter(function (f) { return f.state !== 'broken'; })
        .concat(sorted.filter(function (f) { return f.state === 'broken'; }));
}
