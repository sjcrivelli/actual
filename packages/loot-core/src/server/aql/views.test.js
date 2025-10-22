"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var db = require("../db");
var views_1 = require("./views");
beforeEach(global.emptyDatabase());
var schema = {
    transactions: {
        id: { type: 'id' },
        amount: { type: 'integer' },
        transfer_id: { type: 'integer' },
    },
};
var schemaConfig = {
    views: {
        transactions: {
            fields: {
                amount: 'a_mo_unt',
            },
            v_transactions1: function (internalFields) {
                var fields = internalFields({
                    transfer_id: 'CASE WHEN amount < 4 THEN null ELSE transfer_id END',
                });
                return "SELECT ".concat(fields, " FROM transactions");
            },
            v_transactions2: function (_, publicFields) {
                var fields = publicFields({
                    transfer_id: 'COERCE(transfer_id, "foo")',
                });
                return "SELECT ".concat(fields, " FROM v_transactions1");
            },
        },
    },
};
describe('schema views', function () {
    test('generates views with all the right fields', function () {
        var str = (0, views_1.makeViews)(schema, schemaConfig);
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
