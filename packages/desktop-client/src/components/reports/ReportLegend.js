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
exports.ReportLegend = ReportLegend;
var react_1 = require("react");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var LegendItem_1 = require("./LegendItem");
var ReportOptions_1 = require("./ReportOptions");
function ReportLegend(_a) {
    var legend = _a.legend, groupBy = _a.groupBy, interval = _a.interval;
    return (<view_1.View style={{
            backgroundColor: theme_1.theme.pageBackground,
            alignItems: 'center',
            flex: 1,
            overflowY: 'auto',
        }}>
      <text_1.Text style={__assign(__assign({}, styles_1.styles.largeText), { alignItems: 'center', marginBottom: 2, fontWeight: 400, paddingTop: 10 })}>
        {groupBy === 'Interval'
            ? ReportOptions_1.ReportOptions.intervalMap.get(interval)
            : groupBy}
      </text_1.Text>
      <view_1.View>
        {legend &&
            legend.map(function (item) {
                return (<LegendItem_1.LegendItem key={item.name} color={item.color} label={item.name}/>);
            })}
      </view_1.View>
    </view_1.View>);
}
