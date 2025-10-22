"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gc = exports.snapshot = exports.getTaggedState = exports.getUndoState = exports.setUndoState = void 0;
var uuid_1 = require("uuid");
// List of recently used states. We don't use a true MRU structure
// because our needs are simple and we also do some custom reordering.
var HISTORY_SIZE = 40;
var UNDO_STATE_MRU = [];
var currentUndoState = {
    url: null,
    openModal: null,
    selectedItems: null,
    undoEvent: null,
};
var setUndoState = function (name, value) {
    currentUndoState[name] = value;
    currentUndoState.id = (0, uuid_1.v4)();
};
exports.setUndoState = setUndoState;
var getUndoState = function (name) {
    return currentUndoState[name];
};
exports.getUndoState = getUndoState;
var getTaggedState = function (id) {
    return UNDO_STATE_MRU.find(function (state) { return state.id === id; });
};
exports.getTaggedState = getTaggedState;
var snapshot = function () {
    var tagged = __assign(__assign({}, currentUndoState), { id: (0, uuid_1.v4)() });
    UNDO_STATE_MRU.unshift(tagged);
    UNDO_STATE_MRU = UNDO_STATE_MRU.slice(0, HISTORY_SIZE);
    return tagged.id;
};
exports.snapshot = snapshot;
var gc = function (id) {
    UNDO_STATE_MRU = UNDO_STATE_MRU.filter(function (state) { return state.id !== id; });
};
exports.gc = gc;
