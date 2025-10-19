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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const injected_1 = require("@actual-app/api/injected");
const actual = __importStar(require("@actual-app/api/methods"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const slash_1 = __importDefault(require("slash"));
const uuid_1 = require("uuid");
const log_1 = require("../../platform/server/log");
const monthUtils = __importStar(require("../../shared/months"));
const util_1 = require("../../shared/util");
// Importer
async function importAccounts(data, entityIdMap) {
    const accounts = (0, util_1.sortByKey)(data.accounts, 'sortableIndex');
    return Promise.all(accounts.map(async (account) => {
        if (!account.isTombstone) {
            const id = await actual.createAccount({
                name: account.accountName,
                offbudget: account.onBudget ? false : true,
                closed: account.hidden ? true : false,
            });
            entityIdMap.set(account.entityId, id);
        }
    }));
}
async function importCategories(data, entityIdMap) {
    const masterCategories = (0, util_1.sortByKey)(data.masterCategories, 'sortableIndex');
    await Promise.all(masterCategories.map(async (masterCategory) => {
        if (masterCategory.type === 'OUTFLOW' &&
            !masterCategory.isTombstone &&
            masterCategory.subCategories &&
            masterCategory.subCategories.some(cat => !cat.isTombstone)) {
            const id = await actual.createCategoryGroup({
                name: masterCategory.name,
                is_income: false,
            });
            entityIdMap.set(masterCategory.entityId, id);
            if (masterCategory.note) {
                (0, injected_1.send)('notes-save', { id, note: masterCategory.note });
            }
            if (masterCategory.subCategories) {
                const subCategories = (0, util_1.sortByKey)(masterCategory.subCategories, 'sortableIndex');
                subCategories.reverse();
                // This can't be done in parallel because sort order depends
                // on insertion order
                for (const category of subCategories) {
                    if (!category.isTombstone) {
                        let categoryName = category.name;
                        // Hidden categories have the parent category entity id
                        // appended to the end of the sub category name.
                        // The format is 'MasterCategory ` SubCategory ` entityId'.
                        // Remove the id to shorten the name.
                        if (masterCategory.name === 'Hidden Categories') {
                            const categoryNameParts = categoryName.split(' ` ');
                            // Remove the last part, which is the entityId.
                            categoryNameParts.pop();
                            // Join the remaining parts with a slash between them.
                            categoryName = categoryNameParts.join('/').trim();
                        }
                        const id = await actual.createCategory({
                            name: categoryName,
                            group_id: entityIdMap.get(category.masterCategoryId),
                        });
                        entityIdMap.set(category.entityId, id);
                        if (category.note) {
                            (0, injected_1.send)('notes-save', { id, note: category.note });
                        }
                    }
                }
            }
        }
    }));
}
async function importPayees(data, entityIdMap) {
    for (const payee of data.payees) {
        if (!payee.isTombstone) {
            const id = await actual.createPayee({
                name: payee.name,
                category: entityIdMap.get(payee.autoFillCategoryId) || null,
                transfer_acct: entityIdMap.get(payee.targetAccountId) || null,
            });
            // TODO: import payee rules
            entityIdMap.set(payee.entityId, id);
        }
    }
}
async function importTransactions(data, entityIdMap) {
    const categories = await actual.getCategories();
    const incomeCategoryId = categories.find(cat => cat.name === 'Income').id;
    const accounts = await actual.getAccounts();
    const payees = await actual.getPayees();
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
        const acct = accounts.find(acct => acct.id === acctId);
        if (!acct) {
            throw new Error('Could not find account for transaction when importing');
        }
        return acct.offbudget;
    }
    // Go ahead and generate ids for all of the transactions so we can
    // reliably resolve transfers
    for (const transaction of data.transactions) {
        entityIdMap.set(transaction.entityId, (0, uuid_1.v4)());
        if (transaction.subTransactions) {
            for (const subTransaction of transaction.subTransactions) {
                entityIdMap.set(subTransaction.entityId, (0, uuid_1.v4)());
            }
        }
    }
    const transactionsGrouped = (0, util_1.groupBy)(data.transactions, 'accountId');
    await Promise.all([...transactionsGrouped.keys()].map(async (accountId) => {
        const transactions = transactionsGrouped.get(accountId);
        const toImport = transactions
            .map(transaction => {
            if (transaction.isTombstone) {
                return null;
            }
            const id = entityIdMap.get(transaction.entityId);
            function transferProperties(t) {
                const transferId = entityIdMap.get(t.transferTransactionId) || null;
                let payee = null;
                let imported_payee = null;
                if (transferId) {
                    payee = payees.find(p => p.transfer_acct === entityIdMap.get(t.targetAccountId)).id;
                }
                else {
                    payee = entityIdMap.get(t.payeeId);
                    imported_payee = data.payees.find(p => p.entityId === t.payeeId)?.name;
                }
                return {
                    transfer_id: transferId,
                    payee,
                    imported_payee,
                };
            }
            const newTransaction = {
                id,
                amount: (0, util_1.amountToInteger)(transaction.amount),
                category: isOffBudget(entityIdMap.get(accountId))
                    ? null
                    : getCategory(transaction.categoryId),
                date: transaction.date,
                notes: transaction.memo || null,
                cleared: transaction.cleared === 'Cleared' ||
                    transaction.cleared === 'Reconciled',
                reconciled: transaction.cleared === 'Reconciled',
                ...transferProperties(transaction),
                subtransactions: transaction.subTransactions &&
                    transaction.subTransactions
                        .filter(st => !st.isTombstone)
                        .map(t => {
                        return {
                            id: entityIdMap.get(t.entityId),
                            amount: (0, util_1.amountToInteger)(t.amount),
                            category: getCategory(t.categoryId),
                            notes: t.memo || null,
                            ...transferProperties(t),
                        };
                    }),
            };
            return newTransaction;
        })
            .filter(x => x);
        await actual.addTransactions(entityIdMap.get(accountId), toImport, {
            learnCategories: true,
        });
    }));
}
function fillInBudgets(data, categoryBudgets) {
    // YNAB only contains entries for categories that have been actually
    // budgeted. That would be fine except that we need to set the
    // "carryover" flag on each month when carrying debt across months.
    // To make sure our system has a chance to set this flag on each
    // category, make sure a budget exists for every category of every
    // month.
    const budgets = [...categoryBudgets];
    data.masterCategories.forEach(masterCategory => {
        if (masterCategory.subCategories) {
            masterCategory.subCategories.forEach(category => {
                if (!budgets.find(b => b.categoryId === category.entityId)) {
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
async function importBudgets(data, entityIdMap) {
    const budgets = (0, util_1.sortByKey)(data.monthlyBudgets, 'month');
    await actual.batchBudgetUpdates(async () => {
        for (const budget of budgets) {
            const filled = fillInBudgets(data, budget.monthlySubCategoryBudgets.filter(b => !b.isTombstone));
            await Promise.all(filled.map(async (catBudget) => {
                const amount = (0, util_1.amountToInteger)(catBudget.budgeted);
                const catId = entityIdMap.get(catBudget.categoryId);
                const month = monthUtils.monthFromDate(budget.month);
                if (!catId) {
                    return;
                }
                await actual.setBudgetAmount(month, catId, amount);
                if (catBudget.overspendingHandling === 'AffectsBuffer') {
                    await actual.setBudgetCarryover(month, catId, false);
                }
                else if (catBudget.overspendingHandling === 'Confined') {
                    await actual.setBudgetCarryover(month, catId, true);
                }
            }));
        }
    });
}
function estimateRecentness(str) {
    // The "recentness" is the total amount of changes that this device
    // is aware of, which is estimated by summing up all of the version
    // numbers that its aware of. This works because version numbers are
    // increasing integers.
    return str.split(',').reduce((total, version) => {
        const [_, number] = version.split('-');
        return total + parseInt(number);
    }, 0);
}
function findLatestDevice(zipped, entries) {
    let devices = entries
        .map(entry => {
        const contents = zipped.readFile(entry).toString('utf8');
        let data;
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
        .filter(x => x);
    devices = (0, util_1.sortByKey)(devices, 'recentness');
    return devices[devices.length - 1].deviceGUID;
}
async function doImport(data) {
    const entityIdMap = new Map();
    log_1.logger.log('Importing Accounts...');
    await importAccounts(data, entityIdMap);
    log_1.logger.log('Importing Categories...');
    await importCategories(data, entityIdMap);
    log_1.logger.log('Importing Payees...');
    await importPayees(data, entityIdMap);
    log_1.logger.log('Importing Transactions...');
    await importTransactions(data, entityIdMap);
    log_1.logger.log('Importing Budgets...');
    await importBudgets(data, entityIdMap);
    log_1.logger.log('Setting up...');
}
function getBudgetName(filepath) {
    let unixFilepath = (0, slash_1.default)(filepath);
    if (!/\.zip/.test(unixFilepath)) {
        return null;
    }
    unixFilepath = unixFilepath.replace(/\.zip$/, '').replace(/.ynab4$/, '');
    // Most budgets are named like "Budget~51938D82.ynab4" but sometimes
    // they are only "Budget.ynab4". We only want to grab the name
    // before the ~ if it exists.
    const m = unixFilepath.match(/([^/~]+)[^/]*$/);
    if (!m) {
        return null;
    }
    return m[1];
}
function getFile(entries, path) {
    const files = entries.filter(e => e.entryName === path);
    if (files.length === 0) {
        throw new Error('Could not find file: ' + path);
    }
    if (files.length >= 2) {
        throw new Error('File name matches multiple files: ' + path);
    }
    return files[0];
}
function join(...paths) {
    return paths.slice(1).reduce((full, path) => {
        return full + '/' + path.replace(/^\//, '');
    }, paths[0].replace(/\/$/, ''));
}
function parseFile(buffer) {
    const zipped = new adm_zip_1.default(buffer);
    const entries = zipped.getEntries();
    let root = '';
    const dirMatch = entries[0].entryName.match(/([^/]*\.ynab4)/);
    if (dirMatch) {
        root = dirMatch[1] + '/';
    }
    const metaStr = zipped.readFile(getFile(entries, root + 'Budget.ymeta'));
    const meta = JSON.parse(metaStr.toString('utf8'));
    const budgetPath = join(root, meta.relativeDataFolderName);
    const deviceFiles = entries.filter(e => e.entryName.startsWith(join(budgetPath, 'devices')));
    const deviceGUID = findLatestDevice(zipped, deviceFiles);
    const yfullPath = join(budgetPath, deviceGUID, 'Budget.yfull');
    let contents;
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
