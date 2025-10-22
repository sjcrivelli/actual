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
exports.Summary = Summary;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var EditablePageHeaderTitle_1 = require("@desktop-client/components/EditablePageHeaderTitle");
var AppliedFilters_1 = require("@desktop-client/components/filters/AppliedFilters");
var FiltersMenu_1 = require("@desktop-client/components/filters/FiltersMenu");
var forms_1 = require("@desktop-client/components/forms");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var Page_1 = require("@desktop-client/components/Page");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var chart_theme_1 = require("@desktop-client/components/reports/chart-theme");
var Header_1 = require("@desktop-client/components/reports/Header");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var summary_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/summary-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var util_1 = require("@desktop-client/components/reports/util");
var RuleEditor_1 = require("@desktop-client/components/rules/RuleEditor");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useRuleConditionFilters_1 = require("@desktop-client/hooks/useRuleConditionFilters");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useWidget_1 = require("@desktop-client/hooks/useWidget");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function Summary() {
    var _a;
    var params = (0, react_router_1.useParams)();
    var _b = (0, useWidget_1.useWidget)((_a = params.id) !== null && _a !== void 0 ? _a : '', 'summary-card'), widget = _b.data, isLoading = _b.isLoading;
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator />;
    }
    return <SummaryInner widget={widget}/>;
}
function SummaryInner(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var widget = _a.widget;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _w = (0, react_1.useState)(monthUtils.dayFromDate(monthUtils.currentMonth())), start = _w[0], setStart = _w[1];
    var _x = (0, react_1.useState)(monthUtils.currentDay()), end = _x[0], setEnd = _x[1];
    var _y = (0, react_1.useState)('full'), mode = _y[0], setMode = _y[1];
    var dividendFilters = (0, useRuleConditionFilters_1.useRuleConditionFilters)((_c = (_b = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _b === void 0 ? void 0 : _b.conditions) !== null && _c !== void 0 ? _c : [], (_e = (_d = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _d === void 0 ? void 0 : _d.conditionsOp) !== null && _e !== void 0 ? _e : 'and');
    var _z = (0, react_1.useState)(((_f = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _f === void 0 ? void 0 : _f.content)
        ? (function () {
            try {
                return JSON.parse(widget.meta.content);
            }
            catch (error) {
                console.error('Failed to parse widget meta content:', error);
                return {
                    type: 'sum',
                    divisorAllTimeDateRange: false,
                    divisorConditions: [],
                    divisorConditionsOp: 'and',
                };
            }
        })()
        : {
            type: 'sum',
            divisorAllTimeDateRange: false,
            divisorConditions: [],
            divisorConditionsOp: 'and',
        }), content = _z[0], setContent = _z[1];
    var divisorFilters = (0, useRuleConditionFilters_1.useRuleConditionFilters)(content.type === 'percentage' ? ((_g = content === null || content === void 0 ? void 0 : content.divisorConditions) !== null && _g !== void 0 ? _g : []) : [], content.type === 'percentage'
        ? ((_h = content === null || content === void 0 ? void 0 : content.divisorConditionsOp) !== null && _h !== void 0 ? _h : 'and')
        : 'and');
    var params = (0, react_1.useMemo)(function () {
        return (0, summary_spreadsheet_1.summarySpreadsheet)(start, end, dividendFilters.conditions, dividendFilters.conditionsOp, content, locale);
    }, [
        start,
        end,
        dividendFilters.conditions,
        dividendFilters.conditionsOp,
        content,
        locale,
    ]);
    var data = (0, useReport_1.useReport)('summary', params);
    (0, react_1.useEffect)(function () {
        setContent(function (prev) { return (__assign(__assign({}, prev), { divisorConditions: divisorFilters.conditions, divisorConditionsOp: divisorFilters.conditionsOp })); });
    }, [divisorFilters.conditions, divisorFilters.conditionsOp]);
    var _0 = (0, react_1.useState)([]), allMonths = _0[0], setAllMonths = _0[1];
    var _1 = (0, react_1.useState)(''), earliestTransaction = _1[0], setEarliestTransaction = _1[1];
    var _2 = (0, react_1.useState)(''), latestTransaction = _2[0], setLatestTransaction = _2[1];
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
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
    }, [latestTransaction, (_j = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _j === void 0 ? void 0 : _j.timeFrame]);
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var title = ((_k = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _k === void 0 ? void 0 : _k.name) || t('Summary');
    var onSaveWidgetName = function (newName) { return __awaiter(_this, void 0, void 0, function () {
        var name;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!widget) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                message: t('Cannot save: No widget available.'),
                            },
                        }));
                        return [2 /*return*/];
                    }
                    name = newName || t('Summary');
                    return [4 /*yield*/, (0, fetch_1.send)('dashboard-update-widget', {
                            id: widget.id,
                            meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { name: name, content: JSON.stringify(content) }),
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
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!widget) {
                            dispatch((0, notificationsSlice_1.addNotification)({
                                notification: {
                                    type: 'error',
                                    message: t('Cannot save: No widget available.'),
                                },
                            }));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, fetch_1.send)('dashboard-update-widget', {
                                id: widget.id,
                                meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { conditions: dividendFilters.conditions, conditionsOp: dividendFilters.conditionsOp, timeFrame: {
                                        start: start,
                                        end: end,
                                        mode: mode,
                                    }, content: JSON.stringify(content) }),
                            })];
                    case 1:
                        _b.sent();
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'message',
                                message: t('Dashboard widget successfully saved.'),
                            },
                        }));
                        return [2 /*return*/];
                }
            });
        });
    }
    var getDivisorFormatted = function (contentType, value) {
        if (contentType === 'avgPerMonth') {
            return format(value, 'number');
        }
        else if (contentType === 'avgPerYear') {
            return format(value, 'number');
        }
        else if (contentType === 'avgPerTransact') {
            return format(value, 'number');
        }
        return format(Math.round(value), 'financial');
    };
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={title} leftContent={<MobileBackButton_1.MobileBackButton onPress={function () { return navigate('/reports'); }}/>}/>) : (<Page_1.PageHeader title={widget ? (<EditablePageHeaderTitle_1.EditablePageHeaderTitle title={title} onSave={onSaveWidgetName}/>) : (title)}/>)} padding={0}>
      <Header_1.Header allMonths={allMonths} start={start} end={end} earliestTransaction={earliestTransaction} latestTransaction={latestTransaction} firstDayOfWeekIdx={firstDayOfWeekIdx} mode={mode} onChangeDates={onChangeDates} onApply={dividendFilters.onApply} onUpdateFilter={dividendFilters.onUpdate} onDeleteFilter={dividendFilters.onDelete} conditionsOp={dividendFilters.conditionsOp} onConditionsOpChange={dividendFilters.onConditionsOpChange} show1Month={true}>
        {widget && (<button_1.Button variant="primary" onPress={onSaveWidget}>
            <react_i18next_1.Trans>Save widget</react_i18next_1.Trans>
          </button_1.Button>)}
      </Header_1.Header>
      <view_1.View style={{
            width: '100%',
            background: theme_1.theme.pageBackground,
        }}>
        <view_1.View style={{
            width: '100%',
            alignContent: 'center',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 16,
        }}>
          <span style={{ marginRight: 4 }}>
            <react_i18next_1.Trans>Show as</react_i18next_1.Trans>
          </span>
          <RuleEditor_1.FieldSelect style={{ marginRight: 16 }} fields={[
            ['sum', t('Sum')],
            ['avgPerMonth', t('Average per month')],
            ['avgPerYear', t('Average per year')],
            ['avgPerTransact', t('Average per transaction')],
            ['percentage', t('Percentage')],
        ]} value={(_l = content.type) !== null && _l !== void 0 ? _l : 'sum'} onChange={function (newValue) {
            return setContent(function (prev) {
                return (__assign(__assign({}, prev), { type: newValue }));
            });
        }}/>
        </view_1.View>
        {content.type === 'percentage' && (<view_1.View style={{ flexDirection: 'row', marginLeft: 16 }}>
            <forms_1.Checkbox id="enabled-field" checked={(_m = content.divisorAllTimeDateRange) !== null && _m !== void 0 ? _m : false} onChange={function () {
                var _a;
                var currentValue = (_a = content.divisorAllTimeDateRange) !== null && _a !== void 0 ? _a : false;
                setContent(function (prev) { return (__assign(__assign({}, prev), { divisorAllTimeDateRange: !currentValue })); });
            }}/>{' '}
            <react_i18next_1.Trans>All time divisor</react_i18next_1.Trans>
          </view_1.View>)}
      </view_1.View>
      <view_1.View style={{
            background: theme_1.theme.pageBackground,
            padding: 20,
            paddingTop: 0,
            flexGrow: 1,
        }}>
        <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
        }}>
          <Operator type={content.type} dividendFilterObject={dividendFilters} divisorFilterObject={divisorFilters} showDivisorDateRange={content.type === 'percentage'
            ? !((_o = content.divisorAllTimeDateRange) !== null && _o !== void 0 ? _o : false)
            : false} fromRange={(_p = data === null || data === void 0 ? void 0 : data.fromRange) !== null && _p !== void 0 ? _p : ''} toRange={(_q = data === null || data === void 0 ? void 0 : data.toRange) !== null && _q !== void 0 ? _q : ''}/>
          {content.type !== 'sum' && (<>
              <v1_1.SvgEquals width={50} style={{ marginLeft: 56 }}/>
              <view_1.View style={{ padding: 16 }}>
                <text_1.Text style={{
                fontSize: '50px',
                width: '100%',
                textAlign: 'center',
            }}>
                  <PrivacyFilter_1.PrivacyFilter>
                    {format((_r = data === null || data === void 0 ? void 0 : data.dividend) !== null && _r !== void 0 ? _r : 0, 'financial')}
                  </PrivacyFilter_1.PrivacyFilter>
                </text_1.Text>
                <div style={{
                width: '100%',
                marginTop: 32,
                marginBottom: 32,
                borderTop: '2px solid',
                borderBottom: '2px solid',
            }}/>
                <text_1.Text style={{
                fontSize: '50px',
                width: '100%',
                textAlign: 'center',
            }}>
                  <PrivacyFilter_1.PrivacyFilter>
                    {getDivisorFormatted(content.type, (_s = data === null || data === void 0 ? void 0 : data.divisor) !== null && _s !== void 0 ? _s : 0)}
                  </PrivacyFilter_1.PrivacyFilter>
                </text_1.Text>
              </view_1.View>
            </>)}
          <v1_1.SvgEquals width={50} style={{ marginLeft: 16 }}/>
          <view_1.View style={{
            flexGrow: 1,
            textAlign: 'center',
            width: '250px',
            maxWidth: '250px',
            justifyItems: 'center',
            alignItems: 'center',
            marginLeft: 16,
            fontSize: '50px',
            justifyContent: 'center',
            color: ((_t = data === null || data === void 0 ? void 0 : data.total) !== null && _t !== void 0 ? _t : 0) < 0
                ? chart_theme_1.chartTheme.colors.red
                : chart_theme_1.chartTheme.colors.blue,
        }}>
            <PrivacyFilter_1.PrivacyFilter>
              {content.type === 'percentage'
            ? format(Math.abs((_u = data === null || data === void 0 ? void 0 : data.total) !== null && _u !== void 0 ? _u : 0), 'number')
            : format(Math.abs(Math.round((_v = data === null || data === void 0 ? void 0 : data.total) !== null && _v !== void 0 ? _v : 0)), 'financial')}
              {content.type === 'percentage' ? '%' : ''}
            </PrivacyFilter_1.PrivacyFilter>
          </view_1.View>
        </view_1.View>
      </view_1.View>
    </Page_1.Page>);
}
function Operator(_a) {
    var type = _a.type, dividendFilterObject = _a.dividendFilterObject, divisorFilterObject = _a.divisorFilterObject, fromRange = _a.fromRange, toRange = _a.toRange, showDivisorDateRange = _a.showDivisorDateRange;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View>
      <SumWithRange from={fromRange} to={toRange} filterObject={dividendFilterObject}/>
      {type === 'percentage' && (<>
          <div style={{
                width: '100%',
                marginTop: 32,
                marginBottom: 32,
                borderTop: '2px solid',
                borderBottom: '2px solid',
            }}/>
          <SumWithRange from={!showDivisorDateRange ? '' : fromRange} to={!showDivisorDateRange ? '' : toRange} filterObject={divisorFilterObject}/>
        </>)}
      {type !== 'percentage' && type !== 'sum' && (<>
          <div style={{
                width: '100%',
                marginTop: 32,
                marginBottom: 32,
                borderTop: '2px solid',
                borderBottom: '2px solid',
            }}/>
          <text_1.Text style={{ fontSize: '32px', width: '100%', textAlign: 'center' }}>
            {type === 'avgPerMonth'
                ? t('number of months')
                : type === 'avgPerYear'
                    ? t('number of years')
                    : t('number of transactions')}
          </text_1.Text>
        </>)}
    </view_1.View>);
}
function SumWithRange(_a) {
    var _b, _c;
    var from = _a.from, to = _a.to, containerStyle = _a.containerStyle, filterObject = _a.filterObject;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={__assign(__assign({}, containerStyle), { height: '100%', flexDirection: 'row', alignItems: 'center', position: 'relative', display: 'grid', gridTemplateColumns: '70px 15px 1fr 15px' })}>
      <view_1.View style={{ position: 'relative', height: '50px', marginRight: 50 }}>
        <v2_1.SvgSum width={50} height={50}/>
        <text_1.Text style={{ position: 'absolute', right: -30, top: -20 }}>{to}</text_1.Text>
        <text_1.Text style={{ position: 'absolute', right: -30, bottom: -20 }}>
          {from}
        </text_1.Text>
      </view_1.View>
      <v2_1.SvgOpenParenthesis width={15} style={{ height: '100%' }}/>
      <view_1.View style={{ marginLeft: 16, maxWidth: '220px', marginRight: 16 }}>
        {((_c = (_b = filterObject.conditions) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) === 0 ? (<text_1.Text style={{ fontSize: '25px', color: theme_1.theme.pageTextPositive }}>
            {t('all transactions')}
          </text_1.Text>) : (<AppliedFilters_1.AppliedFilters conditions={filterObject.conditions} onUpdate={filterObject.onUpdate} onDelete={filterObject.onDelete} conditionsOp={filterObject.conditionsOp} onConditionsOpChange={filterObject.onConditionsOpChange}/>)}
      </view_1.View>
      <v2_1.SvgCloseParenthesis width={15} style={{ height: '100%' }}/>
      <view_1.View style={{ position: 'absolute', top: -15, right: -55 }}>
        <FiltersMenu_1.FilterButton compact={false} onApply={filterObject.onApply} hover={false} exclude={undefined}/>
      </view_1.View>
    </view_1.View>);
}
