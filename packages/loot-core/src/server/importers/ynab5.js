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
exports.doImport = doImport;
exports.parseFile = parseFile;
exports.getBudgetName = getBudgetName;
// @ts-strict-ignore
// This is a special usage of the API because this package is embedded
// into Actual itself. We only want to pull in the methods in that
// case and ignore everything else; otherwise we'd be pulling in the
// entire backend bundle from the API
var injected_1 = require("@actual-app/api/injected");
var actual = require("@actual-app/api/methods");
var uuid_1 = require("uuid");
var log_1 = require("../../platform/server/log");
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
function amountFromYnab(amount) {
    // ynabs multiplies amount by 1000 and actual by 100
    // so, this function divides by 10
    return Math.round(amount / 10);
}
function importAccounts(data, entityIdMap) {
    var _this = this;
    return Promise.all(data.accounts.map(function (account) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!account.deleted) return [3 /*break*/, 2];
                    return [4 /*yield*/, actual.createAccount({
                            name: account.name,
                            offbudget: account.on_budget ? false : true,
                            closed: account.closed,
                        })];
                case 1:
                    id = _a.sent();
                    entityIdMap.set(account.id, id);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }));
}
function importCategories(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        function checkSpecialCat(cat) {
            if (cat.category_group_id ===
                findIdByName(data.category_groups, 'Internal Master Category')) {
                if (ynabIncomeCategories.some(function (ynabIncomeCategory) {
                    return equalsIgnoreCase(cat.name, ynabIncomeCategory);
                })) {
                    return 'income';
                }
                else {
                    return 'internal';
                }
            }
            else if (cat.category_group_id ===
                findIdByName(data.category_groups, 'Credit Card Payments')) {
                return 'creditCard';
            }
            else if (cat.category_group_id === findIdByName(data.category_groups, 'Income')) {
                return 'income';
            }
        }
        var categories, incomeCatId, ynabIncomeCategories, _loop_1, _i, _a, group;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, actual.getCategories()];
                case 1:
                    categories = _b.sent();
                    incomeCatId = findIdByName(categories, 'Income');
                    ynabIncomeCategories = ['To be Budgeted', 'Inflow: Ready to Assign'];
                    _loop_1 = function (group) {
                        var groupId, run, MAX_RETRY, count, origName, e_1, cats, _c, _d, cat, _e, id, run, MAX_RETRY, count, origName, id, e_2;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    if (!!group.deleted) return [3 /*break*/, 17];
                                    groupId = void 0;
                                    if (!(!equalsIgnoreCase(group.name, 'Internal Master Category') &&
                                        !equalsIgnoreCase(group.name, 'Credit Card Payments') &&
                                        !equalsIgnoreCase(group.name, 'Hidden Categories') &&
                                        !equalsIgnoreCase(group.name, 'Income'))) return [3 /*break*/, 6];
                                    run = true;
                                    MAX_RETRY = 10;
                                    count = 1;
                                    origName = group.name;
                                    _f.label = 1;
                                case 1:
                                    if (!run) return [3 /*break*/, 6];
                                    _f.label = 2;
                                case 2:
                                    _f.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, actual.createCategoryGroup({
                                            name: group.name,
                                            is_income: false,
                                            hidden: group.hidden,
                                        })];
                                case 3:
                                    groupId = _f.sent();
                                    entityIdMap.set(group.id, groupId);
                                    if (group.note) {
                                        (0, injected_1.send)('notes-save', { id: groupId, note: group.note });
                                    }
                                    run = false;
                                    return [3 /*break*/, 5];
                                case 4:
                                    e_1 = _f.sent();
                                    group.name = origName + '-' + count.toString();
                                    count += 1;
                                    if (count >= MAX_RETRY) {
                                        run = false;
                                        throw Error(e_1.message);
                                    }
                                    return [3 /*break*/, 5];
                                case 5: return [3 /*break*/, 1];
                                case 6:
                                    if (equalsIgnoreCase(group.name, 'Income')) {
                                        groupId = incomeCatId;
                                        entityIdMap.set(group.id, groupId);
                                    }
                                    cats = data.categories.filter(function (cat) { return cat.category_group_id === group.id; });
                                    _c = 0, _d = cats.reverse();
                                    _f.label = 7;
                                case 7:
                                    if (!(_c < _d.length)) return [3 /*break*/, 17];
                                    cat = _d[_c];
                                    if (!!cat.deleted) return [3 /*break*/, 16];
                                    _e = checkSpecialCat(cat);
                                    switch (_e) {
                                        case 'income': return [3 /*break*/, 8];
                                        case 'creditCard': return [3 /*break*/, 9];
                                        case 'internal': return [3 /*break*/, 9];
                                    }
                                    return [3 /*break*/, 10];
                                case 8:
                                    {
                                        id = incomeCatId;
                                        entityIdMap.set(cat.id, id);
                                        return [3 /*break*/, 16];
                                    }
                                    _f.label = 9;
                                case 9: // uncategorized is ignored too, handled by actual
                                return [3 /*break*/, 16];
                                case 10:
                                    run = true;
                                    MAX_RETRY = 10;
                                    count = 1;
                                    origName = cat.name;
                                    _f.label = 11;
                                case 11:
                                    if (!run) return [3 /*break*/, 16];
                                    _f.label = 12;
                                case 12:
                                    _f.trys.push([12, 14, , 15]);
                                    return [4 /*yield*/, actual.createCategory({
                                            name: cat.name,
                                            group_id: groupId,
                                            hidden: cat.hidden,
                                        })];
                                case 13:
                                    id = _f.sent();
                                    entityIdMap.set(cat.id, id);
                                    if (cat.note) {
                                        (0, injected_1.send)('notes-save', { id: id, note: cat.note });
                                    }
                                    run = false;
                                    return [3 /*break*/, 15];
                                case 14:
                                    e_2 = _f.sent();
                                    cat.name = origName + '-' + count.toString();
                                    count += 1;
                                    if (count >= MAX_RETRY) {
                                        run = false;
                                        throw Error(e_2.message);
                                    }
                                    return [3 /*break*/, 15];
                                case 15: return [3 /*break*/, 11];
                                case 16:
                                    _c++;
                                    return [3 /*break*/, 7];
                                case 17: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = data.category_groups;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    group = _a[_i];
                    return [5 /*yield**/, _loop_1(group)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function importPayees(data, entityIdMap) {
    var _this = this;
    return Promise.all(data.payees.map(function (payee) { return __awaiter(_this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!payee.deleted) return [3 /*break*/, 2];
                    return [4 /*yield*/, actual.createPayee({
                            name: payee.name,
                        })];
                case 1:
                    id = _a.sent();
                    entityIdMap.set(payee.id, id);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }));
}
function importTransactions(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        var payees, categories, incomeCatId, startingBalanceCatId, startingPayeeYNAB, transactionsGrouped, subtransactionsGrouped, payeesByTransferAcct, payeeTransferAcctHashMap, orphanTransferMap, orphanSubtransfer, orphanSubtransferTrxId, orphanSubtransferAcctIdByTrxIdMap, orphanSubtransferDateByTrxIdMap, _i, _a, transaction, _b, _c, transaction, key, orphanSubtransferMap, orphanTransferComparator, orphanTrxIdSubtrxIdMap;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, actual.getPayees()];
                case 1:
                    payees = _d.sent();
                    return [4 /*yield*/, actual.getCategories()];
                case 2:
                    categories = _d.sent();
                    incomeCatId = findIdByName(categories, 'Income');
                    startingBalanceCatId = findIdByName(categories, 'Starting Balances');
                    startingPayeeYNAB = findIdByName(data.payees, 'Starting Balance');
                    transactionsGrouped = (0, util_1.groupBy)(data.transactions, 'account_id');
                    subtransactionsGrouped = (0, util_1.groupBy)(data.subtransactions, 'transaction_id');
                    payeesByTransferAcct = payees
                        .filter(function (payee) { return payee === null || payee === void 0 ? void 0 : payee.transfer_acct; })
                        .map(function (payee) { return [payee.transfer_acct, payee]; });
                    payeeTransferAcctHashMap = new Map(payeesByTransferAcct);
                    orphanTransferMap = new Map();
                    orphanSubtransfer = [];
                    orphanSubtransferTrxId = [];
                    orphanSubtransferAcctIdByTrxIdMap = new Map();
                    orphanSubtransferDateByTrxIdMap = new Map();
                    // Go ahead and generate ids for all of the transactions so we can
                    // reliably resolve transfers
                    // Also identify orphan transfer transactions and subtransactions.
                    for (_i = 0, _a = data.subtransactions; _i < _a.length; _i++) {
                        transaction = _a[_i];
                        entityIdMap.set(transaction.id, (0, uuid_1.v4)());
                        if (transaction.transfer_account_id) {
                            orphanSubtransfer.push(transaction);
                            orphanSubtransferTrxId.push(transaction.transaction_id);
                        }
                    }
                    for (_b = 0, _c = data.transactions; _b < _c.length; _b++) {
                        transaction = _c[_b];
                        entityIdMap.set(transaction.id, (0, uuid_1.v4)());
                        if (transaction.transfer_account_id &&
                            !transaction.transfer_transaction_id) {
                            key = transaction.account_id + '#' + transaction.transfer_account_id;
                            if (!orphanTransferMap.has(key)) {
                                orphanTransferMap.set(key, [transaction]);
                            }
                            else {
                                orphanTransferMap.get(key).push(transaction);
                            }
                        }
                        if (orphanSubtransferTrxId.includes(transaction.id)) {
                            orphanSubtransferAcctIdByTrxIdMap.set(transaction.id, transaction.account_id);
                            orphanSubtransferDateByTrxIdMap.set(transaction.id, transaction.date);
                        }
                    }
                    orphanSubtransferMap = orphanSubtransfer.reduce(function (map, subtransaction) {
                        var key = subtransaction.transfer_account_id +
                            '#' +
                            orphanSubtransferAcctIdByTrxIdMap.get(subtransaction.transaction_id);
                        if (!map.has(key)) {
                            map.set(key, [subtransaction]);
                        }
                        else {
                            map.get(key).push(subtransaction);
                        }
                        return map;
                    }, new Map());
                    orphanTransferComparator = function (a, b) {
                        // a and b can be a YNAB5.Transaction (having a date attribute) or a
                        // YNAB5.Subtransaction (missing that date attribute)
                        var date_a = 'date' in a
                            ? a.date
                            : orphanSubtransferDateByTrxIdMap.get(a.transaction_id);
                        var date_b = 'date' in b
                            ? b.date
                            : orphanSubtransferDateByTrxIdMap.get(b.transaction_id);
                        // A transaction and the related subtransaction have inverted amounts.
                        // To have those in the same order, the subtransaction has to be reversed
                        // to have the same amount.
                        var amount_a = 'date' in a ? a.amount : -a.amount;
                        var amount_b = 'date' in b ? b.amount : -b.amount;
                        // Transaction are ordered first by date, then by amount, and lastly by memo
                        if (date_a > date_b)
                            return 1;
                        if (date_a < date_b)
                            return -1;
                        if (amount_a > amount_b)
                            return 1;
                        if (amount_a < amount_b)
                            return -1;
                        if (a.memo > b.memo)
                            return 1;
                        if (a.memo < b.memo)
                            return -1;
                        return 0;
                    };
                    orphanTrxIdSubtrxIdMap = new Map();
                    orphanTransferMap.forEach(function (transactions, key) {
                        var subtransactions = orphanSubtransferMap.get(key);
                        if (subtransactions) {
                            transactions.sort(orphanTransferComparator);
                            subtransactions.sort(orphanTransferComparator);
                            // Iterate on the two sorted lists transactions and subtransactions and
                            // find matching data to identify the related transaction ids.
                            var transactionIdx = 0;
                            var subtransactionIdx = 0;
                            do {
                                switch (orphanTransferComparator(transactions[transactionIdx], subtransactions[subtransactionIdx])) {
                                    case 0:
                                        // The current list indexes are matching: the transaction and
                                        // subtransaction are related (same date, amount and memo)
                                        orphanTrxIdSubtrxIdMap.set(transactions[transactionIdx].id, entityIdMap.get(subtransactions[subtransactionIdx].id));
                                        orphanTrxIdSubtrxIdMap.set(subtransactions[subtransactionIdx].id, entityIdMap.get(transactions[transactionIdx].id));
                                        transactionIdx++;
                                        subtransactionIdx++;
                                        break;
                                    case -1:
                                        // The current list indexes are not matching:
                                        // The current transaction is "smaller" than the current subtransaction
                                        // (earlier date, smaller amount, memo value sorted before)
                                        // So we advance to the next transaction and see if it match with
                                        // the current subtransaction
                                        transactionIdx++;
                                        break;
                                    case 1:
                                        // Inverse of the previous case:
                                        // The current subtransaction is "smaller" than the current transaction
                                        // So we advance to the next subtransaction
                                        subtransactionIdx++;
                                        break;
                                }
                            } while (transactionIdx < transactions.length &&
                                subtransactionIdx < subtransactions.length);
                        }
                    });
                    return [4 /*yield*/, Promise.all(__spreadArray([], transactionsGrouped.keys(), true).map(function (accountId) { return __awaiter(_this, void 0, void 0, function () {
                            var transactions, toImport;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        transactions = transactionsGrouped.get(accountId);
                                        toImport = transactions
                                            .map(function (transaction) {
                                            if (transaction.deleted) {
                                                return null;
                                            }
                                            var subtransactions = subtransactionsGrouped.get(transaction.id);
                                            // Add transaction
                                            var newTransaction = {
                                                id: entityIdMap.get(transaction.id),
                                                account: entityIdMap.get(transaction.account_id),
                                                date: transaction.date,
                                                amount: amountFromYnab(transaction.amount),
                                                category: entityIdMap.get(transaction.category_id) || null,
                                                cleared: ['cleared', 'reconciled'].includes(transaction.cleared),
                                                reconciled: transaction.cleared === 'reconciled',
                                                notes: transaction.memo || null,
                                                imported_id: transaction.import_id || null,
                                                transfer_id: entityIdMap.get(transaction.transfer_transaction_id) ||
                                                    orphanTrxIdSubtrxIdMap.get(transaction.id) ||
                                                    null,
                                                subtransactions: subtransactions
                                                    ? subtransactions.map(function (subtrans) {
                                                        return {
                                                            id: entityIdMap.get(subtrans.id),
                                                            amount: amountFromYnab(subtrans.amount),
                                                            category: entityIdMap.get(subtrans.category_id) || null,
                                                            notes: subtrans.memo,
                                                            transfer_id: orphanTrxIdSubtrxIdMap.get(subtrans.id) || null,
                                                            payee: null,
                                                            imported_payee: null,
                                                        };
                                                    })
                                                    : null,
                                                payee: null,
                                                imported_payee: null,
                                            };
                                            // Handle transactions and subtransactions payee
                                            var transactionPayeeUpdate = function (trx, newTrx) {
                                                var _a, _b;
                                                if (trx.transfer_account_id) {
                                                    var mappedTransferAccountId = entityIdMap.get(trx.transfer_account_id);
                                                    newTrx.payee = (_a = payeeTransferAcctHashMap.get(mappedTransferAccountId)) === null || _a === void 0 ? void 0 : _a.id;
                                                }
                                                else {
                                                    newTrx.payee = entityIdMap.get(trx.payee_id);
                                                    newTrx.imported_payee = (_b = data.payees.find(function (p) { return !p.deleted && p.id === trx.payee_id; })) === null || _b === void 0 ? void 0 : _b.name;
                                                }
                                            };
                                            transactionPayeeUpdate(transaction, newTransaction);
                                            if (newTransaction.subtransactions) {
                                                subtransactions.forEach(function (subtrans) {
                                                    var newSubtransaction = newTransaction.subtransactions.find(function (newSubtrans) { return newSubtrans.id === entityIdMap.get(subtrans.id); });
                                                    transactionPayeeUpdate(subtrans, newSubtransaction);
                                                });
                                            }
                                            // Handle starting balances
                                            if (transaction.payee_id === startingPayeeYNAB &&
                                                entityIdMap.get(transaction.category_id) === incomeCatId) {
                                                newTransaction.category = startingBalanceCatId;
                                                newTransaction.payee = null;
                                            }
                                            return newTransaction;
                                        })
                                            .filter(function (x) { return x; });
                                        return [4 /*yield*/, actual.addTransactions(entityIdMap.get(accountId), toImport, {
                                                learnCategories: true,
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function importBudgets(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        var budgets, internalCatIdYnab, creditcardCatIdYnab;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    budgets = (0, util_1.sortByKey)(data.months, 'month');
                    internalCatIdYnab = findIdByName(data.category_groups, 'Internal Master Category');
                    creditcardCatIdYnab = findIdByName(data.category_groups, 'Credit Card Payments');
                    return [4 /*yield*/, actual.batchBudgetUpdates(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _loop_2, _i, budgets_1, budget;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _loop_2 = function (budget) {
                                            var month;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        month = monthUtils.monthFromDate(budget.month);
                                                        return [4 /*yield*/, Promise.all(budget.categories.map(function (catBudget) { return __awaiter(_this, void 0, void 0, function () {
                                                                var catId, amount;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            catId = entityIdMap.get(catBudget.id);
                                                                            amount = Math.round(catBudget.budgeted / 10);
                                                                            if (!catId ||
                                                                                catBudget.category_group_id === internalCatIdYnab ||
                                                                                catBudget.category_group_id === creditcardCatIdYnab) {
                                                                                return [2 /*return*/];
                                                                            }
                                                                            return [4 /*yield*/, actual.setBudgetAmount(month, catId, amount)];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); }))];
                                                    case 1:
                                                        _b.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, budgets_1 = budgets;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < budgets_1.length)) return [3 /*break*/, 4];
                                        budget = budgets_1[_i];
                                        return [5 /*yield**/, _loop_2(budget)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Utils
function doImport(data) {
    return __awaiter(this, void 0, void 0, function () {
        var entityIdMap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entityIdMap = new Map();
                    log_1.logger.log('Importing Accounts...');
                    return [4 /*yield*/, importAccounts(data, entityIdMap)];
                case 1:
                    _a.sent();
                    log_1.logger.log('Importing Categories...');
                    return [4 /*yield*/, importCategories(data, entityIdMap)];
                case 2:
                    _a.sent();
                    log_1.logger.log('Importing Payees...');
                    return [4 /*yield*/, importPayees(data, entityIdMap)];
                case 3:
                    _a.sent();
                    log_1.logger.log('Importing Transactions...');
                    return [4 /*yield*/, importTransactions(data, entityIdMap)];
                case 4:
                    _a.sent();
                    log_1.logger.log('Importing Budgets...');
                    return [4 /*yield*/, importBudgets(data, entityIdMap)];
                case 5:
                    _a.sent();
                    log_1.logger.log('Setting up...');
                    return [2 /*return*/];
            }
        });
    });
}
function parseFile(buffer) {
    var data = JSON.parse(buffer.toString());
    if (data.data) {
        data = data.data;
    }
    if (data.budget) {
        data = data.budget;
    }
    return data;
}
function getBudgetName(_filepath, data) {
    return data.budget_name || data.name;
}
function equalsIgnoreCase(stringa, stringb) {
    return (stringa.localeCompare(stringb, undefined, {
        sensitivity: 'base',
    }) === 0);
}
function findByNameIgnoreCase(categories, name) {
    return categories.find(function (cat) { return equalsIgnoreCase(cat.name, name); });
}
function findIdByName(categories, name) {
    var _a;
    return (_a = findByNameIgnoreCase(categories, name)) === null || _a === void 0 ? void 0 : _a.id;
}
