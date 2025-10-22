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
exports.FormError = FormError;
var View_1 = require("./View");
function FormError(_a) {
    var style = _a.style, children = _a.children;
    return (<View_1.View style={__assign({ color: 'red', fontSize: 13 }, style)}>{children}</View_1.View>);
}
