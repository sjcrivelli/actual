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
exports.getBudgetName = getBudgetName;
exports.parseFile = parseFile;
// @ts-strict-ignore
// This is a special usage of the API because this package is embedded
// into Actual itself. We only want to pull in the methods in that
// case and ignore everything else; otherwise we'd be pulling in the
// entire backend bundle from the API
var injected_1 = require("@actual-app/api/injected");
var actual = require("@actual-app/api/methods");
var adm_zip_1 = require("adm-zip");
var slash_1 = require("slash");
var uuid_1 = require("uuid");
var log_1 = require("../../platform/server/log");
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
// Importer
function importAccounts(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        var accounts;
        var _this = this;
        return __generator(this, function (_a) {
            accounts = (0, util_1.sortByKey)(data.accounts, 'sortableIndex');
            return [2 /*return*/, Promise.all(accounts.map(function (account) { return __awaiter(_this, void 0, void 0, function () {
                    var id;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!account.isTombstone) return [3 /*break*/, 2];
                                return [4 /*yield*/, actual.createAccount({
                                        name: account.accountName,
                                        offbudget: account.onBudget ? false : true,
                                        closed: account.hidden ? true : false,
                                    })];
                            case 1:
                                id = _a.sent();
                                entityIdMap.set(account.entityId, id);
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); }))];
        });
    });
}
function importCategories(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        var masterCategories;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    masterCategories = (0, util_1.sortByKey)(data.masterCategories, 'sortableIndex');
                    return [4 /*yield*/, Promise.all(masterCategories.map(function (masterCategory) { return __awaiter(_this, void 0, void 0, function () {
                            var id, subCategories, _i, subCategories_1, category, categoryName, categoryNameParts, id_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(masterCategory.type === 'OUTFLOW' &&
                                            !masterCategory.isTombstone &&
                                            masterCategory.subCategories &&
                                            masterCategory.subCategories.some(function (cat) { return !cat.isTombstone; }))) return [3 /*break*/, 5];
                                        return [4 /*yield*/, actual.createCategoryGroup({
                                                name: masterCategory.name,
                                                is_income: false,
                                            })];
                                    case 1:
                                        id = _a.sent();
                                        entityIdMap.set(masterCategory.entityId, id);
                                        if (masterCategory.note) {
                                            (0, injected_1.send)('notes-save', { id: id, note: masterCategory.note });
                                        }
                                        if (!masterCategory.subCategories) return [3 /*break*/, 5];
                                        subCategories = (0, util_1.sortByKey)(masterCategory.subCategories, 'sortableIndex');
                                        subCategories.reverse();
                                        _i = 0, subCategories_1 = subCategories;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < subCategories_1.length)) return [3 /*break*/, 5];
                                        category = subCategories_1[_i];
                                        if (!!category.isTombstone) return [3 /*break*/, 4];
                                        categoryName = category.name;
                                        // Hidden categories have the parent category entity id
                                        // appended to the end of the sub category name.
                                        // The format is 'MasterCategory ` SubCategory ` entityId'.
                                        // Remove the id to shorten the name.
                                        if (masterCategory.name === 'Hidden Categories') {
                                            categoryNameParts = categoryName.split(' ` ');
                                            // Remove the last part, which is the entityId.
                                            categoryNameParts.pop();
                                            // Join the remaining parts with a slash between them.
                                            categoryName = categoryNameParts.join('/').trim();
                                        }
                                        return [4 /*yield*/, actual.createCategory({
                                                name: categoryName,
                                                group_id: entityIdMap.get(category.masterCategoryId),
                                            })];
                                    case 3:
                                        id_1 = _a.sent();
                                        entityIdMap.set(category.entityId, id_1);
                                        if (category.note) {
                                            (0, injected_1.send)('notes-save', { id: id_1, note: category.note });
                                        }
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function importPayees(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, payee, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = data.payees;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    payee = _a[_i];
                    if (!!payee.isTombstone) return [3 /*break*/, 3];
                    return [4 /*yield*/, actual.createPayee({
                            name: payee.name,
                            category: entityIdMap.get(payee.autoFillCategoryId) || null,
                            transfer_acct: entityIdMap.get(payee.targetAccountId) || null,
                        })];
                case 2:
                    id = _b.sent();
                    // TODO: import payee rules
                    entityIdMap.set(payee.entityId, id);
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function importTransactions(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        function getCategory(id) {
            if (id == null || id === 'Category/__Split__') {
                return null;
            }
            else if (id === 'Category/__ImmediateIncome__' ||
                id === 'Category/__DeferredIncome__') {
                return incomeCategoryId;
            }
            return entityIdMap.get(id);
        }
        function isOffBudget(acctId) {
            var acct = accounts.find(function (acct) { return acct.id === acctId; });
            if (!acct) {
                throw new Error('Could not find account for transaction when importing');
            }
            return acct.offbudget;
        }
        var categories, incomeCategoryId, accounts, payees, _i, _a, transaction, _b, _c, subTransaction, transactionsGrouped;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, actual.getCategories()];
                case 1:
                    categories = _d.sent();
                    incomeCategoryId = categories.find(function (cat) { return cat.name === 'Income'; }).id;
                    return [4 /*yield*/, actual.getAccounts()];
                case 2:
                    accounts = _d.sent();
                    return [4 /*yield*/, actual.getPayees()];
                case 3:
                    payees = _d.sent();
                    // Go ahead and generate ids for all of the transactions so we can
                    // reliably resolve transfers
                    for (_i = 0, _a = data.transactions; _i < _a.length; _i++) {
                        transaction = _a[_i];
                        entityIdMap.set(transaction.entityId, (0, uuid_1.v4)());
                        if (transaction.subTransactions) {
                            for (_b = 0, _c = transaction.subTransactions; _b < _c.length; _b++) {
                                subTransaction = _c[_b];
                                entityIdMap.set(subTransaction.entityId, (0, uuid_1.v4)());
                            }
                        }
                    }
                    transactionsGrouped = (0, util_1.groupBy)(data.transactions, 'accountId');
                    return [4 /*yield*/, Promise.all(__spreadArray([], transactionsGrouped.keys(), true).map(function (accountId) { return __awaiter(_this, void 0, void 0, function () {
                            var transactions, toImport;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        transactions = transactionsGrouped.get(accountId);
                                        toImport = transactions
                                            .map(function (transaction) {
                                            if (transaction.isTombstone) {
                                                return null;
                                            }
                                            var id = entityIdMap.get(transaction.entityId);
                                            function transferProperties(t) {
                                                var _a;
                                                var transferId = entityIdMap.get(t.transferTransactionId) || null;
                                                var payee = null;
                                                var imported_payee = null;
                                                if (transferId) {
                                                    payee = payees.find(function (p) { return p.transfer_acct === entityIdMap.get(t.targetAccountId); }).id;
                                                }
                                                else {
                                                    payee = entityIdMap.get(t.payeeId);
                                                    imported_payee = (_a = data.payees.find(function (p) { return p.entityId === t.payeeId; })) === null || _a === void 0 ? void 0 : _a.name;
                                                }
                                                return {
                                                    transfer_id: transferId,
                                                    payee: payee,
                                                    imported_payee: imported_payee,
                                                };
                                            }
                                            var newTransaction = __assign(__assign({ id: id, amount: (0, util_1.amountToInteger)(transaction.amount), category: isOffBudget(entityIdMap.get(accountId))
                                                    ? null
                                                    : getCategory(transaction.categoryId), date: transaction.date, notes: transaction.memo || null, cleared: transaction.cleared === 'Cleared' ||
                                                    transaction.cleared === 'Reconciled', reconciled: transaction.cleared === 'Reconciled' }, transferProperties(transaction)), { subtransactions: transaction.subTransactions &&
                                                    transaction.subTransactions
                                                        .filter(function (st) { return !st.isTombstone; })
                                                        .map(function (t) {
                                                        return __assign({ id: entityIdMap.get(t.entityId), amount: (0, util_1.amountToInteger)(t.amount), category: getCategory(t.categoryId), notes: t.memo || null }, transferProperties(t));
                                                    }) });
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
                case 4:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fillInBudgets(data, categoryBudgets) {
    // YNAB only contains entries for categories that have been actually
    // budgeted. That would be fine except that we need to set the
    // "carryover" flag on each month when carrying debt across months.
    // To make sure our system has a chance to set this flag on each
    // category, make sure a budget exists for every category of every
    // month.
    var budgets = __spreadArray([], categoryBudgets, true);
    data.masterCategories.forEach(function (masterCategory) {
        if (masterCategory.subCategories) {
            masterCategory.subCategories.forEach(function (category) {
                if (!budgets.find(function (b) { return b.categoryId === category.entityId; })) {
                    budgets.push({
                        budgeted: 0,
                        categoryId: category.entityId,
                    });
                }
            });
        }
    });
    return budgets;
}
function importBudgets(data, entityIdMap) {
    return __awaiter(this, void 0, void 0, function () {
        var budgets;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    budgets = (0, util_1.sortByKey)(data.monthlyBudgets, 'month');
                    return [4 /*yield*/, actual.batchBudgetUpdates(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _loop_1, _i, budgets_1, budget;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _loop_1 = function (budget) {
                                            var filled;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        filled = fillInBudgets(data, budget.monthlySubCategoryBudgets.filter(function (b) { return !b.isTombstone; }));
                                                        return [4 /*yield*/, Promise.all(filled.map(function (catBudget) { return __awaiter(_this, void 0, void 0, function () {
                                                                var amount, catId, month;
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0:
                                                                            amount = (0, util_1.amountToInteger)(catBudget.budgeted);
                                                                            catId = entityIdMap.get(catBudget.categoryId);
                                                                            month = monthUtils.monthFromDate(budget.month);
                                                                            if (!catId) {
                                                                                return [2 /*return*/];
                                                                            }
                                                                            return [4 /*yield*/, actual.setBudgetAmount(month, catId, amount)];
                                                                        case 1:
                                                                            _a.sent();
                                                                            if (!(catBudget.overspendingHandling === 'AffectsBuffer')) return [3 /*break*/, 3];
                                                                            return [4 /*yield*/, actual.setBudgetCarryover(month, catId, false)];
                                                                        case 2:
                                                                            _a.sent();
                                                                            return [3 /*break*/, 5];
                                                                        case 3:
                                                                            if (!(catBudget.overspendingHandling === 'Confined')) return [3 /*break*/, 5];
                                                                            return [4 /*yield*/, actual.setBudgetCarryover(month, catId, true)];
                                                                        case 4:
                                                                            _a.sent();
                                                                            _a.label = 5;
                                                                        case 5: return [2 /*return*/];
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
                                        return [5 /*yield**/, _loop_1(budget)];
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
function estimateRecentness(str) {
    // The "recentness" is the total amount of changes that this device
    // is aware of, which is estimated by summing up all of the version
    // numbers that its aware of. This works because version numbers are
    // increasing integers.
    return str.split(',').reduce(function (total, version) {
        var _a = version.split('-'), _ = _a[0], number = _a[1];
        return total + parseInt(number);
    }, 0);
}
function findLatestDevice(zipped, entries) {
    var devices = entries
        .map(function (entry) {
        var contents = zipped.readFile(entry).toString('utf8');
        var data;
        try {
            data = JSON.parse(contents);
        }
        catch (e) {
            return null;
        }
        if (data.hasFullKnowledge) {
            return {
                deviceGUID: data.deviceGUID,
                shortName: data.shortDeviceId,
                recentness: estimateRecentness(data.knowledge),
            };
        }
        return null;
    })
        .filter(function (x) { return x; });
    devices = (0, util_1.sortByKey)(devices, 'recentness');
    return devices[devices.length - 1].deviceGUID;
}
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
function getBudgetName(filepath) {
    var unixFilepath = (0, slash_1.default)(filepath);
    if (!/\.zip/.test(unixFilepath)) {
        return null;
    }
    unixFilepath = unixFilepath.replace(/\.zip$/, '').replace(/.ynab4$/, '');
    // Most budgets are named like "Budget~51938D82.ynab4" but sometimes
    // they are only "Budget.ynab4". We only want to grab the name
    // before the ~ if it exists.
    var m = unixFilepath.match(/([^/~]+)[^/]*$/);
    if (!m) {
        return null;
    }
    return m[1];
}
function getFile(entries, path) {
    var files = entries.filter(function (e) { return e.entryName === path; });
    if (files.length === 0) {
        throw new Error('Could not find file: ' + path);
    }
    if (files.length >= 2) {
        throw new Error('File name matches multiple files: ' + path);
    }
    return files[0];
}
function join() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return paths.slice(1).reduce(function (full, path) {
        return full + '/' + path.replace(/^\//, '');
    }, paths[0].replace(/\/$/, ''));
}
function parseFile(buffer) {
    var zipped = new adm_zip_1.default(buffer);
    var entries = zipped.getEntries();
    var root = '';
    var dirMatch = entries[0].entryName.match(/([^/]*\.ynab4)/);
    if (dirMatch) {
        root = dirMatch[1] + '/';
    }
    var metaStr = zipped.readFile(getFile(entries, root + 'Budget.ymeta'));
    var meta = JSON.parse(metaStr.toString('utf8'));
    var budgetPath = join(root, meta.relativeDataFolderName);
    var deviceFiles = entries.filter(function (e) {
        return e.entryName.startsWith(join(budgetPath, 'devices'));
    });
    var deviceGUID = findLatestDevice(zipped, deviceFiles);
    var yfullPath = join(budgetPath, deviceGUID, 'Budget.yfull');
    var contents;
    try {
        contents = zipped.readFile(getFile(entries, yfullPath)).toString('utf8');
    }
    catch (e) {
        log_1.logger.log(e);
        throw new Error('Error reading Budget.yfull file');
    }
    try {
        return JSON.parse(contents);
    }
    catch (e) {
        throw new Error('Error parsing Budget.yfull file');
    }
}
