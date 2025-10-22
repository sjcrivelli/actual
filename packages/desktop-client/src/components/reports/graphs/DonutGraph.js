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
exports.DonutGraph = DonutGraph;
// @ts-strict-ignore
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var recharts_1 = require("recharts");
var adjustTextSize_1 = require("./adjustTextSize");
var renderCustomLabel_1 = require("./renderCustomLabel");
var showActivity_1 = require("./showActivity");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var Container_1 = require("@desktop-client/components/reports/Container");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var RADIAN = Math.PI / 180;
var canDeviceHover = function () { return window.matchMedia('(hover: hover)').matches; };
var ActiveShapeMobile = function (props) {
    var _a;
    var cx = props.cx, cy = props.cy, innerRadius = props.innerRadius, outerRadius = props.outerRadius, startAngle = props.startAngle, endAngle = props.endAngle, fill = props.fill, payload = props.payload, percent = props.percent, value = props.value, format = props.format;
    var yAxis = (_a = payload.name) !== null && _a !== void 0 ? _a : payload.date;
    var sin = Math.sin(-RADIAN * 240);
    var my = cy + outerRadius * sin;
    var ey = my - 5;
    return (<g>
      <text x={cx} y={cy + outerRadius * Math.sin(-RADIAN * 270) + 15} dy={0} textAnchor="middle" fill={fill}>
        {"".concat(yAxis)}
      </text>
      <PrivacyFilter_1.PrivacyFilter>
        <text x={cx + outerRadius * Math.cos(-RADIAN * 240) - 30} y={ey} dy={0} textAnchor="end" fill={fill}>
          {"".concat(format(value, 'financial'))}
        </text>
        <text x={cx + outerRadius * Math.cos(-RADIAN * 330) + 10} y={ey} dy={0} textAnchor="start" fill="#999">
          {"".concat((percent * 100).toFixed(2), "%")}
        </text>
      </PrivacyFilter_1.PrivacyFilter>
      <recharts_1.Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
      <recharts_1.Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius - 8} outerRadius={innerRadius - 6} fill={fill}/>
    </g>);
};
var ActiveShapeMobileWithFormat = function (props) { return (<ActiveShapeMobile {...props} format={props.format}/>); };
var ActiveShape = function (props) {
    var _a;
    var cx = props.cx, cy = props.cy, midAngle = props.midAngle, innerRadius = props.innerRadius, outerRadius = props.outerRadius, startAngle = props.startAngle, endAngle = props.endAngle, fill = props.fill, payload = props.payload, percent = props.percent, value = props.value, format = props.format;
    var yAxis = (_a = payload.name) !== null && _a !== void 0 ? _a : payload.date;
    var sin = Math.sin(-RADIAN * midAngle);
    var cos = Math.cos(-RADIAN * midAngle);
    var sx = cx + (innerRadius - 10) * cos;
    var sy = cy + (innerRadius - 10) * sin;
    var mx = cx + (innerRadius - 30) * cos;
    var my = cy + (innerRadius - 30) * sin;
    var ex = cx + (cos >= 0 ? 1 : -1) * yAxis.length * 4;
    var ey = cy + 8;
    var textAnchor = cos <= 0 ? 'start' : 'end';
    return (<g>
      <recharts_1.Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
      <recharts_1.Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill}/>
      <path d={"M".concat(sx, ",").concat(sy, "L").concat(mx, ",").concat(my, "L").concat(ex, ",").concat(ey)} stroke={fill} fill="none"/>
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none"/>
      <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} textAnchor={textAnchor} fill={fill}>{"".concat(yAxis)}</text>
      <PrivacyFilter_1.PrivacyFilter>
        <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} dy={18} textAnchor={textAnchor} fill={fill}>{"".concat(format(value, 'financial'))}</text>
        <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} dy={36} textAnchor={textAnchor} fill="#999">
          {"(".concat((percent * 100).toFixed(2), "%)")}
        </text>
      </PrivacyFilter_1.PrivacyFilter>
    </g>);
};
var ActiveShapeWithFormat = function (props) { return (<ActiveShape {...props} format={props.format}/>); };
var customLabel = function (props) {
    var radius = props.innerRadius + (props.outerRadius - props.innerRadius) * 0.5;
    var size = props.cx > props.cy ? props.cy : props.cx;
    var calcX = props.cx + radius * Math.cos(-props.midAngle * RADIAN);
    var calcY = props.cy + radius * Math.sin(-props.midAngle * RADIAN);
    var textAnchor = calcX > props.cx ? 'start' : 'end';
    var display = props.value !== 0 && "".concat((props.percent * 100).toFixed(0), "%");
    var textSize = (0, adjustTextSize_1.adjustTextSize)({ sized: size, type: 'donut' });
    var showLabel = props.percent;
    var showLabelThreshold = 0.05;
    var fill = theme_1.theme.reportsInnerLabel;
    return (0, renderCustomLabel_1.renderCustomLabel)(calcX, calcY, textAnchor, display, textSize, showLabel, showLabelThreshold, fill);
};
function DonutGraph(_a) {
    var style = _a.style, data = _a.data, filters = _a.filters, groupBy = _a.groupBy, balanceTypeOp = _a.balanceTypeOp, viewLabels = _a.viewLabels, showHiddenCategories = _a.showHiddenCategories, showOffBudget = _a.showOffBudget, _b = _a.showTooltip, showTooltip = _b === void 0 ? true : _b;
    var format = (0, useFormat_1.useFormat)();
    var yAxis = groupBy === 'Interval' ? 'date' : 'name';
    var splitData = groupBy === 'Interval' ? 'intervalData' : 'data';
    var navigate = (0, useNavigate_1.useNavigate)();
    var categories = (0, useCategories_1.useCategories)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var _c = (0, react_1.useState)(''), pointer = _c[0], setPointer = _c[1];
    var getVal = function (obj) {
        if (['totalDebts', 'netDebts'].includes(balanceTypeOp)) {
            return -1 * obj[balanceTypeOp];
        }
        else {
            return obj[balanceTypeOp];
        }
    };
    var _d = (0, react_1.useState)(0), activeIndex = _d[0], setActiveIndex = _d[1];
    return (<Container_1.Container style={style}>
      {function (width, height) {
            var _a, _b;
            var compact = height <= 300 || width <= 300;
            return (data[splitData] && (<recharts_1.ResponsiveContainer>
              <div>
                {!compact && <div style={{ marginTop: '15px' }}/>}
                <recharts_1.PieChart width={width} height={height} style={{ cursor: pointer }}>
                  <recharts_1.Pie activeShape={width < 220 || height < 130
                    ? undefined
                    : compact
                        ? function (props) { return (<ActiveShapeMobileWithFormat {...props} format={format}/>); }
                        : function (props) { return (<ActiveShapeWithFormat {...props} format={format}/>); }} dataKey={function (val) { return getVal(val); }} nameKey={yAxis} isAnimationActive={false} data={(_b = (_a = data[splitData]) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (__assign({}, item)); })) !== null && _b !== void 0 ? _b : []} innerRadius={Math.min(width, height) * 0.2} fill="#8884d8" labelLine={false} label={function (e) {
                    return viewLabels && !compact ? customLabel(e) : <div />;
                }} startAngle={90} endAngle={-270} onMouseLeave={function () { return setPointer(''); }} onMouseEnter={function (_, index) {
                    if (canDeviceHover()) {
                        setActiveIndex(index);
                        if (!['Group', 'Interval'].includes(groupBy)) {
                            setPointer('pointer');
                        }
                    }
                }} onClick={function (item, index) {
                    if (!canDeviceHover()) {
                        setActiveIndex(index);
                    }
                    if (!['Group', 'Interval'].includes(groupBy) &&
                        (canDeviceHover() || activeIndex === index) &&
                        ((compact && showTooltip) || !compact)) {
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
                    }
                }}>
                    {data.legend.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color}/>); })}
                  </recharts_1.Pie>
                  <recharts_1.Tooltip content={function () { return null; }} defaultIndex={activeIndex} active={true}/>
                </recharts_1.PieChart>
              </div>
            </recharts_1.ResponsiveContainer>));
        }}
    </Container_1.Container>);
}
