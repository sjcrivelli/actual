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
exports.LineGraph = LineGraph;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var recharts_1 = require("recharts");
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
    var compact = _a.compact, tooltip = _a.tooltip, active = _a.active, payload = _a.payload, format = _a.format;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useMemo)(function () {
        return (payload !== null && payload !== void 0 ? payload : [])
            .sort(function (p1, p2) { return p2.value - p1.value; })
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
            <strong>{payload[0].payload.date}</strong>
          </div>
          <div style={{ lineHeight: 1.5 }}>
            {items.map(function (p, index) {
                return ((compact ? index < 4 : true) && (<aligned_text_1.AlignedText key={index} left={p.dataKey} right={format(p.value, 'financial')} style={{
                        color: p.color,
                        textDecoration: tooltip === p.dataKey ? 'underline' : 'inherit',
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
function LineGraph(_a) {
    var style = _a.style, data = _a.data, filters = _a.filters, groupBy = _a.groupBy, compact = _a.compact, balanceTypeOp = _a.balanceTypeOp, showHiddenCategories = _a.showHiddenCategories, showOffBudget = _a.showOffBudget, _b = _a.showTooltip, showTooltip = _b === void 0 ? true : _b, interval = _a.interval;
    var navigate = (0, useNavigate_1.useNavigate)();
    var categories = (0, useCategories_1.useCategories)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var privacyMode = (0, usePrivacyMode_1.usePrivacyMode)();
    var format = (0, useFormat_1.useFormat)();
    var _c = (0, react_1.useState)(''), pointer = _c[0], setPointer = _c[1];
    var _d = (0, react_1.useState)(''), tooltip = _d[0], setTooltip = _d[1];
    var largestValue = data.intervalData
        .map(function (c) { return c[balanceTypeOp]; })
        .reduce(function (acc, cur) { return (Math.abs(cur) > Math.abs(acc) ? cur : acc); }, 0);
    var leftMargin = Math.abs(largestValue) > 1000000 ? 20 : 5;
    var onShowActivity = function (item, id, payload) {
        (0, showActivity_1.showActivity)({
            navigate: navigate,
            categories: categories,
            accounts: accounts,
            balanceTypeOp: balanceTypeOp,
            filters: filters,
            showHiddenCategories: showHiddenCategories,
            showOffBudget: showOffBudget,
            type: 'time',
            startDate: payload.payload.intervalStartDate,
            endDate: payload.payload.intervalEndDate,
            field: groupBy.toLowerCase(),
            id: id,
            interval: interval,
        });
    };
    return (<Container_1.Container style={__assign(__assign({}, style), (compact && { height: 'auto' }))}>
      {function (width, height) {
            return data && (<recharts_1.ResponsiveContainer>
            <div>
              {!compact && <div style={{ marginTop: '15px' }}/>}
              <recharts_1.LineChart width={width} height={height} data={data.intervalData} margin={{ top: 10, right: 10, left: leftMargin, bottom: 10 }} style={{ cursor: pointer }}>
                {showTooltip && (<recharts_1.Tooltip content={<CustomTooltip compact={compact} tooltip={tooltip} format={format}/>} formatter={numberFormatter_1.numberFormatterTooltip} isAnimationActive={false}/>)}
                {!compact && <recharts_1.CartesianGrid strokeDasharray="3 3"/>}
                {!compact && (<recharts_1.XAxis dataKey="date" tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
                {data.legend.map(function (entry, index) {
                    return (<recharts_1.Line key={index} strokeWidth={2} type="monotone" dataKey={entry.name} stroke={entry.color} activeDot={{
                            r: entry.name === tooltip && !compact ? 8 : 3,
                            onMouseEnter: function () {
                                setTooltip(entry.name);
                                if (!['Group', 'Interval'].includes(groupBy)) {
                                    setPointer('pointer');
                                }
                            },
                            onMouseLeave: function () {
                                setPointer('');
                                setTooltip('');
                            },
                            onClick: function (e, payload) {
                                return ((compact && showTooltip) || !compact) &&
                                    !['Group', 'Interval'].includes(groupBy) &&
                                    onShowActivity(e, entry.id, payload);
                            },
                        }}/>);
                })}
              </recharts_1.LineChart>
            </div>
          </recharts_1.ResponsiveContainer>);
        }}
    </Container_1.Container>);
}
