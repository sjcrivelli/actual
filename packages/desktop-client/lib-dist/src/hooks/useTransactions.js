import { useEffect, useRef, useState, useCallback } from 'react';
import { pagedQuery, } from '@desktop-client/queries/pagedQuery';
export function useTransactions({ query, options = { pageCount: 50, calculateRunningBalances: false }, }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(undefined);
    const [transactions, setTransactions] = useState([]);
    const [runningBalances, setRunningBalances] = useState(new Map());
    const pagedQueryRef = useRef(null);
    // We don't want to re-render if options changes.
    // Putting options in a ref will prevent that and
    // allow us to use the latest options on next render.
    const optionsRef = useRef(options);
    optionsRef.current = options;
    useEffect(() => {
        let isUnmounted = false;
        setError(undefined);
        if (!query) {
            return;
        }
        function onError(error) {
            if (!isUnmounted) {
                setError(error);
                setIsLoading(false);
            }
        }
        if (query.state.table !== 'transactions') {
            onError(new Error('Query must be a transactions query.'));
            return;
        }
        setIsLoading(true);
        pagedQueryRef.current = pagedQuery(query, {
            onData: data => {
                if (!isUnmounted) {
                    setTransactions(data);
                    const calculateFn = getCalculateRunningBalancesFn(optionsRef.current?.calculateRunningBalances);
                    if (calculateFn) {
                        setRunningBalances(calculateFn(data, query.state.tableOptions?.splits, optionsRef.current?.startingBalance));
                    }
                    setIsLoading(false);
                }
            },
            onError,
            options: optionsRef.current.pageCount
                ? { pageCount: optionsRef.current.pageCount }
                : {},
        });
        return () => {
            isUnmounted = true;
            pagedQueryRef.current?.unsubscribe();
        };
    }, [query]);
    const loadMore = useCallback(async () => {
        if (!pagedQueryRef.current) {
            return;
        }
        setIsLoadingMore(true);
        await pagedQueryRef.current
            .fetchNext()
            .catch(setError)
            .finally(() => {
            setIsLoadingMore(false);
        });
    }, []);
    const reload = useCallback(() => {
        pagedQueryRef.current?.run();
    }, []);
    return {
        transactions,
        runningBalances,
        isLoading,
        ...(error && { error }),
        reload,
        loadMore,
        isLoadingMore,
    };
}
function getCalculateRunningBalancesFn(calculateRunningBalances = false) {
    return calculateRunningBalances === true
        ? calculateRunningBalancesBottomUp
        : typeof calculateRunningBalances === 'function'
            ? calculateRunningBalances
            : undefined;
}
export function calculateRunningBalancesBottomUp(transactions, splits, startingBalance = 0) {
    return (transactions
        .filter(t => {
        switch (splits) {
            case 'all':
                // Only calculate parent/non-split amounts
                return !t.parent_id;
            default:
                // inline
                // grouped
                // none
                return true;
        }
    })
        // We're using `reduceRight` here to calculate the running balance in reverse order (bottom up).
        .reduceRight((acc, transaction, index, arr) => {
        const previousTransactionIndex = index + 1;
        if (previousTransactionIndex >= arr.length) {
            // This is the last transaction in the list,
            // so we set the running balance to the starting balance + the amount of the transaction
            acc.set(transaction.id, startingBalance + transaction.amount);
            return acc;
        }
        const previousTransaction = arr[previousTransactionIndex];
        const previousRunningBalance = acc.get(previousTransaction.id) ?? 0;
        const currentRunningBalance = previousRunningBalance + transaction.amount;
        acc.set(transaction.id, currentRunningBalance);
        return acc;
    }, new Map()));
}
export function calculateRunningBalancesTopDown(transactions, splits, startingBalance = 0) {
    return transactions
        .filter(t => {
        switch (splits) {
            case 'all':
                // Only calculate parent/non-split amounts
                return !t.parent_id;
            default:
                // inline
                // grouped
                // none
                return true;
        }
    })
        .reduce((acc, transaction, index, arr) => {
        if (index === 0) {
            // This is the first transaction in the list,
            // so we set the running balance to the starting balance
            acc.set(transaction.id, startingBalance);
            return acc;
        }
        if (index === arr.length - 1) {
            // This is the last transaction in the list,
            // so we set the running balance to the amount of the transaction
            acc.set(transaction.id, transaction.amount);
            return acc;
        }
        const previousTransaction = arr[index - 1];
        const previousRunningBalance = acc.get(previousTransaction.id) ?? 0;
        const previousAmount = previousTransaction.amount ?? 0;
        const currentRunningBalance = previousRunningBalance - previousAmount;
        acc.set(transaction.id, currentRunningBalance);
        return acc;
    }, new Map());
}
