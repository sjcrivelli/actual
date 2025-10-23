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
exports.get = get;
exports.loadSpreadsheet = loadSpreadsheet;
exports.unloadSpreadsheet = unloadSpreadsheet;
exports.reloadSpreadsheet = reloadSpreadsheet;
exports.loadUserBudgets = loadUserBudgets;
exports.getCell = getCell;
exports.getCellValue = getCellValue;
exports.startTransaction = startTransaction;
exports.endTransaction = endTransaction;
exports.waitOnSpreadsheet = waitOnSpreadsheet;
const exceptions_1 = require("../platform/exceptions");
const log_1 = require("../platform/server/log");
const sqlite = __importStar(require("../platform/server/sqlite"));
const months_1 = require("../shared/months");
const Platform = __importStar(require("../shared/platform"));
const spreadsheet_1 = require("./spreadsheet/spreadsheet");
const util_1 = require("./spreadsheet/util");
let globalSheet;
let globalOnChange;
let globalCacheDb;
function get() {
    return globalSheet;
}
async function updateSpreadsheetCache(rawDb, names) {
    await sqlite.transaction(rawDb, () => {
        names.forEach(name => {
            const node = globalSheet._getNode(name);
            // Don't cache query nodes yet
            if (node.sql == null) {
                sqlite.runQuery(rawDb, 'INSERT OR REPLACE INTO kvcache (key, value) VALUES (?, ?)', [name, JSON.stringify(node.value)]);
            }
        });
    });
}
function setCacheStatus(mainDb, cacheDb, { clean }) {
    if (clean) {
        // Generate random number and stick in both places
        const num = Math.random() * 10000000;
        sqlite.runQuery(cacheDb, 'INSERT OR REPLACE INTO kvcache_key (id, key) VALUES (1, ?)', [num]);
        if (mainDb) {
            sqlite.runQuery(mainDb, 'INSERT OR REPLACE INTO kvcache_key (id, key) VALUES (1, ?)', [num]);
        }
    }
    else {
        sqlite.runQuery(cacheDb, 'DELETE FROM kvcache_key');
    }
}
function isCacheDirty(mainDb, cacheDb) {
    let rows = sqlite.runQuery(cacheDb, 'SELECT key FROM kvcache_key WHERE id = 1', [], true);
    const num = rows.length === 0 ? null : rows[0].key;
    if (num == null) {
        return true;
    }
    if (mainDb) {
        const rows = sqlite.runQuery(mainDb, 'SELECT key FROM kvcache_key WHERE id = 1', [], true);
        if (rows.length === 0 || rows[0].key !== num) {
            return true;
        }
    }
    // Always also check if there is anything in `kvcache`. We ask for one item;
    // if we didn't get back anything it's empty so there is no cache
    rows = sqlite.runQuery(cacheDb, 'SELECT * FROM kvcache LIMIT 1', [], true);
    return rows.length === 0;
}
async function loadSpreadsheet(db, onSheetChange) {
    const cacheEnabled = process.env.NODE_ENV !== 'test';
    const mainDb = db.getDatabase();
    let cacheDb;
    if (!Platform.isBrowser && cacheEnabled) {
        // Desktop apps use a separate database for the cache. This is because it is
        // much more likely to directly work with files on desktop, and this makes
        // it a lot clearer what the true filesize of the main db is (and avoid
        // copying the cache data around).
        const cachePath = db
            .getDatabasePath()
            .replace(/db\.sqlite$/, 'cache.sqlite');
        globalCacheDb = cacheDb = sqlite.openDatabase(cachePath);
        sqlite.execQuery(cacheDb, `
        CREATE TABLE IF NOT EXISTS kvcache (key TEXT PRIMARY KEY, value TEXT);
        CREATE TABLE IF NOT EXISTS kvcache_key (id INTEGER PRIMARY KEY, key REAL)
      `);
    }
    else {
        // All other platforms use the same database for cache
        cacheDb = mainDb;
    }
    let sheet;
    if (cacheEnabled) {
        sheet = new spreadsheet_1.Spreadsheet(updateSpreadsheetCache.bind(null, cacheDb), setCacheStatus.bind(null, mainDb, cacheDb));
    }
    else {
        sheet = new spreadsheet_1.Spreadsheet();
    }
    (0, exceptions_1.captureBreadcrumb)({
        message: 'loading spreadsheet',
        category: 'server',
    });
    globalSheet = sheet;
    globalOnChange = onSheetChange;
    if (onSheetChange) {
        sheet.addEventListener('change', onSheetChange);
    }
    if (cacheEnabled && !isCacheDirty(mainDb, cacheDb)) {
        const cachedRows = await sqlite.runQuery(cacheDb, 'SELECT * FROM kvcache', [], true);
        log_1.logger.log(`Loaded spreadsheet from cache (${cachedRows.length} items)`);
        for (const row of cachedRows) {
            const parsed = JSON.parse(row.value);
            sheet.load(row.key, parsed);
        }
    }
    else {
        log_1.logger.log('Loading fresh spreadsheet');
        await loadUserBudgets(db);
    }
    (0, exceptions_1.captureBreadcrumb)({
        message: 'loaded spreadsheet',
        category: 'server',
    });
    return sheet;
}
function unloadSpreadsheet() {
    if (globalSheet) {
        // TODO: Should wait for the sheet to finish
        globalSheet.unload();
        globalSheet = null;
    }
    if (globalCacheDb) {
        sqlite.closeDatabase(globalCacheDb);
        globalCacheDb = null;
    }
}
async function reloadSpreadsheet(db) {
    if (globalSheet) {
        unloadSpreadsheet();
        return loadSpreadsheet(db, globalOnChange);
    }
}
async function loadUserBudgets(db) {
    const sheet = globalSheet;
    // TODO: Clear out the cache here so make sure future loads of the app
    // don't load any extra values that aren't set here
    const { value: budgetType = 'envelope' } = (await db.first('SELECT value from preferences WHERE id = ?', ['budgetType'])) ?? {};
    const table = budgetType === 'tracking' ? 'reflect_budgets' : 'zero_budgets';
    const budgets = await db.all(`
      SELECT * FROM ${table} b
      LEFT JOIN categories c ON c.id = b.category
      WHERE c.tombstone = 0
    `);
    sheet.startTransaction();
    // Load all the budget amounts and carryover values
    for (const budget of budgets) {
        if (budget.month && budget.category) {
            const sheetName = `budget${budget.month}`;
            sheet.set(`${sheetName}!budget-${budget.category}`, budget.amount);
            sheet.set(`${sheetName}!carryover-${budget.category}`, budget.carryover === 1 ? true : false);
            sheet.set(`${sheetName}!goal-${budget.category}`, budget.goal);
            sheet.set(`${sheetName}!long-goal-${budget.category}`, budget.long_goal);
        }
    }
    // For zero-based budgets, load the buffered amounts
    if (budgetType !== 'tracking') {
        const budgetMonths = await db.all('SELECT * FROM zero_budget_months');
        for (const budgetMonth of budgetMonths) {
            const sheetName = (0, months_1.sheetForMonth)(budgetMonth.id);
            sheet.set(`${sheetName}!buffered`, budgetMonth.buffered);
        }
    }
    sheet.endTransaction();
}
function getCell(sheet, name) {
    return globalSheet._getNode((0, util_1.resolveName)(sheet, name));
}
function getCellValue(sheet, name) {
    return globalSheet.getValue((0, util_1.resolveName)(sheet, name));
}
function startTransaction() {
    if (globalSheet) {
        globalSheet.startTransaction();
    }
}
function endTransaction() {
    if (globalSheet) {
        globalSheet.endTransaction();
    }
}
function waitOnSpreadsheet() {
    return new Promise(resolve => {
        if (globalSheet) {
            globalSheet.onFinish(resolve);
        }
        else {
            resolve(undefined);
        }
    });
}
//# sourceMappingURL=sheet.js.map