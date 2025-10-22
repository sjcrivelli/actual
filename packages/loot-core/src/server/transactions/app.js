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
var query_1 = require("../../shared/query");
var app_1 = require("../app");
var aql_1 = require("../aql");
var mutators_1 = require("../mutators");
var undo_1 = require("../undo");
var export_to_csv_1 = require("./export/export-to-csv");
var parse_file_1 = require("./import/parse-file");
var merge_1 = require("./merge");
var _1 = require(".");
function handleBatchUpdateTransactions(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var result;
        var added = _b.added, deleted = _b.deleted, updated = _b.updated, learnCategories = _b.learnCategories, _c = _b.runTransfers, runTransfers = _c === void 0 ? true : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, _1.batchUpdateTransactions)({
                        added: added,
                        updated: updated,
                        deleted: deleted,
                        learnCategories: learnCategories,
                        runTransfers: runTransfers,
                    })];
                case 1:
                    result = _d.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
function addTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleBatchUpdateTransactions({ added: [transaction] })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function updateTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleBatchUpdateTransactions({ updated: [transaction] })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function deleteTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleBatchUpdateTransactions({ deleted: [transaction] })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function parseTransactionsFile(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var filepath = _b.filepath, options = _b.options;
        return __generator(this, function (_c) {
            return [2 /*return*/, (0, parse_file_1.parseFile)(filepath, options)];
        });
    });
}
function exportTransactions(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var transactions = _b.transactions, accounts = _b.accounts, categoryGroups = _b.categoryGroups, payees = _b.payees;
        return __generator(this, function (_c) {
            return [2 /*return*/, (0, export_to_csv_1.exportToCSV)(transactions, accounts, categoryGroups, payees)];
        });
    });
}
function exportTransactionsQuery(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var queryState = _b.query;
        return __generator(this, function (_c) {
            return [2 /*return*/, (0, export_to_csv_1.exportQueryToCSV)(new query_1.Query(queryState))];
        });
    });
}
function getEarliestTransaction() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                        .options({ splits: 'none' })
                        .orderBy({ date: 'asc' })
                        .select('*')
                        .limit(1))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data[0] || null];
            }
        });
    });
}
function getLatestTransaction() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                        .options({ splits: 'none' })
                        .orderBy({ date: 'desc' })
                        .select('*')
                        .limit(1))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data[0] || null];
            }
        });
    });
}
exports.app = (0, app_1.createApp)();
exports.app.method('transactions-batch-update', (0, mutators_1.mutator)((0, undo_1.undoable)(handleBatchUpdateTransactions)));
exports.app.method('transactions-merge', (0, mutators_1.mutator)((0, undo_1.undoable)(merge_1.mergeTransactions)));
exports.app.method('transaction-add', (0, mutators_1.mutator)(addTransaction));
exports.app.method('transaction-update', (0, mutators_1.mutator)(updateTransaction));
exports.app.method('transaction-delete', (0, mutators_1.mutator)(deleteTransaction));
exports.app.method('transactions-parse-file', (0, mutators_1.mutator)(parseTransactionsFile));
exports.app.method('transactions-export', (0, mutators_1.mutator)(exportTransactions));
exports.app.method('transactions-export-query', (0, mutators_1.mutator)(exportTransactionsQuery));
exports.app.method('get-earliest-transaction', getEarliestTransaction);
exports.app.method('get-latest-transaction', getLatestTransaction);
