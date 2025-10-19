import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, } from 'react';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { q } from 'loot-core/shared/query';
import { BudgetCategories } from './BudgetCategories';
import { BudgetSummaries } from './BudgetSummaries';
import { BudgetTotals } from './BudgetTotals';
import { MonthsProvider } from './MonthsContext';
import { findSortDown, findSortUp, getScrollbarWidth, separateGroups, } from './util';
import { SchedulesProvider } from '@desktop-client/hooks/useCachedSchedules';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
export function BudgetTable(props) {
    const { type, prewarmStartMonth, startMonth, numMonths, monthBounds, dataComponents, onSaveCategory, onDeleteCategory, onSaveGroup, onDeleteGroup, onApplyBudgetTemplatesInGroup, onReorderCategory, onReorderGroup, onShowActivity, onBudgetAction, } = props;
    const { grouped: categoryGroups = [] } = useCategories();
    const [collapsedGroupIds = [], setCollapsedGroupIdsPref] = useLocalPref('budget.collapsed');
    const [showHiddenCategories, setShowHiddenCategoriesPef] = useLocalPref('budget.showHiddenCategories');
    const [categoryExpandedStatePref] = useGlobalPref('categoryExpandedState');
    const categoryExpandedState = categoryExpandedStatePref ?? 0;
    const [editing, setEditing] = useState(null);
    const onEditMonth = (id, month) => {
        setEditing(id ? { id, cell: month } : null);
    };
    const onEditName = (id) => {
        setEditing(id ? { id, cell: 'name' } : null);
    };
    const _onReorderCategory = (id, dropPos, targetId) => {
        const isGroup = !!categoryGroups.find(g => g.id === targetId);
        if (isGroup) {
            const { targetId: groupId } = findSortUp(categoryGroups, dropPos, targetId);
            const group = categoryGroups.find(g => g.id === groupId);
            if (group) {
                const { categories = [] } = group;
                onReorderCategory({
                    id,
                    groupId: group.id,
                    targetId: categories.length === 0 || dropPos === 'top'
                        ? null
                        : categories[0].id,
                });
            }
        }
        else {
            let targetGroup;
            for (const group of categoryGroups) {
                if (group.categories?.find(cat => cat.id === targetId)) {
                    targetGroup = group;
                    break;
                }
            }
            onReorderCategory({
                id,
                groupId: targetGroup?.id,
                ...findSortDown(targetGroup?.categories || [], dropPos, targetId),
            });
        }
    };
    const _onReorderGroup = (id, dropPos, targetId) => {
        const [expenseGroups] = separateGroups(categoryGroups); // exclude Income group from sortable groups to fix off-by-one error
        onReorderGroup({
            id,
            ...findSortDown(expenseGroups, dropPos, targetId),
        });
    };
    const moveVertically = (dir) => {
        const flattened = categoryGroups.reduce((all, group) => {
            if (collapsedGroupIds.includes(group.id)) {
                return all.concat({ id: group.id, isGroup: true });
            }
            return all.concat([
                { id: group.id, isGroup: true },
                ...(group?.categories || []),
            ]);
        }, []);
        if (editing) {
            const idx = flattened.findIndex(item => item.id === editing.id);
            let nextIdx = idx + dir;
            while (nextIdx >= 0 && nextIdx < flattened.length) {
                const next = flattened[nextIdx];
                if ('isGroup' in next && next.isGroup) {
                    nextIdx += dir;
                    continue;
                }
                else if (type === 'tracking' ||
                    ('is_income' in next && !next.is_income)) {
                    onEditMonth(next.id, editing.cell);
                    return;
                }
                else {
                    break;
                }
            }
        }
    };
    const onKeyDown = (e) => {
        if (!editing) {
            return null;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            moveVertically(e.shiftKey ? -1 : 1);
        }
    };
    const onCollapse = (collapsedIds) => {
        setCollapsedGroupIdsPref(collapsedIds);
    };
    const onToggleHiddenCategories = () => {
        setShowHiddenCategoriesPef(!showHiddenCategories);
    };
    const toggleHiddenCategories = () => {
        onToggleHiddenCategories();
    };
    const expandAllCategories = () => {
        onCollapse([]);
    };
    const collapseAllCategories = () => {
        onCollapse(categoryGroups.map(g => g.id));
    };
    const schedulesQuery = useMemo(() => q('schedules').select('*'), []);
    return (_jsxs(View, { "data-testid": "budget-table", style: {
            flex: 1,
            ...(styles.lightScrollbar && {
                '& ::-webkit-scrollbar': {
                    backgroundColor: 'transparent',
                },
                '& ::-webkit-scrollbar-thumb:vertical': {
                    backgroundColor: theme.tableHeaderBackground,
                },
            }),
        }, children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    overflow: 'hidden',
                    flexShrink: 0,
                    // This is necessary to align with the table because the
                    // table has this padding to allow the shadow to show
                    paddingLeft: 5,
                    paddingRight: 5 + getScrollbarWidth(),
                }, children: [_jsx(View, { style: { width: 200 + 100 * categoryExpandedState } }), _jsx(MonthsProvider, { startMonth: prewarmStartMonth, numMonths: numMonths, monthBounds: monthBounds, type: type, children: _jsx(BudgetSummaries, { SummaryComponent: dataComponents.SummaryComponent }) })] }), _jsxs(MonthsProvider, { startMonth: startMonth, numMonths: numMonths, monthBounds: monthBounds, type: type, children: [_jsx(BudgetTotals, { MonthComponent: dataComponents.BudgetTotalsComponent, toggleHiddenCategories: toggleHiddenCategories, expandAllCategories: expandAllCategories, collapseAllCategories: collapseAllCategories }), _jsx(View, { style: {
                            overflowY: 'scroll',
                            overflowAnchor: 'none',
                            flex: 1,
                            paddingLeft: 5,
                            paddingRight: 5,
                        }, children: _jsx(View, { style: {
                                flexShrink: 0,
                            }, onKeyDown: onKeyDown, children: _jsx(SchedulesProvider, { query: schedulesQuery, children: _jsx(BudgetCategories
                                // @ts-expect-error Fix when migrating BudgetCategories to ts
                                , { 
                                    // @ts-expect-error Fix when migrating BudgetCategories to ts
                                    categoryGroups: categoryGroups, editingCell: editing, dataComponents: dataComponents, onEditMonth: onEditMonth, onEditName: onEditName, onSaveCategory: onSaveCategory, onSaveGroup: onSaveGroup, onDeleteCategory: onDeleteCategory, onDeleteGroup: onDeleteGroup, onReorderCategory: _onReorderCategory, onReorderGroup: _onReorderGroup, onBudgetAction: onBudgetAction, onShowActivity: onShowActivity, onApplyBudgetTemplatesInGroup: onApplyBudgetTemplatesInGroup }) }) }) })] })] }));
}
BudgetTable.displayName = 'BudgetTable';
