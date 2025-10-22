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
exports.NetWorthGraph = NetWorthGraph;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var date_fns_1 = require("date-fns");
var recharts_1 = require("recharts");
var computePadding_1 = require("./util/computePadding");
var Container_1 = require("@desktop-client/components/reports/Container");
var numberFormatter_1 = require("@desktop-client/components/reports/numberFormatter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var usePrivacyMode_1 = require("@desktop-client/hooks/usePrivacyMode");
function NetWorthGraph(_a) {
    var style = _a.style, graphData = _a.graphData, _b = _a.compact, compact = _b === void 0 ? false : _b, _c = _a.showTooltip, showTooltip = _c === void 0 ? true : _c, _d = _a.interval, interval = _d === void 0 ? 'Monthly' : _d;
    var t = (0, react_i18next_1.useTranslation)().t;
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var id = (0, react_1.useId)();
    var format = (0, useFormat_1.useFormat)();
    // Use more aggressive smoothening for high-frequency data
    var interpolationType = interval === 'Daily' || interval === 'Weekly' ? 'basis' : 'monotone';
    var tickFormatter = function (tick) {
        var res = privacyMode
            ? '...'
            : "".concat(format(Math.round(tick), 'financial-no-decimals'));
        return res;
    };
    var gradientOffset = function () {
        var dataMax = Math.max.apply(Math, graphData.data.map(function (i) { return i.y; }));
        var dataMin = Math.min.apply(Math, graphData.data.map(function (i) { return i.y; }));
        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };
    var off = gradientOffset();
    var gradientId = "splitColor-".concat(id);
    // Generate weekly tick positions when viewing Daily data
    var weeklyTicks = (0, react_1.useMemo)(function () {
        if (interval !== 'Daily') {
            return undefined;
        }
        return graphData.data
            .filter(function (point) {
            var date = (0, date_fns_1.parse)(point.x, 'yy-MM-dd', new Date());
            return (0, date_fns_1.getDay)(date) === 1; // Monday
        })
            .map(function (point) { return point.x; });
    }, [interval, graphData.data]);
    // eslint-disable-next-line react/no-unstable-nested-components
    var CustomTooltip = function (_a) {
        var active = _a.active, payload = _a.payload;
        if (active && payload && payload.length) {
            return (<div className={(0, css_1.css)([
                    {
                        zIndex: 1000,
                        pointerEvents: 'none',
                        borderRadius: 2,
                        boxShadow: '0 1px 6px rgba(0, 0, 0, .20)',
                        backgroundColor: theme_1.theme.menuBackground,
                        color: theme_1.theme.menuItemText,
                        padding: 10,
                    },
                    style,
                ])}>
          <div>
            <div style={{ marginBottom: 10 }}>
              <strong>{payload[0].payload.date}</strong>
            </div>
            <div style={{ lineHeight: 1.5 }}>
              <aligned_text_1.AlignedText left={t('Assets:')} right={payload[0].payload.assets}/>
              <aligned_text_1.AlignedText left={t('Debt:')} right={payload[0].payload.debt}/>
              <aligned_text_1.AlignedText left={t('Net worth:')} right={<strong>{payload[0].payload.networth}</strong>}/>
              <aligned_text_1.AlignedText left={t('Change:')} right={payload[0].payload.change}/>
            </div>
          </div>
        </div>);
        }
    };
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return graphData && (<recharts_1.ResponsiveContainer>
            <div style={__assign({}, (!compact && { marginTop: '15px' }))}>
              <recharts_1.AreaChart width={width} height={height} data={graphData.data} margin={{
                    top: 0,
                    right: 0,
                    left: compact
                        ? 0
                        : (0, computePadding_1.computePadding)(graphData.data.map(function (item) { return item.y; }), function (value) { return format(value, 'financial-no-decimals'); }),
                    bottom: 0,
                }}>
                {compact ? null : (<recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>)}
                <recharts_1.XAxis dataKey="x" hide={compact} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} ticks={weeklyTicks}/>
                <recharts_1.YAxis dataKey="y" domain={['auto', 'auto']} hide={compact} tickFormatter={tickFormatter} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>
                {showTooltip && (<recharts_1.Tooltip content={<CustomTooltip />} formatter={numberFormatter_1.numberFormatterTooltip} isAnimationActive={false}/>)}
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={off} stopColor={theme_1.theme.reportsBlue} stopOpacity={0.2}/>
                    <stop offset={off} stopColor={theme_1.theme.reportsRed} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>

                <recharts_1.Area type={interpolationType} dot={false} activeDot={false} animationDuration={0} dataKey="y" stroke={theme_1.theme.reportsBlue} strokeWidth={2} fill={"url(#".concat(gradientId, ")")} fillOpacity={1} connectNulls={true}/>
              </recharts_1.AreaChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
