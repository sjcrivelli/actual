import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState, } from 'react';
import { Dialog, DialogTrigger } from 'react-aria-components';
import { useHotkeys } from 'react-hotkeys-hook';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgAdd, SvgDotsHorizontalTriple, } from '@actual-app/components/icons/v1';
import { SvgArrowsExpand3, SvgArrowsShrink3, SvgDownloadThickBottom, SvgLockClosed, SvgPencil1, } from '@actual-app/components/icons/v2';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { format as formatDate } from 'date-fns';
import { tsToRelativeTime } from 'loot-core/shared/util';
import { Balances } from './Balance';
import { BalanceHistoryGraph } from './BalanceHistoryGraph';
import { ReconcileMenu, ReconcilingMessage } from './Reconcile';
import { AnimatedRefresh } from '@desktop-client/components/AnimatedRefresh';
import { Search } from '@desktop-client/components/common/Search';
import { FilterButton } from '@desktop-client/components/filters/FiltersMenu';
import { FiltersStack } from '@desktop-client/components/filters/FiltersStack';
import { NotesButton } from '@desktop-client/components/NotesButton';
import { SelectedTransactionsButton } from '@desktop-client/components/transactions/SelectedTransactionsButton';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { useSplitsExpanded } from '@desktop-client/hooks/useSplitsExpanded';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useSyncServerStatus } from '@desktop-client/hooks/useSyncServerStatus';
export function AccountHeader({ tableRef, isNameEditable, workingHard, accountName, accountId, account, filterId, savedFilters, accountsSyncing, failedAccounts, accounts, transactions, showBalances, showExtraBalances, showCleared, showReconciled, showEmptyMessage, balanceQuery, reconcileAmount, canCalculateBalance, isFiltered, filteredAmount, isSorted, search, filterConditions, filterConditionsOp, onSearch, onAddTransaction, onShowTransactions, onDoneReconciling, onCreateReconciliationTransaction, onToggleExtraBalances, onSaveName, saveNameError, onSync, onImport, onMenuSelect, onReconcile, onBatchDelete, onBatchDuplicate, onBatchEdit, onBatchLinkSchedule, onBatchUnlinkSchedule, onCreateRule, onApplyFilter, onUpdateFilter, onClearFilters, onReloadSavedFilter, onConditionsOpChange, onDeleteFilter, onScheduleAction, onSetTransfer, onRunRules, onMakeAsSplitTransaction, onMakeAsNonSplitTransactions, onMergeTransactions, }) {
    const { t } = useTranslation();
    const [reconcileOpen, setReconcileOpen] = useState(false);
    const searchInput = useRef(null);
    const reconcileRef = useRef(null);
    const splitsExpanded = useSplitsExpanded();
    const syncServerStatus = useSyncServerStatus();
    const isUsingServer = syncServerStatus !== 'no-server';
    const isServerOffline = syncServerStatus === 'offline';
    const [_, setExpandSplitsPref] = useLocalPref('expand-splits');
    const [showNetWorthChartPref, _setShowNetWorthChartPref] = useSyncedPref(`show-account-${accountId}-net-worth-chart`);
    const showNetWorthChart = showNetWorthChartPref === 'true';
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const locale = useLocale();
    let canSync = !!(account?.account_id && isUsingServer);
    if (!account) {
        // All accounts - check for any syncable account
        canSync = !!accounts.find(account => !!account.account_id) && isUsingServer;
    }
    // Only show the ability to make linked transfers on multi-account views.
    const showMakeTransfer = !account;
    function onToggleSplits() {
        if (tableRef.current) {
            splitsExpanded.dispatch({
                type: 'switch-mode',
                id: tableRef.current.getScrolledItem(),
            });
            setExpandSplitsPref(!(splitsExpanded.state.mode === 'expand'));
        }
    }
    const graphRef = useRef(null);
    useHotkeys('ctrl+f, cmd+f, meta+f', () => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    }, {
        enableOnFormTags: true,
        preventDefault: true,
        scopes: ['app'],
    }, [searchInput]);
    useHotkeys('t', () => onAddTransaction(), {
        preventDefault: true,
        scopes: ['app'],
    }, [onAddTransaction]);
    useHotkeys('ctrl+i, cmd+i, meta+i', () => onImport(), {
        scopes: ['app'],
    }, [onImport]);
    useHotkeys('ctrl+b, cmd+b, meta+b', () => onSync(), {
        enabled: canSync && !isServerOffline,
        preventDefault: true,
        scopes: ['app'],
    }, [onSync]);
    return (_jsxs(_Fragment, { children: [_jsxs(View, { style: { ...styles.pageContent, paddingBottom: 10, flexShrink: 0 }, children: [_jsxs(View, { style: {
                            flexDirection: 'column',
                            marginTop: 2,
                            justifyContent: 'space-between',
                            gap: 10,
                        }, children: [_jsxs(View, { style: {
                                    flexGrow: 1,
                                    alignItems: 'flex-start',
                                    gap: 10,
                                }, children: [_jsxs(View, { style: {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 3,
                                        }, children: [!!account?.bank && (_jsx(AccountSyncSidebar, { account: account, failedAccounts: failedAccounts, accountsSyncing: accountsSyncing })), _jsx(AccountNameField, { account: account, accountName: accountName, isNameEditable: isNameEditable, saveNameError: saveNameError, onSaveName: onSaveName })] }), _jsx(Balances, { balanceQuery: balanceQuery, showExtraBalances: showExtraBalances, onToggleExtraBalances: onToggleExtraBalances, account: account, isFiltered: isFiltered, filteredAmount: filteredAmount })] }), _jsx(BalanceHistoryGraph, { ref: graphRef, accountId: accountId, style: {
                                    height: 'calc(5vh + 5vw)',
                                    margin: 0,
                                    display: showNetWorthChart ? 'flex' : 'none',
                                } })] }), _jsxs(Stack, { spacing: 2, direction: "row", align: "center", style: { marginTop: 12 }, children: [canSync && (_jsxs(Button, { variant: "bare", onPress: onSync, isDisabled: isServerOffline, children: [_jsx(AnimatedRefresh, { width: 13, height: 13, animating: account
                                            ? accountsSyncing.includes(account.id)
                                            : accountsSyncing.length > 0 }), ' ', isServerOffline ? t('Bank Sync Offline') : t('Bank Sync')] })), account && !account.closed && (_jsxs(Button, { variant: "bare", onPress: onImport, children: [_jsx(SvgDownloadThickBottom, { width: 13, height: 13, style: { marginRight: 4 } }), ' ', _jsx(Trans, { children: "Import" })] })), !showEmptyMessage && (_jsxs(Button, { variant: "bare", onPress: onAddTransaction, children: [_jsx(SvgAdd, { width: 10, height: 10, style: { marginRight: 3 } }), _jsx(Trans, { children: "Add New" })] })), _jsx(View, { style: { flexShrink: 0 }, children: _jsx(FilterButton, { onApply: onApplyFilter }) }), _jsx(View, { style: { flex: 1 } }), _jsx(Search, { placeholder: t('Search'), value: search, onChange: onSearch, inputRef: searchInput, 
                                // Remove marginRight magically being added by Stack...
                                // We need to refactor the Stack component
                                style: { marginRight: 0 } }), workingHard ? (_jsx(View, { children: _jsx(AnimatedLoading, { style: { width: 16, height: 16 } }) })) : (_jsx(SelectedTransactionsButton, { getTransaction: id => transactions.find(t => t.id === id), onShow: onShowTransactions, onDuplicate: onBatchDuplicate, onDelete: onBatchDelete, onEdit: onBatchEdit, onRunRules: onRunRules, onLinkSchedule: onBatchLinkSchedule, onUnlinkSchedule: onBatchUnlinkSchedule, onCreateRule: onCreateRule, onSetTransfer: onSetTransfer, onScheduleAction: onScheduleAction, showMakeTransfer: showMakeTransfer, onMakeAsSplitTransaction: onMakeAsSplitTransaction, onMakeAsNonSplitTransactions: onMakeAsNonSplitTransactions, onMergeTransactions: onMergeTransactions })), _jsx(View, { style: { flex: '0 0 auto', marginLeft: 10 }, children: account && (_jsxs(Tooltip, { style: {
                                        ...styles.tooltip,
                                        marginBottom: 10,
                                    }, content: account?.last_reconciled
                                        ? t('Reconciled {{ relativeTimeAgo }} ({{ absoluteDate }})', {
                                            relativeTimeAgo: tsToRelativeTime(account.last_reconciled, locale),
                                            absoluteDate: formatDate(new Date(parseInt(account.last_reconciled ?? '0', 10)), dateFormat, { locale }),
                                        })
                                        : t('Not yet reconciled'), placement: "top", triggerProps: {
                                        isDisabled: reconcileOpen,
                                    }, children: [_jsx(Button, { ref: reconcileRef, variant: "bare", "aria-label": t('Reconcile'), style: { padding: 6 }, onPress: () => {
                                                setReconcileOpen(true);
                                            }, children: _jsx(View, { children: _jsx(SvgLockClosed, { width: 14, height: 14 }) }) }), _jsx(Popover, { placement: "bottom", triggerRef: reconcileRef, style: { width: 275 }, isOpen: reconcileOpen, onOpenChange: () => setReconcileOpen(false), children: _jsx(ReconcileMenu, { account: account, onClose: () => setReconcileOpen(false), onReconcile: onReconcile }) })] })) }), _jsx(Button, { variant: "bare", "aria-label": splitsExpanded.state.mode === 'collapse'
                                    ? t('Collapse split transactions')
                                    : t('Expand split transactions'), style: { padding: 6 }, onPress: onToggleSplits, children: _jsx(View, { title: splitsExpanded.state.mode === 'collapse'
                                        ? t('Collapse split transactions')
                                        : t('Expand split transactions'), children: splitsExpanded.state.mode === 'collapse' ? (_jsx(SvgArrowsShrink3, { style: { width: 14, height: 14 } })) : (_jsx(SvgArrowsExpand3, { style: { width: 14, height: 14 } })) }) }), account ? (_jsx(View, { style: { flex: '0 0 auto' }, children: _jsxs(DialogTrigger, { children: [_jsx(Button, { variant: "bare", "aria-label": t('Account menu'), children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }), _jsx(Popover, { style: { minWidth: 275 }, children: _jsx(Dialog, { children: _jsx(AccountMenu, { account: account, canSync: canSync, showNetWorthChart: showNetWorthChart, canShowBalances: canCalculateBalance ? canCalculateBalance() : false, isSorted: isSorted, showBalances: showBalances, showCleared: showCleared, showReconciled: showReconciled, onMenuSelect: onMenuSelect }) }) })] }) })) : (_jsx(View, { style: { flex: '0 0 auto' }, children: _jsxs(DialogTrigger, { children: [_jsx(Button, { variant: "bare", "aria-label": t('Account menu'), children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { transform: 'rotateZ(90deg)' } }) }), _jsx(Popover, { children: _jsx(Dialog, { children: _jsx(Menu, { slot: "close", onMenuSelect: onMenuSelect, items: [
                                                        ...(isSorted
                                                            ? [
                                                                {
                                                                    name: 'remove-sorting',
                                                                    text: t('Remove all sorting'),
                                                                },
                                                            ]
                                                            : []),
                                                        { name: 'export', text: t('Export') },
                                                        {
                                                            name: 'toggle-net-worth-chart',
                                                            text: showNetWorthChart
                                                                ? t('Hide balance chart')
                                                                : t('Show balance chart'),
                                                        },
                                                    ] }) }) })] }) }))] }), filterConditions?.length > 0 && (_jsx(FiltersStack, { conditions: filterConditions, conditionsOp: filterConditionsOp, onUpdateFilter: onUpdateFilter, onDeleteFilter: onDeleteFilter, onClearFilters: onClearFilters, onReloadSavedFilter: onReloadSavedFilter, filterId: filterId, savedFilters: savedFilters, onConditionsOpChange: onConditionsOpChange }))] }), reconcileAmount != null && (_jsx(ReconcilingMessage, { targetBalance: reconcileAmount, balanceQuery: balanceQuery, onDone: onDoneReconciling, onCreateTransaction: onCreateReconciliationTransaction }))] }));
}
function AccountSyncSidebar({ account, failedAccounts, accountsSyncing, }) {
    return (_jsx(View, { style: {
            backgroundColor: accountsSyncing.includes(account.id)
                ? theme.sidebarItemBackgroundPending
                : failedAccounts.has(account.id)
                    ? theme.sidebarItemBackgroundFailed
                    : theme.sidebarItemBackgroundPositive,
            marginRight: '4px',
            width: 8,
            height: 8,
            borderRadius: 8,
        } }));
}
function AccountNameField({ account, accountName, isNameEditable, saveNameError, onSaveName, }) {
    const { t } = useTranslation();
    const [editingName, setEditingName] = useState(false);
    const handleSave = (newName) => {
        onSaveName(newName);
        setEditingName(false);
    };
    return (_jsx(View, { style: { flexShrink: 0, alignItems: 'center' }, children: editingName ? (_jsxs(_Fragment, { children: [_jsx(InitialFocus, { children: _jsx(Input, { defaultValue: accountName, onEnter: handleSave, onUpdate: handleSave, onEscape: () => setEditingName(false), style: {
                            fontSize: 25,
                            fontWeight: 500,
                            marginTop: -3,
                            marginBottom: -4,
                            marginLeft: -6,
                            paddingTop: 2,
                            paddingBottom: 2,
                            width: Math.max(20, accountName.length) + 'ch',
                        } }) }), saveNameError && (_jsx(View, { style: { color: theme.warningText }, children: saveNameError }))] })) : (_jsxs(View, { style: {
                flexDirection: 'row',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                gap: 3,
                '& .hover-visible': {
                    opacity: 0,
                    transition: 'opacity .25s',
                },
                '&:hover .hover-visible': {
                    opacity: 1,
                },
            }, children: [_jsx(View, { style: {
                        fontSize: 25,
                        fontWeight: 500,
                        marginRight: 5,
                        marginBottom: -1,
                    }, "data-testid": "account-name", children: account && account.closed
                        ? t('Closed: {{ accountName }}', { accountName })
                        : accountName }), _jsxs(View, { style: { flexDirection: 'row', width: 50 }, children: [isNameEditable && account && (_jsx(NotesButton, { id: `account-${account.id}`, defaultColor: theme.pageTextSubdued })), isNameEditable && (_jsx(Button, { variant: "bare", "aria-label": t('Edit account name'), className: "hover-visible", onPress: () => setEditingName(true), children: _jsx(SvgPencil1, { style: {
                                    width: 11,
                                    height: 11,
                                    color: theme.pageTextSubdued,
                                } }) }))] })] })) }));
}
function AccountMenu({ account, canSync, showNetWorthChart, showBalances, canShowBalances, showCleared, showReconciled, isSorted, onMenuSelect, }) {
    const { t } = useTranslation();
    const syncServerStatus = useSyncServerStatus();
    return (_jsx(Menu, { slot: "close", onMenuSelect: item => {
            onMenuSelect(item);
        }, items: [
            ...(isSorted
                ? [
                    {
                        name: 'remove-sorting',
                        text: t('Remove all sorting'),
                    },
                ]
                : []),
            ...(canShowBalances
                ? [
                    {
                        name: 'toggle-balance',
                        text: showBalances
                            ? t('Hide running balance')
                            : t('Show running balance'),
                    },
                ]
                : []),
            {
                name: 'toggle-net-worth-chart',
                text: showNetWorthChart
                    ? t('Hide balance chart')
                    : t('Show balance chart'),
            },
            {
                name: 'toggle-cleared',
                text: showCleared
                    ? t('Hide “cleared” checkboxes')
                    : t('Show “cleared” checkboxes'),
            },
            {
                name: 'toggle-reconciled',
                text: showReconciled
                    ? t('Hide reconciled transactions')
                    : t('Show reconciled transactions'),
            },
            { name: 'export', text: t('Export') },
            ...(account && !account.closed
                ? canSync
                    ? [
                        {
                            name: 'unlink',
                            text: t('Unlink account'),
                        },
                    ]
                    : syncServerStatus === 'online'
                        ? [
                            {
                                name: 'link',
                                text: t('Link account'),
                            },
                        ]
                        : []
                : []),
            ...(account.closed
                ? [{ name: 'reopen', text: t('Reopen account') }]
                : [{ name: 'close', text: t('Close account') }]),
        ] }));
}
