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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarSpreadsheet = calendarSpreadsheet;
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
function calendarSpreadsheet(start, end, conditions, conditionsOp, firstDayOfWeekIdx) {
    var _this = this;
    if (conditions === void 0) { conditions = []; }
    if (conditionsOp === void 0) { conditionsOp = 'and'; }
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        var filters, filtersLocal, error_1, conditionsOpKey, startDay, endDay, makeRootQuery, expenseData, error_2, incomeData, error_3, getOneDatePerMonth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                            conditions: conditions.filter(function (cond) { return !cond.customName; }),
                        })];
                case 1:
                    filtersLocal = (_a.sent()).filters;
                    filters = filtersLocal;
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to make filters from conditions:', error_1);
                    filters = [];
                    return [3 /*break*/, 3];
                case 3:
                    conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                    try {
                        startDay = d.parse(monthUtils.firstDayOfMonth(start), 'yyyy-MM-dd', new Date());
                    }
                    catch (error) {
                        console.error('Failed to parse start date:', error);
                        throw new Error('Invalid start date format');
                    }
                    try {
                        endDay = d.parse(monthUtils.lastDayOfMonth(end), 'yyyy-MM-dd', new Date());
                    }
                    catch (error) {
                        console.error('Failed to parse end date:', error);
                        throw new Error('Invalid end date format');
                    }
                    makeRootQuery = function () {
                        var _a;
                        return (0, query_1.q)('transactions')
                            .filter({
                            $and: [
                                { date: { $gte: d.format(startDay, 'yyyy-MM-dd') } },
                                { date: { $lte: d.format(endDay, 'yyyy-MM-dd') } },
                            ],
                        })
                            .filter((_a = {},
                            _a[conditionsOpKey] = filters,
                            _a))
                            .groupBy(['date'])
                            .select(['date', { amount: { $sum: '$amount' } }]);
                    };
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(makeRootQuery().filter({
                            $and: { amount: { $lt: 0 } },
                        }))];
                case 5:
                    expenseData = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Failed to fetch expense data:', error_2);
                    expenseData = { data: [] };
                    return [3 /*break*/, 7];
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(makeRootQuery().filter({
                            $and: { amount: { $gt: 0 } },
                        }))];
                case 8:
                    incomeData = _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_3 = _a.sent();
                    console.error('Failed to fetch income data:', error_3);
                    incomeData = { data: [] };
                    return [3 /*break*/, 10];
                case 10:
                    getOneDatePerMonth = function (start, end) {
                        var months = [];
                        var currentDate = d.startOfMonth(start);
                        while (!d.isSameMonth(currentDate, end)) {
                            months.push(currentDate);
                            currentDate = d.addMonths(currentDate, 1);
                        }
                        months.push(end);
                        return months;
                    };
                    setData(recalculate(incomeData.data, expenseData.data, getOneDatePerMonth(startDay, endDay), start, firstDayOfWeekIdx));
                    return [2 /*return*/];
            }
        });
    }); };
}
function recalculate(incomeData, expenseData, months, start, firstDayOfWeekIdx) {
    var incomeDataMap = new Map();
    incomeData.forEach(function (item) {
        incomeDataMap.set(item.date, item.amount);
    });
    var expenseDataMap = new Map();
    expenseData.forEach(function (item) {
        expenseDataMap.set(item.date, item.amount);
    });
    var parseAndCacheDate = (function () {
        var cache = new Map();
        return function (dateStr) {
            if (!cache.has(dateStr)) {
                cache.set(dateStr, d.parse(dateStr, 'yyyy-MM-dd', new Date()));
            }
            return cache.get(dateStr);
        };
    })();
    var getDaysArray = function (month) {
        var _a, _b;
        var expenseValues = expenseData
            .filter(function (f) { return d.isSameMonth(parseAndCacheDate(f.date), month); })
            .map(function (m) { return Math.abs(m.amount); });
        var incomeValues = incomeData
            .filter(function (f) { return d.isSameMonth(parseAndCacheDate(f.date), month); })
            .map(function (m) { return Math.abs(m.amount); });
        var totalExpenseValue = expenseValues.length
            ? expenseValues.reduce(function (acc, val) { return acc + val; }, 0)
            : null;
        var totalIncomeValue = incomeValues.length
            ? incomeValues.reduce(function (acc, val) { return acc + val; }, 0)
            : null;
        var getBarLength = function (value) {
            if (value < 0 &&
                typeof totalExpenseValue === 'number' &&
                totalExpenseValue > 0) {
                var result = (Math.abs(value) / totalExpenseValue) * 100;
                return Number.isFinite(result) ? result : 0;
            }
            else if (value > 0 &&
                typeof totalIncomeValue === 'number' &&
                totalIncomeValue > 0) {
                var result = (value / totalIncomeValue) * 100;
                return Number.isFinite(result) ? result : 0;
            }
            else {
                return 0;
            }
        };
        var firstDay = d.startOfMonth(month);
        var beginDay = d.startOfWeek(firstDay, {
            weekStartsOn: firstDayOfWeekIdx !== undefined &&
                !Number.isNaN(parseInt(firstDayOfWeekIdx)) &&
                parseInt(firstDayOfWeekIdx) >= 0 &&
                parseInt(firstDayOfWeekIdx) <= 6
                ? parseInt(firstDayOfWeekIdx)
                : 0,
        });
        var totalDays = d.differenceInDays(firstDay, beginDay) + d.getDaysInMonth(firstDay);
        if (totalDays % 7 !== 0) {
            totalDays += 7 - (totalDays % 7);
        }
        var daysArray = [];
        for (var i = 0; i < totalDays; i++) {
            var currentDate = d.addDays(beginDay, i);
            if (!d.isSameMonth(currentDate, firstDay)) {
                daysArray.push({
                    date: currentDate,
                    incomeValue: 0,
                    expenseValue: 0,
                    incomeSize: 0,
                    expenseSize: 0,
                });
            }
            else {
                var dateKey = d.format(currentDate, 'yyyy-MM-dd');
                var currentIncome = (_a = incomeDataMap.get(dateKey)) !== null && _a !== void 0 ? _a : 0;
                var currentExpense = (_b = expenseDataMap.get(dateKey)) !== null && _b !== void 0 ? _b : 0;
                daysArray.push({
                    date: currentDate,
                    incomeSize: getBarLength(currentIncome),
                    incomeValue: Math.abs(currentIncome),
                    expenseSize: getBarLength(currentExpense),
                    expenseValue: Math.abs(currentExpense),
                });
            }
        }
        return {
            data: daysArray,
            totalExpense: totalExpenseValue !== null && totalExpenseValue !== void 0 ? totalExpenseValue : 0,
            totalIncome: totalIncomeValue !== null && totalIncomeValue !== void 0 ? totalIncomeValue : 0,
        };
    };
    return {
        calendarData: months.map(function (m) {
            return __assign(__assign({}, getDaysArray(m)), { start: d.startOfMonth(m), end: d.endOfMonth(m) });
        }),
    };
}
