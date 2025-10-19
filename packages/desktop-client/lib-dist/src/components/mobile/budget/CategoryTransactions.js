import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listen } from 'loot-core/platform/client/fetch';
import { q } from 'loot-core/shared/query';
import { isPreviewId } from 'loot-core/shared/transactions';
import { TransactionListWithBalances } from '@desktop-client/components/mobile/transactions/TransactionListWithBalances';
import { SchedulesProvider } from '@desktop-client/hooks/useCachedSchedules';
import { useCategoryPreviewTransactions } from '@desktop-client/hooks/useCategoryPreviewTransactions';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useTransactions } from '@desktop-client/hooks/useTransactions';
import { useTransactionsSearch } from '@desktop-client/hooks/useTransactionsSearch';
import { useDispatch } from '@desktop-client/redux';
import * as bindings from '@desktop-client/spreadsheet/bindings';
export function CategoryTransactions({ category, month, }) {
    const schedulesQuery = useMemo(() => q('schedules').select('*'), []);
    return (_jsx(SchedulesProvider, { query: schedulesQuery, children: _jsx(TransactionListWithPreviews, { category: category, month: month }) }));
}
function TransactionListWithPreviews({ category, month, }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseTransactionsQuery = useCallback(() => q('transactions')
        .options({ splits: 'inline' })
        .filter(getCategoryMonthFilter(category, month))
        .select('*'), [category, month]);
    const [transactionsQuery, setTransactionsQuery] = useState(baseTransactionsQuery());
    const { transactions, isLoading: isTransactionsLoading, isLoadingMore, loadMore: loadMoreTransactions, reload: reloadTransactions, } = useTransactions({
        query: transactionsQuery,
    });
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    useEffect(() => {
        return listen('sync-event', event => {
            if (event.type === 'applied') {
                const tables = event.tables;
                if (tables.includes('transactions') ||
                    tables.includes('category_mapping') ||
                    tables.includes('payee_mapping')) {
                    reloadTransactions();
                }
            }
        });
    }, [dispatch, reloadTransactions]);
    const { isSearching, search: onSearch } = useTransactionsSearch({
        updateQuery: setTransactionsQuery,
        resetQuery: () => setTransactionsQuery(baseTransactionsQuery()),
        dateFormat,
    });
    const onOpenTransaction = useCallback((transaction) => {
        // details of how the native app used to handle preview transactions here can be found at commit 05e58279
        if (!isPreviewId(transaction.id)) {
            navigate(`/transactions/${transaction.id}`);
        }
    }, [navigate]);
    const balance = bindings.categoryBalance(category.id, month);
    const balanceCleared = bindings.categoryBalanceCleared(category.id, month);
    const balanceUncleared = bindings.categoryBalanceUncleared(category.id, month);
    const { previewTransactions, isLoading: isPreviewTransactionsLoading } = useCategoryPreviewTransactions({
        categoryId: category.id,
        month,
    });
    const transactionsToDisplay = !isSearching
        ? previewTransactions.concat(transactions)
        : transactions;
    return (_jsx(TransactionListWithBalances, { isLoading: isSearching ? isTransactionsLoading : isPreviewTransactionsLoading, transactions: transactionsToDisplay, balance: balance, balanceCleared: balanceCleared, balanceUncleared: balanceUncleared, searchPlaceholder: `Search ${category.name}`, onSearch: onSearch, isLoadingMore: isLoadingMore, onLoadMore: loadMoreTransactions, onOpenTransaction: onOpenTransaction }));
}
function getCategoryMonthFilter(category, month) {
    return {
        category: category.id,
        date: { $transform: '$month', $eq: month },
    };
}
