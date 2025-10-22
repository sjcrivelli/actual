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
exports.useCategoryScheduleGoalTemplates = useCategoryScheduleGoalTemplates;
var react_1 = require("react");
var useCachedSchedules_1 = require("./useCachedSchedules");
var useFeatureFlag_1 = require("./useFeatureFlag");
function useCategoryScheduleGoalTemplates(_a) {
    var category = _a.category;
    var isGoalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var _b = (0, useCachedSchedules_1.useCachedSchedules)(), allSchedules = _b.schedules, allStatuses = _b.statuses, allStatusLabels = _b.statusLabels;
    return (0, react_1.useMemo)(function () {
        if (!isGoalTemplatesEnabled || !category || !category.goal_def) {
            return {
                schedules: [],
                statuses: new Map(),
                statusLabels: new Map(),
            };
        }
        var goalDefinitions = [];
        try {
            goalDefinitions = JSON.parse(category.goal_def);
        }
        catch (e) {
            console.error('Failed to parse category goal_def:', e);
            return {
                schedules: [],
                statuses: new Map(),
                statusLabels: new Map(),
            };
        }
        var scheduleGoalDefinitions = goalDefinitions.filter(function (g) { return g.type === 'schedule'; });
        if (!scheduleGoalDefinitions.length) {
            return {
                schedules: [],
                statuses: new Map(),
                statusLabels: new Map(),
            };
        }
        var schedules = allSchedules.filter(function (s) {
            return scheduleGoalDefinitions.some(function (g) { return g.name === s.name; });
        });
        var scheduleIds = new Set(schedules.map(function (s) { return s.id; }));
        var statuses = new Map(__spreadArray([], allStatuses, true).filter(function (_a) {
            var id = _a[0];
            return scheduleIds.has(id);
        }));
        var statusLabels = new Map(__spreadArray([], allStatusLabels, true).filter(function (_a) {
            var id = _a[0];
            return scheduleIds.has(id);
        }));
        return {
            schedules: schedules,
            statuses: statuses,
            statusLabels: statusLabels,
        };
    }, [
        allSchedules,
        allStatusLabels,
        allStatuses,
        category,
        isGoalTemplatesEnabled,
    ]);
}
