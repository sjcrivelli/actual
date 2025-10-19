# Refactor Roadmap

| Priority   | Module                | Issue                          | Recommendation                       |
|------------|-----------------------|---------------------------------|---------------------------------------|
| Critical   | backend/sync-server   | Async error handling            | Audit and add error handling          |
| High       | App.tsx, FinancesApp.tsx | Large React components      | Split into smaller components         |
| High       | custom modules        | Missing integration tests       | Add more integration tests            |
| Medium     | App.tsx, hooks        | Inline functions in render      | Memoize with useCallback/useMemo      |
| Medium     | reports, transactions | Heavy loops, map/filter chains  | Refactor for performance              |
| Low        | legacy JS, unused     | Unused imports, dead exports    | Remove and clean up                   |
| Optional   | financial logic       | Magic numbers                   | Extract to constants                  |
| Optional   | all modules           | Documentation                   | Improve comments and docs             |
