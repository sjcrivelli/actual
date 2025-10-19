import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { ListBox, ListBoxSection, Header, Collection, } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgDelete } from '@actual-app/components/icons/v0';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { Menu, } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { isPreviewId } from 'loot-core/shared/transactions';
import { validForTransfer } from 'loot-core/shared/transfer';
import { groupById, integerToCurrency } from 'loot-core/shared/util';
import { ROW_HEIGHT, TransactionListItem } from './TransactionListItem';
import { FloatingActionBar } from '@desktop-client/components/mobile/FloatingActionBar';
import { useScrollListener } from '@desktop-client/components/ScrollProvider';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { useSelectedDispatch, useSelectedItems, } from '@desktop-client/hooks/useSelected';
import { useTransactionBatchActions } from '@desktop-client/hooks/useTransactionBatchActions';
import { useUndo } from '@desktop-client/hooks/useUndo';
import { setNotificationInset } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
const NOTIFICATION_BOTTOM_INSET = 75;
function Loading({ style, 'aria-label': ariaLabel }) {
    const { t } = useTranslation();
    return (_jsx(View, { "aria-label": ariaLabel || t('Loading...'), style: {
            backgroundColor: theme.mobilePageBackground,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
        }, children: _jsx(AnimatedLoading, { width: 25, height: 25 }) }));
}
export function TransactionList({ isLoading, transactions, onOpenTransaction, isLoadingMore, onLoadMore, showMakeTransfer = false, }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const sections = useMemo(() => {
        // Group by date. We can assume transactions is ordered
        const sections = [];
        transactions.forEach(transaction => {
            if (sections.length === 0 ||
                transaction.date !== sections[sections.length - 1].date) {
                sections.push({
                    id: `${isPreviewId(transaction.id) ? 'preview/' : ''}${transaction.date}`,
                    date: transaction.date,
                    transactions: [],
                });
            }
            sections[sections.length - 1].transactions.push(transaction);
        });
        return sections;
    }, [transactions]);
    const dispatchSelected = useSelectedDispatch();
    const selectedTransactions = useSelectedItems();
    const onTransactionPress = useCallback((transaction, isLongPress = false) => {
        const isPreview = isPreviewId(transaction.id);
        if (!isPreview && (isLongPress || selectedTransactions.size > 0)) {
            dispatchSelected({ type: 'select', id: transaction.id });
        }
        else {
            onOpenTransaction?.(transaction);
        }
    }, [dispatchSelected, onOpenTransaction, selectedTransactions]);
    useScrollListener(useCallback(({ hasScrolledToEnd }) => {
        if (hasScrolledToEnd('down', 100)) {
            onLoadMore?.();
        }
    }, [onLoadMore]));
    return (_jsxs(_Fragment, { children: [isLoading && (_jsx(Loading, { style: { paddingBottom: 8 }, "aria-label": t('Loading transactions...') })), _jsx(ListBox, { "aria-label": t('Transaction list'), selectionMode: selectedTransactions.size > 0 ? 'multiple' : 'single', selectedKeys: selectedTransactions, dependencies: [selectedTransactions], renderEmptyState: () => !isLoading && (_jsx(View, { style: {
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.mobilePageBackground,
                    }, children: _jsx(Text, { style: { fontSize: 15 }, children: _jsx(Trans, { children: "No transactions" }) }) })), items: sections, children: section => (_jsxs(ListBoxSection, { children: [_jsx(Header, { style: {
                                ...styles.smallText,
                                backgroundColor: theme.pageBackground,
                                color: theme.tableHeaderText,
                                display: 'flex',
                                justifyContent: 'center',
                                paddingBottom: 4,
                                paddingTop: 4,
                                position: 'sticky',
                                top: '0',
                                width: '100%',
                                zIndex: 10,
                            }, children: monthUtils.format(section.date, 'MMMM dd, yyyy', locale) }), _jsx(Collection, { items: section.transactions.filter(t => !isPreviewId(t.id) || !t.is_child), children: transaction => (_jsx(TransactionListItem, { value: transaction, onPress: trans => onTransactionPress(trans), onLongPress: trans => onTransactionPress(trans, true) }, transaction.id)) })] })) }), isLoadingMore && (_jsx(Loading, { "aria-label": t('Loading more transactions...'), style: {
                    // Same height as transaction list item
                    height: ROW_HEIGHT,
                } })), selectedTransactions.size > 0 && (_jsx(SelectedTransactionsFloatingActionBar, { transactions: transactions, showMakeTransfer: showMakeTransfer }))] }));
}
function SelectedTransactionsFloatingActionBar({ transactions, style = {}, showMakeTransfer, }) {
    const { t } = useTranslation();
    const editMenuTriggerRef = useRef(null);
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
    const moreOptionsMenuTriggerRef = useRef(null);
    const [isMoreOptionsMenuOpen, setIsMoreOptionsMenuOpen] = useState(false);
    const getMenuItemStyle = useCallback((item) => ({
        ...styles.mobileMenuItem,
        color: theme.mobileHeaderText,
        ...(item.disabled === true && { color: theme.buttonBareDisabledText }),
        ...(item.name === 'delete' && { color: theme.errorTextMenu }),
    }), []);
    const selectedTransactions = useSelectedItems();
    const selectedTransactionsArray = Array.from(selectedTransactions);
    const dispatchSelected = useSelectedDispatch();
    const buttonProps = useMemo(() => ({
        style: {
            ...styles.mobileMenuItem,
            color: 'currentColor',
            height: styles.mobileMinHeight,
        },
        activeStyle: {
            color: 'currentColor',
        },
        hoveredStyle: {
            color: 'currentColor',
        },
    }), []);
    const allTransactionsAreLinked = useMemo(() => {
        return transactions
            .filter(t => selectedTransactions.has(t.id))
            .every(t => t.schedule);
    }, [transactions, selectedTransactions]);
    const isMoreThanOne = selectedTransactions.size > 1;
    const { showUndoNotification } = useUndo();
    const { onBatchEdit, onBatchDuplicate, onBatchDelete, onBatchLinkSchedule, onBatchUnlinkSchedule, onSetTransfer, onMerge, } = useTransactionBatchActions();
    const navigate = useNavigate();
    const accounts = useAccounts();
    const accountsById = useMemo(() => groupById(accounts), [accounts]);
    const payees = usePayees();
    const payeesById = useMemo(() => groupById(payees), [payees]);
    const { list: categories } = useCategories();
    const categoriesById = useMemo(() => groupById(categories), [categories]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setNotificationInset({ inset: { bottom: NOTIFICATION_BOTTOM_INSET } }));
        return () => {
            dispatch(setNotificationInset(null));
        };
    }, [dispatch]);
    const twoTransactions = useMemo(() => {
        // only two selected
        if (selectedTransactionsArray.length !== 2) {
            return undefined;
        }
        const [a, b] = selectedTransactionsArray.map(id => transactions.find(t => t.id === id));
        if (!a || !b) {
            return undefined;
        }
        return [a, b];
    }, [selectedTransactionsArray, transactions]);
    const canBeTransfer = useMemo(() => {
        if (!twoTransactions) {
            return false;
        }
        const [fromTrans, toTrans] = twoTransactions;
        return validForTransfer(fromTrans, toTrans);
    }, [twoTransactions]);
    const canMerge = useMemo(() => {
        return Boolean(twoTransactions &&
            twoTransactions[0].amount === twoTransactions[1].amount);
    }, [twoTransactions]);
    const moreOptionsMenuItems = [
        {
            name: 'duplicate',
            text: t('Duplicate'),
        },
        {
            name: allTransactionsAreLinked ? 'unlink-schedule' : 'link-schedule',
            text: allTransactionsAreLinked
                ? t('Unlink schedule')
                : t('Link schedule'),
        },
        {
            name: 'delete',
            text: t('Delete'),
        },
        {
            name: 'merge',
            text: t('Merge'),
            disabled: !canMerge,
        },
    ];
    if (showMakeTransfer) {
        moreOptionsMenuItems.splice(2, 0, {
            name: 'transfer',
            text: t('Make transfer'),
            disabled: !canBeTransfer,
        });
    }
    return (_jsx(FloatingActionBar, { style: style, children: _jsxs(View, { style: {
                flex: 1,
                padding: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }, children: [_jsxs(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }, children: [_jsx(Button, { variant: "bare", ...buttonProps, style: { ...buttonProps.style, marginRight: 4 }, onPress: () => {
                                if (selectedTransactions.size > 0) {
                                    dispatchSelected({ type: 'select-none' });
                                }
                            }, children: _jsx(SvgDelete, { width: 10, height: 10 }) }), _jsxs(Text, { style: styles.mediumText, children: [selectedTransactions.size, ' ', isMoreThanOne ? 'transactions' : 'transaction', " selected"] })] }), _jsxs(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 4,
                    }, children: [_jsx(Button, { variant: "bare", ref: editMenuTriggerRef, "aria-label": t('Edit fields'), onPress: () => {
                                setIsEditMenuOpen(true);
                            }, ...buttonProps, children: _jsx(Trans, { children: "Edit" }) }), _jsx(Popover, { triggerRef: editMenuTriggerRef, isOpen: isEditMenuOpen, onOpenChange: () => setIsEditMenuOpen(false), style: { width: 200 }, children: _jsx(Menu, { getItemStyle: getMenuItemStyle, style: { backgroundColor: theme.floatingActionBarBackground }, onMenuSelect: name => {
                                    onBatchEdit?.({
                                        name,
                                        ids: selectedTransactionsArray,
                                        onSuccess: (ids, name, value, mode) => {
                                            let displayValue;
                                            switch (name) {
                                                case 'account':
                                                    displayValue =
                                                        accountsById[String(value)]?.name ?? value;
                                                    break;
                                                case 'category':
                                                    displayValue =
                                                        categoriesById[String(value)]?.name ?? value;
                                                    break;
                                                case 'payee':
                                                    displayValue = payeesById[String(value)]?.name ?? value;
                                                    break;
                                                case 'amount':
                                                    displayValue = Number.isNaN(Number(value))
                                                        ? value
                                                        : integerToCurrency(Number(value));
                                                    break;
                                                case 'notes':
                                                    displayValue = `${mode} with ${value}`;
                                                    break;
                                                default:
                                                    displayValue = value;
                                                    break;
                                            }
                                            showUndoNotification({
                                                message: `Successfully updated ${name} of ${ids.length} transaction${ids.length > 1 ? 's' : ''} to [${displayValue}](#${displayValue}).`,
                                                messageActions: {
                                                    [String(displayValue)]: () => {
                                                        switch (name) {
                                                            case 'account':
                                                                navigate(`/accounts/${value}`);
                                                                break;
                                                            case 'category':
                                                                navigate(`/categories/${value}`);
                                                                break;
                                                            case 'payee':
                                                                navigate(`/payees`);
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    },
                                                },
                                            });
                                        },
                                    });
                                    setIsEditMenuOpen(false);
                                }, items: [
                                    // Add support later on.
                                    // Pikaday doesn't play well will mobile.
                                    // We should consider switching to react-aria date picker.
                                    // {
                                    //   name: 'date',
                                    //   text: 'Date',
                                    // },
                                    {
                                        name: 'account',
                                        text: t('Account'),
                                    },
                                    {
                                        name: 'payee',
                                        text: t('Payee'),
                                    },
                                    {
                                        name: 'notes',
                                        text: t('Notes'),
                                    },
                                    {
                                        name: 'category',
                                        text: t('Category'),
                                    },
                                    // Add support later on until we have more user friendly amount input modal.
                                    // {
                                    //   name: 'amount',
                                    //   text: 'Amount',
                                    // },
                                    {
                                        name: 'cleared',
                                        text: t('Cleared'),
                                    },
                                ] }) }), _jsx(Button, { variant: "bare", ref: moreOptionsMenuTriggerRef, "aria-label": t('More options'), onPress: () => {
                                setIsMoreOptionsMenuOpen(true);
                            }, ...buttonProps, children: _jsx(SvgDotsHorizontalTriple, { width: 16, height: 16, style: { color: 'currentColor' } }) }), _jsx(Popover, { triggerRef: moreOptionsMenuTriggerRef, isOpen: isMoreOptionsMenuOpen, onOpenChange: () => setIsMoreOptionsMenuOpen(false), style: { width: 200 }, children: _jsx(Menu, { getItemStyle: getMenuItemStyle, style: { backgroundColor: theme.floatingActionBarBackground }, onMenuSelect: type => {
                                    if (type === 'duplicate') {
                                        onBatchDuplicate?.({
                                            ids: selectedTransactionsArray,
                                            onSuccess: ids => {
                                                showUndoNotification({
                                                    message: t('Successfully duplicated {{count}} transactions.', { count: ids.length }),
                                                });
                                            },
                                        });
                                    }
                                    else if (type === 'link-schedule') {
                                        onBatchLinkSchedule?.({
                                            ids: selectedTransactionsArray,
                                            onSuccess: (ids, schedule) => {
                                                // TODO: When schedule becomes available in mobile, update undo notification message
                                                // with `messageActions` to open the schedule when the schedule name is clicked.
                                                showUndoNotification({
                                                    message: t('Successfully linked {{count}} transactions to {{schedule}}.', { count: ids.length, schedule: schedule.name }),
                                                });
                                            },
                                        });
                                    }
                                    else if (type === 'unlink-schedule') {
                                        onBatchUnlinkSchedule?.({
                                            ids: selectedTransactionsArray,
                                            onSuccess: ids => {
                                                showUndoNotification({
                                                    message: t('Successfully unlinked {{count}} transactions from their respective schedules.', { count: ids.length }),
                                                });
                                            },
                                        });
                                    }
                                    else if (type === 'delete') {
                                        onBatchDelete?.({
                                            ids: selectedTransactionsArray,
                                            onSuccess: ids => {
                                                showUndoNotification({
                                                    type: 'warning',
                                                    message: t('Successfully deleted {{count}} transactions.', { count: ids.length }),
                                                });
                                            },
                                        });
                                    }
                                    else if (type === 'transfer') {
                                        onSetTransfer?.(selectedTransactionsArray, payees, ids => showUndoNotification({
                                            message: t('Successfully marked {{count}} transactions as transfer.', {
                                                count: ids.length,
                                            }),
                                        }));
                                    }
                                    else if (type === 'merge') {
                                        onMerge?.(selectedTransactionsArray, () => showUndoNotification({
                                            message: t('Successfully merged transactions'),
                                        }));
                                    }
                                    setIsMoreOptionsMenuOpen(false);
                                }, items: moreOptionsMenuItems }) })] })] }) }));
}
