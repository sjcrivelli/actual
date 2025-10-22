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
exports.BudgetPage = void 0;
var account_page_1 = require("./account-page");
var BudgetPage = /** @class */ (function () {
    function BudgetPage(page) {
        this.page = page;
        this.budgetSummary = page.getByTestId('budget-summary');
        this.budgetTable = page.getByTestId('budget-table');
        this.budgetTableTotals = this.budgetTable.getByTestId('budget-totals');
    }
    BudgetPage.prototype.getTotalBudgeted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalBudgetedText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.budgetTableTotals
                            .getByTestId(/total-budgeted$/)
                            .textContent()];
                    case 1:
                        totalBudgetedText = _a.sent();
                        if (!totalBudgetedText) {
                            throw new Error('Failed to get total budgeted.');
                        }
                        return [2 /*return*/, parseInt(totalBudgetedText, 10)];
                }
            });
        });
    };
    BudgetPage.prototype.getTotalSpent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalSpentText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.budgetTableTotals
                            .getByTestId(/total-spent$/)
                            .textContent()];
                    case 1:
                        totalSpentText = _a.sent();
                        if (!totalSpentText) {
                            throw new Error('Failed to get total spent.');
                        }
                        return [2 /*return*/, parseInt(totalSpentText, 10)];
                }
            });
        });
    };
    BudgetPage.prototype.getTotalLeftover = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalLeftoverText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.budgetTableTotals
                            .getByTestId(/total-leftover$/)
                            .textContent()];
                    case 1:
                        totalLeftoverText = _a.sent();
                        if (!totalLeftoverText) {
                            throw new Error('Failed to get total leftover.');
                        }
                        return [2 /*return*/, parseInt(totalLeftoverText, 10)];
                }
            });
        });
    };
    BudgetPage.prototype.getTableTotals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, this.getTotalBudgeted()];
                    case 1:
                        _a.budgeted = _b.sent();
                        return [4 /*yield*/, this.getTotalSpent()];
                    case 2:
                        _a.spent = _b.sent();
                        return [4 /*yield*/, this.getTotalLeftover()];
                    case 3: return [2 /*return*/, (_a.balance = _b.sent(),
                            _a)];
                }
            });
        });
    };
    BudgetPage.prototype.showMoreMonths = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.getByTestId('calendar-icon').first().click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BudgetPage.prototype.getBalanceForRow = function (idx) {
        return __awaiter(this, void 0, void 0, function () {
            var balanceText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.budgetTable
                            .getByTestId('row')
                            .nth(idx)
                            .getByTestId('balance')
                            .textContent()];
                    case 1:
                        balanceText = _a.sent();
                        if (!balanceText) {
                            throw new Error("Failed to get balance on row index ".concat(idx, "."));
                        }
                        return [2 /*return*/, Math.round(parseFloat(balanceText.replace(/,/g, '')) * 100)];
                }
            });
        });
    };
    BudgetPage.prototype.getCategoryNameForRow = function (idx) {
        return __awaiter(this, void 0, void 0, function () {
            var categoryNameText;
            return __generator(this, function (_a) {
                categoryNameText = this.budgetTable
                    .getByTestId('row')
                    .nth(idx)
                    .getByTestId('category-name')
                    .textContent();
                if (!categoryNameText) {
                    throw new Error("Failed to get category name on row index ".concat(idx, "."));
                }
                return [2 /*return*/, categoryNameText];
            });
        });
    };
    BudgetPage.prototype.clickOnSpentAmountForRow = function (idx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.budgetTable
                            .getByTestId('row')
                            .nth(idx)
                            .getByTestId('category-month-spent')
                            .click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new account_page_1.AccountPage(this.page)];
                }
            });
        });
    };
    BudgetPage.prototype.transferAllBalance = function (fromIdx, toIdx) {
        return __awaiter(this, void 0, void 0, function () {
            var toName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCategoryNameForRow(toIdx)];
                    case 1:
                        toName = _a.sent();
                        if (!toName) {
                            throw new Error("Unable to get category name of row index ".concat(toIdx, "."));
                        }
                        return [4 /*yield*/, this.budgetTable
                                .getByTestId('row')
                                .nth(fromIdx)
                                .getByTestId('balance')
                                .getByTestId(/^budget/)
                                .click()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page
                                .getByRole('button', { name: 'Transfer to another category' })
                                .click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.page.getByPlaceholder('(none)').click()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(toName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Enter')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'Transfer' }).click()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return BudgetPage;
}());
exports.BudgetPage = BudgetPage;
