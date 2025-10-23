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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSchedule = runSchedule;
// @ts-strict-ignore
const monthUtils = __importStar(require("../../shared/months"));
const schedules_1 = require("../../shared/schedules");
const db = __importStar(require("../db"));
const app_1 = require("../schedules/app");
const actions_1 = require("./actions");
async function createScheduleList(templates, current_month, category) {
    const t = [];
    const errors = [];
    for (const template of templates) {
        const { id: sid, completed } = await db.first('SELECT id, completed FROM schedules WHERE TRIM(name) = ? AND tombstone = 0', [template.name]);
        const rule = await (0, app_1.getRuleForSchedule)(sid);
        const conditions = rule.serialize().conditions;
        const { date: dateConditions, amount: amountCondition } = (0, schedules_1.extractScheduleConds)(conditions);
        let scheduleAmount = amountCondition.op === 'isbetween'
            ? Math.round(amountCondition.value.num1 + amountCondition.value.num2) /
                2
            : amountCondition.value;
        // Apply adjustment percentage if specified
        if (template.adjustment) {
            const adjustmentFactor = 1 + template.adjustment / 100;
            scheduleAmount = Math.round(scheduleAmount * adjustmentFactor);
        }
        const { amount: postRuleAmount, subtransactions } = rule.execActions({
            amount: scheduleAmount,
            category: category.id,
            subtransactions: [],
        });
        const categorySubtransactions = subtransactions?.filter(t => t.category === category.id);
        // Unless the current category is relevant to the schedule, target the post-rule amount.
        const sign = category.is_income ? 1 : -1;
        const target = sign *
            (categorySubtransactions?.length
                ? categorySubtransactions.reduce((acc, t) => acc + t.amount, 0)
                : (postRuleAmount ?? scheduleAmount));
        const next_date_string = (0, schedules_1.getNextDate)(dateConditions, monthUtils._parse(current_month));
        const target_interval = dateConditions.value.interval
            ? dateConditions.value.interval
            : 1;
        const target_frequency = dateConditions.value.frequency;
        const isRepeating = Object(dateConditions.value) === dateConditions.value &&
            'frequency' in dateConditions.value;
        const num_months = monthUtils.differenceInCalendarMonths(next_date_string, current_month);
        if (num_months < 0) {
            //non-repeating schedules could be negative
            errors.push(`Schedule ${template.name} is in the Past.`);
        }
        else {
            t.push({
                target,
                next_date_string,
                target_interval,
                target_frequency,
                num_months,
                completed,
                //started,
                full: template.full === null ? false : template.full,
                repeat: isRepeating,
                name: template.name,
            });
            if (!completed) {
                if (isRepeating) {
                    let monthlyTarget = 0;
                    const nextMonth = monthUtils.addMonths(current_month, t[t.length - 1].num_months + 1);
                    let nextBaseDate = (0, schedules_1.getNextDate)(dateConditions, monthUtils._parse(current_month), true);
                    let nextDate = dateConditions.value.skipWeekend
                        ? monthUtils.dayFromDate((0, schedules_1.getDateWithSkippedWeekend)(monthUtils._parse(nextBaseDate), dateConditions.value.weekendSolveMode))
                        : nextBaseDate;
                    while (nextDate < nextMonth) {
                        monthlyTarget += -target;
                        const currentDate = nextBaseDate;
                        const oneDayLater = monthUtils.addDays(nextBaseDate, 1);
                        nextBaseDate = (0, schedules_1.getNextDate)(dateConditions, monthUtils._parse(oneDayLater), true);
                        nextDate = dateConditions.value.skipWeekend
                            ? monthUtils.dayFromDate((0, schedules_1.getDateWithSkippedWeekend)(monthUtils._parse(nextBaseDate), dateConditions.value.weekendSolveMode))
                            : nextBaseDate;
                        const diffDays = monthUtils.differenceInCalendarDays(nextBaseDate, currentDate);
                        if (!diffDays) {
                            // This can happen if the schedule has an end condition.
                            break;
                        }
                    }
                    t[t.length - 1].target = -monthlyTarget;
                }
            }
            else {
                errors.push(`Schedule ${template.name} is not active during the month in question.`);
            }
        }
    }
    return { t: t.filter(c => c.completed === 0), errors };
}
function getPayMonthOfTotal(t) {
    //return the contribution amounts of full or every month type schedules
    let total = 0;
    const schedules = t.filter(c => c.num_months === 0);
    for (const schedule of schedules) {
        total += schedule.target;
    }
    return total;
}
async function getSinkingContributionTotal(t, remainder, last_month_balance) {
    //return the contribution amount if there is a balance carried in the category
    let total = 0;
    for (const [index, schedule] of t.entries()) {
        remainder =
            index === 0
                ? schedule.target - last_month_balance
                : schedule.target - remainder;
        let tg = 0;
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
    return total;
}
function getSinkingBaseContributionTotal(t) {
    //return only the base contribution of each schedule
    let total = 0;
    for (const schedule of t) {
        let monthlyAmount = 0;
        let prevDate;
        let intervalMonths;
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
    let total = 0;
    for (const schedule of t) {
        total += schedule.target;
    }
    return total;
}
async function runSchedule(template_lines, current_month, balance, remainder, last_month_balance, to_budget, errors, category) {
    const scheduleTemplates = template_lines.filter(t => t.type === 'schedule');
    const t = await createScheduleList(scheduleTemplates, current_month, category);
    errors = errors.concat(t.errors);
    const isPayMonthOf = c => c.full ||
        (c.target_frequency === 'monthly' &&
            c.target_interval === 1 &&
            c.num_months === 0) ||
        (c.target_frequency === 'weekly' && c.target_interval <= 4) ||
        (c.target_frequency === 'daily' && c.target_interval <= 31) ||
        (0, actions_1.isReflectBudget)();
    const t_payMonthOf = t.t.filter(isPayMonthOf);
    const t_sinking = t.t
        .filter(c => !isPayMonthOf(c))
        .sort((a, b) => a.next_date_string.localeCompare(b.next_date_string));
    const totalPayMonthOf = getPayMonthOfTotal(t_payMonthOf);
    const totalSinking = getSinkingTotal(t_sinking);
    const totalSinkingBaseContribution = getSinkingBaseContributionTotal(t_sinking);
    if (balance >= totalSinking + totalPayMonthOf) {
        to_budget += Math.round(totalPayMonthOf + totalSinkingBaseContribution);
    }
    else {
        const totalSinkingContribution = await getSinkingContributionTotal(t_sinking, remainder, last_month_balance);
        if (t_sinking.length === 0) {
            to_budget +=
                Math.round(totalPayMonthOf + totalSinkingContribution) -
                    last_month_balance;
        }
        else {
            to_budget += Math.round(totalPayMonthOf + totalSinkingContribution);
        }
    }
    return { to_budget, errors, remainder };
}
//# sourceMappingURL=schedule-template.js.map