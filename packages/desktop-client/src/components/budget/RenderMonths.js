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
exports.RenderMonths = RenderMonths;
// @ts-strict-ignore
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var MonthsContext_1 = require("./MonthsContext");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
function RenderMonths(_a) {
    var Component = _a.component, editingMonth = _a.editingMonth, args = _a.args, style = _a.style;
    var months = (0, react_1.useContext)(MonthsContext_1.MonthsContext).months;
    return months.map(function (month, index) {
        var editing = editingMonth === month;
        return (<useSheetName_1.SheetNameProvider key={index} name={monthUtils.sheetForMonth(month)}>
        <view_1.View style={__assign({ flex: 1, borderLeft: '1px solid ' + theme_1.theme.tableBorder }, style)}>
          <Component month={month} editing={editing} {...args}/>
        </view_1.View>
      </useSheetName_1.SheetNameProvider>);
    });
}
