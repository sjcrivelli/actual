export function getPrettyPayee({ t, transaction, payee, transferAccount, }) {
    if (!transaction) {
        return '';
    }
    if (transferAccount) {
        return t('Transfer {{direction}} {{accountName}}', {
            direction: transaction?.amount > 0 ? t('from') : t('to'),
            accountName: transferAccount.name,
        });
    }
    else if (transaction.is_parent) {
        return t('Split');
    }
    else if (payee) {
        return payee.name;
    }
    return '';
}
