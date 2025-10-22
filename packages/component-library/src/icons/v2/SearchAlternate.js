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
exports.SvgSearchAlternate = void 0;
var React = require("react");
var SvgSearchAlternate = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="m23.384 21.619-6.529-6.529a9.284 9.284 0 1 0-1.768 1.768l6.529 6.529a1.266 1.266 0 0 0 1.768 0 1.251 1.251 0 0 0 0-1.768ZM2.75 9.5a6.75 6.75 0 1 1 6.75 6.75A6.758 6.758 0 0 1 2.75 9.5Z" fill="currentColor"/>
  </svg>); };
exports.SvgSearchAlternate = SvgSearchAlternate;
