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
var path_1 = require("path");
var fixtures_1 = require("./fixtures");
var configuration_page_1 = require("./page-models/configuration-page");
var navigation_1 = require("./page-models/navigation");
fixtures_1.test.describe('Accounts', function () {
    var page;
    var navigation;
    var configurationPage;
    var accountPage;
    fixtures_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
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
    fixtures_1.test.afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a new account and views the initial balance transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigation.createAccount({
                        name: 'New Account',
                        offBudget: false,
                        balance: 100,
                    })];
                case 1:
                    accountPage = _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Starting Balance')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.notes).toHaveText('')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Starting Balances')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.credit).toHaveText('100.00')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('closes an account', function () { return __awaiter(void 0, void 0, void 0, function () {
        var modal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigation.goToAccountPage('Roth IRA')];
                case 1:
                    accountPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountName).toHaveText('Roth IRA')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, accountPage.clickCloseAccount()];
                case 3:
                    modal = _a.sent();
                    return [4 /*yield*/, modal.selectTransferAccount('Vanguard 401k')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, modal.closeAccount()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountName).toHaveText('Closed: Roth IRA')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    fixtures_1.test.describe('On Budget Accounts', function () {
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
        (0, fixtures_1.test)('creates a transfer from two existing transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToAccountPage('On budget')];
                    case 1:
                        accountPage = _a.sent();
                        return [4 /*yield*/, accountPage.waitFor()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountName).toHaveText('On Budget Accounts')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, accountPage.filterByNote('Test Acc Transfer')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, accountPage.createSingleTransaction({
                                account: 'Ally Savings',
                                payee: '',
                                notes: 'Test Acc Transfer',
                                category: 'Food',
                                debit: '34.56',
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, accountPage.createSingleTransaction({
                                account: 'HSBC',
                                payee: '',
                                notes: 'Test Acc Transfer',
                                category: 'Food',
                                credit: '34.56',
                            })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.waitForTimeout(100)];
                    case 7:
                        _a.sent(); // Give time for the previous transaction to be rendered
                        return [4 /*yield*/, accountPage.selectNthTransaction(0)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, accountPage.selectNthTransaction(1)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, accountPage.clickSelectAction('Make transfer')];
                    case 10:
                        _a.sent();
                        transaction = accountPage.getNthTransaction(0);
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Ally Savings')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Transfer')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.credit).toHaveText('34.56')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.account).toHaveText('HSBC')];
                    case 14:
                        _a.sent();
                        transaction = accountPage.getNthTransaction(1);
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('HSBC')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Transfer')];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('34.56')];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(transaction.account).toHaveText('Ally Savings')];
                    case 18:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    fixtures_1.test.describe('Import Transactions', function () {
        fixtures_1.test.beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.createAccount({
                            name: 'CSV import',
                            offBudget: false,
                            balance: 0,
                        })];
                    case 1:
                        accountPage = _a.sent();
                        return [4 /*yield*/, accountPage.waitFor()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        function importCsv() {
            return __awaiter(this, arguments, void 0, function (screenshot) {
                var fileChooserPromise, fileChooser, importButton;
                if (screenshot === void 0) { screenshot = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fileChooserPromise = page.waitForEvent('filechooser');
                            return [4 /*yield*/, accountPage.page.getByRole('button', { name: 'Import' }).click()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, fileChooserPromise];
                        case 2:
                            fileChooser = _a.sent();
                            return [4 /*yield*/, fileChooser.setFiles((0, path_1.join)(__dirname, 'data/test.csv'))];
                        case 3:
                            _a.sent();
                            if (!screenshot) return [3 /*break*/, 5];
                            return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            importButton = accountPage.page.getByRole('button', {
                                name: /Import \d+ transactions/,
                            });
                            return [4 /*yield*/, importButton.click()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(importButton).not.toBeVisible()];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        (0, fixtures_1.test)('imports transactions from a CSV file', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, importCsv(true)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('import csv file twice', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fileChooserPromise, fileChooser, importButton, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, importCsv(false)];
                    case 1:
                        _b.sent();
                        fileChooserPromise = page.waitForEvent('filechooser');
                        return [4 /*yield*/, accountPage.page.getByRole('button', { name: 'Import' }).click()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, fileChooserPromise];
                    case 3:
                        fileChooser = _b.sent();
                        return [4 /*yield*/, fileChooser.setFiles((0, path_1.join)(__dirname, 'data/test.csv'))];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 5:
                        _b.sent();
                        importButton = accountPage.page.getByRole('button', {
                            name: /Import \d+ transactions/,
                        });
                        return [4 /*yield*/, (0, fixtures_1.expect)(importButton).toBeDisabled()];
                    case 6:
                        _b.sent();
                        _a = fixtures_1.expect;
                        return [4 /*yield*/, importButton.innerText()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toMatch(/Import 0 transactions/)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, accountPage.page.getByRole('button', { name: 'Close' }).click()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(importButton).not.toBeVisible()];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('import notes checkbox is not shown for CSV files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fileChooserPromise, fileChooser, importNotesCheckbox, importButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileChooserPromise = page.waitForEvent('filechooser');
                        return [4 /*yield*/, accountPage.page.getByRole('button', { name: 'Import' }).click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fileChooserPromise];
                    case 2:
                        fileChooser = _a.sent();
                        return [4 /*yield*/, fileChooser.setFiles((0, path_1.join)(__dirname, 'data/test.csv'))];
                    case 3:
                        _a.sent();
                        importNotesCheckbox = page.getByRole('checkbox', {
                            name: 'Import notes from file',
                        });
                        return [4 /*yield*/, (0, fixtures_1.expect)(importNotesCheckbox).not.toBeVisible()];
                    case 4:
                        _a.sent();
                        importButton = page.getByRole('button', {
                            name: /Import \d+ transactions/,
                        });
                        return [4 /*yield*/, importButton.click()];
                    case 5:
                        _a.sent();
                        // Verify the transactions were imported
                        return [4 /*yield*/, (0, fixtures_1.expect)(importButton).not.toBeVisible()];
                    case 6:
                        // Verify the transactions were imported
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
