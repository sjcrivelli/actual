"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashFlowGraph = CashFlowGraph;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var d = require("date-fns");
var recharts_1 = require("recharts");
var chart_theme_1 = require("@desktop-client/components/reports/chart-theme");
var Container_1 = require("@desktop-client/components/reports/Container");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var usePrivacyMode_1 = require("@desktop-client/hooks/usePrivacyMode");
var MAX_BAR_SIZE = 50;
var ANIMATION_DURATION = 1000; // in ms
function CustomTooltip(_a) {
    var active = _a.active, payload = _a.payload, isConcise = _a.isConcise, format = _a.format;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    if (!active || !payload || !Array.isArray(payload) || !payload[0]) {
        return null;
    }
    var data = payload[0].payload;
    return (<div className={(0, css_1.css)({
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
            {d.format(data.date, isConcise ? 'MMMM yyyy' : 'MMMM dd, yyyy', {
            locale: locale,
        })}
          </strong>
        </div>
        <div style={{ lineHeight: 1.5 }}>
          <aligned_text_1.AlignedText left={t('Income:')} right={format(data.income, 'financial')}/>
          <aligned_text_1.AlignedText left={t('Expenses:')} right={format(data.expenses, 'financial')}/>
          <aligned_text_1.AlignedText left={t('Change:')} right={<strong>
                {format(data.income + data.expenses, 'financial')}
              </strong>}/>
          {data.transfers !== 0 && (<aligned_text_1.AlignedText left={t('Transfers:')} right={format(data.transfers, 'financial')}/>)}
          <aligned_text_1.AlignedText left={t('Balance:')} right={format(data.balance, 'financial')}/>
        </div>
      </div>
    </div>);
}
function CashFlowGraph(_a) {
    var graphData = _a.graphData, isConcise = _a.isConcise, _b = _a.showBalance, showBalance = _b === void 0 ? true : _b, style = _a.style;
    var locale = (0, useLocale_1.useLocale)();
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var _c = (0, react_1.useState)(false), yAxisIsHovered = _c[0], setYAxisIsHovered = _c[1];
    var format = (0, useFormat_1.useFormat)();
    var data = graphData.expenses.map(function (row, idx) { return ({
        date: row.x,
        expenses: row.y,
        income: graphData.income[idx].y,
        balance: graphData.balances[idx].y,
        transfers: graphData.transfers[idx].y,
    }); });
    return (<Container_1.Container style={style}>
      {function (width, height) { return (<recharts_1.ResponsiveContainer>
          <recharts_1.ComposedChart width={width} height={height} stackOffset="sign" data={data}>
            <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <recharts_1.XAxis dataKey="date" tick={{ fill: theme_1.theme.reportsLabel }} tickFormatter={function (x) {
                // eslint-disable-next-line actual/typography
                return d.format(x, isConcise ? "MMM ''yy" : 'MMM d', {
                    locale: locale,
                });
            }} minTickGap={50}/>
            <recharts_1.YAxis tick={{ fill: theme_1.theme.reportsLabel }} tickCount={8} tickFormatter={function (value) {
                return privacyMode && !yAxisIsHovered
                    ? '...'
                    : format(value, 'financial-no-decimals');
            }} onMouseEnter={function () { return setYAxisIsHovered(true); }} onMouseLeave={function () { return setYAxisIsHovered(false); }}/>
            <recharts_1.Tooltip labelFormatter={function (x) {
                // eslint-disable-next-line actual/typography
                return d.format(x, isConcise ? "MMM ''yy" : 'MMM d', {
                    locale: locale,
                });
            }} content={<CustomTooltip isConcise={isConcise} format={format}/>} isAnimationActive={false}/>

            <recharts_1.ReferenceLine y={0} stroke="#000"/>
            <recharts_1.Bar dataKey="income" stackId="a" fill={chart_theme_1.chartTheme.colors.blue} maxBarSize={MAX_BAR_SIZE} animationDuration={ANIMATION_DURATION}/>
            <recharts_1.Bar dataKey="expenses" stackId="a" fill={chart_theme_1.chartTheme.colors.red} maxBarSize={MAX_BAR_SIZE} animationDuration={ANIMATION_DURATION}/>
            <recharts_1.Line type="monotone" dataKey="balance" dot={false} hide={!showBalance} stroke={theme_1.theme.pageTextLight} strokeWidth={2} animationDuration={ANIMATION_DURATION}/>
          </recharts_1.ComposedChart>
        </recharts_1.ResponsiveContainer>); }}
    </Container_1.Container>);
}
