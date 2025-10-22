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
exports.createCustomSpreadsheet = createCustomSpreadsheet;
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var calculateLegend_1 = require("./calculateLegend");
var filterEmptyRows_1 = require("./filterEmptyRows");
var filterHiddenItems_1 = require("./filterHiddenItems");
var makeQuery_1 = require("./makeQuery");
var recalculate_1 = require("./recalculate");
var sortData_1 = require("./sortData");
var trimIntervals_1 = require("./trimIntervals");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
function createCustomSpreadsheet(_a) {
    var _this = this;
    var startDate = _a.startDate, endDate = _a.endDate, interval = _a.interval, categories = _a.categories, _b = _a.conditions, conditions = _b === void 0 ? [] : _b, conditionsOp = _a.conditionsOp, showEmpty = _a.showEmpty, showOffBudget = _a.showOffBudget, showHiddenCategories = _a.showHiddenCategories, showUncategorized = _a.showUncategorized, trimIntervals = _a.trimIntervals, _c = _a.groupBy, groupBy = _c === void 0 ? '' : _c, _d = _a.balanceTypeOp, balanceTypeOp = _d === void 0 ? 'totalDebts' : _d, _e = _a.sortByOp, sortByOp = _e === void 0 ? 'desc' : _e, _f = _a.payees, payees = _f === void 0 ? [] : _f, _g = _a.accounts, accounts = _g === void 0 ? [] : _g, graphType = _a.graphType, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, setDataCheck = _a.setDataCheck;
    var _h = (0, ReportOptions_1.categoryLists)(categories), categoryList = _h[0], categoryGroup = _h[1];
    var _j = (0, ReportOptions_1.groupBySelections)(groupBy, categoryList, categoryGroup, payees, accounts), groupByList = _j[0], groupByLabel = _j[1];
    return function (spreadsheet, setData) { return __awaiter(_this, void 0, void 0, function () {
        var filters, conditionsOpKey, assets, debts, intervals, totalAssets, totalDebts, netAssets, netDebts, groupsByCategory, intervalData, calcData, calcDataFiltered, _a, startIndex, endIndex, trimmedIntervalData, sortedCalcDataFiltered, legend;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (groupByList.length === 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                            conditions: conditions.filter(function (cond) { return !cond.customName; }),
                        })];
                case 1:
                    filters = (_c.sent()).filters;
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
                case 2:
                    _b = _c.sent(), assets = _b[0], debts = _b[1];
                    if (interval === 'Weekly') {
                        debts = debts.map(function (d) {
                            return __assign(__assign({}, d), { date: monthUtils.weekFromDate(d.date, firstDayOfWeekIdx) });
                        });
                        assets = assets.map(function (d) {
                            return __assign(__assign({}, d), { date: monthUtils.weekFromDate(d.date, firstDayOfWeekIdx) });
                        });
                    }
                    intervals = interval === 'Weekly'
                        ? monthUtils.weekRangeInclusive(startDate, endDate, firstDayOfWeekIdx)
                        : monthUtils[ReportOptions_1.ReportOptions.intervalRange.get(interval) || 'rangeInclusive'](startDate, endDate);
                    totalAssets = 0;
                    totalDebts = 0;
                    netAssets = 0;
                    netDebts = 0;
                    groupsByCategory = groupByLabel === 'category' || groupByLabel === 'categoryGroup';
                    intervalData = intervals.reduce(function (arr, intervalItem, index) {
                        var perIntervalAssets = 0;
                        var perIntervalDebts = 0;
                        var perIntervalNetAssets = 0;
                        var perIntervalNetDebts = 0;
                        var perIntervalTotals = 0;
                        var stacked = {};
                        groupByList.map(function (item) {
                            var stackAmounts = 0;
                            var intervalAssets = (0, filterHiddenItems_1.filterHiddenItems)(item, assets, showOffBudget, showHiddenCategories, showUncategorized, groupsByCategory)
                                .filter(function (asset) {
                                var _a;
                                return asset.date === intervalItem &&
                                    (asset[groupByLabel] === ((_a = item.id) !== null && _a !== void 0 ? _a : null) ||
                                        (item.uncategorized_id && groupsByCategory));
                            })
                                .reduce(function (a, v) { return (a = a + v.amount); }, 0);
                            perIntervalAssets += intervalAssets;
                            var intervalDebts = (0, filterHiddenItems_1.filterHiddenItems)(item, debts, showOffBudget, showHiddenCategories, showUncategorized, groupsByCategory)
                                .filter(function (debt) {
                                var _a;
                                return debt.date === intervalItem &&
                                    (debt[groupByLabel] === ((_a = item.id) !== null && _a !== void 0 ? _a : null) ||
                                        (item.uncategorized_id && groupsByCategory));
                            })
                                .reduce(function (a, v) { return (a = a + v.amount); }, 0);
                            perIntervalDebts += intervalDebts;
                            var netAmounts = intervalAssets + intervalDebts;
                            if (balanceTypeOp === 'totalAssets') {
                                stackAmounts += intervalAssets;
                            }
                            if (balanceTypeOp === 'totalDebts') {
                                stackAmounts += Math.abs(intervalDebts);
                            }
                            if (balanceTypeOp === 'netAssets') {
                                stackAmounts += netAmounts > 0 ? netAmounts : 0;
                            }
                            if (balanceTypeOp === 'netDebts') {
                                stackAmounts = netAmounts < 0 ? Math.abs(netAmounts) : 0;
                            }
                            if (balanceTypeOp === 'totalTotals') {
                                stackAmounts += netAmounts;
                            }
                            stacked[item.name] = stackAmounts;
                            perIntervalNetAssets =
                                netAmounts > 0
                                    ? perIntervalNetAssets + netAmounts
                                    : perIntervalNetAssets;
                            perIntervalNetDebts =
                                netAmounts < 0
                                    ? perIntervalNetDebts + netAmounts
                                    : perIntervalNetDebts;
                            perIntervalTotals += netAmounts;
                            return null;
                        });
                        totalAssets += perIntervalAssets;
                        totalDebts += perIntervalDebts;
                        netAssets += perIntervalNetAssets;
                        netDebts += perIntervalNetDebts;
                        arr.push(__assign(__assign({ date: d.format(d.parseISO(intervalItem), ReportOptions_1.ReportOptions.intervalFormat.get(interval) || '') }, stacked), { intervalStartDate: index === 0 ? startDate : intervalItem, intervalEndDate: index + 1 === intervals.length
                                ? endDate
                                : monthUtils.subDays(intervals[index + 1], 1), totalAssets: perIntervalAssets, totalDebts: perIntervalDebts, netAssets: perIntervalNetAssets, netDebts: perIntervalNetDebts, totalTotals: perIntervalTotals }));
                        return arr;
                    }, []);
                    calcData = groupByList.map(function (item) {
                        var calc = (0, recalculate_1.recalculate)({
                            item: item,
                            intervals: intervals,
                            assets: assets,
                            debts: debts,
                            groupByLabel: groupByLabel,
                            showOffBudget: showOffBudget,
                            showHiddenCategories: showHiddenCategories,
                            showUncategorized: showUncategorized,
                            startDate: startDate,
                            endDate: endDate,
                        });
                        return __assign({}, calc);
                    });
                    calcDataFiltered = calcData.filter(function (i) {
                        return (0, filterEmptyRows_1.filterEmptyRows)({ showEmpty: showEmpty, data: i, balanceTypeOp: balanceTypeOp });
                    });
                    _a = (0, trimIntervals_1.determineIntervalRange)(calcDataFiltered, intervalData, trimIntervals, balanceTypeOp), startIndex = _a.startIndex, endIndex = _a.endIndex;
                    trimmedIntervalData = trimIntervals
                        ? (0, trimIntervals_1.trimIntervalDataToRange)(intervalData, startIndex, endIndex)
                        : intervalData;
                    if (trimIntervals) {
                        // Keep group data in sync with the trimmed range
                        (0, trimIntervals_1.trimIntervalsToRange)(calcDataFiltered, startIndex, endIndex);
                    }
                    sortedCalcDataFiltered = __spreadArray([], calcDataFiltered, true).sort((0, sortData_1.sortData)({ balanceTypeOp: balanceTypeOp, sortByOp: sortByOp }));
                    legend = (0, calculateLegend_1.calculateLegend)(trimmedIntervalData, sortedCalcDataFiltered, groupBy, graphType, balanceTypeOp);
                    setData({
                        data: sortedCalcDataFiltered,
                        intervalData: trimmedIntervalData,
                        legend: legend,
                        startDate: startDate,
                        endDate: endDate,
                        totalAssets: totalAssets,
                        totalDebts: totalDebts,
                        netAssets: netAssets,
                        netDebts: netDebts,
                        totalTotals: totalAssets + totalDebts,
                    });
                    setDataCheck === null || setDataCheck === void 0 ? void 0 : setDataCheck(true);
                    return [2 /*return*/];
            }
        });
    }); };
}
