// Canonical sync-server bootstrap (ESM, Node16 modules)

// Core
import express from "express";
import cors from "cors";

// Sub-apps (these export { handlers } in your build output)
import { handlers as accountApp }   from "./app-account.js";
import { handlers as adminApp }     from "./app-admin.js";
import { handlers as openIdApp }    from "./app-openid.js";
import { handlers as corsProxyApp } from "./app-cors-proxy.js";

// Create server
const app  = express();
const PORT = Number(process.env.PORT) || 3003;
const HOST = process.env.HOST || "0.0.0.0";

// Global middleware
app.use(cors());
app.use(express.json());

// Mount at the conventional paths the client expects:
// - account/admin/openid at root (expose /needs-bootstrap, /login, /validate, etc.)
// - cors-proxy only under /cors-proxy (prevents it from intercepting /)
app.use(accountApp);
app.use(adminApp);
app.use(openIdApp);
app.use("/cors-proxy", corsProxyApp);

// Simple health root
app.get("/", (_req, res) => res.send("Actual Sync Server is running"));

// Start
app.listen(PORT, HOST, () => {
  console.log(`Sync server listening on http://${HOST}:${PORT}`);
});

