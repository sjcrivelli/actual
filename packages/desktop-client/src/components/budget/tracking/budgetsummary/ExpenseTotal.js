"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseTotal = ExpenseTotal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var BudgetTotal_1 = require("./BudgetTotal");
var ExpenseProgress_1 = require("./ExpenseProgress");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function ExpenseTotal(_a) {
    var style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<BudgetTotal_1.BudgetTotal title={t('Expenses')} current={bindings_1.trackingBudget.totalSpent} target={bindings_1.trackingBudget.totalBudgetedExpense} ProgressComponent={ExpenseProgress_1.ExpenseProgress} style={style}/>);
}
