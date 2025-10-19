"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOAL_PREFIX = exports.TEMPLATE_PREFIX = void 0;
exports.storeNoteTemplates = storeNoteTemplates;
exports.checkTemplateNotes = checkTemplateNotes;
exports.unparse = unparse;
const goal_template_1 = require("./goal-template");
const goal_template_pegjs_1 = require("./goal-template.pegjs");
const statements_1 = require("./statements");
exports.TEMPLATE_PREFIX = '#template';
exports.GOAL_PREFIX = '#goal';
async function storeNoteTemplates() {
    const categoriesWithTemplates = await getCategoriesWithTemplates();
    await (0, goal_template_1.storeTemplates)({ categoriesWithTemplates, source: 'notes' });
    await (0, statements_1.resetCategoryGoalDefsWithNoTemplates)();
}
async function checkTemplateNotes() {
    const categoryWithTemplates = await getCategoriesWithTemplates();
    const schedules = await (0, statements_1.getActiveSchedules)();
    const scheduleNames = schedules.map(({ name }) => name);
    const errors = [];
    categoryWithTemplates.forEach(({ name, templates }) => {
        templates.forEach(template => {
            if (template.type === 'error') {
                // Only show detailed error for adjustment-related errors
                if (template.error && template.error.includes('adjustment')) {
                    errors.push(`${name}: ${template.line}\nError: ${template.error}`);
                }
                else {
                    errors.push(`${name}: ${template.line}`);
                }
            }
            else if (template.type === 'schedule' &&
                !scheduleNames.includes(template.name)) {
                errors.push(`${name}: Schedule “${template.name}” does not exist`);
            }
        });
    });
    if (errors.length) {
        return {
            sticky: true,
            message: 'There were errors interpreting some templates:',
            pre: errors.join('\n\n'),
        };
    }
    return {
        type: 'message',
        message: 'All templates passed! 🎉',
    };
}
async function getCategoriesWithTemplates() {
    const templatesForCategory = [];
    const templateNotes = await (0, statements_1.getCategoriesWithTemplateNotes)();
    templateNotes.forEach(({ id, name, note }) => {
        if (!note) {
            return;
        }
        const parsedTemplates = [];
        note.split('\n').forEach(line => {
            const trimmedLine = line.substring(line.indexOf('#')).trim();
            if (!trimmedLine.startsWith(exports.TEMPLATE_PREFIX) &&
                !trimmedLine.startsWith(exports.GOAL_PREFIX)) {
                return;
            }
            try {
                const parsedTemplate = (0, goal_template_pegjs_1.parse)(trimmedLine);
                // Validate schedule adjustments
                if (parsedTemplate.type === 'schedule' &&
                    parsedTemplate.adjustment !== undefined) {
                    if (parsedTemplate.adjustment <= -100 ||
                        parsedTemplate.adjustment > 1000) {
                        throw new Error(`Invalid adjustment percentage (${parsedTemplate.adjustment}%). Must be between -100% and 1000%`);
                    }
                }
                parsedTemplates.push(parsedTemplate);
            }
            catch (e) {
                parsedTemplates.push({
                    type: 'error',
                    directive: 'error',
                    line,
                    error: getErrorMessage(e),
                });
            }
        });
        if (!parsedTemplates.length) {
            return;
        }
        templatesForCategory.push({
            id,
            name,
            templates: parsedTemplates,
        });
    });
    return templatesForCategory;
}
async function unparse(templates) {
    return templates
        .flatMap(template => {
        if (template.type === 'error') {
            return [];
        }
        if (template.type === 'goal') {
            return `${exports.GOAL_PREFIX} ${template.amount}`;
        }
        const prefix = template.priority
            ? `${exports.TEMPLATE_PREFIX}-${template.priority}`
            : exports.TEMPLATE_PREFIX;
        switch (template.type) {
            case 'simple': {
                // Simple template syntax: #template[-prio] simple [monthly N] [limit]
                let result = prefix;
                if (template.monthly != null) {
                    result += ` ${template.monthly}`;
                }
                if (template.limit) {
                    result += ` ${limitToString(template.limit)}`;
                }
                return result.trim();
            }
            case 'schedule': {
                // schedule syntax: #template[-prio] schedule <name> [full] [ [increase/decrease N%] ]
                let result = `${prefix} schedule`;
                if (template.full) {
                    result += ' full';
                }
                result += ` ${template.name}`;
                if (template.adjustment !== undefined) {
                    const adj = template.adjustment;
                    const op = adj >= 0 ? 'increase' : 'decrease';
                    const val = Math.abs(adj);
                    result += ` [${op} ${val}%]`;
                }
                return result;
            }
            case 'percentage': {
                // #template[-prio] <percent>% of [previous ]<category>
                const prev = template.previous ? 'previous ' : '';
                return `${prefix} ${trimTrailingZeros(template.percent)}% of ${prev}${template.category}`.trim();
            }
            case 'periodic': {
                // #template[-prio] <amount> repeat every <n> <period>(s) starting <date> [limit]
                const periodPart = periodToString(template.period);
                let result = `${prefix} ${template.amount} repeat every ${periodPart} starting ${template.starting}`;
                if (template.limit) {
                    result += ` ${limitToString(template.limit)}`;
                }
                return result;
            }
            case 'by':
            case 'spend': {
                // #template[-prio] <amount> by <month> [spend from <month>] [repeat every <...>]
                let result = `${prefix} ${template.amount} by ${template.month}`;
                if (template.type === 'spend' && template.from) {
                    result += ` spend from ${template.from}`;
                }
                // repeat info
                if (template.annual !== undefined) {
                    const repeatInfo = repeatToString(template.annual, template.repeat);
                    if (repeatInfo) {
                        result += ` repeat every ${repeatInfo}`;
                    }
                }
                return result;
            }
            case 'remainder': {
                // #template remainder [weight] [limit]
                let result = `${prefix} remainder`;
                if (template.weight !== undefined && template.weight !== 1) {
                    result += ` ${template.weight}`;
                }
                if (template.limit) {
                    result += ` ${limitToString(template.limit)}`;
                }
                return result;
            }
            case 'average': {
                // #template average <numMonths> months
                return `${prefix} average ${template.numMonths} months`;
            }
            case 'copy': {
                // #template copy from <lookBack> months ago [limit]
                const result = `${prefix} copy from ${template.lookBack} months ago`;
                return result;
            }
            default:
                return [];
        }
    })
        .join('\n');
}
function limitToString(limit) {
    switch (limit.period) {
        case 'weekly': {
            // Needs start date per grammar
            const base = `up to ${limit.amount} per week starting ${limit.start}`;
            return limit.hold ? `${base} hold` : base;
        }
        case 'daily': {
            const base = `up to ${limit.amount} per day`;
            return limit.hold ? `${base} hold` : base;
        }
        case 'monthly':
        default: {
            const base = `up to ${limit.amount}`;
            return limit.hold ? `${base} hold` : base;
        }
    }
}
function periodToString(p) {
    const { period, amount } = p;
    if (amount === 1) {
        return period; // singular
    }
    // pluralize simple
    return `${amount} ${period}s`;
}
function repeatToString(annual, repeat) {
    if (annual === undefined)
        return null;
    if (annual) {
        if (!repeat || repeat === 1)
            return 'year';
        return `${repeat} years`;
    }
    // monthly
    if (!repeat || repeat === 1)
        return 'month';
    return `${repeat} months`;
}
function trimTrailingZeros(n) {
    const s = n.toString();
    if (!s.includes('.'))
        return s;
    return s.replace(/\.0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
}
