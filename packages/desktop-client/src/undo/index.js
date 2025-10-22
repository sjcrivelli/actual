"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableUndo = enableUndo;
exports.disableUndo = disableUndo;
exports.undo = undo;
exports.redo = redo;
var fetch_1 = require("loot-core/platform/client/fetch");
function throttle(callback, wait) {
    var waiting = false;
    return function () {
        if (!waiting) {
            callback();
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, wait);
        }
    };
}
var _undo = throttle(function () { return (0, fetch_1.send)('undo'); }, 100);
var _redo = throttle(function () { return (0, fetch_1.send)('redo'); }, 100);
var _undoEnabled = true;
function enableUndo() {
    _undoEnabled = true;
}
function disableUndo() {
    _undoEnabled = false;
}
function undo() {
    if (_undoEnabled) {
        _undo();
    }
}
function redo() {
    if (_undoEnabled) {
        _redo();
    }
}
