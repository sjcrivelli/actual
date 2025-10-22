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
exports.BudgetTotal = BudgetTotal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
function BudgetTotal(_a) {
    var title = _a.title, current = _a.current, target = _a.target, ProgressComponent = _a.ProgressComponent, style = _a.style;
    return (<view_1.View style={__assign({ lineHeight: 1.5, flexDirection: 'row', alignItems: 'center', fontSize: 14 }, style)}>
      <ProgressComponent current={current} target={target}/>

      <view_1.View style={{ marginLeft: 10 }}>
        <view_1.View>
          <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>{title}</text_1.Text>
        </view_1.View>

        <text_1.Text>
          <react_i18next_1.Trans i18nKey="<allocatedAmount /> <italic>of <totalAmount /></italic>" components={{
            allocatedAmount: <CellValue_1.CellValue binding={current} type="financial"/>,
            italic: (<text_1.Text style={{ color: theme_1.theme.pageTextSubdued, fontStyle: 'italic' }}/>),
            totalAmount: (<CellValue_1.CellValue binding={target} type="financial">
                  {function (props) { return (<CellValue_1.CellValueText {...props} style={styles_1.styles.notFixed}/>); }}
                </CellValue_1.CellValue>),
        }}/>
        </text_1.Text>
      </view_1.View>
    </view_1.View>);
}
