"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonWithLoading = exports.Button = void 0;
const react_1 = __importStar(require("react"));
const react_aria_components_1 = require("react-aria-components");
const css_1 = require("@emotion/css");
const AnimatedLoading_1 = require("./icons/AnimatedLoading");
const styles_1 = require("./styles");
const theme_1 = require("./theme");
const View_1 = require("./View");
const backgroundColor = {
    normal: theme_1.theme.buttonNormalBackground,
    normalDisabled: theme_1.theme.buttonNormalDisabledBackground,
    primary: theme_1.theme.buttonPrimaryBackground,
    primaryDisabled: theme_1.theme.buttonPrimaryDisabledBackground,
    bare: theme_1.theme.buttonBareBackground,
    bareDisabled: theme_1.theme.buttonBareDisabledBackground,
    menu: theme_1.theme.buttonMenuBackground,
    menuSelected: theme_1.theme.buttonMenuSelectedBackground,
};
const backgroundColorHover = {
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
const borderColor = {
    normal: theme_1.theme.buttonNormalBorder,
    normalDisabled: theme_1.theme.buttonNormalDisabledBorder,
    primary: theme_1.theme.buttonPrimaryBorder,
    primaryDisabled: theme_1.theme.buttonPrimaryDisabledBorder,
    menu: theme_1.theme.buttonMenuBorder,
    menuSelected: theme_1.theme.buttonMenuSelectedBorder,
};
const textColor = {
    normal: theme_1.theme.buttonNormalText,
    normalDisabled: theme_1.theme.buttonNormalDisabledText,
    primary: theme_1.theme.buttonPrimaryText,
    primaryDisabled: theme_1.theme.buttonPrimaryDisabledText,
    bare: theme_1.theme.buttonBareText,
    bareDisabled: theme_1.theme.buttonBareDisabledText,
    menu: theme_1.theme.buttonMenuText,
    menuSelected: theme_1.theme.buttonMenuSelectedText,
};
const textColorHover = {
    normal: theme_1.theme.buttonNormalTextHover,
    primary: theme_1.theme.buttonPrimaryTextHover,
    bare: theme_1.theme.buttonBareTextHover,
    menu: theme_1.theme.buttonMenuTextHover,
    menuSelected: theme_1.theme.buttonMenuSelectedTextHover,
};
const _getBorder = (variant, variantWithDisabled) => {
    switch (variant) {
        case 'bare':
            return 'none';
        default:
            return '1px solid ' + borderColor[variantWithDisabled];
    }
};
const _getPadding = (variant) => {
    switch (variant) {
        case 'bare':
            return '5px';
        default:
            return '5px 10px';
    }
};
const _getHoveredStyles = (variant) => ({
    ...(variant !== 'bare' && styles_1.styles.shadow),
    backgroundColor: backgroundColorHover[variant],
    color: textColorHover[variant],
    cursor: 'pointer',
});
const _getActiveStyles = (variant, bounce) => {
    switch (variant) {
        case 'bare':
            return { backgroundColor: theme_1.theme.buttonBareBackgroundActive };
        default:
            return {
                transform: bounce ? 'translateY(1px)' : undefined,
                boxShadow: `0 1px 4px 0 ${variant === 'primary'
                    ? theme_1.theme.buttonPrimaryShadow
                    : theme_1.theme.buttonNormalShadow}`,
                transition: 'none',
            };
    }
};
exports.Button = (0, react_1.forwardRef)((props, ref) => {
    const { children, variant = 'normal', bounce = true, ...restProps } = props;
    const variantWithDisabled = props.isDisabled ? `${variant}Disabled` : variant;
    const defaultButtonClassName = (0, react_1.useMemo)(() => (0, css_1.css)({
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: _getPadding(variant),
        margin: 0,
        overflow: 'hidden',
        display: 'flex',
        borderRadius: 4,
        backgroundColor: backgroundColor[variantWithDisabled],
        border: _getBorder(variant, variantWithDisabled),
        color: textColor[variantWithDisabled],
        transition: 'box-shadow .25s',
        WebkitAppRegion: 'no-drag',
        ...styles_1.styles.smallText,
        '&[data-hovered]': _getHoveredStyles(variant),
        '&[data-pressed]': _getActiveStyles(variant, bounce),
    }), [bounce, variant, variantWithDisabled]);
    const className = restProps.className;
    return (<react_aria_components_1.Button ref={ref} {...restProps} className={typeof className === 'function'
            ? renderProps => (0, css_1.cx)(defaultButtonClassName, className(renderProps))
            : (0, css_1.cx)(defaultButtonClassName, className)}>
        {children}
      </react_aria_components_1.Button>);
});
exports.Button.displayName = 'Button';
exports.ButtonWithLoading = (0, react_1.forwardRef)((props, ref) => {
    const { isLoading, children, style, ...buttonProps } = props;
    return (<exports.Button {...buttonProps} ref={ref} style={buttonRenderProps => ({
            position: 'relative',
            ...(typeof style === 'function' ? style(buttonRenderProps) : style),
        })}>
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
