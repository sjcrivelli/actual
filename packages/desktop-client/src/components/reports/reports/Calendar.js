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
exports.Calendar = Calendar;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var react_spring_1 = require("react-spring");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var react_2 = require("@use-gesture/react");
var date_fns_1 = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var transactions_1 = require("loot-core/shared/transactions");
var EditablePageHeaderTitle_1 = require("@desktop-client/components/EditablePageHeaderTitle");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var TransactionList_1 = require("@desktop-client/components/mobile/transactions/TransactionList");
var Page_1 = require("@desktop-client/components/Page");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var chart_theme_1 = require("@desktop-client/components/reports/chart-theme");
var DateRange_1 = require("@desktop-client/components/reports/DateRange");
var CalendarGraph_1 = require("@desktop-client/components/reports/graphs/CalendarGraph");
var Header_1 = require("@desktop-client/components/reports/Header");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var calendar_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/calendar-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var util_1 = require("@desktop-client/components/reports/util");
var TransactionList_2 = require("@desktop-client/components/transactions/TransactionList");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
var useRuleConditionFilters_1 = require("@desktop-client/hooks/useRuleConditionFilters");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSplitsExpanded_1 = require("@desktop-client/hooks/useSplitsExpanded");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useTransactions_1 = require("@desktop-client/hooks/useTransactions");
var useWidget_1 = require("@desktop-client/hooks/useWidget");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var CHEVRON_HEIGHT = 42;
var SUMMARY_HEIGHT = 140;
function Calendar() {
    var _a;
    var params = (0, react_router_1.useParams)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var _b = (0, useWidget_1.useWidget)((_a = params.id) !== null && _a !== void 0 ? _a : '', 'calendar-card'), widget = _b.data, isLoading = _b.isLoading;
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator />;
    }
    return <CalendarInner widget={widget} parameters={searchParams}/>;
}
function CalendarInner(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f;
    var widget = _a.widget, parameters = _a.parameters;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _g = (0, react_1.useState)(monthUtils.dayFromDate(monthUtils.currentMonth())), start = _g[0], setStart = _g[1];
    var _h = (0, react_1.useState)(monthUtils.currentDay()), end = _h[0], setEnd = _h[1];
    var _j = (0, react_1.useState)('full'), mode = _j[0], setMode = _j[1];
    var _k = (0, react_1.useState)(undefined), query = _k[0], setQuery = _k[1];
    var _l = (0, react_1.useState)(false), dirty = _l[0], setDirty = _l[1];
    var _m = (0, react_1.useState)(''), latestTransaction = _m[0], setLatestTransaction = _m[1];
    var _o = (0, useTransactions_1.useTransactions)({ query: query }), transactionsGrouped = _o.transactions, loadMoreTransactions = _o.loadMore;
    var allTransactions = (0, react_1.useMemo)(function () { return (0, transactions_1.ungroupTransactions)(transactionsGrouped); }, [transactionsGrouped]);
    var accounts = (0, useAccounts_1.useAccounts)();
    var payees = (0, usePayees_1.usePayees)();
    var categoryGroups = (0, useCategories_1.useCategories)().grouped;
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    var _p = (0, useRuleConditionFilters_1.useRuleConditionFilters)((_b = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _b === void 0 ? void 0 : _b.conditions, (_c = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _c === void 0 ? void 0 : _c.conditionsOp), conditions = _p.conditions, conditionsOp = _p.conditionsOp, onApplyFilter = _p.onApply, onDeleteFilter = _p.onDelete, onUpdateFilter = _p.onUpdate, onConditionsOpChange = _p.onConditionsOpChange;
    (0, react_1.useEffect)(function () {
        var _a, _b;
        var day = parameters.get('day');
        var month = parameters.get('month');
        if (day && onApplyFilter) {
            onApplyFilter({
                conditions: __spreadArray(__spreadArray([], (((_a = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _a === void 0 ? void 0 : _a.conditions) || []), true), [
                    {
                        op: 'is',
                        field: 'date',
                        value: day,
                    },
                ], false),
                conditionsOp: 'and',
                id: [],
            });
        }
        if (month && onApplyFilter) {
            onApplyFilter({
                conditions: __spreadArray(__spreadArray([], (((_b = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _b === void 0 ? void 0 : _b.conditions) || []), true), [
                    {
                        field: 'date',
                        op: 'is',
                        value: month,
                        options: {
                            month: true,
                        },
                    },
                ], false),
                conditionsOp: 'and',
                id: [],
            });
        }
    }, [(_d = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _d === void 0 ? void 0 : _d.conditions, onApplyFilter, parameters]);
    var params = (0, react_1.useMemo)(function () {
        if (dirty === true) {
            setDirty(false);
        }
        return (0, calendar_spreadsheet_1.calendarSpreadsheet)(start, end, conditions, conditionsOp, firstDayOfWeekIdx);
    }, [start, end, conditions, conditionsOp, firstDayOfWeekIdx, dirty]);
    var _q = (0, react_1.useState)(''), sortField = _q[0], setSortField = _q[1];
    var _r = (0, react_1.useState)('desc'), ascDesc = _r[0], setAscDesc = _r[1];
    (0, react_1.useEffect)(function () {
        var conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
        (0, fetch_1.send)('make-filters-from-conditions', {
            conditions: conditions.filter(function (cond) { return !cond.customName; }),
        })
            .then(function (data) {
            var _a, _b;
            var query = (0, query_1.q)('transactions')
                .filter((_a = {},
                _a[conditionsOpKey] = data.filters,
                _a))
                .filter({
                $and: [
                    { date: { $gte: monthUtils.firstDayOfMonth(start) } },
                    { date: { $lte: monthUtils.lastDayOfMonth(end) } },
                ],
            })
                .select('*');
            if (sortField) {
                query = query.orderBy((_b = {},
                    _b[getField(sortField)] = ascDesc,
                    _b));
            }
            setQuery(query.options({ splits: 'grouped' }));
        })
            .catch(function (error) {
            console.error('Error generating filters:', error);
        });
    }, [start, end, conditions, conditionsOp, sortField, ascDesc]);
    var _s = (0, react_1.useState)('center'), flexAlignment = _s[0], setFlexAlignment = _s[1];
    var scrollbarContainer = (0, react_1.useRef)(null);
    var ref = (0, useResizeObserver_1.useResizeObserver)(function () {
        setFlexAlignment(scrollbarContainer.current &&
            scrollbarContainer.current.scrollWidth >
                scrollbarContainer.current.clientWidth
            ? 'flex-start'
            : 'center');
    });
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(ref, scrollbarContainer);
    var data = (0, useReport_1.useReport)('calendar', params);
    var _t = (0, react_1.useState)([]), allMonths = _t[0], setAllMonths = _t[1];
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var earliestTransaction, latestTransaction, currentMonth, earliestMonth, latestMonth, yearAgo, allMonths;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-earliest-transaction')];
                        case 1:
                            earliestTransaction = _a.sent();
                            setEarliestTransaction(earliestTransaction
                                ? earliestTransaction.date
                                : monthUtils.currentDay());
                            return [4 /*yield*/, (0, fetch_1.send)('get-latest-transaction')];
                        case 2:
                            latestTransaction = _a.sent();
                            setLatestTransaction(latestTransaction ? latestTransaction.date : monthUtils.currentDay());
                            currentMonth = monthUtils.currentMonth();
                            earliestMonth = earliestTransaction
                                ? monthUtils.monthFromDate((0, date_fns_1.parseISO)((0, util_1.fromDateRepr)(earliestTransaction.date)))
                                : currentMonth;
                            latestMonth = latestTransaction
                                ? monthUtils.monthFromDate((0, date_fns_1.parseISO)((0, util_1.fromDateRepr)(latestTransaction.date)))
                                : currentMonth;
                            yearAgo = monthUtils.subMonths(latestMonth, 12);
                            if (earliestMonth > yearAgo) {
                                earliestMonth = yearAgo;
                            }
                            allMonths = monthUtils
                                .rangeInclusive(earliestMonth, latestMonth)
                                .map(function (month) { return ({
                                name: month,
                                pretty: monthUtils.format(month, 'MMMM, yyyy', locale),
                            }); })
                                .reverse();
                            setAllMonths(allMonths);
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, [locale]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (latestTransaction) {
            var _b = (0, reportRanges_1.calculateTimeRange)((_a = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _a === void 0 ? void 0 : _a.timeFrame, {
                start: monthUtils.dayFromDate(monthUtils.currentMonth()),
                end: monthUtils.currentDay(),
                mode: 'full',
            }, latestTransaction), initialStart = _b[0], initialEnd = _b[1], initialMode = _b[2];
            setStart(initialStart);
            setEnd(initialEnd);
            setMode(initialMode);
        }
    }, [latestTransaction, (_e = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _e === void 0 ? void 0 : _e.timeFrame]);
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var title = ((_f = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _f === void 0 ? void 0 : _f.name) || t('Calendar');
    var table = (0, react_1.useRef)(null);
    var dateFormat = (0, useDateFormat_1.useDateFormat)();
    var onSaveWidgetName = function (newName) { return __awaiter(_this, void 0, void 0, function () {
        var name;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!widget) {
                        throw new Error('No widget that could be saved.');
                    }
                    name = newName || t('Calendar');
                    return [4 /*yield*/, (0, fetch_1.send)('dashboard-update-widget', {
                            id: widget.id,
                            meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { name: name }),
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    function onChangeDates(start, end, mode) {
        setStart(start);
        setEnd(end);
        setMode(mode);
    }
    function onSaveWidget() {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!widget) {
                            throw new Error('No widget that could be saved.');
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, (0, fetch_1.send)('dashboard-update-widget', {
                                id: widget.id,
                                meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { conditions: conditions, conditionsOp: conditionsOp, timeFrame: {
                                        start: start,
                                        end: end,
                                        mode: mode,
                                    } }),
                            })];
                    case 2:
                        _b.sent();
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'message',
                                message: t('Dashboard widget successfully saved.'),
                            },
                        }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                message: t('Failed to save dashboard widget.'),
                            },
                        }));
                        console.error('Error saving widget:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var _u = (0, react_1.useMemo)(function () {
        if (!data || !data.calendarData) {
            return { totalIncome: 0, totalExpense: 0 };
        }
        return {
            totalIncome: data.calendarData.reduce(function (prev, cur) { return prev + cur.totalIncome; }, 0),
            totalExpense: data.calendarData.reduce(function (prev, cur) { return prev + cur.totalExpense; }, 0),
        };
    }, [data]), totalIncome = _u.totalIncome, totalExpense = _u.totalExpense;
    var onSort = (0, react_1.useCallback)(function (headerClicked, ascDesc) {
        if (headerClicked === sortField) {
            setAscDesc(ascDesc);
        }
        else {
            setSortField(headerClicked);
            setAscDesc('desc');
        }
    }, [sortField]);
    var onOpenTransaction = (0, react_1.useCallback)(function (transaction) {
        navigate("/transactions/".concat(transaction.id));
    }, [navigate]);
    var refContainer = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (refContainer.current) {
            setTotalHeight(refContainer.current.clientHeight - SUMMARY_HEIGHT);
        }
    }, [query]);
    var _v = (0, react_1.useState)(0), totalHeight = _v[0], setTotalHeight = _v[1];
    var closeY = (0, react_1.useRef)(3000);
    var openY = 0;
    var _w = (0, react_1.useState)(false), mobileTransactionsOpen = _w[0], setMobileTransactionsOpen = _w[1];
    var _x = (0, react_spring_1.useSpring)(function () { return ({
        y: closeY.current,
        immediate: false,
    }); }), y = _x[0].y, api = _x[1];
    (0, react_1.useEffect)(function () {
        closeY.current = totalHeight;
        api.start({
            y: mobileTransactionsOpen ? openY : closeY.current,
            immediate: false,
        });
    }, [totalHeight, mobileTransactionsOpen, api]);
    var open = (0, react_1.useCallback)(function (_a) {
        var canceled = _a.canceled;
        api.start({
            y: openY,
            immediate: false,
            config: canceled ? react_spring_1.config.wobbly : react_spring_1.config.stiff,
        });
        setMobileTransactionsOpen(true);
    }, [api]);
    var close = (0, react_1.useCallback)(function (velocity) {
        if (velocity === void 0) { velocity = 0; }
        api.start({
            y: closeY.current,
            config: __assign(__assign({}, react_spring_1.config.stiff), { velocity: velocity }),
        });
        setMobileTransactionsOpen(false);
    }, [api]);
    var bind = (0, react_2.useDrag)(function (_a) {
        var _b = _a.offset, oy = _b[1], cancel = _a.cancel;
        if (oy < 0) {
            cancel();
            api.start({ y: 0, immediate: true });
            return;
        }
        if (oy > totalHeight * 0.05 && mobileTransactionsOpen) {
            cancel();
            close();
            setMobileTransactionsOpen(false);
        }
        else if (!mobileTransactionsOpen) {
            if (oy / totalHeight > 0.05) {
                cancel();
                open({ canceled: true });
                setMobileTransactionsOpen(true);
            }
            else {
                api.start({ y: oy, immediate: true });
            }
        }
    }, {
        from: function () { return [0, y.get()]; },
        filterTaps: true,
        bounds: {
            top: -totalHeight + CHEVRON_HEIGHT,
            bottom: totalHeight - CHEVRON_HEIGHT,
        },
        axis: 'y',
        rubberband: true,
    });
    var _y = (0, react_1.useState)(''), earliestTransaction = _y[0], setEarliestTransaction = _y[1];
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={title} leftContent={<MobileBackButton_1.MobileBackButton onPress={function () { return navigate('/reports'); }}/>}/>) : (<Page_1.PageHeader title={widget ? (<EditablePageHeaderTitle_1.EditablePageHeaderTitle title={title} onSave={onSaveWidgetName}/>) : (title)}/>)} padding={0}>
      <view_1.View style={{ minHeight: !isNarrowWidth ? '120px' : 'unset' }}>
        <Header_1.Header allMonths={allMonths} start={start} end={end} earliestTransaction={earliestTransaction} latestTransaction={latestTransaction} firstDayOfWeekIdx={firstDayOfWeekIdx} mode={mode} onChangeDates={onChangeDates} filters={conditions} onApply={onApplyFilter} onUpdateFilter={onUpdateFilter} onDeleteFilter={onDeleteFilter} conditionsOp={conditionsOp} onConditionsOpChange={onConditionsOpChange} show1Month={true}>
          {widget && (<button_1.Button variant="primary" onPress={onSaveWidget}>
              <react_i18next_1.Trans>Save widget</react_i18next_1.Trans>
            </button_1.Button>)}
        </Header_1.Header>
      </view_1.View>
      <view_1.View ref={refContainer} style={{ flexGrow: 1 }}>
        <view_1.View style={{
            backgroundColor: theme_1.theme.pageBackground,
            paddingTop: 0,
            minHeight: '350px',
            overflowY: 'auto',
        }}>
          <view_1.View style={{
            flexDirection: isNarrowWidth ? 'column-reverse' : 'row',
            justifyContent: 'flex-start',
            flexGrow: 1,
            gap: 16,
            position: 'relative',
            marginBottom: 16,
        }}>
            {data && (<view_1.View ref={mergedRef} style={__assign({ flexGrow: 1, flexDirection: 'row', gap: '20px', overflow: 'auto', height: '100%', justifyContent: flexAlignment, display: 'flex' }, styles_1.styles.horizontalScrollbar)}>
                {data.calendarData.map(function (calendar, index) { return (<CalendarWithHeader key={index} calendar={calendar} onApplyFilter={onApplyFilter} firstDayOfWeekIdx={firstDayOfWeekIdx} conditions={conditions} conditionsOp={conditionsOp} format={format}/>); })}
              </view_1.View>)}
            <CalendarCardHeader start={start} end={end} totalExpense={totalExpense} totalIncome={totalIncome} isNarrowWidth={isNarrowWidth} format={format}/>
          </view_1.View>
        </view_1.View>
        <useSelected_1.SelectedProviderWithItems name="transactions" items={[]} fetchAllIds={function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }} registerDispatch={function () { }} selectAllFilter={function (item) {
            return !item._unmatched && !item.is_parent;
        }}>
          <useCachedSchedules_1.SchedulesProvider query={undefined}>
            <view_1.View style={{
            width: '100%',
            flexGrow: 1,
            overflow: isNarrowWidth ? 'auto' : 'hidden',
        }} 
    // TODO: make TableHandleRef conform to HTMLDivEle
    ref={table}>
              {!isNarrowWidth ? (<useSplitsExpanded_1.SplitsExpandedProvider initialMode="collapse">
                  <TransactionList_2.TransactionList tableRef={table} account={undefined} transactions={transactionsGrouped} allTransactions={allTransactions} loadMoreTransactions={loadMoreTransactions} accounts={accounts} category={undefined} categoryGroups={categoryGroups} payees={payees} balances={null} showBalances={false} showReconciled={true} showCleared={false} showAccount={true} isAdding={false} isNew={function () { return false; }} isMatched={function () { return false; }} dateFormat={dateFormat} hideFraction={false} renderEmpty={function () { return (<view_1.View style={{
                    color: theme_1.theme.tableText,
                    marginTop: 20,
                    textAlign: 'center',
                    fontStyle: 'italic',
                }}>
                        <react_i18next_1.Trans>No transactions</react_i18next_1.Trans>
                      </view_1.View>); }} onSort={onSort} sortField={sortField} ascDesc={ascDesc} onChange={function () { }} onRefetch={function () { return setDirty(true); }} onCloseAddTransaction={function () { }} onCreatePayee={function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, null];
        }); }); }} onApplyFilter={function () { }} onBatchDelete={function () { }} onBatchDuplicate={function () { }} onBatchLinkSchedule={function () { }} onBatchUnlinkSchedule={function () { }} onCreateRule={function () { }} onScheduleAction={function () { }} onMakeAsNonSplitTransactions={function () { }} showSelection={false} allowSplitTransaction={false}/>
                </useSplitsExpanded_1.SplitsExpandedProvider>) : (<react_spring_1.animated.div {...bind()} style={__assign(__assign({ y: y, touchAction: 'pan-x', backgroundColor: theme_1.theme.mobileNavBackground, borderTop: "1px solid ".concat(theme_1.theme.menuBorder) }, styles_1.styles.shadow), { height: totalHeight + CHEVRON_HEIGHT, width: '100%', position: 'fixed', zIndex: 100, bottom: 0, display: isNarrowWidth ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center' })}>
                  <button_1.Button variant="bare" onPress={function () {
                return !mobileTransactionsOpen
                    ? open({ canceled: false })
                    : close();
            }} className={(0, css_1.css)({
                color: theme_1.theme.pageTextSubdued,
                height: 42,
                '&[data-pressed]': { backgroundColor: 'transparent' },
            })}>
                    {!mobileTransactionsOpen && (<>
                        <v1_1.SvgCheveronUp width={16} height={16}/>
                        <react_i18next_1.Trans>Show transactions</react_i18next_1.Trans>
                      </>)}
                    {mobileTransactionsOpen && (<>
                        <v1_1.SvgCheveronDown width={16} height={16}/>
                        <react_i18next_1.Trans>Hide transactions</react_i18next_1.Trans>
                      </>)}
                  </button_1.Button>
                  <view_1.View style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                    <TransactionList_1.TransactionList isLoading={false} onLoadMore={loadMoreTransactions} transactions={allTransactions} onOpenTransaction={onOpenTransaction} isLoadingMore={false}/>
                  </view_1.View>
                </react_spring_1.animated.div>)}
            </view_1.View>
          </useCachedSchedules_1.SchedulesProvider>
        </useSelected_1.SelectedProviderWithItems>
      </view_1.View>
    </Page_1.Page>);
}
function CalendarWithHeader(_a) {
    var calendar = _a.calendar, onApplyFilter = _a.onApplyFilter, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, conditions = _a.conditions, conditionsOp = _a.conditionsOp, format = _a.format;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{
            minWidth: '300px',
            maxWidth: '300px',
            padding: 10,
            borderRadius: 4,
            backgroundColor: theme_1.theme.tableBackground,
        }} onClick={function () {
            return onApplyFilter({
                conditions: __spreadArray([], conditions.filter(function (f) { return f.field !== 'date'; }), true),
                conditionsOp: conditionsOp,
                id: [],
            });
        }}>
      <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: 16,
        }}>
        <button_1.Button variant="bare" style={{
            color: theme_1.theme.pageTextSubdued,
            fontWeight: 'bold',
            fontSize: '14px',
            margin: 0,
            padding: 0,
            display: 'inline-block',
            width: 'max-content',
        }} onPress={function () {
            onApplyFilter({
                conditions: __spreadArray(__spreadArray([], conditions.filter(function (f) { return f.field !== 'date'; }), true), [
                    {
                        field: 'date',
                        op: 'is',
                        value: (0, date_fns_1.format)(calendar.start, 'yyyy-MM'),
                        options: {
                            month: true,
                        },
                    },
                ], false),
                conditionsOp: 'and',
                id: [],
            });
        }}>
          {(0, date_fns_1.format)(calendar.start, 'MMMM yyyy')}
        </button_1.Button>
        <view_1.View style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 2 }}>
          <v1_1.SvgArrowThickUp width={16} height={16} style={{ color: chart_theme_1.chartTheme.colors.blue, flexShrink: 0 }}/>
          <view_1.View style={{
            color: chart_theme_1.chartTheme.colors.blue,
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'start',
        }} aria-label={t('Income')}>
            <PrivacyFilter_1.PrivacyFilter>
              {format(calendar.totalIncome, 'financial')}
            </PrivacyFilter_1.PrivacyFilter>
          </view_1.View>
          <v1_1.SvgArrowThickDown width={16} height={16} style={{ color: chart_theme_1.chartTheme.colors.red, flexShrink: 0 }}/>
          <view_1.View style={{
            color: chart_theme_1.chartTheme.colors.red,
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'start',
        }} aria-label={t('Expenses')}>
            <PrivacyFilter_1.PrivacyFilter>
              {format(calendar.totalExpense, 'financial')}
            </PrivacyFilter_1.PrivacyFilter>
          </view_1.View>
        </view_1.View>
      </view_1.View>
      <view_1.View style={{ flexGrow: 1, display: 'block', marginBottom: 20 }}>
        <CalendarGraph_1.CalendarGraph data={calendar.data} start={calendar.start} onDayClick={function (date) {
            if (date) {
                onApplyFilter({
                    conditions: __spreadArray(__spreadArray([], conditions.filter(function (f) { return f.field !== 'date'; }), true), [
                        {
                            field: 'date',
                            op: 'is',
                            value: (0, date_fns_1.format)(date, 'yyyy-MM-dd'),
                        },
                    ], false),
                    conditionsOp: 'and',
                    id: [],
                });
            }
            else {
                onApplyFilter({
                    conditions: __spreadArray([], conditions.filter(function (f) { return f.field !== 'date'; }), true),
                    conditionsOp: 'and',
                    id: [],
                });
            }
        }} firstDayOfWeekIdx={firstDayOfWeekIdx}/>
      </view_1.View>
    </view_1.View>);
}
function CalendarCardHeader(_a) {
    var start = _a.start, end = _a.end, totalIncome = _a.totalIncome, totalExpense = _a.totalExpense, isNarrowWidth = _a.isNarrowWidth, format = _a.format;
    return (<view_1.View style={__assign(__assign({}, styles_1.styles.smallText), { marginLeft: isNarrowWidth ? 0 : 16, marginTop: isNarrowWidth ? 16 : 0, justifyContent: isNarrowWidth ? 'center' : 'flex-end', flexDirection: 'row', height: '100px', minWidth: '210px' })}>
      <view_1.View style={{
            width: '200px',
            borderRadius: 4,
            backgroundColor: theme_1.theme.tableBackground,
            padding: 10,
        }}>
        <DateRange_1.DateRange start={start} end={end}/>
        <view_1.View style={{ lineHeight: 1.5 }}>
          <view_1.View style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr',
            gridAutoRows: '1fr',
        }}>
            <view_1.View style={{
            textAlign: 'right',
            marginRight: 4,
        }}>
              <react_i18next_1.Trans>Income:</react_i18next_1.Trans>
            </view_1.View>
            <view_1.View style={{ color: chart_theme_1.chartTheme.colors.blue }}>
              <PrivacyFilter_1.PrivacyFilter>{format(totalIncome, 'financial')}</PrivacyFilter_1.PrivacyFilter>
            </view_1.View>

            <view_1.View style={{
            textAlign: 'right',
            marginRight: 4,
        }}>
              <react_i18next_1.Trans>Expenses:</react_i18next_1.Trans>
            </view_1.View>
            <view_1.View style={{ color: chart_theme_1.chartTheme.colors.red }}>
              <PrivacyFilter_1.PrivacyFilter>{format(totalExpense, 'financial')}</PrivacyFilter_1.PrivacyFilter>
            </view_1.View>
          </view_1.View>
        </view_1.View>
      </view_1.View>
    </view_1.View>);
}
function getField(field) {
    if (!field) {
        return 'date';
    }
    switch (field) {
        case 'account':
            return 'account.name';
        case 'payee':
            return 'payee.name';
        case 'category':
            return 'category.name';
        case 'payment':
            return 'amount';
        case 'deposit':
            return 'amount';
        default:
            return field;
    }
}
