"use strict";
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
exports.assert = assert;
exports.rankRules = rankRules;
exports.migrateIds = migrateIds;
exports.iterateIds = iterateIds;
exports.parseRecurDate = parseRecurDate;
exports.parseDateString = parseDateString;
exports.parseBetweenAmount = parseBetweenAmount;
// @ts-strict-ignore
var dateFns = require("date-fns");
var log_1 = require("../../platform/server/log");
var schedules_1 = require("../../shared/schedules");
var errors_1 = require("../errors");
var rschedule_1 = require("../util/rschedule");
function assert(test, type, msg) {
    if (!test) {
        throw new errors_1.RuleError(type, msg);
    }
}
var OP_SCORES = {
    is: 10,
    isNot: 10,
    oneOf: 9,
    notOneOf: 9,
    isapprox: 5,
    isbetween: 5,
    gt: 1,
    gte: 1,
    lt: 1,
    lte: 1,
    contains: 0,
    doesNotContain: 0,
    matches: 0,
    hasTags: 0,
    onBudget: 0,
    offBudget: 0,
};
function computeScore(rule) {
    var initialScore = rule.conditions.reduce(function (score, condition) {
        if (OP_SCORES[condition.op] == null) {
            log_1.logger.log("Found invalid operation while ranking: ".concat(condition.op));
            return 0;
        }
        return score + OP_SCORES[condition.op];
    }, 0);
    if (rule.conditions.every(function (cond) {
        return cond.op === 'is' ||
            cond.op === 'isNot' ||
            cond.op === 'isapprox' ||
            cond.op === 'oneOf' ||
            cond.op === 'notOneOf';
    })) {
        return initialScore * 2;
    }
    return initialScore;
}
function _rankRules(rules) {
    var scores = new Map();
    rules.forEach(function (rule) {
        scores.set(rule, computeScore(rule));
    });
    // No matter the order of rules, this must always return exactly the same
    // order. That's why rules have ids: if two rules have the same score, it
    // sorts by id
    return __spreadArray([], rules, true).sort(function (r1, r2) {
        var score1 = scores.get(r1);
        var score2 = scores.get(r2);
        if (score1 < score2) {
            return -1;
        }
        else if (score1 > score2) {
            return 1;
        }
        else {
            var id1 = r1.getId();
            var id2 = r2.getId();
            return id1 < id2 ? -1 : id1 > id2 ? 1 : 0;
        }
    });
}
function rankRules(rules) {
    var pre = [];
    var normal = [];
    var post = [];
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        switch (rule.stage) {
            case 'pre':
                pre.push(rule);
                break;
            case 'post':
                post.push(rule);
                break;
            default:
                normal.push(rule);
        }
    }
    pre = _rankRules(pre);
    normal = _rankRules(normal);
    post = _rankRules(post);
    return pre.concat(normal).concat(post);
}
function migrateIds(rule, mappings) {
    // Go through the in-memory rules and patch up ids that have been
    // "migrated" to other ids. This is a little tricky, but a lot
    // easier than trying to keep an up-to-date mapping in the db. This
    // is necessary because ids can be transparently mapped as items are
    // merged/deleted in the system.
    //
    // It's very important here that we look at `rawValue` specifically,
    // and only apply the patches to the other `value` fields. We always
    // need to keep the original id around because undo can walk
    // backwards, and we need to be able to consistently apply a
    // "projection" of these mapped values. For example: if we have ids
    // [1, 2] and applying mappings transforms it to [2, 2], if `1` gets
    // mapped to something else there's no way to no to map *only* the
    // first id back to make [1, 2]. Keeping the original value around
    // solves this.
    for (var ci = 0; ci < rule.conditions.length; ci++) {
        var cond = rule.conditions[ci];
        if (cond.type === 'id') {
            switch (cond.op) {
                case 'is':
                    cond.value = mappings.get(cond.rawValue) || cond.rawValue;
                    cond.unparsedValue = cond.value;
                    break;
                case 'isNot':
                    cond.value = mappings.get(cond.rawValue) || cond.rawValue;
                    cond.unparsedValue = cond.value;
                    break;
                case 'oneOf':
                    cond.value = cond.rawValue.map(function (v) { return mappings.get(v) || v; });
                    cond.unparsedValue = __spreadArray([], cond.value, true);
                    break;
                case 'notOneOf':
                    cond.value = cond.rawValue.map(function (v) { return mappings.get(v) || v; });
                    cond.unparsedValue = __spreadArray([], cond.value, true);
                    break;
                default:
            }
        }
    }
    for (var ai = 0; ai < rule.actions.length; ai++) {
        var action = rule.actions[ai];
        if (action.type === 'id') {
            if (action.op === 'set') {
                action.value = mappings.get(action.rawValue) || action.rawValue;
            }
        }
    }
}
// This finds all the rules that reference the `id`
function iterateIds(rules, fieldName, func) {
    var i;
    ruleiter: for (i = 0; i < rules.length; i++) {
        var rule = rules[i];
        for (var ci = 0; ci < rule.conditions.length; ci++) {
            var cond = rule.conditions[ci];
            if (cond.type === 'id' && cond.field === fieldName) {
                switch (cond.op) {
                    case 'is':
                        if (func(rule, cond.value)) {
                            continue ruleiter;
                        }
                        break;
                    case 'isNot':
                        if (func(rule, cond.value)) {
                            continue ruleiter;
                        }
                        break;
                    case 'oneOf':
                        for (var vi = 0; vi < cond.value.length; vi++) {
                            if (func(rule, cond.value[vi])) {
                                continue ruleiter;
                            }
                        }
                        break;
                    case 'notOneOf':
                        for (var vi = 0; vi < cond.value.length; vi++) {
                            if (func(rule, cond.value[vi])) {
                                continue ruleiter;
                            }
                        }
                        break;
                    default:
                }
            }
        }
        for (var ai = 0; ai < rule.actions.length; ai++) {
            var action = rule.actions[ai];
            if (action.type === 'id' && action.field === fieldName) {
                // Currently `set` is the only op, but if we add more this
                // will need to be extended
                if (action.op === 'set') {
                    if (func(rule, action.value)) {
                        break;
                    }
                }
            }
        }
    }
}
function parseRecurDate(desc) {
    try {
        var rules = (0, schedules_1.recurConfigToRSchedule)(desc);
        return {
            type: 'recur',
            schedule: new rschedule_1.RSchedule({
                rrules: rules,
                data: {
                    skipWeekend: desc.skipWeekend,
                    weekendSolve: desc.weekendSolveMode,
                },
            }),
        };
    }
    catch (e) {
        throw new errors_1.RuleError('parse-recur-date', e.message);
    }
}
function parseDateString(str) {
    if (typeof str !== 'string') {
        return null;
    }
    else if (str.length === 10) {
        // YYYY-MM-DD
        if (!dateFns.isValid(dateFns.parseISO(str))) {
            return null;
        }
        return { type: 'date', date: str };
    }
    else if (str.length === 7) {
        // YYYY-MM
        if (!dateFns.isValid(dateFns.parseISO(str + '-01'))) {
            return null;
        }
        return { type: 'month', date: str };
    }
    else if (str.length === 4) {
        // YYYY
        if (!dateFns.isValid(dateFns.parseISO(str + '-01-01'))) {
            return null;
        }
        return { type: 'year', date: str };
    }
    return null;
}
function parseBetweenAmount(between) {
    var num1 = between.num1, num2 = between.num2;
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
        return null;
    }
    return { type: 'between', num1: num1, num2: num2 };
}
