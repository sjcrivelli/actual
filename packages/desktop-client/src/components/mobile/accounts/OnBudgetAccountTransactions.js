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
exports.OnBudgetAccountTransactions = OnBudgetAccountTransactions;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var transactions_1 = require("loot-core/shared/transactions");
var TransactionListWithBalances_1 = require("@desktop-client/components/mobile/transactions/TransactionListWithBalances");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useOnBudgetAccounts_1 = require("@desktop-client/hooks/useOnBudgetAccounts");
var usePreviewTransactions_1 = require("@desktop-client/hooks/usePreviewTransactions");
var useSchedules_1 = require("@desktop-client/hooks/useSchedules");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var useTransactionsSearch_1 = require("@desktop-client/hooks/useTransactionsSearch");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var queries = require("@desktop-client/queries");
var redux_1 = require("@desktop-client/redux");
var bindings = require("@desktop-client/spreadsheet/bindings");
function OnBudgetAccountTransactions() {
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, useSchedules_1.getSchedulesQuery)('onbudget'); }, []);
    return (<useCachedSchedules_1.SchedulesProvider query={schedulesQuery}>
      <TransactionListWithPreviews />
    </useCachedSchedules_1.SchedulesProvider>);
}
function TransactionListWithPreviews() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var baseTransactionsQuery = (0, react_1.useCallback)(function () {
        return queries.transactions('onbudget').options({ splits: 'all' }).select('*');
    }, []);
    var _a = (0, react_1.useState)(baseTransactionsQuery()), transactionsQuery = _a[0], setTransactionsQuery = _a[1];
    var _b = (0, useTransactions_1.useTransactions)({
        query: transactionsQuery,
    }), transactions = _b.transactions, isTransactionsLoading = _b.isLoading, reloadTransactions = _b.reload, isLoadingMore = _b.isLoadingMore, loadMoreTransactions = _b.loadMore;
    var onBudgetAccounts = (0, useOnBudgetAccounts_1.useOnBudgetAccounts)();
    var onBudgetAccountsFilter = (0, react_1.useCallback)(function (schedule) {
        return onBudgetAccounts.some(function (a) { return a.id === schedule._account; });
    }, [onBudgetAccounts]);
    var _c = (0, usePreviewTransactions_1.usePreviewTransactions)({
        filter: onBudgetAccountsFilter,
    }), previewTransactions = _c.previewTransactions, isPreviewTransactionsLoading = _c.isLoading;
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        return (0, fetch_1.listen)('sync-event', function (event) {
            if (event.type === 'applied') {
                var tables = event.tables;
                if (tables.includes('transactions') ||
                    tables.includes('category_mapping') ||
                    tables.includes('payee_mapping')) {
                    reloadTransactions();
                }
            }
        });
    }, [reloadTransactions]);
    var _d = (0, useTransactionsSearch_1.useTransactionsSearch)({
        updateQuery: setTransactionsQuery,
        resetQuery: function () { return setTransactionsQuery(baseTransactionsQuery()); },
        dateFormat: dateFormat,
    }), isSearching = _d.isSearching, onSearch = _d.search;
    var onOpenTransaction = (0, react_1.useCallback)(function (transaction) {
        if (!(0, transactions_1.isPreviewId)(transaction.id)) {
            navigate("/transactions/".concat(transaction.id));
        }
        else {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'scheduled-transaction-menu',
                    options: {
                        transactionId: transaction.id,
                        onPost: function (transactionId) { return __awaiter(_this, void 0, void 0, function () {
                            var parts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        parts = transactionId.split('/');
                                        return [4 /*yield*/, (0, fetch_1.send)('schedule/post-transaction', { id: parts[1] })];
                                    case 1:
                                        _a.sent();
                                        dispatch((0, modalsSlice_1.collapseModals)({
                                            rootModalName: 'scheduled-transaction-menu',
                                        }));
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        onSkip: function (transactionId) { return __awaiter(_this, void 0, void 0, function () {
                            var parts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        parts = transactionId.split('/');
                                        return [4 /*yield*/, (0, fetch_1.send)('schedule/skip-next-date', { id: parts[1] })];
                                    case 1:
                                        _a.sent();
                                        dispatch((0, modalsSlice_1.collapseModals)({
                                            rootModalName: 'scheduled-transaction-menu',
                                        }));
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                        onComplete: function (transactionId) { return __awaiter(_this, void 0, void 0, function () {
                            var parts;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        parts = transactionId.split('/');
                                        return [4 /*yield*/, (0, fetch_1.send)('schedule/update', {
                                                schedule: { id: parts[1], completed: true },
                                            })];
                                    case 1:
                                        _a.sent();
                                        dispatch((0, modalsSlice_1.collapseModals)({
                                            rootModalName: 'scheduled-transaction-menu',
                                        }));
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                    },
                },
            }));
        }
    }, [dispatch, navigate]);
    var balanceBindings = (0, react_1.useMemo)(function () { return ({
        balance: bindings.onBudgetAccountBalance(),
    }); }, []);
    var transactionsToDisplay = !isSearching
        ? // Do not render child transactions in the list, unless searching
            previewTransactions.concat(transactions.filter(function (t) { return !t.is_child; }))
        : transactions;
    return (<TransactionListWithBalances_1.TransactionListWithBalances isLoading={isSearching ? isTransactionsLoading : isPreviewTransactionsLoading} transactions={transactionsToDisplay} balance={balanceBindings.balance} isLoadingMore={isLoadingMore} onLoadMore={loadMoreTransactions} searchPlaceholder={t('Search On Budget Accounts')} onSearch={onSearch} onOpenTransaction={onOpenTransaction} showMakeTransfer={true}/>);
}
