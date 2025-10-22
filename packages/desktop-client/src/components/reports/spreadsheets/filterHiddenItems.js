"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterHiddenItems = filterHiddenItems;
function filterHiddenItems(item, data, showOffBudget, showHiddenCategories, showUncategorized, groupByCategory) {
    var showHide = data
        .filter(function (e) {
        return showHiddenCategories ||
            (e.categoryHidden === false && e.categoryGroupHidden === false);
    })
        .filter(function (e) { return showOffBudget || e.accountOffBudget === false; })
        .filter(function (e) {
        return showUncategorized || e.category !== null || e.accountOffBudget === true;
    });
    return showHide.filter(function (query) {
        if (!groupByCategory)
            return true;
        var hasCategory = !!query.category;
        var isOffBudget = query.accountOffBudget;
        var isTransfer = !!query.transferAccount;
        if (hasCategory && !isOffBudget) {
            return item.uncategorized_id == null;
        }
        switch (item.uncategorized_id) {
            case 'off_budget':
                return isOffBudget;
            case 'transfer':
                return isTransfer && !isOffBudget;
            case 'other':
                return !isOffBudget && !isTransfer;
            case 'all':
                return true;
            default:
                return false;
        }
    });
}
