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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MobileBudgetPage_instances, _MobileBudgetPage_getButtonForCategoryGroup, _MobileBudgetPage_getButtonForCategory, _MobileBudgetPage_getButtonForCell, _MobileBudgetPage_waitForNewMonthToLoad, _MobileBudgetPage_getButtonForEnvelopeBudgetSummary, _MobileBudgetPage_getButtonForTrackingBudgetSummary;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileBudgetPage = void 0;
var mobile_account_page_1 = require("./mobile-account-page");
var mobile_balance_menu_modal_1 = require("./mobile-balance-menu-modal");
var mobile_budget_menu_modal_1 = require("./mobile-budget-menu-modal");
var mobile_category_menu_modal_1 = require("./mobile-category-menu-modal");
var mobile_envelope_budget_summary_modal_1 = require("./mobile-envelope-budget-summary-modal");
var mobile_tracking_budget_summary_modal_1 = require("./mobile-tracking-budget-summary-modal");
var MobileBudgetPage = /** @class */ (function () {
    function MobileBudgetPage(page) {
        _MobileBudgetPage_instances.add(this);
        this.MONTH_HEADER_DATE_FORMAT = 'MMMM ‘yy';
        this.page = page;
        // Page header locators
        this.heading = page.getByRole('heading');
        this.previousMonthButton = this.heading.getByRole('button', {
            name: 'Previous month',
        });
        this.selectedBudgetMonthButton = this.heading.locator('button[data-month]');
        this.nextMonthButton = this.heading.getByRole('button', {
            name: 'Next month',
        });
        this.budgetPageMenuButton = page.getByRole('button', {
            name: 'Budget page menu',
        });
        // Budget table locators
        this.budgetTableHeader = page.getByTestId('budget-table-header');
        // Envelope budget summary buttons
        this.toBudgetButton = this.budgetTableHeader.getByRole('button', {
            name: 'To Budget',
        });
        this.overbudgetedButton = this.budgetTableHeader.getByRole('button', {
            name: 'Overbudgeted',
        });
        // Tracking budget summary buttons
        this.savedButton = this.budgetTableHeader.getByRole('button', {
            name: 'Saved',
        });
        this.projectedSavingsButton = this.budgetTableHeader.getByRole('button', {
            name: 'Projected savings',
        });
        this.overspentButton = this.budgetTableHeader.getByRole('button', {
            name: 'Overspent',
        });
        this.budgetedHeaderButton = this.budgetTableHeader.getByRole('button', {
            name: 'Budgeted',
        });
        this.spentHeaderButton = this.budgetTableHeader.getByRole('button', {
            name: 'Spent',
        });
        this.budgetTable = page.getByTestId('budget-table');
        this.categoryRows = this.budgetTable
            .getByTestId('budget-groups')
            .getByTestId('category-row');
        this.categoryNames = this.categoryRows.getByTestId('category-name');
        this.categoryGroupRows = this.budgetTable
            .getByTestId('budget-groups')
            .getByTestId('category-group-row');
        this.categoryGroupNames = this.categoryGroupRows.getByTestId('category-group-name');
    }
    MobileBudgetPage.prototype.determineBudgetType = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForEnvelopeBudgetSummary).call(this, {
                            throwIfNotFound: false,
                        })];
                    case 1: return [2 /*return*/, (_a.sent()) !== null
                            ? 'Envelope'
                            : 'Tracking'];
                }
            });
        });
    };
    MobileBudgetPage.prototype.waitFor = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (_a = this.budgetTable).waitFor.apply(_a, options)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileBudgetPage.prototype.toggleVisibleColumns = function () {
        return __awaiter(this, arguments, void 0, function (_a) {
            var i;
            var _b = _a === void 0 ? {} : _a, _c = _b.maxAttempts, maxAttempts = _c === void 0 ? 3 : _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(i < maxAttempts)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.budgetedHeaderButton.isVisible()];
                    case 2:
                        if (!_d.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.budgetedHeaderButton.click()];
                    case 3:
                        _d.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.spentHeaderButton.isVisible()];
                    case 5:
                        if (!_d.sent()) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.spentHeaderButton.click()];
                    case 6:
                        _d.sent();
                        return [2 /*return*/];
                    case 7: return [4 /*yield*/, this.page.waitForTimeout(1000)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 1];
                    case 10: throw new Error('Budgeted/Spent columns could not be located on the page.');
                }
            });
        });
    };
    MobileBudgetPage.prototype.getSelectedMonth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectedMonth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.heading
                            .locator('[data-month]')
                            .getAttribute('data-month')];
                    case 1:
                        selectedMonth = _a.sent();
                        if (!selectedMonth) {
                            throw new Error('Failed to get the selected month.');
                        }
                        return [2 /*return*/, selectedMonth];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openBudgetPageMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.budgetPageMenuButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileBudgetPage.prototype.getCategoryGroupNameForRow = function (idx) {
        return __awaiter(this, void 0, void 0, function () {
            var groupNameText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryGroupNames.nth(idx).textContent()];
                    case 1:
                        groupNameText = _a.sent();
                        if (!groupNameText) {
                            throw new Error("Failed to get category group name for row ".concat(idx, "."));
                        }
                        return [2 /*return*/, groupNameText];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openCategoryGroupMenu = function (categoryGroupName) {
        return __awaiter(this, void 0, void 0, function () {
            var categoryGroupButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForCategoryGroup).call(this, categoryGroupName)];
                    case 1:
                        categoryGroupButton = _a.sent();
                        return [4 /*yield*/, categoryGroupButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileBudgetPage.prototype.getCategoryNameForRow = function (idx) {
        return __awaiter(this, void 0, void 0, function () {
            var categoryNameText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.categoryNames.nth(idx).textContent()];
                    case 1:
                        categoryNameText = _a.sent();
                        if (!categoryNameText) {
                            throw new Error("Failed to get category name for row ".concat(idx, "."));
                        }
                        return [2 /*return*/, categoryNameText];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openCategoryMenu = function (categoryName) {
        return __awaiter(this, void 0, void 0, function () {
            var categoryButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForCategory).call(this, categoryName)];
                    case 1:
                        categoryButton = _a.sent();
                        return [4 /*yield*/, categoryButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new mobile_category_menu_modal_1.CategoryMenuModal(this.page.getByRole('dialog', {
                                name: 'Modal dialog',
                            }))];
                }
            });
        });
    };
    MobileBudgetPage.prototype.getButtonForBudgeted = function (categoryName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForCell).call(this, 'Budgeted', categoryName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileBudgetPage.prototype.getButtonForSpent = function (categoryName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForCell).call(this, 'Spent', categoryName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openBudgetMenu = function (categoryName) {
        return __awaiter(this, void 0, void 0, function () {
            var budgetedButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getButtonForBudgeted(categoryName)];
                    case 1:
                        budgetedButton = _a.sent();
                        return [4 /*yield*/, budgetedButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new mobile_budget_menu_modal_1.BudgetMenuModal(this.page.getByRole('dialog', {
                                name: 'Modal dialog',
                            }))];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openSpentPage = function (categoryName) {
        return __awaiter(this, void 0, void 0, function () {
            var spentButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getButtonForSpent(categoryName)];
                    case 1:
                        spentButton = _a.sent();
                        return [4 /*yield*/, spentButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new mobile_account_page_1.MobileAccountPage(this.page)];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openBalanceMenu = function (categoryName) {
        return __awaiter(this, void 0, void 0, function () {
            var balanceButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        balanceButton = this.budgetTable.getByRole('button', {
                            name: "Open balance menu for ".concat(categoryName, " category"),
                        });
                        return [4 /*yield*/, balanceButton.isVisible()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, balanceButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new mobile_balance_menu_modal_1.BalanceMenuModal(this.page.getByRole('dialog', {
                                name: 'Modal dialog',
                            }))];
                    case 3: throw new Error("Balance button for category ".concat(categoryName, " not found or not visible."));
                }
            });
        });
    };
    MobileBudgetPage.prototype.goToPreviousMonth = function () {
        return __awaiter(this, arguments, void 0, function (_a) {
            var currentMonth;
            var _b = _a === void 0 ? {} : _a, _c = _b.maxAttempts, maxAttempts = _c === void 0 ? 3 : _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getSelectedMonth()];
                    case 1:
                        currentMonth = _d.sent();
                        return [4 /*yield*/, this.previousMonthButton.click()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_waitForNewMonthToLoad).call(this, {
                                currentMonth: currentMonth,
                                maxAttempts: maxAttempts,
                                errorMessage: 'Failed to navigate to the previous month after maximum attempts.',
                            })];
                    case 3: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openMonthMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectedBudgetMonthButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MobileBudgetPage.prototype.goToNextMonth = function () {
        return __awaiter(this, arguments, void 0, function (_a) {
            var currentMonth;
            var _b = _a === void 0 ? {} : _a, _c = _b.maxAttempts, maxAttempts = _c === void 0 ? 3 : _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getSelectedMonth()];
                    case 1:
                        currentMonth = _d.sent();
                        return [4 /*yield*/, this.nextMonthButton.click()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_waitForNewMonthToLoad).call(this, {
                                currentMonth: currentMonth,
                                maxAttempts: maxAttempts,
                                errorMessage: 'Failed to navigate to the next month after maximum attempts.',
                            })];
                    case 3: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openEnvelopeBudgetSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var budgetSummaryButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForEnvelopeBudgetSummary).call(this)];
                    case 1:
                        budgetSummaryButton = _a.sent();
                        if (!budgetSummaryButton) {
                            throw new Error('Envelope budget summary button not found.');
                        }
                        return [4 /*yield*/, budgetSummaryButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new mobile_envelope_budget_summary_modal_1.EnvelopeBudgetSummaryModal(this.page.getByRole('dialog', {
                                name: 'Modal dialog',
                            }))];
                }
            });
        });
    };
    MobileBudgetPage.prototype.openTrackingBudgetSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var budgetSummaryButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __classPrivateFieldGet(this, _MobileBudgetPage_instances, "m", _MobileBudgetPage_getButtonForTrackingBudgetSummary).call(this)];
                    case 1:
                        budgetSummaryButton = _a.sent();
                        if (!budgetSummaryButton) {
                            throw new Error('Tracking budget summary button not found.');
                        }
                        return [4 /*yield*/, budgetSummaryButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new mobile_tracking_budget_summary_modal_1.TrackingBudgetSummaryModal(this.page.getByRole('dialog', {
                                name: 'Modal dialog',
                            }))];
                }
            });
        });
    };
    return MobileBudgetPage;
}());
exports.MobileBudgetPage = MobileBudgetPage;
_MobileBudgetPage_instances = new WeakSet(), _MobileBudgetPage_getButtonForCategoryGroup = function _MobileBudgetPage_getButtonForCategoryGroup(categoryGroupName) {
    return this.categoryGroupRows.getByRole('button', {
        name: categoryGroupName,
        exact: true,
    });
}, _MobileBudgetPage_getButtonForCategory = function _MobileBudgetPage_getButtonForCategory(categoryName) {
    return this.categoryRows.getByRole('button', {
        name: categoryName,
        exact: true,
    });
}, _MobileBudgetPage_getButtonForCell = function _MobileBudgetPage_getButtonForCell(buttonType, categoryName) {
    return __awaiter(this, void 0, void 0, function () {
        var buttonSelector, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buttonSelector = buttonType === 'Budgeted'
                        ? "Open budget menu for ".concat(categoryName, " category")
                        : "Show transactions for ".concat(categoryName, " category");
                    button = this.budgetTable.getByRole('button', { name: buttonSelector });
                    return [4 /*yield*/, button.isVisible()];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/, button];
                    }
                    return [4 /*yield*/, this.toggleVisibleColumns()];
                case 2:
                    _a.sent();
                    button = this.budgetTable.getByRole('button', { name: buttonSelector });
                    return [4 /*yield*/, button.isVisible()];
                case 3:
                    if (_a.sent()) {
                        return [2 /*return*/, button];
                    }
                    throw new Error("".concat(buttonType, " button for category ").concat(categoryName, " could not be located on the page."));
            }
        });
    });
}, _MobileBudgetPage_waitForNewMonthToLoad = function _MobileBudgetPage_waitForNewMonthToLoad(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var attempt, newMonth;
        var currentMonth = _b.currentMonth, errorMessage = _b.errorMessage, _c = _b.maxAttempts, maxAttempts = _c === void 0 ? 3 : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    attempt = 0;
                    _d.label = 1;
                case 1:
                    if (!(attempt < maxAttempts)) return [3 /*break*/, 5];
                    return [4 /*yield*/, this.getSelectedMonth()];
                case 2:
                    newMonth = _d.sent();
                    if (newMonth !== currentMonth) {
                        return [2 /*return*/, newMonth];
                    }
                    return [4 /*yield*/, this.page.waitForTimeout(500)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    attempt++;
                    return [3 /*break*/, 1];
                case 5: throw new Error(errorMessage);
            }
        });
    });
}, _MobileBudgetPage_getButtonForEnvelopeBudgetSummary = function _MobileBudgetPage_getButtonForEnvelopeBudgetSummary() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.throwIfNotFound, throwIfNotFound = _c === void 0 ? true : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, this.toBudgetButton.isVisible()];
                case 1:
                    if (_d.sent()) {
                        return [2 /*return*/, this.toBudgetButton];
                    }
                    return [4 /*yield*/, this.overbudgetedButton.isVisible()];
                case 2:
                    if (_d.sent()) {
                        return [2 /*return*/, this.overbudgetedButton];
                    }
                    if (!throwIfNotFound) {
                        return [2 /*return*/, null];
                    }
                    throw new Error('Neither “To Budget” nor “Overbudgeted” button could be located on the page.');
            }
        });
    });
}, _MobileBudgetPage_getButtonForTrackingBudgetSummary = function _MobileBudgetPage_getButtonForTrackingBudgetSummary() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.throwIfNotFound, throwIfNotFound = _c === void 0 ? true : _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, this.savedButton.isVisible()];
                case 1:
                    if (_d.sent()) {
                        return [2 /*return*/, this.savedButton];
                    }
                    return [4 /*yield*/, this.projectedSavingsButton.isVisible()];
                case 2:
                    if (_d.sent()) {
                        return [2 /*return*/, this.projectedSavingsButton];
                    }
                    return [4 /*yield*/, this.overspentButton.isVisible()];
                case 3:
                    if (_d.sent()) {
                        return [2 /*return*/, this.overspentButton];
                    }
                    if (!throwIfNotFound) {
                        return [2 /*return*/, null];
                    }
                    throw new Error('None of “Saved”, “Projected savings”, or “Overspent” buttons could be located on the page.');
            }
        });
    });
};
