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
exports.SvgBookmarkCopy2 = void 0;
var React = require("react");
var SvgBookmarkCopy2 = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M18 12v1H8v5l-6-6 6-6v5h8V2h2z" fill="currentColor"/>
  </svg>); };
exports.SvgBookmarkCopy2 = SvgBookmarkCopy2;
