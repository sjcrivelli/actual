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
exports.MobileBackButton = MobileBackButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function MobileBackButton(_a) {
    var onPress = _a.onPress, style = _a.style, props = __rest(_a, ["onPress", "style"]);
    var navigate = (0, useNavigate_1.useNavigate)();
    return (<button_1.Button variant="bare" style={__assign({ margin: 10 }, style)} onPress={onPress || (function () { return navigate(-1); })} {...props}>
      <v1_1.SvgCheveronLeft style={{ width: 30, height: 30, margin: -10, marginLeft: -5 }}/>
      <text_1.Text style={__assign(__assign({}, styles_1.styles.text), { fontWeight: 500, marginLeft: 5, marginRight: 5 })}>
        <react_i18next_1.Trans>Back</react_i18next_1.Trans>
      </text_1.Text>
    </button_1.Button>);
}
