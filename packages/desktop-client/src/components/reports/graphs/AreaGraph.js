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
exports.AreaGraph = AreaGraph;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var recharts_1 = require("recharts");
var adjustTextSize_1 = require("./adjustTextSize");
var renderCustomLabel_1 = require("./renderCustomLabel");
var Container_1 = require("@desktop-client/components/reports/Container");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var usePrivacyMode_1 = require("@desktop-client/hooks/usePrivacyMode");
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload, balanceTypeOp = _a.balanceTypeOp, format = _a.format;
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
            {['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Assets:')} right={format(payload[0].payload.totalAssets, 'financial')}/>)}
            {['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Debts:')} right={format(payload[0].payload.totalDebts, 'financial')}/>)}
            {['netAssets'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Assets:')} right={format(payload[0].payload.netAssets, 'financial')}/>)}
            {['netDebts'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Debts:')} right={format(payload[0].payload.netDebts, 'financial')}/>)}
            {['totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net:')} right={<strong>
                    {format(payload[0].payload.totalTotals, 'financial')}
                  </strong>}/>)}
          </div>
        </div>
      </div>);
    }
    return <div />;
};
var customLabel = function (_a) {
    var props = _a.props, width = _a.width, end = _a.end, format = _a.format;
    //Add margin to first and last object
    var calcX = (typeof props.x === 'number' ? props.x : 0) +
        (props.index === end ? -10 : props.index === 0 ? 5 : 0);
    var calcY = (typeof props.y === 'number' ? props.y : 0) -
        ((typeof props.value === 'number' ? props.value : 0) > 0 ? 10 : -10);
    var textAnchor = props.index === 0 ? 'start' : 'middle';
    var display = typeof props.value !== 'string' && props.value !== 0
        ? "".concat(format(props.value || 0, 'financial-no-decimals'))
        : '';
    var textSize = (0, adjustTextSize_1.adjustTextSize)({ sized: width, type: 'area' });
    return (0, renderCustomLabel_1.renderCustomLabel)(calcX, calcY, textAnchor, display, textSize);
};
function AreaGraph(_a) {
    var style = _a.style, data = _a.data, balanceTypeOp = _a.balanceTypeOp, compact = _a.compact, viewLabels = _a.viewLabels, _b = _a.showTooltip, showTooltip = _b === void 0 ? true : _b;
    var format = (0, useFormat_1.useFormat)();
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var dataMax = Math.max.apply(Math, data.intervalData.map(function (i) { return i[balanceTypeOp]; }));
    var dataMin = Math.min.apply(Math, data.intervalData.map(function (i) { return i[balanceTypeOp]; }));
    var labelsMargin = viewLabels ? 30 : 0;
    var dataDiff = dataMax - dataMin;
    var absDataMax = Math.max(Math.abs(dataMax), Math.abs(dataMin));
    //Calculate how much to add to max and min values for graph range
    var extendRangeAmount = Math.floor(dataDiff / 20);
    var labelsMin = 
    //If min is zero or graph range passes zero then set it to zero
    dataMin === 0 || Math.abs(dataMin) <= extendRangeAmount
        ? 0
        : //Else add the range and round to nearest 100s
            Math.floor((dataMin - extendRangeAmount) / 100) * 100;
    //Same as above but for max
    var labelsMax = dataMax === 0 || Math.abs(dataMax) <= extendRangeAmount
        ? 0
        : Math.ceil((dataMax + extendRangeAmount) / 100) * 100;
    var lastLabel = data.intervalData.length - 1;
    var tickFormatter = function (tick) {
        if (!privacyMode)
            return "".concat(format(tick, 'financial-no-decimals')); // Formats the tick values as strings with commas
        return '...';
    };
    var gradientOffset = function () {
        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };
    var off = gradientOffset();
    var leftMargin = Math.abs(absDataMax) > 1000000 ? 20 : 0;
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return data.intervalData && (<recharts_1.ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '15px' }}/>}
              <recharts_1.AreaChart width={width} height={height} data={data.intervalData} margin={{
                    top: 0,
                    right: labelsMargin,
                    left: leftMargin,
                    bottom: 10,
                }}>
                {compact ? null : (<recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>)}
                {compact ? null : (<recharts_1.XAxis dataKey="date" tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
                {compact ? null : (<recharts_1.YAxis dataKey={balanceTypeOp} domain={[
                        viewLabels ? labelsMin : 'auto',
                        viewLabels ? labelsMax : 'auto',
                    ]} tickFormatter={tickFormatter} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
                {showTooltip && (<recharts_1.Tooltip content={<CustomTooltip balanceTypeOp={balanceTypeOp} format={format}/>} isAnimationActive={false}/>)}
                <defs>
                  <linearGradient id={"fill".concat(balanceTypeOp)} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={off} stopColor={theme_1.theme.reportsBlue} stopOpacity={0.2}/>
                    <stop offset={off} stopColor={theme_1.theme.reportsRed} stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id={"stroke".concat(balanceTypeOp)} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={off} stopColor={theme_1.theme.reportsBlue} stopOpacity={1}/>
                    <stop offset={off} stopColor={theme_1.theme.reportsRed} stopOpacity={1}/>
                  </linearGradient>
                </defs>

                <recharts_1.Area type="linear" dot={false} activeDot={false} animationDuration={0} dataKey={balanceTypeOp} stroke={"url(#stroke".concat(balanceTypeOp, ")")} fill={"url(#fill".concat(balanceTypeOp, ")")} fillOpacity={1}>
                  {viewLabels && !compact && (<recharts_1.LabelList dataKey={balanceTypeOp} content={function (props) {
                        return customLabel({
                            props: props,
                            width: width,
                            end: lastLabel,
                            format: format,
                        });
                    }}/>)}
                </recharts_1.Area>
              </recharts_1.AreaChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
