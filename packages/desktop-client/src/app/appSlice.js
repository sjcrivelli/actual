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
exports.setAppState = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.syncAndDownload = exports.getLatestAppVersion = exports.sync = exports.resetSync = exports.updateApp = exports.resetApp = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var fetch_1 = require("loot-core/platform/client/fetch");
var errors_1 = require("loot-core/shared/errors");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
var versions_1 = require("@desktop-client/util/versions");
var sliceName = 'app';
var initialState = {
    loadingText: null,
    updateInfo: null,
    showUpdateNotification: true,
    managerHasInitialized: false,
    versionInfo: null,
};
exports.resetApp = (0, toolkit_1.createAction)("".concat(sliceName, "/resetApp"));
exports.updateApp = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/updateApp"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, global.Actual.applyAppUpdate()];
            case 1:
                _c.sent();
                dispatch((0, exports.setAppState)({ updateInfo: null }));
                return [2 /*return*/];
        }
    });
}); });
exports.resetSync = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/resetSync"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var error;
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('sync-reset')];
            case 1:
                error = (_c.sent()).error;
                if (!error) return [3 /*break*/, 2];
                alert((0, errors_1.getUploadError)(error));
                if ((error.reason === 'encrypt-failure' &&
                    error.meta.isMissingKey) ||
                    error.reason === 'file-has-new-key') {
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'fix-encryption-key',
                            options: {
                                onSuccess: function () {
                                    // TODO: There won't be a loading indicator for this
                                    dispatch((0, exports.resetSync)());
                                },
                            },
                        },
                    }));
                }
                else if (error.reason === 'encrypt-failure') {
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'create-encryption-key',
                            options: { recreate: true },
                        },
                    }));
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, dispatch((0, exports.sync)())];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.sync = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/sync"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var prefs, result;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                prefs = getState().prefs.local;
                if (!(prefs && prefs.id)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, fetch_1.send)('sync')];
            case 1:
                result = _c.sent();
                if (result && 'error' in result) {
                    return [2 /*return*/, { error: result.error }];
                }
                // Update the prefs
                return [4 /*yield*/, dispatch((0, prefsSlice_1.loadPrefs)())];
            case 2:
                // Update the prefs
                _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/, {}];
        }
    });
}); });
exports.getLatestAppVersion = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getLatestAppVersion"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var globalPrefs, theLatestVersion;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                globalPrefs = getState().prefs.global;
                if (!(globalPrefs && globalPrefs.notifyWhenUpdateIsAvailable)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, versions_1.getLatestVersion)()];
            case 1:
                theLatestVersion = _c.sent();
                dispatch((0, exports.setAppState)({
                    versionInfo: {
                        latestVersion: theLatestVersion,
                        isOutdated: (0, versions_1.getIsOutdated)(theLatestVersion),
                    },
                }));
                _c.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
exports.syncAndDownload = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/syncAndDownload"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var syncState, hasDownloaded, syncState_1;
    var accountId = _c.accountId;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, dispatch((0, exports.sync)()).unwrap()];
            case 1:
                syncState = _e.sent();
                if (syncState.error) {
                    return [2 /*return*/, { error: syncState.error }];
                }
                return [4 /*yield*/, dispatch((0, accountsSlice_1.syncAccounts)({ id: accountId })).unwrap()];
            case 2:
                hasDownloaded = _e.sent();
                if (!hasDownloaded) return [3 /*break*/, 4];
                return [4 /*yield*/, dispatch((0, exports.sync)()).unwrap()];
            case 3:
                syncState_1 = _e.sent();
                if (syncState_1.error) {
                    return [2 /*return*/, { error: syncState_1.error }];
                }
                // `hasDownloaded` is already true, we know there has been
                // updates
                return [2 /*return*/, true];
            case 4: return [2 /*return*/, { hasUpdated: hasDownloaded }];
        }
    });
}); });
var appSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        setAppState: function (state, action) {
            return __assign(__assign({}, state), action.payload);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(exports.resetApp, function (state) { return (__assign(__assign({}, initialState), { loadingText: state.loadingText || null, managerHasInitialized: state.managerHasInitialized || false })); });
    },
});
exports.name = appSlice.name, exports.reducer = appSlice.reducer, exports.getInitialState = appSlice.getInitialState;
exports.actions = __assign(__assign({}, appSlice.actions), { resetApp: exports.resetApp, updateApp: exports.updateApp, resetSync: exports.resetSync, sync: exports.sync, syncAndDownload: exports.syncAndDownload, getLatestAppVersion: exports.getLatestAppVersion });
exports.setAppState = exports.actions.setAppState;
