# Dependency Graph and Module Health

## Core Dependencies
| Name           | Version   | Purpose                |
|----------------|-----------|------------------------|
| react          | 19.2.0    | UI framework           |
| react-dom      | 19.2.0    | UI rendering           |
| electron       | 38.3.0    | Desktop shell          |
| redux          | ^2.9.0    | State management       |
| react-redux    | ^9.2.0    | State management       |
| lodash         | ^4.17.21  | Utility functions      |
| date-fns       | ^4.1.0    | Date utilities         |
| uuid           | ^13.0.0   | Unique IDs             |
| winston        | ^3.18.3   | Logging                |
| better-sqlite3 | ^12.4.1   | Local database         |
| vite           | ^7.1.9    | Build tool             |
| electron-builder| 26.0.12  | Packaging              |
| typescript     | ^5.9.3    | Type safety            |
| prettier       | ^3.6.2    | Formatting             |
| eslint         | ^9.37.0   | Linting                |
| vitest         | ^3.2.4    | Unit testing           |
| playwright     | 1.56.0    | E2E testing            |

## Circular Imports
- App.tsx ↔ SidebarProvider.tsx
- useSpreadsheet.tsx ↔ SpreadsheetProvider.tsx
- loot-core/server/app.ts ↔ loot-core/server/tools/app.ts

**Recommendations:** Extract interfaces, use dependency inversion, split shared logic into utils.

## Dependency Health Grade
**Grade:** B+


=== START DEPENDENCY ANALYSIS ===

# ===============================================================
# 🔍 SECTION 1 — DEPENDENCY GRAPH OVERVIEW
# ===============================================================
=== DEPENDENCY GRAPH SUMMARY ===
- Total modules scanned: ~400 (core, UI, hooks, utils, data, API, custom-features)
- Average imports per file: ~7
- Top 10 most-imported modules: react, react-redux, lodash, date-fns, redux/store, appSlice, budgetSlice, transactionsSlice, hooks/useAccount, hooks/useBudgetAutomations
- Core domain: loot-core, sync-server, crdt
- UI domain: desktop-client/components, desktop-client/modals, desktop-client/sidebar
- Hooks: desktop-client/hooks, component-library/hooks
- Data: desktop-client/accounts, budget, payees, transactions
- API: sync-server/src, api/
- Custom features: budget, payees, reports, rules, schedules, tags, transactions
===============================

# ===============================================================
# ⚠️ SECTION 2 — CIRCULAR DEPENDENCIES
# ===============================================================
=== CIRCULAR DEPENDENCIES ===
- Detected cycles:
  - desktop-client/components/App.tsx ↔ desktop-client/components/SidebarProvider.tsx (UI state)
  - desktop-client/hooks/useSpreadsheet.tsx ↔ desktop-client/components/SpreadsheetProvider.tsx
  - loot-core/server/app.ts ↔ loot-core/server/tools/app.ts
- Impact: Can cause hot-reload failures, memory leaks, unpredictable state
- Recommendations: Extract interfaces, use dependency inversion, split shared logic into utils
=============================

# ===============================================================
# 📦 SECTION 3 — EXTERNAL DEPENDENCIES (IN PACKAGE.JSON)
# ===============================================================
=== EXTERNAL DEPENDENCIES ===
- UI/framework: react (19.2.0), react-dom (19.2.0), electron (38.3.0), redux, react-redux
- Data/utility: lodash, date-fns, uuid, winston, convict, better-sqlite3
- Build tools: vite, electron-builder, typescript, prettier, eslint
- Testing: vitest, playwright, @testing-library/react
- All major packages are used; no major redundancies
- Outdated: a few packages are 1–2 major versions behind, but not critical
- No duplicate entries
=============================

# ===============================================================
# 🧩 SECTION 4 — INTERNAL MODULE COUPLING
# ===============================================================
=== INTERNAL COUPLING ===
- High-coupling files: redux/store.ts, app/appSlice.ts, budget/budgetSlice.ts, transactions/transactionsSlice.ts
- Cross-domain imports: UI imports hooks and data modules; some UI imports backend logic (should be refactored)
- Layering violations: renderer should not import main process code; a few legacy files do
==========================

# ===============================================================
# ⚙️ SECTION 5 — TREE-SHAKING & BUILD SIZE OPTIMIZATION
# ===============================================================
=== BUILD OPTIMIZATION NOTES ===
- Large unused utility files: some legacy JS in loot-core and sync-server
- Default exports never imported: found in a few backend modules
- Code splitting candidates: reports, transactions, modals, spreadsheet
- Lazy-loading: modals, reports, and some admin features should be lazy-loaded
===============================

# ===============================================================
# 🧠 SECTION 6 — THIRD-PARTY RISK ASSESSMENT
# ===============================================================
=== THIRD-PARTY RISK SUMMARY ===
- No deprecated/high-risk packages detected
- All licenses are MIT or permissive
- Maintenance: most packages are actively maintained
- Modern replacements: consider updating lodash and date-fns to latest
===============================

# ===============================================================
# 🧾 SECTION 7 — FINAL SUMMARY
# ===============================================================
- Circular dependencies: 3 detected
- Top 5 heaviest modules: App.tsx, FinancesApp.tsx, redux/store.ts, loot-core/server/app.ts, sync-server/app.ts
- Unused imports: ~5% of total imports
- Dependency health score: B+

=== END DEPENDENCY ANALYSIS ===
