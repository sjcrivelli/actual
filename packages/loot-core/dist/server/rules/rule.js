"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
exports.execActions = execActions;
// @ts-strict-ignore
const transactions_1 = require("../../shared/transactions");
const action_1 = require("./action");
const condition_1 = require("./condition");
function execNonSplitActions(actions, transaction) {
    const update = transaction;
    actions.forEach(action => action.exec(update));
    return update;
}
function getSplitRemainder(transactions) {
    const { error } = (0, transactions_1.recalculateSplit)((0, transactions_1.groupTransaction)(transactions));
    return error ? error.difference : 0;
}
function execSplitActions(actions, transaction) {
    const splitAmountActions = actions.filter(action => action.op === 'set-split-amount');
    // Convert the transaction to a split transaction.
    const { data } = (0, transactions_1.splitTransaction)((0, transactions_1.ungroupTransaction)(transaction), transaction.id);
    let newTransactions = data;
    // Add empty splits, and apply non-set-amount actions.
    // This also populates any fixed-amount splits.
    actions.forEach(action => {
        const splitTransactionIndex = (action.options?.splitIndex ?? 0) + 1;
        if (splitTransactionIndex >= newTransactions.length) {
            const { data } = (0, transactions_1.addSplitTransaction)(newTransactions, transaction.id);
            newTransactions = data;
        }
        action.exec(newTransactions[splitTransactionIndex]);
    });
    // Distribute to fixed-percent splits.
    const remainingAfterFixedAmounts = getSplitRemainder(newTransactions);
    splitAmountActions
        .filter(action => action.options.method === 'fixed-percent')
        .forEach(action => {
        const splitTransactionIndex = (action.options?.splitIndex ?? 0) + 1;
        const percent = action.value / 100;
        const amount = Math.round(remainingAfterFixedAmounts * percent);
        newTransactions[splitTransactionIndex].amount = amount;
    });
    // Distribute to remainder splits.
    const remainderActions = splitAmountActions.filter(action => action.options.method === 'remainder');
    const remainingAfterFixedPercents = getSplitRemainder(newTransactions);
    if (remainderActions.length !== 0) {
        const amountPerRemainderSplit = Math.round(remainingAfterFixedPercents / remainderActions.length);
        let lastNonFixedTransactionIndex = -1;
        remainderActions.forEach(action => {
            const splitTransactionIndex = (action.options?.splitIndex ?? 0) + 1;
            newTransactions[splitTransactionIndex].amount = amountPerRemainderSplit;
            lastNonFixedTransactionIndex = Math.max(lastNonFixedTransactionIndex, splitTransactionIndex);
        });
        // The last remainder split will be adjusted for any leftovers from rounding.
        newTransactions[lastNonFixedTransactionIndex].amount +=
            getSplitRemainder(newTransactions);
    }
    // The split index 0 (transaction index 1) is reserved for "Apply to all" actions.
    // Remove that entry from the transaction list.
    newTransactions.splice(1, 1);
    return (0, transactions_1.recalculateSplit)((0, transactions_1.groupTransaction)(newTransactions));
}
function execActions(actions, transaction) {
    const parentActions = actions.filter(action => !action.options?.splitIndex);
    const childActions = actions.filter(action => action.options?.splitIndex);
    const totalSplitCount = actions.reduce((prev, cur) => Math.max(prev, cur.options?.splitIndex ?? 0), 0) + 1;
    const nonSplitResult = execNonSplitActions(parentActions, transaction);
    if (totalSplitCount === 1) {
        // No splits, no need to do anything else.
        return nonSplitResult;
    }
    if (nonSplitResult.is_child) {
        // Rules with splits can't be applied to child transactions.
        return nonSplitResult;
    }
    return execSplitActions(childActions, nonSplitResult);
}
class Rule {
    actions;
    conditions;
    conditionsOp;
    id;
    stage;
    constructor({ id, stage, conditionsOp, conditions, actions, }) {
        this.id = id;
        this.stage = stage ?? null;
        this.conditionsOp = conditionsOp;
        this.conditions = conditions.map(c => new condition_1.Condition(c.op, c.field, c.value, c.options));
        this.actions = actions.map(a => new action_1.Action(a.op, a.field, a.value, a.options));
    }
    evalConditions(object) {
        if (this.conditions.length === 0) {
            return false;
        }
        const method = this.conditionsOp === 'or' ? 'some' : 'every';
        return this.conditions[method](condition => {
            return condition.eval(object);
        });
    }
    execActions(object) {
        const result = execActions(this.actions, {
            ...object,
        });
        const changes = Object.keys(result).reduce((prev, cur) => {
            if (result[cur] !== object[cur]) {
                prev[cur] = result[cur];
            }
            return prev;
        }, {});
        return changes;
    }
    exec(object) {
        if (this.evalConditions(object)) {
            return this.execActions(object);
        }
        return null;
    }
    // Apply is similar to exec but applies the changes for you
    apply(object) {
        const changes = this.exec(object);
        return Object.assign({}, object, changes);
    }
    getId() {
        return this.id;
    }
    serialize() {
        return {
            id: this.id,
            stage: this.stage,
            conditionsOp: this.conditionsOp,
            conditions: this.conditions.map(c => c.serialize()),
            actions: this.actions.map(a => a.serialize()),
        };
    }
}
exports.Rule = Rule;
