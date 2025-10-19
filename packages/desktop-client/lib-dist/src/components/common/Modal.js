import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useLayoutEffect, useState, } from 'react';
import { ModalOverlay as ReactAriaModalOverlay, Modal as ReactAriaModal, Dialog, } from 'react-aria-components';
import { useHotkeysContext } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgLogo } from '@actual-app/components/icons/logo';
import { SvgDelete } from '@actual-app/components/icons/v0';
import { Input } from '@actual-app/components/input';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { theme } from '@actual-app/components/theme';
import { tokens } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { AutoTextSize } from 'auto-text-size';
import { useModalState } from '@desktop-client/hooks/useModalState';
export const MODAL_Z_INDEX = 3000;
export const Modal = ({ name, isLoading = false, noAnimation = false, style, children, onClose, containerProps, ...props }) => {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const { enableScope, disableScope } = useHotkeysContext();
    // This deactivates any key handlers in the "app" scope
    useEffect(() => {
        enableScope(name);
        return () => disableScope(name);
    }, [enableScope, disableScope, name]);
    const { isHidden, isActive, onClose: closeModal } = useModalState();
    const handleOnClose = () => {
        closeModal();
        onClose?.();
    };
    return (_jsx(ReactAriaModalOverlay, { "data-testid": `${name}-modal`, isDismissable: true, defaultOpen: true, onOpenChange: isOpen => !isOpen && handleOnClose?.(), style: {
            position: 'fixed',
            inset: 0,
            zIndex: MODAL_Z_INDEX,
            fontSize: 14,
            willChange: 'transform',
            // on mobile, we disable the blurred background for performance reasons
            ...(isNarrowWidth
                ? {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }
                : {
                    backdropFilter: 'blur(1px) brightness(0.9)',
                }),
            ...style,
        }, ...props, children: _jsx(View, { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'var(--visual-viewport-height)',
                overflowY: 'auto',
            }, children: _jsx(ReactAriaModal, { children: modalProps => (_jsx(Dialog, { "aria-label": t('Modal dialog'), className: css(styles.lightScrollbar), style: {
                        outline: 'none', // remove focus outline
                    }, children: _jsxs(ModalContentContainer, { noAnimation: noAnimation, isActive: isActive(name), ...containerProps, style: {
                            flex: 1,
                            padding: 10,
                            willChange: 'opacity, transform',
                            maxWidth: '90vw',
                            minWidth: '90vw',
                            maxHeight: 'calc(var(--visual-viewport-height) * 0.9)',
                            minHeight: 0,
                            borderRadius: 6,
                            //border: '1px solid ' + theme.modalBorder,
                            color: theme.pageText,
                            backgroundColor: theme.modalBackground,
                            opacity: isHidden ? 0 : 1,
                            [`@media (min-width: ${tokens.breakpoint_small})`]: {
                                minWidth: tokens.breakpoint_small,
                            },
                            overflowY: 'auto',
                            ...styles.shadowLarge,
                            ...containerProps?.style,
                        }, children: [_jsx(View, { style: { paddingTop: 0, flex: 1, flexShrink: 0 }, children: typeof children === 'function'
                                    ? children(modalProps)
                                    : children }), isLoading && (_jsx(View, { style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: theme.pageBackground,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1000,
                                }, children: _jsx(AnimatedLoading, { style: { width: 20, height: 20 }, color: theme.pageText }) }))] }) })) }) }) }));
};
const ModalContentContainer = ({ style, noAnimation, isActive, children, }) => {
    const contentRef = useRef(null);
    const mounted = useRef(false);
    const rotateFactor = useRef(Math.random() * 10 - 5);
    useLayoutEffect(() => {
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
                contentRef.current.style.transform = `translateY(-40px) scale(.95) rotate(${rotateFactor.current}deg)`;
                contentRef.current.style.pointerEvents = 'none';
            }
        }
        if (!mounted.current) {
            if (noAnimation) {
                contentRef.current.style.opacity = '1';
                contentRef.current.style.transform = 'translateY(0px) scale(1)';
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.style.transition =
                            'opacity .1s, transform .1s cubic-bezier(.42, 0, .58, 1)';
                    }
                }, 0);
            }
            else {
                contentRef.current.style.opacity = '0';
                contentRef.current.style.transform = 'translateY(10px) scale(1)';
                setTimeout(() => {
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
    return (_jsx(View, { innerRef: contentRef, style: {
            ...style,
            ...(noAnimation && !isActive && { display: 'none' }),
        }, children: children }));
};
export const ModalButtons = ({ style, leftContent, focusButton = false, children, }) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (focusButton && containerRef.current) {
            const button = containerRef.current.querySelector('button:not([data-hidden])');
            if (button) {
                button.focus();
            }
        }
    }, [focusButton]);
    return (_jsxs(View, { innerRef: containerRef, style: {
            flexDirection: 'row',
            marginTop: 30,
            ...style,
        }, children: [leftContent, _jsx(View, { style: { flex: 1 } }), children] }));
};
export function ModalHeader({ leftContent, showLogo, title, rightContent, }) {
    const { t } = useTranslation();
    return (_jsxs(View, { role: "heading", style: {
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: 60,
            flex: 'none',
        }, children: [_jsx(View, { style: {
                    position: 'absolute',
                    left: 0,
                }, children: leftContent }), (title || showLogo) && (_jsxs(View, { style: {
                    textAlign: 'center',
                    // We need to force a width for the text-overflow
                    // ellipses to work because we are aligning center.
                    width: 'calc(100% - 60px)',
                }, children: [showLogo && (_jsx(SvgLogo, { "aria-label": t('Modal logo'), width: 30, height: 30, style: { justifyContent: 'center', alignSelf: 'center' } })), title &&
                        (typeof title === 'string' || typeof title === 'number' ? (_jsx(ModalTitle, { title: `${title}` })) : (title))] })), rightContent && (_jsx(View, { style: {
                    position: 'absolute',
                    right: 0,
                }, children: rightContent }))] }));
}
export function ModalTitle({ title, isEditable, getStyle, onTitleUpdate, shrinkOnOverflow = false, }) {
    const [isEditing, setIsEditing] = useState(false);
    const onTitleClick = () => {
        if (isEditable) {
            setIsEditing(true);
        }
    };
    const _onTitleUpdate = (newTitle) => {
        if (newTitle !== title) {
            onTitleUpdate?.(newTitle);
        }
        setIsEditing(false);
    };
    const inputRef = useRef(null);
    useEffect(() => {
        if (isEditing) {
            if (inputRef.current) {
                inputRef.current.scrollLeft = 0;
            }
        }
    }, [isEditing]);
    const style = getStyle?.(isEditing);
    return isEditing ? (_jsx(Input, { ref: inputRef, style: {
            fontSize: 25,
            fontWeight: 700,
            textAlign: 'center',
            ...style,
        }, defaultValue: title, onUpdate: _onTitleUpdate, onEnter: (value, e) => {
            e.preventDefault();
            _onTitleUpdate?.(value);
        } })) : (_jsx(View, { style: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }, children: shrinkOnOverflow ? (_jsx(AutoTextSize, { as: Text, minFontSizePx: 15, maxFontSizePx: 25, onClick: onTitleClick, style: {
                fontSize: 25,
                fontWeight: 700,
                textAlign: 'center',
                ...(isEditable && styles.underlinedText),
                ...style,
            }, children: title })) : (_jsx(TextOneLine, { onClick: onTitleClick, style: {
                fontSize: 25,
                fontWeight: 700,
                textAlign: 'center',
                ...(isEditable && styles.underlinedText),
                ...style,
            }, children: title })) }));
}
export function ModalCloseButton({ onPress, style }) {
    const { t } = useTranslation();
    return (_jsx(Button, { variant: "bare", onPress: onPress, style: { padding: '10px 10px' }, "aria-label": t('Close'), children: _jsx(SvgDelete, { width: 10, style: style }) }));
}
