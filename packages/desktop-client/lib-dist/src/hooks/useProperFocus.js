import { jsx as _jsx } from "react/jsx-runtime";
// @ts-strict-ignore
import { createContext, useRef, useLayoutEffect, useContext, useMemo, } from 'react';
function getFocusedKey(el) {
    let node = el;
    // Search up to 10 parent nodes
    for (let i = 0; i < 10 && node; i++) {
        const key = 'dataset' in node ? node.dataset?.focusKey : undefined;
        if (key) {
            return key;
        }
        node = node.parentNode;
    }
    return null;
}
function focusElement(el, refocusContext) {
    if (refocusContext) {
        const key = getFocusedKey(el);
        el.focus({ preventScroll: key && key === refocusContext.keyRef.current });
        refocusContext.onKeyChange(key);
    }
    else {
        el.focus();
    }
    if (el instanceof HTMLInputElement) {
        el.setSelectionRange(0, 10000);
    }
}
const AvoidRefocusScrollContext = createContext(null);
export function AvoidRefocusScrollProvider({ children, }) {
    const keyRef = useRef(null);
    const value = useMemo(() => ({
        keyRef,
        onKeyChange: key => {
            keyRef.current = key;
        },
    }), [keyRef]);
    return (_jsx(AvoidRefocusScrollContext.Provider, { value: value, children: children }));
}
export function useProperFocus(ref, shouldFocus = false) {
    const context = useContext(AvoidRefocusScrollContext);
    const prevShouldFocus = useRef(null);
    useLayoutEffect(() => {
        const prev = prevShouldFocus.current;
        const view = ref.current;
        if (view && shouldFocus && (prev === null || prev === false)) {
            const selector = 'input,button,div[tabindex]';
            const focusEl = view.matches(selector)
                ? view
                : view.querySelector(selector);
            if (shouldFocus && focusEl) {
                focusElement(focusEl, context);
            }
        }
        prevShouldFocus.current = shouldFocus;
    }, [context, ref, shouldFocus]);
}
