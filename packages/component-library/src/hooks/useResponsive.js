"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponsive = useResponsive;
const usehooks_ts_1 = require("usehooks-ts");
const tokens_1 = require("../tokens");
function useResponsive() {
    const { height, width } = (0, usehooks_ts_1.useWindowSize)({
        debounceDelay: 250,
    });
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
        height,
        width,
    };
}
