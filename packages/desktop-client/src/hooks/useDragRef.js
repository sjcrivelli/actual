"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDragRef = useDragRef;
var react_1 = require("react");
/**
 * Returns a callback ref that calls `drag(element)` when the DOM node is attached.
 * @see https://github.com/react-dnd/react-dnd/issues/3655#issuecomment-2578808024
 */
function useDragRef(drag) {
    return (0, react_1.useCallback)(function (element) {
        if (element) {
            drag(element);
        }
    }, [drag]);
}
