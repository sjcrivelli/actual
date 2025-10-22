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
exports.tokens = Object.entries(exports.breakpoints).reduce(function (acc, _a) {
    var _b;
    var key = _a[0], val = _a[1];
    return (__assign(__assign({}, acc), (_b = {}, _b["breakpoint_".concat(key)] = "".concat(val, "px"), _b)));
}, {});
