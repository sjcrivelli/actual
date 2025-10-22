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
exports.runMigrations = runMigrations;
exports.applyResurrectedData = applyResurrectedData;
exports.performUpdateWorkflow = performUpdateWorkflow;
var migrations = require("./migrate/migrations");
var db = require("./db/index");
// --------------------------------------------------------
// Database Migration
// --------------------------------------------------------
function runMigrations() {
    return __awaiter(this, void 0, void 0, function () {
        var database, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = db.getDatabase();
                    if (!database) {
                        throw new Error('Database instance is null – cannot run migrations');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, migrations.migrate(database)];
                case 2:
                    _a.sent();
                    console.log('✅ Database migrations complete');
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    if (e_1 instanceof Error) {
                        console.error('❌ Migration error:', e_1.message);
                    }
                    else {
                        console.error('❌ Unknown migration error:', e_1);
                    }
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// --------------------------------------------------------
// Data Resync Handling
// --------------------------------------------------------
/**
 * Apply resurrected data updates to the database.
 */
function applyResurrectedData(resurrect) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, resurrect_1, desc, e_2;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    results = [];
                    _i = 0, resurrect_1 = resurrect;
                    _c.label = 1;
                case 1:
                    if (!(_i < resurrect_1.length)) return [3 /*break*/, 6];
                    desc = resurrect_1[_i];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    // Update the value in the table dynamically
                    return [4 /*yield*/, db.update(desc.dataset, (_a = {
                                id: desc.row
                            },
                            _a[desc.column] = desc.value,
                            _a.timestamp = desc.timestamp,
                            _a))];
                case 3:
                    // Update the value in the table dynamically
                    _c.sent();
                    results.push({
                        dataset: desc.dataset,
                        row: desc.row,
                        column: desc.column,
                        value: desc.value,
                        timestamp: (_b = desc.timestamp) !== null && _b !== void 0 ? _b : null,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _c.sent();
                    if (e_2 instanceof Error) {
                        console.error("Error applying resurrected data to ".concat(desc.dataset, ":").concat(desc.row, ":").concat(desc.column), e_2.message);
                    }
                    else {
                        console.error('Unknown error applying resurrected data:', e_2);
                    }
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, results];
            }
        });
    });
}
// --------------------------------------------------------
// Update Workflow
// --------------------------------------------------------
function performUpdateWorkflow() {
    return __awaiter(this, void 0, void 0, function () {
        var idsPerTable, prefsToSet, tables, _i, tables_1, table, ids, rows, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔄 Starting update workflow...');
                    return [4 /*yield*/, runMigrations()];
                case 1:
                    _a.sent();
                    idsPerTable = {};
                    prefsToSet = {};
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    tables = Object.keys(idsPerTable);
                    _i = 0, tables_1 = tables;
                    _a.label = 3;
                case 3:
                    if (!(_i < tables_1.length)) return [3 /*break*/, 6];
                    table = tables_1[_i];
                    ids = idsPerTable[table];
                    return [4 /*yield*/, fetchAll(table, ids)];
                case 4:
                    rows = _a.sent();
                    console.log("Fetched ".concat(rows.length, " rows from ").concat(table));
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // Apply preference updates (example)
                    // TODO: Implement preference update logic using correct db API
                    console.log('✅ Preferences update logic placeholder');
                    return [3 /*break*/, 8];
                case 7:
                    e_3 = _a.sent();
                    if (e_3 instanceof Error) {
                        console.error('Error during update workflow:', e_3.message);
                    }
                    else {
                        console.error('Unknown update workflow error:', e_3);
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// --------------------------------------------------------
// Internal Utility
// --------------------------------------------------------
function fetchAll(table, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var results, _i, ids_1, id, result, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    _i = 0, ids_1 = ids;
                    _a.label = 1;
                case 1:
                    if (!(_i < ids_1.length)) return [3 /*break*/, 6];
                    id = ids_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, db.select(table, id)];
                case 3:
                    result = _a.sent();
                    if (result)
                        results.push(result);
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    if (e_4 instanceof Error) {
                        console.error("Error fetching ".concat(table, ":").concat(id, " \u2192 ").concat(e_4.message));
                    }
                    else {
                        console.error("Unknown error fetching ".concat(table, ":").concat(id), e_4);
                    }
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, results];
            }
        });
    });
}
