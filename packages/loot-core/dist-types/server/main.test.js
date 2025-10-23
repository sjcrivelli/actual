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
const crdt_1 = require("@actual-app/crdt");
const uuid_1 = require("uuid");
const util_1 = require("../mocks/util");
const connection = __importStar(require("../platform/server/connection"));
const fs = __importStar(require("../platform/server/fs"));
const monthUtils = __importStar(require("../shared/months"));
const budgetActions = __importStar(require("./budget/actions"));
const budget = __importStar(require("./budget/base"));
const db = __importStar(require("./db"));
const main_1 = require("./main");
const mutators_1 = require("./mutators");
const prefs = __importStar(require("./prefs"));
const sheet = __importStar(require("./sheet"));
vi.mock('./post');
beforeEach(async () => {
    await global.emptyDatabase()();
    (0, mutators_1.disableGlobalMutations)();
});
afterEach(async () => {
    await (0, mutators_1.runHandler)(main_1.handlers['close-budget']);
    connection.resetEvents();
    (0, mutators_1.enableGlobalMutations)();
    global.currentMonth = null;
});
async function createTestBudget(name) {
    const templatePath = fs.join(__dirname, '/../mocks/files', name);
    const budgetPath = fs.join(__dirname, '/../mocks/files/budgets/test-budget');
    fs._setDocumentDir(fs.join(budgetPath, '..'));
    await fs.mkdir(budgetPath);
    await fs.copyFile(fs.join(templatePath, 'metadata.json'), fs.join(budgetPath, 'metadata.json'));
    await fs.copyFile(fs.join(templatePath, 'db.sqlite'), fs.join(budgetPath, 'db.sqlite'));
}
describe('Budgets', () => {
    afterEach(async () => {
        fs._setDocumentDir(null);
        const budgetPath = fs.join(__dirname, '/../mocks/files/budgets/test-budget');
        if (await fs.exists(budgetPath)) {
            await fs.removeDirRecursively(budgetPath);
        }
    });
    test('budget is successfully loaded', async () => {
        await createTestBudget('default-budget-template');
        // Grab the clock to compare later
        await db.openDatabase('test-budget');
        const row = await db.first('SELECT * FROM messages_clock');
        const { error } = await (0, mutators_1.runHandler)(main_1.handlers['load-budget'], {
            id: 'test-budget',
        });
        expect(error).toBe(undefined);
        // Make sure the prefs were loaded
        expect(prefs.getPrefs().id).toBe('test-budget');
        // Make sure the clock has been loaded
        expect((0, crdt_1.getClock)()).toEqual((0, crdt_1.deserializeClock)(row.clock));
    });
    test('budget detects out of sync migrations', async () => {
        await createTestBudget('default-budget-template');
        await db.openDatabase('test-budget');
        await db.runQuery('INSERT INTO __migrations__ (id) VALUES (1000)');
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => null);
        const { error } = await (0, mutators_1.runHandler)(main_1.handlers['load-budget'], {
            id: 'test-budget',
        });
        // There should be an error and the budget should be unloaded
        expect(error).toBe('out-of-sync-migrations');
        expect(db.getDatabase()).toBe(null);
        expect(prefs.getPrefs()).toBe(null);
        spy.mockRestore();
    });
});
describe('Accounts', () => {
    test('Transfers are properly updated', async () => {
        await (0, mutators_1.runMutator)(async () => {
            await db.insertAccount({ id: 'one', name: 'one' });
            await db.insertAccount({ id: 'two', name: 'two' });
            await db.insertAccount({ id: 'three', name: 'three' });
            await db.insertPayee({
                id: 'transfer-one',
                name: '',
                transfer_acct: 'one',
            });
            await db.insertPayee({
                id: 'transfer-two',
                name: '',
                transfer_acct: 'two',
            });
            await db.insertPayee({
                id: 'transfer-three',
                name: '',
                transfer_acct: 'three',
            });
        });
        const id = 'test-transfer';
        await (0, mutators_1.runHandler)(main_1.handlers['transaction-add'], {
            id,
            account: 'one',
            amount: 5000,
            payee: 'transfer-two',
            date: '2017-01-01',
        });
        const differ = (0, util_1.expectSnapshotWithDiffer)(await db.all('SELECT * FROM transactions'));
        let transaction = await db.getTransaction(id);
        await (0, mutators_1.runHandler)(main_1.handlers['transaction-update'], {
            ...(await db.getTransaction(id)),
            payee: 'transfer-three',
            date: '2017-01-03',
        });
        differ.expectToMatchDiff(await db.all('SELECT * FROM transactions'));
        transaction = await db.getTransaction(id);
        await (0, mutators_1.runHandler)(main_1.handlers['transaction-delete'], transaction);
        differ.expectToMatchDiff(await db.all('SELECT * FROM transactions'));
    });
});
describe('Budget', () => {
    test('new budgets should be created', async () => {
        const spreadsheet = await sheet.loadSpreadsheet(db);
        await (0, mutators_1.runMutator)(async () => {
            await db.insertCategoryGroup({
                id: 'incomeGroup',
                name: 'incomeGroup',
                is_income: 1,
            });
            await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            await db.insertCategory({ name: 'foo', cat_group: 'group1' });
            await db.insertCategory({ name: 'bar', cat_group: 'group1' });
        });
        let bounds = await (0, mutators_1.runHandler)(main_1.handlers['get-budget-bounds']);
        expect(bounds.start).toBe('2016-10');
        expect(bounds.end).toBe('2018-01');
        expect(spreadsheet.meta().createdMonths).toMatchSnapshot();
        // Add a transaction (which needs an account) earlier then the
        // current earliest budget to test if it creates the necessary
        // budgets for the earlier months
        await db.runQuery("INSERT INTO accounts (id, name) VALUES ('one', 'boa')");
        await (0, mutators_1.runHandler)(main_1.handlers['transaction-add'], {
            id: (0, uuid_1.v4)(),
            date: '2016-05-06',
            amount: 50,
            account: 'one',
        });
        // Fast-forward in time to a future month and make sure it creates
        // budgets for the months in the future
        global.currentMonth = '2017-02';
        bounds = await (0, mutators_1.runHandler)(main_1.handlers['get-budget-bounds']);
        expect(bounds.start).toBe('2016-02');
        expect(bounds.end).toBe('2018-02');
        expect(spreadsheet.meta().createdMonths).toMatchSnapshot();
        await new Promise(resolve => spreadsheet.onFinish(resolve));
    });
    test('budget updates when changing a category', async () => {
        const spreadsheet = await sheet.loadSpreadsheet(db);
        function captureChangedCells(func) {
            return new Promise(async (resolve) => {
                let changed = [];
                const remove = spreadsheet.addEventListener('change', ({ names }) => {
                    changed = changed.concat(names);
                });
                await func();
                remove();
                spreadsheet.onFinish(() => {
                    resolve(changed);
                });
            });
        }
        // Force the system to start tracking these months so budgets are
        // automatically updated when adding/deleting categories
        await db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
            '2017-01',
        ]);
        await db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
            '2017-02',
        ]);
        await db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
            '2017-03',
        ]);
        await db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
            '2017-04',
        ]);
        let categories;
        await captureChangedCells(async () => {
            await (0, mutators_1.runMutator)(() => db.insertCategoryGroup({ id: 'group1', name: 'group1' }));
            categories = [
                await (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                    name: 'foo',
                    groupId: 'group1',
                }),
                await (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                    name: 'bar',
                    groupId: 'group1',
                }),
                await (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                    name: 'baz',
                    groupId: 'group1',
                }),
                await (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                    name: 'biz',
                    groupId: 'group1',
                }),
            ];
        });
        await db.runQuery("INSERT INTO accounts (id, name) VALUES ('boa', 'boa')");
        const trans = {
            id: 'boa-transaction',
            date: '2017-02-06',
            amount: 5000,
            account: 'boa',
            category: categories[0],
        };
        // Test insertions
        let changed = await captureChangedCells(() => (0, mutators_1.runHandler)(main_1.handlers['transaction-add'], trans));
        expect(changed.sort()).toMatchSnapshot();
        // Test updates
        changed = await captureChangedCells(async () => {
            await (0, mutators_1.runHandler)(main_1.handlers['transaction-update'], {
                ...(await db.getTransaction(trans.id)),
                amount: 7000,
            });
        });
        expect(changed.sort()).toMatchSnapshot();
        // Test deletions
        changed = await captureChangedCells(async () => {
            await (0, mutators_1.runHandler)(main_1.handlers['transaction-delete'], { id: trans.id });
        });
        expect(changed.sort()).toMatchSnapshot();
    });
});
describe('Categories', () => {
    test('can be deleted', async () => {
        await sheet.loadSpreadsheet(db);
        await (0, mutators_1.runMutator)(async () => {
            await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            await db.insertCategory({ id: 'foo', name: 'foo', cat_group: 'group1' });
            await db.insertCategory({ id: 'bar', name: 'bar', cat_group: 'group1' });
        });
        let categories = await db.getCategories();
        expect(categories.length).toBe(2);
        expect(categories.find(cat => cat.name === 'foo')).not.toBeNull();
        expect(categories.find(cat => cat.name === 'bar')).not.toBeNull();
        await (0, mutators_1.runHandler)(main_1.handlers['category-delete'], { id: 'foo' });
        categories = await db.getCategories();
        expect(categories.length).toBe(1);
        expect(categories.find(cat => cat.name === 'bar')).not.toBeNull();
    });
    test('transfers properly when deleted', async () => {
        await sheet.loadSpreadsheet(db);
        const transId = await (0, mutators_1.runMutator)(async () => {
            await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            await db.insertCategoryGroup({ id: 'group1b', name: 'group1b' });
            await db.insertCategoryGroup({
                id: 'group2',
                name: 'group2',
                is_income: 1,
            });
            await db.insertCategory({ id: 'foo', name: 'foo', cat_group: 'group1' });
            await db.insertCategory({ id: 'bar', name: 'bar', cat_group: 'group1b' });
            await db.insertCategory({
                id: 'income1',
                name: 'income1',
                is_income: 1,
                cat_group: 'group2',
            });
            await db.insertCategory({
                id: 'income2',
                name: 'income2',
                is_income: 1,
                cat_group: 'group2',
            });
            return await db.insertTransaction({
                date: '2017-01-01',
                account: 'acct',
                amount: 4500,
                category: 'foo',
            });
        });
        await budget.createAllBudgets();
        // Set a budget value for the category `foo` of 1000
        const sheetName = monthUtils.sheetForMonth('2018-01');
        await budgetActions.setBudget({
            category: 'foo',
            month: '2018-01',
            amount: 1000,
        });
        expect(sheet.getCellValue(sheetName, 'group-budget-group1')).toBe(1000);
        expect(sheet.getCellValue(sheetName, 'group-budget-group1b')).toBe(0);
        // Make sure the transaction has a category of `foo`
        let trans = await db.getTransaction(transId);
        expect(trans.category).toBe('foo');
        await (0, mutators_1.runHandler)(main_1.handlers['category-delete'], {
            id: 'foo',
            transferId: 'bar',
        });
        // Make sure the transaction has been updated
        trans = await db.getTransaction(transId);
        expect(trans.category).toBe('bar');
        // Make sure the budget value was transferred
        expect(sheet.getCellValue(sheetName, 'group-budget-group1')).toBe(0);
        expect(sheet.getCellValue(sheetName, 'group-budget-group1b')).toBe(1000);
        // Transfering an income category to an expense just doesn't make
        // sense. Make sure this doesn't do anything.
        const { error } = await (0, mutators_1.runHandler)(main_1.handlers['category-delete'], {
            id: 'income1',
            transferId: 'bar',
        });
        expect(error).toBe('category-type');
        let categories = await db.getCategories();
        expect(categories.find(cat => cat.id === 'income1')).toBeDefined();
        // Make sure you can delete income categories
        await (0, mutators_1.runHandler)(main_1.handlers['category-delete'], {
            id: 'income1',
            transferId: 'income2',
        });
        categories = await db.getCategories();
        expect(categories.find(cat => cat.id === 'income1')).not.toBeDefined();
    });
});
//# sourceMappingURL=main.test.js.map