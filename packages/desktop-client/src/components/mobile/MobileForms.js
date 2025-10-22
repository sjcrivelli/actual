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
exports.TapField = exports.InputField = void 0;
exports.FieldLabel = FieldLabel;
exports.ToggleField = ToggleField;
var react_1 = require("react");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var toggle_1 = require("@actual-app/components/toggle");
var css_1 = require("@emotion/css");
function FieldLabel(_a) {
    var title = _a.title, flush = _a.flush, style = _a.style;
    return (<text_1.Text style={__assign({ marginBottom: 5, marginTop: flush ? 0 : 25, fontSize: 14, color: theme_1.theme.tableRowHeaderText, padding: "0 ".concat(styles_1.styles.mobileEditingPadding, "px"), userSelect: 'none' }, style)}>
      {title}
    </text_1.Text>);
}
var valueStyle = {
    borderWidth: 1,
    borderColor: theme_1.theme.formInputBorder,
    marginLeft: 8,
    marginRight: 8,
    height: styles_1.styles.mobileMinHeight,
};
exports.InputField = (0, react_1.forwardRef)(function (_a, ref) {
    var disabled = _a.disabled, style = _a.style, onUpdate = _a.onUpdate, props = __rest(_a, ["disabled", "style", "onUpdate"]);
    return (<input_1.Input ref={ref} autoCorrect="false" autoCapitalize="none" disabled={disabled} onUpdate={onUpdate} style={__assign(__assign(__assign({}, valueStyle), style), { color: disabled ? theme_1.theme.tableTextInactive : theme_1.theme.tableText, backgroundColor: disabled
                ? theme_1.theme.formInputTextReadOnlySelection
                : theme_1.theme.tableBackground })} {...props}/>);
});
exports.InputField.displayName = 'InputField';
var defaultTapFieldStyle = function (_a) {
    var isDisabled = _a.isDisabled, isPressed = _a.isPressed, isHovered = _a.isHovered;
    return (__assign(__assign(__assign(__assign(__assign({}, valueStyle), { flexDirection: 'row', alignItems: 'center', backgroundColor: theme_1.theme.tableBackground }), (isDisabled && {
        backgroundColor: theme_1.theme.formInputTextReadOnlySelection,
    })), (isPressed
        ? {
            opacity: 0.5,
            boxShadow: 'none',
        }
        : {})), (isHovered
        ? {
            boxShadow: 'none',
        }
        : {})));
};
exports.TapField = (0, react_1.forwardRef)(function (_a, ref) {
    var value = _a.value, children = _a.children, rightContent = _a.rightContent, style = _a.style, textStyle = _a.textStyle, props = __rest(_a, ["value", "children", "rightContent", "style", "textStyle"]);
    return (<button_1.Button ref={ref} bounce={false} style={function (renderProps) { return (__assign(__assign({}, defaultTapFieldStyle(renderProps)), (typeof style === 'function' ? style(renderProps) : style))); }} {...props}>
        {children ? (children) : (<text_1.Text style={__assign({ flex: 1, userSelect: 'none', textAlign: 'left' }, textStyle)}>
            {value}
          </text_1.Text>)}
        {!props.isDisabled && rightContent}
      </button_1.Button>);
});
exports.TapField.displayName = 'TapField';
function ToggleField(_a) {
    var id = _a.id, isOn = _a.isOn, onToggle = _a.onToggle, style = _a.style, className = _a.className, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b;
    return (<toggle_1.Toggle id={id} isOn={isOn} isDisabled={isDisabled} onToggle={onToggle} style={style} className={String((0, css_1.css)([
            {
                '& [data-toggle-container]': {
                    width: 50,
                    height: 24,
                },
                '& [data-toggle]': {
                    width: 20,
                    height: 20,
                },
            },
            className,
        ]))}/>);
}
