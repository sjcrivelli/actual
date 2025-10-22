"use strict";
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
exports.DynamicBudgetTable = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_virtualized_auto_sizer_1 = require("react-virtualized-auto-sizer");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var BudgetMonthCountContext_1 = require("./BudgetMonthCountContext");
var BudgetPageHeader_1 = require("./BudgetPageHeader");
var BudgetTable_1 = require("./BudgetTable");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
function getNumPossibleMonths(width, categoryWidth) {
    var estimatedTableWidth = width - categoryWidth;
    if (estimatedTableWidth < 500) {
        return 1;
    }
    else if (estimatedTableWidth < 750) {
        return 2;
    }
    else if (estimatedTableWidth < 1000) {
        return 3;
    }
    else if (estimatedTableWidth < 1250) {
        return 4;
    }
    else if (estimatedTableWidth < 1500) {
        return 5;
    }
    return 6;
}
var DynamicBudgetTableInner = function (_a) {
    var type = _a.type, width = _a.width, height = _a.height, prewarmStartMonth = _a.prewarmStartMonth, startMonth = _a.startMonth, _b = _a.maxMonths, maxMonths = _b === void 0 ? 3 : _b, monthBounds = _a.monthBounds, onMonthSelect = _a.onMonthSelect, props = __rest(_a, ["type", "width", "height", "prewarmStartMonth", "startMonth", "maxMonths", "monthBounds", "onMonthSelect"]);
    var setDisplayMax = (0, BudgetMonthCountContext_1.useBudgetMonthCount)().setDisplayMax;
    var categoryExpandedStatePref = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState')[0];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    var numPossible = getNumPossibleMonths(width, 200 + 100 * categoryExpandedState);
    var numMonths = Math.min(numPossible, maxMonths);
    var maxWidth = 200 + 100 * categoryExpandedState + 500 * numMonths;
    (0, react_1.useEffect)(function () {
        setDisplayMax(numPossible);
    }, [numPossible]);
    function getValidMonth(month) {
        var start = monthBounds.start;
        var end = monthUtils.subMonths(monthBounds.end, numMonths - 1);
        if (month < start) {
            return start;
        }
        else if (month > end) {
            return end;
        }
        return month;
    }
    function _onMonthSelect(month) {
        onMonthSelect(getValidMonth(month), numMonths);
    }
    (0, react_hotkeys_hook_1.useHotkeys)('left', function () {
        _onMonthSelect(monthUtils.prevMonth(startMonth));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [_onMonthSelect, startMonth]);
    (0, react_hotkeys_hook_1.useHotkeys)('right', function () {
        _onMonthSelect(monthUtils.nextMonth(startMonth));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [_onMonthSelect, startMonth]);
    (0, react_hotkeys_hook_1.useHotkeys)('0', function () {
        _onMonthSelect(monthUtils.subMonths(monthUtils.currentMonth(), type === 'envelope'
            ? Math.floor((numMonths - 1) / 2)
            : numMonths === 2
                ? 1
                : Math.max(numMonths - 2, 0)));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [_onMonthSelect, startMonth, numMonths]);
    return (<view_1.View style={{
            width: width,
            height: height,
            alignItems: 'center',
            opacity: width <= 0 || height <= 0 ? 0 : 1,
        }}>
      <view_1.View style={{ width: '100%', maxWidth: maxWidth }}>
        <BudgetPageHeader_1.BudgetPageHeader startMonth={prewarmStartMonth} numMonths={numMonths} monthBounds={monthBounds} onMonthSelect={_onMonthSelect}/>
        <BudgetTable_1.BudgetTable type={type} prewarmStartMonth={prewarmStartMonth} startMonth={startMonth} numMonths={numMonths} monthBounds={monthBounds} {...props}/>
      </view_1.View>
    </view_1.View>);
};
DynamicBudgetTableInner.displayName = 'DynamicBudgetTableInner';
var DynamicBudgetTable = function (props) {
    return (<react_virtualized_auto_sizer_1.default>
      {function (_a) {
            var width = _a.width, height = _a.height;
            return (<DynamicBudgetTableInner width={width} height={height} {...props}/>);
        }}
    </react_virtualized_auto_sizer_1.default>);
};
exports.DynamicBudgetTable = DynamicBudgetTable;
exports.DynamicBudgetTable.displayName = 'DynamicBudgetTable';
