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
exports.CategoryTemplateContext = void 0;
// @ts-strict-ignore
var query_1 = require("loot-core/shared/query");
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
var aql_1 = require("../aql");
var db = require("../db");
var actions_1 = require("./actions");
var schedule_template_1 = require("./schedule-template");
var statements_1 = require("./statements");
var CategoryTemplateContext = /** @class */ (function () {
    function CategoryTemplateContext(templates, category, month, fromLastMonth, budgeted, hideDecimal) {
        if (hideDecimal === void 0) { hideDecimal = false; }
        var _this = this;
        this.templates = [];
        this.remainder = [];
        this.goals = [];
        this.priorities = new Set();
        this.hideDecimal = false;
        this.remainderWeight = 0;
        this.toBudgetAmount = 0; // amount that will be budgeted by the templates
        this.fullAmount = null; // the full requested amount, start null for remainder only cats
        this.isLongGoal = null; //defaulting the goals to null so templates can be unset
        this.goalAmount = null;
        this.fromLastMonth = 0; // leftover from last month
        this.limitMet = false;
        this.limitExcess = 0;
        this.limitAmount = 0;
        this.limitCheck = false;
        this.limitHold = false;
        this.previouslyBudgeted = 0;
        this.category = category;
        this.month = month;
        this.fromLastMonth = fromLastMonth;
        this.previouslyBudgeted = budgeted;
        this.hideDecimal = hideDecimal;
        // sort the template lines into regular template, goals, and remainder templates
        if (templates) {
            templates.forEach(function (t) {
                if (t.directive === 'template' &&
                    t.type !== 'remainder' &&
                    t.type !== 'limit') {
                    _this.templates.push(t);
                    if (t.priority !== null)
                        _this.priorities.add(t.priority);
                }
                else if (t.directive === 'template' && t.type === 'remainder') {
                    _this.remainder.push(t);
                    _this.remainderWeight += t.weight;
                }
                else if (t.directive === 'goal' && t.type === 'goal') {
                    _this.goals.push(t);
                }
            });
        }
        this.checkLimit(templates);
        this.checkSpend();
        this.checkGoal();
    }
    /*----------------------------------------------------------------------------
     * Using This Class:
     * 1. instantiate via `await categoryTemplate.init(templates, categoryID, month)`;
     *    templates: all templates for this category (including templates and goals)
     *    categoryID: the ID of the category that this Class will be for
     *    month: the month string of the month for templates being applied
     * 2. gather needed data for external use.  ex: remainder weights, priorities, limitExcess
     * 3. run each priority level that is needed via runTemplatesForPriority
     * 4. run the remainder templates via runRemainder()
     * 5. finish processing by running getValues() and saving values for batch processing.
     * Alternate:
     * If the situation calls for it you can run all templates in a catagory in one go using the
     * method runAll which will run all templates and goals for reference, and can optionally be saved
     */
    //-----------------------------------------------------------------------------
    // Class interface
    // set up the class and check all templates
    CategoryTemplateContext.init = function (templates, category, month, budgeted) {
        return __awaiter(this, void 0, void 0, function () {
            var lastMonthSheet, lastMonthBalance, carryover, fromLastMonth, hideDecimal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastMonthSheet = monthUtils.sheetForMonth(monthUtils.subMonths(month, 1));
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(lastMonthSheet, "leftover-".concat(category.id))];
                    case 1:
                        lastMonthBalance = _a.sent();
                        return [4 /*yield*/, (0, actions_1.getSheetBoolean)(lastMonthSheet, "carryover-".concat(category.id))];
                    case 2:
                        carryover = _a.sent();
                        if (lastMonthBalance < 0 && !carryover) {
                            fromLastMonth = 0;
                        }
                        else if (category.is_income) {
                            //for tracking budget
                            fromLastMonth = 0;
                        }
                        else {
                            fromLastMonth = lastMonthBalance;
                        }
                        // run all checks
                        return [4 /*yield*/, CategoryTemplateContext.checkByAndScheduleAndSpend(templates, month)];
                    case 3:
                        // run all checks
                        _a.sent();
                        return [4 /*yield*/, CategoryTemplateContext.checkPercentage(templates)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('preferences').filter({ id: 'hideFraction' }).select('*'))];
                    case 5:
                        hideDecimal = _a.sent();
                        // call the private constructor
                        return [2 /*return*/, new CategoryTemplateContext(templates, category, month, fromLastMonth, budgeted, hideDecimal.data.length > 0
                                ? hideDecimal.data[0].value === 'true'
                                : false)];
                }
            });
        });
    };
    CategoryTemplateContext.prototype.isGoalOnly = function () {
        // if there is only a goal
        return (this.templates.length === 0 &&
            this.remainder.length === 0 &&
            this.goals.length > 0);
    };
    CategoryTemplateContext.prototype.getPriorities = function () {
        return Array.from(this.priorities);
    };
    CategoryTemplateContext.prototype.hasRemainder = function () {
        return this.remainderWeight > 0 && !this.limitMet;
    };
    CategoryTemplateContext.prototype.getRemainderWeight = function () {
        return this.remainderWeight;
    };
    CategoryTemplateContext.prototype.getLimitExcess = function () {
        return this.limitExcess;
    };
    // what is the full requested amount this month
    CategoryTemplateContext.prototype.runAll = function (available) {
        return __awaiter(this, void 0, void 0, function () {
            var toBudget, prioritiesSorted, i, p, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        toBudget = 0;
                        prioritiesSorted = new Int32Array(__spreadArray([], this.getPriorities(), true).sort());
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < prioritiesSorted.length)) return [3 /*break*/, 4];
                        p = prioritiesSorted[i];
                        _a = toBudget;
                        return [4 /*yield*/, this.runTemplatesForPriority(p, available, available)];
                    case 2:
                        toBudget = _a + _b.sent();
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, toBudget];
                }
            });
        });
    };
    // run all templates in a given priority level
    // return: amount budgeted in this priority level
    CategoryTemplateContext.prototype.runTemplatesForPriority = function (priority, budgetAvail, availStart) {
        return __awaiter(this, void 0, void 0, function () {
            var t, available, toBudget, byFlag, remainder, scheduleFlag, _i, t_1, template, newBudget, _a, budgeted, ret, orig;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.priorities.has(priority))
                            return [2 /*return*/, 0];
                        if (this.limitMet)
                            return [2 /*return*/, 0];
                        t = this.templates.filter(function (t) { return t.directive === 'template' && t.priority === priority; });
                        available = budgetAvail || 0;
                        toBudget = 0;
                        byFlag = false;
                        remainder = 0;
                        scheduleFlag = false;
                        _i = 0, t_1 = t;
                        _b.label = 1;
                    case 1:
                        if (!(_i < t_1.length)) return [3 /*break*/, 18];
                        template = t_1[_i];
                        newBudget = 0;
                        _a = template.type;
                        switch (_a) {
                            case 'simple': return [3 /*break*/, 2];
                            case 'copy': return [3 /*break*/, 3];
                            case 'periodic': return [3 /*break*/, 5];
                            case 'spend': return [3 /*break*/, 6];
                            case 'percentage': return [3 /*break*/, 8];
                            case 'by': return [3 /*break*/, 10];
                            case 'schedule': return [3 /*break*/, 11];
                            case 'average': return [3 /*break*/, 14];
                        }
                        return [3 /*break*/, 16];
                    case 2:
                        {
                            newBudget = CategoryTemplateContext.runSimple(template, this.limitAmount);
                            return [3 /*break*/, 16];
                        }
                        _b.label = 3;
                    case 3: return [4 /*yield*/, CategoryTemplateContext.runCopy(template, this)];
                    case 4:
                        newBudget = _b.sent();
                        return [3 /*break*/, 16];
                    case 5:
                        {
                            newBudget = CategoryTemplateContext.runPeriodic(template, this);
                            return [3 /*break*/, 16];
                        }
                        _b.label = 6;
                    case 6: return [4 /*yield*/, CategoryTemplateContext.runSpend(template, this)];
                    case 7:
                        newBudget = _b.sent();
                        return [3 /*break*/, 16];
                    case 8: return [4 /*yield*/, CategoryTemplateContext.runPercentage(template, availStart, this)];
                    case 9:
                        newBudget = _b.sent();
                        return [3 /*break*/, 16];
                    case 10:
                        {
                            // all by's get run at once
                            if (!byFlag) {
                                newBudget = CategoryTemplateContext.runBy(this);
                            }
                            else {
                                newBudget = 0;
                            }
                            byFlag = true;
                            return [3 /*break*/, 16];
                        }
                        _b.label = 11;
                    case 11:
                        if (!!scheduleFlag) return [3 /*break*/, 13];
                        budgeted = this.fromLastMonth + toBudget;
                        return [4 /*yield*/, (0, schedule_template_1.runSchedule)(t, this.month, budgeted, remainder, this.fromLastMonth, toBudget, [], this.category)];
                    case 12:
                        ret = _b.sent();
                        // Schedules assume that its to budget value is the whole thing so this
                        // needs to remove the previous funds so they aren't double counted
                        newBudget = ret.to_budget - toBudget;
                        remainder = ret.remainder;
                        scheduleFlag = true;
                        _b.label = 13;
                    case 13: return [3 /*break*/, 16];
                    case 14: return [4 /*yield*/, CategoryTemplateContext.runAverage(template, this)];
                    case 15:
                        newBudget = _b.sent();
                        return [3 /*break*/, 16];
                    case 16:
                        available = available - newBudget;
                        toBudget += newBudget;
                        _b.label = 17;
                    case 17:
                        _i++;
                        return [3 /*break*/, 1];
                    case 18:
                        //check limit
                        if (this.limitCheck) {
                            if (toBudget + this.toBudgetAmount + this.fromLastMonth >=
                                this.limitAmount) {
                                orig = toBudget;
                                toBudget = this.limitAmount - this.toBudgetAmount - this.fromLastMonth;
                                this.limitMet = true;
                                available = available + orig - toBudget;
                            }
                        }
                        //round all budget values if needed
                        if (this.hideDecimal)
                            toBudget = this.removeFraction(toBudget);
                        // don't overbudget when using a priority unless income category
                        if (priority > 0 && available < 0 && !this.category.is_income) {
                            this.fullAmount += toBudget;
                            toBudget = Math.max(0, toBudget + available);
                            this.toBudgetAmount += toBudget;
                        }
                        else {
                            this.fullAmount += toBudget;
                            this.toBudgetAmount += toBudget;
                        }
                        return [2 /*return*/, this.category.is_income ? -toBudget : toBudget];
                }
            });
        });
    };
    CategoryTemplateContext.prototype.runRemainder = function (budgetAvail, perWeight) {
        if (this.remainder.length === 0)
            return 0;
        var toBudget = Math.round(this.remainderWeight * perWeight);
        var smallest = 1;
        if (this.hideDecimal) {
            // handle hideDecimal
            toBudget = this.removeFraction(toBudget);
            smallest = 100;
        }
        //check possible overbudget from rounding, 1cent leftover
        if (toBudget > budgetAvail || budgetAvail - toBudget <= smallest) {
            toBudget = budgetAvail;
        }
        if (this.limitCheck) {
            if (toBudget + this.toBudgetAmount + this.fromLastMonth >=
                this.limitAmount) {
                toBudget = this.limitAmount - this.toBudgetAmount - this.fromLastMonth;
                this.limitMet = true;
            }
        }
        this.toBudgetAmount += toBudget;
        return toBudget;
    };
    CategoryTemplateContext.prototype.getValues = function () {
        this.runGoal();
        return {
            budgeted: this.toBudgetAmount,
            goal: this.goalAmount,
            longGoal: this.isLongGoal,
        };
    };
    CategoryTemplateContext.prototype.runGoal = function () {
        if (this.goals.length > 0) {
            if (this.isGoalOnly())
                this.toBudgetAmount = this.previouslyBudgeted;
            this.isLongGoal = true;
            this.goalAmount = (0, util_1.amountToInteger)(this.goals[0].amount);
            return;
        }
        this.goalAmount = this.fullAmount;
    };
    //-----------------------------------------------------------------------------
    //  Template Validation
    CategoryTemplateContext.checkByAndScheduleAndSpend = function (templates, month) {
        return __awaiter(this, void 0, void 0, function () {
            var scheduleNames, lowestPriority;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (templates.filter(function (t) { return t.type === 'schedule' || t.type === 'by'; }).length ===
                            0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, statements_1.getActiveSchedules)()];
                    case 1:
                        scheduleNames = (_a.sent()).map(function (_a) {
                            var name = _a.name;
                            return name.trim();
                        });
                        templates
                            .filter(function (t) { return t.type === 'schedule'; })
                            .forEach(function (t) {
                            if (!scheduleNames.includes(t.name.trim())) {
                                throw new Error("Schedule ".concat(t.name.trim(), " does not exist"));
                            }
                        });
                        lowestPriority = Math.min.apply(Math, templates
                            .filter(function (t) { return t.type === 'schedule' || t.type === 'by'; })
                            .map(function (t) { return t.priority; }));
                        //warn if priority needs fixed
                        templates
                            .filter(function (t) { return t.type === 'schedule' || t.type === 'by'; })
                            .forEach(function (t) {
                            if (t.priority !== lowestPriority) {
                                throw new Error("Schedule and By templates must be the same priority level. Fix by setting all Schedule and By templates to priority level ".concat(lowestPriority));
                                //t.priority = lowestPriority;
                            }
                        });
                        // check if the target date is past and not repeating
                        templates
                            .filter(function (t) { return t.type === 'by' || t.type === 'spend'; })
                            .forEach(function (t) {
                            var range = monthUtils.differenceInCalendarMonths("".concat(t.month), month);
                            if (range < 0 && !(t.repeat || t.annual)) {
                                throw new Error("Target month has passed, remove or update the target month");
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CategoryTemplateContext.checkPercentage = function (templates) {
        return __awaiter(this, void 0, void 0, function () {
            var pt, reqCategories, availCategories, availNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pt = templates.filter(function (t) { return t.type === 'percentage'; });
                        if (pt.length === 0)
                            return [2 /*return*/];
                        reqCategories = pt.map(function (t) { return t.category.toLowerCase(); });
                        return [4 /*yield*/, db.getCategories()];
                    case 1:
                        availCategories = _a.sent();
                        availNames = availCategories
                            .filter(function (c) { return c.is_income; })
                            .map(function (c) { return c.name.toLocaleLowerCase(); });
                        reqCategories.forEach(function (n) {
                            if (n === 'available funds' || n === 'all income') {
                                //skip the name check since these are special
                            }
                            else if (!availNames.includes(n)) {
                                throw new Error("Category \"".concat(n, "\" is not found in available income categories"));
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    CategoryTemplateContext.prototype.checkLimit = function (templates) {
        for (var _i = 0, _a = templates.filter(function (t) {
            return t.type === 'simple' ||
                t.type === 'periodic' ||
                t.type === 'limit' ||
                t.type === 'remainder';
        }); _i < _a.length; _i++) {
            var template = _a[_i];
            var limitDef = void 0;
            if (template.type === 'limit') {
                limitDef = template;
            }
            else {
                if (template.limit) {
                    limitDef = template.limit;
                }
                else {
                    continue; // may not have a limit defined in the template
                }
            }
            if (this.limitCheck) {
                throw new Error('Only one `up to` allowed per category');
            }
            if (limitDef.period === 'daily') {
                var numDays = monthUtils.differenceInCalendarDays(monthUtils.addMonths(this.month, 1), this.month);
                this.limitAmount += (0, util_1.amountToInteger)(limitDef.amount) * numDays;
            }
            else if (limitDef.period === 'weekly') {
                var nextMonth = monthUtils.nextMonth(this.month);
                var week = limitDef.start;
                var baseLimit = (0, util_1.amountToInteger)(limitDef.amount);
                while (week < nextMonth) {
                    if (week >= this.month) {
                        this.limitAmount += baseLimit;
                    }
                    week = monthUtils.addWeeks(week, 1);
                }
            }
            else if (limitDef.period === 'monthly') {
                this.limitAmount = (0, util_1.amountToInteger)(limitDef.amount);
            }
            else {
                throw new Error('Invalid limit period. Check template syntax');
            }
            //amount is good save the rest
            this.limitCheck = true;
            this.limitHold = limitDef.hold ? true : false;
            // check if the limit is already met and save the excess
            if (this.fromLastMonth >= this.limitAmount) {
                this.limitMet = true;
                if (this.limitHold) {
                    this.limitExcess = 0;
                    this.toBudgetAmount = 0;
                    this.fullAmount = 0;
                }
                else {
                    this.limitExcess = this.fromLastMonth - this.limitAmount;
                    this.toBudgetAmount = -this.limitExcess;
                    this.fullAmount = -this.limitExcess;
                }
            }
        }
    };
    CategoryTemplateContext.prototype.checkSpend = function () {
        var st = this.templates.filter(function (t) { return t.type === 'spend'; });
        if (st.length > 1) {
            throw new Error('Only one spend template is allowed per category');
        }
    };
    CategoryTemplateContext.prototype.checkGoal = function () {
        if (this.goals.length > 1) {
            throw new Error("Only one #goal is allowed per category");
        }
    };
    CategoryTemplateContext.prototype.removeFraction = function (amount) {
        return (0, util_1.amountToInteger)(Math.round((0, util_1.integerToAmount)(amount)));
    };
    //-----------------------------------------------------------------------------
    //  Processor Functions
    CategoryTemplateContext.runSimple = function (template, limit) {
        if (template.monthly != null) {
            return (0, util_1.amountToInteger)(template.monthly);
        }
        else {
            return limit;
        }
    };
    CategoryTemplateContext.runCopy = function (template, templateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var sheetName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sheetName = monthUtils.sheetForMonth(monthUtils.subMonths(templateContext.month, template.lookBack));
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(templateContext.category.id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CategoryTemplateContext.runPeriodic = function (template, templateContext) {
        var toBudget = 0;
        var amount = (0, util_1.amountToInteger)(template.amount);
        var period = template.period.period;
        var numPeriods = template.period.amount;
        var date = template.starting;
        var dateShiftFunction;
        switch (period) {
            case 'day':
                dateShiftFunction = monthUtils.addDays;
                break;
            case 'week':
                dateShiftFunction = monthUtils.addWeeks;
                break;
            case 'month':
                dateShiftFunction = monthUtils.addMonths;
                break;
            case 'year':
                // the addYears function doesn't return the month number, so use addMonths
                dateShiftFunction = function (date, numPeriods) {
                    return monthUtils.addMonths(date, numPeriods * 12);
                };
                break;
        }
        //shift the starting date until its in our month or in the future
        while (templateContext.month > date) {
            date = dateShiftFunction(date, numPeriods);
        }
        if (monthUtils.differenceInCalendarMonths(templateContext.month, date) < 0) {
            return 0;
        } // nothing needed this month
        var nextMonth = monthUtils.addMonths(templateContext.month, 1);
        while (date < nextMonth) {
            toBudget += amount;
            date = dateShiftFunction(date, numPeriods);
        }
        return toBudget;
    };
    CategoryTemplateContext.runSpend = function (template, templateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var fromMonth, toMonth, alreadyBudgeted, firstMonth, repeat, m, m_1, sheetName, spent, balance, _a, numMonths, target;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fromMonth = "".concat(template.from);
                        toMonth = "".concat(template.month);
                        alreadyBudgeted = templateContext.fromLastMonth;
                        firstMonth = true;
                        repeat = template.annual
                            ? (template.repeat || 1) * 12
                            : template.repeat;
                        m = monthUtils.differenceInCalendarMonths(toMonth, templateContext.month);
                        if (repeat && m < 0) {
                            while (m < 0) {
                                toMonth = monthUtils.addMonths(toMonth, repeat);
                                fromMonth = monthUtils.addMonths(fromMonth, repeat);
                                m = monthUtils.differenceInCalendarMonths(toMonth, templateContext.month);
                            }
                        }
                        m_1 = fromMonth;
                        _b.label = 1;
                    case 1:
                        if (!(monthUtils.differenceInCalendarMonths(templateContext.month, m_1) > 0)) return [3 /*break*/, 7];
                        sheetName = monthUtils.sheetForMonth(m_1);
                        if (!firstMonth) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "sum-amount-".concat(templateContext.category.id))];
                    case 2:
                        spent = _b.sent();
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "leftover-".concat(templateContext.category.id))];
                    case 3:
                        balance = _b.sent();
                        alreadyBudgeted = balance - spent;
                        firstMonth = false;
                        return [3 /*break*/, 6];
                    case 4:
                        _a = alreadyBudgeted;
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "budget-".concat(templateContext.category.id))];
                    case 5:
                        alreadyBudgeted = _a + _b.sent();
                        _b.label = 6;
                    case 6:
                        m_1 = monthUtils.addMonths(m_1, 1);
                        return [3 /*break*/, 1];
                    case 7:
                        numMonths = monthUtils.differenceInCalendarMonths(toMonth, templateContext.month);
                        target = (0, util_1.amountToInteger)(template.amount);
                        if (numMonths < 0) {
                            return [2 /*return*/, 0];
                        }
                        else {
                            return [2 /*return*/, Math.round((target - alreadyBudgeted) / (numMonths + 1))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CategoryTemplateContext.runPercentage = function (template, availableFunds, templateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var percent, cat, prev, sheetName, monthlyIncome, incomeCat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        percent = template.percent;
                        cat = template.category.toLowerCase();
                        prev = template.previous;
                        monthlyIncome = 1;
                        //choose the sheet to find income for
                        if (prev) {
                            sheetName = monthUtils.sheetForMonth(monthUtils.subMonths(templateContext.month, 1));
                        }
                        else {
                            sheetName = monthUtils.sheetForMonth(templateContext.month);
                        }
                        if (!(cat === 'all income')) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "total-income")];
                    case 1:
                        monthlyIncome = _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(cat === 'available funds')) return [3 /*break*/, 3];
                        monthlyIncome = availableFunds;
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, db.getCategories()];
                    case 4:
                        incomeCat = (_a.sent()).find(function (c) { return c.is_income && c.name.toLowerCase() === cat; });
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "sum-amount-".concat(incomeCat.id))];
                    case 5:
                        monthlyIncome = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, Math.max(0, Math.round(monthlyIncome * (percent / 100)))];
                }
            });
        });
    };
    CategoryTemplateContext.runAverage = function (template, templateContext) {
        return __awaiter(this, void 0, void 0, function () {
            var sum, i, sheetName, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sum = 0;
                        i = 1;
                        _b.label = 1;
                    case 1:
                        if (!(i <= template.numMonths)) return [3 /*break*/, 4];
                        sheetName = monthUtils.sheetForMonth(monthUtils.subMonths(templateContext.month, i));
                        _a = sum;
                        return [4 /*yield*/, (0, actions_1.getSheetValue)(sheetName, "sum-amount-".concat(templateContext.category.id))];
                    case 2:
                        sum = _a + _b.sent();
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, -Math.round(sum / template.numMonths)];
                }
            });
        });
    };
    CategoryTemplateContext.runBy = function (templateContext) {
        var byTemplates = templateContext.templates.filter(function (t) { return t.type === 'by'; });
        var savedInfo = [];
        var totalNeeded = 0;
        var shortNumMonths;
        //find shortest time period
        for (var i = 0; i < byTemplates.length; i++) {
            var template = byTemplates[i];
            var targetMonth = "".concat(template.month);
            var period = template.annual
                ? (template.repeat || 1) * 12
                : template.repeat != null
                    ? template.repeat
                    : null;
            var numMonths = monthUtils.differenceInCalendarMonths(targetMonth, templateContext.month);
            while (numMonths < 0 && period) {
                targetMonth = monthUtils.addMonths(targetMonth, period);
                numMonths = monthUtils.differenceInCalendarMonths(targetMonth, templateContext.month);
            }
            savedInfo.push({ numMonths: numMonths, period: period });
            if (numMonths < shortNumMonths || shortNumMonths === undefined) {
                shortNumMonths = numMonths;
            }
        }
        // calculate needed funds per template
        for (var i = 0; i < byTemplates.length; i++) {
            var template = byTemplates[i];
            var numMonths = savedInfo[i].numMonths;
            var period = savedInfo[i].period;
            var amount = void 0;
            // back interpolate what is needed in the short window
            if (numMonths > shortNumMonths && period) {
                amount = Math.round(((0, util_1.amountToInteger)(template.amount) / period) *
                    (period - numMonths + shortNumMonths));
                // fallback to this.  This matches what the prior math accomplished, just more round about
            }
            else if (numMonths > shortNumMonths) {
                amount = Math.round(((0, util_1.amountToInteger)(template.amount) / (numMonths + 1)) *
                    (shortNumMonths + 1));
            }
            else {
                amount = (0, util_1.amountToInteger)(template.amount);
            }
            totalNeeded += amount;
        }
        return Math.round((totalNeeded - templateContext.fromLastMonth) / (shortNumMonths + 1));
    };
    return CategoryTemplateContext;
}());
exports.CategoryTemplateContext = CategoryTemplateContext;
