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
exports.withMigrationsDir = withMigrationsDir;
exports.getMigrationsDir = getMigrationsDir;
exports.getUpMigration = getUpMigration;
exports.getAppliedMigrations = getAppliedMigrations;
exports.getMigrationList = getMigrationList;
exports.getPending = getPending;
exports.applyMigration = applyMigration;
exports.migrate = migrate;
var _1632571489012_remove_cache_1 = require("../../../migrations/1632571489012_remove_cache");
var _1722717601000_reports_move_selected_categories_1 = require("../../../migrations/1722717601000_reports_move_selected_categories");
var _1722804019000_create_dashboard_table_1 = require("../../../migrations/1722804019000_create_dashboard_table");
var _1723665565000_prefs_1 = require("../../../migrations/1723665565000_prefs");
var fs = require("../../platform/server/fs");
var log_1 = require("../../platform/server/log");
var sqlite = require("../../platform/server/sqlite");
var prefs = require("../prefs");
var MIGRATIONS_DIR = fs.migrationsPath;
var javascriptMigrations = {
    1632571489012: _1632571489012_remove_cache_1.default,
    1722717601000: _1722717601000_reports_move_selected_categories_1.default,
    1722804019000: _1722804019000_create_dashboard_table_1.default,
    1723665565000: _1723665565000_prefs_1.default,
};
function withMigrationsDir(dir, func) {
    return __awaiter(this, void 0, void 0, function () {
        var oldDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oldDir = MIGRATIONS_DIR;
                    MIGRATIONS_DIR = dir;
                    return [4 /*yield*/, func()];
                case 1:
                    _a.sent();
                    MIGRATIONS_DIR = oldDir;
                    return [2 /*return*/];
            }
        });
    });
}
function getMigrationsDir() {
    return MIGRATIONS_DIR;
}
function getMigrationId(name) {
    return parseInt(name.match(/^(\d)+/)[0]);
}
function getUpMigration(id, names) {
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var m = names_1[_i];
        if (getMigrationId(m) === id) {
            return m;
        }
    }
}
function patchBadMigrations(db) {
    return __awaiter(this, void 0, void 0, function () {
        var badFiltersMigration, newFiltersMigration, appliedIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    badFiltersMigration = 1685375406832;
                    newFiltersMigration = 1688749527273;
                    return [4 /*yield*/, getAppliedMigrations(db)];
                case 1:
                    appliedIds = _a.sent();
                    if (!appliedIds.includes(badFiltersMigration)) return [3 /*break*/, 4];
                    return [4 /*yield*/, sqlite.runQuery(db, 'DELETE FROM __migrations__ WHERE id = ?', [
                            badFiltersMigration,
                        ])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sqlite.runQuery(db, 'INSERT INTO __migrations__ (id) VALUES (?)', [
                            newFiltersMigration,
                        ])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAppliedMigrations(db) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sqlite.runQuery(db, 'SELECT * FROM __migrations__ ORDER BY id ASC', [], true)];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) { return row.id; })];
            }
        });
    });
}
function getMigrationList(migrationsDir) {
    return __awaiter(this, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.listDir(migrationsDir)];
                case 1:
                    files = _a.sent();
                    return [2 /*return*/, files
                            .filter(function (name) { return name.match(/(\.sql|\.js)$/); })
                            .sort(function (m1, m2) {
                            var id1 = getMigrationId(m1);
                            var id2 = getMigrationId(m2);
                            if (id1 < id2) {
                                return -1;
                            }
                            else if (id1 > id2) {
                                return 1;
                            }
                            return 0;
                        })];
            }
        });
    });
}
function getPending(appliedIds, all) {
    return all.filter(function (name) {
        var id = getMigrationId(name);
        return appliedIds.indexOf(id) === -1;
    });
}
function applyJavaScript(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        var dbInterface, run;
        var _a;
        return __generator(this, function (_b) {
            dbInterface = {
                runQuery: function (query, params, fetchAll) {
                    return sqlite.runQuery(db, query, params, fetchAll);
                },
                execQuery: function (query) { return sqlite.execQuery(db, query); },
                transaction: function (func) { return sqlite.transaction(db, func); },
            };
            if (javascriptMigrations[id] == null) {
                throw new Error('Could not find JS migration code to run for ' + id);
            }
            run = javascriptMigrations[id];
            return [2 /*return*/, run(dbInterface, {
                    fs: fs,
                    fileId: (_a = prefs.getPrefs()) === null || _a === void 0 ? void 0 : _a.id,
                })];
        });
    });
}
function applySql(db, sql) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sqlite.execQuery(db, sql)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    log_1.logger.log('Error applying sql:', sql);
                    throw e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function applyMigration(db, name, migrationsDir) {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFile(fs.join(migrationsDir, name))];
                case 1:
                    code = _a.sent();
                    if (!name.match(/\.js$/)) return [3 /*break*/, 3];
                    return [4 /*yield*/, applyJavaScript(db, getMigrationId(name))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, applySql(db, code)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, sqlite.runQuery(db, 'INSERT INTO __migrations__ (id) VALUES (?)', [
                        getMigrationId(name),
                    ])];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkDatabaseValidity(appliedIds, available) {
    for (var i = 0; i < appliedIds.length; i++) {
        if (i >= available.length ||
            appliedIds[i] !== getMigrationId(available[i])) {
            log_1.logger.error('Database is out of sync with migrations:', {
                appliedIds: appliedIds,
                available: available,
            });
            throw new Error('out-of-sync-migrations');
        }
    }
}
function migrate(db) {
    return __awaiter(this, void 0, void 0, function () {
        var appliedIds, available, pending, _i, pending_1, migration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, patchBadMigrations(db)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getAppliedMigrations(db)];
                case 2:
                    appliedIds = _a.sent();
                    return [4 /*yield*/, getMigrationList(MIGRATIONS_DIR)];
                case 3:
                    available = _a.sent();
                    checkDatabaseValidity(appliedIds, available);
                    pending = getPending(appliedIds, available);
                    _i = 0, pending_1 = pending;
                    _a.label = 4;
                case 4:
                    if (!(_i < pending_1.length)) return [3 /*break*/, 7];
                    migration = pending_1[_i];
                    return [4 /*yield*/, applyMigration(db, migration, MIGRATIONS_DIR)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, pending];
            }
        });
    });
}
