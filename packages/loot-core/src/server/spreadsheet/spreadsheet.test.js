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
var mocks_1 = require("../../mocks");
var db = require("../db");
var spreadsheet_1 = require("./spreadsheet");
beforeEach(global.emptyDatabase());
function wait(n) {
    return new Promise(function (resolve) { return setTimeout(resolve, n); });
}
function insertTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.insertAccount({ id: '1', name: 'checking', offbudget: 0 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertAccount({ id: '2', name: 'checking', offbudget: 1 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({ id: 'cat1', name: 'cat1', cat_group: 'group1' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({ id: 'cat2', name: 'cat2', cat_group: 'group1' })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction((0, mocks_1.generateTransaction)({
                            amount: -3200,
                            account: '1',
                            category: 'cat1',
                            date: '2017-01-08',
                        })[0])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction((0, mocks_1.generateTransaction)({
                            amount: -2800,
                            account: '1',
                            category: 'cat2',
                            date: '2017-01-10',
                        })[0])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction((0, mocks_1.generateTransaction)({
                            amount: -9832,
                            account: '1',
                            category: 'cat2',
                            date: '2017-01-15',
                        })[0])];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
describe('Spreadsheet', function () {
    // test('min bug', () => {
    //   const spreadsheet = new Spreadsheet(db);
    //   spreadsheet.set('g!minTest', '=min(0, number(-20000))');
    //   expect(spreadsheet.getValue('g!minTest')).toBe(-20000);
    // });
    // test('cycles are detected', () => {
    //   const spreadsheet = new Spreadsheet(db);
    //   spreadsheet.startTransaction();
    //   spreadsheet.set('g!foo', '=baz');
    //   spreadsheet.set('g!bar', '=2');
    //   spreadsheet.set('g!baz', '=foo + bar');
    //   spreadsheet.endTransaction();
    //   expect(spreadsheet.getValue('g!baz')).toBe(1);
    // });
    // test('querying transactions based on date works', async () => {
    //   const spreadsheet = new Spreadsheet(db);
    //   await insertTransactions();
    //   spreadsheet.startTransaction();
    //   spreadsheet.set(
    //     'g!foo',
    //     `=from transactions
    //      where
    //        date >= 20170101 and
    //        date <= 20170131
    //      calculate { sum(amount) }`
    //   );
    //   spreadsheet.set(
    //     'g!foo1',
    //     `=from transactions
    //      where
    //        date >= 20170101 and
    //        date <= 20170131
    //      calculate { sum(amount) } + g!foo`
    //   );
    //   spreadsheet.set(
    //     'g!foo2',
    //     `=from transactions
    //      where
    //        date >= 20170101 and
    //        date <= 20170131
    //      calculate { sum(amount) } + g!foo1`
    //   );
    //   spreadsheet.set('g!foo3', '=g!foo2 / 100');
    //   spreadsheet.set('g!foo4', '=g!foo2');
    //   spreadsheet.endTransaction();
    //   return new Promise(resolve => {
    //     spreadsheet.onFinish(() => {
    //       expect(spreadsheet.getValue('g!foo3')).toBe(-474.96);
    //       expect(spreadsheet.getValue('g!foo4')).toBe(-47496);
    //       resolve();
    //     });
    //   });
    // });
    test('querying transactions works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var spreadsheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spreadsheet = new spreadsheet_1.Spreadsheet(db);
                    return [4 /*yield*/, insertTransactions()];
                case 1:
                    _a.sent();
                    spreadsheet.startTransaction();
                    spreadsheet.set('g!foo', "=from transactions select { amount, category }");
                    spreadsheet.endTransaction();
                    return [2 /*return*/, new Promise(function (resolve) {
                            spreadsheet.onFinish(function () {
                                expect(spreadsheet.getValue('g!foo')).toMatchSnapshot();
                                resolve(undefined);
                            });
                        })];
            }
        });
    }); });
    test('querying deep join works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var spreadsheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spreadsheet = new spreadsheet_1.Spreadsheet(db);
                    return [4 /*yield*/, db.insertPayee({ name: '', transfer_acct: '1' })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertPayee({ name: '', transfer_acct: '2' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, insertTransactions()];
                case 3:
                    _a.sent();
                    spreadsheet.set('g!foo', '=from transactions where acct.offbudget = 0 and (description.transfer_acct.offbudget = null or description.transfer_acct.offbudget = 1) select { acct.offbudget, description.transfer_acct.offbudget as foo, amount }');
                    return [2 /*return*/, new Promise(function (resolve) {
                            spreadsheet.onFinish(function () {
                                expect(spreadsheet.getValue('g!foo')).toMatchSnapshot();
                                resolve(undefined);
                            });
                        })];
            }
        });
    }); });
    test('async cells work', function () {
        var spreadsheet = new spreadsheet_1.Spreadsheet();
        spreadsheet.createDynamic('foo', 'x', {
            initialValue: 1,
            run: function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, wait(100)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, 5];
                    }
                });
            }); },
        });
        spreadsheet.onFinish(function () {
            expect(spreadsheet.getValue('foo!x')).toBe(5);
        });
        expect(spreadsheet.getValue('foo!x')).toBe(1);
    });
    test('async cells work2', function () {
        var spreadsheet = new spreadsheet_1.Spreadsheet();
        spreadsheet.transaction(function () {
            spreadsheet.createDynamic('foo', 'x', {
                initialValue: 1,
                run: function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, wait(100)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, 5];
                        }
                    });
                }); },
            });
            spreadsheet.createDynamic('foo', 'y', {
                initialValue: 2,
                dependencies: ['x'],
                run: function (x) {
                    return x * 3;
                },
            });
        });
        spreadsheet.onFinish(function () {
            expect(spreadsheet.getValue('foo!x')).toBe(5);
            expect(spreadsheet.getValue('foo!y')).toBe(15);
        });
        expect(spreadsheet.getValue('foo!x')).toBe(1);
        expect(spreadsheet.getValue('foo!y')).toBe(2);
    });
});
