# Code Quality and Analysis

## Maintainability Score
**Score:** 8/10

## Top 10 Code Smells
| File Path                                      | Issue                                 |
|------------------------------------------------|---------------------------------------|
| src/components/App.tsx                         | Large component (>300 lines)          |
| src/components/FinancesApp.tsx                 | Large component (>300 lines)          |
| src/hooks/useSpreadsheet.tsx                   | Unused imports                        |
| src/budget/budgetSlice.ts                      | Inline functions in render            |
| backend/legacy.js                              | Dead exports                          |
| src/app/appSlice.ts                            | Functions missing error handling      |
| src/transactions/transactionsSlice.ts          | Overuse of any/implicit any           |
| src/redux/store.ts                             | No direct state mutations             |
| src/components/SidebarProvider.tsx              | Large component                       |
| src/reports/reportUtils.ts                     | Duplicate math logic                  |

## State Management Issues & Fixes
- Some useEffect hooks lack cleanup
- Inefficient re-renders in large components
- Memoization needed in some hooks/components

## Security Findings
| Issue                        | Location                        | Recommendation                |
|------------------------------|----------------------------------|-------------------------------|
| IPC payload validation       | preload.ts, main.ts              | Add stricter validation       |
| User input validation        | backend API                      | Improve backend validation    |
| Plaintext storage            | renderer                         | No sensitive data stored      |
