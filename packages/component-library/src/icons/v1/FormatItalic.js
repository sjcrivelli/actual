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
exports.SvgFormatItalic = void 0;
var React = require("react");
var SvgFormatItalic = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M8 1h9v2H8V1zm3 2h3L8 17H5l6-14zM2 17h9v2H2v-2z" fill="currentColor"/>
  </svg>); };
exports.SvgFormatItalic = SvgFormatItalic;
