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
exports.Condition = exports.CONDITION_TYPES = void 0;
// @ts-strict-ignore
var dateFns = require("date-fns");
var log_1 = require("../../platform/server/log");
var months_1 = require("../../shared/months");
var rules_1 = require("../../shared/rules");
var rule_utils_1 = require("./rule-utils");
exports.CONDITION_TYPES = {
    date: {
        ops: ['is', 'isapprox', 'gt', 'gte', 'lt', 'lte'],
        nullable: false,
        parse: function (op, value, fieldName) {
            var parsed = typeof value === 'string'
                ? (0, rule_utils_1.parseDateString)(value)
                : value.frequency != null
                    ? (0, rule_utils_1.parseRecurDate)(value)
                    : null;
            (0, rule_utils_1.assert)(parsed, 'date-format', "Invalid date format (field: ".concat(fieldName, ")"));
            // Approximate only works with exact & recurring dates
            if (op === 'isapprox') {
                (0, rule_utils_1.assert)(parsed.type === 'date' || parsed.type === 'recur', 'date-format', "Invalid date value for \u201Cisapprox\u201D (field: ".concat(fieldName, ")"));
            }
            // These only work with exact dates
            else if (op === 'gt' || op === 'gte' || op === 'lt' || op === 'lte') {
                (0, rule_utils_1.assert)(parsed.type === 'date', 'date-format', "Invalid date value for \u201C".concat(op, "\u201D (field: ").concat(fieldName, ")"));
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
        parse: function (op, value, fieldName) {
            if (op === 'oneOf' || op === 'notOneOf' || op === 'and') {
                (0, rule_utils_1.assert)(Array.isArray(value), 'no-empty-array', "oneOf must have an array value (field: ".concat(fieldName, ")"));
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
        parse: function (op, value, fieldName) {
            if (op === 'oneOf' || op === 'notOneOf') {
                (0, rule_utils_1.assert)(Array.isArray(value), 'no-empty-array', "oneOf must have an array value (field: ".concat(fieldName, "): ").concat(JSON.stringify(value)));
                return value.filter(Boolean).map(function (val) { return val.toLowerCase(); });
            }
            (0, rule_utils_1.assert)(typeof value === 'string', 'not-string', "Invalid string value (field: ".concat(fieldName, ")"));
            if (op === 'contains' ||
                op === 'matches' ||
                op === 'doesNotContain' ||
                op === 'hasTags') {
                (0, rule_utils_1.assert)(value.length > 0, 'no-empty-string', "".concat(op, " must have non-empty string (field: ").concat(fieldName, ")"));
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
        parse: function (op, value, fieldName) {
            var parsed = typeof value === 'number'
                ? { type: 'literal', value: value }
                : (0, rule_utils_1.parseBetweenAmount)(value);
            (0, rule_utils_1.assert)(parsed != null, 'not-number', "Value must be a number or between amount: ".concat(JSON.stringify(value), " (field: ").concat(fieldName, ")"));
            if (op === 'isbetween') {
                (0, rule_utils_1.assert)(parsed.type === 'between', 'number-format', "Invalid between value for \u201C".concat(op, "\u201D (field: ").concat(fieldName, ")"));
            }
            else {
                (0, rule_utils_1.assert)(parsed.type === 'literal', 'number-format', "Invalid number value for \u201C".concat(op, "\u201D (field: ").concat(fieldName, ")"));
            }
            return parsed;
        },
    },
    boolean: {
        ops: ['is'],
        nullable: false,
        parse: function (op, value, fieldName) {
            (0, rule_utils_1.assert)(typeof value === 'boolean', 'not-boolean', "Value must be a boolean: ".concat(value, " (field: ").concat(fieldName, ")"));
            return value;
        },
    },
};
var Condition = /** @class */ (function () {
    function Condition(op, field, value, options) {
        var typeName = rules_1.FIELD_TYPES.get(field);
        (0, rule_utils_1.assert)(typeName, 'internal', 'Invalid condition field: ' + field);
        var type = exports.CONDITION_TYPES[typeName];
        // It's important to validate rules because a faulty rule might mess
        // up the user's transaction (and be very confusing)
        (0, rule_utils_1.assert)(type, 'internal', "Invalid condition type: ".concat(typeName, " (field: ").concat(field, ")"));
        (0, rule_utils_1.assert)((0, rules_1.isValidOp)(field, op), 'internal', "Invalid condition operator: ".concat(op, " (type: ").concat(typeName, ", field: ").concat(field, ")"));
        if (type.nullable !== true) {
            (0, rule_utils_1.assert)(value != null, 'no-null', "Field cannot be empty: ".concat(field));
        }
        // For strings, an empty string is equal to null
        if (typeName === 'string' && type.nullable !== true) {
            (0, rule_utils_1.assert)(value !== '', 'no-null', "Field cannot be empty: ".concat(field));
        }
        this.rawValue = value;
        this.unparsedValue = value;
        this.op = op;
        this.field = field;
        this.value = type.parse ? type.parse(op, value, field) : value;
        this.options = options;
        this.type = typeName;
    }
    Condition.prototype.eval = function (object) {
        var fieldValue = object[this.field];
        var type = this.type;
        if (type === 'string') {
            fieldValue !== null && fieldValue !== void 0 ? fieldValue : (fieldValue = '');
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
        var extractValue = function (v) { return (type === 'number' ? v.value : v); };
        switch (this.op) {
            case 'isapprox':
            case 'is':
                if (type === 'date') {
                    if (fieldValue == null) {
                        return false;
                    }
                    if (this.value.type === 'recur') {
                        var schedule = this.value.schedule;
                        if (this.op === 'isapprox') {
                            var fieldDate = (0, months_1.parseDate)(fieldValue);
                            return schedule.occursBetween(dateFns.subDays(fieldDate, 2), dateFns.addDays(fieldDate, 2));
                        }
                        else {
                            return schedule.occursOn({ date: (0, months_1.parseDate)(fieldValue) });
                        }
                    }
                    else {
                        var date = this.value.date;
                        if (this.op === 'isapprox') {
                            var fullDate = (0, months_1.parseDate)(date);
                            var high = (0, months_1.addDays)(fullDate, 2);
                            var low = (0, months_1.subDays)(fullDate, 2);
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
                    var number = this.value.value;
                    if (this.op === 'isapprox') {
                        var threshold = (0, rules_1.getApproxNumberThreshold)(number);
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
                var _a = (0, rules_1.sortNumbers)(this.value.num1, this.value.num2), low = _a[0], high = _a[1];
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
    };
    Condition.prototype.getValue = function () {
        return this.value;
    };
    Condition.prototype.serialize = function () {
        return __assign({ op: this.op, field: this.field, value: this.unparsedValue, type: this.type }, (this.options ? { options: this.options } : null));
    };
    return Condition;
}());
exports.Condition = Condition;
