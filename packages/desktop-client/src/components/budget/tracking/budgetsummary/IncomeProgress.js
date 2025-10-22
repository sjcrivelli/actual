"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeProgress = IncomeProgress;
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var fraction_1 = require("./fraction");
var PieProgress_1 = require("./PieProgress");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
function IncomeProgress(_a) {
    var current = _a.current, target = _a.target;
    var totalIncome = (0, useSheetValue_1.useSheetValue)(current) || 0;
    var totalBudgeted = (0, useSheetValue_1.useSheetValue)(target) || 0;
    var over = false;
    if (totalIncome < 0) {
        over = true;
        totalIncome = -totalIncome;
    }
    var frac = (0, fraction_1.fraction)(totalIncome, totalBudgeted);
    return (<PieProgress_1.PieProgress progress={frac} color={over ? theme_1.theme.errorText : theme_1.theme.noticeTextLight} backgroundColor={over ? theme_1.theme.errorBackground : theme_1.theme.tableBackground} style={{ width: 20, height: 20 }}/>);
}
