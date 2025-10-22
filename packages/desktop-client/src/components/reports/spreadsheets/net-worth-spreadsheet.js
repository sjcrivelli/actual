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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpreadsheet = createSpreadsheet;
var d = require("date-fns");
var keyBy_1 = require("lodash/keyBy");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
function createSpreadsheet(start, end, accounts, conditions, conditionsOp, locale, interval, firstDayOfWeekIdx, format) {
    var _this = this;
    if (conditions === void 0) { conditions = []; }
    if (conditionsOp === void 0) { conditionsOp = 'and'; }
    if (interval === void 0) { interval = 'Monthly'; }
    if (firstDayOfWeekIdx === void 0) { firstDayOfWeekIdx = '0'; }
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        var filters, conditionsOpKey, startDate, endDate, today, currentWeekStart, data;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                        conditions: conditions.filter(function (cond) { return !cond.customName; }),
                    })];
                case 1:
                    filters = (_a.sent()).filters;
                    conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                    startDate = monthUtils.firstDayOfMonth(start);
                    endDate = monthUtils.lastDayOfMonth(end);
                    if (interval === 'Daily') {
                        today = monthUtils.currentDay();
                        if (monthUtils.isAfter(endDate, today)) {
                            endDate = today;
                        }
                    }
                    else if (interval === 'Weekly') {
                        currentWeekStart = monthUtils.currentWeek(firstDayOfWeekIdx);
                        if (monthUtils.isAfter(endDate, currentWeekStart)) {
                            endDate = currentWeekStart;
                        }
                    }
                    return [4 /*yield*/, Promise.all(accounts.map(function (acct) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, starting, balances, processedBalances, weeklyBalances_1;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, Promise.all([
                                            (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                                .filter((_b = {},
                                                _b[conditionsOpKey] = filters,
                                                _b.account = acct.id,
                                                _b.date = { $lt: startDate },
                                                _b))
                                                .calculate({ $sum: '$amount' })).then(function (_a) {
                                                var data = _a.data;
                                                return data;
                                            }),
                                            (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                                .filter((_c = {},
                                                _c[conditionsOpKey] = filters,
                                                _c))
                                                .filter({
                                                account: acct.id,
                                                $and: [
                                                    { date: { $gte: startDate } },
                                                    { date: { $lte: endDate } },
                                                ],
                                            })
                                                .groupBy(interval === 'Yearly'
                                                ? { $year: '$date' }
                                                : interval === 'Daily' || interval === 'Weekly'
                                                    ? 'date'
                                                    : { $month: '$date' })
                                                .select([
                                                {
                                                    date: interval === 'Yearly'
                                                        ? { $year: '$date' }
                                                        : interval === 'Daily' || interval === 'Weekly'
                                                            ? 'date'
                                                            : { $month: '$date' },
                                                },
                                                { amount: { $sum: '$amount' } },
                                            ])).then(function (_a) {
                                                var data = _a.data;
                                                return data;
                                            }),
                                        ])];
                                    case 1:
                                        _a = _d.sent(), starting = _a[0], balances = _a[1];
                                        if (interval === 'Weekly') {
                                            weeklyBalances_1 = {};
                                            balances.forEach(function (b) {
                                                var weekDate = monthUtils.weekFromDate(b.date, firstDayOfWeekIdx);
                                                weeklyBalances_1[weekDate] =
                                                    (weeklyBalances_1[weekDate] || 0) + b.amount;
                                            });
                                            // Convert back to Balance format
                                            processedBalances = {};
                                            Object.entries(weeklyBalances_1).forEach(function (_a) {
                                                var date = _a[0], amount = _a[1];
                                                processedBalances[date] = { date: date, amount: amount };
                                            });
                                        }
                                        else {
                                            processedBalances = (0, keyBy_1.default)(balances, 'date');
                                        }
                                        return [2 /*return*/, {
                                                id: acct.id,
                                                balances: processedBalances,
                                                starting: starting,
                                            }];
                                }
                            });
                        }); }))];
                case 2:
                    data = _a.sent();
                    setData(recalculate(data, startDate, endDate, locale, interval, firstDayOfWeekIdx, format));
                    return [2 /*return*/];
            }
        });
    }); };
}
function recalculate(data, startDate, endDate, locale, interval, firstDayOfWeekIdx, format) {
    if (interval === void 0) { interval = 'Monthly'; }
    if (firstDayOfWeekIdx === void 0) { firstDayOfWeekIdx = '0'; }
    // Get intervals using the same pattern as other working spreadsheets
    var intervals = interval === 'Weekly'
        ? monthUtils.weekRangeInclusive(startDate, endDate, firstDayOfWeekIdx)
        : interval === 'Daily'
            ? monthUtils.dayRangeInclusive(startDate, endDate)
            : interval === 'Yearly'
                ? monthUtils.yearRangeInclusive(startDate, endDate)
                : monthUtils.rangeInclusive(monthUtils.getMonth(startDate), monthUtils.getMonth(endDate));
    var accountBalances = data.map(function (account) {
        var balance = account.starting;
        return intervals.map(function (intervalItem) {
            if (account.balances[intervalItem]) {
                balance += account.balances[intervalItem].amount;
            }
            return balance;
        });
    });
    var hasNegative = false;
    var startNetWorth = 0;
    var endNetWorth = 0;
    var lowestNetWorth = null;
    var highestNetWorth = null;
    var graphData = intervals.reduce(function (arr, intervalItem, idx) {
        var _a;
        var debt = 0;
        var assets = 0;
        var total = 0;
        var last = arr.length === 0 ? null : arr[arr.length - 1];
        accountBalances.forEach(function (balances) {
            var balance = balances[idx];
            if (balance < 0) {
                debt += -balance;
            }
            else {
                assets += balance;
            }
            total += balance;
        });
        if (total < 0) {
            hasNegative = true;
        }
        // Parse dates based on interval type - following the working pattern
        var x;
        if (interval === 'Daily' || interval === 'Weekly') {
            x = d.parseISO(intervalItem);
        }
        else if (interval === 'Yearly') {
            x = d.parseISO(intervalItem + '-01-01');
        }
        else {
            x = d.parseISO(intervalItem + '-01');
        }
        var change = last ? total - last.y : 0;
        if (arr.length === 0) {
            startNetWorth = total;
        }
        endNetWorth = total;
        // Use standardized format from ReportOptions
        var displayFormat = (_a = ReportOptions_1.ReportOptions.intervalFormat.get(interval)) !== null && _a !== void 0 ? _a : 'MMM ‘yy';
        var tooltipFormat = interval === 'Daily'
            ? 'MMMM d, yyyy'
            : interval === 'Weekly'
                ? 'MMM d, yyyy'
                : interval === 'Yearly'
                    ? 'yyyy'
                    : 'MMMM yyyy';
        var graphPoint = {
            x: d.format(x, displayFormat, { locale: locale }),
            y: total,
            assets: format(assets, 'financial'),
            debt: "-".concat(format(debt, 'financial')),
            change: format(change, 'financial'),
            networth: format(total, 'financial'),
            date: d.format(x, tooltipFormat, { locale: locale }),
        };
        arr.push(graphPoint);
        // Track min/max for the current point only
        if (lowestNetWorth === null || graphPoint.y < lowestNetWorth) {
            lowestNetWorth = graphPoint.y;
        }
        if (highestNetWorth === null || graphPoint.y > highestNetWorth) {
            highestNetWorth = graphPoint.y;
        }
        return arr;
    }, []);
    return {
        graphData: {
            data: graphData,
            hasNegative: hasNegative,
            start: startDate,
            end: endDate,
        },
        netWorth: endNetWorth,
        totalChange: endNetWorth - startNetWorth,
        lowestNetWorth: lowestNetWorth,
        highestNetWorth: highestNetWorth,
    };
}
