import * as UndoNS from "./esm-shim.js";

// Use whichever shape exists (named, default object, or CJS namespace)
const base = (UndoNS && Object.keys(UndoNS).length ? UndoNS : null) ?? (UndoNS.default ?? {});

// Expose common undo API as named exports if present
export const undo = UndoNS.undo ?? base.undo;
export const redo = UndoNS.redo ?? base.redo;
export const canUndo = UndoNS.canUndo ?? base.canUndo;
export const canRedo = UndoNS.canRedo ?? base.canRedo;
export const clearUndo = UndoNS.clearUndo ?? base.clearUndo;

// Also keep a default for flexibility
export default UndoNS.default ?? UndoNS;
