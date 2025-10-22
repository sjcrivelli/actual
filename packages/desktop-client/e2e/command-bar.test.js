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
fixtures_1.test.describe('Command bar', function () {
    var page;
    var configurationPage;
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
                    _c.sent();
                    // Move mouse to corner of the screen;
                    // sometimes the mouse hovers on a budget element thus rendering an input box
                    // and this breaks screenshot tests
                    return [4 /*yield*/, page.mouse.move(0, 0)];
                case 4:
                    // Move mouse to corner of the screen;
                    // sometimes the mouse hovers on a budget element thus rendering an input box
                    // and this breaks screenshot tests
                    _c.sent();
                    // ensure page is loaded
                    return [4 /*yield*/, (0, fixtures_1.expect)(page.getByTestId('budget-table')).toBeVisible()];
                case 5:
                    // ensure page is loaded
                    _c.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page.getByRole('button', { name: 'Add group' })).toBeVisible({
                            timeout: 10000,
                        })];
                case 6:
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
    (0, fixtures_1.test)('Check the command bar visuals', function () { return __awaiter(void 0, void 0, void 0, function () {
        var commandBar;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Open the command bar
                return [4 /*yield*/, page.keyboard.press('ControlOrMeta+k')];
                case 1:
                    // Open the command bar
                    _a.sent();
                    commandBar = page.getByRole('combobox', {
                        name: 'Command Bar',
                    });
                    return [4 /*yield*/, (0, fixtures_1.expect)(commandBar).toBeVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 3:
                    _a.sent();
                    // Close the command bar
                    return [4 /*yield*/, page.keyboard.press('Escape')];
                case 4:
                    // Close the command bar
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(commandBar).not.toBeVisible()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, fixtures_1.test)('Check the command bar search works correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var commandBar;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.keyboard.press('ControlOrMeta+k')];
                case 1:
                    _a.sent();
                    commandBar = page.getByRole('combobox', {
                        name: 'Command Bar',
                    });
                    return [4 /*yield*/, (0, fixtures_1.expect)(commandBar).toBeVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(commandBar).toHaveValue('')];
                case 3:
                    _a.sent();
                    // Search and navigate to reports
                    return [4 /*yield*/, commandBar.fill('reports')];
                case 4:
                    // Search and navigate to reports
                    _a.sent();
                    return [4 /*yield*/, page.keyboard.press('Enter')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page.getByTestId('reports-page')).toBeVisible()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page.getByText('Loading reports...')).not.toBeVisible()];
                case 7:
                    _a.sent(); // wait for screen to load
                    // Navigate to schedule page
                    return [4 /*yield*/, page.keyboard.press('ControlOrMeta+k')];
                case 8:
                    // Navigate to schedule page
                    _a.sent();
                    return [4 /*yield*/, page.keyboard.press('ArrowDown')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, page.keyboard.press('ArrowDown')];
                case 10:
                    _a.sent(); // Select second suggestion - Schedules
                    return [4 /*yield*/, (0, fixtures_1.expect)(page).toMatchThemeScreenshots()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, page.keyboard.press('Enter')];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, (0, fixtures_1.expect)(page.getByRole('button', {
                            name: 'Add new schedule',
                        })).toBeVisible()];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
