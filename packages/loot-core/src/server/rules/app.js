// @ts-strict-ignore
import { logger } from '../../platform/server/log';
import { createApp } from '../app';
import { RuleError } from '../errors';
import { mutator } from '../mutators';
import { batchMessages } from '../sync';
import * as rules from '../transactions/transaction-rules';
import { undoable } from '../undo';
import { Condition, Action, rankRules } from '.';
function validateRule(rule) {
    // Returns an array of errors, the array is the same link as the
    // passed-in `array`, or null if there are no errors
    function runValidation(array, validate) {
        const result = array.map(item => {
            try {
                validate(item);
            }
            catch (e) {
                if (e instanceof RuleError) {
                    logger.warn('Invalid rule', e);
                    return e.type;
                }
                throw e;
            }
            return null;
        });
        return result.filter((res) => typeof res === 'string').length
            ? result
            : null;
    }
    const conditionErrors = runValidation(rule.conditions, cond => new Condition(cond.op, cond.field, cond.value, cond.options));
    const actionErrors = runValidation(rule.actions, action => action.op === 'delete-transaction'
        ? new Action(action.op, null, null, null)
        : action.op === 'set-split-amount'
            ? new Action(action.op, null, action.value, action.options)
            : action.op === 'link-schedule'
                ? new Action(action.op, null, action.value, null)
                : action.op === 'prepend-notes' || action.op === 'append-notes'
                    ? new Action(action.op, null, action.value, null)
                    : new Action(action.op, action.field, action.value, action.options));
    if (conditionErrors || actionErrors) {
        return {
            conditionErrors,
            actionErrors,
        };
    }
    return null;
}
// Expose functions to the client
export const app = createApp();
app.method('rule-validate', ruleValidate);
app.method('rule-add', mutator(addRule));
app.method('rule-update', mutator(undoable(updateRule)));
app.method('rule-delete', mutator(undoable(deleteRule)));
app.method('rule-delete-all', mutator(undoable(deleteAllRules)));
app.method('rule-apply-actions', mutator(undoable(applyRuleActions)));
app.method('rule-add-payee-rename', mutator(addRulePayeeRename));
app.method('rules-get', getRules);
app.method('rule-get', getRule);
app.method('rules-run', runRules);
async function ruleValidate(rule) {
    const error = validateRule(rule);
    return { error };
}
async function addRule(rule) {
    const error = validateRule(rule);
    if (error) {
        return { error };
    }
    const id = await rules.insertRule(rule);
    return { id, ...rule };
}
async function updateRule(rule) {
    const error = validateRule(rule);
    if (error) {
        return { error };
    }
    await rules.updateRule(rule);
    return rule;
}
async function deleteRule(id) {
    return rules.deleteRule(id);
}
async function deleteAllRules(ids) {
    let someDeletionsFailed = false;
    await batchMessages(async () => {
        for (const id of ids) {
            const res = await rules.deleteRule(id);
            if (res === false) {
                someDeletionsFailed = true;
            }
        }
    });
    return { someDeletionsFailed };
}
async function applyRuleActions({ transactions, actions, }) {
    return rules.applyActions(transactions, actions);
}
async function addRulePayeeRename({ fromNames, to, }) {
    return rules.updatePayeeRenameRule(fromNames, to);
}
async function getRule({ id, }) {
    const rule = rules.getRules().find(rule => rule.id === id);
    return rule ? rule.serialize() : null;
}
async function getRules() {
    return rankRules(rules.getRules()).map(rule => rule.serialize());
}
async function runRules({ transaction, }) {
    return rules.runRules(transaction);
}
