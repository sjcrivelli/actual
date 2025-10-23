"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = exports.breakpoints = void 0;
var BreakpointNames;
(function (BreakpointNames) {
    BreakpointNames["small"] = "small";
    BreakpointNames["medium"] = "medium";
    BreakpointNames["wide"] = "wide";
})(BreakpointNames || (BreakpointNames = {}));
exports.breakpoints = {
    small: 512,
    medium: 730,
    wide: 1100,
};
// Provide the same breakpoints in a form usable by CSS media queries
// {
//   breakpoint_small: '512px',
//   breakpoint_medium: '740px',
//   breakpoint_wide: '1100px',
// }
exports.tokens = Object.entries(exports.breakpoints).reduce((acc, [key, val]) => ({
    ...acc,
    [`breakpoint_${key}`]: `${val}px`,
}), {});
