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
exports.SvgSubtract = void 0;
var React = require("react");
var SvgSubtract = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 3" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="currentColor" fillRule="nonzero" d="M23 1.5A1.5 1.5 0 0 1 21.5 3h-20a1.5 1.5 0 0 1 0-3h20A1.5 1.5 0 0 1 23 1.5z"/>
  </svg>); };
exports.SvgSubtract = SvgSubtract;
