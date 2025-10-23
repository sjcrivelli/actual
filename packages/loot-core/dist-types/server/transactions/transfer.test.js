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
// @ts-strict-ignore
const util_1 = require("../../mocks/util");
const db = __importStar(require("../db"));
const transfer = __importStar(require("./transfer"));
beforeEach(global.emptyDatabase());
function getAllTransactions() {
    return db.all(`SELECT t.*, p.name as payee_name
       FROM v_transactions t
       LEFT JOIN payees p ON p.id = t.payee
       ORDER BY date DESC, amount DESC, id
     `);
}
async function prepareDatabase() {
    await db.insertCategoryGroup({ id: 'group1', name: 'group1', is_income: 0 });
    await db.insertCategory({
        id: '1',
        name: 'cat1',
        cat_group: 'group1',
        is_income: 0,
    });
    await db.insertAccount({ id: 'one', name: 'one' });
    await db.insertAccount({ id: 'two', name: 'two' });
    await db.insertAccount({ id: 'three', name: 'three', offbudget: 1 });
    await db.insertPayee({ name: '', transfer_acct: 'one' });
    await db.insertPayee({ name: '', transfer_acct: 'two' });
    await db.insertPayee({
        name: '',
        transfer_acct: 'three',
    });
}
describe('Transfer', () => {
    test('transfers are properly inserted/updated/deleted', async () => {
        await prepareDatabase();
        let transaction = {
            account: 'one',
            amount: 5000,
            payee: await db.insertPayee({ name: 'Non-transfer' }),
            date: '2017-01-01',
        };
        await db.insertTransaction(transaction);
        await transfer.onInsert(transaction);
        const differ = (0, util_1.expectSnapshotWithDiffer)(await getAllTransactions());
        const transferTwo = await db.first("SELECT * FROM payees WHERE transfer_acct = 'two'");
        const transferThree = await db.first("SELECT * FROM payees WHERE transfer_acct = 'three'");
        transaction = {
            account: 'one',
            amount: 5000,
            payee: transferTwo.id,
            date: '2017-01-01',
        };
        transaction.id = await db.insertTransaction(transaction);
        await transfer.onInsert(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
        // Fill the transaction out
        transaction = await db.getTransaction(transaction.id);
        expect(transaction.transfer_id).toBeDefined();
        transaction = {
            ...transaction,
            date: '2017-01-05',
            notes: 'This is a note',
        };
        await db.updateTransaction(transaction);
        await transfer.onUpdate(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
        transaction = {
            ...transaction,
            payee: transferThree.id,
        };
        await db.updateTransaction(transaction);
        await transfer.onUpdate(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
        transaction = {
            ...transaction,
            payee: await db.insertPayee({ name: 'Not transferred anymore' }),
        };
        await db.updateTransaction(transaction);
        await transfer.onUpdate(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
        // Make sure it's not a linked transaction anymore
        transaction = await db.getTransaction(transaction.id);
        expect(transaction.transfer_id).toBeNull();
        // Re-transfer it
        transaction = {
            ...transaction,
            payee: transferTwo.id,
        };
        await db.updateTransaction(transaction);
        await transfer.onUpdate(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
        transaction = await db.getTransaction(transaction.id);
        expect(transaction.transfer_id).toBeDefined();
        await db.deleteTransaction(transaction);
        await transfer.onDelete(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
    });
    test('transfers are properly de-categorized', async () => {
        await prepareDatabase();
        const transferTwo = await db.first("SELECT * FROM payees WHERE transfer_acct = 'two'");
        const transferThree = await db.first("SELECT * FROM payees WHERE transfer_acct = 'three'");
        let transaction = {
            account: 'one',
            amount: 5000,
            payee: await db.insertPayee({ name: 'Non-transfer' }),
            date: '2017-01-01',
            category: '1',
        };
        transaction.id = await db.insertTransaction(transaction);
        await transfer.onInsert(transaction);
        const differ = (0, util_1.expectSnapshotWithDiffer)(await getAllTransactions());
        transaction = {
            ...(await db.getTransaction(transaction.id)),
            payee: transferThree.id,
            notes: 'hi',
        };
        await db.updateTransaction(transaction);
        await transfer.onUpdate(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
        transaction = {
            ...(await db.getTransaction(transaction.id)),
            payee: transferTwo.id,
        };
        await db.updateTransaction(transaction);
        await transfer.onUpdate(transaction);
        differ.expectToMatchDiff(await getAllTransactions());
    });
    test('split transfers are retained on child transactions', async () => {
        // test: first add a txn having a transfer acct payee
        // then mark it as `is_parent` and add a child txn
        // the child txn should have a different transfer acct payee
        // and `is_child` set to true
        await prepareDatabase();
        const [transferOne, transferTwo] = await Promise.all([
            db.first("SELECT * FROM payees WHERE transfer_acct = 'one'"),
            db.first("SELECT * FROM payees WHERE transfer_acct = 'two'"),
        ]);
        let parent = {
            account: 'one',
            amount: 5000,
            payee: transferTwo.id,
            date: '2017-01-01',
        };
        parent.id = await db.insertTransaction(parent);
        await transfer.onInsert(parent);
        parent = await db.getTransaction(parent.id);
        const differ = (0, util_1.expectSnapshotWithDiffer)(await getAllTransactions());
        // mark the txn as parent
        await db.updateTransaction({ id: parent.id, is_parent: true });
        await transfer.onUpdate(parent);
        differ.expectToMatchDiff(await getAllTransactions());
        // add a child txn
        let child = {
            account: 'one',
            amount: 2000,
            payee: transferOne.id,
            date: '2017-01-01',
            is_child: true,
            parent_id: parent.id,
        };
        child.id = await db.insertTransaction(child);
        await transfer.onInsert(child);
        differ.expectToMatchDiff(await getAllTransactions());
        // ensure that the child txn has the correct transfer acct payee
        child = await db.getTransaction(child.id);
        expect(child.transfer_id).not.toBe(parent.transfer_id);
        expect(child.payee).toBe(transferOne.id);
    });
});
//# sourceMappingURL=transfer.test.js.map