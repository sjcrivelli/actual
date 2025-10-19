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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importActual = importActual;
// @ts-strict-ignore
const fs = __importStar(require("../../platform/server/fs"));
const sqlite = __importStar(require("../../platform/server/sqlite"));
const cloudStorage = __importStar(require("../cloud-storage"));
const main_1 = require("../main");
const sheet_1 = require("../sheet");
async function importActual(_filepath, buffer) {
    // Importing Actual files is a special case because we can directly
    // write down the files, but because it doesn't go through the API
    // layer we need to duplicate some of the workflow
    await main_1.handlers['close-budget']();
    let id;
    try {
        ({ id } = await cloudStorage.importBuffer({ cloudFileId: null, groupId: null }, buffer));
    }
    catch (e) {
        if (e.type === 'FileDownloadError') {
            return { error: e.reason };
        }
        throw e;
    }
    // We never want to load cached data from imported files, so
    // delete the cache
    const sqliteDb = await sqlite.openDatabase(fs.join(fs.getBudgetDir(id), 'db.sqlite'));
    sqlite.execQuery(sqliteDb, `
          DELETE FROM kvcache;
          DELETE FROM kvcache_key;
        `);
    sqlite.closeDatabase(sqliteDb);
    // Load the budget, force everything to be computed, and try
    // to upload it as a cloud file
    await main_1.handlers['load-budget']({ id });
    await main_1.handlers['get-budget-bounds']();
    await (0, sheet_1.waitOnSpreadsheet)();
    await cloudStorage.upload().catch(() => { });
}
