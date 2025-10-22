"use strict";
// @ts-strict-ignore
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var log_1 = require("../../platform/server/log");
var months_1 = require("../../shared/months");
var rules_1 = require("../../shared/rules");
var transactions_1 = require("../../shared/transactions");
var util_1 = require("../../shared/util");
var aql_1 = require("../aql");
var db = require("../db");
var db_1 = require("../db");
var mappings_1 = require("../db/mappings");
var errors_1 = require("../errors");
var models_1 = require("../models");
var rules_2 = require("../rules");
var sync_1 = require("../sync");
var _1 = require(".");
// TODO: Detect if it looks like the user is creating a rename rule
// and prompt to create it in the pre phase instead
// * We could also make the "create rule" button a dropdown that
//   provides different "templates" like "create renaming rule"
var rules_3 = require("../rules");
Object.defineProperty(exports, "iterateIds", { enumerable: true, get: function () { return rules_3.iterateIds; } });
var allRules;
var unlistenSync;
var firstcharIndexer;
var payeeIndexer;
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
    return Object.fromEntries(Object.entries(obj).map(function (entry) {
        return [entry[1], entry[0]];
    }));
}
var internalFields = aql_1.schemaConfig.views.transactions.fields;
var publicFields = invert(aql_1.schemaConfig.views.transactions.fields);
function fromInternalField(obj) {
    return __assign(__assign({}, obj), { field: publicFields[obj.field] || obj.field });
}
function toInternalField(obj) {
    return __assign(__assign({}, obj), { field: internalFields[obj.field] || obj.field });
}
function parseArray(str) {
    var value;
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
    return str ? parseArray(str).map(function (item) { return fromInternalField(item); }) : [];
}
function serializeConditionsOrActions(arr) {
    return JSON.stringify(arr.map(function (item) { return toInternalField(item); }));
}
exports.ruleModel = {
    validate: function (rule, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
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
    toJS: function (row) {
        var conditions = row.conditions, conditions_op = row.conditions_op, actions = row.actions, fields = __rest(row, ["conditions", "conditions_op", "actions"]);
        return __assign(__assign({}, fields), { conditionsOp: conditions_op, conditions: parseConditionsOrActions(conditions), actions: parseConditionsOrActions(actions) });
    },
    fromJS: function (rule) {
        var conditions = rule.conditions, conditionsOp = rule.conditionsOp, actions = rule.actions, row = __rest(rule, ["conditions", "conditionsOp", "actions"]);
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
    var rule;
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
function loadRules() {
    return __awaiter(this, void 0, void 0, function () {
        var rules, i, desc, rule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetState();
                    return [4 /*yield*/, db.all("\n    SELECT * FROM rules\n      WHERE conditions IS NOT NULL AND actions IS NOT NULL AND tombstone = 0\n  ")];
                case 1:
                    rules = _a.sent();
                    for (i = 0; i < rules.length; i++) {
                        desc = rules[i];
                        // These are old stages, can be removed before release
                        if (desc.stage === 'cleanup' || desc.stage === 'modify') {
                            desc.stage = 'pre';
                        }
                        rule = makeRule(desc);
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
                    return [2 /*return*/];
            }
        });
    });
}
function getRules() {
    // This can simply return the in-memory data
    return __spreadArray([], allRules.values(), true);
}
function insertRule(rule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            rule = exports.ruleModel.validate(rule);
            return [2 /*return*/, db.insertWithUUID('rules', exports.ruleModel.fromJS(rule))];
        });
    });
}
function updateRule(rule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            rule = exports.ruleModel.validate(rule, { update: true });
            return [2 /*return*/, db.update('rules', exports.ruleModel.fromJS(rule))];
        });
    });
}
function deleteRule(id) {
    return __awaiter(this, void 0, void 0, function () {
        var schedule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.first('SELECT id FROM schedules WHERE rule = ?', [id])];
                case 1:
                    schedule = _a.sent();
                    if (schedule) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, db.delete_('rules', id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
// Sync projections
function onApplySync(oldValues, newValues) {
    newValues.forEach(function (items, table) {
        if (table === 'rules') {
            items.forEach(function (newValue) {
                var oldRule = allRules.get(newValue.id);
                if (newValue.tombstone === 1) {
                    // Deleted, need to remove it from in-memory
                    var rule = allRules.get(newValue.id);
                    if (rule) {
                        allRules.delete(rule.getId());
                        firstcharIndexer.remove(rule);
                        payeeIndexer.remove(rule);
                    }
                }
                else {
                    // Inserted/updated
                    var rule = makeRule(newValue);
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
    var tables = __spreadArray([], newValues.keys(), true);
    if (tables.find(function (table) { return table.indexOf('mapping') !== -1; })) {
        getRules().forEach(function (rule) {
            (0, rules_2.migrateIds)(rule, (0, mappings_1.getMappings)());
        });
    }
}
function getRuleIdFromScheduleId(scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.first('SELECT rule FROM schedules WHERE id = ?', [scheduleId])];
                case 1:
                    row = _a.sent();
                    return [2 /*return*/, (row === null || row === void 0 ? void 0 : row.rule) || null];
            }
        });
    });
}
function getAllRuleIdsFromSchedules(excluding) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, ruleIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.all('SELECT rule FROM schedules')];
                case 1:
                    rows = _a.sent();
                    ruleIds = rows
                        .map(function (r) { return r.rule; })
                        .filter(function (rule) { return !!rule; })
                        .filter(function (ruleId) { return ruleId !== excluding; });
                    return [2 /*return*/, ruleIds];
            }
        });
    });
}
// Runner
function runRules(trans_1) {
    return __awaiter(this, arguments, void 0, function (trans, accounts) {
        var accountsMap, _a, finalTrans, scheduleRuleID, ruleId, RuleIdsLinkedToSchedules, rules, i, changes;
        if (accounts === void 0) { accounts = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    accountsMap = null;
                    if (!(accounts === null)) return [3 /*break*/, 2];
                    _a = Map.bind;
                    return [4 /*yield*/, db.getAccounts()];
                case 1:
                    accountsMap = new (_a.apply(Map, [void 0, (_b.sent()).map(function (account) { return [account.id, account]; })]))();
                    return [3 /*break*/, 3];
                case 2:
                    accountsMap = accounts;
                    _b.label = 3;
                case 3: return [4 /*yield*/, prepareTransactionForRules(__assign({}, trans), accountsMap)];
                case 4:
                    finalTrans = _b.sent();
                    scheduleRuleID = '';
                    if (!(trans.schedule != null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getRuleIdFromScheduleId(trans.schedule)];
                case 5:
                    ruleId = _b.sent();
                    if (ruleId != null) {
                        scheduleRuleID = ruleId;
                    }
                    _b.label = 6;
                case 6: return [4 /*yield*/, getAllRuleIdsFromSchedules(scheduleRuleID)];
                case 7:
                    RuleIdsLinkedToSchedules = _b.sent();
                    rules = (0, rules_2.rankRules)((0, util_1.fastSetMerge)(firstcharIndexer.getApplicableRules(trans), payeeIndexer.getApplicableRules(trans)));
                    for (i = 0; i < rules.length; i++) {
                        // If there is a scheduleRuleID (meaning this transaction came from a schedule) then exclude rules linked to other schedules.
                        if (scheduleRuleID !== '') {
                            if (rules[i].id === scheduleRuleID) {
                                changes = rules[i].execActions(finalTrans);
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
                    return [4 /*yield*/, finalizeTransactionForRules(finalTrans)];
                case 8: return [2 /*return*/, _b.sent()];
            }
        });
    });
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
function conditionsToAQL(conditions, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.recurDateBounds, recurDateBounds = _c === void 0 ? 100 : _c, _d = _b.applySpecialCases, applySpecialCases = _d === void 0 ? true : _d;
    var errors = [];
    conditions = conditions
        .map(function (cond) {
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
        .map(function (cond) { return (applySpecialCases ? conditionSpecialCases(cond) : cond); })
        .filter(Boolean);
    // rule -> actualql
    var mapConditionToActualQL = function (cond) {
        var _a;
        var type = cond.type, options = cond.options;
        var field = cond.field, op = cond.op, value = cond.value;
        var getValue = function (value) {
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
        var apply = function (field, aqlOp, value) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (type === 'number') {
                if (options) {
                    if (options.outflow) {
                        return {
                            $and: [
                                { amount: { $lt: 0 } },
                                (_a = {}, _a[field] = (_b = { $transform: '$neg' }, _b[aqlOp] = value, _b), _a),
                            ],
                        };
                    }
                    else if (options.inflow) {
                        return {
                            $and: [{ amount: { $gt: 0 } }, (_c = {}, _c[field] = (_d = {}, _d[aqlOp] = value, _d), _c)],
                        };
                    }
                }
                return { amount: (_e = {}, _e[aqlOp] = value, _e) };
            }
            else if (type === 'string') {
                return _f = {},
                    _f[field] = (_g = {
                            $transform: op !== 'hasTags' ? '$lower' : undefined
                        },
                        _g[aqlOp] = value,
                        _g),
                    _f;
            }
            else if (type === 'date') {
                return _h = {}, _h[field] = (_j = {}, _j[aqlOp] = value.date, _j), _h;
            }
            return _k = {}, _k[field] = (_l = {}, _l[aqlOp] = value, _l), _k;
        };
        switch (op) {
            case 'isapprox':
            case 'is':
                if (type === 'date') {
                    if (value.type === 'recur') {
                        var dates = value.schedule
                            .occurrences({ take: recurDateBounds })
                            .toArray()
                            .map(function (d) { return (0, months_1.dayFromDate)(d.date); });
                        return {
                            $or: dates.map(function (d) {
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
                            var fullDate = (0, months_1.parseDate)(value.date);
                            var high_1 = (0, months_1.addDays)(fullDate, 2);
                            var low_1 = (0, months_1.subDays)(fullDate, 2);
                            return {
                                $and: [{ date: { $gte: low_1 } }, { date: { $lte: high_1 } }],
                            };
                        }
                        else {
                            switch (value.type) {
                                case 'date':
                                    return { date: value.date };
                                case 'month': {
                                    var low_2 = value.date + '-00';
                                    var high_2 = value.date + '-99';
                                    return {
                                        $and: [{ date: { $gte: low_2 } }, { date: { $lte: high_2 } }],
                                    };
                                }
                                case 'year': {
                                    var low_3 = value.date + '-00-00';
                                    var high_3 = value.date + '-99-99';
                                    return {
                                        $and: [{ date: { $gte: low_3 } }, { date: { $lte: high_3 } }],
                                    };
                                }
                                default:
                            }
                        }
                    }
                }
                else if (type === 'number') {
                    var number = value.value;
                    if (op === 'isapprox') {
                        var threshold = (0, rules_1.getApproxNumberThreshold)(number);
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
                var _b = (0, rules_1.sortNumbers)(value.num1, value.num2), low = _b[0], high = _b[1];
                return _a = {},
                    _a[field] = [{ $gte: low }, { $lte: high }],
                    _a;
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
                var values = value;
                if (values.length === 0) {
                    // This forces it to match nothing
                    return { id: null };
                }
                return { $or: values.map(function (v) { return apply(field, '$eq', v); }) };
            case 'hasTags':
                var tagValues = [];
                var _loop_1 = function (_2, tag) {
                    if (!tagValues.find(function (t) { return t.tag === tag; })) {
                        tagValues.push(tag);
                    }
                };
                for (var _i = 0, _c = value.matchAll(/(?<!#)(#[^#\s]+)/g); _i < _c.length; _i++) {
                    var _d = _c[_i], _2 = _d[0], tag = _d[1];
                    _loop_1(_2, tag);
                }
                return {
                    $and: tagValues.map(function (v) {
                        var regex = new RegExp("(?<!#)".concat(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "([\\s#]|$)"));
                        return apply(field, '$regexp', regex.source);
                    }),
                };
            case 'notOneOf':
                var notValues = value;
                if (notValues.length === 0) {
                    // This forces it to match nothing
                    return { id: null };
                }
                return { $and: notValues.map(function (v) { return apply(field, '$ne', v); }) };
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
                    $and: getValue(value).map(function (subExpr) { return mapConditionToActualQL(subExpr); }),
                };
            case 'onBudget':
                return { 'account.offbudget': false };
            case 'offBudget':
                return { 'account.offbudget': true };
            default:
                throw new Error('Unhandled operator: ' + op);
        }
    };
    var filters = conditions.map(mapConditionToActualQL);
    return { filters: filters, errors: errors };
}
function applyActions(transactions, actions) {
    return __awaiter(this, void 0, void 0, function () {
        var parsedActions, accounts, accountsMap, transactionsForRules, updated, finalized, _i, updated_1, trans, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    parsedActions = actions
                        .map(function (action) {
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
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, db.getAccounts()];
                case 1:
                    accounts = _c.sent();
                    accountsMap = new Map(accounts.map(function (account) { return [account.id, account]; }));
                    return [4 /*yield*/, Promise.all(transactions.map(function (transactions) {
                            return prepareTransactionForRules(transactions, accountsMap);
                        }))];
                case 2:
                    transactionsForRules = _c.sent();
                    updated = transactionsForRules.flatMap(function (trans) {
                        return (0, transactions_1.ungroupTransaction)((0, rules_2.execActions)(parsedActions, trans));
                    });
                    finalized = [];
                    _i = 0, updated_1 = updated;
                    _c.label = 3;
                case 3:
                    if (!(_i < updated_1.length)) return [3 /*break*/, 6];
                    trans = updated_1[_i];
                    _b = (_a = finalized).push;
                    return [4 /*yield*/, finalizeTransactionForRules(trans)];
                case 4:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, (0, _1.batchUpdateTransactions)({ updated: finalized })];
            }
        });
    });
}
function getRulesForPayee(payeeId) {
    var rules = new Set();
    (0, rules_2.iterateIds)(getRules(), 'payee', function (rule, id) {
        if (id === payeeId) {
            rules.add(rule);
        }
    });
    return (0, rules_2.rankRules)(__spreadArray([], rules, true));
}
function getIsSetterRules(stage, condField, actionField, _a) {
    var rules, i, rule;
    var condValue = _a.condValue, actionValue = _a.actionValue;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                rules = getRules();
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < rules.length)) return [3 /*break*/, 4];
                rule = rules[i];
                if (!(rule.stage === stage &&
                    rule.actions.length === 1 &&
                    rule.actions[0].op === 'set' &&
                    rule.actions[0].field === actionField &&
                    (actionValue === undefined || rule.actions[0].value === actionValue) &&
                    rule.conditions.length === 1 &&
                    (rule.conditions[0].op === 'is' || rule.conditions[0].op === 'isNot') &&
                    rule.conditions[0].field === condField &&
                    (condValue === undefined || rule.conditions[0].value === condValue))) return [3 /*break*/, 3];
                return [4 /*yield*/, rule.serialize()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, null];
        }
    });
}
function getOneOfSetterRules(stage, condField, actionField, _a) {
    var rules, i, rule;
    var condValue = _a.condValue, actionValue = _a.actionValue;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                rules = getRules();
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < rules.length)) return [3 /*break*/, 4];
                rule = rules[i];
                if (!(rule.stage === stage &&
                    rule.actions.length === 1 &&
                    rule.actions[0].op === 'set' &&
                    rule.actions[0].field === actionField &&
                    (actionValue == null || rule.actions[0].value === actionValue) &&
                    rule.conditions.length === 1 &&
                    (rule.conditions[0].op === 'oneOf' ||
                        rule.conditions[0].op === 'oneOf') &&
                    rule.conditions[0].field === condField &&
                    (condValue == null || rule.conditions[0].value.indexOf(condValue) !== -1))) return [3 /*break*/, 3];
                return [4 /*yield*/, rule.serialize()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, null];
        }
    });
}
function updatePayeeRenameRule(fromNames, to) {
    return __awaiter(this, void 0, void 0, function () {
        var renameRule, condition, newValue, rule, rule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    renameRule = getOneOfSetterRules('pre', 'imported_payee', 'payee', {
                        actionValue: to,
                    }).next().value;
                    if (!renameRule) return [3 /*break*/, 2];
                    condition = renameRule.conditions[0];
                    newValue = __spreadArray([], (0, util_1.fastSetMerge)(new Set(condition.value), new Set(fromNames.filter(function (name) { return name !== ''; }))), true);
                    rule = __assign(__assign({}, renameRule), { conditions: [__assign(__assign({}, condition), { value: newValue })] });
                    return [4 /*yield*/, updateRule(rule)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, renameRule.id];
                case 2:
                    rule = new rules_2.Rule({
                        stage: 'pre',
                        conditionsOp: 'and',
                        conditions: [{ op: 'oneOf', field: 'imported_payee', value: fromNames }],
                        actions: [{ op: 'set', field: 'payee', value: to }],
                    });
                    return [2 /*return*/, insertRule(rule.serialize())];
            }
        });
    });
}
function getProbableCategory(transactions) {
    var scores = new Map();
    transactions.forEach(function (trans) {
        if (trans.category) {
            scores.set(trans.category, (scores.get(trans.category) || 0) + 1);
        }
    });
    var winner = transactions.reduce(function (winner, trans) {
        var score = scores.get(trans.category);
        if (!winner || score > winner.score) {
            return { score: score, category: trans.category };
        }
        return winner;
    }, null);
    return winner.score >= 3 ? winner.category : null;
}
function updateCategoryRules(transactions) {
    return __awaiter(this, void 0, void 0, function () {
        var payeeIds, transIds, oldestDate, i, register, allTransactions, categoriesToSet, _i, payeeIds_1, payeeId, latestTrans, category;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (transactions.length === 0) {
                        return [2 /*return*/];
                    }
                    payeeIds = new Set(transactions.map(function (trans) { return trans.payee; }));
                    transIds = new Set(transactions.map(function (trans) { return trans.id; }));
                    oldestDate = null;
                    for (i = 0; i < transactions.length; i++) {
                        if (oldestDate === null || transactions[i].date < oldestDate) {
                            oldestDate = transactions[i].date;
                        }
                    }
                    // We look 6 months behind to include any other transaction. This
                    // makes it so we, 1. don't have to load in all transactions ever
                    // and 2. "forget" really old transactions which might be nice and
                    // 3. don't have to individually run a query for each payee
                    oldestDate = (0, months_1.subDays)(oldestDate, 180);
                    return [4 /*yield*/, db.all("SELECT t.* FROM v_transactions t\n     LEFT JOIN accounts a ON a.id = t.account\n     LEFT JOIN payees p ON p.id = t.payee\n     WHERE date >= ? AND date <= ? AND is_parent = 0 AND a.closed = 0 AND p.learn_categories = 1\n     ORDER BY date DESC", [(0, models_1.toDateRepr)(oldestDate), (0, models_1.toDateRepr)((0, months_1.addDays)((0, months_1.currentDay)(), 180))])];
                case 1:
                    register = _a.sent();
                    allTransactions = (0, util_1.partitionByField)(register, 'payee');
                    categoriesToSet = new Map();
                    for (_i = 0, payeeIds_1 = payeeIds; _i < payeeIds_1.length; _i++) {
                        payeeId = payeeIds_1[_i];
                        // Don't do anything if payee is null
                        if (payeeId) {
                            latestTrans = (allTransactions.get(payeeId) || []).slice(0, 5);
                            // Check if one of the latest transactions was one that was
                            // updated. We only want to update anything if so.
                            if (latestTrans.find(function (trans) { return transIds.has(trans.id); })) {
                                category = getProbableCategory(latestTrans);
                                if (category) {
                                    categoriesToSet.set(payeeId, category);
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, _a, _b, payeeId, category, ruleSetters, _c, ruleSetters_1, rule, action, newRule;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _i = 0, _a = categoriesToSet.entries();
                                        _d.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                                        _b = _a[_i], payeeId = _b[0], category = _b[1];
                                        ruleSetters = __spreadArray([], getIsSetterRules(null, 'payee', 'category', {
                                            condValue: payeeId,
                                        }), true);
                                        if (!(ruleSetters.length > 0)) return [3 /*break*/, 6];
                                        _c = 0, ruleSetters_1 = ruleSetters;
                                        _d.label = 2;
                                    case 2:
                                        if (!(_c < ruleSetters_1.length)) return [3 /*break*/, 5];
                                        rule = ruleSetters_1[_c];
                                        action = rule.actions[0];
                                        if (!(action.value !== category)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, updateRule(__assign(__assign({}, rule), { actions: [__assign(__assign({}, action), { value: category })] }))];
                                    case 3:
                                        _d.sent();
                                        _d.label = 4;
                                    case 4:
                                        _c++;
                                        return [3 /*break*/, 2];
                                    case 5: return [3 /*break*/, 8];
                                    case 6:
                                        newRule = new rules_2.Rule({
                                            stage: null,
                                            conditionsOp: 'and',
                                            conditions: [{ op: 'is', field: 'payee', value: payeeId }],
                                            actions: [{ op: 'set', field: 'category', value: category }],
                                        });
                                        return [4 /*yield*/, insertRule(newRule.serialize())];
                                    case 7:
                                        _d.sent();
                                        _d.label = 8;
                                    case 8:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function prepareTransactionForRules(trans_1) {
    return __awaiter(this, arguments, void 0, function (trans, accounts) {
        var r, payee, _a;
        if (accounts === void 0) { accounts = null; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    r = __assign({}, trans);
                    if (!trans.payee) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, db_1.getPayee)(trans.payee)];
                case 1:
                    payee = _b.sent();
                    if (payee) {
                        r.payee_name = payee.name;
                    }
                    _b.label = 2;
                case 2:
                    if (!trans.account) return [3 /*break*/, 5];
                    if (!(accounts !== null && accounts.has(trans.account))) return [3 /*break*/, 3];
                    r._account = accounts.get(trans.account);
                    return [3 /*break*/, 5];
                case 3:
                    _a = r;
                    return [4 /*yield*/, (0, db_1.getAccount)(trans.account)];
                case 4:
                    _a._account = _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/, r];
            }
        });
    });
}
function finalizeTransactionForRules(trans) {
    return __awaiter(this, void 0, void 0, function () {
        var payeeId, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!('payee_name' in trans)) return [3 /*break*/, 7];
                    if (!(trans.payee === 'new')) return [3 /*break*/, 6];
                    if (!trans.payee_name) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, db_1.getPayeeByName)(trans.payee_name)];
                case 1:
                    payeeId = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.id;
                    if (!(payeeId !== null && payeeId !== void 0)) return [3 /*break*/, 2];
                    _a = payeeId;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, db_1.insertPayee)({
                        name: trans.payee_name,
                    })];
                case 3:
                    _a = (payeeId = _c.sent());
                    _c.label = 4;
                case 4:
                    _a;
                    trans.payee = payeeId;
                    return [3 /*break*/, 6];
                case 5:
                    trans.payee = null;
                    _c.label = 6;
                case 6:
                    delete trans.payee_name;
                    _c.label = 7;
                case 7: return [2 /*return*/, trans];
            }
        });
    });
}
