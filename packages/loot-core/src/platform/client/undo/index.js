import { v4 as uuidv4 } from 'uuid';
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
export const setUndoState = (name, value) => {
    currentUndoState[name] = value;
    currentUndoState.id = uuidv4();
};
export const getUndoState = (name) => {
    return currentUndoState[name];
};
export const getTaggedState = (id) => {
    return UNDO_STATE_MRU.find(state => state.id === id);
};
export const snapshot = () => {
    const tagged = { ...currentUndoState, id: uuidv4() };
    UNDO_STATE_MRU.unshift(tagged);
    UNDO_STATE_MRU = UNDO_STATE_MRU.slice(0, HISTORY_SIZE);
    return tagged.id;
};
export const gc = (id) => {
    UNDO_STATE_MRU = UNDO_STATE_MRU.filter(state => state.id !== id);
};
