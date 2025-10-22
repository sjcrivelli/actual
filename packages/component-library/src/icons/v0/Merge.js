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
exports.SvgMerge = void 0;
var React = require("react");
var SvgMerge = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={3.5} d="M24 29h5.333M8 29H2.667M16 21l-8 8M16 21l8 8M16 2.667v18.666M16 2.667 8 9.333M16 2.667l8 6.666"/>
  </svg>); };
exports.SvgMerge = SvgMerge;
