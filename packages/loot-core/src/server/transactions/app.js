import { q, Query } from '../../shared/query';
import { createApp } from '../app';
import { aqlQuery } from '../aql';
import { mutator } from '../mutators';
import { undoable } from '../undo';
import { exportQueryToCSV, exportToCSV } from './export/export-to-csv';
import { parseFile } from './import/parse-file';
import { mergeTransactions } from './merge';
import { batchUpdateTransactions } from '.';
async function handleBatchUpdateTransactions({ added, deleted, updated, learnCategories, runTransfers = true, }) {
    const result = await batchUpdateTransactions({
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
    return parseFile(filepath, options);
}
async function exportTransactions({ transactions, accounts, categoryGroups, payees, }) {
    return exportToCSV(transactions, accounts, categoryGroups, payees);
}
async function exportTransactionsQuery({ query: queryState, }) {
    return exportQueryToCSV(new Query(queryState));
}
async function getEarliestTransaction() {
    const { data } = await aqlQuery(q('transactions')
        .options({ splits: 'none' })
        .orderBy({ date: 'asc' })
        .select('*')
        .limit(1));
    return data[0] || null;
}
async function getLatestTransaction() {
    const { data } = await aqlQuery(q('transactions')
        .options({ splits: 'none' })
        .orderBy({ date: 'desc' })
        .select('*')
        .limit(1));
    return data[0] || null;
}
export const app = createApp();
app.method('transactions-batch-update', mutator(undoable(handleBatchUpdateTransactions)));
app.method('transactions-merge', mutator(undoable(mergeTransactions)));
app.method('transaction-add', mutator(addTransaction));
app.method('transaction-update', mutator(updateTransaction));
app.method('transaction-delete', mutator(deleteTransaction));
app.method('transactions-parse-file', mutator(parseTransactionsFile));
app.method('transactions-export', mutator(exportTransactions));
app.method('transactions-export-query', mutator(exportTransactionsQuery));
app.method('get-earliest-transaction', getEarliestTransaction);
app.method('get-latest-transaction', getLatestTransaction);
