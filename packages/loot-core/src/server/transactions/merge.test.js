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
var db = require("../db");
var merge_1 = require("./merge");
describe('Merging fails for invalid quantity', function () {
    beforeEach(global.emptyDatabase());
    afterEach(global.emptyDatabase());
    var tests = [
        [[{}], 'one transaction'],
        [[], 'no transactions'],
        [undefined, 'undefined'],
        [[{}, {}, {}], 'three transactions'],
        [
            [{}, undefined],
            'two transactions but one is undefined',
        ],
    ];
    tests.forEach(function (_a) {
        var arr = _a[0], message = _a[1];
        return it(message, function () { return expect(function () { return (0, merge_1.mergeTransactions)(arr); }).rejects.toThrow(); });
    });
    it("fails when amounts don't match", function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: 'one',
                            date: '2025-01-01',
                            amount: 10,
                        })];
                case 2:
                    t1 = _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: 'one',
                            date: '2025-01-01',
                            amount: 12,
                        })];
                case 3:
                    t2 = _a.sent();
                    expect(function () { return (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }]); }).rejects.toThrow('Transaction amounts must match for merge');
                    return [2 /*return*/];
            }
        });
    }); });
    it("fails when transaction id doesn't exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDatabase()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            account: 'one',
                            date: '2025-01-01',
                            amount: 10,
                        })];
                case 2:
                    t1 = _a.sent();
                    expect(function () {
                        return (0, merge_1.mergeTransactions)([{ id: t1 }, { id: 'missing' }]);
                    }).rejects.toThrow('One of the provided transactions does not exist');
                    return [2 /*return*/];
            }
        });
    }); });
});
function prepareDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1', is_income: 0 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: '1',
                            name: 'cat1',
                            cat_group: 'group1',
                            is_income: 0,
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            id: '2',
                            name: 'cat2',
                            cat_group: 'group1',
                            is_income: 0,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'two', name: 'two' })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: 'three', name: 'three', offbudget: 1 })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ id: 'payee1', name: 'one' })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ id: 'payee2', name: 'two' })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ id: 'payee3', name: 'three' })];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getAllTransactions() {
    return db.all("SELECT t.*, p.name as payee_name\n       FROM v_transactions t\n       LEFT JOIN payees p ON p.id = t.payee\n       ORDER BY date DESC, amount DESC, id\n     ");
}
describe('Merging success', function () {
    beforeEach(global.emptyDatabase());
    beforeEach(prepareDatabase);
    afterEach(global.emptyDatabase());
    var transaction1 = {
        account: 'one',
        date: '2025-01-01',
        payee: 'payee1',
        notes: 'notes1',
        category: '1',
        amount: 5,
        cleared: false,
        reconciled: false,
    };
    var dbTransaction1 = {
        account: 'one',
        date: 20250101,
        payee: 'payee1',
        notes: 'notes1',
        category: '1',
        amount: 5,
        cleared: 1,
        reconciled: 1,
    };
    var transaction2 = {
        account: 'two',
        date: '2025-02-02',
        payee: 'payee2',
        notes: 'notes2',
        category: '2',
        amount: 5,
        cleared: true,
        reconciled: true,
    };
    var dbTransaction2 = {
        account: 'two',
        date: 20250202,
        payee: 'payee2',
        notes: 'notes2',
        category: '2',
        amount: 5,
        cleared: 1,
        reconciled: 1,
    };
    it('two banksynced transactions keeps older transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction1), { imported_id: 'imported_1' }))];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction2), { imported_id: 'imported_2' }))];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t1);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction1), { imported_id: 'imported_1' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('first banksynced, second manual keeps banksynced values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction1), { imported_id: 'imported_1' }))];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(transaction2)];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t1);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction1), { imported_id: 'imported_1' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('first file imported, second banksycned keeps banksynced values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction1), { imported_payee: 'payee' }))];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction2), { imported_id: 'imported_2' }))];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t2);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction2), { imported_id: 'imported_2' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('second file imported, first banksycned keeps banksynced values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction1), { imported_id: 'imported_1' }))];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction2), { imported_payee: 'payee' }))];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t1);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction1), { imported_id: 'imported_1' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('second file imported, first manual keeps file imported values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(transaction1)];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction2), { imported_payee: 'payee' }))];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t2);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction2), { imported_payee: 'payee' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('first file imported, second manual keeps file imported values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction1), { imported_payee: 'payee' }))];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(transaction2)];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t1);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction1), { imported_payee: 'payee' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('second banksynced, first manual keeps banksynced values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction(transaction1)];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(__assign(__assign({}, transaction2), { imported_id: 'imported_2' }))];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t2);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction2), { imported_id: 'imported_2' }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('missing values in keep are filled in with drop values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var t1, t2, _a, transactions;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.insertTransaction({
                        account: 'one',
                        amount: 5,
                        date: '2025-01-01',
                        imported_id: 'imported_1',
                    })];
                case 1:
                    t1 = _b.sent();
                    return [4 /*yield*/, db.insertTransaction(transaction2)];
                case 2:
                    t2 = _b.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, merge_1.mergeTransactions)([{ id: t1 }, { id: t2 }])];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe(t1);
                    return [4 /*yield*/, getAllTransactions()];
                case 4:
                    transactions = _b.sent();
                    expect(transactions.length).toBe(1);
                    expect(transactions[0]).toMatchObject(__assign(__assign({}, dbTransaction2), { 
                        // values that should be kept from t1
                        id: t1, account: 'one', amount: 5, date: 20250101, imported_id: 'imported_1' }));
                    return [2 /*return*/];
            }
        });
    }); });
});
