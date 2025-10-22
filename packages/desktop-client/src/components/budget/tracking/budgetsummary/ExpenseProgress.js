"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseProgress = ExpenseProgress;
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var fraction_1 = require("./fraction");
var PieProgress_1 = require("./PieProgress");
var TrackingBudgetComponents_1 = require("@desktop-client/components/budget/tracking/TrackingBudgetComponents");
function ExpenseProgress(_a) {
    var current = _a.current, target = _a.target;
    var totalSpent = (0, TrackingBudgetComponents_1.useTrackingSheetValue)(current) || 0;
    var totalBudgeted = (0, TrackingBudgetComponents_1.useTrackingSheetValue)(target) || 0;
    // Reverse total spent, and also set a bottom boundary of 0 (in case
    // income goes into an expense category and it's "positive", don't
    // show that in the graph)
    totalSpent = Math.max(-totalSpent, 0);
    var frac;
    var over = false;
    if (totalSpent > totalBudgeted) {
        frac = (totalSpent - totalBudgeted) / totalBudgeted;
        over = true;
    }
    else {
        frac = (0, fraction_1.fraction)(totalSpent, totalBudgeted);
    }
    return (<PieProgress_1.PieProgress progress={frac} color={over ? theme_1.theme.errorText : theme_1.theme.noticeTextLight} backgroundColor={over ? theme_1.theme.errorBackground : theme_1.theme.tableBackground} style={{ width: 20, height: 20 }}/>);
}
