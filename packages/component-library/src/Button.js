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
exports.ButtonWithLoading = exports.Button = void 0;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var css_1 = require("@emotion/css");
var AnimatedLoading_1 = require("./icons/AnimatedLoading");
var styles_1 = require("./styles");
var theme_1 = require("./theme");
var View_1 = require("./View");
var backgroundColor = {
    normal: theme_1.theme.buttonNormalBackground,
    normalDisabled: theme_1.theme.buttonNormalDisabledBackground,
    primary: theme_1.theme.buttonPrimaryBackground,
    primaryDisabled: theme_1.theme.buttonPrimaryDisabledBackground,
    bare: theme_1.theme.buttonBareBackground,
    bareDisabled: theme_1.theme.buttonBareDisabledBackground,
    menu: theme_1.theme.buttonMenuBackground,
    menuSelected: theme_1.theme.buttonMenuSelectedBackground,
};
var backgroundColorHover = {
    normal: theme_1.theme.buttonNormalBackgroundHover,
    primary: theme_1.theme.buttonPrimaryBackgroundHover,
    bare: theme_1.theme.buttonBareBackgroundHover,
    menu: theme_1.theme.buttonMenuBackgroundHover,
    menuSelected: theme_1.theme.buttonMenuSelectedBackgroundHover,
    normalDisabled: 'transparent',
    primaryDisabled: 'transparent',
    bareDisabled: 'transparent',
    menuDisabled: 'transparent',
    menuSelectedDisabled: 'transparent',
};
var borderColor = {
    normal: theme_1.theme.buttonNormalBorder,
    normalDisabled: theme_1.theme.buttonNormalDisabledBorder,
    primary: theme_1.theme.buttonPrimaryBorder,
    primaryDisabled: theme_1.theme.buttonPrimaryDisabledBorder,
    menu: theme_1.theme.buttonMenuBorder,
    menuSelected: theme_1.theme.buttonMenuSelectedBorder,
};
var textColor = {
    normal: theme_1.theme.buttonNormalText,
    normalDisabled: theme_1.theme.buttonNormalDisabledText,
    primary: theme_1.theme.buttonPrimaryText,
    primaryDisabled: theme_1.theme.buttonPrimaryDisabledText,
    bare: theme_1.theme.buttonBareText,
    bareDisabled: theme_1.theme.buttonBareDisabledText,
    menu: theme_1.theme.buttonMenuText,
    menuSelected: theme_1.theme.buttonMenuSelectedText,
};
var textColorHover = {
    normal: theme_1.theme.buttonNormalTextHover,
    primary: theme_1.theme.buttonPrimaryTextHover,
    bare: theme_1.theme.buttonBareTextHover,
    menu: theme_1.theme.buttonMenuTextHover,
    menuSelected: theme_1.theme.buttonMenuSelectedTextHover,
};
var _getBorder = function (variant, variantWithDisabled) {
    switch (variant) {
        case 'bare':
            return 'none';
        default:
            return '1px solid ' + borderColor[variantWithDisabled];
    }
};
var _getPadding = function (variant) {
    switch (variant) {
        case 'bare':
            return '5px';
        default:
            return '5px 10px';
    }
};
var _getHoveredStyles = function (variant) { return (__assign(__assign({}, (variant !== 'bare' && styles_1.styles.shadow)), { backgroundColor: backgroundColorHover[variant], color: textColorHover[variant], cursor: 'pointer' })); };
var _getActiveStyles = function (variant, bounce) {
    switch (variant) {
        case 'bare':
            return { backgroundColor: theme_1.theme.buttonBareBackgroundActive };
        default:
            return {
                transform: bounce ? 'translateY(1px)' : undefined,
                boxShadow: "0 1px 4px 0 ".concat(variant === 'primary'
                    ? theme_1.theme.buttonPrimaryShadow
                    : theme_1.theme.buttonNormalShadow),
                transition: 'none',
            };
    }
};
exports.Button = (0, react_1.forwardRef)(function (props, ref) {
    var children = props.children, _a = props.variant, variant = _a === void 0 ? 'normal' : _a, _b = props.bounce, bounce = _b === void 0 ? true : _b, restProps = __rest(props, ["children", "variant", "bounce"]);
    var variantWithDisabled = props.isDisabled ? "".concat(variant, "Disabled") : variant;
    var defaultButtonClassName = (0, react_1.useMemo)(function () {
        return (0, css_1.css)(__assign(__assign({ alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: _getPadding(variant), margin: 0, overflow: 'hidden', display: 'flex', borderRadius: 4, backgroundColor: backgroundColor[variantWithDisabled], border: _getBorder(variant, variantWithDisabled), color: textColor[variantWithDisabled], transition: 'box-shadow .25s', WebkitAppRegion: 'no-drag' }, styles_1.styles.smallText), { '&[data-hovered]': _getHoveredStyles(variant), '&[data-pressed]': _getActiveStyles(variant, bounce) }));
    }, [bounce, variant, variantWithDisabled]);
    var className = restProps.className;
    return (<react_aria_components_1.Button ref={ref} {...restProps} className={typeof className === 'function'
            ? function (renderProps) { return (0, css_1.cx)(defaultButtonClassName, className(renderProps)); }
            : (0, css_1.cx)(defaultButtonClassName, className)}>
        {children}
      </react_aria_components_1.Button>);
});
exports.Button.displayName = 'Button';
exports.ButtonWithLoading = (0, react_1.forwardRef)(function (props, ref) {
    var isLoading = props.isLoading, children = props.children, style = props.style, buttonProps = __rest(props, ["isLoading", "children", "style"]);
    return (<exports.Button {...buttonProps} ref={ref} style={function (buttonRenderProps) { return (__assign({ position: 'relative' }, (typeof style === 'function' ? style(buttonRenderProps) : style))); }}>
      {isLoading && (<View_1.View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
          <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20 }}/>
        </View_1.View>)}
      <View_1.View style={{
            opacity: isLoading ? 0 : 1,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
        {children}
      </View_1.View>
    </exports.Button>);
});
exports.ButtonWithLoading.displayName = 'ButtonWithLoading';
