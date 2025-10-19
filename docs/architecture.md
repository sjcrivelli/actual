# Architecture Overview

## Project Structure
```
/
├── packages/
│   ├── desktop-client/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── app/
│   │   │   ├── budget/
│   │   │   ├── modals/
│   │   │   ├── payees/
│   │   │   ├── transactions/
│   │   │   ├── tags/
│   │   │   ├── users/
│   │   │   ├── redux/
│   │   │   ├── spreadsheet/
│   │   │   ├── style/
│   │   │   ├── util/
│   │   │   ├── index.tsx
│   ├── desktop-electron/
│   │   ├── index.ts      # Electron main entry
│   │   ├── preload.ts    # Preload script
│   ├── loot-core/
│   │   ├── src/
│   ├── sync-server/
│   │   ├── app.ts        # Backend/server logic
```

## Main Components
- Electron main process: `/packages/desktop-electron/index.ts`
- Preload script: `/packages/desktop-electron/preload.ts`
- React renderer: `/packages/desktop-client/src/index.tsx`
- Redux store: `/packages/desktop-client/src/redux/store.ts`

## Data Flow Map
```
Electron Main → Preload (contextBridge) → Renderer (React/Redux)
  |-- IPC: file dialogs, sync server, theme, notifications
  |-- Redux: state slices for budget, accounts, transactions, etc.
  |-- Backend: sync-server for multi-device sync
```

## Architecture Grade
**Grade:** A-
