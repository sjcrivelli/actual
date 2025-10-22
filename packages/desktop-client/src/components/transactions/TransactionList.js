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
exports.TransactionList = TransactionList;
// @ts-strict-ignore
// TODO: remove strict
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var fetch_1 = require("loot-core/platform/client/fetch");
var transactions_1 = require("loot-core/shared/transactions");
var util_1 = require("loot-core/shared/util");
var TransactionsTable_1 = require("./TransactionsTable");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
// When data changes, there are two ways to update the UI:
//
// * Optimistic updates: we apply the needed updates to local data
//   and rerender immediately, and send off the changes to the
//   server. Currently, it assumes the server request is successful.
//   If it fails the user will see a generic error which isn't
//   great, but since the server is local a failure is very
//   unlikely. Still, we should notify errors better.
//
// * A full refetch and rerender: this is needed when applying
//   updates locally is too complex. Usually this happens when
//   changing a field that data is sorted on: we're not going
//   to resort the data in memory, we want to rely on the database
//   for that. So we need to do a full refresh.
//
// When writing updates, it's up to you to decide which one to do.
// Optimistic updates feel snappy, but they might show data
// differently than a full refresh. It's up to you to decide which
// one to use when doing updates.
function saveDiff(diff, learnCategories) {
    return __awaiter(this, void 0, void 0, function () {
        var remoteUpdates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', __assign(__assign({}, diff), { learnCategories: learnCategories }))];
                case 1:
                    remoteUpdates = _a.sent();
                    if (remoteUpdates && remoteUpdates.updated.length > 0) {
                        return [2 /*return*/, { updates: remoteUpdates }];
                    }
                    return [2 /*return*/, {}];
            }
        });
    });
}
function saveDiffAndApply(diff, changes, onChange, learnCategories) {
    return __awaiter(this, void 0, void 0, function () {
        var remoteDiff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saveDiff(diff, learnCategories)];
                case 1:
                    remoteDiff = _a.sent();
                    onChange(
                    // TODO:
                    // @ts-ignore testing
                    (0, transactions_1.applyTransactionDiff)(changes.newTransaction, remoteDiff), 
                    // @ts-ignore testing
                    (0, util_1.applyChanges)(remoteDiff, changes.data));
                    return [2 /*return*/];
            }
        });
    });
}
function TransactionList(_a) {
    var _this = this;
    var tableRef = _a.tableRef, transactions = _a.transactions, allTransactions = _a.allTransactions, loadMoreTransactions = _a.loadMoreTransactions, account = _a.account, accounts = _a.accounts, category = _a.category, categoryGroups = _a.categoryGroups, payees = _a.payees, balances = _a.balances, showBalances = _a.showBalances, showReconciled = _a.showReconciled, showCleared = _a.showCleared, showAccount = _a.showAccount, isAdding = _a.isAdding, isNew = _a.isNew, isMatched = _a.isMatched, dateFormat = _a.dateFormat, hideFraction = _a.hideFraction, renderEmpty = _a.renderEmpty, onSort = _a.onSort, sortField = _a.sortField, ascDesc = _a.ascDesc, onChange = _a.onChange, onRefetch = _a.onRefetch, onCloseAddTransaction = _a.onCloseAddTransaction, onCreatePayee = _a.onCreatePayee, onApplyFilter = _a.onApplyFilter, _b = _a.showSelection, showSelection = _b === void 0 ? true : _b, _c = _a.allowSplitTransaction, allowSplitTransaction = _c === void 0 ? true : _c, onBatchDelete = _a.onBatchDelete, onBatchDuplicate = _a.onBatchDuplicate, onBatchLinkSchedule = _a.onBatchLinkSchedule, onBatchUnlinkSchedule = _a.onBatchUnlinkSchedule, onCreateRule = _a.onCreateRule, onScheduleAction = _a.onScheduleAction, onMakeAsNonSplitTransactions = _a.onMakeAsNonSplitTransactions;
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var _d = (0, useSyncedPref_1.useSyncedPref)('learn-categories')[0], learnCategories = _d === void 0 ? 'true' : _d;
    var isLearnCategoriesEnabled = String(learnCategories) === 'true';
    var transactionsLatest = (0, react_1.useRef)([]);
    (0, react_1.useLayoutEffect)(function () {
        transactionsLatest.current = transactions;
    }, [transactions]);
    var onAdd = (0, react_1.useCallback)(function (newTransactions) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newTransactions = (0, transactions_1.realizeTempTransactions)(newTransactions);
                    return [4 /*yield*/, saveDiff({ added: newTransactions }, isLearnCategoriesEnabled)];
                case 1:
                    _a.sent();
                    onRefetch();
                    return [2 /*return*/];
            }
        });
    }); }, [isLearnCategoriesEnabled, onRefetch]);
    var onSave = (0, react_1.useCallback)(function (transaction) { return __awaiter(_this, void 0, void 0, function () {
        var changes, dateChanged;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changes = (0, transactions_1.updateTransaction)(transactionsLatest.current, transaction);
                    transactionsLatest.current = changes.data;
                    if (!(changes.diff.updated.length > 0)) return [3 /*break*/, 3];
                    dateChanged = !!changes.diff.updated[0].date;
                    if (!dateChanged) return [3 /*break*/, 2];
                    // Make sure it stays at the top of the list of transactions
                    // for that date
                    changes.diff.updated[0].sort_order = Date.now();
                    return [4 /*yield*/, saveDiff(changes.diff, isLearnCategoriesEnabled)];
                case 1:
                    _a.sent();
                    onRefetch();
                    return [3 /*break*/, 3];
                case 2:
                    onChange(changes.newTransaction, changes.data);
                    saveDiffAndApply(changes.diff, changes, onChange, isLearnCategoriesEnabled);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [isLearnCategoriesEnabled, onChange, onRefetch]);
    var onAddSplit = (0, react_1.useCallback)(function (id) {
        var changes = (0, transactions_1.addSplitTransaction)(transactionsLatest.current, id);
        onChange(changes.newTransaction, changes.data);
        saveDiffAndApply(changes.diff, changes, onChange, isLearnCategoriesEnabled);
        return changes.diff.added[0].id;
    }, [isLearnCategoriesEnabled, onChange]);
    var onSplit = (0, react_1.useCallback)(function (id) {
        var changes = (0, transactions_1.splitTransaction)(transactionsLatest.current, id);
        onChange(changes.newTransaction, changes.data);
        saveDiffAndApply(changes.diff, changes, onChange, isLearnCategoriesEnabled);
        return changes.diff.added[0].id;
    }, [isLearnCategoriesEnabled, onChange]);
    var onApplyRules = (0, react_1.useCallback)(function (transaction_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([transaction_1], args_1, true), void 0, function (transaction, updatedFieldName) {
            var afterRules, diff, newTransaction;
            if (updatedFieldName === void 0) { updatedFieldName = null; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('rules-run', { transaction: transaction })];
                    case 1:
                        afterRules = _a.sent();
                        diff = (0, util_1.getChangedValues)(transaction, afterRules);
                        newTransaction = __assign({}, transaction);
                        if (diff) {
                            Object.keys(diff).forEach(function (field) {
                                if (newTransaction[field] == null ||
                                    newTransaction[field] === '' ||
                                    newTransaction[field] === 0 ||
                                    newTransaction[field] === false) {
                                    newTransaction[field] = diff[field];
                                }
                            });
                            // When a rule updates a parent transaction, overwrite all changes to the current field in subtransactions.
                            if (transaction.is_parent &&
                                diff.subtransactions !== undefined &&
                                updatedFieldName !== null) {
                                newTransaction.subtransactions = diff.subtransactions.map(function (st, idx) {
                                    var _a;
                                    var _b;
                                    return (__assign(__assign({}, (((_b = newTransaction.subtransactions) === null || _b === void 0 ? void 0 : _b[idx]) || st)), (st[updatedFieldName] != null && (_a = {},
                                        _a[updatedFieldName] = st[updatedFieldName],
                                        _a))));
                                });
                            }
                        }
                        return [2 /*return*/, newTransaction];
                }
            });
        });
    }, []);
    var onManagePayees = (0, react_1.useCallback)(function (id) {
        navigate('/payees', id ? { state: { selectedPayee: id } } : undefined);
    }, [navigate]);
    var onNavigateToTransferAccount = (0, react_1.useCallback)(function (accountId) {
        navigate("/accounts/".concat(accountId));
    }, [navigate]);
    var onNavigateToSchedule = (0, react_1.useCallback)(function (scheduleId) {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: { name: 'schedule-edit', options: { id: scheduleId } },
        }));
    }, [dispatch]);
    var onNotesTagClick = (0, react_1.useCallback)(function (tag) {
        onApplyFilter({
            field: 'notes',
            op: 'hasTags',
            value: tag,
            type: 'string',
        });
    }, [onApplyFilter]);
    return (<TransactionsTable_1.TransactionTable ref={tableRef} transactions={allTransactions} loadMoreTransactions={loadMoreTransactions} accounts={accounts} categoryGroups={categoryGroups} payees={payees} balances={balances} showBalances={showBalances} showReconciled={showReconciled} showCleared={showCleared} showAccount={showAccount} showCategory={true} currentAccountId={account && account.id} currentCategoryId={category && category.id} isAdding={isAdding} isNew={isNew} isMatched={isMatched} dateFormat={dateFormat} hideFraction={hideFraction} renderEmpty={renderEmpty} onSave={onSave} onApplyRules={onApplyRules} onSplit={onSplit} onCloseAddTransaction={onCloseAddTransaction} onAdd={onAdd} onAddSplit={onAddSplit} onManagePayees={onManagePayees} onCreatePayee={onCreatePayee} style={{ backgroundColor: theme_1.theme.tableBackground }} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule} onNotesTagClick={onNotesTagClick} onSort={onSort} sortField={sortField} ascDesc={ascDesc} onBatchDelete={onBatchDelete} onBatchDuplicate={onBatchDuplicate} onBatchLinkSchedule={onBatchLinkSchedule} onBatchUnlinkSchedule={onBatchUnlinkSchedule} onCreateRule={onCreateRule} onScheduleAction={onScheduleAction} onMakeAsNonSplitTransactions={onMakeAsNonSplitTransactions} showSelection={showSelection} allowSplitTransaction={allowSplitTransaction}/>);
}
