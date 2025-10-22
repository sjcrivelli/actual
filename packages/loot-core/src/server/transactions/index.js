"use strict";
// @ts-strict-ignore
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
exports.batchUpdateTransactions = batchUpdateTransactions;
var connection = require("../../platform/server/connection");
var db = require("../db");
var util_1 = require("../db/util");
var sync_1 = require("../sync");
var rules = require("./transaction-rules");
var transfer = require("./transfer");
function idsWithChildren(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var whereIds, rows, set, _i, rows_1, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    whereIds = (0, util_1.whereIn)(ids, 'parent_id');
                    return [4 /*yield*/, db.all("SELECT id FROM v_transactions_internal WHERE ".concat(whereIds))];
                case 1:
                    rows = _a.sent();
                    set = new Set(ids);
                    for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        row = rows_1[_i];
                        set.add(row.id);
                    }
                    return [2 /*return*/, __spreadArray([], set, true)];
            }
        });
    });
}
function getTransactionsByIds(ids) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: convert to whereIn
            //
            // or better yet, use ActualQL
            return [2 /*return*/, (0, util_1.incrFetch)(function (query, params) { return db.selectWithSchema('transactions', query, params); }, ids, 
                // eslint-disable-next-line actual/typography
                function (id) { return "id = '".concat(id, "'"); }, function (where) { return "SELECT * FROM v_transactions_internal WHERE ".concat(where); })];
        });
    });
}
function batchUpdateTransactions(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var addedIds, updatedIds, deletedIds, _c, oldPayees, accounts, descUpdatedIds, transactions, i, allAdded, allUpdated, allDeleted, resultAdded, resultUpdated, transfersUpdated, ids_1, newPayeeIds, allOrphaned_1, _d, orphanedIds;
        var _this = this;
        var added = _b.added, deleted = _b.deleted, updated = _b.updated, _e = _b.learnCategories, learnCategories = _e === void 0 ? false : _e, _f = _b.detectOrphanPayees, detectOrphanPayees = _f === void 0 ? true : _f, _g = _b.runTransfers, runTransfers = _g === void 0 ? true : _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    addedIds = [];
                    updatedIds = updated ? updated.map(function (u) { return u.id; }) : [];
                    if (!deleted) return [3 /*break*/, 2];
                    return [4 /*yield*/, idsWithChildren(deleted.map(function (d) { return d.id; }))];
                case 1:
                    _c = _h.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _c = [];
                    _h.label = 3;
                case 3:
                    deletedIds = _c;
                    oldPayees = new Set();
                    return [4 /*yield*/, db.all('SELECT * FROM accounts WHERE tombstone = 0')];
                case 4:
                    accounts = _h.sent();
                    if (!updated) return [3 /*break*/, 6];
                    descUpdatedIds = updated
                        .filter(function (update) { return update.payee; })
                        .map(function (update) { return update.id; });
                    return [4 /*yield*/, getTransactionsByIds(descUpdatedIds)];
                case 5:
                    transactions = _h.sent();
                    for (i = 0; i < transactions.length; i++) {
                        oldPayees.add(transactions[i].payee);
                    }
                    _h.label = 6;
                case 6: 
                // Apply all the updates. We can batch this now! This is important
                // and makes bulk updates much faster
                return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!added) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.all(added.map(function (t) { return __awaiter(_this, void 0, void 0, function () {
                                            var account;
                                            return __generator(this, function (_a) {
                                                account = accounts.find(function (acct) { return acct.id === t.account; });
                                                if (t.is_parent || account.offbudget === 1) {
                                                    t.category = null;
                                                }
                                                return [2 /*return*/, db.insertTransaction(t)];
                                            });
                                        }); }))];
                                case 1:
                                    addedIds = _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!deleted) return [3 /*break*/, 4];
                                    return [4 /*yield*/, Promise.all(
                                        // It's important to use `deletedIds` and not `deleted` here
                                        // because we've expanded it to include children above. The
                                        // inconsistency of the delete APIs is annoying and should
                                        // be fixed (it should only take an id)
                                        deletedIds.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, db.deleteTransaction({ id: id })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    if (!updated) return [3 /*break*/, 6];
                                    return [4 /*yield*/, Promise.all(updated.map(function (t) { return __awaiter(_this, void 0, void 0, function () {
                                            var account;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (t.account) {
                                                            account = accounts.find(function (acct) { return acct.id === t.account; });
                                                            if (t.is_parent || account.offbudget === 1) {
                                                                t.category = null;
                                                            }
                                                        }
                                                        return [4 /*yield*/, db.updateTransaction(t)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 7:
                    // Apply all the updates. We can batch this now! This is important
                    // and makes bulk updates much faster
                    _h.sent();
                    return [4 /*yield*/, getTransactionsByIds(addedIds)];
                case 8:
                    allAdded = _h.sent();
                    return [4 /*yield*/, getTransactionsByIds(updatedIds)];
                case 9:
                    allUpdated = _h.sent();
                    return [4 /*yield*/, getTransactionsByIds(deletedIds)];
                case 10:
                    allDeleted = _h.sent();
                    resultAdded = allAdded;
                    resultUpdated = allUpdated;
                    if (!runTransfers) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(allAdded.map(function (t) { return transfer.onInsert(t); }))];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, Promise.all(allUpdated.map(function (t) { return transfer.onUpdate(t); }))];
                                    case 2:
                                        // Return any updates from here
                                        transfersUpdated = (_a.sent()).filter(Boolean);
                                        return [4 /*yield*/, Promise.all(allDeleted.map(function (t) { return transfer.onDelete(t); }))];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 11:
                    _h.sent();
                    _h.label = 12;
                case 12:
                    if (!learnCategories) return [3 /*break*/, 14];
                    ids_1 = new Set(__spreadArray(__spreadArray([], (added ? added.filter(function (add) { return add.category; }).map(function (add) { return add.id; }) : []), true), (updated
                        ? updated.filter(function (update) { return update.category; }).map(function (update) { return update.id; })
                        : []), true));
                    return [4 /*yield*/, rules.updateCategoryRules(allAdded.concat(allUpdated).filter(function (trans) { return ids_1.has(trans.id); }))];
                case 13:
                    _h.sent();
                    _h.label = 14;
                case 14:
                    if (!detectOrphanPayees) return [3 /*break*/, 16];
                    if (!updated) return [3 /*break*/, 16];
                    newPayeeIds = updated.map(function (u) { return u.payee; }).filter(Boolean);
                    if (!(newPayeeIds.length > 0)) return [3 /*break*/, 16];
                    _d = Set.bind;
                    return [4 /*yield*/, db.getOrphanedPayees()];
                case 15:
                    allOrphaned_1 = new (_d.apply(Set, [void 0, _h.sent()]))();
                    orphanedIds = __spreadArray([], oldPayees, true).filter(function (id) { return allOrphaned_1.has(id); });
                    if (orphanedIds.length > 0) {
                        connection.send('orphaned-payees', {
                            orphanedIds: orphanedIds,
                            updatedPayeeIds: newPayeeIds,
                        });
                    }
                    _h.label = 16;
                case 16: return [2 /*return*/, {
                        added: resultAdded,
                        updated: runTransfers ? transfersUpdated : resultUpdated,
                        deleted: allDeleted,
                    }];
            }
        });
    });
}
