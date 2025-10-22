"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedRefresh = AnimatedRefresh;
// @ts-strict-ignore
var react_1 = require("react");
var v1_1 = require("@actual-app/components/icons/v1");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var spin = (0, css_1.keyframes)({
    '0%': { transform: 'rotateZ(0deg)' },
    '100%': { transform: 'rotateZ(360deg)' },
});
function AnimatedRefresh(_a) {
    var animating = _a.animating, iconStyle = _a.iconStyle, width = _a.width, height = _a.height;
    return (<view_1.View style={{ animation: animating ? "".concat(spin, " 1s infinite linear") : null }}>
      <v1_1.SvgRefresh width={width ? width : 14} height={height ? height : 14} style={iconStyle}/>
    </view_1.View>);
}
