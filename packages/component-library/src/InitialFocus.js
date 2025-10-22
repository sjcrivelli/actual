"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialFocus = InitialFocus;
var react_1 = require("react");
/**
 * InitialFocus sets focus on its child element
 * when it mounts.
 * @param {Object} props - The component props.
 * @param {ReactElement | function} props.children - A single React element or a function that returns a React element.
 */
function InitialFocus(_a) {
    var children = _a.children;
    var ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (ref.current) {
            // This is needed to avoid a strange interaction with
            // `ScopeTab`, which doesn't allow it to be focused at first for
            // some reason. Need to look into it.
            setTimeout(function () {
                if (ref.current) {
                    ref.current.focus();
                    if (ref.current instanceof HTMLInputElement ||
                        ref.current instanceof HTMLTextAreaElement) {
                        ref.current.setSelectionRange(0, 10000);
                    }
                }
            }, 0);
        }
    }, []);
    if (typeof children === 'function') {
        return children(ref);
    }
    var child = react_1.Children.only(children);
    if ((0, react_1.isValidElement)(child)) {
        return (0, react_1.cloneElement)(child, { ref: ref });
    }
    throw new Error('InitialFocus expects a single valid React element as its child.');
}
