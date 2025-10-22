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
exports.ModalButtons = exports.Modal = exports.MODAL_Z_INDEX = void 0;
exports.ModalHeader = ModalHeader;
exports.ModalTitle = ModalTitle;
exports.ModalCloseButton = ModalCloseButton;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var logo_1 = require("@actual-app/components/icons/logo");
var v0_1 = require("@actual-app/components/icons/v0");
var input_1 = require("@actual-app/components/input");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var auto_text_size_1 = require("auto-text-size");
var useModalState_1 = require("@desktop-client/hooks/useModalState");
exports.MODAL_Z_INDEX = 3000;
var Modal = function (_a) {
    var name = _a.name, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, _c = _a.noAnimation, noAnimation = _c === void 0 ? false : _c, style = _a.style, children = _a.children, onClose = _a.onClose, containerProps = _a.containerProps, props = __rest(_a, ["name", "isLoading", "noAnimation", "style", "children", "onClose", "containerProps"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var _d = (0, react_hotkeys_hook_1.useHotkeysContext)(), enableScope = _d.enableScope, disableScope = _d.disableScope;
    // This deactivates any key handlers in the "app" scope
    (0, react_1.useEffect)(function () {
        enableScope(name);
        return function () { return disableScope(name); };
    }, [enableScope, disableScope, name]);
    var _e = (0, useModalState_1.useModalState)(), isHidden = _e.isHidden, isActive = _e.isActive, closeModal = _e.onClose;
    var handleOnClose = function () {
        closeModal();
        onClose === null || onClose === void 0 ? void 0 : onClose();
    };
    return (<react_aria_components_1.ModalOverlay data-testid={"".concat(name, "-modal")} isDismissable defaultOpen={true} onOpenChange={function (isOpen) { return !isOpen && (handleOnClose === null || handleOnClose === void 0 ? void 0 : handleOnClose()); }} style={__assign(__assign({ position: 'fixed', inset: 0, zIndex: exports.MODAL_Z_INDEX, fontSize: 14, willChange: 'transform' }, (isNarrowWidth
            ? {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }
            : {
                backdropFilter: 'blur(1px) brightness(0.9)',
            })), style)} {...props}>
      {/* A container for positioning the modal relative to the visual viewport */}
      <view_1.View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'var(--visual-viewport-height)',
            overflowY: 'auto',
        }}>
        <react_aria_components_1.Modal>
          {function (modalProps) {
            var _a;
            return (<react_aria_components_1.Dialog aria-label={t('Modal dialog')} className={(0, css_1.css)(styles_1.styles.lightScrollbar)} style={{
                    outline: 'none', // remove focus outline
                }}>
              <ModalContentContainer noAnimation={noAnimation} isActive={isActive(name)} {...containerProps} style={__assign(__assign((_a = { flex: 1, padding: 10, willChange: 'opacity, transform', maxWidth: '90vw', minWidth: '90vw', maxHeight: 'calc(var(--visual-viewport-height) * 0.9)', minHeight: 0, borderRadius: 6, 
                        //border: '1px solid ' + theme.modalBorder,
                        color: theme_1.theme.pageText, backgroundColor: theme_1.theme.modalBackground, opacity: isHidden ? 0 : 1 }, _a["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
                    minWidth: tokens_1.tokens.breakpoint_small,
                }, _a.overflowY = 'auto', _a), styles_1.styles.shadowLarge), containerProps === null || containerProps === void 0 ? void 0 : containerProps.style)}>
                <view_1.View style={{ paddingTop: 0, flex: 1, flexShrink: 0 }}>
                  {typeof children === 'function'
                    ? children(modalProps)
                    : children}
                </view_1.View>
                {isLoading && (<view_1.View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme_1.theme.pageBackground,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}>
                    <AnimatedLoading_1.AnimatedLoading style={{ width: 20, height: 20 }} color={theme_1.theme.pageText}/>
                  </view_1.View>)}
              </ModalContentContainer>
            </react_aria_components_1.Dialog>);
        }}
        </react_aria_components_1.Modal>
      </view_1.View>
    </react_aria_components_1.ModalOverlay>);
};
exports.Modal = Modal;
var ModalContentContainer = function (_a) {
    var style = _a.style, noAnimation = _a.noAnimation, isActive = _a.isActive, children = _a.children;
    var contentRef = (0, react_1.useRef)(null);
    var mounted = (0, react_1.useRef)(false);
    var rotateFactor = (0, react_1.useRef)(Math.random() * 10 - 5);
    (0, react_1.useLayoutEffect)(function () {
        if (!contentRef.current) {
            return;
        }
        function setProps() {
            if (!contentRef.current) {
                return;
            }
            if (isActive) {
                contentRef.current.style.transform = 'none';
                contentRef.current.style.willChange = 'auto';
                contentRef.current.style.pointerEvents = 'auto';
            }
            else {
                contentRef.current.style.transform = "translateY(-40px) scale(.95) rotate(".concat(rotateFactor.current, "deg)");
                contentRef.current.style.pointerEvents = 'none';
            }
        }
        if (!mounted.current) {
            if (noAnimation) {
                contentRef.current.style.opacity = '1';
                contentRef.current.style.transform = 'translateY(0px) scale(1)';
                setTimeout(function () {
                    if (contentRef.current) {
                        contentRef.current.style.transition =
                            'opacity .1s, transform .1s cubic-bezier(.42, 0, .58, 1)';
                    }
                }, 0);
            }
            else {
                contentRef.current.style.opacity = '0';
                contentRef.current.style.transform = 'translateY(10px) scale(1)';
                setTimeout(function () {
                    if (contentRef.current) {
                        mounted.current = true;
                        contentRef.current.style.transition =
                            'opacity .1s, transform .1s cubic-bezier(.42, 0, .58, 1)';
                        contentRef.current.style.opacity = '1';
                        setProps();
                    }
                }, 0);
            }
        }
        else {
            setProps();
        }
    }, [noAnimation, isActive]);
    return (<view_1.View innerRef={contentRef} style={__assign(__assign({}, style), (noAnimation && !isActive && { display: 'none' }))}>
      {children}
    </view_1.View>);
};
var ModalButtons = function (_a) {
    var style = _a.style, leftContent = _a.leftContent, _b = _a.focusButton, focusButton = _b === void 0 ? false : _b, children = _a.children;
    var containerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (focusButton && containerRef.current) {
            var button = containerRef.current.querySelector('button:not([data-hidden])');
            if (button) {
                button.focus();
            }
        }
    }, [focusButton]);
    return (<view_1.View innerRef={containerRef} style={__assign({ flexDirection: 'row', marginTop: 30 }, style)}>
      {leftContent}
      <view_1.View style={{ flex: 1 }}/>
      {children}
    </view_1.View>);
};
exports.ModalButtons = ModalButtons;
function ModalHeader(_a) {
    var leftContent = _a.leftContent, showLogo = _a.showLogo, title = _a.title, rightContent = _a.rightContent;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View role="heading" style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: 60,
            flex: 'none',
        }}>
      <view_1.View style={{
            position: 'absolute',
            left: 0,
        }}>
        {leftContent}
      </view_1.View>

      {(title || showLogo) && (<view_1.View style={{
                textAlign: 'center',
                // We need to force a width for the text-overflow
                // ellipses to work because we are aligning center.
                width: 'calc(100% - 60px)',
            }}>
          {showLogo && (<logo_1.SvgLogo aria-label={t('Modal logo')} width={30} height={30} style={{ justifyContent: 'center', alignSelf: 'center' }}/>)}
          {title &&
                (typeof title === 'string' || typeof title === 'number' ? (<ModalTitle title={"".concat(title)}/>) : (title))}
        </view_1.View>)}

      {rightContent && (<view_1.View style={{
                position: 'absolute',
                right: 0,
            }}>
          {rightContent}
        </view_1.View>)}
    </view_1.View>);
}
function ModalTitle(_a) {
    var title = _a.title, isEditable = _a.isEditable, getStyle = _a.getStyle, onTitleUpdate = _a.onTitleUpdate, _b = _a.shrinkOnOverflow, shrinkOnOverflow = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(false), isEditing = _c[0], setIsEditing = _c[1];
    var onTitleClick = function () {
        if (isEditable) {
            setIsEditing(true);
        }
    };
    var _onTitleUpdate = function (newTitle) {
        if (newTitle !== title) {
            onTitleUpdate === null || onTitleUpdate === void 0 ? void 0 : onTitleUpdate(newTitle);
        }
        setIsEditing(false);
    };
    var inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (isEditing) {
            if (inputRef.current) {
                inputRef.current.scrollLeft = 0;
            }
        }
    }, [isEditing]);
    var style = getStyle === null || getStyle === void 0 ? void 0 : getStyle(isEditing);
    return isEditing ? (<input_1.Input ref={inputRef} style={__assign({ fontSize: 25, fontWeight: 700, textAlign: 'center' }, style)} defaultValue={title} onUpdate={_onTitleUpdate} onEnter={function (value, e) {
            e.preventDefault();
            _onTitleUpdate === null || _onTitleUpdate === void 0 ? void 0 : _onTitleUpdate(value);
        }}/>) : (<view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
      {shrinkOnOverflow ? (<auto_text_size_1.AutoTextSize as={text_1.Text} minFontSizePx={15} maxFontSizePx={25} onClick={onTitleClick} style={__assign(__assign({ fontSize: 25, fontWeight: 700, textAlign: 'center' }, (isEditable && styles_1.styles.underlinedText)), style)}>
          {title}
        </auto_text_size_1.AutoTextSize>) : (<text_one_line_1.TextOneLine onClick={onTitleClick} style={__assign(__assign({ fontSize: 25, fontWeight: 700, textAlign: 'center' }, (isEditable && styles_1.styles.underlinedText)), style)}>
          {title}
        </text_one_line_1.TextOneLine>)}
    </view_1.View>);
}
function ModalCloseButton(_a) {
    var onPress = _a.onPress, style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<button_1.Button variant="bare" onPress={onPress} style={{ padding: '10px 10px' }} aria-label={t('Close')}>
      <v0_1.SvgDelete width={10} style={style}/>
    </button_1.Button>);
}
