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
var account_page_1 = require("./page-models/account-page");
var configuration_page_1 = require("./page-models/configuration-page");
var navigation_1 = require("./page-models/navigation");
fixtures_1.test.describe('Onboarding', function () {
    var page;
    var navigation;
    var configurationPage;
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
    (0, fixtures_1.test)('checks the page visuals', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fixtures_1.expect)(configurationPage.heading).toHaveText('Where’s the server?')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, configurationPage.clickOnNoServer()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a new budget file by importing YNAB4 budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetPage, accountPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configurationPage.clickOnNoServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, configurationPage.importBudget('YNAB4', path_1.default.resolve(__dirname, 'data/ynab4-demo-budget.zip'))];
                case 2:
                    budgetPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.budgetTable).toBeVisible({ timeout: 30000 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Account1 with Starting Balance')];
                case 4:
                    accountPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('-400.00')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Account2 no Starting Balance')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('2,607.00')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a new budget file by importing nYNAB budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetPage, accountPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configurationPage.clickOnNoServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, configurationPage.importBudget('nYNAB', path_1.default.resolve(__dirname, 'data/ynab5-demo-budget.json'))];
                case 2:
                    budgetPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.budgetTable).toBeVisible({ timeout: 30000 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Checking')];
                case 4:
                    accountPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('2,600.00')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Saving')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('250.00')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a new budget file by importing Actual budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var budgetPage, accountPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configurationPage.clickOnNoServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, configurationPage.importBudget('Actual', path_1.default.resolve(__dirname, 'data/actual-demo-budget.zip'))];
                case 2:
                    budgetPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.budgetTable).toBeVisible({ timeout: 20000 })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Ally Savings')];
                case 4:
                    accountPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('1,772.80')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('Roth IRA')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('2,745.81')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a new empty budget file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configurationPage.clickOnNoServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, configurationPage.startFresh()];
                case 2:
                    _a.sent();
                    accountPage = new account_page_1.AccountPage(page);
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountName).toBeVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountName).toHaveText('All Accounts')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.accountBalance).toHaveText('0.00')];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('navigates back to start page by clicking on “no server” in an empty budget file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configurationPage.clickOnNoServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, configurationPage.startFresh()];
                case 2:
                    accountPage = _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.transactionTable).toBeVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigation.clickOnNoServer()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.getByRole('button', { name: 'Start using a server' }).click()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(configurationPage.heading).toHaveText('Where’s the server?')];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
