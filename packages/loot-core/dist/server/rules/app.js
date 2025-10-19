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
// @ts-strict-ignore
const log_1 = require("../../platform/server/log");
const app_1 = require("../app");
const errors_1 = require("../errors");
const mutators_1 = require("../mutators");
const sync_1 = require("../sync");
const rules = __importStar(require("../transactions/transaction-rules"));
const undo_1 = require("../undo");
const _1 = require(".");
function validateRule(rule) {
    // Returns an array of errors, the array is the same link as the
    // passed-in `array`, or null if there are no errors
    function runValidation(array, validate) {
        const result = array.map(item => {
            try {
                validate(item);
            }
            catch (e) {
                if (e instanceof errors_1.RuleError) {
                    log_1.logger.warn('Invalid rule', e);
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
    const conditionErrors = runValidation(rule.conditions, cond => new _1.Condition(cond.op, cond.field, cond.value, cond.options));
    const actionErrors = runValidation(rule.actions, action => action.op === 'delete-transaction'
        ? new _1.Action(action.op, null, null, null)
        : action.op === 'set-split-amount'
            ? new _1.Action(action.op, null, action.value, action.options)
            : action.op === 'link-schedule'
                ? new _1.Action(action.op, null, action.value, null)
                : action.op === 'prepend-notes' || action.op === 'append-notes'
                    ? new _1.Action(action.op, null, action.value, null)
                    : new _1.Action(action.op, action.field, action.value, action.options));
    if (conditionErrors || actionErrors) {
        return {
            conditionErrors,
            actionErrors,
        };
    }
    return null;
}
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('rule-validate', ruleValidate);
exports.app.method('rule-add', (0, mutators_1.mutator)(addRule));
exports.app.method('rule-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateRule)));
exports.app.method('rule-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteRule)));
exports.app.method('rule-delete-all', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteAllRules)));
exports.app.method('rule-apply-actions', (0, mutators_1.mutator)((0, undo_1.undoable)(applyRuleActions)));
exports.app.method('rule-add-payee-rename', (0, mutators_1.mutator)(addRulePayeeRename));
exports.app.method('rules-get', getRules);
exports.app.method('rule-get', getRule);
exports.app.method('rules-run', runRules);
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
    await (0, sync_1.batchMessages)(async () => {
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
    return (0, _1.rankRules)(rules.getRules()).map(rule => rule.serialize());
}
async function runRules({ transaction, }) {
    return rules.runRules(transaction);
}
