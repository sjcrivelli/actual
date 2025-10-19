"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = updateVersion;
// @ts-strict-ignore
const md5_1 = __importDefault(require("md5"));
const aql_1 = require("./aql");
const db = __importStar(require("./db"));
const migrations = __importStar(require("./migrate/migrations"));
// Managing the init/update process
async function runMigrations() {
    await migrations.migrate(db.getDatabase());
}
async function updateViews() {
    const hashKey = 'view-hash';
    const row = await db.first('SELECT value FROM __meta__ WHERE key = ?', [hashKey]);
    const { value: hash } = row || {};
    const views = (0, aql_1.makeViews)(aql_1.schema, aql_1.schemaConfig);
    const currentHash = (0, md5_1.default)(views);
    if (hash !== currentHash) {
        await db.execQuery(views);
        await db.runQuery('INSERT OR REPLACE INTO __meta__ (key, value) VALUES (?, ?)', [hashKey, currentHash]);
    }
}
async function updateVersion() {
    await runMigrations();
    await updateViews();
}
