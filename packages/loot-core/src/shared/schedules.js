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
exports.getStatus = getStatus;
exports.getStatusLabel = getStatusLabel;
exports.getHasTransactionsQuery = getHasTransactionsQuery;
exports.getRecurringDescription = getRecurringDescription;
exports.recurConfigToRSchedule = recurConfigToRSchedule;
exports.extractScheduleConds = extractScheduleConds;
exports.getNextDate = getNextDate;
exports.getDateWithSkippedWeekend = getDateWithSkippedWeekend;
exports.getScheduledAmount = getScheduledAmount;
exports.describeSchedule = describeSchedule;
exports.getUpcomingDays = getUpcomingDays;
exports.scheduleIsRecurring = scheduleIsRecurring;
var d = require("date-fns");
var i18next_1 = require("i18next");
var rules_1 = require("../server/rules");
var monthUtils = require("./months");
var query_1 = require("./query");
function getStatus(nextDate, completed, hasTrans, upcomingLength) {
    if (upcomingLength === void 0) { upcomingLength = '7'; }
    var upcomingDays = getUpcomingDays(upcomingLength);
    var today = monthUtils.currentDay();
    if (completed) {
        return 'completed';
    }
    else if (hasTrans) {
        return 'paid';
    }
    else if (nextDate === today) {
        return 'due';
    }
    else if (nextDate > today &&
        nextDate <= monthUtils.addDays(today, upcomingDays)) {
        return 'upcoming';
    }
    else if (nextDate < today) {
        return 'missed';
    }
    else {
        return 'scheduled';
    }
}
function getStatusLabel(status) {
    switch (status) {
        case 'completed':
            return (0, i18next_1.t)('completed');
        case 'paid':
            return (0, i18next_1.t)('paid');
        case 'due':
            return (0, i18next_1.t)('due');
        case 'upcoming':
            return (0, i18next_1.t)('upcoming');
        case 'missed':
            return (0, i18next_1.t)('missed');
        case 'scheduled':
            return (0, i18next_1.t)('scheduled');
    }
}
function getHasTransactionsQuery(schedules) {
    var filters = schedules.map(function (schedule) {
        var dateCond = schedule._conditions.find(function (c) { return c.field === 'date'; });
        return {
            $and: {
                schedule: schedule.id,
                date: {
                    $gte: dateCond && dateCond.op === 'is'
                        ? schedule.next_date
                        : monthUtils.subDays(schedule.next_date, 2),
                },
            },
        };
    });
    return (0, query_1.q)('transactions')
        .options({ splits: 'all' })
        .filter({ $or: filters })
        .orderBy({ date: 'desc' })
        .select(['schedule', 'date']);
}
function makeNumberSuffix(num, locale) {
    // Slight abuse of date-fns to turn a number like "1" into the full
    // form "1st" but formatting a date with that number
    return monthUtils.format(new Date(2020, 0, num, 12), 'do', locale);
}
function prettyDayName(day) {
    var days = {
        SU: (0, i18next_1.t)('Sunday'),
        MO: (0, i18next_1.t)('Monday'),
        TU: (0, i18next_1.t)('Tuesday'),
        WE: (0, i18next_1.t)('Wednesday'),
        TH: (0, i18next_1.t)('Thursday'),
        FR: (0, i18next_1.t)('Friday'),
        SA: (0, i18next_1.t)('Saturday'),
    };
    return days[day];
}
function getRecurringDescription(config, dateFormat, locale) {
    var interval = config.interval || 1;
    var endModeSuffix = '';
    switch (config.endMode) {
        case 'after_n_occurrences':
            if (config.endOccurrences === 1) {
                endModeSuffix = (0, i18next_1.t)('once');
            }
            else {
                endModeSuffix = (0, i18next_1.t)('{{endOccurrences}} times', {
                    endOccurrences: config.endOccurrences,
                });
            }
            break;
        case 'on_date':
            endModeSuffix = (0, i18next_1.t)('until {{dateFormatted}}', {
                dateFormatted: monthUtils.format(config.endDate, dateFormat),
            });
            break;
        default:
    }
    var weekendSolveModeString = config.weekendSolveMode
        ? config.weekendSolveMode === 'after'
            ? (0, i18next_1.t)('(after weekend)')
            : (0, i18next_1.t)('(before weekend)')
        : '';
    var weekendSolveSuffix = config.skipWeekend ? weekendSolveModeString : '';
    var suffix = endModeSuffix
        ? ", ".concat(endModeSuffix, " ").concat(weekendSolveSuffix)
        : "".concat(weekendSolveSuffix);
    var desc = null;
    switch (config.frequency) {
        case 'daily':
            desc =
                interval !== 1
                    ? (0, i18next_1.t)("Every {{interval}} days", { interval: interval })
                    : (0, i18next_1.t)('Every day');
            break;
        case 'weekly':
            desc =
                interval !== 1
                    ? (0, i18next_1.t)("Every {{interval}} weeks on {{dateFormatted}}", {
                        interval: interval,
                        dateFormatted: monthUtils.format(config.start, 'EEEE', locale),
                    })
                    : (0, i18next_1.t)('Every week on {{dateFormatted}}', {
                        dateFormatted: monthUtils.format(config.start, 'EEEE', locale),
                    });
            break;
        case 'monthly':
            if (config.patterns && config.patterns.length > 0) {
                // Sort the days ascending. We filter out -1 because that
                // represents "last days" and should always be last, but this
                // sort would put them first
                var patterns = __spreadArray([], config.patterns, true).sort(function (p1, p2) {
                    var typeOrder = (p1.type === 'day' ? 1 : 0) - (p2.type === 'day' ? 1 : 0);
                    var valOrder = p1.value - p2.value;
                    if (typeOrder === 0) {
                        return valOrder;
                    }
                    return typeOrder;
                })
                    .filter(function (p) { return p.value !== -1; });
                // Add on all -1 values to the end
                patterns = patterns.concat(config.patterns.filter(function (p) { return p.value === -1; }));
                var strs = [];
                var uniqueDays = new Set(patterns.map(function (p) { return p.type; }));
                var isSameDay = uniqueDays.size === 1 && !uniqueDays.has('day');
                for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
                    var pattern = patterns_1[_i];
                    if (pattern.type === 'day') {
                        if (pattern.value === -1) {
                            strs.push((0, i18next_1.t)('last day'));
                        }
                        else {
                            // Example: 15th day
                            strs.push(makeNumberSuffix(pattern.value, locale));
                        }
                    }
                    else {
                        var dayName = isSameDay ? '' : ' ' + prettyDayName(pattern.type);
                        if (pattern.value === -1) {
                            // Example: last Monday
                            strs.push((0, i18next_1.t)('last') + dayName);
                        }
                        else {
                            // Example: 3rd Monday
                            strs.push(makeNumberSuffix(pattern.value, locale) + dayName);
                        }
                    }
                }
                var range = '';
                if (strs.length > 2) {
                    range += strs.slice(0, strs.length - 1).join(', ');
                    range += ", ".concat((0, i18next_1.t)('and'), " ");
                    range += strs[strs.length - 1];
                }
                else {
                    range += strs.join(" ".concat((0, i18next_1.t)('and'), " "));
                }
                if (isSameDay) {
                    range += ' ' + prettyDayName(patterns[0].type);
                }
                desc =
                    interval !== 1
                        ? (0, i18next_1.t)("Every {{interval}} months on the {{range}}", {
                            interval: interval,
                            range: range,
                        })
                        : (0, i18next_1.t)('Every month on the {{range}}', { range: range });
            }
            else {
                desc =
                    interval !== 1
                        ? (0, i18next_1.t)("Every {{interval}} months on the {{dateFormatted}}", {
                            interval: interval,
                            dateFormatted: monthUtils.format(config.start, 'do', locale),
                        })
                        : (0, i18next_1.t)('Every month on the {{dateFormatted}}', {
                            dateFormatted: monthUtils.format(config.start, 'do', locale),
                        });
            }
            break;
        case 'yearly':
            desc =
                interval !== 1
                    ? (0, i18next_1.t)("Every {{interval}} years on {{dateFormatted}}", {
                        interval: interval,
                        dateFormatted: monthUtils.format(config.start, 'LLL do', locale),
                    })
                    : (0, i18next_1.t)('Every year on {{dateFormatted}}', {
                        dateFormatted: monthUtils.format(config.start, 'LLL do', locale),
                    });
            break;
        default:
            return (0, i18next_1.t)('Recurring error');
    }
    return "".concat(desc).concat(suffix).trim();
}
function recurConfigToRSchedule(config) {
    var base = {
        start: monthUtils.parseDate(config.start),
        // @ts-ignore: issues with https://gitlab.com/john.carroll.p/rschedule/-/issues/86
        frequency: config.frequency.toUpperCase(),
        byHourOfDay: [12],
    };
    if (config.interval) {
        // @ts-ignore: issues with https://gitlab.com/john.carroll.p/rschedule/-/issues/86
        base.interval = config.interval;
    }
    switch (config.endMode) {
        case 'after_n_occurrences':
            base.count = config.endOccurrences;
            break;
        case 'on_date':
            base.end = monthUtils.parseDate(config.endDate);
            break;
        default:
    }
    var abbrevDay = function (name) { return name.slice(0, 2).toUpperCase(); };
    switch (config.frequency) {
        case 'daily':
            // Nothing to do
            return [base];
        case 'weekly':
            // Nothing to do
            return [base];
        case 'monthly':
            if (config.patterns && config.patterns.length > 0) {
                var days = config.patterns.filter(function (p) { return p.type === 'day'; });
                var dayNames = config.patterns.filter(function (p) { return p.type !== 'day'; });
                return [
                    days.length > 0 && __assign(__assign({}, base), { byDayOfMonth: days.map(function (p) { return p.value; }) }),
                    dayNames.length > 0 && __assign(__assign({}, base), { byDayOfWeek: dayNames.map(function (p) { return [abbrevDay(p.type), p.value]; }) }),
                ].filter(Boolean);
            }
            else {
                // Nothing to do
                return [base];
            }
        case 'yearly':
            return [base];
        default:
            throw new Error('Invalid recurring date config');
    }
}
function extractScheduleConds(conditions) {
    return {
        payee: conditions.find(function (cond) { return cond.op === 'is' && cond.field === 'payee'; }) ||
            conditions.find(function (cond) { return cond.op === 'is' && cond.field === 'description'; }) ||
            null,
        account: conditions.find(function (cond) { return cond.op === 'is' && cond.field === 'account'; }) ||
            conditions.find(function (cond) { return cond.op === 'is' && cond.field === 'acct'; }) ||
            null,
        amount: conditions.find(function (cond) {
            return (cond.op === 'is' ||
                cond.op === 'isapprox' ||
                cond.op === 'isbetween') &&
                cond.field === 'amount';
        }) || null,
        date: conditions.find(function (cond) {
            return (cond.op === 'is' || cond.op === 'isapprox') && cond.field === 'date';
        }) || null,
    };
}
function getNextDate(dateCond, start, noSkipWeekend) {
    if (start === void 0) { start = new Date(monthUtils.currentDay()); }
    if (noSkipWeekend === void 0) { noSkipWeekend = false; }
    start = d.startOfDay(start);
    var cond = new rules_1.Condition(dateCond.op, 'date', dateCond.value, null);
    var value = cond.getValue();
    if (value.type === 'date') {
        return value.date;
    }
    else if (value.type === 'recur') {
        var dates = value.schedule.occurrences({ start: start, take: 1 }).toArray();
        if (dates.length === 0) {
            // Could be a schedule with limited occurrences, so we try to
            // find the last occurrence
            dates = value.schedule.occurrences({ reverse: true, take: 1 }).toArray();
        }
        if (dates.length > 0) {
            var date = dates[0].date;
            if (value.schedule.data.skipWeekend && !noSkipWeekend) {
                date = getDateWithSkippedWeekend(date, value.schedule.data.weekendSolve);
            }
            return monthUtils.dayFromDate(date);
        }
    }
    return null;
}
function getDateWithSkippedWeekend(date, solveMode) {
    if (d.isWeekend(date)) {
        if (solveMode === 'after') {
            return d.nextMonday(date);
        }
        else if (solveMode === 'before') {
            return d.previousFriday(date);
        }
        else {
            throw new Error('Unknown weekend solve mode, this should not happen!');
        }
    }
    return date;
}
function getScheduledAmount(amount, inverse) {
    if (inverse === void 0) { inverse = false; }
    // this check is temporary, and required at the moment as a schedule rule
    // allows the amount condition to be deleted which causes a crash
    if (amount == null)
        return 0;
    if (typeof amount === 'number') {
        return inverse ? -amount : amount;
    }
    var avg = (amount.num1 + amount.num2) / 2;
    return inverse ? -Math.round(avg) : Math.round(avg);
}
function describeSchedule(schedule, payee) {
    if (payee) {
        return "".concat(payee.name, " (").concat(schedule.next_date, ")");
    }
    else {
        return "".concat((0, i18next_1.t)('Next:'), " ").concat(schedule.next_date);
    }
}
function getUpcomingDays(upcomingLength, today) {
    if (upcomingLength === void 0) { upcomingLength = '7'; }
    if (today === void 0) { today = monthUtils.currentDay(); }
    var month = monthUtils.getMonth(today);
    switch (upcomingLength) {
        case 'currentMonth': {
            var day = monthUtils.getDay(today);
            var end = monthUtils.getDay(monthUtils.getMonthEnd(today));
            return end - day;
        }
        case 'oneMonth': {
            return monthUtils.differenceInCalendarDays(monthUtils.nextMonth(month), month);
        }
        default:
            if (upcomingLength.includes('-')) {
                var _a = upcomingLength.split('-'), num = _a[0], unit = _a[1];
                var value = Math.max(1, parseInt(num, 10));
                switch (unit) {
                    case 'day':
                        return value;
                    case 'week':
                        return value * 7;
                    case 'month':
                        var future = monthUtils.addMonths(today, value);
                        return monthUtils.differenceInCalendarDays(future, month) + 1;
                    case 'year':
                        var futureYear = monthUtils.addYears(today, value);
                        return monthUtils.differenceInCalendarDays(futureYear, month) + 1;
                    default:
                        return 7;
                }
            }
            return parseInt(upcomingLength, 10);
    }
}
function scheduleIsRecurring(dateCond) {
    if (!dateCond) {
        return false;
    }
    var cond = new rules_1.Condition(dateCond.op, 'date', dateCond.value, null);
    var value = cond.getValue();
    return value.type === 'recur';
}
