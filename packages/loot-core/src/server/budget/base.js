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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetType = getBudgetType;
exports.getBudgetRange = getBudgetRange;
exports.createCategory = createCategory;
exports.triggerBudgetChanges = triggerBudgetChanges;
exports.doTransfer = doTransfer;
exports.createBudget = createBudget;
exports.createAllBudgets = createAllBudgets;
exports.setType = setType;
// @ts-strict-ignore
var monthUtils = require("../../shared/months");
var query_1 = require("../../shared/query");
var util_1 = require("../../shared/util");
var aql_1 = require("../aql");
var db = require("../db");
var sheet = require("../sheet");
var util_2 = require("../spreadsheet/util");
var budgetActions = require("./actions");
var envelopeBudget = require("./envelope");
var report = require("./report");
function getBudgetType() {
    var meta = sheet.get().meta();
    return meta.budgetType || 'envelope';
}
function getBudgetRange(start, end) {
    start = monthUtils.getMonth(start);
    end = monthUtils.getMonth(end);
    // The start date should never be after the end date. If that
    // happened, the month range might be a valid range and weird
    // things happen
    if (start > end) {
        start = end;
    }
    // Budgets should exist 3 months before the earliest needed date
    // (either the oldest transaction or the current month if no
    // transactions yet), and a year from the current date. There's no
    // need to ever have budgets outside that range.
    start = monthUtils.subMonths(start, 3);
    end = monthUtils.addMonths(end, 12);
    return { start: start, end: end, range: monthUtils.rangeInclusive(start, end) };
}
function createCategory(cat, sheetName, prevSheetName, start, end) {
    sheet.get().createDynamic(sheetName, 'sum-amount-' + cat.id, {
        initialValue: 0,
        run: function () {
            // Making this sync is faster!
            var rows = db.runQuery("SELECT SUM(amount) as amount FROM v_transactions_internal_alive t\n           LEFT JOIN accounts a ON a.id = t.account\n         WHERE t.date >= ".concat(start, " AND t.date <= ").concat(end, "\n           AND category = '").concat(cat.id, "' AND a.offbudget = 0"), [], true);
            var row = rows[0];
            var amount = row ? row.amount : 0;
            return amount || 0;
        },
    });
    if (getBudgetType() === 'envelope') {
        envelopeBudget.createCategory(cat, sheetName, prevSheetName);
    }
    else {
        report.createCategory(cat, sheetName, prevSheetName);
    }
}
function handleAccountChange(months, oldValue, newValue) {
    if (!oldValue || oldValue.offbudget !== newValue.offbudget) {
        var rows_1 = db.runQuery("\n        SELECT DISTINCT(category) as category FROM transactions\n        WHERE acct = ?\n      ", [newValue.id], true);
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            rows_1.forEach(function (row) {
                sheet
                    .get()
                    .recompute((0, util_2.resolveName)(sheetName, 'sum-amount-' + row.category));
            });
        });
    }
}
function handleTransactionChange(transaction, changedFields) {
    if ((changedFields.has('date') ||
        changedFields.has('acct') ||
        changedFields.has('amount') ||
        changedFields.has('category') ||
        changedFields.has('tombstone') ||
        changedFields.has('isParent')) &&
        transaction.date &&
        transaction.category) {
        var month = monthUtils.monthFromDate(db.fromDateRepr(transaction.date));
        var sheetName = monthUtils.sheetForMonth(month);
        sheet
            .get()
            .recompute((0, util_2.resolveName)(sheetName, 'sum-amount-' + transaction.category));
    }
}
function handleCategoryMappingChange(months, oldValue, newValue) {
    months.forEach(function (month) {
        var sheetName = monthUtils.sheetForMonth(month);
        if (oldValue) {
            sheet
                .get()
                .recompute((0, util_2.resolveName)(sheetName, 'sum-amount-' + oldValue.transferId));
        }
        sheet
            .get()
            .recompute((0, util_2.resolveName)(sheetName, 'sum-amount-' + newValue.transferId));
    });
}
function handleBudgetMonthChange(budget) {
    var sheetName = monthUtils.sheetForMonth(budget.id);
    sheet.get().set("".concat(sheetName, "!buffered"), budget.buffered);
}
function handleBudgetChange(budget) {
    if (budget.category) {
        var sheetName = monthUtils.sheetForMonth(budget.month.toString());
        sheet
            .get()
            .set("".concat(sheetName, "!budget-").concat(budget.category), budget.amount || 0);
        sheet
            .get()
            .set("".concat(sheetName, "!carryover-").concat(budget.category), budget.carryover === 1 ? true : false);
        sheet.get().set("".concat(sheetName, "!goal-").concat(budget.category), budget.goal);
        sheet
            .get()
            .set("".concat(sheetName, "!long-goal-").concat(budget.category), budget.long_goal);
    }
}
function triggerBudgetChanges(oldValues, newValues) {
    var _a = sheet.get().meta().createdMonths, createdMonths = _a === void 0 ? new Set() : _a;
    var budgetType = getBudgetType();
    sheet.startTransaction();
    try {
        newValues.forEach(function (items, table) {
            var old = oldValues.get(table);
            items.forEach(function (newValue) {
                var oldValue = old && old.get(newValue.id);
                if (table === 'zero_budget_months') {
                    handleBudgetMonthChange(newValue);
                }
                else if (table === 'zero_budgets' || table === 'reflect_budgets') {
                    handleBudgetChange(newValue);
                }
                else if (table === 'transactions') {
                    var changed = new Set(Object.keys((0, util_1.getChangedValues)(oldValue || {}, newValue) || {}));
                    if (oldValue) {
                        handleTransactionChange(oldValue, changed);
                    }
                    handleTransactionChange(newValue, changed);
                }
                else if (table === 'category_mapping') {
                    handleCategoryMappingChange(createdMonths, oldValue, newValue);
                }
                else if (table === 'categories') {
                    if (budgetType === 'envelope') {
                        envelopeBudget.handleCategoryChange(createdMonths, oldValue, newValue);
                    }
                    else {
                        report.handleCategoryChange(createdMonths, oldValue, newValue);
                    }
                }
                else if (table === 'category_groups') {
                    if (budgetType === 'envelope') {
                        envelopeBudget.handleCategoryGroupChange(createdMonths, oldValue, newValue);
                    }
                    else {
                        report.handleCategoryGroupChange(createdMonths, oldValue, newValue);
                    }
                }
                else if (table === 'accounts') {
                    handleAccountChange(createdMonths, oldValue, newValue);
                }
            });
        });
    }
    finally {
        sheet.endTransaction();
    }
}
function doTransfer(categoryIds, transferId) {
    return __awaiter(this, void 0, void 0, function () {
        var months;
        return __generator(this, function (_a) {
            months = sheet.get().meta().createdMonths;
            __spreadArray([], months, true).forEach(function (month) {
                var totalValue = categoryIds
                    .map(function (id) {
                    return budgetActions.getBudget({ month: month, category: id });
                })
                    .reduce(function (total, value) { return total + value; }, 0);
                var transferValue = budgetActions.getBudget({
                    month: month,
                    category: transferId,
                });
                budgetActions.setBudget({
                    month: month,
                    category: transferId,
                    amount: totalValue + transferValue,
                });
            });
            return [2 /*return*/];
        });
    });
}
function createBudget(months) {
    return __awaiter(this, void 0, void 0, function () {
        var groups, categories, meta, budgetType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').select('*'))];
                case 1:
                    groups = (_a.sent()).data;
                    categories = groups.flatMap(function (group) { return group.categories; });
                    sheet.startTransaction();
                    meta = sheet.get().meta();
                    meta.createdMonths = meta.createdMonths || new Set();
                    budgetType = getBudgetType();
                    if (budgetType === 'envelope') {
                        envelopeBudget.createBudget(meta, categories, months);
                    }
                    months.forEach(function (month) {
                        if (!meta.createdMonths.has(month)) {
                            var prevMonth = monthUtils.prevMonth(month);
                            var _a = monthUtils.bounds(month), start_1 = _a.start, end_1 = _a.end;
                            var sheetName_1 = monthUtils.sheetForMonth(month);
                            var prevSheetName_1 = monthUtils.sheetForMonth(prevMonth);
                            categories.forEach(function (cat) {
                                createCategory(cat, sheetName_1, prevSheetName_1, start_1, end_1);
                            });
                            groups.forEach(function (group) {
                                if (budgetType === 'envelope') {
                                    envelopeBudget.createCategoryGroup(group, sheetName_1);
                                }
                                else {
                                    report.createCategoryGroup(group, sheetName_1);
                                }
                            });
                            if (budgetType === 'envelope') {
                                envelopeBudget.createSummary(groups, categories, prevSheetName_1, sheetName_1);
                            }
                            else {
                                report.createSummary(groups, sheetName_1);
                            }
                            meta.createdMonths.add(month);
                        }
                    });
                    sheet.get().setMeta(meta);
                    sheet.endTransaction();
                    // Wait for the spreadsheet to finish computing. Normally this won't
                    // do anything (as values are cached) but on first run this need to
                    // show the loading screen while it initially sets up.
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 2:
                    // Wait for the spreadsheet to finish computing. Normally this won't
                    // do anything (as values are cached) but on first run this need to
                    // show the loading screen while it initially sets up.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createAllBudgets() {
    return __awaiter(this, void 0, void 0, function () {
        var earliestTransaction, earliestDate, currentMonth, _a, start, end, range, meta, createdMonths, newMonths;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.first('SELECT * FROM transactions WHERE isChild=0 AND date IS NOT NULL ORDER BY date ASC LIMIT 1')];
                case 1:
                    earliestTransaction = _b.sent();
                    earliestDate = earliestTransaction && db.fromDateRepr(earliestTransaction.date);
                    currentMonth = monthUtils.currentMonth();
                    _a = getBudgetRange(earliestDate || currentMonth, currentMonth), start = _a.start, end = _a.end, range = _a.range;
                    meta = sheet.get().meta();
                    createdMonths = meta.createdMonths || new Set();
                    newMonths = range.filter(function (m) { return !createdMonths.has(m); });
                    if (!(newMonths.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, createBudget(range)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [2 /*return*/, { start: start, end: end }];
            }
        });
    });
}
function setType(type) {
    return __awaiter(this, void 0, void 0, function () {
        var meta, nodes, bounds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = sheet.get().meta();
                    if (type === meta.budgetType) {
                        return [2 /*return*/];
                    }
                    meta.budgetType = type;
                    meta.createdMonths = new Set();
                    nodes = sheet.get().getNodes();
                    db.transaction(function () {
                        for (var _i = 0, _a = nodes.keys(); _i < _a.length; _i++) {
                            var name_1 = _a[_i];
                            var _b = name_1.split('!'), sheetName = _b[0], cellName = _b[1];
                            if (sheetName.match(/^budget\d+/)) {
                                sheet.get().deleteCell(sheetName, cellName);
                            }
                        }
                    });
                    sheet.get().startCacheBarrier();
                    sheet.loadUserBudgets(db);
                    return [4 /*yield*/, createAllBudgets()];
                case 1:
                    bounds = _a.sent();
                    sheet.get().endCacheBarrier();
                    return [2 /*return*/, bounds];
            }
        });
    });
}
