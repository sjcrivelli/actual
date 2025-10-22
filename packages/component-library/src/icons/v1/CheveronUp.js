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
exports.SvgCheveronUp = void 0;
var React = require("react");
var SvgCheveronUp = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M10.707 7.05 10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" fill="currentColor"/>
  </svg>); };
exports.SvgCheveronUp = SvgCheveronUp;
