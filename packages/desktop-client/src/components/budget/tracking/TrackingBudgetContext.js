"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingBudgetProvider = TrackingBudgetProvider;
exports.useTrackingBudget = useTrackingBudget;
// @ts-strict-ignore
var react_1 = require("react");
var monthUtils = require("loot-core/shared/months");
var Context = (0, react_1.createContext)(null);
function TrackingBudgetProvider(_a) {
    var summaryCollapsed = _a.summaryCollapsed, onBudgetAction = _a.onBudgetAction, onToggleSummaryCollapse = _a.onToggleSummaryCollapse, children = _a.children;
    var currentMonth = monthUtils.currentMonth();
    return (<Context.Provider value={{
            currentMonth: currentMonth,
            summaryCollapsed: summaryCollapsed,
            onBudgetAction: onBudgetAction,
            onToggleSummaryCollapse: onToggleSummaryCollapse,
        }}>
      {children}
    </Context.Provider>);
}
function useTrackingBudget() {
    return (0, react_1.useContext)(Context);
}
