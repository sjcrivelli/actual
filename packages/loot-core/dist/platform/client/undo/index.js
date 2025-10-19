"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gc = exports.snapshot = exports.getTaggedState = exports.getUndoState = exports.setUndoState = void 0;
const uuid_1 = require("uuid");
// List of recently used states. We don't use a true MRU structure
// because our needs are simple and we also do some custom reordering.
const HISTORY_SIZE = 40;
let UNDO_STATE_MRU = [];
const currentUndoState = {
    url: null,
    openModal: null,
    selectedItems: null,
    undoEvent: null,
};
const setUndoState = (name, value) => {
    currentUndoState[name] = value;
    currentUndoState.id = (0, uuid_1.v4)();
};
exports.setUndoState = setUndoState;
const getUndoState = (name) => {
    return currentUndoState[name];
};
exports.getUndoState = getUndoState;
const getTaggedState = (id) => {
    return UNDO_STATE_MRU.find(state => state.id === id);
};
exports.getTaggedState = getTaggedState;
const snapshot = () => {
    const tagged = { ...currentUndoState, id: (0, uuid_1.v4)() };
    UNDO_STATE_MRU.unshift(tagged);
    UNDO_STATE_MRU = UNDO_STATE_MRU.slice(0, HISTORY_SIZE);
    return tagged.id;
};
exports.snapshot = snapshot;
const gc = (id) => {
    UNDO_STATE_MRU = UNDO_STATE_MRU.filter(state => state.id !== id);
};
exports.gc = gc;
