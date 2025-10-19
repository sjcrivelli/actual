import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, useEffect, useMemo, } from 'react';
import { useTranslation } from 'react-i18next';
import { animated, useSpring } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgDelete } from '@actual-app/components/icons/v0';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { Link } from './common/Link';
import { MODAL_Z_INDEX } from './common/Modal';
import { removeNotification, } from '@desktop-client/notifications/notificationsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
function compileMessage(message, actions, setLoading, onRemove) {
    return (_jsx(Stack, { spacing: 2, children: message.split(/\n\n/).map((paragraph, idx) => {
            const parts = paragraph.split(/(\[[^\]]*\]\([^)]*\))/g);
            return (_jsx(Text, { style: { lineHeight: '1.4em' }, children: parts.map((part, idx) => {
                    const match = part.match(/\[([^\]]*)\]\(([^)]*)\)/);
                    if (match) {
                        const [_, text, href] = match;
                        if (href[0] === '#') {
                            const actionName = href.slice(1);
                            return (_jsx(Link, { variant: "text", onClick: async (e) => {
                                    e.preventDefault();
                                    if (actions[actionName]) {
                                        setLoading(true);
                                        await actions[actionName]();
                                        onRemove();
                                    }
                                }, children: text }, idx));
                        }
                        return (_jsx(Link, { variant: "external", linkColor: "purple", to: match[2], children: match[1] }, idx));
                    }
                    return _jsx(Text, { children: part }, idx);
                }) }, idx));
        }) }));
}
function Notification({ notification, onRemove, }) {
    const { t } = useTranslation();
    const { type, title, message, pre, messageActions, sticky, internal, button, timeout, } = notification;
    const [loading, setLoading] = useState(false);
    const [overlayLoading, setOverlayLoading] = useState(false);
    useEffect(() => {
        if (type === 'error' && internal) {
            console.error('Internal error:', internal);
        }
        if (!sticky) {
            setTimeout(onRemove, timeout || 6500);
        }
    }, []);
    const positive = type === 'message';
    const error = type === 'error';
    const processedMessage = useMemo(() => compileMessage(message, messageActions, setOverlayLoading, onRemove), [message, messageActions]);
    const { isNarrowWidth } = useResponsive();
    const narrowStyle = isNarrowWidth
        ? { minHeight: styles.mobileMinHeight }
        : {};
    const [isSwiped, setIsSwiped] = useState(false);
    const [spring, api] = useSpring(() => ({ x: 0, opacity: 1 }));
    const swipeHandlers = useSwipeable({
        onSwiping: ({ deltaX }) => {
            if (!isSwiped) {
                api.start({ x: deltaX });
            }
        },
        onSwiped: ({ velocity, deltaX }) => {
            // Distance to trigger deletion
            const threshold = 100;
            const direction = deltaX > 0 ? 1 : -1;
            if (Math.abs(deltaX) > threshold || velocity > 0.5) {
                // Animate out & remove item after animation
                api.start({
                    x: direction * 1000,
                    opacity: 0,
                    onRest: onRemove,
                });
                setIsSwiped(true);
            }
            else {
                // Reset position if not swiped far enough
                api.start({ x: 0 });
            }
        },
        trackMouse: true,
    });
    return (_jsxs(animated.div, { role: "alert", style: {
            ...spring,
            marginTop: 10,
            color: positive
                ? theme.noticeText
                : error
                    ? theme.errorTextDark
                    : theme.warningTextDark,
            // Prevents scrolling conflicts
            touchAction: 'none',
        }, ...swipeHandlers, children: [_jsxs(Stack, { align: "center", justify: "space-between", direction: "row", style: {
                    padding: '14px 14px',
                    ...styles.mediumText,
                    backgroundColor: positive
                        ? theme.noticeBackgroundLight
                        : error
                            ? theme.errorBackground
                            : theme.warningBackground,
                    borderTop: `3px solid ${positive
                        ? theme.noticeBorder
                        : error
                            ? theme.errorBorder
                            : theme.warningBorder}`,
                    ...styles.shadowLarge,
                    maxWidth: 550,
                    '& a': { color: 'currentColor' },
                }, children: [_jsxs(Stack, { align: "flex-start", children: [title && (_jsx(View, { style: {
                                    ...styles.mediumText,
                                    fontWeight: 700,
                                    marginBottom: 10,
                                }, children: title })), _jsx(View, { children: processedMessage }), pre
                                ? pre.split('\n\n').map((text, idx) => (_jsx(View, { style: {
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'monospace',
                                        fontSize: 12,
                                        backgroundColor: 'rgba(0, 0, 0, .05)',
                                        padding: 10,
                                        borderRadius: 4,
                                    }, children: text }, idx)))
                                : null, button && (_jsx(ButtonWithLoading, { variant: "bare", isLoading: loading, onPress: async () => {
                                    setLoading(true);
                                    await button.action();
                                    onRemove();
                                    setLoading(false);
                                }, className: css({
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${positive
                                        ? theme.noticeBorder
                                        : error
                                            ? theme.errorBorder
                                            : theme.warningBorder}`,
                                    color: 'currentColor',
                                    ...styles.mediumText,
                                    flexShrink: 0,
                                    '&[data-hovered], &[data-pressed]': {
                                        backgroundColor: positive
                                            ? theme.noticeBackground
                                            : error
                                                ? theme.errorBackground
                                                : theme.warningBackground,
                                    },
                                    ...narrowStyle,
                                }), children: button.title }))] }), _jsx(Button, { variant: "bare", "aria-label": t('Close'), style: { padding: 10, color: 'currentColor' }, onPress: onRemove, children: _jsx(SvgDelete, { style: { width: 10, height: 10 } }) })] }), overlayLoading && (_jsx(View, { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.tableBackground,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, children: _jsx(AnimatedLoading, { style: { width: 20, height: 20, color: 'currentColor' } }) }))] }));
}
export function Notifications({ style }) {
    const dispatch = useDispatch();
    const { isNarrowWidth } = useResponsive();
    const notifications = useSelector(state => state.notifications.notifications);
    const notificationInset = useSelector(state => state.notifications.inset);
    return (_jsx(View, { style: {
            position: 'fixed',
            bottom: notificationInset?.bottom || 20,
            top: notificationInset?.top,
            right: notificationInset?.right || 13,
            left: notificationInset?.left || (isNarrowWidth ? 13 : undefined),
            zIndex: MODAL_Z_INDEX - 1,
            ...style,
        }, children: notifications.map(note => (_jsx(Notification, { notification: note, onRemove: () => {
                if (note.onClose) {
                    note.onClose();
                }
                dispatch(removeNotification({ id: note.id }));
            } }, note.id))) }));
}
