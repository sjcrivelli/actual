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
exports.setPrefs = exports.mergeSyncedPrefs = exports.mergeLocalPrefs = exports.mergeGlobalPrefs = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.saveSyncedPrefs = exports.saveGlobalPrefs = exports.loadGlobalPrefs = exports.savePrefs = exports.loadPrefs = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var fetch_1 = require("loot-core/platform/client/fetch");
var util_1 = require("loot-core/shared/util");
var appSlice_1 = require("@desktop-client/app/appSlice");
var i18n_1 = require("@desktop-client/i18n");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
var sliceName = 'prefs';
var initialState = {
    local: {},
    global: {},
    synced: {},
};
exports.loadPrefs = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadPrefs"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var prefs, currentPrefs, _c, globalPrefs, syncedPrefs;
    var _d;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('load-prefs')];
            case 1:
                prefs = _e.sent();
                currentPrefs = getState().prefs.local;
                if (prefs && prefs.id && !currentPrefs) {
                    dispatch((0, modalsSlice_1.closeModal)());
                }
                return [4 /*yield*/, Promise.all([
                        (0, fetch_1.send)('load-global-prefs'),
                        (0, fetch_1.send)('preferences/get'),
                    ])];
            case 2:
                _c = _e.sent(), globalPrefs = _c[0], syncedPrefs = _c[1];
                dispatch((0, exports.setPrefs)({ local: prefs, global: globalPrefs, synced: syncedPrefs }));
                // Certain loot-core utils depend on state outside of the React tree, update them
                (0, util_1.setNumberFormat)((0, util_1.parseNumberFormat)({
                    format: syncedPrefs.numberFormat,
                    hideFraction: syncedPrefs.hideFraction,
                }));
                // We need to load translations before the app renders
                (0, i18n_1.setI18NextLanguage)((_d = globalPrefs.language) !== null && _d !== void 0 ? _d : '');
                return [2 /*return*/, prefs];
        }
    });
}); });
exports.savePrefs = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/savePrefs"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var prefs = _c.prefs;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('save-prefs', prefs)];
            case 1:
                _e.sent();
                dispatch((0, exports.mergeLocalPrefs)(prefs));
                return [2 /*return*/];
        }
    });
}); });
exports.loadGlobalPrefs = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loadGlobalPrefs"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var globalPrefs;
    var dispatch = _b.dispatch, getState = _b.getState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('load-global-prefs')];
            case 1:
                globalPrefs = _c.sent();
                dispatch((0, exports.setPrefs)({
                    local: getState().prefs.local,
                    global: globalPrefs,
                    synced: getState().prefs.synced,
                }));
                return [2 /*return*/, globalPrefs];
        }
    });
}); });
exports.saveGlobalPrefs = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/saveGlobalPrefs"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var prefs = _c.prefs, onSaveGlobalPrefs = _c.onSaveGlobalPrefs;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('save-global-prefs', prefs)];
            case 1:
                _e.sent();
                dispatch((0, exports.mergeGlobalPrefs)(prefs));
                onSaveGlobalPrefs === null || onSaveGlobalPrefs === void 0 ? void 0 : onSaveGlobalPrefs();
                return [2 /*return*/];
        }
    });
}); });
exports.saveSyncedPrefs = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/saveSyncedPrefs"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var prefs = _c.prefs, isGlobal = _c.isGlobal;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, Promise.all(Object.entries(prefs).map(function (_a) {
                    var prefName = _a[0], value = _a[1];
                    return (0, fetch_1.send)('preferences/save', {
                        id: prefName,
                        value: value,
                        isGlobal: isGlobal,
                    });
                }))];
            case 1:
                _e.sent();
                dispatch((0, exports.mergeSyncedPrefs)(prefs));
                return [2 /*return*/];
        }
    });
}); });
var prefsSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        setPrefs: function (state, action) {
            state.local = action.payload.local;
            state.global = action.payload.global;
            state.synced = action.payload.synced;
        },
        mergeLocalPrefs: function (state, action) {
            state.local = __assign(__assign({}, state.local), action.payload);
        },
        mergeGlobalPrefs: function (state, action) {
            state.global = __assign(__assign({}, state.global), action.payload);
        },
        mergeSyncedPrefs: function (state, action) {
            state.synced = __assign(__assign({}, state.synced), action.payload);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function (state) { return (__assign(__assign({}, initialState), { global: state.global || initialState.global })); });
    },
});
exports.name = prefsSlice.name, exports.reducer = prefsSlice.reducer, exports.getInitialState = prefsSlice.getInitialState;
exports.actions = __assign(__assign({}, prefsSlice.actions), { loadPrefs: exports.loadPrefs, savePrefs: exports.savePrefs, loadGlobalPrefs: exports.loadGlobalPrefs, saveGlobalPrefs: exports.saveGlobalPrefs, saveSyncedPrefs: exports.saveSyncedPrefs });
exports.mergeGlobalPrefs = exports.actions.mergeGlobalPrefs, exports.mergeLocalPrefs = exports.actions.mergeLocalPrefs, exports.mergeSyncedPrefs = exports.actions.mergeSyncedPrefs, exports.setPrefs = exports.actions.setPrefs;
