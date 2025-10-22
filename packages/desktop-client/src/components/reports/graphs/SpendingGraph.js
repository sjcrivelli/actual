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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpendingGraph = SpendingGraph;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var recharts_1 = require("recharts");
var computePadding_1 = require("./util/computePadding");
var Container_1 = require("@desktop-client/components/reports/Container");
var numberFormatter_1 = require("@desktop-client/components/reports/numberFormatter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var usePrivacyMode_1 = require("@desktop-client/hooks/usePrivacyMode");
var CustomTooltip = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var active = _a.active, payload = _a.payload, balanceTypeOp = _a.balanceTypeOp, selection = _a.selection, compare = _a.compare, format = _a.format;
    var t = (0, react_i18next_1.useTranslation)().t;
    if (active && payload && payload.length) {
        var comparison = ['average', 'budget'].includes(selection)
            ? payload[0].payload[selection] * -1
            : ((_c = (_b = payload[0].payload.months[selection]) === null || _b === void 0 ? void 0 : _b.cumulative) !== null && _c !== void 0 ? _c : 0) * -1;
        return (<div className={(0, css_1.css)({
                zIndex: 1000,
                pointerEvents: 'none',
                borderRadius: 2,
                boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
                backgroundColor: theme_1.theme.menuBackground,
                color: theme_1.theme.menuItemText,
                padding: 10,
            })}>
        <div>
          <div style={{ marginBottom: 10 }}>
            <strong>
              <react_i18next_1.Trans>
                Day:{' '}
                {{
                dayOfMonth: Number(payload[0].payload.day) >= 28
                    ? t('28+')
                    : payload[0].payload.day,
            }}
              </react_i18next_1.Trans>
            </strong>
          </div>
          <div style={{ lineHeight: 1.5 }}>
            {((_d = payload[0].payload.months[compare]) === null || _d === void 0 ? void 0 : _d.cumulative) ? (<aligned_text_1.AlignedText left={t('Compare:')} right={format(((_e = payload[0].payload.months[compare]) === null || _e === void 0 ? void 0 : _e.cumulative) * -1, 'financial')}/>) : null}
            {['cumulative'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={selection === 'average'
                    ? t('Average:')
                    : selection === 'budget'
                        ? t('Budgeted:')
                        : t('To:')} right={format(Math.round(comparison), 'financial')}/>)}
            {((_f = payload[0].payload.months[compare]) === null || _f === void 0 ? void 0 : _f.cumulative) ? (<aligned_text_1.AlignedText left={t('Difference:')} right={format(Math.round(((_g = payload[0].payload.months[compare]) === null || _g === void 0 ? void 0 : _g.cumulative) * -1 -
                    comparison), 'financial')}/>) : null}
          </div>
        </div>
      </div>);
    }
};
function SpendingGraph(_a) {
    var _b, _c;
    var style = _a.style, data = _a.data, compact = _a.compact, mode = _a.mode, compare = _a.compare, compareTo = _a.compareTo;
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var balanceTypeOp = 'cumulative';
    var format = (0, useFormat_1.useFormat)();
    var selection = mode === 'single-month' ? compareTo : mode;
    var thisMonthMax = (_b = data.intervalData.reduce(function (a, b) {
        var _a, _b;
        return ((_a = a.months[compare]) === null || _a === void 0 ? void 0 : _a[balanceTypeOp]) < ((_b = b.months[compare]) === null || _b === void 0 ? void 0 : _b[balanceTypeOp])
            ? a
            : b;
    }).months[compare]) === null || _b === void 0 ? void 0 : _b[balanceTypeOp];
    var selectionMax = ['average', 'budget'].includes(selection)
        ? data.intervalData[27][selection]
        : (_c = data.intervalData.reduce(function (a, b) {
            var _a, _b;
            return ((_a = a.months[selection]) === null || _a === void 0 ? void 0 : _a[balanceTypeOp]) <
                ((_b = b.months[selection]) === null || _b === void 0 ? void 0 : _b[balanceTypeOp])
                ? a
                : b;
        }).months[selection]) === null || _c === void 0 ? void 0 : _c[balanceTypeOp];
    var maxYAxis = selectionMax > thisMonthMax;
    var dataMax = Math.max.apply(Math, data.intervalData.map(function (i) { var _a; return (_a = i.months[compare]) === null || _a === void 0 ? void 0 : _a.cumulative; }));
    var dataMin = Math.min.apply(Math, data.intervalData.map(function (i) { var _a; return (_a = i.months[compare]) === null || _a === void 0 ? void 0 : _a.cumulative; }));
    var tickFormatter = function (tick) {
        if (!privacyMode)
            return "".concat(format(tick, 'financial-no-decimals'));
        return '...';
    };
    var gradientOffset = function () {
        if (!dataMax || dataMax <= 0) {
            return 0;
        }
        if (!dataMin || dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };
    var getVal = function (obj, month) {
        var _a;
        if (['average', 'budget'].includes(month)) {
            return obj[month] && -1 * obj[month];
        }
        else {
            return (((_a = obj.months[month]) === null || _a === void 0 ? void 0 : _a[balanceTypeOp]) &&
                -1 * obj.months[month][balanceTypeOp]);
        }
    };
    var getDate = function (obj) {
        return Number(obj.day) >= 28 ? '28+' : obj.day;
    };
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return data.intervalData && (<recharts_1.ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '5px' }}/>}
              <recharts_1.AreaChart width={width} height={height} data={data.intervalData} margin={{
                    top: 0,
                    right: 0,
                    left: (0, computePadding_1.computePadding)(data.intervalData
                        .map(function (item) { return getVal(item, maxYAxis ? compare : selection); })
                        .filter(function (value) { return value !== undefined; }), function (value) { return format(value, 'financial-no-decimals'); }),
                    bottom: 0,
                }}>
                {compact ? null : (<recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>)}
                {compact ? null : (<recharts_1.XAxis dataKey={function (val) { return getDate(val); }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
                {compact ? null : (<recharts_1.YAxis dataKey={function (val) { return getVal(val, maxYAxis ? compare : selection); }} domain={[0, 'auto']} tickFormatter={tickFormatter} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
                <recharts_1.Tooltip content={<CustomTooltip balanceTypeOp={balanceTypeOp} selection={selection} compare={compare} format={format}/>} formatter={numberFormatter_1.numberFormatterTooltip} isAnimationActive={false}/>
                <defs>
                  <linearGradient id={"fill".concat(balanceTypeOp)} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={gradientOffset()} stopColor={theme_1.theme.reportsGreen} stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id={"stroke".concat(balanceTypeOp)} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={gradientOffset()} stopColor={theme_1.theme.reportsGreen} stopOpacity={1}/>
                  </linearGradient>
                </defs>

                <recharts_1.Area type="linear" dot={false} activeDot={{
                    fill: theme_1.theme.reportsGreen,
                    fillOpacity: 1,
                    r: 10,
                }} animationDuration={0} dataKey={function (val) { return getVal(val, compare); }} stroke={"url(#stroke".concat(balanceTypeOp, ")")} strokeWidth={3} fill={"url(#fill".concat(balanceTypeOp, ")")} fillOpacity={1}/>
                <recharts_1.Area type="linear" dot={false} activeDot={false} animationDuration={0} dataKey={function (val) { return getVal(val, selection); }} stroke={theme_1.theme.reportsGray} strokeDasharray="10 10" strokeWidth={3} fill={theme_1.theme.reportsGray} fillOpacity={0.2}/>
              </recharts_1.AreaChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
