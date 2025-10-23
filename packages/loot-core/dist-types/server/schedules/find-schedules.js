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
exports.findSchedules = findSchedules;
// @ts-strict-ignore
const d = __importStar(require("date-fns"));
const uuid_1 = require("uuid");
const months_1 = require("../../shared/months");
const query_1 = require("../../shared/query");
const rules_1 = require("../../shared/rules");
const schedules_1 = require("../../shared/schedules");
const util_1 = require("../../shared/util");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const models_1 = require("../models");
const transaction_rules_1 = require("../transactions/transaction-rules");
const rschedule_1 = require("../util/rschedule");
function takeDates(config) {
    const schedule = new rschedule_1.RSchedule({ rrules: (0, schedules_1.recurConfigToRSchedule)(config) });
    return schedule
        .occurrences({ take: 3 })
        .toArray()
        .map(d => d.date);
}
async function getTransactions(date, account) {
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
        .filter({
        account,
        schedule: null,
        // Don't match transfers
        'payee.transfer_acct': null,
        $and: [
            { date: { $gte: d.subDays(date, 2) } },
            { date: { $lte: d.addDays(date, 2) } },
        ],
    })
        .select('*')
        .options({ splits: 'none' }));
    return data;
}
function getRank(day1, day2) {
    const dayDiff = Math.abs(d.differenceInDays((0, months_1.parseDate)(day1), (0, months_1.parseDate)(day2)));
    // The amount of days off determines the rank: exact same day
    // is highest rank 1, 1 day off is .5, etc. This will find the
    // best start date that matches all the dates the closest
    return 1 / (dayDiff + 1);
}
function matchSchedules(allOccurs, config) {
    allOccurs = [...allOccurs].reverse();
    const baseOccur = allOccurs[0];
    const occurs = allOccurs.slice(1);
    const schedules = [];
    for (const trans of baseOccur.transactions) {
        const threshold = (0, rules_1.getApproxNumberThreshold)(trans.amount);
        const payee = trans.payee;
        const found = occurs.map(occur => {
            let matched = occur.transactions.find(t => t.amount >= trans.amount - threshold &&
                t.amount <= trans.amount + threshold);
            matched = matched && matched.payee === payee ? matched : null;
            if (matched) {
                return { trans: matched, rank: getRank(occur.date, matched.date) };
            }
            return null;
        });
        if (found.indexOf(null) !== -1) {
            continue;
        }
        const rank = found.reduce((total, match) => total + match.rank, getRank(baseOccur.date, trans.date));
        const exactAmount = found.reduce((exact, match) => exact && match.trans.amount === trans.amount, true);
        schedules.push({
            rank,
            amount: trans.amount,
            account: trans.account,
            payee: trans.payee,
            date: config,
            // Exact dates rank as 1, so all of them matches exactly it
            // would equal the number of `allOccurs`
            exactDate: rank === allOccurs.length,
            exactAmount,
        });
    }
    return schedules;
}
async function schedulesForPattern(baseStart, numDays, baseConfig, accountId) {
    let schedules = [];
    for (let i = 0; i < numDays; i++) {
        const start = d.addDays(baseStart, i);
        let config;
        if (typeof baseConfig === 'function') {
            config = baseConfig(start);
            if (config === false) {
                // Skip this one
                continue;
            }
        }
        else {
            config = { ...baseConfig, start };
        }
        // Our recur config expects a day string, not a native date format
        config.start = (0, months_1.dayFromDate)(config.start);
        const data = [];
        const dates = takeDates(config);
        for (const date of dates) {
            data.push({
                date: (0, months_1.dayFromDate)(date),
                transactions: await getTransactions(date, accountId),
            });
        }
        schedules = schedules.concat(matchSchedules(data, config));
    }
    return schedules;
}
async function weekly(startDate, accountId) {
    return schedulesForPattern(d.subWeeks((0, months_1.parseDate)(startDate), 4), 7 * 2, { frequency: 'weekly' }, accountId);
}
async function every2weeks(startDate, accountId) {
    return schedulesForPattern(
    // 6 weeks would cover 3 instances, but we also scan an addition
    // week back
    d.subWeeks((0, months_1.parseDate)(startDate), 7), 7 * 2, { frequency: 'weekly', interval: 2 }, accountId);
}
async function monthly(startDate, accountId) {
    return schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 4), 31 * 2, start => {
        // 28 is the max number of days that all months are guaranteed
        // to have. We don't want to go any higher than that because
        // we'll end up skipping months that don't have that day.
        // The use cases of end of month days will be covered with the
        // `monthlyLastDay` pattern;
        if (d.getDate(start) > 28) {
            return false;
        }
        return { start, frequency: 'monthly' };
    }, accountId);
}
async function monthlyLastDay(startDate, accountId) {
    // We do two separate calls because this pattern doesn't fit into
    // how `schedulesForPattern` works
    const s1 = await schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 3), 1, { frequency: 'monthly', patterns: [{ type: 'day', value: -1 }] }, accountId);
    const s2 = await schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 4), 1, { frequency: 'monthly', patterns: [{ type: 'day', value: -1 }] }, accountId);
    return s1.concat(s2);
}
async function monthly1stor3rd(startDate, accountId) {
    return schedulesForPattern(d.subWeeks((0, months_1.parseDate)(startDate), 8), 14, start => {
        const day = d.format(new Date(), 'iiii');
        const dayValue = day.slice(0, 2).toUpperCase();
        return {
            start,
            frequency: 'monthly',
            patterns: [
                { type: dayValue, value: 1 },
                { type: dayValue, value: 3 },
            ],
        };
    }, accountId);
}
async function monthly2ndor4th(startDate, accountId) {
    return schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 8), 14, start => {
        const day = d.format(new Date(), 'iiii');
        const dayValue = day.slice(0, 2).toUpperCase();
        return {
            start,
            frequency: 'monthly',
            patterns: [
                { type: dayValue, value: 2 },
                { type: dayValue, value: 4 },
            ],
        };
    }, accountId);
}
async function findStartDate(schedule) {
    const conditions = schedule._conditions;
    const dateCond = conditions.find(c => c.field === 'date');
    let currentConfig = dateCond.value;
    while (1) {
        const prevConfig = currentConfig;
        currentConfig = { ...prevConfig };
        switch (currentConfig.frequency) {
            case 'weekly':
                currentConfig.start = (0, months_1.dayFromDate)(d.subWeeks((0, months_1.parseDate)(currentConfig.start), currentConfig.interval || 1));
                break;
            case 'monthly':
                currentConfig.start = (0, months_1.dayFromDate)(d.subMonths((0, months_1.parseDate)(currentConfig.start), currentConfig.interval || 1));
                break;
            case 'yearly':
                currentConfig.start = (0, months_1.dayFromDate)(d.subYears((0, months_1.parseDate)(currentConfig.start), currentConfig.interval || 1));
                break;
            default:
                throw new Error('findStartDate: invalid frequency');
        }
        const newConditions = conditions.map(c => c.field === 'date' ? { ...c, value: currentConfig } : c);
        const { filters, errors } = (0, transaction_rules_1.conditionsToAQL)(newConditions, {
            recurDateBounds: 1,
        });
        if (errors.length > 0) {
            // Somehow we generated an invalid config. Abort the whole
            // process and don't change the date at all
            currentConfig = null;
            break;
        }
        const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ $and: filters }).select('*'));
        if (data.length === 0) {
            // No data, revert back to the last valid value and stop
            currentConfig = prevConfig;
            break;
        }
    }
    if (currentConfig) {
        return {
            ...schedule,
            date: currentConfig,
            _conditions: conditions.map(c => c.field === 'date' ? { ...c, value: currentConfig } : c),
        };
    }
    return schedule;
}
async function findSchedules() {
    // Patterns to look for:
    // * Weekly
    // * Every two weeks
    // * Monthly on day X
    // * Monthly on every 1st or 3rd day
    // * Monthly on every 2nd or 4th day
    //
    // Search for them approx (+- 2 days) but track which transactions
    // and find the best one...
    const { data: accounts } = await (0, aql_1.aqlQuery)((0, query_1.q)('accounts').filter({ closed: false }).select('*'));
    let allSchedules = [];
    for (const account of accounts) {
        // Find latest transaction-ish to start with
        const latestTrans = await db.first('SELECT date FROM v_transactions WHERE account = ? AND parent_id IS NULL ORDER BY date DESC LIMIT 1', [account.id]);
        if (latestTrans) {
            const latestDate = (0, models_1.fromDateRepr)(latestTrans.date);
            allSchedules = allSchedules.concat(await weekly(latestDate, account.id), await every2weeks(latestDate, account.id), await monthly(latestDate, account.id), await monthlyLastDay(latestDate, account.id), await monthly1stor3rd(latestDate, account.id), await monthly2ndor4th(latestDate, account.id));
        }
    }
    const schedules = [...(0, util_1.groupBy)(allSchedules, 'payee').entries()].map(([, schedules]) => {
        schedules.sort((s1, s2) => s2.rank - s1.rank);
        const winner = schedules[0];
        // Convert to schedule and return it
        return {
            id: (0, uuid_1.v4)(),
            account: winner.account,
            payee: winner.payee,
            date: winner.date,
            amount: winner.amount,
            _conditions: [
                { op: 'is', field: 'account', value: winner.account },
                { op: 'is', field: 'payee', value: winner.payee },
                {
                    op: winner.exactDate ? 'is' : 'isapprox',
                    field: 'date',
                    value: winner.date,
                },
                {
                    op: winner.exactAmount ? 'is' : 'isapprox',
                    field: 'amount',
                    value: winner.amount,
                },
            ],
        };
    });
    const finalized = [];
    for (const schedule of schedules) {
        finalized.push(await findStartDate(schedule));
    }
    return finalized;
}
//# sourceMappingURL=find-schedules.js.map