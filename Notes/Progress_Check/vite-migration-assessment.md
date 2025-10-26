# Vite/Build System — Final Assessment & Migration Plan

## Executive Summary
Your desktop-client has two Vite configs (`vite.config.mts` and `vite.config.mjs`), broad JSX parsing applied to all `.js` files, partial process/global shims, and compiled CommonJS-style artifacts under `src/`. These combine to cause mis-parsing, env mismatches between dev/build, and “exports is not defined”-type runtime errors. The fix is a focused Vite config, consistent shimming (or migration to `import.meta.env`), and removing/ignoring compiled JS duplicates in `src/`.

---

## Findings
1. **Duplicate configs**: Both `vite.config.mts` and `vite.config.mjs` exist. Vite prefers `.mts`, so changes to `.mjs` can be ignored.
2. **Global JSX-in-.js**: Esbuild is configured to treat `src/**/*.js` as JSX/TSX which breaks plain JS/CJS modules and some test utilities.
3. **Process/Global shims**: `process.env` shim only applies on build and only to `*.js/*.jsx`, not `*.ts/*.tsx`. This creates dev/prod divergence and TS gaps.
4. **Compiled artifacts in `src/`**: Many `src/components/**.js` files export CJS symbols (`exports.*`). These appear to be compiled duplicates alongside TS/TSX sources, leading to ambiguous module resolution and CJS/ESM clashes.
5. **Unused plugin file**: `packages/desktop-client/plugins/jsx-js.js` exists but isn’t wired into Vite’s plugin array.
6. **Watchers**: `addWatchers()` for `loot-core` looks fine and is worth keeping.

---

## Risks & Constraints
- Removing compiled `.js` duplicates from `src/` needs care to avoid deleting hand-authored JS. We’ll use a targeted approach (keep `.jsx`/`.tsx` as sources of truth, and only remove `.js` where a sibling TSX/JSX exists).
- Migrating away from `process.env` towards `import.meta.env` should be incremental; shims can remain temporarily for safety.

---

## Ordered Plan of Attack (Do these in sequence)

### Phase 1 — Configuration sanity
1. **Unify on a single Vite config**: Keep `vite.config.mts`, delete `vite.config.mjs`.
2. **Adopt a focused Vite config**: Remove global `.js` JSX loader; keep JSX in `.jsx/.tsx`. Apply shims consistently (dev+build) and include TS/TSX where needed.
3. **Remove unused plugin file**: Delete `plugins/jsx-js.js` if not referenced.

### Phase 2 — Source hygiene
4. **Block compiled output in `src/`**: Add ignore rules and stop any tool from emitting build artifacts to `src/`.
5. **Prune compiled duplicates safely**: Remove `src/**/*.js` **only** when a sibling `.tsx`/`.jsx` exists and the `.js` looks compiled (has `exports.*` or `Object.defineProperty(exports, ...)`).

### Phase 3 — Env & shim cleanup (incremental)
6. **Standardize env access**: Prefer `import.meta.env` in app code. Keep `process.env` shim for transition.
7. **Replace `global` with `globalThis`** where possible.

### Phase 4 — Verification
8. **Smoke test**: `vite dev` + basic navigation flows.
9. **Build test**: `vite build` and run preview; verify PWA registration (if enabled) and graphs/pages load.
10. **CI update**: Ensure CI runs the unified config and tests.

---

## Batch Updates (scriptable)
- **Delete duplicate config**: `git rm packages/desktop-client/vite.config.mjs`
- **Remove unused plugin**: `git rm packages/desktop-client/plugins/jsx-js.js`
- **Prevent re-introducing compiled JS** (add to `.gitignore` inside `packages/desktop-client/`):
  ```
  # Block compiled JS duplicates in src
  /src/**/*.js.map
  # Allow hand-authored .js by default; the pruning step is selective
  ```
- **Selective prune compiled JS** (dry-run first):
  ```bash
  # List likely-compiled JS with CJS exports and a sibling TSX/JSX
  rg -n "exports\.|Object\.defineProperty\(exports" packages/desktop-client/src \    | cut -d: -f1 \    | while read -r js; do
        base="${js%.js}"
        if [ -f "$base.tsx" ] || [ -f "$base.jsx" ] || [ -f "$base.ts" ]; then
          echo "$js"
        fi
      done
  # After review, remove them:
  # ... same loop replacing echo with `git rm "$js"`
  ```

---

## Deliverables
- Single, corrected `vite.config.mts`.
- Deleted duplicates/unused plugin.
- Optional shims maintained for transition.
- Scripts/commands for batch cleanup.
- Step-by-step fixes provided in chat for clarity.

---

## Appendix — Reference `vite.config.mts` (finalized)
Use the version I’ll provide in chat during **Fix 1**.