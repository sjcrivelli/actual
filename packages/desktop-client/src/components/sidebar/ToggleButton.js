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
exports.ToggleButton = ToggleButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
function ToggleButton(_a) {
    var style = _a.style, isFloating = _a.isFloating, onFloat = _a.onFloat;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View className="float" style={__assign(__assign({}, style), { flexShrink: 0 })}>
      <button_1.Button variant="bare" aria-label={isFloating ? t('Pin sidebar') : t('Unpin sidebar')} onPress={onFloat} style={{ color: theme_1.theme.buttonMenuBorder }}>
        {isFloating ? (<v1_1.SvgPin style={{
                margin: -2,
                width: 15,
                height: 15,
                transform: 'rotate(45deg)',
            }}/>) : (<v2_1.SvgArrowButtonLeft1 style={{ width: 13, height: 13 }}/>)}
      </button_1.Button>
    </view_1.View>);
}
