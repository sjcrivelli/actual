"use strict";
// @ts-strict-ignore
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
exports.getSheetValue = getSheetValue;
exports.getSheetBoolean = getSheetBoolean;
exports.isReflectBudget = isReflectBudget;
exports.getBudget = getBudget;
exports.setBudget = setBudget;
exports.setGoal = setGoal;
exports.setBuffer = setBuffer;
exports.copyPreviousMonth = copyPreviousMonth;
exports.copySinglePreviousMonth = copySinglePreviousMonth;
exports.setZero = setZero;
exports.set3MonthAvg = set3MonthAvg;
exports.set12MonthAvg = set12MonthAvg;
exports.set6MonthAvg = set6MonthAvg;
exports.setNMonthAvg = setNMonthAvg;
exports.holdForNextMonth = holdForNextMonth;
exports.resetHold = resetHold;
exports.coverOverspending = coverOverspending;
exports.transferAvailable = transferAvailable;
exports.coverOverbudgeted = coverOverbudgeted;
exports.transferCategory = transferCategory;
exports.setCategoryCarryover = setCategoryCarryover;
exports.resetIncomeCarryover = resetIncomeCarryover;
var asyncStorage = require("../../platform/server/asyncStorage");
var locale_1 = require("../../shared/locale");
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
var db = require("../db");
var sheet = require("../sheet");
var sync_1 = require("../sync");
function getSheetValue(sheetName, cell) {
    return __awaiter(this, void 0, void 0, function () {
        var node;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.getCell(sheetName, cell)];
                case 1:
                    node = _a.sent();
                    return [2 /*return*/, (0, util_1.safeNumber)(typeof node.value === 'number' ? node.value : 0)];
            }
        });
    });
}
function getSheetBoolean(sheetName, cell) {
    return __awaiter(this, void 0, void 0, function () {
        var node;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.getCell(sheetName, cell)];
                case 1:
                    node = _a.sent();
                    return [2 /*return*/, typeof node.value === 'boolean' ? node.value : false];
            }
        });
    });
}
// We want to only allow the positive movement of money back and
// forth. buffered should never be allowed to go into the negative,
// and you shouldn't be allowed to pull non-existent money from
// leftover.
function calcBufferedAmount(toBudget, buffered, amount) {
    amount = Math.min(Math.max(amount, -buffered), Math.max(toBudget, 0));
    return buffered + amount;
}
function getBudgetTable() {
    return isReflectBudget() ? 'reflect_budgets' : 'zero_budgets';
}
function isReflectBudget() {
    var budgetType = db.firstSync("SELECT value FROM preferences WHERE id = ?", ['budgetType']);
    var val = budgetType ? budgetType.value : 'envelope';
    return val === 'tracking';
}
function dbMonth(month) {
    return parseInt(month.replace('-', ''));
}
function getBudgetData(table, month) {
    return db.all("\n    SELECT b.*, c.is_income, c.hidden, g.hidden AS group_hidden\n    FROM ".concat(table, " b\n    LEFT JOIN categories c ON b.category = c.id\n    LEFT JOIN category_groups g ON c.cat_group = g.id\n    WHERE c.tombstone = 0 AND b.month = ?\n  "), [month]);
}
function getAllMonths(startMonth) {
    var createdMonths = sheet.get().meta().createdMonths;
    var latest = null;
    for (var _i = 0, createdMonths_1 = createdMonths; _i < createdMonths_1.length; _i++) {
        var month = createdMonths_1[_i];
        if (latest == null || month > latest) {
            latest = month;
        }
    }
    return monthUtils.rangeInclusive(startMonth, latest);
}
// TODO: Valid month format in all the functions below
function getBudget(_a) {
    var category = _a.category, month = _a.month;
    var table = getBudgetTable();
    var existing = db.firstSync("SELECT * FROM ".concat(table, " WHERE month = ? AND category = ?"), [dbMonth(month), category]);
    return existing ? existing.amount || 0 : 0;
}
function setBudget(_a) {
    var category = _a.category, month = _a.month, amount = _a.amount;
    amount = (0, util_1.safeNumber)(typeof amount === 'number' ? amount : 0);
    var table = getBudgetTable();
    var existing = db.firstSync("SELECT id FROM ".concat(table, " WHERE month = ? AND category = ?"), [
        dbMonth(month),
        category,
    ]);
    if (existing) {
        return db.update(table, { id: existing.id, amount: amount });
    }
    return db.insert(table, {
        id: "".concat(dbMonth(month), "-").concat(category),
        month: dbMonth(month),
        category: category,
        amount: amount,
    });
}
function setGoal(_a) {
    var month = _a.month, category = _a.category, goal = _a.goal, long_goal = _a.long_goal;
    var table = getBudgetTable();
    var existing = db.firstSync("SELECT id FROM ".concat(table, " WHERE month = ? AND category = ?"), [
        dbMonth(month),
        category,
    ]);
    if (existing) {
        return db.update(table, {
            id: existing.id,
            goal: goal,
            long_goal: long_goal,
        });
    }
    return db.insert(table, {
        id: "".concat(dbMonth(month), "-").concat(category),
        month: dbMonth(month),
        category: category,
        goal: goal,
        long_goal: long_goal,
    });
}
function setBuffer(month, amount) {
    var existing = db.firstSync("SELECT id FROM zero_budget_months WHERE id = ?", [month]);
    if (existing) {
        return db.update('zero_budget_months', {
            id: existing.id,
            buffered: amount,
        });
    }
    return db.insert('zero_budget_months', { id: month, buffered: amount });
}
function setCarryover(table, category, month, flag) {
    var existing = db.firstSync("SELECT id FROM ".concat(table, " WHERE month = ? AND category = ?"), [
        month,
        category,
    ]);
    if (existing) {
        return db.update(table, { id: existing.id, carryover: flag ? 1 : 0 });
    }
    return db.insert(table, {
        id: "".concat(month, "-").concat(category),
        month: month,
        category: category,
        carryover: flag ? 1 : 0,
    });
}
// Actions
function copyPreviousMonth(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var prevMonth, table, budgetData;
        var _this = this;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    prevMonth = dbMonth(monthUtils.prevMonth(month));
                    table = getBudgetTable();
                    return [4 /*yield*/, getBudgetData(table, prevMonth.toString())];
                case 1:
                    budgetData = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                budgetData.forEach(function (prevBudget) {
                                    if (prevBudget.is_income === 1 && !isReflectBudget()) {
                                        return;
                                    }
                                    if (prevBudget.hidden === 1 || prevBudget.group_hidden === 1) {
                                        return;
                                    }
                                    setBudget({
                                        category: prevBudget.category,
                                        month: month,
                                        amount: prevBudget.amount,
                                    });
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function copySinglePreviousMonth(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var prevMonth, newAmount;
        var _this = this;
        var month = _b.month, category = _b.category;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    prevMonth = monthUtils.prevMonth(month);
                    return [4 /*yield*/, getSheetValue(monthUtils.sheetForMonth(prevMonth), 'budget-' + category)];
                case 1:
                    newAmount = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setBudget({ category: category, month: month, amount: newAmount });
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setZero(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categories;
        var _this = this;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.all('SELECT * FROM v_categories WHERE tombstone = 0')];
                case 1:
                    categories = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                categories.forEach(function (cat) {
                                    if (cat.is_income === 1 && !isReflectBudget()) {
                                        return;
                                    }
                                    setBudget({ category: cat.id, month: month, amount: 0 });
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function set3MonthAvg(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categories, prevMonth1, prevMonth2, prevMonth3;
        var _this = this;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.all("\n  SELECT c.*\n  FROM categories c\n  LEFT JOIN category_groups g ON c.cat_group = g.id\n  WHERE c.tombstone = 0 AND c.hidden = 0 AND g.hidden = 0\n  ")];
                case 1:
                    categories = _c.sent();
                    prevMonth1 = monthUtils.prevMonth(month);
                    prevMonth2 = monthUtils.prevMonth(prevMonth1);
                    prevMonth3 = monthUtils.prevMonth(prevMonth2);
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, categories_1, cat, spent1, spent2, spent3, avg;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, categories_1 = categories;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < categories_1.length)) return [3 /*break*/, 6];
                                        cat = categories_1[_i];
                                        if (cat.is_income === 1 && !isReflectBudget()) {
                                            return [3 /*break*/, 5];
                                        }
                                        return [4 /*yield*/, getSheetValue(monthUtils.sheetForMonth(prevMonth1), 'sum-amount-' + cat.id)];
                                    case 2:
                                        spent1 = _a.sent();
                                        return [4 /*yield*/, getSheetValue(monthUtils.sheetForMonth(prevMonth2), 'sum-amount-' + cat.id)];
                                    case 3:
                                        spent2 = _a.sent();
                                        return [4 /*yield*/, getSheetValue(monthUtils.sheetForMonth(prevMonth3), 'sum-amount-' + cat.id)];
                                    case 4:
                                        spent3 = _a.sent();
                                        avg = Math.round((spent1 + spent2 + spent3) / 3);
                                        if (cat.is_income === 0) {
                                            avg *= -1;
                                        }
                                        setBudget({ category: cat.id, month: month, amount: avg });
                                        _a.label = 5;
                                    case 5:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function set12MonthAvg(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categories;
        var _this = this;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.all("\n  SELECT c.*\n  FROM categories c\n  LEFT JOIN category_groups g ON c.cat_group = g.id\n  WHERE c.tombstone = 0 AND c.hidden = 0 AND g.hidden = 0\n  ")];
                case 1:
                    categories = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, categories_2, cat;
                            return __generator(this, function (_a) {
                                for (_i = 0, categories_2 = categories; _i < categories_2.length; _i++) {
                                    cat = categories_2[_i];
                                    if (cat.is_income === 1 && !isReflectBudget()) {
                                        continue;
                                    }
                                    setNMonthAvg({ month: month, N: 12, category: cat.id });
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function set6MonthAvg(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categories;
        var _this = this;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.all("\n  SELECT c.*\n  FROM categories c\n  LEFT JOIN category_groups g ON c.cat_group = g.id\n  WHERE c.tombstone = 0 AND c.hidden = 0 AND g.hidden = 0\n  ")];
                case 1:
                    categories = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, categories_3, cat;
                            return __generator(this, function (_a) {
                                for (_i = 0, categories_3 = categories; _i < categories_3.length; _i++) {
                                    cat = categories_3[_i];
                                    if (cat.is_income === 1 && !isReflectBudget()) {
                                        continue;
                                    }
                                    setNMonthAvg({ month: month, N: 6, category: cat.id });
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setNMonthAvg(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categoryFromDb, prevMonth, sumAmount, l, _c;
        var _this = this;
        var month = _b.month, N = _b.N, category = _b.category;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, db.first('SELECT is_income FROM v_categories WHERE id = ?', [category])];
                case 1:
                    categoryFromDb = _d.sent();
                    prevMonth = monthUtils.prevMonth(month);
                    sumAmount = 0;
                    l = 0;
                    _d.label = 2;
                case 2:
                    if (!(l < N)) return [3 /*break*/, 5];
                    _c = sumAmount;
                    return [4 /*yield*/, getSheetValue(monthUtils.sheetForMonth(prevMonth), 'sum-amount-' + category)];
                case 3:
                    sumAmount = _c + _d.sent();
                    prevMonth = monthUtils.prevMonth(prevMonth);
                    _d.label = 4;
                case 4:
                    l++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var avg;
                        return __generator(this, function (_a) {
                            avg = Math.round(sumAmount / N);
                            if (categoryFromDb.is_income === 0) {
                                avg *= -1;
                            }
                            setBudget({ category: category, month: month, amount: avg });
                            return [2 /*return*/];
                        });
                    }); })];
                case 6:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function holdForNextMonth(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var row, sheetName, toBudget, bufferedAmount;
        var month = _b.month, amount = _b.amount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.first('SELECT buffered FROM zero_budget_months WHERE id = ?', [month])];
                case 1:
                    row = _c.sent();
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, getSheetValue(sheetName, 'to-budget')];
                case 2:
                    toBudget = _c.sent();
                    if (!(toBudget > 0)) return [3 /*break*/, 4];
                    bufferedAmount = calcBufferedAmount(toBudget, (row && row.buffered) || 0, amount);
                    return [4 /*yield*/, setBuffer(month, bufferedAmount)];
                case 3:
                    _c.sent();
                    return [2 /*return*/, true];
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
function resetHold(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, setBuffer(month, 0)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function coverOverspending(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var sheetName, toBudgeted, leftover, leftoverFrom, amountCovered, fromBudgeted;
        var _this = this;
        var month = _b.month, to = _b.to, from = _b.from;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, getSheetValue(sheetName, 'budget-' + to)];
                case 1:
                    toBudgeted = _c.sent();
                    return [4 /*yield*/, getSheetValue(sheetName, 'leftover-' + to)];
                case 2:
                    leftover = _c.sent();
                    return [4 /*yield*/, getSheetValue(sheetName, from === 'to-budget' ? 'to-budget' : 'leftover-' + from)];
                case 3:
                    leftoverFrom = _c.sent();
                    if (leftover >= 0 || leftoverFrom <= 0) {
                        return [2 /*return*/];
                    }
                    amountCovered = Math.min(-leftover, leftoverFrom);
                    if (!(from !== 'to-budget')) return [3 /*break*/, 6];
                    return [4 /*yield*/, getSheetValue(sheetName, 'budget-' + from)];
                case 4:
                    fromBudgeted = _c.sent();
                    return [4 /*yield*/, setBudget({
                            category: from,
                            month: month,
                            amount: fromBudgeted - amountCovered,
                        })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, setBudget({
                                        category: to,
                                        month: month,
                                        amount: toBudgeted + amountCovered,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, addMovementNotes({
                                            month: month,
                                            amount: amountCovered,
                                            to: to,
                                            from: from,
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function transferAvailable(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var sheetName, leftover, budgeted;
        var month = _b.month, amount = _b.amount, category = _b.category;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, getSheetValue(sheetName, 'to-budget')];
                case 1:
                    leftover = _c.sent();
                    amount = Math.max(Math.min(amount, leftover), 0);
                    return [4 /*yield*/, getSheetValue(sheetName, 'budget-' + category)];
                case 2:
                    budgeted = _c.sent();
                    return [4 /*yield*/, setBudget({ category: category, month: month, amount: budgeted + amount })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function coverOverbudgeted(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var sheetName, toBudget, categoryBudget;
        var _this = this;
        var month = _b.month, category = _b.category;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, getSheetValue(sheetName, 'to-budget')];
                case 1:
                    toBudget = _c.sent();
                    return [4 /*yield*/, getSheetValue(sheetName, 'budget-' + category)];
                case 2:
                    categoryBudget = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, setBudget({ category: category, month: month, amount: categoryBudget + toBudget })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, addMovementNotes({
                                                month: month,
                                                amount: -toBudget,
                                                from: category,
                                                to: 'overbudgeted',
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function transferCategory(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var sheetName, fromBudgeted;
        var _this = this;
        var month = _b.month, amount = _b.amount, from = _b.from, to = _b.to;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, getSheetValue(sheetName, 'budget-' + from)];
                case 1:
                    fromBudgeted = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var toBudgeted;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, setBudget({ category: from, month: month, amount: fromBudgeted - amount })];
                                    case 1:
                                        _a.sent();
                                        if (!(to !== 'to-budget')) return [3 /*break*/, 4];
                                        return [4 /*yield*/, getSheetValue(sheetName, 'budget-' + to)];
                                    case 2:
                                        toBudgeted = _a.sent();
                                        return [4 /*yield*/, setBudget({ category: to, month: month, amount: toBudgeted + amount })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [4 /*yield*/, addMovementNotes({
                                            month: month,
                                            amount: amount,
                                            to: to,
                                            from: from,
                                        })];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setCategoryCarryover(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var table, months;
        var _this = this;
        var startMonth = _b.startMonth, category = _b.category, flag = _b.flag;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    table = getBudgetTable();
                    months = getAllMonths(startMonth);
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, months_1, month;
                            return __generator(this, function (_a) {
                                for (_i = 0, months_1 = months; _i < months_1.length; _i++) {
                                    month = months_1[_i];
                                    setCarryover(table, category, dbMonth(month).toString(), flag);
                                }
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addNewLine(notes) {
    return !notes ? '' : "".concat(notes).concat(notes && '\n');
}
function addMovementNotes(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var displayAmount, monthBudgetNotesId, existingMonthBudgetNotes, locale, _c, displayDay, categories, fromCategoryName, toCategoryName, note;
        var _d, _e, _f;
        var month = _b.month, amount = _b.amount, to = _b.to, from = _b.from;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    displayAmount = (0, util_1.integerToCurrency)(amount);
                    monthBudgetNotesId = "budget-".concat(month);
                    existingMonthBudgetNotes = addNewLine((_d = db.firstSync("SELECT n.note FROM notes n WHERE n.id = ?", [monthBudgetNotesId])) === null || _d === void 0 ? void 0 : _d.note);
                    _c = locale_1.getLocale;
                    return [4 /*yield*/, asyncStorage.getItem('language')];
                case 1:
                    locale = _c.apply(void 0, [_g.sent()]);
                    displayDay = monthUtils.format(monthUtils.currentDate(), 'MMMM dd', locale);
                    return [4 /*yield*/, db.getCategories([from, to].filter(function (c) { return c !== 'to-budget' && c !== 'overbudgeted'; }))];
                case 2:
                    categories = _g.sent();
                    fromCategoryName = from === 'to-budget'
                        ? 'To Budget'
                        : (_e = categories.find(function (c) { return c.id === from; })) === null || _e === void 0 ? void 0 : _e.name;
                    toCategoryName = to === 'to-budget'
                        ? 'To Budget'
                        : to === 'overbudgeted'
                            ? 'Overbudgeted'
                            : (_f = categories.find(function (c) { return c.id === to; })) === null || _f === void 0 ? void 0 : _f.name;
                    note = "Reassigned ".concat(displayAmount, " from ").concat(fromCategoryName, " \u2192 ").concat(toCategoryName, " on ").concat(displayDay);
                    return [4 /*yield*/, db.update('notes', {
                            id: monthBudgetNotesId,
                            note: "".concat(existingMonthBudgetNotes, "- ").concat(note),
                        })];
                case 3:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resetIncomeCarryover(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var table, categories;
        var _this = this;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    table = getBudgetTable();
                    return [4 /*yield*/, db.all('SELECT * FROM v_categories WHERE is_income = 1 AND tombstone = 0')];
                case 1:
                    categories = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, categories_4, category;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, categories_4 = categories;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < categories_4.length)) return [3 /*break*/, 4];
                                        category = categories_4[_i];
                                        return [4 /*yield*/, setCarryover(table, category.id, dbMonth(month).toString(), false)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
