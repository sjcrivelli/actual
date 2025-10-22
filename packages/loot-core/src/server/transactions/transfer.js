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
exports.addTransfer = addTransfer;
exports.removeTransfer = removeTransfer;
exports.updateTransfer = updateTransfer;
exports.onInsert = onInsert;
exports.onDelete = onDelete;
exports.onUpdate = onUpdate;
// @ts-strict-ignore
var db = require("../db");
var transaction_rules_1 = require("./transaction-rules");
function getPayee(acct) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.first('SELECT * FROM payees WHERE transfer_acct = ?', [
                    acct,
                ])];
        });
    });
}
function getTransferredAccount(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!transaction.payee) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.first('SELECT transfer_acct FROM v_payees WHERE id = ?', [transaction.payee])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.transfer_acct) || null];
                case 2: return [2 /*return*/, null];
            }
        });
    });
}
function clearCategory(transaction, transferAcct) {
    return __awaiter(this, void 0, void 0, function () {
        var fromOffBudget, toOffBudget;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.first('SELECT offbudget FROM accounts WHERE id = ?', [transaction.account])];
                case 1:
                    fromOffBudget = (_a.sent()).offbudget;
                    return [4 /*yield*/, db.first('SELECT offbudget FROM accounts WHERE id = ?', [transferAcct])];
                case 2:
                    toOffBudget = (_a.sent()).offbudget;
                    if (!(fromOffBudget === toOffBudget)) return [3 /*break*/, 6];
                    return [4 /*yield*/, db.updateTransaction({ id: transaction.id, category: null })];
                case 3:
                    _a.sent();
                    if (!transaction.transfer_id) return [3 /*break*/, 5];
                    return [4 /*yield*/, db.updateTransaction({
                            id: transaction.transfer_id,
                            category: null,
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, true];
                case 6: return [2 /*return*/, false];
            }
        });
    });
}
function addTransfer(transaction, transferredAccount) {
    return __awaiter(this, void 0, void 0, function () {
        var fromPayee, transferTransaction, _a, notes, cleared, id, categoryCleared;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (transaction.is_parent) {
                        // For split transactions, we should create transfers using child transactions.
                        // This is to ensure that the amounts received by the transferred account
                        // reflects the amounts in the child transactions and not the parent transaction
                        // amount which is the total amount.
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, db.first('SELECT id FROM payees WHERE transfer_acct = ?', [transaction.account])];
                case 1:
                    fromPayee = (_b.sent()).id;
                    transferTransaction = {
                        account: transferredAccount,
                        amount: -transaction.amount,
                        payee: fromPayee,
                        date: transaction.date,
                        transfer_id: transaction.id,
                        notes: transaction.notes || null,
                        schedule: transaction.schedule,
                        cleared: false,
                    };
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)(transferTransaction)];
                case 2:
                    _a = _b.sent(), notes = _a.notes, cleared = _a.cleared;
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transferTransaction), { notes: notes, cleared: cleared }))];
                case 3:
                    id = _b.sent();
                    return [4 /*yield*/, db.updateTransaction({ id: transaction.id, transfer_id: id })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, clearCategory(transaction, transferredAccount)];
                case 5:
                    categoryCleared = _b.sent();
                    return [2 /*return*/, __assign({ id: transaction.id, transfer_id: id }, (categoryCleared ? { category: null } : {}))];
            }
        });
    });
}
function removeTransfer(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var transferTrans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getTransaction(transaction.transfer_id)];
                case 1:
                    transferTrans = _a.sent();
                    if (!transferTrans) return [3 /*break*/, 5];
                    if (!transferTrans.is_child) return [3 /*break*/, 3];
                    // If it's a child transaction, we don't delete it because that
                    // would invalidate the whole split transaction. Instead of turn
                    // it into a normal transaction
                    return [4 /*yield*/, db.updateTransaction({
                            id: transaction.transfer_id,
                            transfer_id: null,
                            payee: null,
                        })];
                case 2:
                    // If it's a child transaction, we don't delete it because that
                    // would invalidate the whole split transaction. Instead of turn
                    // it into a normal transaction
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, db.deleteTransaction({ id: transaction.transfer_id })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, db.updateTransaction({ id: transaction.id, transfer_id: null })];
                case 6:
                    _a.sent();
                    return [2 /*return*/, { id: transaction.id, transfer_id: null }];
            }
        });
    });
}
function updateTransfer(transaction, transferredAccount) {
    return __awaiter(this, void 0, void 0, function () {
        var payee, categoryCleared;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPayee(transaction.account)];
                case 1:
                    payee = _a.sent();
                    return [4 /*yield*/, db.updateTransaction({
                            id: transaction.transfer_id,
                            account: transferredAccount,
                            // Make sure to update the payee on the other side in case the
                            // user moved this transaction into another account
                            payee: payee.id,
                            date: transaction.date,
                            notes: transaction.notes,
                            amount: -transaction.amount,
                            schedule: transaction.schedule,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, clearCategory(transaction, transferredAccount)];
                case 3:
                    categoryCleared = _a.sent();
                    if (categoryCleared) {
                        return [2 /*return*/, { id: transaction.id, category: null }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function onInsert(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var transferredAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTransferredAccount(transaction)];
                case 1:
                    transferredAccount = _a.sent();
                    if (transferredAccount) {
                        return [2 /*return*/, addTransfer(transaction, transferredAccount)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function onDelete(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!transaction.transfer_id) return [3 /*break*/, 2];
                    return [4 /*yield*/, removeTransfer(transaction)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function onUpdate(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var transferredAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTransferredAccount(transaction)];
                case 1:
                    transferredAccount = _a.sent();
                    if (transaction.is_parent) {
                        return [2 /*return*/, removeTransfer(transaction)];
                    }
                    if (transferredAccount && !transaction.transfer_id) {
                        return [2 /*return*/, addTransfer(transaction, transferredAccount)];
                    }
                    if (!transferredAccount && transaction.transfer_id) {
                        return [2 /*return*/, removeTransfer(transaction)];
                    }
                    if (transferredAccount && transaction.transfer_id) {
                        return [2 /*return*/, updateTransfer(transaction, transferredAccount)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
