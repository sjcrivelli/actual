"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const injected = __importStar(require("./injected"));
var query_1 = require("./app/query");
Object.defineProperty(exports, "q", { enumerable: true, get: function () { return query_1.q; } });
function send(name, args) {
    return injected.send(name, args);
}
async function runImport(name, func) {
    await send('api/start-import', { budgetName: name });
    try {
        await func();
    }
    catch (e) {
        await send('api/abort-import');
        throw e;
    }
    await send('api/finish-import');
}
async function loadBudget(budgetId) {
    return send('api/load-budget', { id: budgetId });
}
async function downloadBudget(syncId, { password } = {}) {
    return send('api/download-budget', { syncId, password });
}
async function getBudgets() {
    return send('api/get-budgets');
}
async function sync() {
    return send('api/sync');
}
async function runBankSync(args) {
    return send('api/bank-sync', args);
}
async function batchBudgetUpdates(func) {
    await send('api/batch-budget-start');
    try {
        await func();
    }
    finally {
        await send('api/batch-budget-end');
    }
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
    return send('api/budget-month', { month });
}
function setBudgetAmount(month, categoryId, value) {
    return send('api/budget-set-amount', { month, categoryId, amount: value });
}
function setBudgetCarryover(month, categoryId, flag) {
    return send('api/budget-set-carryover', { month, categoryId, flag });
}
function addTransactions(accountId, transactions, { learnCategories = false, runTransfers = false } = {}) {
    return send('api/transactions-add', {
        accountId,
        transactions,
        learnCategories,
        runTransfers,
    });
}
function importTransactions(accountId, transactions, opts = {
    defaultCleared: true,
    dryRun: false,
}) {
    return send('api/transactions-import', {
        accountId,
        transactions,
        isPreview: opts.dryRun,
        opts,
    });
}
function getTransactions(accountId, startDate, endDate) {
    return send('api/transactions-get', { accountId, startDate, endDate });
}
function updateTransaction(id, fields) {
    return send('api/transaction-update', { id, fields });
}
function deleteTransaction(id) {
    return send('api/transaction-delete', { id });
}
function getAccounts() {
    return send('api/accounts-get');
}
function createAccount(account, initialBalance) {
    return send('api/account-create', { account, initialBalance });
}
function updateAccount(id, fields) {
    return send('api/account-update', { id, fields });
}
function closeAccount(id, transferAccountId, transferCategoryId) {
    return send('api/account-close', {
        id,
        transferAccountId,
        transferCategoryId,
    });
}
function reopenAccount(id) {
    return send('api/account-reopen', { id });
}
function deleteAccount(id) {
    return send('api/account-delete', { id });
}
function getAccountBalance(id, cutoff) {
    return send('api/account-balance', { id, cutoff });
}
function getCategoryGroups() {
    return send('api/category-groups-get');
}
function createCategoryGroup(group) {
    return send('api/category-group-create', { group });
}
function updateCategoryGroup(id, fields) {
    return send('api/category-group-update', { id, fields });
}
function deleteCategoryGroup(id, transferCategoryId) {
    return send('api/category-group-delete', { id, transferCategoryId });
}
function getCategories() {
    return send('api/categories-get', { grouped: false });
}
function createCategory(category) {
    return send('api/category-create', { category });
}
function updateCategory(id, fields) {
    return send('api/category-update', { id, fields });
}
function deleteCategory(id, transferCategoryId) {
    return send('api/category-delete', { id, transferCategoryId });
}
function getCommonPayees() {
    return send('api/common-payees-get');
}
function getPayees() {
    return send('api/payees-get');
}
function createPayee(payee) {
    return send('api/payee-create', { payee });
}
function updatePayee(id, fields) {
    return send('api/payee-update', { id, fields });
}
function deletePayee(id) {
    return send('api/payee-delete', { id });
}
function mergePayees(targetId, mergeIds) {
    return send('api/payees-merge', { targetId, mergeIds });
}
function getRules() {
    return send('api/rules-get');
}
function getPayeeRules(id) {
    return send('api/payee-rules-get', { id });
}
function createRule(rule) {
    return send('api/rule-create', { rule });
}
function updateRule(rule) {
    return send('api/rule-update', { rule });
}
function deleteRule(id) {
    return send('api/rule-delete', id);
}
function holdBudgetForNextMonth(month, amount) {
    return send('api/budget-hold-for-next-month', { month, amount });
}
function resetBudgetHold(month) {
    return send('api/budget-reset-hold', { month });
}
function createSchedule(schedule) {
    return send('api/schedule-create', schedule);
}
function updateSchedule(id, fields, resetNextDate) {
    return send('api/schedule-update', {
        id,
        fields,
        resetNextDate,
    });
}
function deleteSchedule(scheduleId) {
    return send('api/schedule-delete', scheduleId);
}
function getSchedules() {
    return send('api/schedules-get');
}
function getIDByName(type, name) {
    return send('api/get-id-by-name', { type, name });
}
function getServerVersion() {
    return send('api/get-server-version');
}
