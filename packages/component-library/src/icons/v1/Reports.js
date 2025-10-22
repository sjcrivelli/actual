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
exports.SvgReports = void 0;
var React = require("react");
var SvgReports = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M19 18h-1v-8c0-.6-.4-1-1-1s-1 .4-1 1v8h-3V1c0-.6-.4-1-1-1s-1 .4-1 1v17H8V7c0-.6-.4-1-1-1s-1 .4-1 1v11H3V3c0-.6-.4-1-1-1s-1 .4-1 1v15c-.6 0-1 .4-1 1s.4 1 1 1h18c.6 0 1-.4 1-1s-.4-1-1-1z" fill="currentColor"/>
  </svg>); };
exports.SvgReports = SvgReports;
