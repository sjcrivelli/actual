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
const db = __importStar(require("../server/db"));
const transfer = __importStar(require("./transfer"));
beforeEach(global.emptyDatabase());
async function prepareDatabase() {
    await db.insertAccount({ id: 'one', name: 'one' });
    await db.insertAccount({ id: 'two', name: 'two' });
    await db.insertPayee({ name: '', transfer_acct: 'one' });
    await db.insertPayee({ name: '', transfer_acct: 'two' });
}
async function createTransaction(account, amount, extra = {}) {
    const transaction = {
        id: null,
        account,
        amount,
        payee: await db.insertPayee({ name: 'Non-transfer ' + account }),
        date: '2017-01-01',
        ...extra,
    };
    transaction.id = await db.insertTransaction(transaction);
    return await db.getTransaction(transaction.id);
}
describe('Transfer', () => {
    test('Transfers are properly verified', async () => {
        await prepareDatabase();
        // happy path, two valid transactions
        expect(transfer.validForTransfer(await createTransaction('one', 5), await createTransaction('two', -5))).toBeTruthy();
        // amount not zeroed out
        expect(transfer.validForTransfer(await createTransaction('one', 5), await createTransaction('two', 5))).toBeFalsy();
        // amount not match
        expect(transfer.validForTransfer(await createTransaction('one', 5), await createTransaction('two', -6))).toBeFalsy();
        // accounts match
        expect(transfer.validForTransfer(await createTransaction('one', 5), await createTransaction('one', -5))).toBeFalsy();
        // one already a transfer
        const existingTransfer = await createTransaction('one', 5);
        expect(transfer.validForTransfer(await createTransaction('one', 5), await createTransaction('two', -5, {
            transfer_id: existingTransfer.id,
        }))).toBeFalsy();
    });
});
