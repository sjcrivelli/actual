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
exports.StackedBarGraph = StackedBarGraph;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var recharts_1 = require("recharts");
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
    var compact = _a.compact, tooltip = _a.tooltip, active = _a.active, payload = _a.payload, label = _a.label, format = _a.format;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useMemo)(function () {
        return (payload !== null && payload !== void 0 ? payload : [])
            .slice(0)
            .reverse()
            .reduce(function (acc, item) {
            acc.sumTotals += item.value;
            acc.items.push(item);
            return acc;
        }, {
            sumTotals: 0,
            items: [],
        });
    }, [payload]), sumTotals = _b.sumTotals, items = _b.items;
    if (active && items.length) {
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
            <strong>{label}</strong>
          </div>
          <div style={{ lineHeight: 1.4 }}>
            {items.map(function (pay, i) {
                return (pay.value !== 0 &&
                    (compact ? i < 5 : true) && (<aligned_text_1.AlignedText key={pay.name} left={pay.name} right={format(pay.value, 'financial')} style={{
                        color: pay.color,
                        textDecoration: tooltip === pay.name ? 'underline' : 'inherit',
                    }}/>));
            })}
            {payload.length > 5 && compact && '...'}
            <aligned_text_1.AlignedText left={t('Total')} right={format(sumTotals, 'financial')} style={{
                fontWeight: 600,
            }}/>
          </div>
        </div>
      </div>);
    }
};
var customLabel = function (props) {
    var calcX = props.x + props.width / 2;
    var calcY = props.y + props.height / 2;
    var textAnchor = 'middle';
    var display = props.value && "".concat(props.format(props.value, 'financial-no-decimals'));
    var textSize = '12px';
    var showLabel = props.height;
    var showLabelThreshold = 20;
    var fill = theme_1.theme.reportsInnerLabel;
    return (0, renderCustomLabel_1.renderCustomLabel)(calcX, calcY, textAnchor, display, textSize, showLabel, showLabelThreshold, fill);
};
function StackedBarGraph(_a) {
    var style = _a.style, data = _a.data, filters = _a.filters, groupBy = _a.groupBy, compact = _a.compact, viewLabels = _a.viewLabels, balanceTypeOp = _a.balanceTypeOp, showHiddenCategories = _a.showHiddenCategories, showOffBudget = _a.showOffBudget, _b = _a.showTooltip, showTooltip = _b === void 0 ? true : _b, interval = _a.interval;
    var navigate = (0, useNavigate_1.useNavigate)();
    var categories = (0, useCategories_1.useCategories)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var format = (0, useFormat_1.useFormat)();
    var customLabelWithFormat = function (props) { return customLabel(__assign(__assign({}, props), { format: format })); };
    var _c = (0, react_1.useState)(''), pointer = _c[0], setPointer = _c[1];
    var _d = (0, react_1.useState)(''), tooltip = _d[0], setTooltip = _d[1];
    var largestValue = data.intervalData
        .map(function (c) { return c[balanceTypeOp]; })
        .reduce(function (acc, cur) { return (Math.abs(cur) > Math.abs(acc) ? cur : acc); }, 0);
    var leftMargin = Math.abs(largestValue) > 1000000 ? 20 : 0;
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return data.intervalData && (<recharts_1.ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '15px' }}/>}
              <recharts_1.BarChart width={width} height={height} data={data.intervalData} margin={{ top: 0, right: 0, left: leftMargin, bottom: 10 }} style={{ cursor: pointer }} stackOffset="sign" //stacked by sign
            >
                {showTooltip && (<recharts_1.Tooltip content={<CustomTooltip compact={compact} tooltip={tooltip} format={format}/>} formatter={numberFormatter_1.numberFormatterTooltip} isAnimationActive={false} cursor={{ fill: 'transparent' }}/>)}
                <recharts_1.XAxis dataKey="date" tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>
                {!compact && <recharts_1.CartesianGrid strokeDasharray="3 3"/>}
                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
                {data.legend
                    .slice(0)
                    .reverse()
                    .map(function (entry) { return (<recharts_1.Bar key={entry.name} dataKey={entry.name} stackId="a" fill={entry.color} onMouseLeave={function () {
                        setPointer('');
                        setTooltip('');
                    }} onMouseEnter={function () {
                        setTooltip(entry.name);
                        if (!['Group', 'Interval'].includes(groupBy)) {
                            setPointer('pointer');
                        }
                    }} onClick={function (e) {
                        var _a, _b;
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
                                type: 'time',
                                startDate: (_a = e.payload) === null || _a === void 0 ? void 0 : _a.intervalStartDate,
                                endDate: (_b = e.payload) === null || _b === void 0 ? void 0 : _b.intervalEndDate,
                                field: groupBy.toLowerCase(),
                                id: entry.id,
                                interval: interval,
                            });
                    }}>
                      {viewLabels && !compact && (<recharts_1.LabelList dataKey={entry.name} content={customLabelWithFormat}/>)}
                    </recharts_1.Bar>); })}
              </recharts_1.BarChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
