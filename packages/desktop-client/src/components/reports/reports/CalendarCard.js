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
exports.CalendarCard = CalendarCard;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var debounce_1 = require("lodash/debounce");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var chart_theme_1 = require("@desktop-client/components/reports/chart-theme");
var DateRange_1 = require("@desktop-client/components/reports/DateRange");
var CalendarGraph_1 = require("@desktop-client/components/reports/graphs/CalendarGraph");
var LoadingIndicator_1 = require("@desktop-client/components/reports/LoadingIndicator");
var ReportCard_1 = require("@desktop-client/components/reports/ReportCard");
var ReportCardName_1 = require("@desktop-client/components/reports/ReportCardName");
var reportRanges_1 = require("@desktop-client/components/reports/reportRanges");
var calendar_spreadsheet_1 = require("@desktop-client/components/reports/spreadsheets/calendar-spreadsheet");
var useReport_1 = require("@desktop-client/components/reports/useReport");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
function CalendarCard(_a) {
    var widgetId = _a.widgetId, isEditing = _a.isEditing, _b = _a.meta, meta = _b === void 0 ? {} : _b, onMetaChange = _a.onMetaChange, onRemove = _a.onRemove, firstDayOfWeekIdx = _a.firstDayOfWeekIdx;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var _c = (0, react_1.useState)(''), latestTransaction = _c[0], setLatestTransaction = _c[1];
    (0, react_1.useEffect)(function () {
        function fetchLatestTransaction() {
            return __awaiter(this, void 0, void 0, function () {
                var latestTrans;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-latest-transaction')];
                        case 1:
                            latestTrans = _a.sent();
                            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchLatestTransaction();
    }, []);
    var _d = (0, reportRanges_1.calculateTimeRange)(meta === null || meta === void 0 ? void 0 : meta.timeFrame, {
        start: monthUtils.dayFromDate(monthUtils.currentMonth()),
        end: monthUtils.currentDay(),
        mode: 'full',
    }, latestTransaction), start = _d[0], end = _d[1];
    var params = (0, react_1.useMemo)(function () {
        return (0, calendar_spreadsheet_1.calendarSpreadsheet)(start, end, meta === null || meta === void 0 ? void 0 : meta.conditions, meta === null || meta === void 0 ? void 0 : meta.conditionsOp, firstDayOfWeekIdx);
    }, [start, end, meta === null || meta === void 0 ? void 0 : meta.conditions, meta === null || meta === void 0 ? void 0 : meta.conditionsOp, firstDayOfWeekIdx]);
    var _e = (0, react_1.useState)('row'), cardOrientation = _e[0], setCardOrientation = _e[1];
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var cardRef = (0, useResizeObserver_1.useResizeObserver)(function (rect) {
        if (rect.height > rect.width) {
            setCardOrientation('column');
        }
        else {
            setCardOrientation('row');
        }
    });
    var data = (0, useReport_1.useReport)('calendar', params);
    var _f = (0, react_1.useState)(false), nameMenuOpen = _f[0], setNameMenuOpen = _f[1];
    var _g = (0, react_1.useMemo)(function () {
        if (!data) {
            return { totalIncome: 0, totalExpense: 0 };
        }
        return {
            totalIncome: data.calendarData.reduce(function (prev, cur) { return prev + cur.totalIncome; }, 0),
            totalExpense: data.calendarData.reduce(function (prev, cur) { return prev + cur.totalExpense; }, 0),
        };
    }, [data]), totalIncome = _g.totalIncome, totalExpense = _g.totalExpense;
    var _h = (0, react_1.useState)([]), monthNameFormats = _h[0], setMonthNameFormats = _h[1];
    var _j = (0, react_1.useState)('MMMM yyyy'), selectedMonthNameFormat = _j[0], setSelectedMonthNameFormat = _j[1];
    (0, react_1.useEffect)(function () {
        if (data) {
            setMonthNameFormats(Array(data.calendarData.length).map(function () { return 'MMMM yyyy'; }));
        }
        else {
            setMonthNameFormats([]);
        }
    }, [data]);
    (0, react_1.useEffect)(function () {
        if (monthNameFormats.length) {
            setSelectedMonthNameFormat(monthNameFormats.reduce(function (a, b) { var _a, _b; return (((_a = a === null || a === void 0 ? void 0 : a.length) !== null && _a !== void 0 ? _a : 0) <= ((_b = b === null || b === void 0 ? void 0 : b.length) !== null && _b !== void 0 ? _b : 0) ? a : b); }, 'MMMM yyyy'));
        }
        else {
            setSelectedMonthNameFormat('MMMM yyyy');
        }
    }, [monthNameFormats]);
    var calendarLenSize = (0, react_1.useMemo)(function () {
        if (!data) {
            return 0;
        }
        return data === null || data === void 0 ? void 0 : data.calendarData.length;
    }, [data]);
    return (<ReportCard_1.ReportCard isEditing={isEditing} to={"/reports/calendar/".concat(widgetId)} menuItems={[
            {
                name: 'rename',
                text: t('Rename'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ]} onMenuSelect={function (item) {
            switch (item) {
                case 'rename':
                    setNameMenuOpen(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error("Unrecognized selection: ".concat(item));
            }
        }}>
      <view_1.View ref={function (el) { return (el ? cardRef(el) : undefined); }} style={{ flex: 1, margin: 2, overflow: 'hidden', width: '100%' }}>
        <view_1.View style={{ flexDirection: 'row', padding: 20, paddingBottom: 0 }}>
          <view_1.View style={{ flex: 1, marginBottom: -5 }}>
            <ReportCardName_1.ReportCardName name={(meta === null || meta === void 0 ? void 0 : meta.name) || t('Calendar')} isEditing={nameMenuOpen} onChange={function (newName) {
            onMetaChange(__assign(__assign({}, meta), { name: newName }));
            setNameMenuOpen(false);
        }} onClose={function () { return setNameMenuOpen(false); }}/>
          </view_1.View>
          <view_1.View style={{ textAlign: 'right' }}>
            <block_1.Block style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 500 })}>
              <tooltip_1.Tooltip content={<view_1.View style={{ lineHeight: 1.5 }}>
                    <view_1.View style={{
                display: 'grid',
                gridTemplateColumns: '70px 1fr',
                gridAutoRows: '1fr',
            }}>
                      {totalIncome !== 0 && (<>
                          <view_1.View style={{
                    textAlign: 'right',
                    marginRight: 4,
                }}>
                            <react_i18next_1.Trans>Income:</react_i18next_1.Trans>
                          </view_1.View>
                          <view_1.View style={{ color: chart_theme_1.chartTheme.colors.blue }}>
                            {totalIncome !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
                                {format(totalIncome, 'financial')}
                              </PrivacyFilter_1.PrivacyFilter>) : ('')}
                          </view_1.View>
                        </>)}
                      {totalExpense !== 0 && (<>
                          <view_1.View style={{
                    textAlign: 'right',
                    marginRight: 4,
                }}>
                            <react_i18next_1.Trans>Expenses:</react_i18next_1.Trans>
                          </view_1.View>
                          <view_1.View style={{ color: chart_theme_1.chartTheme.colors.red }}>
                            {totalExpense !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
                                {format(totalExpense, 'financial')}
                              </PrivacyFilter_1.PrivacyFilter>) : ('')}
                          </view_1.View>
                        </>)}
                    </view_1.View>
                  </view_1.View>}>
                <DateRange_1.DateRange start={start} end={end}/>
              </tooltip_1.Tooltip>
            </block_1.Block>
          </view_1.View>
        </view_1.View>
        <view_1.View style={__assign({ height: '100%', margin: 6, overflowX: cardOrientation === 'row'
                ? isNarrowWidth
                    ? 'auto'
                    : calendarLenSize > 4
                        ? 'auto'
                        : 'hidden'
                : 'hidden' }, styles_1.styles.horizontalScrollbar)}>
          <view_1.View style={{
            flex: 1,
            flexDirection: cardOrientation,
            gap: 16,
            marginTop: 10,
            textAlign: 'left',
            marginBottom: isNarrowWidth ? 4 : 0,
            width: cardOrientation === 'row'
                ? isNarrowWidth
                    ? "".concat(calendarLenSize * 100, "%")
                    : calendarLenSize > 4
                        ? "".concat(100 + ((calendarLenSize - 4) % 4) * 25, "%")
                        : 'auto'
                : 'auto',
        }}>
            {data ? (data.calendarData.map(function (calendar, index) { return (<CalendarCardInner key={index} calendar={calendar} firstDayOfWeekIdx={firstDayOfWeekIdx !== null && firstDayOfWeekIdx !== void 0 ? firstDayOfWeekIdx : '0'} setMonthNameFormats={setMonthNameFormats} selectedMonthNameFormat={selectedMonthNameFormat} index={index} widgetId={widgetId} isEditing={isEditing} format={format}/>); })) : (<LoadingIndicator_1.LoadingIndicator />)}
          </view_1.View>
        </view_1.View>
      </view_1.View>
    </ReportCard_1.ReportCard>);
}
function CalendarCardInner(_a) {
    var calendar = _a.calendar, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, setMonthNameFormats = _a.setMonthNameFormats, selectedMonthNameFormat = _a.selectedMonthNameFormat, index = _a.index, widgetId = _a.widgetId, isEditing = _a.isEditing, format = _a.format;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(true), monthNameVisible = _b[0], setMonthNameVisible = _b[1];
    var monthFormatSizeContainers = (0, react_1.useRef)(new Array(5));
    var monthNameContainerRef = (0, react_1.useRef)(null);
    var measureMonthFormats = (0, react_1.useCallback)(function () {
        var measurements = monthFormatSizeContainers.current.map(function (container) {
            var _a, _b;
            return ({
                width: (_a = container === null || container === void 0 ? void 0 : container.clientWidth) !== null && _a !== void 0 ? _a : 0,
                format: (_b = container === null || container === void 0 ? void 0 : container.getAttribute('data-format')) !== null && _b !== void 0 ? _b : '',
            });
        });
        return measurements;
    }, []);
    var debouncedResizeCallback = (0, react_1.useMemo)(function () {
        return (0, debounce_1.default)(function () {
            var _a, _b;
            var measurements = measureMonthFormats();
            var containerWidth = (_b = (_a = monthNameContainerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0;
            var suitableFormat = measurements.find(function (m) { return containerWidth > m.width; });
            if (suitableFormat) {
                if (monthNameContainerRef.current &&
                    containerWidth > suitableFormat.width) {
                    setMonthNameFormats(function (prev) {
                        if (prev[index] === suitableFormat.format)
                            return prev;
                        var newArray = __spreadArray([], prev, true);
                        newArray[index] = suitableFormat.format;
                        return newArray;
                    });
                    setMonthNameVisible(true);
                    return;
                }
            }
            if (monthNameContainerRef.current &&
                monthNameContainerRef.current.scrollWidth >
                    monthNameContainerRef.current.clientWidth) {
                setMonthNameVisible(false);
            }
            else {
                setMonthNameVisible(true);
            }
        }, 20);
    }, [measureMonthFormats, monthNameContainerRef, index, setMonthNameFormats]);
    var monthNameResizeRef = (0, useResizeObserver_1.useResizeObserver)(debouncedResizeCallback);
    (0, react_1.useEffect)(function () {
        var toCancel = debouncedResizeCallback;
        return function () {
            toCancel.cancel();
        };
    }, [debouncedResizeCallback]);
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(monthNameContainerRef, monthNameResizeRef);
    var navigate = (0, useNavigate_1.useNavigate)();
    var monthFormats = [
        { format: 'MMMM yyyy', text: (0, date_fns_1.format)(calendar.start, 'MMMM yyyy') },
        { format: 'MMM yyyy', text: (0, date_fns_1.format)(calendar.start, 'MMM yyyy') },
        { format: 'MMM yy', text: (0, date_fns_1.format)(calendar.start, 'MMM yy') },
        { format: 'MMM', text: (0, date_fns_1.format)(calendar.start, 'MMM') },
        { format: '', text: '' },
    ];
    return (<view_1.View style={{ flex: 1, overflow: 'visible' }}>
      <view_1.View style={{
            flexDirection: 'row',
            marginLeft: 5,
            marginRight: 5,
        }}>
        <view_1.View ref={mergedRef} style={{
            color: theme_1.theme.pageTextSubdued,
            fontWeight: 'bold',
            flex: 1,
            overflow: 'hidden',
            display: 'block',
            width: '100%',
        }}>
          <button_1.Button variant="bare" style={{
            visibility: monthNameVisible ? 'visible' : 'hidden',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            width: 'max-content',
            margin: 0,
            padding: 0,
            color: theme_1.theme.pageTextSubdued,
            fontWeight: 'bold',
            fontSize: '12px',
            marginBottom: 6,
        }} onPress={function () {
            navigate("/reports/calendar/".concat(widgetId, "?month=").concat((0, date_fns_1.format)(calendar.start, 'yyyy-MM')));
        }}>
            {selectedMonthNameFormat &&
            (0, date_fns_1.format)(calendar.start, selectedMonthNameFormat)}
          </button_1.Button>
        </view_1.View>
        <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
        }}>
          <view_1.View style={{
            color: chart_theme_1.chartTheme.colors.blue,
            flexDirection: 'row',
            fontSize: '10px',
            marginRight: 10,
        }} aria-label={t('Income')}>
            {calendar.totalIncome !== 0 ? (<>
                <v1_1.SvgArrowThickUp width={16} height={16} style={{ flexShrink: 0 }}/>
                <PrivacyFilter_1.PrivacyFilter>
                  {format(calendar.totalIncome, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </>) : ('')}
          </view_1.View>
          <view_1.View style={{
            color: chart_theme_1.chartTheme.colors.red,
            flexDirection: 'row',
            fontSize: '10px',
        }} aria-label={t('Expenses')}>
            {calendar.totalExpense !== 0 ? (<>
                <v1_1.SvgArrowThickDown width={16} height={16} style={{ flexShrink: 0 }}/>
                <PrivacyFilter_1.PrivacyFilter>
                  {format(calendar.totalExpense, 'financial')}
                </PrivacyFilter_1.PrivacyFilter>
              </>) : ('')}
          </view_1.View>
        </view_1.View>
      </view_1.View>
      <CalendarGraph_1.CalendarGraph data={calendar.data} start={calendar.start} firstDayOfWeekIdx={firstDayOfWeekIdx} isEditing={isEditing} onDayClick={function (date) {
            if (date) {
                navigate("/reports/calendar/".concat(widgetId, "?day=").concat((0, date_fns_1.format)(date, 'yyyy-MM-dd')));
            }
            else {
                navigate("/reports/calendar/".concat(widgetId));
            }
        }}/>
      <view_1.View style={{ fontWeight: 'bold', fontSize: '12px' }}>
        {monthFormats.map(function (item, idx) { return (<span key={item.format} ref={function (node) {
                if (node)
                    monthFormatSizeContainers.current[idx] = node;
            }} style={{ position: 'fixed', top: -9999, left: -9999 }} data-format={item.format}>
            {item.text}
            {item.text && ':'}
          </span>); })}
      </view_1.View>
    </view_1.View>);
}
