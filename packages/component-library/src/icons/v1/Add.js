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
exports.SvgAdd = void 0;
var React = require("react");
var SvgAdd = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="currentColor" d="M23 11.5a1.5 1.5 0 0 1-1.5 1.5h-20a1.5 1.5 0 0 1 0-3h20a1.5 1.5 0 0 1 1.5 1.5Z" className="path"/>
    <path fill="currentColor" d="M11.5 23a1.5 1.5 0 0 1-1.5-1.5v-20a1.5 1.5 0 0 1 3 0v20a1.5 1.5 0 0 1-1.5 1.5Z" className="path"/>
  </svg>); };
exports.SvgAdd = SvgAdd;
