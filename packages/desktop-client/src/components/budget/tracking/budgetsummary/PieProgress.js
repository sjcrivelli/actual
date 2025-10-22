"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieProgress = PieProgress;
var react_1 = require("react");
function PieProgress(_a) {
    var style = _a.style, progress = _a.progress, color = _a.color, backgroundColor = _a.backgroundColor;
    var radius = 4;
    var circum = 2 * Math.PI * radius;
    var dash = progress * circum;
    var gap = circum;
    return (<svg viewBox="0 0 20 20" style={style}>
      <circle r="10" cx="10" cy="10" fill={backgroundColor}/>
      <circle r={radius} cx="10" cy="10" fill="none" stroke={color} strokeWidth={radius * 2} strokeDasharray={"".concat(dash, " ").concat(gap)} transform="rotate(-90) translate(-20)"/>{' '}
    </svg>);
}
