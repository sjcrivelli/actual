"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsInViewport = useIsInViewport;
var react_1 = require("react");
/**
 * Check if the given element (by ref) is visible in the viewport.
 */
function useIsInViewport(ref) {
    var _a = (0, react_1.useState)(false), isIntersecting = _a[0], setIsIntersecting = _a[1];
    var observer = (0, react_1.useMemo)(function () {
        return new IntersectionObserver(function (_a) {
            var entry = _a[0];
            return setIsIntersecting(entry.isIntersecting);
        });
    }, []);
    (0, react_1.useEffect)(function () {
        var view = ref.current;
        if (!view) {
            return;
        }
        observer.observe(view);
        return function () {
            observer.disconnect();
        };
    }, [ref, observer]);
    return isIntersecting;
}
