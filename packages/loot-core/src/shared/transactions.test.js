"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var uuid_1 = require("uuid");
var transactions_1 = require("./transactions");
function makeTransaction(data) {
    return __assign({ id: (0, uuid_1.v4)(), amount: 2422, date: '2020-01-05', account: 'acc-id-1' }, data);
}
function makeSplitTransaction(data, children) {
    var parent = makeTransaction(__assign(__assign({}, data), { is_parent: true }));
    return __spreadArray([parent], children.map(function (t) { return (0, transactions_1.makeChild)(parent, t); }), true);
}
function splitError(amount) {
    return { difference: amount, type: 'SplitTransactionError', version: 1 };
}
describe('Transactions', function () {
    test('updating a transaction works', function () {
        var transactions = [
            makeTransaction({ amount: 5000 }),
            makeTransaction({ id: 't1', amount: 4000 }),
            makeTransaction({ amount: 3000 }),
        ];
        var _a = (0, transactions_1.updateTransaction)(transactions, makeTransaction({
            id: 't1',
            amount: 5000,
        })), data = _a.data, diff = _a.diff;
        expect(data.find(function (d) { return d.subtransactions; })).toBeFalsy();
        expect(diff).toEqual({
            added: [],
            deleted: [],
            updated: [expect.objectContaining({ id: 't1', amount: 5000 })],
        });
        expect(data.map(function (t) { return ({ id: t.id, amount: t.amount }); }).sort()).toEqual([
            { id: expect.any(String), amount: 5000 },
            { id: 't1', amount: 5000 },
            { id: expect.any(String), amount: 3000 },
        ]);
    });
    test('updating does nothing if value not changed', function () {
        var updatedTransaction = makeTransaction({ id: 't1', amount: 5000 });
        var transactions = [
            updatedTransaction,
            makeTransaction({ amount: 3000 }),
        ];
        var _a = (0, transactions_1.updateTransaction)(transactions, updatedTransaction), data = _a.data, diff = _a.diff;
        expect(diff).toEqual({ added: [], deleted: [], updated: [] });
        expect(data.map(function (t) { return ({ id: t.id, amount: t.amount }); }).sort()).toEqual([
            { id: expect.any(String), amount: 5000 },
            { id: expect.any(String), amount: 3000 },
        ]);
    });
    test('deleting a transaction works', function () {
        var transactions = [
            makeTransaction({ amount: 5000 }),
            makeTransaction({ id: 't1', amount: 4000 }),
            makeTransaction({ amount: 3000 }),
        ];
        var _a = (0, transactions_1.deleteTransaction)(transactions, 't1'), data = _a.data, diff = _a.diff;
        expect(diff).toEqual({
            added: [],
            deleted: [{ id: 't1' }],
            updated: [],
        });
        expect(data.map(function (t) { return ({ id: t.id, amount: t.amount }); }).sort()).toEqual([
            { id: expect.any(String), amount: 5000 },
            { id: expect.any(String), amount: 3000 },
        ]);
    });
    test('splitting a transaction works', function () {
        var transactions = [
            makeTransaction({ id: 't1', amount: 5000 }),
            makeTransaction({ amount: 3000 }),
        ];
        var _a = (0, transactions_1.splitTransaction)(transactions, 't1'), data = _a.data, diff = _a.diff;
        expect(data.find(function (d) { return d.subtransactions; })).toBeFalsy();
        expect(diff).toEqual({
            added: [expect.objectContaining({ amount: 0, parent_id: 't1' })],
            deleted: [],
            updated: [
                {
                    id: 't1',
                    is_parent: true,
                    error: splitError(5000),
                },
            ],
        });
        expect(data).toEqual([
            expect.objectContaining({
                id: 't1',
                amount: 5000,
                error: splitError(5000),
            }),
            expect.objectContaining({ parent_id: 't1', amount: 0 }),
            expect.objectContaining({ amount: 3000 }),
        ]);
    });
    test('adding a split transaction works', function () {
        var transactions = __spreadArray(__spreadArray([
            makeTransaction({ amount: 2001 })
        ], makeSplitTransaction({ id: 't1', amount: 2500 }, [
            { id: 't2', amount: 2000 },
            { id: 't3', amount: 500 },
        ]), true), [
            makeTransaction({ amount: 3002 }),
        ], false);
        expect(transactions.filter(function (t) { return t.parent_id === 't1'; }).length).toBe(2);
        // Should be able to pass in any id from the split trans
        var _a = (0, transactions_1.addSplitTransaction)(transactions, 't1'), data = _a.data, diff = _a.diff;
        expect(data.find(function (d) { return d.subtransactions; })).toBeFalsy();
        expect(data.filter(function (t) { return t.parent_id === 't1'; }).length).toBe(3);
        expect(diff).toEqual({
            added: [
                expect.objectContaining({
                    id: expect.any(String),
                    amount: 0,
                    parent_id: 't1',
                }),
            ],
            deleted: [],
            updated: [],
        });
        expect(data.length).toBe(6);
    });
    test('updating a split transaction works', function () {
        var transactions = __spreadArray(__spreadArray([
            makeTransaction({ amount: 2001 })
        ], makeSplitTransaction({ id: 't1', amount: 2500 }, [
            { id: 't2', amount: 2000 },
            { id: 't3', amount: 500 },
        ]), true), [
            makeTransaction({ amount: 3002 }),
        ], false);
        var _a = (0, transactions_1.updateTransaction)(transactions, makeTransaction({
            id: 't2',
            amount: 2200,
        })), data = _a.data, diff = _a.diff;
        expect(data.find(function (d) { return d.subtransactions; })).toBeFalsy();
        expect(diff).toEqual({
            added: [],
            deleted: [],
            updated: [
                { id: 't1', error: splitError(-200) },
                { id: 't2', amount: 2200 },
            ],
        });
        expect(data.length).toBe(5);
    });
    test('deleting a split transaction works', function () {
        var transactions = __spreadArray(__spreadArray([
            makeTransaction({ amount: 2001 })
        ], makeSplitTransaction({ id: 't1', amount: 2500 }, [
            { id: 't2', amount: 2000 },
            { id: 't3', amount: 500 },
        ]), true), [
            makeTransaction({ amount: 3002 }),
        ], false);
        var _a = (0, transactions_1.deleteTransaction)(transactions, 't2'), data = _a.data, diff = _a.diff;
        expect(diff).toEqual({
            added: [],
            deleted: [expect.objectContaining({ id: 't2' })],
            updated: [{ id: 't1', error: splitError(2000) }],
        });
        expect(data).toEqual([
            expect.objectContaining({ amount: 2001 }),
            expect.objectContaining({
                amount: 2500,
                is_parent: true,
                error: splitError(2000),
            }),
            expect.objectContaining({ amount: 500, parent_id: 't1' }),
            expect.objectContaining({ amount: 3002 }),
        ]);
    });
    test('deleting all child split transactions works', function () {
        var transactions = __spreadArray(__spreadArray([
            makeTransaction({ amount: 2001 })
        ], makeSplitTransaction({ id: 't1', amount: 2500, error: splitError(500) }, [{ id: 't2', amount: 2000 }]), true), [
            makeTransaction({ amount: 3002 }),
        ], false);
        var data = (0, transactions_1.deleteTransaction)(transactions, 't2').data;
        expect(data).toEqual([
            expect.objectContaining({ amount: 2001 }),
            // Must delete error if no children
            expect.objectContaining({ amount: 2500, error: null }),
            expect.objectContaining({ amount: 3002 }),
        ]);
    });
});
