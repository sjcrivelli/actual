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
// @ts-strict-ignore
const query_1 = require("../../shared/query");
const app_1 = require("../app");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const mutators_1 = require("../mutators");
const transactions_1 = require("../transactions");
exports.app = (0, app_1.createApp)();
exports.app.method('tools/fix-split-transactions', fixSplitTransactions);
async function fixSplitTransactions() {
    // 1. Check for child transactions that have a blank payee, and set
    //    the payee to whatever the parent has
    const blankPayeeRows = await db.all(`
    SELECT t.*, p.payee AS parentPayee FROM v_transactions_internal t
    LEFT JOIN v_transactions_internal p ON t.parent_id = p.id
    WHERE t.is_child = 1 AND t.payee IS NULL AND p.payee IS NOT NULL
  `);
    await (0, mutators_1.runMutator)(async () => {
        const updated = blankPayeeRows.map(row => ({
            id: row.id,
            payee: row.parentPayee,
        }));
        await (0, transactions_1.batchUpdateTransactions)({ updated });
    });
    // 2. Make sure the "cleared" flag is synced up with the parent
    // transactions
    const clearedRows = await db.all(`
    SELECT t.id, p.cleared FROM v_transactions_internal t
    LEFT JOIN v_transactions_internal p ON t.parent_id = p.id
    WHERE t.is_child = 1 AND t.cleared != p.cleared
  `);
    await (0, mutators_1.runMutator)(async () => {
        const updated = clearedRows.map(row => ({
            id: row.id,
            cleared: row.cleared === 1,
        }));
        await (0, transactions_1.batchUpdateTransactions)({ updated });
    });
    // 3. Mark the `tombstone` field as true on any child transactions
    //    that have a dead parent
    const deletedRows = await db.all(`
    SELECT t.* FROM v_transactions_internal t
    LEFT JOIN v_transactions_internal p ON t.parent_id = p.id
    WHERE t.is_child = 1 AND t.tombstone = 0 AND (p.tombstone = 1 OR p.id IS NULL)
  `);
    await (0, mutators_1.runMutator)(async () => {
        const updated = deletedRows.map(row => ({ id: row.id, tombstone: true }));
        await (0, transactions_1.batchUpdateTransactions)({ updated });
    });
    const splitTransactions = (await (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
        .options({ splits: 'grouped' })
        .filter({
        is_parent: true,
    })
        .select('*'))).data;
    const mismatchedSplits = splitTransactions.filter(t => {
        const subValue = t.subtransactions.reduce((acc, st) => acc + st.amount, 0);
        return subValue !== t.amount;
    });
    // 5. Fix transfers that should not have categories
    const brokenTransfers = await db.all(`
    SELECT t1.id
    FROM v_transactions_internal t1
           JOIN accounts a1 ON t1.account = a1.id
           JOIN v_transactions_internal t2 ON t1.transfer_id = t2.id
           JOIN accounts a2 ON t2.account = a2.id
    WHERE a1.offbudget = a2.offbudget
      AND t1.category IS NOT NULL
  `);
    await (0, mutators_1.runMutator)(async () => {
        const updated = brokenTransfers.map(row => ({
            id: row.id,
            category: null,
        }));
        await (0, transactions_1.batchUpdateTransactions)({ updated });
    });
    // 6. Remove transaction errors from non-parent transactions
    const errorRows = await db.all(`
    SELECT id FROM v_transactions_internal WHERE error IS NOT NULL AND is_parent = 0
  `);
    await (0, mutators_1.runMutator)(async () => {
        const updated = errorRows.map(({ id }) => ({ id, error: null }));
        await (0, transactions_1.batchUpdateTransactions)({ updated });
    });
    // 7. Clear categories of parent transactions
    const parentTransactionsWithCategory = await db.all(`
    SELECT id FROM transactions WHERE isParent = 1 AND category IS NOT NULL
  `);
    await (0, mutators_1.runMutator)(async () => {
        const updated = parentTransactionsWithCategory.map(({ id }) => ({
            id,
            category: null,
        }));
        await (0, transactions_1.batchUpdateTransactions)({ updated });
    });
    return {
        numBlankPayees: blankPayeeRows.length,
        numCleared: clearedRows.length,
        numDeleted: deletedRows.length,
        numTransfersFixed: brokenTransfers.length,
        numNonParentErrorsFixed: errorRows.length,
        numParentTransactionsWithCategoryFixed: parentTransactionsWithCategory.length,
        mismatchedSplits,
    };
}
//# sourceMappingURL=app.js.map