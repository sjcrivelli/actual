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
exports.SvgCheveronDown = void 0;
var React = require("react");
var SvgCheveronDown = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="m9.293 12.95.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" fill="currentColor"/>
  </svg>); };
exports.SvgCheveronDown = SvgCheveronDown;
