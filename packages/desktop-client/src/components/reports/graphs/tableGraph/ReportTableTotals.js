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
exports.ReportTableTotals = ReportTableTotals;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
function RenderTotalsRow(_a) {
    var metadata = _a.metadata, mode = _a.mode, totalsStyle = _a.totalsStyle, testStyle = _a.testStyle, scrollWidthTotals = _a.scrollWidthTotals, renderTotals = _a.renderTotals;
    return (<view_1.View>
      {renderTotals({
            metadata: metadata,
            mode: mode,
            totalsStyle: totalsStyle,
            testStyle: testStyle,
            scrollWidthTotals: scrollWidthTotals,
        })}
    </view_1.View>);
}
function ReportTableTotals(_a) {
    var data = _a.data, mode = _a.mode, totalScrollRef = _a.totalScrollRef, compact = _a.compact, style = _a.style, renderTotals = _a.renderTotals;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(0), scrollWidthTotals = _b[0], setScrollWidthTotals = _b[1];
    (0, react_1.useLayoutEffect)(function () {
        if (totalScrollRef.current) {
            var _a = [
                totalScrollRef.current.offsetParent
                    ? (totalScrollRef.current.parentElement
                        ? totalScrollRef.current.parentElement.scrollHeight
                        : 0) || 0
                    : 0,
                totalScrollRef.current ? totalScrollRef.current.scrollHeight : 0,
            ], parent_1 = _a[0], child = _a[1];
            setScrollWidthTotals(parent_1 > 0 && child > 0 ? parent_1 - child : 0);
        }
    });
    var metadata = {
        id: '',
        name: t('Totals'),
        intervalData: data.intervalData,
        totalAssets: data.totalAssets,
        totalDebts: data.totalDebts,
        netAssets: data.netAssets,
        netDebts: data.netDebts,
        totalTotals: data.totalTotals,
    };
    var totalsStyle = __assign({ borderTopWidth: 1, borderColor: theme_1.theme.tableBorder, justifyContent: 'center', color: theme_1.theme.tableRowHeaderText, backgroundColor: theme_1.theme.tableRowHeaderBackground, fontWeight: 600 }, style);
    var testStyle = __assign(__assign({ overflowX: 'auto', scrollbarWidth: compact ? 'none' : 'inherit' }, styles_1.styles.horizontalScrollbar), { '::-webkit-scrollbar': {
            backgroundColor: theme_1.theme.tableBackground,
            height: 12,
            dispaly: compact && 'none',
        }, flexDirection: 'row', flex: 1 });
    return (<RenderTotalsRow metadata={metadata} mode={mode} totalsStyle={totalsStyle} testStyle={testStyle} scrollWidthTotals={scrollWidthTotals} renderTotals={renderTotals}/>);
}
