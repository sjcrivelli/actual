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
exports.installAPI = installAPI;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const connection = __importStar(require("../platform/server/connection"));
const log_1 = require("../platform/server/log");
const errors_1 = require("../shared/errors");
const monthUtils = __importStar(require("../shared/months"));
const query_1 = require("../shared/query");
const transactions_1 = require("../shared/transactions");
const util_1 = require("../shared/util");
const sync_1 = require("./accounts/sync");
const api_models_1 = require("./api-models");
const aql_1 = require("./aql");
const cloudStorage = __importStar(require("./cloud-storage"));
const db = __importStar(require("./db"));
const errors_2 = require("./errors");
const mutators_1 = require("./mutators");
const prefs = __importStar(require("./prefs"));
const sheet = __importStar(require("./sheet"));
const sync_2 = require("./sync");
let IMPORT_MODE = false;
// The API is different in two ways: we never want undo enabled, and
// we also need to notify the UI manually if stuff has changed (if
// they are connecting to an already running instance, the UI should
// update). The wrapper handles that.
function withMutation(handler) {
    return (...args) => {
        return (0, mutators_1.runMutator)(async () => {
            const latestTimestamp = (0, crdt_1.getClock)().timestamp.toString();
            const result = await handler(...args);
            const rows = await db.all('SELECT DISTINCT dataset FROM messages_crdt WHERE timestamp > ?', [latestTimestamp]);
            // Only send the sync event if anybody else is connected
            if (connection.getNumClients() > 1) {
                connection.send('sync-event', {
                    type: 'success',
                    tables: rows.map(row => row.dataset),
                });
            }
            return result;
        }, { undoDisabled: true });
    };
}
let handlers = {};
async function validateMonth(month) {
    if (!month.match(/^\d{4}-\d{2}$/)) {
        throw (0, errors_2.APIError)('Invalid month format, use YYYY-MM: ' + month);
    }
    if (!IMPORT_MODE) {
        const { start, end } = await handlers['get-budget-bounds']();
        const range = monthUtils.range(start, end);
        if (!range.includes(month)) {
            throw (0, errors_2.APIError)('No budget exists for month: ' + month);
        }
    }
}
async function validateExpenseCategory(debug, id) {
    if (id == null) {
        throw (0, errors_2.APIError)(`${debug}: category id is required`);
    }
    const row = await db.first('SELECT is_income FROM categories WHERE id = ?', [id]);
    if (!row) {
        throw (0, errors_2.APIError)(`${debug}: category “${id}” does not exist`);
    }
    if (row.is_income !== 0) {
        throw (0, errors_2.APIError)(`${debug}: category “${id}” is not an expense category`);
    }
}
function checkFileOpen() {
    if (!(prefs.getPrefs() || {}).id) {
        throw (0, errors_2.APIError)('No budget file is open');
    }
}
let batchPromise = null;
handlers['api/batch-budget-start'] = async function () {
    if (batchPromise) {
        throw (0, errors_2.APIError)('Cannot start a batch process: batch already started');
    }
    // If we are importing, all we need to do is start a raw database
    // transaction. Updating spreadsheet cells doesn't go through the
    // syncing layer in that case.
    if (IMPORT_MODE) {
        db.asyncTransaction(() => {
            return new Promise((resolve, reject) => {
                batchPromise = { resolve, reject };
            });
        });
    }
    else {
        (0, sync_2.batchMessages)(() => {
            return new Promise((resolve, reject) => {
                batchPromise = { resolve, reject };
            });
        });
    }
};
handlers['api/batch-budget-end'] = async function () {
    if (!batchPromise) {
        throw (0, errors_2.APIError)('Cannot end a batch process: no batch started');
    }
    batchPromise.resolve();
    batchPromise = null;
};
handlers['api/load-budget'] = async function ({ id }) {
    const { id: currentId } = prefs.getPrefs() || {};
    if (currentId !== id) {
        connection.send('start-load');
        const { error } = await handlers['load-budget']({ id });
        if (!error) {
            connection.send('finish-load');
        }
        else {
            connection.send('show-budgets');
            throw new Error((0, errors_1.getSyncError)(error, id));
        }
    }
};
handlers['api/download-budget'] = async function ({ syncId, password }) {
    const { id: currentId } = prefs.getPrefs() || {};
    if (currentId) {
        await handlers['close-budget']();
    }
    const budgets = await handlers['get-budgets']();
    const localBudget = budgets.find(b => b.groupId === syncId);
    let remoteBudget;
    // Load a remote file if we could not find the file locally
    if (!localBudget) {
        const files = await handlers['get-remote-files']();
        if (!files) {
            throw new Error('Could not get remote files');
        }
        const file = files.find(f => f.groupId === syncId);
        if (!file) {
            throw new Error(`Budget “${syncId}” not found. Check the sync id of your budget in the Advanced section of the settings page.`);
        }
        remoteBudget = file;
    }
    const activeFile = remoteBudget ? remoteBudget : localBudget;
    // Set the e2e encryption keys
    if (activeFile.encryptKeyId) {
        if (!password) {
            throw new Error(`File ${activeFile.name} is encrypted. Please provide a password.`);
        }
        const result = await handlers['key-test']({
            cloudFileId: remoteBudget ? remoteBudget.fileId : localBudget.cloudFileId,
            password,
        });
        if (result.error) {
            throw new Error((0, errors_1.getTestKeyError)(result.error));
        }
    }
    // Sync the local budget file
    if (localBudget) {
        await handlers['load-budget']({ id: localBudget.id });
        const result = await handlers['sync-budget']();
        if (result.error) {
            throw new Error((0, errors_1.getSyncError)(result.error, localBudget.id));
        }
        return;
    }
    // Download the remote file (no need to perform a sync as the file will already be up-to-date)
    const result = await handlers['download-budget']({
        cloudFileId: remoteBudget.fileId,
    });
    if (result.error) {
        log_1.logger.log('Full error details', result.error);
        throw new Error((0, errors_1.getDownloadError)(result.error));
    }
    await handlers['load-budget']({ id: result.id });
};
handlers['api/get-budgets'] = async function () {
    const budgets = await handlers['get-budgets']();
    const files = (await handlers['get-remote-files']()) || [];
    return [
        ...budgets.map(file => api_models_1.budgetModel.toExternal(file)),
        ...files.map(file => api_models_1.remoteFileModel.toExternal(file)).filter(file => file),
    ];
};
handlers['api/sync'] = async function () {
    const { id } = prefs.getPrefs();
    const result = await handlers['sync-budget']();
    if (result.error) {
        throw new Error((0, errors_1.getSyncError)(result.error, id));
    }
};
handlers['api/bank-sync'] = async function (args) {
    const batchSync = args?.accountId == null;
    const allErrors = [];
    if (!batchSync) {
        const { errors } = await handlers['accounts-bank-sync']({
            ids: [args.accountId],
        });
        allErrors.push(...errors);
    }
    else {
        const accountsData = await handlers['accounts-get']();
        const accountIdsToSync = accountsData.map(a => a.id);
        const simpleFinAccounts = accountsData.filter(a => a.account_sync_source === 'simpleFin');
        const simpleFinAccountIds = simpleFinAccounts.map(a => a.id);
        if (simpleFinAccounts.length > 1) {
            const res = await handlers['simplefin-batch-sync']({
                ids: simpleFinAccountIds,
            });
            res.forEach(a => allErrors.push(...a.res.errors));
        }
        const { errors } = await handlers['accounts-bank-sync']({
            ids: accountIdsToSync.filter(a => !simpleFinAccountIds.includes(a)),
        });
        allErrors.push(...errors);
    }
    const errors = allErrors.filter(e => e != null);
    if (errors.length > 0) {
        throw new Error((0, errors_1.getBankSyncError)(errors[0]));
    }
};
handlers['api/start-import'] = async function ({ budgetName }) {
    // Notify UI to close budget
    await handlers['close-budget']();
    // Create the budget
    await handlers['create-budget']({ budgetName, avoidUpload: true });
    // Clear out the default expense categories
    await db.runQuery('DELETE FROM categories WHERE is_income = 0');
    await db.runQuery('DELETE FROM category_groups WHERE is_income = 0');
    // Turn syncing off
    (0, sync_2.setSyncingMode)('import');
    connection.send('start-import');
    IMPORT_MODE = true;
};
handlers['api/finish-import'] = async function () {
    checkFileOpen();
    sheet.get().markCacheDirty();
    // We always need to fully reload the app. Importing doesn't touch
    // the spreadsheet, but we can't just recreate the spreadsheet
    // either; there is other internal state that isn't created
    const { id } = prefs.getPrefs();
    await handlers['close-budget']();
    await handlers['load-budget']({ id });
    await handlers['get-budget-bounds']();
    await sheet.waitOnSpreadsheet();
    await cloudStorage.upload().catch(() => { });
    connection.send('finish-import');
    IMPORT_MODE = false;
};
handlers['api/abort-import'] = async function () {
    if (IMPORT_MODE) {
        checkFileOpen();
        const { id } = prefs.getPrefs();
        await handlers['close-budget']();
        await handlers['delete-budget']({ id });
        connection.send('show-budgets');
    }
    IMPORT_MODE = false;
};
handlers['api/query'] = async function ({ query }) {
    checkFileOpen();
    return (0, aql_1.aqlQuery)(query);
};
handlers['api/budget-months'] = async function () {
    checkFileOpen();
    const { start, end } = await handlers['get-budget-bounds']();
    return monthUtils.range(start, end);
};
handlers['api/budget-month'] = async function ({ month }) {
    checkFileOpen();
    await validateMonth(month);
    const { data: groups } = await (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').select('*'));
    const sheetName = monthUtils.sheetForMonth(month);
    function value(name) {
        const v = sheet.get().getCellValue(sheetName, name);
        return v === '' ? 0 : v;
    }
    // This is duplicated from main.js because the return format is
    // different (for now)
    return {
        month,
        incomeAvailable: value('available-funds'),
        lastMonthOverspent: value('last-month-overspent'),
        forNextMonth: value('buffered'),
        totalBudgeted: value('total-budgeted'),
        toBudget: value('to-budget'),
        fromLastMonth: value('from-last-month'),
        totalIncome: value('total-income'),
        totalSpent: value('total-spent'),
        totalBalance: value('total-leftover'),
        categoryGroups: groups.map(group => {
            if (group.is_income) {
                return {
                    ...api_models_1.categoryGroupModel.toExternal(group),
                    received: value('total-income'),
                    categories: group.categories.map(cat => ({
                        ...api_models_1.categoryModel.toExternal(cat),
                        received: value(`sum-amount-${cat.id}`),
                    })),
                };
            }
            return {
                ...api_models_1.categoryGroupModel.toExternal(group),
                budgeted: value(`group-budget-${group.id}`),
                spent: value(`group-sum-amount-${group.id}`),
                balance: value(`group-leftover-${group.id}`),
                categories: group.categories.map(cat => ({
                    ...api_models_1.categoryModel.toExternal(cat),
                    budgeted: value(`budget-${cat.id}`),
                    spent: value(`sum-amount-${cat.id}`),
                    balance: value(`leftover-${cat.id}`),
                    carryover: value(`carryover-${cat.id}`),
                })),
            };
        }),
    };
};
handlers['api/budget-set-amount'] = withMutation(async function ({ month, categoryId, amount, }) {
    checkFileOpen();
    return handlers['budget/budget-amount']({
        month,
        category: categoryId,
        amount,
    });
});
handlers['api/budget-set-carryover'] = withMutation(async function ({ month, categoryId, flag, }) {
    checkFileOpen();
    await validateMonth(month);
    await validateExpenseCategory('budget-set-carryover', categoryId);
    return handlers['budget/set-carryover']({
        startMonth: month,
        category: categoryId,
        flag,
    });
});
handlers['api/budget-hold-for-next-month'] = withMutation(async function ({ month, amount, }) {
    checkFileOpen();
    await validateMonth(month);
    if (amount <= 0) {
        throw (0, errors_2.APIError)('Amount to hold needs to be greater than 0');
    }
    return handlers['budget/hold-for-next-month']({
        month,
        amount,
    });
});
handlers['api/budget-reset-hold'] = withMutation(async function ({ month }) {
    checkFileOpen();
    await validateMonth(month);
    return handlers['budget/reset-hold']({ month });
});
handlers['api/transactions-export'] = async function ({ transactions, categoryGroups, payees, accounts, }) {
    checkFileOpen();
    return handlers['transactions-export']({
        transactions,
        categoryGroups,
        payees,
        accounts,
    });
};
handlers['api/transactions-import'] = withMutation(async function ({ accountId, transactions, isPreview = false, opts, }) {
    checkFileOpen();
    return handlers['transactions-import']({
        accountId,
        transactions,
        isPreview,
        opts,
    });
});
handlers['api/transactions-add'] = withMutation(async function ({ accountId, transactions, runTransfers = false, learnCategories = false, }) {
    checkFileOpen();
    await (0, sync_1.addTransactions)(accountId, transactions, {
        runTransfers,
        learnCategories,
    });
    return 'ok';
});
handlers['api/transactions-get'] = async function ({ accountId, startDate, endDate, }) {
    checkFileOpen();
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
        .filter({
        $and: [
            accountId && { account: accountId },
            startDate && { date: { $gte: startDate } },
            endDate && { date: { $lte: endDate } },
        ].filter(Boolean),
    })
        .select('*')
        .options({ splits: 'grouped' }));
    return data;
};
handlers['api/transaction-update'] = withMutation(async function ({ id, fields, }) {
    checkFileOpen();
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ id }).select('*').options({ splits: 'grouped' }));
    const transactions = (0, transactions_1.ungroupTransactions)(data);
    if (transactions.length === 0) {
        return [];
    }
    const { diff } = (0, transactions_1.updateTransaction)(transactions, { id, ...fields });
    return handlers['transactions-batch-update'](diff)['updated'];
});
handlers['api/transaction-delete'] = withMutation(async function ({ id }) {
    checkFileOpen();
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ id }).select('*').options({ splits: 'grouped' }));
    const transactions = (0, transactions_1.ungroupTransactions)(data);
    if (transactions.length === 0) {
        return [];
    }
    const { diff } = (0, transactions_1.deleteTransaction)(transactions, id);
    return handlers['transactions-batch-update'](diff)['deleted'];
});
handlers['api/accounts-get'] = async function () {
    checkFileOpen();
    // TODO: Force cast to AccountEntity. This should be updated to an AQL query.
    const accounts = (await db.getAccounts());
    return accounts.map(account => api_models_1.accountModel.toExternal(account));
};
handlers['api/account-create'] = withMutation(async function ({ account, initialBalance = null, }) {
    checkFileOpen();
    return handlers['account-create']({
        name: account.name,
        offBudget: account.offbudget,
        closed: account.closed,
        // Current the API expects an amount but it really should expect
        // an integer
        balance: initialBalance != null ? (0, util_1.integerToAmount)(initialBalance) : null,
    });
});
handlers['api/account-update'] = withMutation(async function ({ id, fields }) {
    checkFileOpen();
    return db.updateAccount({ id, ...api_models_1.accountModel.fromExternal(fields) });
});
handlers['api/account-close'] = withMutation(async function ({ id, transferAccountId, transferCategoryId, }) {
    checkFileOpen();
    return handlers['account-close']({
        id,
        transferAccountId,
        categoryId: transferCategoryId,
    });
});
handlers['api/account-reopen'] = withMutation(async function ({ id }) {
    checkFileOpen();
    return handlers['account-reopen']({ id });
});
handlers['api/account-delete'] = withMutation(async function ({ id }) {
    checkFileOpen();
    return handlers['account-close']({ id, forced: true });
});
handlers['api/account-balance'] = withMutation(async function ({ id, cutoff = new Date(), }) {
    checkFileOpen();
    return handlers['account-balance']({ id, cutoff });
});
handlers['api/categories-get'] = async function ({ grouped, } = {}) {
    checkFileOpen();
    const result = await handlers['get-categories']();
    return grouped
        ? result.grouped.map(api_models_1.categoryGroupModel.toExternal)
        : result.list.map(api_models_1.categoryModel.toExternal);
};
handlers['api/category-groups-get'] = async function () {
    checkFileOpen();
    const groups = await handlers['get-category-groups']();
    return groups.map(api_models_1.categoryGroupModel.toExternal);
};
handlers['api/category-group-create'] = withMutation(async function ({ group, }) {
    checkFileOpen();
    return handlers['category-group-create']({
        name: group.name,
        hidden: group.hidden,
    });
});
handlers['api/category-group-update'] = withMutation(async function ({ id, fields, }) {
    checkFileOpen();
    return handlers['category-group-update']({
        id,
        ...api_models_1.categoryGroupModel.fromExternal(fields),
    });
});
handlers['api/category-group-delete'] = withMutation(async function ({ id, transferCategoryId, }) {
    checkFileOpen();
    return handlers['category-group-delete']({
        id,
        transferId: transferCategoryId,
    });
});
handlers['api/category-create'] = withMutation(async function ({ category }) {
    checkFileOpen();
    return handlers['category-create']({
        name: category.name,
        groupId: category.group_id,
        isIncome: category.is_income,
        hidden: category.hidden,
    });
});
handlers['api/category-update'] = withMutation(async function ({ id, fields }) {
    checkFileOpen();
    return handlers['category-update']({
        id,
        ...api_models_1.categoryModel.fromExternal(fields),
    });
});
handlers['api/category-delete'] = withMutation(async function ({ id, transferCategoryId, }) {
    checkFileOpen();
    return handlers['category-delete']({
        id,
        transferId: transferCategoryId,
    });
});
handlers['api/common-payees-get'] = async function () {
    checkFileOpen();
    const payees = await handlers['common-payees-get']();
    return payees.map(api_models_1.payeeModel.toExternal);
};
handlers['api/payees-get'] = async function () {
    checkFileOpen();
    const payees = await handlers['payees-get']();
    return payees.map(api_models_1.payeeModel.toExternal);
};
handlers['api/payee-create'] = withMutation(async function ({ payee }) {
    checkFileOpen();
    return handlers['payee-create']({ name: payee.name });
});
handlers['api/payee-update'] = withMutation(async function ({ id, fields }) {
    checkFileOpen();
    return handlers['payees-batch-change']({
        updated: [{ id, ...api_models_1.payeeModel.fromExternal(fields) }],
    });
});
handlers['api/payee-delete'] = withMutation(async function ({ id }) {
    checkFileOpen();
    return handlers['payees-batch-change']({ deleted: [{ id }] });
});
handlers['api/payees-merge'] = withMutation(async function ({ targetId, mergeIds, }) {
    checkFileOpen();
    return handlers['payees-merge']({ targetId, mergeIds });
});
handlers['api/rules-get'] = async function () {
    checkFileOpen();
    return handlers['rules-get']();
};
handlers['api/payee-rules-get'] = async function ({ id }) {
    checkFileOpen();
    return handlers['payees-get-rules']({ id });
};
handlers['api/rule-create'] = withMutation(async function ({ rule }) {
    checkFileOpen();
    const addedRule = await handlers['rule-add'](rule);
    if ('error' in addedRule) {
        throw (0, errors_2.APIError)('Failed creating a new rule', addedRule.error);
    }
    return addedRule;
});
handlers['api/rule-update'] = withMutation(async function ({ rule }) {
    checkFileOpen();
    const updatedRule = await handlers['rule-update'](rule);
    if ('error' in updatedRule) {
        throw (0, errors_2.APIError)('Failed updating the rule', updatedRule.error);
    }
    return updatedRule;
});
handlers['api/rule-delete'] = withMutation(async function (id) {
    checkFileOpen();
    return handlers['rule-delete'](id);
});
handlers['api/schedules-get'] = async function () {
    checkFileOpen();
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').select('*'));
    const schedules = data;
    return schedules.map(schedule => api_models_1.scheduleModel.toExternal(schedule));
};
handlers['api/schedule-create'] = withMutation(async function (schedule) {
    checkFileOpen();
    const internalSchedule = api_models_1.scheduleModel.fromExternal(schedule);
    const partialSchedule = {
        name: internalSchedule.name,
        posts_transaction: internalSchedule.posts_transaction,
    };
    return handlers['schedule/create']({
        schedule: partialSchedule,
        conditions: internalSchedule._conditions,
    });
});
handlers['api/schedule-update'] = withMutation(async function ({ id, fields, resetNextDate, }) {
    checkFileOpen();
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).select('*'));
    if (!data || data.length === 0) {
        throw (0, errors_2.APIError)(`Schedule ${id} not found`);
    }
    const sched = data[0];
    let conditionsUpdated = false;
    // Find all indices to avoid direct assignment
    const payeeIndex = sched._conditions.findIndex(c => c.field === 'payee');
    const accountIndex = sched._conditions.findIndex(c => c.field === 'account');
    const dateIndex = sched._conditions.findIndex(c => c.field === 'date');
    const amountIndex = sched._conditions.findIndex(c => c.field === 'amount');
    for (const key in fields) {
        const typedKey = key;
        const value = fields[typedKey];
        switch (typedKey) {
            case 'name': {
                const newName = String(value);
                const { data: existing } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ name: newName }).select('*'));
                if (!existing || existing.length === 0 || existing[0].id === sched.id) {
                    sched.name = newName;
                    conditionsUpdated = true;
                }
                else {
                    throw (0, errors_2.APIError)(`There is already a schedule named: ${newName}`);
                }
                break;
            }
            case 'next_date':
            case 'completed': {
                throw (0, errors_2.APIError)(`Field ${typedKey} is system-managed and not user-editable.`);
            }
            case 'posts_transaction': {
                sched.posts_transaction = Boolean(value);
                conditionsUpdated = true;
                break;
            }
            case 'payee': {
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
                break;
            }
            case 'account': {
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
                break;
            }
            case 'amountOp': {
                if (amountIndex !== -1) {
                    let convertedOp;
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
                            throw (0, errors_2.APIError)(`Invalid amount operator: ${value}. Expected: is, isapprox, or isbetween`);
                    }
                    sched._conditions[amountIndex].op = convertedOp;
                    conditionsUpdated = true;
                }
                else {
                    throw (0, errors_2.APIError)(`Ammount can not be found. There is a bug here`);
                }
                break;
            }
            case 'amount': {
                if (amountIndex !== -1) {
                    sched._conditions[amountIndex].value = value;
                    conditionsUpdated = true;
                }
                else {
                    throw (0, errors_2.APIError)(`Ammount can not be found. There is a bug here`);
                }
                break;
            }
            case 'date': {
                if (dateIndex !== -1) {
                    sched._conditions[dateIndex].value = value;
                    conditionsUpdated = true;
                }
                else {
                    throw (0, errors_2.APIError)(`Date can not be found. Schedules can not be created without a date there is a bug here`);
                }
                break;
            }
            default: {
                throw (0, errors_2.APIError)(`Unhandled field: ${typedKey}`);
            }
        }
    }
    if (conditionsUpdated) {
        return handlers['schedule/update']({
            schedule: {
                id: sched.id,
                posts_transaction: sched.posts_transaction,
                name: sched.name,
            },
            conditions: sched._conditions,
            resetNextDate,
        });
    }
    else {
        return sched.id;
    }
});
handlers['api/schedule-delete'] = withMutation(async function (id) {
    checkFileOpen();
    return handlers['schedule/delete']({ id });
});
handlers['api/get-id-by-name'] = async function ({ type, name }) {
    checkFileOpen();
    const allowedTypes = ['payees', 'categories', 'schedules', 'accounts'];
    if (!allowedTypes.includes(type)) {
        throw (0, errors_2.APIError)('Provide a valid type');
    }
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)(type).filter({ name }).select('*'));
    if (!data || data.length === 0) {
        throw (0, errors_2.APIError)(`Not found: ${type} with name ${name}`);
    }
    return data[0].id;
};
handlers['api/get-server-version'] = async function () {
    checkFileOpen();
    return handlers['get-server-version']();
};
function installAPI(serverHandlers) {
    const merged = Object.assign({}, serverHandlers, handlers);
    handlers = merged;
    return merged;
}
//# sourceMappingURL=api.js.map