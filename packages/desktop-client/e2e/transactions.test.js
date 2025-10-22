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
fixtures_1.test.describe('Transactions', function () {
    var page;
    var navigation;
    var accountPage;
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
                case 0: return [4 /*yield*/, navigation.goToAccountPage('Ally Savings')];
                case 1:
                    accountPage = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('checks the page visuals', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    fixtures_1.test.describe('filters transactions', function () {
        // Reset filters
        fixtures_1.test.afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, accountPage.removeFilter(0)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('by date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filterTooltip, datepicker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, accountPage.filterBy('Date')];
                    case 1:
                        filterTooltip = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(filterTooltip.locator).toMatchThemeScreenshots()];
                    case 2:
                        _a.sent();
                        // Open datepicker
                        return [4 /*yield*/, page.keyboard.press('Space')];
                    case 3:
                        // Open datepicker
                        _a.sent();
                        datepicker = page.getByTestId('date-select-tooltip');
                        return [4 /*yield*/, (0, fixtures_1.expect)(datepicker).toMatchThemeScreenshots()];
                    case 4:
                        _a.sent();
                        // Select "is xxxxx"
                        return [4 /*yield*/, datepicker.getByText('20', { exact: true }).click()];
                    case 5:
                        // Select "is xxxxx"
                        _a.sent();
                        return [4 /*yield*/, filterTooltip.applyButton.click()];
                    case 6:
                        _a.sent();
                        // Assert that there are no transactions
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.transactionTable).toHaveText('No transactions')];
                    case 7:
                        // Assert that there are no transactions
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('by category', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filterTooltip, autocomplete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, accountPage.filterBy('Category')];
                    case 1:
                        filterTooltip = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(filterTooltip.locator).toMatchThemeScreenshots()];
                    case 2:
                        _a.sent();
                        autocomplete = page.getByTestId('autocomplete');
                        return [4 /*yield*/, (0, fixtures_1.expect)(autocomplete).toMatchThemeScreenshots()];
                    case 3:
                        _a.sent();
                        // Select the active item
                        return [4 /*yield*/, page.getByTestId('Clothing-category-item').click()];
                    case 4:
                        // Select the active item
                        _a.sent();
                        return [4 /*yield*/, filterTooltip.applyButton.click()];
                    case 5:
                        _a.sent();
                        // Assert that there are only clothing transactions
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.getNthTransaction(0).category).toHaveText('Clothing')];
                    case 6:
                        // Assert that there are only clothing transactions
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.getNthTransaction(1).category).toHaveText('Clothing')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.getNthTransaction(2).category).toHaveText('Clothing')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.getNthTransaction(3).category).toHaveText('Clothing')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.getNthTransaction(4).category).toHaveText('Clothing')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, fixtures_1.test)('creates a test transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, accountPage.createSingleTransaction({
                        payee: 'Home Depot',
                        notes: 'Notes field',
                        category: 'Food',
                        debit: '12.34',
                    })];
                case 1:
                    _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Home Depot')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.notes).toHaveText('Notes field')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Food')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('12.34')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.credit).toHaveText('')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a split test transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstTransaction, secondTransaction, thirdTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, accountPage.createSplitTransaction([
                        {
                            payee: 'Krogger',
                            notes: 'Notes',
                            debit: '333.33',
                        },
                        {
                            category: 'General',
                            debit: '222.22',
                        },
                        {
                            debit: '111.11',
                        },
                    ])];
                case 1:
                    _a.sent();
                    firstTransaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstTransaction.payee).toHaveText('Krogger')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstTransaction.notes).toHaveText('Notes')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstTransaction.category).toHaveText('Split')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstTransaction.debit).toHaveText('333.33')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(firstTransaction.credit).toHaveText('')];
                case 6:
                    _a.sent();
                    secondTransaction = accountPage.getNthTransaction(1);
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondTransaction.payee).toHaveText('Krogger')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondTransaction.notes).toHaveText('')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondTransaction.category).toHaveText('General')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondTransaction.debit).toHaveText('222.22')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(secondTransaction.credit).toHaveText('')];
                case 11:
                    _a.sent();
                    thirdTransaction = accountPage.getNthTransaction(2);
                    return [4 /*yield*/, (0, fixtures_1.expect)(thirdTransaction.payee).toHaveText('Krogger')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(thirdTransaction.notes).toHaveText('')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(thirdTransaction.category).toHaveText('Categorize')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(thirdTransaction.debit).toHaveText('111.11')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(thirdTransaction.credit).toHaveText('')];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 17:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a transfer test transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transaction, balanceBeforeTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, accountPage.enterSingleTransaction({
                        payee: 'Bank of America',
                        notes: 'Notes field',
                        debit: '12.34',
                    })];
                case 1:
                    _a.sent();
                    transaction = accountPage.getEnteredTransaction();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category.locator('input')).toHaveValue('Transfer')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, accountPage.accountBalance.textContent()];
                case 4:
                    balanceBeforeTransaction = _a.sent();
                    return [4 /*yield*/, accountPage.addEnteredTransaction()];
                case 5:
                    _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Bank of America')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.notes).toHaveText('Notes field')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Transfer')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('12.34')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.credit).toHaveText('')];
                case 10:
                    _a.sent();
                    // Wait for balance to update after adding transaction
                    return [4 /*yield*/, (0, fixtures_1.expect)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var balanceAfterTransaction;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, accountPage.accountBalance.textContent()];
                                    case 1:
                                        balanceAfterTransaction = _a.sent();
                                        (0, fixtures_1.expect)(balanceAfterTransaction).not.toBe(balanceBeforeTransaction);
                                        return [2 /*return*/];
                                }
                            });
                        }); }).toPass()];
                case 11:
                    // Wait for balance to update after adding transaction
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
