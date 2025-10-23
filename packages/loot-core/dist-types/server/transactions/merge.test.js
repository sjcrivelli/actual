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
const db = __importStar(require("../db"));
const merge_1 = require("./merge");
describe('Merging fails for invalid quantity', () => {
    beforeEach(global.emptyDatabase());
    afterEach(global.emptyDatabase());
    const tests = [
        [[{}], 'one transaction'],
        [[], 'no transactions'],
        [undefined, 'undefined'],
        [[{}, {}, {}], 'three transactions'],
        [
            [{}, undefined],
            'two transactions but one is undefined',
        ],
    ];
    tests.forEach(([arr, message]) => it(message, () => expect(() => (0, merge_1.mergeTransactions)(arr)).rejects.toThrow()));
    it("fails when amounts don't match", async () => {
        await prepareDatabase();
        const t1 = await db.insertTransaction({
            account: 'one',
            date: '2025-01-01',
            amount: 10,
        });
        const t2 = await db.insertTransaction({
            account: 'one',
            date: '2025-01-01',
            amount: 12,
        });
        expect(() => (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).rejects.toThrow('Transaction amounts must match for merge');
    });
    it("fails when transaction id doesn't exist", async () => {
        await prepareDatabase();
        const t1 = await db.insertTransaction({
            account: 'one',
            date: '2025-01-01',
            amount: 10,
        });
        expect(() => (0, merge_1.mergeTransactions)([{ id: t1 }, { id: 'missing' }])).rejects.toThrow('One of the provided transactions does not exist');
    });
});
async function prepareDatabase() {
    await db.insertCategoryGroup({ id: 'group1', name: 'group1', is_income: 0 });
    await db.insertCategory({
        id: '1',
        name: 'cat1',
        cat_group: 'group1',
        is_income: 0,
    });
    await db.insertCategory({
        id: '2',
        name: 'cat2',
        cat_group: 'group1',
        is_income: 0,
    });
    await db.insertAccount({ id: 'one', name: 'one' });
    await db.insertAccount({ id: 'two', name: 'two' });
    await db.insertAccount({ id: 'three', name: 'three', offbudget: 1 });
    await db.insertPayee({ id: 'payee1', name: 'one' });
    await db.insertPayee({ id: 'payee2', name: 'two' });
    await db.insertPayee({ id: 'payee3', name: 'three' });
}
function getAllTransactions() {
    return db.all(`SELECT t.*, p.name as payee_name
       FROM v_transactions t
       LEFT JOIN payees p ON p.id = t.payee
       ORDER BY date DESC, amount DESC, id
     `);
}
describe('Merging success', () => {
    beforeEach(global.emptyDatabase());
    beforeEach(prepareDatabase);
    afterEach(global.emptyDatabase());
    const transaction1 = {
        account: 'one',
        date: '2025-01-01',
        payee: 'payee1',
        notes: 'notes1',
        category: '1',
        amount: 5,
        cleared: false,
        reconciled: false,
    };
    const dbTransaction1 = {
        account: 'one',
        date: 20250101,
        payee: 'payee1',
        notes: 'notes1',
        category: '1',
        amount: 5,
        cleared: 1,
        reconciled: 1,
    };
    const transaction2 = {
        account: 'two',
        date: '2025-02-02',
        payee: 'payee2',
        notes: 'notes2',
        category: '2',
        amount: 5,
        cleared: true,
        reconciled: true,
    };
    const dbTransaction2 = {
        account: 'two',
        date: 20250202,
        payee: 'payee2',
        notes: 'notes2',
        category: '2',
        amount: 5,
        cleared: 1,
        reconciled: 1,
    };
    it('two banksynced transactions keeps older transaction', async () => {
        const t1 = await db.insertTransaction({
            ...transaction1,
            imported_id: 'imported_1',
        });
        const t2 = await db.insertTransaction({
            ...transaction2,
            imported_id: 'imported_2',
        });
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t1);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction1,
            imported_id: 'imported_1',
        });
    });
    it('first banksynced, second manual keeps banksynced values', async () => {
        const t1 = await db.insertTransaction({
            ...transaction1,
            imported_id: 'imported_1',
        });
        const t2 = await db.insertTransaction(transaction2);
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t1);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction1,
            imported_id: 'imported_1',
        });
    });
    it('first file imported, second banksycned keeps banksynced values', async () => {
        const t1 = await db.insertTransaction({
            ...transaction1,
            imported_payee: 'payee',
        });
        const t2 = await db.insertTransaction({
            ...transaction2,
            imported_id: 'imported_2',
        });
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t2);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction2,
            imported_id: 'imported_2',
        });
    });
    it('second file imported, first banksycned keeps banksynced values', async () => {
        const t1 = await db.insertTransaction({
            ...transaction1,
            imported_id: 'imported_1',
        });
        const t2 = await db.insertTransaction({
            ...transaction2,
            imported_payee: 'payee',
        });
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t1);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction1,
            imported_id: 'imported_1',
        });
    });
    it('second file imported, first manual keeps file imported values', async () => {
        const t1 = await db.insertTransaction(transaction1);
        const t2 = await db.insertTransaction({
            ...transaction2,
            imported_payee: 'payee',
        });
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t2);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction2,
            imported_payee: 'payee',
        });
    });
    it('first file imported, second manual keeps file imported values', async () => {
        const t1 = await db.insertTransaction({
            ...transaction1,
            imported_payee: 'payee',
        });
        const t2 = await db.insertTransaction(transaction2);
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t1);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction1,
            imported_payee: 'payee',
        });
    });
    it('second banksynced, first manual keeps banksynced values', async () => {
        const t1 = await db.insertTransaction(transaction1);
        const t2 = await db.insertTransaction({
            ...transaction2,
            imported_id: 'imported_2',
        });
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t2);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction2,
            imported_id: 'imported_2',
        });
    });
    it('missing values in keep are filled in with drop values', async () => {
        // only insert required fields, imported to be kept
        const t1 = await db.insertTransaction({
            account: 'one',
            amount: 5,
            date: '2025-01-01',
            imported_id: 'imported_1',
        });
        const t2 = await db.insertTransaction(transaction2);
        expect(await (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])).toBe(t1);
        const transactions = await getAllTransactions();
        expect(transactions.length).toBe(1);
        expect(transactions[0]).toMatchObject({
            ...dbTransaction2,
            // values that should be kept from t1
            id: t1,
            account: 'one',
            amount: 5,
            date: 20250101,
            imported_id: 'imported_1',
        });
    });
});
//# sourceMappingURL=merge.test.js.map