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
exports.BalanceCell = BalanceCell;
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var auto_text_size_1 = require("auto-text-size");
var BudgetTable_1 = require("./BudgetTable");
var BalanceWithCarryover_1 = require("@desktop-client/components/budget/BalanceWithCarryover");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function BalanceCell(_a) {
    var binding = _a.binding, category = _a.category, show3Columns = _a.show3Columns, onPress = _a.onPress, ariaLabel = _a["aria-label"];
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var columnWidth = (0, BudgetTable_1.getColumnWidth)({
        show3Columns: show3Columns,
    });
    var goal = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catGoal(category.id)
        : bindings_1.envelopeBudget.catGoal(category.id);
    var longGoal = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catLongGoal(category.id)
        : bindings_1.envelopeBudget.catLongGoal(category.id);
    var budgeted = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catBudgeted(category.id)
        : bindings_1.envelopeBudget.catBudgeted(category.id);
    var carryover = budgetType === 'tracking'
        ? bindings_1.trackingBudget.catCarryover(category.id)
        : bindings_1.envelopeBudget.catCarryover(category.id);
    var format = (0, useFormat_1.useFormat)();
    return (<BalanceWithCarryover_1.BalanceWithCarryover aria-label={t('Balance for {{categoryName}} category', {
            categoryName: category.name,
        })} // Translated aria-label
     type="financial" carryover={carryover} balance={binding} goal={goal} budgeted={budgeted} longGoal={longGoal} CarryoverIndicator={MobileCarryoverIndicator}>
      {function (_a) {
            var type = _a.type, value = _a.value, defaultClassName = _a.className;
            return (<button_1.Button variant="bare" style={__assign(__assign({}, BudgetTable_1.PILL_STYLE), { maxWidth: columnWidth })} onPress={onPress} aria-label={ariaLabel}>
          <PrivacyFilter_1.PrivacyFilter>
            <auto_text_size_1.AutoTextSize key={value} as={text_1.Text} minFontSizePx={6} maxFontSizePx={12} mode="oneline" className={(0, css_1.cx)(defaultClassName, (0, css_1.css)({
                    maxWidth: columnWidth,
                    textAlign: 'right',
                    fontSize: 12,
                }))}>
              {format(value, type)}
            </auto_text_size_1.AutoTextSize>
          </PrivacyFilter_1.PrivacyFilter>
        </button_1.Button>);
        }}
    </BalanceWithCarryover_1.BalanceWithCarryover>);
}
function MobileCarryoverIndicator(_a) {
    var _b;
    var style = _a.style;
    return (<view_1.View style={{
            position: 'absolute',
            right: '-3px',
            top: '-5px',
            borderRadius: '50%',
            backgroundColor: (_b = style === null || style === void 0 ? void 0 : style.color) !== null && _b !== void 0 ? _b : theme_1.theme.pillText,
        }}>
      <v1_1.SvgArrowThickRight width={11} height={11} style={{ color: theme_1.theme.pillBackgroundLight }}/>
    </view_1.View>);
}
