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
exports.Condition = exports.CONDITION_TYPES = void 0;
// @ts-strict-ignore
const dateFns = __importStar(require("date-fns"));
const log_1 = require("../../platform/server/log");
const months_1 = require("../../shared/months");
const rules_1 = require("../../shared/rules");
const rule_utils_1 = require("./rule-utils");
exports.CONDITION_TYPES = {
    date: {
        ops: ['is', 'isapprox', 'gt', 'gte', 'lt', 'lte'],
        nullable: false,
        parse(op, value, fieldName) {
            const parsed = typeof value === 'string'
                ? (0, rule_utils_1.parseDateString)(value)
                : value.frequency != null
                    ? (0, rule_utils_1.parseRecurDate)(value)
                    : null;
            (0, rule_utils_1.assert)(parsed, 'date-format', `Invalid date format (field: ${fieldName})`);
            // Approximate only works with exact & recurring dates
            if (op === 'isapprox') {
                (0, rule_utils_1.assert)(parsed.type === 'date' || parsed.type === 'recur', 'date-format', `Invalid date value for “isapprox” (field: ${fieldName})`);
            }
            // These only work with exact dates
            else if (op === 'gt' || op === 'gte' || op === 'lt' || op === 'lte') {
                (0, rule_utils_1.assert)(parsed.type === 'date', 'date-format', `Invalid date value for “${op}” (field: ${fieldName})`);
            }
            return parsed;
        },
    },
    id: {
        ops: [
            'is',
            'contains',
            'matches',
            'oneOf',
            'isNot',
            'doesNotContain',
            'notOneOf',
            'and',
            'onBudget',
            'offBudget',
        ],
        nullable: true,
        parse(op, value, fieldName) {
            if (op === 'oneOf' || op === 'notOneOf' || op === 'and') {
                (0, rule_utils_1.assert)(Array.isArray(value), 'no-empty-array', `oneOf must have an array value (field: ${fieldName})`);
                return value;
            }
            return value;
        },
    },
    string: {
        ops: [
            'is',
            'contains',
            'matches',
            'oneOf',
            'isNot',
            'doesNotContain',
            'notOneOf',
            'hasTags',
        ],
        nullable: true,
        parse(op, value, fieldName) {
            if (op === 'oneOf' || op === 'notOneOf') {
                (0, rule_utils_1.assert)(Array.isArray(value), 'no-empty-array', `oneOf must have an array value (field: ${fieldName}): ${JSON.stringify(value)}`);
                return value.filter(Boolean).map(val => val.toLowerCase());
            }
            (0, rule_utils_1.assert)(typeof value === 'string', 'not-string', `Invalid string value (field: ${fieldName})`);
            if (op === 'contains' ||
                op === 'matches' ||
                op === 'doesNotContain' ||
                op === 'hasTags') {
                (0, rule_utils_1.assert)(value.length > 0, 'no-empty-string', `${op} must have non-empty string (field: ${fieldName})`);
            }
            if (op === 'hasTags') {
                return value;
            }
            return value.toLowerCase();
        },
    },
    number: {
        ops: ['is', 'isapprox', 'isbetween', 'gt', 'gte', 'lt', 'lte'],
        nullable: false,
        parse(op, value, fieldName) {
            const parsed = typeof value === 'number'
                ? { type: 'literal', value }
                : (0, rule_utils_1.parseBetweenAmount)(value);
            (0, rule_utils_1.assert)(parsed != null, 'not-number', `Value must be a number or between amount: ${JSON.stringify(value)} (field: ${fieldName})`);
            if (op === 'isbetween') {
                (0, rule_utils_1.assert)(parsed.type === 'between', 'number-format', `Invalid between value for “${op}” (field: ${fieldName})`);
            }
            else {
                (0, rule_utils_1.assert)(parsed.type === 'literal', 'number-format', `Invalid number value for “${op}” (field: ${fieldName})`);
            }
            return parsed;
        },
    },
    boolean: {
        ops: ['is'],
        nullable: false,
        parse(op, value, fieldName) {
            (0, rule_utils_1.assert)(typeof value === 'boolean', 'not-boolean', `Value must be a boolean: ${value} (field: ${fieldName})`);
            return value;
        },
    },
};
class Condition {
    field;
    op;
    options;
    rawValue;
    type;
    unparsedValue;
    value;
    constructor(op, field, value, options) {
        const typeName = rules_1.FIELD_TYPES.get(field);
        (0, rule_utils_1.assert)(typeName, 'internal', 'Invalid condition field: ' + field);
        const type = exports.CONDITION_TYPES[typeName];
        // It's important to validate rules because a faulty rule might mess
        // up the user's transaction (and be very confusing)
        (0, rule_utils_1.assert)(type, 'internal', `Invalid condition type: ${typeName} (field: ${field})`);
        (0, rule_utils_1.assert)((0, rules_1.isValidOp)(field, op), 'internal', `Invalid condition operator: ${op} (type: ${typeName}, field: ${field})`);
        if (type.nullable !== true) {
            (0, rule_utils_1.assert)(value != null, 'no-null', `Field cannot be empty: ${field}`);
        }
        // For strings, an empty string is equal to null
        if (typeName === 'string' && type.nullable !== true) {
            (0, rule_utils_1.assert)(value !== '', 'no-null', `Field cannot be empty: ${field}`);
        }
        this.rawValue = value;
        this.unparsedValue = value;
        this.op = op;
        this.field = field;
        this.value = type.parse ? type.parse(op, value, field) : value;
        this.options = options;
        this.type = typeName;
    }
    eval(object) {
        let fieldValue = object[this.field];
        const type = this.type;
        if (type === 'string') {
            fieldValue ??= '';
        }
        if (fieldValue === undefined) {
            return false;
        }
        if (typeof fieldValue === 'string') {
            fieldValue = fieldValue.toLowerCase();
        }
        if (type === 'number' && this.options) {
            if (this.options.outflow) {
                if (fieldValue > 0) {
                    return false;
                }
                fieldValue = -fieldValue;
            }
            else if (this.options.inflow) {
                if (fieldValue < 0) {
                    return false;
                }
            }
        }
        const extractValue = v => (type === 'number' ? v.value : v);
        switch (this.op) {
            case 'isapprox':
            case 'is':
                if (type === 'date') {
                    if (fieldValue == null) {
                        return false;
                    }
                    if (this.value.type === 'recur') {
                        const { schedule } = this.value;
                        if (this.op === 'isapprox') {
                            const fieldDate = (0, months_1.parseDate)(fieldValue);
                            return schedule.occursBetween(dateFns.subDays(fieldDate, 2), dateFns.addDays(fieldDate, 2));
                        }
                        else {
                            return schedule.occursOn({ date: (0, months_1.parseDate)(fieldValue) });
                        }
                    }
                    else {
                        const { date } = this.value;
                        if (this.op === 'isapprox') {
                            const fullDate = (0, months_1.parseDate)(date);
                            const high = (0, months_1.addDays)(fullDate, 2);
                            const low = (0, months_1.subDays)(fullDate, 2);
                            return fieldValue >= low && fieldValue <= high;
                        }
                        else {
                            switch (this.value.type) {
                                case 'date':
                                    return fieldValue === date;
                                case 'month':
                                    return (0, months_1.monthFromDate)(fieldValue) === date;
                                case 'year':
                                    return (0, months_1.yearFromDate)(fieldValue) === date;
                                default:
                            }
                        }
                    }
                }
                else if (type === 'number') {
                    const number = this.value.value;
                    if (this.op === 'isapprox') {
                        const threshold = (0, rules_1.getApproxNumberThreshold)(number);
                        return (fieldValue >= number - threshold &&
                            fieldValue <= number + threshold);
                    }
                    return fieldValue === number;
                }
                return fieldValue === this.value;
            case 'isNot':
                return fieldValue !== this.value;
            case 'isbetween': {
                // The parsing logic already checks that the value is of the
                // right type (only numbers with high and low)
                const [low, high] = (0, rules_1.sortNumbers)(this.value.num1, this.value.num2);
                return fieldValue >= low && fieldValue <= high;
            }
            case 'contains':
                if (fieldValue === null) {
                    return false;
                }
                return String(fieldValue).indexOf(this.value) !== -1;
            case 'doesNotContain':
                if (fieldValue === null) {
                    return false;
                }
                return String(fieldValue).indexOf(this.value) === -1;
            case 'oneOf':
                if (fieldValue === null) {
                    return false;
                }
                return this.value.indexOf(fieldValue) !== -1;
            case 'hasTags':
                if (fieldValue === null) {
                    return false;
                }
                return String(fieldValue).indexOf(this.value) !== -1;
            case 'notOneOf':
                if (fieldValue === null) {
                    return false;
                }
                return this.value.indexOf(fieldValue) === -1;
            case 'gt':
                if (fieldValue === null) {
                    return false;
                }
                else if (type === 'date') {
                    return (0, months_1.isAfter)(fieldValue, this.value.date);
                }
                return fieldValue > extractValue(this.value);
            case 'gte':
                if (fieldValue === null) {
                    return false;
                }
                else if (type === 'date') {
                    return (fieldValue === this.value.date ||
                        (0, months_1.isAfter)(fieldValue, this.value.date));
                }
                return fieldValue >= extractValue(this.value);
            case 'lt':
                if (fieldValue === null) {
                    return false;
                }
                else if (type === 'date') {
                    return (0, months_1.isBefore)(fieldValue, this.value.date);
                }
                return fieldValue < extractValue(this.value);
            case 'lte':
                if (fieldValue === null) {
                    return false;
                }
                else if (type === 'date') {
                    return (fieldValue === this.value.date ||
                        (0, months_1.isBefore)(fieldValue, this.value.date));
                }
                return fieldValue <= extractValue(this.value);
            case 'matches':
                if (fieldValue === null) {
                    return false;
                }
                try {
                    return new RegExp(this.value).test(fieldValue);
                }
                catch (e) {
                    log_1.logger.log('invalid regexp in matches condition', e);
                    return false;
                }
            case 'onBudget':
                if (!object._account) {
                    return false;
                }
                return object._account.offbudget === 0;
            case 'offBudget':
                if (!object._account) {
                    return false;
                }
                return object._account.offbudget === 1;
            default:
        }
        return false;
    }
    getValue() {
        return this.value;
    }
    serialize() {
        return {
            op: this.op,
            field: this.field,
            value: this.unparsedValue,
            type: this.type,
            ...(this.options ? { options: this.options } : null),
        };
    }
}
exports.Condition = Condition;
//# sourceMappingURL=condition.js.map