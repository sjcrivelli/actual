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
const locale_1 = require("date-fns/locale");
const i18next_1 = __importDefault(require("i18next"));
const mockdate_1 = __importDefault(require("mockdate"));
const monthUtils = __importStar(require("./months"));
const schedules_1 = require("./schedules");
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
describe('schedules', () => {
    const today = new Date(2017, 0, 1); // Global date when testing is set to 2017-01-01 per monthUtils.currentDay()
    const dateFormat = 'yyyy-MM-dd';
    const todayString = monthUtils.format(today, dateFormat);
    beforeEach(() => {
        mockdate_1.default.set(new Date(2021, 4, 14));
    });
    afterEach(() => {
        mockdate_1.default.reset();
    });
    describe('getStatus', () => {
        it('returns completed if completed', () => {
            expect((0, schedules_1.getStatus)(todayString, true, false, '7')).toBe('completed');
        });
        it('returns paid if has transactions', () => {
            expect((0, schedules_1.getStatus)(todayString, false, true, '7')).toBe('paid');
        });
        it('returns due if today', () => {
            expect((0, schedules_1.getStatus)(todayString, false, false, '7')).toBe('due');
        });
        it.each([1, 7, 14, 30])('returns upcoming if within upcoming range %n', (upcomingLength) => {
            const daysOut = upcomingLength;
            const tomorrow = monthUtils.addDays(today, 1);
            const upcomingDate = monthUtils.addDays(today, daysOut);
            const scheduledDate = monthUtils.addDays(today, daysOut + 1);
            expect((0, schedules_1.getStatus)(tomorrow, false, false, upcomingLength.toString())).toBe('upcoming');
            expect((0, schedules_1.getStatus)(upcomingDate, false, false, upcomingLength.toString())).toBe('upcoming');
            expect((0, schedules_1.getStatus)(scheduledDate, false, false, upcomingLength.toString())).toBe('scheduled');
        });
        it('returns missed if past', () => {
            expect((0, schedules_1.getStatus)(monthUtils.addDays(today, -1), false, false, '7')).toBe('missed');
        });
        it('returns scheduled if not due, upcoming, or missed', () => {
            expect((0, schedules_1.getStatus)(monthUtils.addDays(today, 8), false, false, '7')).toBe('scheduled');
        });
    });
    describe('getRecurringDescription', () => {
        it('describes weekly interval', () => {
            expect((0, schedules_1.getRecurringDescription)({ start: '2021-05-17', frequency: 'weekly' }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every week on Monday');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'weekly',
                interval: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 weeks on Monday');
        });
        it('describes monthly interval', () => {
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
        it('describes monthly interval with multiple days', () => {
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
        it('describes yearly interval', () => {
            expect((0, schedules_1.getRecurringDescription)({ start: '2021-05-17', frequency: 'yearly' }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every year on May 17th');
            expect((0, schedules_1.getRecurringDescription)({
                start: '2021-05-17',
                frequency: 'yearly',
                interval: 2,
            }, 'MM/dd/yyyy', locale_1.enUS)).toBe('Every 2 years on May 17th');
        });
        it('describes intervals with limited occurrences', () => {
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
        it('describes intervals with an end date', () => {
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
    describe('getUpcomingDays', () => {
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
        ])('value of %s on returns %i days on %s', (value, expected, date) => {
            expect((0, schedules_1.getUpcomingDays)(value, date)).toEqual(expected);
        });
    });
});
//# sourceMappingURL=schedules.test.js.map