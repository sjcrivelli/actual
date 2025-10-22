"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showActivity = showActivity;
var monthUtils = require("loot-core/shared/months");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
function showActivity(_a) {
    var navigate = _a.navigate, categories = _a.categories, accounts = _a.accounts, balanceTypeOp = _a.balanceTypeOp, filters = _a.filters, showHiddenCategories = _a.showHiddenCategories, showOffBudget = _a.showOffBudget, type = _a.type, startDate = _a.startDate, endDate = _a.endDate, field = _a.field, id = _a.id, _b = _a.interval, interval = _b === void 0 ? 'Day' : _b;
    var isOutFlow = balanceTypeOp === 'totalDebts' || type === 'debts' ? true : false;
    var hiddenCategories = categories.list.filter(function (f) { return f.hidden; }).map(function (e) { return e.id; });
    var offBudgetAccounts = accounts.filter(function (f) { return f.offbudget; }).map(function (e) { return e.id; });
    var fromDate = interval === 'Weekly'
        ? 'dayFromDate'
        : ((ReportOptions_1.ReportOptions.intervalMap.get(interval) || 'Day').toLowerCase() +
            'FromDate');
    var isDateOp = interval === 'Weekly' || type !== 'time';
    var filterConditions = __spreadArray(__spreadArray([], filters, true), [
        id && { field: field, op: 'is', value: id, type: 'id' },
        {
            field: 'date',
            op: isDateOp ? 'gte' : 'is',
            value: isDateOp ? startDate : monthUtils[fromDate](startDate),
            type: 'date',
        },
        isDateOp && {
            field: 'date',
            op: 'lte',
            value: endDate,
            options: { date: true },
        },
        !(['netAssets', 'netDebts'].includes(balanceTypeOp) ||
            (balanceTypeOp === 'totalTotals' &&
                (type === 'totals' || type === 'time'))) && {
            field: 'amount',
            op: 'gte',
            value: 0,
            options: {
                type: 'number',
                inflow: !isOutFlow,
                outflow: isOutFlow,
            },
        },
        hiddenCategories.length > 0 &&
            !showHiddenCategories && {
            field: 'category',
            op: 'notOneOf',
            value: hiddenCategories,
            type: 'id',
        },
        offBudgetAccounts.length > 0 &&
            !showOffBudget && {
            field: 'account',
            op: 'notOneOf',
            value: offBudgetAccounts,
            type: 'id',
        },
    ], false).filter(function (f) { return f; });
    navigate('/accounts', {
        state: {
            goBack: true,
            filterConditions: filterConditions,
        },
    });
}
