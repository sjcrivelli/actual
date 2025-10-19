import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { t } from 'i18next';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { getValidMonthBounds } from './MonthsContext';
export function addToBeBudgetedGroup(groups) {
    return [
        {
            id: 'to-budget',
            name: t('To Budget'),
            categories: [
                {
                    id: 'to-budget',
                    name: t('To Budget'),
                    group: 'to-budget',
                },
            ],
        },
        ...groups,
    ];
}
export function removeCategoriesFromGroups(categoryGroups, ...categoryIds) {
    if (!categoryIds || categoryIds.length === 0)
        return categoryGroups;
    const categoryIdsSet = new Set(categoryIds);
    return categoryGroups
        .map(group => ({
        ...group,
        categories: group.categories?.filter(cat => !categoryIdsSet.has(cat.id)) ?? [],
    }))
        .filter(group => group.categories?.length);
}
export function separateGroups(categoryGroups) {
    return [
        categoryGroups.filter(g => !g.is_income),
        categoryGroups.find(g => g.is_income),
    ];
}
export function makeAmountGrey(value) {
    return value === 0 || value === '0' || value === '' || value == null
        ? { color: theme.tableTextSubdued }
        : null;
}
export function makeBalanceAmountStyle(value, goalValue, budgetedValue) {
    if (value < 0) {
        return { color: theme.errorText };
    }
    if (goalValue == null) {
        const greyed = makeAmountGrey(value);
        if (greyed) {
            return greyed;
        }
    }
    else {
        if (budgetedValue < goalValue) {
            return { color: theme.warningText };
        }
        return { color: theme.noticeText };
    }
}
export function makeAmountFullStyle(value, colors) {
    const positiveColorToUse = colors?.positiveColor || theme.noticeText;
    const negativeColorToUse = colors?.negativeColor || theme.errorText;
    const zeroColorToUse = colors?.zeroColor || theme.tableTextSubdued;
    return {
        color: value < 0
            ? negativeColorToUse
            : value === 0
                ? zeroColorToUse
                : positiveColorToUse,
    };
}
export function findSortDown(arr, pos, targetId) {
    if (pos === 'top') {
        return { targetId };
    }
    else {
        const idx = arr.findIndex(item => item.id === targetId);
        if (idx === -1) {
            throw new Error('findSort: item not found: ' + targetId);
        }
        const newIdx = idx + 1;
        if (newIdx < arr.length) {
            return { targetId: arr[newIdx].id };
        }
        else {
            // Move to the end
            return { targetId: null };
        }
    }
}
export function findSortUp(arr, pos, targetId) {
    if (pos === 'bottom') {
        return { targetId };
    }
    else {
        const idx = arr.findIndex(item => item.id === targetId);
        if (idx === -1) {
            throw new Error('findSort: item not found: ' + targetId);
        }
        const newIdx = idx - 1;
        if (newIdx >= 0) {
            return { targetId: arr[newIdx].id };
        }
        else {
            // Move to the beginning
            return { targetId: null };
        }
    }
}
export function getScrollbarWidth() {
    return Math.max(styles.scrollbarWidth - 2, 0);
}
export async function prewarmMonth(budgetType, spreadsheet, month) {
    const method = budgetType === 'tracking'
        ? 'tracking-budget-month'
        : 'envelope-budget-month';
    const values = await send(method, { month });
    for (const value of values) {
        spreadsheet.prewarmCache(value.name, value);
    }
}
export async function prewarmAllMonths(budgetType, spreadsheet, bounds, startMonth) {
    const numMonths = 3;
    bounds = getValidMonthBounds(bounds, monthUtils.subMonths(startMonth, 1), monthUtils.addMonths(startMonth, numMonths + 1));
    const months = monthUtils.rangeInclusive(bounds.start, bounds.end);
    await Promise.all(months.map(month => prewarmMonth(budgetType, spreadsheet, month)));
}
