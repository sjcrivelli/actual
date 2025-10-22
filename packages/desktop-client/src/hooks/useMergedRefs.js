"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMergedRefs = useMergedRefs;
var react_1 = require("react");
function useMergedRefs() {
    var refs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        refs[_i] = arguments[_i];
    }
    return (0, react_1.useCallback)(function (value) {
        __spreadArray([], refs, true).forEach(function (ref) {
            if (typeof ref === 'function') {
                ref(value);
            }
            else if (ref != null && 'current' in ref) {
                ref.current = value;
            }
        });
    }, [refs]);
}
