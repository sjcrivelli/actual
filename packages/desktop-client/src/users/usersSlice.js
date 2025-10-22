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
exports.loadUserData = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.signOut = exports.loggedIn = exports.getUserData = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var fetch_1 = require("loot-core/platform/client/fetch");
var appSlice_1 = require("@desktop-client/app/appSlice");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
var sliceName = 'user';
exports.getUserData = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getUserData"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var data;
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('subscribe-get-user')];
            case 1:
                data = _c.sent();
                dispatch((0, exports.loadUserData)({ data: data }));
                return [2 /*return*/, data];
        }
    });
}); });
exports.loggedIn = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/loggedIn"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, dispatch((0, exports.getUserData)())];
            case 1:
                _c.sent();
                // We want to be careful about how we call loadAllFiles. It will
                // turn the files state from null into an array, indicating that
                // we've loaded the files at least once. This first attempt at
                // loading files is important - the manager uses files to decide
                // if it should create a new file automatically (if there are no
                // files). If we call it before we have a properly logged in
                // user, later on it could trigger the codepath which
                // automatically creates a file, but we really haven't loaded
                // their files yet.
                //
                // Since the above comment was written, We let in users even if
                // their account is invalid. So we should list all their files
                // regardless. Previously, we kicked users out to a "need payment
                // info" screen and we didn't want to call this.
                dispatch((0, budgetfilesSlice_1.loadAllFiles)());
                return [2 /*return*/];
        }
    });
}); });
exports.signOut = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/signOut"), function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var dispatch = _b.dispatch;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('subscribe-sign-out')];
            case 1:
                _c.sent();
                dispatch((0, exports.getUserData)());
                dispatch((0, prefsSlice_1.loadGlobalPrefs)());
                dispatch((0, budgetfilesSlice_1.closeBudget)());
                return [2 /*return*/];
        }
    });
}); });
var initialState = {
    data: null,
};
var usersSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        loadUserData: function (state, action) {
            state.data = action.payload.data;
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function (state) { return state || initialState; });
    },
});
exports.name = usersSlice.name, exports.reducer = usersSlice.reducer, exports.getInitialState = usersSlice.getInitialState;
exports.actions = __assign(__assign({}, usersSlice.actions), { getUserData: exports.getUserData, loggedIn: exports.loggedIn, signOut: exports.signOut });
exports.loadUserData = exports.actions.loadUserData;
