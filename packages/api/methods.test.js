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
var fs = require("fs/promises");
var path = require("path");
var api = require("./index");
var budgetName = 'test-budget';
global.IS_TESTING = true;
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    var budgetPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                budgetPath = path.join(__dirname, '/mocks/budgets/', budgetName);
                return [4 /*yield*/, fs.rm(budgetPath, { force: true, recursive: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, createTestBudget('default-budget-template', budgetName)];
            case 2:
                _a.sent();
                return [4 /*yield*/, api.init({
                        dataDir: path.join(__dirname, '/mocks/budgets/'),
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.currentMonth = null;
                return [4 /*yield*/, api.shutdown()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function createTestBudget(templateName, name) {
    return __awaiter(this, void 0, void 0, function () {
        var templatePath, budgetPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templatePath = path.join(__dirname, '/../loot-core/src/mocks/files', templateName);
                    budgetPath = path.join(__dirname, '/mocks/budgets/', name);
                    return [4 /*yield*/, fs.mkdir(budgetPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.copyFile(path.join(templatePath, 'metadata.json'), path.join(budgetPath, 'metadata.json'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.copyFile(path.join(templatePath, 'db.sqlite'), path.join(budgetPath, 'db.sqlite'))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
describe('API setup and teardown', function () {
    // apis: loadBudget, getBudgetMonths
    test('successfully loads budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, expect(api.loadBudget(budgetName)).resolves.toBeUndefined()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, expect(api.getBudgetMonths()).resolves.toMatchSnapshot()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('API CRUD operations', function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // load test budget
                return [4 /*yield*/, api.loadBudget(budgetName)];
                case 1:
                    // load test budget
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // api: getBudgets
    test('getBudgets', function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getBudgets()];
                case 1:
                    budgets = _a.sent();
                    expect(budgets).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: 'test-budget',
                            name: 'Default Test Db',
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    // apis: getCategoryGroups, createCategoryGroup, updateCategoryGroup, deleteCategoryGroup
    test('CategoryGroups: successfully update category groups', function () { return __awaiter(void 0, void 0, void 0, function () {
        var month, groups, mainGroupId, budgetMonth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    month = '2023-10';
                    global.currentMonth = month;
                    return [4 /*yield*/, api.getCategoryGroups()];
                case 1:
                    groups = _a.sent();
                    expect(groups).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            hidden: false,
                            id: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                            is_income: false,
                            name: 'Usual Expenses',
                        }),
                        expect.objectContaining({
                            hidden: false,
                            id: 'a137772f-cf2f-4089-9432-822d2ddc1466',
                            is_income: false,
                            name: 'Investments and Savings',
                        }),
                        expect.objectContaining({
                            hidden: false,
                            id: '2E1F5BDB-209B-43F9-AF2C-3CE28E380C00',
                            is_income: true,
                            name: 'Income',
                        }),
                    ]));
                    return [4 /*yield*/, api.createCategoryGroup({
                            name: 'test-group',
                        })];
                case 2:
                    mainGroupId = _a.sent();
                    return [4 /*yield*/, api.getBudgetMonth(month)];
                case 3:
                    budgetMonth = _a.sent();
                    expect(budgetMonth.categoryGroups).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: mainGroupId,
                        }),
                    ]));
                    // update group
                    return [4 /*yield*/, api.updateCategoryGroup(mainGroupId, {
                            name: 'update-tests',
                        })];
                case 4:
                    // update group
                    _a.sent();
                    return [4 /*yield*/, api.getBudgetMonth(month)];
                case 5:
                    budgetMonth = _a.sent();
                    expect(budgetMonth.categoryGroups).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: mainGroupId,
                        }),
                    ]));
                    // delete group
                    return [4 /*yield*/, api.deleteCategoryGroup(mainGroupId)];
                case 6:
                    // delete group
                    _a.sent();
                    return [4 /*yield*/, api.getBudgetMonth(month)];
                case 7:
                    budgetMonth = _a.sent();
                    expect(budgetMonth.categoryGroups).toEqual(expect.arrayContaining([
                        expect.not.objectContaining({
                            id: mainGroupId,
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    // apis: createCategory, getCategories, updateCategory, deleteCategory
    test('Categories: successfully update categories', function () { return __awaiter(void 0, void 0, void 0, function () {
        var month, mainGroupId, secondaryGroupId, categoryId, categoryIdHidden, categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    month = '2023-10';
                    global.currentMonth = month;
                    return [4 /*yield*/, api.createCategoryGroup({
                            name: 'test-group',
                        })];
                case 1:
                    mainGroupId = _a.sent();
                    return [4 /*yield*/, api.createCategoryGroup({
                            name: 'test-secondary-group',
                        })];
                case 2:
                    secondaryGroupId = _a.sent();
                    return [4 /*yield*/, api.createCategory({
                            name: 'test-budget',
                            group_id: mainGroupId,
                        })];
                case 3:
                    categoryId = _a.sent();
                    return [4 /*yield*/, api.createCategory({
                            name: 'test-budget-hidden',
                            group_id: mainGroupId,
                            hidden: true,
                        })];
                case 4:
                    categoryIdHidden = _a.sent();
                    return [4 /*yield*/, api.getCategories()];
                case 5:
                    categories = _a.sent();
                    expect(categories).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: categoryId,
                            name: 'test-budget',
                            hidden: false,
                            group_id: mainGroupId,
                        }),
                        expect.objectContaining({
                            id: categoryIdHidden,
                            name: 'test-budget-hidden',
                            hidden: true,
                            group_id: mainGroupId,
                        }),
                    ]));
                    // update/move category
                    return [4 /*yield*/, api.updateCategory(categoryId, {
                            name: 'updated-budget',
                            group_id: secondaryGroupId,
                        })];
                case 6:
                    // update/move category
                    _a.sent();
                    return [4 /*yield*/, api.updateCategory(categoryIdHidden, {
                            name: 'updated-budget-hidden',
                            group_id: secondaryGroupId,
                            hidden: false,
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, api.getCategories()];
                case 8:
                    categories = _a.sent();
                    expect(categories).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: categoryId,
                            name: 'updated-budget',
                            hidden: false,
                            group_id: secondaryGroupId,
                        }),
                        expect.objectContaining({
                            id: categoryIdHidden,
                            name: 'updated-budget-hidden',
                            hidden: false,
                            group_id: secondaryGroupId,
                        }),
                    ]));
                    // delete categories
                    return [4 /*yield*/, api.deleteCategory(categoryId)];
                case 9:
                    // delete categories
                    _a.sent();
                    expect(categories).toEqual(expect.arrayContaining([
                        expect.not.objectContaining({
                            id: categoryId,
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    // apis: setBudgetAmount, setBudgetCarryover, getBudgetMonth
    test('Budgets: successfully update budgets', function () { return __awaiter(void 0, void 0, void 0, function () {
        var month, groupId, categoryId, budgetMonth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    month = '2023-10';
                    global.currentMonth = month;
                    return [4 /*yield*/, api.createCategoryGroup({
                            name: 'tests',
                        })];
                case 1:
                    groupId = _a.sent();
                    return [4 /*yield*/, api.createCategory({
                            name: 'test-budget',
                            group_id: groupId,
                        })];
                case 2:
                    categoryId = _a.sent();
                    return [4 /*yield*/, api.setBudgetAmount(month, categoryId, 100)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, api.setBudgetCarryover(month, categoryId, true)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, api.getBudgetMonth(month)];
                case 5:
                    budgetMonth = _a.sent();
                    expect(budgetMonth.categoryGroups).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: groupId,
                            categories: expect.arrayContaining([
                                expect.objectContaining({
                                    id: categoryId,
                                    budgeted: 100,
                                    carryover: true,
                                }),
                            ]),
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    //apis: createAccount, getAccounts, updateAccount, closeAccount, deleteAccount, reopenAccount, getAccountBalance
    test('Accounts: successfully complete account operators', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountId1, accountId2, accounts, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, api.createAccount({ name: 'test-account1', offbudget: true }, 1000)];
                case 1:
                    accountId1 = _c.sent();
                    return [4 /*yield*/, api.createAccount({ name: 'test-account2' }, 0)];
                case 2:
                    accountId2 = _c.sent();
                    return [4 /*yield*/, api.getAccounts()];
                case 3:
                    accounts = _c.sent();
                    // accounts successfully created
                    expect(accounts).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: accountId1,
                            name: 'test-account1',
                            offbudget: true,
                        }),
                        expect.objectContaining({ id: accountId2, name: 'test-account2' }),
                    ]));
                    _a = expect;
                    return [4 /*yield*/, api.getAccountBalance(accountId1)];
                case 4:
                    _a.apply(void 0, [_c.sent()]).toEqual(1000);
                    _b = expect;
                    return [4 /*yield*/, api.getAccountBalance(accountId2)];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toEqual(0);
                    return [4 /*yield*/, api.updateAccount(accountId1, { offbudget: false })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, api.closeAccount(accountId1, accountId2, null)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, api.deleteAccount(accountId2)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, api.getAccounts()];
                case 9:
                    // accounts successfully updated, and one of them deleted
                    accounts = _c.sent();
                    expect(accounts).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: accountId1,
                            name: 'test-account1',
                            closed: true,
                            offbudget: false,
                        }),
                        expect.not.objectContaining({ id: accountId2 }),
                    ]));
                    return [4 /*yield*/, api.reopenAccount(accountId1)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, api.getAccounts()];
                case 11:
                    // the non-deleted account is reopened
                    accounts = _c.sent();
                    expect(accounts).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: accountId1,
                            name: 'test-account1',
                            closed: false,
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    // apis: createPayee, getPayees, updatePayee, deletePayee
    test('Payees: successfully update payees', function () { return __awaiter(void 0, void 0, void 0, function () {
        var payeeId1, payeeId2, payees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.createPayee({ name: 'test-payee1' })];
                case 1:
                    payeeId1 = _a.sent();
                    return [4 /*yield*/, api.createPayee({ name: 'test-payee2' })];
                case 2:
                    payeeId2 = _a.sent();
                    return [4 /*yield*/, api.getPayees()];
                case 3:
                    payees = _a.sent();
                    // payees successfully created
                    expect(payees).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: payeeId1,
                            name: 'test-payee1',
                        }),
                        expect.objectContaining({
                            id: payeeId2,
                            name: 'test-payee2',
                        }),
                    ]));
                    return [4 /*yield*/, api.updatePayee(payeeId1, { name: 'test-updated-payee' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, api.deletePayee(payeeId2)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, api.getPayees()];
                case 6:
                    // confirm update and delete were successful
                    payees = _a.sent();
                    expect(payees).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            id: payeeId1,
                            name: 'test-updated-payee',
                        }),
                        expect.not.objectContaining({
                            name: 'test-payee1',
                        }),
                        expect.not.objectContaining({
                            id: payeeId2,
                        }),
                    ]));
                    return [2 /*return*/];
            }
        });
    }); });
    // apis: getRules, getPayeeRules, createRule, updateRule, deleteRule
    test('Rules: successfully update rules', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rule, rule2, rules, _a, _b, updatedRule, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, api.createPayee({ name: 'test-payee' })];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, api.createPayee({ name: 'test-payee2' })];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, api.createRule({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [
                                {
                                    field: 'payee',
                                    op: 'is',
                                    value: 'test-payee',
                                },
                            ],
                            actions: [
                                {
                                    op: 'set',
                                    field: 'category',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                },
                            ],
                        })];
                case 3:
                    rule = _g.sent();
                    return [4 /*yield*/, api.createRule({
                            stage: 'pre',
                            conditionsOp: 'and',
                            conditions: [
                                {
                                    field: 'payee',
                                    op: 'is',
                                    value: 'test-payee2',
                                },
                            ],
                            actions: [
                                {
                                    op: 'set',
                                    field: 'category',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                },
                            ],
                        })];
                case 4:
                    rule2 = _g.sent();
                    return [4 /*yield*/, api.getRules()];
                case 5:
                    rules = _g.sent();
                    expect(rules).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            actions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'category',
                                    op: 'set',
                                    type: 'id',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                }),
                            ]),
                            conditions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'payee',
                                    op: 'is',
                                    type: 'id',
                                    value: 'test-payee2',
                                }),
                            ]),
                            conditionsOp: 'and',
                            id: rule2.id,
                            stage: 'pre',
                        }),
                        expect.objectContaining({
                            actions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'category',
                                    op: 'set',
                                    type: 'id',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                }),
                            ]),
                            conditions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'payee',
                                    op: 'is',
                                    type: 'id',
                                    value: 'test-payee',
                                }),
                            ]),
                            conditionsOp: 'and',
                            id: rule.id,
                            stage: 'pre',
                        }),
                    ]));
                    // get by payee
                    _a = expect;
                    return [4 /*yield*/, api.getPayeeRules('test-payee')];
                case 6:
                    // get by payee
                    _a.apply(void 0, [_g.sent()]).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            actions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'category',
                                    op: 'set',
                                    type: 'id',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                }),
                            ]),
                            conditions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'payee',
                                    op: 'is',
                                    type: 'id',
                                    value: 'test-payee',
                                }),
                            ]),
                            conditionsOp: 'and',
                            id: rule.id,
                            stage: 'pre',
                        }),
                    ]));
                    _b = expect;
                    return [4 /*yield*/, api.getPayeeRules('test-payee2')];
                case 7:
                    _b.apply(void 0, [_g.sent()]).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            actions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'category',
                                    op: 'set',
                                    type: 'id',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                }),
                            ]),
                            conditions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'payee',
                                    op: 'is',
                                    type: 'id',
                                    value: 'test-payee2',
                                }),
                            ]),
                            conditionsOp: 'and',
                            id: rule2.id,
                            stage: 'pre',
                        }),
                    ]));
                    updatedRule = __assign(__assign({}, rule), { stage: 'post', conditionsOp: 'or' });
                    _c = expect;
                    return [4 /*yield*/, api.updateRule(updatedRule)];
                case 8:
                    _c.apply(void 0, [_g.sent()]).toEqual(updatedRule);
                    _d = expect;
                    return [4 /*yield*/, api.getRules()];
                case 9:
                    _d.apply(void 0, [_g.sent()]).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            actions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'category',
                                    op: 'set',
                                    type: 'id',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                }),
                            ]),
                            conditions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'payee',
                                    op: 'is',
                                    type: 'id',
                                    value: 'test-payee',
                                }),
                            ]),
                            conditionsOp: 'or',
                            id: rule.id,
                            stage: 'post',
                        }),
                        expect.objectContaining({
                            actions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'category',
                                    op: 'set',
                                    type: 'id',
                                    value: 'fc3825fd-b982-4b72-b768-5b30844cf832',
                                }),
                            ]),
                            conditions: expect.arrayContaining([
                                expect.objectContaining({
                                    field: 'payee',
                                    op: 'is',
                                    type: 'id',
                                    value: 'test-payee2',
                                }),
                            ]),
                            conditionsOp: 'and',
                            id: rule2.id,
                            stage: 'pre',
                        }),
                    ]));
                    // delete rules
                    return [4 /*yield*/, api.deleteRule(rules[1].id)];
                case 10:
                    // delete rules
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, api.getRules()];
                case 11:
                    _e.apply(void 0, [_g.sent()]).toHaveLength(1);
                    return [4 /*yield*/, api.deleteRule(rules[0].id)];
                case 12:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, api.getRules()];
                case 13:
                    _f.apply(void 0, [_g.sent()]).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    // apis: addTransactions, getTransactions, importTransactions, updateTransaction, deleteTransaction
    test('Transactions: successfully update transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountId, newTransaction, addResult, _a, _b, transactions, reconciled, idToUpdate, idToDelete;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, api.createAccount({ name: 'test-account' }, 0)];
                case 1:
                    accountId = _c.sent();
                    newTransaction = [
                        {
                            account: accountId,
                            date: '2023-11-03',
                            imported_id: '11',
                            amount: 100,
                            notes: 'notes',
                        },
                        {
                            account: accountId,
                            date: '2023-11-03',
                            imported_id: '12',
                            amount: 100,
                            notes: '',
                        },
                    ];
                    return [4 /*yield*/, api.addTransactions(accountId, newTransaction, {
                            learnCategories: true,
                            runTransfers: true,
                        })];
                case 2:
                    addResult = _c.sent();
                    expect(addResult).toBe('ok');
                    _a = expect;
                    return [4 /*yield*/, api.getAccountBalance(accountId)];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toEqual(200);
                    _b = expect;
                    return [4 /*yield*/, api.getAccountBalance(accountId, new Date(2023, 10, 2))];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toEqual(0);
                    return [4 /*yield*/, api.getTransactions(accountId, '2023-11-01', '2023-11-30')];
                case 5:
                    transactions = _c.sent();
                    expect(transactions).toEqual(expect.arrayContaining(newTransaction.map(function (trans) { return expect.objectContaining(trans); })));
                    expect(transactions).toHaveLength(2);
                    newTransaction = [
                        {
                            account: accountId,
                            date: '2023-12-03',
                            imported_id: '11',
                            amount: 100,
                            notes: 'notes',
                        },
                        {
                            account: accountId,
                            date: '2023-12-03',
                            imported_id: '12',
                            amount: 100,
                            notes: 'notes',
                        },
                        {
                            account: accountId,
                            date: '2023-12-03',
                            imported_id: '22',
                            amount: 200,
                            notes: '',
                        },
                    ];
                    return [4 /*yield*/, api.importTransactions(accountId, newTransaction)];
                case 6:
                    reconciled = _c.sent();
                    // Expect it to reconcile and to have updated one of the previous transactions
                    expect(reconciled.added).toHaveLength(1);
                    expect(reconciled.updated).toHaveLength(1);
                    return [4 /*yield*/, api.getTransactions(accountId, '2023-12-01', '2023-12-31')];
                case 7:
                    // confirm imported transactions exist
                    transactions = _c.sent();
                    expect(transactions).toEqual(expect.arrayContaining([
                        expect.objectContaining({ imported_id: '22', amount: 200 }),
                    ]));
                    expect(transactions).toHaveLength(1);
                    return [4 /*yield*/, api.getTransactions(accountId, '2023-11-01', '2023-11-30')];
                case 8:
                    // confirm imported transactions update perfomed
                    transactions = _c.sent();
                    expect(transactions).toEqual(expect.arrayContaining([
                        expect.objectContaining({ notes: 'notes', amount: 100 }),
                    ]));
                    expect(transactions).toHaveLength(2);
                    idToUpdate = reconciled.added[0];
                    idToDelete = reconciled.updated[0];
                    return [4 /*yield*/, api.updateTransaction(idToUpdate, { amount: 500 })];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, api.deleteTransaction(idToDelete)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, api.getTransactions(accountId, '2023-12-01', '2023-12-31')];
                case 11:
                    // confirm updates and deletions work
                    transactions = _c.sent();
                    expect(transactions).toEqual(expect.arrayContaining([
                        expect.objectContaining({ id: idToUpdate, amount: 500 }),
                        expect.not.objectContaining({ id: idToDelete }),
                    ]));
                    expect(transactions).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test('Transactions: import notes are preserved when importing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountId, transactionsWithNotes, addResultWithNotes, transactions, transactionsWithoutNotes, addResultWithoutNotes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.createAccount({ name: 'test-account' }, 0)];
                case 1:
                    accountId = _a.sent();
                    transactionsWithNotes = [
                        {
                            date: '2023-11-03',
                            imported_id: '11',
                            amount: 100,
                            notes: 'test note',
                        },
                    ];
                    return [4 /*yield*/, api.addTransactions(accountId, transactionsWithNotes, {
                            learnCategories: true,
                            runTransfers: true,
                        })];
                case 2:
                    addResultWithNotes = _a.sent();
                    expect(addResultWithNotes).toBe('ok');
                    return [4 /*yield*/, api.getTransactions(accountId, '2023-11-01', '2023-11-30')];
                case 3:
                    transactions = _a.sent();
                    expect(transactions[0].notes).toBe('test note');
                    // Clear transactions
                    return [4 /*yield*/, api.deleteTransaction(transactions[0].id)];
                case 4:
                    // Clear transactions
                    _a.sent();
                    transactionsWithoutNotes = [
                        { date: '2023-11-03', imported_id: '11', amount: 100, notes: null },
                    ];
                    return [4 /*yield*/, api.addTransactions(accountId, transactionsWithoutNotes, {
                            learnCategories: true,
                            runTransfers: true,
                        })];
                case 5:
                    addResultWithoutNotes = _a.sent();
                    expect(addResultWithoutNotes).toBe('ok');
                    return [4 /*yield*/, api.getTransactions(accountId, '2023-11-01', '2023-11-30')];
                case 6:
                    transactions = _a.sent();
                    expect(transactions[0].notes).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
//apis: createSchedule, getSchedules, updateSchedule, deleteSchedule
test('Schedules: successfully complete schedules operations', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ScheduleId1, ScheduleId2, schedules, _a, _b, schedAccountId1, _c, schedPayeeId1, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, api.loadBudget(budgetName)];
            case 1:
                _e.sent();
                return [4 /*yield*/, api.createSchedule({
                        name: 'test-schedule 1',
                        posts_transaction: true,
                        //    amount: -5000,
                        amountOp: 'is',
                        date: {
                            frequency: 'monthly',
                            interval: 1,
                            start: '2025-06-13',
                            patterns: [],
                            skipWeekend: false,
                            weekendSolveMode: 'after',
                            endMode: 'never',
                        },
                    })];
            case 2:
                ScheduleId1 = _e.sent();
                return [4 /*yield*/, api.createSchedule({
                        name: 'test-schedule 2',
                        posts_transaction: false,
                        amount: 4000,
                        amountOp: 'is',
                        date: '2025-06-13',
                    })];
            case 3:
                ScheduleId2 = _e.sent();
                return [4 /*yield*/, api.getSchedules()];
            case 4:
                schedules = _e.sent();
                // Schedules successfully created
                expect(schedules).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        name: 'test-schedule 1',
                        posts_transaction: true,
                        //       amount: -5000,
                        amountOp: 'is',
                        date: {
                            frequency: 'monthly',
                            interval: 1,
                            start: '2025-06-13',
                            patterns: [],
                            skipWeekend: false,
                            weekendSolveMode: 'after',
                            endMode: 'never',
                        },
                    }),
                    expect.objectContaining({
                        name: 'test-schedule 2',
                        posts_transaction: false,
                        amount: 4000,
                        amountOp: 'is',
                        date: '2025-06-13',
                    }),
                ]));
                //check getIDByName works on schedules
                _a = expect;
                return [4 /*yield*/, api.getIDByName('schedules', 'test-schedule 1')];
            case 5:
                //check getIDByName works on schedules
                _a.apply(void 0, [_e.sent()]).toEqual(ScheduleId1);
                _b = expect;
                return [4 /*yield*/, api.getIDByName('schedules', 'test-schedule 2')];
            case 6:
                _b.apply(void 0, [_e.sent()]).toEqual(ScheduleId2);
                return [4 /*yield*/, api.createAccount({ name: 'sched-test-account1', offbudget: true }, 1000)];
            case 7:
                schedAccountId1 = _e.sent();
                _c = expect;
                return [4 /*yield*/, api.getIDByName('accounts', 'sched-test-account1')];
            case 8:
                _c.apply(void 0, [_e.sent()]).toEqual(schedAccountId1);
                return [4 /*yield*/, api.createPayee({ name: 'sched-test-payee1' })];
            case 9:
                schedPayeeId1 = _e.sent();
                _d = expect;
                return [4 /*yield*/, api.getIDByName('payees', 'sched-test-payee1')];
            case 10:
                _d.apply(void 0, [_e.sent()]).toEqual(schedPayeeId1);
                return [4 /*yield*/, api.updateSchedule(ScheduleId1, {
                        amount: -10000,
                        account: schedAccountId1,
                    })];
            case 11:
                _e.sent();
                return [4 /*yield*/, api.deleteSchedule(ScheduleId2)];
            case 12:
                _e.sent();
                // schedules successfully updated, and one of them deleted
                return [4 /*yield*/, api.updateSchedule(ScheduleId1, {
                        amount: -10000,
                        account: schedAccountId1,
                        payee: schedPayeeId1,
                    })];
            case 13:
                // schedules successfully updated, and one of them deleted
                _e.sent();
                return [4 /*yield*/, api.deleteSchedule(ScheduleId2)];
            case 14:
                _e.sent();
                return [4 /*yield*/, api.getSchedules()];
            case 15:
                schedules = _e.sent();
                expect(schedules).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        id: ScheduleId1,
                        posts_transaction: true,
                        amount: -10000,
                        account: schedAccountId1,
                        payee: schedPayeeId1,
                        amountOp: 'is',
                        date: {
                            frequency: 'monthly',
                            interval: 1,
                            start: '2025-06-13',
                            patterns: [],
                            skipWeekend: false,
                            weekendSolveMode: 'after',
                            endMode: 'never',
                        },
                    }),
                    expect.not.objectContaining({ id: ScheduleId2 }),
                ]));
                return [2 /*return*/];
        }
    });
}); });
