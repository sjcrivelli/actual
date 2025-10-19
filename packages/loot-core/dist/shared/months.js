"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortYearRegex = exports.getShortYearFormat = exports.getMonthYearRegex = exports.getMonthYearFormat = exports.getDayMonthRegex = exports.getDayMonthFormat = exports.getDateFormatRegex = exports.parseDate = void 0;
exports._parse = _parse;
exports.yearFromDate = yearFromDate;
exports.monthFromDate = monthFromDate;
exports.weekFromDate = weekFromDate;
exports.firstDayOfMonth = firstDayOfMonth;
exports.lastDayOfMonth = lastDayOfMonth;
exports.dayFromDate = dayFromDate;
exports.currentMonth = currentMonth;
exports.currentWeek = currentWeek;
exports.currentYear = currentYear;
exports.currentDate = currentDate;
exports.currentDay = currentDay;
exports.nextMonth = nextMonth;
exports.prevYear = prevYear;
exports.prevMonth = prevMonth;
exports.addYears = addYears;
exports.addMonths = addMonths;
exports.addWeeks = addWeeks;
exports.differenceInCalendarMonths = differenceInCalendarMonths;
exports.differenceInCalendarDays = differenceInCalendarDays;
exports.subMonths = subMonths;
exports.subWeeks = subWeeks;
exports.subYears = subYears;
exports.addDays = addDays;
exports.subDays = subDays;
exports.isBefore = isBefore;
exports.isAfter = isAfter;
exports.isCurrentMonth = isCurrentMonth;
exports.isCurrentDay = isCurrentDay;
exports.bounds = bounds;
exports._yearRange = _yearRange;
exports.yearRangeInclusive = yearRangeInclusive;
exports._weekRange = _weekRange;
exports.weekRangeInclusive = weekRangeInclusive;
exports._range = _range;
exports.range = range;
exports.rangeInclusive = rangeInclusive;
exports._dayRange = _dayRange;
exports.dayRange = dayRange;
exports.dayRangeInclusive = dayRangeInclusive;
exports.getMonthFromIndex = getMonthFromIndex;
exports.getMonthIndex = getMonthIndex;
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getDay = getDay;
exports.getMonthEnd = getMonthEnd;
exports.getWeekEnd = getWeekEnd;
exports.getYearStart = getYearStart;
exports.getYearEnd = getYearEnd;
exports.sheetForMonth = sheetForMonth;
exports.nameForMonth = nameForMonth;
exports.format = format;
exports.formatDistance = formatDistance;
// @ts-strict-ignore
const d = __importStar(require("date-fns"));
const memoize_one_1 = __importDefault(require("memoize-one"));
const Platform = __importStar(require("./platform"));
function _parse(value) {
    if (typeof value === 'string') {
        // Dates are hard. We just want to deal with months in the format
        // 2020-01 and days in the format 2020-01-01, but life is never
        // simple. We want to rely on native dates for date logic because
        // days are complicated (leap years, etc). But relying on native
        // dates mean we're exposed to craziness.
        //
        // The biggest problem is that JS dates work with local time by
        // default. We could try to only work with UTC, but there's not an
        // easy way to make `format` avoid local time, and not sure if we
        // want that anyway (`currentMonth` should surely print the local
        // time). We need to embrace local time, and as long as inputs to
        // date logic and outputs from format are local time, it should
        // work.
        //
        // To make sure we're in local time, always give Date integer
        // values. If you pass in a string to parse, different string
        // formats produce different results.
        //
        // A big problem is daylight savings, however. Usually, when
        // giving the time to the Date constructor, you get back a date
        // specifically for that time in your local timezone. However, if
        // daylight savings occurs on that exact time, you will get back
        // something different:
        //
        // This is fine:
        // > new Date(2017, 2, 12, 1).toString()
        // > 'Sun Mar 12 2017 01:00:00 GMT-0500 (Eastern Standard Time)'
        //
        // But wait, we got back a different time (3AM instead of 2AM):
        // > new Date(2017, 2, 12, 2).toString()
        // > 'Sun Mar 12 2017 03:00:00 GMT-0400 (Eastern Daylight Time)'
        //
        // The time is "correctly" adjusted via DST, but we _really_
        // wanted 2AM. The problem is that time simply doesn't exist.
        //
        // Why is this a problem? Well, consider a case where the DST
        // shift happens *at midnight* and it goes back an hour. You think
        // you have a date object for the next day, but when formatted it
        // actually shows the previous day. A more likely scenario: buggy
        // timezone data makes JS dates do this shift when it shouldn't,
        // so using midnight at the time for date logic gives back the
        // last day. See the time range of Sep 30 15:00 - Oct 1 1:00 for
        // the AEST timezone when nodejs-mobile incorrectly gives you back
        // a time an hour *before* you specified. Since this happens on
        // Oct 1, doing `addMonths(September, 1)` still gives you back
        // September. Issue here:
        // https://github.com/JaneaSystems/nodejs-mobile/issues/251
        //
        // The fix is simple once you understand this. Always use the 12th
        // hour of the day. That's it. There is no DST that shifts more
        // than 12 hours (god let's hope not) so no matter how far DST has
        // shifted backwards or forwards, doing date logic will stay
        // within the day we want.
        const [year, month, day] = value.split('-');
        if (day != null) {
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12);
        }
        else if (month != null) {
            return new Date(parseInt(year), parseInt(month) - 1, 1, 12);
        }
        else {
            return new Date(parseInt(year), 0, 1, 12);
        }
    }
    if (typeof value === 'number') {
        return new Date(value);
    }
    return value;
}
exports.parseDate = _parse;
function yearFromDate(date) {
    return d.format(_parse(date), 'yyyy');
}
function monthFromDate(date) {
    return d.format(_parse(date), 'yyyy-MM');
}
function weekFromDate(date, firstDayOfWeekIdx) {
    const converted = parseInt(firstDayOfWeekIdx || '0');
    return d.format(_parse(d.startOfWeek(_parse(date), { weekStartsOn: converted })), 'yyyy-MM-dd');
}
function firstDayOfMonth(date) {
    return dayFromDate(d.startOfMonth(_parse(date)));
}
function lastDayOfMonth(date) {
    return dayFromDate(d.endOfMonth(_parse(date)));
}
function dayFromDate(date) {
    return d.format(_parse(date), 'yyyy-MM-dd');
}
function currentMonth() {
    if (global.IS_TESTING || Platform.isPlaywright) {
        return global.currentMonth || '2017-01';
    }
    else {
        return d.format(new Date(), 'yyyy-MM');
    }
}
function currentWeek(firstDayOfWeekIdx) {
    if (global.IS_TESTING || Platform.isPlaywright) {
        return global.currentWeek || '2017-01-01';
    }
    else {
        const converted = parseInt(firstDayOfWeekIdx || '0');
        return d.format(_parse(d.startOfWeek(new Date(), { weekStartsOn: converted })), 'yyyy-MM-dd');
    }
}
function currentYear() {
    if (global.IS_TESTING || Platform.isPlaywright) {
        return global.currentMonth || '2017';
    }
    else {
        return d.format(new Date(), 'yyyy');
    }
}
function currentDate() {
    if (global.IS_TESTING || Platform.isPlaywright) {
        return d.parse(currentDay(), 'yyyy-MM-dd', new Date());
    }
    return new Date();
}
function currentDay() {
    if (global.IS_TESTING || Platform.isPlaywright) {
        return '2017-01-01';
    }
    else {
        return d.format(new Date(), 'yyyy-MM-dd');
    }
}
function nextMonth(month) {
    return d.format(d.addMonths(_parse(month), 1), 'yyyy-MM');
}
function prevYear(month, format = 'yyyy-MM') {
    return d.format(d.subMonths(_parse(month), 12), format);
}
function prevMonth(month) {
    return d.format(d.subMonths(_parse(month), 1), 'yyyy-MM');
}
function addYears(year, n) {
    return d.format(d.addYears(_parse(year), n), 'yyyy');
}
function addMonths(month, n) {
    return d.format(d.addMonths(_parse(month), n), 'yyyy-MM');
}
function addWeeks(date, n) {
    return d.format(d.addWeeks(_parse(date), n), 'yyyy-MM-dd');
}
function differenceInCalendarMonths(month1, month2) {
    return d.differenceInCalendarMonths(_parse(month1), _parse(month2));
}
function differenceInCalendarDays(month1, month2) {
    return d.differenceInCalendarDays(_parse(month1), _parse(month2));
}
function subMonths(month, n) {
    return d.format(d.subMonths(_parse(month), n), 'yyyy-MM');
}
function subWeeks(date, n) {
    return d.format(d.subWeeks(_parse(date), n), 'yyyy-MM-dd');
}
function subYears(year, n) {
    return d.format(d.subYears(_parse(year), n), 'yyyy');
}
function addDays(day, n) {
    return d.format(d.addDays(_parse(day), n), 'yyyy-MM-dd');
}
function subDays(day, n) {
    return d.format(d.subDays(_parse(day), n), 'yyyy-MM-dd');
}
function isBefore(month1, month2) {
    return d.isBefore(_parse(month1), _parse(month2));
}
function isAfter(month1, month2) {
    return d.isAfter(_parse(month1), _parse(month2));
}
function isCurrentMonth(month) {
    return month === currentMonth();
}
function isCurrentDay(day) {
    return day === currentDay();
}
// TODO: This doesn't really fit in this module anymore, should
// probably live elsewhere
function bounds(month) {
    return {
        start: parseInt(d.format(d.startOfMonth(_parse(month)), 'yyyyMMdd')),
        end: parseInt(d.format(d.endOfMonth(_parse(month)), 'yyyyMMdd')),
    };
}
function _yearRange(start, end, inclusive = false) {
    const years = [];
    let year = yearFromDate(start);
    const endYear = yearFromDate(end);
    while (d.isBefore(_parse(year), _parse(endYear))) {
        years.push(year);
        year = addYears(year, 1);
    }
    if (inclusive) {
        years.push(year);
    }
    return years;
}
function yearRangeInclusive(start, end) {
    return _yearRange(start, end, true);
}
function _weekRange(start, end, inclusive = false, firstDayOfWeekIdx) {
    const weeks = [];
    let week = weekFromDate(start, firstDayOfWeekIdx);
    const endWeek = weekFromDate(end, firstDayOfWeekIdx);
    while (d.isBefore(_parse(week), _parse(endWeek))) {
        weeks.push(week);
        week = addWeeks(week, 1);
    }
    if (inclusive) {
        weeks.push(week);
    }
    return weeks;
}
function weekRangeInclusive(start, end, firstDayOfWeekIdx) {
    return _weekRange(start, end, true, firstDayOfWeekIdx);
}
function _range(start, end, inclusive = false) {
    const months = [];
    let month = monthFromDate(start);
    const endMonth = monthFromDate(end);
    while (d.isBefore(_parse(month), _parse(endMonth))) {
        months.push(month);
        month = addMonths(month, 1);
    }
    if (inclusive) {
        months.push(month);
    }
    return months;
}
function range(start, end) {
    return _range(start, end);
}
function rangeInclusive(start, end) {
    return _range(start, end, true);
}
function _dayRange(start, end, inclusive = false) {
    const days = [];
    let day = start;
    while (d.isBefore(_parse(day), _parse(end))) {
        days.push(dayFromDate(day));
        day = addDays(day, 1);
    }
    if (inclusive) {
        days.push(dayFromDate(day));
    }
    return days;
}
function dayRange(start, end) {
    return _dayRange(start, end);
}
function dayRangeInclusive(start, end) {
    return _dayRange(start, end, true);
}
function getMonthFromIndex(year, monthIndex) {
    const formatMonth = `${monthIndex + 1}`.padStart(2, '0');
    return `${year}-${formatMonth}`;
}
function getMonthIndex(month) {
    return parseInt(month.slice(5, 7)) - 1;
}
function getYear(month) {
    return month.slice(0, 4);
}
function getMonth(day) {
    return day.slice(0, 7);
}
function getDay(day) {
    return Number(d.format(_parse(day), 'dd'));
}
function getMonthEnd(day) {
    return subDays(nextMonth(day.slice(0, 7)) + '-01', 1);
}
function getWeekEnd(date, firstDayOfWeekIdx) {
    const converted = parseInt(firstDayOfWeekIdx || '0');
    return d.format(_parse(d.endOfWeek(_parse(date), { weekStartsOn: converted })), 'yyyy-MM-dd');
}
function getYearStart(month) {
    return getYear(month) + '-01';
}
function getYearEnd(month) {
    return getYear(month) + '-12';
}
function sheetForMonth(month) {
    return 'budget' + month.replace('-', '');
}
function nameForMonth(month, locale) {
    return d.format(_parse(month), 'MMMM ‘yy', { locale });
}
function format(month, format, locale) {
    return d.format(_parse(month), format, { locale });
}
function formatDistance(date1, date2, locale, options) {
    return d.formatDistance(_parse(date1), _parse(date2), {
        locale,
        ...options,
    });
}
exports.getDateFormatRegex = (0, memoize_one_1.default)((format) => {
    return new RegExp(format
        .replace(/d+/g, '\\d{1,2}')
        .replace(/M+/g, '\\d{1,2}')
        .replace(/y+/g, '\\d{4}'));
});
exports.getDayMonthFormat = (0, memoize_one_1.default)((format) => {
    return format
        .replace(/y+/g, '')
        .replace(/[^\w]$/, '')
        .replace(/^[^\w]/, '');
});
exports.getDayMonthRegex = (0, memoize_one_1.default)((format) => {
    const regex = format
        .replace(/y+/g, '')
        .replace(/[^\w]$/, '')
        .replace(/^[^\w]/, '')
        .replace(/d+/g, '\\d{1,2}')
        .replace(/M+/g, '\\d{1,2}');
    return new RegExp('^' + regex + '$');
});
exports.getMonthYearFormat = (0, memoize_one_1.default)((format) => {
    return format
        .replace(/d+/g, '')
        .replace(/[^\w]$/, '')
        .replace(/^[^\w]/, '')
        .replace(/\/\//, '/')
        .replace(/\.\./, '.')
        .replace(/--/, '-');
});
exports.getMonthYearRegex = (0, memoize_one_1.default)((format) => {
    const regex = format
        .replace(/d+/g, '')
        .replace(/[^\w]$/, '')
        .replace(/^[^\w]/, '')
        .replace(/\/\//, '/')
        .replace(/M+/g, '\\d{1,2}')
        .replace(/y+/g, '\\d{2,4}');
    return new RegExp('^' + regex + '$');
});
exports.getShortYearFormat = (0, memoize_one_1.default)((format) => {
    return format.replace(/y+/g, 'yy');
});
exports.getShortYearRegex = (0, memoize_one_1.default)((format) => {
    const regex = format
        .replace(/[^\w]$/, '')
        .replace(/^[^\w]/, '')
        .replace(/d+/g, '\\d{1,2}')
        .replace(/M+/g, '\\d{1,2}')
        .replace(/y+/g, '\\d{2}');
    return new RegExp('^' + regex + '$');
});
