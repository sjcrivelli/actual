"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBudgetAutomationCategories = useBudgetAutomationCategories;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
function useBudgetAutomationCategories() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var grouped = (0, useCategories_1.useCategories)().grouped;
    var categories = (0, react_1.useMemo)(function () {
        var incomeGroup = grouped.filter(function (group) { return group.name === 'Income'; })[0];
        return [
            {
                id: '',
                name: t('Special categories'),
                categories: [
                    { id: 'total', group: '', name: t('Total of all income') },
                    {
                        id: 'to-budget',
                        group: '',
                        name: t('Available funds to budget'),
                    },
                ],
            },
            __assign(__assign({}, incomeGroup), { name: t('Income categories') }),
        ];
    }, [grouped, t]);
    return categories;
}
