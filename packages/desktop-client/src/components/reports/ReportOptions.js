"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.groupBySelections = exports.categoryLists = exports.ReportOptions = exports.defaultReport = void 0;
var i18next_1 = require("i18next");
var monthUtils = require("loot-core/shared/months");
var startDate = monthUtils.subMonths(monthUtils.currentMonth(), 5) + '-01';
var endDate = monthUtils.currentDay();
exports.defaultReport = {
    id: '',
    name: '',
    startDate: startDate,
    endDate: endDate,
    isDateStatic: false,
    dateRange: 'Last 6 months',
    mode: 'total',
    groupBy: 'Category',
    interval: 'Monthly',
    balanceType: 'Payment',
    sortBy: 'desc',
    showEmpty: false,
    showOffBudget: false,
    showHiddenCategories: false,
    includeCurrentInterval: true,
    showUncategorized: false,
    trimIntervals: false,
    graphType: 'BarGraph',
    conditions: [],
    conditionsOp: 'and',
};
var balanceTypeOptions = [
    { description: (0, i18next_1.t)('Payment'), key: 'Payment', format: 'totalDebts' },
    { description: (0, i18next_1.t)('Deposit'), key: 'Deposit', format: 'totalAssets' },
    { description: (0, i18next_1.t)('Net'), key: 'Net', format: 'totalTotals' },
    {
        description: (0, i18next_1.t)('Net Payment'),
        key: 'Net Payment',
        format: 'netDebts',
    },
    {
        description: (0, i18next_1.t)('Net Deposit'),
        key: 'Net Deposit',
        format: 'netAssets',
    },
];
var groupByOptions = [
    { description: (0, i18next_1.t)('Category'), key: 'Category' },
    { description: (0, i18next_1.t)('Group'), key: 'Group' },
    { description: (0, i18next_1.t)('Payee'), key: 'Payee' },
    { description: (0, i18next_1.t)('Account'), key: 'Account' },
    { description: (0, i18next_1.t)('Interval'), key: 'Interval' },
];
var sortByOptions = [
    { description: (0, i18next_1.t)('Ascending'), key: 'Ascending', format: 'asc' },
    { description: (0, i18next_1.t)('Descending'), key: 'Descending', format: 'desc' },
    { description: (0, i18next_1.t)('Name'), key: 'Name', format: 'name' },
    { description: (0, i18next_1.t)('Budget'), key: 'Budget', format: 'budget' },
];
var dateRangeOptions = [
    {
        description: (0, i18next_1.t)('This week'),
        key: 'This week',
        name: 0,
        type: 'Week',
        Daily: true,
        Weekly: true,
        Monthly: false,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('Last week'),
        key: 'Last week',
        name: 1,
        type: 'Week',
        Daily: true,
        Weekly: true,
        Monthly: false,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('This month'),
        key: 'This month',
        name: 0,
        type: 'Month',
        Daily: true,
        Weekly: true,
        Monthly: true,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('Last month'),
        key: 'Last month',
        name: 1,
        type: 'Month',
        Daily: true,
        Weekly: true,
        Monthly: true,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('Last 3 months'),
        key: 'Last 3 months',
        name: 3,
        type: 'Month',
        Daily: true,
        Weekly: true,
        Monthly: true,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('Last 6 months'),
        key: 'Last 6 months',
        name: 6,
        type: 'Month',
        Daily: false,
        Weekly: false,
        Monthly: true,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('Last 12 months'),
        key: 'Last 12 months',
        name: 12,
        type: 'Month',
        Daily: false,
        Weekly: false,
        Monthly: true,
        Yearly: false,
    },
    {
        description: (0, i18next_1.t)('Year to date'),
        key: 'Year to date',
        name: 'yearToDate',
        type: 'Month',
        Daily: false,
        Weekly: true,
        Monthly: true,
        Yearly: true,
    },
    {
        description: (0, i18next_1.t)('Last year'),
        key: 'Last year',
        name: 'lastYear',
        type: 'Month',
        Daily: false,
        Weekly: true,
        Monthly: true,
        Yearly: true,
    },
    {
        description: (0, i18next_1.t)('Prior year to date'),
        key: 'Prior year to date',
        name: 'priorYearToDate',
        type: 'Month',
        Daily: false,
        Weekly: true,
        Monthly: true,
        Yearly: true,
    },
    {
        description: (0, i18next_1.t)('All time'),
        key: 'All time',
        name: 'allTime',
        type: 'Month',
        Daily: false,
        Weekly: true,
        Monthly: true,
        Yearly: true,
    },
];
var intervalOptions = [
    {
        description: (0, i18next_1.t)('Daily'),
        key: 'Daily',
        name: 'Day',
        format: 'yy-MM-dd',
        range: 'dayRangeInclusive',
    },
    {
        description: (0, i18next_1.t)('Weekly'),
        key: 'Weekly',
        name: 'Week',
        format: 'yy-MM-dd',
        range: 'weekRangeInclusive',
    },
    //{ value: 3, description: 'Fortnightly', name: 3},
    {
        description: (0, i18next_1.t)('Monthly'),
        key: 'Monthly',
        name: 'Month',
        // eslint-disable-next-line actual/typography
        format: "MMM ''yy",
        range: 'rangeInclusive',
    },
    {
        description: (0, i18next_1.t)('Yearly'),
        key: 'Yearly',
        name: 'Year',
        format: 'yyyy',
        range: 'yearRangeInclusive',
    },
];
exports.ReportOptions = {
    groupBy: groupByOptions,
    groupByItems: new Set(groupByOptions.map(function (item) { return item.key; })),
    balanceType: balanceTypeOptions,
    balanceTypeMap: new Map(balanceTypeOptions.map(function (item) { return [item.key, item.format]; })),
    sortBy: sortByOptions,
    sortByMap: new Map(sortByOptions.map(function (item) { return [item.key, item.format]; })),
    dateRange: dateRangeOptions,
    dateRangeMap: new Map(dateRangeOptions.map(function (item) { return [item.key, item.name]; })),
    dateRangeType: new Map(dateRangeOptions.map(function (item) { return [item.key, item.type]; })),
    interval: intervalOptions,
    intervalMap: new Map(intervalOptions.map(function (item) { return [item.key, item.name]; })),
    intervalFormat: new Map(intervalOptions.map(function (item) { return [item.key, item.format]; })),
    intervalRange: new Map(intervalOptions.map(function (item) { return [item.key, item.range]; })),
};
var uncategorizedCategory = {
    id: '',
    name: (0, i18next_1.t)('Uncategorized'),
    uncategorized_id: 'other',
    hidden: false,
};
var transferCategory = {
    id: '',
    name: (0, i18next_1.t)('Transfers'),
    uncategorized_id: 'transfer',
    hidden: false,
};
var offBudgetCategory = {
    id: '',
    name: (0, i18next_1.t)('Off budget'),
    uncategorized_id: 'off_budget',
    hidden: false,
};
var uncategorizedGroup = {
    name: (0, i18next_1.t)('Uncategorized & Off budget'),
    id: 'uncategorized',
    hidden: false,
    uncategorized_id: 'all',
    categories: [uncategorizedCategory, transferCategory, offBudgetCategory],
};
var categoryLists = function (categories) {
    var categoriesToSort = __spreadArray([], categories.list, true);
    var categoryList = __spreadArray(__spreadArray([], categoriesToSort.sort(function (a, b) {
        var _a, _b;
        //The point of this sorting is to make the graphs match the "budget" page
        var catGroupA = categories.grouped.find(function (f) { return f.id === a.group; });
        var catGroupB = categories.grouped.find(function (f) { return f.id === b.group; });
        //initial check that both a and b have a sort_order and category group
        return a.sort_order && b.sort_order && catGroupA && catGroupB
            ? /*sorting by "is_income" because sort_order for this group is
            separate from other groups*/
                Number(catGroupA.is_income) - Number(catGroupB.is_income) ||
                    //Next, sorting by group sort_order
                    ((_a = catGroupA.sort_order) !== null && _a !== void 0 ? _a : 0) - ((_b = catGroupB.sort_order) !== null && _b !== void 0 ? _b : 0) ||
                    //Finally, sorting by category within each group
                    a.sort_order - b.sort_order
            : 0;
    }), true), [
        uncategorizedCategory,
        offBudgetCategory,
        transferCategory,
    ], false);
    var categoryGroup = __spreadArray(__spreadArray([], categories.grouped, true), [
        uncategorizedGroup,
    ], false);
    return [categoryList, categoryGroup.filter(function (group) { return group !== null; })];
};
exports.categoryLists = categoryLists;
var groupBySelections = function (groupBy, categoryList, categoryGroup, payees, accounts) {
    var groupByList;
    var groupByLabel;
    switch (groupBy) {
        case 'Category':
            groupByList = categoryList;
            groupByLabel = 'category';
            break;
        case 'Group':
            groupByList = categoryGroup.map(function (group) {
                return __assign(__assign({}, group), { id: group.id, name: group.name, hidden: group.hidden });
            });
            groupByLabel = 'categoryGroup';
            break;
        case 'Payee':
            groupByList = payees.map(function (payee) {
                return { id: payee.id, name: payee.name, hidden: false };
            });
            groupByLabel = 'payee';
            break;
        case 'Account':
            groupByList = accounts.map(function (account) {
                return { id: account.id, name: account.name, hidden: false };
            });
            groupByLabel = 'account';
            break;
        case 'Interval':
            groupByList = categoryList;
            groupByLabel = 'category';
            break;
        default:
            throw new Error('Error loading data into the spreadsheet.');
    }
    return [groupByList, groupByLabel];
};
exports.groupBySelections = groupBySelections;
