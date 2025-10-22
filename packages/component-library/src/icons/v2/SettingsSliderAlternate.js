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
exports.SvgSettingsSliderAlternate = void 0;
var React = require("react");
var SvgSettingsSliderAlternate = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="currentColor" d="M4.5 17.5h6.646a3.5 3.5 0 0 0 6.708 0H19.5a1 1 0 0 0 0-2h-1.646a3.5 3.5 0 0 0-6.708 0H4.5a1 1 0 0 0 0 2Zm10-2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM19.5 6.5h-6.646a3.5 3.5 0 0 0-6.708 0H4.5a1 1 0 0 0 0 2h1.646a3.5 3.5 0 0 0 6.708 0H19.5a1 1 0 1 0 0-2ZM9.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/>
  </svg>); };
exports.SvgSettingsSliderAlternate = SvgSettingsSliderAlternate;
