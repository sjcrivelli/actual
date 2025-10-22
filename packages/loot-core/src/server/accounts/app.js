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
exports.app = void 0;
var i18next_1 = require("i18next");
var uuid_1 = require("uuid");
var exceptions_1 = require("../../platform/exceptions");
var asyncStorage = require("../../platform/server/asyncStorage");
var connection = require("../../platform/server/connection");
var log_1 = require("../../platform/server/log");
var environment_1 = require("../../shared/environment");
var months_1 = require("../../shared/months");
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
var app_1 = require("../app");
var db = require("../db");
var errors_1 = require("../errors");
var main_app_1 = require("../main-app");
var mutators_1 = require("../mutators");
var post_1 = require("../post");
var server_config_1 = require("../server-config");
var sync_1 = require("../sync");
var undo_1 = require("../undo");
var link = require("./link");
var payees_1 = require("./payees");
var bankSync = require("./sync");
function updateAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, name = _b.name, last_reconciled = _b.last_reconciled;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.update('accounts', __assign({ id: id, name: name }, (last_reconciled && { last_reconciled: last_reconciled })))];
                case 1:
                    _c.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function getAccounts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.getAccounts()];
        });
    });
}
function getAccountBalance(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var result;
        var id = _b.id, cutoff = _b.cutoff;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.first('SELECT sum(amount) as balance FROM transactions WHERE acct = ? AND isParent = 0 AND tombstone = 0 AND date <= ?', [id, db.toDateRepr((0, months_1.dayFromDate)(cutoff))])];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.balance) ? result.balance : 0];
            }
        });
    });
}
function getAccountProperties(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var balanceResult, countResult;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.first('SELECT sum(amount) as balance FROM transactions WHERE acct = ? AND isParent = 0 AND tombstone = 0', [id])];
                case 1:
                    balanceResult = _c.sent();
                    return [4 /*yield*/, db.first('SELECT count(id) as count FROM transactions WHERE acct = ? AND tombstone = 0', [id])];
                case 2:
                    countResult = _c.sent();
                    return [2 /*return*/, {
                            balance: (balanceResult === null || balanceResult === void 0 ? void 0 : balanceResult.balance) || 0,
                            numTransactions: (countResult === null || countResult === void 0 ? void 0 : countResult.count) || 0,
                        }];
            }
        });
    });
}
function linkGoCardlessAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, bank, accRow;
        var requisitionId = _b.requisitionId, account = _b.account, upgradingId = _b.upgradingId, _c = _b.offBudget, offBudget = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, link.findOrCreateBank(account.institution, requisitionId)];
                case 1:
                    bank = _d.sent();
                    if (!upgradingId) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.first('SELECT * FROM accounts WHERE id = ?', [upgradingId])];
                case 2:
                    accRow = _d.sent();
                    if (!accRow) {
                        throw new Error("Account with ID ".concat(upgradingId, " not found."));
                    }
                    id = accRow.id;
                    return [4 /*yield*/, db.update('accounts', {
                            id: id,
                            account_id: account.account_id,
                            bank: bank.id,
                            account_sync_source: 'goCardless',
                        })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 7];
                case 4:
                    id = (0, uuid_1.v4)();
                    return [4 /*yield*/, db.insertWithUUID('accounts', {
                            id: id,
                            account_id: account.account_id,
                            mask: account.mask,
                            name: account.name,
                            official_name: account.official_name,
                            bank: bank.id,
                            offbudget: offBudget ? 1 : 0,
                            account_sync_source: 'goCardless',
                        })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, db.insertPayee({
                            name: '',
                            transfer_acct: id,
                        })];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [4 /*yield*/, bankSync.syncAccount(undefined, undefined, id, account.account_id, bank.bank_id)];
                case 8:
                    _d.sent();
                    connection.send('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    return [2 /*return*/, 'ok'];
            }
        });
    });
}
function linkSimpleFinAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, institution, bank, accRow;
        var _c, _d;
        var externalAccount = _b.externalAccount, upgradingId = _b.upgradingId, _e = _b.offBudget, offBudget = _e === void 0 ? false : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    institution = {
                        name: (_c = externalAccount.institution) !== null && _c !== void 0 ? _c : (0, i18next_1.t)('Unknown'),
                    };
                    return [4 /*yield*/, link.findOrCreateBank(institution, (_d = externalAccount.orgDomain) !== null && _d !== void 0 ? _d : externalAccount.orgId)];
                case 1:
                    bank = _f.sent();
                    if (!upgradingId) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.first('SELECT * FROM accounts WHERE id = ?', [upgradingId])];
                case 2:
                    accRow = _f.sent();
                    if (!accRow) {
                        throw new Error("Account with ID ".concat(upgradingId, " not found."));
                    }
                    id = accRow.id;
                    return [4 /*yield*/, db.update('accounts', {
                            id: id,
                            account_id: externalAccount.account_id,
                            bank: bank.id,
                            account_sync_source: 'simpleFin',
                        })];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 7];
                case 4:
                    id = (0, uuid_1.v4)();
                    return [4 /*yield*/, db.insertWithUUID('accounts', {
                            id: id,
                            account_id: externalAccount.account_id,
                            name: externalAccount.name,
                            official_name: externalAccount.name,
                            bank: bank.id,
                            offbudget: offBudget ? 1 : 0,
                            account_sync_source: 'simpleFin',
                        })];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, db.insertPayee({
                            name: '',
                            transfer_acct: id,
                        })];
                case 6:
                    _f.sent();
                    _f.label = 7;
                case 7: return [4 /*yield*/, bankSync.syncAccount(undefined, undefined, id, externalAccount.account_id, bank.bank_id)];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, connection.send('sync-event', {
                            type: 'success',
                            tables: ['transactions'],
                        })];
                case 9:
                    _f.sent();
                    return [2 /*return*/, 'ok'];
            }
        });
    });
}
function linkPluggyAiAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, institution, bank, accRow;
        var _c, _d;
        var externalAccount = _b.externalAccount, upgradingId = _b.upgradingId, _e = _b.offBudget, offBudget = _e === void 0 ? false : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    institution = {
                        name: (_c = externalAccount.institution) !== null && _c !== void 0 ? _c : (0, i18next_1.t)('Unknown'),
                    };
                    return [4 /*yield*/, link.findOrCreateBank(institution, (_d = externalAccount.orgDomain) !== null && _d !== void 0 ? _d : externalAccount.orgId)];
                case 1:
                    bank = _f.sent();
                    if (!upgradingId) return [3 /*break*/, 4];
                    return [4 /*yield*/, db.first('SELECT * FROM accounts WHERE id = ?', [upgradingId])];
                case 2:
                    accRow = _f.sent();
                    if (!accRow) {
                        throw new Error("Account with ID ".concat(upgradingId, " not found."));
                    }
                    id = accRow.id;
                    return [4 /*yield*/, db.update('accounts', {
                            id: id,
                            account_id: externalAccount.account_id,
                            bank: bank.id,
                            account_sync_source: 'pluggyai',
                        })];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 7];
                case 4:
                    id = (0, uuid_1.v4)();
                    return [4 /*yield*/, db.insertWithUUID('accounts', {
                            id: id,
                            account_id: externalAccount.account_id,
                            name: externalAccount.name,
                            official_name: externalAccount.name,
                            bank: bank.id,
                            offbudget: offBudget ? 1 : 0,
                            account_sync_source: 'pluggyai',
                        })];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, db.insertPayee({
                            name: '',
                            transfer_acct: id,
                        })];
                case 6:
                    _f.sent();
                    _f.label = 7;
                case 7: return [4 /*yield*/, bankSync.syncAccount(undefined, undefined, id, externalAccount.account_id, bank.bank_id)];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, connection.send('sync-event', {
                            type: 'success',
                            tables: ['transactions'],
                        })];
                case 9:
                    _f.sent();
                    return [2 /*return*/, 'ok'];
            }
        });
    });
}
function createAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, payee;
        var name = _b.name, _c = _b.balance, balance = _c === void 0 ? 0 : _c, _d = _b.offBudget, offBudget = _d === void 0 ? false : _d, _e = _b.closed, closed = _e === void 0 ? false : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, db.insertAccount({
                        name: name,
                        offbudget: offBudget ? 1 : 0,
                        closed: closed ? 1 : 0,
                    })];
                case 1:
                    id = _f.sent();
                    return [4 /*yield*/, db.insertPayee({
                            name: '',
                            transfer_acct: id,
                        })];
                case 2:
                    _f.sent();
                    if (!(balance != null && balance !== 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, payees_1.getStartingBalancePayee)()];
                case 3:
                    payee = _f.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: id,
                            amount: (0, util_1.amountToInteger)(balance),
                            category: offBudget ? null : payee.category,
                            payee: payee.id,
                            date: monthUtils.currentDay(),
                            cleared: true,
                            starting_balance_flag: true,
                        })];
                case 4:
                    _f.sent();
                    _f.label = 5;
                case 5: return [2 /*return*/, id];
            }
        });
    });
}
function closeAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var id = _b.id, transferAccountId = _b.transferAccountId, categoryId = _b.categoryId, _c = _b.forced, forced = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // Unlink the account if it's linked. This makes sure to remove it from
                // bank-sync providers. (This should not be undo-able, as it mutates the
                // remote server and the user will have to link the account again)
                return [4 /*yield*/, unlinkAccount({ id: id })];
                case 1:
                    // Unlink the account if it's linked. This makes sure to remove it from
                    // bank-sync providers. (This should not be undo-able, as it mutates the
                    // remote server and the user will have to link the account again)
                    _d.sent();
                    return [2 /*return*/, (0, undo_1.withUndo)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var account, _a, balance, numTransactions, rows_1, transferPayee_1, transferPayee;
                            var _this = this;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, db.first('SELECT * FROM accounts WHERE id = ? AND tombstone = 0', [id])];
                                    case 1:
                                        account = _b.sent();
                                        // Do nothing if the account doesn't exist or it's already been
                                        // closed
                                        if (!account || account.closed === 1) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, getAccountProperties({ id: id })];
                                    case 2:
                                        _a = _b.sent(), balance = _a.balance, numTransactions = _a.numTransactions;
                                        if (!(numTransactions === 0)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, db.deleteAccount({ id: id })];
                                    case 3:
                                        _b.sent();
                                        return [3 /*break*/, 12];
                                    case 4:
                                        if (!forced) return [3 /*break*/, 8];
                                        return [4 /*yield*/, db.runQuery('SELECT id, transfer_id FROM v_transactions WHERE account = ?', [id], true)];
                                    case 5:
                                        rows_1 = _b.sent();
                                        return [4 /*yield*/, db.first('SELECT id FROM payees WHERE transfer_acct = ?', [id])];
                                    case 6:
                                        transferPayee_1 = _b.sent();
                                        if (!transferPayee_1) {
                                            throw new Error("Transfer payee with account ID ".concat(id, " not found."));
                                        }
                                        return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    // TODO: what this should really do is send a special message that
                                                    // automatically marks the tombstone value for all transactions
                                                    // within an account... or something? This is problematic
                                                    // because another client could easily add new data that
                                                    // should be marked as deleted.
                                                    rows_1.forEach(function (row) {
                                                        if (row.transfer_id) {
                                                            db.updateTransaction({
                                                                id: row.transfer_id,
                                                                payee: null,
                                                                transfer_id: null,
                                                            });
                                                        }
                                                        db.deleteTransaction({ id: row.id });
                                                    });
                                                    db.deleteAccount({ id: id });
                                                    db.deleteTransferPayee({ id: transferPayee_1.id });
                                                    return [2 /*return*/];
                                                });
                                            }); })];
                                    case 7:
                                        _b.sent();
                                        return [3 /*break*/, 12];
                                    case 8:
                                        if (balance !== 0 && transferAccountId == null) {
                                            throw (0, errors_1.APIError)('balance is non-zero: transferAccountId is required');
                                        }
                                        if (id === transferAccountId) {
                                            throw (0, errors_1.APIError)('transfer account can not be the account being closed');
                                        }
                                        return [4 /*yield*/, db.update('accounts', { id: id, closed: 1 })];
                                    case 9:
                                        _b.sent();
                                        if (!(balance !== 0 && transferAccountId)) return [3 /*break*/, 12];
                                        return [4 /*yield*/, db.first('SELECT id FROM payees WHERE transfer_acct = ?', [transferAccountId])];
                                    case 10:
                                        transferPayee = _b.sent();
                                        if (!transferPayee) {
                                            throw new Error("Transfer payee with account ID ".concat(transferAccountId, " not found."));
                                        }
                                        return [4 /*yield*/, main_app_1.app.handlers['transaction-add']({
                                                id: (0, uuid_1.v4)(),
                                                payee: transferPayee.id,
                                                amount: -balance,
                                                account: id,
                                                date: monthUtils.currentDay(),
                                                notes: 'Closing account',
                                                category: categoryId,
                                            })];
                                    case 11:
                                        _b.sent();
                                        _b.label = 12;
                                    case 12: return [2 /*return*/];
                                }
                            });
                        }); })];
            }
        });
    });
}
function reopenAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.update('accounts', { id: id, closed: 0 })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function moveAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, targetId = _b.targetId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.moveAccount(id, targetId)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setSecret(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, serverConfig, error_1;
        var name = _b.name, value = _b.value;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.BASE_SERVER + '/secret', {
                            name: name,
                            value: value,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3: return [2 /*return*/, _c.sent()];
                case 4:
                    error_1 = _c.sent();
                    return [2 /*return*/, {
                            error: 'failed',
                            reason: error_1 instanceof errors_1.PostError ? error_1.reason : undefined,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function checkSecret(name) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.get)(serverConfig.BASE_SERVER + '/secret/' + name, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_2 = _a.sent();
                    log_1.logger.error(error_2);
                    return [2 /*return*/, { error: 'failed' }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var stopPolling = false;
function pollGoCardlessWebToken(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function getData(cb) {
            return __awaiter(this, void 0, void 0, function () {
                var serverConfig, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (stopPolling) {
                                return [2 /*return*/];
                            }
                            if (Date.now() - startTime >= 1000 * 60 * 10) {
                                cb({ status: 'timeout' });
                                return [2 /*return*/];
                            }
                            serverConfig = (0, server_config_1.getServer)();
                            if (!serverConfig) {
                                throw new Error('Failed to get server config.');
                            }
                            return [4 /*yield*/, (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/get-accounts', {
                                    requisitionId: requisitionId,
                                }, {
                                    'X-ACTUAL-TOKEN': userToken,
                                })];
                        case 1:
                            data = _a.sent();
                            if (data) {
                                if (data.error_code) {
                                    log_1.logger.error('Failed linking gocardless account:', data);
                                    cb({ status: 'unknown', message: data.error_type });
                                }
                                else {
                                    cb({ status: 'success', data: data });
                                }
                            }
                            else {
                                setTimeout(function () { return getData(cb); }, 3000);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        var userToken, startTime;
        var requisitionId = _b.requisitionId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    if (!userToken)
                        return [2 /*return*/, { error: 'unknown' }];
                    startTime = Date.now();
                    stopPolling = false;
                    return [2 /*return*/, new Promise(function (resolve) {
                            getData(function (data) {
                                if (data.status === 'success') {
                                    resolve({ data: data.data });
                                    return;
                                }
                                if (data.status === 'timeout') {
                                    resolve({ error: data.status });
                                    return;
                                }
                                resolve({
                                    error: data.status,
                                    message: data.message,
                                });
                            });
                        })];
            }
        });
    });
}
function stopGoCardlessWebTokenPolling() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            stopPolling = true;
            return [2 /*return*/, 'ok'];
        });
    });
}
function goCardlessStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    return [2 /*return*/, (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/status', {}, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
            }
        });
    });
}
function simpleFinStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    return [2 /*return*/, (0, post_1.post)(serverConfig.SIMPLEFIN_SERVER + '/status', {}, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
            }
        });
    });
}
function pluggyAiStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    return [2 /*return*/, (0, post_1.post)(serverConfig.PLUGGYAI_SERVER + '/status', {}, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
            }
        });
    });
}
function simpleFinAccounts() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.SIMPLEFIN_SERVER + '/accounts', {}, {
                            'X-ACTUAL-TOKEN': userToken,
                        }, 60000)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_3 = _a.sent();
                    return [2 /*return*/, { error_code: 'TIMED_OUT' }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function pluggyAiAccounts() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.PLUGGYAI_SERVER + '/accounts', {}, {
                            'X-ACTUAL-TOKEN': userToken,
                        }, 60000)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_4 = _a.sent();
                    return [2 /*return*/, { error_code: 'TIMED_OUT' }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getGoCardlessBanks(country) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, serverConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    return [2 /*return*/, (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/get-banks', { country: country, showDemo: (0, environment_1.isNonProductionEnvironment)() }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
            }
        });
    });
}
function createGoCardlessWebToken(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userToken, serverConfig, error_5;
        var institutionId = _b.institutionId, accessValidForDays = _b.accessValidForDays;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _c.sent();
                    if (!userToken) {
                        return [2 /*return*/, { error: 'unauthorized' }];
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/create-web-token', {
                            institutionId: institutionId,
                            accessValidForDays: accessValidForDays,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 3: return [2 /*return*/, _c.sent()];
                case 4:
                    error_5 = _c.sent();
                    log_1.logger.error(error_5);
                    return [2 /*return*/, { error: 'failed' }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function handleSyncResponse(res, acct) {
    return __awaiter(this, void 0, void 0, function () {
        var added, updated, newTransactions, matchedTransactions, updatedAccounts, ts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    added = res.added, updated = res.updated;
                    newTransactions = [];
                    matchedTransactions = [];
                    updatedAccounts = [];
                    newTransactions.push.apply(newTransactions, added);
                    matchedTransactions.push.apply(matchedTransactions, updated);
                    if (added.length > 0) {
                        updatedAccounts.push(acct.id);
                    }
                    ts = new Date().getTime().toString();
                    return [4 /*yield*/, db.update('accounts', { id: acct.id, last_sync: ts })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            newTransactions: newTransactions,
                            matchedTransactions: matchedTransactions,
                            updatedAccounts: updatedAccounts,
                        }];
            }
        });
    });
}
function handleSyncError(err, acct) {
    // TODO: refactor bank sync logic to use BankSyncError properly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (err instanceof errors_1.BankSyncError || (err === null || err === void 0 ? void 0 : err.type) === 'BankSyncError') {
        var error = err;
        var syncError = {
            type: 'SyncError',
            accountId: acct.id,
            message: 'Failed syncing account “' + acct.name + '.”',
            category: error.category,
            code: error.code,
        };
        if (error.category === 'RATE_LIMIT_EXCEEDED') {
            return __assign(__assign({}, syncError), { message: "Failed syncing account ".concat(acct.name, ". Rate limit exceeded. Please try again later.") });
        }
        return syncError;
    }
    if (err instanceof errors_1.PostError && err.reason !== 'internal') {
        return {
            accountId: acct.id,
            message: err.reason
                ? err.reason
                : "Account \u201C".concat(acct.name, "\u201D is not linked properly. Please link it again."),
        };
    }
    return {
        accountId: acct.id,
        message: 'There was an internal error. Please get in touch https://actualbudget.org/contact for support.',
        internal: err.stack,
    };
}
function accountsBankSync(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, userId, userKey, accounts, errors, newTransactions, matchedTransactions, updatedAccounts, _i, accounts_1, acct, syncResponse, syncResponseData, err_1, error;
        var _d = _b.ids, ids = _d === void 0 ? [] : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, asyncStorage.multiGet(['user-id', 'user-key'])];
                case 1:
                    _c = _e.sent(), userId = _c["user-id"], userKey = _c["user-key"];
                    return [4 /*yield*/, db.runQuery("\n    SELECT a.*, b.bank_id as bankId\n    FROM accounts a\n    LEFT JOIN banks b ON a.bank = b.id\n    WHERE a.tombstone = 0 AND a.closed = 0\n      ".concat(ids.length ? "AND a.id IN (".concat(ids.map(function () { return '?'; }).join(', '), ")") : '', "\n    ORDER BY a.offbudget, a.sort_order\n  "), ids, true)];
                case 2:
                    accounts = _e.sent();
                    errors = [];
                    newTransactions = [];
                    matchedTransactions = [];
                    updatedAccounts = [];
                    _i = 0, accounts_1 = accounts;
                    _e.label = 3;
                case 3:
                    if (!(_i < accounts_1.length)) return [3 /*break*/, 10];
                    acct = accounts_1[_i];
                    if (!(acct.bankId && acct.account_id)) return [3 /*break*/, 9];
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 7, 8, 9]);
                    log_1.logger.group('Bank Sync operation for account:', acct.name);
                    return [4 /*yield*/, bankSync.syncAccount(userId, userKey, acct.id, acct.account_id, acct.bankId)];
                case 5:
                    syncResponse = _e.sent();
                    return [4 /*yield*/, handleSyncResponse(syncResponse, acct)];
                case 6:
                    syncResponseData = _e.sent();
                    newTransactions.push.apply(newTransactions, syncResponseData.newTransactions);
                    matchedTransactions.push.apply(matchedTransactions, syncResponseData.matchedTransactions);
                    updatedAccounts.push.apply(updatedAccounts, syncResponseData.updatedAccounts);
                    return [3 /*break*/, 9];
                case 7:
                    err_1 = _e.sent();
                    error = err_1;
                    errors.push(handleSyncError(error, acct));
                    (0, exceptions_1.captureException)(__assign(__assign({}, error), { message: 'Failed syncing account “' + acct.name + '.”' }));
                    return [3 /*break*/, 9];
                case 8:
                    log_1.logger.groupEnd();
                    return [7 /*endfinally*/];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    if (updatedAccounts.length > 0) {
                        connection.send('sync-event', {
                            type: 'success',
                            tables: ['transactions'],
                        });
                    }
                    return [2 /*return*/, { errors: errors, newTransactions: newTransactions, matchedTransactions: matchedTransactions, updatedAccounts: updatedAccounts }];
            }
        });
    });
}
function simpleFinBatchSync(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var accounts, retVal, syncResponses, _loop_1, _i, syncResponses_1, syncResponse, err_2, errors, _c, accounts_2, account, error;
        var _d = _b.ids, ids = _d === void 0 ? [] : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, db.runQuery("SELECT a.*, b.bank_id as bankId FROM accounts a\n         LEFT JOIN banks b ON a.bank = b.id\n         WHERE\n          a.tombstone = 0\n          AND a.closed = 0\n          AND a.account_sync_source = 'simpleFin'\n          ".concat(ids.length ? "AND a.id IN (".concat(ids.map(function () { return '?'; }).join(', '), ")") : '', "\n         ORDER BY a.offbudget, a.sort_order"), ids.length ? ids : [], true)];
                case 1:
                    accounts = _e.sent();
                    retVal = [];
                    log_1.logger.group('Bank Sync operation for all SimpleFin accounts');
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, bankSync.simpleFinBatchSync(accounts.map(function (a) { return ({
                            id: a.id,
                            account_id: a.account_id || null,
                        }); }))];
                case 3:
                    syncResponses = _e.sent();
                    _loop_1 = function (syncResponse) {
                        var account, errors, newTransactions, matchedTransactions, updatedAccounts, syncResponseData;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    account = accounts.find(function (a) { return a.id === syncResponse.accountId; });
                                    if (!account) {
                                        log_1.logger.error("Invalid account ID found in response: ".concat(syncResponse.accountId, ". Proceeding to the next account..."));
                                        return [2 /*return*/, "continue"];
                                    }
                                    errors = [];
                                    newTransactions = [];
                                    matchedTransactions = [];
                                    updatedAccounts = [];
                                    if (!syncResponse.res.error_code) return [3 /*break*/, 1];
                                    errors.push(handleSyncError({
                                        type: 'BankSyncError',
                                        reason: 'Failed syncing account “' + account.name + '.”',
                                        category: syncResponse.res.error_type,
                                        code: syncResponse.res.error_code,
                                    }, account));
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, handleSyncResponse(syncResponse.res, account)];
                                case 2:
                                    syncResponseData = _f.sent();
                                    newTransactions.push.apply(newTransactions, syncResponseData.newTransactions);
                                    matchedTransactions.push.apply(matchedTransactions, syncResponseData.matchedTransactions);
                                    updatedAccounts.push.apply(updatedAccounts, syncResponseData.updatedAccounts);
                                    _f.label = 3;
                                case 3:
                                    retVal.push({
                                        accountId: syncResponse.accountId,
                                        res: { errors: errors, newTransactions: newTransactions, matchedTransactions: matchedTransactions, updatedAccounts: updatedAccounts },
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, syncResponses_1 = syncResponses;
                    _e.label = 4;
                case 4:
                    if (!(_i < syncResponses_1.length)) return [3 /*break*/, 7];
                    syncResponse = syncResponses_1[_i];
                    return [5 /*yield**/, _loop_1(syncResponse)];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _e.sent();
                    errors = [];
                    for (_c = 0, accounts_2 = accounts; _c < accounts_2.length; _c++) {
                        account = accounts_2[_c];
                        retVal.push({
                            accountId: account.id,
                            res: {
                                errors: errors,
                                newTransactions: [],
                                matchedTransactions: [],
                                updatedAccounts: [],
                            },
                        });
                        error = err_2;
                        errors.push(handleSyncError(error, account));
                    }
                    return [3 /*break*/, 9];
                case 9:
                    if (retVal.some(function (a) { return a.res.updatedAccounts.length > 0; })) {
                        connection.send('sync-event', {
                            type: 'success',
                            tables: ['transactions'],
                        });
                    }
                    log_1.logger.groupEnd();
                    return [2 /*return*/, retVal];
            }
        });
    });
}
function importTransactions(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var reconciled, err_3;
        var accountId = _b.accountId, transactions = _b.transactions, isPreview = _b.isPreview, opts = _b.opts;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (typeof accountId !== 'string') {
                        throw (0, errors_1.APIError)('transactions-import: accountId must be an id');
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, bankSync.reconcileTransactions(accountId, transactions, false, true, isPreview, opts === null || opts === void 0 ? void 0 : opts.defaultCleared)];
                case 2:
                    reconciled = _c.sent();
                    return [2 /*return*/, {
                            errors: [],
                            added: reconciled.added,
                            updated: reconciled.updated,
                            updatedPreview: reconciled.updatedPreview,
                        }];
                case 3:
                    err_3 = _c.sent();
                    if (err_3 instanceof errors_1.TransactionError) {
                        return [2 /*return*/, {
                                errors: [{ message: err_3.message }],
                                added: [],
                                updated: [],
                                updatedPreview: [],
                            }];
                    }
                    throw err_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function unlinkAccount(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var accRow, bankId, isGoCardless, accountWithBankResult, userToken, bank, serverConfig, requisitionId, error_6;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.first('SELECT * FROM accounts WHERE id = ?', [id])];
                case 1:
                    accRow = _c.sent();
                    if (!accRow) {
                        throw new Error("Account with ID ".concat(id, " not found."));
                    }
                    bankId = accRow.bank;
                    if (!bankId) {
                        return [2 /*return*/, 'ok'];
                    }
                    isGoCardless = accRow.account_sync_source === 'goCardless';
                    return [4 /*yield*/, db.updateAccount({
                            id: id,
                            account_id: null,
                            bank: null,
                            balance_current: null,
                            balance_available: null,
                            balance_limit: null,
                            account_sync_source: null,
                        })];
                case 2:
                    _c.sent();
                    if (isGoCardless === false) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, db.first('SELECT COUNT(*) as count FROM accounts WHERE bank = ?', [bankId])];
                case 3:
                    accountWithBankResult = _c.sent();
                    return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 4:
                    userToken = _c.sent();
                    if (!userToken) {
                        return [2 /*return*/, 'ok'];
                    }
                    if (!(!accountWithBankResult || accountWithBankResult.count === 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, db.first('SELECT bank_id FROM banks WHERE id = ?', [bankId])];
                case 5:
                    bank = _c.sent();
                    if (!bank) {
                        throw new Error("Bank with ID ".concat(bankId, " not found."));
                    }
                    serverConfig = (0, server_config_1.getServer)();
                    if (!serverConfig) {
                        throw new Error('Failed to get server config.');
                    }
                    requisitionId = bank.bank_id;
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/remove-account', {
                            requisitionId: requisitionId,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_6 = _c.sent();
                    log_1.logger.log({ error: error_6 });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, 'ok'];
            }
        });
    });
}
exports.app = (0, app_1.createApp)();
exports.app.method('account-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateAccount)));
exports.app.method('accounts-get', getAccounts);
exports.app.method('account-balance', getAccountBalance);
exports.app.method('account-properties', getAccountProperties);
exports.app.method('gocardless-accounts-link', linkGoCardlessAccount);
exports.app.method('simplefin-accounts-link', linkSimpleFinAccount);
exports.app.method('pluggyai-accounts-link', linkPluggyAiAccount);
exports.app.method('account-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createAccount)));
exports.app.method('account-close', (0, mutators_1.mutator)(closeAccount));
exports.app.method('account-reopen', (0, mutators_1.mutator)((0, undo_1.undoable)(reopenAccount)));
exports.app.method('account-move', (0, mutators_1.mutator)((0, undo_1.undoable)(moveAccount)));
exports.app.method('secret-set', setSecret);
exports.app.method('secret-check', checkSecret);
exports.app.method('gocardless-poll-web-token', pollGoCardlessWebToken);
exports.app.method('gocardless-poll-web-token-stop', stopGoCardlessWebTokenPolling);
exports.app.method('gocardless-status', goCardlessStatus);
exports.app.method('simplefin-status', simpleFinStatus);
exports.app.method('pluggyai-status', pluggyAiStatus);
exports.app.method('simplefin-accounts', simpleFinAccounts);
exports.app.method('pluggyai-accounts', pluggyAiAccounts);
exports.app.method('gocardless-get-banks', getGoCardlessBanks);
exports.app.method('gocardless-create-web-token', createGoCardlessWebToken);
exports.app.method('accounts-bank-sync', accountsBankSync);
exports.app.method('simplefin-batch-sync', simpleFinBatchSync);
exports.app.method('transactions-import', (0, mutators_1.mutator)((0, undo_1.undoable)(importTransactions)));
exports.app.method('account-unlink', (0, mutators_1.mutator)(unlinkAccount));
