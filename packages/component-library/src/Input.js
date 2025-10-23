"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseInputStyle = void 0;
exports.Input = Input;
exports.BigInput = BigInput;
exports.ResponsiveInput = ResponsiveInput;
const react_1 = __importDefault(require("react"));
const react_aria_components_1 = require("react-aria-components");
const css_1 = require("@emotion/css");
const useResponsive_1 = require("./hooks/useResponsive");
const styles_1 = require("./styles");
const theme_1 = require("./theme");
exports.baseInputStyle = {
    outline: 0,
    backgroundColor: theme_1.theme.tableBackground,
    color: theme_1.theme.formInputText,
    margin: 0,
    padding: 5,
    borderRadius: 4,
    border: '1px solid ' + theme_1.theme.formInputBorder,
};
const defaultInputClassName = (0, css_1.css)({
    ...exports.baseInputStyle,
    color: theme_1.theme.formInputText,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    flexShrink: 0,
    '&[data-focused]': {
        border: '1px solid ' + theme_1.theme.formInputBorderSelected,
        boxShadow: '0 1px 1px ' + theme_1.theme.formInputShadowSelected,
    },
    '&[data-disabled]': {
        color: theme_1.theme.formInputTextPlaceholder,
    },
    '::placeholder': { color: theme_1.theme.formInputTextPlaceholder },
    ...styles_1.styles.smallText,
});
function Input({ ref, onEnter, onEscape, onChangeValue, onUpdate, className, ...props }) {
    return (<react_aria_components_1.Input ref={ref} className={typeof className === 'function'
            ? renderProps => (0, css_1.cx)(defaultInputClassName, className(renderProps))
            : (0, css_1.cx)(defaultInputClassName, className)} {...props} onKeyUp={e => {
            props.onKeyUp?.(e);
            if (e.key === 'Enter' && onEnter) {
                onEnter(e.currentTarget.value, e);
            }
            if (e.key === 'Escape' && onEscape) {
                onEscape(e.currentTarget.value, e);
            }
        }} onBlur={e => {
            onUpdate?.(e.currentTarget.value, e);
            props.onBlur?.(e);
        }} onChange={e => {
            onChangeValue?.(e.currentTarget.value, e);
            props.onChange?.(e);
        }}/>);
}
const defaultBigInputClassName = (0, css_1.css)({
    padding: 10,
    fontSize: 15,
    border: 'none',
    ...styles_1.styles.shadow,
    '&[data-focused]': { border: 'none', ...styles_1.styles.shadow },
});
function BigInput({ className, ...props }) {
    return (<Input {...props} className={typeof className === 'function'
            ? renderProps => (0, css_1.cx)(defaultBigInputClassName, className(renderProps))
            : (0, css_1.cx)(defaultBigInputClassName, className)}/>);
}
function ResponsiveInput(props) {
    const { isNarrowWidth } = (0, useResponsive_1.useResponsive)();
    return isNarrowWidth ? <BigInput {...props}/> : <Input {...props}/>;
}
