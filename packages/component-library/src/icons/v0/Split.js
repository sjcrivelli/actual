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
exports.SvgSplit = void 0;
var React = require("react");
var SvgSplit = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={3.5} d="m30 9-4-4M30 9l-4 4M6 5 2 9M2 9l4 4M10 9H3M22 9h7M16 15l6-6M16 15l-6-6M16 28V15"/>
  </svg>); };
exports.SvgSplit = SvgSplit;
