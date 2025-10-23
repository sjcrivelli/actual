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
const uuid_1 = require("uuid");
const query_1 = require("../../shared/query");
const transactions_1 = require("../../shared/transactions");
const db = __importStar(require("../db"));
const aql = __importStar(require("./exec"));
const schema_1 = require("./schema");
beforeEach(global.emptyDatabase());
function repeat(arr, times) {
    let result = [];
    for (let i = 0; i < times; i++) {
        result = result.concat(arr);
    }
    return result;
}
function compileAndRunAqlQuery(query, options) {
    return aql.compileAndRunAqlQuery(schema_1.schema, schema_1.schemaConfig, query, options);
}
async function insertTransactions(repeatTimes = 1) {
    let transactions = [];
    const group = await db.insertCategoryGroup({ name: 'group' });
    for (let i = 0; i < repeatTimes; i++) {
        const cat1 = await db.insertCategory({
            id: 'cat' + i + 'a',
            name: 'cat' + i + 'a',
            cat_group: group,
        });
        const cat2 = await db.insertCategory({
            id: 'cat' + i + 'b',
            name: 'cat' + i + 'b',
            cat_group: group,
        });
        const parent = {
            id: (0, uuid_1.v4)(),
            account: 'acct',
            date: '2020-01-04',
            amount: -100,
            is_parent: true,
        };
        const parent2 = {
            id: (0, uuid_1.v4)(),
            account: 'acct',
            date: '2020-01-01',
            amount: -89,
            is_parent: true,
        };
        transactions = transactions.concat([
            parent,
            (0, transactions_1.makeChild)(parent, { amount: -20, category: cat1 }),
            (0, transactions_1.makeChild)(parent, { amount: -5, category: cat1 }),
            (0, transactions_1.makeChild)(parent, { amount: -30, category: cat1 }),
            (0, transactions_1.makeChild)(parent, { amount: -45, category: cat2 }),
            parent2,
            (0, transactions_1.makeChild)(parent2, { amount: -9, category: cat2 }),
            (0, transactions_1.makeChild)(parent2, { amount: -80, category: cat1 }),
            { account: 'acct', date: '2020-01-03', amount: -53, category: cat1 },
        ]);
    }
    for (const trans of transactions) {
        await db.insertTransaction(trans);
    }
}
describe('compileAndRunQuery', () => {
    it('converts output types', async () => {
        await insertTransactions();
        // date
        let { data } = await compileAndRunAqlQuery((0, query_1.q)('transactions').select('date').serialize());
        expect(data[0].date).toBe('2020-01-04');
        // date-month
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .select({ month: { $month: '$date' } })
            .serialize())).data;
        expect(data[0].month).toBe('2020-01');
        // date-year
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .select({ year: { $year: '$date' } })
            .serialize())).data;
        expect(data[0].year).toBe('2020');
        // boolean
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions').select(['is_child', 'is_parent']).raw().serialize())).data;
        expect(data[0].is_child).toBe(false);
        expect(data[0].is_parent).toBe(true);
        expect(data[1].is_child).toBe(true);
        expect(data[1].is_parent).toBe(false);
    });
    it('provides named parameters and converts types', async () => {
        const transId = (0, uuid_1.v4)();
        await db.insertTransaction({
            id: transId,
            account: 'acct',
            date: '2020-01-01',
            amount: -5001,
            cleared: true,
        });
        let { data } = await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ amount: { $lt: { $neg: ':amount' } } })
            .select()
            .serialize(), { params: { amount: 5000 } });
        expect(data[0].id).toBe(transId);
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ date: { $transform: '$month', $eq: { $month: ':month' } } })
            .select('date')
            .serialize(), { params: { month: '2020-01-02' } })).data;
        expect(data[0].id).toBe(transId);
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ date: { $transform: '$year', $eq: { $year: ':month' } } })
            .select('date')
            .serialize(), { params: { month: '2020-01-02' } })).data;
        expect(data[0].id).toBe(transId);
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ cleared: ':cleared' })
            .select('date')
            .serialize(), { params: { cleared: true } })).data;
        expect(data[0].id).toBe(transId);
    });
    it('allows null as a parameter', async () => {
        await db.insertCategoryGroup({ id: 'group', name: 'group' });
        await db.insertCategory({ id: 'cat', name: 'cat', cat_group: 'group' });
        await db.insertCategory({ id: 'cat2', name: 'cat2', cat_group: 'group' });
        const transNoCat = await db.insertTransaction({
            account: 'acct',
            date: '2020-01-01',
            amount: -5001,
            category: null,
        });
        const transCat = await db.insertTransaction({
            account: 'acct',
            date: '2020-01-01',
            amount: -5001,
            category: 'cat',
        });
        const transCat2 = await db.insertTransaction({
            account: 'acct',
            date: '2020-01-02',
            amount: -5001,
            category: 'cat2',
        });
        const queryState = (0, query_1.q)('transactions')
            .filter({ category: ':category' })
            .select()
            .serialize();
        let { data } = await compileAndRunAqlQuery(queryState, {
            params: { category: null },
        });
        expect(data[0].id).toBe(transNoCat);
        data = (await compileAndRunAqlQuery(queryState, { params: { category: 'cat' } })).data;
        expect(data[0].id).toBe(transCat);
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ category: { $ne: ':category' } })
            .select('category')
            .serialize(), { params: { category: 'cat2' } })).data;
        expect(data).toHaveLength(2);
        expect(data).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: transNoCat }),
            expect.objectContaining({ id: transCat }),
            expect.not.objectContaining({ id: transCat2 }),
        ]));
        data = (await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ category: { $ne: ':category' } })
            .select('category')
            .serialize(), { params: { category: null } })).data;
        expect(data).toHaveLength(2);
        expect(data).toEqual(expect.arrayContaining([
            expect.not.objectContaining({ id: transNoCat }),
            expect.objectContaining({ id: transCat }),
            expect.objectContaining({ id: transCat2 }),
        ]));
    });
    it('parameters have the correct order', async () => {
        const transId = (0, uuid_1.v4)();
        await db.insertTransaction({
            id: transId,
            account: 'acct',
            date: '2020-01-01',
            amount: -5001,
        });
        const { data } = await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({
            amount: { $lt: { $neg: ':amount' } },
            date: [{ $lte: ':date' }, { $gte: ':date' }],
        })
            .select()
            .serialize(), { params: { amount: 5000, date: '2020-01-01' } });
        expect(data[0].id).toBe(transId);
    });
    it('fetches all data required for $oneof', async () => {
        await insertTransactions();
        const rows = await db.all('SELECT id FROM transactions WHERE amount < -50');
        const ids = rows.slice(0, 3).map(row => row.id);
        ids.sort();
        const { data } = await compileAndRunAqlQuery((0, query_1.q)('transactions')
            .filter({ id: { $oneof: repeat(ids, 1000) }, amount: { $lt: 50 } })
            .select('id')
            .raw()
            .serialize());
        expect(data.map(row => row.id).sort()).toEqual(ids);
    });
});
//# sourceMappingURL=exec.test.js.map