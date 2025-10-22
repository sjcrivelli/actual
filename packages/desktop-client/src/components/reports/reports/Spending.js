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
exports.Spending = Spending;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var paragraph_1 = require("@actual-app/components/paragraph");
var select_1 = require("@actual-app/components/select");
var space_between_1 = require("@actual-app/components/space-between");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var d = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var EditablePageHeaderTitle_1 = require("@desktop-client/components/EditablePageHeaderTitle");
var AppliedFilters_1 = require("@desktop-client/components/filters/AppliedFilters");
var FiltersMenu_1 = require("@desktop-client/components/filters/FiltersMenu");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var Page_1 = require("@desktop-client/components/Page");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var SpendingGraph_1 = require("@desktop-client/components/reports/graphs/SpendingGraph");
var LegendItem_1 = require("@desktop-client/components/reports/LegendItem");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ModeButton_1 = require("@desktop-client/components/reports/ModeButton");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var spending_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/spending-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var util_1 = require("@desktop-client/components/reports/util");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useRuleConditionFilters_1 = require("@desktop-client/hooks/useRuleConditionFilters");
var useWidget_1 = require("@desktop-client/hooks/useWidget");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function Spending() {
    var _a;
    var params = (0, react_router_1.useParams)();
    var _b = (0, useWidget_1.useWidget)((_a = params.id) !== null && _a !== void 0 ? _a : '', 'spending-card'), widget = _b.data, isLoading = _b.isLoading;
    if (isLoading) {
        return <LoadingIndicator_1.LoadingIndicator />;
    }
    return <SpendingInternal widget={widget}/>;
}
function SpendingInternal(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var widget = _a.widget;
    var locale = (0, useLocale_1.useLocale)();
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _k = (0, useRuleConditionFilters_1.useRuleConditionFilters)((_b = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _b === void 0 ? void 0 : _b.conditions, (_c = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _c === void 0 ? void 0 : _c.conditionsOp), conditions = _k.conditions, conditionsOp = _k.conditionsOp, onApplyFilter = _k.onApply, onDeleteFilter = _k.onDelete, onUpdateFilter = _k.onUpdate, onConditionsOpChange = _k.onConditionsOpChange;
    var emptyIntervals = [];
    var _l = (0, react_1.useState)(emptyIntervals), allIntervals = _l[0], setAllIntervals = _l[1];
    var initialReportMode = (_e = (_d = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _d === void 0 ? void 0 : _d.mode) !== null && _e !== void 0 ? _e : 'single-month';
    var _m = (0, reportRanges_1.calculateSpendingReportTimeRange)((_f = widget === null || widget === void 0 ? void 0 : widget.meta) !== null && _f !== void 0 ? _f : {}), initialCompare = _m[0], initialCompareTo = _m[1];
    var _o = (0, react_1.useState)(initialCompare), compare = _o[0], setCompare = _o[1];
    var _p = (0, react_1.useState)(initialCompareTo), compareTo = _p[0], setCompareTo = _p[1];
    var _q = (0, react_1.useState)((_h = (_g = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _g === void 0 ? void 0 : _g.isLive) !== null && _h !== void 0 ? _h : true), isLive = _q[0], setIsLive = _q[1];
    var _r = (0, react_1.useState)(initialReportMode), reportMode = _r[0], setReportMode = _r[1];
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var earliestTrans, latestTrans, currentMonth, earliestMonth, latestMonth, yearAgo, allMonths;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-earliest-transaction')];
                        case 1:
                            earliestTrans = _a.sent();
                            return [4 /*yield*/, (0, fetch_1.send)('get-latest-transaction')];
                        case 2:
                            latestTrans = _a.sent();
                            currentMonth = monthUtils.currentMonth();
                            earliestMonth = earliestTrans
                                ? monthUtils.monthFromDate(d.parseISO((0, util_1.fromDateRepr)(earliestTrans.date)))
                                : currentMonth;
                            latestMonth = latestTrans
                                ? monthUtils.monthFromDate(d.parseISO((0, util_1.fromDateRepr)(latestTrans.date)))
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
                            setAllIntervals(allMonths);
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, [locale]);
    var getGraphData = (0, react_1.useMemo)(function () {
        return (0, spending_spreadsheet_1.createSpendingSpreadsheet)({
            conditions: conditions,
            conditionsOp: conditionsOp,
            compare: compare,
            compareTo: compareTo,
        });
    }, [conditions, conditionsOp, compare, compareTo]);
    var data = (0, useReport_1.useReport)('default', getGraphData);
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
                                meta: __assign(__assign({}, ((_a = widget.meta) !== null && _a !== void 0 ? _a : {})), { conditions: conditions, conditionsOp: conditionsOp, compare: compare, compareTo: compareTo, isLive: isLive, mode: reportMode }),
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
    if (!data) {
        return null;
    }
    var showAverage = data.intervalData[27].months[monthUtils.subMonths(compare, 3)] &&
        Math.abs(data.intervalData[27].months[monthUtils.subMonths(compare, 3)].cumulative) > 0;
    var todayDay = compare !== monthUtils.currentMonth()
        ? 27
        : monthUtils.getDay(monthUtils.currentDay()) - 1 >= 28
            ? 27
            : monthUtils.getDay(monthUtils.currentDay()) - 1;
    var showCompareTo = compareTo === monthUtils.currentMonth() ||
        Math.abs(data.intervalData[27].compareTo) > 0;
    var showCompare = compare === monthUtils.currentMonth() ||
        Math.abs(data.intervalData[27].compare) > 0;
    var title = ((_j = widget === null || widget === void 0 ? void 0 : widget.meta) === null || _j === void 0 ? void 0 : _j.name) || t('Monthly Spending');
    var onSaveWidgetName = function (newName) { return __awaiter(_this, void 0, void 0, function () {
        var name;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!widget) {
                        throw new Error('No widget that could be saved.');
                    }
                    name = newName || t('Monthly Spending');
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
    return (<Page_1.Page header={isNarrowWidth ? (<Page_1.MobilePageHeader title={title} leftContent={<MobileBackButton_1.MobileBackButton onPress={function () { return navigate('/reports'); }}/>}/>) : (<Page_1.PageHeader title={widget ? (<EditablePageHeaderTitle_1.EditablePageHeaderTitle title={title} onSave={onSaveWidgetName}/>) : (title)}/>)} padding={0}>
      <view_1.View style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 15,
            paddingBottom: 20,
            flexShrink: 0,
        }}>
        {!isNarrowWidth && (<space_between_1.SpaceBetween gap={0}>
            <button_1.Button variant={isLive ? 'primary' : 'normal'} onPress={function () { return setIsLive(function (state) { return !state; }); }}>
              {isLive ? t('Live') : t('Static')}
            </button_1.Button>

            <view_1.View style={{
                width: 1,
                height: 28,
                backgroundColor: theme_1.theme.pillBorderDark,
                marginRight: 10,
                marginLeft: 10,
            }}/>

            <space_between_1.SpaceBetween gap={5}>
              <text_1.Text>
                <react_i18next_1.Trans>Compare</react_i18next_1.Trans>
              </text_1.Text>
              <select_1.Select value={compare} onChange={setCompare} options={allIntervals.map(function (_a) {
                var name = _a.name, pretty = _a.pretty;
                return [name, pretty];
            })} style={{ width: 150 }} popoverStyle={{ width: 150 }}/>
              <text_1.Text>
                <react_i18next_1.Trans>to</react_i18next_1.Trans>
              </text_1.Text>
              <select_1.Select value={reportMode === 'single-month' ? compareTo : 'label'} onChange={setCompareTo} options={reportMode === 'single-month'
                ? allIntervals.map(function (_a) {
                    var name = _a.name, pretty = _a.pretty;
                    return [name, pretty];
                })
                : [
                    [
                        'label',
                        reportMode === 'budget'
                            ? t('Budgeted')
                            : t('Average spent'),
                    ],
                ]} disabled={reportMode !== 'single-month'} style={{ width: 150 }} popoverStyle={{ width: 150 }}/>
            </space_between_1.SpaceBetween>

            <view_1.View style={{
                width: 1,
                height: 28,
                backgroundColor: theme_1.theme.pillBorderDark,
                marginRight: 15,
                marginLeft: 15,
            }}/>

            <space_between_1.SpaceBetween gap={5}>
              <ModeButton_1.ModeButton selected={reportMode === 'single-month'} style={{
                backgroundColor: 'inherit',
            }} onSelect={function () {
                setReportMode('single-month');
            }}>
                <react_i18next_1.Trans>Single month</react_i18next_1.Trans>
              </ModeButton_1.ModeButton>
              <ModeButton_1.ModeButton selected={reportMode === 'budget'} onSelect={function () {
                setReportMode('budget');
            }} style={{
                backgroundColor: 'inherit',
            }}>
                <react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>
              </ModeButton_1.ModeButton>
              <ModeButton_1.ModeButton selected={reportMode === 'average'} onSelect={function () {
                setReportMode('average');
            }} style={{
                backgroundColor: 'inherit',
            }}>
                <react_i18next_1.Trans>Average</react_i18next_1.Trans>
              </ModeButton_1.ModeButton>
            </space_between_1.SpaceBetween>

            <view_1.View style={{
                width: 1,
                height: 28,
                backgroundColor: theme_1.theme.pillBorderDark,
                marginRight: 10,
            }}/>

            <view_1.View style={{
                alignItems: 'center',
                flexDirection: 'row',
                flex: 1,
            }}>
              <FiltersMenu_1.FilterButton onApply={onApplyFilter} compact={isNarrowWidth} hover={false} exclude={['date']}/>
              <view_1.View style={{ flex: 1 }}/>

              {widget && (<tooltip_1.Tooltip placement="top end" content={<text_1.Text>
                      <react_i18next_1.Trans>Save compare and filter options</react_i18next_1.Trans>
                    </text_1.Text>} style={__assign(__assign({}, styles_1.styles.tooltip), { lineHeight: 1.5, padding: '6px 10px', marginLeft: 10 })}>
                  <button_1.Button variant="primary" style={{
                    marginLeft: 10,
                }} onPress={onSaveWidget}>
                    <react_i18next_1.Trans>Save</react_i18next_1.Trans>
                  </button_1.Button>
                </tooltip_1.Tooltip>)}
            </view_1.View>
          </space_between_1.SpaceBetween>)}

        {conditions && conditions.length > 0 && (<view_1.View style={{
                marginTop: 5,
                flexShrink: 0,
                flexDirection: 'row',
                spacing: 2,
            }}>
            <AppliedFilters_1.AppliedFilters conditions={conditions} onUpdate={onUpdateFilter} onDelete={onDeleteFilter} conditionsOp={conditionsOp} onConditionsOpChange={onConditionsOpChange}/>
          </view_1.View>)}
      </view_1.View>
      <view_1.View style={{
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 0,
            flexGrow: 1,
        }}>
        <view_1.View style={{
            flexGrow: 1,
        }}>
          <view_1.View style={{
            backgroundColor: theme_1.theme.tableBackground,
            padding: 20,
            paddingTop: 0,
            flex: '1 0 auto',
            overflowY: 'auto',
        }}>
            <view_1.View style={{
            flexDirection: 'column',
            flexGrow: 1,
            padding: 10,
            paddingTop: 10,
        }}>
              <view_1.View style={{
            alignItems: 'center',
            flexDirection: 'row',
        }}>
                <view_1.View>
                  <LegendItem_1.LegendItem color={theme_1.theme.reportsGreen} label={monthUtils.format(compare, 'MMM, yyyy', locale)} style={{ padding: 0, paddingBottom: 10 }}/>
                  <LegendItem_1.LegendItem color={theme_1.theme.reportsGray} label={reportMode === 'single-month'
            ? monthUtils.format(compareTo, 'MMM, yyyy', locale)
            : reportMode === 'budget'
                ? t('Budgeted')
                : t('Average')} style={{ padding: 0, paddingBottom: 10 }}/>
                </view_1.View>
                <view_1.View style={{ flex: 1 }}/>
                <view_1.View style={{
            alignItems: 'flex-end',
            color: theme_1.theme.pageText,
        }}>
                  <view_1.View>
                    {showCompare && (<aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 210 }} left={<block_1.Block>
                            {compare === monthUtils.currentMonth()
                    ? t('Spent {{monthYearFormatted}} MTD', {
                        monthYearFormatted: monthUtils.format(compare, 'MMM, yyyy', locale),
                    })
                    : t('Spent {{monthYearFormatted}}:', {
                        monthYearFormatted: monthUtils.format(compare, 'MMM, yyyy', locale),
                    })}
                            :
                          </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                            <PrivacyFilter_1.PrivacyFilter>
                              {format(Math.abs(data.intervalData[todayDay].compare), 'financial')}
                            </PrivacyFilter_1.PrivacyFilter>
                          </text_1.Text>}/>)}
                    {reportMode === 'single-month' && showCompareTo && (<aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 210 }} left={<block_1.Block>
                            {compareTo === monthUtils.currentMonth()
                    ? t('Spent {{monthYearFormatted}} MTD:', {
                        monthYearFormatted: monthUtils.format(compareTo, 'MMM, yyyy', locale),
                    })
                    : t('Spent {{monthYearFormatted}}:', {
                        monthYearFormatted: monthUtils.format(compareTo, 'MMM, yyyy', locale),
                    })}
                          </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                            <PrivacyFilter_1.PrivacyFilter>
                              {format(Math.abs(data.intervalData[todayDay].compareTo), 'financial')}
                            </PrivacyFilter_1.PrivacyFilter>
                          </text_1.Text>}/>)}
                  </view_1.View>
                  {Math.abs(data.intervalData[todayDay].budget) > 0 && (<aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 210 }} left={<block_1.Block>
                          {compare === monthUtils.currentMonth() ? (<react_i18next_1.Trans>Budgeted MTD</react_i18next_1.Trans>) : (<react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>)}
                        </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                          <PrivacyFilter_1.PrivacyFilter>
                            {format(Math.round(Math.abs(data.intervalData[todayDay].budget)), 'financial')}
                          </PrivacyFilter_1.PrivacyFilter>
                        </text_1.Text>}/>)}
                  {showAverage && (<aligned_text_1.AlignedText style={{ marginBottom: 5, minWidth: 210 }} left={<block_1.Block>
                          {compare === monthUtils.currentMonth()
                    ? t('Spent Average {{monthYearFormatted}} MTD:', {
                        monthYearFormatted: monthUtils.format(compare, 'MMM, yyyy'),
                    })
                    : t('Spent Average {{monthYearFormatted}}:', {
                        monthYearFormatted: monthUtils.format(compare, 'MMM, yyyy'),
                    })}
                        </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
                          <PrivacyFilter_1.PrivacyFilter>
                            {format(Math.abs(data.intervalData[todayDay].average), 'financial')}
                          </PrivacyFilter_1.PrivacyFilter>
                        </text_1.Text>}/>)}
                </view_1.View>
              </view_1.View>
              {data ? (<SpendingGraph_1.SpendingGraph style={{ flexGrow: 1 }} compact={false} data={data} mode={reportMode} compare={compare} compareTo={compareTo}/>) : (<LoadingIndicator_1.LoadingIndicator message={t('Loading report...')}/>)}
              {showAverage && (<view_1.View style={{ marginTop: 30 }}>
                  <react_i18next_1.Trans>
                    <paragraph_1.Paragraph>
                      <strong>
                        How are “Average” and “Spent Average MTD” calculated?
                      </strong>
                    </paragraph_1.Paragraph>
                    <paragraph_1.Paragraph>
                      They are both the average cumulative spending by day for
                      the three months before the selected “compare” month.
                    </paragraph_1.Paragraph>
                  </react_i18next_1.Trans>
                </view_1.View>)}
            </view_1.View>
          </view_1.View>
        </view_1.View>
      </view_1.View>
    </Page_1.Page>);
}
