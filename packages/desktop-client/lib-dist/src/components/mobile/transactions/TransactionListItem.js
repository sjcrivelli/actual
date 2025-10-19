import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { mergeProps } from 'react-aria';
import { ListBoxItem } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgLeftArrow2, SvgRightArrow2, SvgSplit, } from '@actual-app/components/icons/v0';
import { SvgArrowsSynchronize, SvgCalendar3, SvgCheckCircle1, SvgLockClosed, } from '@actual-app/components/icons/v2';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { PressResponder, usePress, useLongPress, } from '@react-aria/interactions';
import { isPreviewId } from 'loot-core/shared/transactions';
import { integerToCurrency } from 'loot-core/shared/util';
import { lookupName, Status } from './TransactionEdit';
import { makeAmountFullStyle } from '@desktop-client/components/budget/util';
import { useAccount } from '@desktop-client/hooks/useAccount';
import { useCachedSchedules } from '@desktop-client/hooks/useCachedSchedules';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useDisplayPayee } from '@desktop-client/hooks/useDisplayPayee';
import { usePayee } from '@desktop-client/hooks/usePayee';
import { NotesTagFormatter } from '@desktop-client/notes/NotesTagFormatter';
import { useSelector } from '@desktop-client/redux';
export const ROW_HEIGHT = 60;
const getTextStyle = ({ isPreview, }) => ({
    ...styles.text,
    fontSize: 14,
    ...(isPreview
        ? {
            fontStyle: 'italic',
            color: theme.pageTextLight,
        }
        : {}),
});
const getScheduleIconStyle = ({ isPreview }) => ({
    width: 12,
    height: 12,
    marginRight: 5,
    color: isPreview ? theme.pageTextLight : theme.menuItemText,
});
export function TransactionListItem({ onPress, onLongPress, ...props }) {
    const { t } = useTranslation();
    const { list: categories } = useCategories();
    const { value: transaction } = props;
    const payee = usePayee(transaction?.payee || '');
    const displayPayee = useDisplayPayee({ transaction });
    const account = useAccount(transaction?.account || '');
    const transferAccount = useAccount(payee?.transfer_acct || '');
    const isPreview = isPreviewId(transaction?.id || '');
    const newTransactions = useSelector(state => state.transactions.newTransactions);
    const { longPressProps } = useLongPress({
        accessibilityDescription: 'Long press to select multiple transactions',
        onLongPress: () => {
            if (isPreview) {
                return;
            }
            onLongPress(transaction);
        },
    });
    const { pressProps } = usePress({
        onPress: () => {
            onPress(transaction);
        },
    });
    if (!transaction) {
        return null;
    }
    const { id, amount, category: categoryId, cleared: isCleared, reconciled: isReconciled, is_parent: isParent, is_child: isChild, notes, forceUpcoming, } = transaction;
    const previewStatus = forceUpcoming ? 'upcoming' : categoryId;
    const isAdded = newTransactions.includes(id);
    const categoryName = lookupName(categories, categoryId);
    const specialCategory = account?.offbudget
        ? t('Off budget')
        : transferAccount && !transferAccount.offbudget
            ? t('Transfer')
            : isParent
                ? t('Split')
                : null;
    const prettyCategory = specialCategory || categoryName;
    const textStyle = getTextStyle({ isPreview });
    return (_jsx(ListBoxItem, { textValue: id, ...props, children: itemProps => (_jsx(PressResponder, { ...mergeProps(pressProps, longPressProps), children: _jsx(Button, { ...itemProps, style: {
                    userSelect: 'none',
                    height: ROW_HEIGHT,
                    width: '100%',
                    borderRadius: 0,
                    ...(itemProps.isSelected
                        ? {
                            borderWidth: '0 0 0 4px',
                            borderColor: theme.mobileTransactionSelected,
                            borderStyle: 'solid',
                        }
                        : {
                            borderWidth: '0 0 1px 0',
                            borderColor: theme.tableBorder,
                            borderStyle: 'solid',
                        }),
                    ...(isPreview
                        ? {
                            backgroundColor: theme.tableRowHeaderBackground,
                        }
                        : {
                            backgroundColor: theme.tableBackground,
                        }),
                }, children: _jsxs(View, { style: {
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 4px',
                    }, children: [_jsxs(View, { style: { flex: 1 }, children: [_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(PayeeIcons, { transaction: transaction, transferAccount: transferAccount }), _jsx(TextOneLine, { style: {
                                                ...textStyle,
                                                fontWeight: isAdded ? '600' : '400',
                                                ...(!displayPayee && !isPreview
                                                    ? {
                                                        color: theme.pageTextLight,
                                                        fontStyle: 'italic',
                                                    }
                                                    : {}),
                                            }, children: displayPayee || t('(No payee)') })] }), isPreview ? (_jsx(Status, { status: previewStatus, isSplit: isParent || isChild })) : (_jsxs(View, { style: {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 3,
                                    }, children: [isReconciled ? (_jsx(SvgLockClosed, { style: {
                                                width: 11,
                                                height: 11,
                                                color: theme.noticeTextLight,
                                                marginRight: 5,
                                            } })) : (_jsx(SvgCheckCircle1, { style: {
                                                width: 11,
                                                height: 11,
                                                color: isCleared
                                                    ? theme.noticeTextLight
                                                    : theme.pageTextSubdued,
                                                marginRight: 5,
                                            } })), (isParent || isChild) && (_jsx(SvgSplit, { style: {
                                                width: 12,
                                                height: 12,
                                                marginRight: 5,
                                            } })), _jsx(TextOneLine, { style: {
                                                fontSize: 11,
                                                marginTop: 1,
                                                fontWeight: '400',
                                                color: prettyCategory
                                                    ? theme.tableText
                                                    : theme.menuItemTextSelected,
                                                fontStyle: specialCategory || !prettyCategory
                                                    ? 'italic'
                                                    : undefined,
                                                textAlign: 'left',
                                            }, children: prettyCategory || t('Uncategorized') })] })), notes && (_jsx(TextOneLine, { style: {
                                        fontSize: 11,
                                        marginTop: 4,
                                        fontWeight: '400',
                                        color: theme.tableText,
                                        textAlign: 'left',
                                        opacity: 0.85,
                                    }, children: _jsx(NotesTagFormatter, { notes: notes }) }))] }), _jsx(View, { style: { justifyContent: 'center' }, children: _jsx(Text, { style: {
                                    ...textStyle,
                                    ...makeAmountFullStyle(amount),
                                }, children: integerToCurrency(amount) }) })] }) }) })) }));
}
function PayeeIcons({ transaction, transferAccount }) {
    const { id, schedule: scheduleId } = transaction;
    const { isLoading: isSchedulesLoading, schedules = [] } = useCachedSchedules();
    const isPreview = isPreviewId(id);
    const schedule = schedules.find(s => s.id === scheduleId);
    const isScheduleRecurring = schedule && schedule._date && !!schedule._date.frequency;
    if (isSchedulesLoading) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [schedule &&
                (isScheduleRecurring ? (_jsx(SvgArrowsSynchronize, { style: getScheduleIconStyle({ isPreview }) })) : (_jsx(SvgCalendar3, { style: getScheduleIconStyle({ isPreview }) }))), transferAccount &&
                (transaction.amount > 0 ? (_jsx(SvgLeftArrow2, { style: { width: 12, height: 12, marginRight: 5 } })) : (_jsx(SvgRightArrow2, { style: { width: 12, height: 12, marginRight: 5 } })))] }));
}
