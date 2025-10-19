import { useCallback, useMemo } from 'react';
import { groupById } from 'loot-core/shared/util';
import { useAccounts } from './useAccounts';
import { usePayees } from './usePayees';
import { usePreviewTransactions } from './usePreviewTransactions';
import { useSheetValue } from './useSheetValue';
import { useSyncedPref } from './useSyncedPref';
import { calculateRunningBalancesBottomUp } from './useTransactions';
import * as bindings from '@desktop-client/spreadsheet/bindings';
/**
 * Preview transactions for a given account or all accounts if no `accountId` is provided.
 * This will invert the payees, accounts, and amounts accordingly depending on which account
 * the preview transactions are being viewed from.
 */
export function useAccountPreviewTransactions({ accountId, }) {
    const accounts = useAccounts();
    const accountsById = useMemo(() => groupById(accounts), [accounts]);
    const payees = usePayees();
    const payeesById = useMemo(() => groupById(payees), [payees]);
    const getPayeeByTransferAccount = useCallback((transferAccountId) => payees.find(p => p.transfer_acct === transferAccountId) || null, [payees]);
    const getTransferAccountByPayee = useCallback((payeeId) => {
        if (!payeeId) {
            return null;
        }
        const transferAccountId = payeesById[payeeId]?.transfer_acct;
        if (!transferAccountId) {
            return null;
        }
        return accountsById[transferAccountId];
    }, [accountsById, payeesById]);
    const accountSchedulesFilter = useCallback((schedule) => !accountId ||
        schedule._account === accountId ||
        getTransferAccountByPayee(schedule._payee)?.id === accountId, [accountId, getTransferAccountByPayee]);
    const accountBalanceValue = useSheetValue(accountId
        ? bindings.accountBalance(accountId)
        : bindings.allAccountBalance());
    const [showBalances] = useSyncedPref(`show-balances-${accountId}`);
    const { previewTransactions: allPreviewTransactions, runningBalances: allRunningBalances, isLoading, error, } = usePreviewTransactions({
        filter: accountSchedulesFilter,
        options: {
            calculateRunningBalances: showBalances === 'true',
            startingBalance: accountBalanceValue ?? 0,
        },
    });
    return useMemo(() => {
        if (!accountId) {
            return {
                previewTransactions: allPreviewTransactions,
                runningBalances: allRunningBalances,
                isLoading,
                error,
            };
        }
        const { transactions: previewTransactions, runningBalances: previewRunningBalances, } = inverseBasedOnAccount({
            accountId,
            transactions: allPreviewTransactions,
            runningBalances: allRunningBalances,
            startingBalance: accountBalanceValue ?? 0,
            getPayeeByTransferAccount,
            getTransferAccountByPayee,
        });
        const transactionIds = new Set(previewTransactions.map(t => t.id));
        const runningBalances = new Map([...previewRunningBalances.entries()].filter(([id]) => transactionIds.has(id)));
        return {
            isLoading,
            previewTransactions,
            runningBalances,
            error,
        };
    }, [
        accountId,
        allPreviewTransactions,
        accountBalanceValue,
        allRunningBalances,
        getPayeeByTransferAccount,
        getTransferAccountByPayee,
        isLoading,
        error,
    ]);
}
function inverseBasedOnAccount({ accountId, transactions, runningBalances, startingBalance, getPayeeByTransferAccount, getTransferAccountByPayee, }) {
    const mappedTransactions = transactions.map(transaction => {
        const inverse = transaction.account !== accountId;
        const subtransactions = transaction.subtransactions?.map(st => ({
            ...st,
            amount: inverse ? -st.amount : st.amount,
            payee: (inverse ? getPayeeByTransferAccount(st.account)?.id : st.payee) || '',
            account: inverse
                ? getTransferAccountByPayee(st.payee)?.id || ''
                : st.account,
        }));
        return {
            inversed: inverse,
            ...transaction,
            amount: inverse ? -transaction.amount : transaction.amount,
            payee: (inverse
                ? getPayeeByTransferAccount(transaction.account)?.id
                : transaction.payee) || '',
            account: inverse
                ? getTransferAccountByPayee(transaction.payee)?.id || ''
                : transaction.account,
            ...(subtransactions && { subtransactions }),
        };
    });
    // Recalculate running balances if any transaction was inversed.
    // This is necessary because the running balances are calculated based on the
    // original transaction amounts and accounts, and we need to adjust them
    // based on the inversed transactions.
    const anyInversed = mappedTransactions.some(t => t.inversed);
    const mappedRunningBalances = anyInversed
        ? calculateRunningBalancesBottomUp(mappedTransactions, 'all', startingBalance ?? 0)
        : runningBalances;
    return {
        transactions: mappedTransactions,
        runningBalances: mappedRunningBalances,
    };
}
