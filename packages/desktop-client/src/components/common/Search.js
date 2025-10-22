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
exports.Search = Search;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var input_1 = require("@actual-app/components/input");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
function Search(_a) {
    var inputRef = _a.inputRef, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, _b = _a.isInModal, isInModal = _b === void 0 ? false : _b, _c = _a.width, width = _c === void 0 ? 250 : _c, height = _a.height, style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _d = (0, react_1.useState)(false), focused = _d[0], setFocused = _d[1];
    var clearButtonPadding = ((height !== null && height !== void 0 ? height : 24) - 8) / 2;
    return (<view_1.View style={__assign(__assign(__assign(__assign({}, input_1.baseInputStyle), { padding: 0, flexDirection: 'row', alignItems: 'center', width: width, height: height, flex: '', borderColor: isInModal ? undefined : 'transparent', backgroundColor: isInModal ? undefined : theme_1.theme.formInputBackground }), style), (focused && __assign({ boxShadow: '0 0 0 1px ' + theme_1.theme.formInputShadowSelected }, (isInModal
            ? {}
            : { backgroundColor: theme_1.theme.formInputBackgroundSelected }))))}>
      <v2_1.SvgSearchAlternate style={{
            width: 13,
            height: 13,
            flexShrink: 0,
            color: value ? theme_1.theme.menuItemTextSelected : 'inherit',
            margin: 5,
            marginRight: 0,
        }}/>

      <input_1.Input ref={inputRef} value={value} placeholder={placeholder} onEscape={function () { return onChange(''); }} onChangeValue={onChange} className={(0, css_1.css)({
            width: '100%',
            '::placeholder': {
                color: theme_1.theme.formInputTextPlaceholder,
                transition: 'color .25s',
            },
            '&[data-focused]': isInModal
                ? {}
                : {
                    '::placeholder': {
                        color: theme_1.theme.formInputTextPlaceholderSelected,
                    },
                },
            flex: 1,
            '&, &[data-focused], &[data-hovered]': {
                border: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                color: 'inherit',
            },
        })} onFocus={function () {
            setFocused(true);
        }} onBlur={function () {
            setFocused(false);
        }}/>

      {value && (<view_1.View title={t('Clear search term')}>
          <button_1.Button variant="bare" style={{
                padding: "".concat(clearButtonPadding, "px 8px ").concat(clearButtonPadding, "px ").concat(clearButtonPadding, "px"),
            }} onPress={function () { return onChange(''); }}>
            <v2_1.SvgRemove style={{ width: 8, height: 8 }}/>
          </button_1.Button>
        </view_1.View>)}
    </view_1.View>);
}
