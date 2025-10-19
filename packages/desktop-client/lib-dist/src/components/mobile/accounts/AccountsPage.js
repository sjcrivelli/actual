import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useRef, } from 'react';
import { DropIndicator, ListBox, ListBoxItem, useDragAndDrop, } from 'react-aria-components';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgAdd, SvgCheveronRight, SvgCheveronDown, } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { moveAccount } from '@desktop-client/accounts/accountsSlice';
import { syncAndDownload } from '@desktop-client/app/appSlice';
import { makeAmountFullStyle } from '@desktop-client/components/budget/util';
import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';
import { PullToRefresh } from '@desktop-client/components/mobile/PullToRefresh';
import { MobilePageHeader, Page } from '@desktop-client/components/Page';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useFailedAccounts } from '@desktop-client/hooks/useFailedAccounts';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { replaceModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch, useSelector } from '@desktop-client/redux';
import * as bindings from '@desktop-client/spreadsheet/bindings';
const ROW_HEIGHT = 60;
function AccountHeader({ id, name, amount, style = {}, showCheveronDown = false, onPress, }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const Cheveron = showCheveronDown ? SvgCheveronDown : SvgCheveronRight;
    return (_jsxs(Button, { variant: "bare", "aria-label": t('View {{name}} transactions', { name }), onPress: onPress ? onPress : () => navigate(`/accounts/${id}`), style: {
            height: ROW_HEIGHT,
            width: '100%',
            padding: '0 18px',
            color: theme.pageTextLight,
            ...style,
        }, 
        // to match the feel of the other account buttons
        className: css([
            {
                '&[data-pressed], &[data-hovered]': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(1px)',
                },
            },
        ]), children: [_jsxs(View, { style: { flex: 1, alignItems: 'center', flexDirection: 'row' }, children: [_jsx(Text, { style: {
                            ...styles.text,
                            fontSize: 17,
                        }, "data-testid": "name", children: name }), _jsx(Cheveron, { style: {
                            flexShrink: 0,
                            color: theme.mobileHeaderTextSubdued,
                            marginLeft: 5,
                        }, width: styles.text.fontSize, height: styles.text.fontSize })] }), _jsx(CellValue, { binding: amount, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: { ...styles.text } })) })] }));
}
function AccountListItem({ isUpdated, isConnected, isPending, isFailed, getBalanceQuery, onSelect, ...props }) {
    const { value: account } = props;
    if (!account) {
        return null;
    }
    return (_jsx(ListBoxItem, { textValue: account.name, ...props, children: itemProps => (_jsxs(Button, { ...itemProps, style: {
                height: ROW_HEIGHT,
                width: '100%',
                backgroundColor: theme.tableBackground,
                border: `1px solid ${theme.tableBorder}`,
                paddingLeft: 20,
            }, "data-testid": "account-list-item", onPress: () => onSelect(account), children: [_jsxs(View, { style: {
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }, children: [
                        /* TODO: Should bankId be part of the AccountEntity type? */
                        'bankId' in account && account.bankId ? (_jsx(View, { style: {
                                backgroundColor: isPending
                                    ? theme.sidebarItemBackgroundPending
                                    : isFailed
                                        ? theme.sidebarItemBackgroundFailed
                                        : theme.sidebarItemBackgroundPositive,
                                marginRight: '8px',
                                width: 8,
                                flexShrink: 0,
                                height: 8,
                                borderRadius: 8,
                                opacity: isConnected ? 1 : 0,
                            } })) : null, _jsx(TextOneLine, { style: {
                                ...styles.text,
                                fontSize: 17,
                                fontWeight: 600,
                                color: isUpdated ? theme.mobileAccountText : theme.pillText,
                            }, "data-testid": "account-name", children: account.name })] }), _jsx(CellValue, { binding: getBalanceQuery(account.id), type: "financial", children: props => (_jsx(CellValueText, { ...props, style: {
                            fontSize: 16,
                            ...makeAmountFullStyle(props.value),
                        }, "data-testid": "account-balance" })) })] })) }));
}
function EmptyMessage() {
    return (_jsx(View, { style: { flex: 1, padding: 30 }, children: _jsx(Text, { style: styles.text, children: _jsxs(Trans, { children: ["For Actual to be useful, you need to ", _jsx("strong", { children: "add an account" }), ". You can link an account to automatically download transactions, or manage it locally yourself."] }) }) }));
}
function AllAccountList({ accounts, getAccountBalance, getAllAccountsBalance, getOnBudgetBalance, getOffBudgetBalance, getClosedAccountsBalance, onAddAccount, onOpenAccount, onSync, }) {
    const { t } = useTranslation();
    const onBudgetAccounts = accounts.filter(account => account.offbudget === 0 && account.closed === 0);
    const offBudgetAccounts = accounts.filter(account => account.offbudget === 1 && account.closed === 0);
    const closedAccounts = accounts.filter(account => account.closed === 1);
    const closedAccountsRef = useRef(null);
    const [showClosedAccounts, setShowClosedAccountsPref] = useLocalPref('ui.showClosedAccounts');
    const onToggleClosedAccounts = () => {
        const toggledState = !showClosedAccounts;
        setShowClosedAccountsPref(toggledState);
        if (toggledState) {
            // Make sure to scroll to the closed accounts when the user presses
            // on the account header, otherwise it's not clear that the accounts are there.
            // Delay the scroll until the component is rendered, otherwise the scroll
            // won't work.
            setTimeout(() => {
                closedAccountsRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    };
    return (_jsxs(Page, { header: _jsx(MobilePageHeader, { title: t('Accounts'), rightContent: _jsx(Button, { variant: "bare", "aria-label": t('Add account'), style: { margin: 10 }, onPress: onAddAccount, children: _jsx(SvgAdd, { width: 20, height: 20 }) }) }), padding: 0, children: [accounts.length === 0 && _jsx(EmptyMessage, {}), _jsx(PullToRefresh, { onRefresh: onSync, children: _jsxs(View, { "aria-label": t('Account list'), style: { paddingBottom: MOBILE_NAV_HEIGHT }, children: [_jsx(AccountHeader, { id: "all", name: t('All accounts'), amount: getAllAccountsBalance() }), onBudgetAccounts.length > 0 && (_jsx(AccountHeader, { id: "onbudget", name: t('On budget'), amount: getOnBudgetBalance() })), _jsx(AccountList, { "aria-label": t('On budget accounts'), accounts: onBudgetAccounts, getAccountBalance: getAccountBalance, onOpenAccount: onOpenAccount }), offBudgetAccounts.length > 0 && (_jsx(AccountHeader, { id: "offbudget", name: t('Off budget'), amount: getOffBudgetBalance() })), _jsx(AccountList, { "aria-label": t('Off budget accounts'), accounts: offBudgetAccounts, getAccountBalance: getAccountBalance, onOpenAccount: onOpenAccount }), closedAccounts.length > 0 && (_jsx(AccountHeader, { id: "closed", name: t('Closed'), onPress: onToggleClosedAccounts, amount: getClosedAccountsBalance(), style: { marginTop: 30 }, showCheveronDown: showClosedAccounts })), showClosedAccounts && (_jsx(AccountList, { "aria-label": t('Closed accounts'), accounts: closedAccounts, getAccountBalance: getAccountBalance, onOpenAccount: onOpenAccount, ref: el => {
                                if (el)
                                    closedAccountsRef.current = el;
                            } }))] }) })] }));
}
const AccountList = forwardRef(({ 'aria-label': ariaLabel, accounts, getAccountBalance: getBalanceBinding, onOpenAccount, }, ref) => {
    const failedAccounts = useFailedAccounts();
    const syncingAccountIds = useSelector(state => state.account.accountsSyncing);
    const updatedAccounts = useSelector(state => state.account.updatedAccounts);
    const dispatch = useDispatch();
    const { dragAndDropHooks } = useDragAndDrop({
        getItems: keys => [...keys].map(key => ({
            'text/plain': key,
        })),
        renderDropIndicator: target => {
            return (_jsx(DropIndicator, { target: target, className: css({
                    '&[data-drop-target]': {
                        height: 4,
                        backgroundColor: theme.tableBorderSeparator,
                        opacity: 1,
                        borderRadius: 4,
                    },
                }) }));
        },
        onReorder: e => {
            const [key] = e.keys;
            const accountIdToMove = key;
            const targetAccountId = e.target.key;
            if (e.target.dropPosition === 'before') {
                dispatch(moveAccount({
                    id: accountIdToMove,
                    targetId: targetAccountId,
                }));
            }
            else if (e.target.dropPosition === 'after') {
                const targetAccountIndex = accounts.findIndex(account => account.id === e.target.key);
                if (targetAccountIndex === -1) {
                    throw new Error(`Internal error: account with ID ${targetAccountId} not found.`);
                }
                const nextToTargetAccount = accounts[targetAccountIndex + 1];
                dispatch(moveAccount({
                    id: accountIdToMove,
                    // Due to the way `moveAccount` works, we use the account next to the
                    // actual target account here because `moveAccount` always shoves the
                    // account *before* the target account.
                    // On the other hand, using `null` as `targetId`moves the account
                    // to the end of the list.
                    targetId: nextToTargetAccount?.id || null,
                }));
            }
        },
    });
    return (_jsx(ListBox, { "aria-label": ariaLabel, items: accounts, dragAndDropHooks: dragAndDropHooks, ref: ref, style: { display: 'flex', flexDirection: 'column', margin: '0 8px' }, children: account => (_jsx(AccountListItem, { id: account.id, value: account, isUpdated: updatedAccounts && updatedAccounts.includes(account.id), isConnected: !!account.bank, isPending: syncingAccountIds.includes(account.id), isFailed: failedAccounts && failedAccounts.has(account.id), getBalanceQuery: getBalanceBinding, onSelect: onOpenAccount }, account.id)) }));
});
AccountList.displayName = 'AccountList';
export function AccountsPage() {
    const dispatch = useDispatch();
    const accounts = useAccounts();
    const [_numberFormat] = useSyncedPref('numberFormat');
    const numberFormat = _numberFormat || 'comma-dot';
    const [hideFraction] = useSyncedPref('hideFraction');
    const navigate = useNavigate();
    const onOpenAccount = useCallback((account) => {
        navigate(`/accounts/${account.id}`);
    }, [navigate]);
    const onAddAccount = useCallback(() => {
        dispatch(replaceModal({ modal: { name: 'add-account', options: {} } }));
    }, [dispatch]);
    const onSync = useCallback(async () => {
        dispatch(syncAndDownload({}));
    }, [dispatch]);
    return (_jsx(View, { style: { flex: 1 }, children: _jsx(AllAccountList
        // This key forces the whole table rerender when the number
        // format changes
        , { accounts: accounts, getAccountBalance: bindings.accountBalance, getAllAccountsBalance: bindings.allAccountBalance, getOnBudgetBalance: bindings.onBudgetAccountBalance, getOffBudgetBalance: bindings.offBudgetAccountBalance, getClosedAccountsBalance: bindings.closedAccountBalance, onAddAccount: onAddAccount, onOpenAccount: onOpenAccount, onSync: onSync }, numberFormat + hideFraction) }));
}
