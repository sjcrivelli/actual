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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellValue = CellValue;
exports.CellValueText = CellValueText;
// @ts-strict-ignore
var react_1 = require("react");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
function CellValue(_a) {
    var type = _a.type, binding = _a.binding, children = _a.children, props = __rest(_a, ["type", "binding", "children"]);
    var fullSheetName = (0, useSheetName_1.useSheetName)(binding).fullSheetName;
    var sheetValue = (0, useSheetValue_1.useSheetValue)(binding);
    return typeof children === 'function' ? (<>{children({ type: type, name: fullSheetName, value: sheetValue })}</>) : (<CellValueText type={type} name={fullSheetName} value={sheetValue} {...props}/>);
}
var PRIVACY_FILTER_TYPES = ['financial', 'financial-with-sign'];
function CellValueText(_a) {
    var type = _a.type, name = _a.name, value = _a.value, formatter = _a.formatter, style = _a.style, props = __rest(_a, ["type", "name", "value", "formatter", "style"]);
    var format = (0, useFormat_1.useFormat)();
    var isFinancial = type === 'financial' ||
        type === 'financial-with-sign' ||
        type === 'financial-no-decimals';
    return (<text_1.Text style={__assign(__assign(__assign({}, (isFinancial && styles_1.styles.tnum)), (isFinancial && { whiteSpace: 'nowrap' })), style)} data-testid={name} data-cellname={name} {...props}>
      <PrivacyFilter_1.PrivacyFilter activationFilters={[PRIVACY_FILTER_TYPES.includes(type)]}>
        {formatter ? formatter(value, type) : format(value, type)}
      </PrivacyFilter_1.PrivacyFilter>
    </text_1.Text>);
}
