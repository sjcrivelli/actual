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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarryoverIndicator = CarryoverIndicator;
exports.BalanceWithCarryover = BalanceWithCarryover;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var util_1 = require("./util");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
function CarryoverIndicator(_a) {
    var style = _a.style;
    return (<view_1.View style={__assign({ marginLeft: 2, position: 'absolute', right: '-4px', alignSelf: 'center', justifyContent: 'center', top: 0, bottom: 0 }, style)}>
      <v1_1.SvgArrowThinRight width={(style === null || style === void 0 ? void 0 : style.width) || 7} height={(style === null || style === void 0 ? void 0 : style.height) || 7} style={style}/>
    </view_1.View>);
}
function GoalTooltipRow(_a) {
    var children = _a.children;
    return (<div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
        }}>
      {children}
    </div>);
}
function BalanceWithCarryover(_a) {
    var carryover = _a.carryover, balance = _a.balance, goal = _a.goal, budgeted = _a.budgeted, longGoal = _a.longGoal, isDisabled = _a.isDisabled, shouldInlineGoalStatus = _a.shouldInlineGoalStatus, _b = _a.CarryoverIndicator, CarryoverIndicatorComponent = _b === void 0 ? CarryoverIndicator : _b, tooltipDisabled = _a.tooltipDisabled, children = _a.children, props = __rest(_a, ["carryover", "balance", "goal", "budgeted", "longGoal", "isDisabled", "shouldInlineGoalStatus", "CarryoverIndicator", "tooltipDisabled", "children"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var carryoverValue = (0, useSheetValue_1.useSheetValue)(carryover);
    var goalValue = (0, useSheetValue_1.useSheetValue)(goal);
    var budgetedValue = (0, useSheetValue_1.useSheetValue)(budgeted);
    var longGoalValue = (0, useSheetValue_1.useSheetValue)(longGoal);
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var getBalanceAmountStyle = (0, react_1.useCallback)(function (balanceValue) {
        return (0, util_1.makeBalanceAmountStyle)(balanceValue, isGoalTemplatesEnabled ? goalValue : null, longGoalValue === 1 ? balanceValue : budgetedValue);
    }, [budgetedValue, goalValue, isGoalTemplatesEnabled, longGoalValue]);
    var format = (0, useFormat_1.useFormat)();
    var getDifferenceToGoal = (0, react_1.useCallback)(function (balanceValue) {
        return longGoalValue === 1
            ? balanceValue - goalValue
            : budgetedValue - goalValue;
    }, [budgetedValue, goalValue, longGoalValue]);
    var getDefaultClassName = (0, react_1.useCallback)(function (balanceValue) {
        return (0, css_1.css)(__assign(__assign(__assign(__assign({}, getBalanceAmountStyle(balanceValue)), { overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right' }), (!isDisabled && {
            cursor: 'pointer',
        })), { ':hover': { textDecoration: 'underline' } }));
    }, [getBalanceAmountStyle, isDisabled]);
    var GoalStatusDisplay = (0, react_1.useCallback)(function (balanceValue, type) {
        return (<>
          <span style={{ fontWeight: 'bold' }}>
            {getDifferenceToGoal(balanceValue) === 0 ? (<span style={{ color: theme_1.theme.noticeText }}>
                <react_i18next_1.Trans>Fully funded</react_i18next_1.Trans>
              </span>) : getDifferenceToGoal(balanceValue) > 0 ? (<span style={{ color: theme_1.theme.noticeText }}>
                <react_i18next_1.Trans>
                  Overfunded (
                  {{
                    amount: format(getDifferenceToGoal(balanceValue), 'financial'),
                }}
                  )
                </react_i18next_1.Trans>
              </span>) : (<span style={{ color: theme_1.theme.errorText }}>
                <react_i18next_1.Trans>
                  Underfunded (
                  {{
                    amount: format(getDifferenceToGoal(balanceValue), 'financial'),
                }}
                  )
                </react_i18next_1.Trans>
              </span>)}
          </span>
          <GoalTooltipRow>
            <react_i18next_1.Trans>
              <div>Goal Type:</div>
              <div>
                {{
                type: longGoalValue === 1 ? t('Long') : t('Template'),
            }}
              </div>
            </react_i18next_1.Trans>
          </GoalTooltipRow>
          <GoalTooltipRow>
            <react_i18next_1.Trans>
              <div>Goal:</div>
              <div>
                {{
                amount: format(goalValue, 'financial'),
            }}
              </div>
            </react_i18next_1.Trans>
          </GoalTooltipRow>
          <GoalTooltipRow>
            {longGoalValue !== 1 ? (<react_i18next_1.Trans>
                <div>Budgeted:</div>
                <div>
                  {{
                    amount: format(budgetedValue, 'financial'),
                }}
                </div>
              </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
                <div>Balance:</div>
                <div>
                  {{
                    amount: format(balanceValue, type),
                }}
                </div>
              </react_i18next_1.Trans>)}
          </GoalTooltipRow>
        </>);
    }, [budgetedValue, format, getDifferenceToGoal, goalValue, longGoalValue, t]);
    return (<CellValue_1.CellValue binding={balance} type="financial" {...props}>
      {function (_a) {
            var type = _a.type, name = _a.name, balanceValue = _a.value;
            return (<>
          <tooltip_1.Tooltip content={<view_1.View style={{ padding: 10 }}>
                {GoalStatusDisplay(balanceValue, type)}
              </view_1.View>} style={__assign(__assign({}, styles_1.styles.tooltip), { borderRadius: '0px 5px 5px 0px' })} placement="bottom" triggerProps={{
                    delay: 750,
                    isDisabled: !isGoalTemplatesEnabled ||
                        goalValue == null ||
                        isNarrowWidth ||
                        tooltipDisabled,
                }}>
            {children ? (children({
                    type: type,
                    name: name,
                    value: balanceValue,
                    className: getDefaultClassName(balanceValue),
                })) : (<CellValue_1.CellValueText type={type} name={name} value={balanceValue} className={getDefaultClassName(balanceValue)}/>)}
          </tooltip_1.Tooltip>

          {carryoverValue && (<CarryoverIndicatorComponent style={getBalanceAmountStyle(balanceValue)}/>)}
          {shouldInlineGoalStatus &&
                    isGoalTemplatesEnabled &&
                    goalValue !== null && (<>
                <view_1.View style={{
                        borderTop: '1px solid ' + theme_1.theme.tableBorderSeparator,
                        width: '160px',
                        margin: '3px 0px',
                    }}/>
                <view_1.View>{GoalStatusDisplay(balanceValue, type)}</view_1.View>
              </>)}
        </>);
        }}
    </CellValue_1.CellValue>);
}
