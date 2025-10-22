"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleIndexer = void 0;
// @ts-strict-ignore
var util_1 = require("../../shared/util");
var RuleIndexer = /** @class */ (function () {
    function RuleIndexer(_a) {
        var field = _a.field, method = _a.method;
        this.field = field;
        this.method = method;
        this.rules = new Map();
    }
    RuleIndexer.prototype.getIndex = function (key) {
        if (!this.rules.has(key)) {
            this.rules.set(key, new Set());
        }
        return this.rules.get(key);
    };
    RuleIndexer.prototype.getIndexForValue = function (value) {
        return this.getIndex(this.getKey(value) || '*');
    };
    RuleIndexer.prototype.getKey = function (value) {
        if (typeof value === 'string' && value !== '') {
            if (this.method === 'firstchar') {
                return value[0].toLowerCase();
            }
            return value.toLowerCase();
        }
        return null;
    };
    RuleIndexer.prototype.getIndexes = function (rule) {
        var _this = this;
        var cond = rule.conditions.find(function (cond) { return cond.field === _this.field; });
        var indexes = [];
        if (cond &&
            (cond.op === 'oneOf' ||
                cond.op === 'is' ||
                cond.op === 'isNot' ||
                cond.op === 'notOneOf')) {
            if (cond.op === 'oneOf' || cond.op === 'notOneOf') {
                cond.value.forEach(function (val) { return indexes.push(_this.getIndexForValue(val)); });
            }
            else {
                indexes.push(this.getIndexForValue(cond.value));
            }
        }
        else {
            indexes.push(this.getIndex('*'));
        }
        return indexes;
    };
    RuleIndexer.prototype.index = function (rule) {
        var indexes = this.getIndexes(rule);
        indexes.forEach(function (index) {
            index.add(rule);
        });
    };
    RuleIndexer.prototype.remove = function (rule) {
        var indexes = this.getIndexes(rule);
        indexes.forEach(function (index) {
            index.delete(rule);
        });
    };
    RuleIndexer.prototype.getApplicableRules = function (object) {
        var indexedRules;
        if (this.field in object) {
            var key = this.getKey(object[this.field]);
            if (key) {
                indexedRules = this.rules.get(key);
            }
        }
        return (0, util_1.fastSetMerge)(indexedRules || new Set(), this.rules.get('*') || new Set());
    };
    return RuleIndexer;
}());
exports.RuleIndexer = RuleIndexer;
