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
exports.MobileNavigation = void 0;
var mobile_account_page_1 = require("./mobile-account-page");
var mobile_accounts_page_1 = require("./mobile-accounts-page");
var mobile_budget_page_1 = require("./mobile-budget-page");
var mobile_payees_page_1 = require("./mobile-payees-page");
var mobile_reports_page_1 = require("./mobile-reports-page");
var mobile_rules_page_1 = require("./mobile-rules-page");
var mobile_transaction_entry_page_1 = require("./mobile-transaction-entry-page");
var settings_page_1 = require("./settings-page");
var NAVBAR_ROWS = 3;
var NAV_LINKS_HIDDEN_BY_DEFAULT = [
    'Reports',
    'Schedules',
    'Payees',
    'Rules',
    'Settings',
];
var ROUTES_BY_PAGE = {
    Budget: '/budget',
    Accounts: '/accounts',
    Transaction: '/transactions/new',
    Reports: '/reports',
    Payees: '/payees',
    Rules: '/rules',
    Settings: '/settings',
};
var MobileNavigation = /** @class */ (function () {
    function MobileNavigation(page) {
        this.page = page;
        this.heading = page.getByRole('heading');
        this.navbar = page.getByRole('navigation');
        this.mainContentSelector = '[role=main]';
        this.navbarSelector = '[role=navigation]';
    }
    MobileNavigation.prototype.dragNavbarUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mainContentBoundingBox, navbarBoundingBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page
                            .locator(this.mainContentSelector)
                            .boundingBox()];
                    case 1:
                        mainContentBoundingBox = _a.sent();
                        if (!mainContentBoundingBox) {
                            throw new Error('Unable to get bounding box of main content.');
                        }
                        return [4 /*yield*/, this.page
                                .locator(this.navbarSelector)
                                .boundingBox()];
                    case 2:
                        navbarBoundingBox = _a.sent();
                        if (!navbarBoundingBox) {
                            throw new Error('Unable to get bounding box of navbar.');
                        }
                        return [4 /*yield*/, this.page.dragAndDrop(this.navbarSelector, this.mainContentSelector, {
                                sourcePosition: { x: 1, y: 0 },
                                targetPosition: {
                                    x: 1,
                                    y: mainContentBoundingBox.height - navbarBoundingBox.height,
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileNavigation.prototype.dragNavbarDown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var boundingBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page
                            .locator(this.navbarSelector)
                            .boundingBox()];
                    case 1:
                        boundingBox = _a.sent();
                        if (!boundingBox) {
                            throw new Error('Unable to get bounding box of navbar.');
                        }
                        return [4 /*yield*/, this.page.dragAndDrop(this.navbarSelector, this.navbarSelector, {
                                sourcePosition: { x: 1, y: 0 },
                                targetPosition: {
                                    x: 1,
                                    // Only scroll until bottom of screen i.e. bottom of first navbar row.
                                    y: boundingBox.height / NAVBAR_ROWS,
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileNavigation.prototype.hasNavbarState = function () {
        var states = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            states[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var dataNavbarState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navbar.count()];
                    case 1:
                        if ((_a.sent()) === 0) {
                            // No navbar on page.
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.navbar.getAttribute('data-navbar-state')];
                    case 2:
                        dataNavbarState = _a.sent();
                        if (!dataNavbarState) {
                            throw new Error('Navbar does not have data-navbar-state attribute.');
                        }
                        return [2 /*return*/, states.includes(dataNavbarState)];
                }
            });
        });
    };
    MobileNavigation.prototype.navigateToPage = function (pageName, pageModelFactory) {
        return __awaiter(this, void 0, void 0, function () {
            var pageInstance, navbarStates, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageInstance = pageModelFactory();
                        if (this.page.url().endsWith(ROUTES_BY_PAGE[pageName])) {
                            // Already on the page.
                            return [2 /*return*/, pageInstance];
                        }
                        return [4 /*yield*/, this.navbar.waitFor()];
                    case 1:
                        _a.sent();
                        navbarStates = NAV_LINKS_HIDDEN_BY_DEFAULT.includes(pageName)
                            ? ['default', 'hidden']
                            : ['hidden'];
                        return [4 /*yield*/, this.hasNavbarState.apply(this, navbarStates)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dragNavbarUp()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        link = this.navbar.getByRole('link', { name: pageName });
                        return [4 /*yield*/, link.click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, pageInstance.waitFor()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.hasNavbarState('open')];
                    case 7:
                        if (!_a.sent()) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.dragNavbarDown()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, pageInstance];
                }
            });
        });
    };
    MobileNavigation.prototype.goToBudgetPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Budget', function () { return new mobile_budget_page_1.MobileBudgetPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileNavigation.prototype.goToAccountsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Accounts', function () { return new mobile_accounts_page_1.MobileAccountsPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileNavigation.prototype.goToUncategorizedPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        button = this.page.getByRole('button', { name: 'Categorize' });
                        return [4 /*yield*/, button.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new mobile_account_page_1.MobileAccountPage(this.page)];
                }
            });
        });
    };
    MobileNavigation.prototype.goToTransactionEntryPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Transaction', function () { return new mobile_transaction_entry_page_1.MobileTransactionEntryPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileNavigation.prototype.goToReportsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Reports', function () { return new mobile_reports_page_1.MobileReportsPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileNavigation.prototype.goToPayeesPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Payees', function () { return new mobile_payees_page_1.MobilePayeesPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileNavigation.prototype.goToRulesPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Rules', function () { return new mobile_rules_page_1.MobileRulesPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileNavigation.prototype.goToSettingsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigateToPage('Settings', function () { return new settings_page_1.SettingsPage(_this.page); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MobileNavigation;
}());
exports.MobileNavigation = MobileNavigation;
