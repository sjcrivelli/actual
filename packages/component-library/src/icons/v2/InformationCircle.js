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
exports.SvgInformationCircle = void 0;
var React = require("react");
var SvgInformationCircle = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm.25 5a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5Zm2.25 13.5h-4a1 1 0 0 1 0-2h.75a.25.25 0 0 0 .25-.25v-4.5a.25.25 0 0 0-.25-.25h-.75a1 1 0 0 1 0-2h1a2 2 0 0 1 2 2v4.75a.25.25 0 0 0 .25.25h.75a1 1 0 1 1 0 2Z" fill="currentColor"/>
  </svg>); };
exports.SvgInformationCircle = SvgInformationCircle;
