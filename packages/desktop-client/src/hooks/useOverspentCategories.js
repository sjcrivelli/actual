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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOverspentCategories = useOverspentCategories;
var react_1 = require("react");
var monthUtils = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var useCategories_1 = require("./useCategories");
var useSpreadsheet_1 = require("./useSpreadsheet");
var useSyncedPref_1 = require("./useSyncedPref");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function useOverspentCategories(_a) {
    var month = _a.month;
    var spreadsheet = (0, useSpreadsheet_1.useSpreadsheet)();
    var _b = (0, useSyncedPref_1.useSyncedPref)('budgetType')[0], budgetType = _b === void 0 ? 'envelope' : _b;
    var _c = (0, useCategories_1.useCategories)(), categories = _c.list, categoryGroups = _c.grouped;
    var categoryGroupsById = (0, react_1.useMemo)(function () { return (0, util_1.groupById)(categoryGroups); }, [categoryGroups]);
    var categoryBalanceBindings = (0, react_1.useMemo)(function () {
        return categories.map(function (category) { return [
            category.id,
            budgetType === 'tracking'
                ? bindings_1.trackingBudget.catBalance(category.id)
                : bindings_1.envelopeBudget.catBalance(category.id),
        ]; });
    }, [budgetType, categories]);
    var categoryCarryoverBindings = (0, react_1.useMemo)(function () {
        return categories.map(function (category) { return [
            category.id,
            budgetType === 'tracking'
                ? bindings_1.trackingBudget.catCarryover(category.id)
                : bindings_1.envelopeBudget.catCarryover(category.id),
        ]; });
    }, [budgetType, categories]);
    var _d = (0, react_1.useState)({}), overspendingByCategory = _d[0], setOverspendingByCategory = _d[1];
    var _e = (0, react_1.useState)({}), carryoverFlagByCategory = _e[0], setCarryoverFlagByCategory = _e[1];
    (0, react_1.useEffect)(function () {
        setOverspendingByCategory({});
        setCarryoverFlagByCategory({});
    }, [month]);
    var sheetName = monthUtils.sheetForMonth(month);
    (0, react_1.useEffect)(function () {
        var unbindList = [];
        var _loop_1 = function (categoryId, carryoverBinding) {
            var unbind = spreadsheet.bind(sheetName, carryoverBinding, function (result) {
                var isRolloverEnabled = Boolean(result.value);
                if (isRolloverEnabled) {
                    setCarryoverFlagByCategory(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[categoryId] = isRolloverEnabled, _a)));
                    });
                }
                else {
                    // Update to remove covered category.
                    setCarryoverFlagByCategory(function (prev) {
                        var _a = prev, _b = categoryId, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                        return rest;
                    });
                }
            });
            unbindList.push(unbind);
        };
        for (var _i = 0, categoryCarryoverBindings_1 = categoryCarryoverBindings; _i < categoryCarryoverBindings_1.length; _i++) {
            var _a = categoryCarryoverBindings_1[_i], categoryId = _a[0], carryoverBinding = _a[1];
            _loop_1(categoryId, carryoverBinding);
        }
        return function () {
            unbindList.forEach(function (unbind) { return unbind(); });
        };
    }, [categoryCarryoverBindings, sheetName, spreadsheet]);
    (0, react_1.useEffect)(function () {
        var unbindList = [];
        var _loop_2 = function (categoryId, balanceBinding) {
            var unbind = spreadsheet.bind(sheetName, balanceBinding, function (result) {
                var balance = result.value;
                if (balance < 0) {
                    setOverspendingByCategory(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[categoryId] = balance, _a)));
                    });
                }
                else if (balance >= 0) {
                    // Update to remove covered category.
                    setOverspendingByCategory(function (prev) {
                        var _a = prev, _b = categoryId, _ = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                        return rest;
                    });
                }
            });
            unbindList.push(unbind);
        };
        for (var _i = 0, categoryBalanceBindings_1 = categoryBalanceBindings; _i < categoryBalanceBindings_1.length; _i++) {
            var _a = categoryBalanceBindings_1[_i], categoryId = _a[0], balanceBinding = _a[1];
            _loop_2(categoryId, balanceBinding);
        }
        return function () {
            unbindList.forEach(function (unbind) { return unbind(); });
        };
    }, [categoryBalanceBindings, sheetName, spreadsheet]);
    return (0, react_1.useMemo)(function () {
        // Ignore those that has rollover enabled.
        var categoryIdsToReturn = Object.keys(overspendingByCategory).filter(function (id) { return !carryoverFlagByCategory[id]; });
        var categoriesToReturn = categories
            .filter(function (category) {
            return categoryIdsToReturn.includes(category.id) && !category.is_income;
        })
            .filter(function (category) {
            var _a;
            return budgetType === 'tracking'
                ? !category.hidden && !((_a = categoryGroupsById[category.group]) === null || _a === void 0 ? void 0 : _a.hidden)
                : true;
        });
        var amountsByCategory = new Map(categoriesToReturn.map(function (category) { return [
            category.id,
            overspendingByCategory[category.id],
        ]; }));
        var totalAmount = Array.from(amountsByCategory.values()).reduce(function (sum, value) { return sum + value; }, 0);
        return {
            categories: categoriesToReturn,
            amountsByCategory: amountsByCategory,
            totalAmount: totalAmount,
        };
    }, [
        budgetType,
        carryoverFlagByCategory,
        categories,
        categoryGroupsById,
        overspendingByCategory,
    ]);
}
