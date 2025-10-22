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
exports.SvgDelete = void 0;
var React = require("react");
var SvgDelete = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="none" stroke="currentColor" d="m2 2 20 20M22 2 2 22" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={4}/>
  </svg>); };
exports.SvgDelete = SvgDelete;
