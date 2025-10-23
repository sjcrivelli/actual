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
exports.storeTemplates = storeTemplates;
exports.applyTemplate = applyTemplate;
exports.overwriteTemplate = overwriteTemplate;
exports.applyMultipleCategoryTemplates = applyMultipleCategoryTemplates;
exports.applySingleCategoryTemplate = applySingleCategoryTemplate;
exports.runCheckTemplates = runCheckTemplates;
exports.getTemplatesForCategory = getTemplatesForCategory;
// @ts-strict-ignore
const monthUtils = __importStar(require("../../shared/months"));
const query_1 = require("../../shared/query");
const aql_1 = require("../aql");
const db = __importStar(require("../db"));
const sync_1 = require("../sync");
const actions_1 = require("./actions");
const category_template_context_1 = require("./category-template-context");
const template_notes_1 = require("./template-notes");
async function storeTemplates({ categoriesWithTemplates, source, }) {
    await (0, sync_1.batchMessages)(async () => {
        for (const { id, templates } of categoriesWithTemplates) {
            const goalDefs = JSON.stringify(templates);
            await db.updateWithSchema('categories', {
                id,
                goal_def: goalDefs,
                template_settings: { source },
            });
        }
    });
}
async function applyTemplate({ month, }) {
    await (0, template_notes_1.storeNoteTemplates)();
    const categoryTemplates = await getTemplates();
    const ret = await processTemplate(month, false, categoryTemplates);
    return ret;
}
async function overwriteTemplate({ month, }) {
    await (0, template_notes_1.storeNoteTemplates)();
    const categoryTemplates = await getTemplates();
    const ret = await processTemplate(month, true, categoryTemplates);
    return ret;
}
async function applyMultipleCategoryTemplates({ month, categoryIds, }) {
    const { data: categoryData } = await (0, aql_1.aqlQuery)((0, query_1.q)('categories')
        .filter({ id: { $oneof: categoryIds } })
        .select('*'));
    await (0, template_notes_1.storeNoteTemplates)();
    const categoryTemplates = await getTemplates(c => categoryIds.includes(c.id));
    const ret = await processTemplate(month, true, categoryTemplates, categoryData);
    return ret;
}
async function applySingleCategoryTemplate({ month, category, }) {
    const { data: categoryData } = await (0, aql_1.aqlQuery)((0, query_1.q)('categories').filter({ id: category }).select('*'));
    await (0, template_notes_1.storeNoteTemplates)();
    const categoryTemplates = await getTemplates(c => c.id === category);
    const ret = await processTemplate(month, true, categoryTemplates, categoryData);
    return ret;
}
function runCheckTemplates() {
    return (0, template_notes_1.checkTemplateNotes)();
}
async function getCategories() {
    const { data: categoryGroups } = await (0, aql_1.aqlQuery)((0, query_1.q)('category_groups').filter({ hidden: false }).select('*'));
    return categoryGroups.flatMap(g => g.categories || []).filter(c => !c.hidden);
}
async function getTemplates(filter = () => true) {
    //retrieves template definitions from the database
    const { data: categoriesWithGoalDef } = await (0, aql_1.aqlQuery)((0, query_1.q)('categories')
        .filter({ goal_def: { $ne: null } })
        .select('*'));
    const categoryTemplates = {};
    for (const categoryWithGoalDef of categoriesWithGoalDef.filter(filter)) {
        categoryTemplates[categoryWithGoalDef.id] = JSON.parse(categoryWithGoalDef.goal_def);
    }
    return categoryTemplates;
}
async function getTemplatesForCategory(categoryId) {
    return getTemplates(c => c.id === categoryId);
}
async function setBudgets(month, templateBudget) {
    await (0, sync_1.batchMessages)(async () => {
        templateBudget.forEach(element => {
            (0, actions_1.setBudget)({
                category: element.category,
                month,
                amount: element.budgeted,
            });
        });
    });
}
async function setGoals(month, templateGoal) {
    await (0, sync_1.batchMessages)(async () => {
        templateGoal.forEach(element => {
            (0, actions_1.setGoal)({
                month,
                category: element.category,
                goal: element.goal,
                long_goal: element.longGoal,
            });
        });
    });
}
async function processTemplate(month, force, categoryTemplates, categories = []) {
    // setup categories
    const isReflect = (0, actions_1.isReflectBudget)();
    if (!categories.length) {
        categories = (await getCategories()).filter(c => isReflect || !c.is_income);
    }
    // setup categories to process
    const templateContexts = [];
    let availBudget = await (0, actions_1.getSheetValue)(monthUtils.sheetForMonth(month), `to-budget`);
    const prioritiesSet = new Set();
    const errors = [];
    const budgetList = [];
    const goalList = [];
    for (const category of categories) {
        const { id } = category;
        const sheetName = monthUtils.sheetForMonth(month);
        const templates = categoryTemplates[id];
        const budgeted = await (0, actions_1.getSheetValue)(sheetName, `budget-${id}`);
        const existingGoal = await (0, actions_1.getSheetValue)(sheetName, `goal-${id}`);
        // only run categories that are unbudgeted or if we are forcing it
        if ((budgeted === 0 || force) && templates) {
            try {
                const templateContext = await category_template_context_1.CategoryTemplateContext.init(templates, category, month, budgeted);
                // don't use the funds that are not from templates
                if (!templateContext.isGoalOnly()) {
                    availBudget += budgeted;
                }
                availBudget += templateContext.getLimitExcess();
                templateContext.getPriorities().forEach(p => prioritiesSet.add(p));
                templateContexts.push(templateContext);
            }
            catch (e) {
                errors.push(`${category.name}: ${e.message}`);
            }
            // do a reset of the goals that are orphaned
        }
        else if (existingGoal !== null && !templates) {
            goalList.push({
                category: id,
                goal: null,
                longGoal: null,
            });
        }
    }
    //break early if nothing to do, or there are errors
    if (templateContexts.length === 0 && errors.length === 0) {
        if (goalList.length > 0) {
            setGoals(month, goalList);
        }
        return {
            type: 'message',
            message: 'Everything is up to date',
        };
    }
    if (errors.length > 0) {
        return {
            sticky: true,
            message: 'There were errors interpreting some templates:',
            pre: errors.join(`\n\n`),
        };
    }
    const priorities = new Int32Array([...prioritiesSet]).sort();
    // run each priority level
    for (const priority of priorities) {
        const availStart = availBudget;
        for (const templateContext of templateContexts) {
            const budget = await templateContext.runTemplatesForPriority(priority, availBudget, availStart);
            availBudget -= budget;
        }
    }
    // run remainder
    let remainderContexts = templateContexts.filter(c => c.hasRemainder());
    while (availBudget > 0 && remainderContexts.length > 0) {
        let remainderWeight = 0;
        remainderContexts.forEach(context => (remainderWeight += context.getRemainderWeight()));
        const perWeight = availBudget / remainderWeight;
        remainderContexts.forEach(context => {
            availBudget -= context.runRemainder(availBudget, perWeight);
        });
        remainderContexts = templateContexts.filter(c => c.hasRemainder());
    }
    // finish
    templateContexts.forEach(context => {
        const values = context.getValues();
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
    await setBudgets(month, budgetList);
    await setGoals(month, goalList);
    return {
        type: 'message',
        message: `Successfully applied templates to ${templateContexts.length} categories`,
    };
}
//# sourceMappingURL=goal-template.js.map