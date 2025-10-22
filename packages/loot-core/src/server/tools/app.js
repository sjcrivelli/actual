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
exports.app = void 0;
// @ts-strict-ignore
var query_1 = require("../../shared/query");
var app_1 = require("../app");
var aql_1 = require("../aql");
var db = require("../db");
var mutators_1 = require("../mutators");
var transactions_1 = require("../transactions");
exports.app = (0, app_1.createApp)();
exports.app.method('tools/fix-split-transactions', fixSplitTransactions);
function fixSplitTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var blankPayeeRows, clearedRows, deletedRows, splitTransactions, mismatchedSplits, brokenTransfers, errorRows, parentTransactionsWithCategory;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.all("\n    SELECT t.*, p.payee AS parentPayee FROM v_transactions_internal t\n    LEFT JOIN v_transactions_internal p ON t.parent_id = p.id\n    WHERE t.is_child = 1 AND t.payee IS NULL AND p.payee IS NOT NULL\n  ")];
                case 1:
                    blankPayeeRows = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        updated = blankPayeeRows.map(function (row) { return ({
                                            id: row.id,
                                            payee: row.parentPayee,
                                        }); });
                                        return [4 /*yield*/, (0, transactions_1.batchUpdateTransactions)({ updated: updated })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.all("\n    SELECT t.id, p.cleared FROM v_transactions_internal t\n    LEFT JOIN v_transactions_internal p ON t.parent_id = p.id\n    WHERE t.is_child = 1 AND t.cleared != p.cleared\n  ")];
                case 3:
                    clearedRows = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        updated = clearedRows.map(function (row) { return ({
                                            id: row.id,
                                            cleared: row.cleared === 1,
                                        }); });
                                        return [4 /*yield*/, (0, transactions_1.batchUpdateTransactions)({ updated: updated })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.all("\n    SELECT t.* FROM v_transactions_internal t\n    LEFT JOIN v_transactions_internal p ON t.parent_id = p.id\n    WHERE t.is_child = 1 AND t.tombstone = 0 AND (p.tombstone = 1 OR p.id IS NULL)\n  ")];
                case 5:
                    deletedRows = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        updated = deletedRows.map(function (row) { return ({ id: row.id, tombstone: true }); });
                                        return [4 /*yield*/, (0, transactions_1.batchUpdateTransactions)({ updated: updated })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                            .options({ splits: 'grouped' })
                            .filter({
                            is_parent: true,
                        })
                            .select('*'))];
                case 7:
                    splitTransactions = (_a.sent()).data;
                    mismatchedSplits = splitTransactions.filter(function (t) {
                        var subValue = t.subtransactions.reduce(function (acc, st) { return acc + st.amount; }, 0);
                        return subValue !== t.amount;
                    });
                    return [4 /*yield*/, db.all("\n    SELECT t1.id\n    FROM v_transactions_internal t1\n           JOIN accounts a1 ON t1.account = a1.id\n           JOIN v_transactions_internal t2 ON t1.transfer_id = t2.id\n           JOIN accounts a2 ON t2.account = a2.id\n    WHERE a1.offbudget = a2.offbudget\n      AND t1.category IS NOT NULL\n  ")];
                case 8:
                    brokenTransfers = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        updated = brokenTransfers.map(function (row) { return ({
                                            id: row.id,
                                            category: null,
                                        }); });
                                        return [4 /*yield*/, (0, transactions_1.batchUpdateTransactions)({ updated: updated })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db.all("\n    SELECT id FROM v_transactions_internal WHERE error IS NOT NULL AND is_parent = 0\n  ")];
                case 10:
                    errorRows = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        updated = errorRows.map(function (_a) {
                                            var id = _a.id;
                                            return ({ id: id, error: null });
                                        });
                                        return [4 /*yield*/, (0, transactions_1.batchUpdateTransactions)({ updated: updated })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, db.all("\n    SELECT id FROM transactions WHERE isParent = 1 AND category IS NOT NULL\n  ")];
                case 12:
                    parentTransactionsWithCategory = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        updated = parentTransactionsWithCategory.map(function (_a) {
                                            var id = _a.id;
                                            return ({
                                                id: id,
                                                category: null,
                                            });
                                        });
                                        return [4 /*yield*/, (0, transactions_1.batchUpdateTransactions)({ updated: updated })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 13:
                    _a.sent();
                    return [2 /*return*/, {
                            numBlankPayees: blankPayeeRows.length,
                            numCleared: clearedRows.length,
                            numDeleted: deletedRows.length,
                            numTransfersFixed: brokenTransfers.length,
                            numNonParentErrorsFixed: errorRows.length,
                            numParentTransactionsWithCategoryFixed: parentTransactionsWithCategory.length,
                            mismatchedSplits: mismatchedSplits,
                        }];
            }
        });
    });
}
