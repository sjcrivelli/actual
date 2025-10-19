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
exports.app = void 0;
exports.updateConditions = updateConditions;
exports.getRuleForSchedule = getRuleForSchedule;
exports.setNextDate = setNextDate;
exports.createSchedule = createSchedule;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
// @ts-strict-ignore
const d = __importStar(require("date-fns"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const uuid_1 = require("uuid");
const exceptions_1 = require("../../platform/exceptions");
const connection = __importStar(require("../../platform/server/connection"));
const log_1 = require("../../platform/server/log");
const months_1 = require("../../shared/months");
const query_1 = require("../../shared/query");
const schedules_1 = require("../../shared/schedules");
const sync_1 = require("../accounts/sync");
const app_1 = require("../app");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const models_1 = require("../models");
const mutators_1 = require("../mutators");
const prefs = __importStar(require("../prefs"));
const rules_1 = require("../rules");
const sync_2 = require("../sync");
const transaction_rules_1 = require("../transactions/transaction-rules");
const undo_1 = require("../undo");
const rschedule_1 = require("../util/rschedule");
const find_schedules_1 = require("./find-schedules");
// Utilities
function zip(arr1, arr2) {
    const result = [];
    for (let i = 0; i < arr1.length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
}
function updateConditions(conditions, newConditions) {
    const scheduleConds = (0, schedules_1.extractScheduleConds)(conditions);
    const newScheduleConds = (0, schedules_1.extractScheduleConds)(newConditions);
    const replacements = zip(Object.values(scheduleConds), Object.values(newScheduleConds));
    const updated = conditions.map(cond => {
        const r = replacements.find(r => cond === r[0]);
        return r && r[1] ? r[1] : cond;
    });
    const added = replacements
        .filter(x => x[0] == null && x[1] != null)
        .map(x => x[1]);
    return updated.concat(added);
}
async function getRuleForSchedule(id) {
    if (id == null) {
        throw new Error('Schedule not attached to a rule');
    }
    const { data: ruleId } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).calculate('rule'));
    return (0, transaction_rules_1.getRules)().find(rule => rule.id === ruleId);
}
async function fixRuleForSchedule(id) {
    const { data: ruleId } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).calculate('rule'));
    if (ruleId) {
        // Take the bad rule out of the system so it never causes problems
        // in the future
        await db.delete_('rules', ruleId);
    }
    const newId = await (0, transaction_rules_1.insertRule)({
        stage: null,
        conditionsOp: 'and',
        conditions: [
            { op: 'isapprox', field: 'date', value: (0, months_1.currentDay)() },
            { op: 'isapprox', field: 'amount', value: 0 },
        ],
        actions: [{ op: 'link-schedule', value: id }],
    });
    await db.updateWithSchema('schedules', { id, rule: newId });
    return (0, transaction_rules_1.getRules)().find(rule => rule.id === newId);
}
async function setNextDate({ id, start, conditions, reset, }) {
    if (conditions == null) {
        const rule = await getRuleForSchedule(id);
        if (rule == null) {
            throw new Error('No rule found for schedule');
        }
        conditions = rule.serialize().conditions;
    }
    const { date: dateCond } = (0, schedules_1.extractScheduleConds)(conditions);
    const { data: nextDate } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).calculate('next_date'));
    // Only do this if a date condition exists
    if (dateCond) {
        const newNextDate = (0, schedules_1.getNextDate)(dateCond, start ? start(nextDate) : new Date());
        if (newNextDate !== nextDate) {
            // Our `update` functon requires the id of the item and we don't
            // have it, so we need to query it
            const nd = await db.first('SELECT id, base_next_date_ts FROM schedules_next_date WHERE schedule_id = ?', [id]);
            await db.update('schedules_next_date', reset
                ? {
                    id: nd.id,
                    base_next_date: (0, models_1.toDateRepr)(newNextDate),
                    base_next_date_ts: Date.now(),
                }
                : {
                    id: nd.id,
                    local_next_date: (0, models_1.toDateRepr)(newNextDate),
                    local_next_date_ts: nd.base_next_date_ts,
                });
        }
    }
}
// Methods
async function checkIfScheduleExists(name, scheduleId) {
    const idForName = await db.first('SELECT id from schedules WHERE tombstone = 0 AND name = ?', [name]);
    if (idForName == null) {
        return false;
    }
    if (scheduleId) {
        return idForName['id'] !== scheduleId;
    }
    return true;
}
async function createSchedule({ schedule = null, conditions = [], } = {}) {
    const scheduleId = schedule?.id || (0, uuid_1.v4)();
    const { date: dateCond } = (0, schedules_1.extractScheduleConds)(conditions);
    if (dateCond == null) {
        throw new Error('A date condition is required to create a schedule');
    }
    if (dateCond.value == null) {
        throw new Error('Date is required');
    }
    const nextDate = (0, schedules_1.getNextDate)(dateCond);
    const nextDateRepr = nextDate ? (0, models_1.toDateRepr)(nextDate) : null;
    if (schedule) {
        if (schedule.name) {
            if (await checkIfScheduleExists(schedule.name, scheduleId)) {
                throw new Error('Cannot create schedules with the same name');
            }
        }
        else {
            schedule.name = null;
        }
    }
    // Create the rule here based on the info
    const ruleId = await (0, transaction_rules_1.insertRule)({
        stage: null,
        conditionsOp: 'and',
        conditions,
        actions: [{ op: 'link-schedule', value: scheduleId }],
    });
    const now = Date.now();
    await db.insertWithUUID('schedules_next_date', {
        schedule_id: scheduleId,
        local_next_date: nextDateRepr,
        local_next_date_ts: now,
        base_next_date: nextDateRepr,
        base_next_date_ts: now,
    });
    await db.insertWithSchema('schedules', {
        ...schedule,
        id: scheduleId,
        rule: ruleId,
    });
    return scheduleId;
}
// TODO: don't allow deleting rules that link schedules
async function updateSchedule({ schedule, conditions, resetNextDate, }) {
    if (schedule.rule) {
        throw new Error('You cannot change the rule of a schedule');
    }
    let rule;
    // This must be outside the `batchMessages` call because we change
    // and then read data
    if (conditions) {
        const { date: dateCond } = (0, schedules_1.extractScheduleConds)(conditions);
        if (dateCond && dateCond.value == null) {
            throw new Error('Date is required');
        }
        // We need to get the full rule to merge in the updated
        // conditions
        rule = await getRuleForSchedule(schedule.id);
        if (rule == null) {
            // In the edge case that a rule gets corrupted (either by a bug in
            // the system or user messing with their data), don't crash. We
            // generate a new rule because schedules have to have a rule
            // attached to them.
            rule = await fixRuleForSchedule(schedule.id);
        }
    }
    await (0, sync_2.batchMessages)(async () => {
        if (conditions) {
            const oldConditions = rule.serialize().conditions;
            const newConditions = updateConditions(oldConditions, conditions);
            await (0, transaction_rules_1.updateRule)({ id: rule.id, conditions: newConditions });
            // Annoyingly, sometimes it has `type` and sometimes it doesn't
            const stripType = ({ type, ...fields }) => fields;
            // Update `next_date` if the user forced it, or if the account
            // or date changed. We check account because we don't update
            // schedules automatically for closed account, and the user
            // might switch accounts from a closed one
            if (resetNextDate ||
                !(0, deep_equal_1.default)(oldConditions.find(c => c.field === 'account'), oldConditions.find(c => c.field === 'account')) ||
                !(0, deep_equal_1.default)(stripType(oldConditions.find(c => c.field === 'date') || {}), stripType(newConditions.find(c => c.field === 'date') || {}))) {
                await setNextDate({
                    id: schedule.id,
                    conditions: newConditions,
                    reset: true,
                });
            }
        }
        else if (resetNextDate) {
            await setNextDate({ id: schedule.id, reset: true });
        }
        await db.updateWithSchema('schedules', schedule);
    });
    return schedule.id;
}
async function deleteSchedule({ id }) {
    const { data: ruleId } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).calculate('rule'));
    await (0, sync_2.batchMessages)(async () => {
        await db.delete_('rules', ruleId);
        await db.delete_('schedules', id);
    });
}
async function skipNextDate({ id }) {
    return setNextDate({
        id,
        start: nextDate => {
            return d.addDays((0, months_1.parseDate)(nextDate), 1);
        },
    });
}
function discoverSchedules() {
    return (0, find_schedules_1.findSchedules)();
}
async function getUpcomingDates({ config, count }) {
    const rules = (0, schedules_1.recurConfigToRSchedule)(config);
    try {
        const schedule = new rschedule_1.RSchedule({ rrules: rules });
        return schedule
            .occurrences({ start: d.startOfDay(new Date()), take: count })
            .toArray()
            .map(date => config.skipWeekend
            ? (0, schedules_1.getDateWithSkippedWeekend)(date.date, config.weekendSolveMode)
            : date.date)
            .map(date => (0, months_1.dayFromDate)(date));
    }
    catch (err) {
        (0, exceptions_1.captureBreadcrumb)(config);
        throw err;
    }
}
// Services
function onRuleUpdate(rule) {
    const { actions, conditions } = rule instanceof rules_1.Rule ? rule.serialize() : transaction_rules_1.ruleModel.toJS(rule);
    if (actions && actions.find(a => a.op === 'link-schedule')) {
        const scheduleId = actions.find(a => a.op === 'link-schedule').value;
        if (scheduleId) {
            const conds = (0, schedules_1.extractScheduleConds)(conditions);
            const payeeIdx = conditions.findIndex(c => c === conds.payee);
            const accountIdx = conditions.findIndex(c => c === conds.account);
            const amountIdx = conditions.findIndex(c => c === conds.amount);
            const dateIdx = conditions.findIndex(c => c === conds.date);
            db.runQuery('INSERT OR REPLACE INTO schedules_json_paths (schedule_id, payee, account, amount, date) VALUES (?, ?, ?, ?, ?)', [
                scheduleId,
                payeeIdx === -1 ? null : `$[${payeeIdx}]`,
                accountIdx === -1 ? null : `$[${accountIdx}]`,
                amountIdx === -1 ? null : `$[${amountIdx}]`,
                dateIdx === -1 ? null : `$[${dateIdx}]`,
            ]);
        }
    }
}
function trackJSONPaths() {
    // Populate the table
    db.transaction(() => {
        (0, transaction_rules_1.getRules)().forEach(rule => {
            onRuleUpdate(rule);
        });
    });
    return (0, sync_2.addSyncListener)(onApplySync);
}
function onApplySync(oldValues, newValues) {
    newValues.forEach((items, table) => {
        if (table === 'rules') {
            items.forEach(newValue => {
                onRuleUpdate(newValue);
            });
        }
    });
}
// This is the service that move schedules forward automatically and
// posts transactions
async function postTransactionForSchedule({ id, today, }) {
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).select('*'));
    const schedule = data[0];
    if (schedule == null || schedule._account == null) {
        return;
    }
    const transaction = {
        payee: schedule._payee,
        account: schedule._account,
        amount: (0, schedules_1.getScheduledAmount)(schedule._amount),
        date: today ? (0, months_1.currentDay)() : schedule.next_date,
        schedule: schedule.id,
        cleared: false,
    };
    if (transaction.account) {
        await (0, sync_1.addTransactions)(transaction.account, [transaction]);
    }
}
// TODO: make this sequential
async function advanceSchedulesService(syncSuccess) {
    // Move all paid schedules
    const { data: schedules } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules')
        .filter({ completed: false, '_account.closed': false })
        .select('*'));
    const { data: hasTransData } = await (0, aql_1.aqlQuery)((0, schedules_1.getHasTransactionsQuery)(schedules));
    const hasTrans = new Set(hasTransData.filter(Boolean).map(row => row.schedule));
    const failedToPost = [];
    let didPost = false;
    const { data: upcomingLength } = await (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
        .filter({ id: 'upcomingScheduledTransactionLength' })
        .select('value'));
    for (const schedule of schedules) {
        const status = (0, schedules_1.getStatus)(schedule.next_date, schedule.completed, hasTrans.has(schedule.id), upcomingLength[0]?.value ?? '7');
        if (status === 'paid') {
            if (schedule._date) {
                // Move forward recurring schedules
                if (schedule._date.frequency) {
                    try {
                        await setNextDate({ id: schedule.id });
                    }
                    catch (err) {
                        // This might error if the rule is corrupted and it can't
                        // find the rule
                    }
                }
                else {
                    if (schedule._date < (0, months_1.currentDay)()) {
                        // Complete any single schedules
                        await updateSchedule({
                            schedule: { id: schedule.id, completed: true },
                        });
                    }
                }
            }
        }
        else if ((status === 'due' || status === 'missed') &&
            schedule.posts_transaction &&
            schedule._account) {
            // Automatically create a transaction for due schedules
            if (syncSuccess) {
                await postTransactionForSchedule({ id: schedule.id });
                didPost = true;
            }
            else {
                failedToPost.push(schedule._payee);
            }
        }
    }
    if (failedToPost.length > 0) {
        connection.send('schedules-offline');
    }
    else if (didPost) {
        // This forces a full refresh of transactions because it
        // simulates them coming in from a full sync. This not a
        // great API right now, but I think generally the approach
        // is sane to treat them as external sync events.
        connection.send('sync-event', {
            type: 'success',
            tables: ['transactions'],
            syncDisabled: false,
        });
    }
}
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('schedule/create', (0, mutators_1.mutator)((0, undo_1.undoable)(createSchedule)));
exports.app.method('schedule/update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateSchedule)));
exports.app.method('schedule/delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteSchedule)));
exports.app.method('schedule/skip-next-date', (0, mutators_1.mutator)((0, undo_1.undoable)(skipNextDate)));
exports.app.method('schedule/post-transaction', (0, mutators_1.mutator)((0, undo_1.undoable)(postTransactionForSchedule)));
exports.app.method('schedule/force-run-service', (0, mutators_1.mutator)(() => advanceSchedulesService(true)));
exports.app.method('schedule/discover', discoverSchedules);
exports.app.method('schedule/get-upcoming-dates', getUpcomingDates);
exports.app.service(trackJSONPaths);
exports.app.events.on('sync', ({ type }) => {
    const completeEvent = type === 'success' || type === 'error' || type === 'unauthorized';
    if (completeEvent && prefs.getPrefs()) {
        if (!db.getDatabase()) {
            log_1.logger.info('database is not available, skipping schedule service');
            return;
        }
        const { lastScheduleRun } = prefs.getPrefs();
        if (lastScheduleRun !== (0, months_1.currentDay)()) {
            (0, mutators_1.runMutator)(() => advanceSchedulesService(type === 'success'));
            prefs.savePrefs({ lastScheduleRun: (0, months_1.currentDay)() });
        }
    }
});
