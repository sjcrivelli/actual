# Build Pipeline Green

## 1. Root `package.json` Scripts (add/ensure these)
```jsonc
{
  "scripts": {
    "typecheck": "yarn workspaces foreach --all --parallel run typecheck",
    "lint": "yarn workspaces foreach --all --parallel run lint",
    "build": "yarn workspaces foreach --all --parallel run build",
    "verify": "yarn typecheck && yarn lint && yarn build"
  }
}
```

## 2. Workspace `package.json` Scripts (add/ensure in each workspace)
```jsonc
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "build": "tsc"
  }
}
```
- For apps using Vite, set `"build": "vite build"` instead of `"tsc"`.

## 3. Minimal GitHub Action for PRs
```yaml
# .github/workflows/verify.yml
name: Verify Build Pipeline

on:
  pull_request:
    branches: [main, master]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Yarn
        run: corepack enable
      - name: Install dependencies
        run: yarn install --immutable
      - name: Run verify pipeline
        run: yarn verify
```

---

## Summary
- Root scripts run typecheck, lint, build, and verify all workspaces.
- Each workspace has matching scripts for typecheck, lint, and build.
- GitHub Action runs the full pipeline on every PR.

---

**This plan is saved as `Notes/Progress_Check/Build_Pipeline_Green.md`.**
