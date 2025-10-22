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
exports.createCategory = createCategory;
exports.createCategoryGroup = createCategoryGroup;
exports.createSummary = createSummary;
exports.handleCategoryChange = handleCategoryChange;
exports.handleCategoryGroupChange = handleCategoryGroupChange;
// @ts-strict-ignore
var monthUtils = require("../../shared/months");
var util_1 = require("../../shared/util");
var db = require("../db");
var sheet = require("../sheet");
var util_2 = require("../spreadsheet/util");
var base_1 = require("./base");
var util_3 = require("./util");
function createCategory(cat, sheetName, prevSheetName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            sheet.get().createStatic(sheetName, "budget-".concat(cat.id), 0);
            // This makes the app more robust by "fixing up" null budget values.
            // Those should not be allowed, but in case somehow a null value
            // ends up there, we are resilient to it. Preferrably the
            // spreadsheet would have types and be more strict about what is
            // allowed to be set.
            if (sheet.get().getCellValue(sheetName, "budget-".concat(cat.id)) == null) {
                sheet.get().set((0, util_2.resolveName)(sheetName, "budget-".concat(cat.id)), 0);
            }
            sheet.get().createDynamic(sheetName, "leftover-".concat(cat.id), {
                initialValue: 0,
                dependencies: [
                    "budget-".concat(cat.id),
                    "sum-amount-".concat(cat.id),
                    "".concat(prevSheetName, "!carryover-").concat(cat.id),
                    "".concat(prevSheetName, "!leftover-").concat(cat.id),
                ],
                run: function (budgeted, sumAmount, prevCarryover, prevLeftover) {
                    if (cat.is_income) {
                        return (0, util_1.safeNumber)((0, util_3.number)(budgeted) -
                            (0, util_3.number)(sumAmount) +
                            (prevCarryover ? (0, util_3.number)(prevLeftover) : 0));
                    }
                    return (0, util_1.safeNumber)((0, util_3.number)(budgeted) +
                        (0, util_3.number)(sumAmount) +
                        (prevCarryover ? (0, util_3.number)(prevLeftover) : 0));
                },
            });
            sheet.get().createDynamic(sheetName, "spent-with-carryover-".concat(cat.id), {
                initialValue: 0,
                dependencies: [
                    "budget-".concat(cat.id),
                    "sum-amount-".concat(cat.id),
                    "carryover-".concat(cat.id),
                ],
                // TODO: Why refresh??
                refresh: true,
                run: function (budgeted, sumAmount, carryover) {
                    return carryover
                        ? Math.max(0, (0, util_1.safeNumber)((0, util_3.number)(budgeted) + (0, util_3.number)(sumAmount)))
                        : sumAmount;
                },
            });
            sheet.get().createStatic(sheetName, "carryover-".concat(cat.id), false);
            return [2 /*return*/];
        });
    });
}
function createCategoryGroup(group, sheetName) {
    // different sum amount dependencies
    sheet.get().createDynamic(sheetName, 'group-sum-amount-' + group.id, {
        initialValue: 0,
        dependencies: group.categories
            .filter(function (cat) { return !cat.hidden; })
            .map(function (cat) { return "sum-amount-".concat(cat.id); }),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'group-budget-' + group.id, {
        initialValue: 0,
        dependencies: group.categories
            .filter(function (cat) { return !cat.hidden; })
            .map(function (cat) { return "budget-".concat(cat.id); }),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'group-leftover-' + group.id, {
        initialValue: 0,
        dependencies: group.categories
            .filter(function (cat) { return !cat.hidden; })
            .map(function (cat) { return "leftover-".concat(cat.id); }),
        run: util_3.sumAmounts,
    });
}
function createSummary(groups, sheetName) {
    var incomeGroup = groups.filter(function (group) { return group.is_income; })[0];
    var expenseGroups = groups.filter(function (group) { return !group.is_income && !group.hidden; });
    sheet.get().createDynamic(sheetName, 'total-budgeted', {
        initialValue: 0,
        dependencies: expenseGroups.map(function (group) { return "group-budget-".concat(group.id); }),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'total-spent', {
        initialValue: 0,
        refresh: true,
        dependencies: expenseGroups.map(function (group) { return "group-sum-amount-".concat(group.id); }),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'total-income', {
        initialValue: 0,
        dependencies: ["group-sum-amount-".concat(incomeGroup.id)],
        run: function (amount) { return amount; },
    });
    sheet.get().createDynamic(sheetName, 'total-leftover', {
        initialValue: 0,
        dependencies: expenseGroups.map(function (g) { return "group-leftover-".concat(g.id); }),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'total-budget-income', {
        initialValue: 0,
        dependencies: ["group-budget-".concat(incomeGroup.id)],
        run: function (amount) { return amount; },
    });
    sheet.get().createDynamic(sheetName, 'total-saved', {
        initialValue: 0,
        dependencies: ['total-budget-income', 'total-budgeted'],
        run: function (income, budgeted) {
            return income - budgeted;
        },
    });
    sheet.get().createDynamic(sheetName, 'real-saved', {
        initialValue: 0,
        dependencies: ['total-income', 'total-spent'],
        run: function (income, spent) {
            return (0, util_1.safeNumber)(income - -spent);
        },
    });
}
function handleCategoryChange(months, oldValue, newValue) {
    function addDeps(sheetName, groupId, catId) {
        sheet
            .get()
            .addDependencies(sheetName, "group-sum-amount-".concat(groupId), [
            "sum-amount-".concat(catId),
        ]);
        sheet
            .get()
            .addDependencies(sheetName, "group-budget-".concat(groupId), [
            "budget-".concat(catId),
        ]);
        sheet
            .get()
            .addDependencies(sheetName, "group-leftover-".concat(groupId), [
            "leftover-".concat(catId),
        ]);
    }
    function removeDeps(sheetName, groupId, catId) {
        sheet
            .get()
            .removeDependencies(sheetName, "group-sum-amount-".concat(groupId), [
            "sum-amount-".concat(catId),
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, "group-budget-".concat(groupId), [
            "budget-".concat(catId),
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, "group-leftover-".concat(groupId), [
            "leftover-".concat(catId),
        ]);
    }
    if (oldValue && oldValue.tombstone === 0 && newValue.tombstone === 1) {
        var id_1 = newValue.id;
        var groupId_1 = newValue.cat_group;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, groupId_1, id_1);
        });
    }
    else if (newValue.tombstone === 0 &&
        (!oldValue || oldValue.tombstone === 1)) {
        months.forEach(function (month) {
            var prevMonth = monthUtils.prevMonth(month);
            var prevSheetName = monthUtils.sheetForMonth(prevMonth);
            var sheetName = monthUtils.sheetForMonth(month);
            var _a = monthUtils.bounds(month), start = _a.start, end = _a.end;
            (0, base_1.createCategory)(newValue, sheetName, prevSheetName, start, end);
            var id = newValue.id;
            var groupId = newValue.cat_group;
            addDeps(sheetName, groupId, id);
        });
    }
    else if (oldValue && oldValue.cat_group !== newValue.cat_group) {
        // The category moved so we need to update the dependencies
        var id_2 = newValue.id;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, oldValue.cat_group, id_2);
            addDeps(sheetName, newValue.cat_group, id_2);
        });
    }
    else if (oldValue && oldValue.hidden !== newValue.hidden) {
        var id_3 = newValue.id;
        var groupId_2 = newValue.cat_group;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            if (newValue.hidden) {
                removeDeps(sheetName, groupId_2, id_3);
            }
            else {
                addDeps(sheetName, groupId_2, id_3);
            }
        });
    }
}
function handleCategoryGroupChange(months, oldValue, newValue) {
    function addDeps(sheetName, groupId) {
        sheet
            .get()
            .addDependencies(sheetName, 'total-budgeted', [
            "group-budget-".concat(groupId),
        ]);
        sheet
            .get()
            .addDependencies(sheetName, 'total-spent', [
            "group-sum-amount-".concat(groupId),
        ]);
        sheet
            .get()
            .addDependencies(sheetName, 'total-leftover', [
            "group-leftover-".concat(groupId),
        ]);
    }
    function removeDeps(sheetName, groupId) {
        sheet
            .get()
            .removeDependencies(sheetName, 'total-budgeted', [
            "group-budget-".concat(groupId),
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, 'total-spent', [
            "group-sum-amount-".concat(groupId),
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, 'total-leftover', [
            "group-leftover-".concat(groupId),
        ]);
    }
    if (newValue.tombstone === 1 && oldValue && oldValue.tombstone === 0) {
        var id_4 = newValue.id;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, id_4);
        });
    }
    else if (newValue.tombstone === 0 &&
        (!oldValue || oldValue.tombstone === 1)) {
        var group_1 = newValue;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            // Dirty, dirty hack. These functions should not be async, but this is
            // OK because we're leveraging the sync nature of queries. Ideally we
            // wouldn't be querying here. But I think we have to. At least for now
            // we do
            var categories = db.runQuery('SELECT * FROM categories WHERE tombstone = 0 AND cat_group = ?', [group_1.id], true);
            createCategoryGroup(__assign(__assign({}, group_1), { categories: categories }), sheetName);
            addDeps(sheetName, group_1.id);
        });
    }
    else if (oldValue && oldValue.hidden !== newValue.hidden) {
        var group_2 = newValue;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            if (newValue.hidden) {
                removeDeps(sheetName, group_2.id);
            }
            else {
                addDeps(sheetName, group_2.id);
            }
        });
    }
}
