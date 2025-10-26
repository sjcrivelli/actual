# TS Config Harmonizer

## Proposed `tsconfig.base.json` (repo root)
```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext", // For apps; override to NodeNext for libraries
    "moduleResolution": "Bundler", // For apps; override to NodeNext for libraries
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": false,
    "sourceMap": false,
    "composite": true,
    "skipLibCheck": false
  },
  "exclude": [
    "node_modules",
    "dist",
    "**/*.bak",
    "**/*.tmp",
    "**/__tests__/**"
  ]
}
```

---

## Per-Workspace Overrides & Diffs

### `desktop-client/tsconfig.json`
```diff
-  "extends": "../../tsconfig.json",
+  "extends": "../../tsconfig.base.json",
-  "compilerOptions": {
-    "baseUrl": ".",
-    "rootDir": "src",
-    "outDir": "dist",
-    "target": "ES2022",
-    "module": "ESNext",
-    "moduleResolution": "Bundler",
-    "jsx": "react-jsx",
-    "esModuleInterop": true,
-    "allowSyntheticDefaultImports": true,
-    "resolveJsonModule": true,
-    "isolatedModules": true,
-    "strict": true,
-    "skipLibCheck": true,
-    "noEmit": true,
-    "types": ["vite/client", "vitest/globals"],
-    "paths": { ... }
-  },
+  "compilerOptions": {
+    "baseUrl": ".",
+    "rootDir": "src",
+    "outDir": "dist",
+    "types": ["vite/client", "vitest/globals"],
+    "paths": { ... }
+  },
  "include": ["src", "src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "dist-types"]
```

### `loot-core/tsconfig.json`
```diff
-  "extends": "../../tsconfig.json",
+  "extends": "../../tsconfig.base.json",
-  "compilerOptions": {
-    "rootDir": "./src",
-    "outDir": "./dist",
-    "target": "ES2022",
-    "module": "ESNext",
-    "moduleResolution": "Bundler",
-    "jsx": "react-jsx",
-    "esModuleInterop": true,
-    "allowSyntheticDefaultImports": true,
-    "resolveJsonModule": true,
-    "strict": true,
-    "skipLibCheck": true,
-    "declaration": true,
-    "declarationMap": true,
-    "sourceMap": true,
-    "noEmit": false
-  },
+  "compilerOptions": {
+    "rootDir": "./src",
+    "outDir": "./dist"
+  },
  "include": ["src/**/*", "migrations/**/*.js"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "node_modules", "dist"]
```

### `sync-server/tsconfig.json`
```diff
-  "extends": "../../tsconfig.json",
+  "extends": "../../tsconfig.base.json",
-  "compilerOptions": {
-    "rootDir": "src",
-    "outDir": "lib-dist",
-    "module": "NodeNext",
-    "moduleResolution": "NodeNext",
-    "target": "ES2022",
-    "typeRoots": ["../../node_modules/@types"],
-    "esModuleInterop": true,
-    "allowSyntheticDefaultImports": true,
-    "resolveJsonModule": true,
-    "forceConsistentCasingInFileNames": true,
-    "allowJs": true,
-    "checkJs": false,
-    "declaration": true,
-    "declarationMap": false,
-    "sourceMap": false,
-    "skipLibCheck": true,
-    "strict": true,
-    "noImplicitAny": true
-  },
+  "compilerOptions": {
+    "rootDir": "src",
+    "outDir": "lib-dist",
+    "module": "NodeNext",
+    "moduleResolution": "NodeNext",
+    "typeRoots": ["../../node_modules/@types"],
+    "allowJs": true,
+    "checkJs": false
+  },
  "include": ["src", "src/global.d.ts"],
  "exclude": ["node_modules", "lib-dist"]
```

### `plugins-service/tsconfig.json`
```diff
-  "extends": "../../tsconfig.json",
+  "extends": "../../tsconfig.base.json",
-  "compilerOptions": {
-    "baseUrl": "./",
-    "outDir": "dist",
-    "rootDir": "src",
-    "module": "NodeNext",
-    "moduleResolution": "NodeNext",
-    "target": "ES2022",
-    "esModuleInterop": true,
-    "strict": true,
-    "skipLibCheck": true,
-    "noEmit": true
-  },
+  "compilerOptions": {
+    "baseUrl": "./",
+    "outDir": "dist",
+    "rootDir": "src",
+    "module": "NodeNext",
+    "moduleResolution": "NodeNext"
+  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
```

---

## Key Points
- Redundant compilerOptions removed from workspace configs.
- `composite: true` enabled in base config for project references.
- `skipLibCheck: false` for strict type safety.
- `NodeNext` for libraries, `Bundler` for apps.
- Declaration settings in base config; override only if needed.
- Paths/types remain in workspace configs as needed.

---

## Migration Steps
1. Add `tsconfig.base.json` at repo root.
2. Update all workspace `tsconfig.json` to extend from `tsconfig.base.json` and remove redundant options.
3. Set `composite: true` in base config for project references.
4. Set `skipLibCheck: false` for strictness.
5. Use `NodeNext` for libraries, `Bundler` for apps.
6. Test with `yarn typecheck` and workspace builds.

---

## Test Plan
- Run `yarn typecheck` at root.
- Build each workspace (`yarn workspace <name> run build`).
- Confirm no type errors or module resolution issues.
- Validate project references and incremental builds.
