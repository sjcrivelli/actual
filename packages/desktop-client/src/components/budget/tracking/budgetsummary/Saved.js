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
exports.Saved = Saved;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var TrackingBudgetComponents_1 = require("@desktop-client/components/budget/tracking/TrackingBudgetComponents");
var util_1 = require("@desktop-client/components/budget/util");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function Saved(_a) {
    var projected = _a.projected, style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var budgetedSaved = (0, TrackingBudgetComponents_1.useTrackingSheetValue)(bindings_1.trackingBudget.totalBudgetedSaved) || 0;
    var totalSaved = (0, TrackingBudgetComponents_1.useTrackingSheetValue)(bindings_1.trackingBudget.totalSaved) || 0;
    var format = (0, useFormat_1.useFormat)();
    var saved = projected ? budgetedSaved : totalSaved;
    var isNegative = saved < 0;
    var diff = totalSaved - budgetedSaved;
    return (<view_1.View style={__assign({ alignItems: 'center', fontSize: 14 }, style)}>
      {projected ? (<text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>Projected savings:</react_i18next_1.Trans>
        </text_1.Text>) : (<view_1.View style={{ color: theme_1.theme.pageTextLight }}>
          {isNegative ? t('Overspent:') : t('Saved:')}
        </view_1.View>)}

      <tooltip_1.Tooltip style={__assign(__assign({}, styles_1.styles.tooltip), { fontSize: 14, padding: 10 })} content={<>
            <aligned_text_1.AlignedText left={t('Projected savings:')} right={<text_1.Text style={__assign(__assign({}, (0, util_1.makeAmountFullStyle)(budgetedSaved)), styles_1.styles.tnum)}>
                  {format(budgetedSaved, 'financial-with-sign')}
                </text_1.Text>}/>
            <aligned_text_1.AlignedText left={t('Difference:')} right={<text_1.Text style={__assign(__assign({}, (0, util_1.makeAmountFullStyle)(diff)), styles_1.styles.tnum)}>
                  {format(diff, 'financial-with-sign')}
                </text_1.Text>}/>
          </>} placement="bottom" triggerProps={{
            isDisabled: Boolean(projected),
        }}>
        <view_1.View className={(0, css_1.css)({
            fontSize: 25,
            color: projected
                ? theme_1.theme.warningText
                : isNegative
                    ? theme_1.theme.errorTextDark
                    : theme_1.theme.upcomingText,
        })}>
          <PrivacyFilter_1.PrivacyFilter>{format(saved, 'financial')}</PrivacyFilter_1.PrivacyFilter>
        </view_1.View>
      </tooltip_1.Tooltip>
    </view_1.View>);
}
