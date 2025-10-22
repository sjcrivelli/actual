"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculate = recalculate;
var monthUtils = require("loot-core/shared/months");
var filterHiddenItems_1 = require("./filterHiddenItems");
function recalculate(_a) {
    var item = _a.item, intervals = _a.intervals, assets = _a.assets, debts = _a.debts, groupByLabel = _a.groupByLabel, showOffBudget = _a.showOffBudget, showHiddenCategories = _a.showHiddenCategories, showUncategorized = _a.showUncategorized, startDate = _a.startDate, endDate = _a.endDate;
    var totalAssets = 0;
    var totalDebts = 0;
    var intervalData = intervals.reduce(function (arr, intervalItem, index) {
        var last = arr.length === 0 ? null : arr[arr.length - 1];
        var groupsByCategory = groupByLabel === 'category' || groupByLabel === 'categoryGroup';
        var intervalAssets = (0, filterHiddenItems_1.filterHiddenItems)(item, assets, showOffBudget, showHiddenCategories, showUncategorized, groupsByCategory)
            .filter(function (asset) {
            var _a;
            return asset.date === intervalItem &&
                (asset[groupByLabel] === ((_a = item.id) !== null && _a !== void 0 ? _a : null) ||
                    (item.uncategorized_id && groupsByCategory));
        })
            .reduce(function (a, v) { return (a = a + v.amount); }, 0);
        totalAssets += intervalAssets;
        var intervalDebts = (0, filterHiddenItems_1.filterHiddenItems)(item, debts, showOffBudget, showHiddenCategories, showUncategorized, groupsByCategory)
            .filter(function (debt) {
            var _a;
            return debt.date === intervalItem &&
                (debt[groupByLabel] === ((_a = item.id) !== null && _a !== void 0 ? _a : null) ||
                    (item.uncategorized_id && groupsByCategory));
        })
            .reduce(function (a, v) { return (a = a + v.amount); }, 0);
        totalDebts += intervalDebts;
        var intervalTotals = intervalAssets + intervalDebts;
        var change = last ? intervalTotals - last.totalTotals : 0;
        arr.push({
            totalAssets: intervalAssets,
            totalDebts: intervalDebts,
            netAssets: intervalTotals > 0 ? intervalTotals : 0,
            netDebts: intervalTotals < 0 ? intervalTotals : 0,
            totalTotals: intervalTotals,
            change: change,
            intervalStartDate: index === 0 ? startDate : intervalItem,
            intervalEndDate: index + 1 === intervals.length
                ? endDate
                : monthUtils.subDays(intervals[index + 1], 1),
        });
        return arr;
    }, []);
    var totalTotals = totalAssets + totalDebts;
    return {
        id: item.id || '',
        name: item.name,
        totalAssets: totalAssets,
        totalDebts: totalDebts,
        netAssets: totalTotals > 0 ? totalTotals : 0,
        netDebts: totalTotals < 0 ? totalTotals : 0,
        totalTotals: totalTotals,
        intervalData: intervalData,
    };
}
