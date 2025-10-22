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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.getGoCardlessAccounts = getGoCardlessAccounts;
exports.reconcileTransactions = reconcileTransactions;
exports.matchTransactions = matchTransactions;
exports.addTransactions = addTransactions;
exports.syncAccount = syncAccount;
exports.simpleFinBatchSync = simpleFinBatchSync;
// @ts-strict-ignore
var dateFns = require("date-fns");
var uuid_1 = require("uuid");
var asyncStorage = require("../../platform/server/asyncStorage");
var log_1 = require("../../platform/server/log");
var monthUtils = require("../../shared/months");
var query_1 = require("../../shared/query");
var transactions_1 = require("../../shared/transactions");
var util_1 = require("../../shared/util");
var aql_1 = require("../aql");
var db = require("../db");
var mutators_1 = require("../mutators");
var post_1 = require("../post");
var server_config_1 = require("../server-config");
var sync_1 = require("../sync");
var transactions_2 = require("../transactions");
var transaction_rules_1 = require("../transactions/transaction-rules");
var custom_sync_mapping_1 = require("../util/custom-sync-mapping");
var payees_1 = require("./payees");
var title_1 = require("./title");
function BankSyncError(type, code, details) {
    return { type: 'BankSyncError', category: type, code: code, details: details };
}
function makeSplitTransaction(trans, subtransactions) {
    // We need to calculate the final state of split transactions
    var _a = (0, transactions_1.recalculateSplit)(__assign(__assign({}, trans), { is_parent: true, subtransactions: subtransactions.map(function (transaction, idx) {
            return (0, transactions_1.makeChild)(trans, __assign(__assign({}, transaction), { sort_order: 0 - idx }));
        }) })), sub = _a.subtransactions, parent = __rest(_a, ["subtransactions"]);
    return __spreadArray([parent], sub, true);
}
function getAccountBalance(account) {
    // Debt account types need their balance reversed
    switch (account.type) {
        case 'credit':
        case 'loan':
            return -account.balances.current;
        default:
            return account.balances.current;
    }
}
function updateAccountBalance(id, balance) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.runQuery('UPDATE accounts SET balance_current = ? WHERE id = ?', [
                        balance,
                        id,
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getAccountOldestTransaction(id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                        .filter({
                        account: id,
                        date: { $lte: monthUtils.currentDay() },
                    })
                        .select('date')
                        .orderBy('date')
                        .limit(1))];
                case 1: return [2 /*return*/, (_a = (_b.sent()).data) === null || _a === void 0 ? void 0 : _a[0]];
            }
        });
    });
}
function getAccountSyncStartDate(id) {
    return __awaiter(this, void 0, void 0, function () {
        var dates, oldestTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dates = [monthUtils.subDays(monthUtils.currentDay(), 90)];
                    return [4 /*yield*/, getAccountOldestTransaction(id)];
                case 1:
                    oldestTransaction = _a.sent();
                    if (oldestTransaction)
                        dates.push(oldestTransaction.date);
                    return [2 /*return*/, monthUtils.dayFromDate(dateFns.max(dates.map(function (d) { return monthUtils.parseDate(d); })))];
            }
        });
    });
}
function getGoCardlessAccounts(userId, userKey, id) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().GOCARDLESS_SERVER + '/accounts', {
                            userId: userId,
                            key: userKey,
                            item_id: id,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 2:
                    res = _a.sent();
                    accounts = res.accounts;
                    accounts.forEach(function (acct) {
                        acct.balances.current = getAccountBalance(acct);
                    });
                    return [2 /*return*/, accounts];
            }
        });
    });
}
function downloadGoCardlessTransactions(userId_1, userKey_1, acctId_1, bankId_1, since_1) {
    return __awaiter(this, arguments, void 0, function (userId, userKey, acctId, bankId, since, includeBalance) {
        var userToken, res, errorDetails, all, balances, startingBalance;
        if (includeBalance === void 0) { includeBalance = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken)
                        return [2 /*return*/];
                    log_1.logger.log('Pulling transactions from GoCardless');
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().GOCARDLESS_SERVER + '/transactions', {
                            userId: userId,
                            key: userKey,
                            requisitionId: bankId,
                            accountId: acctId,
                            startDate: since,
                            includeBalance: includeBalance,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        })];
                case 2:
                    res = _a.sent();
                    if (res.error_code) {
                        errorDetails = {
                            rateLimitHeaders: res.rateLimitHeaders,
                        };
                        throw BankSyncError(res.error_type, res.error_code, errorDetails);
                    }
                    if (includeBalance) {
                        all = res.transactions.all, balances = res.balances, startingBalance = res.startingBalance;
                        log_1.logger.log('Response:', res);
                        return [2 /*return*/, {
                                transactions: all,
                                accountBalance: balances,
                                startingBalance: startingBalance,
                            }];
                    }
                    else {
                        log_1.logger.log('Response:', res);
                        return [2 /*return*/, {
                                transactions: res.transactions.all,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function downloadSimpleFinTransactions(acctId, since) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, batchSync, res, error_1, retVal, _i, _a, _b, accountId, data, error, singleRes;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _f.sent();
                    if (!userToken)
                        return [2 /*return*/];
                    batchSync = Array.isArray(acctId);
                    log_1.logger.log('Pulling transactions from SimpleFin');
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().SIMPLEFIN_SERVER + '/transactions', {
                            accountId: acctId,
                            startDate: since,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        }, 
                        // 5 minute timeout for batch sync, one minute for individual accounts
                        Array.isArray(acctId) ? 300000 : 60000)];
                case 3:
                    res = _f.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _f.sent();
                    log_1.logger.error('Suspected timeout during bank sync:', error_1);
                    throw BankSyncError('TIMED_OUT', 'TIMED_OUT');
                case 5:
                    if (Object.keys(res).length === 0) {
                        throw BankSyncError('NO_DATA', 'NO_DATA');
                    }
                    if (res.error_code) {
                        throw BankSyncError(res.error_type, res.error_code);
                    }
                    retVal = {};
                    if (batchSync) {
                        for (_i = 0, _a = Object.entries(res); _i < _a.length; _i++) {
                            _b = _a[_i], accountId = _b[0], data = _b[1];
                            if (accountId === 'errors')
                                continue;
                            error = (_d = (_c = res === null || res === void 0 ? void 0 : res.errors) === null || _c === void 0 ? void 0 : _c[accountId]) === null || _d === void 0 ? void 0 : _d[0];
                            retVal[accountId] = {
                                transactions: (_e = data === null || data === void 0 ? void 0 : data.transactions) === null || _e === void 0 ? void 0 : _e.all,
                                accountBalance: data === null || data === void 0 ? void 0 : data.balances,
                                startingBalance: data === null || data === void 0 ? void 0 : data.startingBalance,
                            };
                            if (error) {
                                retVal[accountId].error_type = error.error_type;
                                retVal[accountId].error_code = error.error_code;
                            }
                        }
                    }
                    else {
                        singleRes = res;
                        retVal = {
                            transactions: singleRes.transactions.all,
                            accountBalance: singleRes.balances,
                            startingBalance: singleRes.startingBalance,
                        };
                    }
                    log_1.logger.log('Response:', retVal);
                    return [2 /*return*/, retVal];
            }
        });
    });
}
function downloadPluggyAiTransactions(acctId, since) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, retVal, singleRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken)
                        return [2 /*return*/];
                    log_1.logger.log('Pulling transactions from Pluggy.ai');
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().PLUGGYAI_SERVER + '/transactions', {
                            accountId: acctId,
                            startDate: since,
                        }, {
                            'X-ACTUAL-TOKEN': userToken,
                        }, 60000)];
                case 2:
                    res = _a.sent();
                    if (res.error_code) {
                        throw BankSyncError(res.error_type, res.error_code);
                    }
                    else if ('error' in res) {
                        throw BankSyncError('Connection', res.error);
                    }
                    retVal = {};
                    singleRes = res;
                    retVal = {
                        transactions: singleRes.transactions.all,
                        accountBalance: singleRes.balances,
                        startingBalance: singleRes.startingBalance,
                    };
                    log_1.logger.log('Response:', retVal);
                    return [2 /*return*/, retVal];
            }
        });
    });
}
function resolvePayee(trans, payeeName, payeesToCreate) {
    return __awaiter(this, void 0, void 0, function () {
        var payee, _a, newPayee;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(trans.payee == null && payeeName)) return [3 /*break*/, 3];
                    payee = payeesToCreate.get(payeeName.toLowerCase());
                    _a = payee;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.getPayeeByName(payeeName)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    payee = _a;
                    if (payee != null) {
                        return [2 /*return*/, payee.id];
                    }
                    else {
                        newPayee = { id: (0, uuid_1.v4)(), name: payeeName };
                        payeesToCreate.set(payeeName.toLowerCase(), newPayee);
                        return [2 /*return*/, newPayee.id];
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/, trans.payee];
            }
        });
    });
}
function normalizeTransactions(transactions_3, acctId_1) {
    return __awaiter(this, arguments, void 0, function (transactions, acctId, _a) {
        var payeesToCreate, normalized, _i, transactions_4, trans, originalPayeeName, subtransactions, rest, payee_name, trimmed, _b;
        var _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.rawPayeeName, rawPayeeName = _e === void 0 ? false : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    payeesToCreate = new Map();
                    normalized = [];
                    _i = 0, transactions_4 = transactions;
                    _f.label = 1;
                case 1:
                    if (!(_i < transactions_4.length)) return [3 /*break*/, 4];
                    trans = transactions_4[_i];
                    // Validate the date because we do some stuff with it. The db
                    // layer does better validation, but this will give nicer errors
                    if (trans.date == null) {
                        throw new Error('`date` is required when adding a transaction');
                    }
                    originalPayeeName = trans.payee_name, subtransactions = trans.subtransactions, rest = __rest(trans, ["payee_name", "subtransactions"]);
                    trans = rest;
                    payee_name = originalPayeeName;
                    if (payee_name) {
                        trimmed = payee_name.trim();
                        if (trimmed === '') {
                            payee_name = null;
                        }
                        else {
                            payee_name = rawPayeeName ? trimmed : (0, title_1.title)(trimmed);
                        }
                    }
                    trans.imported_payee = trans.imported_payee || payee_name;
                    if (trans.imported_payee) {
                        trans.imported_payee = trans.imported_payee.trim();
                    }
                    // It's important to resolve both the account and payee early so
                    // when rules are run, they have the right data. Resolving payees
                    // also simplifies the payee creation process
                    trans.account = acctId;
                    _b = trans;
                    return [4 /*yield*/, resolvePayee(trans, payee_name, payeesToCreate)];
                case 2:
                    _b.payee = _f.sent();
                    trans.category = (_c = trans.category) !== null && _c !== void 0 ? _c : null;
                    normalized.push({
                        payee_name: payee_name,
                        subtransactions: subtransactions
                            ? subtransactions.map(function (t) { return (__assign(__assign({}, t), { account: acctId })); })
                            : null,
                        trans: trans,
                    });
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, { normalized: normalized, payeesToCreate: payeesToCreate }];
            }
        });
    });
}
function normalizeBankSyncTransactions(transactions, acctId) {
    return __awaiter(this, void 0, void 0, function () {
        var payeesToCreate, _a, customMappingsRaw, importPending, importNotes, mappings, normalized, _i, transactions_3, trans, mapping, date, payeeName, notes, imported_id, _b;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    payeesToCreate = new Map();
                    return [4 /*yield*/, Promise.all([
                            (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
                                .filter({ id: "custom-sync-mappings-".concat(acctId) })
                                .select('value')).then(function (data) { var _a, _b; return (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value; }),
                            (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
                                .filter({ id: "sync-import-pending-".concat(acctId) })
                                .select('value')).then(function (data) { var _a, _b, _c; return String((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 'true') === 'true'; }),
                            (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
                                .filter({ id: "sync-import-notes-".concat(acctId) })
                                .select('value')).then(function (data) { var _a, _b, _c; return String((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 'true') === 'true'; }),
                        ])];
                case 1:
                    _a = _f.sent(), customMappingsRaw = _a[0], importPending = _a[1], importNotes = _a[2];
                    mappings = customMappingsRaw
                        ? (0, custom_sync_mapping_1.mappingsFromString)(customMappingsRaw)
                        : custom_sync_mapping_1.defaultMappings;
                    normalized = [];
                    _i = 0, transactions_3 = transactions;
                    _f.label = 2;
                case 2:
                    if (!(_i < transactions_3.length)) return [3 /*break*/, 5];
                    trans = transactions_3[_i];
                    trans.cleared = Boolean(trans.booked);
                    if (!importPending && !trans.cleared)
                        return [3 /*break*/, 4];
                    if (!trans.amount) {
                        trans.amount = trans.transactionAmount.amount;
                    }
                    mapping = mappings.get(trans.amount <= 0 ? 'payment' : 'deposit');
                    date = (_c = trans[mapping.get('date')]) !== null && _c !== void 0 ? _c : trans.date;
                    payeeName = (_d = trans[mapping.get('payee')]) !== null && _d !== void 0 ? _d : trans.payeeName;
                    notes = trans[mapping.get('notes')];
                    // Validate the date because we do some stuff with it. The db
                    // layer does better validation, but this will give nicer errors
                    if (date == null) {
                        throw new Error('`date` is required when adding a transaction');
                    }
                    if (payeeName == null) {
                        throw new Error('`payeeName` is required when adding a transaction');
                    }
                    trans.imported_payee = trans.imported_payee || payeeName;
                    if (trans.imported_payee) {
                        trans.imported_payee = trans.imported_payee.trim();
                    }
                    imported_id = trans.transactionId;
                    if (trans.cleared && !trans.transactionId && trans.internalTransactionId) {
                        imported_id = "".concat(trans.account, "-").concat(trans.internalTransactionId);
                    }
                    // It's important to resolve both the account and payee early so
                    // when rules are run, they have the right data. Resolving payees
                    // also simplifies the payee creation process
                    trans.account = acctId;
                    _b = trans;
                    return [4 /*yield*/, resolvePayee(trans, payeeName, payeesToCreate)];
                case 3:
                    _b.payee = _f.sent();
                    normalized.push({
                        payee_name: payeeName,
                        trans: {
                            amount: (0, util_1.amountToInteger)(trans.amount),
                            payee: trans.payee,
                            account: trans.account,
                            date: date,
                            notes: importNotes && notes ? notes.trim().replace(/#/g, '##') : null,
                            category: (_e = trans.category) !== null && _e !== void 0 ? _e : null,
                            imported_id: imported_id,
                            imported_payee: trans.imported_payee,
                            cleared: trans.cleared,
                            raw_synced_data: JSON.stringify(trans),
                        },
                    });
                    _f.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, { normalized: normalized, payeesToCreate: payeesToCreate }];
            }
        });
    });
}
function createNewPayees(payeesToCreate, addsAndUpdates) {
    return __awaiter(this, void 0, void 0, function () {
        var usedPayeeIds;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usedPayeeIds = new Set(addsAndUpdates.map(function (t) { return t.payee; }));
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, _a, payee;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _i = 0, _a = payeesToCreate.values();
                                        _b.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                                        payee = _a[_i];
                                        if (!usedPayeeIds.has(payee.id)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, db.insertPayee(payee)];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
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
function reconcileTransactions(acctId_1, transactions_5) {
    return __awaiter(this, arguments, void 0, function (acctId, transactions, isBankSyncAccount, strictIdChecking, isPreview, defaultCleared) {
        var updated, added, updatedPreview, existingPayeeMap, _a, payeesToCreate, transactionsStep1, transactionsStep2, transactionsStep3, _loop_1, _i, transactionsStep3_1, _b, trans, subtransactions, match, now;
        var _c, _d, _e, _f;
        if (isBankSyncAccount === void 0) { isBankSyncAccount = false; }
        if (strictIdChecking === void 0) { strictIdChecking = true; }
        if (isPreview === void 0) { isPreview = false; }
        if (defaultCleared === void 0) { defaultCleared = true; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    log_1.logger.log('Performing transaction reconciliation');
                    updated = [];
                    added = [];
                    updatedPreview = [];
                    existingPayeeMap = new Map();
                    return [4 /*yield*/, matchTransactions(acctId, transactions, isBankSyncAccount, strictIdChecking)];
                case 1:
                    _a = _g.sent(), payeesToCreate = _a.payeesToCreate, transactionsStep1 = _a.transactionsStep1, transactionsStep2 = _a.transactionsStep2, transactionsStep3 = _a.transactionsStep3;
                    _loop_1 = function (trans, subtransactions, match) {
                        var existing_1, updates, fieldsToMarkUpdated, payee, children, _h, children_1, child, forceAddTransaction, newTrans, finalTransaction;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    if (!(match && !trans.forceAddTransaction)) return [3 /*break*/, 7];
                                    // Skip updating already reconciled (locked) transactions
                                    if (match.reconciled) {
                                        updatedPreview.push({ transaction: trans, ignored: true });
                                        return [2 /*return*/, "continue"];
                                    }
                                    existing_1 = __assign(__assign({}, match), { cleared: match.cleared === 1, date: db.fromDateRepr(match.date) });
                                    updates = {
                                        imported_id: trans.imported_id || null,
                                        payee: existing_1.payee || trans.payee || null,
                                        category: existing_1.category || trans.category || null,
                                        imported_payee: trans.imported_payee || null,
                                        notes: existing_1.notes || trans.notes || null,
                                        cleared: (_c = trans.cleared) !== null && _c !== void 0 ? _c : existing_1.cleared,
                                        raw_synced_data: (_e = (_d = existing_1.raw_synced_data) !== null && _d !== void 0 ? _d : trans.raw_synced_data) !== null && _e !== void 0 ? _e : null,
                                    };
                                    fieldsToMarkUpdated = Object.keys(updates).filter(function (k) {
                                        // do not mark raw_synced_data if it's gone from falsy to falsy
                                        if (!existing_1.raw_synced_data && !trans.raw_synced_data) {
                                            return k !== 'raw_synced_data';
                                        }
                                        return true;
                                    });
                                    if (!(0, util_1.hasFieldsChanged)(existing_1, updates, fieldsToMarkUpdated)) return [3 /*break*/, 3];
                                    updated.push(__assign({ id: existing_1.id }, updates));
                                    if (!!existingPayeeMap.has(existing_1.payee)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db.getPayee(existing_1.payee)];
                                case 1:
                                    payee = _j.sent();
                                    existingPayeeMap.set(existing_1.payee, payee === null || payee === void 0 ? void 0 : payee.name);
                                    _j.label = 2;
                                case 2:
                                    existing_1.payee_name = existingPayeeMap.get(existing_1.payee);
                                    existing_1.amount = (0, util_1.integerToAmount)(existing_1.amount);
                                    updatedPreview.push({ transaction: trans, existing: existing_1 });
                                    return [3 /*break*/, 4];
                                case 3:
                                    updatedPreview.push({ transaction: trans, ignored: true });
                                    _j.label = 4;
                                case 4:
                                    if (!(existing_1.is_parent && existing_1.cleared !== updates.cleared)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, db.all('SELECT id FROM v_transactions WHERE parent_id = ?', [existing_1.id])];
                                case 5:
                                    children = _j.sent();
                                    for (_h = 0, children_1 = children; _h < children_1.length; _h++) {
                                        child = children_1[_h];
                                        updated.push({ id: child.id, cleared: updates.cleared });
                                    }
                                    _j.label = 6;
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    if (trans.tombstone) {
                                        if (isPreview) {
                                            updatedPreview.push({
                                                transaction: trans,
                                                existing: false,
                                                tombstone: true,
                                            });
                                        }
                                    }
                                    else {
                                        forceAddTransaction = trans.forceAddTransaction, newTrans = __rest(trans, ["forceAddTransaction"]);
                                        finalTransaction = __assign(__assign({}, newTrans), { id: (0, uuid_1.v4)(), category: trans.category || null, cleared: (_f = trans.cleared) !== null && _f !== void 0 ? _f : defaultCleared });
                                        if (subtransactions && subtransactions.length > 0) {
                                            added.push.apply(added, makeSplitTransaction(finalTransaction, subtransactions));
                                        }
                                        else {
                                            added.push(finalTransaction);
                                        }
                                    }
                                    _j.label = 8;
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, transactionsStep3_1 = transactionsStep3;
                    _g.label = 2;
                case 2:
                    if (!(_i < transactionsStep3_1.length)) return [3 /*break*/, 5];
                    _b = transactionsStep3_1[_i], trans = _b.trans, subtransactions = _b.subtransactions, match = _b.match;
                    return [5 /*yield**/, _loop_1(trans, subtransactions, match)];
                case 3:
                    _g.sent();
                    _g.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    now = Date.now();
                    added.forEach(function (t, index) {
                        var _a;
                        (_a = t.sort_order) !== null && _a !== void 0 ? _a : (t.sort_order = now - index);
                    });
                    if (!!isPreview) return [3 /*break*/, 8];
                    return [4 /*yield*/, createNewPayees(payeesToCreate, __spreadArray(__spreadArray([], added, true), updated, true))];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, (0, transactions_2.batchUpdateTransactions)({ added: added, updated: updated })];
                case 7:
                    _g.sent();
                    _g.label = 8;
                case 8:
                    log_1.logger.log('Debug data for the operations:', {
                        transactionsStep1: transactionsStep1,
                        transactionsStep2: transactionsStep2,
                        transactionsStep3: transactionsStep3,
                        added: added,
                        updated: updated,
                        updatedPreview: updatedPreview,
                    });
                    return [2 /*return*/, {
                            added: added.map(function (trans) { return trans.id; }),
                            updated: updated.map(function (trans) { return trans.id; }),
                            updatedPreview: updatedPreview,
                        }];
            }
        });
    });
}
function matchTransactions(acctId_1, transactions_5) {
    return __awaiter(this, arguments, void 0, function (acctId, transactions, isBankSyncAccount, strictIdChecking) {
        var reimportDeleted, hasMatched, transactionNormalization, _a, normalized, payeesToCreate, accounts, accountsMap, transactionsStep1, _loop_2, _i, normalized_1, _b, payee_name, originalTrans, subtransactions, transactionsStep2, transactionsStep3;
        if (isBankSyncAccount === void 0) { isBankSyncAccount = false; }
        if (strictIdChecking === void 0) { strictIdChecking = true; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    log_1.logger.log('Performing transaction reconciliation matching');
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
                            .filter({ id: "sync-reimport-deleted-".concat(acctId) })
                            .select('value')).then(function (data) { var _a, _b, _c; return String((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 'true') === 'true'; })];
                case 1:
                    reimportDeleted = _c.sent();
                    hasMatched = new Set();
                    transactionNormalization = isBankSyncAccount
                        ? normalizeBankSyncTransactions
                        : normalizeTransactions;
                    return [4 /*yield*/, transactionNormalization(transactions, acctId)];
                case 2:
                    _a = _c.sent(), normalized = _a.normalized, payeesToCreate = _a.payeesToCreate;
                    return [4 /*yield*/, db.getAccounts()];
                case 3:
                    accounts = _c.sent();
                    accountsMap = new Map(accounts.map(function (account) { return [account.id, account]; }));
                    transactionsStep1 = [];
                    _loop_2 = function (payee_name, originalTrans, subtransactions) {
                        var trans, match, fuzzyDataset, table, sevenDaysBefore, sevenDaysAfter;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, (0, transaction_rules_1.runRules)(originalTrans, accountsMap)];
                                case 1:
                                    trans = _d.sent();
                                    match = null;
                                    fuzzyDataset = null;
                                    if (!trans.imported_id) return [3 /*break*/, 3];
                                    table = reimportDeleted
                                        ? 'v_transactions'
                                        : 'v_transactions_internal';
                                    return [4 /*yield*/, db.first("SELECT * FROM ".concat(table, " WHERE imported_id = ? AND account = ?"), [trans.imported_id, acctId])];
                                case 2:
                                    match = _d.sent();
                                    if (match) {
                                        hasMatched.add(match.id);
                                    }
                                    _d.label = 3;
                                case 3:
                                    if (!!match) return [3 /*break*/, 8];
                                    sevenDaysBefore = db.toDateRepr(monthUtils.subDays(trans.date, 7));
                                    sevenDaysAfter = db.toDateRepr(monthUtils.addDays(trans.date, 7));
                                    if (!strictIdChecking) return [3 /*break*/, 5];
                                    return [4 /*yield*/, db.all("SELECT id, is_parent, date, imported_id, payee, imported_payee, category, notes, reconciled, cleared, amount\n          FROM v_transactions\n          WHERE\n            -- If both ids are set, and we didn't match earlier then skip dedup\n            (imported_id IS NULL OR ? IS NULL)\n            AND date >= ? AND date <= ? AND amount = ?\n            AND account = ?", [
                                            trans.imported_id || null,
                                            sevenDaysBefore,
                                            sevenDaysAfter,
                                            trans.amount || 0,
                                            acctId,
                                        ])];
                                case 4:
                                    fuzzyDataset = _d.sent();
                                    return [3 /*break*/, 7];
                                case 5: return [4 /*yield*/, db.all("SELECT id, is_parent, date, imported_id, payee, imported_payee, category, notes, reconciled, cleared, amount\n          FROM v_transactions\n          WHERE date >= ? AND date <= ? AND amount = ? AND account = ?", [sevenDaysBefore, sevenDaysAfter, trans.amount || 0, acctId])];
                                case 6:
                                    fuzzyDataset = _d.sent();
                                    _d.label = 7;
                                case 7:
                                    // Sort the matched transactions according to the distance from the original
                                    // transactions date. i.e. if the original transaction is in 21-02-2024 and
                                    // the matched transactions are: 20-02-2024, 21-02-2024, 29-02-2024 then
                                    // the resulting data-set should be: 21-02-2024, 20-02-2024, 29-02-2024.
                                    fuzzyDataset = fuzzyDataset.sort(function (a, b) {
                                        var aDistance = Math.abs(dateFns.differenceInMilliseconds(dateFns.parseISO(trans.date), dateFns.parseISO(db.fromDateRepr(a.date))));
                                        var bDistance = Math.abs(dateFns.differenceInMilliseconds(dateFns.parseISO(trans.date), dateFns.parseISO(db.fromDateRepr(b.date))));
                                        return aDistance > bDistance ? 1 : -1;
                                    });
                                    _d.label = 8;
                                case 8:
                                    transactionsStep1.push({
                                        payee_name: payee_name,
                                        trans: trans,
                                        subtransactions: trans.subtransactions || subtransactions,
                                        match: match,
                                        fuzzyDataset: fuzzyDataset,
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, normalized_1 = normalized;
                    _c.label = 4;
                case 4:
                    if (!(_i < normalized_1.length)) return [3 /*break*/, 7];
                    _b = normalized_1[_i], payee_name = _b.payee_name, originalTrans = _b.trans, subtransactions = _b.subtransactions;
                    return [5 /*yield**/, _loop_2(payee_name, originalTrans, subtransactions)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    transactionsStep2 = transactionsStep1.map(function (data) {
                        if (!data.match && data.fuzzyDataset) {
                            // Try to find one where the payees match.
                            var match = data.fuzzyDataset.find(function (row) { return !hasMatched.has(row.id) && data.trans.payee === row.payee; });
                            if (match) {
                                hasMatched.add(match.id);
                                return __assign(__assign({}, data), { match: match });
                            }
                        }
                        return data;
                    });
                    transactionsStep3 = transactionsStep2.map(function (data) {
                        if (!data.match && data.fuzzyDataset) {
                            var match = data.fuzzyDataset.find(function (row) { return !hasMatched.has(row.id); });
                            if (match) {
                                hasMatched.add(match.id);
                                return __assign(__assign({}, data), { match: match });
                            }
                        }
                        return data;
                    });
                    return [2 /*return*/, {
                            payeesToCreate: payeesToCreate,
                            transactionsStep1: transactionsStep1,
                            transactionsStep2: transactionsStep2,
                            transactionsStep3: transactionsStep3,
                        }];
            }
        });
    });
}
// This is similar to `reconcileTransactions` except much simpler: it
// does not try to match any transactions. It just adds them
function addTransactions(acctId_1, transactions_5) {
    return __awaiter(this, arguments, void 0, function (acctId, transactions, _a) {
        var added, _b, normalized, payeesToCreate, accounts, accountsMap, _i, normalized_2, _c, originalTrans, subtransactions, trans, finalTransaction, updatedSubtransactions, newTransactions, res;
        var _this = this;
        var _d = _a === void 0 ? {} : _a, _e = _d.runTransfers, runTransfers = _e === void 0 ? true : _e, _f = _d.learnCategories, learnCategories = _f === void 0 ? false : _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    added = [];
                    return [4 /*yield*/, normalizeTransactions(transactions, acctId, { rawPayeeName: true })];
                case 1:
                    _b = _g.sent(), normalized = _b.normalized, payeesToCreate = _b.payeesToCreate;
                    return [4 /*yield*/, db.getAccounts()];
                case 2:
                    accounts = _g.sent();
                    accountsMap = new Map(accounts.map(function (account) { return [account.id, account]; }));
                    _i = 0, normalized_2 = normalized;
                    _g.label = 3;
                case 3:
                    if (!(_i < normalized_2.length)) return [3 /*break*/, 6];
                    _c = normalized_2[_i], originalTrans = _c.trans, subtransactions = _c.subtransactions;
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)(originalTrans, accountsMap)];
                case 4:
                    trans = _g.sent();
                    finalTransaction = __assign(__assign({ id: (0, uuid_1.v4)() }, trans), { account: acctId, cleared: trans.cleared != null ? trans.cleared : true });
                    updatedSubtransactions = finalTransaction.subtransactions || subtransactions;
                    if (updatedSubtransactions && updatedSubtransactions.length > 0) {
                        added.push.apply(added, makeSplitTransaction(finalTransaction, updatedSubtransactions));
                    }
                    else {
                        added.push(finalTransaction);
                    }
                    _g.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, createNewPayees(payeesToCreate, added)];
                case 7:
                    _g.sent();
                    if (!(runTransfers || learnCategories)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, transactions_2.batchUpdateTransactions)({
                            added: added,
                            learnCategories: learnCategories,
                            runTransfers: runTransfers,
                        })];
                case 8:
                    res = _g.sent();
                    newTransactions = res.added.map(function (t) { return t.id; });
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.all(added.map(function (trans) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, db.insertTransaction(trans)];
                                    }); }); }))];
                                case 1:
                                    newTransactions = _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [2 /*return*/, newTransactions];
            }
        });
    });
}
function processBankSyncDownload(download_1, id_1, acctRow_1) {
    return __awaiter(this, arguments, void 0, function (download, id, acctRow, initialSync) {
        var useStrictIdChecking, importTransactions, originalTransactions, currentBalance, transactions_5, balanceToUse_1, previousBalance, currentBalance_1, previousBalance, oldestTransaction, oldestDate_1, payee_1, transactions;
        var _this = this;
        if (initialSync === void 0) { initialSync = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    useStrictIdChecking = !acctRow.account_sync_source;
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('preferences')
                            .filter({ id: "sync-import-transactions-".concat(id) })
                            .select('value')).then(function (data) { var _a, _b, _c; return String((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 'true') === 'true'; })];
                case 1:
                    importTransactions = _a.sent();
                    originalTransactions = download.transactions, currentBalance = download.startingBalance;
                    if (!initialSync) return [3 /*break*/, 3];
                    transactions_5 = download.transactions;
                    balanceToUse_1 = currentBalance;
                    if (acctRow.account_sync_source === 'simpleFin') {
                        previousBalance = transactions_5.reduce(function (total, trans) {
                            return (total - parseInt(trans.transactionAmount.amount.replace('.', '')));
                        }, currentBalance);
                        balanceToUse_1 = previousBalance;
                    }
                    if (acctRow.account_sync_source === 'pluggyai') {
                        currentBalance_1 = download.startingBalance;
                        previousBalance = transactions_5.reduce(function (total, trans) { return total - trans.transactionAmount.amount * 100; }, currentBalance_1);
                        balanceToUse_1 = Math.round(previousBalance);
                    }
                    oldestTransaction = transactions_5[transactions_5.length - 1];
                    oldestDate_1 = transactions_5.length > 0
                        ? oldestTransaction.date
                        : monthUtils.currentDay();
                    return [4 /*yield*/, (0, payees_1.getStartingBalancePayee)()];
                case 2:
                    payee_1 = _a.sent();
                    return [2 /*return*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var initialId, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, db.insertTransaction({
                                            account: id,
                                            amount: balanceToUse_1,
                                            category: acctRow.offbudget === 0 ? payee_1.category : null,
                                            payee: payee_1.id,
                                            date: oldestDate_1,
                                            cleared: true,
                                            starting_balance_flag: true,
                                        })];
                                    case 1:
                                        initialId = _a.sent();
                                        return [4 /*yield*/, reconcileTransactions(id, transactions_5, true, useStrictIdChecking)];
                                    case 2:
                                        result = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, result), { added: __spreadArray([initialId], result.added, true) })];
                                }
                            });
                        }); })];
                case 3:
                    transactions = originalTransactions.map(function (trans) { return (__assign(__assign({}, trans), { account: id })); });
                    return [2 /*return*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, reconcileTransactions(id, importTransactions ? transactions : [], true, useStrictIdChecking)];
                                    case 1:
                                        result = _a.sent();
                                        if (!(currentBalance != null)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, updateAccountBalance(id, currentBalance)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/, result];
                                }
                            });
                        }); })];
            }
        });
    });
}
function syncAccount(userId, userKey, id, acctId, bankId) {
    return __awaiter(this, void 0, void 0, function () {
        var acctRow, syncStartDate, oldestTransaction, newAccount, download;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.select('accounts', id)];
                case 1:
                    acctRow = _a.sent();
                    return [4 /*yield*/, getAccountSyncStartDate(id)];
                case 2:
                    syncStartDate = _a.sent();
                    return [4 /*yield*/, getAccountOldestTransaction(id)];
                case 3:
                    oldestTransaction = _a.sent();
                    newAccount = oldestTransaction == null;
                    if (!(acctRow.account_sync_source === 'simpleFin')) return [3 /*break*/, 5];
                    return [4 /*yield*/, downloadSimpleFinTransactions(acctId, syncStartDate)];
                case 4:
                    download = _a.sent();
                    return [3 /*break*/, 10];
                case 5:
                    if (!(acctRow.account_sync_source === 'pluggyai')) return [3 /*break*/, 7];
                    return [4 /*yield*/, downloadPluggyAiTransactions(acctId, syncStartDate)];
                case 6:
                    download = _a.sent();
                    return [3 /*break*/, 10];
                case 7:
                    if (!(acctRow.account_sync_source === 'goCardless')) return [3 /*break*/, 9];
                    return [4 /*yield*/, downloadGoCardlessTransactions(userId, userKey, acctId, bankId, syncStartDate, newAccount)];
                case 8:
                    download = _a.sent();
                    return [3 /*break*/, 10];
                case 9: throw new Error("Unrecognized bank-sync provider: ".concat(acctRow.account_sync_source));
                case 10: return [2 /*return*/, processBankSyncDownload(download, id, acctRow, newAccount)];
            }
        });
    });
}
function simpleFinBatchSync(accounts) {
    return __awaiter(this, void 0, void 0, function () {
        var startDates, res, promises, _loop_3, i;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(accounts.map(function (a) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, getAccountSyncStartDate(a.id)];
                    }); }); }))];
                case 1:
                    startDates = _a.sent();
                    return [4 /*yield*/, downloadSimpleFinTransactions(accounts.map(function (a) { return a.account_id; }), startDates)];
                case 2:
                    res = _a.sent();
                    promises = [];
                    _loop_3 = function (i) {
                        var account, download, acctRow, oldestTransaction, newAccount;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    account = accounts[i];
                                    download = res[account.account_id];
                                    return [4 /*yield*/, db.select('accounts', account.id)];
                                case 1:
                                    acctRow = _b.sent();
                                    return [4 /*yield*/, getAccountOldestTransaction(account.id)];
                                case 2:
                                    oldestTransaction = _b.sent();
                                    newAccount = oldestTransaction == null;
                                    if (download.error_code) {
                                        promises.push(Promise.resolve({
                                            accountId: account.id,
                                            res: download,
                                        }));
                                        return [2 /*return*/, "continue"];
                                    }
                                    promises.push(processBankSyncDownload(download, account.id, acctRow, newAccount).then(function (res) { return ({
                                        accountId: account.id,
                                        res: res,
                                    }); }));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < accounts.length)) return [3 /*break*/, 6];
                    return [5 /*yield**/, _loop_3(i)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6: return [4 /*yield*/, Promise.all(promises)];
                case 7: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
