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
var monthUtils = require("loot-core/shared/months");
var util_1 = require("loot-core/shared/util");
var fixtures_1 = require("./fixtures");
var configuration_page_1 = require("./page-models/configuration-page");
var mobile_navigation_1 = require("./page-models/mobile-navigation");
var copyLastMonthBudget = function (budgetPage, categoryName) { return __awaiter(void 0, void 0, void 0, function () {
    var budgetMenuModal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
            case 1:
                budgetMenuModal = _a.sent();
                return [4 /*yield*/, budgetMenuModal.copyLastMonthBudget()];
            case 2:
                _a.sent();
                return [4 /*yield*/, budgetMenuModal.close()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var setTo3MonthAverage = function (budgetPage, categoryName) { return __awaiter(void 0, void 0, void 0, function () {
    var budgetMenuModal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
            case 1:
                budgetMenuModal = _a.sent();
                return [4 /*yield*/, budgetMenuModal.setTo3MonthAverage()];
            case 2:
                _a.sent();
                return [4 /*yield*/, budgetMenuModal.close()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var setTo6MonthAverage = function (budgetPage, categoryName) { return __awaiter(void 0, void 0, void 0, function () {
    var budgetMenuModal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
            case 1:
                budgetMenuModal = _a.sent();
                return [4 /*yield*/, budgetMenuModal.setTo6MonthAverage()];
            case 2:
                _a.sent();
                return [4 /*yield*/, budgetMenuModal.close()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var setToYearlyAverage = function (budgetPage, categoryName) { return __awaiter(void 0, void 0, void 0, function () {
    var budgetMenuModal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
            case 1:
                budgetMenuModal = _a.sent();
                return [4 /*yield*/, budgetMenuModal.setToYearlyAverage()];
            case 2:
                _a.sent();
                return [4 /*yield*/, budgetMenuModal.close()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
function setBudgetAverage(budgetPage, categoryName, numberOfMonths, setBudgetAverageFn) {
    return __awaiter(this, void 0, void 0, function () {
        var totalSpent, i, spentButton, spent, averageSpent, i;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    totalSpent = 0;
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < numberOfMonths)) return [3 /*break*/, 6];
                    return [4 /*yield*/, budgetPage.goToPreviousMonth()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, budgetPage.getButtonForSpent(categoryName)];
                case 3:
                    spentButton = _b.sent();
                    return [4 /*yield*/, spentButton.textContent()];
                case 4:
                    spent = _b.sent();
                    if (!spent) {
                        throw new Error('Failed to get spent amount');
                    }
                    totalSpent += (_a = (0, util_1.currencyToAmount)(spent)) !== null && _a !== void 0 ? _a : 0;
                    _b.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    averageSpent = totalSpent / numberOfMonths;
                    i = 0;
                    _b.label = 7;
                case 7:
                    if (!(i < numberOfMonths)) return [3 /*break*/, 10];
                    return [4 /*yield*/, budgetPage.goToNextMonth()];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, setBudgetAverageFn(budgetPage, categoryName, numberOfMonths)];
                case 11:
                    _b.sent();
                    return [2 /*return*/, averageSpent];
            }
        });
    });
}
var budgetTypes = ['Envelope', 'Tracking'];
budgetTypes.forEach(function (budgetType) {
    fixtures_1.test.describe("Mobile Budget [".concat(budgetType, "]"), function () {
        var page;
        var navigation;
        var configurationPage;
        var previousGlobalIsTesting;
        fixtures_1.test.beforeAll(function () {
            // TODO: Hack, properly mock the currentMonth function
            previousGlobalIsTesting = global.IS_TESTING;
            global.IS_TESTING = true;
        });
        fixtures_1.test.afterAll(function () {
            // TODO: Hack, properly mock the currentMonth function
            global.IS_TESTING = previousGlobalIsTesting;
        });
        fixtures_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var settingsPage;
            var browser = _b.browser;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, browser.newPage()];
                    case 1:
                        page = _c.sent();
                        navigation = new mobile_navigation_1.MobileNavigation(page);
                        configurationPage = new configuration_page_1.ConfigurationPage(page);
                        return [4 /*yield*/, page.setViewportSize({
                                width: 350,
                                height: 600,
                            })];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, page.goto('/')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, configurationPage.createTestFile()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, navigation.goToSettingsPage()];
                    case 5:
                        settingsPage = _c.sent();
                        return [4 /*yield*/, settingsPage.useBudgetType(budgetType)];
                    case 6:
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
        (0, fixtures_1.test)('loads the budget page with budgeted amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.categoryNames).toHaveText([
                                'Food',
                                'Restaurants',
                                'Entertainment',
                                'Clothing',
                                'General',
                                'Gift',
                                'Medical',
                                'Savings',
                                'Cell',
                                'Internet',
                                'Mortgage',
                                'Water',
                                'Power',
                                'Starting Balances',
                                'Misc',
                                'Income',
                            ])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Page Header Tests
        (0, fixtures_1.test)('checks that clicking the Actual logo in the page header opens the budget page menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, budgetPageMenuModal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.openBudgetPageMenu()];
                    case 2:
                        _a.sent();
                        budgetPageMenuModal = page.getByRole('dialog');
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetPageMenuModal).toBeVisible()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)("checks that clicking the left arrow in the page header shows the previous month's budget", function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, selectedMonth, displayMonth, previousMonth, previousDisplayMonth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getSelectedMonth()];
                    case 2:
                        selectedMonth = _a.sent();
                        displayMonth = monthUtils.format(selectedMonth, budgetPage.MONTH_HEADER_DATE_FORMAT);
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.heading).toHaveText(displayMonth)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, budgetPage.goToPreviousMonth()];
                    case 4:
                        previousMonth = _a.sent();
                        previousDisplayMonth = monthUtils.format(previousMonth, budgetPage.MONTH_HEADER_DATE_FORMAT);
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.heading).toHaveText(previousDisplayMonth)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('checks that clicking the month in the page header opens the month menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, selectedMonth, monthMenuModal, monthMenuModalHeading, displayMonth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getSelectedMonth()];
                    case 2:
                        selectedMonth = _a.sent();
                        return [4 /*yield*/, budgetPage.openMonthMenu()];
                    case 3:
                        _a.sent();
                        monthMenuModal = page.getByRole('dialog');
                        monthMenuModalHeading = monthMenuModal.getByRole('heading');
                        displayMonth = monthUtils.format(selectedMonth, budgetPage.MONTH_HEADER_DATE_FORMAT);
                        return [4 /*yield*/, (0, fixtures_1.expect)(monthMenuModalHeading).toHaveText(displayMonth)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)("checks that clicking the right arrow in the page header shows the next month's budget", function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, selectedMonth, displayMonth, nextMonth, nextDisplayMonth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getSelectedMonth()];
                    case 2:
                        selectedMonth = _a.sent();
                        displayMonth = monthUtils.format(selectedMonth, budgetPage.MONTH_HEADER_DATE_FORMAT);
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.heading).toHaveText(displayMonth)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, budgetPage.goToNextMonth()];
                    case 4:
                        nextMonth = _a.sent();
                        nextDisplayMonth = monthUtils.format(nextMonth, budgetPage.MONTH_HEADER_DATE_FORMAT);
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetPage.heading).toHaveText(nextDisplayMonth)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Category / Category Group Menu Tests
        (0, fixtures_1.test)('checks that clicking the category group name opens the category group menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryGroupName, categoryMenuModalHeading;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryGroupNameForRow(0)];
                    case 2:
                        categoryGroupName = _a.sent();
                        return [4 /*yield*/, budgetPage.openCategoryGroupMenu(categoryGroupName)];
                    case 3:
                        _a.sent();
                        categoryMenuModalHeading = page
                            .getByRole('dialog')
                            .getByRole('heading');
                        return [4 /*yield*/, (0, fixtures_1.expect)(categoryMenuModalHeading).toHaveText(categoryGroupName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('checks that clicking the category name opens the category menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryName, categoryMenuModal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(0)];
                    case 2:
                        categoryName = _a.sent();
                        return [4 /*yield*/, budgetPage.openCategoryMenu(categoryName)];
                    case 3:
                        categoryMenuModal = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(categoryMenuModal.heading).toHaveText(categoryName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Budgeted Cell Tests
        (0, fixtures_1.test)('checks that clicking the budgeted cell opens the budget menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryName, budgetMenuModal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(0)];
                    case 2:
                        categoryName = _a.sent();
                        return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
                    case 3:
                        budgetMenuModal = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetMenuModal.heading).toHaveText(categoryName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)('updates the budgeted amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryName, budgetMenuModal, budgetAmount, budgetedButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(0)];
                    case 2:
                        categoryName = _a.sent();
                        return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
                    case 3:
                        budgetMenuModal = _a.sent();
                        budgetAmount = 123;
                        // Set to 123.00
                        return [4 /*yield*/, budgetMenuModal.setBudgetAmount("".concat(budgetAmount, "00"))];
                    case 4:
                        // Set to 123.00
                        _a.sent();
                        return [4 /*yield*/, budgetPage.getButtonForBudgeted(categoryName)];
                    case 5:
                        budgetedButton = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetedButton).toHaveText((0, util_1.amountToCurrency)(budgetAmount))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, fixtures_1.test)("copies last month's budget", function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryName, budgetedButton, lastMonthBudget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(3)];
                    case 2:
                        categoryName = _a.sent();
                        return [4 /*yield*/, budgetPage.getButtonForBudgeted(categoryName)];
                    case 3:
                        budgetedButton = _a.sent();
                        return [4 /*yield*/, budgetPage.goToPreviousMonth()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, budgetedButton.textContent()];
                    case 5:
                        lastMonthBudget = _a.sent();
                        if (!lastMonthBudget) {
                            throw new Error('Failed to get last month budget');
                        }
                        return [4 /*yield*/, budgetPage.goToNextMonth()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, copyLastMonthBudget(budgetPage, categoryName)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetedButton).toHaveText(lastMonthBudget)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        [
            [3, setTo3MonthAverage],
            [6, setTo6MonthAverage],
            [12, setToYearlyAverage],
        ].forEach(function (_a) {
            var numberOfMonths = _a[0], setBudgetAverageFn = _a[1];
            (0, fixtures_1.test)("set budget to ".concat(numberOfMonths, " month average"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var budgetPage, categoryName, averageSpent, budgetedButton;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                        case 1:
                            budgetPage = _a.sent();
                            return [4 /*yield*/, budgetPage.getCategoryNameForRow(3)];
                        case 2:
                            categoryName = _a.sent();
                            return [4 /*yield*/, setBudgetAverage(budgetPage, categoryName, numberOfMonths, setBudgetAverageFn)];
                        case 3:
                            averageSpent = _a.sent();
                            return [4 /*yield*/, budgetPage.getButtonForBudgeted(categoryName)];
                        case 4:
                            budgetedButton = _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(budgetedButton).toHaveText((0, util_1.amountToCurrency)(Math.abs(averageSpent)))];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        (0, fixtures_1.test)("applies budget template", function () { return __awaiter(void 0, void 0, void 0, function () {
            var settingsPage, budgetPage, categoryName, amountToTemplate, categoryMenuModal, editNotesModal, templateNotes, budgetedButton, budgetMenuModal, notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToSettingsPage()];
                    case 1:
                        settingsPage = _a.sent();
                        return [4 /*yield*/, settingsPage.enableExperimentalFeature('Goal templates')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 3:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(1)];
                    case 4:
                        categoryName = _a.sent();
                        amountToTemplate = 123;
                        return [4 /*yield*/, budgetPage.openCategoryMenu(categoryName)];
                    case 5:
                        categoryMenuModal = _a.sent();
                        return [4 /*yield*/, categoryMenuModal.editNotes()];
                    case 6:
                        editNotesModal = _a.sent();
                        templateNotes = "#template ".concat(amountToTemplate);
                        return [4 /*yield*/, editNotesModal.updateNotes(templateNotes)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, editNotesModal.close()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, budgetPage.getButtonForBudgeted(categoryName)];
                    case 9:
                        budgetedButton = _a.sent();
                        return [4 /*yield*/, budgetPage.openBudgetMenu(categoryName)];
                    case 10:
                        budgetMenuModal = _a.sent();
                        return [4 /*yield*/, budgetMenuModal.applyBudgetTemplate()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, budgetMenuModal.close()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(budgetedButton).toHaveText((0, util_1.amountToCurrency)(amountToTemplate))];
                    case 13:
                        _a.sent();
                        notification = page.getByRole('alert').first();
                        return [4 /*yield*/, (0, fixtures_1.expect)(notification).toContainText(templateNotes)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Spent Cell Tests
        (0, fixtures_1.test)('checks that clicking spent cell redirects to the category transactions page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryName, accountPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(0)];
                    case 2:
                        categoryName = _a.sent();
                        return [4 /*yield*/, budgetPage.openSpentPage(categoryName)];
                    case 3:
                        accountPage = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.heading).toContainText(categoryName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(accountPage.transactionList).toBeVisible()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Balance Cell Tests
        (0, fixtures_1.test)('checks that clicking the balance cell opens the balance menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var budgetPage, categoryName, balanceMenuModal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                    case 1:
                        budgetPage = _a.sent();
                        return [4 /*yield*/, budgetPage.getCategoryNameForRow(0)];
                    case 2:
                        categoryName = _a.sent();
                        return [4 /*yield*/, budgetPage.openBalanceMenu(categoryName)];
                    case 3:
                        balanceMenuModal = _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(balanceMenuModal.heading).toHaveText(categoryName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        if (budgetType === 'Envelope') {
            (0, fixtures_1.test)('checks that clicking the To Budget/Overbudgeted amount opens the budget summary menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
                var budgetPage, envelopeBudgetSummaryModal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                        case 1:
                            budgetPage = _a.sent();
                            return [4 /*yield*/, budgetPage.openEnvelopeBudgetSummary()];
                        case 2:
                            envelopeBudgetSummaryModal = _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(envelopeBudgetSummaryModal.heading).toHaveText('Budget Summary')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        if (budgetType === 'Tracking') {
            (0, fixtures_1.test)('checks that clicking the Saved/Projected Savings/Overspent amount opens the budget summary menu modal', function () { return __awaiter(void 0, void 0, void 0, function () {
                var budgetPage, trackingBudgetSummaryModal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigation.goToBudgetPage()];
                        case 1:
                            budgetPage = _a.sent();
                            return [4 /*yield*/, budgetPage.openTrackingBudgetSummary()];
                        case 2:
                            trackingBudgetSummaryModal = _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(trackingBudgetSummaryModal.heading).toHaveText('Budget Summary')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    });
});
