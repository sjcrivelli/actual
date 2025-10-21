# Runtime Behavior and Data Flow

## Startup Sequence
- Electron main initializes, sets up BrowserWindow, registers protocols, loads user data paths.
- Preload exposes APIs for IPC, sync, file dialogs, theme.
- React/Redux initializes state slices and loads persistent data.

## Redux Flow
- Slices: accounts, app, budget, modals, notifications, payees, prefs, transactions, tags, users.
- Actions: loadBudget, closeBudget, addNotification, CRUD for categories/payees/transactions.
- Async thunks: reloadCategories, getCategories, loadBudget, sync.

## IPC Channels
| Event Name                | Direction         | Purpose                       |
|---------------------------|-------------------|-------------------------------|
| get-bootstrap-data        | Main → Renderer   | Initial app data              |
| set-theme                 | Main → Renderer   | Theme change                  |
| open-file-dialog          | Main → Renderer   | File open dialog              |
| save-file-dialog          | Main → Renderer   | File save dialog              |
| open-external-url         | Main → Renderer   | Open URL in browser           |
| start-sync-server         | Main → Renderer   | Start sync server             |
| stop-sync-server          | Main → Renderer   | Stop sync server              |
| is-sync-server-running    | Main → Renderer   | Sync server status            |
| start-oauth-server        | Main → Renderer   | Start OAuth server            |
| relaunch                  | Main → Renderer   | Relaunch app                  |
| restart-server            | Main → Renderer   | Restart backend server        |
| message                   | Bidirectional     | Custom IPC messages           |
| upload-file-web           | Renderer → Main   | Upload file                   |
| app-focused               | Renderer → Main   | App focus event               |

## Network Operations
- Endpoints: local Express server, remote sync-server, OAuth integrations
- Triggers: user actions, auto sync, scheduled jobs
- Caching: promise-retry, memoize-one

=== START RUNTIME ANALYSIS ===

# ===============================================================
# 🔍 SECTION 1 — APP LIFECYCLE AND BOOTSTRAP
# ===============================================================
=== APP STARTUP FLOW ===
- Electron main process initializes via app.on('ready'), sets up BrowserWindow, registers app:// protocol, loads user data paths.
- Preload script (preload.ts) exposes contextBridge APIs for IPC, sync server control, file dialogs, and theme changes.
- React/Redux state is initialized in index.tsx, with slices for accounts, app, budget, modals, notifications, payees, prefs, transactions, tags, users.
- Persistent user data (budget, prefs, transactions) is loaded at boot via async thunks and selectors.
========================

# ===============================================================
# ⚡ SECTION 2 — REDUX / STATE MANAGEMENT FLOW
# ===============================================================
=== STATE FLOW ===
- Main Redux store slices: accounts, app, budget, budgetfiles, modals, notifications, payees, prefs, transactions, tags, users.
- Common actions: loadBudget, closeBudget, addNotification, setAppState, undo/redo, CRUD for categories/payees/transactions.
- Async thunks: reloadCategories, getCategories, loadBudget, sync, fetch from server or local DB.
- React components connect via useSelector/useDispatch, custom hooks for domain logic.
- No direct store mutations; all state changes via reducers and thunks.
==================

# ===============================================================
# 💾 SECTION 3 — DATA LOAD & PERSISTENCE BEHAVIOR
# ===============================================================
=== DATA PERSISTENCE FLOW ===
- User data loaded from better-sqlite3 (local SQLite) in Electron userData dir (ACTUAL_DATA_DIR).
- Data saved via Redux actions and async thunks, persisted to DB and synced via IPC or API.
- Sync features: @actual-app/sync-server (Express, multi-device sync, API routes).
- Backups: handled via file dialogs and export/import features.
- No explicit encryption or file hashing, but sensitive data not exposed to renderer.
==============================

# ===============================================================
# 🧠 SECTION 4 — INTERPROCESS COMMUNICATION (IPC)
# ===============================================================
=== ELECTRON IPC CHANNELS ===
- Main → Renderer: 'get-bootstrap-data', 'set-theme', 'open-file-dialog', 'save-file-dialog', 'open-external-url', 'start-sync-server', 'stop-sync-server', 'is-sync-server-running', 'start-oauth-server', 'relaunch', 'restart-server', 'message'
- Renderer → Main: 'message' (with name/args), 'upload-file-web', 'app-focused'
- Payloads: JSON objects (budget, transaction, file contents, theme, etc.)
- Purpose: bootstrapping, file operations, sync control, theme changes, notifications
==============================

# ===============================================================
# 🌐 SECTION 5 — API CALLS AND NETWORK OPERATIONS
# ===============================================================
=== NETWORK FLOW ===
- API/network requests: sync-server endpoints, fetches via loot-core/platform/client/fetch
- Endpoints: local Express server, remote sync-server, OAuth integrations
- Triggers: user actions (sync, import/export), auto sync, scheduled jobs
- Responses: handled via async thunks, Redux state updates, notifications
- Caching/retry: promise-retry for backend imports, memoize-one for selectors
=====================

# ===============================================================
# 📊 SECTION 6 — CUSTOM MODULE RUNTIME BEHAVIOR
# ===============================================================
=== MODULE RUNTIME FLOW ===
- Budget manager: budgetSlice.ts, async thunks for category/group CRUD, selectors for views, memoization for performance
- Credit card tracker: accountsSlice.ts, transaction CRUD, paydown logic
- Retirement planner: not detected
- User input: triggers Redux actions, updates DB, syncs via IPC/API
- Async patterns: useEffect, custom hooks, promise chains, IPC invocations
============================

# ===============================================================
# 🧩 SECTION 7 — PERFORMANCE & ASYNC ANALYSIS
# ===============================================================
=== PERFORMANCE NOTES ===
- Bottlenecks: large React components (App.tsx, FinancesApp.tsx), heavy loops in reports/transactions
- Async chains: promise-retry for backend, unbatched Redux updates possible in large actions
- Memoization: used in selectors, but some hooks/components could benefit from useMemo/useCallback
- No major blocking calls, but some legacy JS could be optimized
==========================

# ===============================================================
# 🔐 SECTION 8 — SECURITY AND SANDBOXING
# ===============================================================
=== SECURITY REVIEW ===
- contextIsolation: enabled in preload.ts
- Sandboxing: webview disabled, webSecurity true, nodeIntegration false in renderer
- Sensitive data: not exposed to window/global, IPC payloads validated
- Improvements: stricter payload validation, consider encryption for backups
========================

# ===============================================================
# ⚙️ SECTION 9 — BUILD AND EXECUTION BEHAVIOR
# ===============================================================
=== BUILD EXECUTION ===
- Dev vs prod: NODE_ENV, ACTUAL_DATA_DIR, ACTUAL_DOCUMENT_DIR, electronVersion used
- Electron build: electron-builder packages renderer, assets, and configs per platform
- Assets/configs: icons, artifact names, and paths templated for each OS
========================

=== END RUNTIME ANALYSIS ===
