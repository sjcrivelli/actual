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
exports.cleanupTemplate = cleanupTemplate;
// @ts-strict-ignore
var monthUtils = require("../../shared/months");
var db = require("../db");
var actions_1 = require("./actions");
var cleanup_template_pegjs_1 = require("./cleanup-template.pegjs");
function cleanupTemplate(_a) {
    var month = _a.month;
    return processCleanup(month);
}
function applyGroupCleanups(month, sourceGroups, sinkGroups, generalGroups) {
    return __awaiter(this, void 0, void 0, function () {
        var sheetName, warnings, db_month, groupLength, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheetName = monthUtils.sheetForMonth(month);
                    warnings = [];
                    db_month = parseInt(month.replace('-', ''));
                    groupLength = sourceGroups.length;
                    _loop_1 = function () {
                        var groupName, tempSourceGroups, sinkGroup, generalGroup, total_weight, available_amount, ii, balance, budgeted, ii, ii, balance, budgeted, to_budget, categoryId, carryover, ii, budgeted, to_budget;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    groupName = sourceGroups[0].group;
                                    tempSourceGroups = sourceGroups.filter(function (c) { return c.group === groupName; });
                                    sinkGroup = sinkGroups.filter(function (c) { return c.group === groupName; });
                                    generalGroup = generalGroups.filter(function (c) { return c.group === groupName; });
                                    total_weight = 0;
                                    available_amount = 0;
                                    if (!(sinkGroup.length > 0 || generalGroup.length > 0)) return [3 /*break*/, 21];
                                    ii = 0;
                                    _b.label = 1;
                                case 1:
                                    if (!(ii < tempSourceGroups.length)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "leftover-".concat(tempSourceGroups[ii].category))];
                                case 2:
                                    balance = _b.sent();
                                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(tempSourceGroups[ii].category))];
                                case 3:
                                    budgeted = _b.sent();
                                    return [4 /*yield*/, (0, actions_1.setBudget)({
                                            category: tempSourceGroups[ii].category,
                                            month: month,
                                            amount: budgeted - balance,
                                        })];
                                case 4:
                                    _b.sent();
                                    available_amount += balance;
                                    _b.label = 5;
                                case 5:
                                    ii++;
                                    return [3 /*break*/, 1];
                                case 6:
                                    //calculate total weight for sinking funds
                                    for (ii = 0; ii < sinkGroup.length; ii++) {
                                        total_weight += sinkGroup[ii].weight;
                                    }
                                    ii = 0;
                                    _b.label = 7;
                                case 7:
                                    if (!(ii < generalGroup.length && available_amount > 0)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "leftover-".concat(generalGroup[ii].category))];
                                case 8:
                                    balance = _b.sent();
                                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(generalGroup[ii].category))];
                                case 9:
                                    budgeted = _b.sent();
                                    to_budget = budgeted + Math.abs(balance);
                                    categoryId = generalGroup[ii].category;
                                    return [4 /*yield*/, db.first("SELECT carryover FROM zero_budgets WHERE month = ? and category = ?", [db_month, categoryId])];
                                case 10:
                                    carryover = _b.sent();
                                    if (carryover === null) {
                                        carryover = { carryover: 0 };
                                    }
                                    if (!
                                    // We have enough to fully cover the overspent.
                                    (balance < 0 &&
                                        Math.abs(balance) <= available_amount &&
                                        !generalGroup[ii].category.is_income &&
                                        carryover.carryover === 0)) 
                                    // We have enough to fully cover the overspent.
                                    return [3 /*break*/, 12];
                                    return [4 /*yield*/, (0, actions_1.setBudget)({
                                            category: generalGroup[ii].category,
                                            month: month,
                                            amount: to_budget,
                                        })];
                                case 11:
                                    _b.sent();
                                    available_amount -= Math.abs(balance);
                                    return [3 /*break*/, 14];
                                case 12:
                                    if (!
                                    // We can only cover this category partially.
                                    (balance < 0 &&
                                        !generalGroup[ii].category.is_income &&
                                        carryover.carryover === 0 &&
                                        Math.abs(balance) > available_amount)) 
                                    // We can only cover this category partially.
                                    return [3 /*break*/, 14];
                                    return [4 /*yield*/, (0, actions_1.setBudget)({
                                            category: generalGroup[ii].category,
                                            month: month,
                                            amount: budgeted + available_amount,
                                        })];
                                case 13:
                                    _b.sent();
                                    available_amount = 0;
                                    _b.label = 14;
                                case 14:
                                    ii++;
                                    return [3 /*break*/, 7];
                                case 15:
                                    ii = 0;
                                    _b.label = 16;
                                case 16:
                                    if (!(ii < sinkGroup.length && available_amount > 0)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(sinkGroup[ii].category))];
                                case 17:
                                    budgeted = _b.sent();
                                    to_budget = budgeted +
                                        Math.round((sinkGroup[ii].weight / total_weight) * available_amount);
                                    return [4 /*yield*/, (0, actions_1.setBudget)({
                                            category: sinkGroup[ii].category,
                                            month: month,
                                            amount: to_budget,
                                        })];
                                case 18:
                                    _b.sent();
                                    _b.label = 19;
                                case 19:
                                    ii++;
                                    return [3 /*break*/, 16];
                                case 20: return [3 /*break*/, 22];
                                case 21:
                                    warnings.push(groupName + ' has no matching sink categories.');
                                    _b.label = 22;
                                case 22:
                                    sourceGroups = sourceGroups.filter(function (c) { return c.group !== groupName; });
                                    groupLength = sourceGroups.length;
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(groupLength > 0)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, warnings];
            }
        });
    });
}
function processCleanup(month) {
    return __awaiter(this, void 0, void 0, function () {
        var num_sources, num_sinks, total_weight, errors, warnings, sinkCategory, sourceWithRollover, db_month, category_templates, categories, sheetName, groupSource, groupSink, groupGeneral, c, category, template, newWarnings, c, category, template, balance, budgeted, carryover, c, category, budgetAvailable_1, balance, budgeted, to_budget, categoryId, carryover, budgetAvailable, c, budgeted, categoryId, weight, to_budget, currentBudgetAvailable, applied;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    num_sources = 0;
                    num_sinks = 0;
                    total_weight = 0;
                    errors = [];
                    warnings = [];
                    sinkCategory = [];
                    sourceWithRollover = [];
                    db_month = parseInt(month.replace('-', ''));
                    return [4 /*yield*/, getCategoryTemplates()];
                case 1:
                    category_templates = _a.sent();
                    return [4 /*yield*/, db.all('SELECT * FROM v_categories WHERE tombstone = 0')];
                case 2:
                    categories = _a.sent();
                    sheetName = monthUtils.sheetForMonth(month);
                    groupSource = [];
                    groupSink = [];
                    groupGeneral = [];
                    //filter out category groups
                    for (c = 0; c < categories.length; c++) {
                        category = categories[c];
                        template = category_templates[category.id];
                        //filter out source and sink groups for processing
                        if (template) {
                            if (template.filter(function (t) { return t.type === 'source' && t.group !== null; }).length > 0) {
                                groupSource.push({
                                    category: category.id,
                                    group: template.filter(function (t) { return t.type === 'source' && t.group !== null; })[0].group,
                                });
                            }
                            if (template.filter(function (t) { return t.type === 'sink' && t.group !== null; }).length > 0) {
                                //only supports 1 sink reference per category.  Need more?
                                groupSink.push({
                                    category: category.id,
                                    group: template.filter(function (t) { return t.type === 'sink' && t.group !== null; })[0]
                                        .group,
                                    weight: template.filter(function (t) { return t.type === 'sink' && t.group !== null; })[0]
                                        .weight,
                                });
                            }
                            if (template.filter(function (t) { return t.type === null && t.group !== null; }).length > 0) {
                                groupGeneral.push({ category: category.id, group: template[0].group });
                            }
                        }
                    }
                    return [4 /*yield*/, applyGroupCleanups(month, groupSource, groupSink, groupGeneral)];
                case 3:
                    newWarnings = _a.sent();
                    warnings.splice.apply(warnings, __spreadArray([1, 0], newWarnings, false));
                    c = 0;
                    _a.label = 4;
                case 4:
                    if (!(c < categories.length)) return [3 /*break*/, 14];
                    category = categories[c];
                    template = category_templates[category.id];
                    if (!template) return [3 /*break*/, 13];
                    if (!(template.filter(function (t) { return t.type === 'source' && t.group === null; }).length > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "leftover-".concat(category.id))];
                case 5:
                    balance = _a.sent();
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(category.id))];
                case 6:
                    budgeted = _a.sent();
                    if (!(balance >= 0)) return [3 /*break*/, 9];
                    // const spent = await getSheetValue(
                    //   sheetName,
                    //   `sum-amount-${category.id}`,
                    // );
                    return [4 /*yield*/, (0, actions_1.setBudget)({
                            category: category.id,
                            month: month,
                            amount: budgeted - balance,
                        })];
                case 7:
                    // const spent = await getSheetValue(
                    //   sheetName,
                    //   `sum-amount-${category.id}`,
                    // );
                    _a.sent();
                    return [4 /*yield*/, (0, actions_1.setGoal)({
                            category: category.id,
                            month: month,
                            goal: budgeted - balance,
                            long_goal: 0,
                        })];
                case 8:
                    _a.sent();
                    num_sources += 1;
                    return [3 /*break*/, 10];
                case 9:
                    warnings.push(category.name + ' does not have available funds.');
                    _a.label = 10;
                case 10: return [4 /*yield*/, db.first("SELECT carryover FROM zero_budgets WHERE month = ? and category = ?", [db_month, category.id])];
                case 11:
                    carryover = _a.sent();
                    if (carryover !== null) {
                        //keep track of source categories with rollover enabled
                        if (carryover.carryover === 1) {
                            sourceWithRollover.push({ cat: category, temp: template });
                        }
                    }
                    _a.label = 12;
                case 12:
                    if (template.filter(function (t) { return t.type === 'sink' && t.group === null; }).length > 0) {
                        sinkCategory.push({ cat: category, temp: template });
                        num_sinks += 1;
                        total_weight += template.filter(function (w) { return w.type === 'sink'; })[0].weight;
                    }
                    _a.label = 13;
                case 13:
                    c++;
                    return [3 /*break*/, 4];
                case 14:
                    c = 0;
                    _a.label = 15;
                case 15:
                    if (!(c < categories.length)) return [3 /*break*/, 24];
                    category = categories[c];
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "to-budget")];
                case 16:
                    budgetAvailable_1 = _a.sent();
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "leftover-".concat(category.id))];
                case 17:
                    balance = _a.sent();
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(category.id))];
                case 18:
                    budgeted = _a.sent();
                    to_budget = budgeted + Math.abs(balance);
                    categoryId = category.id;
                    return [4 /*yield*/, db.first("SELECT carryover FROM zero_budgets WHERE month = ? and category = ?", [db_month, categoryId])];
                case 19:
                    carryover = _a.sent();
                    if (carryover === null) {
                        carryover = { carryover: 0 };
                    }
                    if (!(balance < 0 &&
                        Math.abs(balance) <= budgetAvailable_1 &&
                        !category.is_income &&
                        carryover.carryover === 0)) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, actions_1.setBudget)({
                            category: category.id,
                            month: month,
                            amount: to_budget,
                        })];
                case 20:
                    _a.sent();
                    return [3 /*break*/, 23];
                case 21:
                    if (!(balance < 0 &&
                        !category.is_income &&
                        carryover.carryover === 0 &&
                        Math.abs(balance) > budgetAvailable_1)) return [3 /*break*/, 23];
                    return [4 /*yield*/, (0, actions_1.setBudget)({
                            category: category.id,
                            month: month,
                            amount: budgeted + budgetAvailable_1,
                        })];
                case 22:
                    _a.sent();
                    _a.label = 23;
                case 23:
                    c++;
                    return [3 /*break*/, 15];
                case 24: return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "to-budget")];
                case 25:
                    budgetAvailable = _a.sent();
                    if (budgetAvailable < 0) {
                        warnings.push('Global: No funds are available to reallocate.');
                    }
                    c = 0;
                    _a.label = 26;
                case 26:
                    if (!(c < sinkCategory.length)) return [3 /*break*/, 32];
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(sinkCategory[c].cat.id))];
                case 27:
                    budgeted = _a.sent();
                    categoryId = sinkCategory[c].cat.id;
                    weight = sinkCategory[c].temp.filter(function (w) { return w.type === 'sink'; })[0]
                        .weight;
                    to_budget = budgeted + Math.round((weight / total_weight) * budgetAvailable);
                    if (!(c === sinkCategory.length - 1)) return [3 /*break*/, 29];
                    return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "to-budget")];
                case 28:
                    currentBudgetAvailable = _a.sent();
                    if (to_budget > currentBudgetAvailable) {
                        to_budget = budgeted + currentBudgetAvailable;
                    }
                    _a.label = 29;
                case 29: return [4 /*yield*/, (0, actions_1.setBudget)({
                        category: categoryId,
                        month: month,
                        amount: to_budget,
                    })];
                case 30:
                    _a.sent();
                    _a.label = 31;
                case 31:
                    c++;
                    return [3 /*break*/, 26];
                case 32:
                    if (num_sources === 0) {
                        if (errors.length) {
                            return [2 /*return*/, {
                                    type: 'error',
                                    sticky: true,
                                    message: 'There were errors interpreting some templates:',
                                    pre: errors.join('\n\n'),
                                }];
                        }
                        else if (warnings.length) {
                            return [2 /*return*/, {
                                    type: 'warning',
                                    message: 'Global: Funds not available:',
                                    pre: warnings.join('\n\n'),
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    type: 'message',
                                    message: 'All categories were up to date.',
                                }];
                        }
                    }
                    else {
                        applied = "Successfully returned funds from ".concat(num_sources, " ").concat(num_sources === 1 ? 'source' : 'sources', " and funded ").concat(num_sinks, " sinking ").concat(num_sinks === 1 ? 'fund' : 'funds', ".");
                        if (errors.length) {
                            return [2 /*return*/, {
                                    sticky: true,
                                    message: "".concat(applied, " There were errors interpreting some templates:"),
                                    pre: errors.join('\n\n'),
                                }];
                        }
                        else if (warnings.length) {
                            return [2 /*return*/, {
                                    type: 'warning',
                                    message: 'Global: Funds not available:',
                                    pre: warnings.join('\n\n'),
                                }];
                        }
                        else if (budgetAvailable === 0) {
                            return [2 /*return*/, {
                                    type: 'message',
                                    message: 'All categories were up to date.',
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    type: 'message',
                                    message: applied,
                                }];
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
var TEMPLATE_PREFIX = '#cleanup ';
function getCategoryTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var templates, notes, n, lines, template_lines, l, line, expression, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templates = {};
                    return [4 /*yield*/, db.all("SELECT * FROM notes WHERE lower(note) like '%".concat(TEMPLATE_PREFIX, "%'"))];
                case 1:
                    notes = _a.sent();
                    for (n = 0; n < notes.length; n++) {
                        lines = notes[n].note.split('\n');
                        template_lines = [];
                        for (l = 0; l < lines.length; l++) {
                            line = lines[l].trim();
                            if (!line.toLowerCase().startsWith(TEMPLATE_PREFIX))
                                continue;
                            expression = line.slice(TEMPLATE_PREFIX.length);
                            try {
                                parsed = (0, cleanup_template_pegjs_1.parse)(expression);
                                template_lines.push(parsed);
                            }
                            catch (e) {
                                template_lines.push({ type: 'error', line: line, error: e });
                            }
                        }
                        if (template_lines.length) {
                            templates[notes[n].id] = template_lines;
                        }
                    }
                    return [2 /*return*/, templates];
            }
        });
    });
}
