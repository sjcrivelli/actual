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
exports.useReports = useReports;
var react_1 = require("react");
var query_1 = require("loot-core/shared/query");
var useQuery_1 = require("./useQuery");
function toJS(rows) {
    var reports = rows.map(function (row) {
        var _a;
        var report = __assign(__assign(__assign({ id: row.id, name: row.name, startDate: row.start_date, endDate: row.end_date, isDateStatic: row.date_static === 1, dateRange: row.date_range, mode: row.mode, groupBy: row.group_by, sortBy: row.sort_by, interval: row.interval, balanceType: row.balance_type, showEmpty: row.show_empty === 1, showOffBudget: row.show_offbudget === 1, showHiddenCategories: row.show_hidden === 1, includeCurrentInterval: row.include_current === 1, showUncategorized: row.show_uncategorized === 1, trimIntervals: row.trim_intervals === 1, graphType: row.graph_type }, (row.conditions && { conditions: row.conditions })), { conditionsOp: (_a = row.conditions_op) !== null && _a !== void 0 ? _a : 'and' }), (row.metadata && { metadata: row.metadata }));
        return report;
    });
    return reports;
}
function useReports() {
    var _a = (0, useQuery_1.useQuery)(function () { return (0, query_1.q)('custom_reports').select('*'); }, []), queryData = _a.data, isLoading = _a.isLoading;
    // Sort reports by alphabetical order
    function sort(reports) {
        return reports.sort(function (a, b) {
            return a.name && b.name
                ? a.name.trim().localeCompare(b.name.trim(), undefined, {
                    ignorePunctuation: true,
                })
                : 0;
        });
    }
    return (0, react_1.useMemo)(function () { return ({
        isLoading: isLoading,
        data: sort(toJS(queryData ? __spreadArray([], queryData, true) : [])),
    }); }, [isLoading, queryData]);
}
