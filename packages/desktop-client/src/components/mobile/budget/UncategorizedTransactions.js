"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UncategorizedTransactions = UncategorizedTransactions;
var react_1 = require("react");
var fetch_1 = require("loot-core/platform/client/fetch");
var transactions_1 = require("loot-core/shared/transactions");
var TransactionListWithBalances_1 = require("@desktop-client/components/mobile/transactions/TransactionListWithBalances");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var useTransactionsSearch_1 = require("@desktop-client/hooks/useTransactionsSearch");
var queries_1 = require("@desktop-client/queries");
var redux_1 = require("@desktop-client/redux");
var bindings = require("@desktop-client/spreadsheet/bindings");
function UncategorizedTransactions() {
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var baseTransactionsQuery = (0, react_1.useCallback)(function () { return (0, queries_1.uncategorizedTransactions)().options({ splits: 'inline' }).select('*'); }, []);
    var _a = (0, react_1.useState)(baseTransactionsQuery()), transactionsQuery = _a[0], setTransactionsQuery = _a[1];
    var _b = (0, useTransactions_1.useTransactions)({
        query: transactionsQuery,
    }), transactions = _b.transactions, isLoading = _b.isLoading, isLoadingMore = _b.isLoadingMore, loadMoreTransactions = _b.loadMore, reloadTransactions = _b.reload;
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
    var onSearch = (0, useTransactionsSearch_1.useTransactionsSearch)({
        updateQuery: setTransactionsQuery,
        resetQuery: function () { return setTransactionsQuery(baseTransactionsQuery()); },
        dateFormat: dateFormat,
    }).search;
    var onOpenTransaction = (0, react_1.useCallback)(function (transaction) {
        // details of how the native app used to handle preview transactions here can be found at commit 05e58279
        if (!(0, transactions_1.isPreviewId)(transaction.id)) {
            navigate("/transactions/".concat(transaction.id));
        }
    }, [navigate]);
    var balance = bindings.uncategorizedBalance();
    return (<useCachedSchedules_1.SchedulesProvider>
      <TransactionListWithBalances_1.TransactionListWithBalances isLoading={isLoading} transactions={transactions} balance={balance} searchPlaceholder="Search uncategorized transactions" onSearch={onSearch} isLoadingMore={isLoadingMore} onLoadMore={loadMoreTransactions} onOpenTransaction={onOpenTransaction}/>
    </useCachedSchedules_1.SchedulesProvider>);
}
