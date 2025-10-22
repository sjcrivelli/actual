"use strict";
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
exports.Text = void 0;
var react_1 = require("react");
var css_1 = require("@emotion/css");
exports.Text = (0, react_1.forwardRef)(function (props, ref) {
    var _a = props.className, className = _a === void 0 ? '' : _a, style = props.style, innerRef = props.innerRef, restProps = __rest(props, ["className", "style", "innerRef"]);
    return (<span {...restProps} ref={innerRef !== null && innerRef !== void 0 ? innerRef : ref} className={(0, css_1.cx)(className, (0, css_1.css)(style))}/>);
});
exports.Text.displayName = 'Text';
