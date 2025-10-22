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
exports.SvgCustomNotesPaper = void 0;
var React = require("react");
var SvgCustomNotesPaper = function (props) { return (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 24" style={__assign({ color: 'inherit' }, props.style)}>
    <path fill="currentColor" d="M17 24H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h9a1 1 0 0 1 .707.293l7 7A1 1 0 0 1 19 8v14a2 2 0 0 1-2 2ZM2 21.5a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-4a2 2 0 0 1-2-2v-4A.5.5 0 0 0 10 2H2.5a.5.5 0 0 0-.5.5v19Z"/>
  </svg>); };
exports.SvgCustomNotesPaper = SvgCustomNotesPaper;
