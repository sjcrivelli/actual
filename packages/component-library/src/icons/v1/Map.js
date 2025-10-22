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
exports.SvgMap = void 0;
var React = require("react");
var SvgMap = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="m0 0 6 4 8-4 6 4v16l-6-4-8 4-6-4V0zm7 6v11l6-3V3L7 6z" fill="currentColor"/>
  </svg>); };
exports.SvgMap = SvgMap;
