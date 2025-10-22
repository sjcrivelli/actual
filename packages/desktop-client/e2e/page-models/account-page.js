"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AccountPage = void 0;
var close_account_modal_1 = require("./close-account-modal");
var AccountPage = /** @class */ (function () {
    function AccountPage(page) {
        this.page = page;
        this.accountName = this.page.getByTestId('account-name');
        this.accountBalance = this.page.getByTestId('account-balance');
        this.addNewTransactionButton = this.page.getByRole('button', {
            name: 'Add New',
        });
        this.newTransactionRow = this.page
            .getByTestId('new-transaction')
            .getByTestId('row');
        this.addTransactionButton = this.page.getByTestId('add-button');
        this.cancelTransactionButton = this.page.getByRole('button', {
            name: 'Cancel',
        });
        this.accountMenuButton = this.page.getByRole('button', {
            name: 'Account menu',
        });
        this.transactionTable = this.page.getByTestId('transaction-table');
        this.transactionTableRow = this.transactionTable.getByTestId('row');
        this.filterButton = this.page.getByRole('button', { name: 'Filter' });
        this.filterSelectTooltip = this.page.getByTestId('filters-select-tooltip');
        this.selectButton = this.page.getByTestId('transactions-select-button');
        this.selectTooltip = this.page.getByTestId('transactions-select-tooltip');
    }
    AccountPage.prototype.waitFor = function () {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (_a = this.transactionTable).waitFor.apply(_a, options)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Enter details of a transaction
     */
    AccountPage.prototype.enterSingleTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addNewTransactionButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._fillTransactionFields(this.newTransactionRow, transaction)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finish adding a transaction
     */
    AccountPage.prototype.addEnteredTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addTransactionButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.cancelTransactionButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a single transaction
     */
    AccountPage.prototype.createSingleTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.enterSingleTransaction(transaction)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addEnteredTransaction()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create split transactions
     */
    AccountPage.prototype.createSplitTransaction = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var transactionRow, i;
            var rootTransaction = _b[0], transactions = _b.slice(1);
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.addNewTransactionButton.click()];
                    case 1:
                        _c.sent();
                        transactionRow = this.newTransactionRow.first();
                        return [4 /*yield*/, this._fillTransactionFields(transactionRow, __assign(__assign({}, rootTransaction), { category: 'split' }))];
                    case 2:
                        _c.sent();
                        i = 0;
                        _c.label = 3;
                    case 3:
                        if (!(i < transactions.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._fillTransactionFields(this.newTransactionRow.nth(i + 1), transactions[i])];
                    case 4:
                        _c.sent();
                        if (!(i + 1 < transactions.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'Add Split' }).click()];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [4 /*yield*/, this.addTransactionButton.click()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, this.cancelTransactionButton.click()];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPage.prototype.selectNthTransaction = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.transactionTableRow.nth(index);
                        return [4 /*yield*/, row.getByTestId('select').click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve the data for the nth-transaction.
     * 0-based index
     */
    AccountPage.prototype.getNthTransaction = function (index) {
        var row = this.transactionTableRow.nth(index);
        return this._getTransactionDetails(row);
    };
    AccountPage.prototype.getEnteredTransaction = function () {
        return this._getTransactionDetails(this.newTransactionRow);
    };
    AccountPage.prototype._getTransactionDetails = function (row) {
        return {
            account: row.getByTestId('account'),
            payee: row.getByTestId('payee'),
            notes: row.getByTestId('notes'),
            category: row.getByTestId('category'),
            debit: row.getByTestId('debit'),
            credit: row.getByTestId('credit'),
        };
    };
    AccountPage.prototype.clickSelectAction = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.selectTooltip.getByRole('button', { name: action }).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Open the modal for closing the account.
     */
    AccountPage.prototype.clickCloseAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.accountMenuButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.getByRole('button', { name: 'Close Account' }).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new close_account_modal_1.CloseAccountModal(this.page.getByTestId('close-account-modal'))];
                }
            });
        });
    };
    /**
     * Open the filtering popover.
     */
    AccountPage.prototype.filterBy = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filterButton.click()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.filterSelectTooltip.getByRole('button', { name: field }).click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new FilterTooltip(this.page.getByTestId('filters-menu-tooltip'))];
                }
            });
        });
    };
    /**
     * Filter to a specific note
     */
    AccountPage.prototype.filterByNote = function (note) {
        return __awaiter(this, void 0, void 0, function () {
            var filterTooltip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filterBy('Note')];
                    case 1:
                        filterTooltip = _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(note)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, filterTooltip.applyButton.click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove the nth filter
     */
    AccountPage.prototype.removeFilter = function (idx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page
                            .getByRole('button', { name: 'Delete filter' })
                            .nth(idx)
                            .click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPage.prototype._fillTransactionFields = function (transactionRow, transaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!transaction.debit) return [3 /*break*/, 4];
                        // double click to ensure the content is selected when adding split transactions
                        return [4 /*yield*/, transactionRow.getByTestId('debit').dblclick()];
                    case 1:
                        // double click to ensure the content is selected when adding split transactions
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(transaction.debit)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Tab')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!transaction.credit) return [3 /*break*/, 8];
                        return [4 /*yield*/, transactionRow.getByTestId('credit').click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(transaction.credit)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Tab')];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!transaction.account) return [3 /*break*/, 12];
                        return [4 /*yield*/, transactionRow.getByTestId('account').click()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(transaction.account)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Tab')];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        if (!transaction.payee) return [3 /*break*/, 16];
                        return [4 /*yield*/, transactionRow.getByTestId('payee').click()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(transaction.payee)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Tab')];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16:
                        if (!transaction.notes) return [3 /*break*/, 20];
                        return [4 /*yield*/, transactionRow.getByTestId('notes').click()];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.type(transaction.notes)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Tab')];
                    case 19:
                        _a.sent();
                        _a.label = 20;
                    case 20:
                        if (!transaction.category) return [3 /*break*/, 26];
                        return [4 /*yield*/, transactionRow.getByTestId('category').click()];
                    case 21:
                        _a.sent();
                        if (!(transaction.category === 'split')) return [3 /*break*/, 23];
                        return [4 /*yield*/, this.page.getByTestId('split-transaction-button').click()];
                    case 22:
                        _a.sent();
                        return [3 /*break*/, 26];
                    case 23: return [4 /*yield*/, this.page.keyboard.type(transaction.category)];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, this.page.keyboard.press('Tab')];
                    case 25:
                        _a.sent();
                        _a.label = 26;
                    case 26: return [2 /*return*/];
                }
            });
        });
    };
    return AccountPage;
}());
exports.AccountPage = AccountPage;
var FilterTooltip = /** @class */ (function () {
    function FilterTooltip(locator) {
        this.locator = locator;
        this.applyButton = locator.getByRole('button', { name: 'Apply' });
    }
    return FilterTooltip;
}());
