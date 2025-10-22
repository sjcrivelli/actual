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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlankCategory = createBlankCategory;
exports.createCategory = createCategory;
exports.createCategoryGroup = createCategoryGroup;
exports.createSummary = createSummary;
exports.createBudget = createBudget;
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
function getBlankSheet(months) {
    var blankMonth = monthUtils.prevMonth(months[0]);
    return monthUtils.sheetForMonth(blankMonth);
}
function createBlankCategory(cat, months) {
    if (months.length > 0) {
        var sheetName = getBlankSheet(months);
        sheet.get().createStatic(sheetName, "carryover-".concat(cat.id), false);
        sheet.get().createStatic(sheetName, "leftover-".concat(cat.id), 0);
        sheet.get().createStatic(sheetName, "leftover-pos-".concat(cat.id), 0);
    }
}
function createBlankMonth(categories, sheetName, months) {
    sheet.get().createStatic(sheetName, 'is-blank', true);
    sheet.get().createStatic(sheetName, 'to-budget', 0);
    sheet.get().createStatic(sheetName, 'buffered', 0);
    categories.forEach(function (cat) { return createBlankCategory(cat, months); });
}
function createCategory(cat, sheetName, prevSheetName) {
    if (!cat.is_income) {
        sheet.get().createStatic(sheetName, "budget-".concat(cat.id), 0);
        // This makes the app more robust by "fixing up" null budget values.
        // Those should not be allowed, but in case somehow a null value
        // ends up there, we are resilient to it. Preferrably the
        // spreadsheet would have types and be more strict about what is
        // allowed to be set.
        if (sheet.get().getCellValue(sheetName, "budget-".concat(cat.id)) == null) {
            sheet.get().set((0, util_2.resolveName)(sheetName, "budget-".concat(cat.id)), 0);
        }
        sheet.get().createStatic(sheetName, "carryover-".concat(cat.id), false);
        sheet.get().createDynamic(sheetName, "leftover-".concat(cat.id), {
            initialValue: 0,
            dependencies: [
                "budget-".concat(cat.id),
                "sum-amount-".concat(cat.id),
                "".concat(prevSheetName, "!carryover-").concat(cat.id),
                "".concat(prevSheetName, "!leftover-").concat(cat.id),
                "".concat(prevSheetName, "!leftover-pos-").concat(cat.id),
            ],
            run: function (budgeted, spent, prevCarryover, prevLeftover, prevLeftoverPos) {
                return (0, util_1.safeNumber)((0, util_3.number)(budgeted) +
                    (0, util_3.number)(spent) +
                    (prevCarryover ? (0, util_3.number)(prevLeftover) : (0, util_3.number)(prevLeftoverPos)));
            },
        });
        sheet.get().createDynamic(sheetName, 'leftover-pos-' + cat.id, {
            initialValue: 0,
            dependencies: ["leftover-".concat(cat.id)],
            run: function (leftover) {
                return leftover < 0 ? 0 : leftover;
            },
        });
    }
}
function createCategoryGroup(group, sheetName) {
    sheet.get().createDynamic(sheetName, 'group-sum-amount-' + group.id, {
        initialValue: 0,
        dependencies: group.categories.map(function (cat) { return "sum-amount-".concat(cat.id); }),
        run: util_3.sumAmounts,
    });
    if (!group.is_income) {
        sheet.get().createDynamic(sheetName, 'group-budget-' + group.id, {
            initialValue: 0,
            dependencies: group.categories.map(function (cat) { return "budget-".concat(cat.id); }),
            run: util_3.sumAmounts,
        });
        sheet.get().createDynamic(sheetName, 'group-leftover-' + group.id, {
            initialValue: 0,
            dependencies: group.categories.map(function (cat) { return "leftover-".concat(cat.id); }),
            run: util_3.sumAmounts,
        });
    }
}
function createSummary(groups, categories, prevSheetName, sheetName) {
    var incomeGroup = groups.filter(function (group) { return group.is_income; })[0];
    var expenseCategories = categories.filter(function (cat) { return !cat.is_income; });
    var incomeCategories = categories.filter(function (cat) { return cat.is_income; });
    sheet.get().createStatic(sheetName, 'buffered', 0);
    sheet.get().createDynamic(sheetName, 'from-last-month', {
        initialValue: 0,
        dependencies: [
            "".concat(prevSheetName, "!to-budget"),
            "".concat(prevSheetName, "!buffered-selected"),
        ],
        run: function (toBudget, buffered) {
            return (0, util_1.safeNumber)((0, util_3.number)(toBudget) + (0, util_3.number)(buffered));
        },
    });
    // Alias the group income total to `total-income`
    sheet.get().createDynamic(sheetName, 'total-income', {
        initialValue: 0,
        dependencies: ["group-sum-amount-".concat(incomeGroup.id)],
        run: function (amount) { return amount; },
    });
    sheet.get().createDynamic(sheetName, 'available-funds', {
        initialValue: 0,
        dependencies: ['total-income', 'from-last-month'],
        run: function (income, fromLastMonth) {
            return (0, util_1.safeNumber)((0, util_3.number)(income) + (0, util_3.number)(fromLastMonth));
        },
    });
    sheet.get().createDynamic(sheetName, 'last-month-overspent', {
        initialValue: 0,
        dependencies: (0, util_3.flatten2)(expenseCategories.map(function (cat) { return [
            "".concat(prevSheetName, "!leftover-").concat(cat.id),
            "".concat(prevSheetName, "!carryover-").concat(cat.id),
        ]; })),
        run: function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            data = (0, util_3.unflatten2)(data);
            return (0, util_1.safeNumber)(data.reduce(function (total, _a) {
                var leftover = _a[0], carryover = _a[1];
                if (carryover) {
                    return total;
                }
                return total + Math.min(0, (0, util_3.number)(leftover));
            }, 0));
        },
    });
    sheet.get().createDynamic(sheetName, 'total-budgeted', {
        initialValue: 0,
        dependencies: groups
            .filter(function (group) { return !group.is_income; })
            .map(function (group) { return "group-budget-".concat(group.id); }),
        run: function () {
            var amounts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                amounts[_i] = arguments[_i];
            }
            // Negate budgeted amount
            return -util_3.sumAmounts.apply(void 0, amounts);
        },
    });
    sheet.get().createDynamic(sheetName, 'buffered', { initialValue: 0 });
    sheet.get().createDynamic(sheetName, 'buffered-auto', {
        initialValue: 0,
        dependencies: (0, util_3.flatten2)(incomeCategories.map(function (c) { return [
            "".concat(sheetName, "!sum-amount-").concat(c.id),
            "".concat(sheetName, "!carryover-").concat(c.id),
        ]; })),
        run: function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            data = (0, util_3.unflatten2)(data);
            return (0, util_1.safeNumber)(data.reduce(function (total, _a) {
                var sumAmount = _a[0], carryover = _a[1];
                if (carryover) {
                    return total + sumAmount;
                }
                return total;
            }, 0));
        },
    });
    sheet.get().createDynamic(sheetName, 'buffered-selected', {
        initialValue: 0,
        dependencies: ["".concat(sheetName, "!buffered"), "".concat(sheetName, "!buffered-auto")],
        run: function (man, auto) {
            if (man !== 0) {
                return man;
            }
            return auto;
        },
    });
    sheet.get().createDynamic(sheetName, 'to-budget', {
        initialValue: 0,
        dependencies: [
            'available-funds',
            'last-month-overspent',
            'total-budgeted',
            'buffered-selected',
        ],
        run: function (available, lastOverspent, totalBudgeted, buffered) {
            return (0, util_1.safeNumber)((0, util_3.number)(available) +
                (0, util_3.number)(lastOverspent) +
                (0, util_3.number)(totalBudgeted) -
                (0, util_3.number)(buffered));
        },
    });
    sheet.get().createDynamic(sheetName, 'total-spent', {
        initialValue: 0,
        dependencies: groups
            .filter(function (group) { return !group.is_income; })
            .map(function (group) { return "group-sum-amount-".concat(group.id); }),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'total-leftover', {
        initialValue: 0,
        dependencies: groups
            .filter(function (group) { return !group.is_income; })
            .map(function (group) { return "group-leftover-".concat(group.id); }),
        run: util_3.sumAmounts,
    });
}
function createBudget(meta, categories, months) {
    // The spreadsheet is now strict - so we need to fill in some
    // default values for the month before the first month. Only do this
    // if it doesn't already exist
    var blankSheet = getBlankSheet(months);
    if (meta.blankSheet !== blankSheet) {
        sheet.get().clearSheet(meta.blankSheet);
        createBlankMonth(categories, blankSheet, months);
        meta.blankSheet = blankSheet;
    }
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
        createBlankCategory(newValue, months);
        months.forEach(function (month) {
            var prevMonth = monthUtils.prevMonth(month);
            var prevSheetName = monthUtils.sheetForMonth(prevMonth);
            var sheetName = monthUtils.sheetForMonth(month);
            var _a = monthUtils.bounds(month), start = _a.start, end = _a.end;
            (0, base_1.createCategory)(newValue, sheetName, prevSheetName, start, end);
            var id = newValue.id;
            var groupId = newValue.cat_group;
            sheet
                .get()
                .addDependencies(sheetName, 'last-month-overspent', [
                "".concat(prevSheetName, "!leftover-").concat(id),
                "".concat(prevSheetName, "!carryover-").concat(id),
            ]);
            addDeps(sheetName, groupId, id);
            if (newValue.is_income) {
                sheet
                    .get()
                    .addDependencies(sheetName, 'buffered-auto', (0, util_3.flatten2)([
                    "".concat(sheetName, "!sum-amount-").concat(id),
                    "".concat(sheetName, "!carryover-").concat(id),
                ]));
            }
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
        var id_3 = newValue.id;
        months.forEach(function (month) {
            var sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, id_3);
        });
    }
    else if (newValue.tombstone === 0 &&
        (!oldValue || oldValue.tombstone === 1)) {
        var group_1 = newValue;
        if (!group_1.is_income) {
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
    }
}
