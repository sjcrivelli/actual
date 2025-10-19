import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { q } from 'loot-core/shared/query';
import { useAccounts } from './useAccounts';
import { usePayeesById } from './usePayees';
import { useTransactions } from './useTransactions';
export function useDisplayPayee({ transaction }) {
    const { t } = useTranslation();
    const subtransactionsQuery = useMemo(() => q('transactions').filter({ parent_id: transaction?.id }).select('*'), [transaction?.id]);
    const { transactions: subtransactions = [] } = useTransactions({
        query: subtransactionsQuery,
    });
    const accounts = useAccounts();
    const payeesById = usePayeesById();
    const payee = payeesById[transaction?.payee || ''];
    return useMemo(() => {
        if (subtransactions.length === 0) {
            return getPrettyPayee({
                t,
                transaction,
                payee,
                transferAccount: accounts.find(a => a.id === payeesById[transaction?.payee || '']?.transfer_acct),
            });
        }
        const { counts, mostCommonPayeeTransaction } = subtransactions?.reduce(({ counts, ...result }, sub) => {
            if (sub.payee) {
                counts[sub.payee] = (counts[sub.payee] || 0) + 1;
                if (counts[sub.payee] > result.maxCount) {
                    return {
                        counts,
                        maxCount: counts[sub.payee],
                        mostCommonPayeeTransaction: sub,
                    };
                }
            }
            return { counts, ...result };
        }, { counts: {}, maxCount: 0, mostCommonPayeeTransaction: null }) || {};
        if (!mostCommonPayeeTransaction) {
            return t('Split (no payee)');
        }
        const mostCommonPayee = payeesById[mostCommonPayeeTransaction.payee || ''];
        if (!mostCommonPayee) {
            return t('Split (no payee)');
        }
        const numDistinctPayees = Object.keys(counts).length;
        return getPrettyPayee({
            t,
            transaction: mostCommonPayeeTransaction,
            payee: mostCommonPayee,
            transferAccount: accounts.find(a => a.id ===
                payeesById[mostCommonPayeeTransaction.payee || '']?.transfer_acct),
            numHiddenPayees: numDistinctPayees - 1,
        });
    }, [subtransactions, payeesById, accounts, transaction, payee, t]);
}
function getPrettyPayee({ t, transaction, payee, transferAccount, numHiddenPayees = 0, }) {
    if (!transaction) {
        return '';
    }
    const formatPayeeName = (payeeName) => numHiddenPayees > 0
        ? `${payeeName} ${t('(+{{numHiddenPayees}} more)', {
            numHiddenPayees,
        })}`
        : payeeName;
    const { payee: payeeId } = transaction;
    if (transferAccount) {
        return formatPayeeName(transferAccount.name);
    }
    else if (payee) {
        return formatPayeeName(payee.name);
    }
    else if (payeeId && payeeId.startsWith('new:')) {
        return formatPayeeName(payeeId.slice('new:'.length));
    }
    return '';
}
