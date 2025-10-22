"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStart = validateStart;
exports.validateEnd = validateEnd;
exports.validateRange = validateRange;
exports.getSpecificRange = getSpecificRange;
exports.getFullRange = getFullRange;
exports.getLatestRange = getLatestRange;
exports.calculateTimeRange = calculateTimeRange;
exports.calculateSpendingReportTimeRange = calculateSpendingReportTimeRange;
var monthUtils = require("loot-core/shared/months");
function validateStart(earliest, latest, start, end, interval, firstDayOfWeekIdx) {
    var addDays;
    var dateStart;
    switch (interval) {
        case 'Monthly':
            dateStart = start + '-01';
            addDays = 180;
            break;
        case 'Yearly':
            dateStart = start + '-01-01';
            addDays = 1095;
            break;
        case 'Daily':
            dateStart = start;
            addDays = 6;
            break;
        default:
            dateStart = start;
            addDays = 180;
            break;
    }
    if (end < start) {
        end = monthUtils.addDays(dateStart, addDays);
    }
    return boundedRange(earliest, latest, dateStart, interval ? end : monthUtils.monthFromDate(end), interval, firstDayOfWeekIdx);
}
function validateEnd(earliest, latest, start, end, interval, firstDayOfWeekIdx) {
    var subDays;
    var dateEnd;
    switch (interval) {
        case 'Monthly':
            dateEnd = monthUtils.getMonthEnd(end + '-01');
            subDays = 180;
            break;
        case 'Yearly':
            dateEnd = end + '-12-31';
            subDays = 1095;
            break;
        case 'Daily':
            dateEnd = end;
            subDays = 6;
            break;
        default:
            dateEnd = end;
            subDays = 180;
            break;
    }
    if (start > end) {
        start = monthUtils.subDays(dateEnd, subDays);
    }
    return boundedRange(earliest, latest, interval ? start : monthUtils.monthFromDate(start), dateEnd, interval, firstDayOfWeekIdx);
}
function validateRange(earliest, latest, start, end) {
    if (end > latest) {
        end = latest;
    }
    if (start < earliest) {
        start = earliest;
    }
    return [start, end];
}
function boundedRange(earliest, latest, start, end, interval, firstDayOfWeekIdx) {
    switch (interval) {
        case 'Daily':
            latest = monthUtils.currentDay();
            break;
        case 'Weekly':
            latest = monthUtils.currentWeek(firstDayOfWeekIdx);
            break;
        case 'Monthly':
            latest = monthUtils.getMonthEnd(monthUtils.currentDay());
            break;
        case 'Yearly':
            latest = monthUtils.currentDay();
            break;
        default:
            break;
    }
    if (end > latest) {
        end = latest;
    }
    if (start < earliest) {
        start = earliest;
    }
    return [start, end, 'static'];
}
function getSpecificRange(offset, addNumber, type, firstDayOfWeekIdx) {
    var currentDay = monthUtils.currentDay();
    var currentWeek = monthUtils.currentWeek(firstDayOfWeekIdx);
    var dateStart = monthUtils.subMonths(currentDay, offset) + '-01';
    var dateEnd = monthUtils.getMonthEnd(monthUtils.addMonths(dateStart, addNumber === null ? offset : addNumber) +
        '-01');
    if (type === 'Week') {
        dateStart = monthUtils.subWeeks(currentWeek, offset);
        dateEnd = monthUtils.getWeekEnd(monthUtils.addWeeks(dateStart, addNumber === null ? offset : addNumber), firstDayOfWeekIdx);
    }
    return [dateStart, dateEnd, 'static'];
}
function getFullRange(start, end) {
    return [start, end, 'full'];
}
function getLatestRange(offset) {
    var end = monthUtils.currentMonth();
    var start = monthUtils.subMonths(end, offset);
    return [start, end, 'sliding-window'];
}
function calculateTimeRange(timeFrame, defaultTimeFrame, latestTransaction) {
    var _a, _b, _c, _d, _e, _f;
    var start = (_b = (_a = timeFrame === null || timeFrame === void 0 ? void 0 : timeFrame.start) !== null && _a !== void 0 ? _a : defaultTimeFrame === null || defaultTimeFrame === void 0 ? void 0 : defaultTimeFrame.start) !== null && _b !== void 0 ? _b : monthUtils.subMonths(monthUtils.currentMonth(), 5);
    var end = (_d = (_c = timeFrame === null || timeFrame === void 0 ? void 0 : timeFrame.end) !== null && _c !== void 0 ? _c : defaultTimeFrame === null || defaultTimeFrame === void 0 ? void 0 : defaultTimeFrame.end) !== null && _d !== void 0 ? _d : monthUtils.currentMonth();
    var mode = (_f = (_e = timeFrame === null || timeFrame === void 0 ? void 0 : timeFrame.mode) !== null && _e !== void 0 ? _e : defaultTimeFrame === null || defaultTimeFrame === void 0 ? void 0 : defaultTimeFrame.mode) !== null && _f !== void 0 ? _f : 'sliding-window';
    if (mode === 'full') {
        var latestTransactionMonth = latestTransaction
            ? monthUtils.monthFromDate(latestTransaction)
            : null;
        var currentMonth = monthUtils.currentMonth();
        var fullEnd = latestTransactionMonth &&
            monthUtils.isAfter(latestTransactionMonth, currentMonth)
            ? latestTransactionMonth
            : currentMonth;
        return getFullRange(start, fullEnd);
    }
    if (mode === 'sliding-window') {
        var offset = monthUtils.differenceInCalendarMonths(end, start);
        if (start > end) {
            return [
                monthUtils.currentMonth(),
                monthUtils.subMonths(monthUtils.currentMonth(), -offset),
                'sliding-window',
            ];
        }
        return getLatestRange(offset);
    }
    if (mode === 'lastYear') {
        return [
            monthUtils.getYearStart(monthUtils.prevYear(monthUtils.currentMonth())),
            monthUtils.getYearEnd(monthUtils.prevYear(monthUtils.currentDate())),
            'lastYear',
        ];
    }
    if (mode === 'yearToDate') {
        return [
            monthUtils.currentYear() + '-01',
            monthUtils.currentMonth(),
            'yearToDate',
        ];
    }
    if (mode === 'priorYearToDate') {
        return [
            monthUtils.getYearStart(monthUtils.prevYear(monthUtils.currentMonth())),
            monthUtils.prevYear(monthUtils.currentDate(), 'yyyy-MM-dd'),
            'priorYearToDate',
        ];
    }
    return [start, end, 'static'];
}
function calculateSpendingReportTimeRange(_a) {
    var compare = _a.compare, compareTo = _a.compareTo, _b = _a.isLive, isLive = _b === void 0 ? true : _b, _c = _a.mode, mode = _c === void 0 ? 'single-month' : _c;
    if (['budget', 'average'].includes(mode) && isLive) {
        return [monthUtils.currentMonth(), monthUtils.currentMonth()];
    }
    var _d = calculateTimeRange({
        start: compare,
        end: compareTo,
        mode: (isLive !== null && isLive !== void 0 ? isLive : true) ? 'sliding-window' : 'static',
    }, {
        start: monthUtils.currentMonth(),
        end: monthUtils.subMonths(monthUtils.currentMonth(), 1),
        mode: 'sliding-window',
    }), start = _d[0], end = _d[1];
    return [start, end];
}
