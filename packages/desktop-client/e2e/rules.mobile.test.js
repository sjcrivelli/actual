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
var mobile_navigation_1 = require("./page-models/mobile-navigation");
fixtures_1.test.describe('Mobile Rules', function () {
    var page;
    var navigation;
    var rulesPage;
    var configurationPage;
    fixtures_1.test.beforeEach(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var browser = _b.browser;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1:
                    page = _c.sent();
                    navigation = new mobile_navigation_1.MobileNavigation(page);
                    configurationPage = new configuration_page_1.ConfigurationPage(page);
                    // Set mobile viewport
                    return [4 /*yield*/, page.setViewportSize({
                            width: 350,
                            height: 600,
                        })];
                case 2:
                    // Set mobile viewport
                    _c.sent();
                    return [4 /*yield*/, page.goto('/')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, configurationPage.createTestFile()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, navigation.goToRulesPage()];
                case 5:
                    // Navigate to rules page and wait for it to load
                    rulesPage = _c.sent();
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
                case 0: return [4 /*yield*/, rulesPage.searchFor('Dominion')];
                case 1:
                    _a.sent();
                    // Check that the header is present
                    return [4 /*yield*/, (0, fixtures_1.expect)(page.getByRole('heading', { name: 'Rules' })).toBeVisible()];
                case 2:
                    // Check that the header is present
                    _a.sent();
                    // Check that the add button is present
                    return [4 /*yield*/, (0, fixtures_1.expect)(rulesPage.addButton).toBeVisible()];
                case 3:
                    // Check that the add button is present
                    _a.sent();
                    // Check that the search box is present with proper placeholder
                    return [4 /*yield*/, (0, fixtures_1.expect)(rulesPage.searchBox).toBeVisible()];
                case 4:
                    // Check that the search box is present with proper placeholder
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(rulesPage.searchBox).toHaveAttribute('placeholder', 'Filter rules…')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('clicking add button opens rule creation form', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rulesPage.clickAddRule()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('clicking on a rule opens edit form', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ruleCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rulesPage.getRuleCount()];
                case 1:
                    ruleCount = _a.sent();
                    (0, fixtures_1.expect)(ruleCount).toBeGreaterThan(0);
                    return [4 /*yield*/, rulesPage.clickRule(0)];
                case 2:
                    _a.sent();
                    // Click on the header to have consistent focused element
                    // (otherwise sometimes the condition field is "hovered" and thus has a different background color)
                    return [4 /*yield*/, page.getByRole('heading', { name: 'Edit Rule' }).click()];
                case 3:
                    // Click on the header to have consistent focused element
                    // (otherwise sometimes the condition field is "hovered" and thus has a different background color)
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('page handles empty state gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var emptyMessage, rules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Search for something that won't match to get empty state
                return [4 /*yield*/, rulesPage.searchFor('NonExistentRule123456789')];
                case 1:
                    // Search for something that won't match to get empty state
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(500)];
                case 2:
                    _a.sent();
                    emptyMessage = page.getByText(/No rules found/);
                    return [4 /*yield*/, (0, fixtures_1.expect)(emptyMessage).toBeVisible()];
                case 3:
                    _a.sent();
                    rules = rulesPage.getAllRules();
                    return [4 /*yield*/, (0, fixtures_1.expect)(rules).toHaveCount(0)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
