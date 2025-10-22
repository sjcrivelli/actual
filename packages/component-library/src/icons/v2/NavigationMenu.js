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
exports.SvgNavigationMenu = void 0;
var React = require("react");
var SvgNavigationMenu = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <rect width={23} height={3} x={0.5} y={2.5} rx={1} ry={1} fill="currentColor"/>
    <rect width={23} height={3} x={0.5} y={10.5} rx={1} ry={1} fill="currentColor"/>
    <rect width={23} height={3} x={0.5} y={18.5} rx={1} ry={1} fill="currentColor"/>
  </svg>); };
exports.SvgNavigationMenu = SvgNavigationMenu;
