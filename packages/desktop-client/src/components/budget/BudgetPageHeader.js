"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetPageHeader = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var MonthPicker_1 = require("./MonthPicker");
var util_1 = require("./util");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
exports.BudgetPageHeader = (0, react_1.memo)(function (_a) {
    var startMonth = _a.startMonth, onMonthSelect = _a.onMonthSelect, numMonths = _a.numMonths, monthBounds = _a.monthBounds;
    var categoryExpandedStatePref = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState')[0];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    var offsetMultipleMonths = numMonths === 1 ? 4 : 0;
    return (<view_1.View style={{
            marginLeft: 200 + 100 * categoryExpandedState + 5 - offsetMultipleMonths,
            flexShrink: 0,
        }}>
        <view_1.View style={{
            marginRight: 5 + (0, util_1.getScrollbarWidth)() - offsetMultipleMonths,
        }}>
          <MonthPicker_1.MonthPicker startMonth={startMonth} numDisplayed={numMonths} monthBounds={monthBounds} style={{ paddingTop: 5 }} onSelect={function (month) { return onMonthSelect(month); }}/>
        </view_1.View>
      </view_1.View>);
});
exports.BudgetPageHeader.displayName = 'BudgetPageHeader';
