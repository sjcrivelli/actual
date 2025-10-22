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
exports.useFormatList = useFormatList;
var react_1 = require("react");
var interleaveArrays = function () {
    var arrays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrays[_i] = arguments[_i];
    }
    return Array.from({
        length: Math.max.apply(Math, arrays.map(function (array) { return array.length; })),
    }, function (_, i) { return arrays.map(function (array) { return array[i]; }); }).flat();
};
function useFormatList(values, lng, opt) {
    if (opt === void 0) { opt = {}; }
    var formatter = (0, react_1.useMemo)(function () {
        return new Intl.ListFormat(lng, __assign({ style: 'long', type: 'conjunction' }, opt));
    }, [lng, opt]);
    var parts = (0, react_1.useMemo)(function () {
        var placeholders = Array.from({ length: values.length }, function (_, i) { return "<".concat(i, ">"); });
        var formatted = formatter.format(placeholders);
        return formatted.split(/<\d+>/g);
    }, [values.length, formatter]);
    return interleaveArrays(parts, values);
}
