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
exports.app = void 0;
const monthUtils = __importStar(require("../../shared/months"));
const query_1 = require("../../shared/query");
const app_1 = require("../app");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const errors_1 = require("../errors");
const models_1 = require("../models");
const mutators_1 = require("../mutators");
const sheet = __importStar(require("../sheet"));
const util_1 = require("../spreadsheet/util");
const sync_1 = require("../sync");
const undo_1 = require("../undo");
const actions = __importStar(require("./actions"));
const budget = __importStar(require("./base"));
const cleanupActions = __importStar(require("./cleanup-template"));
const goalActions = __importStar(require("./goal-template"));
const goalNoteActions = __importStar(require("./template-notes"));
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
async function getCategories() {
    const categoryGroups = await getCategoryGroups();
    return {
        grouped: categoryGroups,
        list: categoryGroups.flatMap(g => g.categories ?? []),
    };
}
async function getBudgetBounds() {
    return await budget.createAllBudgets();
}
async function envelopeBudgetMonth({ month }) {
    const groups = await db.getCategoriesGrouped();
    const sheetName = monthUtils.sheetForMonth(month);
    function value(name) {
        const v = sheet.getCellValue(sheetName, name);
        return { value: v === '' ? 0 : v, name: (0, util_1.resolveName)(sheetName, name) };
    }
    let values = [
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
    for (const group of groups) {
        const categories = group.categories ?? [];
        if (group.is_income) {
            values.push(value('total-income'));
            for (const cat of categories) {
                values.push(value(`sum-amount-${cat.id}`));
            }
        }
        else {
            values = values.concat([
                value(`group-budget-${group.id}`),
                value(`group-sum-amount-${group.id}`),
                value(`group-leftover-${group.id}`),
            ]);
            for (const cat of categories) {
                values = values.concat([
                    value(`budget-${cat.id}`),
                    value(`sum-amount-${cat.id}`),
                    value(`leftover-${cat.id}`),
                    value(`carryover-${cat.id}`),
                    value(`goal-${cat.id}`),
                    value(`long-goal-${cat.id}`),
                ]);
            }
        }
    }
    return values;
}
async function trackingBudgetMonth({ month }) {
    const groups = await db.getCategoriesGrouped();
    const sheetName = monthUtils.sheetForMonth(month);
    function value(name) {
        const v = sheet.getCellValue(sheetName, name);
        return { value: v === '' ? 0 : v, name: (0, util_1.resolveName)(sheetName, name) };
    }
    let values = [
        value('total-budgeted'),
        value('total-budget-income'),
        value('total-saved'),
        value('total-income'),
        value('total-spent'),
        value('real-saved'),
        value('total-leftover'),
    ];
    for (const group of groups) {
        values = values.concat([
            value(`group-budget-${group.id}`),
            value(`group-sum-amount-${group.id}`),
            value(`group-leftover-${group.id}`),
        ]);
        const categories = group.categories ?? [];
        for (const cat of categories) {
            values = values.concat([
                value(`budget-${cat.id}`),
                value(`sum-amount-${cat.id}`),
                value(`leftover-${cat.id}`),
                value(`goal-${cat.id}`),
                value(`long-goal-${cat.id}`),
            ]);
            if (!group.is_income) {
                values.push(value(`carryover-${cat.id}`));
            }
        }
    }
    return values;
}
async function createCategory({ name, groupId, isIncome, hidden, }) {
    if (!groupId) {
        throw (0, errors_1.APIError)('Creating a category: groupId is required');
    }
    return await db.insertCategory({
        name: name.trim(),
        cat_group: groupId,
        is_income: isIncome ? 1 : 0,
        hidden: hidden ? 1 : 0,
    });
}
async function updateCategory(category) {
    try {
        await db.updateCategory(models_1.categoryModel.toDb({
            ...category,
            name: category.name.trim(),
        }));
    }
    catch (e) {
        if (e instanceof Error &&
            e.message.toLowerCase().includes('unique constraint')) {
            return { error: { type: 'category-exists' } };
        }
        throw e;
    }
    return {};
}
async function moveCategory({ id, groupId, targetId, }) {
    await (0, sync_1.batchMessages)(async () => {
        await db.moveCategory(id, groupId, targetId);
    });
}
async function deleteCategory({ id, transferId, }) {
    let result = {};
    await (0, sync_1.batchMessages)(async () => {
        const row = await db.first('SELECT is_income FROM categories WHERE id = ?', [id]);
        if (!row) {
            result = { error: 'no-categories' };
            return;
        }
        const transfer = transferId &&
            (await db.first('SELECT is_income FROM categories WHERE id = ?', [transferId]));
        if (!row || (transferId && !transfer)) {
            result = { error: 'no-categories' };
            return;
        }
        else if (transferId &&
            row &&
            transfer &&
            row.is_income !== transfer.is_income) {
            result = { error: 'category-type' };
            return;
        }
        // Update spreadsheet values if it's an expense category
        // TODO: We should do this for income too if it's a reflect budget
        if (row.is_income === 0) {
            if (transferId) {
                await budget.doTransfer([id], transferId);
            }
        }
        await db.deleteCategory({ id }, transferId);
    });
    return result;
}
// Server must return AQL entities not the raw DB data
async function getCategoryGroups() {
    const { data: categoryGroups } = await (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').select('*'));
    return categoryGroups;
}
async function createCategoryGroup({ name, isIncome, hidden, }) {
    return await db.insertCategoryGroup({
        name,
        is_income: isIncome ? 1 : 0,
        hidden: hidden ? 1 : 0,
    });
}
async function updateCategoryGroup(group) {
    await db.updateCategoryGroup(models_1.categoryGroupModel.toDb(group));
}
async function moveCategoryGroup({ id, targetId, }) {
    await (0, sync_1.batchMessages)(async () => {
        await db.moveCategoryGroup(id, targetId);
    });
}
async function deleteCategoryGroup({ id, transferId, }) {
    const groupCategories = await db.all('SELECT id FROM categories WHERE cat_group = ? AND tombstone = 0', [id]);
    await (0, sync_1.batchMessages)(async () => {
        if (transferId) {
            await budget.doTransfer(groupCategories.map(c => c.id), transferId);
        }
        await db.deleteCategoryGroup({ id }, transferId);
    });
}
async function isCategoryTransferRequired({ id, }) {
    const res = await db.runQuery(`SELECT count(t.id) as count FROM transactions t
       LEFT JOIN category_mapping cm ON cm.id = t.category
       WHERE cm.transferId = ? AND t.tombstone = 0`, [id], true);
    // If there are transactions with this category, return early since
    // we already know it needs to be tranferred
    if (res[0].count !== 0) {
        return true;
    }
    // If there are any non-zero budget values, also force the user to
    // transfer the category.
    return [...sheet.get().meta().createdMonths].some(month => {
        const sheetName = monthUtils.sheetForMonth(month);
        const value = sheet.get().getCellValue(sheetName, 'budget-' + id);
        return value != null && value !== 0;
    });
}
//# sourceMappingURL=app.js.map