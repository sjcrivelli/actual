import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { GridListItem } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheveronRight } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { groupById, integerToCurrency } from 'loot-core/shared/util';
import { BalanceCell } from './BalanceCell';
import { BudgetCell } from './BudgetCell';
import { getColumnWidth, ROW_HEIGHT } from './BudgetTable';
import { SpentCell } from './SpentCell';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useUndo } from '@desktop-client/hooks/useUndo';
import { collapseModals, pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
import { envelopeBudget, trackingBudget, } from '@desktop-client/spreadsheet/bindings';
function ExpenseCategoryName({ category, onEditCategory, show3Columns, }) {
    const sidebarColumnWidth = getColumnWidth({
        show3Columns,
        isSidebar: true,
    });
    return (_jsxs(View, { style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
        }, children: [_jsx(Button, { slot: "drag", style: {
                    opacity: 0,
                    width: 1,
                    height: 1,
                    position: 'absolute',
                    overflow: 'hidden',
                } }), _jsx(Button, { variant: "bare", style: {
                    maxWidth: sidebarColumnWidth,
                }, onPress: () => onEditCategory?.(category.id), children: _jsxs(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }, children: [_jsx(Text, { style: {
                                ...styles.lineClamp(2),
                                width: sidebarColumnWidth,
                                textAlign: 'left',
                                ...styles.smallText,
                            }, "data-testid": "category-name", children: category.name }), _jsx(SvgCheveronRight, { style: { flexShrink: 0, color: theme.tableTextSubdued }, width: 14, height: 14 })] }) })] }));
}
function ExpenseCategoryCells({ category, month, onBudgetAction, show3Columns, showBudgetedColumn, onOpenBalanceMenu, onShowActivity, }) {
    const { t } = useTranslation();
    const columnWidth = getColumnWidth({
        show3Columns,
        isSidebar: false,
    });
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const budgeted = budgetType === 'tracking'
        ? trackingBudget.catBudgeted(category.id)
        : envelopeBudget.catBudgeted(category.id);
    const spent = budgetType === 'tracking'
        ? trackingBudget.catSumAmount(category.id)
        : envelopeBudget.catSumAmount(category.id);
    const balance = budgetType === 'tracking'
        ? trackingBudget.catBalance(category.id)
        : envelopeBudget.catBalance(category.id);
    return (_jsxs(View, { style: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
        }, children: [_jsx(View, { style: {
                    ...(!show3Columns && !showBudgetedColumn && { display: 'none' }),
                    width: columnWidth,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }, children: _jsx(BudgetCell, { binding: budgeted, type: "financial", category: category, month: month, onBudgetAction: onBudgetAction }) }), _jsx(View, { style: {
                    ...(!show3Columns && showBudgetedColumn && { display: 'none' }),
                    width: columnWidth,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }, children: _jsx(SpentCell, { binding: spent, category: category, month: month, show3Columns: show3Columns, onPress: onShowActivity }) }), _jsx(View, { style: {
                    width: columnWidth,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }, children: _jsx(BalanceCell, { binding: balance, category: category, show3Columns: show3Columns, onPress: onOpenBalanceMenu, "aria-label": t('Open balance menu for {{categoryName}} category', {
                        categoryName: category.name,
                    }) }) })] }));
}
export function ExpenseCategoryListItem({ month, isHidden, onEditCategory, onBudgetAction, show3Columns, showBudgetedColumn, ...props }) {
    const { value: category } = props;
    const { t } = useTranslation();
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const balanceMenuModalName = `${budgetType}-balance-menu`;
    const dispatch = useDispatch();
    const { showUndoNotification } = useUndo();
    const { list: categories } = useCategories();
    const categoriesById = groupById(categories);
    const onCarryover = useCallback((carryover) => {
        if (!category) {
            return;
        }
        onBudgetAction(month, 'carryover', {
            category: category.id,
            flag: carryover,
        });
        dispatch(collapseModals({ rootModalName: balanceMenuModalName }));
    }, [category, onBudgetAction, month, dispatch, balanceMenuModalName]);
    const catBalance = useSheetValue(budgetType === 'envelope'
        ? envelopeBudget.catBalance(category?.id)
        : trackingBudget.catBalance(category?.id));
    const onTransfer = useCallback(() => {
        if (!category) {
            return;
        }
        dispatch(pushModal({
            modal: {
                name: 'transfer',
                options: {
                    title: category.name,
                    categoryId: category.id,
                    month,
                    amount: catBalance || 0,
                    onSubmit: (amount, toCategoryId) => {
                        onBudgetAction(month, 'transfer-category', {
                            amount,
                            from: category.id,
                            to: toCategoryId,
                        });
                        dispatch(collapseModals({ rootModalName: balanceMenuModalName }));
                        showUndoNotification({
                            message: `Transferred ${integerToCurrency(amount)} from ${category.name} to ${categoriesById[toCategoryId].name}.`,
                        });
                    },
                    showToBeBudgeted: true,
                },
            },
        }));
    }, [
        category,
        dispatch,
        month,
        catBalance,
        onBudgetAction,
        balanceMenuModalName,
        showUndoNotification,
        categoriesById,
    ]);
    const onCover = useCallback(() => {
        if (!category) {
            return;
        }
        dispatch(pushModal({
            modal: {
                name: 'cover',
                options: {
                    title: category.name,
                    month,
                    categoryId: category.id,
                    onSubmit: fromCategoryId => {
                        onBudgetAction(month, 'cover-overspending', {
                            to: category.id,
                            from: fromCategoryId,
                        });
                        dispatch(collapseModals({ rootModalName: balanceMenuModalName }));
                        showUndoNotification({
                            message: t(`Covered {{toCategoryName}} overspending from {{fromCategoryName}}.`, {
                                toCategoryName: category.name,
                                fromCategoryName: categoriesById[fromCategoryId].name,
                            }),
                        });
                    },
                },
            },
        }));
    }, [
        category,
        dispatch,
        month,
        onBudgetAction,
        balanceMenuModalName,
        showUndoNotification,
        t,
        categoriesById,
    ]);
    const onOpenBalanceMenu = useCallback(() => {
        if (!category) {
            return;
        }
        if (balanceMenuModalName === 'envelope-balance-menu') {
            dispatch(pushModal({
                modal: {
                    name: balanceMenuModalName,
                    options: {
                        month,
                        categoryId: category.id,
                        onCarryover,
                        onTransfer,
                        onCover,
                    },
                },
            }));
        }
        else {
            dispatch(pushModal({
                modal: {
                    name: balanceMenuModalName,
                    options: {
                        month,
                        categoryId: category.id,
                        onCarryover,
                    },
                },
            }));
        }
    }, [
        category,
        balanceMenuModalName,
        dispatch,
        month,
        onCarryover,
        onTransfer,
        onCover,
    ]);
    const navigate = useNavigate();
    const onShowActivity = useCallback(() => {
        if (!category) {
            return;
        }
        navigate(`/categories/${category.id}?month=${month}`);
    }, [category, month, navigate]);
    if (!category) {
        return null;
    }
    return (_jsx(GridListItem, { textValue: category.name, "data-testid": "category-row", ...props, children: _jsxs(View, { style: {
                height: ROW_HEIGHT,
                borderColor: theme.tableBorder,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 5,
                paddingRight: 5,
                borderBottomWidth: 1,
                opacity: isHidden ? 0.5 : undefined,
                backgroundColor: monthUtils.isCurrentMonth(month)
                    ? theme.budgetCurrentMonth
                    : theme.budgetOtherMonth,
            }, children: [_jsx(ExpenseCategoryName, { category: category, onEditCategory: onEditCategory, show3Columns: show3Columns }), _jsx(ExpenseCategoryCells, { category: category, month: month, onBudgetAction: onBudgetAction, show3Columns: show3Columns, showBudgetedColumn: showBudgetedColumn, onOpenBalanceMenu: onOpenBalanceMenu, onShowActivity: onShowActivity }, `${category.id}-${show3Columns}-${showBudgetedColumn}`)] }) }));
}
