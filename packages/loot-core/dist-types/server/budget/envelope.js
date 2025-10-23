"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlankCategory = createBlankCategory;
exports.createCategory = createCategory;
exports.createCategoryGroup = createCategoryGroup;
exports.createSummary = createSummary;
exports.createBudget = createBudget;
exports.handleCategoryChange = handleCategoryChange;
exports.handleCategoryGroupChange = handleCategoryGroupChange;
// @ts-strict-ignore
const monthUtils = __importStar(require("../../shared/months"));
const util_1 = require("../../shared/util");
const db = __importStar(require("../db"));
const sheet = __importStar(require("../sheet"));
const util_2 = require("../spreadsheet/util");
const base_1 = require("./base");
const util_3 = require("./util");
function getBlankSheet(months) {
    const blankMonth = monthUtils.prevMonth(months[0]);
    return monthUtils.sheetForMonth(blankMonth);
}
function createBlankCategory(cat, months) {
    if (months.length > 0) {
        const sheetName = getBlankSheet(months);
        sheet.get().createStatic(sheetName, `carryover-${cat.id}`, false);
        sheet.get().createStatic(sheetName, `leftover-${cat.id}`, 0);
        sheet.get().createStatic(sheetName, `leftover-pos-${cat.id}`, 0);
    }
}
function createBlankMonth(categories, sheetName, months) {
    sheet.get().createStatic(sheetName, 'is-blank', true);
    sheet.get().createStatic(sheetName, 'to-budget', 0);
    sheet.get().createStatic(sheetName, 'buffered', 0);
    categories.forEach(cat => createBlankCategory(cat, months));
}
function createCategory(cat, sheetName, prevSheetName) {
    if (!cat.is_income) {
        sheet.get().createStatic(sheetName, `budget-${cat.id}`, 0);
        // This makes the app more robust by "fixing up" null budget values.
        // Those should not be allowed, but in case somehow a null value
        // ends up there, we are resilient to it. Preferrably the
        // spreadsheet would have types and be more strict about what is
        // allowed to be set.
        if (sheet.get().getCellValue(sheetName, `budget-${cat.id}`) == null) {
            sheet.get().set((0, util_2.resolveName)(sheetName, `budget-${cat.id}`), 0);
        }
        sheet.get().createStatic(sheetName, `carryover-${cat.id}`, false);
        sheet.get().createDynamic(sheetName, `leftover-${cat.id}`, {
            initialValue: 0,
            dependencies: [
                `budget-${cat.id}`,
                `sum-amount-${cat.id}`,
                `${prevSheetName}!carryover-${cat.id}`,
                `${prevSheetName}!leftover-${cat.id}`,
                `${prevSheetName}!leftover-pos-${cat.id}`,
            ],
            run: (budgeted, spent, prevCarryover, prevLeftover, prevLeftoverPos) => {
                return (0, util_1.safeNumber)((0, util_3.number)(budgeted) +
                    (0, util_3.number)(spent) +
                    (prevCarryover ? (0, util_3.number)(prevLeftover) : (0, util_3.number)(prevLeftoverPos)));
            },
        });
        sheet.get().createDynamic(sheetName, 'leftover-pos-' + cat.id, {
            initialValue: 0,
            dependencies: [`leftover-${cat.id}`],
            run: leftover => {
                return leftover < 0 ? 0 : leftover;
            },
        });
    }
}
function createCategoryGroup(group, sheetName) {
    sheet.get().createDynamic(sheetName, 'group-sum-amount-' + group.id, {
        initialValue: 0,
        dependencies: group.categories.map(cat => `sum-amount-${cat.id}`),
        run: util_3.sumAmounts,
    });
    if (!group.is_income) {
        sheet.get().createDynamic(sheetName, 'group-budget-' + group.id, {
            initialValue: 0,
            dependencies: group.categories.map(cat => `budget-${cat.id}`),
            run: util_3.sumAmounts,
        });
        sheet.get().createDynamic(sheetName, 'group-leftover-' + group.id, {
            initialValue: 0,
            dependencies: group.categories.map(cat => `leftover-${cat.id}`),
            run: util_3.sumAmounts,
        });
    }
}
function createSummary(groups, categories, prevSheetName, sheetName) {
    const incomeGroup = groups.filter(group => group.is_income)[0];
    const expenseCategories = categories.filter(cat => !cat.is_income);
    const incomeCategories = categories.filter(cat => cat.is_income);
    sheet.get().createStatic(sheetName, 'buffered', 0);
    sheet.get().createDynamic(sheetName, 'from-last-month', {
        initialValue: 0,
        dependencies: [
            `${prevSheetName}!to-budget`,
            `${prevSheetName}!buffered-selected`,
        ],
        run: (toBudget, buffered) => (0, util_1.safeNumber)((0, util_3.number)(toBudget) + (0, util_3.number)(buffered)),
    });
    // Alias the group income total to `total-income`
    sheet.get().createDynamic(sheetName, 'total-income', {
        initialValue: 0,
        dependencies: [`group-sum-amount-${incomeGroup.id}`],
        run: amount => amount,
    });
    sheet.get().createDynamic(sheetName, 'available-funds', {
        initialValue: 0,
        dependencies: ['total-income', 'from-last-month'],
        run: (income, fromLastMonth) => (0, util_1.safeNumber)((0, util_3.number)(income) + (0, util_3.number)(fromLastMonth)),
    });
    sheet.get().createDynamic(sheetName, 'last-month-overspent', {
        initialValue: 0,
        dependencies: (0, util_3.flatten2)(expenseCategories.map(cat => [
            `${prevSheetName}!leftover-${cat.id}`,
            `${prevSheetName}!carryover-${cat.id}`,
        ])),
        run: (...data) => {
            data = (0, util_3.unflatten2)(data);
            return (0, util_1.safeNumber)(data.reduce((total, [leftover, carryover]) => {
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
            .filter(group => !group.is_income)
            .map(group => `group-budget-${group.id}`),
        run: (...amounts) => {
            // Negate budgeted amount
            return -(0, util_3.sumAmounts)(...amounts);
        },
    });
    sheet.get().createDynamic(sheetName, 'buffered', { initialValue: 0 });
    sheet.get().createDynamic(sheetName, 'buffered-auto', {
        initialValue: 0,
        dependencies: (0, util_3.flatten2)(incomeCategories.map(c => [
            `${sheetName}!sum-amount-${c.id}`,
            `${sheetName}!carryover-${c.id}`,
        ])),
        run: (...data) => {
            data = (0, util_3.unflatten2)(data);
            return (0, util_1.safeNumber)(data.reduce((total, [sumAmount, carryover]) => {
                if (carryover) {
                    return total + sumAmount;
                }
                return total;
            }, 0));
        },
    });
    sheet.get().createDynamic(sheetName, 'buffered-selected', {
        initialValue: 0,
        dependencies: [`${sheetName}!buffered`, `${sheetName}!buffered-auto`],
        run: (man, auto) => {
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
        run: (available, lastOverspent, totalBudgeted, buffered) => {
            return (0, util_1.safeNumber)((0, util_3.number)(available) +
                (0, util_3.number)(lastOverspent) +
                (0, util_3.number)(totalBudgeted) -
                (0, util_3.number)(buffered));
        },
    });
    sheet.get().createDynamic(sheetName, 'total-spent', {
        initialValue: 0,
        dependencies: groups
            .filter(group => !group.is_income)
            .map(group => `group-sum-amount-${group.id}`),
        run: util_3.sumAmounts,
    });
    sheet.get().createDynamic(sheetName, 'total-leftover', {
        initialValue: 0,
        dependencies: groups
            .filter(group => !group.is_income)
            .map(group => `group-leftover-${group.id}`),
        run: util_3.sumAmounts,
    });
}
function createBudget(meta, categories, months) {
    // The spreadsheet is now strict - so we need to fill in some
    // default values for the month before the first month. Only do this
    // if it doesn't already exist
    const blankSheet = getBlankSheet(months);
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
            .addDependencies(sheetName, `group-sum-amount-${groupId}`, [
            `sum-amount-${catId}`,
        ]);
        sheet
            .get()
            .addDependencies(sheetName, `group-budget-${groupId}`, [
            `budget-${catId}`,
        ]);
        sheet
            .get()
            .addDependencies(sheetName, `group-leftover-${groupId}`, [
            `leftover-${catId}`,
        ]);
    }
    function removeDeps(sheetName, groupId, catId) {
        sheet
            .get()
            .removeDependencies(sheetName, `group-sum-amount-${groupId}`, [
            `sum-amount-${catId}`,
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, `group-budget-${groupId}`, [
            `budget-${catId}`,
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, `group-leftover-${groupId}`, [
            `leftover-${catId}`,
        ]);
    }
    if (oldValue && oldValue.tombstone === 0 && newValue.tombstone === 1) {
        const id = newValue.id;
        const groupId = newValue.cat_group;
        months.forEach(month => {
            const sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, groupId, id);
        });
    }
    else if (newValue.tombstone === 0 &&
        (!oldValue || oldValue.tombstone === 1)) {
        createBlankCategory(newValue, months);
        months.forEach(month => {
            const prevMonth = monthUtils.prevMonth(month);
            const prevSheetName = monthUtils.sheetForMonth(prevMonth);
            const sheetName = monthUtils.sheetForMonth(month);
            const { start, end } = monthUtils.bounds(month);
            (0, base_1.createCategory)(newValue, sheetName, prevSheetName, start, end);
            const id = newValue.id;
            const groupId = newValue.cat_group;
            sheet
                .get()
                .addDependencies(sheetName, 'last-month-overspent', [
                `${prevSheetName}!leftover-${id}`,
                `${prevSheetName}!carryover-${id}`,
            ]);
            addDeps(sheetName, groupId, id);
            if (newValue.is_income) {
                sheet
                    .get()
                    .addDependencies(sheetName, 'buffered-auto', (0, util_3.flatten2)([
                    `${sheetName}!sum-amount-${id}`,
                    `${sheetName}!carryover-${id}`,
                ]));
            }
        });
    }
    else if (oldValue && oldValue.cat_group !== newValue.cat_group) {
        // The category moved so we need to update the dependencies
        const id = newValue.id;
        months.forEach(month => {
            const sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, oldValue.cat_group, id);
            addDeps(sheetName, newValue.cat_group, id);
        });
    }
}
function handleCategoryGroupChange(months, oldValue, newValue) {
    function addDeps(sheetName, groupId) {
        sheet
            .get()
            .addDependencies(sheetName, 'total-budgeted', [
            `group-budget-${groupId}`,
        ]);
        sheet
            .get()
            .addDependencies(sheetName, 'total-spent', [
            `group-sum-amount-${groupId}`,
        ]);
        sheet
            .get()
            .addDependencies(sheetName, 'total-leftover', [
            `group-leftover-${groupId}`,
        ]);
    }
    function removeDeps(sheetName, groupId) {
        sheet
            .get()
            .removeDependencies(sheetName, 'total-budgeted', [
            `group-budget-${groupId}`,
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, 'total-spent', [
            `group-sum-amount-${groupId}`,
        ]);
        sheet
            .get()
            .removeDependencies(sheetName, 'total-leftover', [
            `group-leftover-${groupId}`,
        ]);
    }
    if (newValue.tombstone === 1 && oldValue && oldValue.tombstone === 0) {
        const id = newValue.id;
        months.forEach(month => {
            const sheetName = monthUtils.sheetForMonth(month);
            removeDeps(sheetName, id);
        });
    }
    else if (newValue.tombstone === 0 &&
        (!oldValue || oldValue.tombstone === 1)) {
        const group = newValue;
        if (!group.is_income) {
            months.forEach(month => {
                const sheetName = monthUtils.sheetForMonth(month);
                // Dirty, dirty hack. These functions should not be async, but this is
                // OK because we're leveraging the sync nature of queries. Ideally we
                // wouldn't be querying here. But I think we have to. At least for now
                // we do
                const categories = db.runQuery('SELECT * FROM categories WHERE tombstone = 0 AND cat_group = ?', [group.id], true);
                createCategoryGroup({ ...group, categories }, sheetName);
                addDeps(sheetName, group.id);
            });
        }
    }
}
//# sourceMappingURL=envelope.js.map