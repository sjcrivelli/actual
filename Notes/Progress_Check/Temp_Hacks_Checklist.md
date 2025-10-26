# Temp Hacks Checklist

## Classification & Proposals

### `/packages/desktop-client/src/sync-events.ts`
- Line 24: `// TODO: Should this run on mobile too?`
  - **formalize**: Add mobile sync tests, document platform logic, finalize conditional code.

### `/packages/desktop-client/src/queries/liveQuery.ts`
- Line 82: `// TODO: error types?`
  - **formalize**: Add error type definitions, test error handling.
- Line 187: `// TODO: precompile queries, or cache compilation results on the`
  - **formalize**: Add query cache logic, document, test cache behavior.

### `/packages/desktop-client/src/redux/store.ts`
- Line 89: `// TODO: Fix this in a separate PR. Remove non-serializable states in the store.`
  - **formalize**: Refactor store, add serialization tests.

### `/packages/desktop-client/src/budgetfiles/budgetfilesSlice.ts`
- Line 51: `// TODO: Is this still needed?`
  - **delete**: Remove if legacy after review.

### `/packages/loot-core/src/mocks/util.ts`
- Line 66: `// This is a workaround for the fact that initSqlJS uses fetch to load the wasm file`
  - **formalize**: Document workaround, add wasm load test, propose upstream fix.

### `/packages/loot-core/src/platform/server/fs/shared.ts`
- Line 21: `// TODO: This should be better`
  - **formalize**: Refactor, document, add tests.

### `/packages/loot-core/src/platform/server/indexeddb/index.ts`
- Line 40: `// TODO: Notify the user somehow`
  - **formalize**: Add notification logic, test triggers.

### `/packages/loot-core/src/server/update.ts`
- Line 17: `// Temporary local Message definition`
  - **formalize**: Move to shared types, add message tests.
- Line 113: `// TODO: Implement preference update logic using correct db API`
  - **formalize**: Implement with correct API, add update tests.

### `/packages/loot-core/src/platform/client/undo/index.ts`
- Line 1: `// This is temporary until we move all loot-core/client over to desktop-client.`
  - **formalize**: Track migration, add checklist.

### `/packages/loot-core/src/shared/transactions.ts`
- Multiple: temp transaction logic
  - **formalize**: Document, add temp ID tests.

### `/packages/loot-core/src/shared/schedules.ts`
- Line 386: `// this check is temporary, and required at the moment as a schedule rule`
  - **formalize**: Document, add schedule rule tests.

### `/packages/loot-core/src/shared/months.ts`
- Line 237: `// TODO: This doesn't really fit in this module anymore, should`
  - **formalize**: Refactor, move logic, add tests.

### `/packages/loot-core/src/server/sheet.ts`
- Line 181: `// TODO: Should wait for the sheet to finish`
  - **formalize**: Add async handling, test completion.

### `/packages/sync-server/src/app-gocardless/banks/danskebank_privat.js`
- Line 9: `// TODO: Add other Danske Bank BICs?`
  - **formalize**: Add BICs, document, test.

### `/packages/component-library/src/styles.ts`
- Line 100: `// TODO: This seems like trouble, but what's the right value?`
  - **formalize**: Research, document, add visual tests.

### `/packages/crdt/src/crdt/merkle.ts`
- Line 1: `// TODO: Ok, several problems:`
  - **formalize**: List problems, create issues, add tests.

---

## Checklist
- [ ] `/packages/desktop-client/src/sync-events.ts` (formalize)
- [ ] `/packages/desktop-client/src/queries/liveQuery.ts` (formalize)
- [ ] `/packages/desktop-client/src/redux/store.ts` (formalize)
- [ ] `/packages/desktop-client/src/budgetfiles/budgetfilesSlice.ts` (delete)
- [ ] `/packages/loot-core/src/mocks/util.ts` (formalize)
- [ ] `/packages/loot-core/src/platform/server/fs/shared.ts` (formalize)
- [ ] `/packages/loot-core/src/platform/server/indexeddb/index.ts` (formalize)
- [ ] `/packages/loot-core/src/server/update.ts` (formalize)
- [ ] `/packages/loot-core/src/platform/client/undo/index.ts` (formalize)
- [ ] `/packages/loot-core/src/shared/transactions.ts` (formalize)
- [ ] `/packages/loot-core/src/shared/schedules.ts` (formalize)
- [ ] `/packages/loot-core/src/shared/months.ts` (formalize)
- [ ] `/packages/loot-core/src/server/sheet.ts` (formalize)
- [ ] `/packages/sync-server/src/app-gocardless/banks/danskebank_privat.js` (formalize)
- [ ] `/packages/component-library/src/styles.ts` (formalize)
- [ ] `/packages/crdt/src/crdt/merkle.ts` (formalize)

---

**This checklist and proposals are saved as `Notes/Progress_Check/Temp_Hacks_Checklist.md`.**
