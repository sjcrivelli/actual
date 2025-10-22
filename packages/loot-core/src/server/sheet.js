"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var exceptions_1 = require("../platform/exceptions");
var log_1 = require("../platform/server/log");
var sqlite = require("../platform/server/sqlite");
var months_1 = require("../shared/months");
var Platform = require("../shared/platform");
var spreadsheet_1 = require("./spreadsheet/spreadsheet");
var util_1 = require("./spreadsheet/util");
var globalSheet;
var globalOnChange;
var globalCacheDb;
function get() {
    return globalSheet;
}
function updateSpreadsheetCache(rawDb, names) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sqlite.transaction(rawDb, function () {
                        names.forEach(function (name) {
                            var node = globalSheet._getNode(name);
                            // Don't cache query nodes yet
                            if (node.sql == null) {
                                sqlite.runQuery(rawDb, 'INSERT OR REPLACE INTO kvcache (key, value) VALUES (?, ?)', [name, JSON.stringify(node.value)]);
                            }
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setCacheStatus(mainDb, cacheDb, _a) {
    var clean = _a.clean;
    if (clean) {
        // Generate random number and stick in both places
        var num = Math.random() * 10000000;
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
    var rows = sqlite.runQuery(cacheDb, 'SELECT key FROM kvcache_key WHERE id = 1', [], true);
    var num = rows.length === 0 ? null : rows[0].key;
    if (num == null) {
        return true;
    }
    if (mainDb) {
        var rows_1 = sqlite.runQuery(mainDb, 'SELECT key FROM kvcache_key WHERE id = 1', [], true);
        if (rows_1.length === 0 || rows_1[0].key !== num) {
            return true;
        }
    }
    // Always also check if there is anything in `kvcache`. We ask for one item;
    // if we didn't get back anything it's empty so there is no cache
    rows = sqlite.runQuery(cacheDb, 'SELECT * FROM kvcache LIMIT 1', [], true);
    return rows.length === 0;
}
function loadSpreadsheet(db, onSheetChange) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheEnabled, mainDb, cacheDb, cachePath, sheet, cachedRows, _i, cachedRows_1, row, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheEnabled = process.env.NODE_ENV !== 'test';
                    mainDb = db.getDatabase();
                    if (!Platform.isBrowser && cacheEnabled) {
                        cachePath = db
                            .getDatabasePath()
                            .replace(/db\.sqlite$/, 'cache.sqlite');
                        globalCacheDb = cacheDb = sqlite.openDatabase(cachePath);
                        sqlite.execQuery(cacheDb, "\n        CREATE TABLE IF NOT EXISTS kvcache (key TEXT PRIMARY KEY, value TEXT);\n        CREATE TABLE IF NOT EXISTS kvcache_key (id INTEGER PRIMARY KEY, key REAL)\n      ");
                    }
                    else {
                        // All other platforms use the same database for cache
                        cacheDb = mainDb;
                    }
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
                    if (!(cacheEnabled && !isCacheDirty(mainDb, cacheDb))) return [3 /*break*/, 2];
                    return [4 /*yield*/, sqlite.runQuery(cacheDb, 'SELECT * FROM kvcache', [], true)];
                case 1:
                    cachedRows = _a.sent();
                    log_1.logger.log("Loaded spreadsheet from cache (".concat(cachedRows.length, " items)"));
                    for (_i = 0, cachedRows_1 = cachedRows; _i < cachedRows_1.length; _i++) {
                        row = cachedRows_1[_i];
                        parsed = JSON.parse(row.value);
                        sheet.load(row.key, parsed);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    log_1.logger.log('Loading fresh spreadsheet');
                    return [4 /*yield*/, loadUserBudgets(db)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    (0, exceptions_1.captureBreadcrumb)({
                        message: 'loaded spreadsheet',
                        category: 'server',
                    });
                    return [2 /*return*/, sheet];
            }
        });
    });
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
function reloadSpreadsheet(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (globalSheet) {
                unloadSpreadsheet();
                return [2 /*return*/, loadSpreadsheet(db, globalOnChange)];
            }
            return [2 /*return*/];
        });
    });
}
function loadUserBudgets(db) {
    return __awaiter(this, void 0, void 0, function () {
        var sheet, _a, budgetType, table, budgets, _i, budgets_1, budget, sheetName, budgetMonths, _b, budgetMonths_1, budgetMonth, sheetName;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    sheet = globalSheet;
                    return [4 /*yield*/, db.first('SELECT value from preferences WHERE id = ?', ['budgetType'])];
                case 1:
                    _a = ((_c = (_d.sent())) !== null && _c !== void 0 ? _c : {}).value, budgetType = _a === void 0 ? 'envelope' : _a;
                    table = budgetType === 'tracking' ? 'reflect_budgets' : 'zero_budgets';
                    return [4 /*yield*/, db.all("\n      SELECT * FROM ".concat(table, " b\n      LEFT JOIN categories c ON c.id = b.category\n      WHERE c.tombstone = 0\n    "))];
                case 2:
                    budgets = _d.sent();
                    sheet.startTransaction();
                    // Load all the budget amounts and carryover values
                    for (_i = 0, budgets_1 = budgets; _i < budgets_1.length; _i++) {
                        budget = budgets_1[_i];
                        if (budget.month && budget.category) {
                            sheetName = "budget".concat(budget.month);
                            sheet.set("".concat(sheetName, "!budget-").concat(budget.category), budget.amount);
                            sheet.set("".concat(sheetName, "!carryover-").concat(budget.category), budget.carryover === 1 ? true : false);
                            sheet.set("".concat(sheetName, "!goal-").concat(budget.category), budget.goal);
                            sheet.set("".concat(sheetName, "!long-goal-").concat(budget.category), budget.long_goal);
                        }
                    }
                    if (!(budgetType !== 'tracking')) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.all('SELECT * FROM zero_budget_months')];
                case 3:
                    budgetMonths = _d.sent();
                    for (_b = 0, budgetMonths_1 = budgetMonths; _b < budgetMonths_1.length; _b++) {
                        budgetMonth = budgetMonths_1[_b];
                        sheetName = (0, months_1.sheetForMonth)(budgetMonth.id);
                        sheet.set("".concat(sheetName, "!buffered"), budgetMonth.buffered);
                    }
                    _d.label = 4;
                case 4:
                    sheet.endTransaction();
                    return [2 /*return*/];
            }
        });
    });
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
    return new Promise(function (resolve) {
        if (globalSheet) {
            globalSheet.onFinish(resolve);
        }
        else {
            resolve(undefined);
        }
    });
}
