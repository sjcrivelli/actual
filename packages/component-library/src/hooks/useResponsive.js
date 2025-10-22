"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponsive = useResponsive;
var usehooks_ts_1 = require("usehooks-ts");
var tokens_1 = require("../tokens");
function useResponsive() {
    var _a = (0, usehooks_ts_1.useWindowSize)({
        debounceDelay: 250,
    }), height = _a.height, width = _a.width;
    // Possible view modes: narrow, small, medium, wide
    // To check if we're at least small width, check !isNarrowWidth
    return {
        // atLeastMediumWidth is provided to avoid checking (isMediumWidth || isWideWidth)
        atLeastMediumWidth: width >= tokens_1.breakpoints.medium,
        isNarrowWidth: width < tokens_1.breakpoints.small,
        isSmallWidth: width >= tokens_1.breakpoints.small && width < tokens_1.breakpoints.medium,
        isMediumWidth: width >= tokens_1.breakpoints.medium && width < tokens_1.breakpoints.wide,
        // No atLeastWideWidth because that's identical to isWideWidth
        isWideWidth: width >= tokens_1.breakpoints.wide,
        height: height,
        width: width,
    };
}
