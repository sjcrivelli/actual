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
const db = __importStar(require("../../db"));
// This file doesn't test the schema code directly, it tests that
// views return data as expected and various constraints on the
// sqlite3 schema itself.
beforeEach(global.emptyDatabase());
describe('schema', () => {
    test('never returns transactions without a date', async () => {
        expect((await db.all('SELECT * FROM transactions')).length).toBe(0);
        expect((await db.all('SELECT * FROM v_transactions'))
            .length).toBe(0);
        await db.runQuery('INSERT INTO transactions (acct) VALUES (?)', ['foo']);
        expect((await db.all('SELECT * FROM transactions')).length).toBe(1);
        expect((await db.all('SELECT * FROM v_transactions'))
            .length).toBe(0);
    });
    test('never returns transactions without an account', async () => {
        expect((await db.all('SELECT * FROM transactions')).length).toBe(0);
        expect((await db.all('SELECT * FROM v_transactions'))
            .length).toBe(0);
        await db.runQuery('INSERT INTO transactions (date) VALUES (?)', [20200101]);
        expect((await db.all('SELECT * FROM transactions')).length).toBe(1);
        expect((await db.all('SELECT * FROM v_transactions'))
            .length).toBe(0);
    });
    test('never returns child transactions without a parent', async () => {
        expect((await db.all('SELECT * FROM transactions')).length).toBe(0);
        expect((await db.all('SELECT * FROM v_transactions'))
            .length).toBe(0);
        await db.runQuery('INSERT INTO transactions (date, acct, isChild) VALUES (?, ?, ?)', [20200101, 'foo', 1]);
        expect((await db.all('SELECT * FROM transactions')).length).toBe(1);
        expect((await db.all('SELECT * FROM v_transactions'))
            .length).toBe(0);
    });
});
