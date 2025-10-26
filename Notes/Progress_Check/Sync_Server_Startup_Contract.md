# Sync-Server Startup Contract Audit

**Date:** 2025-10-26

---

## 1. Audit: sync-server dev script, port, and CORS

- **Dev Script:**
  - Start with: `yarn workspace @actual-app/sync-server start`
- **Default Port:**
  - Typically `5000` (verify in `packages/sync-server/src/index.js` or config)
- **CORS:**
  - Should allow requests from desktop-client (`http://localhost:3000` or Electron)
  - Example: `app.use(cors({ origin: 'http://localhost:3000', credentials: true }));`

---

## 2. Desktop-client: Sync-server URL config

- Desktop-client should read the sync-server URL from a single config key (e.g., `.env`, `config.ts`)
- Example `.env`:
  ```
  SYNC_SERVER_URL=http://localhost:5000
  ```
- In code: `process.env.SYNC_SERVER_URL` or import from config
- **No hardcoded URLs**; use environment variable or config file

---

## 3. One-command dev launcher (root)

- Add to root `package.json` scripts:
  ```json
  "start:dev-all": "concurrently -k -n sync-server,desktop-client \"yarn workspace @actual-app/sync-server start\" \"yarn workspace @actual-app/web start:browser\" && echo 'Sync-server running at http://localhost:5000'"
  ```
  - Requires `concurrently` package: `yarn add -D concurrently`
- This script starts both servers and prints the sync-server URL for the app

---

## Action Items

- [ ] Patch root `package.json` with `start:dev-all` script
- [ ] Ensure desktop-client reads sync-server URL from config key
- [ ] Check/patch sync-server CORS settings for desktop-client origin
- [ ] Install `concurrently` if not present

---

**Paste the printed URL into the app to connect to sync-server.**
