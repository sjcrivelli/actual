"use strict";
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
exports.Paragraph = Paragraph;
var css_1 = require("@emotion/css");
function Paragraph(_a) {
    var style = _a.style, isLast = _a.isLast, children = _a.children, props = __rest(_a, ["style", "isLast", "children"]);
    return (<div {...props} className={(0, css_1.css)([
            !isLast && { marginBottom: 15 },
            style,
            {
                lineHeight: '1.5em',
            },
        ])}>
      {children}
    </div>);
}
