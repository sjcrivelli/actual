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
exports.CustomReport = CustomReport;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var block_1 = require("@actual-app/components/block");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var alerts_1 = require("@desktop-client/components/alerts");
var AppliedFilters_1 = require("@desktop-client/components/filters/AppliedFilters");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var Page_1 = require("@desktop-client/components/Page");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var ChooseGraph_1 = require("@desktop-client/components/reports/ChooseGraph");
var disabledList_1 = require("@desktop-client/components/reports/disabledList");
var getLiveRange_1 = require("@desktop-client/components/reports/getLiveRange");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ReportLegend_1 = require("@desktop-client/components/reports/ReportLegend");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
var ReportSidebar_1 = require("@desktop-client/components/reports/ReportSidebar");
var ReportSummary_1 = require("@desktop-client/components/reports/ReportSummary");
var ReportTopbar_1 = require("@desktop-client/components/reports/ReportTopbar");
var setSessionReport_1 = require("@desktop-client/components/reports/setSessionReport");
var custom_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/custom-spreadsheet");
var grouped_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/grouped-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var util_1 = require("@desktop-client/components/reports/util");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useReport_2 = require("@desktop-client/hooks/useReport");
var useRuleConditionFilters_1 = require("@desktop-client/hooks/useRuleConditionFilters");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
/**
 * Transform `selectedCategories` into `conditions`.
 */
function useSelectedCategories(conditions, categories) {
    var existingCategoryCondition = (0, react_1.useMemo)(function () { return conditions.find(function (_a) {
        var field = _a.field;
        return field === 'category';
    }); }, [conditions]);
    return (0, react_1.useMemo)(function () {
        if (!existingCategoryCondition) {
            return categories;
        }
        switch (existingCategoryCondition.op) {
            case 'is':
                return categories.filter(function (_a) {
                    var id = _a.id;
                    return id === existingCategoryCondition.value;
                });
            case 'isNot':
                return categories.filter(function (_a) {
                    var id = _a.id;
                    return existingCategoryCondition.value !== id;
                });
            case 'oneOf':
                return categories.filter(function (_a) {
                    var id = _a.id;
                    return existingCategoryCondition.value.includes(id);
                });
            case 'notOneOf':
                return categories.filter(function (_a) {
                    var id = _a.id;
                    return !existingCategoryCondition.value.includes(id);
                });
        }
        return categories;
    }, [existingCategoryCondition, categories]);
}
function CustomReport() {
    var _a;
    var params = (0, react_router_1.useParams)();
    var _b = (0, useReport_2.useReport)((_a = params.id) !== null && _a !== void 0 ? _a : ''), report = _b.data, isLoading = _b.isLoading;
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator />;
    }
    return <CustomReportInner key={report === null || report === void 0 ? void 0 : report.id} report={report}/>;
}
function CustomReportInner(_a) {
    var _b, _c, _d;
    var initialReport = _a.report;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var categories = (0, useCategories_1.useCategories)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    var _e = (0, useLocalPref_1.useLocalPref)('reportsViewLegend'), _f = _e[0], viewLegend = _f === void 0 ? false : _f, setViewLegendPref = _e[1];
    var _g = (0, useLocalPref_1.useLocalPref)('reportsViewSummary'), _h = _g[0], viewSummary = _h === void 0 ? false : _h, setViewSummaryPref = _g[1];
    var _j = (0, useLocalPref_1.useLocalPref)('reportsViewLabel'), _k = _j[0], viewLabels = _k === void 0 ? false : _k, setViewLabelsPref = _j[1];
    var _l = (0, useRuleConditionFilters_1.useRuleConditionFilters)(), conditions = _l.conditions, conditionsOp = _l.conditionsOp, onApplyFilter = _l.onApply, onDeleteFilter = _l.onDelete, onUpdateFilter = _l.onUpdate, onConditionsOpChange = _l.onConditionsOpChange;
    var location = (0, react_router_1.useLocation)();
    var prevUrl = sessionStorage.getItem('url') || '';
    sessionStorage.setItem('prevUrl', prevUrl);
    sessionStorage.setItem('url', location.pathname);
    if (['/reports'].includes(prevUrl))
        sessionStorage.clear();
    var reportFromSessionStorage = sessionStorage.getItem('report');
    var session = reportFromSessionStorage
        ? JSON.parse(reportFromSessionStorage)
        : {};
    var combine = initialReport !== null && initialReport !== void 0 ? initialReport : ReportOptions_1.defaultReport;
    var loadReport = __assign(__assign({}, combine), session);
    var _m = (0, react_1.useState)([]), allIntervals = _m[0], setAllIntervals = _m[1];
    // Complex category conditions are:
    // - conditions with multiple "category" fields
    // - conditions with "category" field that use "contains", "doesNotContain" or "matches" operations
    var isComplexCategoryCondition = !!conditions.find(function (_a) {
        var field = _a.field, op = _a.op;
        return field === 'category' &&
            ['contains', 'doesNotContain', 'matches', 'hasTags'].includes(op);
    }) || conditions.filter(function (_a) {
        var field = _a.field;
        return field === 'category';
    }).length >= 2;
    var setSelectedCategories = function (newCategories) {
        var newCategoryIdSet = new Set(newCategories.map(function (_a) {
            var id = _a.id;
            return id;
        }));
        var allCategoryIds = categories.list.map(function (_a) {
            var id = _a.id;
            return id;
        });
        var allCategoriesSelected = !allCategoryIds.find(function (id) { return !newCategoryIdSet.has(id); });
        var newCondition = {
            field: 'category',
            op: 'oneOf',
            value: newCategories.map(function (_a) {
                var id = _a.id;
                return id;
            }),
            type: 'id',
        };
        var existingCategoryCondition = conditions.find(function (_a) {
            var field = _a.field;
            return field === 'category';
        });
        // If the existing conditions already have one for "category" - replace it
        if (existingCategoryCondition) {
            // If we selected all categories - remove the filter (default state)
            if (allCategoriesSelected) {
                onDeleteFilter(existingCategoryCondition);
                return;
            }
            // Update the "notOneOf" condition if it's already set
            if (existingCategoryCondition.op === 'notOneOf') {
                onUpdateFilter(existingCategoryCondition, __assign(__assign({}, existingCategoryCondition), { value: allCategoryIds.filter(function (id) { return !newCategoryIdSet.has(id); }) }));
                return;
            }
            // Otherwise use `oneOf` condition
            onUpdateFilter(existingCategoryCondition, newCondition);
            return;
        }
        // Don't add a new filter if all categories are selected (default state)
        if (allCategoriesSelected) {
            return;
        }
        // If the existing conditions does not have a "category" - append a new one
        onApplyFilter(newCondition);
    };
    var selectedCategories = useSelectedCategories(conditions, categories.list);
    var _o = (0, react_1.useState)(loadReport.startDate), startDate = _o[0], setStartDate = _o[1];
    var _p = (0, react_1.useState)(loadReport.endDate), endDate = _p[0], setEndDate = _p[1];
    var _q = (0, react_1.useState)(loadReport.mode), mode = _q[0], setMode = _q[1];
    var _r = (0, react_1.useState)(loadReport.isDateStatic), isDateStatic = _r[0], setIsDateStatic = _r[1];
    var _s = (0, react_1.useState)(loadReport.groupBy), groupBy = _s[0], setGroupBy = _s[1];
    var _t = (0, react_1.useState)(loadReport.interval), interval = _t[0], setInterval = _t[1];
    var _u = (0, react_1.useState)(loadReport.balanceType), balanceType = _u[0], setBalanceType = _u[1];
    var _v = (0, react_1.useState)(loadReport.sortBy), sortBy = _v[0], setSortBy = _v[1];
    var _w = (0, react_1.useState)(loadReport.showEmpty), showEmpty = _w[0], setShowEmpty = _w[1];
    var _x = (0, react_1.useState)(loadReport.showOffBudget), showOffBudget = _x[0], setShowOffBudget = _x[1];
    var _y = (0, react_1.useState)(loadReport.includeCurrentInterval), includeCurrentInterval = _y[0], setIncludeCurrentInterval = _y[1];
    var _z = (0, react_1.useState)(loadReport.showHiddenCategories), showHiddenCategories = _z[0], setShowHiddenCategories = _z[1];
    var _0 = (0, react_1.useState)(loadReport.showUncategorized), showUncategorized = _0[0], setShowUncategorized = _0[1];
    var _1 = (0, react_1.useState)(loadReport.trimIntervals), trimIntervals = _1[0], setTrimIntervals = _1[1];
    var _2 = (0, react_1.useState)(loadReport.graphType), graphType = _2[0], setGraphType = _2[1];
    var _3 = (0, react_1.useState)(loadReport.dateRange), dateRange = _3[0], setDateRange = _3[1];
    var _4 = (0, react_1.useState)(false), dataCheck = _4[0], setDataCheck = _4[1];
    var dateRangeLine = interval === 'Daily'
        ? 0
        : ReportOptions_1.ReportOptions.dateRange.filter(function (f) { return f[interval]; })
            .length - 3;
    var _5 = (0, react_1.useState)(monthUtils.rangeInclusive(startDate, endDate)), intervals = _5[0], setIntervals = _5[1];
    var _6 = (0, react_1.useState)(''), earliestTransaction = _6[0], setEarliestTransaction = _6[1];
    var _7 = (0, react_1.useState)(''), latestTransaction = _7[0], setLatestTransaction = _7[1];
    var _8 = (0, react_1.useState)(loadReport), report = _8[0], setReport = _8[1];
    var _9 = (0, react_1.useState)((_b = session.savedStatus) !== null && _b !== void 0 ? _b : (initialReport ? 'saved' : 'new')), savedStatus = _9[0], setSavedStatus = _9[1];
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var filtersToApply, conditionsOpToApply, earliestTransaction, latestTransaction, fromDate, earliestInterval, latestInterval, allIntervals, allIntervalsMap, _a, dateStart, dateEnd;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            onApplyFilter(null);
                            filtersToApply = savedStatus !== 'saved' ? conditions : report.conditions;
                            conditionsOpToApply = savedStatus !== 'saved' ? conditionsOp : report.conditionsOp;
                            filtersToApply === null || filtersToApply === void 0 ? void 0 : filtersToApply.forEach(function (condition) {
                                return onApplyFilter(condition);
                            });
                            onConditionsOpChange(conditionsOpToApply);
                            return [4 /*yield*/, (0, fetch_1.send)('get-earliest-transaction')];
                        case 1:
                            earliestTransaction = _b.sent();
                            setEarliestTransaction(earliestTransaction
                                ? earliestTransaction.date
                                : monthUtils.currentDay());
                            return [4 /*yield*/, (0, fetch_1.send)('get-latest-transaction')];
                        case 2:
                            latestTransaction = _b.sent();
                            setLatestTransaction(latestTransaction ? latestTransaction.date : monthUtils.currentDay());
                            fromDate = interval === 'Weekly'
                                ? 'dayFromDate'
                                : ((ReportOptions_1.ReportOptions.intervalMap.get(interval) || 'Day').toLowerCase() +
                                    'FromDate');
                            earliestInterval = interval === 'Weekly'
                                ? monthUtils.weekFromDate(d.parseISO((0, util_1.fromDateRepr)(earliestTransaction.date || monthUtils.currentDay())), firstDayOfWeekIdx)
                                : monthUtils[fromDate](d.parseISO((0, util_1.fromDateRepr)(earliestTransaction.date || monthUtils.currentDay())));
                            latestInterval = interval === 'Weekly'
                                ? monthUtils.weekFromDate(d.parseISO((0, util_1.fromDateRepr)(latestTransaction.date || monthUtils.currentDay())), firstDayOfWeekIdx)
                                : monthUtils[fromDate](d.parseISO((0, util_1.fromDateRepr)(latestTransaction.date || monthUtils.currentDay())));
                            allIntervals = interval === 'Weekly'
                                ? monthUtils.weekRangeInclusive(earliestInterval, latestInterval, firstDayOfWeekIdx)
                                : monthUtils[ReportOptions_1.ReportOptions.intervalRange.get(interval) || 'rangeInclusive'](earliestInterval, latestInterval);
                            allIntervalsMap = allIntervals
                                .map(function (inter) { return ({
                                name: inter,
                                pretty: monthUtils.format(inter, ReportOptions_1.ReportOptions.intervalFormat.get(interval) || '', locale),
                            }); })
                                .reverse();
                            setAllIntervals(allIntervalsMap);
                            if (!isDateStatic) {
                                _a = (0, getLiveRange_1.getLiveRange)(dateRange, earliestTransaction
                                    ? earliestTransaction.date
                                    : monthUtils.currentDay(), latestTransaction ? latestTransaction.date : monthUtils.currentDay(), includeCurrentInterval, firstDayOfWeekIdx), dateStart = _a[0], dateEnd = _a[1];
                                setStartDate(dateStart);
                                setEndDate(dateEnd);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
        // omitted `conditions` and `conditionsOp` from dependencies to avoid infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        interval,
        dateRange,
        firstDayOfWeekIdx,
        isDateStatic,
        onApplyFilter,
        onConditionsOpChange,
        report.conditions,
        report.conditionsOp,
        includeCurrentInterval,
        locale,
        savedStatus,
    ]);
    (0, react_1.useEffect)(function () {
        var _a = [startDate, endDate], start = _a[0], end = _a[1];
        if (interval === 'Weekly') {
            setIntervals(monthUtils.weekRangeInclusive(start, end, firstDayOfWeekIdx));
        }
        else {
            setIntervals(monthUtils[ReportOptions_1.ReportOptions.intervalRange.get(interval) || 'rangeInclusive'](start, end));
        }
    }, [interval, startDate, endDate, firstDayOfWeekIdx]);
    var balanceTypeOp = ReportOptions_1.ReportOptions.balanceTypeMap.get(balanceType) || 'totalDebts';
    var sortByOp = sortBy || 'desc';
    var payees = (0, usePayees_1.usePayees)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var hasWarning = (0, util_1.calculateHasWarning)(conditions, {
        categories: categories.list,
        payees: payees,
        accounts: accounts,
    });
    var getGroupData = (0, react_1.useMemo)(function () {
        return (0, grouped_spreadsheet_1.createGroupedSpreadsheet)({
            startDate: startDate,
            endDate: endDate,
            interval: interval,
            categories: categories,
            conditions: conditions,
            conditionsOp: conditionsOp,
            showEmpty: showEmpty,
            showOffBudget: showOffBudget,
            showHiddenCategories: showHiddenCategories,
            showUncategorized: showUncategorized,
            trimIntervals: trimIntervals,
            balanceTypeOp: balanceTypeOp,
            sortByOp: sortByOp,
            firstDayOfWeekIdx: firstDayOfWeekIdx,
        });
    }, [
        startDate,
        endDate,
        interval,
        balanceTypeOp,
        categories,
        conditions,
        conditionsOp,
        showEmpty,
        showOffBudget,
        showHiddenCategories,
        showUncategorized,
        trimIntervals,
        sortByOp,
        firstDayOfWeekIdx,
    ]);
    var getGraphData = (0, react_1.useMemo)(function () {
        // TODO: fix me - state mutations should not happen inside `useMemo`
        setDataCheck(false);
        return (0, custom_spreadsheet_1.createCustomSpreadsheet)({
            startDate: startDate,
            endDate: endDate,
            interval: interval,
            categories: categories,
            conditions: conditions,
            conditionsOp: conditionsOp,
            showEmpty: showEmpty,
            showOffBudget: showOffBudget,
            showHiddenCategories: showHiddenCategories,
            showUncategorized: showUncategorized,
            trimIntervals: trimIntervals,
            groupBy: groupBy,
            balanceTypeOp: balanceTypeOp,
            sortByOp: sortByOp,
            payees: payees,
            accounts: accounts,
            graphType: graphType,
            firstDayOfWeekIdx: firstDayOfWeekIdx,
            setDataCheck: setDataCheck,
        });
    }, [
        startDate,
        endDate,
        interval,
        groupBy,
        balanceTypeOp,
        categories,
        payees,
        accounts,
        conditions,
        conditionsOp,
        showEmpty,
        showOffBudget,
        showHiddenCategories,
        showUncategorized,
        trimIntervals,
        sortByOp,
        graphType,
        firstDayOfWeekIdx,
    ]);
    var graphData = (0, useReport_1.useReport)('default', getGraphData);
    var groupedData = (0, useReport_1.useReport)('grouped', getGroupData);
    var data = __assign(__assign({}, graphData), { groupedData: groupedData });
    var customReportItems = {
        id: '',
        name: '',
        startDate: startDate,
        endDate: endDate,
        isDateStatic: isDateStatic,
        dateRange: dateRange,
        mode: mode,
        groupBy: groupBy,
        interval: interval,
        balanceType: balanceType,
        sortBy: sortBy,
        showEmpty: showEmpty,
        showOffBudget: showOffBudget,
        showHiddenCategories: showHiddenCategories,
        includeCurrentInterval: includeCurrentInterval,
        showUncategorized: showUncategorized,
        trimIntervals: trimIntervals,
        graphType: graphType,
        conditions: conditions,
        conditionsOp: conditionsOp,
    };
    var navigate = (0, useNavigate_1.useNavigate)();
    var _10 = (0, react_1.useState)(0), setScrollWidth = _10[1];
    (0, react_1.useEffect)(function () {
        if ((0, disabledList_1.disabledLegendLabel)(mode, graphType, 'disableLegend')) {
            setViewLegendPref(false);
        }
        if ((0, disabledList_1.disabledLegendLabel)(mode, graphType, 'disableLabel')) {
            setViewLabelsPref(false);
        }
    }, [setViewLegendPref, setViewLabelsPref, mode, graphType]);
    if (!allIntervals || !data) {
        return null;
    }
    var defaultModeItems = function (graph, item) {
        var _a;
        var chooseGraph = graph || graphType;
        var newGraph = (_a = ((disabledList_1.disabledList.modeGraphsMap.get(item) || []).includes(chooseGraph)
            ? disabledList_1.defaultsList.modeGraphsMap.get(item)
            : chooseGraph)) !== null && _a !== void 0 ? _a : chooseGraph;
        if ((disabledList_1.disabledList.modeGraphsMap.get(item) || []).includes(graphType)) {
            (0, setSessionReport_1.setSessionReport)('graphType', newGraph);
            setGraphType(newGraph);
        }
        if (((0, disabledList_1.disabledGraphList)(item, newGraph, 'disabledSplit') || []).includes(groupBy)) {
            var cond = (0, disabledList_1.defaultsGraphList)(item, newGraph, 'defaultSplit');
            (0, setSessionReport_1.setSessionReport)('groupBy', cond);
            setGroupBy(cond);
        }
        if (((0, disabledList_1.disabledGraphList)(item, newGraph, 'disabledType') || []).includes(balanceType)) {
            var cond = (0, disabledList_1.defaultsGraphList)(item, newGraph, 'defaultType');
            (0, setSessionReport_1.setSessionReport)('balanceType', cond);
            setBalanceType(cond);
        }
    };
    var defaultItems = function (item) {
        var chooseGraph = ReportOptions_1.ReportOptions.groupByItems.has(item) ? graphType : item;
        if (((0, disabledList_1.disabledGraphList)(mode, chooseGraph, 'disabledSplit') || []).includes(groupBy)) {
            var cond = (0, disabledList_1.defaultsGraphList)(mode, chooseGraph, 'defaultSplit');
            (0, setSessionReport_1.setSessionReport)('groupBy', cond);
            setGroupBy(cond);
        }
        if (((0, disabledList_1.disabledGraphList)(mode, chooseGraph, 'disabledType') || []).includes(balanceType)) {
            var cond = (0, disabledList_1.defaultsGraphList)(mode, chooseGraph, 'defaultType');
            (0, setSessionReport_1.setSessionReport)('balanceType', cond);
            setBalanceType(cond);
        }
        var defaultSort = (0, disabledList_1.defaultsGraphList)(mode, chooseGraph, 'defaultSort');
        if (defaultSort) {
            (0, setSessionReport_1.setSessionReport)('sortBy', defaultSort);
            setSortBy(defaultSort);
        }
    };
    var isItemDisabled = function (type) {
        switch (type) {
            case 'ShowLegend': {
                return (0, disabledList_1.disabledLegendLabel)(mode, graphType, 'disableLegend') || false;
            }
            case 'ShowLabels': {
                return (0, disabledList_1.disabledLegendLabel)(mode, graphType, 'disableLabel') || false;
            }
            default:
                return ((disabledList_1.disabledList.modeGraphsMap.get(mode) || []).includes(type) || false);
        }
    };
    var disabledItems = function (type) {
        switch (type) {
            case 'split':
                return (0, disabledList_1.disabledGraphList)(mode, graphType, 'disabledSplit') || [];
            case 'type':
                return graphType === 'BarGraph' && groupBy === 'Interval'
                    ? []
                    : (0, disabledList_1.disabledGraphList)(mode, graphType, 'disabledType') || [];
            default:
                return [];
        }
    };
    var onChangeDates = function (dateStart, dateEnd) {
        (0, setSessionReport_1.setSessionReport)('startDate', dateStart);
        (0, setSessionReport_1.setSessionReport)('endDate', dateEnd);
        setStartDate(dateStart);
        setEndDate(dateEnd);
        onReportChange({ type: 'modify' });
    };
    var onChangeViews = function (viewType) {
        if (viewType === 'viewLegend') {
            setViewLegendPref(!viewLegend);
        }
        if (viewType === 'viewSummary') {
            setViewSummaryPref(!viewSummary);
        }
        if (viewType === 'viewLabels') {
            setViewLabelsPref(!viewLabels);
        }
    };
    var setReportData = function (input) {
        setStartDate(input.startDate);
        setEndDate(input.endDate);
        setIsDateStatic(input.isDateStatic);
        setDateRange(input.dateRange);
        setMode(input.mode);
        setGroupBy(input.groupBy);
        setInterval(input.interval);
        setBalanceType(input.balanceType);
        setSortBy(input.sortBy);
        setShowEmpty(input.showEmpty);
        setShowOffBudget(input.showOffBudget);
        setShowHiddenCategories(input.showHiddenCategories);
        setIncludeCurrentInterval(input.includeCurrentInterval);
        setShowUncategorized(input.showUncategorized);
        setTrimIntervals(input.trimIntervals);
        setGraphType(input.graphType);
        onApplyFilter(null);
        (input.conditions || []).forEach(function (condition) { return onApplyFilter(condition); });
        onConditionsOpChange(input.conditionsOp);
    };
    var onReportChange = function (params) {
        var _a;
        switch (params.type) {
            case 'add-update':
                sessionStorage.clear();
                (0, setSessionReport_1.setSessionReport)('savedStatus', 'saved');
                setSavedStatus('saved');
                setReport(params.savedReport);
                if (params.savedReport.id !== (initialReport === null || initialReport === void 0 ? void 0 : initialReport.id)) {
                    navigate("/reports/custom/".concat(params.savedReport.id));
                }
                break;
            case 'rename':
                setReport(__assign(__assign({}, report), { name: ((_a = params.savedReport) === null || _a === void 0 ? void 0 : _a.name) || '' }));
                break;
            case 'modify':
                if (report.name) {
                    (0, setSessionReport_1.setSessionReport)('savedStatus', 'modified');
                    setSavedStatus('modified');
                }
                break;
            case 'reload':
                sessionStorage.clear();
                (0, setSessionReport_1.setSessionReport)('savedStatus', 'saved');
                setSavedStatus('saved');
                setReportData(initialReport !== null && initialReport !== void 0 ? initialReport : ReportOptions_1.defaultReport);
                break;
            case 'reset':
                sessionStorage.clear();
                setSavedStatus('new');
                setReport(ReportOptions_1.defaultReport);
                setReportData(ReportOptions_1.defaultReport);
                break;
            case 'choose':
                sessionStorage.clear();
                var newReport = params.savedReport || report;
                (0, setSessionReport_1.setSessionReport)('savedStatus', 'saved');
                setSavedStatus('saved');
                setReport(newReport);
                setReportData(newReport);
                navigate("/reports/custom/".concat(newReport.id));
                break;
            default:
        }
    };
    var onBackClick = function () {
        navigate('/reports');
    };
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={t('Custom Report: {{name}}', {
                name: (_c = report.name) !== null && _c !== void 0 ? _c : t('Unsaved report'),
            })} leftContent={<MobileBackButton_1.MobileBackButton onPress={onBackClick}/>}/>) : (<Page_1.PageHeader title={<react_i18next_1.Trans>
                <text_1.Text>
                  <react_i18next_1.Trans>Custom Report:</react_i18next_1.Trans>
                </text_1.Text>{' '}
                <text_1.Text style={{ marginLeft: 5, color: theme_1.theme.pageTextPositive }}>
                  {{
                    name: ((_d = report.name) === null || _d === void 0 ? void 0 : _d.length) > 0
                        ? report.name
                        : t('Unsaved report'),
                }}
                </text_1.Text>
              </react_i18next_1.Trans>}/>)} padding={0}>
      <view_1.View style={{
            flexDirection: 'row',
            paddingLeft: !isNarrowWidth ? 20 : undefined,
            flex: 1,
        }}>
        {!isNarrowWidth && (<ReportSidebar_1.ReportSidebar customReportItems={customReportItems} selectedCategories={selectedCategories} categories={categories} dateRangeLine={dateRangeLine} allIntervals={allIntervals} setDateRange={setDateRange} setGraphType={setGraphType} setGroupBy={setGroupBy} setInterval={setInterval} setBalanceType={setBalanceType} setSortBy={setSortBy} setMode={setMode} setIsDateStatic={setIsDateStatic} setShowEmpty={setShowEmpty} setShowOffBudget={setShowOffBudget} setShowHiddenCategories={setShowHiddenCategories} setIncludeCurrentInterval={setIncludeCurrentInterval} setShowUncategorized={setShowUncategorized} setTrimIntervals={setTrimIntervals} setSelectedCategories={setSelectedCategories} onChangeDates={onChangeDates} onReportChange={onReportChange} disabledItems={disabledItems} defaultItems={defaultItems} defaultModeItems={defaultModeItems} earliestTransaction={earliestTransaction} latestTransaction={latestTransaction} firstDayOfWeekIdx={firstDayOfWeekIdx} isComplexCategoryCondition={isComplexCategoryCondition}/>)}
        <view_1.View style={{
            flex: 1,
        }}>
          {!isNarrowWidth && (<ReportTopbar_1.ReportTopbar customReportItems={customReportItems} report={report} savedStatus={savedStatus} setGraphType={setGraphType} viewLegend={viewLegend} viewSummary={viewSummary} viewLabels={viewLabels} onApplyFilter={onApplyFilter} onChangeViews={onChangeViews} onReportChange={onReportChange} isItemDisabled={isItemDisabled} defaultItems={defaultItems}/>)}
          {conditions && conditions.length > 0 && (<view_1.View style={{
                marginBottom: 10,
                marginLeft: 5,
                marginRight: 5,
                gap: 10,
                flexShrink: 0,
            }}>
              <view_1.View style={{
                flexShrink: 0,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
            }}>
                <AppliedFilters_1.AppliedFilters conditions={conditions} onUpdate={function (oldFilter, newFilter) {
                (0, setSessionReport_1.setSessionReport)('conditions', conditions.map(function (f) { return (f === oldFilter ? newFilter : f); }));
                onReportChange({ type: 'modify' });
                onUpdateFilter(oldFilter, newFilter);
            }} onDelete={function (deletedFilter) {
                (0, setSessionReport_1.setSessionReport)('conditions', conditions.filter(function (f) { return f !== deletedFilter; }));
                onDeleteFilter(deletedFilter);
                onReportChange({ type: 'modify' });
            }} conditionsOp={conditionsOp} onConditionsOpChange={function (co) {
                onConditionsOpChange(co);
                onReportChange({ type: 'modify' });
            }}/>
              </view_1.View>

              {hasWarning && (<alerts_1.Warning style={{ paddingTop: 5, paddingBottom: 5 }}>
                  {t('This report is configured to use a non-existing filter value (i.e. category/account/payee).')}
                </alerts_1.Warning>)}
            </view_1.View>)}
          <view_1.View id="custom-report-content" style={{
            backgroundColor: theme_1.theme.tableBackground,
            flexDirection: 'row',
            flex: '1 0 auto',
        }}>
            <view_1.View style={{
            flex: 1,
            padding: 10,
        }}>
              {graphType !== 'TableGraph' && (<view_1.View style={{
                alignItems: 'flex-end',
                paddingTop: 10,
            }}>
                  <view_1.View style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 500, marginBottom: 5 })}>
                    <aligned_text_1.AlignedText left={<block_1.Block>{balanceType}:</block_1.Block>} right={<text_1.Text>
                          <PrivacyFilter_1.PrivacyFilter>
                            {format(data[balanceTypeOp], 'financial')}
                          </PrivacyFilter_1.PrivacyFilter>
                        </text_1.Text>}/>
                  </view_1.View>
                </view_1.View>)}
              <view_1.View style={{ flex: 1, overflow: 'auto' }}>
                {dataCheck ? (<ChooseGraph_1.ChooseGraph data={data} filters={conditions} mode={mode} graphType={graphType} balanceType={balanceType} groupBy={groupBy} interval={interval} setScrollWidth={setScrollWidth} viewLabels={viewLabels} compact={false} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} intervalsCount={intervals.length}/>) : (<LoadingIndicator_1.LoadingIndicator message={t('Loading report...')}/>)}
              </view_1.View>
            </view_1.View>
            {(viewLegend || viewSummary) && data && !isNarrowWidth && (<view_1.View style={{
                padding: 10,
                minWidth: 300,
                textAlign: 'center',
            }}>
                {viewSummary && (<ReportSummary_1.ReportSummary startDate={startDate} endDate={endDate} balanceTypeOp={balanceTypeOp} data={data} interval={interval} intervalsCount={intervals.length}/>)}
                {viewLegend && (<ReportLegend_1.ReportLegend legend={data.legend} groupBy={groupBy} interval={interval}/>)}
              </view_1.View>)}
          </view_1.View>
        </view_1.View>
      </view_1.View>
    </Page_1.Page>);
}
