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
exports.TotalsList = TotalsList;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var aligned_text_1 = require("@actual-app/components/aligned-text");
var block_1 = require("@actual-app/components/block");
var styles_1 = require("@actual-app/components/styles");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function TotalsList(_a) {
    var prevMonthName = _a.prevMonthName, style = _a.style;
    var format = (0, useFormat_1.useFormat)();
    return (<view_1.View style={__assign(__assign({ flexDirection: 'row', lineHeight: 1.5, justifyContent: 'center' }, styles_1.styles.smallText), style)}>
      <view_1.View style={{
            textAlign: 'right',
            marginRight: 10,
            minWidth: 50,
        }}>
        <tooltip_1.Tooltip style={__assign(__assign({}, styles_1.styles.tooltip), { lineHeight: 1.5, padding: '6px 10px' })} content={<>
              <aligned_text_1.AlignedText left="Income:" right={<EnvelopeBudgetComponents_1.EnvelopeCellValue binding={bindings_1.envelopeBudget.totalIncome} type="financial"/>}/>
              <aligned_text_1.AlignedText left="From Last Month:" right={<EnvelopeBudgetComponents_1.EnvelopeCellValue binding={bindings_1.envelopeBudget.fromLastMonth} type="financial"/>}/>
            </>} placement="bottom end">
          <EnvelopeBudgetComponents_1.EnvelopeCellValue binding={bindings_1.envelopeBudget.incomeAvailable} type="financial">
            {function (props) { return <CellValue_1.CellValueText {...props} style={{ fontWeight: 600 }}/>; }}
          </EnvelopeBudgetComponents_1.EnvelopeCellValue>
        </tooltip_1.Tooltip>

        <EnvelopeBudgetComponents_1.EnvelopeCellValue binding={bindings_1.envelopeBudget.lastMonthOverspent} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} style={{ fontWeight: 600 }} formatter={function (value, type) {
                var v = format(value, type);
                return value > 0 ? '+' + v : value === 0 ? '-' + v : v;
            }}/>); }}
        </EnvelopeBudgetComponents_1.EnvelopeCellValue>

        <EnvelopeBudgetComponents_1.EnvelopeCellValue binding={bindings_1.envelopeBudget.totalBudgeted} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} style={{ fontWeight: 600 }} formatter={function (value, type) {
                var v = format(value, type);
                return value > 0 ? '+' + v : value === 0 ? '-' + v : v;
            }}/>); }}
        </EnvelopeBudgetComponents_1.EnvelopeCellValue>

        <EnvelopeBudgetComponents_1.EnvelopeCellValue binding={bindings_1.envelopeBudget.forNextMonth} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} style={{ fontWeight: 600 }} formatter={function (value, type) {
                var v = format(Math.abs(value), type);
                return value >= 0 ? '-' + v : '+' + v;
            }}/>); }}
        </EnvelopeBudgetComponents_1.EnvelopeCellValue>
      </view_1.View>

      <view_1.View>
        <block_1.Block>
          <react_i18next_1.Trans>Available funds</react_i18next_1.Trans>
        </block_1.Block>

        <block_1.Block>
          <react_i18next_1.Trans>Overspent in {{ prevMonthName: prevMonthName }}</react_i18next_1.Trans>
        </block_1.Block>

        <block_1.Block>
          <react_i18next_1.Trans>Budgeted</react_i18next_1.Trans>
        </block_1.Block>

        <block_1.Block>
          <react_i18next_1.Trans>For next month</react_i18next_1.Trans>
        </block_1.Block>
      </view_1.View>
    </view_1.View>);
}
