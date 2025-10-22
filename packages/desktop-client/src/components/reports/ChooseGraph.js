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
exports.ChooseGraph = ChooseGraph;
var react_1 = require("react");
var styles_1 = require("@actual-app/components/styles");
var AreaGraph_1 = require("./graphs/AreaGraph");
var BarGraph_1 = require("./graphs/BarGraph");
var BarLineGraph_1 = require("./graphs/BarLineGraph");
var DonutGraph_1 = require("./graphs/DonutGraph");
var LineGraph_1 = require("./graphs/LineGraph");
var StackedBarGraph_1 = require("./graphs/StackedBarGraph");
var ReportTable_1 = require("./graphs/tableGraph/ReportTable");
var ReportOptions_1 = require("./ReportOptions");
function ChooseGraph(_a) {
    var data = _a.data, _b = _a.filters, filters = _b === void 0 ? [] : _b, mode = _a.mode, graphType = _a.graphType, balanceType = _a.balanceType, groupBy = _a.groupBy, interval = _a.interval, setScrollWidth = _a.setScrollWidth, _c = _a.viewLabels, viewLabels = _c === void 0 ? false : _c, compact = _a.compact, style = _a.style, _d = _a.showHiddenCategories, showHiddenCategories = _d === void 0 ? false : _d, _e = _a.showOffBudget, showOffBudget = _e === void 0 ? false : _e, _f = _a.showTooltip, showTooltip = _f === void 0 ? true : _f, intervalsCount = _a.intervalsCount;
    var graphStyle = compact
        ? __assign({}, style) : { flexGrow: 1, overflow: 'hidden' };
    var balanceTypeOp = ReportOptions_1.ReportOptions.balanceTypeMap.get(balanceType) || 'totalDebts';
    var saveScrollWidth = function (value) {
        setScrollWidth === null || setScrollWidth === void 0 ? void 0 : setScrollWidth(value || 0);
    };
    var rowStyle = compact
        ? { flex: '0 0 20px', height: 20 }
        : {};
    var compactStyle = compact ? __assign({}, styles_1.styles.tinyText) : {};
    var headerScrollRef = (0, react_1.useRef)(null);
    var listScrollRef = (0, react_1.useRef)(null);
    var totalScrollRef = (0, react_1.useRef)(null);
    var handleScroll = function (scroll) {
        if (scroll.currentTarget.id === 'header' &&
            totalScrollRef.current &&
            listScrollRef.current) {
            totalScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
            listScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }
        if (scroll.currentTarget.id === 'total' &&
            headerScrollRef.current &&
            listScrollRef.current) {
            headerScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
            listScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }
        if (scroll.currentTarget.id === 'list' &&
            totalScrollRef.current &&
            headerScrollRef.current) {
            headerScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
            totalScrollRef.current.scrollLeft = scroll.currentTarget.scrollLeft;
        }
    };
    if (graphType === 'AreaGraph') {
        return (<AreaGraph_1.AreaGraph style={graphStyle} compact={compact} data={data} balanceTypeOp={balanceTypeOp} viewLabels={viewLabels} showTooltip={showTooltip}/>);
    }
    if (graphType === 'BarGraph') {
        return (<BarGraph_1.BarGraph style={graphStyle} compact={compact} data={data} filters={filters} groupBy={groupBy} balanceTypeOp={balanceTypeOp} viewLabels={viewLabels} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} showTooltip={showTooltip}/>);
    }
    if (graphType === 'BarLineGraph') {
        return (<BarLineGraph_1.BarLineGraph style={graphStyle} compact={compact} data={data} showTooltip={showTooltip}/>);
    }
    if (graphType === 'DonutGraph') {
        return (<DonutGraph_1.DonutGraph style={graphStyle} data={data} filters={filters} groupBy={groupBy} balanceTypeOp={balanceTypeOp} viewLabels={viewLabels} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} showTooltip={showTooltip}/>);
    }
    if (graphType === 'LineGraph') {
        return (<LineGraph_1.LineGraph style={graphStyle} compact={compact} data={data} filters={filters} groupBy={groupBy} balanceTypeOp={balanceTypeOp} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} showTooltip={showTooltip} interval={interval}/>);
    }
    if (graphType === 'StackedBarGraph') {
        return (<StackedBarGraph_1.StackedBarGraph style={graphStyle} compact={compact} data={data} filters={filters} viewLabels={viewLabels} balanceTypeOp={balanceTypeOp} groupBy={groupBy} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} showTooltip={showTooltip} interval={interval}/>);
    }
    if (graphType === 'TableGraph') {
        return (<ReportTable_1.ReportTable saveScrollWidth={saveScrollWidth} headerScrollRef={headerScrollRef} listScrollRef={listScrollRef} totalScrollRef={totalScrollRef} handleScroll={handleScroll} balanceTypeOp={balanceTypeOp} groupBy={groupBy} data={data} filters={filters} mode={mode} intervalsCount={intervalsCount} interval={interval} compact={compact} style={rowStyle} compactStyle={compactStyle} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget}/>);
    }
    return null;
}
