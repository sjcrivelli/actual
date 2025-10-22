"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTable = ReportTable;
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var view_1 = require("@actual-app/components/view");
var ReportTableHeader_1 = require("./ReportTableHeader");
var ReportTableList_1 = require("./ReportTableList");
var ReportTableRow_1 = require("./ReportTableRow");
var ReportTableTotals_1 = require("./ReportTableTotals");
function ReportTable(_a) {
    var saveScrollWidth = _a.saveScrollWidth, headerScrollRef = _a.headerScrollRef, listScrollRef = _a.listScrollRef, totalScrollRef = _a.totalScrollRef, handleScroll = _a.handleScroll, groupBy = _a.groupBy, balanceTypeOp = _a.balanceTypeOp, data = _a.data, filters = _a.filters, mode = _a.mode, intervalsCount = _a.intervalsCount, interval = _a.interval, compact = _a.compact, style = _a.style, compactStyle = _a.compactStyle, showHiddenCategories = _a.showHiddenCategories, showOffBudget = _a.showOffBudget;
    var contentRef = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(function () {
        if (contentRef.current && saveScrollWidth) {
            saveScrollWidth(contentRef.current ? contentRef.current.offsetWidth : 0);
        }
    });
    var renderRow = (0, react_1.useCallback)(function (_a) {
        var item = _a.item, mode = _a.mode, style = _a.style;
        return (<ReportTableRow_1.ReportTableRow item={item} balanceTypeOp={balanceTypeOp} groupBy={groupBy} mode={mode} filters={filters} startDate={data.startDate} endDate={data.endDate} intervalsCount={intervalsCount} compact={compact} style={style} compactStyle={compactStyle} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} interval={interval}/>);
    }, []);
    var renderTotals = (0, react_1.useCallback)(function (_a) {
        var metadata = _a.metadata, mode = _a.mode, totalsStyle = _a.totalsStyle, testStyle = _a.testStyle, scrollWidthTotals = _a.scrollWidthTotals;
        return (<ReportTableRow_1.ReportTableRow item={metadata} balanceTypeOp={balanceTypeOp} groupBy={groupBy} mode={mode} filters={filters} startDate={data.startDate} endDate={data.endDate} intervalsCount={intervalsCount} compact={compact} style={totalsStyle} compactStyle={compactStyle} showHiddenCategories={showHiddenCategories} showOffBudget={showOffBudget} totalStyle={testStyle} totalScrollRef={totalScrollRef} handleScroll={handleScroll} height={32 + scrollWidthTotals} interval={interval} colorized={true}/>);
    }, []);
    return (<view_1.View>
      <ReportTableHeader_1.ReportTableHeader headerScrollRef={headerScrollRef} handleScroll={handleScroll} data={data.intervalData} groupBy={groupBy} interval={interval} balanceTypeOp={balanceTypeOp} compact={compact} style={style} compactStyle={compactStyle} mode={mode}/>
      <view_1.View style={{
            flex: 1,
            flexDirection: 'row',
            outline: 'none',
            '& .animated .animated-row': { transition: '.25s transform' },
        }} tabIndex={1}>
        <block_1.Block innerRef={listScrollRef} onScroll={handleScroll} id="list" style={{
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            flex: 1,
            outline: 'none',
            '& .animated .animated-row': { transition: '.25s transform' },
        }}>
          <ReportTableList_1.ReportTableList data={data} mode={mode} groupBy={groupBy} renderRow={renderRow} style={style}/>
        </block_1.Block>
      </view_1.View>
      <ReportTableTotals_1.ReportTableTotals data={data} mode={mode} totalScrollRef={totalScrollRef} compact={compact} style={style} renderTotals={renderTotals}/>
    </view_1.View>);
}
