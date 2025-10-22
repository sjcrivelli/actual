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
exports.NetWorth = NetWorth;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var paragraph_1 = require("@actual-app/components/paragraph");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var EditablePageHeaderTitle_1 = require("@desktop-client/components/EditablePageHeaderTitle");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var Page_1 = require("@desktop-client/components/Page");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var Change_1 = require("@desktop-client/components/reports/Change");
var NetWorthGraph_1 = require("@desktop-client/components/reports/graphs/NetWorthGraph");
var Header_1 = require("@desktop-client/components/reports/Header");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ReportOptions_1 = require("@desktop-client/components/reports/ReportOptions");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var net_worth_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/net-worth-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var util_1 = require("@desktop-client/components/reports/util");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useRuleConditionFilters_1 = require("@desktop-client/hooks/useRuleConditionFilters");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useWidget_1 = require("@desktop-client/hooks/useWidget");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function NetWorth() {
    var _a;
    var params = (0, react_router_1.useParams)();
    var _b = (0, useWidget_1.useWidget)((_a = params.id) !== null && _a !== void 0 ? _a : '', 'net-worth-card'), widget = _b.data, isLoading = _b.isLoading;
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator />;
    }
    return <NetWorthInner widget={widget}/>;
}
function NetWorthInner(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f;
    var widget = _a.widget;
    var locale = (0, useLocale_1.useLocale)();
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var _g = (0, useRuleConditionFilters_1.useRuleConditionFilters)((_b = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _b === void 0 ? void 0 : _b.conditions, (_c = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _c === void 0 ? void 0 : _c.conditionsOp), conditions = _g.conditions, conditionsOp = _g.conditionsOp, onApplyFilter = _g.onApply, onDeleteFilter = _g.onDelete, onUpdateFilter = _g.onUpdate, onConditionsOpChange = _g.onConditionsOpChange;
    var _h = (0, react_1.useState)(null), allMonths = _h[0], setAllMonths = _h[1];
    var _j = (0, react_1.useState)(monthUtils.currentMonth()), start = _j[0], setStart = _j[1];
    var _k = (0, react_1.useState)(monthUtils.currentMonth()), end = _k[0], setEnd = _k[1];
    var _l = (0, react_1.useState)('sliding-window'), mode = _l[0], setMode = _l[1];
    var _m = (0, react_1.useState)(((_d = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _d === void 0 ? void 0 : _d.interval) || 'Monthly'), interval = _m[0], setInterval = _m[1];
    var _o = (0, react_1.useState)(''), latestTransaction = _o[0], setLatestTransaction = _o[1];
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    var reportParams = (0, react_1.useMemo)(function () {
        return (0, net_worth_spreadsheet_1.createSpreadsheet)(start, end, accounts, conditions, conditionsOp, locale, interval, firstDayOfWeekIdx, format);
    }, [
        start,
        end,
        accounts,
        conditions,
        conditionsOp,
        locale,
        interval,
        firstDayOfWeekIdx,
        format,
    ]);
    var data = (0, useReport_1.useReport)('net_worth', reportParams);
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
                                ? monthUtils.monthFromDate(d.parseISO((0, util_1.fromDateRepr)(earliestTransaction.date)))
                                : currentMonth;
                            latestMonth = latestTransaction
                                ? monthUtils.monthFromDate(d.parseISO((0, util_1.fromDateRepr)(latestTransaction.date)))
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
            var _b = (0, reportRanges_1.calculateTimeRange)((_a = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _a === void 0 ? void 0 : _a.timeFrame, undefined, latestTransaction), initialStart = _b[0], initialEnd = _b[1], initialMode = _b[2];
            setStart(initialStart);
            setEnd(initialEnd);
            setMode(initialMode);
        }
    }, [latestTransaction, (_e = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _e === void 0 ? void 0 : _e.timeFrame]);
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
                            throw new Error('No widget that could be saved.');
                        }
                        return [4 /*yield*/, (0, fetch_1.send)('dashboard-update-widget', {
                                id: widget.id,
                                meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { conditions: conditions, conditionsOp: conditionsOp, interval: interval, timeFrame: {
                                        start: start,
                                        end: end,
                                        mode: mode,
                                    } }),
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
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var title = ((_f = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _f === void 0 ? void 0 : _f.name) || t('Net Worth');
    var onSaveWidgetName = function (newName) { return __awaiter(_this, void 0, void 0, function () {
        var name;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!widget) {
                        throw new Error('No widget that could be saved.');
                    }
                    name = newName || t('Net Worth');
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
    var _p = (0, react_1.useState)(''), earliestTransaction = _p[0], setEarliestTransaction = _p[1];
    if (!allMonths || !data) {
        return null;
    }
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={title} leftContent={<MobileBackButton_1.MobileBackButton onPress={function () { return navigate('/reports'); }}/>}/>) : (<Page_1.PageHeader title={widget ? (<EditablePageHeaderTitle_1.EditablePageHeaderTitle title={title} onSave={onSaveWidgetName}/>) : (title)}/>)} padding={0}>
      <Header_1.Header allMonths={allMonths} start={start} end={end} earliestTransaction={earliestTransaction} latestTransaction={latestTransaction} firstDayOfWeekIdx={firstDayOfWeekIdx} mode={mode} onChangeDates={onChangeDates} filters={conditions} onApply={onApplyFilter} onUpdateFilter={onUpdateFilter} onDeleteFilter={onDeleteFilter} conditionsOp={conditionsOp} onConditionsOpChange={onConditionsOpChange} inlineContent={<IntervalSelector interval={interval} onChange={setInterval}/>}>
        {widget && (<button_1.Button variant="primary" onPress={onSaveWidget}>
            <react_i18next_1.Trans>Save widget</react_i18next_1.Trans>
          </button_1.Button>)}
      </Header_1.Header>

      <view_1.View style={{
            backgroundColor: theme_1.theme.tableBackground,
            padding: 20,
            paddingTop: 0,
            flex: '1 0 auto',
            overflowY: 'auto',
        }}>
        <view_1.View style={{
            textAlign: 'right',
            paddingTop: 20,
        }}>
          <view_1.View style={__assign(__assign({}, styles_1.styles.largeText), { fontWeight: 400, marginBottom: 5 })}>
            <PrivacyFilter_1.PrivacyFilter>{format(data.netWorth, 'financial')}</PrivacyFilter_1.PrivacyFilter>
          </view_1.View>
          <PrivacyFilter_1.PrivacyFilter>
            <Change_1.Change amount={data.totalChange}/>
          </PrivacyFilter_1.PrivacyFilter>
        </view_1.View>

        <NetWorthGraph_1.NetWorthGraph graphData={data.graphData} showTooltip={!isNarrowWidth} interval={interval}/>

        <view_1.View style={{ marginTop: 30, userSelect: 'none' }}>
          <paragraph_1.Paragraph>
            <strong>
              <react_i18next_1.Trans>How is net worth calculated?</react_i18next_1.Trans>
            </strong>
          </paragraph_1.Paragraph>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              Net worth shows the balance of all accounts over time, including
              all of your investments. Your “net worth” is considered to be the
              amount you’d have if you sold all your assets and paid off as much
              debt as possible. If you hover over the graph, you can also see
              the amount of assets and debt individually.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
        </view_1.View>
      </view_1.View>
    </Page_1.Page>);
}
// Interval selector component with icon-only trigger similar to filter button
function IntervalSelector(_a) {
    var _b, _c;
    var interval = _a.interval, onChange = _a.onChange;
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(false), isOpen = _d[0], setIsOpen = _d[1];
    var currentLabel = (_c = (_b = ReportOptions_1.ReportOptions.interval.find(function (opt) { return opt.key === interval; })) === null || _b === void 0 ? void 0 : _b.description) !== null && _c !== void 0 ? _c : interval;
    return (<>
      <button_1.Button ref={triggerRef} variant="bare" onPress={function () { return setIsOpen(true); }} aria-label={t('Change interval')}>
        <v1_1.SvgCalendar style={{ width: 12, height: 12 }}/>
        <span style={{ marginLeft: 5 }}>{currentLabel}</span>
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={isOpen} onOpenChange={function () { return setIsOpen(false); }}>
        <menu_1.Menu onMenuSelect={function (item) {
            onChange(item);
            setIsOpen(false);
        }} items={ReportOptions_1.ReportOptions.interval.map(function (_a) {
            var key = _a.key, description = _a.description;
            return ({
                name: key,
                text: description,
            });
        })}/>
      </popover_1.Popover>
    </>);
}
