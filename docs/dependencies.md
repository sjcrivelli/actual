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
