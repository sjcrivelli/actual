import * as monthUtils from 'loot-core/shared/months';
import { filterHiddenItems } from './filterHiddenItems';
export function recalculate({ item, intervals, assets, debts, groupByLabel, showOffBudget, showHiddenCategories, showUncategorized, startDate, endDate, }) {
    let totalAssets = 0;
    let totalDebts = 0;
    const intervalData = intervals.reduce((arr, intervalItem, index) => {
        const last = arr.length === 0 ? null : arr[arr.length - 1];
        const groupsByCategory = groupByLabel === 'category' || groupByLabel === 'categoryGroup';
        const intervalAssets = filterHiddenItems(item, assets, showOffBudget, showHiddenCategories, showUncategorized, groupsByCategory)
            .filter(asset => asset.date === intervalItem &&
            (asset[groupByLabel] === (item.id ?? null) ||
                (item.uncategorized_id && groupsByCategory)))
            .reduce((a, v) => (a = a + v.amount), 0);
        totalAssets += intervalAssets;
        const intervalDebts = filterHiddenItems(item, debts, showOffBudget, showHiddenCategories, showUncategorized, groupsByCategory)
            .filter(debt => debt.date === intervalItem &&
            (debt[groupByLabel] === (item.id ?? null) ||
                (item.uncategorized_id && groupsByCategory)))
            .reduce((a, v) => (a = a + v.amount), 0);
        totalDebts += intervalDebts;
        const intervalTotals = intervalAssets + intervalDebts;
        const change = last ? intervalTotals - last.totalTotals : 0;
        arr.push({
            totalAssets: intervalAssets,
            totalDebts: intervalDebts,
            netAssets: intervalTotals > 0 ? intervalTotals : 0,
            netDebts: intervalTotals < 0 ? intervalTotals : 0,
            totalTotals: intervalTotals,
            change,
            intervalStartDate: index === 0 ? startDate : intervalItem,
            intervalEndDate: index + 1 === intervals.length
                ? endDate
                : monthUtils.subDays(intervals[index + 1], 1),
        });
        return arr;
    }, []);
    const totalTotals = totalAssets + totalDebts;
    return {
        id: item.id || '',
        name: item.name,
        totalAssets,
        totalDebts,
        netAssets: totalTotals > 0 ? totalTotals : 0,
        netDebts: totalTotals < 0 ? totalTotals : 0,
        totalTotals,
        intervalData,
    };
}
