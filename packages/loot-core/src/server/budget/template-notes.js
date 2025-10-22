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
exports.GOAL_PREFIX = exports.TEMPLATE_PREFIX = void 0;
exports.storeNoteTemplates = storeNoteTemplates;
exports.checkTemplateNotes = checkTemplateNotes;
exports.unparse = unparse;
var goal_template_1 = require("./goal-template");
var goal_template_pegjs_1 = require("./goal-template.pegjs");
var statements_1 = require("./statements");
exports.TEMPLATE_PREFIX = '#template';
exports.GOAL_PREFIX = '#goal';
function storeNoteTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var categoriesWithTemplates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCategoriesWithTemplates()];
                case 1:
                    categoriesWithTemplates = _a.sent();
                    return [4 /*yield*/, (0, goal_template_1.storeTemplates)({ categoriesWithTemplates: categoriesWithTemplates, source: 'notes' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, statements_1.resetCategoryGoalDefsWithNoTemplates)()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkTemplateNotes() {
    return __awaiter(this, void 0, void 0, function () {
        var categoryWithTemplates, schedules, scheduleNames, errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCategoriesWithTemplates()];
                case 1:
                    categoryWithTemplates = _a.sent();
                    return [4 /*yield*/, (0, statements_1.getActiveSchedules)()];
                case 2:
                    schedules = _a.sent();
                    scheduleNames = schedules.map(function (_a) {
                        var name = _a.name;
                        return name;
                    });
                    errors = [];
                    categoryWithTemplates.forEach(function (_a) {
                        var name = _a.name, templates = _a.templates;
                        templates.forEach(function (template) {
                            if (template.type === 'error') {
                                // Only show detailed error for adjustment-related errors
                                if (template.error && template.error.includes('adjustment')) {
                                    errors.push("".concat(name, ": ").concat(template.line, "\nError: ").concat(template.error));
                                }
                                else {
                                    errors.push("".concat(name, ": ").concat(template.line));
                                }
                            }
                            else if (template.type === 'schedule' &&
                                !scheduleNames.includes(template.name)) {
                                errors.push("".concat(name, ": Schedule \u201C").concat(template.name, "\u201D does not exist"));
                            }
                        });
                    });
                    if (errors.length) {
                        return [2 /*return*/, {
                                sticky: true,
                                message: 'There were errors interpreting some templates:',
                                pre: errors.join('\n\n'),
                            }];
                    }
                    return [2 /*return*/, {
                            type: 'message',
                            message: 'All templates passed! 🎉',
                        }];
            }
        });
    });
}
function getCategoriesWithTemplates() {
    return __awaiter(this, void 0, void 0, function () {
        var templatesForCategory, templateNotes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    templatesForCategory = [];
                    return [4 /*yield*/, (0, statements_1.getCategoriesWithTemplateNotes)()];
                case 1:
                    templateNotes = _a.sent();
                    templateNotes.forEach(function (_a) {
                        var id = _a.id, name = _a.name, note = _a.note;
                        if (!note) {
                            return;
                        }
                        var parsedTemplates = [];
                        note.split('\n').forEach(function (line) {
                            var trimmedLine = line.substring(line.indexOf('#')).trim();
                            if (!trimmedLine.startsWith(exports.TEMPLATE_PREFIX) &&
                                !trimmedLine.startsWith(exports.GOAL_PREFIX)) {
                                return;
                            }
                            try {
                                var parsedTemplate = (0, goal_template_pegjs_1.parse)(trimmedLine);
                                // Validate schedule adjustments
                                if (parsedTemplate.type === 'schedule' &&
                                    parsedTemplate.adjustment !== undefined) {
                                    if (parsedTemplate.adjustment <= -100 ||
                                        parsedTemplate.adjustment > 1000) {
                                        throw new Error("Invalid adjustment percentage (".concat(parsedTemplate.adjustment, "%). Must be between -100% and 1000%"));
                                    }
                                }
                                parsedTemplates.push(parsedTemplate);
                            }
                            catch (e) {
                                parsedTemplates.push({
                                    type: 'error',
                                    directive: 'error',
                                    line: line,
                                    error: e.message,
                                });
                            }
                        });
                        if (!parsedTemplates.length) {
                            return;
                        }
                        templatesForCategory.push({
                            id: id,
                            name: name,
                            templates: parsedTemplates,
                        });
                    });
                    return [2 /*return*/, templatesForCategory];
            }
        });
    });
}
function unparse(templates) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, templates
                    .flatMap(function (template) {
                    if (template.type === 'error') {
                        return [];
                    }
                    if (template.type === 'goal') {
                        return "".concat(exports.GOAL_PREFIX, " ").concat(template.amount);
                    }
                    var prefix = template.priority
                        ? "".concat(exports.TEMPLATE_PREFIX, "-").concat(template.priority)
                        : exports.TEMPLATE_PREFIX;
                    switch (template.type) {
                        case 'simple': {
                            // Simple template syntax: #template[-prio] simple [monthly N] [limit]
                            var result = prefix;
                            if (template.monthly != null) {
                                result += " ".concat(template.monthly);
                            }
                            if (template.limit) {
                                result += " ".concat(limitToString(template.limit));
                            }
                            return result.trim();
                        }
                        case 'schedule': {
                            // schedule syntax: #template[-prio] schedule <name> [full] [ [increase/decrease N%] ]
                            var result = "".concat(prefix, " schedule");
                            if (template.full) {
                                result += ' full';
                            }
                            result += " ".concat(template.name);
                            if (template.adjustment !== undefined) {
                                var adj = template.adjustment;
                                var op = adj >= 0 ? 'increase' : 'decrease';
                                var val = Math.abs(adj);
                                result += " [".concat(op, " ").concat(val, "%]");
                            }
                            return result;
                        }
                        case 'percentage': {
                            // #template[-prio] <percent>% of [previous ]<category>
                            var prev = template.previous ? 'previous ' : '';
                            return "".concat(prefix, " ").concat(trimTrailingZeros(template.percent), "% of ").concat(prev).concat(template.category).trim();
                        }
                        case 'periodic': {
                            // #template[-prio] <amount> repeat every <n> <period>(s) starting <date> [limit]
                            var periodPart = periodToString(template.period);
                            var result = "".concat(prefix, " ").concat(template.amount, " repeat every ").concat(periodPart, " starting ").concat(template.starting);
                            if (template.limit) {
                                result += " ".concat(limitToString(template.limit));
                            }
                            return result;
                        }
                        case 'by':
                        case 'spend': {
                            // #template[-prio] <amount> by <month> [spend from <month>] [repeat every <...>]
                            var result = "".concat(prefix, " ").concat(template.amount, " by ").concat(template.month);
                            if (template.type === 'spend' && template.from) {
                                result += " spend from ".concat(template.from);
                            }
                            // repeat info
                            if (template.annual !== undefined) {
                                var repeatInfo = repeatToString(template.annual, template.repeat);
                                if (repeatInfo) {
                                    result += " repeat every ".concat(repeatInfo);
                                }
                            }
                            return result;
                        }
                        case 'remainder': {
                            // #template remainder [weight] [limit]
                            var result = "".concat(prefix, " remainder");
                            if (template.weight !== undefined && template.weight !== 1) {
                                result += " ".concat(template.weight);
                            }
                            if (template.limit) {
                                result += " ".concat(limitToString(template.limit));
                            }
                            return result;
                        }
                        case 'average': {
                            // #template average <numMonths> months
                            return "".concat(prefix, " average ").concat(template.numMonths, " months");
                        }
                        case 'copy': {
                            // #template copy from <lookBack> months ago [limit]
                            var result = "".concat(prefix, " copy from ").concat(template.lookBack, " months ago");
                            return result;
                        }
                        default:
                            return [];
                    }
                })
                    .join('\n')];
        });
    });
}
function limitToString(limit) {
    switch (limit.period) {
        case 'weekly': {
            // Needs start date per grammar
            var base = "up to ".concat(limit.amount, " per week starting ").concat(limit.start);
            return limit.hold ? "".concat(base, " hold") : base;
        }
        case 'daily': {
            var base = "up to ".concat(limit.amount, " per day");
            return limit.hold ? "".concat(base, " hold") : base;
        }
        case 'monthly':
        default: {
            var base = "up to ".concat(limit.amount);
            return limit.hold ? "".concat(base, " hold") : base;
        }
    }
}
function periodToString(p) {
    var period = p.period, amount = p.amount;
    if (amount === 1) {
        return period; // singular
    }
    // pluralize simple
    return "".concat(amount, " ").concat(period, "s");
}
function repeatToString(annual, repeat) {
    if (annual === undefined)
        return null;
    if (annual) {
        if (!repeat || repeat === 1)
            return 'year';
        return "".concat(repeat, " years");
    }
    // monthly
    if (!repeat || repeat === 1)
        return 'month';
    return "".concat(repeat, " months");
}
function trimTrailingZeros(n) {
    var s = n.toString();
    if (!s.includes('.'))
        return s;
    return s.replace(/\.0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
}
