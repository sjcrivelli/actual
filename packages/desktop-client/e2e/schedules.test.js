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
fixtures_1.test.describe('Schedules', function () {
    var page;
    var navigation;
    var schedulesPage;
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
                case 0: return [4 /*yield*/, navigation.goToSchedulesPage()];
                case 1:
                    schedulesPage = _a.sent();
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
    (0, fixtures_1.test)('creates a new schedule, posts the transaction and later completes it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var schedule, accountPage, transaction, icon, rulesPage, rule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fixtures_1.test.setTimeout(40000);
                    return [4 /*yield*/, schedulesPage.addNewSchedule({
                            payee: 'Home Depot',
                            account: 'HSBC',
                            amount: 25,
                        })];
                case 1:
                    _a.sent();
                    schedule = schedulesPage.getNthSchedule(2);
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.payee).toHaveText('Home Depot')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.account).toHaveText('HSBC')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.amount).toHaveText('~25.00')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.status).toHaveText('Due')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, schedulesPage.postNthSchedule(2)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedulesPage.getNthSchedule(2).status).toHaveText('Paid')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('HSBC')];
                case 10:
                    accountPage = _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Home Depot')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Categorize')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('25.00')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.credit).toHaveText('')];
                case 14:
                    _a.sent();
                    icon = transaction.payee.getByTestId('schedule-icon');
                    return [4 /*yield*/, icon.hover()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToRulesPage()];
                case 17:
                    rulesPage = _a.sent();
                    return [4 /*yield*/, rulesPage.searchFor('Home Depot')];
                case 18:
                    _a.sent();
                    rule = rulesPage.getNthRule(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(rule.actions).toHaveText([
                            'link schedule Home Depot (2017-01-01)',
                        ])];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(rule.conditions).toHaveText([
                            'payee is Home Depot',
                            'and account is HSBC',
                            'and date is approx Every month on the 1st',
                            'and amount is approx -25.00',
                        ])];
                case 20:
                    _a.sent();
                    // Go back to schedules page
                    return [4 /*yield*/, navigation.goToSchedulesPage()];
                case 21:
                    // Go back to schedules page
                    _a.sent();
                    return [4 /*yield*/, schedulesPage.completeNthSchedule(2)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedulesPage.getNthScheduleRow(4)).toHaveText('Show completed schedules')];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 24:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates two new schedules, posts both transactions and later completes one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var schedule, schedule2, accountPage, transaction, transaction2, icon, icon2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fixtures_1.test.setTimeout(40000);
                    // Adding two schedules with the same payee and account and amount, mimicking two different subscriptions
                    return [4 /*yield*/, schedulesPage.addNewSchedule({
                            payee: 'Apple',
                            account: 'HSBC',
                            amount: 5,
                        })];
                case 1:
                    // Adding two schedules with the same payee and account and amount, mimicking two different subscriptions
                    _a.sent();
                    return [4 /*yield*/, schedulesPage.addNewSchedule({
                            payee: 'Apple',
                            account: 'HSBC',
                            amount: 5,
                        })];
                case 2:
                    _a.sent();
                    schedule = schedulesPage.getNthSchedule(2);
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.payee).toHaveText('Apple')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.account).toHaveText('HSBC')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.amount).toHaveText('~5.00')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule.status).toHaveText('Due')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 7:
                    _a.sent();
                    schedule2 = schedulesPage.getNthSchedule(3);
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule2.payee).toHaveText('Apple')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule2.account).toHaveText('HSBC')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule2.amount).toHaveText('~5.00')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedule2.status).toHaveText('Due')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, schedulesPage.postNthSchedule(2)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedulesPage.getNthSchedule(2).status).toHaveText('Paid')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedulesPage.getNthSchedule(3).status).toHaveText('Due')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, schedulesPage.postNthSchedule(3)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedulesPage.getNthSchedule(2).status).toHaveText('Paid')];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(schedulesPage.getNthSchedule(3).status).toHaveText('Paid')];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, navigation.goToAccountPage('HSBC')];
                case 21:
                    accountPage = _a.sent();
                    transaction = accountPage.getNthTransaction(0);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.payee).toHaveText('Apple')];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.category).toHaveText('Categorize')];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.debit).toHaveText('5.00')];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction.credit).toHaveText('')];
                case 25:
                    _a.sent();
                    transaction2 = accountPage.getNthTransaction(1);
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction2.payee).toHaveText('Apple')];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction2.category).toHaveText('Categorize')];
                case 27:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction2.debit).toHaveText('5.00')];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(transaction2.credit).toHaveText('')];
                case 29:
                    _a.sent();
                    icon = transaction.payee.getByTestId('schedule-icon');
                    return [4 /*yield*/, icon.hover()];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 31:
                    _a.sent();
                    icon2 = transaction2.payee.getByTestId('schedule-icon');
                    return [4 /*yield*/, icon2.hover()];
                case 32:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 33:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('creates a "full" list of schedules', function () { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 4];
                    return [4 /*yield*/, schedulesPage.addNewSchedule({
                            payee: 'Home Depot',
                            account: 'HSBC',
                            amount: 0,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
