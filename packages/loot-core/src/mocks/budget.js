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
exports.createTestBudget = createTestBudget;
// @ts-strict-ignore
var uuid_1 = require("uuid");
var sync_1 = require("../server/accounts/sync");
var aql_1 = require("../server/aql");
var budgetActions = require("../server/budget/actions");
var budget = require("../server/budget/base");
var db = require("../server/db");
var mutators_1 = require("../server/mutators");
var sheet = require("../server/sheet");
var sync_2 = require("../server/sync");
var monthUtils = require("../shared/months");
var query_1 = require("../shared/query");
var random_1 = require("./random");
function pickRandom(list) {
    return list[Math.floor((0, random_1.random)() * list.length) % list.length];
}
function number(start, end) {
    return start + (end - start) * (0, random_1.random)();
}
function integer(start, end) {
    return Math.round(number(start, end));
}
function findMin(items, field) {
    var item = items[0];
    for (var i = 0; i < items.length; i++) {
        if (items[i][field] < item[field]) {
            item = items[i];
        }
    }
    return item;
}
function getStartingBalanceCat(categories) {
    return categories.find(function (c) { return c.name === 'Starting Balances'; }).id;
}
function extractCommonThings(payees, groups) {
    var incomePayee = payees.find(function (p) { return p.name === 'Deposit'; });
    var expensePayees = payees.filter(function (p) { return p.name !== 'Deposit' && p.name !== 'Starting Balance'; });
    var expenseGroup = groups.find(function (g) { return !g.is_income; });
    var incomeGroup = groups.find(function (g) { return g.is_income; });
    var categories = expenseGroup.categories.filter(function (c) {
        return [
            'Food',
            'Restaurants',
            'Entertainment',
            'Clothing',
            'General',
            'Gift',
            'Medical',
        ].indexOf(c.name) !== -1;
    });
    return {
        incomePayee: incomePayee,
        expensePayees: expensePayees.filter(function (p) { return !p.bill; }),
        incomeGroup: incomeGroup,
        expenseCategories: categories,
        billCategories: groups.find(function (g) { return g.name === 'Bills'; }).categories,
        billPayees: expensePayees.filter(function (p) { return p.bill; }),
    };
}
function fillPrimaryChecking(handlers, account, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, incomePayee, expensePayees, incomeGroup, expenseCategories, billCategories, billPayees, numTransactions, transactions, _loop_1, i, earliestMonth, months, currentDay, _i, months_1, month, date, earliestDate;
        return __generator(this, function (_b) {
            _a = extractCommonThings(payees, groups), incomePayee = _a.incomePayee, expensePayees = _a.expensePayees, incomeGroup = _a.incomeGroup, expenseCategories = _a.expenseCategories, billCategories = _a.billCategories, billPayees = _a.billPayees;
            numTransactions = integer(100, 200);
            transactions = [];
            _loop_1 = function (i) {
                var payee;
                if ((0, random_1.random)() < 0.09) {
                    payee = incomePayee;
                }
                else {
                    payee = pickRandom(expensePayees);
                }
                var category = void 0;
                if (payee.name === 'Deposit') {
                    category = incomeGroup.categories.find(function (c) { return c.name === 'Income'; });
                }
                else {
                    category = pickRandom(expenseCategories);
                }
                var amount = void 0;
                if (payee.name === 'Deposit') {
                    amount = integer(50000, 70000);
                }
                else {
                    amount = integer(0, (0, random_1.random)() < 0.05 ? -8000 : -700);
                }
                var currentDate = monthUtils.subDays(monthUtils.currentDay(), Math.floor(i / 3));
                var transaction = {
                    id: (0, uuid_1.v4)(),
                    amount: amount,
                    payee: payee.id,
                    account: account.id,
                    date: currentDate,
                    category: category.id,
                };
                transactions.push(transaction);
                if ((0, random_1.random)() < 0.2) {
                    var a = Math.round(transaction.amount / 3);
                    var pick = function () {
                        return payee === incomePayee
                            ? incomeGroup.categories.find(function (c) { return c.name === 'Income'; }).id
                            : pickRandom(expenseCategories).id;
                    };
                    transaction.subtransactions = [
                        {
                            id: (0, uuid_1.v4)(),
                            date: currentDate,
                            account: account.id,
                            amount: a,
                            category: pick(),
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            date: currentDate,
                            account: account.id,
                            amount: a,
                            category: pick(),
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            date: currentDate,
                            account: account.id,
                            amount: transaction.amount - a * 2,
                            category: pick(),
                        },
                    ];
                }
            };
            for (i = 0; i < numTransactions; i++) {
                _loop_1(i);
            }
            earliestMonth = monthUtils.monthFromDate(transactions[transactions.length - 1].date);
            months = monthUtils.rangeInclusive(earliestMonth, monthUtils.currentMonth());
            currentDay = monthUtils.currentDay();
            for (_i = 0, months_1 = months; _i < months_1.length; _i++) {
                month = months_1[_i];
                date = monthUtils.addDays(month, 12);
                if (monthUtils.isBefore(date, currentDay)) {
                    transactions.push({
                        amount: -10000,
                        payee: billPayees.find(function (p) { return p.name.toLowerCase().includes('power'); }).id,
                        account: account.id,
                        date: date,
                        category: billCategories.find(function (c) { return c.name === 'Power'; }).id,
                    });
                }
                date = monthUtils.addDays(month, 18);
                if (monthUtils.isBefore(date, currentDay)) {
                    transactions.push({
                        amount: -9000,
                        payee: billPayees.find(function (p) { return p.name.toLowerCase().includes('water'); }).id,
                        account: account.id,
                        date: date,
                        category: billCategories.find(function (c) { return c.name === 'Water'; }).id,
                    });
                }
                date = monthUtils.addDays(month, 2);
                if (monthUtils.isBefore(date, currentDay)) {
                    transactions.push({
                        amount: -120000,
                        payee: billPayees.find(function (p) { return p.name.toLowerCase().includes('housy'); }).id,
                        account: account.id,
                        date: date,
                        category: billCategories.find(function (c) { return c.name === 'Mortgage'; }).id,
                    });
                }
                date = monthUtils.addDays(month, 20);
                if (monthUtils.isBefore(date, currentDay)) {
                    transactions.push({
                        amount: -6000,
                        payee: billPayees.find(function (p) { return p.name.toLowerCase().includes('internet'); })
                            .id,
                        account: account.id,
                        date: date,
                        category: billCategories.find(function (c) { return c.name === 'Internet'; }).id,
                    });
                }
                date = monthUtils.addDays(month, 23);
                if (monthUtils.isBefore(date, currentDay)) {
                    transactions.push({
                        amount: -7500,
                        payee: billPayees.find(function (p) { return p.name.toLowerCase().includes('t-mobile'); })
                            .id,
                        account: account.id,
                        date: date,
                        category: billCategories.find(function (c) { return c.name === 'Cell'; }).id,
                    });
                }
            }
            earliestDate = null;
            transactions.forEach(function (t) {
                if (earliestDate == null || t.date < earliestDate) {
                    earliestDate = t.date;
                }
            });
            transactions.unshift({
                amount: 100000,
                payee: payees.find(function (p) { return p.name === 'Starting Balance'; }).id,
                account: account.id,
                date: earliestDate,
                category: getStartingBalanceCat(incomeGroup.categories),
                starting_balance_flag: true,
            });
            return [2 /*return*/, (0, sync_1.addTransactions)(account.id, transactions)];
        });
    });
}
function fillChecking(handlers, account, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, incomePayee, expensePayees, incomeGroup, expenseCategories, numTransactions, transactions, i, payee, category, amount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = extractCommonThings(payees, groups), incomePayee = _a.incomePayee, expensePayees = _a.expensePayees, incomeGroup = _a.incomeGroup, expenseCategories = _a.expenseCategories;
                    numTransactions = integer(20, 40);
                    transactions = [];
                    for (i = 0; i < numTransactions; i++) {
                        payee = void 0;
                        if ((0, random_1.random)() < 0.04) {
                            payee = incomePayee;
                        }
                        else {
                            payee = pickRandom(expensePayees);
                        }
                        category = void 0;
                        if (payee.name === 'Deposit') {
                            category = incomeGroup.categories.find(function (c) { return c.name === 'Income'; });
                        }
                        else {
                            category = pickRandom(expenseCategories);
                        }
                        amount = payee.name === 'Deposit' ? integer(50000, 70000) : integer(0, -10000);
                        transactions.push({
                            amount: amount,
                            payee: payee.id,
                            account: account.id,
                            date: monthUtils.subDays(monthUtils.currentDay(), i * 2),
                            category: category.id,
                        });
                    }
                    transactions.unshift({
                        amount: integer(90000, 120000),
                        payee: payees.find(function (p) { return p.name === 'Starting Balance'; }).id,
                        account: account.id,
                        date: transactions[transactions.length - 1].date,
                        category: getStartingBalanceCat(incomeGroup.categories),
                        starting_balance_flag: true,
                    });
                    return [4 /*yield*/, handlers['transactions-batch-update']({
                            added: transactions,
                            fastMode: true,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fillInvestment(handlers, account, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, incomePayee, incomeGroup, numTransactions, transactions, i, payee, category, amount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = extractCommonThings(payees, groups), incomePayee = _a.incomePayee, incomeGroup = _a.incomeGroup;
                    numTransactions = integer(10, 30);
                    transactions = [];
                    for (i = 0; i < numTransactions; i++) {
                        payee = incomePayee;
                        category = incomeGroup.categories.find(function (c) { return c.name === 'Income'; });
                        amount = integer(10000, 20000);
                        transactions.push({
                            amount: amount,
                            payee: payee.id,
                            account: account.id,
                            date: monthUtils.subDays(monthUtils.currentDay(), integer(10, 360)),
                            category: category.id,
                        });
                    }
                    transactions.unshift({
                        amount: integer(10000, 20000),
                        payee: payees.find(function (p) { return p.name === 'Starting Balance'; }).id,
                        account: account.id,
                        date: findMin(transactions, 'date').date,
                        category: getStartingBalanceCat(incomeGroup.categories),
                        starting_balance_flag: true,
                    });
                    return [4 /*yield*/, handlers['transactions-batch-update']({
                            added: transactions,
                            fastMode: true,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fillSavings(handlers, account, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, incomePayee, expensePayees, incomeGroup, expenseCategories, numTransactions, transactions, i, payee, category, amount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = extractCommonThings(payees, groups), incomePayee = _a.incomePayee, expensePayees = _a.expensePayees, incomeGroup = _a.incomeGroup, expenseCategories = _a.expenseCategories;
                    numTransactions = integer(15, 40);
                    transactions = [];
                    for (i = 0; i < numTransactions; i++) {
                        payee = void 0;
                        if ((0, random_1.random)() < 0.3) {
                            payee = incomePayee;
                        }
                        else {
                            payee = pickRandom(expensePayees);
                        }
                        category = payee === incomePayee
                            ? incomeGroup.categories.find(function (c) { return c.name === 'Income'; })
                            : pickRandom(expenseCategories);
                        amount = payee === incomePayee ? integer(10000, 80000) : integer(-10000, -2000);
                        transactions.push({
                            amount: amount,
                            payee: payee.id,
                            account: account.id,
                            date: monthUtils.subDays(monthUtils.currentDay(), i * 5),
                            category: category.id,
                        });
                    }
                    transactions.unshift({
                        amount: 30000,
                        payee: payees.find(function (p) { return p.name === 'Starting Balance'; }).id,
                        account: account.id,
                        date: transactions[transactions.length - 1].date,
                        category: getStartingBalanceCat(incomeGroup.categories),
                        starting_balance_flag: true,
                    });
                    return [4 /*yield*/, handlers['transactions-batch-update']({
                            added: transactions,
                            fastMode: true,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fillMortgage(handlers, account, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, incomePayee, incomeGroup, numTransactions, amount, category, transactions, i, payee;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = extractCommonThings(payees, groups), incomePayee = _a.incomePayee, incomeGroup = _a.incomeGroup;
                    numTransactions = integer(7, 10);
                    amount = integer(100000, 200000);
                    category = incomeGroup.categories.find(function (c) { return c.name === 'Income'; });
                    transactions = [
                        {
                            amount: integer(-3000, -3500) * 100 * 100,
                            payee: payees.find(function (p) { return p.name === 'Starting Balance'; }).id,
                            account: account.id,
                            date: monthUtils.subMonths(monthUtils.currentDay(), numTransactions) + '-02',
                            category: getStartingBalanceCat(incomeGroup.categories),
                            starting_balance_flag: true,
                        },
                    ];
                    for (i = 0; i < numTransactions; i++) {
                        payee = incomePayee;
                        transactions.push({
                            amount: amount,
                            payee: payee.id,
                            account: account.id,
                            date: monthUtils.subMonths(monthUtils.currentDay(), i) + '-02',
                            category: category.id,
                            starting_balance_flag: true,
                        });
                    }
                    return [4 /*yield*/, handlers['transactions-batch-update']({
                            added: transactions,
                            fastMode: true,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function fillOther(handlers, account, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, incomePayee, incomeGroup, numTransactions, category, transactions, i, payee, amount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = extractCommonThings(payees, groups), incomePayee = _a.incomePayee, incomeGroup = _a.incomeGroup;
                    numTransactions = integer(3, 6);
                    category = incomeGroup.categories.find(function (c) { return c.name === 'Income'; });
                    transactions = [
                        {
                            id: (0, uuid_1.v4)(),
                            amount: integer(3250, 3700) * 100 * 100,
                            payee: payees.find(function (p) { return p.name === 'Starting Balance'; }).id,
                            account: account.id,
                            date: monthUtils.subMonths(monthUtils.currentDay(), numTransactions) + '-02',
                            category: getStartingBalanceCat(incomeGroup.categories),
                            starting_balance_flag: true,
                        },
                    ];
                    for (i = 0; i < numTransactions; i++) {
                        payee = incomePayee;
                        amount = integer(4, 9) * 100 * 100;
                        transactions.push({
                            id: (0, uuid_1.v4)(),
                            amount: amount,
                            payee: payee.id,
                            account: account.id,
                            date: monthUtils.subMonths(monthUtils.currentDay(), i) + '-02',
                            category: category.id,
                        });
                    }
                    return [4 /*yield*/, handlers['transactions-batch-update']({
                            added: transactions,
                            fastMode: true,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createBudget(accounts, payees, groups) {
    return __awaiter(this, void 0, void 0, function () {
        function category(name) {
            for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                var group = groups_1[_i];
                var cat = group.categories.find(function (c) { return c.name === name; });
                if (cat) {
                    return cat;
                }
            }
        }
        function setBudget(month, category, amount) {
            return budgetActions.setBudget({ month: month, category: category.id, amount: amount });
        }
        function setBudgetIfSpent(month, cat) {
            var spent = sheet.getCellValue(monthUtils.sheetForMonth(month), "sum-amount-".concat(cat.id));
            if (spent < 0) {
                setBudget(month, cat, -spent);
            }
        }
        var primaryAccount, earliestDate, earliestPrimaryDate, start, end, months, sheetName, toBudget;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    primaryAccount = accounts.find(function (a) { return (a.name = 'Bank of America'); });
                    return [4 /*yield*/, db.first("SELECT t.date FROM v_transactions t LEFT JOIN accounts a ON t.account = a.id\n       WHERE a.offbudget = 0 AND t.is_child = 0 ORDER BY date ASC LIMIT 1")];
                case 1:
                    earliestDate = (_a.sent()).date;
                    return [4 /*yield*/, db.first("SELECT t.date FROM v_transactions t LEFT JOIN accounts a ON t.account = a.id\n       WHERE a.id = ? AND a.offbudget = 0 AND t.is_child = 0 ORDER BY date ASC LIMIT 1", [primaryAccount.id])];
                case 2:
                    earliestPrimaryDate = (_a.sent()).date;
                    start = monthUtils.monthFromDate(db.fromDateRepr(earliestDate));
                    end = monthUtils.currentMonth();
                    months = monthUtils.rangeInclusive(start, end);
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () {
                            return (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _i, months_2, month;
                                return __generator(this, function (_a) {
                                    for (_i = 0, months_2 = months; _i < months_2.length; _i++) {
                                        month = months_2[_i];
                                        if (month >=
                                            monthUtils.monthFromDate(db.fromDateRepr(earliestPrimaryDate))) {
                                            setBudget(month, category('Food'), 40000);
                                            setBudget(month, category('Restaurants'), 30000);
                                            setBudget(month, category('Entertainment'), 10000);
                                            setBudget(month, category('Clothing'), 3000);
                                            setBudget(month, category('General'), 50000);
                                            setBudget(month, category('Gift'), 7500);
                                            setBudget(month, category('Medical'), 10000);
                                            setBudget(month, category('Cell'), 7500);
                                            setBudget(month, category('Internet'), 6000);
                                            setBudget(month, category('Mortgage'), 120000);
                                            setBudget(month, category('Water'), 9000);
                                            setBudget(month, category('Power'), 10000);
                                        }
                                        else {
                                            setBudgetIfSpent(month, category('Food'));
                                            setBudgetIfSpent(month, category('Restaurants'));
                                            setBudgetIfSpent(month, category('Entertainment'));
                                            setBudgetIfSpent(month, category('Clothing'));
                                            setBudgetIfSpent(month, category('General'));
                                            setBudgetIfSpent(month, category('Gift'));
                                            setBudgetIfSpent(month, category('Medical'));
                                            setBudgetIfSpent(month, category('Cell'));
                                            setBudgetIfSpent(month, category('Internet'));
                                            setBudgetIfSpent(month, category('Mortgage'));
                                            setBudgetIfSpent(month, category('Water'));
                                            setBudgetIfSpent(month, category('Power'));
                                        }
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () {
                            return (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var prevSaved, _i, months_3, month, sheetName_1, toBudget_1, available;
                                return __generator(this, function (_a) {
                                    prevSaved = 0;
                                    for (_i = 0, months_3 = months; _i < months_3.length; _i++) {
                                        month = months_3[_i];
                                        if (month >=
                                            monthUtils.monthFromDate(db.fromDateRepr(earliestPrimaryDate)) &&
                                            month <= monthUtils.currentMonth()) {
                                            sheetName_1 = monthUtils.sheetForMonth(month);
                                            toBudget_1 = sheet.getCellValue(sheetName_1, 'to-budget');
                                            available = toBudget_1 - prevSaved;
                                            if (available - 403000 > 0) {
                                                setBudget(month, category('Savings'), available - 403000);
                                                budgetActions.setBuffer(month, 403000);
                                                prevSaved += available - 403000;
                                            }
                                            else if (available > 0) {
                                                budgetActions.setBuffer(month, available);
                                            }
                                        }
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 6:
                    _a.sent();
                    sheetName = monthUtils.sheetForMonth(monthUtils.currentMonth());
                    toBudget = sheet.getCellValue(sheetName, 'to-budget');
                    if (!(toBudget < 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, sync_1.addTransactions)(primaryAccount.id, [
                            {
                                amount: -toBudget,
                                category: category('Income').id,
                                date: monthUtils.currentMonth() + '-01',
                            },
                        ])];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: 
                // let sheetName = monthUtils.sheetForMonth(monthUtils.currentMonth());
                // let toBudget = sheet.getCellValue(sheetName, 'to-budget');
                // setBudget(monthUtils.currentMonth(), category('Savings'), toBudget);
                return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 9:
                    // let sheetName = monthUtils.sheetForMonth(monthUtils.currentMonth());
                    // let toBudget = sheet.getCellValue(sheetName, 'to-budget');
                    // setBudget(monthUtils.currentMonth(), category('Savings'), toBudget);
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createTestBudget(handlers) {
    return __awaiter(this, void 0, void 0, function () {
        var accounts, newPayees, payees, newCategoryGroups, categoryGroups, allGroups, primaryAccount, primaryBalance, results, lastDeposit;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, sync_2.setSyncingMode)('import');
                    return [4 /*yield*/, db.execQuery('PRAGMA journal_mode = OFF')];
                case 1:
                    _a.sent();
                    // Clear out the default categories. This is fine to do without
                    // going through the sync system because we are in import mode and
                    // these aren't tracked through messages anyway.
                    return [4 /*yield*/, db.runQuery('DELETE FROM categories;')];
                case 2:
                    // Clear out the default categories. This is fine to do without
                    // going through the sync system because we are in import mode and
                    // these aren't tracked through messages anyway.
                    _a.sent();
                    return [4 /*yield*/, db.runQuery('DELETE FROM category_groups')];
                case 3:
                    _a.sent();
                    accounts = [
                        { name: 'Bank of America' },
                        { name: 'Ally Savings' },
                        { name: 'Capital One Checking' },
                        { name: 'HSBC' },
                        { name: 'Vanguard 401k', offBudget: true },
                        { name: 'Mortgage', offBudget: true },
                        { name: 'House Asset', offBudget: true },
                        { name: 'Roth IRA', offBudget: true },
                    ];
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, accounts_1, account, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _i = 0, accounts_1 = accounts;
                                        _b.label = 1;
                                    case 1:
                                        if (!(_i < accounts_1.length)) return [3 /*break*/, 4];
                                        account = accounts_1[_i];
                                        _a = account;
                                        return [4 /*yield*/, handlers['account-create'](account)];
                                    case 2:
                                        _a.id = _b.sent();
                                        _b.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _a.sent();
                    newPayees = [
                        { name: 'Starting Balance' },
                        { name: 'Kroger' },
                        { name: 'Publix' },
                        { name: 'Home Depot' },
                        { name: 'Movies' },
                        { name: 'Online store' },
                        { name: 'Deposit' },
                        { name: 'Dominion Power', bill: true },
                        { name: 'Extra Watery', bill: true },
                        { name: 'Housy House', bill: true },
                        { name: 'Fast Internet', bill: true },
                        { name: 'T-mobile', bill: true },
                    ];
                    payees = [];
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () {
                            return (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _i, newPayees_1, newPayee, id;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _i = 0, newPayees_1 = newPayees;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < newPayees_1.length)) return [3 /*break*/, 4];
                                            newPayee = newPayees_1[_i];
                                            return [4 /*yield*/, handlers['payee-create']({ name: newPayee.name })];
                                        case 2:
                                            id = _a.sent();
                                            payees.push(__assign({ id: id, name: newPayee.name }, newPayee));
                                            _a.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 5:
                    _a.sent();
                    newCategoryGroups = [
                        {
                            name: 'Usual Expenses',
                            categories: [
                                { name: 'Savings' },
                                { name: 'Medical' },
                                { name: 'Gift' },
                                { name: 'General' },
                                { name: 'Clothing' },
                                { name: 'Entertainment' },
                                { name: 'Restaurants' },
                                { name: 'Food' },
                            ],
                        },
                        {
                            name: 'Bills',
                            categories: [
                                { name: 'Power' },
                                { name: 'Water' },
                                { name: 'Mortgage' },
                                { name: 'Internet' },
                                { name: 'Cell' },
                            ],
                        },
                        {
                            name: 'Income',
                            is_income: true,
                            categories: [
                                { name: 'Income', is_income: true },
                                { name: 'Misc', is_income: true },
                                { name: 'Starting Balances', is_income: true },
                            ],
                        },
                    ];
                    categoryGroups = [];
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, newCategoryGroups_1, group, groupId, _a, _b, category, categoryId;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _i = 0, newCategoryGroups_1 = newCategoryGroups;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < newCategoryGroups_1.length)) return [3 /*break*/, 7];
                                        group = newCategoryGroups_1[_i];
                                        return [4 /*yield*/, handlers['category-group-create']({
                                                name: group.name,
                                                isIncome: group.is_income,
                                            })];
                                    case 2:
                                        groupId = _c.sent();
                                        categoryGroups.push(__assign(__assign({}, group), { id: groupId, categories: [] }));
                                        _a = 0, _b = group.categories;
                                        _c.label = 3;
                                    case 3:
                                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                                        category = _b[_a];
                                        return [4 /*yield*/, handlers['category-create'](__assign(__assign({}, category), { isIncome: category.is_income, groupId: groupId }))];
                                    case 4:
                                        categoryId = _c.sent();
                                        categoryGroups[categoryGroups.length - 1].categories.push(__assign(__assign({}, category), { id: categoryId, group: groupId }));
                                        _c.label = 5;
                                    case 5:
                                        _a++;
                                        return [3 /*break*/, 3];
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, mutators_1.runHandler)(handlers['get-categories'])];
                case 7:
                    allGroups = (_a.sent()).grouped;
                    (0, sync_2.setSyncingMode)('import');
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () {
                            return (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var _i, accounts_2, account;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _i = 0, accounts_2 = accounts;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < accounts_2.length)) return [3 /*break*/, 16];
                                            account = accounts_2[_i];
                                            if (!(account.name === 'Bank of America')) return [3 /*break*/, 3];
                                            return [4 /*yield*/, fillPrimaryChecking(handlers, account, payees, allGroups)];
                                        case 2:
                                            _a.sent();
                                            return [3 /*break*/, 15];
                                        case 3:
                                            if (!(account.name === 'Capital One Checking' ||
                                                account.name === 'HSBC')) return [3 /*break*/, 5];
                                            return [4 /*yield*/, fillChecking(handlers, account, payees, allGroups)];
                                        case 4:
                                            _a.sent();
                                            return [3 /*break*/, 15];
                                        case 5:
                                            if (!(account.name === 'Ally Savings')) return [3 /*break*/, 7];
                                            return [4 /*yield*/, fillSavings(handlers, account, payees, allGroups)];
                                        case 6:
                                            _a.sent();
                                            return [3 /*break*/, 15];
                                        case 7:
                                            if (!(account.name === 'Vanguard 401k' ||
                                                account.name === 'Roth IRA')) return [3 /*break*/, 9];
                                            return [4 /*yield*/, fillInvestment(handlers, account, payees, allGroups)];
                                        case 8:
                                            _a.sent();
                                            return [3 /*break*/, 15];
                                        case 9:
                                            if (!(account.name === 'Mortgage')) return [3 /*break*/, 11];
                                            return [4 /*yield*/, fillMortgage(handlers, account, payees, allGroups)];
                                        case 10:
                                            _a.sent();
                                            return [3 /*break*/, 15];
                                        case 11:
                                            if (!(account.name === 'House Asset')) return [3 /*break*/, 13];
                                            return [4 /*yield*/, fillOther(handlers, account, payees, allGroups)];
                                        case 12:
                                            _a.sent();
                                            return [3 /*break*/, 15];
                                        case 13:
                                            console.error('Unknown account name for test budget: ', account.name);
                                            return [4 /*yield*/, fillChecking(handlers, account, payees, allGroups)];
                                        case 14:
                                            _a.sent();
                                            _a.label = 15;
                                        case 15:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 16: return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 8:
                    _a.sent();
                    (0, sync_2.setSyncingMode)('import');
                    primaryAccount = accounts.find(function (a) { return (a.name = 'Bank of America'); });
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                            .filter({ account: primaryAccount.id })
                            .calculate({ $sum: '$amount' })
                            .serialize())];
                case 9:
                    primaryBalance = (_a.sent()).data;
                    if (!(primaryBalance < 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('transactions')
                            .filter({ account: primaryAccount.id, amount: { $gt: 0 } })
                            .limit(1)
                            .select(['id', 'amount'])
                            .serialize())];
                case 10:
                    results = (_a.sent()).data;
                    lastDeposit = results[0];
                    return [4 /*yield*/, (0, mutators_1.runHandler)(handlers['transaction-update'], __assign(__assign({}, lastDeposit), { amount: lastDeposit.amount + -primaryBalance + integer(10000, 20000) }))];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    // Bust the cache and reload the spreadsheet
                    (0, sync_2.setSyncingMode)('disabled');
                    return [4 /*yield*/, sheet.reloadSpreadsheet(db)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, budget.createAllBudgets()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 15:
                    _a.sent();
                    // Create some schedules
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () {
                            return (0, sync_2.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                                var account;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            account = accounts.find(function (acc) { return acc.name === 'Bank of America'; });
                                            return [4 /*yield*/, (0, mutators_1.runHandler)(handlers['schedule/create'], {
                                                    schedule: {
                                                        name: 'Phone bills',
                                                        posts_transaction: false,
                                                    },
                                                    conditions: [
                                                        {
                                                            op: 'is',
                                                            field: 'payee',
                                                            value: payees.find(function (item) { return item.name === 'Dominion Power'; }).id,
                                                        },
                                                        {
                                                            op: 'is',
                                                            field: 'account',
                                                            value: account.id,
                                                        },
                                                        {
                                                            op: 'is',
                                                            field: 'date',
                                                            value: {
                                                                start: monthUtils.currentDay(),
                                                                frequency: 'monthly',
                                                                patterns: [],
                                                                skipWeekend: false,
                                                                weekendSolveMode: 'after',
                                                            },
                                                        },
                                                        { op: 'isapprox', field: 'amount', value: -12000 },
                                                    ],
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, (0, mutators_1.runHandler)(handlers['schedule/create'], {
                                                    schedule: {
                                                        name: 'Internet bill',
                                                        posts_transaction: false,
                                                    },
                                                    conditions: [
                                                        {
                                                            op: 'is',
                                                            field: 'payee',
                                                            value: payees.find(function (item) { return item.name === 'Fast Internet'; }).id,
                                                        },
                                                        {
                                                            op: 'is',
                                                            field: 'account',
                                                            value: account.id,
                                                        },
                                                        {
                                                            op: 'is',
                                                            field: 'date',
                                                            value: monthUtils.subDays(monthUtils.currentDay(), 1),
                                                        },
                                                        { op: 'isapprox', field: 'amount', value: -14000 },
                                                    ],
                                                })];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, (0, mutators_1.runHandler)(handlers['schedule/create'], {
                                                    schedule: {
                                                        name: 'Wedding',
                                                        posts_transaction: false,
                                                    },
                                                    conditions: [
                                                        {
                                                            op: 'is',
                                                            field: 'date',
                                                            value: {
                                                                start: monthUtils.subDays(monthUtils.currentDay(), 3),
                                                                frequency: 'monthly',
                                                                patterns: [],
                                                                skipWeekend: false,
                                                                weekendSolveMode: 'after',
                                                            },
                                                        },
                                                        { op: 'is', field: 'amount', value: -2700000 },
                                                    ],
                                                })];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, (0, mutators_1.runHandler)(handlers['schedule/create'], {
                                                    schedule: {
                                                        name: 'Utilities',
                                                        posts_transaction: false,
                                                    },
                                                    conditions: [
                                                        {
                                                            op: 'is',
                                                            field: 'account',
                                                            value: account.id,
                                                        },
                                                        {
                                                            op: 'is',
                                                            field: 'date',
                                                            value: {
                                                                start: monthUtils.addDays(monthUtils.currentDay(), 1),
                                                                frequency: 'monthly',
                                                                patterns: [],
                                                                skipWeekend: false,
                                                                weekendSolveMode: 'after',
                                                            },
                                                        },
                                                        { op: 'is', field: 'amount', value: -190000 },
                                                    ],
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 16:
                    // Create some schedules
                    _a.sent();
                    // Create a budget
                    return [4 /*yield*/, createBudget(accounts, payees, allGroups)];
                case 17:
                    // Create a budget
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
