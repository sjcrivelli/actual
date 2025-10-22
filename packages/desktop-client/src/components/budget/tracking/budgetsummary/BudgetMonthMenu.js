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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetMonthMenu = BudgetMonthMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
function BudgetMonthMenu(_a) {
    var onCopyLastMonthBudget = _a.onCopyLastMonthBudget, onSetBudgetsToZero = _a.onSetBudgetsToZero, onSetMonthsAverage = _a.onSetMonthsAverage, onCheckTemplates = _a.onCheckTemplates, onApplyBudgetTemplates = _a.onApplyBudgetTemplates, onOverwriteWithBudgetTemplates = _a.onOverwriteWithBudgetTemplates, props = __rest(_a, ["onCopyLastMonthBudget", "onSetBudgetsToZero", "onSetMonthsAverage", "onCheckTemplates", "onApplyBudgetTemplates", "onOverwriteWithBudgetTemplates"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'copy-last':
                    onCopyLastMonthBudget();
                    break;
                case 'set-zero':
                    onSetBudgetsToZero();
                    break;
                case 'set-3-avg':
                    onSetMonthsAverage(3);
                    break;
                case 'set-6-avg':
                    onSetMonthsAverage(6);
                    break;
                case 'set-12-avg':
                    onSetMonthsAverage(12);
                    break;
                case 'check-templates':
                    onCheckTemplates();
                    break;
                case 'apply-goal-template':
                    onApplyBudgetTemplates();
                    break;
                case 'overwrite-goal-template':
                    onOverwriteWithBudgetTemplates();
                    break;
            }
        }} items={__spreadArray([
            { name: 'copy-last', text: t('Copy last month’s budget') },
            { name: 'set-zero', text: t('Set budgets to zero') },
            {
                name: 'set-3-avg',
                text: t('Set budgets to 3 month average'),
            },
            {
                name: 'set-6-avg',
                text: t('Set budgets to 6 month average'),
            },
            {
                name: 'set-12-avg',
                text: t('Set budgets to 12 month average'),
            }
        ], (isGoalTemplatesEnabled
            ? [
                {
                    name: 'check-templates',
                    text: t('Check templates'),
                },
                {
                    name: 'apply-goal-template',
                    text: t('Apply budget template'),
                },
                {
                    name: 'overwrite-goal-template',
                    text: t('Overwrite with budget template'),
                },
            ]
            : []), true)}/>);
}
