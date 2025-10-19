import { t } from 'i18next';
export function validateAccountName(newAccountName, accountId, accounts) {
    newAccountName = newAccountName.trim();
    if (newAccountName.length) {
        const duplicateNamedAccounts = accounts.filter(account => account.name === newAccountName && account.id !== accountId);
        if (duplicateNamedAccounts.length) {
            return t('Name {{ newAccountName }} already exists.', { newAccountName });
        }
        else {
            return '';
        }
    }
    else {
        return t('Name cannot be blank.');
    }
}
