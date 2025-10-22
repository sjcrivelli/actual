"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCustomLabel = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var renderCustomLabel = function (calcX, calcY, textAnchor, display, textSize, showLabel, showLabelThreshold, fill) {
    if (fill === void 0) { fill = theme_1.theme.pageText; }
    return !showLabel || Math.abs(showLabel) > showLabelThreshold ? (<text key={fill + display} x={calcX} y={calcY} fill={fill} textAnchor={textAnchor} dominantBaseline="middle" fontSize={textSize}>
      <PrivacyFilter_1.PrivacyFilter>{display}</PrivacyFilter_1.PrivacyFilter>
    </text>) : (<text />);
};
exports.renderCustomLabel = renderCustomLabel;
