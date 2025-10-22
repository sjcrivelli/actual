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
exports.ReportSummary = ReportSummary;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var ReportOptions_1 = require("./ReportOptions");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
function ReportSummary(_a) {
    var startDate = _a.startDate, endDate = _a.endDate, data = _a.data, balanceTypeOp = _a.balanceTypeOp, interval = _a.interval, intervalsCount = _a.intervalsCount;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var net = balanceTypeOp === 'netAssets'
        ? t('DEPOSIT')
        : balanceTypeOp === 'netDebts'
            ? t('PAYMENT')
            : Math.abs(data.totalDebts) > Math.abs(data.totalAssets)
                ? t('PAYMENT')
                : t('DEPOSIT');
    var average = Math.round(data[balanceTypeOp] / intervalsCount);
    return (<view_1.View style={{
            flexDirection: 'column',
            marginBottom: 10,
        }}>
      <view_1.View style={{
            backgroundColor: theme_1.theme.pageBackground,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.largeText), { alignItems: 'center', marginBottom: 2, fontWeight: 600 })}>
          {monthUtils.format(startDate, ReportOptions_1.ReportOptions.intervalFormat.get(interval) || '', locale)}
          {monthUtils.format(startDate, ReportOptions_1.ReportOptions.intervalFormat.get(interval) || '', locale) !==
            monthUtils.format(endDate, ReportOptions_1.ReportOptions.intervalFormat.get(interval) || '', locale) &&
            " ".concat(t('to'), " ") +
                monthUtils.format(endDate, ReportOptions_1.ReportOptions.intervalFormat.get(interval) || '', locale)}
        </text_1.Text>
      </view_1.View>
      <view_1.View style={{
            backgroundColor: theme_1.theme.pageBackground,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        }}>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.mediumText), { alignItems: 'center', marginBottom: 2, fontWeight: 400 })}>
          {balanceTypeOp === 'totalDebts'
            ? t('TOTAL SPENDING')
            : balanceTypeOp === 'totalAssets'
                ? t('TOTAL DEPOSITS')
                : t('NET {{net}}', { net: net })}
        </text_1.Text>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.veryLargeText), { alignItems: 'center', marginBottom: 2, fontWeight: 800 })}>
          <PrivacyFilter_1.PrivacyFilter>
            {format(data[balanceTypeOp], 'financial')}
          </PrivacyFilter_1.PrivacyFilter>
        </text_1.Text>
        <text_1.Text style={{ fontWeight: 600 }}>
          <react_i18next_1.Trans>For this time period</react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>
      <view_1.View style={{
            backgroundColor: theme_1.theme.pageBackground,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        }}>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.mediumText), { alignItems: 'center', marginBottom: 2, fontWeight: 400 })}>
          {balanceTypeOp === 'totalDebts'
            ? t('AVERAGE SPENDING')
            : balanceTypeOp === 'totalAssets'
                ? t('AVERAGE DEPOSIT')
                : t('AVERAGE NET')}
        </text_1.Text>
        <text_1.Text style={__assign(__assign({}, styles_1.styles.veryLargeText), { alignItems: 'center', marginBottom: 2, fontWeight: 800 })}>
          <PrivacyFilter_1.PrivacyFilter>
            {!isNaN(average) && format(average, 'financial')}
          </PrivacyFilter_1.PrivacyFilter>
        </text_1.Text>
        <text_1.Text style={{ fontWeight: 600 }}>
          <react_i18next_1.Trans>
            Per{' '}
            {{
            interval: (ReportOptions_1.ReportOptions.intervalMap.get(interval) || '').toLowerCase(),
        }}
          </react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>
    </view_1.View>);
}
