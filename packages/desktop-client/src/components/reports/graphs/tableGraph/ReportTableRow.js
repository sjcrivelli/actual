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
exports.ReportTableRow = void 0;
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var showActivity_1 = require("@desktop-client/components/reports/graphs/showActivity");
var table_1 = require("@desktop-client/components/table");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var getAmountColor = function (amount) {
    if (amount === 0)
        return undefined;
    return amount > 0 ? theme_1.theme.noticeText : theme_1.theme.errorText;
};
exports.ReportTableRow = (0, react_1.memo)(function (_a) {
    var item = _a.item, balanceTypeOp = _a.balanceTypeOp, groupBy = _a.groupBy, mode = _a.mode, _b = _a.filters, filters = _b === void 0 ? [] : _b, _c = _a.startDate, startDate = _c === void 0 ? '' : _c, endDate = _a.endDate, intervalsCount = _a.intervalsCount, compact = _a.compact, style = _a.style, compactStyle = _a.compactStyle, totalStyle = _a.totalStyle, _d = _a.showHiddenCategories, showHiddenCategories = _d === void 0 ? false : _d, _e = _a.showOffBudget, showOffBudget = _e === void 0 ? false : _e, totalScrollRef = _a.totalScrollRef, handleScroll = _a.handleScroll, height = _a.height, interval = _a.interval, colorized = _a.colorized;
    var average = Math.round(item[balanceTypeOp] / intervalsCount);
    var groupByItem = groupBy === 'Interval' ? 'date' : 'name';
    var format = (0, useFormat_1.useFormat)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var categories = (0, useCategories_1.useCategories)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var pointer = !isNarrowWidth &&
        !['Group', 'Interval'].includes(groupBy) &&
        !compact &&
        !categories.grouped.map(function (g) { return g.id; }).includes(item.id)
        ? 'pointer'
        : 'inherit';
    var hoverUnderline = !isNarrowWidth &&
        !['Group', 'Interval'].includes(groupBy) &&
        !compact &&
        !categories.grouped.map(function (g) { return g.id; }).includes(item.id)
        ? {
            cursor: pointer,
            ':hover': { textDecoration: 'underline' },
            flexGrow: 0,
        }
        : {};
    return (<table_1.Row key={item.id} height={height} collapsed={true} style={__assign({ color: theme_1.theme.tableText, backgroundColor: theme_1.theme.tableBackground }, style)}>
        <view_1.View innerRef={totalScrollRef} onScroll={handleScroll} id={totalScrollRef ? 'total' : item.id} style={__assign({ flexDirection: 'row', flex: 1 }, totalStyle)}>
          <table_1.Cell value={item[groupByItem]} title={item[groupByItem]} style={{
            width: compact ? 80 : 125,
            flexShrink: 0,
            flexGrow: 1,
        }} valueStyle={compactStyle}/>
          {item.intervalData && mode === 'time'
            ? item.intervalData.map(function (intervalItem, index) {
                return (<table_1.Cell key={index} style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
                        color: getAmountColor(intervalItem[balanceTypeOp]),
                    }))} unexposedContent={function (_a) {
                        var value = _a.value;
                        return (<text_1.Text style={hoverUnderline}>{value}</text_1.Text>);
                    }} valueStyle={compactStyle} value={format(intervalItem[balanceTypeOp], 'financial')} title={Math.abs(intervalItem[balanceTypeOp]) > 100000
                        ? format(intervalItem[balanceTypeOp], 'financial')
                        : undefined} onClick={function () {
                        return !isNarrowWidth &&
                            !['Group', 'Interval'].includes(groupBy) &&
                            !compact &&
                            !categories.grouped.map(function (g) { return g.id; }).includes(item.id) &&
                            (0, showActivity_1.showActivity)({
                                navigate: navigate,
                                categories: categories,
                                accounts: accounts,
                                balanceTypeOp: balanceTypeOp,
                                filters: filters,
                                showHiddenCategories: showHiddenCategories,
                                showOffBudget: showOffBudget,
                                type: 'time',
                                startDate: intervalItem.intervalStartDate || '',
                                endDate: intervalItem.intervalEndDate || '',
                                field: groupBy.toLowerCase(),
                                id: item.id,
                                interval: interval,
                            });
                    }} width="flex" privacyFilter/>);
            })
            : balanceTypeOp === 'totalTotals' && (<>
                  <table_1.Cell value={format(item.totalAssets, 'financial')} title={Math.abs(item.totalAssets) > 100000
                    ? format(item.totalAssets, 'financial')
                    : undefined} width="flex" privacyFilter style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
                    color: getAmountColor(item.totalAssets),
                }))} unexposedContent={function (_a) {
                    var value = _a.value;
                    return (<text_1.Text style={hoverUnderline}>{value}</text_1.Text>);
                }} valueStyle={compactStyle} onClick={function () {
                    return !isNarrowWidth &&
                        !['Group', 'Interval'].includes(groupBy) &&
                        !compact &&
                        !categories.grouped.map(function (g) { return g.id; }).includes(item.id) &&
                        (0, showActivity_1.showActivity)({
                            navigate: navigate,
                            categories: categories,
                            accounts: accounts,
                            balanceTypeOp: balanceTypeOp,
                            filters: filters,
                            showHiddenCategories: showHiddenCategories,
                            showOffBudget: showOffBudget,
                            type: 'assets',
                            startDate: startDate,
                            endDate: endDate,
                            field: groupBy.toLowerCase(),
                            id: item.id,
                        });
                }}/>
                  <table_1.Cell value={format(item.totalDebts, 'financial')} title={Math.abs(item.totalDebts) > 100000
                    ? format(item.totalDebts, 'financial')
                    : undefined} width="flex" privacyFilter style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
                    color: getAmountColor(item.totalDebts),
                }))} unexposedContent={function (_a) {
                    var value = _a.value;
                    return (<text_1.Text style={hoverUnderline}>{value}</text_1.Text>);
                }} valueStyle={compactStyle} onClick={function () {
                    return !isNarrowWidth &&
                        !['Group', 'Interval'].includes(groupBy) &&
                        !compact &&
                        !categories.grouped.map(function (g) { return g.id; }).includes(item.id) &&
                        (0, showActivity_1.showActivity)({
                            navigate: navigate,
                            categories: categories,
                            accounts: accounts,
                            balanceTypeOp: balanceTypeOp,
                            filters: filters,
                            showHiddenCategories: showHiddenCategories,
                            showOffBudget: showOffBudget,
                            type: 'debts',
                            startDate: startDate,
                            endDate: endDate,
                            field: groupBy.toLowerCase(),
                            id: item.id,
                        });
                }}/>
                </>)}
          <table_1.Cell value={format(item[balanceTypeOp], 'financial')} title={Math.abs(item[balanceTypeOp]) > 100000
            ? format(item[balanceTypeOp], 'financial')
            : undefined} style={__assign({ fontWeight: 600, minWidth: compact ? 50 : 85 }, (colorized && { color: getAmountColor(item[balanceTypeOp]) }))} unexposedContent={function (_a) {
            var value = _a.value;
            return (<text_1.Text style={hoverUnderline}>{value}</text_1.Text>);
        }} valueStyle={compactStyle} onClick={function () {
            return !isNarrowWidth &&
                !['Group', 'Interval'].includes(groupBy) &&
                !compact &&
                !categories.grouped.map(function (g) { return g.id; }).includes(item.id) &&
                (0, showActivity_1.showActivity)({
                    navigate: navigate,
                    categories: categories,
                    accounts: accounts,
                    balanceTypeOp: balanceTypeOp,
                    filters: filters,
                    showHiddenCategories: showHiddenCategories,
                    showOffBudget: showOffBudget,
                    type: 'totals',
                    startDate: startDate,
                    endDate: endDate,
                    field: groupBy.toLowerCase(),
                    id: item.id,
                });
        }} width="flex" privacyFilter/>
          <table_1.Cell value={format(average, 'financial')} title={Math.abs(average / 100) > 100000
            ? format(average, 'financial')
            : undefined} style={__assign({ fontWeight: 600, minWidth: compact ? 50 : 85 }, (colorized && { color: getAmountColor(average) }))} valueStyle={compactStyle} width="flex" privacyFilter/>
        </view_1.View>
      </table_1.Row>);
});
exports.ReportTableRow.displayName = 'ReportTableRow';
