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
exports.ReportTableList = ReportTableList;
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var RenderTableRow_1 = require("./RenderTableRow");
var table_1 = require("@desktop-client/components/table");
function ReportTableList(_a) {
    var data = _a.data, mode = _a.mode, groupBy = _a.groupBy, renderRow = _a.renderRow, style = _a.style;
    var metadata = groupBy === 'Category'
        ? data.groupedData || []
        : groupBy === 'Interval'
            ? data.intervalData.map(function (interval) {
                return {
                    id: '',
                    name: '',
                    date: interval.date,
                    totalAssets: interval.totalAssets,
                    totalDebts: interval.totalDebts,
                    netAssets: interval.netAssets,
                    netDebts: interval.netDebts,
                    totalTotals: interval.totalTotals,
                    intervalData: [],
                    categories: [],
                };
            })
            : data.data;
    return (<view_1.View>
      {metadata ? (<view_1.View>
          {metadata.map(function (item, index) {
                return (<view_1.View key={index}>
                <RenderTableRow_1.RenderTableRow index={index} renderRow={renderRow} mode={mode} metadata={metadata} style={__assign(__assign({}, (item.categories && {
                        color: theme_1.theme.tableRowHeaderText,
                        backgroundColor: theme_1.theme.tableRowHeaderBackground,
                        fontWeight: 600,
                    })), style)}/>
                {item.categories && (<>
                    <view_1.View>
                      {item.categories.map(function (category, i) {
                            return (<RenderTableRow_1.RenderTableRow key={category.id} index={i} renderRow={renderRow} mode={mode} metadata={metadata} parent_index={index} style={style}/>);
                        })}
                    </view_1.View>
                    <table_1.Row height={20}/>
                  </>)}
              </view_1.View>);
            })}
        </view_1.View>) : (<view_1.View width="flex"/>)}
    </view_1.View>);
}
