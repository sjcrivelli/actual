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
exports.OpButton = OpButton;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var rules_1 = require("loot-core/shared/rules");
function OpButton(_a) {
    var op = _a.op, isSelected = _a.isSelected, style = _a.style, onPress = _a.onPress;
    return (<button_1.Button variant="bare" style={style} className={(0, css_1.css)(__assign({ backgroundColor: theme_1.theme.pillBackground, marginBottom: 5 }, (isSelected && {
            color: theme_1.theme.buttonNormalSelectedText,
            '&,:hover,:active': {
                backgroundColor: theme_1.theme.buttonNormalSelectedBackground,
                color: theme_1.theme.buttonNormalSelectedText,
            },
        })))} onPress={onPress}>
      {(0, rules_1.friendlyOp)(op)}
    </button_1.Button>);
}
