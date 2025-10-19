import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { SvgArrowButtonDown1, SvgArrowButtonUp1, } from '@actual-app/components/icons/v2';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import * as monthUtils from 'loot-core/shared/months';
import { BudgetMonthMenu } from './BudgetMonthMenu';
import { ToBudget } from './ToBudget';
import { TotalsList } from './TotalsList';
import { useEnvelopeBudget } from '@desktop-client/components/budget/envelope/EnvelopeBudgetContext';
import { NotesButton } from '@desktop-client/components/NotesButton';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { SheetNameProvider } from '@desktop-client/hooks/useSheetName';
import { useUndo } from '@desktop-client/hooks/useUndo';
export const BudgetSummary = memo(({ month }) => {
    const locale = useLocale();
    const { currentMonth, summaryCollapsed: collapsed, onBudgetAction, onToggleSummaryCollapse, } = useEnvelopeBudget();
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    const { showUndoNotification } = useUndo();
    function onMenuOpen() {
        setMenuOpen(true);
    }
    function onMenuClose() {
        setMenuOpen(false);
    }
    const prevMonthName = monthUtils.format(monthUtils.prevMonth(month), 'MMM', locale);
    const ExpandOrCollapseIcon = collapsed
        ? SvgArrowButtonDown1
        : SvgArrowButtonUp1;
    const displayMonth = monthUtils.format(month, 'MMMM ‘yy', locale);
    const { t } = useTranslation();
    return (_jsx(View, { "data-testid": "budget-summary", style: {
            backgroundColor: month === currentMonth
                ? theme.budgetCurrentMonth
                : theme.budgetOtherMonth,
            boxShadow: styles.cardShadow,
            borderRadius: 6,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 5,
            flex: 1,
            cursor: 'default',
            marginBottom: 5,
            overflow: 'hidden',
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }, children: _jsxs(SheetNameProvider, { name: monthUtils.sheetForMonth(month), children: [_jsxs(View, { style: {
                        padding: '0 13px',
                        ...(collapsed ? { margin: '10px 0' } : { marginTop: 16 }),
                    }, children: [_jsx(View, { style: {
                                position: 'absolute',
                                left: 10,
                                top: 0,
                            }, children: _jsx(Button, { variant: "bare", "aria-label": collapsed
                                    ? t('Expand month summary')
                                    : t('Collapse month summary'), className: "hover-visible", onPress: onToggleSummaryCollapse, children: _jsx(ExpandOrCollapseIcon, { width: 13, height: 13, 
                                    // The margin is to make it the exact same size as the dots button
                                    style: { color: theme.tableTextLight, margin: 1 } }) }) }), _jsx("div", { className: css([
                                {
                                    textAlign: 'center',
                                    marginTop: 3,
                                    fontSize: 18,
                                    fontWeight: 500,
                                    textDecorationSkip: 'ink',
                                },
                                currentMonth === month && { fontWeight: 'bold' },
                            ]), children: monthUtils.format(month, 'MMMM', locale) }), _jsxs(View, { style: {
                                position: 'absolute',
                                right: 10,
                                top: 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }, children: [_jsx(View, { children: _jsx(NotesButton, { id: `budget-${month}`, width: 15, height: 15, tooltipPosition: "bottom right", defaultColor: theme.tableTextLight }) }), _jsxs(View, { style: { userSelect: 'none', marginLeft: 2 }, children: [_jsx(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Menu'), onPress: onMenuOpen, children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { color: theme.pageTextLight } }) }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, onOpenChange: onMenuClose, children: _jsx(BudgetMonthMenu, { onCopyLastMonthBudget: () => {
                                                    onBudgetAction(month, 'copy-last');
                                                    onMenuClose();
                                                    showUndoNotification({
                                                        message: t('{{displayMonth}} budgets have all been set to last month’s budgeted amounts.', { displayMonth }),
                                                    });
                                                }, onSetBudgetsToZero: () => {
                                                    onBudgetAction(month, 'set-zero');
                                                    onMenuClose();
                                                    showUndoNotification({
                                                        message: t('{{displayMonth}} budgets have all been set to zero.', { displayMonth }),
                                                    });
                                                }, onSetMonthsAverage: numberOfMonths => {
                                                    onBudgetAction(month, `set-${numberOfMonths}-avg`);
                                                    onMenuClose();
                                                    showUndoNotification({
                                                        message: numberOfMonths === 12
                                                            ? t(`${displayMonth} budgets have all been set to yearly average.`)
                                                            : t(`${displayMonth} budgets have all been set to ${numberOfMonths} month average.`),
                                                    });
                                                }, onCheckTemplates: () => {
                                                    onBudgetAction(month, 'check-templates');
                                                    onMenuClose();
                                                }, onApplyBudgetTemplates: () => {
                                                    onBudgetAction(month, 'apply-goal-template');
                                                    onMenuClose();
                                                    showUndoNotification({
                                                        message: t('{{displayMonth}} budget templates have been applied.', { displayMonth }),
                                                    });
                                                }, onOverwriteWithBudgetTemplates: () => {
                                                    onBudgetAction(month, 'overwrite-goal-template');
                                                    onMenuClose();
                                                    showUndoNotification({
                                                        message: t('{{displayMonth}} budget templates have been overwritten.', { displayMonth }),
                                                    });
                                                }, onEndOfMonthCleanup: () => {
                                                    onBudgetAction(month, 'cleanup-goal-template');
                                                    onMenuClose();
                                                    showUndoNotification({
                                                        message: t('{{displayMonth}} end-of-month cleanup templates have been applied.', { displayMonth }),
                                                    });
                                                } }) })] })] })] }), collapsed ? (_jsx(View, { style: {
                        alignItems: 'center',
                        padding: '10px 20px',
                        justifyContent: 'space-between',
                        backgroundColor: theme.tableBackground,
                        borderTop: '1px solid ' + theme.tableBorder,
                    }, children: _jsx(ToBudget, { prevMonthName: prevMonthName, month: month, onBudgetAction: onBudgetAction, isCollapsed: true }) })) : (_jsxs(_Fragment, { children: [_jsx(TotalsList, { prevMonthName: prevMonthName, style: {
                                padding: '5px 0',
                                marginTop: 17,
                                backgroundColor: theme.tableRowHeaderBackground,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                borderColor: theme.tableBorder,
                            } }), _jsx(View, { style: { margin: '23px 0' }, children: _jsx(ToBudget, { prevMonthName: prevMonthName, month: month, onBudgetAction: onBudgetAction }) })] }))] }) }));
});
BudgetSummary.displayName = 'EnvelopeBudgetSummary';
