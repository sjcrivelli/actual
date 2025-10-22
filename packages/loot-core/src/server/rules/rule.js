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
exports.Rule = void 0;
exports.execActions = execActions;
// @ts-strict-ignore
var transactions_1 = require("../../shared/transactions");
var action_1 = require("./action");
var condition_1 = require("./condition");
function execNonSplitActions(actions, transaction) {
    var update = transaction;
    actions.forEach(function (action) { return action.exec(update); });
    return update;
}
function getSplitRemainder(transactions) {
    var error = (0, transactions_1.recalculateSplit)((0, transactions_1.groupTransaction)(transactions)).error;
    return error ? error.difference : 0;
}
function execSplitActions(actions, transaction) {
    var splitAmountActions = actions.filter(function (action) { return action.op === 'set-split-amount'; });
    // Convert the transaction to a split transaction.
    var data = (0, transactions_1.splitTransaction)((0, transactions_1.ungroupTransaction)(transaction), transaction.id).data;
    var newTransactions = data;
    // Add empty splits, and apply non-set-amount actions.
    // This also populates any fixed-amount splits.
    actions.forEach(function (action) {
        var _a, _b;
        var splitTransactionIndex = ((_b = (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0) + 1;
        if (splitTransactionIndex >= newTransactions.length) {
            var data_1 = (0, transactions_1.addSplitTransaction)(newTransactions, transaction.id).data;
            newTransactions = data_1;
        }
        action.exec(newTransactions[splitTransactionIndex]);
    });
    // Distribute to fixed-percent splits.
    var remainingAfterFixedAmounts = getSplitRemainder(newTransactions);
    splitAmountActions
        .filter(function (action) { return action.options.method === 'fixed-percent'; })
        .forEach(function (action) {
        var _a, _b;
        var splitTransactionIndex = ((_b = (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0) + 1;
        var percent = action.value / 100;
        var amount = Math.round(remainingAfterFixedAmounts * percent);
        newTransactions[splitTransactionIndex].amount = amount;
    });
    // Distribute to remainder splits.
    var remainderActions = splitAmountActions.filter(function (action) { return action.options.method === 'remainder'; });
    var remainingAfterFixedPercents = getSplitRemainder(newTransactions);
    if (remainderActions.length !== 0) {
        var amountPerRemainderSplit_1 = Math.round(remainingAfterFixedPercents / remainderActions.length);
        var lastNonFixedTransactionIndex_1 = -1;
        remainderActions.forEach(function (action) {
            var _a, _b;
            var splitTransactionIndex = ((_b = (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0) + 1;
            newTransactions[splitTransactionIndex].amount = amountPerRemainderSplit_1;
            lastNonFixedTransactionIndex_1 = Math.max(lastNonFixedTransactionIndex_1, splitTransactionIndex);
        });
        // The last remainder split will be adjusted for any leftovers from rounding.
        newTransactions[lastNonFixedTransactionIndex_1].amount +=
            getSplitRemainder(newTransactions);
    }
    // The split index 0 (transaction index 1) is reserved for "Apply to all" actions.
    // Remove that entry from the transaction list.
    newTransactions.splice(1, 1);
    return (0, transactions_1.recalculateSplit)((0, transactions_1.groupTransaction)(newTransactions));
}
function execActions(actions, transaction) {
    var parentActions = actions.filter(function (action) { var _a; return !((_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex); });
    var childActions = actions.filter(function (action) { var _a; return (_a = action.options) === null || _a === void 0 ? void 0 : _a.splitIndex; });
    var totalSplitCount = actions.reduce(function (prev, cur) { var _a, _b; return Math.max(prev, (_b = (_a = cur.options) === null || _a === void 0 ? void 0 : _a.splitIndex) !== null && _b !== void 0 ? _b : 0); }, 0) + 1;
    var nonSplitResult = execNonSplitActions(parentActions, transaction);
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
var Rule = /** @class */ (function () {
    function Rule(_a) {
        var id = _a.id, stage = _a.stage, conditionsOp = _a.conditionsOp, conditions = _a.conditions, actions = _a.actions;
        this.id = id;
        this.stage = stage !== null && stage !== void 0 ? stage : null;
        this.conditionsOp = conditionsOp;
        this.conditions = conditions.map(function (c) { return new condition_1.Condition(c.op, c.field, c.value, c.options); });
        this.actions = actions.map(function (a) { return new action_1.Action(a.op, a.field, a.value, a.options); });
    }
    Rule.prototype.evalConditions = function (object) {
        if (this.conditions.length === 0) {
            return false;
        }
        var method = this.conditionsOp === 'or' ? 'some' : 'every';
        return this.conditions[method](function (condition) {
            return condition.eval(object);
        });
    };
    Rule.prototype.execActions = function (object) {
        var result = execActions(this.actions, __assign({}, object));
        var changes = Object.keys(result).reduce(function (prev, cur) {
            if (result[cur] !== object[cur]) {
                prev[cur] = result[cur];
            }
            return prev;
        }, {});
        return changes;
    };
    Rule.prototype.exec = function (object) {
        if (this.evalConditions(object)) {
            return this.execActions(object);
        }
        return null;
    };
    // Apply is similar to exec but applies the changes for you
    Rule.prototype.apply = function (object) {
        var changes = this.exec(object);
        return Object.assign({}, object, changes);
    };
    Rule.prototype.getId = function () {
        return this.id;
    };
    Rule.prototype.serialize = function () {
        return {
            id: this.id,
            stage: this.stage,
            conditionsOp: this.conditionsOp,
            conditions: this.conditions.map(function (c) { return c.serialize(); }),
            actions: this.actions.map(function (a) { return a.serialize(); }),
        };
    };
    return Rule;
}());
exports.Rule = Rule;
