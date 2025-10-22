"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedLoading = AnimatedLoading;
var react_1 = require("react");
var css_1 = require("@emotion/css");
var Loading_1 = require("./Loading");
var rotation = (0, css_1.keyframes)({
    '0%': { transform: 'rotate(-90deg)' },
    '100%': { transform: 'rotate(666deg)' },
});
function AnimatedLoading(props) {
    return (<span className={(0, css_1.css)({
            animationName: rotation,
            animationDuration: '1.6s',
            animationTimingFunction: 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
            animationIterationCount: 'infinite',
            lineHeight: 0,
        })}>
      <Loading_1.SvgLoading {...props}/>
    </span>);
}
