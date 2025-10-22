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
exports.SpaceBetween = void 0;
var react_1 = require("react");
var View_1 = require("./View");
var SpaceBetween = function (_a) {
    var _b = _a.direction, direction = _b === void 0 ? 'horizontal' : _b, _c = _a.gap, gap = _c === void 0 ? 15 : _c, style = _a.style, children = _a.children;
    return (<View_1.View style={__assign({ flexWrap: 'wrap', flexDirection: direction === 'horizontal' ? 'row' : 'column', alignItems: 'center', gap: gap }, style)}>
      {children}
    </View_1.View>);
};
exports.SpaceBetween = SpaceBetween;
