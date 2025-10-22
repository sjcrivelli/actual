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
exports.SvgAlertTriangle = void 0;
var React = require("react");
var SvgAlertTriangle = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M23.119 20 13.772 2.15a2 2 0 0 0-3.543 0L.881 20a2 2 0 0 0 1.772 2.928h18.694A2 2 0 0 0 23.119 20ZM11 8.423a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0Zm1.05 11.51h-.028a1.528 1.528 0 0 1-1.522-1.47 1.476 1.476 0 0 1 1.448-1.53h.028A1.527 1.527 0 0 1 13.5 18.4a1.475 1.475 0 0 1-1.45 1.533Z" fill="currentColor"/>
  </svg>); };
exports.SvgAlertTriangle = SvgAlertTriangle;
