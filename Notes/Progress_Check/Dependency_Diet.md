# Dependency Diet Report

## Heavy/Unused Dependencies (by workspace)

### desktop-client (`@actual-app/web`)
- **Heavy:** `react`, `react-dom`, `react-dnd`, `react-grid-layout`, `recharts`, `jsdom`, `@swc/core`, `@emotion/css`, `@fontsource/redacted-script`
- **Potentially Unused:** `pikaday`, `prop-types` (if all components are TS), `mdast-util-newline-to-break`
- **Alternatives:** Use `react-beautiful-dnd` (smaller) for drag/drop, consider `date-fns` over `pikaday`, remove `prop-types` if fully TS.

### loot-core
- **Heavy:** `better-sqlite3`, `absurd-sql`, `@reduxjs/toolkit`, `handlebars`
- **Potentially Unused:** `adm-zip` (patch), `slash`, `ua-parser-js`
- **Alternatives:** Use `sql.js` only for browser, consider lighter cache than `lru-cache` if usage is simple.

### sync-server
- **Heavy:** `express`, `winston`, `bcrypt`, `dotenv`, `convict`
- **Potentially Unused:** `debug`, `ipaddr.js`, `jws`, `migrate`
- **Alternatives:** Use `fastify` (smaller/faster) instead of `express` if possible, consider `pino` over `winston`.

### component-library
- **Heavy:** `@emotion/css`, `react-aria-components`
- **Potentially Unused:** `usehooks-ts` (if not used)
- **Alternatives:** Use CSS modules or vanilla-extract for smaller CSS-in-JS.

### api
- **Heavy:** `better-sqlite3`, `node-fetch`
- **Potentially Unused:** `compare-versions`
- **Alternatives:** Use native fetch (Node 18+) instead of `node-fetch`.

### plugins-service
- **Heavy:** `workbox-precaching`
- **Alternatives:** Use native service worker APIs if possible.

### crdt
- **Heavy:** `google-protobuf`
- **Alternatives:** None (required for CRDT).

### desktop-electron
- **Heavy:** `electron`, `better-sqlite3`, `fs-extra`
- **Alternatives:** None (required for desktop).

### eslint-plugin-actual
- **Heavy:** None.
- **Potentially Unused:** `requireindex` (if not used).

---

## Patch Suggestions (package.json)

### Example: Remove unused dependencies from desktop-client
```diff
-    "pikaday": "1.8.2",
-    "prop-types": "^15.8.1",
-    "mdast-util-newline-to-break": "^2.0.0",
+    // Remove if not used anywhere in src/
```

### Example: Replace node-fetch in api
```diff
-    "node-fetch": "^3.3.2",
+    // Remove if using Node >=18 and switch to global fetch
```

### Example: Replace express in sync-server
```diff
-    "express": "5.1.0",
+    // Replace with "fastify": "^4.0.0" (if migration feasible)
```

### Example: Remove unused devDependencies
```diff
-    "@types/promise-retry": "^1.1.6",
+    // Remove if not used in tests or src
```

---

## Yarn Dedupe Plan

1. Run `yarn dedupe` at repo root to flatten dependency tree.
2. Use `yarn why <package>` to identify duplicate or unused packages.
3. Remove unused dependencies from each workspace's package.json.
4. Run `yarn install` to update lockfile.
5. Test builds and runtime for regressions.

---

## Recommendations
- Audit all dependencies for actual usage in code.
- Remove unused or legacy packages.
- Prefer lighter alternatives for drag/drop, date, and logging.
- Use native APIs where possible (fetch, service worker).
- Run `yarn dedupe` and `yarn why` regularly.

---

**This report is saved as `Notes/Progress_Check/Dependency_Diet.md`.**
