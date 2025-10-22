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
exports.useMetaThemeColor = useMetaThemeColor;
// @ts-strict-ignore
var react_1 = require("react");
var VAR_STRING_REGEX = /^var\((--.*)\)$/;
function useMetaThemeColor(color) {
    (0, react_1.useEffect)(function () {
        if (color) {
            setThemeColor(getPropertyValueFromVarString(color));
        }
    }, [color]);
}
function setThemeColor(color) {
    var metaTags = document.getElementsByTagName('meta');
    var themeTag = __spreadArray([], metaTags, true).find(function (tag) { return tag.name === 'theme-color'; });
    themeTag.setAttribute('content', color);
}
function getPropertyValueFromVarString(varString) {
    return VAR_STRING_REGEX.test(varString)
        ? window
            .getComputedStyle(document.documentElement)
            .getPropertyValue(varString.match(VAR_STRING_REGEX)[1])
        : varString;
}
