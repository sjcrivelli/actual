"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryTransactions = CategoryTransactions;
var react_1 = require("react");
var fetch_1 = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var transactions_1 = require("loot-core/shared/transactions");
var TransactionListWithBalances_1 = require("@desktop-client/components/mobile/transactions/TransactionListWithBalances");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useCategoryPreviewTransactions_1 = require("@desktop-client/hooks/useCategoryPreviewTransactions");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var useTransactionsSearch_1 = require("@desktop-client/hooks/useTransactionsSearch");
var redux_1 = require("@desktop-client/redux");
var bindings = require("@desktop-client/spreadsheet/bindings");
function CategoryTransactions(_a) {
    var category = _a.category, month = _a.month;
    var schedulesQuery = (0, react_1.useMemo)(function () { return (0, query_1.q)('schedules').select('*'); }, []);
    return (<useCachedSchedules_1.SchedulesProvider query={schedulesQuery}>
      <TransactionListWithPreviews category={category} month={month}/>
    </useCachedSchedules_1.SchedulesProvider>);
}
function TransactionListWithPreviews(_a) {
    var category = _a.category, month = _a.month;
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var baseTransactionsQuery = (0, react_1.useCallback)(function () {
        return (0, query_1.q)('transactions')
            .options({ splits: 'inline' })
            .filter(getCategoryMonthFilter(category, month))
            .select('*');
    }, [category, month]);
    var _b = (0, react_1.useState)(baseTransactionsQuery()), transactionsQuery = _b[0], setTransactionsQuery = _b[1];
    var _c = (0, useTransactions_1.useTransactions)({
        query: transactionsQuery,
    }), transactions = _c.transactions, isTransactionsLoading = _c.isLoading, isLoadingMore = _c.isLoadingMore, loadMoreTransactions = _c.loadMore, reloadTransactions = _c.reload;
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
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
    }, [dispatch, reloadTransactions]);
    var _d = (0, useTransactionsSearch_1.useTransactionsSearch)({
        updateQuery: setTransactionsQuery,
        resetQuery: function () { return setTransactionsQuery(baseTransactionsQuery()); },
        dateFormat: dateFormat,
    }), isSearching = _d.isSearching, onSearch = _d.search;
    var onOpenTransaction = (0, react_1.useCallback)(function (transaction) {
        // details of how the native app used to handle preview transactions here can be found at commit 05e58279
        if (!(0, transactions_1.isPreviewId)(transaction.id)) {
            navigate("/transactions/".concat(transaction.id));
        }
    }, [navigate]);
    var balance = bindings.categoryBalance(category.id, month);
    var balanceCleared = bindings.categoryBalanceCleared(category.id, month);
    var balanceUncleared = bindings.categoryBalanceUncleared(category.id, month);
    var _e = (0, useCategoryPreviewTransactions_1.useCategoryPreviewTransactions)({
        categoryId: category.id,
        month: month,
    }), previewTransactions = _e.previewTransactions, isPreviewTransactionsLoading = _e.isLoading;
    var transactionsToDisplay = !isSearching
        ? previewTransactions.concat(transactions)
        : transactions;
    return (<TransactionListWithBalances_1.TransactionListWithBalances isLoading={isSearching ? isTransactionsLoading : isPreviewTransactionsLoading} transactions={transactionsToDisplay} balance={balance} balanceCleared={balanceCleared} balanceUncleared={balanceUncleared} searchPlaceholder={"Search ".concat(category.name)} onSearch={onSearch} isLoadingMore={isLoadingMore} onLoadMore={loadMoreTransactions} onOpenTransaction={onOpenTransaction}/>);
}
function getCategoryMonthFilter(category, month) {
    return {
        category: category.id,
        date: { $transform: '$month', $eq: month },
    };
}
