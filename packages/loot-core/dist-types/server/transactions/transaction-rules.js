"use strict";
// @ts-strict-ignore
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
exports.ruleModel = exports.iterateIds = void 0;
exports.resetState = resetState;
exports.parseConditionsOrActions = parseConditionsOrActions;
exports.serializeConditionsOrActions = serializeConditionsOrActions;
exports.makeRule = makeRule;
exports.loadRules = loadRules;
exports.getRules = getRules;
exports.insertRule = insertRule;
exports.updateRule = updateRule;
exports.deleteRule = deleteRule;
exports.getRuleIdFromScheduleId = getRuleIdFromScheduleId;
exports.getAllRuleIdsFromSchedules = getAllRuleIdsFromSchedules;
exports.runRules = runRules;
exports.conditionsToAQL = conditionsToAQL;
exports.applyActions = applyActions;
exports.getRulesForPayee = getRulesForPayee;
exports.updatePayeeRenameRule = updatePayeeRenameRule;
exports.getProbableCategory = getProbableCategory;
exports.updateCategoryRules = updateCategoryRules;
exports.prepareTransactionForRules = prepareTransactionForRules;
exports.finalizeTransactionForRules = finalizeTransactionForRules;
const log_1 = require("../../platform/server/log");
const months_1 = require("../../shared/months");
const rules_1 = require("../../shared/rules");
const transactions_1 = require("../../shared/transactions");
const util_1 = require("../../shared/util");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const db_1 = require("../db");
const mappings_1 = require("../db/mappings");
const errors_1 = require("../errors");
const models_1 = require("../models");
const rules_2 = require("../rules");
const sync_1 = require("../sync");
const _1 = require(".");
// TODO: Detect if it looks like the user is creating a rename rule
// and prompt to create it in the pre phase instead
// * We could also make the "create rule" button a dropdown that
//   provides different "templates" like "create renaming rule"
var rules_3 = require("../rules");
Object.defineProperty(exports, "iterateIds", { enumerable: true, get: function () { return rules_3.iterateIds; } });
let allRules;
let unlistenSync;
let firstcharIndexer;
let payeeIndexer;
function resetState() {
    allRules = new Map();
    firstcharIndexer = new rules_2.RuleIndexer({
        field: 'imported_payee',
        method: 'firstchar',
    });
    payeeIndexer = new rules_2.RuleIndexer({ field: 'payee' });
}
// Database functions
function invert(obj) {
    return Object.fromEntries(Object.entries(obj).map(entry => {
        return [entry[1], entry[0]];
    }));
}
const internalFields = aql_1.schemaConfig.views.transactions.fields;
const publicFields = invert(aql_1.schemaConfig.views.transactions.fields);
function fromInternalField(obj) {
    return {
        ...obj,
        field: publicFields[obj.field] || obj.field,
    };
}
function toInternalField(obj) {
    return {
        ...obj,
        field: internalFields[obj.field] || obj.field,
    };
}
function parseArray(str) {
    let value;
    try {
        value = typeof str === 'string' ? JSON.parse(str) : str;
    }
    catch (e) {
        throw new errors_1.RuleError('internal', 'Cannot parse rule json');
    }
    if (!Array.isArray(value)) {
        throw new errors_1.RuleError('internal', 'Rule json must be an array');
    }
    return value;
}
function parseConditionsOrActions(str) {
    return str ? parseArray(str).map(item => fromInternalField(item)) : [];
}
function serializeConditionsOrActions(arr) {
    return JSON.stringify(arr.map(item => toInternalField(item)));
}
exports.ruleModel = {
    validate(rule, { update } = {}) {
        (0, models_1.requiredFields)('rules', rule, ['conditions', 'actions'], update);
        if (!update || 'stage' in rule) {
            if (rule.stage !== 'pre' &&
                rule.stage !== 'post' &&
                rule.stage !== null) {
                throw new Error('Invalid rule stage: ' + rule.stage);
            }
        }
        if (!update || 'conditionsOp' in rule) {
            if (!['and', 'or'].includes(rule.conditionsOp)) {
                throw new Error('Invalid rule conditionsOp: ' + rule.conditionsOp);
            }
        }
        return rule;
    },
    toJS(row) {
        const { conditions, conditions_op, actions, ...fields } = row;
        return {
            ...fields,
            conditionsOp: conditions_op,
            conditions: parseConditionsOrActions(conditions),
            actions: parseConditionsOrActions(actions),
        };
    },
    fromJS(rule) {
        const { conditions, conditionsOp, actions, ...row } = rule;
        if (conditionsOp) {
            row.conditions_op = conditionsOp;
        }
        if (Array.isArray(conditions)) {
            row.conditions = serializeConditionsOrActions(conditions);
        }
        if (Array.isArray(actions)) {
            row.actions = serializeConditionsOrActions(actions);
        }
        return row;
    },
};
function makeRule(data) {
    let rule;
    try {
        rule = new rules_2.Rule(exports.ruleModel.toJS(data));
    }
    catch (e) {
        log_1.logger.warn('Invalid rule', e);
        if (e instanceof errors_1.RuleError) {
            return null;
        }
        throw e;
    }
    // This is needed because we map ids on the fly, and they might
    // not be persisted into the db. Mappings allow items to
    // transparently merge with other items
    (0, rules_2.migrateIds)(rule, (0, mappings_1.getMappings)());
    return rule;
}
async function loadRules() {
    resetState();
    const rules = await db.all(`
    SELECT * FROM rules
      WHERE conditions IS NOT NULL AND actions IS NOT NULL AND tombstone = 0
  `);
    for (let i = 0; i < rules.length; i++) {
        const desc = rules[i];
        // These are old stages, can be removed before release
        if (desc.stage === 'cleanup' || desc.stage === 'modify') {
            desc.stage = 'pre';
        }
        const rule = makeRule(desc);
        if (rule) {
            allRules.set(rule.id, rule);
            firstcharIndexer.index(rule);
            payeeIndexer.index(rule);
        }
    }
    if (unlistenSync) {
        unlistenSync();
    }
    unlistenSync = (0, sync_1.addSyncListener)(onApplySync);
}
function getRules() {
    // This can simply return the in-memory data
    return [...allRules.values()];
}
async function insertRule(rule) {
    rule = exports.ruleModel.validate(rule);
    return db.insertWithUUID('rules', exports.ruleModel.fromJS(rule));
}
async function updateRule(rule) {
    rule = exports.ruleModel.validate(rule, { update: true });
    return db.update('rules', exports.ruleModel.fromJS(rule));
}
async function deleteRule(id) {
    const schedule = await db.first('SELECT id FROM schedules WHERE rule = ?', [id]);
    if (schedule) {
        return false;
    }
    await db.delete_('rules', id);
    return true;
}
// Sync projections
function onApplySync(oldValues, newValues) {
    newValues.forEach((items, table) => {
        if (table === 'rules') {
            items.forEach(newValue => {
                const oldRule = allRules.get(newValue.id);
                if (newValue.tombstone === 1) {
                    // Deleted, need to remove it from in-memory
                    const rule = allRules.get(newValue.id);
                    if (rule) {
                        allRules.delete(rule.getId());
                        firstcharIndexer.remove(rule);
                        payeeIndexer.remove(rule);
                    }
                }
                else {
                    // Inserted/updated
                    const rule = makeRule(newValue);
                    if (rule) {
                        if (oldRule) {
                            firstcharIndexer.remove(oldRule);
                            payeeIndexer.remove(oldRule);
                        }
                        allRules.set(newValue.id, rule);
                        firstcharIndexer.index(rule);
                        payeeIndexer.index(rule);
                    }
                }
            });
        }
    });
    // If any of the mapping tables have changed, we need to refresh the
    // ids
    const tables = [...newValues.keys()];
    if (tables.find(table => table.indexOf('mapping') !== -1)) {
        getRules().forEach(rule => {
            (0, rules_2.migrateIds)(rule, (0, mappings_1.getMappings)());
        });
    }
}
async function getRuleIdFromScheduleId(scheduleId) {
    const row = await db.first('SELECT rule FROM schedules WHERE id = ?', [scheduleId]);
    return row?.rule || null;
}
async function getAllRuleIdsFromSchedules(excluding) {
    const rows = await db.all('SELECT rule FROM schedules');
    // map all rule ids, filter out null/undefined, and de-dupe if needed
    const ruleIds = rows
        .map(r => r.rule)
        .filter((rule) => !!rule)
        .filter(ruleId => ruleId !== excluding);
    return ruleIds;
}
// Runner
async function runRules(trans, accounts = null) {
    let accountsMap = null;
    if (accounts === null) {
        accountsMap = new Map((await db.getAccounts()).map(account => [account.id, account]));
    }
    else {
        accountsMap = accounts;
    }
    let finalTrans = await prepareTransactionForRules({ ...trans }, accountsMap);
    let scheduleRuleID = '';
    // Check if a schedule is attached to this transaction and if so get the rule ID attached to that schedule.
    if (trans.schedule != null) {
        const ruleId = await getRuleIdFromScheduleId(trans.schedule);
        if (ruleId != null) {
            scheduleRuleID = ruleId;
        }
    }
    const RuleIdsLinkedToSchedules = await getAllRuleIdsFromSchedules(scheduleRuleID);
    const rules = (0, rules_2.rankRules)((0, util_1.fastSetMerge)(firstcharIndexer.getApplicableRules(trans), payeeIndexer.getApplicableRules(trans)));
    for (let i = 0; i < rules.length; i++) {
        // If there is a scheduleRuleID (meaning this transaction came from a schedule) then exclude rules linked to other schedules.
        if (scheduleRuleID !== '') {
            if (rules[i].id === scheduleRuleID) {
                // bypass condition checking to run the rule even if the transaction date falls outside of the schedule's date range.
                const changes = rules[i].execActions(finalTrans);
                finalTrans = Object.assign({}, finalTrans, changes);
            }
            else if (RuleIdsLinkedToSchedules.includes(rules[i].id)) {
                // skip all other rules that are linked to other schedules.
                continue;
            }
            else {
                // if a rule is not linked to a schedule, run it.
                finalTrans = rules[i].apply(finalTrans);
            }
        }
        else {
            // if there is no scheduleRuleID then just run all rules.
            finalTrans = rules[i].apply(finalTrans);
        }
    }
    return await finalizeTransactionForRules(finalTrans);
}
function conditionSpecialCases(cond) {
    if (!cond) {
        return cond;
    }
    //special cases that require multiple conditions
    if (cond.op === 'is' && cond.field === 'category' && cond.value === null) {
        return new rules_2.Condition('and', cond.field, [
            cond,
            new rules_2.Condition('is', 'transfer', false, null),
            new rules_2.Condition('is', 'parent', false, null),
        ], {});
    }
    else if (cond.op === 'isNot' &&
        cond.field === 'category' &&
        cond.value === null) {
        return new rules_2.Condition('and', cond.field, [cond, new rules_2.Condition('is', 'parent', false, null)], {});
    }
    return cond;
}
// This does the inverse: finds all the transactions matching a rule
function conditionsToAQL(conditions, { recurDateBounds = 100, applySpecialCases = true } = {}) {
    const errors = [];
    conditions = conditions
        .map(cond => {
        if (cond instanceof rules_2.Condition) {
            return cond;
        }
        try {
            return new rules_2.Condition(cond.op, cond.field, cond.value, cond.options);
        }
        catch (e) {
            errors.push(e.type || 'internal');
            log_1.logger.log('conditionsToAQL: invalid condition: ' + e.message);
            return null;
        }
    })
        .map(cond => (applySpecialCases ? conditionSpecialCases(cond) : cond))
        .filter(Boolean);
    // rule -> actualql
    const mapConditionToActualQL = cond => {
        const { type, options } = cond;
        let { field, op, value } = cond;
        const getValue = value => {
            if (type === 'number') {
                return value.value;
            }
            return value;
        };
        if (field === 'transfer' && op === 'is') {
            field = 'transfer_id';
            if (value) {
                op = 'isNot';
                value = null;
            }
            else {
                value = null;
            }
        }
        else if (field === 'parent' && op === 'is') {
            field = 'is_parent';
            if (value) {
                op = 'true';
            }
            else {
                op = 'false';
            }
        }
        const apply = (field, aqlOp, value) => {
            if (type === 'number') {
                if (options) {
                    if (options.outflow) {
                        return {
                            $and: [
                                { amount: { $lt: 0 } },
                                { [field]: { $transform: '$neg', [aqlOp]: value } },
                            ],
                        };
                    }
                    else if (options.inflow) {
                        return {
                            $and: [{ amount: { $gt: 0 } }, { [field]: { [aqlOp]: value } }],
                        };
                    }
                }
                return { amount: { [aqlOp]: value } };
            }
            else if (type === 'string') {
                return {
                    [field]: {
                        $transform: op !== 'hasTags' ? '$lower' : undefined,
                        [aqlOp]: value,
                    },
                };
            }
            else if (type === 'date') {
                return { [field]: { [aqlOp]: value.date } };
            }
            return { [field]: { [aqlOp]: value } };
        };
        switch (op) {
            case 'isapprox':
            case 'is':
                if (type === 'date') {
                    if (value.type === 'recur') {
                        const dates = value.schedule
                            .occurrences({ take: recurDateBounds })
                            .toArray()
                            .map(d => (0, months_1.dayFromDate)(d.date));
                        return {
                            $or: dates.map(d => {
                                if (op === 'isapprox') {
                                    return {
                                        $and: [
                                            { date: { $gte: (0, months_1.subDays)(d, 2) } },
                                            { date: { $lte: (0, months_1.addDays)(d, 2) } },
                                        ],
                                    };
                                }
                                return { date: d };
                            }),
                        };
                    }
                    else {
                        if (op === 'isapprox') {
                            const fullDate = (0, months_1.parseDate)(value.date);
                            const high = (0, months_1.addDays)(fullDate, 2);
                            const low = (0, months_1.subDays)(fullDate, 2);
                            return {
                                $and: [{ date: { $gte: low } }, { date: { $lte: high } }],
                            };
                        }
                        else {
                            switch (value.type) {
                                case 'date':
                                    return { date: value.date };
                                case 'month': {
                                    const low = value.date + '-00';
                                    const high = value.date + '-99';
                                    return {
                                        $and: [{ date: { $gte: low } }, { date: { $lte: high } }],
                                    };
                                }
                                case 'year': {
                                    const low = value.date + '-00-00';
                                    const high = value.date + '-99-99';
                                    return {
                                        $and: [{ date: { $gte: low } }, { date: { $lte: high } }],
                                    };
                                }
                                default:
                            }
                        }
                    }
                }
                else if (type === 'number') {
                    const number = value.value;
                    if (op === 'isapprox') {
                        const threshold = (0, rules_1.getApproxNumberThreshold)(number);
                        return {
                            $and: [
                                apply(field, '$gte', number - threshold),
                                apply(field, '$lte', number + threshold),
                            ],
                        };
                    }
                    return apply(field, '$eq', number);
                }
                else if (type === 'string') {
                    if (value === '') {
                        return {
                            $or: [apply(field, '$eq', null), apply(field, '$eq', '')],
                        };
                    }
                }
                return apply(field, '$eq', value);
            case 'isNot':
                return apply(field, '$ne', value);
            case 'isbetween':
                // This operator is only applicable to the specific `between`
                // number type so we don't use `apply`
                const [low, high] = (0, rules_1.sortNumbers)(value.num1, value.num2);
                return {
                    [field]: [{ $gte: low }, { $lte: high }],
                };
            case 'contains':
                // Running contains with id will automatically reach into
                // the `name` of the referenced table and do a string match
                return apply(type === 'id' ? field + '.name' : field, '$like', '%' + value + '%');
            case 'matches':
                // Running contains with id will automatically reach into
                // the `name` of the referenced table and do a regex match
                return apply(type === 'id' ? field + '.name' : field, '$regexp', value);
            case 'doesNotContain':
                // Running contains with id will automatically reach into
                // the `name` of the referenced table and do a string match
                return apply(type === 'id' ? field + '.name' : field, '$notlike', '%' + value + '%');
            case 'oneOf':
                const values = value;
                if (values.length === 0) {
                    // This forces it to match nothing
                    return { id: null };
                }
                return { $or: values.map(v => apply(field, '$eq', v)) };
            case 'hasTags':
                const tagValues = [];
                for (const [_, tag] of value.matchAll(/(?<!#)(#[^#\s]+)/g)) {
                    if (!tagValues.find(t => t.tag === tag)) {
                        tagValues.push(tag);
                    }
                }
                return {
                    $and: tagValues.map(v => {
                        const regex = new RegExp(`(?<!#)${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s#]|$)`);
                        return apply(field, '$regexp', regex.source);
                    }),
                };
            case 'notOneOf':
                const notValues = value;
                if (notValues.length === 0) {
                    // This forces it to match nothing
                    return { id: null };
                }
                return { $and: notValues.map(v => apply(field, '$ne', v)) };
            case 'gt':
                return apply(field, '$gt', getValue(value));
            case 'gte':
                return apply(field, '$gte', getValue(value));
            case 'lt':
                return apply(field, '$lt', getValue(value));
            case 'lte':
                return apply(field, '$lte', getValue(value));
            case 'true':
                return apply(field, '$eq', true);
            case 'false':
                return apply(field, '$eq', false);
            case 'and':
                return {
                    $and: getValue(value).map(subExpr => mapConditionToActualQL(subExpr)),
                };
            case 'onBudget':
                return { 'account.offbudget': false };
            case 'offBudget':
                return { 'account.offbudget': true };
            default:
                throw new Error('Unhandled operator: ' + op);
        }
    };
    const filters = conditions.map(mapConditionToActualQL);
    return { filters, errors };
}
async function applyActions(transactions, actions) {
    const parsedActions = actions
        .map(action => {
        if (action instanceof rules_2.Action) {
            return action;
        }
        try {
            if (action.op === 'set-split-amount') {
                return new rules_2.Action(action.op, null, action.value, action.options);
            }
            else if (action.op === 'link-schedule') {
                return new rules_2.Action(action.op, null, action.value, null);
            }
            else if (action.op === 'prepend-notes' ||
                action.op === 'append-notes') {
                return new rules_2.Action(action.op, null, action.value, null);
            }
            else if (action.op === 'delete-transaction') {
                return new rules_2.Action(action.op, null, null, null);
            }
            return new rules_2.Action(action.op, action.field, action.value, action.options);
        }
        catch (e) {
            log_1.logger.log('Action error', e);
            return null;
        }
    })
        .filter(Boolean);
    if (parsedActions.length !== actions.length) {
        // An error happened while parsing
        return null;
    }
    const accounts = await db.getAccounts();
    const accountsMap = new Map(accounts.map(account => [account.id, account]));
    const transactionsForRules = await Promise.all(transactions.map(transactions => prepareTransactionForRules(transactions, accountsMap)));
    const updated = transactionsForRules.flatMap(trans => {
        return (0, transactions_1.ungroupTransaction)((0, rules_2.execActions)(parsedActions, trans));
    });
    const finalized = [];
    for (const trans of updated) {
        finalized.push(await finalizeTransactionForRules(trans));
    }
    return (0, _1.batchUpdateTransactions)({ updated: finalized });
}
function getRulesForPayee(payeeId) {
    const rules = new Set();
    (0, rules_2.iterateIds)(getRules(), 'payee', (rule, id) => {
        if (id === payeeId) {
            rules.add(rule);
        }
    });
    return (0, rules_2.rankRules)([...rules]);
}
function* getIsSetterRules(stage, condField, actionField, { condValue, actionValue }) {
    const rules = getRules();
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.stage === stage &&
            rule.actions.length === 1 &&
            rule.actions[0].op === 'set' &&
            rule.actions[0].field === actionField &&
            (actionValue === undefined || rule.actions[0].value === actionValue) &&
            rule.conditions.length === 1 &&
            (rule.conditions[0].op === 'is' || rule.conditions[0].op === 'isNot') &&
            rule.conditions[0].field === condField &&
            (condValue === undefined || rule.conditions[0].value === condValue)) {
            yield rule.serialize();
        }
    }
    return null;
}
function* getOneOfSetterRules(stage, condField, actionField, { condValue, actionValue }) {
    const rules = getRules();
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.stage === stage &&
            rule.actions.length === 1 &&
            rule.actions[0].op === 'set' &&
            rule.actions[0].field === actionField &&
            (actionValue == null || rule.actions[0].value === actionValue) &&
            rule.conditions.length === 1 &&
            (rule.conditions[0].op === 'oneOf' ||
                rule.conditions[0].op === 'oneOf') &&
            rule.conditions[0].field === condField &&
            (condValue == null || rule.conditions[0].value.indexOf(condValue) !== -1)) {
            yield rule.serialize();
        }
    }
    return null;
}
async function updatePayeeRenameRule(fromNames, to) {
    const renameRule = getOneOfSetterRules('pre', 'imported_payee', 'payee', {
        actionValue: to,
    }).next().value;
    // Note that we don't check for existing rules that set this
    // `imported_payee` to something else. It's important to do
    // that for categories because categories will be changes frequently
    // for the same payee, but renames won't be changed much. It's a use
    // case we could improve in the future, but this is fine for now.
    if (renameRule) {
        const condition = renameRule.conditions[0];
        const newValue = [
            ...(0, util_1.fastSetMerge)(new Set(condition.value), new Set(fromNames.filter(name => name !== ''))),
        ];
        const rule = {
            ...renameRule,
            conditions: [{ ...condition, value: newValue }],
        };
        await updateRule(rule);
        return renameRule.id;
    }
    else {
        const rule = new rules_2.Rule({
            stage: 'pre',
            conditionsOp: 'and',
            conditions: [{ op: 'oneOf', field: 'imported_payee', value: fromNames }],
            actions: [{ op: 'set', field: 'payee', value: to }],
        });
        return insertRule(rule.serialize());
    }
}
function getProbableCategory(transactions) {
    const scores = new Map();
    transactions.forEach(trans => {
        if (trans.category) {
            scores.set(trans.category, (scores.get(trans.category) || 0) + 1);
        }
    });
    const winner = transactions.reduce((winner, trans) => {
        const score = scores.get(trans.category);
        if (!winner || score > winner.score) {
            return { score, category: trans.category };
        }
        return winner;
    }, null);
    return winner.score >= 3 ? winner.category : null;
}
async function updateCategoryRules(transactions) {
    if (transactions.length === 0) {
        return;
    }
    const payeeIds = new Set(transactions.map(trans => trans.payee));
    const transIds = new Set(transactions.map(trans => trans.id));
    // It's going to be quickest to get the oldest date and then query
    // all transactions since then so we can work in memory
    let oldestDate = null;
    for (let i = 0; i < transactions.length; i++) {
        if (oldestDate === null || transactions[i].date < oldestDate) {
            oldestDate = transactions[i].date;
        }
    }
    // We look 6 months behind to include any other transaction. This
    // makes it so we, 1. don't have to load in all transactions ever
    // and 2. "forget" really old transactions which might be nice and
    // 3. don't have to individually run a query for each payee
    oldestDate = (0, months_1.subDays)(oldestDate, 180);
    // Also look 180 days in the future to get any future transactions
    // (this might change when we think about scheduled transactions)
    const register = await db.all(`SELECT t.* FROM v_transactions t
     LEFT JOIN accounts a ON a.id = t.account
     LEFT JOIN payees p ON p.id = t.payee
     WHERE date >= ? AND date <= ? AND is_parent = 0 AND a.closed = 0 AND p.learn_categories = 1
     ORDER BY date DESC`, [(0, models_1.toDateRepr)(oldestDate), (0, models_1.toDateRepr)((0, months_1.addDays)((0, months_1.currentDay)(), 180))]);
    const allTransactions = (0, util_1.partitionByField)(register, 'payee');
    const categoriesToSet = new Map();
    for (const payeeId of payeeIds) {
        // Don't do anything if payee is null
        if (payeeId) {
            const latestTrans = (allTransactions.get(payeeId) || []).slice(0, 5);
            // Check if one of the latest transactions was one that was
            // updated. We only want to update anything if so.
            if (latestTrans.find(trans => transIds.has(trans.id))) {
                const category = getProbableCategory(latestTrans);
                if (category) {
                    categoriesToSet.set(payeeId, category);
                }
            }
        }
    }
    await (0, sync_1.batchMessages)(async () => {
        for (const [payeeId, category] of categoriesToSet.entries()) {
            const ruleSetters = [
                ...getIsSetterRules(null, 'payee', 'category', {
                    condValue: payeeId,
                }),
            ];
            if (ruleSetters.length > 0) {
                // If there are existing rules, change all of them to the new
                // category (if they aren't already using it). We set all of
                // them because it's possible that multiple rules exist
                // because 2 clients made them independently. Not really a big
                // deal, but to make sure our update gets applied set it to
                // all of them
                for (const rule of ruleSetters) {
                    const action = rule.actions[0];
                    if (action.value !== category) {
                        await updateRule({
                            ...rule,
                            actions: [{ ...action, value: category }],
                        });
                    }
                }
            }
            else {
                // No existing rules, so create one
                const newRule = new rules_2.Rule({
                    stage: null,
                    conditionsOp: 'and',
                    conditions: [{ op: 'is', field: 'payee', value: payeeId }],
                    actions: [{ op: 'set', field: 'category', value: category }],
                });
                await insertRule(newRule.serialize());
            }
        }
    });
}
async function prepareTransactionForRules(trans, accounts = null) {
    const r = { ...trans };
    if (trans.payee) {
        const payee = await (0, db_1.getPayee)(trans.payee);
        if (payee) {
            r.payee_name = payee.name;
        }
    }
    if (trans.account) {
        if (accounts !== null && accounts.has(trans.account)) {
            r._account = accounts.get(trans.account);
        }
        else {
            r._account = await (0, db_1.getAccount)(trans.account);
        }
    }
    return r;
}
async function finalizeTransactionForRules(trans) {
    if ('payee_name' in trans) {
        if (trans.payee === 'new') {
            if (trans.payee_name) {
                let payeeId = (await (0, db_1.getPayeeByName)(trans.payee_name))?.id;
                payeeId ??= await (0, db_1.insertPayee)({
                    name: trans.payee_name,
                });
                trans.payee = payeeId;
            }
            else {
                trans.payee = null;
            }
        }
        delete trans.payee_name;
    }
    return trans;
}
//# sourceMappingURL=transaction-rules.js.map