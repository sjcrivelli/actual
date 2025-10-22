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
var fixtures_1 = require("./fixtures");
var configuration_page_1 = require("./page-models/configuration-page");
var navigation_1 = require("./page-models/navigation");
fixtures_1.test.describe('Rules', function () {
    var page;
    var navigation;
    var rulesPage;
    var configurationPage;
    fixtures_1.test.beforeAll(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var browser = _b.browser;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _c.sent();
                    navigation = new navigation_1.Navigation(page);
                    configurationPage = new configuration_page_1.ConfigurationPage(page);
                    return [4 /*yield*/, page.goto('/')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, configurationPage.createTestFile()];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    fixtures_1.test.afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    fixtures_1.test.beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigation.goToRulesPage()];
                case 1:
                    rulesPage = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('checks the page visuals', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rulesPage.searchFor('Dominion')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a rule and makes sure it is applied when creating a transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rule, accountPage, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rulesPage.searchFor('Fast Internet')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rulesPage.createRule({
                            conditions: [
                                {
                                    field: 'payee',
                                    op: 'is',
                                    value: 'Fast Internet',
                                },
                            ],
                            actions: [
                                {
                                    field: 'category',
                                    value: 'General',
                                },
                            ],
                        })];
                case 2:
                    _a.sent();
                    rule = rulesPage.getNthRule(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(rule.conditions).toHaveText(['payee is Fast Internet'])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(rule.actions).toHaveText(['set category to General'])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('HSBC')];
                case 6:
                    accountPage = _a.sent();
                    return [4 /*yield*/, accountPage.createSingleTransaction({
                            payee: 'Fast Internet',
                            debit: '12.34',
                        })];
                case 7:
                    _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Fast Internet')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('General')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('12.34')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a split transaction rule and makes sure it is applied when creating a transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountPage, transaction, firstSplitTransaction, secondSplitTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigation.goToRulesPage()];
                case 1:
                    rulesPage = _a.sent();
                    return [4 /*yield*/, rulesPage.createRule({
                            conditions: [
                                {
                                    field: 'payee',
                                    op: 'is',
                                    value: 'Ikea',
                                },
                            ],
                            actions: [
                                {
                                    op: 'set',
                                    field: 'notes',
                                    value: 'food / entertainment',
                                },
                            ],
                            splits: [
                                [
                                    {
                                        field: 'a fixed percent of the remainder',
                                        value: '90',
                                    },
                                    {
                                        field: 'category',
                                        value: 'Entertainment',
                                    },
                                ],
                                [
                                    {
                                        field: 'an equal portion of the remainder',
                                    },
                                    {
                                        field: 'category',
                                        value: 'Food',
                                    },
                                ],
                            ],
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Capital One Checking')];
                case 3:
                    accountPage = _a.sent();
                    return [4 /*yield*/, accountPage.createSingleTransaction({
                            debit: '100.00',
                            payee: 'Ikea',
                        })];
                case 4:
                    _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Ikea')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.notes).toHaveText('food / entertainment')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Split')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('100.00')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 9:
                    _a.sent();
                    firstSplitTransaction = accountPage.getNthTransaction(1);
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstSplitTransaction.payee).toHaveText('Ikea')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstSplitTransaction.debit).toHaveText('90.00')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstSplitTransaction.category).toHaveText('Entertainment')];
                case 12:
                    _a.sent();
                    secondSplitTransaction = accountPage.getNthTransaction(2);
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondSplitTransaction.payee).toHaveText('Ikea')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondSplitTransaction.debit).toHaveText('10.00')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondSplitTransaction.category).toHaveText('Food')];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
