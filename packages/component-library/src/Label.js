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
exports.Label = void 0;
var react_1 = require("react");
var styles_1 = require("./styles");
var Text_1 = require("./Text");
var theme_1 = require("./theme");
exports.Label = (0, react_1.forwardRef)(function (_a, ref) {
    var title = _a.title, style = _a.style;
    return (<Text_1.Text ref={ref} style={__assign(__assign(__assign({}, styles_1.styles.text), { color: theme_1.theme.tableRowHeaderText, textAlign: 'right', fontSize: 14, marginBottom: 2 }), style)}>
        {title}
      </Text_1.Text>);
});
exports.Label.displayName = 'Label';
