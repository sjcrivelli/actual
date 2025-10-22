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
exports.SvgFormatFontSize = void 0;
var React = require("react");
var SvgFormatFontSize = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M16 9v8h-2V9h-4V7h10v2h-4zM8 5v12H6V5H0V3h15v2H8z" fill="currentColor"/>
  </svg>); };
exports.SvgFormatFontSize = SvgFormatFontSize;
