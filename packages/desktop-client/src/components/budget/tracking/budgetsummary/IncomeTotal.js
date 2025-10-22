"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeTotal = IncomeTotal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var BudgetTotal_1 = require("./BudgetTotal");
var IncomeProgress_1 = require("./IncomeProgress");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function IncomeTotal(_a) {
    var style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<BudgetTotal_1.BudgetTotal title={t('Income')} current={bindings_1.trackingBudget.totalIncome} target={bindings_1.trackingBudget.totalBudgetedIncome} ProgressComponent={IncomeProgress_1.IncomeProgress} style={style}/>);
}
