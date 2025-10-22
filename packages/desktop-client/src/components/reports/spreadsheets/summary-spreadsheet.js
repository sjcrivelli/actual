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
exports.summarySpreadsheet = summarySpreadsheet;
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
function summarySpreadsheet(start, end, conditions, conditionsOp, summaryContent, locale) {
    var _this = this;
    if (conditions === void 0) { conditions = []; }
    if (conditionsOp === void 0) { conditionsOp = 'and'; }
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        var filters, response, error_1, conditionsOpKey, startDay, endDay, getOneDatePerMonth, makeRootQuery, query, data, error_2, dateRanges, _a, months, _b, _c;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    filters = [];
                    _p.label = 1;
                case 1:
                    _p.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                            conditions: conditions.filter(function (cond) { return !cond.customName; }),
                        })];
                case 2:
                    response = _p.sent();
                    filters = response.filters;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _p.sent();
                    console.error('Error fetching filters:', error_1);
                    return [3 /*break*/, 4];
                case 4:
                    conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                    try {
                        startDay = d.parse(monthUtils.firstDayOfMonth(start), 'yyyy-MM-dd', new Date());
                        endDay = d.parse(monthUtils.getMonth(end) ===
                            monthUtils.getMonth(monthUtils.currentDay())
                            ? monthUtils.currentDay()
                            : monthUtils.lastDayOfMonth(end), 'yyyy-MM-dd', new Date());
                    }
                    catch (error) {
                        console.error('Error parsing dates:', error);
                        throw new Error('Invalid date format provided');
                    }
                    if (!d.isValid(startDay) || !d.isValid(endDay)) {
                        throw new Error('Invalid date values provided');
                    }
                    if (d.isAfter(startDay, endDay)) {
                        throw new Error('Start date must be before or equal to end date.');
                    }
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
                    makeRootQuery = function () {
                        var _a;
                        return (0, query_1.q)('transactions')
                            .filter({
                            $and: [
                                {
                                    date: {
                                        $gte: d.format(startDay, 'yyyy-MM-dd'),
                                    },
                                },
                                {
                                    date: {
                                        $lte: d.format(endDay, 'yyyy-MM-dd'),
                                    },
                                },
                            ],
                        })
                            .filter((_a = {},
                            _a[conditionsOpKey] = filters,
                            _a))
                            .select([
                            'date',
                            { amount: { $sum: '$amount' } },
                            { count: { $count: '*' } },
                        ]);
                    };
                    query = makeRootQuery();
                    if (summaryContent.type === 'avgPerMonth' ||
                        summaryContent.type === 'avgPerYear') {
                        query = query.groupBy(['date']);
                    }
                    _p.label = 5;
                case 5:
                    _p.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(query)];
                case 6:
                    data = _p.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _p.sent();
                    console.error('Error executing query:', error_2);
                    return [2 /*return*/];
                case 8:
                    dateRanges = {
                        fromRange: d.format(startDay, 'MMM yy', { locale: locale }),
                        toRange: d.format(endDay, 'MMM yy', { locale: locale }),
                    };
                    _a = summaryContent.type;
                    switch (_a) {
                        case 'sum': return [3 /*break*/, 9];
                        case 'avgPerTransact': return [3 /*break*/, 10];
                        case 'avgPerMonth': return [3 /*break*/, 11];
                        case 'avgPerYear': return [3 /*break*/, 12];
                        case 'percentage': return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 15];
                case 9:
                    setData(__assign(__assign({}, dateRanges), { total: (_e = (_d = data.data[0]) === null || _d === void 0 ? void 0 : _d.amount) !== null && _e !== void 0 ? _e : 0, dividend: (_g = (_f = data.data[0]) === null || _f === void 0 ? void 0 : _f.amount) !== null && _g !== void 0 ? _g : 0, divisor: 0 }));
                    return [3 /*break*/, 16];
                case 10:
                    setData(__assign(__assign({}, dateRanges), { total: ((_j = (_h = data.data[0]) === null || _h === void 0 ? void 0 : _h.count) !== null && _j !== void 0 ? _j : 0)
                            ? ((_l = (_k = data.data[0]) === null || _k === void 0 ? void 0 : _k.amount) !== null && _l !== void 0 ? _l : 0) / data.data[0].count
                            : 0, dividend: (_o = (_m = data.data[0]) === null || _m === void 0 ? void 0 : _m.amount) !== null && _o !== void 0 ? _o : 0, divisor: data.data[0].count }));
                    return [3 /*break*/, 16];
                case 11:
                    {
                        months = getOneDatePerMonth(startDay, endDay);
                        setData(__assign(__assign({}, dateRanges), calculatePerMonth(data.data, months)));
                        return [3 /*break*/, 16];
                    }
                    _p.label = 12;
                case 12:
                    {
                        setData(__assign(__assign({}, dateRanges), calculatePerYear(data.data, startDay, endDay)));
                        return [3 /*break*/, 16];
                    }
                    _p.label = 13;
                case 13:
                    _b = setData;
                    _c = [__assign({}, dateRanges)];
                    return [4 /*yield*/, calculatePercentage(data.data, summaryContent, startDay, endDay)];
                case 14:
                    _b.apply(void 0, [__assign.apply(void 0, _c.concat([(_p.sent())]))]);
                    return [3 /*break*/, 16];
                case 15: throw new Error("Unsupported summary type");
                case 16: return [2 /*return*/];
            }
        });
    }); };
}
function calculatePerMonth(data, months) {
    if (!data.length || !months.length) {
        return { total: 0, dividend: 0, divisor: 0 };
    }
    var monthlyData = data.reduce(function (acc, day) {
        var monthKey = d.format(d.parse(day.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM');
        acc[monthKey] = (acc[monthKey] || 0) + day.amount;
        return acc;
    }, {});
    var monthsSum = months.map(function (m) { return ({
        amount: monthlyData[d.format(m, 'yyyy-MM')] || 0,
    }); });
    var lastMonth = months.at(-1);
    var dayOfMonth = lastMonth.getDate();
    var daysInMonth = monthUtils.getDay(monthUtils.lastDayOfMonth(lastMonth));
    var numMonths = months.length - 1 + dayOfMonth / daysInMonth;
    var totalAmount = monthsSum.reduce(function (sum, month) { return sum + month.amount; }, 0);
    var averageAmountPerMonth = totalAmount / numMonths;
    return {
        total: averageAmountPerMonth,
        dividend: totalAmount,
        divisor: numMonths,
    };
}
function calculatePerYear(data, startDate, endDate) {
    if (!data.length) {
        return { total: 0, dividend: 0, divisor: 0 };
    }
    var totalAmount = data.reduce(function (sum, day) { return sum + day.amount; }, 0);
    var totalDays = d.differenceInDays(endDate, startDate) + 1;
    var numYears = totalDays / 365.25;
    var averageAmountPerYear = totalAmount / numYears;
    return {
        total: averageAmountPerYear,
        dividend: totalAmount,
        divisor: numYears,
    };
}
function calculatePercentage(data, summaryContent, startDay, endDay) {
    return __awaiter(this, void 0, void 0, function () {
        var conditionsOpKey, filters, response, error_3, makeDivisorQuery, query, divisorData, error_4, divisorValue, dividend;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (summaryContent.type !== 'percentage') {
                        return [2 /*return*/, {
                                total: 0,
                                dividend: 0,
                                divisor: 0,
                            }];
                    }
                    conditionsOpKey = summaryContent.divisorConditionsOp === 'or' ? '$or' : '$and';
                    filters = [];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                            conditions: (_a = summaryContent === null || summaryContent === void 0 ? void 0 : summaryContent.divisorConditions) === null || _a === void 0 ? void 0 : _a.filter(function (cond) { return !cond.customName; }),
                        })];
                case 2:
                    response = _f.sent();
                    filters = response.filters;
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _f.sent();
                    console.error('Error creating filters:', error_3);
                    return [2 /*return*/, {
                            total: 0,
                            dividend: 0,
                            divisor: 0,
                        }];
                case 4:
                    makeDivisorQuery = function () {
                        var _a;
                        return (0, query_1.q)('transactions')
                            .filter((_a = {},
                            _a[conditionsOpKey] = filters,
                            _a))
                            .select([{ amount: { $sum: '$amount' } }]);
                    };
                    query = makeDivisorQuery();
                    if (!((_b = summaryContent.divisorAllTimeDateRange) !== null && _b !== void 0 ? _b : false)) {
                        query = query.filter({
                            $and: [
                                {
                                    date: {
                                        $gte: d.format(startDay, 'yyyy-MM-dd'),
                                    },
                                },
                                {
                                    date: {
                                        $lte: d.format(endDay, 'yyyy-MM-dd'),
                                    },
                                },
                            ],
                        });
                    }
                    _f.label = 5;
                case 5:
                    _f.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(query)];
                case 6:
                    divisorData = (_f.sent());
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _f.sent();
                    console.error('Error executing divisor query:', error_4);
                    return [2 /*return*/, {
                            total: 0,
                            dividend: 0,
                            divisor: 0,
                        }];
                case 8:
                    divisorValue = (_e = (_d = (_c = divisorData === null || divisorData === void 0 ? void 0 : divisorData.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.amount) !== null && _e !== void 0 ? _e : 0;
                    dividend = data.reduce(function (prev, ac) { var _a; return prev + ((_a = ac === null || ac === void 0 ? void 0 : ac.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, {
                            total: Math.round(((dividend !== null && dividend !== void 0 ? dividend : 0) / (divisorValue !== null && divisorValue !== void 0 ? divisorValue : 1)) * 10000) / 100,
                            divisor: divisorValue !== null && divisorValue !== void 0 ? divisorValue : 0,
                            dividend: dividend !== null && dividend !== void 0 ? dividend : 0,
                        }];
            }
        });
    });
}
