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
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.updateConditions = updateConditions;
exports.getRuleForSchedule = getRuleForSchedule;
exports.setNextDate = setNextDate;
exports.createSchedule = createSchedule;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
// @ts-strict-ignore
var d = require("date-fns");
var deep_equal_1 = require("deep-equal");
var uuid_1 = require("uuid");
var exceptions_1 = require("../../platform/exceptions");
var connection = require("../../platform/server/connection");
var log_1 = require("../../platform/server/log");
var months_1 = require("../../shared/months");
var query_1 = require("../../shared/query");
var schedules_1 = require("../../shared/schedules");
var sync_1 = require("../accounts/sync");
var app_1 = require("../app");
var aql_1 = require("../aql");
var db = require("../db");
var models_1 = require("../models");
var mutators_1 = require("../mutators");
var prefs = require("../prefs");
var rules_1 = require("../rules");
var sync_2 = require("../sync");
var transaction_rules_1 = require("../transactions/transaction-rules");
var undo_1 = require("../undo");
var rschedule_1 = require("../util/rschedule");
var find_schedules_1 = require("./find-schedules");
// Utilities
function zip(arr1, arr2) {
    var result = [];
    for (var i = 0; i < arr1.length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
}
function updateConditions(conditions, newConditions) {
    var scheduleConds = (0, schedules_1.extractScheduleConds)(conditions);
    var newScheduleConds = (0, schedules_1.extractScheduleConds)(newConditions);
    var replacements = zip(Object.values(scheduleConds), Object.values(newScheduleConds));
    var updated = conditions.map(function (cond) {
        var r = replacements.find(function (r) { return cond === r[0]; });
        return r && r[1] ? r[1] : cond;
    });
    var added = replacements
        .filter(function (x) { return x[0] == null && x[1] != null; })
        .map(function (x) { return x[1]; });
    return updated.concat(added);
}
function getRuleForSchedule(id) {
    return __awaiter(this, void 0, void 0, function () {
        var ruleId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (id == null) {
                        throw new Error('Schedule not attached to a rule');
                    }
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).calculate('rule'))];
                case 1:
                    ruleId = (_a.sent()).data;
                    return [2 /*return*/, (0, transaction_rules_1.getRules)().find(function (rule) { return rule.id === ruleId; })];
            }
        });
    });
}
function fixRuleForSchedule(id) {
    return __awaiter(this, void 0, void 0, function () {
        var ruleId, newId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).calculate('rule'))];
                case 1:
                    ruleId = (_a.sent()).data;
                    if (!ruleId) return [3 /*break*/, 3];
                    // Take the bad rule out of the system so it never causes problems
                    // in the future
                    return [4 /*yield*/, db.delete_('rules', ruleId)];
                case 2:
                    // Take the bad rule out of the system so it never causes problems
                    // in the future
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                        stage: null,
                        conditionsOp: 'and',
                        conditions: [
                            { op: 'isapprox', field: 'date', value: (0, months_1.currentDay)() },
                            { op: 'isapprox', field: 'amount', value: 0 },
                        ],
                        actions: [{ op: 'link-schedule', value: id }],
                    })];
                case 4:
                    newId = _a.sent();
                    return [4 /*yield*/, db.updateWithSchema('schedules', { id: id, rule: newId })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, (0, transaction_rules_1.getRules)().find(function (rule) { return rule.id === newId; })];
            }
        });
    });
}
function setNextDate(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rule, dateCond, nextDate, newNextDate, nd;
        var id = _b.id, start = _b.start, conditions = _b.conditions, reset = _b.reset;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(conditions == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getRuleForSchedule(id)];
                case 1:
                    rule = _c.sent();
                    if (rule == null) {
                        throw new Error('No rule found for schedule');
                    }
                    conditions = rule.serialize().conditions;
                    _c.label = 2;
                case 2:
                    dateCond = (0, schedules_1.extractScheduleConds)(conditions).date;
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).calculate('next_date'))];
                case 3:
                    nextDate = (_c.sent()).data;
                    if (!dateCond) return [3 /*break*/, 6];
                    newNextDate = (0, schedules_1.getNextDate)(dateCond, start ? start(nextDate) : new Date());
                    if (!(newNextDate !== nextDate)) return [3 /*break*/, 6];
                    return [4 /*yield*/, db.first('SELECT id, base_next_date_ts FROM schedules_next_date WHERE schedule_id = ?', [id])];
                case 4:
                    nd = _c.sent();
                    return [4 /*yield*/, db.update('schedules_next_date', reset
                            ? {
                                id: nd.id,
                                base_next_date: (0, models_1.toDateRepr)(newNextDate),
                                base_next_date_ts: Date.now(),
                            }
                            : {
                                id: nd.id,
                                local_next_date: (0, models_1.toDateRepr)(newNextDate),
                                local_next_date_ts: nd.base_next_date_ts,
                            })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Methods
function checkIfScheduleExists(name, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        var idForName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.first('SELECT id from schedules WHERE tombstone = 0 AND name = ?', [name])];
                case 1:
                    idForName = _a.sent();
                    if (idForName == null) {
                        return [2 /*return*/, false];
                    }
                    if (scheduleId) {
                        return [2 /*return*/, idForName['id'] !== scheduleId];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function createSchedule() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var scheduleId, dateCond, nextDate, nextDateRepr, ruleId, now;
        var _b = _a === void 0 ? {} : _a, _c = _b.schedule, schedule = _c === void 0 ? null : _c, _d = _b.conditions, conditions = _d === void 0 ? [] : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    scheduleId = (schedule === null || schedule === void 0 ? void 0 : schedule.id) || (0, uuid_1.v4)();
                    dateCond = (0, schedules_1.extractScheduleConds)(conditions).date;
                    if (dateCond == null) {
                        throw new Error('A date condition is required to create a schedule');
                    }
                    if (dateCond.value == null) {
                        throw new Error('Date is required');
                    }
                    nextDate = (0, schedules_1.getNextDate)(dateCond);
                    nextDateRepr = nextDate ? (0, models_1.toDateRepr)(nextDate) : null;
                    if (!schedule) return [3 /*break*/, 3];
                    if (!schedule.name) return [3 /*break*/, 2];
                    return [4 /*yield*/, checkIfScheduleExists(schedule.name, scheduleId)];
                case 1:
                    if (_e.sent()) {
                        throw new Error('Cannot create schedules with the same name');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    schedule.name = null;
                    _e.label = 3;
                case 3: return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                        stage: null,
                        conditionsOp: 'and',
                        conditions: conditions,
                        actions: [{ op: 'link-schedule', value: scheduleId }],
                    })];
                case 4:
                    ruleId = _e.sent();
                    now = Date.now();
                    return [4 /*yield*/, db.insertWithUUID('schedules_next_date', {
                            schedule_id: scheduleId,
                            local_next_date: nextDateRepr,
                            local_next_date_ts: now,
                            base_next_date: nextDateRepr,
                            base_next_date_ts: now,
                        })];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, db.insertWithSchema('schedules', __assign(__assign({}, schedule), { id: scheduleId, rule: ruleId }))];
                case 6:
                    _e.sent();
                    return [2 /*return*/, scheduleId];
            }
        });
    });
}
// TODO: don't allow deleting rules that link schedules
function updateSchedule(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rule, dateCond;
        var _this = this;
        var schedule = _b.schedule, conditions = _b.conditions, resetNextDate = _b.resetNextDate;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (schedule.rule) {
                        throw new Error('You cannot change the rule of a schedule');
                    }
                    if (!conditions) return [3 /*break*/, 3];
                    dateCond = (0, schedules_1.extractScheduleConds)(conditions).date;
                    if (dateCond && dateCond.value == null) {
                        throw new Error('Date is required');
                    }
                    return [4 /*yield*/, getRuleForSchedule(schedule.id)];
                case 1:
                    // We need to get the full rule to merge in the updated
                    // conditions
                    rule = _c.sent();
                    if (!(rule == null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fixRuleForSchedule(schedule.id)];
                case 2:
                    // In the edge case that a rule gets corrupted (either by a bug in
                    // the system or user messing with their data), don't crash. We
                    // generate a new rule because schedules have to have a rule
                    // attached to them.
                    rule = _c.sent();
                    _c.label = 3;
                case 3: return [4 /*yield*/, (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var oldConditions, newConditions, stripType;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!conditions) return [3 /*break*/, 4];
                                    oldConditions = rule.serialize().conditions;
                                    newConditions = updateConditions(oldConditions, conditions);
                                    return [4 /*yield*/, (0, transaction_rules_1.updateRule)({ id: rule.id, conditions: newConditions })];
                                case 1:
                                    _a.sent();
                                    stripType = function (_a) {
                                        var type = _a.type, fields = __rest(_a, ["type"]);
                                        return fields;
                                    };
                                    if (!(resetNextDate ||
                                        !(0, deep_equal_1.default)(oldConditions.find(function (c) { return c.field === 'account'; }), oldConditions.find(function (c) { return c.field === 'account'; })) ||
                                        !(0, deep_equal_1.default)(stripType(oldConditions.find(function (c) { return c.field === 'date'; }) || {}), stripType(newConditions.find(function (c) { return c.field === 'date'; }) || {})))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, setNextDate({
                                            id: schedule.id,
                                            conditions: newConditions,
                                            reset: true,
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 6];
                                case 4:
                                    if (!resetNextDate) return [3 /*break*/, 6];
                                    return [4 /*yield*/, setNextDate({ id: schedule.id, reset: true })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6: return [4 /*yield*/, db.updateWithSchema('schedules', schedule)];
                                case 7:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, schedule.id];
            }
        });
    });
}
function deleteSchedule(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var ruleId;
        var _this = this;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).calculate('rule'))];
                case 1:
                    ruleId = (_c.sent()).data;
                    return [4 /*yield*/, (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, db.delete_('rules', ruleId)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, db.delete_('schedules', id)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function skipNextDate(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            return [2 /*return*/, setNextDate({
                    id: id,
                    start: function (nextDate) {
                        return d.addDays((0, months_1.parseDate)(nextDate), 1);
                    },
                })];
        });
    });
}
function discoverSchedules() {
    return (0, find_schedules_1.findSchedules)();
}
function getUpcomingDates(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rules, schedule;
        var config = _b.config, count = _b.count;
        return __generator(this, function (_c) {
            rules = (0, schedules_1.recurConfigToRSchedule)(config);
            try {
                schedule = new rschedule_1.RSchedule({ rrules: rules });
                return [2 /*return*/, schedule
                        .occurrences({ start: d.startOfDay(new Date()), take: count })
                        .toArray()
                        .map(function (date) {
                        return config.skipWeekend
                            ? (0, schedules_1.getDateWithSkippedWeekend)(date.date, config.weekendSolveMode)
                            : date.date;
                    })
                        .map(function (date) { return (0, months_1.dayFromDate)(date); })];
            }
            catch (err) {
                (0, exceptions_1.captureBreadcrumb)(config);
                throw err;
            }
            return [2 /*return*/];
        });
    });
}
// Services
function onRuleUpdate(rule) {
    var _a = rule instanceof rules_1.Rule ? rule.serialize() : transaction_rules_1.ruleModel.toJS(rule), actions = _a.actions, conditions = _a.conditions;
    if (actions && actions.find(function (a) { return a.op === 'link-schedule'; })) {
        var scheduleId = actions.find(function (a) { return a.op === 'link-schedule'; }).value;
        if (scheduleId) {
            var conds_1 = (0, schedules_1.extractScheduleConds)(conditions);
            var payeeIdx = conditions.findIndex(function (c) { return c === conds_1.payee; });
            var accountIdx = conditions.findIndex(function (c) { return c === conds_1.account; });
            var amountIdx = conditions.findIndex(function (c) { return c === conds_1.amount; });
            var dateIdx = conditions.findIndex(function (c) { return c === conds_1.date; });
            db.runQuery('INSERT OR REPLACE INTO schedules_json_paths (schedule_id, payee, account, amount, date) VALUES (?, ?, ?, ?, ?)', [
                scheduleId,
                payeeIdx === -1 ? null : "$[".concat(payeeIdx, "]"),
                accountIdx === -1 ? null : "$[".concat(accountIdx, "]"),
                amountIdx === -1 ? null : "$[".concat(amountIdx, "]"),
                dateIdx === -1 ? null : "$[".concat(dateIdx, "]"),
            ]);
        }
    }
}
function trackJSONPaths() {
    // Populate the table
    db.transaction(function () {
        (0, transaction_rules_1.getRules)().forEach(function (rule) {
            onRuleUpdate(rule);
        });
    });
    return (0, sync_2.addSyncListener)(onApplySync);
}
function onApplySync(oldValues, newValues) {
    newValues.forEach(function (items, table) {
        if (table === 'rules') {
            items.forEach(function (newValue) {
                onRuleUpdate(newValue);
            });
        }
    });
}
// This is the service that move schedules forward automatically and
// posts transactions
function postTransactionForSchedule(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var data, schedule, transaction;
        var id = _b.id, today = _b.today;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).select('*'))];
                case 1:
                    data = (_c.sent()).data;
                    schedule = data[0];
                    if (schedule == null || schedule._account == null) {
                        return [2 /*return*/];
                    }
                    transaction = {
                        payee: schedule._payee,
                        account: schedule._account,
                        amount: (0, schedules_1.getScheduledAmount)(schedule._amount),
                        date: today ? (0, months_1.currentDay)() : schedule.next_date,
                        schedule: schedule.id,
                        cleared: false,
                    };
                    if (!transaction.account) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, sync_1.addTransactions)(transaction.account, [transaction])];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// TODO: make this sequential
function advanceSchedulesService(syncSuccess) {
    return __awaiter(this, void 0, void 0, function () {
        var schedules, hasTransData, hasTrans, failedToPost, didPost, upcomingLength, _i, schedules_2, schedule, status_1, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules')
                        .filter({ completed: false, '_account.closed': false })
                        .select('*'))];
                case 1:
                    schedules = (_c.sent()).data;
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, schedules_1.getHasTransactionsQuery)(schedules))];
                case 2:
                    hasTransData = (_c.sent()).data;
                    hasTrans = new Set(hasTransData.filter(Boolean).map(function (row) { return row.schedule; }));
                    failedToPost = [];
                    didPost = false;
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
                            .filter({ id: 'upcomingScheduledTransactionLength' })
                            .select('value'))];
                case 3:
                    upcomingLength = (_c.sent()).data;
                    _i = 0, schedules_2 = schedules;
                    _c.label = 4;
                case 4:
                    if (!(_i < schedules_2.length)) return [3 /*break*/, 16];
                    schedule = schedules_2[_i];
                    status_1 = (0, schedules_1.getStatus)(schedule.next_date, schedule.completed, hasTrans.has(schedule.id), (_b = (_a = upcomingLength[0]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '7');
                    if (!(status_1 === 'paid')) return [3 /*break*/, 12];
                    if (!schedule._date) return [3 /*break*/, 11];
                    if (!schedule._date.frequency) return [3 /*break*/, 9];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, setNextDate({ id: schedule.id })];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _c.sent();
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 11];
                case 9:
                    if (!(schedule._date < (0, months_1.currentDay)())) return [3 /*break*/, 11];
                    // Complete any single schedules
                    return [4 /*yield*/, updateSchedule({
                            schedule: { id: schedule.id, completed: true },
                        })];
                case 10:
                    // Complete any single schedules
                    _c.sent();
                    _c.label = 11;
                case 11: return [3 /*break*/, 15];
                case 12:
                    if (!((status_1 === 'due' || status_1 === 'missed') &&
                        schedule.posts_transaction &&
                        schedule._account)) return [3 /*break*/, 15];
                    if (!syncSuccess) return [3 /*break*/, 14];
                    return [4 /*yield*/, postTransactionForSchedule({ id: schedule.id })];
                case 13:
                    _c.sent();
                    didPost = true;
                    return [3 /*break*/, 15];
                case 14:
                    failedToPost.push(schedule._payee);
                    _c.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 4];
                case 16:
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
                    return [2 /*return*/];
            }
        });
    });
}
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('schedule/create', (0, mutators_1.mutator)((0, undo_1.undoable)(createSchedule)));
exports.app.method('schedule/update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateSchedule)));
exports.app.method('schedule/delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteSchedule)));
exports.app.method('schedule/skip-next-date', (0, mutators_1.mutator)((0, undo_1.undoable)(skipNextDate)));
exports.app.method('schedule/post-transaction', (0, mutators_1.mutator)((0, undo_1.undoable)(postTransactionForSchedule)));
exports.app.method('schedule/force-run-service', (0, mutators_1.mutator)(function () { return advanceSchedulesService(true); }));
exports.app.method('schedule/discover', discoverSchedules);
exports.app.method('schedule/get-upcoming-dates', getUpcomingDates);
exports.app.service(trackJSONPaths);
exports.app.events.on('sync', function (_a) {
    var type = _a.type;
    var completeEvent = type === 'success' || type === 'error' || type === 'unauthorized';
    if (completeEvent && prefs.getPrefs()) {
        if (!db.getDatabase()) {
            log_1.logger.info('database is not available, skipping schedule service');
            return;
        }
        var lastScheduleRun = prefs.getPrefs().lastScheduleRun;
        if (lastScheduleRun !== (0, months_1.currentDay)()) {
            (0, mutators_1.runMutator)(function () { return advanceSchedulesService(type === 'success'); });
            prefs.savePrefs({ lastScheduleRun: (0, months_1.currentDay)() });
        }
    }
});
