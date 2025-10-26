// @ts-strict-ignore
import * as monthUtils from '../../shared/months';
import { q } from '../../shared/query';
import { aqlQuery } from '../aql';
import * as db from '../db';
import { batchMessages } from '../sync';
import { isReflectBudget, getSheetValue, setGoal, setBudget } from './actions';
import { CategoryTemplateContext } from './category-template-context';
import { checkTemplateNotes, storeNoteTemplates } from './template-notes';
export async function storeTemplates({ categoriesWithTemplates, source, }) {
    await batchMessages(async () => {
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
export async function applyTemplate({ month, }) {
    await storeNoteTemplates();
    const categoryTemplates = await getTemplates();
    const ret = await processTemplate(month, false, categoryTemplates);
    return ret;
}
export async function overwriteTemplate({ month, }) {
    await storeNoteTemplates();
    const categoryTemplates = await getTemplates();
    const ret = await processTemplate(month, true, categoryTemplates);
    return ret;
}
export async function applyMultipleCategoryTemplates({ month, categoryIds, }) {
    const { data: categoryData } = await aqlQuery(q('categories')
        .filter({ id: { $oneof: categoryIds } })
        .select('*'));
    await storeNoteTemplates();
    const categoryTemplates = await getTemplates(c => categoryIds.includes(c.id));
    const ret = await processTemplate(month, true, categoryTemplates, categoryData);
    return ret;
}
export async function applySingleCategoryTemplate({ month, category, }) {
    const { data: categoryData } = await aqlQuery(q('categories').filter({ id: category }).select('*'));
    await storeNoteTemplates();
    const categoryTemplates = await getTemplates(c => c.id === category);
    const ret = await processTemplate(month, true, categoryTemplates, categoryData);
    return ret;
}
export function runCheckTemplates() {
    return checkTemplateNotes();
}
async function getCategories() {
    const { data: categoryGroups } = await aqlQuery(q('category_groups').filter({ hidden: false }).select('*'));
    return categoryGroups.flatMap(g => g.categories || []).filter(c => !c.hidden);
}
async function getTemplates(filter = () => true) {
    //retrieves template definitions from the database
    const { data: categoriesWithGoalDef } = await aqlQuery(q('categories')
        .filter({ goal_def: { $ne: null } })
        .select('*'));
    const categoryTemplates = {};
    for (const categoryWithGoalDef of categoriesWithGoalDef.filter(filter)) {
        categoryTemplates[categoryWithGoalDef.id] = JSON.parse(categoryWithGoalDef.goal_def);
    }
    return categoryTemplates;
}
export async function getTemplatesForCategory(categoryId) {
    return getTemplates(c => c.id === categoryId);
}
async function setBudgets(month, templateBudget) {
    await batchMessages(async () => {
        templateBudget.forEach(element => {
            setBudget({
                category: element.category,
                month,
                amount: element.budgeted,
            });
        });
    });
}
async function setGoals(month, templateGoal) {
    await batchMessages(async () => {
        templateGoal.forEach(element => {
            setGoal({
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
    const isReflect = isReflectBudget();
    if (!categories.length) {
        categories = (await getCategories()).filter(c => isReflect || !c.is_income);
    }
    // setup categories to process
    const templateContexts = [];
    let availBudget = await getSheetValue(monthUtils.sheetForMonth(month), `to-budget`);
    const prioritiesSet = new Set();
    const errors = [];
    const budgetList = [];
    const goalList = [];
    for (const category of categories) {
        const { id } = category;
        const sheetName = monthUtils.sheetForMonth(month);
        const templates = categoryTemplates[id];
        const budgeted = await getSheetValue(sheetName, `budget-${id}`);
        const existingGoal = await getSheetValue(sheetName, `goal-${id}`);
        // only run categories that are unbudgeted or if we are forcing it
        if ((budgeted === 0 || force) && templates) {
            try {
                const templateContext = await CategoryTemplateContext.init(templates, category, month, budgeted);
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
