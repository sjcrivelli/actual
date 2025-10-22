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
exports.ModeButton = ModeButton;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
function ModeButton(_a) {
    var selected = _a.selected, children = _a.children, style = _a.style, onSelect = _a.onSelect;
    return (<button_1.Button variant="bare" className={(0, css_1.css)(__assign(__assign({ padding: '5px 10px', backgroundColor: theme_1.theme.menuBackground, fontSize: 'inherit' }, style), (selected && {
            backgroundColor: theme_1.theme.buttonPrimaryBackground,
            color: theme_1.theme.buttonPrimaryText,
            ':hover': {
                backgroundColor: theme_1.theme.buttonPrimaryBackgroundHover,
                color: theme_1.theme.buttonPrimaryTextHover,
            },
        })))} onPress={onSelect}>
      {children}
    </button_1.Button>);
}
