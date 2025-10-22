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
exports.ReportTableHeader = ReportTableHeader;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
var table_1 = require("@desktop-client/components/table");
function ReportTableHeader(_a) {
    var groupBy = _a.groupBy, interval = _a.interval, data = _a.data, balanceTypeOp = _a.balanceTypeOp, headerScrollRef = _a.headerScrollRef, handleScroll = _a.handleScroll, compact = _a.compact, style = _a.style, compactStyle = _a.compactStyle, mode = _a.mode;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<table_1.Row collapsed={true} style={__assign({ justifyContent: 'center', borderBottomWidth: 1, borderColor: theme_1.theme.tableBorder, color: theme_1.theme.tableHeaderText, backgroundColor: theme_1.theme.tableHeaderBackground, fontWeight: 600 }, style)}>
      <view_1.View innerRef={headerScrollRef} onScroll={handleScroll} id="header" style={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            flexDirection: 'row',
            flex: 1,
        }}>
        <table_1.Cell style={{
            width: compact ? 80 : 125,
            flexShrink: 0,
            flexGrow: 1,
        }} valueStyle={compactStyle} value={groupBy === 'Interval'
            ? ReportOptions_1.ReportOptions.intervalMap.get(interval)
            : groupBy}/>
        {mode === 'time'
            ? data.map(function (header, index) {
                return (<table_1.Cell style={{
                        minWidth: compact ? 50 : 85,
                    }} valueStyle={compactStyle} key={index} value={header.date} width="flex"/>);
            })
            : balanceTypeOp === 'totalTotals' && (<>
                <table_1.Cell style={{
                    minWidth: compact ? 50 : 85,
                }} valueStyle={compactStyle} value={t('Deposits')} width="flex"/>
                <table_1.Cell style={{
                    minWidth: compact ? 50 : 85,
                }} valueStyle={compactStyle} value={t('Payments')} width="flex"/>
              </>)}
        <table_1.Cell style={{
            minWidth: compact ? 50 : 85,
        }} valueStyle={compactStyle} value={t('Totals')} width="flex"/>
        <table_1.Cell style={{
            minWidth: compact ? 50 : 85,
        }} valueStyle={compactStyle} value={t('Average')} width="flex"/>
      </view_1.View>
    </table_1.Row>);
}
