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
var uuid_1 = require("uuid");
var query_1 = require("../../shared/query");
var transactions_1 = require("../../shared/transactions");
var db = require("../db");
var aql = require("./exec");
var schema_1 = require("./schema");
beforeEach(global.emptyDatabase());
function repeat(arr, times) {
    var result = [];
    for (var i = 0; i < times; i++) {
        result = result.concat(arr);
    }
    return result;
}
function compileAndRunAqlQuery(query, options) {
    return aql.compileAndRunAqlQuery(schema_1.schema, schema_1.schemaConfig, query, options);
}
function insertTransactions() {
    return __awaiter(this, arguments, void 0, function (repeatTimes) {
        var transactions, group, i, cat1, cat2, parent_1, parent2, _i, transactions_2, trans;
        if (repeatTimes === void 0) { repeatTimes = 1; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactions = [];
                    return [4 /*yield*/, db.insertCategoryGroup({ name: 'group' })];
                case 1:
                    group = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < repeatTimes)) return [3 /*break*/, 6];
                    return [4 /*yield*/, db.insertCategory({
                            id: 'cat' + i + 'a',
                            name: 'cat' + i + 'a',
                            cat_group: group,
                        })];
                case 3:
                    cat1 = _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: 'cat' + i + 'b',
                            name: 'cat' + i + 'b',
                            cat_group: group,
                        })];
                case 4:
                    cat2 = _a.sent();
                    parent_1 = {
                        id: (0, uuid_1.v4)(),
                        account: 'acct',
                        date: '2020-01-04',
                        amount: -100,
                        is_parent: true,
                    };
                    parent2 = {
                        id: (0, uuid_1.v4)(),
                        account: 'acct',
                        date: '2020-01-01',
                        amount: -89,
                        is_parent: true,
                    };
                    transactions = transactions.concat([
                        parent_1,
                        (0, transactions_1.makeChild)(parent_1, { amount: -20, category: cat1 }),
                        (0, transactions_1.makeChild)(parent_1, { amount: -5, category: cat1 }),
                        (0, transactions_1.makeChild)(parent_1, { amount: -30, category: cat1 }),
                        (0, transactions_1.makeChild)(parent_1, { amount: -45, category: cat2 }),
                        parent2,
                        (0, transactions_1.makeChild)(parent2, { amount: -9, category: cat2 }),
                        (0, transactions_1.makeChild)(parent2, { amount: -80, category: cat1 }),
                        { account: 'acct', date: '2020-01-03', amount: -53, category: cat1 },
                    ]);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 2];
                case 6:
                    _i = 0, transactions_2 = transactions;
                    _a.label = 7;
                case 7:
                    if (!(_i < transactions_2.length)) return [3 /*break*/, 10];
                    trans = transactions_2[_i];
                    return [4 /*yield*/, db.insertTransaction(trans)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: return [2 /*return*/];
            }
        });
    });
}
describe('compileAndRunQuery', function () {
    it('converts output types', function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertTransactions()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions').select('date').serialize())];
                case 2:
                    data = (_a.sent()).data;
                    expect(data[0].date).toBe('2020-01-04');
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .select({ month: { $month: '$date' } })
                            .serialize())];
                case 3:
                    // date-month
                    data = (_a.sent()).data;
                    expect(data[0].month).toBe('2020-01');
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .select({ year: { $year: '$date' } })
                            .serialize())];
                case 4:
                    // date-year
                    data = (_a.sent()).data;
                    expect(data[0].year).toBe('2020');
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions').select(['is_child', 'is_parent']).raw().serialize())];
                case 5:
                    // boolean
                    data = (_a.sent()).data;
                    expect(data[0].is_child).toBe(false);
                    expect(data[0].is_parent).toBe(true);
                    expect(data[1].is_child).toBe(true);
                    expect(data[1].is_parent).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('provides named parameters and converts types', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transId, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transId = (0, uuid_1.v4)();
                    return [4 /*yield*/, db.insertTransaction({
                            id: transId,
                            account: 'acct',
                            date: '2020-01-01',
                            amount: -5001,
                            cleared: true,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ amount: { $lt: { $neg: ':amount' } } })
                            .select()
                            .serialize(), { params: { amount: 5000 } })];
                case 2:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transId);
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ date: { $transform: '$month', $eq: { $month: ':month' } } })
                            .select('date')
                            .serialize(), { params: { month: '2020-01-02' } })];
                case 3:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transId);
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ date: { $transform: '$year', $eq: { $year: ':month' } } })
                            .select('date')
                            .serialize(), { params: { month: '2020-01-02' } })];
                case 4:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transId);
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ cleared: ':cleared' })
                            .select('date')
                            .serialize(), { params: { cleared: true } })];
                case 5:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transId);
                    return [2 /*return*/];
            }
        });
    }); });
    it('allows null as a parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transNoCat, transCat, transCat2, queryState, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group', name: 'group' })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({ id: 'cat', name: 'cat', cat_group: 'group' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({ id: 'cat2', name: 'cat2', cat_group: 'group' })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: 'acct',
                            date: '2020-01-01',
                            amount: -5001,
                            category: null,
                        })];
                case 4:
                    transNoCat = _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: 'acct',
                            date: '2020-01-01',
                            amount: -5001,
                            category: 'cat',
                        })];
                case 5:
                    transCat = _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: 'acct',
                            date: '2020-01-02',
                            amount: -5001,
                            category: 'cat2',
                        })];
                case 6:
                    transCat2 = _a.sent();
                    queryState = (0, query_1.q)('transactions')
                        .filter({ category: ':category' })
                        .select()
                        .serialize();
                    return [4 /*yield*/, compileAndRunAqlQuery(queryState, {
                            params: { category: null },
                        })];
                case 7:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transNoCat);
                    return [4 /*yield*/, compileAndRunAqlQuery(queryState, { params: { category: 'cat' } })];
                case 8:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transCat);
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ category: { $ne: ':category' } })
                            .select('category')
                            .serialize(), { params: { category: 'cat2' } })];
                case 9:
                    data = (_a.sent()).data;
                    expect(data).toHaveLength(2);
                    expect(data).toEqual(expect.arrayContaining([
                        expect.objectContaining({ id: transNoCat }),
                        expect.objectContaining({ id: transCat }),
                        expect.not.objectContaining({ id: transCat2 }),
                    ]));
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ category: { $ne: ':category' } })
                            .select('category')
                            .serialize(), { params: { category: null } })];
                case 10:
                    data = (_a.sent()).data;
                    expect(data).toHaveLength(2);
                    expect(data).toEqual(expect.arrayContaining([
                        expect.not.objectContaining({ id: transNoCat }),
                        expect.objectContaining({ id: transCat }),
                        expect.objectContaining({ id: transCat2 }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    it('parameters have the correct order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transId, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transId = (0, uuid_1.v4)();
                    return [4 /*yield*/, db.insertTransaction({
                            id: transId,
                            account: 'acct',
                            date: '2020-01-01',
                            amount: -5001,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({
                            amount: { $lt: { $neg: ':amount' } },
                            date: [{ $lte: ':date' }, { $gte: ':date' }],
                        })
                            .select()
                            .serialize(), { params: { amount: 5000, date: '2020-01-01' } })];
                case 2:
                    data = (_a.sent()).data;
                    expect(data[0].id).toBe(transId);
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetches all data required for $oneof', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rows, ids, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, insertTransactions()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.all('SELECT id FROM transactions WHERE amount < -50')];
                case 2:
                    rows = _a.sent();
                    ids = rows.slice(0, 3).map(function (row) { return row.id; });
                    ids.sort();
                    return [4 /*yield*/, compileAndRunAqlQuery((0, query_1.q)('transactions')
                            .filter({ id: { $oneof: repeat(ids, 1000) }, amount: { $lt: 50 } })
                            .select('id')
                            .raw()
                            .serialize())];
                case 3:
                    data = (_a.sent()).data;
                    expect(data.map(function (row) { return row.id; }).sort()).toEqual(ids);
                    return [2 /*return*/];
            }
        });
    }); });
});
