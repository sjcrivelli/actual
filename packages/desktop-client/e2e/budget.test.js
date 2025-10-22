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
fixtures_1.test.describe('Budget', function () {
    var page;
    var configurationPage;
    var budgetPage;
    fixtures_1.test.beforeAll(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var browser = _b.browser;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _c.sent();
                    configurationPage = new configuration_page_1.ConfigurationPage(page);
                    return [4 /*yield*/, page.goto('/')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, configurationPage.createTestFile()];
                case 3:
                    budgetPage = _c.sent();
                    // Move mouse to corner of the screen;
                    // sometimes the mouse hovers on a budget element thus rendering an input box
                    // and this breaks screenshot tests
                    return [4 /*yield*/, page.mouse.move(0, 0)];
                case 4:
                    // Move mouse to corner of the screen;
                    // sometimes the mouse hovers on a budget element thus rendering an input box
                    // and this breaks screenshot tests
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
    (0, fixtures_1.test)('renders the summary information: available funds, overspent, budgeted and for next month', function () { return __awaiter(void 0, void 0, void 0, function () {
        var summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    summary = budgetPage.budgetSummary.first();
                    return [4 /*yield*/, (0, fixtures_1.expect)(summary.getByText('Available funds')).toBeVisible({
                            timeout: 10000,
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(summary.getByText(/^Overspent in /)).toBeVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(summary.getByText('Budgeted')).toBeVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(summary.getByText('For next month')).toBeVisible()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('transfer funds to another category', function () { return __awaiter(void 0, void 0, void 0, function () {
        var currentFundsA, currentFundsB, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, budgetPage.getBalanceForRow(1)];
                case 1:
                    currentFundsA = _b.sent();
                    return [4 /*yield*/, budgetPage.getBalanceForRow(2)];
                case 2:
                    currentFundsB = _b.sent();
                    return [4 /*yield*/, budgetPage.transferAllBalance(1, 2)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 4:
                    _b.sent();
                    _a = fixtures_1.expect;
                    return [4 /*yield*/, budgetPage.getBalanceForRow(2)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toEqual(currentFundsA + currentFundsB);
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('budget table is rendered', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.budgetTable).toBeVisible()];
                case 1:
                    _b.sent();
                    _a = fixtures_1.expect;
                    return [4 /*yield*/, budgetPage.getTableTotals()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({
                        budgeted: fixtures_1.expect.any(Number),
                        spent: fixtures_1.expect.any(Number),
                        balance: fixtures_1.expect.any(Number),
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('clicking on spent amounts opens a transaction page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountPage, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, budgetPage.clickOnSpentAmountForRow(1)];
                case 1:
                    accountPage = _b.sent();
                    (0, fixtures_1.expect)(page.url()).toContain('/accounts');
                    _a = fixtures_1.expect;
                    return [4 /*yield*/, accountPage.accountName.textContent()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatch('All Accounts');
                    return [4 /*yield*/, page.getByRole('button', { name: 'Back' }).click()];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
