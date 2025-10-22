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
exports.FloatingActionBar = FloatingActionBar;
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
function FloatingActionBar(_a) {
    var style = _a.style, children = _a.children;
    return (<view_1.View style={__assign({ backgroundColor: theme_1.theme.floatingActionBarBackground, color: theme_1.theme.floatingActionBarText, position: 'fixed', bottom: 10, margin: '0 10px', width: '95vw', height: 60, zIndex: 100, borderRadius: 8, border: "1px solid ".concat(theme_1.theme.floatingActionBarBorder) }, style)}>
      {children}
    </view_1.View>);
}
