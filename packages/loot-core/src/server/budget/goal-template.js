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
exports.storeTemplates = storeTemplates;
exports.applyTemplate = applyTemplate;
exports.overwriteTemplate = overwriteTemplate;
exports.applyMultipleCategoryTemplates = applyMultipleCategoryTemplates;
exports.applySingleCategoryTemplate = applySingleCategoryTemplate;
exports.runCheckTemplates = runCheckTemplates;
exports.getTemplatesForCategory = getTemplatesForCategory;
// @ts-strict-ignore
var monthUtils = require("../../shared/months");
var query_1 = require("../../shared/query");
var aql_1 = require("../aql");
var db = require("../db");
var sync_1 = require("../sync");
var actions_1 = require("./actions");
var category_template_context_1 = require("./category-template-context");
var template_notes_1 = require("./template-notes");
function storeTemplates(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var categoriesWithTemplates = _b.categoriesWithTemplates, source = _b.source;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _i, categoriesWithTemplates_1, _a, id, templates, goalDefs;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _i = 0, categoriesWithTemplates_1 = categoriesWithTemplates;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < categoriesWithTemplates_1.length)) return [3 /*break*/, 4];
                                    _a = categoriesWithTemplates_1[_i], id = _a.id, templates = _a.templates;
                                    goalDefs = JSON.stringify(templates);
                                    return [4 /*yield*/, db.updateWithSchema('categories', {
                                            id: id,
                                            goal_def: goalDefs,
                                            template_settings: { source: source },
                                        })];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
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
function applyTemplate(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categoryTemplates, ret;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, template_notes_1.storeNoteTemplates)()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, getTemplates()];
                case 2:
                    categoryTemplates = _c.sent();
                    return [4 /*yield*/, processTemplate(month, false, categoryTemplates)];
                case 3:
                    ret = _c.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
function overwriteTemplate(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categoryTemplates, ret;
        var month = _b.month;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, template_notes_1.storeNoteTemplates)()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, getTemplates()];
                case 2:
                    categoryTemplates = _c.sent();
                    return [4 /*yield*/, processTemplate(month, true, categoryTemplates)];
                case 3:
                    ret = _c.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
function applyMultipleCategoryTemplates(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categoryData, categoryTemplates, ret;
        var month = _b.month, categoryIds = _b.categoryIds;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('categories')
                        .filter({ id: { $oneof: categoryIds } })
                        .select('*'))];
                case 1:
                    categoryData = (_c.sent()).data;
                    return [4 /*yield*/, (0, template_notes_1.storeNoteTemplates)()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, getTemplates(function (c) { return categoryIds.includes(c.id); })];
                case 3:
                    categoryTemplates = _c.sent();
                    return [4 /*yield*/, processTemplate(month, true, categoryTemplates, categoryData)];
                case 4:
                    ret = _c.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
function applySingleCategoryTemplate(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var categoryData, categoryTemplates, ret;
        var month = _b.month, category = _b.category;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('categories').filter({ id: category }).select('*'))];
                case 1:
                    categoryData = (_c.sent()).data;
                    return [4 /*yield*/, (0, template_notes_1.storeNoteTemplates)()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, getTemplates(function (c) { return c.id === category; })];
                case 3:
                    categoryTemplates = _c.sent();
                    return [4 /*yield*/, processTemplate(month, true, categoryTemplates, categoryData)];
                case 4:
                    ret = _c.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
function runCheckTemplates() {
    return (0, template_notes_1.checkTemplateNotes)();
}
function getCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var categoryGroups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').filter({ hidden: false }).select('*'))];
                case 1:
                    categoryGroups = (_a.sent()).data;
                    return [2 /*return*/, categoryGroups.flatMap(function (g) { return g.categories || []; }).filter(function (c) { return !c.hidden; })];
            }
        });
    });
}
function getTemplates() {
    return __awaiter(this, arguments, void 0, function (filter) {
        var categoriesWithGoalDef, categoryTemplates, _i, _a, categoryWithGoalDef;
        if (filter === void 0) { filter = function () { return true; }; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('categories')
                        .filter({ goal_def: { $ne: null } })
                        .select('*'))];
                case 1:
                    categoriesWithGoalDef = (_b.sent()).data;
                    categoryTemplates = {};
                    for (_i = 0, _a = categoriesWithGoalDef.filter(filter); _i < _a.length; _i++) {
                        categoryWithGoalDef = _a[_i];
                        categoryTemplates[categoryWithGoalDef.id] = JSON.parse(categoryWithGoalDef.goal_def);
                    }
                    return [2 /*return*/, categoryTemplates];
            }
        });
    });
}
function getTemplatesForCategory(categoryId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getTemplates(function (c) { return c.id === categoryId; })];
        });
    });
}
function setBudgets(month, templateBudget) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            templateBudget.forEach(function (element) {
                                (0, actions_1.setBudget)({
                                    category: element.category,
                                    month: month,
                                    amount: element.budgeted,
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setGoals(month, templateGoal) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            templateGoal.forEach(function (element) {
                                (0, actions_1.setGoal)({
                                    month: month,
                                    category: element.category,
                                    goal: element.goal,
                                    long_goal: element.longGoal,
                                });
                            });
                            return [2 /*return*/];
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function processTemplate(month_1, force_1, categoryTemplates_1) {
    return __awaiter(this, arguments, void 0, function (month, force, categoryTemplates, categories) {
        var isReflect, templateContexts, availBudget, prioritiesSet, errors, budgetList, goalList, _i, categories_1, category, id, sheetName, templates, budgeted, existingGoal, templateContext, e_1, priorities, _a, priorities_1, priority, availStart, _b, templateContexts_1, templateContext, budget, remainderContexts, _loop_1;
        if (categories === void 0) { categories = []; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    isReflect = (0, actions_1.isReflectBudget)();
                    if (!!categories.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, getCategories()];
                case 1:
                    categories = (_c.sent()).filter(function (c) { return isReflect || !c.is_income; });
                    _c.label = 2;
                case 2:
                    templateContexts = [];
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(monthUtils.sheetForMonth(month), "to-budget")];
                case 3:
                    availBudget = _c.sent();
                    prioritiesSet = new Set();
                    errors = [];
                    budgetList = [];
                    goalList = [];
                    _i = 0, categories_1 = categories;
                    _c.label = 4;
                case 4:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 13];
                    category = categories_1[_i];
                    id = category.id;
                    sheetName = monthUtils.sheetForMonth(month);
                    templates = categoryTemplates[id];
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(id))];
                case 5:
                    budgeted = _c.sent();
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "goal-".concat(id))];
                case 6:
                    existingGoal = _c.sent();
                    if (!((budgeted === 0 || force) && templates)) return [3 /*break*/, 11];
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, month, budgeted)];
                case 8:
                    templateContext = _c.sent();
                    // don't use the funds that are not from templates
                    if (!templateContext.isGoalOnly()) {
                        availBudget += budgeted;
                    }
                    availBudget += templateContext.getLimitExcess();
                    templateContext.getPriorities().forEach(function (p) { return prioritiesSet.add(p); });
                    templateContexts.push(templateContext);
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _c.sent();
                    errors.push("".concat(category.name, ": ").concat(e_1.message));
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (existingGoal !== null && !templates) {
                        goalList.push({
                            category: id,
                            goal: null,
                            longGoal: null,
                        });
                    }
                    _c.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 4];
                case 13:
                    //break early if nothing to do, or there are errors
                    if (templateContexts.length === 0 && errors.length === 0) {
                        if (goalList.length > 0) {
                            setGoals(month, goalList);
                        }
                        return [2 /*return*/, {
                                type: 'message',
                                message: 'Everything is up to date',
                            }];
                    }
                    if (errors.length > 0) {
                        return [2 /*return*/, {
                                sticky: true,
                                message: 'There were errors interpreting some templates:',
                                pre: errors.join("\n\n"),
                            }];
                    }
                    priorities = new Int32Array(__spreadArray([], prioritiesSet, true)).sort();
                    _a = 0, priorities_1 = priorities;
                    _c.label = 14;
                case 14:
                    if (!(_a < priorities_1.length)) return [3 /*break*/, 19];
                    priority = priorities_1[_a];
                    availStart = availBudget;
                    _b = 0, templateContexts_1 = templateContexts;
                    _c.label = 15;
                case 15:
                    if (!(_b < templateContexts_1.length)) return [3 /*break*/, 18];
                    templateContext = templateContexts_1[_b];
                    return [4 /*yield*/, templateContext.runTemplatesForPriority(priority, availBudget, availStart)];
                case 16:
                    budget = _c.sent();
                    availBudget -= budget;
                    _c.label = 17;
                case 17:
                    _b++;
                    return [3 /*break*/, 15];
                case 18:
                    _a++;
                    return [3 /*break*/, 14];
                case 19:
                    remainderContexts = templateContexts.filter(function (c) { return c.hasRemainder(); });
                    _loop_1 = function () {
                        var remainderWeight = 0;
                        remainderContexts.forEach(function (context) { return (remainderWeight += context.getRemainderWeight()); });
                        var perWeight = availBudget / remainderWeight;
                        remainderContexts.forEach(function (context) {
                            availBudget -= context.runRemainder(availBudget, perWeight);
                        });
                        remainderContexts = templateContexts.filter(function (c) { return c.hasRemainder(); });
                    };
                    while (availBudget > 0 && remainderContexts.length > 0) {
                        _loop_1();
                    }
                    // finish
                    templateContexts.forEach(function (context) {
                        var values = context.getValues();
                        budgetList.push({
                            category: context.category.id,
                            budgeted: values.budgeted,
                        });
                        goalList.push({
                            category: context.category.id,
                            goal: values.goal,
                            longGoal: values.longGoal ? 1 : null,
                        });
                    });
                    return [4 /*yield*/, setBudgets(month, budgetList)];
                case 20:
                    _c.sent();
                    return [4 /*yield*/, setGoals(month, goalList)];
                case 21:
                    _c.sent();
                    return [2 /*return*/, {
                            type: 'message',
                            message: "Successfully applied templates to ".concat(templateContexts.length, " categories"),
                        }];
            }
        });
    });
}
