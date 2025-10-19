import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useCallback, useRef, useMemo, } from 'react';
import debounce from 'lodash/debounce';
const ScrollContext = createContext(undefined);
export function ScrollProvider({ scrollableRef, isDisabled, delayMs = 250, children, }) {
    const previousScrollX = useRef(undefined);
    const scrollX = useRef(undefined);
    const previousScrollY = useRef(undefined);
    const scrollY = useRef(undefined);
    const scrollWidth = useRef(undefined);
    const scrollHeight = useRef(undefined);
    const clientWidth = useRef(undefined);
    const clientHeight = useRef(undefined);
    const listeners = useRef([]);
    const hasScrolledToEnd = useCallback((direction, tolerance = 1) => {
        const isAtStart = (currentCoordinate) => currentCoordinate !== undefined && currentCoordinate <= tolerance;
        const isAtEnd = (totalSize, currentCoordinate, viewportSize) => totalSize !== undefined &&
            currentCoordinate !== undefined &&
            viewportSize !== undefined &&
            totalSize - currentCoordinate <= viewportSize + tolerance;
        switch (direction) {
            case 'up': {
                return isAtStart(scrollY.current);
            }
            case 'down': {
                return isAtEnd(scrollHeight.current, scrollY.current, clientHeight.current);
            }
            case 'left': {
                return isAtStart(scrollX.current);
            }
            case 'right': {
                return isAtEnd(scrollWidth.current, scrollX.current, clientWidth.current);
            }
            default:
                return false;
        }
    }, []);
    const isScrolling = useCallback((direction) => {
        switch (direction) {
            case 'up':
                return (previousScrollY.current !== undefined &&
                    scrollY.current !== undefined &&
                    previousScrollY.current > scrollY.current);
            case 'down':
                return (previousScrollY.current !== undefined &&
                    scrollY.current !== undefined &&
                    previousScrollY.current < scrollY.current);
            case 'left':
                return (previousScrollX.current !== undefined &&
                    scrollX.current !== undefined &&
                    previousScrollX.current > scrollX.current);
            case 'right':
                return (previousScrollX.current !== undefined &&
                    scrollX.current !== undefined &&
                    previousScrollX.current < scrollX.current);
            default:
                return false;
        }
    }, []);
    const listenToScroll = useMemo(() => debounce((e) => {
        const target = e.target;
        if (target instanceof Element) {
            previousScrollX.current = scrollX.current;
            scrollX.current = target.scrollLeft;
            scrollWidth.current = target.scrollWidth;
            clientWidth.current = target.clientWidth;
            previousScrollY.current = scrollY.current;
            scrollY.current = target.scrollTop;
            scrollHeight.current = target.scrollHeight;
            clientHeight.current = target.clientHeight;
            const currentScrollX = scrollX.current;
            const currentScrollY = scrollY.current;
            if (currentScrollX !== undefined && currentScrollY !== undefined) {
                listeners.current.forEach(listener => listener({
                    scrollX: currentScrollX,
                    scrollY: currentScrollY,
                    isScrolling,
                    hasScrolledToEnd,
                }));
            }
        }
    }, delayMs), [delayMs, hasScrolledToEnd, isScrolling]);
    useEffect(() => {
        const toCancel = listenToScroll;
        return () => toCancel.cancel();
    }, [listenToScroll]);
    useEffect(() => {
        if (isDisabled) {
            return;
        }
        const ref = scrollableRef.current;
        ref?.addEventListener('scroll', listenToScroll, {
            capture: true,
            passive: true,
        });
        return () => ref?.removeEventListener('scroll', listenToScroll, {
            capture: true,
        });
    }, [isDisabled, listenToScroll, scrollableRef]);
    const registerScrollListener = useCallback(listener => {
        listeners.current.push(listener);
        return () => {
            listeners.current = listeners.current.filter(l => l !== listener);
        };
    }, []);
    return (_jsx(ScrollContext.Provider, { value: { registerScrollListener }, children: children }));
}
/**
 * A hook to register a listener when the user scrolls within a ScrollProvider.
 *
 * @param listener The scroll listener to register. It is important to wrap this function
 * in useCallback to avoid unnecessary unregistering and reregistering on each render.
 */
export function useScrollListener(listener) {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScrollListener must be used within a ScrollProvider');
    }
    const { registerScrollListener } = context;
    useEffect(() => {
        return registerScrollListener(listener);
    }, [listener, registerScrollListener]);
}
