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
exports.createSpendingSpreadsheet = createSpendingSpreadsheet;
// @ts-strict-ignore
var keyBy_1 = require("lodash/keyBy");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var makeQuery_1 = require("./makeQuery");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
function createSpendingSpreadsheet(_a) {
    var _this = this;
    var _b = _a.conditions, conditions = _b === void 0 ? [] : _b, conditionsOp = _a.conditionsOp, compare = _a.compare, compareTo = _a.compareTo;
    var startDate = monthUtils.subMonths(compare, 3) + '-01';
    var endDate = monthUtils.getMonthEnd(compare + '-01');
    var startDateTo = compareTo + '-01';
    var endDateTo = monthUtils.getMonthEnd(compareTo + '-01');
    var interval = 'Daily';
    var compareInterval = monthUtils.dayRangeInclusive(compare + '-01', endDate);
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        var filters, budgetFilters, conditionsOpKey, _a, assets, debts, _b, assetsTo, debtsTo, overlapAssets, overlapDebts, combineAssets, combineDebts, budgetMonth, budgets, dailyBudget, intervals, days, totalAssets, totalDebts, totalBudget, months, intervalData;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                        conditions: conditions.filter(function (cond) { return !cond.customName; }),
                    })];
                case 1:
                    filters = (_d.sent()).filters;
                    return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                            conditions: conditions.filter(function (cond) { return !cond.customName && cond.field === 'category'; }),
                            applySpecialCases: false,
                        })];
                case 2:
                    budgetFilters = (_d.sent()).filters;
                    conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                    return [4 /*yield*/, Promise.all([
                            (0, aqlQuery_1.aqlQuery)((0, makeQuery_1.makeQuery)('assets', startDate, endDate, interval, conditionsOpKey, filters)).then(function (_a) {
                                var data = _a.data;
                                return data;
                            }),
                            (0, aqlQuery_1.aqlQuery)((0, makeQuery_1.makeQuery)('debts', startDate, endDate, interval, conditionsOpKey, filters)).then(function (_a) {
                                var data = _a.data;
                                return data;
                            }),
                        ])];
                case 3:
                    _a = _d.sent(), assets = _a[0], debts = _a[1];
                    return [4 /*yield*/, Promise.all([
                            (0, aqlQuery_1.aqlQuery)((0, makeQuery_1.makeQuery)('assets', startDateTo, endDateTo, interval, conditionsOpKey, filters)).then(function (_a) {
                                var data = _a.data;
                                return data;
                            }),
                            (0, aqlQuery_1.aqlQuery)((0, makeQuery_1.makeQuery)('debts', startDateTo, endDateTo, interval, conditionsOpKey, filters)).then(function (_a) {
                                var data = _a.data;
                                return data;
                            }),
                        ])];
                case 4:
                    _b = _d.sent(), assetsTo = _b[0], debtsTo = _b[1];
                    overlapAssets = endDateTo < startDate || startDateTo > endDate ? assetsTo : [];
                    overlapDebts = endDateTo < startDate || startDateTo > endDate ? debtsTo : [];
                    combineAssets = __spreadArray(__spreadArray([], assets, true), overlapAssets, true);
                    combineDebts = __spreadArray(__spreadArray([], debts, true), overlapDebts, true);
                    budgetMonth = parseInt(compare.replace('-', ''));
                    return [4 /*yield*/, Promise.all([
                            (0, aqlQuery_1.aqlQuery)((0, query_1.q)('zero_budgets')
                                .filter({
                                $and: [{ month: { $eq: budgetMonth } }],
                            })
                                .filter((_c = {},
                                _c[conditionsOpKey] = budgetFilters,
                                _c))
                                .groupBy([{ $id: '$category' }])
                                .select([
                                { category: { $id: '$category' } },
                                { amount: { $sum: '$amount' } },
                            ])).then(function (_a) {
                                var data = _a.data;
                                return data;
                            }),
                        ])];
                case 5:
                    budgets = (_d.sent())[0];
                    dailyBudget = budgets &&
                        budgets.reduce(function (a, v) { return (a = a + v.amount); }, 0) / compareInterval.length;
                    intervals = monthUtils.dayRangeInclusive(startDate, endDate);
                    if (endDateTo < startDate || startDateTo > endDate) {
                        intervals.push.apply(intervals, monthUtils.dayRangeInclusive(startDateTo, endDateTo));
                    }
                    days = __spreadArray([], Array(29).keys(), true).filter(function (f) { return f > 0; })
                        .map(function (n) { return n.toString().padStart(2, '0'); });
                    totalAssets = 0;
                    totalDebts = 0;
                    totalBudget = 0;
                    months = monthUtils.rangeInclusive(startDate, endDate).map(function (month) {
                        return { month: month, perMonthAssets: 0, perMonthDebts: 0 };
                    });
                    if (endDateTo < startDate || startDateTo > endDate) {
                        months.unshift({
                            month: compareTo,
                            perMonthAssets: 0,
                            perMonthDebts: 0,
                        });
                    }
                    intervalData = days.map(function (day) {
                        var averageSum = 0;
                        var monthCount = 0;
                        var dayData = months.map(function (month) {
                            var data = intervals.reduce(function (arr, intervalItem) {
                                var offsetDay = Number(intervalItem.substring(8, 10)) >= 28
                                    ? '28'
                                    : intervalItem.substring(8, 10);
                                var perIntervalAssets = 0;
                                var perIntervalDebts = 0;
                                if (month.month === monthUtils.getMonth(intervalItem) &&
                                    day === offsetDay) {
                                    var intervalAssets = combineAssets
                                        .filter(function (e) { return !e.categoryIncome && !e.accountOffBudget; })
                                        .filter(function (asset) { return asset.date === intervalItem; })
                                        .reduce(function (a, v) { return (a = a + v.amount); }, 0);
                                    perIntervalAssets += intervalAssets;
                                    var intervalDebts = combineDebts
                                        .filter(function (e) { return !e.categoryIncome && !e.accountOffBudget; })
                                        .filter(function (debt) { return debt.date === intervalItem; })
                                        .reduce(function (a, v) { return (a = a + v.amount); }, 0);
                                    perIntervalDebts += intervalDebts;
                                    totalAssets += perIntervalAssets;
                                    totalDebts += perIntervalDebts;
                                    var cumulativeAssets_1 = 0;
                                    var cumulativeDebts_1 = 0;
                                    if (month.month === compare) {
                                        totalBudget -= dailyBudget;
                                    }
                                    months.map(function (m) {
                                        if (m.month === month.month) {
                                            cumulativeAssets_1 = m.perMonthAssets += perIntervalAssets;
                                            cumulativeDebts_1 = m.perMonthDebts += perIntervalDebts;
                                        }
                                        return null;
                                    });
                                    if (month.month >= monthUtils.monthFromDate(startDate) &&
                                        month.month < compare) {
                                        if (day === '28') {
                                            if (monthUtils.getMonthEnd(intervalItem) === intervalItem) {
                                                averageSum += cumulativeAssets_1 + cumulativeDebts_1;
                                                monthCount += 1;
                                            }
                                        }
                                        else {
                                            averageSum += cumulativeAssets_1 + cumulativeDebts_1;
                                            monthCount += 1;
                                        }
                                    }
                                    arr.push({
                                        date: intervalItem,
                                        totalDebts: perIntervalDebts,
                                        totalAssets: perIntervalAssets,
                                        totalTotals: perIntervalDebts + perIntervalAssets,
                                        cumulative: intervalItem <= monthUtils.currentDay()
                                            ? cumulativeDebts_1 + cumulativeAssets_1
                                            : null,
                                    });
                                }
                                return arr;
                            }, []);
                            var maxCumulative = data.reduce(function (a, b) {
                                return b.cumulative === null ? a : b;
                            }).cumulative;
                            var totalDaily = data.reduce(function (a, v) { return (a = a + v.totalTotals); }, 0);
                            return {
                                date: data[0].date,
                                cumulative: maxCumulative,
                                daily: totalDaily,
                                month: month.month,
                            };
                        });
                        var indexedData = (0, keyBy_1.default)(dayData, 'month');
                        return {
                            months: indexedData,
                            day: day,
                            average: Math.round(averageSum / monthCount),
                            compare: dayData.filter(function (c) { return c.month === compare; })[0].cumulative,
                            compareTo: dayData.filter(function (c) { return c.month === compareTo; })[0].cumulative,
                            budget: totalBudget,
                        };
                    });
                    setData({
                        intervalData: intervalData,
                        startDate: startDate,
                        endDate: endDate,
                        totalDebts: totalDebts,
                        totalAssets: totalAssets,
                        totalTotals: totalAssets + totalDebts,
                    });
                    return [2 /*return*/];
            }
        });
    }); };
}
