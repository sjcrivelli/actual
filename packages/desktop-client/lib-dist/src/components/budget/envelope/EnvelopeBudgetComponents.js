import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useRef, } from 'react';
import { useTranslation, Trans } from 'react-i18next';
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
import { BalanceMovementMenu } from './BalanceMovementMenu';
import { BudgetMenu } from './BudgetMenu';
import { IncomeMenu } from './IncomeMenu';
import { BalanceWithCarryover } from '@desktop-client/components/budget/BalanceWithCarryover';
import { makeAmountGrey } from '@desktop-client/components/budget/util';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
import { Row, Field, SheetCell, } from '@desktop-client/components/table';
import { useCategoryScheduleGoalTemplateIndicator } from '@desktop-client/hooks/useCategoryScheduleGoalTemplateIndicator';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useSheetName } from '@desktop-client/hooks/useSheetName';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
import { useUndo } from '@desktop-client/hooks/useUndo';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function useEnvelopeSheetName(binding) {
    return useSheetName(binding);
}
export function useEnvelopeSheetValue(binding) {
    return useSheetValue(binding);
}
export const EnvelopeCellValue = (props) => {
    return _jsx(CellValue, { ...props });
};
const EnvelopeSheetCell = (props) => {
    return _jsx(SheetCell, { ...props });
};
const headerLabelStyle = {
    flex: 1,
    padding: '0 5px',
    textAlign: 'right',
};
const cellStyle = {
    color: theme.tableHeaderText,
    fontWeight: 600,
};
export const BudgetTotalsMonth = memo(function BudgetTotalsMonth() {
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            marginRight: styles.monthRightPadding,
            paddingTop: 10,
            paddingBottom: 10,
        }, children: [_jsxs(View, { style: headerLabelStyle, children: [_jsx(Text, { style: { color: theme.tableHeaderText }, children: _jsx(Trans, { children: "Budgeted" }) }), _jsx(EnvelopeCellValue, { binding: envelopeBudget.totalBudgeted, type: "financial", children: props => (_jsx(CellValueText, { ...props, value: -props.value, style: cellStyle })) })] }), _jsxs(View, { style: headerLabelStyle, children: [_jsx(Text, { style: { color: theme.tableHeaderText }, children: _jsx(Trans, { children: "Spent" }) }), _jsx(EnvelopeCellValue, { binding: envelopeBudget.totalSpent, type: "financial", children: props => _jsx(CellValueText, { ...props, style: cellStyle }) })] }), _jsxs(View, { style: headerLabelStyle, children: [_jsx(Text, { style: { color: theme.tableHeaderText }, children: _jsx(Trans, { children: "Balance" }) }), _jsx(EnvelopeCellValue, { binding: envelopeBudget.totalBalance, type: "financial", children: props => _jsx(CellValueText, { ...props, style: cellStyle }) })] })] }));
});
export function IncomeHeaderMonth() {
    return (_jsx(Row, { style: {
            color: theme.tableHeaderText,
            alignItems: 'center',
            paddingRight: 10,
        }, children: _jsx(View, { style: { flex: 1, textAlign: 'right' }, children: _jsx(Trans, { children: "Received" }) }) }));
}
export const ExpenseGroupMonth = memo(function ExpenseGroupMonth({ month, group, }) {
    const { id } = group;
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme.budgetHeaderCurrentMonth
                : theme.budgetHeaderOtherMonth,
        }, children: [_jsx(EnvelopeSheetCell, { name: "budgeted", width: "flex", textAlign: "right", style: { fontWeight: 600, ...styles.tnum }, valueProps: {
                    binding: envelopeBudget.groupBudgeted(id),
                    type: 'financial',
                } }), _jsx(EnvelopeSheetCell, { name: "spent", width: "flex", textAlign: "right", style: { fontWeight: 600, ...styles.tnum }, valueProps: {
                    binding: envelopeBudget.groupSumAmount(id),
                    type: 'financial',
                } }), _jsx(EnvelopeSheetCell, { name: "balance", width: "flex", textAlign: "right", style: {
                    fontWeight: 600,
                    paddingRight: styles.monthRightPadding,
                    ...styles.tnum,
                }, valueProps: {
                    binding: envelopeBudget.groupBalance(id),
                    type: 'financial',
                } })] }));
});
export const ExpenseCategoryMonth = memo(function ExpenseCategoryMonth({ month, category, editing, onEdit, onBudgetAction, onShowActivity, }) {
    const { t } = useTranslation();
    const budgetMenuTriggerRef = useRef(null);
    const balanceMenuTriggerRef = useRef(null);
    const { setMenuOpen: setBudgetMenuOpen, menuOpen: budgetMenuOpen, handleContextMenu: handleBudgetContextMenu, resetPosition: resetBudgetPosition, position: budgetPosition, } = useContextMenu();
    const { setMenuOpen: setBalanceMenuOpen, menuOpen: balanceMenuOpen, handleContextMenu: handleBalanceContextMenu, resetPosition: resetBalancePosition, position: balancePosition, } = useContextMenu();
    const onMenuAction = (...args) => {
        onBudgetAction(...args);
        setBudgetMenuOpen(false);
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
        }, children: [_jsxs(View, { ref: budgetMenuTriggerRef, style: {
                    flex: 1,
                    flexDirection: 'row',
                }, onContextMenu: e => {
                    if (editing)
                        return;
                    handleBudgetContextMenu(e);
                }, children: [!editing && (_jsxs(View, { style: {
                            flexDirection: 'row',
                            flexShrink: 1,
                            paddingLeft: 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: theme.tableBorder,
                        }, children: [_jsx(Button, { variant: "bare", onPress: () => {
                                    resetBudgetPosition(2, -4);
                                    setBudgetMenuOpen(true);
                                }, style: {
                                    padding: 3,
                                }, children: _jsx(SvgCheveronDown, { width: 14, height: 14, className: "hover-visible", style: budgetMenuOpen ? { opacity: 1 } : {} }) }), _jsx(Popover, { triggerRef: budgetMenuTriggerRef, placement: "bottom left", isOpen: budgetMenuOpen, onOpenChange: () => setBudgetMenuOpen(false), style: { width: 200 }, isNonModal: true, ...budgetPosition, children: _jsx(BudgetMenu, { onCopyLastMonthAverage: () => {
                                        onMenuAction(month, 'copy-single-last', {
                                            category: category.id,
                                        });
                                        showUndoNotification({
                                            message: t(`Budget set to last month‘s budget.`),
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
                                            message: t('Budget set to {{numberOfMonths}}-month average.', { numberOfMonths }),
                                        });
                                    }, onApplyBudgetTemplate: () => {
                                        onMenuAction(month, 'apply-single-category-template', {
                                            category: category.id,
                                        });
                                        showUndoNotification({
                                            message: t(`Budget template applied.`),
                                        });
                                    } }) })] })), _jsx(EnvelopeSheetCell, { name: "budget", exposed: editing, focused: editing, width: "flex", onExpose: () => onEdit(category.id, month), style: { ...(editing && { zIndex: 100 }), ...styles.tnum }, textAlign: "right", valueStyle: {
                            cursor: 'default',
                            margin: 1,
                            padding: '0 4px',
                            borderRadius: 4,
                            ':hover': {
                                boxShadow: 'inset 0 0 0 1px ' + theme.mobileAccountShadow,
                                backgroundColor: theme.tableBackground,
                            },
                        }, valueProps: {
                            binding: envelopeBudget.catBudgeted(category.id),
                            type: 'financial',
                            getValueStyle: makeAmountGrey,
                            formatExpr: expr => {
                                return integerToCurrency(expr);
                            },
                            unformatExpr: expr => {
                                return amountToInteger(evalArithmetic(expr, 0) ?? 0);
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
                                    : navigate('/accounts'), children: isScheduleRecurring ? (_jsx(SvgArrowsSynchronize, { style: { width: 12, height: 12 } })) : (_jsx(SvgCalendar3, { style: { width: 12, height: 12 } })) }) })), _jsx(EnvelopeCellValue, { binding: envelopeBudget.catSumAmount(category.id), type: "financial", children: props => (_jsx(CellValueText, { ...props, className: css({
                                    cursor: 'pointer',
                                    ':hover': { textDecoration: 'underline' },
                                    ...makeAmountGrey(props.value),
                                }) })) })] }) }), _jsxs(Field, { ref: balanceMenuTriggerRef, name: "balance", width: "flex", style: { paddingRight: styles.monthRightPadding, textAlign: 'right' }, children: [_jsx("span", { onClick: () => {
                            resetBalancePosition(-6, -4);
                            setBalanceMenuOpen(true);
                        }, onContextMenu: e => {
                            handleBalanceContextMenu(e);
                            // We need to calculate differently from the hook due to being aligned to the right
                            const rect = e.currentTarget.getBoundingClientRect();
                            resetBalancePosition(e.clientX - rect.right + 200 - 8, e.clientY - rect.bottom - 8);
                        }, children: _jsx(BalanceWithCarryover, { carryover: envelopeBudget.catCarryover(category.id), balance: envelopeBudget.catBalance(category.id), goal: envelopeBudget.catGoal(category.id), budgeted: envelopeBudget.catBudgeted(category.id), longGoal: envelopeBudget.catLongGoal(category.id), tooltipDisabled: balanceMenuOpen }) }), _jsx(Popover, { triggerRef: balanceMenuTriggerRef, placement: "bottom end", isOpen: balanceMenuOpen, onOpenChange: () => setBalanceMenuOpen(false), style: { margin: 1 }, isNonModal: true, ...balancePosition, children: _jsx(BalanceMovementMenu, { categoryId: category.id, month: month, onBudgetAction: onBudgetAction, onClose: () => setBalanceMenuOpen(false) }) })] })] }));
});
export function IncomeGroupMonth({ month }) {
    return (_jsx(View, { style: { flex: 1 }, children: _jsx(EnvelopeSheetCell, { name: "received", width: "flex", textAlign: "right", style: {
                fontWeight: 600,
                paddingRight: styles.monthRightPadding,
                ...styles.tnum,
                backgroundColor: monthUtils.isCurrentMonth(month)
                    ? theme.budgetHeaderCurrentMonth
                    : theme.budgetHeaderOtherMonth,
            }, valueProps: {
                binding: envelopeBudget.groupIncomeReceived,
                type: 'financial',
            } }) }));
}
export function IncomeCategoryMonth({ category, isLast, month, onShowActivity, onBudgetAction, }) {
    const incomeMenuTriggerRef = useRef(null);
    const { setMenuOpen: setIncomeMenuOpen, menuOpen: incomeMenuOpen, handleContextMenu: handleIncomeContextMenu, resetPosition: resetIncomePosition, position: incomePosition, } = useContextMenu();
    return (_jsx(View, { style: { flex: 1 }, children: _jsx(Field, { name: "received", width: "flex", truncate: false, ref: incomeMenuTriggerRef, style: {
                textAlign: 'right',
                ...(isLast && { borderBottomWidth: 0 }),
                backgroundColor: monthUtils.isCurrentMonth(month)
                    ? theme.budgetCurrentMonth
                    : theme.budgetOtherMonth,
            }, children: _jsxs(View, { name: "received", style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    position: 'relative',
                }, children: [_jsx("span", { onClick: () => {
                            resetIncomePosition(-6, -4);
                            setIncomeMenuOpen(true);
                        }, onContextMenu: e => {
                            handleIncomeContextMenu(e);
                            // We need to calculate differently from the hook due to being aligned to the right
                            const rect = e.currentTarget.getBoundingClientRect();
                            resetIncomePosition(e.clientX - rect.right + 200 - 8, e.clientY - rect.bottom - 8);
                        }, style: { paddingRight: styles.monthRightPadding }, children: _jsx(BalanceWithCarryover, { carryover: envelopeBudget.catCarryover(category.id), balance: envelopeBudget.catSumAmount(category.id), goal: envelopeBudget.catGoal(category.id), budgeted: envelopeBudget.catBudgeted(category.id), longGoal: envelopeBudget.catLongGoal(category.id) }) }), _jsx(Popover, { triggerRef: incomeMenuTriggerRef, placement: "bottom end", isOpen: incomeMenuOpen, onOpenChange: () => setIncomeMenuOpen(false), style: { margin: 1 }, isNonModal: true, ...incomePosition, children: _jsx(IncomeMenu, { categoryId: category.id, month: month, onBudgetAction: onBudgetAction, onShowActivity: onShowActivity, onClose: () => setIncomeMenuOpen(false) }) })] }) }) }));
}
export { BudgetSummary } from './budgetsummary/BudgetSummary';
