"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleIndexer = void 0;
// @ts-strict-ignore
const util_1 = require("../../shared/util");
class RuleIndexer {
    field;
    method;
    rules;
    constructor({ field, method }) {
        this.field = field;
        this.method = method;
        this.rules = new Map();
    }
    getIndex(key) {
        if (!this.rules.has(key)) {
            this.rules.set(key, new Set());
        }
        return this.rules.get(key);
    }
    getIndexForValue(value) {
        return this.getIndex(this.getKey(value) || '*');
    }
    getKey(value) {
        if (typeof value === 'string' && value !== '') {
            if (this.method === 'firstchar') {
                return value[0].toLowerCase();
            }
            return value.toLowerCase();
        }
        return null;
    }
    getIndexes(rule) {
        const cond = rule.conditions.find(cond => cond.field === this.field);
        const indexes = [];
        if (cond &&
            (cond.op === 'oneOf' ||
                cond.op === 'is' ||
                cond.op === 'isNot' ||
                cond.op === 'notOneOf')) {
            if (cond.op === 'oneOf' || cond.op === 'notOneOf') {
                cond.value.forEach(val => indexes.push(this.getIndexForValue(val)));
            }
            else {
                indexes.push(this.getIndexForValue(cond.value));
            }
        }
        else {
            indexes.push(this.getIndex('*'));
        }
        return indexes;
    }
    index(rule) {
        const indexes = this.getIndexes(rule);
        indexes.forEach(index => {
            index.add(rule);
        });
    }
    remove(rule) {
        const indexes = this.getIndexes(rule);
        indexes.forEach(index => {
            index.delete(rule);
        });
    }
    getApplicableRules(object) {
        let indexedRules;
        if (this.field in object) {
            const key = this.getKey(object[this.field]);
            if (key) {
                indexedRules = this.rules.get(key);
            }
        }
        return (0, util_1.fastSetMerge)(indexedRules || new Set(), this.rules.get('*') || new Set());
    }
}
exports.RuleIndexer = RuleIndexer;
//# sourceMappingURL=rule-indexer.js.map