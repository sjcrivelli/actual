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
var crdt_1 = require("@actual-app/crdt");
var uuid_1 = require("uuid");
var util_1 = require("../mocks/util");
var connection = require("../platform/server/connection");
var fs = require("../platform/server/fs");
var monthUtils = require("../shared/months");
var budgetActions = require("./budget/actions");
var budget = require("./budget/base");
var db = require("./db");
var main_1 = require("./main");
var mutators_1 = require("./mutators");
var prefs = require("./prefs");
var sheet = require("./sheet");
vi.mock('./post');
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, global.emptyDatabase()()];
            case 1:
                _a.sent();
                (0, mutators_1.disableGlobalMutations)();
                return [2 /*return*/];
        }
    });
}); });
afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['close-budget'])];
            case 1:
                _a.sent();
                connection.resetEvents();
                (0, mutators_1.enableGlobalMutations)();
                global.currentMonth = null;
                return [2 /*return*/];
        }
    });
}); });
function createTestBudget(name) {
    return __awaiter(this, void 0, void 0, function () {
        var templatePath, budgetPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templatePath = fs.join(__dirname, '/../mocks/files', name);
                    budgetPath = fs.join(__dirname, '/../mocks/files/budgets/test-budget');
                    fs._setDocumentDir(fs.join(budgetPath, '..'));
                    return [4 /*yield*/, fs.mkdir(budgetPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.copyFile(fs.join(templatePath, 'metadata.json'), fs.join(budgetPath, 'metadata.json'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.copyFile(fs.join(templatePath, 'db.sqlite'), fs.join(budgetPath, 'db.sqlite'))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
describe('Budgets', function () {
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs._setDocumentDir(null);
                    budgetPath = fs.join(__dirname, '/../mocks/files/budgets/test-budget');
                    return [4 /*yield*/, fs.exists(budgetPath)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.removeDirRecursively(budgetPath)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    test('budget is successfully loaded', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createTestBudget('default-budget-template')];
                case 1:
                    _a.sent();
                    // Grab the clock to compare later
                    return [4 /*yield*/, db.openDatabase('test-budget')];
                case 2:
                    // Grab the clock to compare later
                    _a.sent();
                    return [4 /*yield*/, db.first('SELECT * FROM messages_clock')];
                case 3:
                    row = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['load-budget'], {
                            id: 'test-budget',
                        })];
                case 4:
                    error = (_a.sent()).error;
                    expect(error).toBe(undefined);
                    // Make sure the prefs were loaded
                    expect(prefs.getPrefs().id).toBe('test-budget');
                    // Make sure the clock has been loaded
                    expect((0, crdt_1.getClock)()).toEqual((0, crdt_1.deserializeClock)(row.clock));
                    return [2 /*return*/];
            }
        });
    }); });
    test('budget detects out of sync migrations', function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createTestBudget('default-budget-template')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.openDatabase('test-budget')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.runQuery('INSERT INTO __migrations__ (id) VALUES (1000)')];
                case 3:
                    _a.sent();
                    spy = vi.spyOn(console, 'warn').mockImplementation(function () { return null; });
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['load-budget'], {
                            id: 'test-budget',
                        })];
                case 4:
                    error = (_a.sent()).error;
                    // There should be an error and the budget should be unloaded
                    expect(error).toBe('out-of-sync-migrations');
                    expect(db.getDatabase()).toBe(null);
                    expect(prefs.getPrefs()).toBe(null);
                    spy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Accounts', function () {
    test('Transfers are properly updated', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, differ, _a, transaction, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db.insertAccount({ id: 'one', name: 'one' })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertAccount({ id: 'two', name: 'two' })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertAccount({ id: 'three', name: 'three' })];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertPayee({
                                            id: 'transfer-one',
                                            name: '',
                                            transfer_acct: 'one',
                                        })];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertPayee({
                                            id: 'transfer-two',
                                            name: '',
                                            transfer_acct: 'two',
                                        })];
                                case 5:
                                    _a.sent();
                                    return [4 /*yield*/, db.insertPayee({
                                            id: 'transfer-three',
                                            name: '',
                                            transfer_acct: 'three',
                                        })];
                                case 6:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _j.sent();
                    id = 'test-transfer';
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['transaction-add'], {
                            id: id,
                            account: 'one',
                            amount: 5000,
                            payee: 'transfer-two',
                            date: '2017-01-01',
                        })];
                case 2:
                    _j.sent();
                    _a = util_1.expectSnapshotWithDiffer;
                    return [4 /*yield*/, db.all('SELECT * FROM transactions')];
                case 3:
                    differ = _a.apply(void 0, [_j.sent()]);
                    return [4 /*yield*/, db.getTransaction(id)];
                case 4:
                    transaction = _j.sent();
                    _b = mutators_1.runHandler;
                    _c = [main_1.handlers['transaction-update']];
                    _d = [{}];
                    return [4 /*yield*/, db.getTransaction(id)];
                case 5: return [4 /*yield*/, _b.apply(void 0, _c.concat([__assign.apply(void 0, [__assign.apply(void 0, _d.concat([(_j.sent())])), { payee: 'transfer-three', date: '2017-01-03' }])]))];
                case 6:
                    _j.sent();
                    _f = (_e = differ).expectToMatchDiff;
                    return [4 /*yield*/, db.all('SELECT * FROM transactions')];
                case 7:
                    _f.apply(_e, [_j.sent()]);
                    return [4 /*yield*/, db.getTransaction(id)];
                case 8:
                    transaction = _j.sent();
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['transaction-delete'], transaction)];
                case 9:
                    _j.sent();
                    _h = (_g = differ).expectToMatchDiff;
                    return [4 /*yield*/, db.all('SELECT * FROM transactions')];
                case 10:
                    _h.apply(_g, [_j.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Budget', function () {
    test('new budgets should be created', function () { return __awaiter(void 0, void 0, void 0, function () {
        var spreadsheet, bounds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    spreadsheet = _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, db.insertCategoryGroup({
                                            id: 'incomeGroup',
                                            name: 'incomeGroup',
                                            is_income: 1,
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({ name: 'foo', cat_group: 'group1' })];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({ name: 'bar', cat_group: 'group1' })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['get-budget-bounds'])];
                case 3:
                    bounds = _a.sent();
                    expect(bounds.start).toBe('2016-10');
                    expect(bounds.end).toBe('2018-01');
                    expect(spreadsheet.meta().createdMonths).toMatchSnapshot();
                    // Add a transaction (which needs an account) earlier then the
                    // current earliest budget to test if it creates the necessary
                    // budgets for the earlier months
                    return [4 /*yield*/, db.runQuery("INSERT INTO accounts (id, name) VALUES ('one', 'boa')")];
                case 4:
                    // Add a transaction (which needs an account) earlier then the
                    // current earliest budget to test if it creates the necessary
                    // budgets for the earlier months
                    _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['transaction-add'], {
                            id: (0, uuid_1.v4)(),
                            date: '2016-05-06',
                            amount: 50,
                            account: 'one',
                        })];
                case 5:
                    _a.sent();
                    // Fast-forward in time to a future month and make sure it creates
                    // budgets for the months in the future
                    global.currentMonth = '2017-02';
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['get-budget-bounds'])];
                case 6:
                    bounds = _a.sent();
                    expect(bounds.start).toBe('2016-02');
                    expect(bounds.end).toBe('2018-02');
                    expect(spreadsheet.meta().createdMonths).toMatchSnapshot();
                    return [4 /*yield*/, new Promise(function (resolve) { return spreadsheet.onFinish(resolve); })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('budget updates when changing a category', function () { return __awaiter(void 0, void 0, void 0, function () {
        function captureChangedCells(func) {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var changed, remove;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            changed = [];
                            remove = spreadsheet.addEventListener('change', function (_a) {
                                var names = _a.names;
                                changed = changed.concat(names);
                            });
                            return [4 /*yield*/, func()];
                        case 1:
                            _a.sent();
                            remove();
                            spreadsheet.onFinish(function () {
                                resolve(changed);
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        var spreadsheet, categories, trans, changed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    spreadsheet = _a.sent();
                    // Force the system to start tracking these months so budgets are
                    // automatically updated when adding/deleting categories
                    return [4 /*yield*/, db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
                            '2017-01',
                        ])];
                case 2:
                    // Force the system to start tracking these months so budgets are
                    // automatically updated when adding/deleting categories
                    _a.sent();
                    return [4 /*yield*/, db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
                            '2017-02',
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
                            '2017-03',
                        ])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.runQuery('INSERT INTO created_budgets (month) VALUES (?)', [
                            '2017-04',
                        ])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, captureChangedCells(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, mutators_1.runMutator)(function () {
                                            return db.insertCategoryGroup({ id: 'group1', name: 'group1' });
                                        })];
                                    case 1:
                                        _b.sent();
                                        return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                                                name: 'foo',
                                                groupId: 'group1',
                                            })];
                                    case 2:
                                        _a = [
                                            _b.sent()
                                        ];
                                        return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                                                name: 'bar',
                                                groupId: 'group1',
                                            })];
                                    case 3:
                                        _a = _a.concat([
                                            _b.sent()
                                        ]);
                                        return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                                                name: 'baz',
                                                groupId: 'group1',
                                            })];
                                    case 4:
                                        _a = _a.concat([
                                            _b.sent()
                                        ]);
                                        return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-create'], {
                                                name: 'biz',
                                                groupId: 'group1',
                                            })];
                                    case 5:
                                        categories = _a.concat([
                                            _b.sent()
                                        ]);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.runQuery("INSERT INTO accounts (id, name) VALUES ('boa', 'boa')")];
                case 7:
                    _a.sent();
                    trans = {
                        id: 'boa-transaction',
                        date: '2017-02-06',
                        amount: 5000,
                        account: 'boa',
                        category: categories[0],
                    };
                    return [4 /*yield*/, captureChangedCells(function () {
                            return (0, mutators_1.runHandler)(main_1.handlers['transaction-add'], trans);
                        })];
                case 8:
                    changed = _a.sent();
                    expect(changed.sort()).toMatchSnapshot();
                    return [4 /*yield*/, captureChangedCells(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _a = mutators_1.runHandler;
                                        _b = [main_1.handlers['transaction-update']];
                                        _c = [{}];
                                        return [4 /*yield*/, db.getTransaction(trans.id)];
                                    case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([__assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_d.sent())])), { amount: 7000 }])]))];
                                    case 2:
                                        _d.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 9:
                    // Test updates
                    changed = _a.sent();
                    expect(changed.sort()).toMatchSnapshot();
                    return [4 /*yield*/, captureChangedCells(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['transaction-delete'], { id: trans.id })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 10:
                    // Test deletions
                    changed = _a.sent();
                    expect(changed.sort()).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Categories', function () {
    test('can be deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({ id: 'foo', name: 'foo', cat_group: 'group1' })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({ id: 'bar', name: 'bar', cat_group: 'group1' })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.getCategories()];
                case 3:
                    categories = _a.sent();
                    expect(categories.length).toBe(2);
                    expect(categories.find(function (cat) { return cat.name === 'foo'; })).not.toBeNull();
                    expect(categories.find(function (cat) { return cat.name === 'bar'; })).not.toBeNull();
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-delete'], { id: 'foo' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.getCategories()];
                case 5:
                    categories = _a.sent();
                    expect(categories.length).toBe(1);
                    expect(categories.find(function (cat) { return cat.name === 'bar'; })).not.toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    test('transfers properly when deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transId, sheetName, trans, error, categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1b', name: 'group1b' })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategoryGroup({
                                                id: 'group2',
                                                name: 'group2',
                                                is_income: 1,
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({ id: 'foo', name: 'foo', cat_group: 'group1' })];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({ id: 'bar', name: 'bar', cat_group: 'group1b' })];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({
                                                id: 'income1',
                                                name: 'income1',
                                                is_income: 1,
                                                cat_group: 'group2',
                                            })];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertCategory({
                                                id: 'income2',
                                                name: 'income2',
                                                is_income: 1,
                                                cat_group: 'group2',
                                            })];
                                    case 7:
                                        _a.sent();
                                        return [4 /*yield*/, db.insertTransaction({
                                                date: '2017-01-01',
                                                account: 'acct',
                                                amount: 4500,
                                                category: 'foo',
                                            })];
                                    case 8: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2:
                    transId = _a.sent();
                    return [4 /*yield*/, budget.createAllBudgets()];
                case 3:
                    _a.sent();
                    sheetName = monthUtils.sheetForMonth('2018-01');
                    return [4 /*yield*/, budgetActions.setBudget({
                            category: 'foo',
                            month: '2018-01',
                            amount: 1000,
                        })];
                case 4:
                    _a.sent();
                    expect(sheet.getCellValue(sheetName, 'group-budget-group1')).toBe(1000);
                    expect(sheet.getCellValue(sheetName, 'group-budget-group1b')).toBe(0);
                    return [4 /*yield*/, db.getTransaction(transId)];
                case 5:
                    trans = _a.sent();
                    expect(trans.category).toBe('foo');
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-delete'], {
                            id: 'foo',
                            transferId: 'bar',
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.getTransaction(transId)];
                case 7:
                    // Make sure the transaction has been updated
                    trans = _a.sent();
                    expect(trans.category).toBe('bar');
                    // Make sure the budget value was transferred
                    expect(sheet.getCellValue(sheetName, 'group-budget-group1')).toBe(0);
                    expect(sheet.getCellValue(sheetName, 'group-budget-group1b')).toBe(1000);
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-delete'], {
                            id: 'income1',
                            transferId: 'bar',
                        })];
                case 8:
                    error = (_a.sent()).error;
                    expect(error).toBe('category-type');
                    return [4 /*yield*/, db.getCategories()];
                case 9:
                    categories = _a.sent();
                    expect(categories.find(function (cat) { return cat.id === 'income1'; })).toBeDefined();
                    // Make sure you can delete income categories
                    return [4 /*yield*/, (0, mutators_1.runHandler)(main_1.handlers['category-delete'], {
                            id: 'income1',
                            transferId: 'income2',
                        })];
                case 10:
                    // Make sure you can delete income categories
                    _a.sent();
                    return [4 /*yield*/, db.getCategories()];
                case 11:
                    categories = _a.sent();
                    expect(categories.find(function (cat) { return cat.id === 'income1'; })).not.toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
