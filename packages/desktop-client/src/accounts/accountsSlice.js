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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccountsSyncing = exports.markUpdatedAccounts = exports.markAccountsDirty = exports.markAccountSuccess = exports.markAccountFailed = exports.markAccountRead = exports.actions = exports.getInitialState = exports.reducer = exports.name = exports.getAccountsById = exports.importTransactions = exports.importPreviewTransactions = exports.moveAccount = exports.syncAccounts = exports.linkAccountPluggyAi = exports.linkAccountSimpleFin = exports.linkAccount = exports.unlinkAccount = exports.reloadAccounts = exports.getAccounts = exports.updateAccount = exports.reopenAccount = exports.closeAccount = exports.createAccount = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var memoize_one_1 = require("memoize-one");
var fetch_1 = require("loot-core/platform/client/fetch");
var util_1 = require("loot-core/shared/util");
var appSlice_1 = require("@desktop-client/app/appSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
var transactionsSlice_1 = require("@desktop-client/transactions/transactionsSlice");
var sliceName = 'account';
var initialState = {
    failedAccounts: {},
    accountsSyncing: [],
    updatedAccounts: [],
    accounts: [],
    isAccountsLoading: false,
    isAccountsLoaded: false,
    isAccountsDirty: false,
};
var accountsSlice = (0, toolkit_1.createSlice)({
    name: sliceName,
    initialState: initialState,
    reducers: {
        setAccountsSyncing: function (state, action) {
            state.accountsSyncing = action.payload.ids;
        },
        markAccountFailed: function (state, action) {
            state.failedAccounts[action.payload.id] = {
                type: action.payload.errorType,
                code: action.payload.errorCode,
            };
        },
        markAccountSuccess: function (state, action) {
            delete state.failedAccounts[action.payload.id];
        },
        markUpdatedAccounts: function (state, action) {
            state.updatedAccounts = action.payload.ids
                ? __spreadArray(__spreadArray([], state.updatedAccounts, true), action.payload.ids, true) : state.updatedAccounts;
        },
        markAccountRead: function (state, action) {
            state.updatedAccounts = state.updatedAccounts.filter(function (id) { return id !== action.payload.id; });
        },
        markAccountsDirty: function (state) {
            _markAccountsDirty(state);
        },
    },
    extraReducers: function (builder) {
        builder.addCase(appSlice_1.resetApp, function () { return initialState; });
        builder.addCase(exports.createAccount.fulfilled, _markAccountsDirty);
        builder.addCase(exports.updateAccount.fulfilled, _markAccountsDirty);
        builder.addCase(exports.closeAccount.fulfilled, _markAccountsDirty);
        builder.addCase(exports.reopenAccount.fulfilled, _markAccountsDirty);
        builder.addCase(exports.reloadAccounts.fulfilled, function (state, action) {
            _loadAccounts(state, action.payload);
        });
        builder.addCase(exports.reloadAccounts.rejected, function (state) {
            state.isAccountsLoading = false;
        });
        builder.addCase(exports.reloadAccounts.pending, function (state) {
            state.isAccountsLoading = true;
        });
        builder.addCase(exports.getAccounts.fulfilled, function (state, action) {
            _loadAccounts(state, action.payload);
        });
        builder.addCase(exports.getAccounts.rejected, function (state) {
            state.isAccountsLoading = false;
        });
        builder.addCase(exports.getAccounts.pending, function (state) {
            state.isAccountsLoading = true;
        });
    },
});
exports.createAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/createAccount"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id;
    var name = _b.name, balance = _b.balance, offBudget = _b.offBudget;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-create', {
                    name: name,
                    balance: balance,
                    offBudget: offBudget,
                })];
            case 1:
                id = _c.sent();
                return [2 /*return*/, id];
        }
    });
}); });
exports.closeAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/closeAccount"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id = _b.id, transferAccountId = _b.transferAccountId, categoryId = _b.categoryId, forced = _b.forced;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-close', {
                    id: id,
                    transferAccountId: transferAccountId || undefined,
                    categoryId: categoryId || undefined,
                    forced: forced,
                })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.reopenAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/reopenAccount"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var id = _b.id;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-reopen', { id: id })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.updateAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/updateAccount"), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var account = _b.account;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-update', account)];
            case 1:
                _c.sent();
                return [2 /*return*/, account];
        }
    });
}); });
exports.getAccounts = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/getAccounts"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var accounts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('accounts-get')];
            case 1:
                accounts = (_a.sent());
                return [2 /*return*/, accounts];
        }
    });
}); }, {
    condition: function (_, _a) {
        var getState = _a.getState;
        var account = getState().account;
        return (!account.isAccountsLoading &&
            (account.isAccountsDirty || !account.isAccountsLoaded));
    },
});
exports.reloadAccounts = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/reloadAccounts"), function () { return __awaiter(void 0, void 0, void 0, function () {
    var accounts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('accounts-get')];
            case 1:
                accounts = (_a.sent());
                return [2 /*return*/, accounts];
        }
    });
}); });
exports.unlinkAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/unlinkAccount"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var id = _c.id;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-unlink', { id: id })];
            case 1:
                _e.sent();
                dispatch(exports.actions.markAccountSuccess({ id: id }));
                dispatch(exports.actions.markAccountsDirty());
                return [2 /*return*/];
        }
    });
}); });
exports.linkAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/linkAccount"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var requisitionId = _c.requisitionId, account = _c.account, upgradingId = _c.upgradingId, offBudget = _c.offBudget;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('gocardless-accounts-link', {
                    requisitionId: requisitionId,
                    account: account,
                    upgradingId: upgradingId,
                    offBudget: offBudget,
                })];
            case 1:
                _e.sent();
                dispatch((0, payeesSlice_1.markPayeesDirty)());
                dispatch((0, exports.markAccountsDirty)());
                return [2 /*return*/];
        }
    });
}); });
exports.linkAccountSimpleFin = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/linkAccountSimpleFin"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var externalAccount = _c.externalAccount, upgradingId = _c.upgradingId, offBudget = _c.offBudget;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('simplefin-accounts-link', {
                    externalAccount: externalAccount,
                    upgradingId: upgradingId,
                    offBudget: offBudget,
                })];
            case 1:
                _e.sent();
                dispatch((0, payeesSlice_1.markPayeesDirty)());
                dispatch((0, exports.markAccountsDirty)());
                return [2 /*return*/];
        }
    });
}); });
exports.linkAccountPluggyAi = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/linkAccountPluggyAi"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var externalAccount = _c.externalAccount, upgradingId = _c.upgradingId, offBudget = _c.offBudget;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('pluggyai-accounts-link', {
                    externalAccount: externalAccount,
                    upgradingId: upgradingId,
                    offBudget: offBudget,
                })];
            case 1:
                _e.sent();
                dispatch((0, payeesSlice_1.markPayeesDirty)());
                dispatch((0, exports.markAccountsDirty)());
                return [2 /*return*/];
        }
    });
}); });
function handleSyncResponse(accountId, res, dispatch, resNewTransactions, resMatchedTransactions, resUpdatedAccounts) {
    var errors = res.errors, newTransactions = res.newTransactions, matchedTransactions = res.matchedTransactions, updatedAccounts = res.updatedAccounts;
    var _a = accountsSlice.actions, markAccountFailed = _a.markAccountFailed, markAccountSuccess = _a.markAccountSuccess;
    // Mark the account as failed or succeeded (depending on sync output)
    var error = errors[0];
    if (error) {
        // We only want to mark the account as having problem if it
        // was a real syncing error.
        if ('type' in error && error.type === 'SyncError') {
            dispatch(markAccountFailed({
                id: accountId,
                errorType: error.category,
                errorCode: error.code,
            }));
        }
    }
    else {
        dispatch(markAccountSuccess({ id: accountId }));
    }
    // Dispatch errors (if any)
    errors.forEach(function (error) {
        if ('type' in error && error.type === 'SyncError') {
            dispatch((0, notificationsSlice_1.addNotification)({
                notification: {
                    type: 'error',
                    message: error.message,
                },
            }));
        }
        else {
            dispatch((0, notificationsSlice_1.addNotification)({
                notification: {
                    type: 'error',
                    message: error.message,
                    internal: 'internal' in error ? error.internal : undefined,
                },
            }));
        }
    });
    resNewTransactions.push.apply(resNewTransactions, newTransactions);
    resMatchedTransactions.push.apply(resMatchedTransactions, matchedTransactions);
    resUpdatedAccounts.push.apply(resUpdatedAccounts, updatedAccounts);
    dispatch((0, exports.markAccountsDirty)());
    return newTransactions.length > 0 || matchedTransactions.length > 0;
}
exports.syncAccounts = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/syncAccounts"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var accountsState, setAccountsSyncing, accounts, accountIdsToSync, targetOffbudget_1, accountsData, simpleFinAccounts, isSyncSuccess, newTransactions, matchedTransactions, updatedAccounts, res, _i, res_1, account, success, idx, accountId, res, success;
    var id = _c.id;
    var dispatch = _d.dispatch, getState = _d.getState;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                accountsState = getState().account;
                if (accountsState.accountsSyncing.length > 0) {
                    return [2 /*return*/, false];
                }
                setAccountsSyncing = accountsSlice.actions.setAccountsSyncing;
                if (id === 'uncategorized') {
                    // Sync no accounts
                    dispatch(setAccountsSyncing({ ids: [] }));
                    return [2 /*return*/, false];
                }
                accounts = getState().account.accounts;
                if (id === 'offbudget' || id === 'onbudget') {
                    targetOffbudget_1 = id === 'offbudget' ? 1 : 0;
                    accountIdsToSync = accounts
                        .filter(function (_a) {
                        var bank = _a.bank, closed = _a.closed, tombstone = _a.tombstone, offbudget = _a.offbudget;
                        return !!bank && !closed && !tombstone && offbudget === targetOffbudget_1;
                    })
                        .sort(function (a, b) { return a.sort_order - b.sort_order; })
                        .map(function (_a) {
                        var id = _a.id;
                        return id;
                    });
                }
                else if (id) {
                    accountIdsToSync = [id];
                }
                else {
                    // Default: all accounts
                    accountIdsToSync = accounts
                        .filter(function (_a) {
                        var bank = _a.bank, closed = _a.closed, tombstone = _a.tombstone;
                        return !!bank && !closed && !tombstone;
                    })
                        .sort(function (a, b) {
                        return a.offbudget === b.offbudget
                            ? a.sort_order - b.sort_order
                            : a.offbudget - b.offbudget;
                    })
                        .map(function (_a) {
                        var id = _a.id;
                        return id;
                    });
                }
                dispatch(setAccountsSyncing({ ids: accountIdsToSync }));
                return [4 /*yield*/, (0, fetch_1.send)('accounts-get')];
            case 1:
                accountsData = (_e.sent());
                simpleFinAccounts = accountsData.filter(function (a) {
                    return a.account_sync_source === 'simpleFin' &&
                        accountIdsToSync.includes(a.id);
                });
                isSyncSuccess = false;
                newTransactions = [];
                matchedTransactions = [];
                updatedAccounts = [];
                if (!(simpleFinAccounts.length > 0)) return [3 /*break*/, 3];
                console.log('Using SimpleFin batch sync');
                return [4 /*yield*/, (0, fetch_1.send)('simplefin-batch-sync', {
                        ids: simpleFinAccounts.map(function (a) { return a.id; }),
                    })];
            case 2:
                res = _e.sent();
                for (_i = 0, res_1 = res; _i < res_1.length; _i++) {
                    account = res_1[_i];
                    success = handleSyncResponse(account.accountId, account.res, dispatch, newTransactions, matchedTransactions, updatedAccounts);
                    if (success)
                        isSyncSuccess = true;
                }
                accountIdsToSync = accountIdsToSync.filter(function (id) { return !simpleFinAccounts.find(function (sfa) { return sfa.id === id; }); });
                _e.label = 3;
            case 3:
                idx = 0;
                _e.label = 4;
            case 4:
                if (!(idx < accountIdsToSync.length)) return [3 /*break*/, 7];
                accountId = accountIdsToSync[idx];
                return [4 /*yield*/, (0, fetch_1.send)('accounts-bank-sync', {
                        ids: [accountId],
                    })];
            case 5:
                res = _e.sent();
                success = handleSyncResponse(accountId, res, dispatch, newTransactions, matchedTransactions, updatedAccounts);
                if (success)
                    isSyncSuccess = true;
                // Dispatch the ids for the accounts that are yet to be synced
                dispatch(setAccountsSyncing({ ids: accountIdsToSync.slice(idx + 1) }));
                _e.label = 6;
            case 6:
                idx++;
                return [3 /*break*/, 4];
            case 7:
                // Set new transactions
                dispatch((0, transactionsSlice_1.setNewTransactions)({
                    newTransactions: newTransactions,
                    matchedTransactions: matchedTransactions,
                }));
                dispatch((0, exports.markUpdatedAccounts)({ ids: updatedAccounts }));
                // Reset the sync state back to empty (fallback in case something breaks
                // in the logic above)
                dispatch(setAccountsSyncing({ ids: [] }));
                return [2 /*return*/, isSyncSuccess];
        }
    });
}); });
exports.moveAccount = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/moveAccount"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var id = _c.id, targetId = _c.targetId;
    var dispatch = _d.dispatch;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('account-move', { id: id, targetId: targetId })];
            case 1:
                _e.sent();
                dispatch((0, exports.markAccountsDirty)());
                dispatch((0, payeesSlice_1.markPayeesDirty)());
                return [2 /*return*/];
        }
    });
}); });
exports.importPreviewTransactions = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/importPreviewTransactions"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var _e, _f, errors, updatedPreview;
    var accountId = _c.accountId, transactions = _c.transactions;
    var dispatch = _d.dispatch;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-import', {
                    accountId: accountId,
                    transactions: transactions,
                    isPreview: true,
                })];
            case 1:
                _e = _g.sent(), _f = _e.errors, errors = _f === void 0 ? [] : _f, updatedPreview = _e.updatedPreview;
                errors.forEach(function (error) {
                    dispatch((0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'error',
                            message: error.message,
                        },
                    }));
                });
                return [2 /*return*/, updatedPreview];
        }
    });
}); });
exports.importTransactions = (0, redux_1.createAppAsyncThunk)("".concat(sliceName, "/importTransactions"), function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var _e, _f, errors, added, updated;
    var accountId = _c.accountId, transactions = _c.transactions, reconcile = _c.reconcile;
    var dispatch = _d.dispatch;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (!!reconcile) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, fetch_1.send)('api/transactions-add', {
                        accountId: accountId,
                        transactions: transactions,
                    })];
            case 1:
                _g.sent();
                return [2 /*return*/, true];
            case 2: return [4 /*yield*/, (0, fetch_1.send)('transactions-import', {
                    accountId: accountId,
                    transactions: transactions,
                    isPreview: false,
                })];
            case 3:
                _e = _g.sent(), _f = _e.errors, errors = _f === void 0 ? [] : _f, added = _e.added, updated = _e.updated;
                errors.forEach(function (error) {
                    dispatch((0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'error',
                            message: error.message,
                        },
                    }));
                });
                dispatch((0, transactionsSlice_1.setNewTransactions)({
                    newTransactions: added,
                    matchedTransactions: updated,
                }));
                dispatch((0, exports.markUpdatedAccounts)({
                    ids: added.length > 0 ? [accountId] : [],
                }));
                return [2 /*return*/, added.length > 0 || updated.length > 0];
        }
    });
}); });
exports.getAccountsById = (0, memoize_one_1.default)(function (accounts) { return (0, util_1.groupById)(accounts); });
exports.name = accountsSlice.name, exports.reducer = accountsSlice.reducer, exports.getInitialState = accountsSlice.getInitialState;
exports.actions = __assign(__assign({}, accountsSlice.actions), { createAccount: exports.createAccount, updateAccount: exports.updateAccount, getAccounts: exports.getAccounts, reloadAccounts: exports.reloadAccounts, closeAccount: exports.closeAccount, reopenAccount: exports.reopenAccount, linkAccount: exports.linkAccount, linkAccountSimpleFin: exports.linkAccountSimpleFin, linkAccountPluggyAi: exports.linkAccountPluggyAi, moveAccount: exports.moveAccount, unlinkAccount: exports.unlinkAccount, syncAccounts: exports.syncAccounts });
exports.markAccountRead = (_a = accountsSlice.actions, _a.markAccountRead), exports.markAccountFailed = _a.markAccountFailed, exports.markAccountSuccess = _a.markAccountSuccess, exports.markAccountsDirty = _a.markAccountsDirty, exports.markUpdatedAccounts = _a.markUpdatedAccounts, exports.setAccountsSyncing = _a.setAccountsSyncing;
function _loadAccounts(state, accounts) {
    state.accounts = accounts;
    state.isAccountsLoading = false;
    state.isAccountsLoaded = true;
    state.isAccountsDirty = false;
}
function _markAccountsDirty(state) {
    state.isAccountsDirty = true;
}
