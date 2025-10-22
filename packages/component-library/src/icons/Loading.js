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
exports.SvgLoading = void 0;
var react_1 = require("react");
var SvgLoading = function (props) {
    var _a = props.color, color = _a === void 0 ? 'currentColor' : _a;
    var gradientId = (0, react_1.useState)('gradient-' + Math.random())[0];
    return (<svg {...props} viewBox="0 0 38 38" style={__assign({}, props.style)}>
      <defs>
        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id={gradientId}>
          <stop stopColor={color} stopOpacity={0} offset="0%"/>
          <stop stopColor={color} stopOpacity={0.631} offset="63.146%"/>
          <stop stopColor={color} offset="100%"/>
        </linearGradient>
      </defs>
      <g transform="translate(1 2)" fill="none" fillRule="evenodd">
        <path d="M36 18c0-9.94-8.06-18-18-18" stroke={'url(#' + gradientId + ')'} strokeWidth={2} fill="none"/>
        <circle fill={color} cx={36} cy={18} r={1}/>
      </g>
    </svg>);
};
exports.SvgLoading = SvgLoading;
