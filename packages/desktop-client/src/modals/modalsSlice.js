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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceModal = exports.popModal = exports.collapseModals = exports.closeModal = exports.pushModal = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.openAccountCloseModal = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var fetch_1 = require("loot-core/platform/client/fetch");
var appSlice_1 = require("@desktop-client/app/appSlice");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
var sliceName = 'modals';
exports.openAccountCloseModal = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/openAccountCloseModal"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var _e, balance, numTransactions, account;
    var accountId = _c.accountId;
    var dispatch = _d.dispatch, getState = _d.getState;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-properties', {
                    id: accountId,
                })];
            case 1:
                _e = _f.sent(), balance = _e.balance, numTransactions = _e.numTransactions;
                account = getState().account.accounts.find(function (acct) { return acct.id === accountId; });
                if (!account) {
                    throw new Error("Account with ID ".concat(accountId, " does not exist."));
                }
                dispatch((0, exports.pushModal)({
                    modal: {
                        name: 'close-account',
                        options: {
                            account: account,
                            balance: balance,
                            canDelete: numTransactions === 0,
                        },
                    },
                }));
                return [2 /*return*/];
        }
    });
}); });
var initialState = {
    modalStack: [],
    isHidden: false,
};
var modalsSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        pushModal: function (state, action) {
            var modal = action.payload.modal;
            // special case: don't show the keyboard shortcuts modal if there's already a modal open
            if (modal.name.endsWith('keyboard-shortcuts') &&
                (state.modalStack.length > 0 ||
                    window.document.querySelector('div[data-testid="filters-menu-tooltip"]') !== null)) {
                return state;
            }
            state.modalStack = __spreadArray(__spreadArray([], state.modalStack, true), [modal], false);
        },
        replaceModal: function (state, action) {
            var modal = action.payload.modal;
            state.modalStack = [modal];
        },
        popModal: function (state) {
            state.modalStack = state.modalStack.slice(0, -1);
        },
        closeModal: function (state) {
            state.modalStack = [];
        },
        collapseModals: function (state, action) {
            var idx = state.modalStack.findIndex(function (m) { return m.name === action.payload.rootModalName; });
            state.modalStack =
                idx < 0 ? state.modalStack : state.modalStack.slice(0, idx);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.setAppState, function (state, action) {
            state.isHidden = action.payload.loadingText !== null;
        });
        builder.addCase(usersSlice_1.signOut.fulfilled, function () { return initialState; });
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
    },
});
exports.name = modalsSlice.name, exports.reducer = modalsSlice.reducer, exports.getInitialState = modalsSlice.getInitialState;
exports.actions = __assign(__assign({}, modalsSlice.actions), { openAccountCloseModal: exports.openAccountCloseModal });
exports.pushModal = exports.actions.pushModal, exports.closeModal = exports.actions.closeModal, exports.collapseModals = exports.actions.collapseModals, exports.popModal = exports.actions.popModal, exports.replaceModal = exports.actions.replaceModal;
