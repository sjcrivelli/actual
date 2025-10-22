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
exports.SvgCheveronLeft = void 0;
var React = require("react");
var SvgCheveronLeft = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M7.05 9.293 6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" fill="currentColor"/>
  </svg>); };
exports.SvgCheveronLeft = SvgCheveronLeft;
