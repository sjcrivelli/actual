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
exports.app = void 0;
const i18next_1 = require("i18next");
const uuid_1 = require("uuid");
const exceptions_1 = require("../../platform/exceptions");
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const connection = __importStar(require("../../platform/server/connection"));
const log_1 = require("../../platform/server/log");
const environment_1 = require("../../shared/environment");
const months_1 = require("../../shared/months");
const monthUtils = __importStar(require("../../shared/months"));
const util_1 = require("../../shared/util");
const app_1 = require("../app");
const db = __importStar(require("../db"));
const errors_1 = require("../errors");
const main_app_1 = require("../main-app");
const mutators_1 = require("../mutators");
const post_1 = require("../post");
const server_config_1 = require("../server-config");
const sync_1 = require("../sync");
const undo_1 = require("../undo");
const link = __importStar(require("./link"));
const payees_1 = require("./payees");
const bankSync = __importStar(require("./sync"));
async function updateAccount({ id, name, last_reconciled, }) {
    await db.update('accounts', {
        id,
        name,
        ...(last_reconciled && { last_reconciled }),
    });
    return {};
}
async function getAccounts() {
    return db.getAccounts();
}
async function getAccountBalance({ id, cutoff, }) {
    const result = await db.first('SELECT sum(amount) as balance FROM transactions WHERE acct = ? AND isParent = 0 AND tombstone = 0 AND date <= ?', [id, db.toDateRepr((0, months_1.dayFromDate)(cutoff))]);
    return result?.balance ? result.balance : 0;
}
async function getAccountProperties({ id }) {
    const balanceResult = await db.first('SELECT sum(amount) as balance FROM transactions WHERE acct = ? AND isParent = 0 AND tombstone = 0', [id]);
    const countResult = await db.first('SELECT count(id) as count FROM transactions WHERE acct = ? AND tombstone = 0', [id]);
    return {
        balance: balanceResult?.balance || 0,
        numTransactions: countResult?.count || 0,
    };
}
async function linkGoCardlessAccount({ requisitionId, account, upgradingId, offBudget = false, }) {
    let id;
    const bank = await link.findOrCreateBank(account.institution, requisitionId);
    if (upgradingId) {
        const accRow = await db.first('SELECT * FROM accounts WHERE id = ?', [upgradingId]);
        if (!accRow) {
            throw new Error(`Account with ID ${upgradingId} not found.`);
        }
        id = accRow.id;
        await db.update('accounts', {
            id,
            account_id: account.account_id,
            bank: bank.id,
            account_sync_source: 'goCardless',
        });
    }
    else {
        id = (0, uuid_1.v4)();
        await db.insertWithUUID('accounts', {
            id,
            account_id: account.account_id,
            mask: account.mask,
            name: account.name,
            official_name: account.official_name,
            bank: bank.id,
            offbudget: offBudget ? 1 : 0,
            account_sync_source: 'goCardless',
        });
        await db.insertPayee({
            name: '',
            transfer_acct: id,
        });
    }
    await bankSync.syncAccount(undefined, undefined, id, account.account_id, bank.bank_id);
    connection.send('sync-event', {
        type: 'success',
        tables: ['transactions'],
    });
    return 'ok';
}
async function linkSimpleFinAccount({ externalAccount, upgradingId, offBudget = false, }) {
    let id;
    const institution = {
        name: externalAccount.institution ?? (0, i18next_1.t)('Unknown'),
    };
    const bank = await link.findOrCreateBank(institution, externalAccount.orgDomain ?? externalAccount.orgId);
    if (upgradingId) {
        const accRow = await db.first('SELECT * FROM accounts WHERE id = ?', [upgradingId]);
        if (!accRow) {
            throw new Error(`Account with ID ${upgradingId} not found.`);
        }
        id = accRow.id;
        await db.update('accounts', {
            id,
            account_id: externalAccount.account_id,
            bank: bank.id,
            account_sync_source: 'simpleFin',
        });
    }
    else {
        id = (0, uuid_1.v4)();
        await db.insertWithUUID('accounts', {
            id,
            account_id: externalAccount.account_id,
            name: externalAccount.name,
            official_name: externalAccount.name,
            bank: bank.id,
            offbudget: offBudget ? 1 : 0,
            account_sync_source: 'simpleFin',
        });
        await db.insertPayee({
            name: '',
            transfer_acct: id,
        });
    }
    await bankSync.syncAccount(undefined, undefined, id, externalAccount.account_id, bank.bank_id);
    await connection.send('sync-event', {
        type: 'success',
        tables: ['transactions'],
    });
    return 'ok';
}
async function linkPluggyAiAccount({ externalAccount, upgradingId, offBudget = false, }) {
    let id;
    const institution = {
        name: externalAccount.institution ?? (0, i18next_1.t)('Unknown'),
    };
    const bank = await link.findOrCreateBank(institution, externalAccount.orgDomain ?? externalAccount.orgId);
    if (upgradingId) {
        const accRow = await db.first('SELECT * FROM accounts WHERE id = ?', [upgradingId]);
        if (!accRow) {
            throw new Error(`Account with ID ${upgradingId} not found.`);
        }
        id = accRow.id;
        await db.update('accounts', {
            id,
            account_id: externalAccount.account_id,
            bank: bank.id,
            account_sync_source: 'pluggyai',
        });
    }
    else {
        id = (0, uuid_1.v4)();
        await db.insertWithUUID('accounts', {
            id,
            account_id: externalAccount.account_id,
            name: externalAccount.name,
            official_name: externalAccount.name,
            bank: bank.id,
            offbudget: offBudget ? 1 : 0,
            account_sync_source: 'pluggyai',
        });
        await db.insertPayee({
            name: '',
            transfer_acct: id,
        });
    }
    await bankSync.syncAccount(undefined, undefined, id, externalAccount.account_id, bank.bank_id);
    await connection.send('sync-event', {
        type: 'success',
        tables: ['transactions'],
    });
    return 'ok';
}
async function createAccount({ name, balance = 0, offBudget = false, closed = false, }) {
    const id = await db.insertAccount({
        name,
        offbudget: offBudget ? 1 : 0,
        closed: closed ? 1 : 0,
    });
    await db.insertPayee({
        name: '',
        transfer_acct: id,
    });
    if (balance != null && balance !== 0) {
        const payee = await (0, payees_1.getStartingBalancePayee)();
        await db.insertTransaction({
            account: id,
            amount: (0, util_1.amountToInteger)(balance),
            category: offBudget ? null : payee.category,
            payee: payee.id,
            date: monthUtils.currentDay(),
            cleared: true,
            starting_balance_flag: true,
        });
    }
    return id;
}
async function closeAccount({ id, transferAccountId, categoryId, forced = false, }) {
    // Unlink the account if it's linked. This makes sure to remove it from
    // bank-sync providers. (This should not be undo-able, as it mutates the
    // remote server and the user will have to link the account again)
    await unlinkAccount({ id });
    return (0, undo_1.withUndo)(async () => {
        const account = await db.first('SELECT * FROM accounts WHERE id = ? AND tombstone = 0', [id]);
        // Do nothing if the account doesn't exist or it's already been
        // closed
        if (!account || account.closed === 1) {
            return;
        }
        const { balance, numTransactions } = await getAccountProperties({ id });
        // If there are no transactions, we can simply delete the account
        if (numTransactions === 0) {
            await db.deleteAccount({ id });
        }
        else if (forced) {
            const rows = await db.runQuery('SELECT id, transfer_id FROM v_transactions WHERE account = ?', [id], true);
            const transferPayee = await db.first('SELECT id FROM payees WHERE transfer_acct = ?', [id]);
            if (!transferPayee) {
                throw new Error(`Transfer payee with account ID ${id} not found.`);
            }
            await (0, sync_1.batchMessages)(async () => {
                // TODO: what this should really do is send a special message that
                // automatically marks the tombstone value for all transactions
                // within an account... or something? This is problematic
                // because another client could easily add new data that
                // should be marked as deleted.
                rows.forEach(row => {
                    if (row.transfer_id) {
                        db.updateTransaction({
                            id: row.transfer_id,
                            payee: null,
                            transfer_id: null,
                        });
                    }
                    db.deleteTransaction({ id: row.id });
                });
                db.deleteAccount({ id });
                db.deleteTransferPayee({ id: transferPayee.id });
            });
        }
        else {
            if (balance !== 0 && transferAccountId == null) {
                throw (0, errors_1.APIError)('balance is non-zero: transferAccountId is required');
            }
            if (id === transferAccountId) {
                throw (0, errors_1.APIError)('transfer account can not be the account being closed');
            }
            await db.update('accounts', { id, closed: 1 });
            // If there is a balance we need to transfer it to the specified
            // account (and possibly categorize it)
            if (balance !== 0 && transferAccountId) {
                const transferPayee = await db.first('SELECT id FROM payees WHERE transfer_acct = ?', [transferAccountId]);
                if (!transferPayee) {
                    throw new Error(`Transfer payee with account ID ${transferAccountId} not found.`);
                }
                await main_app_1.app.handlers['transaction-add']({
                    id: (0, uuid_1.v4)(),
                    payee: transferPayee.id,
                    amount: -balance,
                    account: id,
                    date: monthUtils.currentDay(),
                    notes: 'Closing account',
                    category: categoryId,
                });
            }
        }
    });
}
async function reopenAccount({ id }) {
    await db.update('accounts', { id, closed: 0 });
}
async function moveAccount({ id, targetId, }) {
    await db.moveAccount(id, targetId);
}
async function setSecret({ name, value, }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    try {
        return await (0, post_1.post)(serverConfig.BASE_SERVER + '/secret', {
            name,
            value,
        }, {
            'X-ACTUAL-TOKEN': userToken,
        });
    }
    catch (error) {
        return {
            error: 'failed',
            reason: error instanceof errors_1.PostError ? error.reason : undefined,
        };
    }
}
async function checkSecret(name) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    try {
        return await (0, post_1.get)(serverConfig.BASE_SERVER + '/secret/' + name, {
            'X-ACTUAL-TOKEN': userToken,
        });
    }
    catch (error) {
        log_1.logger.error(error);
        return { error: 'failed' };
    }
}
let stopPolling = false;
async function pollGoCardlessWebToken({ requisitionId, }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken)
        return { error: 'unknown' };
    const startTime = Date.now();
    stopPolling = false;
    async function getData(cb) {
        if (stopPolling) {
            return;
        }
        if (Date.now() - startTime >= 1000 * 60 * 10) {
            cb({ status: 'timeout' });
            return;
        }
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('Failed to get server config.');
        }
        const data = await (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/get-accounts', {
            requisitionId,
        }, {
            'X-ACTUAL-TOKEN': userToken,
        });
        if (data) {
            if (data.error_code) {
                log_1.logger.error('Failed linking gocardless account:', data);
                cb({ status: 'unknown', message: data.error_type });
            }
            else {
                cb({ status: 'success', data });
            }
        }
        else {
            setTimeout(() => getData(cb), 3000);
        }
    }
    return new Promise(resolve => {
        getData(data => {
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
    });
}
async function stopGoCardlessWebTokenPolling() {
    stopPolling = true;
    return 'ok';
}
async function goCardlessStatus() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    return (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/status', {}, {
        'X-ACTUAL-TOKEN': userToken,
    });
}
async function simpleFinStatus() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    return (0, post_1.post)(serverConfig.SIMPLEFIN_SERVER + '/status', {}, {
        'X-ACTUAL-TOKEN': userToken,
    });
}
async function pluggyAiStatus() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    return (0, post_1.post)(serverConfig.PLUGGYAI_SERVER + '/status', {}, {
        'X-ACTUAL-TOKEN': userToken,
    });
}
async function simpleFinAccounts() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    try {
        return await (0, post_1.post)(serverConfig.SIMPLEFIN_SERVER + '/accounts', {}, {
            'X-ACTUAL-TOKEN': userToken,
        }, 60000);
    }
    catch (error) {
        return { error_code: 'TIMED_OUT' };
    }
}
async function pluggyAiAccounts() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    try {
        return await (0, post_1.post)(serverConfig.PLUGGYAI_SERVER + '/accounts', {}, {
            'X-ACTUAL-TOKEN': userToken,
        }, 60000);
    }
    catch (error) {
        return { error_code: 'TIMED_OUT' };
    }
}
async function getGoCardlessBanks(country) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    return (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/get-banks', { country, showDemo: (0, environment_1.isNonProductionEnvironment)() }, {
        'X-ACTUAL-TOKEN': userToken,
    });
}
async function createGoCardlessWebToken({ institutionId, accessValidForDays, }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return { error: 'unauthorized' };
    }
    const serverConfig = (0, server_config_1.getServer)();
    if (!serverConfig) {
        throw new Error('Failed to get server config.');
    }
    try {
        return await (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/create-web-token', {
            institutionId,
            accessValidForDays,
        }, {
            'X-ACTUAL-TOKEN': userToken,
        });
    }
    catch (error) {
        log_1.logger.error(error);
        return { error: 'failed' };
    }
}
async function handleSyncResponse(res, acct) {
    const { added, updated } = res;
    const newTransactions = [];
    const matchedTransactions = [];
    const updatedAccounts = [];
    newTransactions.push(...added);
    matchedTransactions.push(...updated);
    if (added.length > 0) {
        updatedAccounts.push(acct.id);
    }
    const ts = new Date().getTime().toString();
    await db.update('accounts', { id: acct.id, last_sync: ts });
    return {
        newTransactions,
        matchedTransactions,
        updatedAccounts,
    };
}
function handleSyncError(err, acct) {
    // TODO: refactor bank sync logic to use BankSyncError properly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (err instanceof errors_1.BankSyncError || err?.type === 'BankSyncError') {
        const error = err;
        const syncError = {
            type: 'SyncError',
            accountId: acct.id,
            message: 'Failed syncing account “' + acct.name + '.”',
            category: error.category,
            code: error.code,
        };
        if (error.category === 'RATE_LIMIT_EXCEEDED') {
            return {
                ...syncError,
                message: `Failed syncing account ${acct.name}. Rate limit exceeded. Please try again later.`,
            };
        }
        return syncError;
    }
    if (err instanceof errors_1.PostError && err.reason !== 'internal') {
        return {
            accountId: acct.id,
            message: err.reason
                ? err.reason
                : `Account “${acct.name}” is not linked properly. Please link it again.`,
        };
    }
    return {
        accountId: acct.id,
        message: 'There was an internal error. Please get in touch https://actualbudget.org/contact for support.',
        internal: err.stack,
    };
}
async function accountsBankSync({ ids = [], }) {
    const { 'user-id': userId, 'user-key': userKey } = await asyncStorage.multiGet(['user-id', 'user-key']);
    const accounts = await db.runQuery(`
    SELECT a.*, b.bank_id as bankId
    FROM accounts a
    LEFT JOIN banks b ON a.bank = b.id
    WHERE a.tombstone = 0 AND a.closed = 0
      ${ids.length ? `AND a.id IN (${ids.map(() => '?').join(', ')})` : ''}
    ORDER BY a.offbudget, a.sort_order
  `, ids, true);
    const errors = [];
    const newTransactions = [];
    const matchedTransactions = [];
    const updatedAccounts = [];
    for (const acct of accounts) {
        if (acct.bankId && acct.account_id) {
            try {
                log_1.logger.group('Bank Sync operation for account:', acct.name);
                const syncResponse = await bankSync.syncAccount(userId, userKey, acct.id, acct.account_id, acct.bankId);
                const syncResponseData = await handleSyncResponse(syncResponse, acct);
                newTransactions.push(...syncResponseData.newTransactions);
                matchedTransactions.push(...syncResponseData.matchedTransactions);
                updatedAccounts.push(...syncResponseData.updatedAccounts);
            }
            catch (err) {
                const error = err;
                errors.push(handleSyncError(error, acct));
                (0, exceptions_1.captureException)({
                    ...error,
                    message: 'Failed syncing account “' + acct.name + '.”',
                });
            }
            finally {
                log_1.logger.groupEnd();
            }
        }
    }
    if (updatedAccounts.length > 0) {
        connection.send('sync-event', {
            type: 'success',
            tables: ['transactions'],
        });
    }
    return { errors, newTransactions, matchedTransactions, updatedAccounts };
}
async function simpleFinBatchSync({ ids = [], }) {
    const accounts = await db.runQuery(`SELECT a.*, b.bank_id as bankId FROM accounts a
         LEFT JOIN banks b ON a.bank = b.id
         WHERE
          a.tombstone = 0
          AND a.closed = 0
          AND a.account_sync_source = 'simpleFin'
          ${ids.length ? `AND a.id IN (${ids.map(() => '?').join(', ')})` : ''}
         ORDER BY a.offbudget, a.sort_order`, ids.length ? ids : [], true);
    const retVal = [];
    log_1.logger.group('Bank Sync operation for all SimpleFin accounts');
    try {
        const syncResponses = await bankSync.simpleFinBatchSync(accounts.map(a => ({
            id: a.id,
            account_id: a.account_id || null,
        })));
        for (const syncResponse of syncResponses) {
            const account = accounts.find(a => a.id === syncResponse.accountId);
            if (!account) {
                log_1.logger.error(`Invalid account ID found in response: ${syncResponse.accountId}. Proceeding to the next account...`);
                continue;
            }
            const errors = [];
            const newTransactions = [];
            const matchedTransactions = [];
            const updatedAccounts = [];
            if (syncResponse.res.error_code) {
                errors.push(handleSyncError({
                    type: 'BankSyncError',
                    reason: 'Failed syncing account “' + account.name + '.”',
                    category: syncResponse.res.error_type,
                    code: syncResponse.res.error_code,
                }, account));
            }
            else {
                const syncResponseData = await handleSyncResponse(syncResponse.res, account);
                newTransactions.push(...syncResponseData.newTransactions);
                matchedTransactions.push(...syncResponseData.matchedTransactions);
                updatedAccounts.push(...syncResponseData.updatedAccounts);
            }
            retVal.push({
                accountId: syncResponse.accountId,
                res: { errors, newTransactions, matchedTransactions, updatedAccounts },
            });
        }
    }
    catch (err) {
        const errors = [];
        for (const account of accounts) {
            retVal.push({
                accountId: account.id,
                res: {
                    errors,
                    newTransactions: [],
                    matchedTransactions: [],
                    updatedAccounts: [],
                },
            });
            const error = err;
            errors.push(handleSyncError(error, account));
        }
    }
    if (retVal.some(a => a.res.updatedAccounts.length > 0)) {
        connection.send('sync-event', {
            type: 'success',
            tables: ['transactions'],
        });
    }
    log_1.logger.groupEnd();
    return retVal;
}
async function importTransactions({ accountId, transactions, isPreview, opts, }) {
    if (typeof accountId !== 'string') {
        throw (0, errors_1.APIError)('transactions-import: accountId must be an id');
    }
    try {
        const reconciled = await bankSync.reconcileTransactions(accountId, transactions, false, true, isPreview, opts?.defaultCleared);
        return {
            errors: [],
            added: reconciled.added,
            updated: reconciled.updated,
            updatedPreview: reconciled.updatedPreview,
        };
    }
    catch (err) {
        if (err instanceof errors_1.TransactionError) {
            return {
                errors: [{ message: err.message }],
                added: [],
                updated: [],
                updatedPreview: [],
            };
        }
        throw err;
    }
}
async function unlinkAccount({ id }) {
    const accRow = await db.first('SELECT * FROM accounts WHERE id = ?', [id]);
    if (!accRow) {
        throw new Error(`Account with ID ${id} not found.`);
    }
    const bankId = accRow.bank;
    if (!bankId) {
        return 'ok';
    }
    const isGoCardless = accRow.account_sync_source === 'goCardless';
    await db.updateAccount({
        id,
        account_id: null,
        bank: null,
        balance_current: null,
        balance_available: null,
        balance_limit: null,
        account_sync_source: null,
    });
    if (isGoCardless === false) {
        return;
    }
    const accountWithBankResult = await db.first('SELECT COUNT(*) as count FROM accounts WHERE bank = ?', [bankId]);
    // No more accounts are associated with this bank. We can remove
    // it from GoCardless.
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return 'ok';
    }
    if (!accountWithBankResult || accountWithBankResult.count === 0) {
        const bank = await db.first('SELECT bank_id FROM banks WHERE id = ?', [bankId]);
        if (!bank) {
            throw new Error(`Bank with ID ${bankId} not found.`);
        }
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('Failed to get server config.');
        }
        const requisitionId = bank.bank_id;
        try {
            await (0, post_1.post)(serverConfig.GOCARDLESS_SERVER + '/remove-account', {
                requisitionId,
            }, {
                'X-ACTUAL-TOKEN': userToken,
            });
        }
        catch (error) {
            log_1.logger.log({ error });
        }
    }
    return 'ok';
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
//# sourceMappingURL=app.js.map