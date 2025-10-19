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
