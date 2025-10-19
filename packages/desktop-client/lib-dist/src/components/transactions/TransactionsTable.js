import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createElement, createRef, forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgLeftArrow2, SvgRightArrow2, SvgSplit, } from '@actual-app/components/icons/v0';
import { SvgArrowDown, SvgArrowUp, SvgCheveronDown, } from '@actual-app/components/icons/v1';
import { SvgArrowsSynchronize, SvgCalendar3, SvgHyperlink2, SvgSubtract, } from '@actual-app/components/icons/v2';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { format as formatDate, parseISO } from 'date-fns';
import * as monthUtils from 'loot-core/shared/months';
import { getStatusLabel } from 'loot-core/shared/schedules';
import { addSplitTransaction, deleteTransaction, groupTransaction, isPreviewId, isTemporaryId, splitTransaction, ungroupTransactions, updateTransaction, } from 'loot-core/shared/transactions';
import { amountToCurrency, currencyToAmount, integerToCurrency, titleFirst, } from 'loot-core/shared/util';
import { deserializeTransaction, isLastChild, makeTemporaryTransactions, selectAscDesc, serializeTransaction, } from './table/utils';
import { TransactionMenu } from './TransactionMenu';
import { getAccountsById } from '@desktop-client/accounts/accountsSlice';
import { getCategoriesById } from '@desktop-client/budget/budgetSlice';
import { AccountAutocomplete } from '@desktop-client/components/autocomplete/AccountAutocomplete';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { PayeeAutocomplete } from '@desktop-client/components/autocomplete/PayeeAutocomplete';
import { getStatusProps, } from '@desktop-client/components/schedules/StatusBadge';
import { DateSelect } from '@desktop-client/components/select/DateSelect';
import { Cell, CellButton, CustomCell, DeleteCell, Field, InputCell, Row, SelectCell, Table, UnexposedCellContent, useTableNavigator, } from '@desktop-client/components/table';
import { useCachedSchedules } from '@desktop-client/hooks/useCachedSchedules';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useDisplayPayee } from '@desktop-client/hooks/useDisplayPayee';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { useMergedRefs } from '@desktop-client/hooks/useMergedRefs';
import { usePrevious } from '@desktop-client/hooks/usePrevious';
import { useProperFocus } from '@desktop-client/hooks/useProperFocus';
import { useSelectedDispatch, useSelectedItems, } from '@desktop-client/hooks/useSelected';
import { SheetNameProvider } from '@desktop-client/hooks/useSheetName';
import { useSplitsExpanded, } from '@desktop-client/hooks/useSplitsExpanded';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { NotesTagFormatter } from '@desktop-client/notes/NotesTagFormatter';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { getPayeesById } from '@desktop-client/payees/payeesSlice';
import { useDispatch } from '@desktop-client/redux';
const TransactionHeader = memo(({ hasSelected, showAccount, showCategory, showBalance, showCleared, scrollWidth, onSort, ascDesc, field, showSelection, }) => {
    const dispatchSelected = useSelectedDispatch();
    const { t } = useTranslation();
    useHotkeys('ctrl+a, cmd+a, meta+a', () => dispatchSelected({ type: 'select-all' }), {
        preventDefault: true,
        scopes: ['app'],
    }, [dispatchSelected]);
    return (_jsxs(Row, { style: {
            fontWeight: 300,
            zIndex: 200,
            color: theme.tableHeaderText,
            backgroundColor: theme.tableBackground,
            paddingRight: `${5 + (scrollWidth ?? 0)}px`,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme.tableBorder,
        }, children: [showSelection && (_jsx(SelectCell, { exposed: true, focused: false, selected: hasSelected, width: 20, style: {
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                }, icon: _jsx(SvgSubtract, { width: 6, height: 6 }), onSelect: (e) => dispatchSelected({
                    type: 'select-all',
                    isRangeSelect: e.shiftKey,
                }) })), !showSelection && (_jsx(Field, { style: {
                    width: '20px',
                    border: 0,
                } })), _jsx(HeaderCell, { value: t('Date'), width: 110, alignItems: "flex", marginLeft: -5, id: "date", icon: field === 'date' ? ascDesc : 'clickable', onClick: () => onSort('date', selectAscDesc(field, ascDesc, 'date', 'desc')) }), showAccount && (_jsx(HeaderCell, { value: t('Account'), width: "flex", alignItems: "flex", marginLeft: -5, id: "account", icon: field === 'account' ? ascDesc : 'clickable', onClick: () => onSort('account', selectAscDesc(field, ascDesc, 'account', 'asc')) })), _jsx(HeaderCell, { value: t('Payee'), width: "flex", alignItems: "flex", marginLeft: -5, id: "payee", icon: field === 'payee' ? ascDesc : 'clickable', onClick: () => onSort('payee', selectAscDesc(field, ascDesc, 'payee', 'asc')) }), _jsx(HeaderCell, { value: t('Notes'), width: "flex", alignItems: "flex", marginLeft: -5, id: "notes", icon: field === 'notes' ? ascDesc : 'clickable', onClick: () => onSort('notes', selectAscDesc(field, ascDesc, 'notes', 'asc')) }), showCategory && (_jsx(HeaderCell, { value: t('Category'), width: "flex", alignItems: "flex", marginLeft: -5, id: "category", icon: field === 'category' ? ascDesc : 'clickable', onClick: () => onSort('category', selectAscDesc(field, ascDesc, 'category', 'asc')) })), _jsx(HeaderCell, { value: t('Payment'), width: 100, alignItems: "flex-end", marginRight: -5, id: "payment", icon: field === 'payment' ? ascDesc : 'clickable', onClick: () => onSort('payment', selectAscDesc(field, ascDesc, 'payment', 'asc')) }), _jsx(HeaderCell, { value: t('Deposit'), width: 100, alignItems: "flex-end", marginRight: -5, id: "deposit", icon: field === 'deposit' ? ascDesc : 'clickable', onClick: () => onSort('deposit', selectAscDesc(field, ascDesc, 'deposit', 'desc')) }), showBalance && (_jsx(HeaderCell, { value: t('Balance'), width: 103, alignItems: "flex-end", marginRight: -5, id: "balance" })), showCleared && (_jsx(HeaderCell, { value: "\u2713", width: 38, alignItems: "center", id: "cleared", icon: field === 'cleared' ? ascDesc : 'clickable', onClick: () => {
                    onSort('cleared', selectAscDesc(field, ascDesc, 'cleared', 'asc'));
                } }))] }));
});
TransactionHeader.displayName = 'TransactionHeader';
function StatusCell({ id, focused, selected, status, isChild, isPreview, onEdit, onUpdate, }) {
    const isClearedField = status === 'cleared' || status === 'reconciled' || status == null;
    const statusProps = getStatusProps(status);
    const statusColor = status === 'cleared'
        ? theme.noticeTextLight
        : status === 'reconciled'
            ? theme.noticeTextLight
            : status === 'missed'
                ? theme.errorText
                : status === 'due'
                    ? theme.warningText
                    : selected
                        ? theme.pageTextLinkLight
                        : theme.pageTextSubdued;
    function onSelect() {
        if (isClearedField) {
            onUpdate('cleared', !(status === 'cleared'));
        }
    }
    return (_jsx(Cell, { name: "cleared", width: 38, alignItems: "center", focused: focused, style: { padding: 1 }, plain: true, children: _jsx(CellButton, { style: {
                padding: 3,
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderRadius: 50,
                ':focus': {
                    ...(isPreview
                        ? {
                            boxShadow: 'none',
                        }
                        : {
                            border: '1px solid ' + theme.formInputBorderSelected,
                            boxShadow: '0 1px 2px ' + theme.formInputBorderSelected,
                        }),
                },
                cursor: isClearedField ? 'pointer' : 'default',
                ...(isChild && { visibility: 'hidden' }),
            }, disabled: isPreview || isChild, onEdit: () => onEdit(id, 'cleared'), onSelect: onSelect, children: createElement(statusProps.Icon, {
                style: {
                    width: 13,
                    height: 13,
                    color: statusColor,
                    marginTop: status === 'due' ? -1 : 0,
                },
            }) }) }));
}
function HeaderCell({ value, id, width, alignItems, marginLeft, marginRight, icon, onClick, }) {
    const style = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme.tableHeaderText,
        fontWeight: 300,
        marginLeft,
        marginRight,
    };
    return (_jsx(CustomCell, { width: width, name: id, alignItems: alignItems, value: value, style: {
            borderTopWidth: 0,
            borderBottomWidth: 0,
        }, unexposedContent: ({ value: cellValue }) => onClick ? (_jsxs(Button, { variant: "bare", onPress: onClick, style: style, children: [_jsx(UnexposedCellContent, { value: cellValue }), icon === 'asc' && (_jsx(SvgArrowDown, { width: 10, height: 10, style: { marginLeft: 5 } })), icon === 'desc' && (_jsx(SvgArrowUp, { width: 10, height: 10, style: { marginLeft: 5 } }))] })) : (_jsx(Text, { style: style, children: cellValue })) }));
}
function PayeeCell({ id, payee, focused, payees, accounts, transferAccountsByTransaction, valueStyle, transaction, importedPayee, isPreview, onEdit, onUpdate, onCreatePayee, onManagePayees, onNavigateToTransferAccount, onNavigateToSchedule, }) {
    const isCreatingPayee = useRef(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const transferAccount = transferAccountsByTransaction[transaction.id];
    const displayPayee = useDisplayPayee({ transaction });
    return transaction.is_parent ? (_jsx(Cell, { name: "payee", width: "flex", focused: focused, style: { padding: 0 }, plain: true, children: _jsx(CellButton, { bare: true, style: {
                alignSelf: 'stretch',
                borderRadius: 4,
                border: '1px solid transparent', // so it doesn't shift on hover
                ':hover': isPreview
                    ? {}
                    : {
                        border: '1px solid ' + theme.buttonNormalBorder,
                    },
            }, disabled: isPreview, onSelect: () => dispatch(pushModal({
                modal: {
                    name: 'payee-autocomplete',
                    options: {
                        onSelect: (payeeId) => {
                            onUpdate('payee', payeeId);
                        },
                    },
                },
            })), children: _jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderRadius: 4,
                    flex: 1,
                    padding: 4,
                    color: theme.pageTextSubdued,
                }, children: [_jsx(PayeeIcons, { transaction: transaction, transferAccount: transferAccount, onNavigateToTransferAccount: onNavigateToTransferAccount, onNavigateToSchedule: onNavigateToSchedule }), _jsx(SvgSplit, { style: {
                            color: 'inherit',
                            width: 14,
                            height: 14,
                            marginRight: 5,
                            flexShrink: 0,
                        } }), _jsx(Text, { style: {
                            fontStyle: 'italic',
                            fontWeight: 300,
                            userSelect: 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                            borderBottom: importedPayee
                                ? `1px dashed ${theme.pageTextSubdued}`
                                : 'none',
                        }, children: importedPayee ? (_jsx(Tooltip, { content: _jsxs(View, { style: { padding: 10 }, children: [_jsx(Text, { style: { fontWeight: 'bold' }, children: _jsx(Trans, { children: "Imported Payee" }) }), _jsx(Text, { style: { fontWeight: 'normal' }, children: importedPayee })] }), style: { ...styles.tooltip, borderRadius: '0px 5px 5px 0px' }, placement: "bottom", triggerProps: { delay: 750 }, children: displayPayee })) : (displayPayee) })] }) }) })) : (_jsx(CustomCell, { width: "flex", name: "payee", textAlign: "flex", value: payee?.id, valueStyle: valueStyle, exposed: focused, onExpose: name => !isPreview && onEdit(id, name), onUpdate: async (value) => {
            onUpdate('payee', value);
            if (value && value.startsWith('new:') && !isCreatingPayee.current) {
                isCreatingPayee.current = true;
                const id = await onCreatePayee(value.slice('new:'.length));
                onUpdate('payee', id ?? undefined);
                isCreatingPayee.current = false;
            }
        }, formatter: () => {
            if (!displayPayee && isPreview) {
                return t('(No payee)');
            }
            return displayPayee;
        }, unexposedContent: props => {
            const payeeName = (_jsx(UnexposedCellContent, { ...props, style: importedPayee
                    ? { borderBottom: `1px dashed ${theme.pageTextSubdued}` }
                    : {} }));
            return (_jsxs(_Fragment, { children: [_jsx(PayeeIcons, { transaction: transaction, transferAccount: transferAccount, onNavigateToTransferAccount: onNavigateToTransferAccount, onNavigateToSchedule: onNavigateToSchedule }), _jsx("div", { style: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'flex',
                            alignItems: 'center',
                        }, children: importedPayee ? (_jsx(Tooltip, { content: _jsxs(View, { style: { padding: 10 }, children: [_jsx(Text, { style: { fontWeight: 'bold' }, children: _jsx(Trans, { children: "Imported Payee" }) }), _jsx(Text, { style: { fontWeight: 'normal' }, children: importedPayee })] }), style: { ...styles.tooltip, borderRadius: '0px 5px 5px 0px' }, placement: "bottom", triggerProps: { delay: 750 }, children: payeeName })) : (payeeName) })] }));
        }, children: ({ onBlur, onKeyDown, onUpdate, onSave, shouldSaveFromKey, inputStyle, }) => (_jsx(PayeeAutocomplete, { payees: payees, accounts: accounts, value: payee?.id ?? null, shouldSaveFromKey: shouldSaveFromKey, inputProps: {
                onBlur,
                onKeyDown,
                style: inputStyle,
            }, showManagePayees: true, clearOnBlur: false, focused: true, onUpdate: (_, value) => onUpdate?.(value), onSelect: onSave, onManagePayees: () => onManagePayees(payee?.id) })) }));
}
const payeeIconButtonStyle = {
    marginLeft: -5,
    marginRight: 2,
    width: 23,
    height: 23,
    color: 'inherit',
};
const scheduleIconStyle = { width: 13, height: 13 };
const transferIconStyle = { width: 10, height: 10 };
function PayeeIcons({ transaction, transferAccount, onNavigateToTransferAccount, onNavigateToSchedule, }) {
    const { t } = useTranslation();
    const scheduleId = transaction.schedule;
    const { isLoading, schedules = [] } = useCachedSchedules();
    if (isLoading) {
        return null;
    }
    const schedule = scheduleId ? schedules.find(s => s.id === scheduleId) : null;
    if (schedule == null && transferAccount == null) {
        // Neither a valid scheduled transaction nor a transfer.
        return null;
    }
    const recurring = schedule && schedule._date && !!schedule._date.frequency;
    const isDeposit = transaction.amount > 0;
    return (_jsxs(_Fragment, { children: [schedule && (_jsx(Button, { variant: "bare", "data-testid": "schedule-icon", "aria-label": t('See schedule details'), style: payeeIconButtonStyle, onPress: () => {
                    if (scheduleId) {
                        onNavigateToSchedule(scheduleId);
                    }
                }, children: recurring ? (_jsx(SvgArrowsSynchronize, { style: scheduleIconStyle })) : (_jsx(SvgCalendar3, { style: scheduleIconStyle })) })), transferAccount && (_jsx(Button, { variant: "bare", "data-testid": "transfer-icon", "aria-label": t('See transfer account'), style: payeeIconButtonStyle, onPress: () => {
                    if (!isTemporaryId(transaction.id)) {
                        onNavigateToTransferAccount(transferAccount.id);
                    }
                }, children: isDeposit ? (_jsx(SvgLeftArrow2, { style: transferIconStyle })) : (_jsx(SvgRightArrow2, { style: transferIconStyle })) }))] }));
}
const Transaction = memo(function Transaction({ allTransactions, transaction: originalTransaction, subtransactions, transferAccountsByTransaction, editing, showAccount, showBalance, showCleared, showZeroInDeposit, style, selected, highlighted, added, matched, expanded, focusedField, categoryGroups, payees, accounts, balance, dateFormat = 'MM/dd/yyyy', hideFraction, onSave, onEdit, onDelete, onBatchDelete, onBatchDuplicate, onBatchLinkSchedule, onBatchUnlinkSchedule, onCreateRule, onScheduleAction, onMakeAsNonSplitTransactions, onSplit, onManagePayees, onCreatePayee, onToggleSplit, onNavigateToTransferAccount, onNavigateToSchedule, onNotesTagClick, splitError, listContainerRef, showSelection, allowSplitTransaction, showHiddenCategories, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dispatchSelected = useSelectedDispatch();
    const triggerRef = useRef(null);
    const [prevShowZero, setPrevShowZero] = useState(showZeroInDeposit);
    const [prevTransaction, setPrevTransaction] = useState(originalTransaction);
    const [transaction, setTransaction] = useState(() => serializeTransaction(originalTransaction, showZeroInDeposit));
    const isPreview = isPreviewId(transaction.id);
    if (originalTransaction !== prevTransaction ||
        showZeroInDeposit !== prevShowZero) {
        setTransaction(serializeTransaction(originalTransaction, showZeroInDeposit));
        setPrevTransaction(originalTransaction);
        setPrevShowZero(showZeroInDeposit);
    }
    const [showReconciliationWarning, setShowReconciliationWarning] = useState(false);
    const onUpdate = (name, value) => {
        // Had some issues with this is called twice which is a problem now that we are showing a warning
        // modal if the transaction is locked. I added a boolean to guard against showing the modal twice.
        // I'm still not completely happy with how the cells update pre/post modal. Sometimes you have to
        // click off of the cell manually after confirming your change post modal for example. The last
        // row seems to have more issues than others but the combination of tab, return, and clicking out
        // of the cell all have different implications as well.
        if (transaction[name] !== value) {
            if (transaction.reconciled === true &&
                (name === 'credit' ||
                    name === 'debit' ||
                    name === 'payee' ||
                    name === 'account' ||
                    name === 'date')) {
                if (showReconciliationWarning === false) {
                    setShowReconciliationWarning(true);
                    dispatch(pushModal({
                        modal: {
                            name: 'confirm-transaction-edit',
                            options: {
                                onCancel: () => {
                                    setShowReconciliationWarning(false);
                                },
                                onConfirm: () => {
                                    setShowReconciliationWarning(false);
                                    onUpdateAfterConfirm(name, value);
                                },
                                confirmReason: 'editReconciled',
                            },
                        },
                    }));
                }
            }
            else {
                onUpdateAfterConfirm(name, value);
            }
        }
        // Allow un-reconciling (unlocking) transactions
        if (name === 'cleared' && transaction.reconciled) {
            dispatch(pushModal({
                modal: {
                    name: 'confirm-transaction-edit',
                    options: {
                        onConfirm: () => {
                            onUpdateAfterConfirm('reconciled', false);
                        },
                        confirmReason: 'unlockReconciled',
                    },
                },
            }));
        }
    };
    const onUpdateAfterConfirm = (name, value) => {
        const newTransaction = { ...transaction, [name]: value };
        // Don't change the note to an empty string if it's null (since they are both rendered the same)
        if (name === 'notes' && value === '' && transaction.notes == null) {
            return;
        }
        if (name === 'account' &&
            value &&
            getAccountsById(accounts)[value].offbudget) {
            newTransaction.category = undefined;
        }
        // If entering an amount in either of the credit/debit fields, we
        // need to clear out the other one or both so it's always properly
        // translated into the desired amount (see
        // `deserializeTransaction`)
        if (name === 'credit') {
            newTransaction['debit'] = '';
        }
        else if (name === 'debit') {
            newTransaction['credit'] = '';
        }
        else {
            newTransaction['debit'] = '';
            newTransaction['credit'] = '';
        }
        if (name === 'account' && transaction.account !== value) {
            newTransaction.reconciled = false;
        }
        // Don't save a temporary value (a new payee) which will be
        // filled in with a real id later
        if (name === 'payee' &&
            value &&
            value?.startsWith('new:')) {
            setTransaction(newTransaction);
        }
        else {
            const deserialized = deserializeTransaction(newTransaction, originalTransaction);
            // Run the transaction through the formatting so that we know
            // it's always showing the formatted result
            setTransaction(serializeTransaction(deserialized, showZeroInDeposit));
            const deserializedName = ['credit', 'debit'].includes(name)
                ? 'amount'
                : name;
            onSave(deserialized, subtransactions, deserializedName);
        }
    };
    const { id, amount, debit, credit, payee: payeeId, imported_payee: importedPayee, notes, date, account: accountId, category: categoryId, cleared, reconciled, forceUpcoming, is_parent: isParent, _unmatched = false, } = transaction;
    const { schedules = [] } = useCachedSchedules();
    const schedule = transaction.schedule
        ? schedules.find(s => s.id === transaction.schedule)
        : null;
    const previewStatus = forceUpcoming ? 'upcoming' : categoryId;
    // Join in some data
    const payee = (payees && payeeId && getPayeesById(payees)[payeeId]) || undefined;
    const account = accounts && accountId && getAccountsById(accounts)[accountId];
    const isChild = transaction.is_child;
    const transferAcct = isTemporaryId(id) && payee?.transfer_acct
        ? getAccountsById(accounts)[payee.transfer_acct]
        : transferAccountsByTransaction[id];
    const isBudgetTransfer = transferAcct && transferAcct.offbudget === 0;
    const isOffBudget = account && account.offbudget === 1;
    const valueStyle = added ? { fontWeight: 600 } : null;
    const backgroundFocus = focusedField === 'select';
    const amountStyle = hideFraction ? { letterSpacing: -0.5 } : null;
    const runningBalance = !isTemporaryId(id) ? balance : balance + amount;
    // Ok this entire logic is a dirty, dirty hack.. but let me explain.
    // Problem: the split-error Popover (which has the buttons to distribute/add split)
    // renders before schedules are added to the table. After schedules finally load
    // the entire table gets pushed down. But the Popover does not re-calculate
    // its positioning. This is because there is nothing in react-aria that would be
    // watching for the position of the trigger element.
    // Solution: when transactions (this includes schedules) change - we increment
    // a variable (with a small delay in order for the next render cycle to pick up
    // the change instead of the current). We pass the integer to the Popover which
    // causes it to re-calculate the positioning. Thus fixing the problem.
    const [_, setUpdateId] = useState(1);
    useEffect(() => {
        // The hack applies to only transactions with split errors
        if (!splitError) {
            return;
        }
        setTimeout(() => {
            setUpdateId(state => state + 1);
        }, 1);
    }, [splitError, allTransactions]);
    const { setMenuOpen, menuOpen, handleContextMenu, position } = useContextMenu();
    return (_jsxs(Row, { ref: triggerRef, style: {
            backgroundColor: selected
                ? theme.tableRowBackgroundHighlight
                : backgroundFocus
                    ? theme.tableRowBackgroundHover
                    : theme.tableBackground,
            ':hover': !(backgroundFocus || selected) && {
                backgroundColor: theme.tableRowBackgroundHover,
            },
            '& .hover-visible': {
                opacity: 0,
            },
            ':hover .hover-visible': {
                opacity: 1,
            },
            ...(highlighted || selected
                ? { color: theme.tableRowBackgroundHighlightText }
                : { color: theme.tableText }),
            ...style,
            ...(isPreview && {
                color: theme.tableTextInactive,
                fontStyle: 'italic',
            }),
            ...(_unmatched && { opacity: 0.5 }),
        }, onContextMenu: handleContextMenu, children: [_jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), ...position, style: { width: 200, margin: 1 }, isNonModal: true, children: _jsx(TransactionMenu, { transaction: transaction, getTransaction: id => allTransactions?.find(t => t.id === id), onDelete: ids => onBatchDelete?.(ids), onDuplicate: ids => onBatchDuplicate?.(ids), onLinkSchedule: ids => onBatchLinkSchedule?.(ids), onUnlinkSchedule: ids => onBatchUnlinkSchedule?.(ids), onCreateRule: ids => onCreateRule?.(ids), onScheduleAction: (name, ids) => onScheduleAction?.(name, ids), onMakeAsNonSplitTransactions: ids => onMakeAsNonSplitTransactions?.(ids), closeMenu: () => setMenuOpen(false) }) }), splitError && listContainerRef?.current && (_jsx(Popover, { triggerRef: triggerRef, isOpen: true, isNonModal: true, style: {
                    maxWidth: 500,
                    minWidth: 375,
                    padding: 5,
                    maxHeight: '38px !important',
                }, shouldFlip: false, placement: "bottom end", UNSTABLE_portalContainer: listContainerRef.current, children: splitError })), isChild && (_jsx(Field
            /* Checkmark blank placeholder for Child transaction */
            , { 
                /* Checkmark blank placeholder for Child transaction */
                width: 110, style: {
                    width: 110,
                    backgroundColor: theme.tableRowBackgroundHover,
                    border: 0, // known z-order issue, bottom border for parent transaction hidden
                } })), isChild && showAccount && (_jsx(Field
            /* Account blank placeholder for Child transaction */
            , { 
                /* Account blank placeholder for Child transaction */
                style: {
                    flex: 1,
                    backgroundColor: theme.tableRowBackgroundHover,
                    border: 0,
                } })), isTemporaryId(transaction.id) ? (isChild ? (_jsx(DeleteCell, { onDelete: () => onDelete && onDelete(transaction.id), exposed: editing, style: { ...(isChild && { borderLeftWidth: 1 }), lineHeight: 0 } })) : (_jsx(Cell, { width: 20 }))) : (isPreview && isChild) || !showSelection ? (_jsx(Cell, { width: 20 })) : (_jsx(SelectCell
            /* Checkmark field for non-child transaction */
            , { 
                /* Checkmark field for non-child transaction */
                exposed: true, buttonProps: {
                    className: selected || editing ? undefined : 'hover-visible',
                }, focused: focusedField === 'select', onSelect: (e) => {
                    dispatchSelected({
                        type: 'select',
                        id: transaction.id,
                        isRangeSelect: e.shiftKey,
                    });
                }, onEdit: () => onEdit(id, 'select'), selected: selected, style: { ...(isChild && { borderLeftWidth: 1 }) }, value: matched
                    ? // TODO: this will require changes in table.tsx
                        (_jsx(SvgHyperlink2, { style: { width: 13, height: 13, color: 'inherit' } }))
                    : undefined })), !isChild && (_jsx(CustomCell
            /* Date field for non-child transaction */
            , { 
                /* Date field for non-child transaction */
                name: "date", width: 110, textAlign: "flex", exposed: focusedField === 'date', value: date, valueStyle: valueStyle, formatter: date => date ? formatDate(parseISO(date), dateFormat) : '', onExpose: name => !isPreview && onEdit(id, name), onUpdate: value => {
                    onUpdate('date', value);
                }, children: ({ onBlur, onKeyDown, onUpdate, onSave, shouldSaveFromKey, inputStyle, }) => (_jsx(DateSelect, { value: date || '', dateFormat: dateFormat, inputProps: { onBlur, onKeyDown, style: inputStyle }, shouldSaveFromKey: shouldSaveFromKey, clearOnBlur: true, onUpdate: onUpdate, onSelect: onSave })) })), !isChild && showAccount && (_jsx(CustomCell
            /* Account field for non-child transaction */
            , { 
                /* Account field for non-child transaction */
                name: "account", width: "flex", textAlign: "flex", value: accountId, formatter: acctId => {
                    const acct = acctId && getAccountsById(accounts)[acctId];
                    if (acct) {
                        return acct.name;
                    }
                    return '';
                }, valueStyle: valueStyle, exposed: focusedField === 'account', onExpose: name => !isPreview && onEdit(id, name), onUpdate: async (value) => {
                    // Only ever allow non-null values
                    if (value) {
                        onUpdate('account', value);
                    }
                }, children: ({ onBlur, onKeyDown, onUpdate, onSave, shouldSaveFromKey, inputStyle, }) => (_jsx(AccountAutocomplete, { includeClosedAccounts: false, value: accountId, shouldSaveFromKey: shouldSaveFromKey, clearOnBlur: false, focused: true, inputProps: { onBlur, onKeyDown, style: inputStyle }, onUpdate: onUpdate, onSelect: onSave })) })), (() => (_jsx(PayeeCell
            /* Payee field for all transactions */
            , { 
                /* Payee field for all transactions */
                id: id, payee: payee, focused: focusedField === 'payee', 
                /* Filter out the account we're currently in as it is not a valid transfer */
                accounts: accounts.filter(account => account.id !== accountId), payees: payees.filter(payee => !payee.transfer_acct || payee.transfer_acct !== accountId), valueStyle: valueStyle, transaction: transaction, transferAccountsByTransaction: transferAccountsByTransaction, importedPayee: importedPayee, isPreview: isPreview, onEdit: onEdit, onUpdate: onUpdate, onCreatePayee: onCreatePayee, onManagePayees: onManagePayees, onNavigateToTransferAccount: onNavigateToTransferAccount, onNavigateToSchedule: onNavigateToSchedule })))(), _jsx(InputCell, { width: "flex", name: "notes", textAlign: "flex", exposed: focusedField === 'notes', focused: focusedField === 'notes', value: notes ?? (isPreview ? schedule?.name : null) ?? '', valueStyle: valueStyle, formatter: value => NotesTagFormatter({ notes: value, onNotesTagClick }), onExpose: name => !isPreview && onEdit(id, name), inputProps: {
                    value: notes || '',
                    onUpdate: onUpdate.bind(null, 'notes'),
                } }), (isPreview && !isChild) || isParent ? (_jsxs(Cell
            /* Category field (Split button) for parent transactions */
            , { 
                /* Category field (Split button) for parent transactions */
                name: "category", width: "flex", focused: focusedField === 'category', style: {
                    padding: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                }, plain: true, children: [isPreview && (_jsx(View, { style: {
                            color: previewStatus === 'missed'
                                ? theme.errorText
                                : previewStatus === 'due'
                                    ? theme.warningText
                                    : selected
                                        ? theme.formLabelText
                                        : theme.upcomingText,
                            backgroundColor: previewStatus === 'missed'
                                ? theme.errorBackground
                                : previewStatus === 'due'
                                    ? theme.warningBackground
                                    : selected
                                        ? theme.formLabelBackground
                                        : theme.upcomingBackground,
                            margin: '0 5px',
                            padding: '3px 7px',
                            borderRadius: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                        }, children: titleFirst(getStatusLabel(previewStatus ?? '')) })), _jsx(CellButton, { bare: true, style: {
                            borderRadius: 4,
                            border: '1px solid transparent', // so it doesn't shift on hover
                            ':hover': {
                                border: '1px solid ' + theme.buttonNormalBorder,
                            },
                        }, disabled: isTemporaryId(transaction.id), onEdit: () => !isPreview && onEdit(id, 'category'), onSelect: () => onToggleSplit(id), children: _jsxs(View, { style: {
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'stretch',
                                borderRadius: 4,
                                flex: 1,
                                padding: 4,
                                color: theme.pageTextSubdued,
                            }, children: [isParent && (_jsx(SvgCheveronDown, { style: {
                                        color: 'inherit',
                                        width: 14,
                                        height: 14,
                                        transition: 'transform .08s',
                                        transform: expanded ? 'rotateZ(0)' : 'rotateZ(-90deg)',
                                    } })), !isPreview && (_jsx(Text, { style: {
                                        fontStyle: 'italic',
                                        fontWeight: 300,
                                        userSelect: 'none',
                                    }, children: _jsx(Trans, { children: "Split" }) }))] }) })] })) : isBudgetTransfer || isOffBudget ? (_jsx(InputCell
            /* Category field for transfer and off budget transactions
       (NOT preview, it is covered first) */
            , { 
                /* Category field for transfer and off budget transactions
           (NOT preview, it is covered first) */
                name: "category", width: "flex", exposed: focusedField === 'category', focused: focusedField === 'category', onExpose: name => onEdit(id, name), value: isParent
                    ? t('Split')
                    : isOffBudget
                        ? t('Off budget')
                        : isBudgetTransfer
                            ? categoryId != null
                                ? t('Needs Repair')
                                : t('Transfer')
                            : '', valueStyle: valueStyle, style: {
                    fontStyle: 'italic',
                    color: theme.pageTextSubdued,
                    fontWeight: 300,
                }, inputProps: {
                    readOnly: true,
                    style: { fontStyle: 'italic' },
                } })) : (_jsx(CustomCell
            /* Category field for normal and child transactions */
            , { 
                /* Category field for normal and child transactions */
                name: "category", width: "flex", textAlign: "flex", value: categoryId, formatter: value => value
                    ? (getCategoriesById(categoryGroups)[value]?.name ?? '')
                    : transaction.id
                        ? t('Categorize')
                        : '', exposed: focusedField === 'category', onExpose: name => !isPreview && onEdit(id, name), valueStyle: !categoryId
                    ? {
                        // uncategorized transaction
                        fontStyle: 'italic',
                        fontWeight: 300,
                        color: theme.formInputTextHighlight,
                    }
                    : valueStyle, onUpdate: async (value) => {
                    if (value === 'split') {
                        onSplit(transaction.id);
                    }
                    else {
                        onUpdate('category', value);
                    }
                }, children: ({ onBlur, onKeyDown, onUpdate, onSave, shouldSaveFromKey, inputStyle, }) => (_jsx(SheetNameProvider, { name: monthUtils.sheetForMonth(monthUtils.monthFromDate(transaction.date)), children: _jsx(CategoryAutocomplete, { categoryGroups: categoryGroups, value: categoryId ?? null, focused: true, clearOnBlur: false, showSplitOption: !isChild && !isParent && allowSplitTransaction, shouldSaveFromKey: shouldSaveFromKey, inputProps: { onBlur, onKeyDown, style: inputStyle }, onUpdate: onUpdate, onSelect: onSave, showHiddenCategories: showHiddenCategories }) })) })), _jsx(InputCell
            /* Debit field for all transactions */
            , { 
                /* Debit field for all transactions */
                type: "input", width: 100, name: "debit", exposed: focusedField === 'debit', focused: focusedField === 'debit', value: debit === '' && credit === '' ? amountToCurrency(0) : debit, formatter: value => 
                // reformat value so since we might have kept decimals
                value ? amountToCurrency(currencyToAmount(value) || 0) : '', valueStyle: valueStyle, textAlign: "right", title: debit, onExpose: name => !isPreview && onEdit(id, name), style: {
                    ...(isParent && { fontStyle: 'italic' }),
                    ...styles.tnum,
                    ...amountStyle,
                }, inputProps: {
                    value: debit === '' && credit === '' ? amountToCurrency(0) : debit,
                    onUpdate: onUpdate.bind(null, 'debit'),
                    'data-1p-ignore': true,
                }, privacyFilter: {
                    activationFilters: [!isTemporaryId(transaction.id)],
                } }), _jsx(InputCell
            /* Credit field for all transactions */
            , { 
                /* Credit field for all transactions */
                type: "input", width: 100, name: "credit", exposed: focusedField === 'credit', focused: focusedField === 'credit', value: credit, formatter: value => 
                // reformat value so since we might have kept decimals
                value ? amountToCurrency(currencyToAmount(value) || 0) : '', valueStyle: valueStyle, textAlign: "right", title: credit, onExpose: name => !isPreview && onEdit(id, name), style: {
                    ...(isParent && { fontStyle: 'italic' }),
                    ...styles.tnum,
                    ...amountStyle,
                }, inputProps: {
                    value: credit,
                    onUpdate: onUpdate.bind(null, 'credit'),
                    'data-1p-ignore': true,
                }, privacyFilter: {
                    activationFilters: [!isTemporaryId(transaction.id)],
                } }), showBalance && (_jsx(Cell
            /* Balance field for all transactions */
            , { 
                /* Balance field for all transactions */
                name: "balance", value: runningBalance == null || isChild || isTemporaryId(id)
                    ? ''
                    : integerToCurrency(runningBalance), valueStyle: {
                    color: runningBalance < 0 ? theme.errorText : theme.noticeTextLight,
                }, style: { ...styles.tnum, ...amountStyle }, width: 103, textAlign: "right", privacyFilter: true })), showCleared && (_jsx(StatusCell
            /* Icon field for all transactions */
            , { 
                /* Icon field for all transactions */
                id: id, focused: focusedField === 'cleared', selected: selected, isPreview: isPreview, status: isPreview
                    ? previewStatus
                    : reconciled
                        ? 'reconciled'
                        : cleared
                            ? 'cleared'
                            : null, isChild: isChild, onEdit: onEdit, onUpdate: onUpdate })), _jsx(Cell, { width: 5 })] }));
});
function TransactionError({ error, isDeposit, onAddSplit, onDistributeRemainder, style, canDistributeRemainder, }) {
    switch (error.type) {
        case 'SplitTransactionError':
            if (error.version === 1) {
                return (_jsxs(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0 5px',
                        ...style,
                    }, "data-testid": "transaction-error", children: [_jsxs(Text, { style: { whiteSpace: 'nowrap' }, children: [_jsx(Trans, { children: "Amount left:" }), ' ', _jsx(Text, { style: { fontWeight: 500 }, children: integerToCurrency(isDeposit ? error.difference : -error.difference) })] }), _jsx(View, { style: { flex: 1 } }), _jsx(Button, { variant: "normal", style: { marginLeft: 15 }, onPress: onDistributeRemainder, "data-testid": "distribute-split-button", isDisabled: !canDistributeRemainder, children: _jsx(Trans, { children: "Distribute" }) }), _jsx(Button, { variant: "primary", style: { marginLeft: 10, padding: '4px 10px' }, onPress: onAddSplit, "data-testid": "add-split-button", children: _jsx(Trans, { children: "Add Split" }) })] }));
            }
            break;
        default:
            return null;
    }
}
function NewTransaction({ transactions, accounts, categoryGroups, payees, transferAccountsByTransaction, editingTransaction, focusedField, showAccount, showBalance, showCleared, dateFormat, hideFraction, onClose, onSplit, onToggleSplit, onEdit, onDelete, onSave, onAdd, onAddSplit, onDistributeRemainder, onManagePayees, onCreatePayee, onNavigateToTransferAccount, onNavigateToSchedule, onNotesTagClick, balance, showHiddenCategories, }) {
    const error = transactions[0].error;
    const isDeposit = transactions[0].amount > 0;
    const childTransactions = transactions.filter(t => t.parent_id === transactions[0].id);
    const emptyChildTransactions = childTransactions.filter(t => t.amount === 0);
    const addButtonRef = useRef(null);
    useProperFocus(addButtonRef, focusedField === 'add');
    const cancelButtonRef = useRef(null);
    useProperFocus(cancelButtonRef, focusedField === 'cancel');
    return (_jsxs(View, { style: {
            borderBottom: '1px solid ' + theme.tableBorderHover,
            paddingBottom: 6,
            backgroundColor: theme.tableBackground,
        }, "data-testid": "new-transaction", onKeyDown: e => {
            if (e.key === 'Escape') {
                onClose();
            }
        }, children: [transactions.map(transaction => (_jsx(Transaction, { editing: editingTransaction === transaction.id, transaction: transaction, subtransactions: transaction.is_parent ? childTransactions : null, transferAccountsByTransaction: transferAccountsByTransaction, showAccount: showAccount, showBalance: showBalance, showCleared: showCleared, focusedField: editingTransaction === transaction.id ? focusedField : undefined, showZeroInDeposit: isDeposit, accounts: accounts, categoryGroups: categoryGroups, payees: payees, dateFormat: dateFormat, hideFraction: !!hideFraction, expanded: true, onEdit: onEdit, onSave: onSave, onSplit: onSplit, onToggleSplit: onToggleSplit, onDelete: onDelete, onManagePayees: onManagePayees, onCreatePayee: onCreatePayee, style: { marginTop: -1 }, onNavigateToTransferAccount: onNavigateToTransferAccount, onNavigateToSchedule: onNavigateToSchedule, onNotesTagClick: onNotesTagClick, balance: balance ?? 0, showSelection: true, allowSplitTransaction: true, showHiddenCategories: showHiddenCategories }, transaction.id))), _jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: 6,
                    marginRight: 20,
                }, children: [_jsx(Button, { style: { marginRight: 10, padding: '4px 10px' }, onPress: () => onClose(), "data-testid": "cancel-button", ref: cancelButtonRef, children: _jsx(Trans, { children: "Cancel" }) }), error ? (_jsx(TransactionError, { error: error, isDeposit: isDeposit, onAddSplit: () => onAddSplit(transactions[0].id), onDistributeRemainder: () => onDistributeRemainder(transactions[0].id), canDistributeRemainder: emptyChildTransactions.length > 0 })) : (_jsx(Button, { variant: "primary", style: { padding: '4px 10px' }, onPress: onAdd, "data-testid": "add-button", ref: addButtonRef, children: _jsx(Trans, { children: "Add" }) }))] })] }));
}
function TransactionTableInner({ tableNavigator, tableRef, listContainerRef, dateFormat = 'MM/dd/yyyy', newNavigator, renderEmpty, showHiddenCategories, ...props }) {
    const containerRef = createRef();
    const isAddingPrev = usePrevious(props.isAdding);
    const [scrollWidth, setScrollWidth] = useState(0);
    function saveScrollWidth(parent, child) {
        const width = parent > 0 && child > 0 && parent - child;
        setScrollWidth(!width ? 0 : width);
    }
    const { onCloseAddTransaction: onCloseAddTransactionProp, onNavigateToTransferAccount: onNavigateToTransferAccountProp, onNavigateToSchedule: onNavigateToScheduleProp, onNotesTagClick: onNotesTagClickProp, } = props;
    const onNavigateToTransferAccount = useCallback((accountId) => {
        onCloseAddTransactionProp();
        onNavigateToTransferAccountProp(accountId);
    }, [onCloseAddTransactionProp, onNavigateToTransferAccountProp]);
    const onNavigateToSchedule = useCallback((scheduleId) => {
        onCloseAddTransactionProp();
        onNavigateToScheduleProp(scheduleId);
    }, [onCloseAddTransactionProp, onNavigateToScheduleProp]);
    const onNotesTagClick = useCallback((noteTag) => {
        onCloseAddTransactionProp();
        onNotesTagClickProp(noteTag);
    }, [onCloseAddTransactionProp, onNotesTagClickProp]);
    useEffect(() => {
        if (!isAddingPrev && props.isAdding) {
            newNavigator.onEdit('temp', 'date');
        }
    }, [isAddingPrev, props.isAdding, newNavigator]);
    // Don't render reconciled transactions if we're hiding them.
    const transactionsToRender = useMemo(() => props.showReconciled
        ? props.transactions
        : props.transactions.filter(t => !t.reconciled), [props.transactions, props.showReconciled]);
    const renderRow = ({ item, index, editing, }) => {
        const { transactions, selectedItems, accounts, categoryGroups, payees, showCleared, showAccount, showBalances, balances, hideFraction, isNew, isMatched, isExpanded, showSelection, allowSplitTransaction, } = props;
        const trans = item;
        const selected = selectedItems.has(trans.id);
        const parent = trans.parent_id && props.transactionMap.get(trans.parent_id);
        const isChildDeposit = parent ? parent.amount > 0 : undefined;
        const expanded = isExpanded && isExpanded((parent || trans).id);
        // For backwards compatibility, read the error of the transaction
        // since in previous versions we stored it there. In the future we
        // can simplify this to just the parent
        const error = expanded
            ? (parent && parent.error) || trans.error
            : trans.error;
        const hasSplitError = (trans.is_parent || trans.is_child) &&
            (!expanded || isLastChild(transactions, index)) &&
            error &&
            error.type === 'SplitTransactionError';
        const childTransactions = trans.is_parent
            ? props.transactionsByParent[trans.id]
            : null;
        const emptyChildTransactions = props.transactionsByParent[(trans.is_parent ? trans.id : trans.parent_id) || '']?.filter(t => t.amount === 0);
        return (_jsx(Transaction, { allTransactions: props.transactions, editing: editing, transaction: trans, transferAccountsByTransaction: props.transferAccountsByTransaction, subtransactions: childTransactions, showAccount: showAccount, showBalance: showBalances, showCleared: showCleared, selected: selected, highlighted: false, added: isNew?.(trans.id), expanded: isExpanded?.(trans.id), matched: isMatched?.(trans.id), showZeroInDeposit: isChildDeposit, balance: balances?.[trans.id] ?? 0, focusedField: editing ? tableNavigator.focusedField : undefined, accounts: accounts, categoryGroups: categoryGroups, payees: payees, dateFormat: dateFormat, hideFraction: hideFraction, onEdit: tableNavigator.onEdit, onSave: props.onSave, onDelete: props.onDelete, onBatchDelete: props.onBatchDelete, onBatchDuplicate: props.onBatchDuplicate, onBatchLinkSchedule: props.onBatchLinkSchedule, onBatchUnlinkSchedule: props.onBatchUnlinkSchedule, onCreateRule: props.onCreateRule, onScheduleAction: props.onScheduleAction, onMakeAsNonSplitTransactions: props.onMakeAsNonSplitTransactions, onSplit: props.onSplit, onManagePayees: props.onManagePayees, onCreatePayee: props.onCreatePayee, onToggleSplit: props.onToggleSplit, onNavigateToTransferAccount: onNavigateToTransferAccount, onNavigateToSchedule: onNavigateToSchedule, onNotesTagClick: onNotesTagClick, splitError: hasSplitError && (_jsx(TransactionError, { error: error, isDeposit: !!isChildDeposit, onAddSplit: () => props.onAddSplit(trans.id), onDistributeRemainder: () => props.onDistributeRemainder(trans.id), canDistributeRemainder: emptyChildTransactions.length > 0 })), listContainerRef: listContainerRef, showSelection: showSelection, allowSplitTransaction: allowSplitTransaction, showHiddenCategories: showHiddenCategories }));
    };
    return (_jsxs(View, { innerRef: containerRef, style: {
            flex: 1,
            cursor: 'default',
            ...props.style,
        }, children: [_jsxs(View, { children: [_jsx(TransactionHeader, { hasSelected: props.selectedItems.size > 0, showAccount: props.showAccount, showCategory: props.showCategory, showBalance: props.showBalances, showCleared: props.showCleared, scrollWidth: scrollWidth, onSort: props.onSort, ascDesc: props.ascDesc, field: props.sortField, showSelection: props.showSelection }), props.isAdding && (_jsx(View, { ...newNavigator.getNavigatorProps({
                            onKeyDown: (e) => props.onCheckNewEnter(e),
                        }), children: _jsx(NewTransaction, { transactions: props.newTransactions, transferAccountsByTransaction: props.transferAccountsByTransaction, editingTransaction: newNavigator.editingId, focusedField: newNavigator.focusedField, accounts: props.accounts, categoryGroups: props.categoryGroups, payees: props.payees || [], showAccount: props.showAccount, showBalance: props.showBalances, showCleared: props.showCleared, dateFormat: dateFormat, hideFraction: props.hideFraction, onClose: props.onCloseAddTransaction, onAdd: props.onAddTemporary, onAddSplit: props.onAddSplit, onToggleSplit: props.onToggleSplit, onSplit: props.onSplit, onEdit: newNavigator.onEdit, onSave: props.onSave, onDelete: props.onDelete, onManagePayees: props.onManagePayees, onCreatePayee: props.onCreatePayee, onNavigateToTransferAccount: onNavigateToTransferAccount, onNavigateToSchedule: onNavigateToSchedule, onNotesTagClick: onNotesTagClick, onDistributeRemainder: props.onDistributeRemainder, showHiddenCategories: showHiddenCategories }) }))] }), _jsxs(View, { style: { flex: 1, overflow: 'hidden' }, "data-testid": "transaction-table", children: [_jsx(Table, { navigator: tableNavigator, ref: tableRef, listContainerRef: listContainerRef, items: transactionsToRender, renderItem: renderRow, renderEmpty: renderEmpty, loadMore: props.loadMoreTransactions, isSelected: id => props.selectedItems.has(id), onKeyDown: e => props.onCheckEnter(e), saveScrollWidth: saveScrollWidth }), props.isAdding && (_jsx("div", { style: {
                            position: 'absolute',
                            top: -20,
                            left: 0,
                            right: 0,
                            height: 20,
                            backgroundColor: theme.errorText,
                            boxShadow: '0 0 6px rgba(0, 0, 0, .20)',
                        } }, "shadow"))] })] }));
}
export const TransactionTable = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [showHiddenCategories] = useLocalPref('budget.showHiddenCategories');
    const [newTransactions, setNewTransactions] = useState(null);
    const [prevIsAdding, setPrevIsAdding] = useState(false);
    const splitsExpanded = useSplitsExpanded();
    const splitsExpandedDispatch = splitsExpanded.dispatch;
    const prevSplitsExpanded = useRef(null);
    const tableRef = useRef(null);
    const listContainerRef = useRef(null);
    const mergedRef = useMergedRefs(tableRef, ref);
    const transactionsWithExpandedSplits = useMemo(() => {
        let result;
        if (splitsExpanded.state.transitionId != null) {
            const index = props.transactions.findIndex(t => t.id === splitsExpanded.state.transitionId);
            result = props.transactions.filter((t, idx) => {
                if (t.parent_id) {
                    if (idx >= index) {
                        return splitsExpanded.isExpanded(t.parent_id);
                    }
                    else if (prevSplitsExpanded.current) {
                        return prevSplitsExpanded.current.isExpanded(t.parent_id);
                    }
                }
                return true;
            });
        }
        else {
            if (prevSplitsExpanded.current &&
                prevSplitsExpanded.current.state.transitionId != null) {
                tableRef.current?.anchor();
                tableRef.current?.setRowAnimation(false);
            }
            prevSplitsExpanded.current = splitsExpanded;
            result = props.transactions.filter(t => {
                if (t.parent_id) {
                    return splitsExpanded.isExpanded(t.parent_id);
                }
                return true;
            });
        }
        prevSplitsExpanded.current = splitsExpanded;
        return result;
    }, [props.transactions, splitsExpanded]);
    const transactionMap = useMemo(() => {
        return new Map(transactionsWithExpandedSplits.map(trans => [trans.id, trans]));
    }, [transactionsWithExpandedSplits]);
    const transactionsByParent = useMemo(() => {
        return props.transactions.reduce((acc, trans) => {
            if (trans.is_child && trans.parent_id) {
                acc[trans.parent_id] = [...(acc[trans.parent_id] ?? []), trans];
            }
            return acc;
        }, {});
    }, [props.transactions]);
    const transferAccountsByTransaction = useMemo(() => {
        if (!props.accounts) {
            return {};
        }
        const accounts = getAccountsById(props.accounts);
        const payees = getPayeesById(props.payees);
        return Object.fromEntries(props.transactions.map(t => {
            if (!props.accounts) {
                return [t.id, null];
            }
            const payee = (t.payee && payees[t.payee]) || undefined;
            const transferAccount = payee?.transfer_acct && accounts[payee.transfer_acct];
            return [t.id, transferAccount || null];
        }));
    }, [props.transactions, props.payees, props.accounts]);
    const hasPrevSplitsExpanded = prevSplitsExpanded.current;
    useEffect(() => {
        // If it's anchored that means we've also disabled animations. To
        // reduce the chance for side effect collision, only do this if
        // we've actually anchored it
        if (tableRef.current?.isAnchored()) {
            tableRef.current.unanchor();
            tableRef.current.setRowAnimation(true);
        }
    }, [hasPrevSplitsExpanded]);
    const newNavigator = useTableNavigator(newTransactions ?? [], getFieldsNewTransaction);
    const tableNavigator = useTableNavigator(transactionsWithExpandedSplits, getFieldsTableTransaction);
    const shouldAdd = useRef(false);
    const latestState = useRef({
        newTransactions: newTransactions ?? [],
        newNavigator,
        tableNavigator,
        transactions: [],
    });
    const savePending = useRef(false);
    const afterSaveFunc = useRef(null);
    const [_, forceRerender] = useState({});
    const selectedItems = useSelectedItems();
    latestState.current = {
        newTransactions: newTransactions ?? [],
        newNavigator,
        tableNavigator,
        transactions: props.transactions,
    };
    // Derive new transactions from the `isAdding` prop
    if (prevIsAdding !== props.isAdding) {
        if (!prevIsAdding && props.isAdding) {
            setNewTransactions(makeTemporaryTransactions(props.currentAccountId, props.currentCategoryId));
        }
        setPrevIsAdding(props.isAdding);
    }
    if (shouldAdd.current) {
        if (newTransactions?.[0] && newTransactions[0].account == null) {
            dispatch(addNotification({
                notification: {
                    type: 'error',
                    message: t('Account is a required field'),
                },
            }));
            newNavigator.onEdit('temp', 'account');
        }
        else {
            const transactions = latestState.current.newTransactions;
            const lastDate = transactions.length > 0 ? transactions[0].date : null;
            setNewTransactions(makeTemporaryTransactions(props.currentAccountId, props.currentCategoryId, lastDate));
            newNavigator.onEdit('temp', 'date');
            props.onAdd(transactions);
        }
        shouldAdd.current = false;
    }
    useEffect(() => {
        if (savePending.current && afterSaveFunc.current) {
            afterSaveFunc.current();
            afterSaveFunc.current = null;
        }
        savePending.current = false;
    }, [newTransactions, props, props.transactions]);
    function getFieldsNewTransaction(item) {
        const fields = [
            'select',
            'date',
            'account',
            'payee',
            'notes',
            'category',
            'debit',
            'credit',
            'cleared',
            'cancel',
            'add',
        ];
        return getFields(item, fields);
    }
    function getFieldsTableTransaction(item) {
        const fields = [
            'select',
            'date',
            'account',
            'payee',
            'notes',
            'category',
            'debit',
            'credit',
            'cleared',
        ];
        return getFields(item, fields);
    }
    function getFields(item, fields) {
        fields = item?.is_child
            ? ['select', 'payee', 'notes', 'category', 'debit', 'credit']
            : fields.filter(f => (props.showAccount || f !== 'account') &&
                (props.showCategory || f !== 'category'));
        if (item?.id && isPreviewId(item.id)) {
            fields = ['select'];
        }
        if (item?.id && isTemporaryId(item.id)) {
            // You can't focus the select/delete button of temporary
            // transactions
            fields = fields.slice(1);
        }
        return fields;
    }
    function afterSave(func) {
        if (savePending.current) {
            afterSaveFunc.current = func;
        }
        else {
            func();
        }
    }
    function onCheckNewEnter(e) {
        if (e.key === 'Enter') {
            if (e.metaKey) {
                e.stopPropagation();
                onAddTemporary();
            }
            else if (!e.shiftKey) {
                function getLastTransaction(state) {
                    const { newTransactions } = state.current;
                    return newTransactions[newTransactions.length - 1];
                }
                // Right now, the table navigator does some funky stuff with
                // focus, so we want to stop it from handling this event. We
                // still want enter to move up/down normally, so we only stop
                // it if we are on the last transaction (where we are about to
                // do some logic). I don't like this.
                if (newNavigator.editingId === getLastTransaction(latestState).id) {
                    e.stopPropagation();
                }
                afterSave(() => {
                    const lastTransaction = getLastTransaction(latestState);
                    const isSplit = lastTransaction.parent_id || lastTransaction.is_parent;
                    if (latestState.current.newTransactions[0].error &&
                        newNavigator.editingId === lastTransaction.id) {
                        // add split
                        onAddSplit(lastTransaction.id);
                    }
                    else if (newNavigator.editingId === lastTransaction.id &&
                        (!isSplit || !lastTransaction.error)) {
                        onAddTemporary();
                    }
                });
            }
        }
    }
    function onCheckEnter(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const { editingId: id, focusedField } = tableNavigator;
            afterSave(() => {
                const transactions = latestState.current.transactions;
                const idx = transactions.findIndex(t => t.id === id);
                const parent = transactions.find(t => t.id === transactions[idx]?.parent_id);
                if (isLastChild(transactions, idx) &&
                    parent &&
                    parent.error &&
                    focusedField !== 'select') {
                    e.stopPropagation();
                    onAddSplit(id);
                }
            });
        }
    }
    const onAddTemporary = useCallback(() => {
        shouldAdd.current = true;
        // A little hacky - this forces a rerender which will cause the
        // effect we want to run. We have to wait for all updates to be
        // committed (the input could still be saving a value).
        forceRerender({});
    }, []);
    const { onSave: onSaveProp, onApplyRules: onApplyRulesProp, onBatchDelete: onBatchDeleteProp, onBatchDuplicate: onBatchDuplicateProp, onBatchLinkSchedule: onBatchLinkScheduleProp, onBatchUnlinkSchedule: onBatchUnlinkScheduleProp, onCreateRule: onCreateRuleProp, onScheduleAction: onScheduleActionProp, onMakeAsNonSplitTransactions: onMakeAsNonSplitTransactionsProp, onSplit: onSplitProp, } = props;
    const onSave = useCallback(async (transaction, subtransactions = null, updatedFieldName = null) => {
        savePending.current = true;
        let groupedTransaction = subtransactions
            ? groupTransaction([transaction, ...subtransactions])
            : transaction;
        if (isTemporaryId(transaction.id)) {
            if (onApplyRulesProp) {
                groupedTransaction = await onApplyRulesProp(groupedTransaction, updatedFieldName);
            }
            const newTrans = latestState.current.newTransactions;
            // Future refactor: we shouldn't need to iterate through the entire
            // transaction list to ungroup, just the new transactions.
            setNewTransactions(ungroupTransactions(updateTransaction(newTrans, groupedTransaction).data));
        }
        else {
            onSaveProp(groupedTransaction);
        }
    }, [onSaveProp, onApplyRulesProp]);
    const onDelete = useCallback((id) => {
        const temporary = isTemporaryId(id);
        if (temporary) {
            const newTrans = latestState.current.newTransactions;
            if (id === newTrans[0].id) {
                // You can never delete the parent new transaction
                return;
            }
            setNewTransactions(deleteTransaction(newTrans, id).data);
        }
    }, []);
    const onBatchDelete = useCallback((ids) => {
        onBatchDeleteProp(ids);
    }, [onBatchDeleteProp]);
    const onBatchDuplicate = useCallback((ids) => {
        onBatchDuplicateProp(ids);
    }, [onBatchDuplicateProp]);
    const onBatchLinkSchedule = useCallback((ids) => {
        onBatchLinkScheduleProp(ids);
    }, [onBatchLinkScheduleProp]);
    const onBatchUnlinkSchedule = useCallback((ids) => {
        onBatchUnlinkScheduleProp(ids);
    }, [onBatchUnlinkScheduleProp]);
    const onCreateRule = useCallback((ids) => {
        onCreateRuleProp(ids);
    }, [onCreateRuleProp]);
    const onScheduleAction = useCallback((action, ids) => {
        onScheduleActionProp(action, ids);
    }, [onScheduleActionProp]);
    const onMakeAsNonSplitTransactions = useCallback((ids) => {
        onMakeAsNonSplitTransactionsProp(ids);
    }, [onMakeAsNonSplitTransactionsProp]);
    const onSplit = useMemo(() => {
        return (id) => {
            if (isTemporaryId(id)) {
                const { newNavigator } = latestState.current;
                const newTrans = latestState.current.newTransactions;
                const { data, diff } = splitTransaction(newTrans, id);
                setNewTransactions(data);
                // Jump next to "debit" field if it is empty
                // Otherwise jump to the same field as before, but downwards
                // to the added split transaction
                if (newTrans[0].amount === null) {
                    newNavigator.onEdit(newTrans[0].id, 'debit');
                }
                else {
                    newNavigator.onEdit(diff.added[0].id, latestState.current.newNavigator.focusedField);
                }
            }
            else {
                const trans = latestState.current.transactions.find(t => t.id === id);
                const newId = onSplitProp(id);
                if (!trans) {
                    return;
                }
                splitsExpandedDispatch({ type: 'open-split', id: trans.id });
                const { tableNavigator } = latestState.current;
                if (trans.amount === null) {
                    tableNavigator.onEdit(trans.id, 'debit');
                }
                else {
                    tableNavigator.onEdit(newId, tableNavigator.focusedField);
                }
            }
        };
    }, [onSplitProp, splitsExpandedDispatch]);
    const { onAddSplit: onAddSplitProp } = props;
    const onAddSplit = useCallback((id) => {
        const { tableNavigator, newNavigator, newTransactions: newTrans, } = latestState.current;
        if (isTemporaryId(id)) {
            const { data, diff } = addSplitTransaction(newTrans, id);
            setNewTransactions(data);
            newNavigator.onEdit(diff.added[0].id, latestState.current.newNavigator.focusedField);
        }
        else {
            const newId = onAddSplitProp(id);
            tableNavigator.onEdit(newId, latestState.current.tableNavigator.focusedField);
        }
    }, [onAddSplitProp]);
    const onDistributeRemainder = useCallback(async (id) => {
        const { transactions, newNavigator, tableNavigator, newTransactions } = latestState.current;
        const targetTransactions = isTemporaryId(id)
            ? newTransactions
            : transactions;
        const transaction = targetTransactions.find(t => t.id === id);
        const parentTransaction = transaction?.is_parent
            ? transaction
            : targetTransactions.find(t => t.id === transaction?.parent_id);
        const siblingTransactions = targetTransactions.filter(t => t.parent_id &&
            t.parent_id ===
                (transaction?.is_parent
                    ? transaction?.id
                    : transaction?.parent_id));
        const emptyTransactions = siblingTransactions.filter(t => t.amount === 0);
        if (!parentTransaction) {
            console.error('Parent transaction not found for transaction', transaction);
            return;
        }
        const remainingAmount = parentTransaction.amount -
            siblingTransactions.reduce((acc, t) => acc + t.amount, 0);
        const amountPerTransaction = Math.floor(remainingAmount / emptyTransactions.length);
        let remainingCents = remainingAmount - amountPerTransaction * emptyTransactions.length;
        const amounts = new Array(emptyTransactions.length).fill(amountPerTransaction);
        for (const amountIndex in amounts) {
            if (remainingCents === 0)
                break;
            amounts[amountIndex] += 1;
            remainingCents--;
        }
        if (isTemporaryId(id)) {
            newNavigator.onEdit(null);
        }
        else {
            tableNavigator.onEdit(null);
        }
        for (const transactionIndex in emptyTransactions) {
            await onSave({
                ...emptyTransactions[transactionIndex],
                amount: amounts[transactionIndex],
            });
        }
    }, [onSave]);
    function onCloseAddTransaction() {
        setNewTransactions(makeTemporaryTransactions(props.currentAccountId, props.currentCategoryId));
        props.onCloseAddTransaction();
    }
    const onToggleSplit = useCallback((id) => splitsExpandedDispatch({ type: 'toggle-split', id }), [splitsExpandedDispatch]);
    return (_jsx(TransactionTableInner, { tableRef: mergedRef, listContainerRef: listContainerRef, ...props, transactions: transactionsWithExpandedSplits, transactionMap: transactionMap, transactionsByParent: transactionsByParent, transferAccountsByTransaction: transferAccountsByTransaction, selectedItems: selectedItems, isExpanded: splitsExpanded.isExpanded, onSave: onSave, onDelete: onDelete, onBatchDelete: onBatchDelete, onBatchDuplicate: onBatchDuplicate, onBatchLinkSchedule: onBatchLinkSchedule, onBatchUnlinkSchedule: onBatchUnlinkSchedule, onCreateRule: onCreateRule, onScheduleAction: onScheduleAction, onMakeAsNonSplitTransactions: onMakeAsNonSplitTransactions, onSplit: onSplit, onCheckNewEnter: onCheckNewEnter, onCheckEnter: onCheckEnter, onAddTemporary: onAddTemporary, onAddSplit: onAddSplit, onDistributeRemainder: onDistributeRemainder, onCloseAddTransaction: onCloseAddTransaction, onToggleSplit: onToggleSplit, newTransactions: newTransactions ?? [], tableNavigator: tableNavigator, newNavigator: newNavigator, showSelection: props.showSelection, allowSplitTransaction: props.allowSplitTransaction, showHiddenCategories: showHiddenCategories }));
});
TransactionTable.displayName = 'TransactionTable';
