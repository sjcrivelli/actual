"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvoidRefocusScrollProvider = AvoidRefocusScrollProvider;
exports.useProperFocus = useProperFocus;
// @ts-strict-ignore
var react_1 = require("react");
function getFocusedKey(el) {
    var _a;
    var node = el;
    // Search up to 10 parent nodes
    for (var i = 0; i < 10 && node; i++) {
        var key = 'dataset' in node ? (_a = node.dataset) === null || _a === void 0 ? void 0 : _a.focusKey : undefined;
        if (key) {
            return key;
        }
        node = node.parentNode;
    }
    return null;
}
function focusElement(el, refocusContext) {
    if (refocusContext) {
        var key = getFocusedKey(el);
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
var AvoidRefocusScrollContext = (0, react_1.createContext)(null);
function AvoidRefocusScrollProvider(_a) {
    var children = _a.children;
    var keyRef = (0, react_1.useRef)(null);
    var value = (0, react_1.useMemo)(function () { return ({
        keyRef: keyRef,
        onKeyChange: function (key) {
            keyRef.current = key;
        },
    }); }, [keyRef]);
    return (<AvoidRefocusScrollContext.Provider value={value}>
      {children}
    </AvoidRefocusScrollContext.Provider>);
}
function useProperFocus(ref, shouldFocus) {
    if (shouldFocus === void 0) { shouldFocus = false; }
    var context = (0, react_1.useContext)(AvoidRefocusScrollContext);
    var prevShouldFocus = (0, react_1.useRef)(null);
    (0, react_1.useLayoutEffect)(function () {
        var prev = prevShouldFocus.current;
        var view = ref.current;
        if (view && shouldFocus && (prev === null || prev === false)) {
            var selector = 'input,button,div[tabindex]';
            var focusEl = view.matches(selector)
                ? view
                : view.querySelector(selector);
            if (shouldFocus && focusEl) {
                focusElement(focusEl, context);
            }
        }
        prevShouldFocus.current = shouldFocus;
    }, [context, ref, shouldFocus]);
}
