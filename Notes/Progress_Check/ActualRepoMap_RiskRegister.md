# Actual Monorepo Workspace Map & Risk Register

## Workspace Overview

| Workspace         | Build Script(s)         | Lint/Typecheck Script(s) | Entry Point(s)         | External Deps (Key)         | Risks/Flags |
|-------------------|------------------------|--------------------------|------------------------|-----------------------------|-------------|
| desktop-client (`@actual-app/web`) | `vite build`, `cross-env ./bin/build-browser` | `vitest`, `i18next` | `src/index.ts` | `react@19.2.0`, `vite@7.1.12`, many | **skipLibCheck: true**<br>**Imports loot-core/src via tsconfig paths** |
| loot-core         | `build:browser`, `build:node`, `build:api` | `vitest`, `i18next` | `index.js` | `@reduxjs/toolkit`, `vite@7.1.9`, `uuid`, etc. | **allowJs: true, skipLibCheck: true**<br>**Exports src/ directly** |
| sync-server (`@actual-app/sync-server`) | `tsc && yarn copy-static-assets` | `vitest` | `build/app.js` | `express@5.1.0`, `vite`, etc. | **allowJs: true, skipLibCheck: true** |
| component-library (`@actual-app/components`) | (unreadable) | (unreadable) | (unreadable) | `react@18.3.1`, `react-aria-components`, etc. | **React version mismatch**<br>(peer: >=18.2, dev: 18.3.1, repo: 19.2.0) |
| api (`@actual-app/api`) | `tsc --p tsconfig.dist.json` | `vitest` | `dist/index.js` | `node-fetch`, `uuid`, etc. | **skipLibCheck: true** |
| plugins-service   | `./bin/build-service-worker` | (none) | `plugin-sw.js` | `workbox-precaching`, `vite@7.1.9` | **skipLibCheck: true** |
| crdt (`@actual-app/crdt`) | `tsc --p tsconfig.dist.json` | `vitest` | `dist/index.js` | `google-protobuf`, `uuid` | **skipLibCheck: true** |
| desktop-electron  | `tsc --p tsconfig.dist.json` | (none) | `build/desktop-electron/index.js` | `electron@38.3.0`, `better-sqlite3` | None |
| eslint-plugin-actual | (none) | `vitest` | `lib/index.js` | `requireindex` | None |
| types             | (unreadable) | (unreadable) | (unreadable) | (unreadable) | (unreadable) |

---

## Risks & Issues (Prioritized)

### 1. React Version Mismatch
- `desktop-client` uses `react@19.2.0`
- `component-library` peer/dev uses `react@18.3.1`
- **Risk:** Component bugs, hooks incompatibility, runtime errors.

### 2. TypeScript skipLibCheck/allowJs
- `skipLibCheck: true` in most workspaces (masks type errors in dependencies).
- `allowJs: true` in `loot-core` and `sync-server` (can mask JS/TS interop issues).
- **Risk:** Hidden type errors, runtime failures, poor type safety.

### 3. CJS in Browser Code
- No direct CJS entry points found in browser workspaces, but check for legacy files (e.g., `index.cjs.keep` in desktop-client archive).
- **Risk:** Build failures, browser runtime errors.

### 4. Workspace Imports from Another’s src/
- `desktop-client` imports from `loot-core/src` via tsconfig paths, not built output.
- **Risk:** Unbuilt code, inconsistent builds, type drift.

### 5. Vite/TS/React Version Drift
- Vite: `desktop-client` uses `7.1.12`, `loot-core`/`plugins-service` use `7.1.9`.
- TypeScript: All use `^5.9.3` (OK).
- **Risk:** Plugin incompatibility, build bugs.

### 6. Unbuilt/Unexported src/ Usage
- `loot-core` exports src/ directly in package.json.
- **Risk:** Unstable API, accidental breaking changes.

---

## Summary Table of Risks

| Risk                          | Workspaces Affected                | Priority |
|-------------------------------|------------------------------------|----------|
| React version mismatch        | desktop-client, component-library  | High     |
| skipLibCheck/allowJs usage    | Most workspaces                    | High     |
| Workspace src/ imports        | desktop-client, loot-core          | High     |
| Vite version drift            | desktop-client, loot-core, plugins-service | Medium   |
| CJS in browser code           | desktop-client (archive), loot-core| Medium   |
| Unbuilt src/ exports          | loot-core                          | Medium   |

---

### Recommendations
- **Align React versions** across all workspaces.
- **Remove skipLibCheck/allowJs** unless absolutely necessary.
- **Enforce build step** for cross-workspace imports (no direct src/ imports).
- **Align Vite versions** for plugin compatibility.
- **Audit for CJS usage** in browser code.
- **Export only built code** from workspaces.
