"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategoryScheduleGoalTemplateIndicator = useCategoryScheduleGoalTemplateIndicator;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var monthUtils = require("loot-core/shared/months");
var useCategoryScheduleGoalTemplates_1 = require("./useCategoryScheduleGoalTemplates");
var useLocale_1 = require("./useLocale");
/**
 * We only display an indicator for one schedule at a time, so we
 * filter and then sort the schedules to show missed schedules first,
 * then due schedules, then upcoming schedules. This is to ensure that
 * the user sees the most important schedule first.
 */
function useCategoryScheduleGoalTemplateIndicator(_a) {
    var category = _a.category, month = _a.month;
    var t = (0, react_i18next_1.useTranslation)().t;
    var locale = (0, useLocale_1.useLocale)();
    var _b = (0, useCategoryScheduleGoalTemplates_1.useCategoryScheduleGoalTemplates)({
        category: category,
    }), schedules = _b.schedules, scheduleStatuses = _b.statuses;
    return (0, react_1.useMemo)(function () {
        var _a;
        var schedulesToDisplay = schedules
            .filter(function (schedule) {
            var status = scheduleStatuses.get(schedule.id);
            return status === 'upcoming' || status === 'due' || status === 'missed';
        })
            .filter(function (schedule) { return monthUtils.monthFromDate(schedule.next_date) === month; })
            .sort(function (a, b) {
            // Display missed schedules first, then due, then upcoming.
            var aStatus = scheduleStatuses.get(a.id);
            var bStatus = scheduleStatuses.get(b.id);
            if (aStatus === 'missed' && bStatus !== 'missed')
                return -1;
            if (bStatus === 'missed' && aStatus !== 'missed')
                return 1;
            if (aStatus === 'due' && bStatus !== 'due')
                return -1;
            if (bStatus === 'due' && aStatus !== 'due')
                return 1;
            return 0;
        });
        var description = schedulesToDisplay
            .map(function (s) {
            return getScheduleStatusDescription({
                t: t,
                schedule: s,
                scheduleStatus: scheduleStatuses.get(s.id),
                locale: locale,
            });
        })
            .join('\n');
        var schedule = schedulesToDisplay[0] || null;
        var scheduleStatus = (schedule ? scheduleStatuses.get(schedule.id) : null) || null;
        return {
            schedule: schedule,
            scheduleStatus: scheduleStatus,
            isScheduleRecurring: !!((_a = schedule === null || schedule === void 0 ? void 0 : schedule._date) === null || _a === void 0 ? void 0 : _a.frequency),
            description: description,
        };
    }, [locale, month, scheduleStatuses, schedules, t]);
}
function getScheduleStatusDescription(_a) {
    var t = _a.t, schedule = _a.schedule, scheduleStatus = _a.scheduleStatus, locale = _a.locale;
    if (!schedule || !scheduleStatus) {
        return '';
    }
    var isToday = monthUtils.isCurrentDay(schedule.next_date);
    var distanceFromNow = monthUtils.formatDistance(schedule.next_date, monthUtils.currentDay(), locale, {
        addSuffix: true,
    });
    var formattedDate = monthUtils.format(schedule.next_date, 'MMMM d', locale);
    switch (scheduleStatus) {
        case 'missed':
            return t('Missed {{scheduleName}} due {{distanceFromNow}} ({{formattedDate}})', {
                scheduleName: schedule.name,
                distanceFromNow: distanceFromNow,
                formattedDate: formattedDate,
            });
        case 'due':
        case 'upcoming':
            return t('{{scheduleName}} is due {{distanceFromNow}} ({{formattedDate}})', {
                scheduleName: schedule.name,
                distanceFromNow: isToday ? t('today') : distanceFromNow,
                formattedDate: formattedDate,
            });
        default:
            throw new Error("Unsupported schedule status for tooltip: ".concat(scheduleStatus));
    }
}
