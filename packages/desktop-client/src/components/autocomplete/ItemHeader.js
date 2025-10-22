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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemHeader = ItemHeader;
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
function ItemHeader(_a) {
    var title = _a.title, style = _a.style, type = _a.type, props = __rest(_a, ["title", "style", "type"]);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowStyle = isNarrowWidth
        ? __assign(__assign({}, styles_1.styles.largeText), { paddingTop: 10, paddingBottom: 10 }) : {};
    return (<div style={__assign(__assign({ color: theme_1.theme.menuAutoCompleteTextHeader, padding: '4px 9px' }, narrowStyle), style)} data-testid={"".concat(title, "-").concat(type, "-item-group")} {...props}>
      {title}
    </div>);
}
