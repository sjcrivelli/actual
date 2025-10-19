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
const db = __importStar(require("../db"));
const prefs = __importStar(require("../prefs"));
const sheet = __importStar(require("../sheet"));
const mockSyncServer = __importStar(require("../tests/mockSyncServer"));
const encoder = __importStar(require("./encoder"));
const utils_1 = require("./utils");
const index_1 = require("./index");
beforeEach(() => {
    mockSyncServer.reset();
    (0, index_1.setSyncingMode)('enabled');
    return global.emptyDatabase()();
});
afterEach(() => {
    global.resetTime();
    (0, index_1.setSyncingMode)('disabled');
});
describe('Sync', () => {
    it('should send messages to the server', async () => {
        prefs.loadPrefs();
        prefs.savePrefs({ groupId: 'group' });
        let timestamp = crdt_1.Timestamp.send();
        await (0, index_1.sendMessages)([
            {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 3200,
                timestamp,
            },
        ]);
        global.stepForwardInTime();
        timestamp = crdt_1.Timestamp.send();
        await (0, index_1.sendMessages)([
            {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 4200,
                timestamp,
            },
        ]);
        expect((0, crdt_1.getClock)().timestamp.toString()).toEqual(timestamp.toString());
        expect(mockSyncServer.getClock().merkle).toEqual((0, crdt_1.getClock)().merkle);
        expect(await db.all('SELECT * FROM messages_crdt')).toMatchSnapshot();
        expect(await db.all('SELECT * FROM messages_clock')).toMatchSnapshot();
    });
    it('should resend old messages to the server', async () => {
        prefs.loadPrefs();
        prefs.savePrefs({ groupId: 'group' });
        global.stepForwardInTime(Date.parse('2018-11-13T13:20:00.000Z'));
        await (0, index_1.applyMessages)([
            global.stepForwardInTime() || {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 3200,
                timestamp: crdt_1.Timestamp.send(),
            },
            global.stepForwardInTime() || {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 3200,
                timestamp: crdt_1.Timestamp.send(),
            },
        ]);
        // Move the clock forward so that the above 2 messages are not
        // automatically sent out, but will need to be re-sent by way of
        // the merkle tree
        prefs.savePrefs({ lastSyncedTimestamp: (0, crdt_1.getClock)().timestamp.toString() });
        expect(mockSyncServer.getMessages().length).toBe(0);
        const result = await (0, index_1.fullSync)();
        if ((0, utils_1.isError)(result))
            throw result.error;
        expect(result.messages.length).toBe(0);
        expect(mockSyncServer.getMessages().length).toBe(2);
    });
    it('should sync multiple clients', async () => {
        prefs.loadPrefs();
        prefs.savePrefs({
            groupId: 'group',
            lastSyncedTimestamp: crdt_1.Timestamp.zero.toString(),
        });
        await mockSyncServer.handlers['/sync/sync'](await encoder.encode('group', 'client', crdt_1.Timestamp.parse('1970-01-01T01:17:37.000Z-0000-0000testinguuid2'), [
            {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 'N:3200',
                timestamp: crdt_1.Timestamp.parse('1970-01-02T05:17:36.789Z-0000-0000testinguuid2'),
            },
            {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 'N:4200',
                timestamp: crdt_1.Timestamp.parse('1970-01-02T10:17:36.999Z-0000-0000testinguuid2'),
            },
        ]));
        await (0, index_1.applyMessages)([
            global.stepForwardInTime(Date.parse('1970-01-03T10:17:37.000Z')) || {
                dataset: 'transactions',
                row: 'foo',
                column: 'amount',
                value: 5000,
                timestamp: crdt_1.Timestamp.send(),
            },
        ]);
        const result = await (0, index_1.fullSync)();
        if ((0, utils_1.isError)(result))
            throw result.error;
        expect(result.messages.length).toBe(2);
        expect(mockSyncServer.getMessages().length).toBe(3);
    });
});
async function registerBudgetMonths(months) {
    const createdMonths = new Set();
    for (const month of months) {
        createdMonths.add(month);
    }
    sheet.get().meta().createdMonths = months;
}
async function asSecondClient(func) {
    prefs.loadPrefs();
    prefs.savePrefs({
        groupId: 'group',
        lastSyncedTimestamp: crdt_1.Timestamp.zero.toString(),
    });
    await func();
    await global.emptyDatabase()();
    prefs.savePrefs({
        groupId: 'group',
        lastSyncedTimestamp: crdt_1.Timestamp.zero.toString(),
    });
}
function expectCellToExist(sheetName, name) {
    const value = sheet.get().getCellValueLoose(sheetName, name);
    expect(value).not.toBe(null);
}
function expectCellNotToExist(sheetName, name, voided) {
    const value = sheet.get().getCellValueLoose(sheetName, name);
    expect(value).toBe(voided ? 0 : null);
}
describe('Sync projections', () => {
    test('synced categories should have budgets created', async () => {
        let groupId, fooId, barId;
        await asSecondClient(async () => {
            await sheet.loadSpreadsheet(db);
            groupId = await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            fooId = await db.insertCategory({ name: 'foo', cat_group: 'group1' });
            barId = await db.insertCategory({ name: 'bar', cat_group: 'group1' });
        });
        await sheet.loadSpreadsheet(db);
        registerBudgetMonths(['2017-01', '2017-02']);
        expectCellNotToExist('budget201701', 'sum-amount-' + fooId);
        expectCellNotToExist('budget201701', 'sum-amount-' + barId);
        expectCellNotToExist('budget201701', 'group-sum-amount-' + barId);
        await (0, index_1.fullSync)();
        // Make sure the budget cells have been created
        expectCellToExist('budget201701', 'sum-amount-' + fooId);
        expectCellToExist('budget201702', 'sum-amount-' + fooId);
        expectCellToExist('budget201701', 'sum-amount-' + barId);
        expectCellToExist('budget201702', 'sum-amount-' + barId);
        expectCellToExist('budget201701', 'group-sum-amount-' + groupId);
        expectCellToExist('budget201702', 'group-sum-amount-' + groupId);
    });
    test('creating and deleting categories in same sync', async () => {
        // It should work when the client creates a category and deletes
        // it in the same sync (should do nothing)
        let fooId;
        await asSecondClient(async () => {
            await sheet.loadSpreadsheet(db);
            await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            fooId = await db.insertCategory({ name: 'foo', cat_group: 'group1' });
            await db.deleteCategory({ id: fooId });
        });
        await sheet.loadSpreadsheet(db);
        registerBudgetMonths(['2017-01', '2017-02']);
        expectCellNotToExist('budget201701', 'sum-amount-' + fooId);
        await (0, index_1.fullSync)();
        expectCellNotToExist('budget201701', 'sum-amount-' + fooId);
    });
    test('synced categories should have budgets deleted', async () => {
        let fooId;
        await asSecondClient(async () => {
            await sheet.loadSpreadsheet(db);
            await db.insertCategoryGroup({
                id: 'group1',
                name: 'group1',
            });
            fooId = await db.insertCategory({ name: 'foo', cat_group: 'group1' });
            await db.deleteCategory({ id: fooId });
        });
        await sheet.loadSpreadsheet(db);
        registerBudgetMonths(['2017-01', '2017-02']);
        // Get all the messages. We'll apply them in two passes
        const messages = mockSyncServer.getMessages();
        // Apply all but the last message (which deletes the category)
        await (0, index_1.applyMessages)(messages.slice(0, -1));
        expect((await db.getCategories()).length).toBe(1);
        expectCellToExist('budget201701', 'sum-amount-' + fooId);
        // Apply the last message and make sure it deleted the appropriate
        // budget cells
        await (0, index_1.applyMessages)([messages[messages.length - 1]]);
        expect((await db.getCategories()).length).toBe(0);
        expectCellNotToExist('budget201701', 'sum-amount-' + fooId, true);
    });
    test('creating and deleting groups in same sync', async () => {
        // It should work when the client creates a category and deletes
        // it in the same sync (should do nothing)
        let groupId;
        await asSecondClient(async () => {
            await sheet.loadSpreadsheet(db);
            groupId = await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            await db.deleteCategoryGroup({ id: groupId });
        });
        await sheet.loadSpreadsheet(db);
        registerBudgetMonths(['2017-01', '2017-02']);
        expectCellNotToExist('budget201701', 'group-sum-amount-' + groupId);
        await (0, index_1.fullSync)();
        expectCellNotToExist('budget201701', 'group-sum-amount-' + groupId);
    });
    test('synced groups should have budgets deleted', async () => {
        // Create the message list which creates categories and groups and
        // then deletes them. Go ahead and include a category deletion in
        // the same pass to make sure that works.
        let groupId, fooId;
        await asSecondClient(async () => {
            await sheet.loadSpreadsheet(db);
            groupId = await db.insertCategoryGroup({
                id: 'group1',
                name: 'group1',
            });
            fooId = await db.insertCategory({ name: 'foo', cat_group: 'group1' });
            await db.deleteCategory({ id: fooId });
            await db.deleteCategoryGroup({ id: groupId });
        });
        await sheet.loadSpreadsheet(db);
        registerBudgetMonths(['2017-01', '2017-02']);
        // Get all the messages. We'll apply them in two passes
        const messages = mockSyncServer.getMessages();
        const firstMessages = messages.filter(m => m.column !== 'tombstone');
        const secondMessages = messages.filter(m => m.column === 'tombstone');
        // Apply all the good messages
        await (0, index_1.applyMessages)(firstMessages);
        expect((await db.getCategories()).length).toBe(1);
        expect((await db.getCategoriesGrouped()).length).toBe(1);
        expectCellToExist('budget201701', 'sum-amount-' + fooId);
        expectCellToExist('budget201701', 'group-sum-amount-' + groupId);
        // Apply the messages that deletes it
        await (0, index_1.applyMessages)(secondMessages);
        expect((await db.getCategories()).length).toBe(0);
        expect((await db.getCategoriesGrouped()).length).toBe(0);
        expectCellNotToExist('budget201701', 'sum-amount-' + fooId, true);
        expectCellNotToExist('budget201701', 'group-sum-amount-' + groupId, true);
    });
    test('categories should update the budget when moved', async () => {
        let groupId, fooId;
        await asSecondClient(async () => {
            await sheet.loadSpreadsheet(db);
            groupId = await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
            await db.insertCategoryGroup({ id: 'group2', name: 'group2' });
            fooId = await db.insertCategory({ name: 'foo', cat_group: 'group1' });
            await db.moveCategory(fooId, 'group2', null);
        });
        await sheet.loadSpreadsheet(db);
        registerBudgetMonths(['2017-01', '2017-02']);
        // Get all the messages. We'll apply them in two passes
        const messages = mockSyncServer.getMessages();
        const firstMessages = messages.slice(0, -2);
        const secondMessages = messages.slice(-2);
        // Apply all the good messages
        await (0, index_1.applyMessages)(firstMessages);
        const [cat] = await db.getCategories();
        expect(cat.cat_group).toBe('group1');
        expectCellToExist('budget201701', 'group-sum-amount-' + groupId);
        // Apply the messages that deletes it
        await (0, index_1.applyMessages)(secondMessages);
    });
});
