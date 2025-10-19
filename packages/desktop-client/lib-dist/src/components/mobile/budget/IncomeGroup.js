import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Card } from '@actual-app/components/card';
import { SvgExpandArrow } from '@actual-app/components/icons/v0';
import { SvgCheveronRight } from '@actual-app/components/icons/v1';
import { Label } from '@actual-app/components/label';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { AutoTextSize } from 'auto-text-size';
import * as monthUtils from 'loot-core/shared/months';
import { getColumnWidth, ROW_HEIGHT } from './BudgetTable';
import { IncomeCategoryList } from './IncomeCategoryList';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { CellValue } from '@desktop-client/components/spreadsheet/CellValue';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { envelopeBudget, trackingBudget, } from '@desktop-client/spreadsheet/bindings';
export function IncomeGroup({ categoryGroup, month, showHiddenCategories, onEditCategoryGroup, onEditCategory, onBudgetAction, isCollapsed, onToggleCollapse, }) {
    const { t } = useTranslation();
    const columnWidth = getColumnWidth();
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const categories = useMemo(() => isCollapsed(categoryGroup.id)
        ? []
        : (categoryGroup.categories?.filter(category => !category.hidden || showHiddenCategories) ?? []), [
        categoryGroup.categories,
        categoryGroup.id,
        isCollapsed,
        showHiddenCategories,
    ]);
    return (_jsxs(View, { children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginTop: 50,
                    marginBottom: 5,
                    marginRight: 15,
                }, children: [budgetType === 'tracking' && (_jsx(Label, { title: t('Budgeted'), style: { width: columnWidth } })), _jsx(Label, { title: t('Received'), style: { width: columnWidth } })] }), _jsxs(Card, { style: { marginTop: 0 }, children: [_jsx(IncomeGroupHeader, { group: categoryGroup, month: month, onEdit: onEditCategoryGroup, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse }), _jsx(IncomeCategoryList, { categories: categories, month: month, onEditCategory: onEditCategory, onBudgetAction: onBudgetAction })] })] }));
}
function IncomeGroupHeader({ group, month, onEdit, isCollapsed, onToggleCollapse, style, }) {
    return (_jsxs(View, { style: {
            height: ROW_HEIGHT,
            borderBottomWidth: 1,
            borderColor: theme.tableBorder,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 5,
            paddingRight: 5,
            opacity: !!group.hidden ? 0.5 : undefined,
            backgroundColor: monthUtils.isCurrentMonth(month)
                ? theme.budgetHeaderCurrentMonth
                : theme.budgetHeaderOtherMonth,
            ...style,
        }, "data-testid": "category-group-row", children: [_jsx(IncomeGroupName, { group: group, onEdit: onEdit, isCollapsed: isCollapsed, onToggleCollapse: onToggleCollapse }), _jsx(IncomeGroupCells, { group: group })] }));
}
function IncomeGroupName({ group, onEdit, isCollapsed, onToggleCollapse, }) {
    const sidebarColumnWidth = getColumnWidth({
        isSidebar: true,
        offset: -13.5,
    });
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: sidebarColumnWidth,
        }, children: [_jsx(Button, { variant: "bare", className: css({
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
                }, onPress: () => onEdit(group.id), children: _jsxs(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }, children: [_jsx(Text, { style: {
                                ...styles.lineClamp(2),
                                width: sidebarColumnWidth,
                                textAlign: 'left',
                                ...styles.smallText,
                            }, "data-testid": "category-group-name", children: group.name }), _jsx(SvgCheveronRight, { style: { flexShrink: 0, color: theme.tableTextSubdued }, width: 14, height: 14 })] }) })] }));
}
function IncomeGroupCells({ group }) {
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const format = useFormat();
    const budgeted = budgetType === 'tracking' ? trackingBudget.groupBudgeted(group.id) : null;
    const balance = budgetType === 'tracking'
        ? trackingBudget.groupSumAmount(group.id)
        : envelopeBudget.groupSumAmount(group.id);
    const columnWidth = getColumnWidth();
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 5,
        }, children: [budgeted && (_jsx(CellValue, { binding: budgeted, type: "financial", children: ({ type, value }) => (_jsx(View, { children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: {
                                width: columnWidth,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                paddingLeft: 5,
                                textAlign: 'right',
                                fontSize: 12,
                                fontWeight: '500',
                            }, children: format(value, type) }, value) }) })) })), _jsx(CellValue, { binding: balance, type: "financial", children: ({ type, value }) => (_jsx(View, { children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: {
                                width: columnWidth,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                paddingLeft: 5,
                                textAlign: 'right',
                                fontSize: 12,
                                fontWeight: '500',
                            }, children: format(value, type) }, value) }) })) })] }));
}
