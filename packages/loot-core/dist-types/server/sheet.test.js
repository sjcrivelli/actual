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
const mocks_1 = require("../mocks");
const db = __importStar(require("./db"));
const sheet = __importStar(require("./sheet"));
beforeEach(global.emptyDatabase());
async function insertTransactions() {
    await db.insertCategoryGroup({ id: 'group1', name: 'group1' });
    await db.insertCategory({ id: 'cat1', name: 'cat1', cat_group: 'group1' });
    await db.insertCategory({ id: 'cat2', name: 'cat2', cat_group: 'group1' });
    await db.insertTransaction((0, mocks_1.generateTransaction)({
        id: 'trans1',
        amount: -3200,
        account: '1',
        category: 'cat1',
        date: '2017-01-08',
    })[0]);
    await db.insertTransaction((0, mocks_1.generateTransaction)({
        id: 'trans2',
        amount: -2800,
        account: '1',
        category: 'cat2',
        date: '2017-01-10',
    })[0]);
    await db.insertTransaction((0, mocks_1.generateTransaction)({
        id: 'trans3',
        amount: -9832,
        account: '1',
        category: 'cat2',
        date: '2017-01-15',
    })[0]);
}
describe('Spreadsheet', () => {
    test('transferring a category triggers an update', async () => {
        const spreadsheet = await sheet.loadSpreadsheet(db);
        await insertTransactions();
        spreadsheet.startTransaction();
        spreadsheet.set('g!foo', `=from transactions where category = "cat2" calculate { sum(amount) }`);
        spreadsheet.endTransaction();
        await new Promise(resolve => {
            spreadsheet.onFinish(() => {
                expect(spreadsheet.getValue('g!foo')).toMatchSnapshot();
                resolve(undefined);
            });
        });
        await db.deleteCategory({ id: 'cat1' }, 'cat2');
        return new Promise(resolve => {
            spreadsheet.onFinish(() => {
                expect(spreadsheet.getValue('g!foo')).toMatchSnapshot();
                resolve(undefined);
            });
        });
    });
    test('updating still works after transferring categories', async () => {
        const spreadsheet = await sheet.loadSpreadsheet(db);
        await insertTransactions();
        await db.deleteCategory({ id: 'cat1' }, 'cat2');
        spreadsheet.startTransaction();
        spreadsheet.set('g!foo', `=from transactions where category = "cat2" calculate { sum(amount) }`);
        spreadsheet.endTransaction();
        await new Promise(resolve => {
            spreadsheet.onFinish(() => {
                expect(spreadsheet.getValue('g!foo')).toMatchSnapshot();
                resolve(undefined);
            });
        });
        await db.updateTransaction({ id: 'trans1', amount: 50000 });
        await new Promise(resolve => {
            spreadsheet.onFinish(() => {
                expect(spreadsheet.getValue('g!foo')).toMatchSnapshot();
                resolve(undefined);
            });
        });
    });
});
//# sourceMappingURL=sheet.test.js.map