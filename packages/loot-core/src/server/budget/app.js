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
exports.app = void 0;
var monthUtils = require("../../shared/months");
var query_1 = require("../../shared/query");
var app_1 = require("../app");
var aql_1 = require("../aql");
var db = require("../db");
var errors_1 = require("../errors");
var models_1 = require("../models");
var mutators_1 = require("../mutators");
var sheet = require("../sheet");
var util_1 = require("../spreadsheet/util");
var sync_1 = require("../sync");
var undo_1 = require("../undo");
var actions = require("./actions");
var budget = require("./base");
var cleanupActions = require("./cleanup-template");
var goalActions = require("./goal-template");
var goalNoteActions = require("./template-notes");
exports.app = (0, app_1.createApp)();
exports.app.method('budget/budget-amount', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.setBudget)));
exports.app.method('budget/copy-previous-month', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.copyPreviousMonth)));
exports.app.method('budget/copy-single-month', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.copySinglePreviousMonth)));
exports.app.method('budget/set-zero', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.setZero)));
exports.app.method('budget/set-3month-avg', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.set3MonthAvg)));
exports.app.method('budget/set-6month-avg', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.set6MonthAvg)));
exports.app.method('budget/set-12month-avg', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.set12MonthAvg)));
exports.app.method('budget/set-n-month-avg', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.setNMonthAvg)));
exports.app.method('budget/check-templates', (0, mutators_1.mutator)((0, undo_1.undoable)(goalActions.runCheckTemplates)));
exports.app.method('budget/apply-goal-template', (0, mutators_1.mutator)((0, undo_1.undoable)(goalActions.applyTemplate)));
exports.app.method('budget/apply-multiple-templates', (0, mutators_1.mutator)((0, undo_1.undoable)(goalActions.applyMultipleCategoryTemplates)));
exports.app.method('budget/overwrite-goal-template', (0, mutators_1.mutator)((0, undo_1.undoable)(goalActions.overwriteTemplate)));
exports.app.method('budget/apply-single-template', (0, mutators_1.mutator)((0, undo_1.undoable)(goalActions.applySingleCategoryTemplate)));
exports.app.method('budget/cleanup-goal-template', (0, mutators_1.mutator)((0, undo_1.undoable)(cleanupActions.cleanupTemplate)));
exports.app.method('budget/hold-for-next-month', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.holdForNextMonth)));
exports.app.method('budget/reset-hold', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.resetHold)));
exports.app.method('budget/cover-overspending', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.coverOverspending)));
exports.app.method('budget/transfer-available', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.transferAvailable)));
exports.app.method('budget/cover-overbudgeted', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.coverOverbudgeted)));
exports.app.method('budget/transfer-category', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.transferCategory)));
exports.app.method('budget/set-carryover', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.setCategoryCarryover)));
exports.app.method('budget/reset-income-carryover', (0, mutators_1.mutator)((0, undo_1.undoable)(actions.resetIncomeCarryover)));
exports.app.method('get-categories', getCategories);
exports.app.method('get-budget-bounds', getBudgetBounds);
exports.app.method('envelope-budget-month', envelopeBudgetMonth);
exports.app.method('tracking-budget-month', trackingBudgetMonth);
exports.app.method('category-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createCategory)));
exports.app.method('category-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateCategory)));
exports.app.method('category-move', (0, mutators_1.mutator)((0, undo_1.undoable)(moveCategory)));
exports.app.method('category-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteCategory)));
exports.app.method('get-category-groups', getCategoryGroups);
exports.app.method('category-group-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createCategoryGroup)));
exports.app.method('category-group-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateCategoryGroup)));
exports.app.method('category-group-move', (0, mutators_1.mutator)((0, undo_1.undoable)(moveCategoryGroup)));
exports.app.method('category-group-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteCategoryGroup)));
exports.app.method('must-category-transfer', isCategoryTransferRequired);
exports.app.method('budget/get-category-automations', goalActions.getTemplatesForCategory);
exports.app.method('budget/set-category-automations', (0, mutators_1.mutator)((0, undo_1.undoable)(goalActions.storeTemplates)));
exports.app.method('budget/store-note-templates', (0, mutators_1.mutator)(goalNoteActions.storeNoteTemplates));
exports.app.method('budget/render-note-templates', goalNoteActions.unparse);
// Server must return AQL entities not the raw DB data
function getCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var categoryGroups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCategoryGroups()];
                case 1:
                    categoryGroups = _a.sent();
                    return [2 /*return*/, {
                            grouped: categoryGroups,
                            list: categoryGroups.flatMap(function (g) { var _a; return (_a = g.categories) !== null && _a !== void 0 ? _a : []; }),
                        }];
            }
        });
    });
}
function getBudgetBounds() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, budget.createAllBudgets()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function envelopeBudgetMonth(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function value(name) {
            var v = sheet.getCellValue(sheetName, name);
            return { value: v === '' ? 0 : v, name: (0, util_1.resolveName)(sheetName, name) };
        }
        var groups, sheetName, values, _i, groups_1, group, categories, _c, categories_1, cat, _d, categories_2, cat;
        var _e;
        var month = _b.month;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, db.getCategoriesGrouped()];
                case 1:
                    groups = _f.sent();
                    sheetName = monthUtils.sheetForMonth(month);
                    values = [
                        value('available-funds'),
                        value('last-month-overspent'),
                        value('buffered'),
                        value('total-budgeted'),
                        value('to-budget'),
                        value('from-last-month'),
                        value('total-income'),
                        value('total-spent'),
                        value('total-leftover'),
                    ];
                    for (_i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                        group = groups_1[_i];
                        categories = (_e = group.categories) !== null && _e !== void 0 ? _e : [];
                        if (group.is_income) {
                            values.push(value('total-income'));
                            for (_c = 0, categories_1 = categories; _c < categories_1.length; _c++) {
                                cat = categories_1[_c];
                                values.push(value("sum-amount-".concat(cat.id)));
                            }
                        }
                        else {
                            values = values.concat([
                                value("group-budget-".concat(group.id)),
                                value("group-sum-amount-".concat(group.id)),
                                value("group-leftover-".concat(group.id)),
                            ]);
                            for (_d = 0, categories_2 = categories; _d < categories_2.length; _d++) {
                                cat = categories_2[_d];
                                values = values.concat([
                                    value("budget-".concat(cat.id)),
                                    value("sum-amount-".concat(cat.id)),
                                    value("leftover-".concat(cat.id)),
                                    value("carryover-".concat(cat.id)),
                                    value("goal-".concat(cat.id)),
                                    value("long-goal-".concat(cat.id)),
                                ]);
                            }
                        }
                    }
                    return [2 /*return*/, values];
            }
        });
    });
}
function trackingBudgetMonth(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function value(name) {
            var v = sheet.getCellValue(sheetName, name);
            return { value: v === '' ? 0 : v, name: (0, util_1.resolveName)(sheetName, name) };
        }
        var groups, sheetName, values, _i, groups_2, group, categories, _c, categories_3, cat;
        var _d;
        var month = _b.month;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, db.getCategoriesGrouped()];
                case 1:
                    groups = _e.sent();
                    sheetName = monthUtils.sheetForMonth(month);
                    values = [
                        value('total-budgeted'),
                        value('total-budget-income'),
                        value('total-saved'),
                        value('total-income'),
                        value('total-spent'),
                        value('real-saved'),
                        value('total-leftover'),
                    ];
                    for (_i = 0, groups_2 = groups; _i < groups_2.length; _i++) {
                        group = groups_2[_i];
                        values = values.concat([
                            value("group-budget-".concat(group.id)),
                            value("group-sum-amount-".concat(group.id)),
                            value("group-leftover-".concat(group.id)),
                        ]);
                        categories = (_d = group.categories) !== null && _d !== void 0 ? _d : [];
                        for (_c = 0, categories_3 = categories; _c < categories_3.length; _c++) {
                            cat = categories_3[_c];
                            values = values.concat([
                                value("budget-".concat(cat.id)),
                                value("sum-amount-".concat(cat.id)),
                                value("leftover-".concat(cat.id)),
                                value("goal-".concat(cat.id)),
                                value("long-goal-".concat(cat.id)),
                            ]);
                            if (!group.is_income) {
                                values.push(value("carryover-".concat(cat.id)));
                            }
                        }
                    }
                    return [2 /*return*/, values];
            }
        });
    });
}
function createCategory(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var name = _b.name, groupId = _b.groupId, isIncome = _b.isIncome, hidden = _b.hidden;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!groupId) {
                        throw (0, errors_1.APIError)('Creating a category: groupId is required');
                    }
                    return [4 /*yield*/, db.insertCategory({
                            name: name.trim(),
                            cat_group: groupId,
                            is_income: isIncome ? 1 : 0,
                            hidden: hidden ? 1 : 0,
                        })];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function updateCategory(category) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.updateCategory(models_1.categoryModel.toDb(__assign(__assign({}, category), { name: category.name.trim() })))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1 instanceof Error &&
                        e_1.message.toLowerCase().includes('unique constraint')) {
                        return [2 /*return*/, { error: { type: 'category-exists' } }];
                    }
                    throw e_1;
                case 3: return [2 /*return*/, {}];
            }
        });
    });
}
function moveCategory(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var id = _b.id, groupId = _b.groupId, targetId = _b.targetId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db.moveCategory(id, groupId, targetId)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCategory(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var result;
        var _this = this;
        var id = _b.id, transferId = _b.transferId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    result = {};
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var row, transfer, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, db.first('SELECT is_income FROM categories WHERE id = ?', [id])];
                                    case 1:
                                        row = _b.sent();
                                        if (!row) {
                                            result = { error: 'no-categories' };
                                            return [2 /*return*/];
                                        }
                                        _a = transferId;
                                        if (!_a) return [3 /*break*/, 3];
                                        return [4 /*yield*/, db.first('SELECT is_income FROM categories WHERE id = ?', [transferId])];
                                    case 2:
                                        _a = (_b.sent());
                                        _b.label = 3;
                                    case 3:
                                        transfer = _a;
                                        if (!row || (transferId && !transfer)) {
                                            result = { error: 'no-categories' };
                                            return [2 /*return*/];
                                        }
                                        else if (transferId &&
                                            row &&
                                            transfer &&
                                            row.is_income !== transfer.is_income) {
                                            result = { error: 'category-type' };
                                            return [2 /*return*/];
                                        }
                                        if (!(row.is_income === 0)) return [3 /*break*/, 5];
                                        if (!transferId) return [3 /*break*/, 5];
                                        return [4 /*yield*/, budget.doTransfer([id], transferId)];
                                    case 4:
                                        _b.sent();
                                        _b.label = 5;
                                    case 5: return [4 /*yield*/, db.deleteCategory({ id: id }, transferId)];
                                    case 6:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
// Server must return AQL entities not the raw DB data
function getCategoryGroups() {
    return __awaiter(this, void 0, void 0, function () {
        var categoryGroups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').select('*'))];
                case 1:
                    categoryGroups = (_a.sent()).data;
                    return [2 /*return*/, categoryGroups];
            }
        });
    });
}
function createCategoryGroup(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var name = _b.name, isIncome = _b.isIncome, hidden = _b.hidden;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.insertCategoryGroup({
                        name: name,
                        is_income: isIncome ? 1 : 0,
                        hidden: hidden ? 1 : 0,
                    })];
                case 1: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function updateCategoryGroup(group) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.updateCategoryGroup(models_1.categoryGroupModel.toDb(group))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function moveCategoryGroup(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var id = _b.id, targetId = _b.targetId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, db.moveCategoryGroup(id, targetId)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteCategoryGroup(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var groupCategories;
        var _this = this;
        var id = _b.id, transferId = _b.transferId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.all('SELECT id FROM categories WHERE cat_group = ? AND tombstone = 0', [id])];
                case 1:
                    groupCategories = _c.sent();
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!transferId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, budget.doTransfer(groupCategories.map(function (c) { return c.id; }), transferId)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [4 /*yield*/, db.deleteCategoryGroup({ id: id }, transferId)];
                                    case 3:
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
function isCategoryTransferRequired(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var res;
        var id = _b.id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.runQuery("SELECT count(t.id) as count FROM transactions t\n       LEFT JOIN category_mapping cm ON cm.id = t.category\n       WHERE cm.transferId = ? AND t.tombstone = 0", [id], true)];
                case 1:
                    res = _c.sent();
                    // If there are transactions with this category, return early since
                    // we already know it needs to be tranferred
                    if (res[0].count !== 0) {
                        return [2 /*return*/, true];
                    }
                    // If there are any non-zero budget values, also force the user to
                    // transfer the category.
                    return [2 /*return*/, __spreadArray([], sheet.get().meta().createdMonths, true).some(function (month) {
                            var sheetName = monthUtils.sheetForMonth(month);
                            var value = sheet.get().getCellValue(sheetName, 'budget-' + id);
                            return value != null && value !== 0;
                        })];
            }
        });
    });
}
