import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Account } from './Account';
import { SecondaryItem } from './SecondaryItem';
import { moveAccount } from '@desktop-client/accounts/accountsSlice';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useClosedAccounts } from '@desktop-client/hooks/useClosedAccounts';
import { useFailedAccounts } from '@desktop-client/hooks/useFailedAccounts';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { useOffBudgetAccounts } from '@desktop-client/hooks/useOffBudgetAccounts';
import { useOnBudgetAccounts } from '@desktop-client/hooks/useOnBudgetAccounts';
import { useUpdatedAccounts } from '@desktop-client/hooks/useUpdatedAccounts';
import { useSelector, useDispatch } from '@desktop-client/redux';
import * as bindings from '@desktop-client/spreadsheet/bindings';
const fontWeight = 600;
export function Accounts() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isDragging, setIsDragging] = useState(false);
    const accounts = useAccounts();
    const failedAccounts = useFailedAccounts();
    const updatedAccounts = useUpdatedAccounts();
    const offbudgetAccounts = useOffBudgetAccounts();
    const onBudgetAccounts = useOnBudgetAccounts();
    const closedAccounts = useClosedAccounts();
    const syncingAccountIds = useSelector(state => state.account.accountsSyncing);
    const getAccountPath = (account) => `/accounts/${account.id}`;
    const [showClosedAccounts, setShowClosedAccountsPref] = useLocalPref('ui.showClosedAccounts');
    function onDragChange(drag) {
        setIsDragging(drag.state === 'start');
    }
    const makeDropPadding = (i) => {
        if (i === 0) {
            return {
                paddingTop: isDragging ? 15 : 0,
                marginTop: isDragging ? -15 : 0,
            };
        }
        return undefined;
    };
    async function onReorder(id, dropPos, targetId) {
        let targetIdToMove = targetId;
        if (dropPos === 'bottom') {
            const idx = accounts.findIndex(a => a.id === targetId) + 1;
            targetIdToMove = idx < accounts.length ? accounts[idx].id : null;
        }
        dispatch(moveAccount({ id, targetId: targetIdToMove }));
    }
    const onToggleClosedAccounts = () => {
        setShowClosedAccountsPref(!showClosedAccounts);
    };
    return (_jsxs(View, { style: {
            flexGrow: 1,
            '@media screen and (max-height: 480px)': {
                minHeight: 'auto',
            },
        }, children: [_jsx(View, { style: {
                    height: 1,
                    backgroundColor: theme.sidebarItemBackgroundHover,
                    marginTop: 15,
                    flexShrink: 0,
                } }), _jsxs(View, { style: { overflow: 'auto' }, children: [_jsx(Account, { name: t('All accounts'), to: "/accounts", query: bindings.allAccountBalance(), style: { fontWeight, marginTop: 15 } }), onBudgetAccounts.length > 0 && (_jsx(Account, { name: t('On budget'), to: "/accounts/onbudget", query: bindings.onBudgetAccountBalance(), style: {
                            fontWeight,
                            marginTop: 13,
                            marginBottom: 5,
                        }, titleAccount: true })), onBudgetAccounts.map((account, i) => (_jsx(Account, { name: account.name, account: account, connected: !!account.bank, pending: syncingAccountIds.includes(account.id), failed: failedAccounts.has(account.id), updated: updatedAccounts.includes(account.id), to: getAccountPath(account), query: bindings.accountBalance(account.id), onDragChange: onDragChange, onDrop: onReorder, outerStyle: makeDropPadding(i) }, account.id))), offbudgetAccounts.length > 0 && (_jsx(Account, { name: t('Off budget'), to: "/accounts/offbudget", query: bindings.offBudgetAccountBalance(), style: {
                            fontWeight,
                            marginTop: 13,
                            marginBottom: 5,
                        }, titleAccount: true })), offbudgetAccounts.map((account, i) => (_jsx(Account, { name: account.name, account: account, connected: !!account.bank, pending: syncingAccountIds.includes(account.id), failed: failedAccounts.has(account.id), updated: updatedAccounts.includes(account.id), to: getAccountPath(account), query: bindings.accountBalance(account.id), onDragChange: onDragChange, onDrop: onReorder, outerStyle: makeDropPadding(i) }, account.id))), closedAccounts.length > 0 && (_jsx(SecondaryItem, { style: { marginTop: 15 }, title: showClosedAccounts
                            ? t('Closed accounts')
                            : t('Closed accounts...'), onClick: onToggleClosedAccounts, bold: true })), showClosedAccounts &&
                        closedAccounts.map(account => (_jsx(Account, { name: account.name, account: account, to: getAccountPath(account), query: bindings.accountBalance(account.id), onDragChange: onDragChange, onDrop: onReorder }, account.id)))] })] }));
}
