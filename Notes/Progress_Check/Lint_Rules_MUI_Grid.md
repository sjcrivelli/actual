# Lint Rules to Match Our Standards

## 1. Enforce MUI v7 Grid API, Ban Unstable_Grid2

### `.eslintrc.cjs` (or add to `eslint.config.mjs`)
```js
export default [
  // ...existing config...
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Ban Unstable_Grid2 imports/usages
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/material/Unstable_Grid2',
              message: 'Use MUI v7 Grid API instead of Unstable_Grid2.',
            },
          ],
          patterns: [
            {
              group: ['*Unstable_Grid2*'],
              message: 'Do not use Unstable_Grid2. Use Grid from @mui/material.',
            },
          ],
        },
      ],
      // Ban escape hatches (e.g., dangerouslySetInnerHTML, UNSTABLE_*)
      'no-restricted-syntax': [
        'error',
        {
          selector: "Identifier[name=/^UNSTABLE_/]",
          message: 'Do not use UNSTABLE_ APIs.',
        },
        {
          selector: "JSXAttribute[name.value='dangerouslySetInnerHTML']",
          message: 'Do not use dangerouslySetInnerHTML.',
        },
      ],
    },
  },
  // ...existing config...
];
```

---

## 2. Autofix Suggestions
- Replace all `Unstable_Grid2` imports/usages with `Grid` from `@mui/material`.
- Remove/replace any `UNSTABLE_` props or APIs with stable equivalents.
- Remove escape hatches like `dangerouslySetInnerHTML` unless absolutely necessary.

---

## 3. Manual Fixes (file/line)
No direct usage of `Unstable_Grid2` found in codebase.

**Escape hatches found:**
- `/packages/desktop-client/src/components/transactions/TransactionsTable.tsx`  
  - Line 1201: `UNSTABLE_portalContainer={listContainerRef.current}`  
    - **Manual fix:** Replace with stable portalContainer prop if available in MUI v7.

**Other escape hatches (not MUI-specific):**
- Multiple files use `escapeValue`, `onEscape`, or handle Escape key events.  
  - These are not MUI escape hatches and are safe.

---

## 4. Test Plan
- Run `yarn lint` and confirm new rules are enforced.
- Run autofix (`yarn lint:fix`).
- Manually review flagged lines for UNSTABLE_ usage and replace with stable APIs.
- Test UI for regressions after replacing escape hatches.

---

**This report and config update are saved as `Notes/Progress_Check/Lint_Rules_MUI_Grid.md`.**
