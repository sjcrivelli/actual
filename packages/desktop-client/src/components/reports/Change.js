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
exports.Change = Change;
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
function Change(_a) {
    var amount = _a.amount, style = _a.style;
    var format = (0, useFormat_1.useFormat)();
    return (<block_1.Block style={__assign(__assign(__assign({}, styles_1.styles.smallText), { color: amount < 0 ? theme_1.theme.errorText : theme_1.theme.noticeTextLight }), style)}>
      {amount >= 0 ? '+' : ''}
      {format(amount, 'financial')}
    </block_1.Block>);
}
