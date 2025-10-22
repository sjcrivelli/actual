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
exports.q = void 0;
exports.runImport = runImport;
exports.loadBudget = loadBudget;
exports.downloadBudget = downloadBudget;
exports.getBudgets = getBudgets;
exports.sync = sync;
exports.runBankSync = runBankSync;
exports.batchBudgetUpdates = batchBudgetUpdates;
exports.runQuery = runQuery;
exports.aqlQuery = aqlQuery;
exports.getBudgetMonths = getBudgetMonths;
exports.getBudgetMonth = getBudgetMonth;
exports.setBudgetAmount = setBudgetAmount;
exports.setBudgetCarryover = setBudgetCarryover;
exports.addTransactions = addTransactions;
exports.importTransactions = importTransactions;
exports.getTransactions = getTransactions;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
exports.getAccounts = getAccounts;
exports.createAccount = createAccount;
exports.updateAccount = updateAccount;
exports.closeAccount = closeAccount;
exports.reopenAccount = reopenAccount;
exports.deleteAccount = deleteAccount;
exports.getAccountBalance = getAccountBalance;
exports.getCategoryGroups = getCategoryGroups;
exports.createCategoryGroup = createCategoryGroup;
exports.updateCategoryGroup = updateCategoryGroup;
exports.deleteCategoryGroup = deleteCategoryGroup;
exports.getCategories = getCategories;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getCommonPayees = getCommonPayees;
exports.getPayees = getPayees;
exports.createPayee = createPayee;
exports.updatePayee = updatePayee;
exports.deletePayee = deletePayee;
exports.mergePayees = mergePayees;
exports.getRules = getRules;
exports.getPayeeRules = getPayeeRules;
exports.createRule = createRule;
exports.updateRule = updateRule;
exports.deleteRule = deleteRule;
exports.holdBudgetForNextMonth = holdBudgetForNextMonth;
exports.resetBudgetHold = resetBudgetHold;
exports.createSchedule = createSchedule;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
exports.getSchedules = getSchedules;
exports.getIDByName = getIDByName;
exports.getServerVersion = getServerVersion;
var injected = require("./injected");
var query_1 = require("./app/query");
Object.defineProperty(exports, "q", { enumerable: true, get: function () { return query_1.q; } });
function send(name, args) {
    return injected.send(name, args);
}
function runImport(name, func) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, send('api/start-import', { budgetName: name })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, func()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _a.sent();
                    return [4 /*yield*/, send('api/abort-import')];
                case 5:
                    _a.sent();
                    throw e_1;
                case 6: return [4 /*yield*/, send('api/finish-import')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadBudget(budgetId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, send('api/load-budget', { id: budgetId })];
        });
    });
}
function downloadBudget(syncId_1) {
    return __awaiter(this, arguments, void 0, function (syncId, _a) {
        var _b = _a === void 0 ? {} : _a, password = _b.password;
        return __generator(this, function (_c) {
            return [2 /*return*/, send('api/download-budget', { syncId: syncId, password: password })];
        });
    });
}
function getBudgets() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, send('api/get-budgets')];
        });
    });
}
function sync() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, send('api/sync')];
        });
    });
}
function runBankSync(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, send('api/bank-sync', args)];
        });
    });
}
function batchBudgetUpdates(func) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, send('api/batch-budget-start')];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, func()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, send('api/batch-budget-end')];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * @deprecated Please use `aqlQuery` instead.
 * This function will be removed in a future release.
 */
function runQuery(query) {
    return send('api/query', { query: query.serialize() });
}
function aqlQuery(query) {
    return send('api/query', { query: query.serialize() });
}
function getBudgetMonths() {
    return send('api/budget-months');
}
function getBudgetMonth(month) {
    return send('api/budget-month', { month: month });
}
function setBudgetAmount(month, categoryId, value) {
    return send('api/budget-set-amount', { month: month, categoryId: categoryId, amount: value });
}
function setBudgetCarryover(month, categoryId, flag) {
    return send('api/budget-set-carryover', { month: month, categoryId: categoryId, flag: flag });
}
function addTransactions(accountId, transactions, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.learnCategories, learnCategories = _c === void 0 ? false : _c, _d = _b.runTransfers, runTransfers = _d === void 0 ? false : _d;
    return send('api/transactions-add', {
        accountId: accountId,
        transactions: transactions,
        learnCategories: learnCategories,
        runTransfers: runTransfers,
    });
}
function importTransactions(accountId, transactions, opts) {
    if (opts === void 0) { opts = {
        defaultCleared: true,
        dryRun: false,
    }; }
    return send('api/transactions-import', {
        accountId: accountId,
        transactions: transactions,
        isPreview: opts.dryRun,
        opts: opts,
    });
}
function getTransactions(accountId, startDate, endDate) {
    return send('api/transactions-get', { accountId: accountId, startDate: startDate, endDate: endDate });
}
function updateTransaction(id, fields) {
    return send('api/transaction-update', { id: id, fields: fields });
}
function deleteTransaction(id) {
    return send('api/transaction-delete', { id: id });
}
function getAccounts() {
    return send('api/accounts-get');
}
function createAccount(account, initialBalance) {
    return send('api/account-create', { account: account, initialBalance: initialBalance });
}
function updateAccount(id, fields) {
    return send('api/account-update', { id: id, fields: fields });
}
function closeAccount(id, transferAccountId, transferCategoryId) {
    return send('api/account-close', {
        id: id,
        transferAccountId: transferAccountId,
        transferCategoryId: transferCategoryId,
    });
}
function reopenAccount(id) {
    return send('api/account-reopen', { id: id });
}
function deleteAccount(id) {
    return send('api/account-delete', { id: id });
}
function getAccountBalance(id, cutoff) {
    return send('api/account-balance', { id: id, cutoff: cutoff });
}
function getCategoryGroups() {
    return send('api/category-groups-get');
}
function createCategoryGroup(group) {
    return send('api/category-group-create', { group: group });
}
function updateCategoryGroup(id, fields) {
    return send('api/category-group-update', { id: id, fields: fields });
}
function deleteCategoryGroup(id, transferCategoryId) {
    return send('api/category-group-delete', { id: id, transferCategoryId: transferCategoryId });
}
function getCategories() {
    return send('api/categories-get', { grouped: false });
}
function createCategory(category) {
    return send('api/category-create', { category: category });
}
function updateCategory(id, fields) {
    return send('api/category-update', { id: id, fields: fields });
}
function deleteCategory(id, transferCategoryId) {
    return send('api/category-delete', { id: id, transferCategoryId: transferCategoryId });
}
function getCommonPayees() {
    return send('api/common-payees-get');
}
function getPayees() {
    return send('api/payees-get');
}
function createPayee(payee) {
    return send('api/payee-create', { payee: payee });
}
function updatePayee(id, fields) {
    return send('api/payee-update', { id: id, fields: fields });
}
function deletePayee(id) {
    return send('api/payee-delete', { id: id });
}
function mergePayees(targetId, mergeIds) {
    return send('api/payees-merge', { targetId: targetId, mergeIds: mergeIds });
}
function getRules() {
    return send('api/rules-get');
}
function getPayeeRules(id) {
    return send('api/payee-rules-get', { id: id });
}
function createRule(rule) {
    return send('api/rule-create', { rule: rule });
}
function updateRule(rule) {
    return send('api/rule-update', { rule: rule });
}
function deleteRule(id) {
    return send('api/rule-delete', id);
}
function holdBudgetForNextMonth(month, amount) {
    return send('api/budget-hold-for-next-month', { month: month, amount: amount });
}
function resetBudgetHold(month) {
    return send('api/budget-reset-hold', { month: month });
}
function createSchedule(schedule) {
    return send('api/schedule-create', schedule);
}
function updateSchedule(id, fields, resetNextDate) {
    return send('api/schedule-update', {
        id: id,
        fields: fields,
        resetNextDate: resetNextDate,
    });
}
function deleteSchedule(scheduleId) {
    return send('api/schedule-delete', scheduleId);
}
function getSchedules() {
    return send('api/schedules-get');
}
function getIDByName(type, name) {
    return send('api/get-id-by-name', { type: type, name: name });
}
function getServerVersion() {
    return send('api/get-server-version');
}
