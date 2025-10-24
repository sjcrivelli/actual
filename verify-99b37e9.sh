#!/usr/bin/env bash
set -e

echo "=== 🧩 Yarn Environment Check ==="
yarn --version
yarn workspaces list
yarn config get nodeLinker
yarn dedupe --check || true

echo "=== 🧠 TypeScript Strict Check ==="
yarn tsc --noEmit --pretty || true

echo "=== 🧹 ESLint Health Check ==="
npx eslint "packages/**/*.ts" --max-warnings=0 || true

echo "=== 🔗 ESM Resolution Check ==="
node --input-type=module -e "import('express').then(()=>console.log('✅ ESM OK')).catch(console.error)" || true

echo "=== 🧱 Yarn Doctor ==="
yarn dlx @yarnpkg/doctor || true

echo "=== 🧾 Dependency Audit ==="
yarn npm audit --environment production || true

echo "=== 🤖 CI Parity Check ==="
yarn tsc --noEmit && npx eslint "packages/**/*.ts" --max-warnings=0 && echo '✅ CI parity: PASS' || echo '❌ CI parity: FAIL'

echo "=== 🧭 Workspace Dependency Tree ==="
yarn workspaces focus --all --verbose || true

echo "=== 🧹 ESLint Config Version Check ==="
npx eslint --version
head -n 10 eslint.config.mjs || true

echo "🎯 Verification complete — review results above."
