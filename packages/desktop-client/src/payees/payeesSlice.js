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
exports.markPayeesDirty = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.getPayeesById = exports.getActivePayees = exports.reloadPayees = exports.getPayees = exports.reloadCommonPayees = exports.getCommonPayees = exports.createPayee = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var i18next_1 = require("i18next");
var memoize_one_1 = require("memoize-one");
var fetch_1 = require("loot-core/platform/client/fetch");
var util_1 = require("loot-core/shared/util");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var appSlice_1 = require("@desktop-client/app/appSlice");
var redux_1 = require("@desktop-client/redux");
var sliceName = 'payees';
var initialState = {
    commonPayees: [],
    isCommonPayeesLoading: false,
    isCommonPayeesLoaded: false,
    isCommonPayeesDirty: false,
    payees: [],
    isPayeesLoading: false,
    isPayeesLoaded: false,
    isPayeesDirty: false,
};
var payeesSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        markPayeesDirty: function (state) {
            _markPayeesDirty(state);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
        builder.addCase(exports.createPayee.fulfilled, _markPayeesDirty);
        builder.addCase(exports.reloadCommonPayees.fulfilled, function (state, action) {
            _loadCommonPayees(state, action.payload);
        });
        builder.addCase(exports.reloadCommonPayees.rejected, function (state) {
            state.isCommonPayeesLoading = false;
        });
        builder.addCase(exports.reloadCommonPayees.pending, function (state) {
            state.isCommonPayeesLoading = true;
        });
        builder.addCase(exports.getCommonPayees.fulfilled, function (state, action) {
            _loadCommonPayees(state, action.payload);
        });
        builder.addCase(exports.getCommonPayees.rejected, function (state) {
            state.isCommonPayeesLoading = false;
        });
        builder.addCase(exports.getCommonPayees.pending, function (state) {
            state.isCommonPayeesLoading = true;
        });
        builder.addCase(exports.reloadPayees.fulfilled, function (state, action) {
            _loadPayees(state, action.payload);
        });
        builder.addCase(exports.reloadPayees.rejected, function (state) {
            state.isPayeesLoading = false;
        });
        builder.addCase(exports.reloadPayees.pending, function (state) {
            state.isPayeesLoading = true;
        });
        builder.addCase(exports.getPayees.fulfilled, function (state, action) {
            _loadPayees(state, action.payload);
        });
        builder.addCase(exports.getPayees.rejected, function (state) {
            state.isPayeesLoading = false;
        });
        builder.addCase(exports.getPayees.pending, function (state) {
            state.isPayeesLoading = true;
        });
    },
});
function translatePayees(payees) {
    var _a;
    return ((_a = payees === null || payees === void 0 ? void 0 : payees.map(function (payee) {
        return payee.name === 'Starting Balance'
            ? __assign(__assign({}, payee), { name: (0, i18next_1.t)('Starting Balance') }) : payee;
    })) !== null && _a !== void 0 ? _a : payees);
}
exports.createPayee = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/createPayee"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id;
    var name = _b.name;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('payee-create', {
                    name: name.trim(),
                })];
            case 1:
                id = _c.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.getCommonPayees = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getCommonPayees"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var payees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('common-payees-get')];
            case 1:
                payees = _a.sent();
                return [2 /*return*/, translatePayees(payees)];
        }
    });
}); }, {
    condition: function (_, _a) {
        var getState = _a.getState;
        var payees = getState().payees;
        return (!payees.isCommonPayeesLoading &&
            (payees.isCommonPayeesDirty || !payees.isCommonPayeesLoaded));
    },
});
exports.reloadCommonPayees = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/reloadCommonPayees"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var payees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('common-payees-get')];
            case 1:
                payees = _a.sent();
                return [2 /*return*/, translatePayees(payees)];
        }
    });
}); });
exports.getPayees = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getPayees"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var payees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('payees-get')];
            case 1:
                payees = _a.sent();
                return [2 /*return*/, translatePayees(payees)];
        }
    });
}); }, {
    condition: function (_, _a) {
        var getState = _a.getState;
        var payees = getState().payees;
        return (!payees.isPayeesLoading &&
            (payees.isPayeesDirty || !payees.isPayeesLoaded));
    },
});
exports.reloadPayees = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/reloadPayees"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var payees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('payees-get')];
            case 1:
                payees = _a.sent();
                return [2 /*return*/, translatePayees(payees)];
        }
    });
}); });
exports.getActivePayees = (0, memoize_one_1.default)(function (payees, accounts) {
    var accountsById = (0, accountsSlice_1.getAccountsById)(accounts);
    return translatePayees(payees.filter(function (payee) {
        if (payee.transfer_acct) {
            var account = accountsById[payee.transfer_acct];
            return account != null && !account.closed;
        }
        return true;
    }));
});
exports.getPayeesById = (0, memoize_one_1.default)(function (payees) {
    return (0, util_1.groupById)(translatePayees(payees));
});
exports.name = payeesSlice.name, exports.reducer = payeesSlice.reducer, exports.getInitialState = payeesSlice.getInitialState;
exports.actions = __assign(__assign({}, payeesSlice.actions), { createPayee: exports.createPayee, getCommonPayees: exports.getCommonPayees, reloadCommonPayees: exports.reloadCommonPayees, getPayees: exports.getPayees, reloadPayees: exports.reloadPayees });
exports.markPayeesDirty = payeesSlice.actions.markPayeesDirty;
function _loadCommonPayees(state, commonPayees) {
    state.commonPayees = translatePayees(commonPayees);
    state.isCommonPayeesLoading = false;
    state.isCommonPayeesLoaded = true;
    state.isCommonPayeesDirty = false;
}
function _loadPayees(state, payees) {
    state.payees = translatePayees(payees);
    state.isPayeesLoading = false;
    state.isPayeesLoaded = true;
    state.isPayeesDirty = false;
}
function _markPayeesDirty(state) {
    state.isCommonPayeesDirty = true;
    state.isPayeesDirty = true;
}
