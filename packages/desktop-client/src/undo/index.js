
import { send } from "loot-core/platform/client/fetch";

function throttle(callback, wait) {
    let waiting = false;
    return function () {
        if (!waiting) {
            callback();
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, wait);
        }
    };
}

const _undo = throttle(() => send("undo"), 100);
const _redo = throttle(() => send("redo"), 100);
let _undoEnabled = true;

export function enableUndo() {
    _undoEnabled = true;
}

export function disableUndo() {
    _undoEnabled = false;
}

export function undo() {
    if (_undoEnabled) {
        _undo();
    }
}

export function redo() {
    if (_undoEnabled) {
        _redo();
    }
}

const defaultExport = {
    enableUndo,
    disableUndo,
    undo,
    redo,
};
export default defaultExport;
