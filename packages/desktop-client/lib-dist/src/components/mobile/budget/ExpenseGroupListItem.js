import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { GridListItem } from 'react-aria-components';
import { Button } from '@actual-app/components/button';
import { Card } from '@actual-app/components/card';
import { SvgExpandArrow } from '@actual-app/components/icons/v0';
import { SvgCheveronRight } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { AutoTextSize } from 'auto-text-size';
import * as monthUtils from 'loot-core/shared/months';
import { getColumnWidth, ROW_HEIGHT } from './BudgetTable';
import { ExpenseCategoryList } from './ExpenseCategoryList';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { CellValue } from '@desktop-client/components/spreadsheet/CellValue';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { envelopeBudget, trackingBudget, } from '@desktop-client/spreadsheet/bindings';
export function ExpenseGroupListItem({ onEditCategoryGroup, onEditCategory, month, onBudgetAction, showBudgetedColumn, show3Columns, showHiddenCategories, isCollapsed, onToggleCollapse, isHidden, ...props }) {
    const { value: categoryGroup } = props;
    const categories = useMemo(() => !categoryGroup || isCollapsed(categoryGroup.id)
        ? []
        : (categoryGroup.categories?.filter(category => !category.hidden || showHiddenCategories) ?? []), [categoryGroup, isCollapsed, showHiddenCategories]);
    const shouldHideCategory = useCallback((category) => {
        return !!(category.hidden || categoryGroup?.hidden);
    }, [categoryGroup?.hidden]);
    if (!categoryGroup) {
        return null;
    }
    return (_jsx(GridListItem, { textValue: categoryGroup.name, ...props, children: _jsxs(Card, { style: {
                marginTop: 4,
                marginBottom: 4,
            }, children: [_jsx(ExpenseGroupHeader, { categoryGroup: categoryGroup, month: month, showBudgetedColumn: showBudgetedColumn, show3Columns: show3Columns, onEditCategoryGroup: onEditCategoryGroup, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse, isHidden: isHidden }), _jsx(ExpenseCategoryList, { categoryGroup: categoryGroup, categories: categories, month: month, onEditCategory: onEditCategory, onBudgetAction: onBudgetAction, shouldHideCategory: shouldHideCategory, show3Columns: show3Columns, showBudgetedColumn: showBudgetedColumn })] }) }));
}
export function ExpenseGroupHeader({ categoryGroup, month, onEditCategoryGroup, show3Columns, showBudgetedColumn, isCollapsed, onToggleCollapse, isHidden, }) {
    return (_jsxs(View, { style: {
            height: ROW_HEIGHT,
            borderBottomWidth: 1,
            borderColor: theme.tableBorder,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 5,
            paddingRight: 5,
            opacity: isHidden ? 0.5 : undefined,
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme.budgetHeaderCurrentMonth
                : theme.budgetHeaderOtherMonth,
        }, "data-testid": "category-group-row", children: [_jsx(ExpenseGroupName, { group: categoryGroup, onEditCategoryGroup: onEditCategoryGroup, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse, show3Columns: show3Columns }), _jsx(ExpenseGroupCells, { group: categoryGroup, show3Columns: show3Columns, showBudgetedColumn: showBudgetedColumn })] }));
}
function ExpenseGroupName({ group, onEditCategoryGroup, isCollapsed, onToggleCollapse, show3Columns, }) {
    const sidebarColumnWidth = getColumnWidth({
        show3Columns,
        isSidebar: true,
        offset: -3.5,
    });
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: sidebarColumnWidth,
        }, children: [_jsx(Button, { slot: "drag", style: {
                    opacity: 0,
                    width: 1,
                    height: 1,
                    position: 'absolute',
                    overflow: 'hidden',
                } }), _jsx(Button, { variant: "bare", className: css({
                    flexShrink: 0,
                    color: theme.pageTextSubdued,
                    '&[data-pressed]': {
                        backgroundColor: 'transparent',
                    },
                    marginLeft: -5,
                }), onPress: () => onToggleCollapse(group.id), children: _jsx(SvgExpandArrow, { width: 8, height: 8, style: {
                        flexShrink: 0,
                        transition: 'transform .1s',
                        transform: isCollapsed(group.id) ? 'rotate(-90deg)' : '',
                    } }) }), _jsx(Button, { variant: "bare", style: {
                    maxWidth: sidebarColumnWidth,
                }, onPress: () => onEditCategoryGroup(group.id), children: _jsxs(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }, children: [_jsx(Text, { style: {
                                ...styles.lineClamp(2),
                                width: sidebarColumnWidth,
                                textAlign: 'left',
                                ...styles.smallText,
                                fontWeight: '500',
                            }, "data-testid": "category-group-name", children: group.name }), _jsx(SvgCheveronRight, { style: { flexShrink: 0, color: theme.tableTextSubdued }, width: 14, height: 14 })] }) })] }));
}
function ExpenseGroupCells({ group, show3Columns, showBudgetedColumn, }) {
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const format = useFormat();
    const columnWidth = getColumnWidth({ show3Columns });
    const amountStyle = {
        width: columnWidth,
        fontSize: 12,
        fontWeight: '500',
        paddingLeft: 5,
        textAlign: 'right',
    };
    const budgeted = budgetType === 'tracking'
        ? trackingBudget.groupBudgeted(group.id)
        : envelopeBudget.groupBudgeted(group.id);
    const spent = budgetType === 'tracking'
        ? trackingBudget.groupSumAmount(group.id)
        : envelopeBudget.groupSumAmount(group.id);
    const balance = budgetType === 'tracking'
        ? trackingBudget.groupBalance(group.id)
        : envelopeBudget.groupBalance(group.id);
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 5,
        }, children: [_jsx(View, { style: {
                    ...(!show3Columns && !showBudgetedColumn && { display: 'none' }),
                }, children: _jsx(CellValue, { binding: budgeted, type: "financial", children: ({ type, value }) => (_jsx(View, { children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: amountStyle, children: format(value, type) }, value) }) })) }) }), _jsx(View, { style: {
                    ...(!show3Columns && showBudgetedColumn && { display: 'none' }),
                }, children: _jsx(CellValue, { binding: spent, type: "financial", children: ({ type, value }) => (_jsx(View, { children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: amountStyle, children: format(value, type) }, value) }) })) }) }), _jsx(CellValue, { binding: balance, type: "financial", children: ({ type, value }) => (_jsx(View, { children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: amountStyle, children: format(value, type) }, value) }) })) })] }));
}
