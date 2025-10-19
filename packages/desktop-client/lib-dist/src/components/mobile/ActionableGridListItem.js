import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { GridListItem } from 'react-aria-components';
import { useSpring, animated, config } from 'react-spring';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { useDrag } from '@use-gesture/react';
export function ActionableGridListItem({ value, textValue, actions, actionsBackgroundColor = theme.errorBackground, actionsWidth = 100, children, onAction, ...props }) {
    const dragStartedRef = useRef(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const hasActions = !!actions;
    // Spring animation for the swipe
    const [{ x }, api] = useSpring(() => ({
        x: 0,
        config: config.stiff,
    }));
    // Handle drag gestures
    const bind = useDrag(({ active, movement: [mx], velocity: [vx] }) => {
        const startPos = isRevealed ? -actionsWidth : 0;
        const currentX = startPos + mx;
        if (active) {
            dragStartedRef.current = true;
            api.start({
                x: Math.max(-actionsWidth, Math.min(0, currentX)),
                onRest: () => {
                    dragStartedRef.current = false;
                },
            });
            return;
        }
        // Snap to revealed (-actionsWidth) or closed (0) based on position and velocity
        const shouldReveal = currentX < -actionsWidth / 2 ||
            (vx < -0.5 && currentX < -actionsWidth / 5);
        api.start({
            x: shouldReveal ? -actionsWidth : 0,
            onRest: () => {
                dragStartedRef.current = false;
                setIsRevealed(shouldReveal);
            },
        });
    }, {
        axis: 'x',
        from: () => [isRevealed ? -actionsWidth : 0, 0],
        enabled: hasActions,
    });
    // Prevent onAction from firing when dragging or if a drag was started
    const handleAction = () => {
        // Only allow action if no drag was started
        if (!dragStartedRef.current) {
            onAction?.();
        }
    };
    return (_jsx(GridListItem, { ...props, value: value, textValue: textValue, style: {
            ...styles.mobileListItem,
            padding: 0,
            backgroundColor: hasActions
                ? actionsBackgroundColor
                : (styles.mobileListItem.backgroundColor ?? 'transparent'),
            overflow: 'hidden',
        }, children: _jsxs(animated.div, { ...(hasActions ? bind() : {}), style: {
                ...(hasActions
                    ? { transform: x.to(v => `translate3d(${v}px,0,0)`) }
                    : {}),
                display: 'flex',
                touchAction: hasActions ? 'pan-y' : 'auto',
                cursor: hasActions ? 'grab' : 'pointer',
            }, children: [_jsx("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        backgroundColor: theme.tableBackground,
                        minWidth: '100%',
                        padding: 16,
                    }, onClick: handleAction, children: children }), hasActions && (_jsx("div", { style: {
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: actionsBackgroundColor,
                        minWidth: actionsWidth,
                    }, children: actions }))] }) }));
}
