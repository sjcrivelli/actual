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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDateRepr = exports.toDateRepr = void 0;
exports.getDatabasePath = getDatabasePath;
exports.openDatabase = openDatabase;
exports.closeDatabase = closeDatabase;
exports.setDatabase = setDatabase;
exports.getDatabase = getDatabase;
exports.loadClock = loadClock;
exports.runQuery = runQuery;
exports.execQuery = execQuery;
exports.cache = cache;
exports.transaction = transaction;
exports.asyncTransaction = asyncTransaction;
exports.all = all;
exports.first = first;
exports.firstSync = firstSync;
exports.run = run;
exports.select = select;
exports.update = update;
exports.insertWithUUID = insertWithUUID;
exports.insert = insert;
exports.delete_ = delete_;
exports.deleteAll = deleteAll;
exports.selectWithSchema = selectWithSchema;
exports.selectFirstWithSchema = selectFirstWithSchema;
exports.insertWithSchema = insertWithSchema;
exports.updateWithSchema = updateWithSchema;
exports.getCategories = getCategories;
exports.getCategoriesGrouped = getCategoriesGrouped;
exports.insertCategoryGroup = insertCategoryGroup;
exports.updateCategoryGroup = updateCategoryGroup;
exports.moveCategoryGroup = moveCategoryGroup;
exports.deleteCategoryGroup = deleteCategoryGroup;
exports.insertCategory = insertCategory;
exports.updateCategory = updateCategory;
exports.moveCategory = moveCategory;
exports.deleteCategory = deleteCategory;
exports.getPayee = getPayee;
exports.getAccount = getAccount;
exports.insertPayee = insertPayee;
exports.deletePayee = deletePayee;
exports.deleteTransferPayee = deleteTransferPayee;
exports.updatePayee = updatePayee;
exports.mergePayees = mergePayees;
exports.getPayees = getPayees;
exports.getCommonPayees = getCommonPayees;
exports.syncGetOrphanedPayees = syncGetOrphanedPayees;
exports.getOrphanedPayees = getOrphanedPayees;
exports.getPayeeByName = getPayeeByName;
exports.getAccounts = getAccounts;
exports.insertAccount = insertAccount;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
exports.moveAccount = moveAccount;
exports.getTransaction = getTransaction;
exports.getTransactions = getTransactions;
exports.insertTransaction = insertTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
exports.getTags = getTags;
exports.getAllTags = getAllTags;
exports.insertTag = insertTag;
exports.deleteTag = deleteTag;
exports.updateTag = updateTag;
exports.findTags = findTags;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const lru_cache_1 = require("lru-cache");
const uuid_1 = require("uuid");
const fs = __importStar(require("../../platform/server/fs"));
const sqlite = __importStar(require("../../platform/server/sqlite"));
const monthUtils = __importStar(require("../../shared/months"));
const util_1 = require("../../shared/util");
const aql_1 = require("../aql");
const models_1 = require("../models");
const sync_1 = require("../sync");
const sort_1 = require("./sort");
__exportStar(require("./types"), exports);
var models_2 = require("../models");
Object.defineProperty(exports, "toDateRepr", { enumerable: true, get: function () { return models_2.toDateRepr; } });
Object.defineProperty(exports, "fromDateRepr", { enumerable: true, get: function () { return models_2.fromDateRepr; } });
let dbPath = null;
let db = null;
// Util
function getDatabasePath() {
    return dbPath;
}
async function openDatabase(id) {
    if (db) {
        await sqlite.closeDatabase(db);
    }
    dbPath = fs.join(fs.getBudgetDir(id), 'db.sqlite');
    setDatabase(await sqlite.openDatabase(dbPath));
    // await execQuery('PRAGMA journal_mode = WAL');
}
async function closeDatabase() {
    if (db) {
        await sqlite.closeDatabase(db);
        setDatabase(null);
    }
}
function setDatabase(db_) {
    db = db_;
    resetQueryCache();
}
function getDatabase() {
    return db;
}
async function loadClock() {
    const row = await first('SELECT * FROM messages_clock');
    if (row) {
        const clock = (0, crdt_1.deserializeClock)(row.clock);
        (0, crdt_1.setClock)(clock);
    }
    else {
        // No clock exists yet (first run of the app), so create a default
        // one.
        const timestamp = new crdt_1.Timestamp(0, 0, (0, crdt_1.makeClientId)());
        const clock = (0, crdt_1.makeClock)(timestamp);
        (0, crdt_1.setClock)(clock);
        await runQuery('INSERT INTO messages_clock (id, clock) VALUES (?, ?)', [
            1,
            (0, crdt_1.serializeClock)(clock),
        ]);
    }
}
function runQuery(sql, params, fetchAll) {
    if (fetchAll) {
        return sqlite.runQuery(db, sql, params, true);
    }
    else {
        return sqlite.runQuery(db, sql, params, false);
    }
}
function execQuery(sql) {
    sqlite.execQuery(db, sql);
}
// This manages an LRU cache of prepared query statements. This is
// only needed in hot spots when you are running lots of queries.
let _queryCache = new lru_cache_1.LRUCache({ max: 100 });
function cache(sql) {
    const cached = _queryCache.get(sql);
    if (cached) {
        return cached;
    }
    const prepared = sqlite.prepare(db, sql);
    _queryCache.set(sql, prepared);
    return prepared;
}
function resetQueryCache() {
    _queryCache = new lru_cache_1.LRUCache({ max: 100 });
}
function transaction(fn) {
    return sqlite.transaction(db, fn);
}
function asyncTransaction(fn) {
    return sqlite.asyncTransaction(db, fn);
}
// This function is marked as async because `runQuery` is no longer
// async. We return a promise here until we've audited all the code to
// make sure nothing calls `.then` on this.
async function all(sql, params) {
    return runQuery(sql, params, true);
}
async function first(sql, params) {
    const arr = await runQuery(sql, params, true);
    return arr.length === 0 ? null : arr[0];
}
// The underlying sql system is now sync, but we can't update `first` yet
// without auditing all uses of it
function firstSync(sql, params) {
    const arr = runQuery(sql, params, true);
    return arr.length === 0 ? null : arr[0];
}
// This function is marked as async because `runQuery` is no longer
// async. We return a promise here until we've audited all the code to
// make sure nothing calls `.then` on this.
async function run(sql, params) {
    return runQuery(sql, params);
}
async function select(table, id) {
    const rows = await runQuery('SELECT * FROM ' + table + ' WHERE id = ?', [id], true);
    // TODO: In the next phase, we will make this function generic
    // and pass the type of the return type to `runQuery`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows[0];
}
async function update(table, params) {
    const fields = Object.keys(params).filter(k => k !== 'id');
    if (params.id == null) {
        throw new Error('update: id is required');
    }
    await (0, sync_1.sendMessages)(fields.map(k => {
        return {
            dataset: table,
            row: params.id,
            column: k,
            value: params[k],
            timestamp: crdt_1.Timestamp.send(),
        };
    }));
}
async function insertWithUUID(table, row) {
    if (!row.id) {
        row = { ...row, id: (0, uuid_1.v4)() };
    }
    await insert(table, row);
    // We can't rely on the return value of insert because if the
    // primary key is text, sqlite returns the internal row id which we
    // don't care about. We want to return the generated UUID.
    return row.id;
}
async function insert(table, row) {
    const fields = Object.keys(row).filter(k => k !== 'id');
    if (row.id == null) {
        throw new Error('insert: id is required');
    }
    await (0, sync_1.sendMessages)(fields.map(k => {
        return {
            dataset: table,
            row: row.id,
            column: k,
            value: row[k],
            timestamp: crdt_1.Timestamp.send(),
        };
    }));
}
async function delete_(table, id) {
    await (0, sync_1.sendMessages)([
        {
            dataset: table,
            row: id,
            column: 'tombstone',
            value: 1,
            timestamp: crdt_1.Timestamp.send(),
        },
    ]);
}
async function deleteAll(table) {
    const rows = await all(`
    SELECT id FROM ${table} WHERE tombstone = 0
  `);
    await Promise.all(rows.map(({ id }) => delete_(table, id)));
}
async function selectWithSchema(table, sql, params) {
    const rows = await runQuery(sql, params, true);
    const convertedRows = rows
        .map(row => (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, table, row))
        .filter(Boolean);
    // TODO: Make convertFromSelect generic so we don't need this cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return convertedRows;
}
async function selectFirstWithSchema(table, sql, params) {
    const rows = await selectWithSchema(table, sql, params);
    return rows.length > 0 ? rows[0] : null;
}
function insertWithSchema(table, row) {
    // Even though `insertWithUUID` does this, we need to do it here so
    // the schema validation passes
    if (!row.id) {
        row = { ...row, id: (0, uuid_1.v4)() };
    }
    return insertWithUUID(table, (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, table, row));
}
function updateWithSchema(table, fields) {
    return update(table, (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, table, fields));
}
// Data-specific functions. Ideally this would be split up into
// different files
async function getCategories(ids) {
    const whereIn = ids ? `c.id IN (${toSqlQueryParameters(ids)}) AND` : '';
    const query = `SELECT c.* FROM categories c WHERE ${whereIn} c.tombstone = 0 ORDER BY c.sort_order, c.id`;
    return ids
        ? await all(query, [...ids])
        : await all(query);
}
async function getCategoriesGrouped(ids) {
    const categoryGroupWhereIn = ids
        ? `cg.id IN (${toSqlQueryParameters(ids)}) AND`
        : '';
    const categoryGroupQuery = `SELECT cg.* FROM category_groups cg WHERE ${categoryGroupWhereIn} cg.tombstone = 0
    ORDER BY cg.is_income, cg.sort_order, cg.id`;
    const categoryWhereIn = ids
        ? `c.cat_group IN (${toSqlQueryParameters(ids)}) AND`
        : '';
    const categoryQuery = `SELECT c.* FROM categories c WHERE ${categoryWhereIn} c.tombstone = 0
    ORDER BY c.sort_order, c.id`;
    const groups = ids
        ? await all(categoryGroupQuery, [...ids])
        : await all(categoryGroupQuery);
    const categories = ids
        ? await all(categoryQuery, [...ids])
        : await all(categoryQuery);
    return groups.map(group => ({
        ...group,
        categories: categories.filter(c => c.cat_group === group.id),
    }));
}
async function insertCategoryGroup(group) {
    // Don't allow duplicate group
    const existingGroup = await first(`SELECT id, name, hidden FROM category_groups WHERE UPPER(name) = ? and tombstone = 0 LIMIT 1`, [group.name.toUpperCase()]);
    if (existingGroup) {
        throw new Error(`A ${existingGroup.hidden ? 'hidden ' : ''}’${existingGroup.name}’ category group already exists.`);
    }
    const lastGroup = await first(`
    SELECT sort_order FROM category_groups WHERE tombstone = 0 ORDER BY sort_order DESC, id DESC LIMIT 1
  `);
    const sort_order = (lastGroup ? lastGroup.sort_order : 0) + sort_1.SORT_INCREMENT;
    group = {
        ...models_1.categoryGroupModel.validate(group),
        sort_order,
    };
    const id = await insertWithUUID('category_groups', group);
    return id;
}
function updateCategoryGroup(group) {
    group = models_1.categoryGroupModel.validate(group, { update: true });
    return update('category_groups', group);
}
async function moveCategoryGroup(id, targetId) {
    const groups = await all(`SELECT id, sort_order FROM category_groups WHERE tombstone = 0 ORDER BY sort_order, id`);
    const { updates, sort_order } = (0, sort_1.shoveSortOrders)(groups, targetId);
    for (const info of updates) {
        await update('category_groups', info);
    }
    await update('category_groups', { id, sort_order });
}
async function deleteCategoryGroup(group, transferId) {
    const categories = await all('SELECT * FROM categories WHERE cat_group = ?', [group.id]);
    // Delete all the categories within a group
    await Promise.all(categories.map(cat => deleteCategory(cat, transferId)));
    await delete_('category_groups', group.id);
}
async function insertCategory(category, { atEnd } = { atEnd: undefined }) {
    let sort_order;
    let id_;
    await (0, sync_1.batchMessages)(async () => {
        // Dont allow duplicated names in groups
        const existingCatInGroup = await first(`SELECT id FROM categories WHERE cat_group = ? and UPPER(name) = ? and tombstone = 0 LIMIT 1`, [category.cat_group, category.name.toUpperCase()]);
        if (existingCatInGroup) {
            throw new Error(`Category ‘${category.name}’ already exists in group ‘${category.cat_group}’`);
        }
        if (atEnd) {
            const lastCat = await first(`
        SELECT sort_order FROM categories WHERE tombstone = 0 ORDER BY sort_order DESC, id DESC LIMIT 1
      `);
            sort_order = (lastCat ? lastCat.sort_order : 0) + sort_1.SORT_INCREMENT;
        }
        else {
            // Unfortunately since we insert at the beginning, we need to shove
            // the sort orders to make sure there's room for it
            const categories = await all(`SELECT id, sort_order FROM categories WHERE cat_group = ? AND tombstone = 0 ORDER BY sort_order, id`, [category.cat_group]);
            const { updates, sort_order: order } = (0, sort_1.shoveSortOrders)(categories, categories.length > 0 ? categories[0].id : null);
            for (const info of updates) {
                await update('categories', info);
            }
            sort_order = order;
        }
        category = {
            ...models_1.categoryModel.validate(category),
            sort_order,
        };
        const id = await insertWithUUID('categories', category);
        // Create an entry in the mapping table that points it to itself
        await insert('category_mapping', { id, transferId: id });
        id_ = id;
    });
    return id_;
}
function updateCategory(category) {
    category = models_1.categoryModel.validate(category, { update: true });
    // Change from cat_group to group because category AQL schema named it group.
    // const { cat_group: group, ...rest } = category;
    return update('categories', category);
}
async function moveCategory(id, groupId, targetId) {
    if (!groupId) {
        throw new Error('moveCategory: groupId is required');
    }
    const categories = await all(`SELECT id, sort_order FROM categories WHERE cat_group = ? AND tombstone = 0 ORDER BY sort_order, id`, [groupId]);
    const { updates, sort_order } = (0, sort_1.shoveSortOrders)(categories, targetId);
    for (const info of updates) {
        await update('categories', info);
    }
    await update('categories', { id, sort_order, cat_group: groupId });
}
async function deleteCategory(category, transferId) {
    if (transferId) {
        // We need to update all the deleted categories that currently
        // point to the one we're about to delete so they all are
        // "forwarded" to the new transferred category.
        const existingTransfers = await all('SELECT * FROM category_mapping WHERE transferId = ?', [category.id]);
        for (const mapping of existingTransfers) {
            await update('category_mapping', {
                id: mapping.id,
                transferId,
            });
        }
        // Finally, map the category we're about to delete to the new one
        await update('category_mapping', { id: category.id, transferId });
    }
    return delete_('categories', category.id);
}
async function getPayee(id) {
    return first(`SELECT * FROM payees WHERE id = ?`, [id]);
}
async function getAccount(id) {
    return first(`SELECT * FROM accounts WHERE id = ?`, [id]);
}
async function insertPayee(payee) {
    payee = models_1.payeeModel.validate(payee);
    let id;
    await (0, sync_1.batchMessages)(async () => {
        id = await insertWithUUID('payees', payee);
        await insert('payee_mapping', { id, targetId: id });
    });
    return id;
}
async function deletePayee(payee) {
    const { transfer_acct } = await first('SELECT * FROM payees WHERE id = ?', [payee.id]);
    if (transfer_acct) {
        // You should never be able to delete transfer payees
        return;
    }
    // let mappings = await all('SELECT id FROM payee_mapping WHERE targetId = ?', [
    //   payee.id
    // ]);
    // await Promise.all(
    //   mappings.map(m => update('payee_mapping', { id: m.id, targetId: null }))
    // );
    return delete_('payees', payee.id);
}
async function deleteTransferPayee(payee) {
    // This allows deleting transfer payees
    return delete_('payees', payee.id);
}
function updatePayee(payee) {
    payee = models_1.payeeModel.validate(payee, { update: true });
    return update('payees', payee);
}
async function mergePayees(target, ids) {
    // Load in payees so we can check some stuff
    const dbPayees = await all('SELECT * FROM payees');
    const payees = (0, util_1.groupById)(dbPayees);
    // Filter out any transfer payees
    if (payees[target].transfer_acct != null) {
        return;
    }
    ids = ids.filter(id => payees[id].transfer_acct == null);
    await (0, sync_1.batchMessages)(async () => {
        await Promise.all(ids.map(async (id) => {
            const mappings = await all('SELECT id FROM payee_mapping WHERE targetId = ?', [id]);
            await Promise.all(mappings.map(m => update('payee_mapping', { id: m.id, targetId: target })));
        }));
        await Promise.all(ids.map(id => Promise.all([
            update('payee_mapping', { id, targetId: target }),
            delete_('payees', id),
        ])));
    });
}
function getPayees() {
    return all(`
    SELECT p.*, COALESCE(a.name, p.name) AS name FROM payees p
    LEFT JOIN accounts a ON (p.transfer_acct = a.id AND a.tombstone = 0)
    WHERE p.tombstone = 0 AND (p.transfer_acct IS NULL OR a.id IS NOT NULL)
    ORDER BY p.transfer_acct IS NULL DESC, p.name COLLATE NOCASE, a.offbudget, a.sort_order
  `);
}
function getCommonPayees() {
    const twelveWeeksAgo = (0, models_1.toDateRepr)(monthUtils.subWeeks(monthUtils.currentDate(), 12));
    const limit = 10;
    return all(`
    SELECT     p.id as id, p.name as name, p.favorite as favorite,
      p.category as category, TRUE as common, NULL as transfer_acct,
    count(*) as c,
    max(t.date) as latest
    FROM payees p
    LEFT JOIN v_transactions_internal_alive t on t.payee == p.id
    WHERE LENGTH(p.name) > 0
    AND p.tombstone = 0
    AND t.date > ${twelveWeeksAgo}
    GROUP BY p.id
    ORDER BY c DESC ,p.transfer_acct IS NULL DESC, p.name
    COLLATE NOCASE
    LIMIT ${limit}
  `);
}
/* eslint-disable actual/typography */
const orphanedPayeesQuery = `
  SELECT p.id
  FROM payees p
    LEFT JOIN payee_mapping pm ON pm.id = p.id
    LEFT JOIN v_transactions_internal_alive t ON t.payee = pm.targetId
  WHERE p.tombstone = 0
    AND p.transfer_acct IS NULL
    AND t.id IS NULL
    AND NOT EXISTS (
      SELECT 1
      FROM rules r,
      json_each(r.conditions) as cond
      WHERE r.tombstone = 0
        AND json_extract(cond.value, '$.field') = 'description'
        AND json_extract(cond.value, '$.value') = pm.targetId
    );
`;
/* eslint-enable actual/typography */
function syncGetOrphanedPayees() {
    return all(orphanedPayeesQuery);
}
async function getOrphanedPayees() {
    const rows = await all(orphanedPayeesQuery);
    return rows.map(row => row.id);
}
async function getPayeeByName(name) {
    return first(`SELECT * FROM payees WHERE UNICODE_LOWER(name) = ? AND tombstone = 0`, [name.toLowerCase()]);
}
function getAccounts() {
    return all(`SELECT a.*, b.name as bankName, b.id as bankId FROM accounts a
       LEFT JOIN banks b ON a.bank = b.id
       WHERE a.tombstone = 0
       ORDER BY sort_order, name`);
}
async function insertAccount(account) {
    const accounts = await all('SELECT * FROM accounts WHERE offbudget = ? ORDER BY sort_order, name', [account.offbudget ? 1 : 0]);
    // Don't pass a target in, it will default to appending at the end
    const { sort_order } = (0, sort_1.shoveSortOrders)(accounts);
    account = models_1.accountModel.validate({ ...account, sort_order });
    return insertWithUUID('accounts', account);
}
function updateAccount(account) {
    account = models_1.accountModel.validate(account, { update: true });
    return update('accounts', account);
}
function deleteAccount(account) {
    return delete_('accounts', account.id);
}
async function moveAccount(id, targetId) {
    const account = await first('SELECT * FROM accounts WHERE id = ?', [id]);
    let accounts;
    if (account.closed) {
        accounts = await all(`SELECT id, sort_order FROM accounts WHERE closed = 1 ORDER BY sort_order, name`);
    }
    else {
        accounts = await all(`SELECT id, sort_order FROM accounts WHERE tombstone = 0 AND offbudget = ? ORDER BY sort_order, name`, [account.offbudget ? 1 : 0]);
    }
    const { updates, sort_order } = (0, sort_1.shoveSortOrders)(accounts, targetId);
    await (0, sync_1.batchMessages)(async () => {
        for (const info of updates) {
            update('accounts', info);
        }
        update('accounts', { id, sort_order });
    });
}
async function getTransaction(id) {
    const rows = await selectWithSchema('transactions', 'SELECT * FROM v_transactions WHERE id = ?', [id]);
    return rows[0];
}
async function getTransactions(accountId) {
    if (arguments.length > 1) {
        throw new Error('`getTransactions` was given a second argument, it now only takes a single argument `accountId`');
    }
    return selectWithSchema('transactions', 'SELECT * FROM v_transactions WHERE account = ?', [accountId]);
}
function insertTransaction(transaction) {
    return insertWithSchema('transactions', transaction);
}
function updateTransaction(transaction) {
    return updateWithSchema('transactions', transaction);
}
async function deleteTransaction(transaction) {
    return delete_('transactions', transaction.id);
}
function toSqlQueryParameters(params) {
    return params.map(() => '?').join(',');
}
function getTags() {
    return all(`
    SELECT id, tag, color, description
    FROM tags
    WHERE tombstone = 0
    ORDER BY tag
  `);
}
function getAllTags() {
    return all(`
    SELECT id, tag, color, description
    FROM tags
    ORDER BY tag
  `);
}
function insertTag(tag) {
    return insertWithUUID('tags', tag);
}
async function deleteTag(tag) {
    return delete_('tags', tag.id);
}
function updateTag(tag) {
    return update('tags', tag);
}
function findTags() {
    return all(`
    SELECT notes
    FROM transactions
    WHERE tombstone = 0 AND notes LIKE ?
  `, ['%#%']);
}
//# sourceMappingURL=index.js.map