# Dead Code & Unused Exports Audit

**Date:** 2025-10-26

---

## Unused Files (Safe to Delete)

### 1. `packages/loot-core/src/types/models/simplefin.js`
- Empty export (`export {};`)
- **Proposal:** Delete file (no imports, no dynamic usage)

### 2. `packages/loot-core/src/types/handlers.js`
- Empty export (`export {};`)
- **Proposal:** Delete file (no imports, no dynamic usage)

### 3. `packages/loot-core/src/types/budget.js`
- Empty export (`export {};`)
- **Proposal:** Delete file (no imports, no dynamic usage)

### 4. `packages/loot-core/src/types/util.js`
- Empty export (`export {};`)
- **Proposal:** Delete file (no imports, no dynamic usage)

### 5. `packages/loot-core/src/types/file.js`
- Empty export (`export {};`)
- **Proposal:** Delete file (no imports, no dynamic usage)

### 6. `packages/loot-core/src/types/api-handlers.js`
- Empty export (`export {};`)
- **Proposal:** Delete file (no imports, no dynamic usage)

---

## Unused Exports
- No unused exports with zero references found in main code.
- No dynamic imports (`import()`, `require()`, `await import()`) reference the above files.

---

## Diffs for Deletion
For each file above, propose:
```diff
*** Delete File: [file_path]
[entire file deleted]
```

---

## Confirmation
- All proposed deletions are safe: no static or dynamic imports reference these files.
- No runtime code paths depend on these files.

---

**This audit and proposals are saved as `Notes/Progress_Check/Dead_Code_Unused_Exports.md`.**
