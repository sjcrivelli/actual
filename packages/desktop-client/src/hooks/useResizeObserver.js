"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResizeObserver = useResizeObserver;
var react_1 = require("react");
function useResizeObserver(func) {
    var observer = (0, react_1.useRef)(undefined);
    if (!observer.current) {
        observer.current = new ResizeObserver(function (entries) {
            func(entries[0].contentRect);
        });
    }
    var elementRef = (0, react_1.useCallback)(function (el) {
        var _a, _b;
        (_a = observer.current) === null || _a === void 0 ? void 0 : _a.disconnect();
        if (el) {
            (_b = observer.current) === null || _b === void 0 ? void 0 : _b.observe(el, { box: 'border-box' });
        }
    }, []);
    return elementRef;
}
