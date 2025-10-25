// ESM shim for undo: makes both default and named exports available cleanly
import * as UndoNS from 'loot-core/platform/client/undo';

// Default export = namespace (so `import Undo from ...` works)
export default UndoNS;

// Re-export all named members (so `import { something } from ...` works)
export * from 'loot-core/platform/client/undo';
