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
exports.BudgetMenu = BudgetMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
function BudgetMenu(_a) {
    var onCopyLastMonthAverage = _a.onCopyLastMonthAverage, onSetMonthsAverage = _a.onSetMonthsAverage, onApplyBudgetTemplate = _a.onApplyBudgetTemplate, props = __rest(_a, ["onCopyLastMonthAverage", "onSetMonthsAverage", "onApplyBudgetTemplate"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var onMenuSelect = function (name) {
        switch (name) {
            case 'copy-single-last':
                onCopyLastMonthAverage === null || onCopyLastMonthAverage === void 0 ? void 0 : onCopyLastMonthAverage();
                break;
            case 'set-single-3-avg':
                onSetMonthsAverage === null || onSetMonthsAverage === void 0 ? void 0 : onSetMonthsAverage(3);
                break;
            case 'set-single-6-avg':
                onSetMonthsAverage === null || onSetMonthsAverage === void 0 ? void 0 : onSetMonthsAverage(6);
                break;
            case 'set-single-12-avg':
                onSetMonthsAverage === null || onSetMonthsAverage === void 0 ? void 0 : onSetMonthsAverage(12);
                break;
            case 'apply-single-category-template':
                onApplyBudgetTemplate === null || onApplyBudgetTemplate === void 0 ? void 0 : onApplyBudgetTemplate();
                break;
            default:
                throw new Error("Unrecognized menu item: ".concat(name));
        }
    };
    return (<menu_1.Menu {...props} onMenuSelect={onMenuSelect} items={__spreadArray([
            {
                name: 'copy-single-last',
                text: t('Copy last month’s budget'),
            },
            {
                name: 'set-single-3-avg',
                text: t('Set to 3 month average'),
            },
            {
                name: 'set-single-6-avg',
                text: t('Set to 6 month average'),
            },
            {
                name: 'set-single-12-avg',
                text: t('Set to yearly average'),
            }
        ], (isGoalTemplatesEnabled
            ? [
                {
                    name: 'apply-single-category-template',
                    text: t('Apply budget template'),
                },
            ]
            : []), true)}/>);
}
