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
exports.installAPI = installAPI;
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var connection = require("../platform/server/connection");
var log_1 = require("../platform/server/log");
var errors_1 = require("../shared/errors");
var monthUtils = require("../shared/months");
var query_1 = require("../shared/query");
var transactions_1 = require("../shared/transactions");
var util_1 = require("../shared/util");
var sync_1 = require("./accounts/sync");
var api_models_1 = require("./api-models");
var aql_1 = require("./aql");
var cloudStorage = require("./cloud-storage");
var db = require("./db");
var errors_2 = require("./errors");
var mutators_1 = require("./mutators");
var prefs = require("./prefs");
var sheet = require("./sheet");
var sync_2 = require("./sync");
var IMPORT_MODE = false;
// The API is different in two ways: we never want undo enabled, and
// we also need to notify the UI manually if stuff has changed (if
// they are connecting to an already running instance, the UI should
// update). The wrapper handles that.
function withMutation(handler) {
    var _this = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
            var latestTimestamp, result, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        latestTimestamp = (0, crdt_1.getClock)().timestamp.toString();
                        return [4 /*yield*/, handler.apply(void 0, args)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, db.all('SELECT DISTINCT dataset FROM messages_crdt WHERE timestamp > ?', [latestTimestamp])];
                    case 2:
                        rows = _a.sent();
                        // Only send the sync event if anybody else is connected
                        if (connection.getNumClients() > 1) {
                            connection.send('sync-event', {
                                type: 'success',
                                tables: rows.map(function (row) { return row.dataset; }),
                            });
                        }
                        return [2 /*return*/, result];
                }
            });
        }); }, { undoDisabled: true });
    };
}
var handlers = {};
function validateMonth(month) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, start, end, range;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!month.match(/^\d{4}-\d{2}$/)) {
                        throw (0, errors_2.APIError)('Invalid month format, use YYYY-MM: ' + month);
                    }
                    if (!!IMPORT_MODE) return [3 /*break*/, 2];
                    return [4 /*yield*/, handlers['get-budget-bounds']()];
                case 1:
                    _a = _b.sent(), start = _a.start, end = _a.end;
                    range = monthUtils.range(start, end);
                    if (!range.includes(month)) {
                        throw (0, errors_2.APIError)('No budget exists for month: ' + month);
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function validateExpenseCategory(debug, id) {
    return __awaiter(this, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (id == null) {
                        throw (0, errors_2.APIError)("".concat(debug, ": category id is required"));
                    }
                    return [4 /*yield*/, db.first('SELECT is_income FROM categories WHERE id = ?', [id])];
                case 1:
                    row = _a.sent();
                    if (!row) {
                        throw (0, errors_2.APIError)("".concat(debug, ": category \u201C").concat(id, "\u201D does not exist"));
                    }
                    if (row.is_income !== 0) {
                        throw (0, errors_2.APIError)("".concat(debug, ": category \u201C").concat(id, "\u201D is not an expense category"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function checkFileOpen() {
    if (!(prefs.getPrefs() || {}).id) {
        throw (0, errors_2.APIError)('No budget file is open');
    }
}
var batchPromise = null;
handlers['api/batch-budget-start'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (batchPromise) {
                throw (0, errors_2.APIError)('Cannot start a batch process: batch already started');
            }
            // If we are importing, all we need to do is start a raw database
            // transaction. Updating spreadsheet cells doesn't go through the
            // syncing layer in that case.
            if (IMPORT_MODE) {
                db.asyncTransaction(function () {
                    return new Promise(function (resolve, reject) {
                        batchPromise = { resolve: resolve, reject: reject };
                    });
                });
            }
            else {
                (0, sync_2.batchMessages)(function () {
                    return new Promise(function (resolve, reject) {
                        batchPromise = { resolve: resolve, reject: reject };
                    });
                });
            }
            return [2 /*return*/];
        });
    });
};
handlers['api/batch-budget-end'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!batchPromise) {
                throw (0, errors_2.APIError)('Cannot end a batch process: no batch started');
            }
            batchPromise.resolve();
            batchPromise = null;
            return [2 /*return*/];
        });
    });
};
handlers['api/load-budget'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var currentId, error;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    currentId = (prefs.getPrefs() || {}).id;
                    if (!(currentId !== id)) return [3 /*break*/, 2];
                    connection.send('start-load');
                    return [4 /*yield*/, handlers['load-budget']({ id: id })];
                case 1:
                    error = (_c.sent()).error;
                    if (!error) {
                        connection.send('finish-load');
                    }
                    else {
                        connection.send('show-budgets');
                        throw new Error((0, errors_1.getSyncError)(error, id));
                    }
                    _c.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
};
handlers['api/download-budget'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var currentId, budgets, localBudget, remoteBudget, files, file, activeFile, result_1, result_2, result;
        var syncId = _b.syncId, password = _b.password;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    currentId = (prefs.getPrefs() || {}).id;
                    if (!currentId) return [3 /*break*/, 2];
                    return [4 /*yield*/, handlers['close-budget']()];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2: return [4 /*yield*/, handlers['get-budgets']()];
                case 3:
                    budgets = _c.sent();
                    localBudget = budgets.find(function (b) { return b.groupId === syncId; });
                    if (!!localBudget) return [3 /*break*/, 5];
                    return [4 /*yield*/, handlers['get-remote-files']()];
                case 4:
                    files = _c.sent();
                    if (!files) {
                        throw new Error('Could not get remote files');
                    }
                    file = files.find(function (f) { return f.groupId === syncId; });
                    if (!file) {
                        throw new Error("Budget \u201C".concat(syncId, "\u201D not found. Check the sync id of your budget in the Advanced section of the settings page."));
                    }
                    remoteBudget = file;
                    _c.label = 5;
                case 5:
                    activeFile = remoteBudget ? remoteBudget : localBudget;
                    if (!activeFile.encryptKeyId) return [3 /*break*/, 7];
                    if (!password) {
                        throw new Error("File ".concat(activeFile.name, " is encrypted. Please provide a password."));
                    }
                    return [4 /*yield*/, handlers['key-test']({
                            cloudFileId: remoteBudget ? remoteBudget.fileId : localBudget.cloudFileId,
                            password: password,
                        })];
                case 6:
                    result_1 = _c.sent();
                    if (result_1.error) {
                        throw new Error((0, errors_1.getTestKeyError)(result_1.error));
                    }
                    _c.label = 7;
                case 7:
                    if (!localBudget) return [3 /*break*/, 10];
                    return [4 /*yield*/, handlers['load-budget']({ id: localBudget.id })];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, handlers['sync-budget']()];
                case 9:
                    result_2 = _c.sent();
                    if (result_2.error) {
                        throw new Error((0, errors_1.getSyncError)(result_2.error, localBudget.id));
                    }
                    return [2 /*return*/];
                case 10: return [4 /*yield*/, handlers['download-budget']({
                        cloudFileId: remoteBudget.fileId,
                    })];
                case 11:
                    result = _c.sent();
                    if (result.error) {
                        log_1.logger.log('Full error details', result.error);
                        throw new Error((0, errors_1.getDownloadError)(result.error));
                    }
                    return [4 /*yield*/, handlers['load-budget']({ id: result.id })];
                case 12:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
};
handlers['api/get-budgets'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var budgets, files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handlers['get-budgets']()];
                case 1:
                    budgets = _a.sent();
                    return [4 /*yield*/, handlers['get-remote-files']()];
                case 2:
                    files = (_a.sent()) || [];
                    return [2 /*return*/, __spreadArray(__spreadArray([], budgets.map(function (file) { return api_models_1.budgetModel.toExternal(file); }), true), files.map(function (file) { return api_models_1.remoteFileModel.toExternal(file); }).filter(function (file) { return file; }), true)];
            }
        });
    });
};
handlers['api/sync'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = prefs.getPrefs().id;
                    return [4 /*yield*/, handlers['sync-budget']()];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        throw new Error((0, errors_1.getSyncError)(result.error, id));
                    }
                    return [2 /*return*/];
            }
        });
    });
};
handlers['api/bank-sync'] = function (args) {
    return __awaiter(this, void 0, void 0, function () {
        var batchSync, allErrors, errors_3, accountsData, accountIdsToSync, simpleFinAccounts, simpleFinAccountIds_1, res, errors_4, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batchSync = (args === null || args === void 0 ? void 0 : args.accountId) == null;
                    allErrors = [];
                    if (!!batchSync) return [3 /*break*/, 2];
                    return [4 /*yield*/, handlers['accounts-bank-sync']({
                            ids: [args.accountId],
                        })];
                case 1:
                    errors_3 = (_a.sent()).errors;
                    allErrors.push.apply(allErrors, errors_3);
                    return [3 /*break*/, 7];
                case 2: return [4 /*yield*/, handlers['accounts-get']()];
                case 3:
                    accountsData = _a.sent();
                    accountIdsToSync = accountsData.map(function (a) { return a.id; });
                    simpleFinAccounts = accountsData.filter(function (a) { return a.account_sync_source === 'simpleFin'; });
                    simpleFinAccountIds_1 = simpleFinAccounts.map(function (a) { return a.id; });
                    if (!(simpleFinAccounts.length > 1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, handlers['simplefin-batch-sync']({
                            ids: simpleFinAccountIds_1,
                        })];
                case 4:
                    res = _a.sent();
                    res.forEach(function (a) { return allErrors.push.apply(allErrors, a.res.errors); });
                    _a.label = 5;
                case 5: return [4 /*yield*/, handlers['accounts-bank-sync']({
                        ids: accountIdsToSync.filter(function (a) { return !simpleFinAccountIds_1.includes(a); }),
                    })];
                case 6:
                    errors_4 = (_a.sent()).errors;
                    allErrors.push.apply(allErrors, errors_4);
                    _a.label = 7;
                case 7:
                    errors = allErrors.filter(function (e) { return e != null; });
                    if (errors.length > 0) {
                        throw new Error((0, errors_1.getBankSyncError)(errors[0]));
                    }
                    return [2 /*return*/];
            }
        });
    });
};
handlers['api/start-import'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var budgetName = _b.budgetName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Notify UI to close budget
                return [4 /*yield*/, handlers['close-budget']()];
                case 1:
                    // Notify UI to close budget
                    _c.sent();
                    // Create the budget
                    return [4 /*yield*/, handlers['create-budget']({ budgetName: budgetName, avoidUpload: true })];
                case 2:
                    // Create the budget
                    _c.sent();
                    // Clear out the default expense categories
                    return [4 /*yield*/, db.runQuery('DELETE FROM categories WHERE is_income = 0')];
                case 3:
                    // Clear out the default expense categories
                    _c.sent();
                    return [4 /*yield*/, db.runQuery('DELETE FROM category_groups WHERE is_income = 0')];
                case 4:
                    _c.sent();
                    // Turn syncing off
                    (0, sync_2.setSyncingMode)('import');
                    connection.send('start-import');
                    IMPORT_MODE = true;
                    return [2 /*return*/];
            }
        });
    });
};
handlers['api/finish-import'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFileOpen();
                    sheet.get().markCacheDirty();
                    id = prefs.getPrefs().id;
                    return [4 /*yield*/, handlers['close-budget']()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handlers['load-budget']({ id: id })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, handlers['get-budget-bounds']()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, cloudStorage.upload().catch(function () { })];
                case 5:
                    _a.sent();
                    connection.send('finish-import');
                    IMPORT_MODE = false;
                    return [2 /*return*/];
            }
        });
    });
};
handlers['api/abort-import'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!IMPORT_MODE) return [3 /*break*/, 3];
                    checkFileOpen();
                    id = prefs.getPrefs().id;
                    return [4 /*yield*/, handlers['close-budget']()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handlers['delete-budget']({ id: id })];
                case 2:
                    _a.sent();
                    connection.send('show-budgets');
                    _a.label = 3;
                case 3:
                    IMPORT_MODE = false;
                    return [2 /*return*/];
            }
        });
    });
};
handlers['api/query'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var query = _b.query;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, (0, aql_1.aqlQuery)(query)];
        });
    });
};
handlers['api/budget-months'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a, start, end;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['get-budget-bounds']()];
                case 1:
                    _a = _b.sent(), start = _a.start, end = _a.end;
                    return [2 /*return*/, monthUtils.range(start, end)];
            }
        });
    });
};
handlers['api/budget-month'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function value(name) {
            var v = sheet.get().getCellValue(sheetName, name);
            return v === '' ? 0 : v;
        }
        var groups, sheetName;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, validateMonth(month)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').select('*'))];
                case 2:
                    groups = (_c.sent()).data;
                    sheetName = monthUtils.sheetForMonth(month);
                    // This is duplicated from main.js because the return format is
                    // different (for now)
                    return [2 /*return*/, {
                            month: month,
                            incomeAvailable: value('available-funds'),
                            lastMonthOverspent: value('last-month-overspent'),
                            forNextMonth: value('buffered'),
                            totalBudgeted: value('total-budgeted'),
                            toBudget: value('to-budget'),
                            fromLastMonth: value('from-last-month'),
                            totalIncome: value('total-income'),
                            totalSpent: value('total-spent'),
                            totalBalance: value('total-leftover'),
                            categoryGroups: groups.map(function (group) {
                                if (group.is_income) {
                                    return __assign(__assign({}, api_models_1.categoryGroupModel.toExternal(group)), { received: value('total-income'), categories: group.categories.map(function (cat) { return (__assign(__assign({}, api_models_1.categoryModel.toExternal(cat)), { received: value("sum-amount-".concat(cat.id)) })); }) });
                                }
                                return __assign(__assign({}, api_models_1.categoryGroupModel.toExternal(group)), { budgeted: value("group-budget-".concat(group.id)), spent: value("group-sum-amount-".concat(group.id)), balance: value("group-leftover-".concat(group.id)), categories: group.categories.map(function (cat) { return (__assign(__assign({}, api_models_1.categoryModel.toExternal(cat)), { budgeted: value("budget-".concat(cat.id)), spent: value("sum-amount-".concat(cat.id)), balance: value("leftover-".concat(cat.id)), carryover: value("carryover-".concat(cat.id)) })); }) });
                            }),
                        }];
            }
        });
    });
};
handlers['api/budget-set-amount'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var month = _b.month, categoryId = _b.categoryId, amount = _b.amount;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['budget/budget-amount']({
                    month: month,
                    category: categoryId,
                    amount: amount,
                })];
        });
    });
});
handlers['api/budget-set-carryover'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var month = _b.month, categoryId = _b.categoryId, flag = _b.flag;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, validateMonth(month)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, validateExpenseCategory('budget-set-carryover', categoryId)];
                case 2:
                    _c.sent();
                    return [2 /*return*/, handlers['budget/set-carryover']({
                            startMonth: month,
                            category: categoryId,
                            flag: flag,
                        })];
            }
        });
    });
});
handlers['api/budget-hold-for-next-month'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var month = _b.month, amount = _b.amount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, validateMonth(month)];
                case 1:
                    _c.sent();
                    if (amount <= 0) {
                        throw (0, errors_2.APIError)('Amount to hold needs to be greater than 0');
                    }
                    return [2 /*return*/, handlers['budget/hold-for-next-month']({
                            month: month,
                            amount: amount,
                        })];
            }
        });
    });
});
handlers['api/budget-reset-hold'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, validateMonth(month)];
                case 1:
                    _c.sent();
                    return [2 /*return*/, handlers['budget/reset-hold']({ month: month })];
            }
        });
    });
});
handlers['api/transactions-export'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var transactions = _b.transactions, categoryGroups = _b.categoryGroups, payees = _b.payees, accounts = _b.accounts;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['transactions-export']({
                    transactions: transactions,
                    categoryGroups: categoryGroups,
                    payees: payees,
                    accounts: accounts,
                })];
        });
    });
};
handlers['api/transactions-import'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var accountId = _b.accountId, transactions = _b.transactions, _c = _b.isPreview, isPreview = _c === void 0 ? false : _c, opts = _b.opts;
        return __generator(this, function (_d) {
            checkFileOpen();
            return [2 /*return*/, handlers['transactions-import']({
                    accountId: accountId,
                    transactions: transactions,
                    isPreview: isPreview,
                    opts: opts,
                })];
        });
    });
});
handlers['api/transactions-add'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var accountId = _b.accountId, transactions = _b.transactions, _c = _b.runTransfers, runTransfers = _c === void 0 ? false : _c, _d = _b.learnCategories, learnCategories = _d === void 0 ? false : _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, (0, sync_1.addTransactions)(accountId, transactions, {
                            runTransfers: runTransfers,
                            learnCategories: learnCategories,
                        })];
                case 1:
                    _e.sent();
                    return [2 /*return*/, 'ok'];
            }
        });
    });
});
handlers['api/transactions-get'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var data;
        var accountId = _b.accountId, startDate = _b.startDate, endDate = _b.endDate;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                            .filter({
                            $and: [
                                accountId && { account: accountId },
                                startDate && { date: { $gte: startDate } },
                                endDate && { date: { $lte: endDate } },
                            ].filter(Boolean),
                        })
                            .select('*')
                            .options({ splits: 'grouped' }))];
                case 1:
                    data = (_c.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
};
handlers['api/transaction-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var data, transactions, diff;
        var id = _b.id, fields = _b.fields;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ id: id }).select('*').options({ splits: 'grouped' }))];
                case 1:
                    data = (_c.sent()).data;
                    transactions = (0, transactions_1.ungroupTransactions)(data);
                    if (transactions.length === 0) {
                        return [2 /*return*/, []];
                    }
                    diff = (0, transactions_1.updateTransaction)(transactions, __assign({ id: id }, fields)).diff;
                    return [2 /*return*/, handlers['transactions-batch-update'](diff)['updated']];
            }
        });
    });
});
handlers['api/transaction-delete'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var data, transactions, diff;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ id: id }).select('*').options({ splits: 'grouped' }))];
                case 1:
                    data = (_c.sent()).data;
                    transactions = (0, transactions_1.ungroupTransactions)(data);
                    if (transactions.length === 0) {
                        return [2 /*return*/, []];
                    }
                    diff = (0, transactions_1.deleteTransaction)(transactions, id).diff;
                    return [2 /*return*/, handlers['transactions-batch-update'](diff)['deleted']];
            }
        });
    });
});
handlers['api/accounts-get'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, db.getAccounts()];
                case 1:
                    accounts = (_a.sent());
                    return [2 /*return*/, accounts.map(function (account) { return api_models_1.accountModel.toExternal(account); })];
            }
        });
    });
};
handlers['api/account-create'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var account = _b.account, _c = _b.initialBalance, initialBalance = _c === void 0 ? null : _c;
        return __generator(this, function (_d) {
            checkFileOpen();
            return [2 /*return*/, handlers['account-create']({
                    name: account.name,
                    offBudget: account.offbudget,
                    closed: account.closed,
                    // Current the API expects an amount but it really should expect
                    // an integer
                    balance: initialBalance != null ? (0, util_1.integerToAmount)(initialBalance) : null,
                })];
        });
    });
});
handlers['api/account-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, fields = _b.fields;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, db.updateAccount(__assign({ id: id }, api_models_1.accountModel.fromExternal(fields)))];
        });
    });
});
handlers['api/account-close'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, transferAccountId = _b.transferAccountId, transferCategoryId = _b.transferCategoryId;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['account-close']({
                    id: id,
                    transferAccountId: transferAccountId,
                    categoryId: transferCategoryId,
                })];
        });
    });
});
handlers['api/account-reopen'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['account-reopen']({ id: id })];
        });
    });
});
handlers['api/account-delete'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['account-close']({ id: id, forced: true })];
        });
    });
});
handlers['api/account-balance'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, _c = _b.cutoff, cutoff = _c === void 0 ? new Date() : _c;
        return __generator(this, function (_d) {
            checkFileOpen();
            return [2 /*return*/, handlers['account-balance']({ id: id, cutoff: cutoff })];
        });
    });
});
handlers['api/categories-get'] = function () {
    return __awaiter(this, arguments, void 0, function (_a) {
        var result;
        var _b = _a === void 0 ? {} : _a, grouped = _b.grouped;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['get-categories']()];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, grouped
                            ? result.grouped.map(api_models_1.categoryGroupModel.toExternal)
                            : result.list.map(api_models_1.categoryModel.toExternal)];
            }
        });
    });
};
handlers['api/category-groups-get'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var groups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['get-category-groups']()];
                case 1:
                    groups = _a.sent();
                    return [2 /*return*/, groups.map(api_models_1.categoryGroupModel.toExternal)];
            }
        });
    });
};
handlers['api/category-group-create'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var group = _b.group;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['category-group-create']({
                    name: group.name,
                    hidden: group.hidden,
                })];
        });
    });
});
handlers['api/category-group-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, fields = _b.fields;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['category-group-update'](__assign({ id: id }, api_models_1.categoryGroupModel.fromExternal(fields)))];
        });
    });
});
handlers['api/category-group-delete'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, transferCategoryId = _b.transferCategoryId;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['category-group-delete']({
                    id: id,
                    transferId: transferCategoryId,
                })];
        });
    });
});
handlers['api/category-create'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var category = _b.category;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['category-create']({
                    name: category.name,
                    groupId: category.group_id,
                    isIncome: category.is_income,
                    hidden: category.hidden,
                })];
        });
    });
});
handlers['api/category-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, fields = _b.fields;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['category-update'](__assign({ id: id }, api_models_1.categoryModel.fromExternal(fields)))];
        });
    });
});
handlers['api/category-delete'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, transferCategoryId = _b.transferCategoryId;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['category-delete']({
                    id: id,
                    transferId: transferCategoryId,
                })];
        });
    });
});
handlers['api/common-payees-get'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['common-payees-get']()];
                case 1:
                    payees = _a.sent();
                    return [2 /*return*/, payees.map(api_models_1.payeeModel.toExternal)];
            }
        });
    });
};
handlers['api/payees-get'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['payees-get']()];
                case 1:
                    payees = _a.sent();
                    return [2 /*return*/, payees.map(api_models_1.payeeModel.toExternal)];
            }
        });
    });
};
handlers['api/payee-create'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var payee = _b.payee;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['payee-create']({ name: payee.name })];
        });
    });
});
handlers['api/payee-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id, fields = _b.fields;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['payees-batch-change']({
                    updated: [__assign({ id: id }, api_models_1.payeeModel.fromExternal(fields))],
                })];
        });
    });
});
handlers['api/payee-delete'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['payees-batch-change']({ deleted: [{ id: id }] })];
        });
    });
});
handlers['api/payees-merge'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var targetId = _b.targetId, mergeIds = _b.mergeIds;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['payees-merge']({ targetId: targetId, mergeIds: mergeIds })];
        });
    });
});
handlers['api/rules-get'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            checkFileOpen();
            return [2 /*return*/, handlers['rules-get']()];
        });
    });
};
handlers['api/payee-rules-get'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            checkFileOpen();
            return [2 /*return*/, handlers['payees-get-rules']({ id: id })];
        });
    });
};
handlers['api/rule-create'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var addedRule;
        var rule = _b.rule;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['rule-add'](rule)];
                case 1:
                    addedRule = _c.sent();
                    if ('error' in addedRule) {
                        throw (0, errors_2.APIError)('Failed creating a new rule', addedRule.error);
                    }
                    return [2 /*return*/, addedRule];
            }
        });
    });
});
handlers['api/rule-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var updatedRule;
        var rule = _b.rule;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, handlers['rule-update'](rule)];
                case 1:
                    updatedRule = _c.sent();
                    if ('error' in updatedRule) {
                        throw (0, errors_2.APIError)('Failed updating the rule', updatedRule.error);
                    }
                    return [2 /*return*/, updatedRule];
            }
        });
    });
});
handlers['api/rule-delete'] = withMutation(function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            checkFileOpen();
            return [2 /*return*/, handlers['rule-delete'](id)];
        });
    });
});
handlers['api/schedules-get'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        var data, schedules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').select('*'))];
                case 1:
                    data = (_a.sent()).data;
                    schedules = data;
                    return [2 /*return*/, schedules.map(function (schedule) { return api_models_1.scheduleModel.toExternal(schedule); })];
            }
        });
    });
};
handlers['api/schedule-create'] = withMutation(function (schedule) {
    return __awaiter(this, void 0, void 0, function () {
        var internalSchedule, partialSchedule;
        return __generator(this, function (_a) {
            checkFileOpen();
            internalSchedule = api_models_1.scheduleModel.fromExternal(schedule);
            partialSchedule = {
                name: internalSchedule.name,
                posts_transaction: internalSchedule.posts_transaction,
            };
            return [2 /*return*/, handlers['schedule/create']({
                    schedule: partialSchedule,
                    conditions: internalSchedule._conditions,
                })];
        });
    });
});
handlers['api/schedule-update'] = withMutation(function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var data, sched, conditionsUpdated, payeeIndex, accountIndex, dateIndex, amountIndex, _c, _d, _e, _i, key, typedKey, value, _f, newName, existing, convertedOp;
        var id = _b.id, fields = _b.fields, resetNextDate = _b.resetNextDate;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    checkFileOpen();
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).select('*'))];
                case 1:
                    data = (_g.sent()).data;
                    if (!data || data.length === 0) {
                        throw (0, errors_2.APIError)("Schedule ".concat(id, " not found"));
                    }
                    sched = data[0];
                    conditionsUpdated = false;
                    payeeIndex = sched._conditions.findIndex(function (c) { return c.field === 'payee'; });
                    accountIndex = sched._conditions.findIndex(function (c) { return c.field === 'account'; });
                    dateIndex = sched._conditions.findIndex(function (c) { return c.field === 'date'; });
                    amountIndex = sched._conditions.findIndex(function (c) { return c.field === 'amount'; });
                    _c = fields;
                    _d = [];
                    for (_e in _c)
                        _d.push(_e);
                    _i = 0;
                    _g.label = 2;
                case 2:
                    if (!(_i < _d.length)) return [3 /*break*/, 14];
                    _e = _d[_i];
                    if (!(_e in _c)) return [3 /*break*/, 13];
                    key = _e;
                    typedKey = key;
                    value = fields[typedKey];
                    _f = typedKey;
                    switch (_f) {
                        case 'name': return [3 /*break*/, 3];
                        case 'next_date': return [3 /*break*/, 5];
                        case 'completed': return [3 /*break*/, 5];
                        case 'posts_transaction': return [3 /*break*/, 6];
                        case 'payee': return [3 /*break*/, 7];
                        case 'account': return [3 /*break*/, 8];
                        case 'amountOp': return [3 /*break*/, 9];
                        case 'amount': return [3 /*break*/, 10];
                        case 'date': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 3:
                    newName = String(value);
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ name: newName }).select('*'))];
                case 4:
                    existing = (_g.sent()).data;
                    if (!existing || existing.length === 0 || existing[0].id === sched.id) {
                        sched.name = newName;
                        conditionsUpdated = true;
                    }
                    else {
                        throw (0, errors_2.APIError)("There is already a schedule named: ".concat(newName));
                    }
                    return [3 /*break*/, 13];
                case 5:
                    {
                        throw (0, errors_2.APIError)("Field ".concat(typedKey, " is system-managed and not user-editable."));
                    }
                    _g.label = 6;
                case 6:
                    {
                        sched.posts_transaction = Boolean(value);
                        conditionsUpdated = true;
                        return [3 /*break*/, 13];
                    }
                    _g.label = 7;
                case 7:
                    {
                        if (payeeIndex !== -1) {
                            sched._conditions[payeeIndex].value = value;
                            conditionsUpdated = true;
                        }
                        else {
                            sched._conditions.push({
                                field: 'payee',
                                op: 'is',
                                value: String(value),
                            });
                            conditionsUpdated = true;
                        }
                        return [3 /*break*/, 13];
                    }
                    _g.label = 8;
                case 8:
                    {
                        if (accountIndex !== -1) {
                            sched._conditions[accountIndex].value = value;
                            conditionsUpdated = true;
                        }
                        else {
                            sched._conditions.push({
                                field: 'account',
                                op: 'is',
                                value: String(value),
                            });
                            conditionsUpdated = true;
                        }
                        return [3 /*break*/, 13];
                    }
                    _g.label = 9;
                case 9:
                    {
                        if (amountIndex !== -1) {
                            convertedOp = void 0;
                            switch (value) {
                                case 'is':
                                    convertedOp = 'is';
                                    break;
                                case 'isapprox':
                                    convertedOp = 'isapprox';
                                    break;
                                case 'isbetween':
                                    convertedOp = 'isbetween';
                                    break;
                                default:
                                    throw (0, errors_2.APIError)("Invalid amount operator: ".concat(value, ". Expected: is, isapprox, or isbetween"));
                            }
                            sched._conditions[amountIndex].op = convertedOp;
                            conditionsUpdated = true;
                        }
                        else {
                            throw (0, errors_2.APIError)("Ammount can not be found. There is a bug here");
                        }
                        return [3 /*break*/, 13];
                    }
                    _g.label = 10;
                case 10:
                    {
                        if (amountIndex !== -1) {
                            sched._conditions[amountIndex].value = value;
                            conditionsUpdated = true;
                        }
                        else {
                            throw (0, errors_2.APIError)("Ammount can not be found. There is a bug here");
                        }
                        return [3 /*break*/, 13];
                    }
                    _g.label = 11;
                case 11:
                    {
                        if (dateIndex !== -1) {
                            sched._conditions[dateIndex].value = value;
                            conditionsUpdated = true;
                        }
                        else {
                            throw (0, errors_2.APIError)("Date can not be found. Schedules can not be created without a date there is a bug here");
                        }
                        return [3 /*break*/, 13];
                    }
                    _g.label = 12;
                case 12:
                    {
                        throw (0, errors_2.APIError)("Unhandled field: ".concat(typedKey));
                    }
                    _g.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 2];
                case 14:
                    if (conditionsUpdated) {
                        return [2 /*return*/, handlers['schedule/update']({
                                schedule: {
                                    id: sched.id,
                                    posts_transaction: sched.posts_transaction,
                                    name: sched.name,
                                },
                                conditions: sched._conditions,
                                resetNextDate: resetNextDate,
                            })];
                    }
                    else {
                        return [2 /*return*/, sched.id];
                    }
                    return [2 /*return*/];
            }
        });
    });
});
handlers['api/schedule-delete'] = withMutation(function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            checkFileOpen();
            return [2 /*return*/, handlers['schedule/delete']({ id: id })];
        });
    });
});
handlers['api/get-id-by-name'] = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var allowedTypes, data;
        var type = _b.type, name = _b.name;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    checkFileOpen();
                    allowedTypes = ['payees', 'categories', 'schedules', 'accounts'];
                    if (!allowedTypes.includes(type)) {
                        throw (0, errors_2.APIError)('Provide a valid type');
                    }
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)(type).filter({ name: name }).select('*'))];
                case 1:
                    data = (_c.sent()).data;
                    if (!data || data.length === 0) {
                        throw (0, errors_2.APIError)("Not found: ".concat(type, " with name ").concat(name));
                    }
                    return [2 /*return*/, data[0].id];
            }
        });
    });
};
handlers['api/get-server-version'] = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            checkFileOpen();
            return [2 /*return*/, handlers['get-server-version']()];
        });
    });
};
function installAPI(serverHandlers) {
    var merged = Object.assign({}, serverHandlers, handlers);
    handlers = merged;
    return merged;
}
