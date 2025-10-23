"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const query_1 = require("../../shared/query");
const app_1 = require("../app");
const aql_1 = require("../aql");
const mutators_1 = require("../mutators");
const undo_1 = require("../undo");
const export_to_csv_1 = require("./export/export-to-csv");
const parse_file_1 = require("./import/parse-file");
const merge_1 = require("./merge");
const _1 = require(".");
async function handleBatchUpdateTransactions({ added, deleted, updated, learnCategories, runTransfers = true, }) {
    const result = await (0, _1.batchUpdateTransactions)({
        added,
        updated,
        deleted,
        learnCategories,
        runTransfers,
    });
    return result;
}
async function addTransaction(transaction) {
    await handleBatchUpdateTransactions({ added: [transaction] });
    return {};
}
async function updateTransaction(transaction) {
    await handleBatchUpdateTransactions({ updated: [transaction] });
    return {};
}
async function deleteTransaction(transaction) {
    await handleBatchUpdateTransactions({ deleted: [transaction] });
    return {};
}
async function parseTransactionsFile({ filepath, options, }) {
    return (0, parse_file_1.parseFile)(filepath, options);
}
async function exportTransactions({ transactions, accounts, categoryGroups, payees, }) {
    return (0, export_to_csv_1.exportToCSV)(transactions, accounts, categoryGroups, payees);
}
async function exportTransactionsQuery({ query: queryState, }) {
    return (0, export_to_csv_1.exportQueryToCSV)(new query_1.Query(queryState));
}
async function getEarliestTransaction() {
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
        .options({ splits: 'none' })
        .orderBy({ date: 'asc' })
        .select('*')
        .limit(1));
    return data[0] || null;
}
async function getLatestTransaction() {
    const { data } = await (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
        .options({ splits: 'none' })
        .orderBy({ date: 'desc' })
        .select('*')
        .limit(1));
    return data[0] || null;
}
exports.app = (0, app_1.createApp)();
exports.app.method('transactions-batch-update', (0, mutators_1.mutator)((0, undo_1.undoable)(handleBatchUpdateTransactions)));
exports.app.method('transactions-merge', (0, mutators_1.mutator)((0, undo_1.undoable)(merge_1.mergeTransactions)));
exports.app.method('transaction-add', (0, mutators_1.mutator)(addTransaction));
exports.app.method('transaction-update', (0, mutators_1.mutator)(updateTransaction));
exports.app.method('transaction-delete', (0, mutators_1.mutator)(deleteTransaction));
exports.app.method('transactions-parse-file', (0, mutators_1.mutator)(parseTransactionsFile));
exports.app.method('transactions-export', (0, mutators_1.mutator)(exportTransactions));
exports.app.method('transactions-export-query', (0, mutators_1.mutator)(exportTransactionsQuery));
exports.app.method('get-earliest-transaction', getEarliestTransaction);
exports.app.method('get-latest-transaction', getLatestTransaction);
//# sourceMappingURL=app.js.map