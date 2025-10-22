"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInitialMount = useInitialMount;
var react_1 = require("react");
function useInitialMount() {
    var initial = (0, react_1.useRef)(true);
    if (initial.current) {
        initial.current = false;
        return true;
    }
    return false;
}
