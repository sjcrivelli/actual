"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvelopeBudgetProvider = EnvelopeBudgetProvider;
exports.useEnvelopeBudget = useEnvelopeBudget;
var react_1 = require("react");
var monthUtils = require("loot-core/shared/months");
var EnvelopeBudgetContext = (0, react_1.createContext)({
    summaryCollapsed: false,
    onBudgetAction: function () {
        throw new Error('Unitialised context method called: onBudgetAction');
    },
    onToggleSummaryCollapse: function () {
        throw new Error('Unitialised context method called: onToggleSummaryCollapse');
    },
    currentMonth: 'unknown',
});
function EnvelopeBudgetProvider(_a) {
    var summaryCollapsed = _a.summaryCollapsed, onBudgetAction = _a.onBudgetAction, onToggleSummaryCollapse = _a.onToggleSummaryCollapse, children = _a.children;
    var currentMonth = monthUtils.currentMonth();
    return (<EnvelopeBudgetContext.Provider value={{
            currentMonth: currentMonth,
            summaryCollapsed: summaryCollapsed,
            onBudgetAction: onBudgetAction,
            onToggleSummaryCollapse: onToggleSummaryCollapse,
        }}>
      {children}
    </EnvelopeBudgetContext.Provider>);
}
function useEnvelopeBudget() {
    return (0, react_1.useContext)(EnvelopeBudgetContext);
}
