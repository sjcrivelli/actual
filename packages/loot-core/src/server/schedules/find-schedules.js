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
exports.findSchedules = findSchedules;
// @ts-strict-ignore
var d = require("date-fns");
var uuid_1 = require("uuid");
var months_1 = require("../../shared/months");
var query_1 = require("../../shared/query");
var rules_1 = require("../../shared/rules");
var schedules_1 = require("../../shared/schedules");
var util_1 = require("../../shared/util");
var aql_1 = require("../aql");
var db = require("../db");
var models_1 = require("../models");
var transaction_rules_1 = require("../transactions/transaction-rules");
var rschedule_1 = require("../util/rschedule");
function takeDates(config) {
    var schedule = new rschedule_1.RSchedule({ rrules: (0, schedules_1.recurConfigToRSchedule)(config) });
    return schedule
        .occurrences({ take: 3 })
        .toArray()
        .map(function (d) { return d.date; });
}
function getTransactions(date, account) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                        .filter({
                        account: account,
                        schedule: null,
                        // Don't match transfers
                        'payee.transfer_acct': null,
                        $and: [
                            { date: { $gte: d.subDays(date, 2) } },
                            { date: { $lte: d.addDays(date, 2) } },
                        ],
                    })
                        .select('*')
                        .options({ splits: 'none' }))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
function getRank(day1, day2) {
    var dayDiff = Math.abs(d.differenceInDays((0, months_1.parseDate)(day1), (0, months_1.parseDate)(day2)));
    // The amount of days off determines the rank: exact same day
    // is highest rank 1, 1 day off is .5, etc. This will find the
    // best start date that matches all the dates the closest
    return 1 / (dayDiff + 1);
}
function matchSchedules(allOccurs, config) {
    allOccurs = __spreadArray([], allOccurs, true).reverse();
    var baseOccur = allOccurs[0];
    var occurs = allOccurs.slice(1);
    var schedules = [];
    var _loop_1 = function (trans) {
        var threshold = (0, rules_1.getApproxNumberThreshold)(trans.amount);
        var payee = trans.payee;
        var found = occurs.map(function (occur) {
            var matched = occur.transactions.find(function (t) {
                return t.amount >= trans.amount - threshold &&
                    t.amount <= trans.amount + threshold;
            });
            matched = matched && matched.payee === payee ? matched : null;
            if (matched) {
                return { trans: matched, rank: getRank(occur.date, matched.date) };
            }
            return null;
        });
        if (found.indexOf(null) !== -1) {
            return "continue";
        }
        var rank = found.reduce(function (total, match) { return total + match.rank; }, getRank(baseOccur.date, trans.date));
        var exactAmount = found.reduce(function (exact, match) { return exact && match.trans.amount === trans.amount; }, true);
        schedules.push({
            rank: rank,
            amount: trans.amount,
            account: trans.account,
            payee: trans.payee,
            date: config,
            // Exact dates rank as 1, so all of them matches exactly it
            // would equal the number of `allOccurs`
            exactDate: rank === allOccurs.length,
            exactAmount: exactAmount,
        });
    };
    for (var _i = 0, _a = baseOccur.transactions; _i < _a.length; _i++) {
        var trans = _a[_i];
        _loop_1(trans);
    }
    return schedules;
}
function schedulesForPattern(baseStart, numDays, baseConfig, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var schedules, i, start, config, data, dates, _i, dates_1, date, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    schedules = [];
                    i = 0;
                    _d.label = 1;
                case 1:
                    if (!(i < numDays)) return [3 /*break*/, 7];
                    start = d.addDays(baseStart, i);
                    config = void 0;
                    if (typeof baseConfig === 'function') {
                        config = baseConfig(start);
                        if (config === false) {
                            // Skip this one
                            return [3 /*break*/, 6];
                        }
                    }
                    else {
                        config = __assign(__assign({}, baseConfig), { start: start });
                    }
                    // Our recur config expects a day string, not a native date format
                    config.start = (0, months_1.dayFromDate)(config.start);
                    data = [];
                    dates = takeDates(config);
                    _i = 0, dates_1 = dates;
                    _d.label = 2;
                case 2:
                    if (!(_i < dates_1.length)) return [3 /*break*/, 5];
                    date = dates_1[_i];
                    _b = (_a = data).push;
                    _c = {
                        date: (0, months_1.dayFromDate)(date)
                    };
                    return [4 /*yield*/, getTransactions(date, accountId)];
                case 3:
                    _b.apply(_a, [(_c.transactions = _d.sent(),
                            _c)]);
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    schedules = schedules.concat(matchSchedules(data, config));
                    _d.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, schedules];
            }
        });
    });
}
function weekly(startDate, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, schedulesForPattern(d.subWeeks((0, months_1.parseDate)(startDate), 4), 7 * 2, { frequency: 'weekly' }, accountId)];
        });
    });
}
function every2weeks(startDate, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, schedulesForPattern(
                // 6 weeks would cover 3 instances, but we also scan an addition
                // week back
                d.subWeeks((0, months_1.parseDate)(startDate), 7), 7 * 2, { frequency: 'weekly', interval: 2 }, accountId)];
        });
    });
}
function monthly(startDate, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 4), 31 * 2, function (start) {
                    // 28 is the max number of days that all months are guaranteed
                    // to have. We don't want to go any higher than that because
                    // we'll end up skipping months that don't have that day.
                    // The use cases of end of month days will be covered with the
                    // `monthlyLastDay` pattern;
                    if (d.getDate(start) > 28) {
                        return false;
                    }
                    return { start: start, frequency: 'monthly' };
                }, accountId)];
        });
    });
}
function monthlyLastDay(startDate, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var s1, s2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 3), 1, { frequency: 'monthly', patterns: [{ type: 'day', value: -1 }] }, accountId)];
                case 1:
                    s1 = _a.sent();
                    return [4 /*yield*/, schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 4), 1, { frequency: 'monthly', patterns: [{ type: 'day', value: -1 }] }, accountId)];
                case 2:
                    s2 = _a.sent();
                    return [2 /*return*/, s1.concat(s2)];
            }
        });
    });
}
function monthly1stor3rd(startDate, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, schedulesForPattern(d.subWeeks((0, months_1.parseDate)(startDate), 8), 14, function (start) {
                    var day = d.format(new Date(), 'iiii');
                    var dayValue = day.slice(0, 2).toUpperCase();
                    return {
                        start: start,
                        frequency: 'monthly',
                        patterns: [
                            { type: dayValue, value: 1 },
                            { type: dayValue, value: 3 },
                        ],
                    };
                }, accountId)];
        });
    });
}
function monthly2ndor4th(startDate, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, schedulesForPattern(d.subMonths((0, months_1.parseDate)(startDate), 8), 14, function (start) {
                    var day = d.format(new Date(), 'iiii');
                    var dayValue = day.slice(0, 2).toUpperCase();
                    return {
                        start: start,
                        frequency: 'monthly',
                        patterns: [
                            { type: dayValue, value: 2 },
                            { type: dayValue, value: 4 },
                        ],
                    };
                }, accountId)];
        });
    });
}
function findStartDate(schedule) {
    return __awaiter(this, void 0, void 0, function () {
        var conditions, dateCond, currentConfig, prevConfig, newConditions, _a, filters, errors, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    conditions = schedule._conditions;
                    dateCond = conditions.find(function (c) { return c.field === 'date'; });
                    currentConfig = dateCond.value;
                    _b.label = 1;
                case 1:
                    if (!1) return [3 /*break*/, 3];
                    prevConfig = currentConfig;
                    currentConfig = __assign({}, prevConfig);
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
                    newConditions = conditions.map(function (c) {
                        return c.field === 'date' ? __assign(__assign({}, c), { value: currentConfig }) : c;
                    });
                    _a = (0, transaction_rules_1.conditionsToAQL)(newConditions, {
                        recurDateBounds: 1,
                    }), filters = _a.filters, errors = _a.errors;
                    if (errors.length > 0) {
                        // Somehow we generated an invalid config. Abort the whole
                        // process and don't change the date at all
                        currentConfig = null;
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ $and: filters }).select('*'))];
                case 2:
                    data = (_b.sent()).data;
                    if (data.length === 0) {
                        // No data, revert back to the last valid value and stop
                        currentConfig = prevConfig;
                        return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 1];
                case 3:
                    if (currentConfig) {
                        return [2 /*return*/, __assign(__assign({}, schedule), { date: currentConfig, _conditions: conditions.map(function (c) {
                                    return c.field === 'date' ? __assign(__assign({}, c), { value: currentConfig }) : c;
                                }) })];
                    }
                    return [2 /*return*/, schedule];
            }
        });
    });
}
function findSchedules() {
    return __awaiter(this, void 0, void 0, function () {
        var accounts, allSchedules, _i, accounts_1, account, latestTrans, latestDate, _a, _b, _c, schedules, finalized, _d, schedules_2, schedule, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('accounts').filter({ closed: false }).select('*'))];
                case 1:
                    accounts = (_g.sent()).data;
                    allSchedules = [];
                    _i = 0, accounts_1 = accounts;
                    _g.label = 2;
                case 2:
                    if (!(_i < accounts_1.length)) return [3 /*break*/, 11];
                    account = accounts_1[_i];
                    return [4 /*yield*/, db.first('SELECT date FROM v_transactions WHERE account = ? AND parent_id IS NULL ORDER BY date DESC LIMIT 1', [account.id])];
                case 3:
                    latestTrans = _g.sent();
                    if (!latestTrans) return [3 /*break*/, 10];
                    latestDate = (0, models_1.fromDateRepr)(latestTrans.date);
                    _b = (_a = allSchedules).concat;
                    return [4 /*yield*/, weekly(latestDate, account.id)];
                case 4:
                    _c = [_g.sent()];
                    return [4 /*yield*/, every2weeks(latestDate, account.id)];
                case 5:
                    _c = _c.concat([_g.sent()]);
                    return [4 /*yield*/, monthly(latestDate, account.id)];
                case 6:
                    _c = _c.concat([_g.sent()]);
                    return [4 /*yield*/, monthlyLastDay(latestDate, account.id)];
                case 7:
                    _c = _c.concat([_g.sent()]);
                    return [4 /*yield*/, monthly1stor3rd(latestDate, account.id)];
                case 8:
                    _c = _c.concat([_g.sent()]);
                    return [4 /*yield*/, monthly2ndor4th(latestDate, account.id)];
                case 9:
                    allSchedules = _b.apply(_a, _c.concat([_g.sent()]));
                    _g.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 2];
                case 11:
                    schedules = __spreadArray([], (0, util_1.groupBy)(allSchedules, 'payee').entries(), true).map(function (_a) {
                        var schedules = _a[1];
                        schedules.sort(function (s1, s2) { return s2.rank - s1.rank; });
                        var winner = schedules[0];
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
                    finalized = [];
                    _d = 0, schedules_2 = schedules;
                    _g.label = 12;
                case 12:
                    if (!(_d < schedules_2.length)) return [3 /*break*/, 15];
                    schedule = schedules_2[_d];
                    _f = (_e = finalized).push;
                    return [4 /*yield*/, findStartDate(schedule)];
                case 13:
                    _f.apply(_e, [_g.sent()]);
                    _g.label = 14;
                case 14:
                    _d++;
                    return [3 /*break*/, 12];
                case 15: return [2 /*return*/, finalized];
            }
        });
    });
}
