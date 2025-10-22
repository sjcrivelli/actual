"use strict";
// Canonical sync-server bootstrap (ESM, Node16 modules)
Object.defineProperty(exports, "__esModule", { value: true });
// Core
var express_1 = require("express");
var cors_1 = require("cors");
// Sub-apps (these export { handlers } in your build output)
var app_account_js_1 = require("./app-account.js");
var app_admin_js_1 = require("./app-admin.js");
var app_openid_js_1 = require("./app-openid.js");
var app_cors_proxy_js_1 = require("./app-cors-proxy.js");
// Create server
var app = (0, express_1.default)();
var PORT = Number(process.env.PORT) || 3003;
var HOST = process.env.HOST || "0.0.0.0";
// Global middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount at the conventional paths the client expects:
// - account/admin/openid at root (expose /needs-bootstrap, /login, /validate, etc.)
// - cors-proxy only under /cors-proxy (prevents it from intercepting /)
app.use(app_account_js_1.handlers);
app.use(app_admin_js_1.handlers);
app.use(app_openid_js_1.handlers);
app.use("/cors-proxy", app_cors_proxy_js_1.handlers);
// Simple health root
app.get("/", function (_req, res) { return res.send("Actual Sync Server is running"); });

import express from "express";
import cors from "cors";
import { handlers as accountHandlers } from "./app-account.js";
import { handlers as adminHandlers } from "./app-admin.js";
import { handlers as openidHandlers } from "./app-openid.js";
import { handlers as corsProxyHandlers } from "./app-cors-proxy.js";

const app = express();
const PORT = Number(process.env.PORT) || 3003;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Mount at the conventional paths the client expects:
app.use(accountHandlers);
app.use(adminHandlers);
app.use(openidHandlers);
app.use("/cors-proxy", corsProxyHandlers);

app.get("/", (_req, res) => res.send("Actual Sync Server is running"));

app.listen(PORT, HOST, () => {
    console.log(`Sync server listening on http://${HOST}:${PORT}`);
});
