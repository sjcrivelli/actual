# CloseAccountModal.tsx Change Summary

## Changes Made

### 1. Currency Formatting
- Replaced `import { integerToCurrency } from 'loot-core/shared/util'` with:
  ```typescript
  import { integerToAmount } from 'loot-core/shared/util';
  import { useFormat } from '@desktop-client/hooks/useFormat';
  ```
- Removed the incorrect `import { format } from '@desktop-client/locale/format';`.
- Initialized the formatter inside the component:
  ```typescript
  const format = useFormat();
  ```
- Updated all usages of `integerToCurrency(x)` to `format(integerToAmount(x), 'financial')`.

### 2. TypeScript Parameter Types
- Added explicit types:
  ```typescript
  const onSelectAccount = (accId: string) => { ... }
  const onSelectCategory = (catId: string) => { ... }
  ```

### 3. Boolean Setter
- Ensured boolean setters only receive booleans:
  ```typescript
  setCategoryError(Boolean(categoryError));
  ```

### 4. Optional String Fields
- Changed `|| null` to `|| undefined` for optional string fields:
  ```typescript
  transferAccountId: transferAccountId || undefined,
  categoryId: categoryId || undefined,
  ```

### 5. Function Signature Fix
- Corrected the function signature to properly destructure props:
  ```typescript
  export function CloseAccountModal({ account, balance, canDelete }: CloseAccountModalProps) {
  ```

### 6. Formatter Hook Usage
- Fixed usage to match the actual return type of `useFormat` (a function, not an object).

## Changes to Other Files/Dependencies
- **No changes were made to other files or dependencies.**
- The only dependency interaction was reading the implementation of `useFormat` to confirm its API; no edits were made to that file.

---

**Result:**
`CloseAccountModal.tsx` is now strictly typed, uses the correct currency formatting pattern, and has no TypeScript errors. No unrelated code or external dependencies were modified.
