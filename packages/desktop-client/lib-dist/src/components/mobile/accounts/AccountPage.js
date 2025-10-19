import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { AccountTransactions } from './AccountTransactions';
import { AllAccountTransactions } from './AllAccountTransactions';
import { OffBudgetAccountTransactions } from './OffBudgetAccountTransactions';
import { OnBudgetAccountTransactions } from './OnBudgetAccountTransactions';
import { reopenAccount, updateAccount, } from '@desktop-client/accounts/accountsSlice';
import { MobileBackButton } from '@desktop-client/components/mobile/MobileBackButton';
import { AddTransactionButton } from '@desktop-client/components/mobile/transactions/AddTransactionButton';
import { MobilePageHeader, Page } from '@desktop-client/components/Page';
import { useAccount } from '@desktop-client/hooks/useAccount';
import { useFailedAccounts } from '@desktop-client/hooks/useFailedAccounts';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { openAccountCloseModal, pushModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch, useSelector } from '@desktop-client/redux';
export function AccountPage() {
    const { t } = useTranslation();
    const [_numberFormat] = useSyncedPref('numberFormat');
    const numberFormat = _numberFormat || 'comma-dot';
    const [hideFraction] = useSyncedPref('hideFraction');
    const { id: accountIdParam } = useParams();
    const account = useAccount(accountIdParam || '');
    const nameFromId = useCallback((id) => {
        switch (id) {
            case 'onbudget':
                return t('On Budget Accounts');
            case 'offbudget':
                return t('Off Budget Accounts');
            case 'uncategorized':
                return t('Uncategorized');
            case 'closed':
                return t('Closed Accounts');
            default:
                return t('All Accounts');
        }
    }, [t]);
    return (_jsx(Page, { header: _jsx(MobilePageHeader, { title: account ? (_jsx(AccountHeader, { account: account })) : (_jsx(NameOnlyHeader, { name: nameFromId(accountIdParam) })), leftContent: _jsx(MobileBackButton, {}), rightContent: _jsx(AddTransactionButton, { accountId: account?.id }) }), padding: 0, children: _jsx(Fragment, { children: account ? (_jsx(AccountTransactions, { account: account })) : accountIdParam === 'onbudget' ? (_jsx(OnBudgetAccountTransactions, {})) : accountIdParam === 'offbudget' ? (_jsx(OffBudgetAccountTransactions, {})) : (_jsx(AllAccountTransactions, {})) }, numberFormat + hideFraction) }));
}
function AccountHeader({ account }) {
    const failedAccounts = useFailedAccounts();
    const { t } = useTranslation();
    const syncingAccountIds = useSelector(state => state.account.accountsSyncing);
    const pending = useMemo(() => syncingAccountIds.includes(account.id), [syncingAccountIds, account.id]);
    const failed = useMemo(() => failedAccounts.has(account.id), [failedAccounts, account.id]);
    const dispatch = useDispatch();
    const onSave = useCallback((account) => {
        dispatch(updateAccount({ account }));
    }, [dispatch]);
    const onSaveNotes = useCallback(async (id, notes) => {
        await send('notes-save', { id, note: notes });
    }, []);
    const onEditNotes = useCallback((id) => {
        dispatch(pushModal({
            modal: {
                name: 'notes',
                options: {
                    id: `account-${id}`,
                    name: account.name,
                    onSave: onSaveNotes,
                },
            },
        }));
    }, [account.name, dispatch, onSaveNotes]);
    const onCloseAccount = useCallback(() => {
        dispatch(openAccountCloseModal({ accountId: account.id }));
    }, [account.id, dispatch]);
    const onReopenAccount = useCallback(() => {
        dispatch(reopenAccount({ id: account.id }));
    }, [account.id, dispatch]);
    const onClick = useCallback(() => {
        dispatch(pushModal({
            modal: {
                name: 'account-menu',
                options: {
                    accountId: account.id,
                    onSave,
                    onEditNotes,
                    onCloseAccount,
                    onReopenAccount,
                },
            },
        }));
    }, [
        account.id,
        dispatch,
        onCloseAccount,
        onEditNotes,
        onReopenAccount,
        onSave,
    ]);
    return (_jsxs(View, { style: {
            flexDirection: 'row',
        }, children: [account.bank && (_jsx(View, { style: {
                    margin: 'auto',
                    marginRight: 5,
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    flexShrink: 0,
                    backgroundColor: pending
                        ? theme.sidebarItemBackgroundPending
                        : failed
                            ? theme.sidebarItemBackgroundFailed
                            : theme.sidebarItemBackgroundPositive,
                    transition: 'transform .3s',
                } })), _jsx(Button, { variant: "bare", onPress: onClick, children: _jsx(Text, { style: {
                        fontSize: 17,
                        fontWeight: 500,
                        ...styles.underlinedText,
                        ...styles.lineClamp(2),
                    }, children: account.closed
                        ? t('Closed: {{accountName}}', { accountName: account.name })
                        : account.name }) })] }));
}
function NameOnlyHeader({ name }) {
    return (_jsx(View, { style: {
            flexDirection: 'row',
        }, children: _jsx(Text, { style: { ...styles.lineClamp(2) }, children: name }) }));
}
