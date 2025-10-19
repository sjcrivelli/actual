import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { memo, useRef, useState, } from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheveronDown } from '@actual-app/components/icons/v1';
import { SvgArrowsSynchronize, SvgCalendar3, } from '@actual-app/components/icons/v2';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { evalArithmetic } from 'loot-core/shared/arithmetic';
import * as monthUtils from 'loot-core/shared/months';
import { integerToCurrency, amountToInteger } from 'loot-core/shared/util';
import { BalanceMenu } from './BalanceMenu';
import { BudgetMenu } from './BudgetMenu';
import { BalanceWithCarryover } from '@desktop-client/components/budget/BalanceWithCarryover';
import { makeAmountGrey } from '@desktop-client/components/budget/util';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
import { Field, SheetCell, } from '@desktop-client/components/table';
import { useCategoryScheduleGoalTemplateIndicator } from '@desktop-client/hooks/useCategoryScheduleGoalTemplateIndicator';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
import { useUndo } from '@desktop-client/hooks/useUndo';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export const useTrackingSheetValue = (binding) => {
    return useSheetValue(binding);
};
const TrackingCellValue = (props) => {
    return _jsx(CellValue, { ...props });
};
const TrackingSheetCell = (props) => {
    return _jsx(SheetCell, { ...props });
};
const headerLabelStyle = {
    flex: 1,
    padding: '0 5px',
    textAlign: 'right',
};
const cellStyle = {
    color: theme.pageTextLight,
    fontWeight: 600,
};
export const BudgetTotalsMonth = memo(function BudgetTotalsMonth() {
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            marginRight: styles.monthRightPadding,
            paddingTop: 10,
            paddingBottom: 10,
        }, children: [_jsxs(View, { style: headerLabelStyle, children: [_jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Budgeted" }) }), _jsx(TrackingCellValue, { binding: trackingBudget.totalBudgetedExpense, type: "financial", children: props => _jsx(CellValueText, { ...props, style: cellStyle }) })] }), _jsxs(View, { style: headerLabelStyle, children: [_jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Spent" }) }), _jsx(TrackingCellValue, { binding: trackingBudget.totalSpent, type: "financial", children: props => _jsx(CellValueText, { ...props, style: cellStyle }) })] }), _jsxs(View, { style: headerLabelStyle, children: [_jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Balance" }) }), _jsx(TrackingCellValue, { binding: trackingBudget.totalLeftover, type: "financial", children: props => _jsx(CellValueText, { ...props, style: cellStyle }) })] })] }));
});
export function IncomeHeaderMonth() {
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            marginRight: styles.monthRightPadding,
            paddingBottom: 5,
        }, children: [_jsx(View, { style: headerLabelStyle, children: _jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Budgeted" }) }) }), _jsx(View, { style: headerLabelStyle, children: _jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Received" }) }) })] }));
}
export const GroupMonth = memo(function GroupMonth({ month, group, }) {
    const { id } = group;
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme.budgetHeaderCurrentMonth
                : theme.budgetHeaderOtherMonth,
        }, children: [_jsx(TrackingSheetCell, { name: "budgeted", width: "flex", textAlign: "right", style: { fontWeight: 600, ...styles.tnum }, valueProps: {
                    binding: trackingBudget.groupBudgeted(id),
                    type: 'financial',
                } }), _jsx(TrackingSheetCell, { name: "spent", width: "flex", textAlign: "right", style: { fontWeight: 600, ...styles.tnum }, valueProps: {
                    binding: trackingBudget.groupSumAmount(id),
                    type: 'financial',
                } }), !group.is_income && (_jsx(TrackingSheetCell, { name: "balance", width: "flex", textAlign: "right", style: {
                    fontWeight: 600,
                    paddingRight: styles.monthRightPadding,
                    ...styles.tnum,
                }, valueProps: {
                    binding: trackingBudget.groupBalance(id),
                    type: 'financial',
                } }))] }));
});
export const CategoryMonth = memo(function CategoryMonth({ month, category, editing, onEdit, onBudgetAction, onShowActivity, }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    const [balanceMenuOpen, setBalanceMenuOpen] = useState(false);
    const triggerBalanceMenuRef = useRef(null);
    const onMenuAction = (...args) => {
        onBudgetAction(...args);
        setBalanceMenuOpen(false);
        setMenuOpen(false);
    };
    const { showUndoNotification } = useUndo();
    const navigate = useNavigate();
    const { schedule, scheduleStatus, isScheduleRecurring, description } = useCategoryScheduleGoalTemplateIndicator({
        category,
        month,
    });
    const showScheduleIndicator = schedule && scheduleStatus;
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme.budgetCurrentMonth
                : theme.budgetOtherMonth,
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }, children: [_jsxs(View, { style: {
                    flex: 1,
                    flexDirection: 'row',
                }, children: [!editing && (_jsxs(View, { style: {
                            flexDirection: 'row',
                            flexShrink: 0,
                            paddingLeft: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: theme.tableBorder,
                        }, children: [_jsx(Button, { ref: triggerRef, variant: "bare", onPress: () => setMenuOpen(true), style: {
                                    padding: 3,
                                }, children: _jsx(SvgCheveronDown, { width: 14, height: 14, className: "hover-visible", style: menuOpen && { opacity: 1 } }) }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), placement: "bottom start", children: _jsx(BudgetMenu, { onCopyLastMonthAverage: () => {
                                        onMenuAction(month, 'copy-single-last', {
                                            category: category.id,
                                        });
                                        showUndoNotification({
                                            message: `Budget set to last month’s budget.`,
                                        });
                                    }, onSetMonthsAverage: numberOfMonths => {
                                        if (numberOfMonths !== 3 &&
                                            numberOfMonths !== 6 &&
                                            numberOfMonths !== 12) {
                                            return;
                                        }
                                        onMenuAction(month, `set-single-${numberOfMonths}-avg`, {
                                            category: category.id,
                                        });
                                        showUndoNotification({
                                            message: `Budget set to ${numberOfMonths}-month average.`,
                                        });
                                    }, onApplyBudgetTemplate: () => {
                                        onMenuAction(month, 'apply-single-category-template', {
                                            category: category.id,
                                        });
                                        showUndoNotification({
                                            message: `Budget template applied.`,
                                        });
                                    } }) })] })), _jsx(TrackingSheetCell, { name: "budget", exposed: editing, focused: editing, width: "flex", onExpose: () => onEdit(category.id, month), style: { ...(editing && { zIndex: 100 }), ...styles.tnum }, textAlign: "right", valueStyle: {
                            cursor: 'default',
                            margin: 1,
                            padding: '0 4px',
                            borderRadius: 4,
                            ':hover': {
                                boxShadow: 'inset 0 0 0 1px ' + theme.mobileAccountShadow,
                                backgroundColor: theme.tableBackground,
                            },
                        }, valueProps: {
                            binding: trackingBudget.catBudgeted(category.id),
                            type: 'financial',
                            getValueStyle: makeAmountGrey,
                            formatExpr: expr => {
                                return integerToCurrency(expr);
                            },
                            unformatExpr: expr => {
                                return amountToInteger(evalArithmetic(expr, 0));
                            },
                        }, inputProps: {
                            onBlur: () => {
                                onEdit(null);
                            },
                            style: {
                                backgroundColor: theme.tableBackground,
                            },
                        }, onSave: amount => {
                            onBudgetAction(month, 'budget-amount', {
                                category: category.id,
                                amount,
                            });
                        } })] }), _jsx(Field, { name: "spent", width: "flex", style: { textAlign: 'right' }, children: _jsxs(View, { "data-testid": "category-month-spent", onClick: () => onShowActivity(category.id, month), style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: showScheduleIndicator
                            ? 'space-between'
                            : 'flex-end',
                        gap: 2,
                    }, children: [showScheduleIndicator && (_jsx(View, { title: description, children: _jsx(Button, { variant: "bare", style: {
                                    color: scheduleStatus === 'missed'
                                        ? theme.errorText
                                        : scheduleStatus === 'due'
                                            ? theme.warningText
                                            : theme.upcomingText,
                                }, onPress: () => schedule._account
                                    ? navigate(`/accounts/${schedule._account}`)
                                    : navigate('/accounts'), children: isScheduleRecurring ? (_jsx(SvgArrowsSynchronize, { style: { width: 12, height: 12 } })) : (_jsx(SvgCalendar3, { style: { width: 12, height: 12 } })) }) })), _jsx(TrackingCellValue, { binding: trackingBudget.catSumAmount(category.id), type: "financial", children: props => (_jsx(CellValueText, { ...props, className: css({
                                    cursor: 'pointer',
                                    ':hover': {
                                        textDecoration: 'underline',
                                    },
                                    ...makeAmountGrey(props.value),
                                }) })) })] }) }), !category.is_income && (_jsxs(Field, { name: "balance", width: "flex", style: { paddingRight: styles.monthRightPadding, textAlign: 'right' }, children: [_jsx("span", { ref: triggerBalanceMenuRef, onClick: () => !category.is_income && setBalanceMenuOpen(true), children: _jsx(BalanceWithCarryover, { isDisabled: category.is_income, carryover: trackingBudget.catCarryover(category.id), balance: trackingBudget.catBalance(category.id), goal: trackingBudget.catGoal(category.id), budgeted: trackingBudget.catBudgeted(category.id), longGoal: trackingBudget.catLongGoal(category.id) }) }), _jsx(Popover, { triggerRef: triggerBalanceMenuRef, isOpen: balanceMenuOpen, onOpenChange: () => setBalanceMenuOpen(false), placement: "bottom end", children: _jsx(BalanceMenu, { categoryId: category.id, onCarryover: carryover => {
                                onMenuAction(month, 'carryover', {
                                    category: category.id,
                                    flag: carryover,
                                });
                            } }) })] }))] }));
});
export { BudgetSummary } from './budgetsummary/BudgetSummary';
export const ExpenseGroupMonth = GroupMonth;
export const ExpenseCategoryMonth = CategoryMonth;
export const IncomeGroupMonth = GroupMonth;
export const IncomeCategoryMonth = CategoryMonth;
