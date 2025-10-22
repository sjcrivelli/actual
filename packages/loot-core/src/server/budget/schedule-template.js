"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSchedule = runSchedule;
// @ts-strict-ignore
var monthUtils = require("../../shared/months");
var schedules_1 = require("../../shared/schedules");
var db = require("../db");
var app_1 = require("../schedules/app");
var actions_1 = require("./actions");
function createScheduleList(templates, current_month, category) {
    return __awaiter(this, void 0, void 0, function () {
        var t, errors, _i, templates_1, template, _a, sid, completed, rule, conditions, _b, dateConditions, amountCondition, scheduleAmount, adjustmentFactor, _c, postRuleAmount, subtransactions, categorySubtransactions, sign, target, next_date_string, target_interval, target_frequency, isRepeating, num_months, monthlyTarget, nextMonth, nextBaseDate, nextDate, currentDate, oneDayLater, diffDays;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    t = [];
                    errors = [];
                    _i = 0, templates_1 = templates;
                    _d.label = 1;
                case 1:
                    if (!(_i < templates_1.length)) return [3 /*break*/, 5];
                    template = templates_1[_i];
                    return [4 /*yield*/, db.first('SELECT id, completed FROM schedules WHERE TRIM(name) = ? AND tombstone = 0', [template.name])];
                case 2:
                    _a = _d.sent(), sid = _a.id, completed = _a.completed;
                    return [4 /*yield*/, (0, app_1.getRuleForSchedule)(sid)];
                case 3:
                    rule = _d.sent();
                    conditions = rule.serialize().conditions;
                    _b = (0, schedules_1.extractScheduleConds)(conditions), dateConditions = _b.date, amountCondition = _b.amount;
                    scheduleAmount = amountCondition.op === 'isbetween'
                        ? Math.round(amountCondition.value.num1 + amountCondition.value.num2) /
                            2
                        : amountCondition.value;
                    // Apply adjustment percentage if specified
                    if (template.adjustment) {
                        adjustmentFactor = 1 + template.adjustment / 100;
                        scheduleAmount = Math.round(scheduleAmount * adjustmentFactor);
                    }
                    _c = rule.execActions({
                        amount: scheduleAmount,
                        category: category.id,
                        subtransactions: [],
                    }), postRuleAmount = _c.amount, subtransactions = _c.subtransactions;
                    categorySubtransactions = subtransactions === null || subtransactions === void 0 ? void 0 : subtransactions.filter(function (t) { return t.category === category.id; });
                    sign = category.is_income ? 1 : -1;
                    target = sign *
                        ((categorySubtransactions === null || categorySubtransactions === void 0 ? void 0 : categorySubtransactions.length)
                            ? categorySubtransactions.reduce(function (acc, t) { return acc + t.amount; }, 0)
                            : (postRuleAmount !== null && postRuleAmount !== void 0 ? postRuleAmount : scheduleAmount));
                    next_date_string = (0, schedules_1.getNextDate)(dateConditions, monthUtils._parse(current_month));
                    target_interval = dateConditions.value.interval
                        ? dateConditions.value.interval
                        : 1;
                    target_frequency = dateConditions.value.frequency;
                    isRepeating = Object(dateConditions.value) === dateConditions.value &&
                        'frequency' in dateConditions.value;
                    num_months = monthUtils.differenceInCalendarMonths(next_date_string, current_month);
                    if (num_months < 0) {
                        //non-repeating schedules could be negative
                        errors.push("Schedule ".concat(template.name, " is in the Past."));
                    }
                    else {
                        t.push({
                            target: target,
                            next_date_string: next_date_string,
                            target_interval: target_interval,
                            target_frequency: target_frequency,
                            num_months: num_months,
                            completed: completed,
                            //started,
                            full: template.full === null ? false : template.full,
                            repeat: isRepeating,
                            name: template.name,
                        });
                        if (!completed) {
                            if (isRepeating) {
                                monthlyTarget = 0;
                                nextMonth = monthUtils.addMonths(current_month, t[t.length - 1].num_months + 1);
                                nextBaseDate = (0, schedules_1.getNextDate)(dateConditions, monthUtils._parse(current_month), true);
                                nextDate = dateConditions.value.skipWeekend
                                    ? monthUtils.dayFromDate((0, schedules_1.getDateWithSkippedWeekend)(monthUtils._parse(nextBaseDate), dateConditions.value.weekendSolveMode))
                                    : nextBaseDate;
                                while (nextDate < nextMonth) {
                                    monthlyTarget += -target;
                                    currentDate = nextBaseDate;
                                    oneDayLater = monthUtils.addDays(nextBaseDate, 1);
                                    nextBaseDate = (0, schedules_1.getNextDate)(dateConditions, monthUtils._parse(oneDayLater), true);
                                    nextDate = dateConditions.value.skipWeekend
                                        ? monthUtils.dayFromDate((0, schedules_1.getDateWithSkippedWeekend)(monthUtils._parse(nextBaseDate), dateConditions.value.weekendSolveMode))
                                        : nextBaseDate;
                                    diffDays = monthUtils.differenceInCalendarDays(nextBaseDate, currentDate);
                                    if (!diffDays) {
                                        // This can happen if the schedule has an end condition.
                                        break;
                                    }
                                }
                                t[t.length - 1].target = -monthlyTarget;
                            }
                        }
                        else {
                            errors.push("Schedule ".concat(template.name, " is not active during the month in question."));
                        }
                    }
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, { t: t.filter(function (c) { return c.completed === 0; }), errors: errors }];
            }
        });
    });
}
function getPayMonthOfTotal(t) {
    //return the contribution amounts of full or every month type schedules
    var total = 0;
    var schedules = t.filter(function (c) { return c.num_months === 0; });
    for (var _i = 0, schedules_2 = schedules; _i < schedules_2.length; _i++) {
        var schedule = schedules_2[_i];
        total += schedule.target;
    }
    return total;
}
function getSinkingContributionTotal(t, remainder, last_month_balance) {
    return __awaiter(this, void 0, void 0, function () {
        var total, _i, _a, _b, index, schedule, tg;
        return __generator(this, function (_c) {
            total = 0;
            for (_i = 0, _a = t.entries(); _i < _a.length; _i++) {
                _b = _a[_i], index = _b[0], schedule = _b[1];
                remainder =
                    index === 0
                        ? schedule.target - last_month_balance
                        : schedule.target - remainder;
                tg = 0;
                if (remainder >= 0) {
                    tg = remainder;
                    remainder = 0;
                }
                else {
                    tg = 0;
                    remainder = Math.abs(remainder);
                }
                total += tg / (schedule.num_months + 1);
            }
            return [2 /*return*/, total];
        });
    });
}
function getSinkingBaseContributionTotal(t) {
    //return only the base contribution of each schedule
    var total = 0;
    for (var _i = 0, t_1 = t; _i < t_1.length; _i++) {
        var schedule = t_1[_i];
        var monthlyAmount = 0;
        var prevDate = void 0;
        var intervalMonths = void 0;
        switch (schedule.target_frequency) {
            case 'yearly':
                monthlyAmount = schedule.target / schedule.target_interval / 12;
                break;
            case 'monthly':
                monthlyAmount = schedule.target / schedule.target_interval;
                break;
            case 'weekly':
                prevDate = monthUtils.subWeeks(schedule.next_date_string, schedule.target_interval);
                intervalMonths = monthUtils.differenceInCalendarMonths(schedule.next_date_string, prevDate);
                // shouldn't be possible, but better check
                if (intervalMonths === 0)
                    intervalMonths = 1;
                monthlyAmount = schedule.target / intervalMonths;
                break;
            case 'daily':
                prevDate = monthUtils.subDays(schedule.next_date_string, schedule.target_interval);
                intervalMonths = monthUtils.differenceInCalendarMonths(schedule.next_date_string, prevDate);
                // shouldn't be possible, but better check
                if (intervalMonths === 0)
                    intervalMonths = 1;
                monthlyAmount = schedule.target / intervalMonths;
                break;
        }
        total += monthlyAmount;
    }
    return total;
}
function getSinkingTotal(t) {
    //sum the total of all upcoming schedules
    var total = 0;
    for (var _i = 0, t_2 = t; _i < t_2.length; _i++) {
        var schedule = t_2[_i];
        total += schedule.target;
    }
    return total;
}
function runSchedule(template_lines, current_month, balance, remainder, last_month_balance, to_budget, errors, category) {
    return __awaiter(this, void 0, void 0, function () {
        var scheduleTemplates, t, isPayMonthOf, t_payMonthOf, t_sinking, totalPayMonthOf, totalSinking, totalSinkingBaseContribution, totalSinkingContribution;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    scheduleTemplates = template_lines.filter(function (t) { return t.type === 'schedule'; });
                    return [4 /*yield*/, createScheduleList(scheduleTemplates, current_month, category)];
                case 1:
                    t = _a.sent();
                    errors = errors.concat(t.errors);
                    isPayMonthOf = function (c) {
                        return c.full ||
                            (c.target_frequency === 'monthly' &&
                                c.target_interval === 1 &&
                                c.num_months === 0) ||
                            (c.target_frequency === 'weekly' && c.target_interval <= 4) ||
                            (c.target_frequency === 'daily' && c.target_interval <= 31) ||
                            (0, actions_1.isReflectBudget)();
                    };
                    t_payMonthOf = t.t.filter(isPayMonthOf);
                    t_sinking = t.t
                        .filter(function (c) { return !isPayMonthOf(c); })
                        .sort(function (a, b) { return a.next_date_string.localeCompare(b.next_date_string); });
                    totalPayMonthOf = getPayMonthOfTotal(t_payMonthOf);
                    totalSinking = getSinkingTotal(t_sinking);
                    totalSinkingBaseContribution = getSinkingBaseContributionTotal(t_sinking);
                    if (!(balance >= totalSinking + totalPayMonthOf)) return [3 /*break*/, 2];
                    to_budget += Math.round(totalPayMonthOf + totalSinkingBaseContribution);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getSinkingContributionTotal(t_sinking, remainder, last_month_balance)];
                case 3:
                    totalSinkingContribution = _a.sent();
                    if (t_sinking.length === 0) {
                        to_budget +=
                            Math.round(totalPayMonthOf + totalSinkingContribution) -
                                last_month_balance;
                    }
                    else {
                        to_budget += Math.round(totalPayMonthOf + totalSinkingContribution);
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, { to_budget: to_budget, errors: errors, remainder: remainder }];
            }
        });
    });
}
