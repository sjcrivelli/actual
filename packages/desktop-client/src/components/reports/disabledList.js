"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultsList = exports.disabledList = void 0;
exports.disabledGraphList = disabledGraphList;
exports.disabledLegendLabel = disabledLegendLabel;
exports.defaultsGraphList = defaultsGraphList;
var i18next_1 = require("i18next");
var intervalOptions = [
    {
        description: (0, i18next_1.t)('Daily'),
        key: 'Daily',
        defaultRange: 'This month',
    },
    {
        description: (0, i18next_1.t)('Weekly'),
        key: 'Weekly',
        defaultRange: 'Last 3 months',
    },
    {
        description: (0, i18next_1.t)('Monthly'),
        key: 'Monthly',
        defaultRange: 'Last 6 months',
    },
    {
        description: (0, i18next_1.t)('Yearly'),
        key: 'Yearly',
        defaultRange: 'Year to date',
    },
];
var currentIntervalOptions = [
    {
        description: (0, i18next_1.t)('This week'),
        disableInclude: true,
    },
    {
        description: (0, i18next_1.t)('This month'),
        disableInclude: true,
    },
    {
        description: (0, i18next_1.t)('Year to date'),
        disableInclude: true,
    },
    {
        description: (0, i18next_1.t)('Last year'),
        disableInclude: true,
    },
    {
        description: (0, i18next_1.t)('Prior year to date'),
        disableInclude: true,
    },
    {
        description: (0, i18next_1.t)('All time'),
        disableInclude: true,
    },
];
var totalGraphOptions = [
    {
        description: 'TableGraph',
        disabledSplit: [],
        defaultSplit: 'Category',
        disabledType: [],
        defaultType: 'Payment',
        disableLegend: true,
        disableLabel: true,
        defaultSort: 'budget',
    },
    {
        description: 'BarGraph',
        disabledSplit: [],
        defaultSplit: 'Category',
        disabledType: [],
        defaultType: 'Payment',
        defaultSort: 'desc',
    },
    {
        description: 'AreaGraph',
        disabledSplit: ['Category', 'Group', 'Payee', 'Account'],
        defaultSplit: 'Interval',
        disabledType: [],
        defaultType: 'Payment',
        disableLegend: true,
        disableSort: true,
        defaultSort: 'desc',
    },
    {
        description: 'DonutGraph',
        disabledSplit: [],
        defaultSplit: 'Category',
        disabledType: ['Net'],
        defaultType: 'Payment',
        defaultSort: 'desc',
    },
];
var timeGraphOptions = [
    {
        description: 'TableGraph',
        disabledSplit: ['Interval'],
        defaultSplit: 'Category',
        disabledType: ['Net Payment', 'Net Deposit'],
        defaultType: 'Payment',
        disableLegend: true,
        disableLabel: true,
        disableSort: true,
        defaultSort: 'desc',
    },
    {
        description: 'StackedBarGraph',
        disabledSplit: ['Interval'],
        defaultSplit: 'Category',
        disabledType: [],
        defaultType: 'Payment',
        disableSort: true,
        defaultSort: 'desc',
    },
    {
        description: 'LineGraph',
        disabledSplit: ['Interval'],
        defaultSplit: 'Category',
        disabledType: [],
        defaultType: 'Payment',
        disableLegend: false,
        disableLabel: true,
        disableSort: true,
        defaultSort: 'desc',
    },
];
var modeOptions = [
    {
        description: 'total',
        graphs: totalGraphOptions,
        disabledGraph: ['LineGraph'],
        defaultGraph: 'TableGraph',
    },
    {
        description: 'time',
        graphs: timeGraphOptions,
        disabledGraph: ['AreaGraph', 'DonutGraph'],
        defaultGraph: 'TableGraph',
    },
];
function disabledGraphList(item, newGraph, type) {
    var graphList = modeOptions.find(function (d) { return d.description === item; });
    if (!graphList) {
        return [];
    }
    var disabledList = graphList.graphs.find(function (e) { return e.description === newGraph; });
    if (!disabledList) {
        return [];
    }
    return disabledList[type];
}
function disabledLegendLabel(item, newGraph, type) {
    var graphList = modeOptions.find(function (d) { return d.description === item; });
    if (!graphList) {
        return false;
    }
    var disableLegendLabel = graphList.graphs.find(function (e) { return e.description === newGraph; });
    if (!disableLegendLabel) {
        return false;
    }
    return disableLegendLabel[type];
}
function defaultsGraphList(item, newGraph, type) {
    var graphList = modeOptions.find(function (d) { return d.description === item; });
    if (!graphList) {
        return '';
    }
    var defaultItem = graphList.graphs.find(function (e) { return e.description === newGraph; });
    if (!defaultItem) {
        return '';
    }
    return defaultItem[type];
}
exports.disabledList = {
    mode: modeOptions,
    modeGraphsMap: new Map(modeOptions.map(function (item) { return [item.description, item.disabledGraph]; })),
    currentInterval: new Map(currentIntervalOptions.map(function (item) { return [item.description, item.disableInclude]; })),
};
exports.defaultsList = {
    mode: modeOptions,
    modeGraphsMap: new Map(modeOptions.map(function (item) { return [item.description, item.defaultGraph]; })),
    intervalRange: new Map(intervalOptions.map(function (item) { return [item.key, item.defaultRange]; })),
};
