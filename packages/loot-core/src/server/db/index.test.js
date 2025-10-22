"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var db = require("./index");
beforeEach(global.emptyDatabase());
function insertTransactions(transactions) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertAccount({ id: 'foo', name: 'bar' })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, Promise.all(transactions.map(function (transaction) { return db.insertTransaction(transaction); }))];
            }
        });
    });
}
function getTransactions(latestDate) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getTransactions('foo')];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows
                            .filter(function (t) { return t.date <= latestDate; })
                            .map(function (row) { return ({
                            id: row.id,
                            date: row.date,
                            payee: row.payee,
                            is_child: row.is_child,
                            is_parent: row.is_parent,
                            amount: row.amount,
                            starting_balance_flag: row.starting_balance_flag,
                            sort_order: row.sort_order,
                        }); })];
            }
        });
    });
}
// TODO: test that `insertTransaction` is done sync (or is at least
// validated in the same event loop and it's same to not await)
describe('Database', function () {
    test('inserting a category works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'foo',
                            cat_group: 'group1',
                        })];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).length]).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test('using a deleted category name works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'foo',
                            cat_group: 'group1',
                        })];
                case 2:
                    id = _c.sent();
                    return [4 /*yield*/, db.deleteCategory({ id: id })];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 4:
                    _a.apply(void 0, [(_c.sent()).length]).toBe(0);
                    return [4 /*yield*/, db.insertCategory({
                            name: 'foo',
                            cat_group: 'group1',
                        })];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, db.getCategories()];
                case 6:
                    _b.apply(void 0, [(_c.sent()).length]).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions are sorted by date', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertTransactions([
                        { date: '2018-01-05', account: 'foo', amount: -23 },
                        { date: '2018-01-02', account: 'foo', amount: -24 },
                        { date: '2018-01-04', account: 'foo', amount: 12 },
                        { date: '2018-01-01', account: 'foo', amount: 2 },
                        { date: '2018-01-03', account: 'foo', amount: -5 },
                    ])];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, getTransactions('2018-01-05')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions are sorted by starting balance flag', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: 
                // The transaction with a starting balance flag should always be
                // at the end of any transactions of the same day (it sorts by
                // date first, so any earlier transactions will be before it)
                return [4 /*yield*/, insertTransactions([
                        { date: '2018-01-05', account: 'foo', amount: -23 },
                        {
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 12,
                            starting_balance_flag: 1,
                        },
                        { date: '2018-01-03', account: 'foo', amount: -25 },
                        { date: '2018-01-03', account: 'foo', amount: -5 },
                    ])];
                case 1:
                    // The transaction with a starting balance flag should always be
                    // at the end of any transactions of the same day (it sorts by
                    // date first, so any earlier transactions will be before it)
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, getTransactions('2018-01-05')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions are sorted by sort order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: 
                // Transactions on the same day should sort by sort order descending
                return [4 /*yield*/, insertTransactions([
                        { date: '2018-01-05', account: 'foo', amount: -23, sort_order: 5 },
                        { date: '2018-01-03', account: 'foo', amount: -24, sort_order: 8 },
                        { date: '2018-01-03', account: 'foo', amount: 12, sort_order: 2 },
                        { date: '2018-01-03', account: 'foo', amount: 2, sort_order: 4 },
                        { date: '2018-01-03', account: 'foo', amount: -5, sort_order: 1 },
                    ])];
                case 1:
                    // Transactions on the same day should sort by sort order descending
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, getTransactions('2018-01-05')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions are sorted by id as a last resort', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: 
                // Transactions on the same day should sort by sort order descending
                return [4 /*yield*/, insertTransactions([
                        { date: '2018-01-05', account: 'foo', amount: -23, sort_order: 5 },
                        {
                            id: 'foo3',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: -24,
                            sort_order: 4,
                        },
                        {
                            id: 'foo1',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 12,
                            sort_order: 4,
                        },
                        {
                            id: 'foo2',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 2,
                            sort_order: 4,
                        },
                    ])];
                case 1:
                    // Transactions on the same day should sort by sort order descending
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, getTransactions('2018-01-05')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions get child transactions in the right order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: 
                // Transactions on the same day should sort by sort order descending
                return [4 /*yield*/, insertTransactions([
                        { date: '2018-01-05', account: 'foo', amount: -23, sort_order: 5 },
                        {
                            id: 'foo',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: -24,
                            sort_order: 8,
                            is_parent: true,
                        },
                        {
                            id: 'child3',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: -5,
                            sort_order: 7.97,
                            is_child: true,
                            parent_id: 'foo',
                        },
                        {
                            id: 'child1',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 12,
                            sort_order: 7.99,
                            is_child: true,
                            parent_id: 'foo',
                        },
                        {
                            id: 'child2',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 2,
                            sort_order: 7.98,
                            is_child: true,
                            parent_id: 'foo',
                        },
                    ])];
                case 1:
                    // Transactions on the same day should sort by sort order descending
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, getTransactions('2018-01-05')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions don’t show orphaned child transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insertTransactions([
                        { date: '2018-01-05', account: 'foo', amount: -23, sort_order: 5 },
                        {
                            id: 'foo/child3',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: -5,
                            sort_order: 7.97,
                            is_child: true,
                        },
                        {
                            id: 'foo/child1',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 12,
                            sort_order: 7.99,
                            is_child: true,
                        },
                        {
                            id: 'foo/child2',
                            date: '2018-01-03',
                            account: 'foo',
                            amount: 2,
                            sort_order: 7.98,
                            is_child: true,
                        },
                    ])];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, getTransactions('2018-01-05')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
    test('parent transactions never have a category', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: 'cat1',
                            name: 'cat1',
                            cat_group: 'group1',
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: 'cat2',
                            name: 'cat2',
                            cat_group: 'group1',
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, insertTransactions([
                            { date: '2018-01-05', account: 'foo', amount: -23, sort_order: 5 },
                            {
                                id: 'parent1',
                                date: '2018-01-03',
                                account: 'foo',
                                category: 'cat1',
                                amount: -24,
                                sort_order: 8,
                                is_parent: true,
                            },
                            {
                                id: 'child3',
                                date: '2018-01-03',
                                account: 'foo',
                                category: 'cat1',
                                amount: -5,
                                sort_order: 7.97,
                                is_child: true,
                                parent_id: 'parent1',
                            },
                            {
                                id: 'child2',
                                date: '2018-01-03',
                                account: 'foo',
                                category: 'cat2',
                                amount: 2,
                                sort_order: 7.98,
                                is_child: true,
                                parent_id: 'parent1',
                            },
                        ])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.getTransactions('foo')];
                case 5:
                    rows = _a.sent();
                    expect(rows.find(function (t) { return t.id === 'parent1'; }).category).toBe(null);
                    expect(rows.find(function (t) { return t.id === 'child3'; }).category).toBe('cat1');
                    expect(rows.find(function (t) { return t.id === 'child2'; }).category).toBe('cat2');
                    return [2 /*return*/];
            }
        });
    }); });
    test('child transactions never appear if parent is deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertTransactions([
                        {
                            id: 'trans1',
                            date: '2018-01-05',
                            account: 'foo',
                            amount: -23,
                            sort_order: 5,
                        },
                        {
                            id: 'parent1',
                            date: '2018-01-03',
                            account: 'foo',
                            category: 'cat1',
                            amount: -24,
                            sort_order: 8,
                            is_parent: true,
                        },
                        {
                            id: 'child3',
                            date: '2018-01-03',
                            account: 'foo',
                            category: 'cat1',
                            amount: -5,
                            sort_order: 7.97,
                            is_child: true,
                            parent_id: 'parent1',
                        },
                        {
                            id: 'child2',
                            date: '2018-01-03',
                            account: 'foo',
                            category: 'cat2',
                            amount: 2,
                            sort_order: 7.98,
                            is_child: true,
                            parent_id: 'parent1',
                        },
                    ])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.deleteTransaction({ id: 'parent1' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.getTransactions('foo')];
                case 3:
                    rows = _a.sent();
                    expect(rows.length).toBe(1);
                    expect(rows[0].id).toBe('trans1');
                    return [2 /*return*/];
            }
        });
    }); });
});
