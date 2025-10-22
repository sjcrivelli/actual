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
exports.BarGraph = BarGraph;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var recharts_1 = require("recharts");
var adjustTextSize_1 = require("./adjustTextSize");
var renderCustomLabel_1 = require("./renderCustomLabel");
var showActivity_1 = require("./showActivity");
var Container_1 = require("@desktop-client/components/reports/Container");
var getCustomTick_1 = require("@desktop-client/components/reports/getCustomTick");
var numberFormatter_1 = require("@desktop-client/components/reports/numberFormatter");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePrivacyMode_1 = require("@desktop-client/hooks/usePrivacyMode");
var CustomTooltip = function (_a) {
    var active = _a.active, payload = _a.payload, balanceTypeOp = _a.balanceTypeOp, yAxis = _a.yAxis, format = _a.format;
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
            <strong>{payload[0].payload[yAxis]}</strong>
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
};
var customLabel = function (props, typeOp, format) {
    var calcX = props.x + props.width / 2;
    var calcY = props.y - (props.value > 0 ? 15 : -15);
    var textAnchor = 'middle';
    var display = props.value !== 0 && "".concat(format(props.value, 'financial-no-decimals'));
    var textSize = (0, adjustTextSize_1.adjustTextSize)({
        sized: props.width,
        type: typeOp === 'totalTotals' ? 'default' : 'variable',
        values: props.value,
    });
    return (0, renderCustomLabel_1.renderCustomLabel)(calcX, calcY, textAnchor, display, textSize);
};
function BarGraph(_a) {
    var style = _a.style, data = _a.data, filters = _a.filters, groupBy = _a.groupBy, balanceTypeOp = _a.balanceTypeOp, compact = _a.compact, viewLabels = _a.viewLabels, showHiddenCategories = _a.showHiddenCategories, showOffBudget = _a.showOffBudget, _b = _a.showTooltip, showTooltip = _b === void 0 ? true : _b;
    var navigate = (0, useNavigate_1.useNavigate)();
    var categories = (0, useCategories_1.useCategories)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var format = (0, useFormat_1.useFormat)();
    var _c = (0, react_1.useState)(''), pointer = _c[0], setPointer = _c[1];
    var yAxis = groupBy === 'Interval' ? 'date' : 'name';
    var splitData = groupBy === 'Interval' ? 'intervalData' : 'data';
    var labelsMargin = viewLabels ? 30 : 0;
    var getVal = function (obj) {
        if (['totalDebts', 'netDebts'].includes(balanceTypeOp)) {
            return -1 * obj[balanceTypeOp];
        }
        return obj[balanceTypeOp];
    };
    var longestLabelLength = data[splitData]
        .map(function (c) { return c[yAxis]; })
        .reduce(function (acc, cur) { return (cur.length > acc ? cur.length : acc); }, 0);
    var largestValue = data[splitData]
        .map(function (c) { return c[balanceTypeOp]; })
        .reduce(function (acc, cur) { return (Math.abs(cur) > Math.abs(acc) ? cur : acc); }, 0);
    var leftMargin = Math.abs(largestValue) > 1000000 ? 20 : 0;
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return data[splitData] && (<recharts_1.ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '15px' }}/>}
              <recharts_1.BarChart width={width} height={height} stackOffset="sign" data={data[splitData]} style={{ cursor: pointer }} margin={{
                    top: labelsMargin,
                    right: 0,
                    left: leftMargin,
                    bottom: 0,
                }}>
                {showTooltip && (<recharts_1.Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip balanceTypeOp={balanceTypeOp} yAxis={yAxis} format={format}/>} formatter={numberFormatter_1.numberFormatterTooltip} isAnimationActive={false}/>)}
                {!compact && <recharts_1.CartesianGrid strokeDasharray="3 3"/>}
                {!compact && (<recharts_1.XAxis dataKey={yAxis} angle={-35} textAnchor="end" height={Math.sqrt(longestLabelLength) * 25} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
                {!compact && (<recharts_1.ReferenceLine y={0} stroke={theme_1.theme.pageTextLight}/>)}
                <recharts_1.Bar dataKey={function (val) { return getVal(val); }} stackId="a" onMouseLeave={function () { return setPointer(''); }} onMouseEnter={function () {
                    return !['Group', 'Interval'].includes(groupBy) &&
                        setPointer('pointer');
                }} onClick={function (item) {
                    return ((compact && showTooltip) || !compact) &&
                        !['Group', 'Interval'].includes(groupBy) &&
                        (0, showActivity_1.showActivity)({
                            navigate: navigate,
                            categories: categories,
                            accounts: accounts,
                            balanceTypeOp: balanceTypeOp,
                            filters: filters,
                            showHiddenCategories: showHiddenCategories,
                            showOffBudget: showOffBudget,
                            type: 'totals',
                            startDate: data.startDate,
                            endDate: data.endDate,
                            field: groupBy.toLowerCase(),
                            id: item.id,
                        });
                }}>
                  {viewLabels && !compact && (<recharts_1.LabelList dataKey={function (val) { return getVal(val); }} content={function (e) { return customLabel(e, balanceTypeOp, format); }}/>)}
                  {data.legend.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color} name={entry.name}/>); })}
                </recharts_1.Bar>
              </recharts_1.BarChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
