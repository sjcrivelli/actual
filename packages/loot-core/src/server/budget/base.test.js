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
// @ts-strict-ignore
var monthUtils = require("../../shared/months");
var db = require("../db");
var sheet = require("../sheet");
var base_1 = require("./base");
beforeEach(function () {
    return global.emptyDatabase()();
});
describe('Base budget', function () {
    it('Recomputes budget cells when account fields change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var catId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'group1' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'group2',
                            name: 'income',
                            is_income: 1,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'foo',
                            cat_group: 'group1',
                        })];
                case 4:
                    catId = _a.sent();
                    return [4 /*yield*/, (0, base_1.createAllBudgets)()];
                case 5:
                    _a.sent();
                    // Insert a transaction referencing an account that doesn't exist
                    // yet
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2016-12-15',
                            amount: -5000,
                            account: '29eef937-9933-49ef-80d9-71627074cf31',
                            category: catId,
                        })];
                case 6:
                    // Insert a transaction referencing an account that doesn't exist
                    // yet
                    _a.sent();
                    // Make sure that the spreadsheet finishes processing to make sure
                    // the next change doesn't get batched in with it
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 7:
                    // Make sure that the spreadsheet finishes processing to make sure
                    // the next change doesn't get batched in with it
                    _a.sent();
                    // The category should have nothing spent on it yet
                    expect(sheet.getCellValue(monthUtils.sheetForMonth('2016-12'), "sum-amount-".concat(catId))).toBe(0);
                    // Create the referenced account
                    return [4 /*yield*/, db.insertAccount({
                            id: '29eef937-9933-49ef-80d9-71627074cf31',
                            name: 'foo',
                        })];
                case 8:
                    // Create the referenced account
                    _a.sent();
                    // Make sure the spreadsheet finishes processing
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 9:
                    // Make sure the spreadsheet finishes processing
                    _a.sent();
                    // The category should see the transaction
                    expect(sheet.getCellValue(monthUtils.sheetForMonth('2016-12'), "sum-amount-".concat(catId))).toBe(-5000);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Excludes hidden categories from group totals in Report Budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visibleCatId, hiddenCatId, month, sheetName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    sheet.get().meta().budgetType = 'tracking';
                    // Create a group with multiple categories
                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'Test Group' })];
                case 2:
                    // Create a group with multiple categories
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'group2',
                            name: 'Income',
                            is_income: 1,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Visible Category',
                            cat_group: 'group1',
                        })];
                case 4:
                    visibleCatId = _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Hidden Category',
                            cat_group: 'group1',
                            hidden: 1,
                        })];
                case 5:
                    hiddenCatId = _a.sent();
                    return [4 /*yield*/, (0, base_1.createAllBudgets)()];
                case 6:
                    _a.sent();
                    month = '2017-01';
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, db.insertAccount({ id: 'account1', name: 'Account 1' })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -1000,
                            account: 'account1',
                            category: visibleCatId,
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -2000,
                            account: 'account1',
                            category: hiddenCatId,
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 10:
                    _a.sent();
                    // Verify individual category amounts
                    expect(sheet.getCellValue(sheetName, "sum-amount-".concat(visibleCatId))).toBe(-1000);
                    expect(sheet.getCellValue(sheetName, "sum-amount-".concat(hiddenCatId))).toBe(-2000);
                    // Verify group total only includes visible category
                    expect(sheet.getCellValue(sheetName, "group-sum-amount-group1")).toBe(-1000);
                    // Now toggle hidden status of the hidden category to make it visible
                    return [4 /*yield*/, db.updateCategory({
                            id: hiddenCatId,
                            name: 'Hidden Category',
                            cat_group: 'group1',
                            is_income: 0,
                            hidden: 0,
                        })];
                case 11:
                    // Now toggle hidden status of the hidden category to make it visible
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 12:
                    _a.sent();
                    // After making hidden category visible, group total should include both
                    expect(sheet.getCellValue(sheetName, "group-sum-amount-group1")).toBe(-3000);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Excludes hidden category groups from budget totals in Report Budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visibleGroupCatId, hiddenGroupCatId, month, sheetName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    sheet.get().meta().budgetType = 'tracking';
                    // Create two expense groups - one visible, one hidden
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'visible-group',
                            name: 'Visible Group',
                        })];
                case 2:
                    // Create two expense groups - one visible, one hidden
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'hidden-group',
                            name: 'Hidden Group',
                            hidden: 1,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'income-group',
                            name: 'Income',
                            is_income: 1,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Visible Group Category',
                            cat_group: 'visible-group',
                        })];
                case 5:
                    visibleGroupCatId = _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Hidden Group Category',
                            cat_group: 'hidden-group',
                        })];
                case 6:
                    hiddenGroupCatId = _a.sent();
                    return [4 /*yield*/, (0, base_1.createAllBudgets)()];
                case 7:
                    _a.sent();
                    month = '2017-01';
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, db.insertAccount({ id: 'account1', name: 'Account 1' })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -1000,
                            account: 'account1',
                            category: visibleGroupCatId,
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -2000,
                            account: 'account1',
                            category: hiddenGroupCatId,
                        })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 11:
                    _a.sent();
                    // Verify individual amounts
                    expect(sheet.getCellValue(sheetName, "sum-amount-".concat(visibleGroupCatId))).toBe(-1000);
                    expect(sheet.getCellValue(sheetName, "sum-amount-".concat(hiddenGroupCatId))).toBe(-2000);
                    expect(sheet.getCellValue(sheetName, "group-sum-amount-visible-group")).toBe(-1000);
                    expect(sheet.getCellValue(sheetName, "group-sum-amount-hidden-group")).toBe(-2000);
                    // Verify total spent only includes visible group
                    expect(sheet.getCellValue(sheetName, 'total-spent')).toBe(-1000);
                    // Now toggle hidden status of the hidden group to make it visible
                    return [4 /*yield*/, db.updateCategoryGroup({
                            id: 'hidden-group',
                            name: 'Hidden Group',
                            is_income: 0,
                            hidden: 0,
                        })];
                case 12:
                    // Now toggle hidden status of the hidden group to make it visible
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 13:
                    _a.sent();
                    // After making hidden group visible, total should include both
                    expect(sheet.getCellValue(sheetName, 'total-spent')).toBe(-3000);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Includes hidden categories in group totals for Rollover Budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visibleCatId, hiddenCatId, month, sheetName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    // Rollover is the default, but explicit for clarity
                    sheet.get().meta().budgetType = 'envelope';
                    // Create a group with multiple categories
                    return [4 /*yield*/, db.insertCategoryGroup({ id: 'group1', name: 'Test Group' })];
                case 2:
                    // Create a group with multiple categories
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'group2',
                            name: 'Income',
                            is_income: 1,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Visible Category',
                            cat_group: 'group1',
                        })];
                case 4:
                    visibleCatId = _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Hidden Category',
                            cat_group: 'group1',
                            hidden: 1,
                        })];
                case 5:
                    hiddenCatId = _a.sent();
                    return [4 /*yield*/, (0, base_1.createAllBudgets)()];
                case 6:
                    _a.sent();
                    month = '2017-01';
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, db.insertAccount({ id: 'account1', name: 'Account 1' })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -1000,
                            account: 'account1',
                            category: visibleCatId,
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -2000,
                            account: 'account1',
                            category: hiddenCatId,
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 10:
                    _a.sent();
                    // Verify group total includes both visible and hidden category amounts
                    expect(sheet.getCellValue(sheetName, "group-sum-amount-group1")).toBe(-3000);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Includes hidden category groups in budget totals for Rollover Budget', function () { return __awaiter(void 0, void 0, void 0, function () {
        var visibleGroupCatId, hiddenGroupCatId, month, sheetName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet.loadSpreadsheet(db)];
                case 1:
                    _a.sent();
                    // Rollover is the default, but explicit for clarity
                    sheet.get().meta().budgetType = 'envelope';
                    // Create two expense groups - one visible, one hidden
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'visible-group',
                            name: 'Visible Group',
                        })];
                case 2:
                    // Create two expense groups - one visible, one hidden
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'hidden-group',
                            name: 'Hidden Group',
                            hidden: 1,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategoryGroup({
                            id: 'income-group',
                            name: 'Income',
                            is_income: 1,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Visible Group Category',
                            cat_group: 'visible-group',
                        })];
                case 5:
                    visibleGroupCatId = _a.sent();
                    return [4 /*yield*/, db.insertCategory({
                            name: 'Hidden Group Category',
                            cat_group: 'hidden-group',
                        })];
                case 6:
                    hiddenGroupCatId = _a.sent();
                    return [4 /*yield*/, (0, base_1.createAllBudgets)()];
                case 7:
                    _a.sent();
                    month = '2017-01';
                    sheetName = monthUtils.sheetForMonth(month);
                    return [4 /*yield*/, db.insertAccount({ id: 'account1', name: 'Account 1' })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -1000,
                            account: 'account1',
                            category: visibleGroupCatId,
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db.insertTransaction({
                            date: '2017-01-15',
                            amount: -2000,
                            account: 'account1',
                            category: hiddenGroupCatId,
                        })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, sheet.waitOnSpreadsheet()];
                case 11:
                    _a.sent();
                    // Verify total spent includes both visible and hidden group amounts
                    expect(sheet.getCellValue(sheetName, 'total-spent')).toBe(-3000);
                    return [2 /*return*/];
            }
        });
    }); });
});
