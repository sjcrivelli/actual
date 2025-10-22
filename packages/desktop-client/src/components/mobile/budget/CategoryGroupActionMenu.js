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
exports.CategoryGroupActionMenu = CategoryGroupActionMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
function CategoryGroupActionMenu(_a) {
    var onApplyBudgetTemplatesInGroup = _a.onApplyBudgetTemplatesInGroup, props = __rest(_a, ["onApplyBudgetTemplatesInGroup"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    return (<menu_1.Menu {...props} onMenuSelect={function (name) {
            switch (name) {
                case 'apply-budget-templates-in-group':
                    onApplyBudgetTemplatesInGroup();
                    break;
            }
        }} items={__spreadArray([], (isGoalTemplatesEnabled
            ? [
                {
                    name: 'apply-budget-templates-in-group',
                    text: t('Apply budget template'),
                },
            ]
            : []), true)}/>);
}
