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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCardData = GetCardData;
var react_1 = require("react");
var react_error_boundary_1 = require("react-error-boundary");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var monthUtils = require("loot-core/shared/months");
var ChooseGraph_1 = require("@desktop-client/components/reports/ChooseGraph");
var getLiveRange_1 = require("@desktop-client/components/reports/getLiveRange");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
var custom_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/custom-spreadsheet");
var grouped_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/grouped-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
function ErrorFallback() {
    return (<>
      <div>
        <br />
      </div>
      <text_1.Text style={__assign(__assign({}, styles_1.styles.mediumText), { color: theme_1.theme.errorText })}>
        <react_i18next_1.Trans>There was a problem loading your report</react_i18next_1.Trans>
      </text_1.Text>
    </>);
}
function convertFromDate(interval) {
    switch (interval) {
        case 'Monthly':
            return 'monthFromDate';
        case 'Yearly':
            return 'yearFromDate';
        default:
            return 'dayFromDate';
    }
}
function convertRangeInclusive(interval) {
    switch (interval) {
        case 'Monthly':
            return 'rangeInclusive';
        case 'Yearly':
            return 'yearRangeInclusive';
        default:
            return 'dayRangeInclusive';
    }
}
function GetCardData(_a) {
    var report = _a.report, payees = _a.payees, accounts = _a.accounts, categories = _a.categories, earliestTransaction = _a.earliestTransaction, latestTransaction = _a.latestTransaction, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, showTooltip = _a.showTooltip;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var startDate = report.startDate;
    var endDate = report.endDate;
    if (!report.isDateStatic) {
        var _b = (0, getLiveRange_1.getLiveRange)(report.dateRange, earliestTransaction, latestTransaction, report.includeCurrentInterval, firstDayOfWeekIdx), dateStart = _b[0], dateEnd = _b[1];
        startDate = dateStart || report.startDate;
        endDate = dateEnd || report.startDate;
    }
    var fromDate = convertFromDate(report.interval);
    var rangeInclusive = convertRangeInclusive(report.interval);
    var intervalDateStart;
    var intervalDateEnd;
    var intervals;
    if (report.interval === 'Weekly') {
        intervalDateStart = monthUtils.weekFromDate(startDate, firstDayOfWeekIdx);
        intervalDateEnd = monthUtils.weekFromDate(endDate, firstDayOfWeekIdx);
        intervals = monthUtils.weekRangeInclusive(intervalDateStart, intervalDateEnd, firstDayOfWeekIdx);
    }
    else {
        intervalDateStart = monthUtils[fromDate](startDate);
        intervalDateEnd = monthUtils[fromDate](endDate);
        intervals = monthUtils[rangeInclusive](intervalDateStart, intervalDateEnd);
    }
    var getGroupData = (0, react_1.useMemo)(function () {
        var _a;
        return (0, grouped_spreadsheet_1.createGroupedSpreadsheet)({
            startDate: startDate,
            endDate: endDate,
            interval: report.interval,
            categories: categories,
            conditions: (_a = report.conditions) !== null && _a !== void 0 ? _a : [],
            conditionsOp: report.conditionsOp,
            showEmpty: report.showEmpty,
            showOffBudget: report.showOffBudget,
            showHiddenCategories: report.showHiddenCategories,
            showUncategorized: report.showUncategorized,
            trimIntervals: report.trimIntervals,
            balanceTypeOp: ReportOptions_1.ReportOptions.balanceTypeMap.get(report.balanceType),
            firstDayOfWeekIdx: firstDayOfWeekIdx,
            sortByOp: report.sortBy,
        });
    }, [report, categories, startDate, endDate, firstDayOfWeekIdx]);
    var getGraphData = (0, react_1.useMemo)(function () {
        var _a;
        return (0, custom_spreadsheet_1.createCustomSpreadsheet)({
            startDate: startDate,
            endDate: endDate,
            interval: report.interval,
            categories: categories,
            conditions: (_a = report.conditions) !== null && _a !== void 0 ? _a : [],
            conditionsOp: report.conditionsOp,
            showEmpty: report.showEmpty,
            showOffBudget: report.showOffBudget,
            showHiddenCategories: report.showHiddenCategories,
            showUncategorized: report.showUncategorized,
            trimIntervals: report.trimIntervals,
            groupBy: report.groupBy,
            balanceTypeOp: ReportOptions_1.ReportOptions.balanceTypeMap.get(report.balanceType),
            payees: payees,
            accounts: accounts,
            graphType: report.graphType,
            firstDayOfWeekIdx: firstDayOfWeekIdx,
            sortByOp: report.sortBy,
        });
    }, [
        report,
        categories,
        payees,
        accounts,
        startDate,
        endDate,
        firstDayOfWeekIdx,
    ]);
    var graphData = (0, useReport_1.useReport)('default' + report.name, getGraphData);
    var groupedData = (0, useReport_1.useReport)('grouped' + report.name, getGroupData);
    var data = graphData && groupedData ? __assign(__assign({}, graphData), { groupedData: groupedData }) : graphData;
    return (data === null || data === void 0 ? void 0 : data.data) ? (<react_error_boundary_1.ErrorBoundary FallbackComponent={ErrorFallback}>
      <ChooseGraph_1.ChooseGraph data={data} mode={report.mode} graphType={report.graphType} balanceType={report.balanceType} groupBy={report.groupBy} interval={report.interval} compact={true} style={{ height: 'auto', flex: 1 }} intervalsCount={intervals.length} showTooltip={!isNarrowWidth && showTooltip}/>
    </react_error_boundary_1.ErrorBoundary>) : (<LoadingIndicator_1.LoadingIndicator />);
}
