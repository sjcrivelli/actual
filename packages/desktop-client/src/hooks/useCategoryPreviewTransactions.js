"use strict";
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
exports.useCategoryPreviewTransactions = useCategoryPreviewTransactions;
var react_1 = require("react");
var monthUtils = require("loot-core/shared/months");
var useCategory_1 = require("./useCategory");
var useCategoryScheduleGoalTemplates_1 = require("./useCategoryScheduleGoalTemplates");
var usePreviewTransactions_1 = require("./usePreviewTransactions");
var useSheetValue_1 = require("./useSheetValue");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function useCategoryPreviewTransactions(_a) {
    var categoryId = _a.categoryId, month = _a.month;
    var category = (0, useCategory_1.useCategory)(categoryId);
    var schedules = (0, useCategoryScheduleGoalTemplates_1.useCategoryScheduleGoalTemplates)({
        category: category,
    }).schedules;
    var schedulesToPreview = (0, react_1.useMemo)(function () {
        return new Set(schedules
            .filter(function (schedule) { return monthUtils.getMonth(schedule.next_date) === month; })
            .map(function (schedule) { return schedule.id; }));
    }, [month, schedules]);
    var categoryBalanceValue = (0, useSheetValue_1.useSheetValue)((0, bindings_1.categoryBalance)(categoryId, month));
    var categorySchedulesFilter = (0, react_1.useCallback)(function (schedule) { return schedulesToPreview.has(schedule.id); }, [schedulesToPreview]);
    var _b = (0, usePreviewTransactions_1.usePreviewTransactions)({
        filter: categorySchedulesFilter,
        options: {
            startingBalance: categoryBalanceValue !== null && categoryBalanceValue !== void 0 ? categoryBalanceValue : 0,
        },
    }), allPreviewTransactions = _b.previewTransactions, allRunningBalances = _b.runningBalances, isLoading = _b.isLoading, error = _b.error;
    return (0, react_1.useMemo)(function () {
        if (!category || !schedulesToPreview.size) {
            return {
                previewTransactions: [],
                runningBalances: new Map(),
                isLoading: isLoading,
                error: error,
            };
        }
        var previewTransactions = allPreviewTransactions.filter(function (transaction) {
            return transaction.schedule && schedulesToPreview.has(transaction.schedule);
        });
        var transactionIds = new Set(previewTransactions.map(function (t) { return t.id; }));
        var runningBalances = new Map(__spreadArray([], allRunningBalances, true).filter(function (_a) {
            var id = _a[0];
            return transactionIds.has(id);
        }));
        return {
            previewTransactions: previewTransactions,
            runningBalances: runningBalances,
            isLoading: isLoading,
            error: error,
        };
    }, [
        allPreviewTransactions,
        allRunningBalances,
        category,
        error,
        isLoading,
        schedulesToPreview,
    ]);
}
