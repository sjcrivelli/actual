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
exports.exportToCSV = exportToCSV;
exports.exportQueryToCSV = exportQueryToCSV;
// @ts-strict-ignore
var sync_1 = require("csv-stringify/sync");
var util_1 = require("../../../shared/util");
var aql_1 = require("../../aql");
function exportToCSV(transactions, accounts, categoryGroups, payees) {
    return __awaiter(this, void 0, void 0, function () {
        var accountNamesById, categoryNamesById, payeeNamesById, transactionsForExport;
        return __generator(this, function (_a) {
            accountNamesById = accounts.reduce(function (reduced, _a) {
                var id = _a.id, name = _a.name;
                reduced[id] = name;
                return reduced;
            }, {});
            categoryNamesById = categoryGroups.reduce(function (reduced, _a) {
                var name = _a.name, subCategories = _a.categories;
                subCategories.forEach(function (subCategory) {
                    return (reduced[subCategory.id] = "".concat(name, ": ").concat(subCategory.name));
                });
                return reduced;
            }, {});
            payeeNamesById = payees.reduce(function (reduced, _a) {
                var id = _a.id, name = _a.name;
                reduced[id] = name;
                return reduced;
            }, {});
            transactionsForExport = transactions.map(function (_a) {
                var account = _a.account, date = _a.date, payee = _a.payee, notes = _a.notes, category = _a.category, amount = _a.amount, cleared = _a.cleared, reconciled = _a.reconciled;
                return ({
                    Account: accountNamesById[account],
                    Date: date,
                    Payee: payeeNamesById[payee],
                    Notes: notes,
                    Category: categoryNamesById[category],
                    Amount: amount == null ? 0 : (0, util_1.integerToAmount)(amount),
                    Cleared: cleared,
                    Reconciled: reconciled,
                });
            });
            return [2 /*return*/, (0, sync_1.stringify)(transactionsForExport, { header: true })];
        });
    });
}
function exportQueryToCSV(query) {
    return __awaiter(this, void 0, void 0, function () {
        var transactions, parentsChildCount, childSplitOrder, _i, transactions_1, trans, childNumber, transactionsForExport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)(query
                        .select([
                        { Id: 'id' },
                        { Account: 'account.name' },
                        { Date: 'date' },
                        { Payee: 'payee.name' },
                        { ParentId: 'parent_id' },
                        { IsParent: 'is_parent' },
                        { IsChild: 'is_child' },
                        { SortOrder: 'sort_order' },
                        { Notes: 'notes' },
                        { Category: 'category.name' },
                        { Amount: 'amount' },
                        { Cleared: 'cleared' },
                        { Reconciled: 'reconciled' },
                    ])
                        .options({ splits: 'all' }))];
                case 1:
                    transactions = (_a.sent()).data;
                    parentsChildCount = new Map();
                    childSplitOrder = new Map();
                    // find children, their order, and total # siblings
                    for (_i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                        trans = transactions_1[_i];
                        if (trans.IsChild) {
                            childNumber = parentsChildCount.get(trans.ParentId) || 0;
                            childNumber++;
                            childSplitOrder.set(trans.Id, childNumber);
                            parentsChildCount.set(trans.ParentId, childNumber);
                        }
                    }
                    transactionsForExport = transactions.map(function (trans) {
                        return {
                            Account: trans.Account,
                            Date: trans.Date,
                            Payee: trans.Payee,
                            Notes: trans.IsParent
                                ? '(SPLIT INTO ' +
                                    parentsChildCount.get(trans.Id) +
                                    ') ' +
                                    (trans.Notes || '')
                                : trans.IsChild
                                    ? '(SPLIT ' +
                                        childSplitOrder.get(trans.Id) +
                                        ' OF ' +
                                        parentsChildCount.get(trans.ParentId) +
                                        ') ' +
                                        (trans.Notes || '')
                                    : trans.Notes,
                            Category: trans.Category,
                            Amount: trans.IsParent
                                ? 0
                                : trans.Amount == null
                                    ? 0
                                    : (0, util_1.integerToAmount)(trans.Amount),
                            Split_Amount: trans.IsParent ? (0, util_1.integerToAmount)(trans.Amount) : 0,
                            Cleared: trans.Reconciled === true
                                ? 'Reconciled'
                                : trans.Cleared === true
                                    ? 'Cleared'
                                    : 'Not cleared',
                        };
                    });
                    return [2 /*return*/, (0, sync_1.stringify)(transactionsForExport, { header: true })];
            }
        });
    });
}
