"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDateRepr = exports.toDateRepr = void 0;
exports.getDatabasePath = getDatabasePath;
exports.openDatabase = openDatabase;
exports.closeDatabase = closeDatabase;
exports.setDatabase = setDatabase;
exports.getDatabase = getDatabase;
exports.loadClock = loadClock;
exports.runQuery = runQuery;
exports.execQuery = execQuery;
exports.cache = cache;
exports.transaction = transaction;
exports.asyncTransaction = asyncTransaction;
exports.all = all;
exports.first = first;
exports.firstSync = firstSync;
exports.run = run;
exports.select = select;
exports.update = update;
exports.insertWithUUID = insertWithUUID;
exports.insert = insert;
exports.delete_ = delete_;
exports.deleteAll = deleteAll;
exports.selectWithSchema = selectWithSchema;
exports.selectFirstWithSchema = selectFirstWithSchema;
exports.insertWithSchema = insertWithSchema;
exports.updateWithSchema = updateWithSchema;
exports.getCategories = getCategories;
exports.getCategoriesGrouped = getCategoriesGrouped;
exports.insertCategoryGroup = insertCategoryGroup;
exports.updateCategoryGroup = updateCategoryGroup;
exports.moveCategoryGroup = moveCategoryGroup;
exports.deleteCategoryGroup = deleteCategoryGroup;
exports.insertCategory = insertCategory;
exports.updateCategory = updateCategory;
exports.moveCategory = moveCategory;
exports.deleteCategory = deleteCategory;
exports.getPayee = getPayee;
exports.getAccount = getAccount;
exports.insertPayee = insertPayee;
exports.deletePayee = deletePayee;
exports.deleteTransferPayee = deleteTransferPayee;
exports.updatePayee = updatePayee;
exports.mergePayees = mergePayees;
exports.getPayees = getPayees;
exports.getCommonPayees = getCommonPayees;
exports.syncGetOrphanedPayees = syncGetOrphanedPayees;
exports.getOrphanedPayees = getOrphanedPayees;
exports.getPayeeByName = getPayeeByName;
exports.getAccounts = getAccounts;
exports.insertAccount = insertAccount;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
exports.moveAccount = moveAccount;
exports.getTransaction = getTransaction;
exports.getTransactions = getTransactions;
exports.insertTransaction = insertTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
exports.getTags = getTags;
exports.getAllTags = getAllTags;
exports.insertTag = insertTag;
exports.deleteTag = deleteTag;
exports.updateTag = updateTag;
exports.findTags = findTags;
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var lru_cache_1 = require("lru-cache");
var uuid_1 = require("uuid");
var fs = require("../../platform/server/fs");
var sqlite = require("../../platform/server/sqlite");
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
var aql_1 = require("../aql");
var models_1 = require("../models");
var sync_1 = require("../sync");
var sort_1 = require("./sort");
__exportStar(require("./types"), exports);
var models_2 = require("../models");
Object.defineProperty(exports, "toDateRepr", { enumerable: true, get: function () { return models_2.toDateRepr; } });
Object.defineProperty(exports, "fromDateRepr", { enumerable: true, get: function () { return models_2.fromDateRepr; } });
var dbPath = null;
var db = null;
// Util
function getDatabasePath() {
    return dbPath;
}
function openDatabase(id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!db) return [3 /*break*/, 2];
                    return [4 /*yield*/, sqlite.closeDatabase(db)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    dbPath = fs.join(fs.getBudgetDir(id), 'db.sqlite');
                    _a = setDatabase;
                    return [4 /*yield*/, sqlite.openDatabase(dbPath)];
                case 3:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
function closeDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!db) return [3 /*break*/, 2];
                    return [4 /*yield*/, sqlite.closeDatabase(db)];
                case 1:
                    _a.sent();
                    setDatabase(null);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function setDatabase(db_) {
    db = db_;
    resetQueryCache();
}
function getDatabase() {
    return db;
}
function loadClock() {
    return __awaiter(this, void 0, void 0, function () {
        var row, clock, timestamp, clock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, first('SELECT * FROM messages_clock')];
                case 1:
                    row = _a.sent();
                    if (!row) return [3 /*break*/, 2];
                    clock = (0, crdt_1.deserializeClock)(row.clock);
                    (0, crdt_1.setClock)(clock);
                    return [3 /*break*/, 4];
                case 2:
                    timestamp = new crdt_1.Timestamp(0, 0, (0, crdt_1.makeClientId)());
                    clock = (0, crdt_1.makeClock)(timestamp);
                    (0, crdt_1.setClock)(clock);
                    return [4 /*yield*/, runQuery('INSERT INTO messages_clock (id, clock) VALUES (?, ?)', [
                            1,
                            (0, crdt_1.serializeClock)(clock),
                        ])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function runQuery(sql, params, fetchAll) {
    if (fetchAll) {
        return sqlite.runQuery(db, sql, params, true);
    }
    else {
        return sqlite.runQuery(db, sql, params, false);
    }
}
function execQuery(sql) {
    sqlite.execQuery(db, sql);
}
// This manages an LRU cache of prepared query statements. This is
// only needed in hot spots when you are running lots of queries.
var _queryCache = new lru_cache_1.LRUCache({ max: 100 });
function cache(sql) {
    var cached = _queryCache.get(sql);
    if (cached) {
        return cached;
    }
    var prepared = sqlite.prepare(db, sql);
    _queryCache.set(sql, prepared);
    return prepared;
}
function resetQueryCache() {
    _queryCache = new lru_cache_1.LRUCache({ max: 100 });
}
function transaction(fn) {
    return sqlite.transaction(db, fn);
}
function asyncTransaction(fn) {
    return sqlite.asyncTransaction(db, fn);
}
// This function is marked as async because `runQuery` is no longer
// async. We return a promise here until we've audited all the code to
// make sure nothing calls `.then` on this.
function all(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, runQuery(sql, params, true)];
        });
    });
}
function first(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runQuery(sql, params, true)];
                case 1:
                    arr = _a.sent();
                    return [2 /*return*/, arr.length === 0 ? null : arr[0]];
            }
        });
    });
}
// The underlying sql system is now sync, but we can't update `first` yet
// without auditing all uses of it
function firstSync(sql, params) {
    var arr = runQuery(sql, params, true);
    return arr.length === 0 ? null : arr[0];
}
// This function is marked as async because `runQuery` is no longer
// async. We return a promise here until we've audited all the code to
// make sure nothing calls `.then` on this.
function run(sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, runQuery(sql, params)];
        });
    });
}
function select(table, id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runQuery('SELECT * FROM ' + table + ' WHERE id = ?', [id], true)];
                case 1:
                    rows = _a.sent();
                    // TODO: In the next phase, we will make this function generic
                    // and pass the type of the return type to `runQuery`.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return [2 /*return*/, rows[0]];
            }
        });
    });
}
function update(table, params) {
    return __awaiter(this, void 0, void 0, function () {
        var fields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fields = Object.keys(params).filter(function (k) { return k !== 'id'; });
                    if (params.id == null) {
                        throw new Error('update: id is required');
                    }
                    return [4 /*yield*/, (0, sync_1.sendMessages)(fields.map(function (k) {
                            return {
                                dataset: table,
                                row: params.id,
                                column: k,
                                value: params[k],
                                timestamp: crdt_1.Timestamp.send(),
                            };
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function insertWithUUID(table, row) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!row.id) {
                        row = __assign(__assign({}, row), { id: (0, uuid_1.v4)() });
                    }
                    return [4 /*yield*/, insert(table, row)];
                case 1:
                    _a.sent();
                    // We can't rely on the return value of insert because if the
                    // primary key is text, sqlite returns the internal row id which we
                    // don't care about. We want to return the generated UUID.
                    return [2 /*return*/, row.id];
            }
        });
    });
}
function insert(table, row) {
    return __awaiter(this, void 0, void 0, function () {
        var fields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fields = Object.keys(row).filter(function (k) { return k !== 'id'; });
                    if (row.id == null) {
                        throw new Error('insert: id is required');
                    }
                    return [4 /*yield*/, (0, sync_1.sendMessages)(fields.map(function (k) {
                            return {
                                dataset: table,
                                row: row.id,
                                column: k,
                                value: row[k],
                                timestamp: crdt_1.Timestamp.send(),
                            };
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function delete_(table, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sync_1.sendMessages)([
                        {
                            dataset: table,
                            row: id,
                            column: 'tombstone',
                            value: 1,
                            timestamp: crdt_1.Timestamp.send(),
                        },
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteAll(table) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, all("\n    SELECT id FROM ".concat(table, " WHERE tombstone = 0\n  "))];
                case 1:
                    rows = _a.sent();
                    return [4 /*yield*/, Promise.all(rows.map(function (_a) {
                            var id = _a.id;
                            return delete_(table, id);
                        }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function selectWithSchema(table, sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, convertedRows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, runQuery(sql, params, true)];
                case 1:
                    rows = _a.sent();
                    convertedRows = rows
                        .map(function (row) { return (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, table, row); })
                        .filter(Boolean);
                    // TODO: Make convertFromSelect generic so we don't need this cast
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return [2 /*return*/, convertedRows];
            }
        });
    });
}
function selectFirstWithSchema(table, sql, params) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, selectWithSchema(table, sql, params)];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.length > 0 ? rows[0] : null];
            }
        });
    });
}
function insertWithSchema(table, row) {
    // Even though `insertWithUUID` does this, we need to do it here so
    // the schema validation passes
    if (!row.id) {
        row = __assign(__assign({}, row), { id: (0, uuid_1.v4)() });
    }
    return insertWithUUID(table, (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, table, row));
}
function updateWithSchema(table, fields) {
    return update(table, (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, table, fields));
}
// Data-specific functions. Ideally this would be split up into
// different files
function getCategories(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var whereIn, query, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    whereIn = ids ? "c.id IN (".concat(toSqlQueryParameters(ids), ") AND") : '';
                    query = "SELECT c.* FROM categories c WHERE ".concat(whereIn, " c.tombstone = 0 ORDER BY c.sort_order, c.id");
                    if (!ids) return [3 /*break*/, 2];
                    return [4 /*yield*/, all(query, __spreadArray([], ids, true))];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, all(query)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/, _a];
            }
        });
    });
}
function getCategoriesGrouped(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryGroupWhereIn, categoryGroupQuery, categoryWhereIn, categoryQuery, groups, _a, categories, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    categoryGroupWhereIn = ids
                        ? "cg.id IN (".concat(toSqlQueryParameters(ids), ") AND")
                        : '';
                    categoryGroupQuery = "SELECT cg.* FROM category_groups cg WHERE ".concat(categoryGroupWhereIn, " cg.tombstone = 0\n    ORDER BY cg.is_income, cg.sort_order, cg.id");
                    categoryWhereIn = ids
                        ? "c.cat_group IN (".concat(toSqlQueryParameters(ids), ") AND")
                        : '';
                    categoryQuery = "SELECT c.* FROM categories c WHERE ".concat(categoryWhereIn, " c.tombstone = 0\n    ORDER BY c.sort_order, c.id");
                    if (!ids) return [3 /*break*/, 2];
                    return [4 /*yield*/, all(categoryGroupQuery, __spreadArray([], ids, true))];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, all(categoryGroupQuery)];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    groups = _a;
                    if (!ids) return [3 /*break*/, 6];
                    return [4 /*yield*/, all(categoryQuery, __spreadArray([], ids, true))];
                case 5:
                    _b = _c.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, all(categoryQuery)];
                case 7:
                    _b = _c.sent();
                    _c.label = 8;
                case 8:
                    categories = _b;
                    return [2 /*return*/, groups.map(function (group) { return (__assign(__assign({}, group), { categories: categories.filter(function (c) { return c.cat_group === group.id; }) })); })];
            }
        });
    });
}
function insertCategoryGroup(group) {
    return __awaiter(this, void 0, void 0, function () {
        var existingGroup, lastGroup, sort_order, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, first("SELECT id, name, hidden FROM category_groups WHERE UPPER(name) = ? and tombstone = 0 LIMIT 1", [group.name.toUpperCase()])];
                case 1:
                    existingGroup = _a.sent();
                    if (existingGroup) {
                        throw new Error("A ".concat(existingGroup.hidden ? 'hidden ' : '', "\u2019").concat(existingGroup.name, "\u2019 category group already exists."));
                    }
                    return [4 /*yield*/, first("\n    SELECT sort_order FROM category_groups WHERE tombstone = 0 ORDER BY sort_order DESC, id DESC LIMIT 1\n  ")];
                case 2:
                    lastGroup = _a.sent();
                    sort_order = (lastGroup ? lastGroup.sort_order : 0) + sort_1.SORT_INCREMENT;
                    group = __assign(__assign({}, models_1.categoryGroupModel.validate(group)), { sort_order: sort_order });
                    return [4 /*yield*/, insertWithUUID('category_groups', group)];
                case 3:
                    id = _a.sent();
                    return [2 /*return*/, id];
            }
        });
    });
}
function updateCategoryGroup(group) {
    group = models_1.categoryGroupModel.validate(group, { update: true });
    return update('category_groups', group);
}
function moveCategoryGroup(id, targetId) {
    return __awaiter(this, void 0, void 0, function () {
        var groups, _a, updates, sort_order, _i, updates_1, info;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, all("SELECT id, sort_order FROM category_groups WHERE tombstone = 0 ORDER BY sort_order, id")];
                case 1:
                    groups = _b.sent();
                    _a = (0, sort_1.shoveSortOrders)(groups, targetId), updates = _a.updates, sort_order = _a.sort_order;
                    _i = 0, updates_1 = updates;
                    _b.label = 2;
                case 2:
                    if (!(_i < updates_1.length)) return [3 /*break*/, 5];
                    info = updates_1[_i];
                    return [4 /*yield*/, update('category_groups', info)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, update('category_groups', { id: id, sort_order: sort_order })];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCategoryGroup(group, transferId) {
    return __awaiter(this, void 0, void 0, function () {
        var categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, all('SELECT * FROM categories WHERE cat_group = ?', [group.id])];
                case 1:
                    categories = _a.sent();
                    // Delete all the categories within a group
                    return [4 /*yield*/, Promise.all(categories.map(function (cat) { return deleteCategory(cat, transferId); }))];
                case 2:
                    // Delete all the categories within a group
                    _a.sent();
                    return [4 /*yield*/, delete_('category_groups', group.id)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function insertCategory(category_1) {
    return __awaiter(this, arguments, void 0, function (category, _a) {
        var sort_order, id_;
        var _this = this;
        var _b = _a === void 0 ? { atEnd: undefined } : _a, atEnd = _b.atEnd;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var existingCatInGroup, lastCat, categories, _a, updates, order, _i, updates_2, info, id;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, first("SELECT id FROM categories WHERE cat_group = ? and UPPER(name) = ? and tombstone = 0 LIMIT 1", [category.cat_group, category.name.toUpperCase()])];
                                case 1:
                                    existingCatInGroup = _b.sent();
                                    if (existingCatInGroup) {
                                        throw new Error("Category \u2018".concat(category.name, "\u2019 already exists in group \u2018").concat(category.cat_group, "\u2019"));
                                    }
                                    if (!atEnd) return [3 /*break*/, 3];
                                    return [4 /*yield*/, first("\n        SELECT sort_order FROM categories WHERE tombstone = 0 ORDER BY sort_order DESC, id DESC LIMIT 1\n      ")];
                                case 2:
                                    lastCat = _b.sent();
                                    sort_order = (lastCat ? lastCat.sort_order : 0) + sort_1.SORT_INCREMENT;
                                    return [3 /*break*/, 9];
                                case 3: return [4 /*yield*/, all("SELECT id, sort_order FROM categories WHERE cat_group = ? AND tombstone = 0 ORDER BY sort_order, id", [category.cat_group])];
                                case 4:
                                    categories = _b.sent();
                                    _a = (0, sort_1.shoveSortOrders)(categories, categories.length > 0 ? categories[0].id : null), updates = _a.updates, order = _a.sort_order;
                                    _i = 0, updates_2 = updates;
                                    _b.label = 5;
                                case 5:
                                    if (!(_i < updates_2.length)) return [3 /*break*/, 8];
                                    info = updates_2[_i];
                                    return [4 /*yield*/, update('categories', info)];
                                case 6:
                                    _b.sent();
                                    _b.label = 7;
                                case 7:
                                    _i++;
                                    return [3 /*break*/, 5];
                                case 8:
                                    sort_order = order;
                                    _b.label = 9;
                                case 9:
                                    category = __assign(__assign({}, models_1.categoryModel.validate(category)), { sort_order: sort_order });
                                    return [4 /*yield*/, insertWithUUID('categories', category)];
                                case 10:
                                    id = _b.sent();
                                    // Create an entry in the mapping table that points it to itself
                                    return [4 /*yield*/, insert('category_mapping', { id: id, transferId: id })];
                                case 11:
                                    // Create an entry in the mapping table that points it to itself
                                    _b.sent();
                                    id_ = id;
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/, id_];
            }
        });
    });
}
function updateCategory(category) {
    category = models_1.categoryModel.validate(category, { update: true });
    // Change from cat_group to group because category AQL schema named it group.
    // const { cat_group: group, ...rest } = category;
    return update('categories', category);
}
function moveCategory(id, groupId, targetId) {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _a, updates, sort_order, _i, updates_3, info;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!groupId) {
                        throw new Error('moveCategory: groupId is required');
                    }
                    return [4 /*yield*/, all("SELECT id, sort_order FROM categories WHERE cat_group = ? AND tombstone = 0 ORDER BY sort_order, id", [groupId])];
                case 1:
                    categories = _b.sent();
                    _a = (0, sort_1.shoveSortOrders)(categories, targetId), updates = _a.updates, sort_order = _a.sort_order;
                    _i = 0, updates_3 = updates;
                    _b.label = 2;
                case 2:
                    if (!(_i < updates_3.length)) return [3 /*break*/, 5];
                    info = updates_3[_i];
                    return [4 /*yield*/, update('categories', info)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, update('categories', { id: id, sort_order: sort_order, cat_group: groupId })];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCategory(category, transferId) {
    return __awaiter(this, void 0, void 0, function () {
        var existingTransfers, _i, existingTransfers_1, mapping;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!transferId) return [3 /*break*/, 7];
                    return [4 /*yield*/, all('SELECT * FROM category_mapping WHERE transferId = ?', [category.id])];
                case 1:
                    existingTransfers = _a.sent();
                    _i = 0, existingTransfers_1 = existingTransfers;
                    _a.label = 2;
                case 2:
                    if (!(_i < existingTransfers_1.length)) return [3 /*break*/, 5];
                    mapping = existingTransfers_1[_i];
                    return [4 /*yield*/, update('category_mapping', {
                            id: mapping.id,
                            transferId: transferId,
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // Finally, map the category we're about to delete to the new one
                return [4 /*yield*/, update('category_mapping', { id: category.id, transferId: transferId })];
                case 6:
                    // Finally, map the category we're about to delete to the new one
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, delete_('categories', category.id)];
            }
        });
    });
}
function getPayee(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, first("SELECT * FROM payees WHERE id = ?", [id])];
        });
    });
}
function getAccount(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, first("SELECT * FROM accounts WHERE id = ?", [id])];
        });
    });
}
function insertPayee(payee) {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payee = models_1.payeeModel.validate(payee);
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, insertWithUUID('payees', payee)];
                                    case 1:
                                        id = _a.sent();
                                        return [4 /*yield*/, insert('payee_mapping', { id: id, targetId: id })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, id];
            }
        });
    });
}
function deletePayee(payee) {
    return __awaiter(this, void 0, void 0, function () {
        var transfer_acct;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, first('SELECT * FROM payees WHERE id = ?', [payee.id])];
                case 1:
                    transfer_acct = (_a.sent()).transfer_acct;
                    if (transfer_acct) {
                        // You should never be able to delete transfer payees
                        return [2 /*return*/];
                    }
                    // let mappings = await all('SELECT id FROM payee_mapping WHERE targetId = ?', [
                    //   payee.id
                    // ]);
                    // await Promise.all(
                    //   mappings.map(m => update('payee_mapping', { id: m.id, targetId: null }))
                    // );
                    return [2 /*return*/, delete_('payees', payee.id)];
            }
        });
    });
}
function deleteTransferPayee(payee) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // This allows deleting transfer payees
            return [2 /*return*/, delete_('payees', payee.id)];
        });
    });
}
function updatePayee(payee) {
    payee = models_1.payeeModel.validate(payee, { update: true });
    return update('payees', payee);
}
function mergePayees(target, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var dbPayees, payees;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, all('SELECT * FROM payees')];
                case 1:
                    dbPayees = _a.sent();
                    payees = (0, util_1.groupById)(dbPayees);
                    // Filter out any transfer payees
                    if (payees[target].transfer_acct != null) {
                        return [2 /*return*/];
                    }
                    ids = ids.filter(function (id) { return payees[id].transfer_acct == null; });
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(ids.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                                            var mappings;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, all('SELECT id FROM payee_mapping WHERE targetId = ?', [id])];
                                                    case 1:
                                                        mappings = _a.sent();
                                                        return [4 /*yield*/, Promise.all(mappings.map(function (m) {
                                                                return update('payee_mapping', { id: m.id, targetId: target });
                                                            }))];
                                                    case 2:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, Promise.all(ids.map(function (id) {
                                                return Promise.all([
                                                    update('payee_mapping', { id: id, targetId: target }),
                                                    delete_('payees', id),
                                                ]);
                                            }))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getPayees() {
    return all("\n    SELECT p.*, COALESCE(a.name, p.name) AS name FROM payees p\n    LEFT JOIN accounts a ON (p.transfer_acct = a.id AND a.tombstone = 0)\n    WHERE p.tombstone = 0 AND (p.transfer_acct IS NULL OR a.id IS NOT NULL)\n    ORDER BY p.transfer_acct IS NULL DESC, p.name COLLATE NOCASE, a.offbudget, a.sort_order\n  ");
}
function getCommonPayees() {
    var twelveWeeksAgo = (0, models_1.toDateRepr)(monthUtils.subWeeks(monthUtils.currentDate(), 12));
    var limit = 10;
    return all("\n    SELECT     p.id as id, p.name as name, p.favorite as favorite,\n      p.category as category, TRUE as common, NULL as transfer_acct,\n    count(*) as c,\n    max(t.date) as latest\n    FROM payees p\n    LEFT JOIN v_transactions_internal_alive t on t.payee == p.id\n    WHERE LENGTH(p.name) > 0\n    AND p.tombstone = 0\n    AND t.date > ".concat(twelveWeeksAgo, "\n    GROUP BY p.id\n    ORDER BY c DESC ,p.transfer_acct IS NULL DESC, p.name\n    COLLATE NOCASE\n    LIMIT ").concat(limit, "\n  "));
}
/* eslint-disable actual/typography */
var orphanedPayeesQuery = "\n  SELECT p.id\n  FROM payees p\n    LEFT JOIN payee_mapping pm ON pm.id = p.id\n    LEFT JOIN v_transactions_internal_alive t ON t.payee = pm.targetId\n  WHERE p.tombstone = 0\n    AND p.transfer_acct IS NULL\n    AND t.id IS NULL\n    AND NOT EXISTS (\n      SELECT 1\n      FROM rules r,\n      json_each(r.conditions) as cond\n      WHERE r.tombstone = 0\n        AND json_extract(cond.value, '$.field') = 'description'\n        AND json_extract(cond.value, '$.value') = pm.targetId\n    );\n";
/* eslint-enable actual/typography */
function syncGetOrphanedPayees() {
    return all(orphanedPayeesQuery);
}
function getOrphanedPayees() {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, all(orphanedPayeesQuery)];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) { return row.id; })];
            }
        });
    });
}
function getPayeeByName(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, first("SELECT * FROM payees WHERE UNICODE_LOWER(name) = ? AND tombstone = 0", [name.toLowerCase()])];
        });
    });
}
function getAccounts() {
    return all("SELECT a.*, b.name as bankName, b.id as bankId FROM accounts a\n       LEFT JOIN banks b ON a.bank = b.id\n       WHERE a.tombstone = 0\n       ORDER BY sort_order, name");
}
function insertAccount(account) {
    return __awaiter(this, void 0, void 0, function () {
        var accounts, sort_order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, all('SELECT * FROM accounts WHERE offbudget = ? ORDER BY sort_order, name', [account.offbudget ? 1 : 0])];
                case 1:
                    accounts = _a.sent();
                    sort_order = (0, sort_1.shoveSortOrders)(accounts).sort_order;
                    account = models_1.accountModel.validate(__assign(__assign({}, account), { sort_order: sort_order }));
                    return [2 /*return*/, insertWithUUID('accounts', account)];
            }
        });
    });
}
function updateAccount(account) {
    account = models_1.accountModel.validate(account, { update: true });
    return update('accounts', account);
}
function deleteAccount(account) {
    return delete_('accounts', account.id);
}
function moveAccount(id, targetId) {
    return __awaiter(this, void 0, void 0, function () {
        var account, accounts, _a, updates, sort_order;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, first('SELECT * FROM accounts WHERE id = ?', [id])];
                case 1:
                    account = _b.sent();
                    if (!account.closed) return [3 /*break*/, 3];
                    return [4 /*yield*/, all("SELECT id, sort_order FROM accounts WHERE closed = 1 ORDER BY sort_order, name")];
                case 2:
                    accounts = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, all("SELECT id, sort_order FROM accounts WHERE tombstone = 0 AND offbudget = ? ORDER BY sort_order, name", [account.offbudget ? 1 : 0])];
                case 4:
                    accounts = _b.sent();
                    _b.label = 5;
                case 5:
                    _a = (0, sort_1.shoveSortOrders)(accounts, targetId), updates = _a.updates, sort_order = _a.sort_order;
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, updates_4, info;
                            return __generator(this, function (_a) {
                                for (_i = 0, updates_4 = updates; _i < updates_4.length; _i++) {
                                    info = updates_4[_i];
                                    update('accounts', info);
                                }
                                update('accounts', { id: id, sort_order: sort_order });
                                return [2 /*return*/];
                            });
                        }); })];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getTransaction(id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, selectWithSchema('transactions', 'SELECT * FROM v_transactions WHERE id = ?', [id])];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows[0]];
            }
        });
    });
}
function getTransactions(accountId) {
    var arguments_1 = arguments;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (arguments_1.length > 1) {
                throw new Error('`getTransactions` was given a second argument, it now only takes a single argument `accountId`');
            }
            return [2 /*return*/, selectWithSchema('transactions', 'SELECT * FROM v_transactions WHERE account = ?', [accountId])];
        });
    });
}
function insertTransaction(transaction) {
    return insertWithSchema('transactions', transaction);
}
function updateTransaction(transaction) {
    return updateWithSchema('transactions', transaction);
}
function deleteTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, delete_('transactions', transaction.id)];
        });
    });
}
function toSqlQueryParameters(params) {
    return params.map(function () { return '?'; }).join(',');
}
function getTags() {
    return all("\n    SELECT id, tag, color, description\n    FROM tags\n    WHERE tombstone = 0\n    ORDER BY tag\n  ");
}
function getAllTags() {
    return all("\n    SELECT id, tag, color, description\n    FROM tags\n    ORDER BY tag\n  ");
}
function insertTag(tag) {
    return insertWithUUID('tags', tag);
}
function deleteTag(tag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, delete_('tags', tag.id)];
        });
    });
}
function updateTag(tag) {
    return update('tags', tag);
}
function findTags() {
    return all("\n    SELECT notes\n    FROM transactions\n    WHERE tombstone = 0 AND notes LIKE ?\n  ", ['%#%']);
}
