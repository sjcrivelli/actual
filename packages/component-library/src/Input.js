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
exports.baseInputStyle = void 0;
exports.Input = Input;
exports.BigInput = BigInput;
exports.ResponsiveInput = ResponsiveInput;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var css_1 = require("@emotion/css");
var useResponsive_1 = require("./hooks/useResponsive");
var styles_1 = require("./styles");
var theme_1 = require("./theme");
exports.baseInputStyle = {
    outline: 0,
    backgroundColor: theme_1.theme.tableBackground,
    color: theme_1.theme.formInputText,
    margin: 0,
    padding: 5,
    borderRadius: 4,
    border: '1px solid ' + theme_1.theme.formInputBorder,
};
var defaultInputClassName = (0, css_1.css)(__assign(__assign(__assign({}, exports.baseInputStyle), { color: theme_1.theme.formInputText, whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 0, '&[data-focused]': {
        border: '1px solid ' + theme_1.theme.formInputBorderSelected,
        boxShadow: '0 1px 1px ' + theme_1.theme.formInputShadowSelected,
    }, '&[data-disabled]': {
        color: theme_1.theme.formInputTextPlaceholder,
    }, '::placeholder': { color: theme_1.theme.formInputTextPlaceholder } }), styles_1.styles.smallText));
function Input(_a) {
    var ref = _a.ref, onEnter = _a.onEnter, onEscape = _a.onEscape, onChangeValue = _a.onChangeValue, onUpdate = _a.onUpdate, className = _a.className, props = __rest(_a, ["ref", "onEnter", "onEscape", "onChangeValue", "onUpdate", "className"]);
    return (<react_aria_components_1.Input ref={ref} className={typeof className === 'function'
            ? function (renderProps) { return (0, css_1.cx)(defaultInputClassName, className(renderProps)); }
            : (0, css_1.cx)(defaultInputClassName, className)} {...props} onKeyUp={function (e) {
            var _a;
            (_a = props.onKeyUp) === null || _a === void 0 ? void 0 : _a.call(props, e);
            if (e.key === 'Enter' && onEnter) {
                onEnter(e.currentTarget.value, e);
            }
            if (e.key === 'Escape' && onEscape) {
                onEscape(e.currentTarget.value, e);
            }
        }} onBlur={function (e) {
            var _a;
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(e.currentTarget.value, e);
            (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }} onChange={function (e) {
            var _a;
            onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(e.currentTarget.value, e);
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }}/>);
}
var defaultBigInputClassName = (0, css_1.css)(__assign(__assign({ padding: 10, fontSize: 15, border: 'none' }, styles_1.styles.shadow), { '&[data-focused]': __assign({ border: 'none' }, styles_1.styles.shadow) }));
function BigInput(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<Input {...props} className={typeof className === 'function'
            ? function (renderProps) { return (0, css_1.cx)(defaultBigInputClassName, className(renderProps)); }
            : (0, css_1.cx)(defaultBigInputClassName, className)}/>);
}
function ResponsiveInput(props) {
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    return isNarrowWidth ? <BigInput {...props}/> : <Input {...props}/>;
}
