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
exports.ToBudgetAmount = ToBudgetAmount;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var TotalsList_1 = require("./TotalsList");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function ToBudgetAmount(_a) {
    var prevMonthName = _a.prevMonthName, style = _a.style, amountStyle = _a.amountStyle, onClick = _a.onClick, _b = _a.isTotalsListTooltipDisabled, isTotalsListTooltipDisabled = _b === void 0 ? false : _b, onContextMenu = _a.onContextMenu;
    var t = (0, react_i18next_1.useTranslation)().t;
    var sheetName = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetName)(bindings_1.envelopeBudget.toBudget);
    var sheetValue = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)({
        name: bindings_1.envelopeBudget.toBudget,
        value: 0,
    });
    var format = (0, useFormat_1.useFormat)();
    var availableValue = sheetValue;
    if (typeof availableValue !== 'number' && availableValue !== null) {
        throw new Error('Expected availableValue to be a number but got ' + availableValue);
    }
    var num = availableValue !== null && availableValue !== void 0 ? availableValue : 0;
    var isNegative = num < 0;
    return (<view_1.View style={__assign({ alignItems: 'center' }, style)}>
      <block_1.Block>{isNegative ? t('Overbudgeted:') : t('To Budget:')}</block_1.Block>
      <view_1.View>
        <tooltip_1.Tooltip content={<TotalsList_1.TotalsList prevMonthName={prevMonthName} style={{
                padding: 7,
            }}/>} placement="bottom" offset={3} triggerProps={{ isDisabled: isTotalsListTooltipDisabled }}>
          <PrivacyFilter_1.PrivacyFilter style={{
            textAlign: 'center',
        }}>
            <block_1.Block onClick={onClick} onContextMenu={onContextMenu} data-cellname={sheetName} className={(0, css_1.css)([
            styles_1.styles.veryLargeText,
            {
                fontWeight: 400,
                userSelect: 'none',
                cursor: 'pointer',
                color: isNegative ? theme_1.theme.errorText : theme_1.theme.pageTextPositive,
                marginBottom: -1,
                borderBottom: '1px solid transparent',
                ':hover': {
                    borderColor: isNegative
                        ? theme_1.theme.errorBorder
                        : theme_1.theme.pageTextPositive,
                },
            },
            amountStyle,
        ])}>
              {format(num, 'financial')}
            </block_1.Block>
          </PrivacyFilter_1.PrivacyFilter>
        </tooltip_1.Tooltip>
      </view_1.View>
    </view_1.View>);
}
