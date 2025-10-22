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
exports.Navigation = void 0;
var account_page_1 = require("./account-page");
var payees_page_1 = require("./payees-page");
var reports_page_1 = require("./reports-page");
var rules_page_1 = require("./rules-page");
var schedules_page_1 = require("./schedules-page");
var settings_page_1 = require("./settings-page");
var Navigation = /** @class */ (function () {
    function Navigation(page) {
        this.page = page;
    }
    Navigation.prototype.goToAccountPage = function (accountName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page
                            .getByRole('link', { name: new RegExp("^".concat(accountName)) })
                            .click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new account_page_1.AccountPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.goToReportsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.getByRole('link', { name: 'Reports' }).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new reports_page_1.ReportsPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.goToSchedulesPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.getByRole('link', { name: 'Schedules' }).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new schedules_page_1.SchedulesPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.goToRulesPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rulesLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rulesLink = this.page.getByRole('link', { name: 'Rules' });
                        return [4 /*yield*/, rulesLink.isVisible()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'More' }).click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, rulesLink.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, new rules_page_1.RulesPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.goToPayeesPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payeesLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payeesLink = this.page.getByRole('link', { name: 'Payees' });
                        return [4 /*yield*/, payeesLink.isVisible()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'More' }).click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, payeesLink.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, new payees_page_1.PayeesPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.goToSettingsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settingsLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settingsLink = this.page.getByRole('link', { name: 'Settings' });
                        return [4 /*yield*/, settingsLink.isVisible()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'More' }).click()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, settingsLink.click()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, new settings_page_1.SettingsPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.createAccount = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.getByRole('button', { name: 'Add account' }).click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: 'Create a local account' })
                                .click()];
                    case 2:
                        _a.sent();
                        // Fill the form
                        return [4 /*yield*/, this.page.getByLabel('Name:').fill(data.name)];
                    case 3:
                        // Fill the form
                        _a.sent();
                        return [4 /*yield*/, this.page.getByLabel('Balance:').fill(String(data.balance))];
                    case 4:
                        _a.sent();
                        if (!data.offBudget) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.page.getByLabel('Off budget').click()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.page
                            .getByRole('button', { name: 'Create', exact: true })
                            .click()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, new account_page_1.AccountPage(this.page)];
                }
            });
        });
    };
    Navigation.prototype.clickOnNoServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.getByRole('button', { name: 'No server' }).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Navigation;
}());
exports.Navigation = Navigation;
