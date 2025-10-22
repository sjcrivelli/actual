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
exports.defaultTimeFrame = void 0;
exports.CashFlow = CashFlow;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var paragraph_1 = require("@actual-app/components/paragraph");
var text_1 = require("@actual-app/components/text");
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
var CashFlowGraph_1 = require("@desktop-client/components/reports/graphs/CashFlowGraph");
var Header_1 = require("@desktop-client/components/reports/Header");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var cash_flow_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/cash-flow-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useRuleConditionFilters_1 = require("@desktop-client/hooks/useRuleConditionFilters");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var useWidget_1 = require("@desktop-client/hooks/useWidget");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
exports.defaultTimeFrame = {
    start: monthUtils.dayFromDate(monthUtils.currentMonth()),
    end: monthUtils.currentDay(),
    mode: 'sliding-window',
};
function CashFlow() {
    var _a;
    var params = (0, react_router_1.useParams)();
    var _b = (0, useWidget_1.useWidget)((_a = params.id) !== null && _a !== void 0 ? _a : '', 'cash-flow-card'), widget = _b.data, isLoading = _b.isLoading;
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator />;
    }
    return <CashFlowInner widget={widget}/>;
}
function CashFlowInner(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g;
    var widget = _a.widget;
    var locale = (0, useLocale_1.useLocale)();
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _h = (0, useRuleConditionFilters_1.useRuleConditionFilters)((_b = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _b === void 0 ? void 0 : _b.conditions, (_c = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _c === void 0 ? void 0 : _c.conditionsOp), conditions = _h.conditions, conditionsOp = _h.conditionsOp, onApplyFilter = _h.onApply, onDeleteFilter = _h.onDelete, onUpdateFilter = _h.onUpdate, onConditionsOpChange = _h.onConditionsOpChange;
    var _j = (0, react_1.useState)(null), allMonths = _j[0], setAllMonths = _j[1];
    var _k = (0, react_1.useState)(monthUtils.currentMonth()), start = _k[0], setStart = _k[1];
    var _l = (0, react_1.useState)(monthUtils.currentMonth()), end = _l[0], setEnd = _l[1];
    var _m = (0, react_1.useState)('sliding-window'), mode = _m[0], setMode = _m[1];
    var _o = (0, react_1.useState)((_e = (_d = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _d === void 0 ? void 0 : _d.showBalance) !== null && _e !== void 0 ? _e : true), showBalance = _o[0], setShowBalance = _o[1];
    var _p = (0, react_1.useState)(''), latestTransaction = _p[0], setLatestTransaction = _p[1];
    var _q = (0, react_1.useState)(function () {
        var numDays = d.differenceInCalendarDays(d.parseISO(end), d.parseISO(start));
        return numDays > 31 * 3;
    }), isConcise = _q[0], setIsConcise = _q[1];
    var params = (0, react_1.useMemo)(function () {
        return (0, cash_flow_spreadsheet_1.cashFlowByDate)(start, end, isConcise, conditions, conditionsOp, locale, format);
    }, [start, end, isConcise, conditions, conditionsOp, locale, format]);
    var data = (0, useReport_1.useReport)('cash_flow', params);
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var earliestTransaction, latestTransaction, earliestMonth, latestMonth, allMonths;
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
                            earliestMonth = earliestTransaction
                                ? monthUtils.monthFromDate(d.parseISO(earliestTransaction.date))
                                : monthUtils.currentMonth();
                            latestMonth = latestTransaction
                                ? monthUtils.monthFromDate(d.parseISO(latestTransaction.date))
                                : monthUtils.currentMonth();
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
            var _b = (0, reportRanges_1.calculateTimeRange)((_a = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _a === void 0 ? void 0 : _a.timeFrame, exports.defaultTimeFrame, latestTransaction), initialStart = _b[0], initialEnd = _b[1], initialMode = _b[2];
            setStart(initialStart);
            setEnd(initialEnd);
            setMode(initialMode);
        }
    }, [latestTransaction, (_f = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _f === void 0 ? void 0 : _f.timeFrame]);
    function onChangeDates(start, end, mode) {
        var numDays = d.differenceInCalendarDays(d.parseISO(end), d.parseISO(start));
        var isConcise = numDays > 31 * 3;
        setStart(start);
        setEnd(end);
        setMode(mode);
        setIsConcise(isConcise);
    }
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
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
                                meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { conditions: conditions, conditionsOp: conditionsOp, timeFrame: {
                                        start: start,
                                        end: end,
                                        mode: mode,
                                    }, showBalance: showBalance }),
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
    var title = ((_g = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _g === void 0 ? void 0 : _g.name) || t('Cash Flow');
    var onSaveWidgetName = function (newName) { return __awaiter(_this, void 0, void 0, function () {
        var name;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!widget) {
                        throw new Error('No widget that could be saved.');
                    }
                    name = newName || t('Cash Flow');
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
    var _r = (0, react_1.useState)(''), earliestTransaction = _r[0], setEarliestTransaction = _r[1];
    var _firstDayOfWeekIdx = (0, useSyncedPref_1.useSyncedPref)('firstDayOfWeekIdx')[0];
    var firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    if (!allMonths || !data) {
        return null;
    }
    var graphData = data.graphData, totalExpenses = data.totalExpenses, totalIncome = data.totalIncome, totalTransfers = data.totalTransfers;
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={title} leftContent={<MobileBackButton_1.MobileBackButton onPress={function () { return navigate('/reports'); }}/>}/>) : (<Page_1.PageHeader title={widget ? (<EditablePageHeaderTitle_1.EditablePageHeaderTitle title={title} onSave={onSaveWidgetName}/>) : (title)}/>)} padding={0}>
      <Header_1.Header allMonths={allMonths} start={start} end={end} earliestTransaction={earliestTransaction} latestTransaction={latestTransaction} firstDayOfWeekIdx={firstDayOfWeekIdx} mode={mode} show1Month onChangeDates={onChangeDates} onApply={onApplyFilter} filters={conditions} onUpdateFilter={onUpdateFilter} onDeleteFilter={onDeleteFilter} conditionsOp={conditionsOp} onConditionsOpChange={onConditionsOpChange}>
        <view_1.View style={{ flexDirection: 'row', gap: 10 }}>
          <button_1.Button onPress={function () { return setShowBalance(function (state) { return !state; }); }}>
            {showBalance ? t('Hide balance') : t('Show balance')}
          </button_1.Button>

          {widget && (<button_1.Button variant="primary" onPress={onSaveWidget}>
              <react_i18next_1.Trans>Save widget</react_i18next_1.Trans>
            </button_1.Button>)}
        </view_1.View>
      </Header_1.Header>
      <view_1.View style={{
            backgroundColor: theme_1.theme.tableBackground,
            padding: 20,
            paddingTop: 0,
            flex: '1 0 auto',
            overflowY: 'auto',
        }}>
        <view_1.View style={{
            paddingTop: 20,
            alignItems: 'flex-end',
            color: theme_1.theme.pageText,
        }}>
          <aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 160 }} left={<block_1.Block>
                <react_i18next_1.Trans>Income:</react_i18next_1.Trans>
              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                <PrivacyFilter_1.PrivacyFilter>
                  {format(totalIncome, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </text_1.Text>}/>

          <aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 160 }} left={<block_1.Block>
                <react_i18next_1.Trans>Expenses:</react_i18next_1.Trans>
              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                <PrivacyFilter_1.PrivacyFilter>
                  {format(totalExpenses, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </text_1.Text>}/>

          <aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 160 }} left={<block_1.Block>
                <react_i18next_1.Trans>Transfers:</react_i18next_1.Trans>
              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                <PrivacyFilter_1.PrivacyFilter>
                  {format(totalTransfers, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </text_1.Text>}/>
          <text_1.Text style={{ fontWeight: 600 }}>
            <PrivacyFilter_1.PrivacyFilter>
              <Change_1.Change amount={totalIncome + totalExpenses + totalTransfers}/>
            </PrivacyFilter_1.PrivacyFilter>
          </text_1.Text>
        </view_1.View>

        <CashFlowGraph_1.CashFlowGraph graphData={graphData} isConcise={isConcise} showBalance={showBalance}/>

        <view_1.View style={{
            marginTop: 30,
            userSelect: 'none',
        }}>
          <react_i18next_1.Trans>
            <paragraph_1.Paragraph>
              <strong>How is cash flow calculated?</strong>
            </paragraph_1.Paragraph>
            <paragraph_1.Paragraph>
              Cash flow shows the balance of your budgeted accounts over time,
              and the amount of expenses/income each day or month. Your budgeted
              accounts are considered to be “cash on hand,” so this gives you a
              picture of how available money fluctuates.
            </paragraph_1.Paragraph>
          </react_i18next_1.Trans>
        </view_1.View>
      </view_1.View>
    </Page_1.Page>);
}
