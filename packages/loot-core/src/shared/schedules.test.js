"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var locale_1 = require("date-fns/locale");
var i18next_1 = require("i18next");
var mockdate_1 = require("mockdate");
var monthUtils = require("./months");
var schedules_1 = require("./schedules");
i18next_1.default.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            translation: {
                Every: 'Every',
                day: 'day',
                week: 'week',
                month: 'month',
                year: 'year',
                on: 'on',
                'on the': 'on the',
                and: 'and',
                'until {{date}}': 'until {{date}}',
                once: 'once',
                times: '{{endOccurrences}} times',
                weekend: 'weekend',
                last: 'last',
                'Next:': 'Next:',
                'last day': 'last day',
                '{{interval}} days': '{{interval}} days',
                '{{interval}} weeks': '{{interval}} weeks',
                '{{interval}} months': '{{interval}} months',
                '{{interval}} years': '{{interval}} years',
                Sunday: 'Sunday',
                Monday: 'Monday',
                Tuesday: 'Tuesday',
                Wednesday: 'Wednesday',
                Thursday: 'Thursday',
                Friday: 'Friday',
                Saturday: 'Saturday',
                '{{value}}th day': '{{value}}th day',
                '{{value}}th': '{{value}}th',
                '{{value}}th {{dayName}}': '{{value}}th {{dayName}}',
                'last {{dayName}}': 'last {{dayName}}',
                '({{weekendSolveMode}} weekend)': '({{weekendSolveMode}} weekend)',
            },
        },
    },
    interpolation: {
        escapeValue: false,
    },
});
describe('schedules', function () {
    var today = new Date(2017, 0, 1); // Global date when testing is set to 2017-01-01 per monthUtils.currentDay()
    var dateFormat = 'yyyy-MM-dd';
    var todayString = monthUtils.format(today, dateFormat);
    beforeEach(function () {
        mockdate_1.default.set(new Date(2021, 4, 14));
    });
    afterEach(function () {
        mockdate_1.default.reset();
    });
    describe('getStatus', function () {
        it('returns completed if completed', function () {
            expect((0, schedules_1.getStatus)(todayString, true, false, '7')).toBe('completed');
        });
        it('returns paid if has transactions', function () {
            expect((0, schedules_1.getStatus)(todayString, false, true, '7')).toBe('paid');
        });
        it('returns due if today', function () {
            expect((0, schedules_1.getStatus)(todayString, false, false, '7')).toBe('due');
        });
        it.each([1, 7, 14, 30])('returns upcoming if within upcoming range %n', function (upcomingLength) {
            var daysOut = upcomingLength;
            var tomorrow = monthUtils.addDays(today, 1);
            var upcomingDate = monthUtils.addDays(today, daysOut);
            var scheduledDate = monthUtils.addDays(today, daysOut + 1);
            expect((0, schedules_1.getStatus)(tomorrow, false, false, upcomingLength.toString())).toBe('upcoming');
            expect((0, schedules_1.getStatus)(upcomingDate, false, false, upcomingLength.toString())).toBe('upcoming');
            expect((0, schedules_1.getStatus)(scheduledDate, false, false, upcomingLength.toString())).toBe('scheduled');
        });
        it('returns missed if past', function () {
            expect((0, schedules_1.getStatus)(monthUtils.addDays(today, -1), false, false, '7')).toBe('missed');
        });
        it('returns scheduled if not due, upcoming, or missed', function () {
            expect((0, schedules_1.getStatus)(monthUtils.addDays(today, 8), false, false, '7')).toBe('scheduled');
        });
    });
    describe('getRecurringDescription', function () {
        it('describes weekly interval', function () {
            expect((0, schedules_1.getRecurringDescription)({ start: '2021-05-17', frequency: 'weekly' }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every week on Monday');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'weekly',
                interval: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 weeks on Monday');
        });
        it('describes monthly interval', function () {
            expect((0, schedules_1.getRecurringDescription)({ start: '2021-04-25', frequency: 'monthly' }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 25th');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                interval: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 months on the 25th');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [{ type: 'day', value: 25 }],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 25th');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                interval: 2,
                patterns: [{ type: 'day', value: 25 }],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 months on the 25th');
            // Last day should work
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [{ type: 'day', value: 31 }],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 31st');
            // -1 should work, representing the last day
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [{ type: 'day', value: -1 }],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the last day');
            // Day names should work
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [{ type: 'FR', value: 2 }],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 2nd Friday');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [{ type: 'FR', value: -1 }],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the last Friday');
        });
        it('describes monthly interval with multiple days', function () {
            // Note how order doesn't matter - the day should be sorted
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [
                    { type: 'day', value: 15 },
                    { type: 'day', value: 3 },
                    { type: 'day', value: 20 },
                ],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 3rd, 15th, and 20th');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [
                    { type: 'day', value: 3 },
                    { type: 'day', value: -1 },
                    { type: 'day', value: 20 },
                ],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 3rd, 20th, and last day');
            // Mix days and day names
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [
                    { type: 'day', value: 3 },
                    { type: 'day', value: -1 },
                    { type: 'FR', value: 2 },
                ],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 2nd Friday, 3rd, and last day');
            // When there is a mixture of types, day names should always come first
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-04-25',
                frequency: 'monthly',
                patterns: [
                    { type: 'SA', value: 1 },
                    { type: 'day', value: 2 },
                    { type: 'FR', value: 3 },
                    { type: 'day', value: 10 },
                ],
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every month on the 1st Saturday, 3rd Friday, 2nd, and 10th');
        });
        it('describes yearly interval', function () {
            expect((0, schedules_1.getRecurringDescription)({ start: '2021-05-17', frequency: 'yearly' }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every year on May 17th');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'yearly',
                interval: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 years on May 17th');
        });
        it('describes intervals with limited occurrences', function () {
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'weekly',
                interval: 2,
                endMode: 'after_n_occurrences',
                endOccurrences: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 weeks on Monday, 2 times');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'weekly',
                interval: 2,
                endMode: 'after_n_occurrences',
                endOccurrences: 1,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 weeks on Monday, once');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'monthly',
                interval: 2,
                endMode: 'after_n_occurrences',
                endOccurrences: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 months on the 17th, 2 times');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'yearly',
                interval: 2,
                endMode: 'after_n_occurrences',
                endOccurrences: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 years on May 17th, 2 times');
        });
        it('describes intervals with an end date', function () {
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'weekly',
                interval: 2,
                endMode: 'on_date',
                endDate: '2021-06-01',
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 weeks on Monday, until 06/01/2021');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'monthly',
                interval: 2,
                endMode: 'on_date',
                endDate: '2021-06-01',
            }, 'yyyy-MM-dd', locale_1.enUS)).toBe('Every 2 months on the 17th, until 2021-06-01');
        });
    });
    describe('getUpcomingDays', function () {
        it.each([
            ['1', 1, '2017-01-01'],
            ['7', 7, '2017-01-01'],
            ['14', 14, '2017-01-01'],
            ['oneMonth', 31, '2017-01-01'],
            ['oneMonth', 30, '2017-04-01'],
            ['oneMonth', 30, '2017-04-15'],
            ['oneMonth', 28, '2017-02-01'],
            ['oneMonth', 29, '2020-02-01'], // leap-year
            ['currentMonth', 30, '2017-01-01'],
            ['currentMonth', 27, '2017-02-01'],
            ['currentMonth', 20, '2017-02-08'],
            ['currentMonth', 28, '2020-02-01'], // leap-year
            ['2-day', 2, '2017-01-01'],
            ['5-week', 35, '2017-01-01'],
            ['3-month', 91, '2017-01-01'],
            ['4-year', 1462, '2017-01-01'],
        ])('value of %s on returns %i days on %s', function (value, expected, date) {
            expect((0, schedules_1.getUpcomingDays)(value, date)).toEqual(expected);
        });
    });
});
