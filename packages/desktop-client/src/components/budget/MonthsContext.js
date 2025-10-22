"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthsContext = void 0;
exports.getValidMonthBounds = getValidMonthBounds;
exports.MonthsProvider = MonthsProvider;
// @ts-strict-ignore
var react_1 = require("react");
var monthUtils = require("loot-core/shared/months");
function getValidMonthBounds(bounds, startMonth, endMonth) {
    return {
        start: startMonth < bounds.start ? bounds.start : startMonth,
        end: endMonth > bounds.end ? bounds.end : endMonth,
    };
}
exports.MonthsContext = (0, react_1.createContext)(null);
function MonthsProvider(_a) {
    var startMonth = _a.startMonth, numMonths = _a.numMonths, monthBounds = _a.monthBounds, type = _a.type, children = _a.children;
    var endMonth = monthUtils.addMonths(startMonth, numMonths - 1);
    var bounds = getValidMonthBounds(monthBounds, startMonth, endMonth);
    var months = monthUtils.rangeInclusive(bounds.start, bounds.end);
    return (<exports.MonthsContext.Provider value={{ months: months, type: type }}>
      {children}
    </exports.MonthsContext.Provider>);
}
