# Vite Doom Loop Autopsy: JSX-in-.js Analysis

## Why Was JSX-in-.js Added?
- Historically, Vite and ESBuild only processed JSX in `.jsx`/`.tsx` files, not `.js`.
- Some code in `packages/desktop-client/src/` used JSX syntax in `.js` files.
- The custom plugin `plugins/jsx-js.js` was created to force ESBuild to treat `.js` files as JSX, transforming them before Vite's normal pipeline.

## Babel/ESBuild Settings vs Defaults
- **Vite config:**
  - `esbuild: { loader: 'tsx', include: /src\/.*\.(js|jsx|ts|tsx)$/ ... jsx: 'automatic' }`
  - `optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } }`
  - `react({ babel: { plugins: ['babel-plugin-react-compiler'] } })`
- **Custom plugin:**
  - Forces ESBuild to run with `loader: 'jsx'` for `.js` files in `src/`.
- **Difference:**
  - Default Vite/ESBuild only treats `.jsx`/`.tsx` as JSX.
  - This setup treats `.js` as JSX, both in dev and build, and adds Babel plugin for React compiler.

## Does Vite's Built-in React Plugin Cover This Now?
- **Recent Vite/ESBuild versions** (Vite 4+, ESBuild 0.14+) allow configuring JSX in `.js` via `esbuildOptions` and `react()` plugin.
- The current config already sets `loader: { '.js': 'jsx' }` and uses `react()`.
- **Conclusion:** The custom `jsx-js.js` plugin is now redundant; Vite's built-in config covers `.js` JSX.

## Clean Final Config Proposal
- Remove `plugins/jsx-js.js` and any references to it in Vite config.
- Ensure Vite config includes:
  ```js
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.(js|jsx|ts|tsx)$/,
    jsx: 'automatic',
  },
  optimizeDeps: {
    esbuildOptions: { loader: { '.js': 'jsx' } },
  },
  plugins: [react(/* ... */)],
  ```
- Keep Babel plugin if needed for React compiler.

## Safe Removal Steps
1. Remove import and usage of `plugins/jsx-js.js` from Vite config.
2. Delete `plugins/jsx-js.js` file.
3. Confirm Vite config still sets `.js` loader to `jsx` in `esbuild` and `optimizeDeps`.
4. Run a full build and dev server.
5. Test all `.js` files in `src/` that use JSX.

## Test Plan
- **Automated:**
  - Run `yarn test` and `yarn workspace @actual-app/web e2e`.
  - Check for JSX parse errors in `.js` files.
- **Manual:**
  - Open app in dev and production mode.
  - Confirm all UI renders correctly, especially components in `.js` files.
  - Check for missing JSX transforms or runtime errors.
- **Codebase:**
  - Search for `.js` files in `src/` using JSX and verify coverage.

---

**Summary:**
JSX-in-.js was a workaround for old Vite/ESBuild limitations. The current Vite config covers this natively. Remove the custom plugin, keep the config, and test thoroughly.
