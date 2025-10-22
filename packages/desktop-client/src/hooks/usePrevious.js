"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrevious = usePrevious;
var react_1 = require("react");
function usePrevious(value) {
    var ref = (0, react_1.useRef)(undefined);
    (0, react_1.useEffect)(function () {
        ref.current = value;
    }, [value]);
    return ref.current;
}
