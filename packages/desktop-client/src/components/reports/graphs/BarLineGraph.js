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
exports.BarLineGraph = BarLineGraph;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var recharts_1 = require("recharts");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var Container_1 = require("@desktop-client/components/reports/Container");
var numberFormatter_1 = require("@desktop-client/components/reports/numberFormatter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload;
    var t = (0, react_i18next_1.useTranslation)().t;
    if (active && payload && payload.length) {
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
            <strong>{payload[0].payload.date}</strong>
          </div>
          <div style={{ lineHeight: 1.5 }}>
            <PrivacyFilter_1.PrivacyFilter>
              <aligned_text_1.AlignedText left={t('Assets:')} right={payload[0].payload.assets}/>
              <aligned_text_1.AlignedText left={t('Debt:')} right={payload[0].payload.debt}/>
              <aligned_text_1.AlignedText left={t('Change:')} right={<strong>{payload[0].payload.change}</strong>}/>
            </PrivacyFilter_1.PrivacyFilter>
          </div>
        </div>
      </div>);
    }
};
function BarLineGraph(_a) {
    var style = _a.style, data = _a.data, compact = _a.compact, _b = _a.showTooltip, showTooltip = _b === void 0 ? true : _b;
    var format = (0, useFormat_1.useFormat)();
    var tickFormatter = function (tick) {
        return "".concat(format(Math.round(tick), 'financial')); // Formats the tick values as strings with commas
    };
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return data && (<recharts_1.ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '15px' }}/>}
              <recharts_1.ComposedChart width={width} height={height} data={data.data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                {showTooltip && (<recharts_1.Tooltip content={<CustomTooltip />} formatter={numberFormatter_1.numberFormatterTooltip} isAnimationActive={false}/>)}
                {!compact && <recharts_1.CartesianGrid strokeDasharray="3 3"/>}
                {!compact && <recharts_1.XAxis dataKey="x"/>}
                {!compact && (<recharts_1.YAxis dataKey="y" tickFormatter={tickFormatter}/>)}
                <recharts_1.Bar type="monotone" dataKey="y" fill="#8884d8"/>
                <recharts_1.Line type="monotone" dataKey="y" stroke="#8884d8"/>
              </recharts_1.ComposedChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
