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
const db = __importStar(require("../db"));
const views_1 = require("./views");
beforeEach(global.emptyDatabase());
const schema = {
    transactions: {
        id: { type: 'id' },
        amount: { type: 'integer' },
        transfer_id: { type: 'integer' },
    },
};
const schemaConfig = {
    views: {
        transactions: {
            fields: {
                amount: 'a_mo_unt',
            },
            v_transactions1: internalFields => {
                const fields = internalFields({
                    transfer_id: 'CASE WHEN amount < 4 THEN null ELSE transfer_id END',
                });
                return `SELECT ${fields} FROM transactions`;
            },
            v_transactions2: (_, publicFields) => {
                const fields = publicFields({
                    transfer_id: 'COERCE(transfer_id, "foo")',
                });
                return `SELECT ${fields} FROM v_transactions1`;
            },
        },
    },
};
describe('schema views', () => {
    test('generates views with all the right fields', () => {
        const str = (0, views_1.makeViews)(schema, schemaConfig);
        expect(str).toMatch('DROP VIEW IF EXISTS v_transactions1;');
        expect(str).toMatch('CREATE VIEW v_transactions1 AS SELECT _.id, _.a_mo_unt AS amount, CASE WHEN amount < 4 THEN null ELSE transfer_id END AS transfer_id FROM transactions;');
        expect(str).toMatch('DROP VIEW IF EXISTS v_transactions2;');
        expect(str).toMatch('CREATE VIEW v_transactions2 AS SELECT _.id, _.amount, COERCE(transfer_id, "foo") AS transfer_id FROM v_transactions1;');
        db.execQuery('DROP TABLE transactions');
        db.execQuery('CREATE TABLE transactions (id TEXT PRIMARY KEY, a_mo_unt INTEGER, transfer_id TEXT)');
        // Make sure the string is valid SQL
        db.execQuery(str);
    });
});
