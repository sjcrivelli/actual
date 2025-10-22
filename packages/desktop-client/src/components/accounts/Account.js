"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Account = Account;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var i18next_1 = require("i18next");
var debounce_1 = require("lodash/debounce");
var uuid_1 = require("uuid");
var fetch_1 = require("loot-core/platform/client/fetch");
var undo = require("loot-core/platform/client/undo");
var months_1 = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var transactions_1 = require("loot-core/shared/transactions");
var util_1 = require("loot-core/shared/util");
var AccountEmptyMessage_1 = require("./AccountEmptyMessage");
var Header_1 = require("./Header");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var appSlice_1 = require("@desktop-client/app/appSlice");
var TransactionList_1 = require("@desktop-client/components/transactions/TransactionList");
var accountValidation_1 = require("@desktop-client/components/util/accountValidation");
var useAccountPreviewTransactions_1 = require("@desktop-client/hooks/useAccountPreviewTransactions");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFailedAccounts_1 = require("@desktop-client/hooks/useFailedAccounts");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSplitsExpanded_1 = require("@desktop-client/hooks/useSplitsExpanded");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useTransactionBatchActions_1 = require("@desktop-client/hooks/useTransactionBatchActions");
var useTransactionFilters_1 = require("@desktop-client/hooks/useTransactionFilters");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var queries = require("@desktop-client/queries");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
var pagedQuery_1 = require("@desktop-client/queries/pagedQuery");
var redux_1 = require("@desktop-client/redux");
var transactionsSlice_1 = require("@desktop-client/transactions/transactionsSlice");
function isTransactionFilterEntity(filter) {
    return 'id' in filter;
}
function AllTransactions(_a) {
    var account = _a.account, transactions = _a.transactions, balances = _a.balances, showBalances = _a.showBalances, filtered = _a.filtered, children = _a.children;
    var accountId = account === null || account === void 0 ? void 0 : account.id;
    var splitsExpandedDispatch = (0, useSplitsExpanded_1.useSplitsExpanded)().dispatch;
    var _b = (0, useAccountPreviewTransactions_1.useAccountPreviewTransactions)({ accountId: accountId }), previewTransactions = _b.previewTransactions, isPreviewTransactionsLoading = _b.isLoading;
    (0, react_1.useEffect)(function () {
        if (!isPreviewTransactionsLoading) {
            splitsExpandedDispatch({
                type: 'close-splits',
                ids: previewTransactions.filter(function (t) { return t.is_parent; }).map(function (t) { return t.id; }),
            });
        }
    }, [
        isPreviewTransactionsLoading,
        previewTransactions,
        splitsExpandedDispatch,
    ]);
    transactions !== null && transactions !== void 0 ? transactions : (transactions = []);
    var runningBalance = (0, react_1.useMemo)(function () {
        var _a;
        if (!showBalances) {
            return 0;
        }
        return balances && (transactions === null || transactions === void 0 ? void 0 : transactions.length) > 0
            ? ((_a = balances[transactions[0].id]) !== null && _a !== void 0 ? _a : 0)
            : 0;
    }, [showBalances, balances, transactions]);
    var prependBalances = (0, react_1.useMemo)(function () {
        if (!showBalances) {
            return null;
        }
        return Object.fromEntries((0, useTransactions_1.calculateRunningBalancesBottomUp)(previewTransactions, 'all', runningBalance));
    }, [showBalances, previewTransactions, runningBalance]);
    var allTransactions = (0, react_1.useMemo)(function () {
        // Don't prepend scheduled transactions if we are filtering
        if (!filtered && previewTransactions.length > 0) {
            return previewTransactions.concat(transactions);
        }
        return transactions;
    }, [filtered, previewTransactions, transactions]);
    var allBalances = (0, react_1.useMemo)(function () {
        // Don't prepend scheduled transactions if we are filtering
        if (!filtered && prependBalances && balances) {
            return __assign(__assign({}, prependBalances), balances);
        }
        return balances;
    }, [filtered, prependBalances, balances]);
    if (!(previewTransactions === null || previewTransactions === void 0 ? void 0 : previewTransactions.length) || filtered) {
        return children(transactions, balances);
    }
    return children(allTransactions, allBalances);
}
function getField(field) {
    if (!field) {
        return 'date';
    }
    switch (field) {
        case 'account':
            return 'account.name';
        case 'payee':
            return 'payee.name';
        case 'category':
            return 'category.name';
        case 'payment':
            return 'amount';
        case 'deposit':
            return 'amount';
        default:
            return field;
    }
}
var AccountInternal = /** @class */ (function (_super) {
    __extends(AccountInternal, _super);
    function AccountInternal(props) {
        var _this = _super.call(this, props) || this;
        _this.fetchAllIds = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.paged) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.paged.query.select('id'))];
                    case 1:
                        data = (_a.sent()).data;
                        // Remember, this is the `grouped` split type so we need to deal
                        // with the `subtransactions` property
                        return [2 /*return*/, data.reduce(function (arr, t) {
                                var _a;
                                arr.push(t.id);
                                (_a = t.subtransactions) === null || _a === void 0 ? void 0 : _a.forEach(function (sub) { return arr.push(sub.id); });
                                return arr;
                            }, [])];
                }
            });
        }); };
        _this.refetchTransactions = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (_a = this.paged) === null || _a === void 0 ? void 0 : _a.run();
                return [2 /*return*/];
            });
        }); };
        _this.fetchTransactions = function (filterConditions) {
            var query = _this.makeRootTransactionsQuery();
            _this.rootQuery = _this.currentQuery = query;
            if (filterConditions)
                _this.applyFilters(filterConditions);
            else
                _this.updateQuery(query);
            if (_this.props.accountId) {
                _this.props.dispatch((0, accountsSlice_1.markAccountRead)({ id: _this.props.accountId }));
            }
        };
        _this.makeRootTransactionsQuery = function () {
            var accountId = _this.props.accountId;
            return queries.transactions(accountId);
        };
        _this.onSearch = function (value) {
            var _a;
            (_a = _this.paged) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            _this.setState({ search: value }, _this.onSearchDone);
        };
        _this.onSearchDone = (0, debounce_1.default)(function () {
            if (_this.state.search === '') {
                _this.updateQuery(_this.currentQuery, _this.state.filterConditions.length > 0);
            }
            else {
                _this.updateQuery(queries.transactionsSearch(_this.currentQuery, _this.state.search, _this.props.dateFormat), true);
            }
        }, 150);
        _this.onSync = function () { return __awaiter(_this, void 0, void 0, function () {
            var accountId, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountId = this.props.accountId;
                        account = this.props.accounts.find(function (acct) { return acct.id === accountId; });
                        return [4 /*yield*/, this.props.dispatch((0, appSlice_1.syncAndDownload)({ accountId: account ? account.id : accountId }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onImport = function () { return __awaiter(_this, void 0, void 0, function () {
            var accountId, account, res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountId = this.props.accountId;
                        account = this.props.accounts.find(function (acct) { return acct.id === accountId; });
                        if (!account) return [3 /*break*/, 2];
                        return [4 /*yield*/, window.Actual.openFileDialog({
                                filters: [
                                    {
                                        name: (0, i18next_1.t)('Financial files'),
                                        extensions: ['qif', 'ofx', 'qfx', 'csv', 'tsv', 'xml'],
                                    },
                                ],
                            })];
                    case 1:
                        res = _a.sent();
                        if (res) {
                            if (accountId && (res === null || res === void 0 ? void 0 : res.length) > 0) {
                                this.props.dispatch((0, modalsSlice_1.pushModal)({
                                    modal: {
                                        name: 'import-transactions',
                                        options: {
                                            accountId: accountId,
                                            filename: res[0],
                                            onImported: function (didChange) {
                                                if (didChange) {
                                                    _this.fetchTransactions();
                                                }
                                            },
                                        },
                                    },
                                }));
                            }
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        _this.onExport = function (accountName) { return __awaiter(_this, void 0, void 0, function () {
            var exportedTransactions, normalizedName, filename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-export-query', {
                            query: this.currentQuery.serialize(),
                        })];
                    case 1:
                        exportedTransactions = _a.sent();
                        normalizedName = accountName && accountName.replace(/[()]/g, '').replace(/\s+/g, '-');
                        filename = "".concat(normalizedName || 'transactions', ".csv");
                        window.Actual.saveFile(exportedTransactions, filename, (0, i18next_1.t)('Export transactions'));
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onTransactionsChange = function (updatedTransaction) {
            var _a;
            // Apply changes to pagedQuery data
            (_a = _this.paged) === null || _a === void 0 ? void 0 : _a.optimisticUpdate(function (data) {
                if (updatedTransaction._deleted) {
                    return data.filter(function (t) { return t.id !== updatedTransaction.id; });
                }
                else {
                    return data.map(function (t) {
                        return t.id === updatedTransaction.id ? updatedTransaction : t;
                    });
                }
            });
            _this.props.dispatch((0, transactionsSlice_1.updateNewTransactions)({ id: updatedTransaction.id }));
        };
        _this.canCalculateBalance = function () {
            var accountId = _this.props.accountId;
            var account = _this.props.accounts.find(function (account) { return account.id === accountId; });
            if (!account)
                return false;
            if (_this.state.search !== '')
                return false;
            if (_this.state.filterConditions.length > 0)
                return false;
            if (_this.state.sort === null) {
                return true;
            }
            else {
                return (_this.state.sort.field === 'date' && _this.state.sort.ascDesc === 'desc');
            }
        };
        _this.onRunRules = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            var transactions, changedTransactions, _i, transactions_2, transaction, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, 8, 9]);
                        this.setState({ workingHard: true });
                        transactions = this.state.transactions.filter(function (trans) {
                            return ids.includes(trans.id);
                        });
                        changedTransactions = [];
                        _i = 0, transactions_2 = transactions;
                        _a.label = 1;
                    case 1:
                        if (!(_i < transactions_2.length)) return [3 /*break*/, 4];
                        transaction = transactions_2[_i];
                        return [4 /*yield*/, (0, fetch_1.send)('rules-run', {
                                transaction: transaction,
                            })];
                    case 2:
                        res = _a.sent();
                        if (res) {
                            changedTransactions.push.apply(changedTransactions, (0, transactions_1.ungroupTransaction)(res));
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!(changedTransactions.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                                updated: changedTransactions,
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        // Fetch updated transactions once at the end
                        this.fetchTransactions();
                        return [3 /*break*/, 9];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Error applying rules:', error_1);
                        this.props.dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                message: 'Failed to apply rules to transactions',
                            },
                        }));
                        return [3 /*break*/, 9];
                    case 8:
                        this.setState({ workingHard: false });
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        _this.onAddTransaction = function () {
            _this.setState({ isAdding: true });
        };
        _this.onSaveName = function (name) {
            var _a;
            var accountNameError = (0, accountValidation_1.validateAccountName)(name, (_a = _this.props.accountId) !== null && _a !== void 0 ? _a : '', _this.props.accounts);
            if (accountNameError) {
                _this.setState({ nameError: accountNameError });
            }
            else {
                var account = _this.props.accounts.find(function (account) { return account.id === _this.props.accountId; });
                if (!account) {
                    throw new Error("Account with ID ".concat(_this.props.accountId, " not found."));
                }
                _this.props.dispatch((0, accountsSlice_1.updateAccount)({ account: __assign(__assign({}, account), { name: name }) }));
                _this.setState({ nameError: '' });
            }
        };
        _this.onToggleExtraBalances = function () {
            _this.props.setShowExtraBalances(!_this.props.showExtraBalances);
        };
        _this.onMenuSelect = function (item) { return __awaiter(_this, void 0, void 0, function () {
            var accountId, account, accountName;
            var _this = this;
            return __generator(this, function (_a) {
                accountId = this.props.accountId;
                account = this.props.accounts.find(function (account) { return account.id === accountId; });
                switch (item) {
                    case 'link':
                        this.props.dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'add-account',
                                options: {
                                    upgradingAccountId: accountId,
                                },
                            },
                        }));
                        break;
                    case 'unlink':
                        this.props.dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-unlink-account',
                                options: {
                                    accountName: account.name,
                                    isViewBankSyncSettings: false,
                                    onUnlink: function () {
                                        _this.props.dispatch((0, accountsSlice_1.unlinkAccount)({ id: accountId }));
                                    },
                                },
                            },
                        }));
                        break;
                    case 'close':
                        this.props.dispatch((0, modalsSlice_1.openAccountCloseModal)({ accountId: accountId }));
                        break;
                    case 'reopen':
                        this.props.dispatch((0, accountsSlice_1.reopenAccount)({ id: accountId }));
                        break;
                    case 'export':
                        accountName = this.getAccountTitle(account, accountId);
                        this.onExport(accountName);
                        break;
                    case 'toggle-balance':
                        if (this.state.showBalances) {
                            this.props.setShowBalances(false);
                            this.setState({ showBalances: false, balances: null });
                        }
                        else {
                            this.props.setShowBalances(true);
                            this.setState({
                                transactions: [],
                                transactionCount: 0,
                                filterConditions: [],
                                search: '',
                                sort: null,
                                showBalances: true,
                            }, function () {
                                _this.fetchTransactions();
                            });
                        }
                        break;
                    case 'remove-sorting': {
                        this.setState({ sort: null }, function () {
                            var filterConditions = _this.state.filterConditions;
                            if (filterConditions.length > 0) {
                                _this.applyFilters(__spreadArray([], filterConditions, true));
                            }
                            else {
                                _this.fetchTransactions();
                            }
                            if (_this.state.search !== '') {
                                _this.onSearch(_this.state.search);
                            }
                        });
                        break;
                    }
                    case 'toggle-cleared':
                        if (this.state.showCleared) {
                            this.props.setShowCleared(false);
                            this.setState({ showCleared: false });
                        }
                        else {
                            this.props.setShowCleared(true);
                            this.setState({ showCleared: true });
                        }
                        break;
                    case 'toggle-reconciled':
                        if (this.state.showReconciled) {
                            this.props.setShowReconciled(false);
                            this.setState({ showReconciled: false }, function () {
                                return _this.fetchTransactions(_this.state.filterConditions);
                            });
                        }
                        else {
                            this.props.setShowReconciled(true);
                            this.setState({ showReconciled: true }, function () {
                                return _this.fetchTransactions(_this.state.filterConditions);
                            });
                        }
                        break;
                    case 'toggle-net-worth-chart':
                        if (this.props.showNetWorthChart) {
                            this.props.setShowNetWorthChart(false);
                        }
                        else {
                            this.props.setShowNetWorthChart(true);
                        }
                        break;
                    default:
                }
                return [2 /*return*/];
            });
        }); };
        _this.getFilteredAmount = function () { return __awaiter(_this, void 0, void 0, function () {
            var amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.paged) {
                            return [2 /*return*/, 0];
                        }
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.paged.query.calculate({ $sum: '$amount' }))];
                    case 1:
                        amount = (_a.sent()).data;
                        return [2 /*return*/, amount];
                }
            });
        }); };
        _this.isNew = function (id) {
            return _this.props.newTransactions.includes(id);
        };
        _this.isMatched = function (id) {
            return _this.props.matchedTransactions.includes(id);
        };
        _this.onCreatePayee = function (name) { return __awaiter(_this, void 0, void 0, function () {
            var trimmed;
            return __generator(this, function (_a) {
                trimmed = name.trim();
                if (trimmed !== '') {
                    return [2 /*return*/, this.props.dispatch((0, payeesSlice_1.createPayee)({ name: name })).unwrap()];
                }
                return [2 /*return*/, null];
            });
        }); };
        _this.lockTransactions = function () { return __awaiter(_this, void 0, void 0, function () {
            var accountId, data, transactions, changes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ workingHard: true });
                        accountId = this.props.accountId;
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                .filter({ cleared: true, reconciled: false, account: accountId })
                                .select('*')
                                .options({ splits: 'grouped' }))];
                    case 1:
                        data = (_a.sent()).data;
                        transactions = (0, transactions_1.ungroupTransactions)(data);
                        changes = {
                            updated: [],
                        };
                        transactions.forEach(function (trans) {
                            var diff = (0, transactions_1.updateTransaction)(transactions, __assign(__assign({}, trans), { reconciled: true })).diff;
                            transactions = (0, util_1.applyChanges)(diff, transactions);
                            changes.updated = changes.updated
                                ? changes.updated.concat(diff.updated)
                                : diff.updated;
                        });
                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.refetchTransactions()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onReconcile = function (amount) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.setState(function (_a) {
                    var showCleared = _a.showCleared;
                    return ({
                        reconcileAmount: amount,
                        showCleared: true,
                        prevShowCleared: showCleared,
                    });
                });
                return [2 /*return*/];
            });
        }); };
        _this.onDoneReconciling = function () { return __awaiter(_this, void 0, void 0, function () {
            var accountId, account, reconcileAmount, data, transactions, cleared, targetDiff, lastReconciled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountId = this.props.accountId;
                        account = this.props.accounts.find(function (account) { return account.id === accountId; });
                        if (!account) {
                            throw new Error("Account with ID ".concat(accountId, " not found."));
                        }
                        reconcileAmount = this.state.reconcileAmount;
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                .filter({ cleared: true, account: accountId })
                                .select('*')
                                .options({ splits: 'grouped' }))];
                    case 1:
                        data = (_a.sent()).data;
                        transactions = (0, transactions_1.ungroupTransactions)(data);
                        cleared = 0;
                        transactions.forEach(function (trans) {
                            if (!trans.is_parent) {
                                cleared += trans.amount;
                            }
                        });
                        targetDiff = (reconcileAmount || 0) - cleared;
                        if (!(targetDiff === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.lockTransactions()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        lastReconciled = new Date().getTime().toString();
                        this.props.dispatch((0, accountsSlice_1.updateAccount)({
                            account: __assign(__assign({}, account), { last_reconciled: lastReconciled }),
                        }));
                        this.setState({
                            reconcileAmount: null,
                            showCleared: this.state.prevShowCleared,
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onCreateReconciliationTransaction = function (diff) { return __awaiter(_this, void 0, void 0, function () {
            var reconciliationTransactions, ruledTransactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reconciliationTransactions = (0, transactions_1.realizeTempTransactions)([
                            {
                                id: 'temp',
                                account: this.props.accountId,
                                cleared: true,
                                reconciled: false,
                                amount: diff,
                                date: (0, months_1.currentDay)(),
                                notes: (0, i18next_1.t)('Reconciliation balance adjustment'),
                            },
                        ]);
                        // Optimistic UI: update the transaction list before sending the data to the database
                        this.setState({
                            transactions: __spreadArray(__spreadArray([], reconciliationTransactions, true), this.state.transactions, true),
                        });
                        return [4 /*yield*/, Promise.all(reconciliationTransactions.map(function (transaction) {
                                return (0, fetch_1.send)('rules-run', { transaction: transaction });
                            }))];
                    case 1:
                        ruledTransactions = _a.sent();
                        // sync the reconciliation transaction
                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                                added: ruledTransactions.filter(function (trans) { return !trans.tombstone; }),
                                deleted: ruledTransactions.filter(function (trans) { return trans.tombstone; }),
                            })];
                    case 2:
                        // sync the reconciliation transaction
                        _a.sent();
                        return [4 /*yield*/, this.refetchTransactions()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onShowTransactions = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.onApplyFilter({
                    customName: (0, i18next_1.t)('Selected transactions'),
                    queryFilter: { id: { $oneof: ids } },
                });
                return [2 /*return*/];
            });
        }); };
        _this.onBatchEdit = function (name, ids) {
            _this.props.onBatchEdit({
                name: name,
                ids: ids,
                onSuccess: function (updatedIds) {
                    _this.refetchTransactions();
                    if (_this.table.current) {
                        _this.table.current.edit(updatedIds[0], 'select', false);
                    }
                },
            });
        };
        _this.onBatchDuplicate = function (ids) {
            _this.props.onBatchDuplicate({ ids: ids, onSuccess: _this.refetchTransactions });
        };
        _this.onBatchDelete = function (ids) {
            _this.props.onBatchDelete({ ids: ids, onSuccess: _this.refetchTransactions });
        };
        _this.onMakeAsSplitTransaction = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            var data, transactions, firstTransaction, parentTransaction, childTransactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ workingHard: true });
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                .filter({ id: { $oneof: ids } })
                                .select('*')
                                .options({ splits: 'none' }))];
                    case 1:
                        data = (_a.sent()).data;
                        transactions = data;
                        if (!transactions || transactions.length === 0) {
                            return [2 /*return*/];
                        }
                        firstTransaction = transactions[0];
                        parentTransaction = {
                            id: (0, uuid_1.v4)(),
                            is_parent: true,
                            cleared: transactions.every(function (t) { return !!t.cleared; }),
                            date: firstTransaction.date,
                            account: firstTransaction.account,
                            amount: transactions
                                .map(function (t) { return t.amount; })
                                .reduce(function (total, amount) { return total + amount; }, 0),
                        };
                        childTransactions = transactions.map(function (t) {
                            return (0, transactions_1.makeChild)(parentTransaction, t);
                        });
                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                                added: [parentTransaction],
                                updated: childTransactions,
                            })];
                    case 2:
                        _a.sent();
                        this.refetchTransactions();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onMakeAsNonSplitTransactions = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            var data, groupedTransactions, changes, groupedTransactionsToUpdate, _i, groupedTransactionsToUpdate_1, groupedTransaction, transactions, parentTransaction, childTransactions, diff_1, selectedChildTransactions, diff, transactionsToSelect;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.setState({ workingHard: true });
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                .filter({ id: { $oneof: ids } })
                                .select('*')
                                .options({ splits: 'grouped' }))];
                    case 1:
                        data = (_b.sent()).data;
                        groupedTransactions = data;
                        changes = {
                            updated: [],
                            deleted: [],
                        };
                        groupedTransactionsToUpdate = groupedTransactions.filter(function (t) { return t.is_parent; });
                        for (_i = 0, groupedTransactionsToUpdate_1 = groupedTransactionsToUpdate; _i < groupedTransactionsToUpdate_1.length; _i++) {
                            groupedTransaction = groupedTransactionsToUpdate_1[_i];
                            transactions = (0, transactions_1.ungroupTransaction)(groupedTransaction);
                            parentTransaction = transactions[0], childTransactions = transactions.slice(1);
                            if (ids.includes(parentTransaction.id)) {
                                diff_1 = (0, transactions_1.makeAsNonChildTransactions)(childTransactions, transactions);
                                changes = {
                                    updated: __spreadArray(__spreadArray([], changes.updated, true), diff_1.updated, true),
                                    deleted: __spreadArray(__spreadArray([], changes.deleted, true), diff_1.deleted, true),
                                };
                                // Already processed the child transactions above, no need to process them below.
                                continue;
                            }
                            selectedChildTransactions = childTransactions.filter(function (t) {
                                return ids.includes(t.id);
                            });
                            if (selectedChildTransactions.length === 0) {
                                continue;
                            }
                            diff = (0, transactions_1.makeAsNonChildTransactions)(selectedChildTransactions, transactions);
                            changes = {
                                updated: __spreadArray(__spreadArray([], changes.updated, true), diff.updated, true),
                                deleted: __spreadArray(__spreadArray([], changes.deleted, true), diff.deleted, true),
                            };
                        }
                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                    case 2:
                        _b.sent();
                        this.refetchTransactions();
                        transactionsToSelect = changes.updated.map(function (t) { return t.id; });
                        (_a = this.dispatchSelected) === null || _a === void 0 ? void 0 : _a.call(this, {
                            type: 'select-all',
                            ids: transactionsToSelect,
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onMergeTransactions = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            var keptId;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-merge', ids.map(function (id) { return ({ id: id }); }))];
                    case 1:
                        keptId = _b.sent();
                        return [4 /*yield*/, this.refetchTransactions()];
                    case 2:
                        _b.sent();
                        (_a = this.dispatchSelected) === null || _a === void 0 ? void 0 : _a.call(this, {
                            type: 'select-all',
                            ids: [keptId],
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        _this.checkForReconciledTransactions = function (ids, confirmReason, onConfirm) { return __awaiter(_this, void 0, void 0, function () {
            var data, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                            .filter({ id: { $oneof: ids }, reconciled: true })
                            .select('*')
                            .options({ splits: 'grouped' }))];
                    case 1:
                        data = (_a.sent()).data;
                        transactions = (0, transactions_1.ungroupTransactions)(data);
                        if (transactions.length > 0) {
                            this.props.dispatch((0, modalsSlice_1.pushModal)({
                                modal: {
                                    name: 'confirm-transaction-edit',
                                    options: {
                                        onConfirm: function () {
                                            onConfirm(ids);
                                        },
                                        confirmReason: confirmReason,
                                    },
                                },
                            }));
                        }
                        else {
                            onConfirm(ids);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onBatchLinkSchedule = function (ids) {
            _this.props.onBatchLinkSchedule({
                ids: ids,
                account: _this.props.accounts.find(function (a) { return a.id === _this.props.accountId; }),
                onSuccess: _this.refetchTransactions,
            });
        };
        _this.onBatchUnlinkSchedule = function (ids) {
            _this.props.onBatchUnlinkSchedule({
                ids: ids,
                onSuccess: _this.refetchTransactions,
            });
        };
        _this.onCreateRule = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            var data, transactions, ruleTransaction, childTransactions, payeeCondition, amountCondition, rule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                            .filter({ id: { $oneof: ids } })
                            .select('*')
                            .options({ splits: 'grouped' }))];
                    case 1:
                        data = (_a.sent()).data;
                        transactions = (0, transactions_1.ungroupTransactions)(data);
                        ruleTransaction = transactions[0];
                        childTransactions = transactions.filter(function (t) { return t.parent_id === ruleTransaction.id; });
                        payeeCondition = ruleTransaction.imported_payee
                            ? {
                                field: 'imported_payee',
                                op: 'is',
                                value: ruleTransaction.imported_payee,
                                type: 'string',
                            }
                            : {
                                field: 'payee',
                                op: 'is',
                                value: ruleTransaction.payee,
                                type: 'id',
                            };
                        amountCondition = {
                            field: 'amount',
                            op: 'isapprox',
                            value: ruleTransaction.amount,
                            type: 'number',
                        };
                        rule = {
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [payeeCondition, amountCondition],
                            actions: __spreadArray(__spreadArray([], (childTransactions.length === 0
                                ? [
                                    {
                                        op: 'set',
                                        field: 'category',
                                        value: ruleTransaction.category,
                                        type: 'id',
                                        options: {
                                            splitIndex: 0,
                                        },
                                    },
                                ]
                                : []), true), childTransactions.flatMap(function (sub, index) { return [
                                {
                                    op: 'set-split-amount',
                                    value: sub.amount,
                                    options: {
                                        splitIndex: index + 1,
                                        method: 'fixed-amount',
                                    },
                                },
                                {
                                    op: 'set',
                                    field: 'category',
                                    value: sub.category,
                                    type: 'id',
                                    options: {
                                        splitIndex: index + 1,
                                    },
                                },
                            ]; }), true),
                        };
                        this.props.dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'edit-rule', options: { rule: rule } } }));
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onSetTransfer = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ workingHard: true });
                        return [4 /*yield*/, this.props.onSetTransfer(ids, this.props.payees, this.refetchTransactions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.onConditionsOpChange = function (value) {
            _this.setState({ filterConditionsOp: value });
            _this.setState({
                filterId: __assign(__assign({}, _this.state.filterId), { status: 'changed' }),
            });
            _this.applyFilters(__spreadArray([], _this.state.filterConditions, true));
            if (_this.state.search !== '') {
                _this.onSearch(_this.state.search);
            }
        };
        _this.onReloadSavedFilter = function (savedFilter, item) {
            var _a, _b, _c;
            if (item === 'reload') {
                var savedFilter_1 = _this.props.savedFilters.filter(function (f) { var _a; return f.id === ((_a = _this.state.filterId) === null || _a === void 0 ? void 0 : _a.id); })[0];
                _this.setState({ filterConditionsOp: (_a = savedFilter_1.conditionsOp) !== null && _a !== void 0 ? _a : 'and' });
                _this.applyFilters(__spreadArray([], savedFilter_1.conditions, true));
            }
            else {
                if (savedFilter.status) {
                    _this.setState({
                        filterConditionsOp: (_b = savedFilter.conditionsOp) !== null && _b !== void 0 ? _b : 'and',
                    });
                    _this.applyFilters(__spreadArray([], ((_c = savedFilter.conditions) !== null && _c !== void 0 ? _c : []), true));
                }
            }
            _this.setState({ filterId: __assign(__assign({}, _this.state.filterId), savedFilter) });
        };
        _this.onClearFilters = function () {
            _this.setState({ filterConditionsOp: 'and' });
            _this.setState({ filterId: undefined });
            _this.applyFilters([]);
            if (_this.state.search !== '') {
                _this.onSearch(_this.state.search);
            }
        };
        _this.onUpdateFilter = function (oldCondition, updatedCondition) {
            _this.applyFilters(_this.state.filterConditions.map(function (c) {
                return c === oldCondition ? updatedCondition : c;
            }));
            _this.setState({
                filterId: __assign(__assign({}, _this.state.filterId), { status: _this.state.filterId && 'changed' }),
            });
            if (_this.state.search !== '') {
                _this.onSearch(_this.state.search);
            }
        };
        _this.onDeleteFilter = function (condition) {
            _this.applyFilters(_this.state.filterConditions.filter(function (c) { return c !== condition; }));
            if (_this.state.filterConditions.length === 1) {
                _this.setState({ filterId: undefined });
                _this.setState({ filterConditionsOp: 'and' });
            }
            else {
                _this.setState({
                    filterId: __assign(__assign({}, _this.state.filterId), { status: _this.state.filterId && 'changed' }),
                });
            }
            if (_this.state.search !== '') {
                _this.onSearch(_this.state.search);
            }
        };
        _this.onApplyFilter = function (conditionOrSavedFilter) { return __awaiter(_this, void 0, void 0, function () {
            var filterConditions, savedFilter, condition;
            return __generator(this, function (_a) {
                filterConditions = this.state.filterConditions;
                if ('customName' in conditionOrSavedFilter &&
                    conditionOrSavedFilter.customName) {
                    filterConditions = filterConditions.filter(function (c) {
                        return !isTransactionFilterEntity(c) &&
                            c.customName !== conditionOrSavedFilter.customName;
                    });
                }
                if (isTransactionFilterEntity(conditionOrSavedFilter)) {
                    savedFilter = conditionOrSavedFilter;
                    this.setState({
                        filterId: __assign(__assign({}, savedFilter), { status: 'saved' }),
                    });
                    this.setState({ filterConditionsOp: savedFilter.conditionsOp });
                    this.applyFilters(__spreadArray([], savedFilter.conditions, true));
                }
                else {
                    condition = conditionOrSavedFilter;
                    this.setState({
                        filterId: __assign(__assign({}, this.state.filterId), { status: this.state.filterId && 'changed' }),
                    });
                    this.applyFilters(__spreadArray(__spreadArray([], filterConditions, true), [condition], false));
                }
                if (this.state.search !== '') {
                    this.onSearch(this.state.search);
                }
                return [2 /*return*/];
            });
        }); };
        _this.onScheduleAction = function (name, ids) { return __awaiter(_this, void 0, void 0, function () {
            var scheduleIds, _a, _i, scheduleIds_1, id, _b, scheduleIds_2, id, _c, scheduleIds_3, id, _d, scheduleIds_4, id;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        scheduleIds = ids.map(function (id) { return id.split('/')[1]; });
                        _a = name;
                        switch (_a) {
                            case 'post-transaction': return [3 /*break*/, 1];
                            case 'post-transaction-today': return [3 /*break*/, 6];
                            case 'skip': return [3 /*break*/, 11];
                            case 'complete': return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 21];
                    case 1:
                        _i = 0, scheduleIds_1 = scheduleIds;
                        _e.label = 2;
                    case 2:
                        if (!(_i < scheduleIds_1.length)) return [3 /*break*/, 5];
                        id = scheduleIds_1[_i];
                        return [4 /*yield*/, (0, fetch_1.send)('schedule/post-transaction', { id: id })];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.refetchTransactions();
                        return [3 /*break*/, 21];
                    case 6:
                        _b = 0, scheduleIds_2 = scheduleIds;
                        _e.label = 7;
                    case 7:
                        if (!(_b < scheduleIds_2.length)) return [3 /*break*/, 10];
                        id = scheduleIds_2[_b];
                        return [4 /*yield*/, (0, fetch_1.send)('schedule/post-transaction', { id: id, today: true })];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9:
                        _b++;
                        return [3 /*break*/, 7];
                    case 10:
                        this.refetchTransactions();
                        return [3 /*break*/, 21];
                    case 11:
                        _c = 0, scheduleIds_3 = scheduleIds;
                        _e.label = 12;
                    case 12:
                        if (!(_c < scheduleIds_3.length)) return [3 /*break*/, 15];
                        id = scheduleIds_3[_c];
                        return [4 /*yield*/, (0, fetch_1.send)('schedule/skip-next-date', { id: id })];
                    case 13:
                        _e.sent();
                        _e.label = 14;
                    case 14:
                        _c++;
                        return [3 /*break*/, 12];
                    case 15: return [3 /*break*/, 21];
                    case 16:
                        _d = 0, scheduleIds_4 = scheduleIds;
                        _e.label = 17;
                    case 17:
                        if (!(_d < scheduleIds_4.length)) return [3 /*break*/, 20];
                        id = scheduleIds_4[_d];
                        return [4 /*yield*/, (0, fetch_1.send)('schedule/update', { schedule: { id: id, completed: true } })];
                    case 18:
                        _e.sent();
                        _e.label = 19;
                    case 19:
                        _d++;
                        return [3 /*break*/, 17];
                    case 20: return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        }); };
        _this.applyFilters = function (conditions) { return __awaiter(_this, void 0, void 0, function () {
            var filteredCustomQueryFilters, customQueryFilters, queryFilters, conditionsOpKey;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(conditions.length > 0)) return [3 /*break*/, 2];
                        filteredCustomQueryFilters = conditions.filter(function (cond) { return !isTransactionFilterEntity(cond); });
                        customQueryFilters = filteredCustomQueryFilters.map(function (f) { return f.queryFilter; });
                        return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                                conditions: conditions.filter(function (cond) { return isTransactionFilterEntity(cond) || !cond.customName; }),
                            })];
                    case 1:
                        queryFilters = (_b.sent()).filters;
                        conditionsOpKey = this.state.filterConditionsOp === 'or' ? '$or' : '$and';
                        this.currentQuery = this.rootQuery.filter((_a = {},
                            _a[conditionsOpKey] = __spreadArray(__spreadArray([], queryFilters, true), customQueryFilters, true),
                            _a));
                        this.setState({
                            filterConditions: conditions,
                        }, function () {
                            _this.updateQuery(_this.currentQuery, true);
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        this.setState({
                            transactions: [],
                            transactionCount: 0,
                            filterConditions: conditions,
                        }, function () {
                            _this.fetchTransactions();
                        });
                        _b.label = 3;
                    case 3:
                        if (this.state.sort !== null) {
                            this.applySort();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        _this.applySort = function (field, ascDesc, prevField, prevAscDesc) {
            var _a, _b, _c, _d;
            var filterConditions = _this.state.filterConditions;
            var isFiltered = filterConditions.length > 0;
            var sortField = getField(!field ? (_a = _this.state.sort) === null || _a === void 0 ? void 0 : _a.field : field);
            var sortAscDesc = !ascDesc ? (_b = _this.state.sort) === null || _b === void 0 ? void 0 : _b.ascDesc : ascDesc;
            var sortPrevField = getField(!prevField ? (_c = _this.state.sort) === null || _c === void 0 ? void 0 : _c.prevField : prevField);
            var sortPrevAscDesc = !prevField
                ? (_d = _this.state.sort) === null || _d === void 0 ? void 0 : _d.prevAscDesc
                : prevAscDesc;
            var sortCurrentQuery = function (that, sortField, sortAscDesc) {
                var _a;
                if (sortField === 'cleared') {
                    that.currentQuery = that.currentQuery.orderBy({
                        reconciled: sortAscDesc,
                    });
                }
                that.currentQuery = that.currentQuery.orderBy((_a = {},
                    _a[sortField] = sortAscDesc,
                    _a));
            };
            var sortRootQuery = function (that, sortField, sortAscDesc) {
                var _a;
                if (sortField === 'cleared') {
                    that.currentQuery = that.rootQuery.orderBy({
                        reconciled: sortAscDesc,
                    });
                    that.currentQuery = that.currentQuery.orderBy({
                        cleared: sortAscDesc,
                    });
                }
                else {
                    that.currentQuery = that.rootQuery.orderBy((_a = {},
                        _a[sortField] = sortAscDesc,
                        _a));
                }
            };
            // sort by previously used sort field, if any
            var maybeSortByPreviousField = function (that, sortPrevField, sortPrevAscDesc) {
                var _a;
                if (!sortPrevField) {
                    return;
                }
                if (sortPrevField === 'cleared') {
                    that.currentQuery = that.currentQuery.orderBy({
                        reconciled: sortPrevAscDesc,
                    });
                }
                that.currentQuery = that.currentQuery.orderBy((_a = {},
                    _a[sortPrevField] = sortPrevAscDesc,
                    _a));
            };
            switch (true) {
                // called by applyFilters to sort an already filtered result
                case !field:
                    sortCurrentQuery(_this, sortField, sortAscDesc);
                    break;
                // called directly from UI by sorting a column.
                // active filters need to be applied before sorting
                case isFiltered:
                    _this.applyFilters(__spreadArray([], filterConditions, true));
                    sortCurrentQuery(_this, sortField, sortAscDesc);
                    break;
                // called directly from UI by sorting a column.
                // no active filters, start a new root query.
                case !isFiltered:
                    sortRootQuery(_this, sortField, sortAscDesc);
                    break;
                default:
            }
            maybeSortByPreviousField(_this, sortPrevField, sortPrevAscDesc);
            _this.updateQuery(_this.currentQuery, isFiltered);
        };
        _this.onSort = function (headerClicked, ascDesc) {
            var _a, _b, _c, _d, _e;
            var prevField;
            var prevAscDesc;
            //if staying on same column but switching asc/desc
            //then keep prev the same
            if (headerClicked === ((_a = _this.state.sort) === null || _a === void 0 ? void 0 : _a.field)) {
                prevField = _this.state.sort.prevField;
                prevAscDesc = _this.state.sort.prevAscDesc;
                _this.setState({
                    sort: __assign(__assign({}, _this.state.sort), { ascDesc: ascDesc }),
                });
            }
            else {
                //if switching to new column then capture state
                //of current sort column as prev
                prevField = (_b = _this.state.sort) === null || _b === void 0 ? void 0 : _b.field;
                prevAscDesc = (_c = _this.state.sort) === null || _c === void 0 ? void 0 : _c.ascDesc;
                _this.setState({
                    sort: {
                        field: headerClicked,
                        ascDesc: ascDesc,
                        prevField: (_d = _this.state.sort) === null || _d === void 0 ? void 0 : _d.field,
                        prevAscDesc: (_e = _this.state.sort) === null || _e === void 0 ? void 0 : _e.ascDesc,
                    },
                });
            }
            _this.applySort(headerClicked, ascDesc, prevField, prevAscDesc);
            if (_this.state.search !== '') {
                _this.onSearch(_this.state.search);
            }
        };
        _this.paged = null;
        _this.table = (0, react_1.createRef)();
        _this.state = {
            search: '',
            filterConditions: props.filterConditions || [],
            filterId: undefined,
            filterConditionsOp: 'and',
            loading: true,
            workingHard: false,
            reconcileAmount: null,
            transactions: [],
            transactionCount: 0,
            showBalances: props.showBalances,
            balances: null,
            showCleared: props.showCleared,
            showReconciled: props.showReconciled,
            nameError: '',
            isAdding: false,
            sort: null,
            filteredAmount: null,
        };
        return _this;
    }
    AccountInternal.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var maybeRefetch, onUndo, unlistens, lastUndoEvent;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maybeRefetch = function (tables) {
                            if (tables.includes('transactions') ||
                                tables.includes('category_mapping') ||
                                tables.includes('payee_mapping')) {
                                return _this.refetchTransactions();
                            }
                        };
                        onUndo = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var focusId, focusableMsgs;
                            var tables = _b.tables, messages = _b.messages;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, maybeRefetch(tables)];
                                    case 1:
                                        _c.sent();
                                        focusId = null;
                                        if (messages.every(function (msg) { return msg.dataset === 'transactions'; }) &&
                                            !messages.find(function (msg) { return msg.column === 'tombstone'; })) {
                                            focusableMsgs = messages.filter(function (msg) {
                                                return msg.dataset === 'transactions' && !(msg.column === 'tombstone');
                                            });
                                            focusId = focusableMsgs.length === 1 ? focusableMsgs[0].row : null;
                                            // Highlight the transactions
                                            // this.table && this.table.highlight(focusableMsgs.map(msg => msg.row));
                                        }
                                        if (this.table.current) {
                                            this.table.current.edit(null);
                                            // Focus a transaction if applicable. There is a chance if the
                                            // user navigated away that focusId is a transaction that has
                                            // been "paged off" and we won't focus it. That's ok, we just
                                            // do our best.
                                            if (focusId) {
                                                this.table.current.scrollTo(focusId);
                                            }
                                        }
                                        undo.setUndoState('undoEvent', null);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        unlistens = [(0, fetch_1.listen)('undo-event', onUndo)];
                        this.unlisten = function () {
                            unlistens.forEach(function (unlisten) { return unlisten(); });
                        };
                        // Important that any async work happens last so that the
                        // listeners are set up synchronously
                        return [4 /*yield*/, this.props.dispatch((0, payeesSlice_1.getPayees)())];
                    case 1:
                        // Important that any async work happens last so that the
                        // listeners are set up synchronously
                        _a.sent();
                        return [4 /*yield*/, this.fetchTransactions(this.state.filterConditions)];
                    case 2:
                        _a.sent();
                        lastUndoEvent = undo.getUndoState('undoEvent');
                        if (lastUndoEvent) {
                            onUndo(lastUndoEvent);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountInternal.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        // If the active account changes - close the transaction entry mode
        if (this.state.isAdding && this.props.accountId !== prevProps.accountId) {
            this.setState({ isAdding: false });
        }
        // If the user was on a different screen and is now coming back to
        // the transactions, automatically refresh the transaction to make
        // sure we have updated state
        if (prevProps.modalShowing && !this.props.modalShowing) {
            // This is clearly a hack. Need a better way to track which
            // things are listening to transactions and refetch
            // automatically (use ActualQL?)
            setTimeout(function () {
                _this.refetchTransactions();
            }, 100);
        }
        //Resest sort/filter/search on account change
        if (this.props.accountId !== prevProps.accountId) {
            this.setState({ sort: null, search: '', filterConditions: [] });
        }
    };
    AccountInternal.prototype.componentWillUnmount = function () {
        if (this.unlisten) {
            this.unlisten();
        }
        if (this.paged) {
            this.paged.unsubscribe();
        }
    };
    AccountInternal.prototype.updateQuery = function (query, isFiltered) {
        var _this = this;
        if (isFiltered === void 0) { isFiltered = false; }
        if (this.paged) {
            this.paged.unsubscribe();
        }
        // Filter out reconciled transactions if they are hidden
        // and we're not showing balances.
        if (!this.state.showReconciled &&
            (!this.state.showBalances || !this.canCalculateBalance())) {
            query = query.filter({ reconciled: { $eq: false } });
        }
        this.paged = (0, pagedQuery_1.pagedQuery)(query.select('*'), {
            onData: function (groupedData, prevData) { return __awaiter(_this, void 0, void 0, function () {
                var data, firstLoad, _a, _b;
                var _c;
                var _this = this;
                var _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            data = (0, transactions_1.ungroupTransactions)(__spreadArray([], groupedData, true));
                            firstLoad = prevData == null;
                            if (firstLoad) {
                                (_d = this.table.current) === null || _d === void 0 ? void 0 : _d.setRowAnimation(false);
                                if (isFiltered) {
                                    this.props.splitsExpandedDispatch({
                                        type: 'set-mode',
                                        mode: 'collapse',
                                    });
                                }
                                else {
                                    this.props.splitsExpandedDispatch({
                                        type: 'set-mode',
                                        mode: this.props.expandSplits ? 'expand' : 'collapse',
                                    });
                                }
                            }
                            _a = this.setState;
                            _c = {
                                transactions: data,
                                transactionCount: (_f = (_e = this.paged) === null || _e === void 0 ? void 0 : _e.totalCount) !== null && _f !== void 0 ? _f : 0,
                                transactionsFiltered: isFiltered,
                                loading: false,
                                workingHard: false
                            };
                            if (!this.state.showBalances) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.calculateBalances()];
                        case 1:
                            _b = _g.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _b = null;
                            _g.label = 3;
                        case 3:
                            _c.balances = _b;
                            return [4 /*yield*/, this.getFilteredAmount()];
                        case 4:
                            _a.apply(this, [(_c.filteredAmount = _g.sent(),
                                    _c), function () {
                                    var _a;
                                    if (firstLoad) {
                                        (_a = _this.table.current) === null || _a === void 0 ? void 0 : _a.scrollToTop();
                                    }
                                    setTimeout(function () {
                                        var _a;
                                        (_a = _this.table.current) === null || _a === void 0 ? void 0 : _a.setRowAnimation(true);
                                    }, 0);
                                }]);
                            return [2 /*return*/];
                    }
                });
            }); },
            options: {
                pageCount: 150,
                onlySync: true,
            },
        });
    };
    AccountInternal.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        var _this = this;
        if (this.props.accountId !== nextProps.accountId) {
            this.setState({
                loading: true,
                search: '',
                showBalances: nextProps.showBalances,
                balances: null,
                showCleared: nextProps.showCleared,
                showReconciled: nextProps.showReconciled,
                reconcileAmount: null,
            }, function () {
                _this.fetchTransactions();
            });
        }
    };
    AccountInternal.prototype.calculateBalances = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.canCalculateBalance() || !this.paged) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.paged.query
                                .options({ splits: 'none' })
                                .select([{ balance: { $sumOver: '$amount' } }]))];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.reduce(function (balances, row) {
                                balances[row.id] = row.balance;
                                return balances;
                            }, {})];
                }
            });
        });
    };
    AccountInternal.prototype.getAccountTitle = function (account, id) {
        var filterName = (this.props.location.state || {}).filterName;
        if (filterName) {
            return filterName;
        }
        if (!account) {
            if (id === 'onbudget') {
                return (0, i18next_1.t)('On Budget Accounts');
            }
            else if (id === 'offbudget') {
                return (0, i18next_1.t)('Off Budget Accounts');
            }
            else if (id === 'uncategorized') {
                return (0, i18next_1.t)('Uncategorized');
            }
            else if (!id) {
                return (0, i18next_1.t)('All Accounts');
            }
            return null;
        }
        return account.name;
    };
    AccountInternal.prototype.getBalanceQuery = function (id) {
        return {
            name: "balance-query-".concat(id),
            query: this.makeRootTransactionsQuery().calculate({ $sum: '$amount' }),
        };
    };
    AccountInternal.prototype.render = function () {
        var _this = this;
        var _a = this.props, accounts = _a.accounts, categoryGroups = _a.categoryGroups, payees = _a.payees, dateFormat = _a.dateFormat, hideFraction = _a.hideFraction, accountsSyncing = _a.accountsSyncing, failedAccounts = _a.failedAccounts, showExtraBalances = _a.showExtraBalances, accountId = _a.accountId, categoryId = _a.categoryId;
        var _b = this.state, transactions = _b.transactions, loading = _b.loading, workingHard = _b.workingHard, filterId = _b.filterId, reconcileAmount = _b.reconcileAmount, transactionsFiltered = _b.transactionsFiltered, showBalances = _b.showBalances, balances = _b.balances, showCleared = _b.showCleared, showReconciled = _b.showReconciled, filteredAmount = _b.filteredAmount;
        var account = accounts.find(function (account) { return account.id === accountId; });
        var accountName = this.getAccountTitle(account, accountId);
        if (!accountName && !loading) {
            // This is probably an account that was deleted, so redirect to
            // all accounts
            return <react_router_1.Navigate to="/accounts" replace/>;
        }
        var category = categoryGroups
            .flatMap(function (g) { return g.categories; })
            .find(function (category) { return (category === null || category === void 0 ? void 0 : category.id) === categoryId; });
        var showEmptyMessage = !loading && !accountId && accounts.length === 0;
        var isNameEditable = accountId
            ? accountId !== 'onbudget' &&
                accountId !== 'offbudget' &&
                accountId !== 'uncategorized'
            : false;
        var balanceQuery = this.getBalanceQuery(accountId);
        var selectAllFilter = function (item) {
            if (item.is_parent) {
                var children = transactions.filter(function (t) { return t.parent_id === item.id; });
                return children.every(function (t) { return selectAllFilter(t); });
            }
            return !item._unmatched;
        };
        return (<AllTransactions account={account} transactions={transactions} balances={balances} showBalances={showBalances} filtered={transactionsFiltered}>
        {function (allTransactions, allBalances) {
                var _a, _b, _c, _d, _e;
                return (<useSelected_1.SelectedProviderWithItems name="transactions" items={allTransactions} fetchAllIds={_this.fetchAllIds} registerDispatch={function (dispatch) { return (_this.dispatchSelected = dispatch); }} selectAllFilter={selectAllFilter}>
            <view_1.View style={styles_1.styles.page}>
              <Header_1.AccountHeader tableRef={_this.table} isNameEditable={isNameEditable !== null && isNameEditable !== void 0 ? isNameEditable : false} workingHard={workingHard !== null && workingHard !== void 0 ? workingHard : false} accountId={accountId} account={account} filterId={filterId} savedFilters={_this.props.savedFilters} accountName={accountName} accountsSyncing={accountsSyncing} failedAccounts={failedAccounts} accounts={accounts} transactions={transactions} showBalances={showBalances !== null && showBalances !== void 0 ? showBalances : false} showExtraBalances={showExtraBalances !== null && showExtraBalances !== void 0 ? showExtraBalances : false} showCleared={showCleared !== null && showCleared !== void 0 ? showCleared : false} showReconciled={showReconciled !== null && showReconciled !== void 0 ? showReconciled : false} showEmptyMessage={showEmptyMessage !== null && showEmptyMessage !== void 0 ? showEmptyMessage : false} balanceQuery={balanceQuery} canCalculateBalance={(_a = _this === null || _this === void 0 ? void 0 : _this.canCalculateBalance) !== null && _a !== void 0 ? _a : undefined} filteredAmount={filteredAmount} isFiltered={transactionsFiltered !== null && transactionsFiltered !== void 0 ? transactionsFiltered : false} isSorted={_this.state.sort !== null} reconcileAmount={reconcileAmount} search={_this.state.search} 
                // @ts-expect-error fix me
                filterConditions={_this.state.filterConditions} filterConditionsOp={_this.state.filterConditionsOp} onSearch={_this.onSearch} onShowTransactions={_this.onShowTransactions} onMenuSelect={_this.onMenuSelect} onAddTransaction={_this.onAddTransaction} onToggleExtraBalances={_this.onToggleExtraBalances} onSaveName={_this.onSaveName} saveNameError={_this.state.nameError} onReconcile={_this.onReconcile} onDoneReconciling={_this.onDoneReconciling} onCreateReconciliationTransaction={_this.onCreateReconciliationTransaction} onSync={_this.onSync} onImport={_this.onImport} onBatchDelete={_this.onBatchDelete} onBatchDuplicate={_this.onBatchDuplicate} onRunRules={_this.onRunRules} onBatchEdit={_this.onBatchEdit} onBatchLinkSchedule={_this.onBatchLinkSchedule} onBatchUnlinkSchedule={_this.onBatchUnlinkSchedule} onCreateRule={_this.onCreateRule} onUpdateFilter={_this.onUpdateFilter} onClearFilters={_this.onClearFilters} onReloadSavedFilter={_this.onReloadSavedFilter} onConditionsOpChange={_this.onConditionsOpChange} onDeleteFilter={_this.onDeleteFilter} onApplyFilter={_this.onApplyFilter} onScheduleAction={_this.onScheduleAction} onSetTransfer={_this.onSetTransfer} onMakeAsSplitTransaction={_this.onMakeAsSplitTransaction} onMakeAsNonSplitTransactions={_this.onMakeAsNonSplitTransactions} onMergeTransactions={_this.onMergeTransactions}/>

              <view_1.View style={{ flex: 1 }}>
                <TransactionList_1.TransactionList headerContent={undefined} 
                // @ts-ignore TODO
                tableRef={_this.table} account={account} transactions={transactions} allTransactions={allTransactions} loadMoreTransactions={function () {
                        return _this.paged && _this.paged.fetchNext();
                    }} accounts={accounts} category={category} categoryGroups={categoryGroups} payees={payees} balances={allBalances} showBalances={!!allBalances} showReconciled={showReconciled} showCleared={!!showCleared} showAccount={!accountId ||
                        accountId === 'offbudget' ||
                        accountId === 'onbudget' ||
                        accountId === 'uncategorized'} isAdding={_this.state.isAdding} isNew={_this.isNew} isMatched={_this.isMatched} isFiltered={transactionsFiltered} dateFormat={dateFormat} hideFraction={hideFraction} renderEmpty={function () {
                        return showEmptyMessage ? (<AccountEmptyMessage_1.AccountEmptyMessage onAdd={function () {
                                return _this.props.dispatch((0, modalsSlice_1.replaceModal)({
                                    modal: { name: 'add-account', options: {} },
                                }));
                            }}/>) : !loading ? (<view_1.View style={{
                                color: theme_1.theme.tableText,
                                marginTop: 20,
                                textAlign: 'center',
                                fontStyle: 'italic',
                            }}>
                        <react_i18next_1.Trans>No transactions</react_i18next_1.Trans>
                      </view_1.View>) : null;
                    }} onSort={_this.onSort} sortField={(_c = (_b = _this.state.sort) === null || _b === void 0 ? void 0 : _b.field) !== null && _c !== void 0 ? _c : ''} ascDesc={(_e = (_d = _this.state.sort) === null || _d === void 0 ? void 0 : _d.ascDesc) !== null && _e !== void 0 ? _e : 'asc'} onChange={_this.onTransactionsChange} onBatchDelete={_this.onBatchDelete} onBatchDuplicate={_this.onBatchDuplicate} onBatchLinkSchedule={_this.onBatchLinkSchedule} onBatchUnlinkSchedule={_this.onBatchUnlinkSchedule} onCreateRule={_this.onCreateRule} onScheduleAction={_this.onScheduleAction} onMakeAsNonSplitTransactions={_this.onMakeAsNonSplitTransactions} onRefetch={_this.refetchTransactions} onCloseAddTransaction={function () {
                        return _this.setState({ isAdding: false });
                    }} onCreatePayee={_this.onCreatePayee} onApplyFilter={_this.onApplyFilter}/>
              </view_1.View>
            </view_1.View>
          </useSelected_1.SelectedProviderWithItems>);
            }}
      </AllTransactions>);
    };
    return AccountInternal;
}(react_1.PureComponent));
function AccountHack(props) {
    var splitsExpandedDispatch = (0, useSplitsExpanded_1.useSplitsExpanded)().dispatch;
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, useTransactionBatchActions_1.useTransactionBatchActions)(), onBatchEdit = _a.onBatchEdit, onBatchDuplicate = _a.onBatchDuplicate, onBatchLinkSchedule = _a.onBatchLinkSchedule, onBatchUnlinkSchedule = _a.onBatchUnlinkSchedule, onBatchDelete = _a.onBatchDelete, onSetTransfer = _a.onSetTransfer;
    return (<AccountInternal dispatch={dispatch} splitsExpandedDispatch={splitsExpandedDispatch} onBatchEdit={onBatchEdit} onBatchDuplicate={onBatchDuplicate} onBatchLinkSchedule={onBatchLinkSchedule} onBatchUnlinkSchedule={onBatchUnlinkSchedule} onBatchDelete={onBatchDelete} onSetTransfer={onSetTransfer} {...props}/>);
}
function Account() {
    var _a, _b;
    var params = (0, react_router_1.useParams)();
    var location = (0, react_router_1.useLocation)();
    var categoryGroups = (0, useCategories_1.useCategories)().grouped;
    var newTransactions = (0, redux_1.useSelector)(function (state) { return state.transactions.newTransactions; });
    var matchedTransactions = (0, redux_1.useSelector)(function (state) { return state.transactions.matchedTransactions; });
    var accounts = (0, useAccounts_1.useAccounts)();
    var payees = (0, usePayees_1.usePayees)();
    var failedAccounts = (0, useFailedAccounts_1.useFailedAccounts)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var hideFraction = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var expandSplits = (0, useLocalPref_1.useLocalPref)('expand-splits')[0];
    var _c = (0, useSyncedPref_1.useSyncedPref)("show-balances-".concat(params.id)), showBalances = _c[0], setShowBalances = _c[1];
    var _d = (0, useSyncedPref_1.useSyncedPref)("show-account-".concat(params.id, "-net-worth-chart")), showNetWorthChart = _d[0], setShowNetWorthChart = _d[1];
    var _e = (0, useSyncedPref_1.useSyncedPref)("hide-cleared-".concat(params.id)), hideCleared = _e[0], setHideCleared = _e[1];
    var _f = (0, useSyncedPref_1.useSyncedPref)("hide-reconciled-".concat(params.id)), hideReconciled = _f[0], setHideReconciled = _f[1];
    var _g = (0, useSyncedPref_1.useSyncedPref)("show-extra-balances-".concat(params.id || 'all-accounts')), showExtraBalances = _g[0], setShowExtraBalances = _g[1];
    var modalShowing = (0, redux_1.useSelector)(function (state) { return state.modals.modalStack.length > 0; });
    var accountsSyncing = (0, redux_1.useSelector)(function (state) { return state.account.accountsSyncing; });
    var filterConditions = ((_a = location === null || location === void 0 ? void 0 : location.state) === null || _a === void 0 ? void 0 : _a.filterConditions) || [];
    var savedFiters = (0, useTransactionFilters_1.useTransactionFilters)();
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, useSchedules_1.getSchedulesQuery)(params.id); }, [params.id]);
    return (<useCachedSchedules_1.SchedulesProvider query={schedulesQuery}>
      <useSplitsExpanded_1.SplitsExpandedProvider initialMode={expandSplits ? 'collapse' : 'expand'}>
        <AccountHack newTransactions={newTransactions} matchedTransactions={matchedTransactions} accounts={accounts} failedAccounts={failedAccounts} dateFormat={dateFormat} hideFraction={String(hideFraction) === 'true'} expandSplits={expandSplits} showBalances={String(showBalances) === 'true'} setShowBalances={function (showBalances) {
            return setShowBalances(String(showBalances));
        }} showNetWorthChart={String(showNetWorthChart) === 'true'} setShowNetWorthChart={function (val) { return setShowNetWorthChart(String(val)); }} showCleared={String(hideCleared) !== 'true'} setShowCleared={function (val) { return setHideCleared(String(!val)); }} showReconciled={String(hideReconciled) !== 'true'} setShowReconciled={function (val) { return setHideReconciled(String(!val)); }} showExtraBalances={String(showExtraBalances) === 'true'} setShowExtraBalances={function (extraBalances) {
            return setShowExtraBalances(String(extraBalances));
        }} payees={payees} modalShowing={modalShowing} accountsSyncing={accountsSyncing} filterConditions={filterConditions} categoryGroups={categoryGroups} accountId={params.id} categoryId={(_b = location === null || location === void 0 ? void 0 : location.state) === null || _b === void 0 ? void 0 : _b.categoryId} location={location} savedFilters={savedFiters}/>
      </useSplitsExpanded_1.SplitsExpandedProvider>
    </useCachedSchedules_1.SchedulesProvider>);
}
