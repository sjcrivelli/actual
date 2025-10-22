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
exports.SpendingCard = SpendingCard;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var DateRange_1 = require("@desktop-client/components/reports/DateRange");
var SpendingGraph_1 = require("@desktop-client/components/reports/graphs/SpendingGraph");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ReportCard_1 = require("@desktop-client/components/reports/ReportCard");
var ReportCardName_1 = require("@desktop-client/components/reports/ReportCardName");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var spending_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/spending-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
function SpendingCard(_a) {
    var _b;
    var widgetId = _a.widgetId, isEditing = _a.isEditing, _c = _a.meta, meta = _c === void 0 ? {} : _c, onMetaChange = _a.onMetaChange, onRemove = _a.onRemove;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _d = (0, react_1.useState)(false), isCardHovered = _d[0], setIsCardHovered = _d[1];
    var _e = (0, react_1.useState)(false), nameMenuOpen = _e[0], setNameMenuOpen = _e[1];
    var spendingReportMode = (_b = meta === null || meta === void 0 ? void 0 : meta.mode) !== null && _b !== void 0 ? _b : 'single-month';
    var _f = (0, reportRanges_1.calculateSpendingReportTimeRange)(meta !== null && meta !== void 0 ? meta : {}), compare = _f[0], compareTo = _f[1];
    var selection = spendingReportMode === 'single-month' ? 'compareTo' : spendingReportMode;
    var getGraphData = (0, react_1.useMemo)(function () {
        return (0, spending_spreadsheet_1.createSpendingSpreadsheet)({
            conditions: meta === null || meta === void 0 ? void 0 : meta.conditions,
            conditionsOp: meta === null || meta === void 0 ? void 0 : meta.conditionsOp,
            compare: compare,
            compareTo: compareTo,
        });
    }, [meta === null || meta === void 0 ? void 0 : meta.conditions, meta === null || meta === void 0 ? void 0 : meta.conditionsOp, compare, compareTo]);
    var data = (0, useReport_1.useReport)('default', getGraphData);
    var todayDay = compare !== monthUtils.currentMonth()
        ? 27
        : monthUtils.getDay(monthUtils.currentDay()) - 1 >= 28
            ? 27
            : monthUtils.getDay(monthUtils.currentDay()) - 1;
    var difference = data &&
        Math.round(data.intervalData[todayDay][selection] -
            data.intervalData[todayDay].compare);
    return (<ReportCard_1.ReportCard isEditing={isEditing} disableClick={nameMenuOpen} to={"/reports/spending/".concat(widgetId)} menuItems={[
            {
                name: 'rename',
                text: t('Rename'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ]} onMenuSelect={function (item) {
            switch (item) {
                case 'rename':
                    setNameMenuOpen(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error("Unrecognized selection: ".concat(item));
            }
        }}>
      <view_1.View style={{ flex: 1 }} onPointerEnter={function () { return setIsCardHovered(true); }} onPointerLeave={function () { return setIsCardHovered(false); }}>
        <view_1.View style={{ flexDirection: 'row', padding: 20 }}>
          <view_1.View style={{ flex: 1 }}>
            <ReportCardName_1.ReportCardName name={(meta === null || meta === void 0 ? void 0 : meta.name) || t('Monthly Spending')} isEditing={nameMenuOpen} onChange={function (newName) {
            onMetaChange(__assign(__assign({}, meta), { name: newName }));
            setNameMenuOpen(false);
        }} onClose={function () { return setNameMenuOpen(false); }}/>
            <DateRange_1.DateRange start={compare} end={compareTo} type={spendingReportMode}/>
          </view_1.View>
          {data && (<view_1.View style={{ textAlign: 'right' }}>
              <block_1.Block style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 500, marginBottom: 5, color: !difference
                    ? 'inherit'
                    : difference <= 0
                        ? theme_1.theme.noticeTextLight
                        : theme_1.theme.errorText })}>
                <PrivacyFilter_1.PrivacyFilter activationFilters={[!isCardHovered]}>
                  {data &&
                (difference && difference > 0 ? '+' : '') +
                    format(difference || 0, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </block_1.Block>
            </view_1.View>)}
        </view_1.View>
        {data ? (<SpendingGraph_1.SpendingGraph style={{ flex: 1 }} compact={true} data={data} mode={spendingReportMode} compare={compare} compareTo={compareTo}/>) : (<LoadingIndicator_1.LoadingIndicator />)}
      </view_1.View>
    </ReportCard_1.ReportCard>);
}
