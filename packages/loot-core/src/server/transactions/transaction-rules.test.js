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
var query_1 = require("../../shared/query");
var aql_1 = require("../aql");
var db = require("../db");
var mappings_1 = require("../db/mappings");
var transaction_rules_1 = require("./transaction-rules");
// TODO: write tests to make sure payee renaming is "pre" and category
// setting is "null" stage
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, global.emptyDatabase()()];
            case 1:
                _a.sent();
                (0, transaction_rules_1.resetState)();
                return [4 /*yield*/, (0, mappings_1.loadMappings)()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function getMatchingTransactions(conds) {
    return __awaiter(this, void 0, void 0, function () {
        var filters, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filters = (0, transaction_rules_1.conditionsToAQL)(conds).filters;
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions').filter({ $and: filters }).select('*'))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
describe('Transaction rules', function () {
    test('makeRule validates rule data', function () {
        var spy = vi.spyOn(console, 'warn').mockImplementation(function () { return null; });
        // Parse errors
        expect((0, transaction_rules_1.makeRule)({ conditions: '{', actions: '[]' })).toBe(null);
        expect((0, transaction_rules_1.makeRule)({ conditions: '[]', actions: '{' })).toBe(null);
        expect((0, transaction_rules_1.makeRule)({ conditions: '{}', actions: '{}' })).toBe(null);
        // This is valid
        expect((0, transaction_rules_1.makeRule)({ conditions: '[]', actions: '[]' })).not.toBe(null);
        // condition has invalid operator
        expect((0, transaction_rules_1.makeRule)({
            conditions: JSON.stringify([
                { op: 'noop', field: 'date', value: '2019-05' },
            ]),
            actions: JSON.stringify([
                { op: 'set', field: 'name', value: 'Sarah' },
                { op: 'set', field: 'category', value: 'Sarah' },
            ]),
        })).toBe(null);
        // setting an invalid field
        expect((0, transaction_rules_1.makeRule)({
            conditions: JSON.stringify([
                { op: 'is', field: 'date', value: '2019-05' },
            ]),
            actions: JSON.stringify([
                { op: 'set', field: 'notes', value: 'Sarah' },
                { op: 'set', field: 'invalid', value: 'Sarah' },
            ]),
        })).toBe(null);
        // condition has valid operator & setting valid fields
        expect((0, transaction_rules_1.makeRule)({
            conditions: JSON.stringify([
                { op: 'is', field: 'date', value: '2019-05' },
            ]),
            actions: JSON.stringify([
                { op: 'set', field: 'notes', value: 'Sarah' },
                { op: 'set', field: 'category', value: 'Sarah' },
            ]),
        })).not.toBe(null);
        spy.mockRestore();
    });
    test('insert a rule into the database', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, spy, _c, transaction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [],
                            actions: [],
                        })];
                case 2:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, db.all('SELECT * FROM rules')];
                case 3:
                    _a.apply(void 0, [(_d.sent()).length]).toBe(1);
                    // Make sure it was projected
                    expect((0, transaction_rules_1.getRules)().length).toBe(1);
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'date', value: '2019-05' }],
                            actions: [
                                { op: 'set', field: 'notes', value: 'Sarah' },
                                { op: 'set', field: 'category', value: 'food' },
                            ],
                        })];
                case 4:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, db.all('SELECT * FROM rules')];
                case 5:
                    _b.apply(void 0, [(_d.sent()).length]).toBe(2);
                    expect((0, transaction_rules_1.getRules)().length).toBe(2);
                    spy = vi.spyOn(console, 'warn').mockImplementation(function () { return null; });
                    // Try to insert an invalid rule (don't use `insertRule` because
                    // that will validate the input)
                    return [4 /*yield*/, db.insertWithUUID('rules', { conditions: '{', actions: '}' })];
                case 6:
                    // Try to insert an invalid rule (don't use `insertRule` because
                    // that will validate the input)
                    _d.sent();
                    // It will be in the database
                    _c = expect;
                    return [4 /*yield*/, db.all('SELECT * FROM rules')];
                case 7:
                    // It will be in the database
                    _c.apply(void 0, [(_d.sent()).length]).toBe(3);
                    // But it will be ignored
                    expect((0, transaction_rules_1.getRules)().length).toBe(2);
                    spy.mockRestore();
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            date: '2019-05-10',
                            notes: '',
                            category: null,
                        })];
                case 8:
                    transaction = _d.sent();
                    expect(transaction.date).toBe('2019-05-10');
                    expect(transaction.notes).toBe('Sarah');
                    expect(transaction.category).toBe('food');
                    return [2 /*return*/];
            }
        });
    }); });
    test('update a rule in the database', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'imported_payee', value: 'kroger' }],
                            actions: [
                                { op: 'set', field: 'notes', value: 'Sarah' },
                                { op: 'set', field: 'category', value: 'food' },
                            ],
                        })];
                case 2:
                    id = _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(1);
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            imported_payee: 'Kroger',
                            notes: '',
                            category: null,
                        })];
                case 3:
                    transaction = _a.sent();
                    expect(transaction.imported_payee).toBe('Kroger');
                    expect(transaction.notes).toBe('Sarah');
                    expect(transaction.category).toBe('food');
                    // Change the action
                    return [4 /*yield*/, (0, transaction_rules_1.updateRule)({
                            id: id,
                            actions: [{ op: 'set', field: 'category', value: 'bars' }],
                        })];
                case 4:
                    // Change the action
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(1);
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            imported_payee: 'Kroger',
                            notes: '',
                            category: null,
                        })];
                case 5:
                    transaction = _a.sent();
                    expect(transaction.imported_payee).toBe('Kroger');
                    expect(transaction.notes).toBe('');
                    expect(transaction.category).toBe('bars');
                    // If changing the condition, make sure the rule is re-indexed
                    return [4 /*yield*/, (0, transaction_rules_1.updateRule)({
                            id: id,
                            conditions: [{ op: 'is', field: 'imported_payee', value: 'ABC' }],
                        })];
                case 6:
                    // If changing the condition, make sure the rule is re-indexed
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            imported_payee: 'ABC',
                            notes: '',
                            category: null,
                        })];
                case 7:
                    transaction = _a.sent();
                    expect(transaction.category).toBe('bars');
                    expect((0, transaction_rules_1.getRules)().length).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test('delete a rule in the database', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'kroger' }],
                            actions: [
                                { op: 'set', field: 'notes', value: 'Sarah' },
                                { op: 'set', field: 'category', value: 'food' },
                            ],
                        })];
                case 2:
                    id = _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(1);
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            payee: 'Kroger',
                            notes: '',
                            category: null,
                        })];
                case 3:
                    transaction = _a.sent();
                    expect(transaction.payee).toBe('Kroger');
                    expect(transaction.category).toBe('food');
                    return [4 /*yield*/, (0, transaction_rules_1.deleteRule)(id)];
                case 4:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(0);
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            payee: 'Kroger',
                            notes: '',
                            category: null,
                        })];
                case 5:
                    transaction = _a.sent();
                    expect(transaction.payee).toBe('Kroger');
                    expect(transaction.category).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    test('loadRules loads all the rules', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [{ op: 'contains', field: 'imported_payee', value: 'lowes' }],
                            actions: [{ op: 'set', field: 'payee', value: 'lowes' }],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'post',
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'imported_payee', value: 'kroger' }],
                            actions: [{ op: 'set', field: 'notes', value: 'Sarah' }],
                        })];
                case 3:
                    _a.sent();
                    (0, transaction_rules_1.resetState)();
                    expect((0, transaction_rules_1.getRules)().length).toBe(0);
                    return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 4:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(2);
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            imported_payee: 'blah Lowes blah',
                            payee: null,
                            category: null,
                        })];
                case 5:
                    transaction = _a.sent();
                    expect(transaction.payee).toBe('lowes');
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            imported_payee: 'kroger',
                            category: null,
                        })];
                case 6:
                    transaction = _a.sent();
                    expect(transaction.notes).toBe('Sarah');
                    return [2 /*return*/];
            }
        });
    }); });
    test('ids in rules are migrated as mapping changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rule1, rule2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ id: 'home_id', name: 'home' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ id: 'lowes_id', name: 'lowes' })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({ name: 'group' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: 'food_id',
                            name: 'food',
                            cat_group: 'group',
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: 'beer_id',
                            name: 'beer',
                            cat_group: 'group',
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            id: 'one',
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [{ op: 'contains', field: 'imported_payee', value: 'lowes' }],
                            actions: [{ op: 'set', field: 'payee', value: 'lowes_id' }],
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            id: 'two',
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [
                                { op: 'is', field: 'payee', value: 'lowes_id' },
                                { op: 'is', field: 'category', value: 'food_id' },
                            ],
                            actions: [{ op: 'set', field: 'notes', value: 'Sarah' }],
                        })];
                case 8:
                    _a.sent();
                    rule1 = (0, transaction_rules_1.getRules)().find(function (r) { return r.id === 'one'; });
                    rule2 = (0, transaction_rules_1.getRules)().find(function (r) { return r.id === 'two'; });
                    expect(rule1.actions[0].value).toBe('lowes_id');
                    expect(rule2.conditions[0].value).toBe('lowes_id');
                    return [4 /*yield*/, db.mergePayees('home_id', ['lowes_id'])];
                case 9:
                    _a.sent();
                    expect(rule1.actions[0].value).toBe('home_id');
                    expect(rule2.conditions[0].value).toBe('home_id');
                    expect(rule2.conditions[1].value).toBe('food_id');
                    return [4 /*yield*/, db.deleteCategory({ id: 'food_id' }, 'beer_id')];
                case 10:
                    _a.sent();
                    expect(rule2.conditions[1].value).toBe('beer_id');
                    return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 11:
                    _a.sent();
                    // Make sure mappings work when loading fresh
                    rule1 = (0, transaction_rules_1.getRules)().find(function (r) { return r.id === 'one'; });
                    rule2 = (0, transaction_rules_1.getRules)().find(function (r) { return r.id === 'two'; });
                    expect(rule1.actions[0].value).toBe('home_id');
                    expect(rule2.conditions[0].value).toBe('home_id');
                    expect(rule2.conditions[1].value).toBe('beer_id');
                    return [2 /*return*/];
            }
        });
    }); });
    test('await runRules runs all the rules in each phase', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'post',
                            conditionsOp: 'and',
                            conditions: [
                                {
                                    op: 'oneOf',
                                    field: 'payee',
                                    value: ['kroger', 'kroger1', 'kroger2', 'kroger3', 'kroger4'],
                                },
                            ],
                            actions: [{ op: 'set', field: 'notes', value: 'got it2' }],
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'imported_payee', value: '123 kroger' }],
                            actions: [{ op: 'set', field: 'payee', value: 'kroger3' }],
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [
                                { op: 'contains', field: 'imported_payee', value: 'kroger' },
                            ],
                            actions: [{ op: 'set', field: 'payee', value: 'kroger4' }],
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'kroger4' }],
                            actions: [{ op: 'set', field: 'notes', value: 'got it' }],
                        })];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, transaction_rules_1.runRules)({
                            imported_payee: '123 kroger',
                            date: '2020-08-11',
                            amount: 50,
                        })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        date: '2020-08-11',
                        imported_payee: '123 kroger',
                        payee: 'kroger4',
                        amount: 50,
                        notes: 'got it2',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    test('transactions can be queried by rule', function () { return __awaiter(void 0, void 0, void 0, function () {
        var account, categoryGroupId, foodCategoryId, krogerId, lowesId, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ name: 'bank' })];
                case 2:
                    account = _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({ name: 'general' })];
                case 3:
                    categoryGroupId = _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'food',
                            cat_group: categoryGroupId,
                        })];
                case 4:
                    foodCategoryId = _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: 'kroger' })];
                case 5:
                    krogerId = _a.sent();
                    return [4 /*yield*/, db.insertPayee({
                            name: 'lowes',
                            category: foodCategoryId,
                        })];
                case 6:
                    lowesId = _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            id: '1',
                            date: '2020-10-01',
                            account: account,
                            payee: krogerId,
                            category: foodCategoryId,
                            notes: 'barr',
                            amount: 353,
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            id: '2',
                            date: '2020-10-15',
                            account: account,
                            payee: krogerId,
                            notes: 'fooo',
                            amount: 453,
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            id: '3',
                            date: '2020-10-15',
                            account: account,
                            payee: lowesId,
                            notes: 'FooO',
                            amount: -322,
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            id: '4',
                            date: '2020-10-16',
                            account: account,
                            payee: lowesId,
                            notes: null,
                            amount: 101,
                        })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            id: '5',
                            date: '2020-10-16',
                            account: account,
                            payee: lowesId,
                            category: foodCategoryId,
                            notes: '',
                            amount: 124,
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'date', op: 'is', value: '2020-10-15' },
                        ])];
                case 12:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['2', '3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'payee', op: 'is', value: lowesId },
                        ])];
                case 13:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['4', '5', '3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'amount', op: 'is', value: 353 },
                        ])];
                case 14:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['1']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'notes', op: 'is', value: 'FooO' },
                        ])];
                case 15:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['2', '3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'notes', op: 'contains', value: 'oo' },
                        ])];
                case 16:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['2', '3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'notes', op: 'oneOf', value: ['fooo', 'barr'] },
                        ])];
                case 17:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['2', '3', '1']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'notes', op: 'is', value: '' },
                        ])];
                case 18:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['4', '5']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'amount', op: 'gt', value: 300 },
                        ])];
                case 19:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['2', '1']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'amount', op: 'gt', value: 400 },
                            { field: 'amount', op: 'lt', value: 500 },
                        ])];
                case 20:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['2']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'amount', op: 'gt', value: 300, options: { inflow: true } },
                            { field: 'amount', op: 'lt', value: 400, options: { inflow: true } },
                        ])];
                case 21:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['1']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'amount', op: 'gt', value: -1000, options: { inflow: true } },
                        ])];
                case 22:
                    // If `inflow` is true, it should never return outflow transactions
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['4', '5', '2', '1']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'amount', op: 'gt', value: 300, options: { outflow: true } },
                        ])];
                case 23:
                    // Same thing for `outflow`: never return `inflow` transactions
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'date', op: 'gt', value: '2020-10-10' },
                        ])];
                case 24:
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['4', '5', '2', '3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'category', op: 'is', value: null },
                        ])];
                case 25:
                    //Condition special cases
                    //is category null
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['4', '2', '3']);
                    return [4 /*yield*/, getMatchingTransactions([
                            { field: 'category', op: 'isNot', value: null },
                        ])];
                case 26:
                    //category is not X
                    transactions = _a.sent();
                    expect(transactions.map(function (t) { return t.id; })).toEqual(['5', '1']);
                    return [2 /*return*/];
            }
        });
    }); });
    test('and sub expression builds $and condition', function () { return __awaiter(void 0, void 0, void 0, function () {
        var conds, filters;
        return __generator(this, function (_a) {
            conds = [{ field: 'category', op: 'is', value: null }];
            filters = (0, transaction_rules_1.conditionsToAQL)(conds).filters;
            expect(filters).toStrictEqual([
                {
                    $and: [
                        { category: { $eq: null } },
                        { transfer_id: { $eq: null } },
                        { is_parent: { $eq: false } },
                    ],
                },
            ]);
            return [2 /*return*/];
        });
    }); });
});
describe('Learning categories', function () {
    function expectCategoryRule(rule, category, expectedPayee) {
        expect(rule.conditions.length).toBe(1);
        expect(rule.conditions[0].op).toBe('is');
        expect(rule.conditions[0].field).toBe('payee');
        expect(rule.conditions[0].value).toBe(expectedPayee);
        expect(rule.actions.length).toBe(1);
        expect(rule.actions[0].op).toBe('set');
        expect(rule.actions[0].field).toBe('category');
        expect(rule.actions[0].value).toBe(category);
    }
    function insertTransaction(transaction_1, expectedCategory_1) {
        return __awaiter(this, arguments, void 0, function (transaction, expectedCategory, expectedRuleCount, expectedPayee) {
            if (expectedRuleCount === void 0) { expectedRuleCount = 1; }
            if (expectedPayee === void 0) { expectedPayee = 'foo'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insertTransaction(transaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, transaction_rules_1.updateCategoryRules)([transaction])];
                    case 2:
                        _a.sent();
                        expect((0, transaction_rules_1.getRules)().length).toBe(expectedRuleCount);
                        if (expectedRuleCount > 0) {
                            expectCategoryRule((0, transaction_rules_1.getRules)()[expectedRuleCount - 1], expectedCategory, expectedPayee);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function loadData() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db.insertAccount({ id: 'acct', name: 'acct' })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.insertCategoryGroup({ id: 'catg', name: 'catg' })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, db.insertCategory({ id: 'food', name: 'food', cat_group: 'catg' })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, db.insertCategory({ id: 'beer', name: 'beer', cat_group: 'catg' })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, db.insertCategory({ id: 'fun', name: 'fun', cat_group: 'catg' })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, db.insertPayee({ id: 'foo', name: 'foo' })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, db.insertPayee({ id: 'bar', name: 'bar' })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    test('getProbableCategory estimates a category winner', function () {
        var winner = (0, transaction_rules_1.getProbableCategory)([{ category: 'foo' }]);
        // It needs at least 3 transactions
        expect(winner).toBe(null);
        winner = (0, transaction_rules_1.getProbableCategory)([
            { category: 'foo' },
            { category: 'foo' },
            { category: 'foo' },
        ]);
        expect(winner).toBe('foo');
        winner = (0, transaction_rules_1.getProbableCategory)([
            { category: 'bar' },
            { category: 'foo' },
            { category: 'foo' },
            { category: 'foo' },
        ]);
        expect(winner).toBe('foo');
        winner = (0, transaction_rules_1.getProbableCategory)([
            { category: 'bar' },
            { category: 'bar' },
            { category: 'bar' },
            { category: 'foo' },
            { category: 'foo' },
            { category: 'foo' },
        ]);
        expect(winner).toBe('bar');
    });
    test('creates rule when inserting transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'one',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, null, 0)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'two',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, null, 0)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'three',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, 'food')];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('leaves existing rule alone if probable category is ambiguous', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'one',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, null, 0)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'two',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'beer',
                        }, null, 0)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'three',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'beer',
                        }, null, 0)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'foo' }],
                            actions: [{ op: 'set', field: 'category', value: 'fun' }],
                        })];
                case 5:
                    _a.sent();
                    // Even though the system couldn't figure out the category to set,
                    // it should leave the existing rule alone
                    return [4 /*yield*/, insertTransaction({
                            id: 'four',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'bills',
                        }, 'fun', 1)];
                case 6:
                    // Even though the system couldn't figure out the category to set,
                    // it should leave the existing rule alone
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('updates an existing rule', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'foo' }],
                            actions: [{ op: 'set', field: 'category', value: 'beer' }],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'one',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, 'beer', 1)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'two',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, 'beer', 1)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'three',
                            date: '2016-12-01',
                            account: 'acct',
                            payee: 'foo',
                            category: 'food',
                        }, 'food', 1)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('works with multiple payees', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'foo' }],
                            actions: [{ op: 'set', field: 'category', value: 'beer' }],
                        })];
                case 2:
                    _a.sent();
                    // Use a new payee, so the category should be remembered
                    return [4 /*yield*/, insertTransaction({
                            id: 'three',
                            date: '2016-12-03',
                            account: 'acct',
                            payee: 'bar',
                            category: 'fun',
                        }, 'beer', 1)];
                case 3:
                    // Use a new payee, so the category should be remembered
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'four',
                            date: '2016-12-03',
                            account: 'acct',
                            payee: 'bar',
                            category: 'fun',
                        }, 'beer', 1)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, insertTransaction({
                            id: 'five',
                            date: '2016-12-03',
                            account: 'acct',
                            payee: 'bar',
                            category: 'fun',
                        }, 'fun', 2, 'bar')];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('updates rules correctly even if multiple rules exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        var trans, rules, getPayees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'foo' }],
                            actions: [{ op: 'set', field: 'category', value: 'unknown1' }],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'foo' }],
                            actions: [{ op: 'set', field: 'category', value: 'unknown2' }],
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: null }],
                            actions: [{ op: 'set', field: 'category', value: 'beer' }],
                        })];
                case 4:
                    _a.sent();
                    trans = {
                        date: '2016-12-01',
                        account: 'acct',
                        payee: 'foo',
                        category: 'food',
                    };
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'one' }))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'two' }))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'three' }))];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.updateCategoryRules)([__assign(__assign({}, trans), { id: 'three' })])];
                case 8:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)()).toMatchSnapshot();
                    trans = {
                        date: '2016-12-02',
                        account: 'acct',
                        payee: 'foo',
                        category: 'beer',
                    };
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'four' }))];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'five' }))];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'six' }))];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.updateCategoryRules)([__assign(__assign({}, trans), { id: 'three' })])];
                case 12:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)()).toMatchSnapshot();
                    rules = (0, transaction_rules_1.getRules)();
                    getPayees = function (cat) {
                        var arr = rules
                            .filter(function (rule) { return rule.actions[0].value === cat; })
                            .map(function (r) { return r.conditions.map(function (c) { return c.value; }); });
                        return Array.prototype.concat.apply([], arr);
                    };
                    // The `foo` payee has been removed from all rules and added to
                    // the correct one
                    expect(getPayees('unknown1')).toEqual([]);
                    expect(getPayees('unknown2')).toEqual([]);
                    expect(getPayees('food')).toEqual([]);
                    expect(getPayees('beer')).toEqual(['foo', 'foo', null]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('avoids remembering categories for `null` payee', function () { return __awaiter(void 0, void 0, void 0, function () {
        var trans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(0);
                    trans = {
                        date: '2016-12-01',
                        account: 'acct',
                        payee: null,
                        category: 'food',
                    };
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'one' }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'two' }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'three' }))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.updateCategoryRules)([__assign(__assign({}, trans), { id: 'three' })])];
                case 5:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('avoids remembering categories for payees specified by the user', function () { return __awaiter(void 0, void 0, void 0, function () {
        var trans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(0);
                    return [4 /*yield*/, db.insertPayee({
                            id: 'supermarket_id',
                            name: 'supermarket',
                            learn_categories: 0,
                        })];
                case 2:
                    _a.sent();
                    trans = {
                        date: '2016-12-01',
                        account: 'acct',
                        payee: 'supermarket_id',
                        category: 'food',
                    };
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'one' }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'two' }))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'three' }))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.updateCategoryRules)([__assign(__assign({}, trans), { id: 'three' })])];
                case 6:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test('adding transaction with `null` payee never changes rules', function () { return __awaiter(void 0, void 0, void 0, function () {
        var trans, rules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadData()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'is', field: 'payee', value: 'foo' }],
                            actions: [{ op: 'set', field: 'category', value: 'unknown1' }],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                            stage: null,
                            conditionsOp: 'and',
                            conditions: [{ op: 'oneOf', field: 'payee', value: ['foo', 'bar'] }],
                            actions: [{ op: 'set', field: 'category', value: 'unknown1' }],
                        })];
                case 3:
                    _a.sent();
                    expect((0, transaction_rules_1.getRules)().length).toBe(2);
                    trans = {
                        date: '2016-12-01',
                        account: 'acct',
                        payee: null,
                        category: 'food',
                    };
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'one' }))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'two' }))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, trans), { id: 'three' }))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.updateCategoryRules)([__assign(__assign({}, trans), { id: 'three' })])];
                case 7:
                    _a.sent();
                    rules = (0, transaction_rules_1.getRules)();
                    expect(rules.length).toBe(2);
                    expect(rules[0].actions[0].value).toBe('unknown1');
                    expect(rules[1].actions[0].value).toBe('unknown1');
                    return [2 /*return*/];
            }
        });
    }); });
    test('rules are saved with internal field names', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rule, rawRule, parsedRule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, transaction_rules_1.insertRule)({
                        stage: null,
                        conditionsOp: 'and',
                        conditions: [{ op: 'is', field: 'imported_payee', value: 'foo' }],
                        actions: [{ op: 'set', field: 'payee', value: 'unknown1' }],
                    })];
                case 1:
                    _a.sent();
                    rule = (0, transaction_rules_1.getRules)()[0];
                    expect(rule.conditions[0].field).toBe('imported_payee');
                    expect(rule.actions[0].field).toBe('payee');
                    return [4 /*yield*/, db.first('SELECT * FROM rules')];
                case 2:
                    rawRule = _a.sent();
                    parsedRule = __assign(__assign({}, rawRule), { conditions: JSON.parse(rawRule.conditions), actions: JSON.parse(rawRule.actions) });
                    expect(parsedRule.conditions[0].field).toBe('imported_description');
                    expect(parsedRule.actions[0].field).toBe('description');
                    return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 3:
                    _a.sent();
                    // Make sure reloading everything from the db still uses the new
                    // public names
                    rule = (0, transaction_rules_1.getRules)()[0];
                    expect(rule.conditions[0].field).toBe('imported_payee');
                    expect(rule.actions[0].field).toBe('payee');
                    return [2 /*return*/];
            }
        });
    }); });
    test('rules with public field names are loaded correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rawRule, parsedRule, rule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertWithUUID('rules', {
                        stage: null,
                        conditions_op: 'and',
                        conditions: JSON.stringify([
                            { op: 'is', field: 'imported_payee', value: 'foo' },
                        ]),
                        actions: JSON.stringify([{ op: 'set', field: 'payee', value: 'payee1' }]),
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.first('SELECT * FROM rules')];
                case 3:
                    rawRule = _a.sent();
                    parsedRule = __assign(__assign({}, rawRule), { conditions: JSON.parse(rawRule.conditions), actions: JSON.parse(rawRule.actions) });
                    expect(parsedRule.conditions[0].field).toBe('imported_payee');
                    expect(parsedRule.actions[0].field).toBe('payee');
                    rule = (0, transaction_rules_1.getRules)()[0];
                    expect(rule.conditions[0].field).toBe('imported_payee');
                    expect(rule.actions[0].field).toBe('payee');
                    return [2 /*return*/];
            }
        });
    }); });
    // TODO: write tests for split transactions
});
