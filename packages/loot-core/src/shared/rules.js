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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIELD_TYPES = void 0;
exports.isValidOp = isValidOp;
exports.getValidOps = getValidOps;
exports.getAllocationMethods = getAllocationMethods;
exports.mapField = mapField;
exports.friendlyOp = friendlyOp;
exports.translateRuleStage = translateRuleStage;
exports.deserializeField = deserializeField;
exports.getFieldError = getFieldError;
exports.sortNumbers = sortNumbers;
exports.parse = parse;
exports.unparse = unparse;
exports.makeValue = makeValue;
exports.getApproxNumberThreshold = getApproxNumberThreshold;
// @ts-strict-ignore
var i18next_1 = require("i18next");
// For now, this info is duplicated from the backend. Figure out how
// to share it later.
var TYPE_INFO = {
    date: {
        ops: ['is', 'isapprox', 'gt', 'gte', 'lt', 'lte'],
        nullable: false,
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
            'onBudget',
            'offBudget',
        ],
        nullable: true,
    },
    saved: {
        ops: [],
        nullable: false,
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
    },
    number: {
        ops: ['is', 'isapprox', 'isbetween', 'gt', 'gte', 'lt', 'lte'],
        nullable: false,
    },
    boolean: {
        ops: ['is'],
        nullable: false,
    },
};
var FIELD_INFO = {
    imported_payee: {
        type: 'string',
        disallowedOps: new Set(['hasTags']),
    },
    payee: { type: 'id', disallowedOps: new Set(['onBudget', 'offBudget']) },
    payee_name: { type: 'string' },
    date: { type: 'date' },
    notes: { type: 'string' },
    amount: { type: 'number' },
    category: {
        type: 'id',
        disallowedOps: new Set(['onBudget', 'offBudget']),
        internalOps: new Set(['and']),
    },
    account: { type: 'id' },
    cleared: { type: 'boolean' },
    reconciled: { type: 'boolean' },
    saved: { type: 'saved' },
    transfer: { type: 'boolean' },
    parent: { type: 'boolean' },
};
var fieldInfo = FIELD_INFO;
exports.FIELD_TYPES = new Map(Object.entries(FIELD_INFO).map(function (_a) {
    var field = _a[0], info = _a[1];
    return [
        field,
        info.type,
    ];
}));
function isValidOp(field, op) {
    var _a, _b;
    var type = exports.FIELD_TYPES.get(field);
    if (!type)
        return false;
    if ((_a = fieldInfo[field].disallowedOps) === null || _a === void 0 ? void 0 : _a.has(op))
        return false;
    return (TYPE_INFO[type].ops.includes(op) || ((_b = fieldInfo[field].internalOps) === null || _b === void 0 ? void 0 : _b.has(op)));
}
function getValidOps(field) {
    var type = exports.FIELD_TYPES.get(field);
    if (!type) {
        return [];
    }
    return TYPE_INFO[type].ops.filter(function (op) { var _a; return !((_a = fieldInfo[field].disallowedOps) === null || _a === void 0 ? void 0 : _a.has(op)); });
}
function getAllocationMethods() {
    return {
        'fixed-amount': (0, i18next_1.t)('a fixed amount'),
        'fixed-percent': (0, i18next_1.t)('a fixed percent of the remainder'),
        remainder: (0, i18next_1.t)('an equal portion of the remainder'),
    };
}
function mapField(field, opts) {
    opts = opts || {};
    switch (field) {
        case 'imported_payee':
            return (0, i18next_1.t)('imported payee');
        case 'payee_name':
            return (0, i18next_1.t)('payee (name)');
        case 'amount':
            if (opts.inflow) {
                return (0, i18next_1.t)('amount (inflow)');
            }
            else if (opts.outflow) {
                return (0, i18next_1.t)('amount (outflow)');
            }
            return (0, i18next_1.t)('amount');
        case 'amount-inflow':
            return (0, i18next_1.t)('amount (inflow)');
        case 'amount-outflow':
            return (0, i18next_1.t)('amount (outflow)');
        case 'account':
            return (0, i18next_1.t)('account');
        case 'date':
            return (0, i18next_1.t)('date');
        case 'category':
            return (0, i18next_1.t)('category');
        case 'notes':
            return (0, i18next_1.t)('notes');
        case 'payee':
            return (0, i18next_1.t)('payee');
        case 'saved':
            return (0, i18next_1.t)('saved');
        case 'cleared':
            return (0, i18next_1.t)('cleared');
        case 'reconciled':
            return (0, i18next_1.t)('reconciled');
        case 'transfer':
            return (0, i18next_1.t)('transfer');
        default:
            return field;
    }
}
function friendlyOp(op, type) {
    switch (op) {
        case 'oneOf':
            return (0, i18next_1.t)('one of');
        case 'notOneOf':
            return (0, i18next_1.t)('not one of');
        case 'is':
            return (0, i18next_1.t)('is');
        case 'isNot':
            return (0, i18next_1.t)('is not');
        case 'isapprox':
            return (0, i18next_1.t)('is approx');
        case 'isbetween':
            return (0, i18next_1.t)('is between');
        case 'contains':
            return (0, i18next_1.t)('contains');
        case 'hasTags':
            return (0, i18next_1.t)('has tags');
        case 'matches':
            return (0, i18next_1.t)('matches');
        case 'doesNotContain':
            return (0, i18next_1.t)('does not contain');
        case 'gt':
            if (type === 'date') {
                return (0, i18next_1.t)('is after');
            }
            return (0, i18next_1.t)('is greater than');
        case 'gte':
            if (type === 'date') {
                return (0, i18next_1.t)('is after or equals');
            }
            return (0, i18next_1.t)('is greater than or equals');
        case 'lt':
            if (type === 'date') {
                return (0, i18next_1.t)('is before');
            }
            return (0, i18next_1.t)('is less than');
        case 'lte':
            if (type === 'date') {
                return (0, i18next_1.t)('is before or equals');
            }
            return (0, i18next_1.t)('is less than or equals');
        case 'true':
            return (0, i18next_1.t)('is true');
        case 'false':
            return (0, i18next_1.t)('is false');
        case 'set':
            return (0, i18next_1.t)('set');
        case 'set-split-amount':
            return (0, i18next_1.t)('allocate');
        case 'link-schedule':
            return (0, i18next_1.t)('link schedule');
        case 'prepend-notes':
            return (0, i18next_1.t)('prepend to notes');
        case 'append-notes':
            return (0, i18next_1.t)('append to notes');
        case 'and':
            return (0, i18next_1.t)('and');
        case 'or':
            return (0, i18next_1.t)('or');
        case 'onBudget':
            return (0, i18next_1.t)('is on budget');
        case 'offBudget':
            return (0, i18next_1.t)('is off budget');
        case 'delete-transaction':
            return 'delete transaction';
        default:
            return '';
    }
}
function translateRuleStage(stage) {
    switch (stage) {
        case 'pre':
            return (0, i18next_1.t)('Pre');
        case 'post':
            return (0, i18next_1.t)('Post');
        default:
            return '';
    }
}
function deserializeField(field) {
    if (field === 'amount-inflow') {
        return { field: 'amount', options: { inflow: true } };
    }
    else if (field === 'amount-outflow') {
        return { field: 'amount', options: { outflow: true } };
    }
    else {
        return { field: field };
    }
}
function getFieldError(type) {
    switch (type) {
        case 'date-format':
            return 'Invalid date format';
        case 'no-null':
        case 'no-empty-array':
        case 'no-empty-string':
            return 'Value cannot be empty';
        case 'not-string':
            return 'Value must be a string';
        case 'not-boolean':
            return 'Value must be a boolean';
        case 'not-number':
            return 'Value must be a number';
        case 'invalid-field':
            return 'Please choose a valid field for this type of rule';
        case 'invalid-template':
            return 'Invalid handlebars template';
        default:
            return 'Internal error, sorry! Please get in touch https://actualbudget.org/contact/ for support';
    }
}
function sortNumbers(num1, num2) {
    if (num1 < num2) {
        return [num1, num2];
    }
    return [num2, num1];
}
function parse(item) {
    if (item.op === 'set-split-amount') {
        if (item.options.method === 'fixed-amount') {
            return __assign({}, item);
        }
        return item;
    }
    switch (item.type) {
        case 'number': {
            return __assign({}, item);
        }
        case 'string': {
            var parsed = item.value == null ? '' : item.value;
            return __assign(__assign({}, item), { value: parsed });
        }
        case 'boolean': {
            var parsed = item.value;
            return __assign(__assign({}, item), { value: parsed });
        }
        default:
    }
    return __assign(__assign({}, item), { error: null });
}
function unparse(_a) {
    var error = _a.error, inputKey = _a.inputKey, item = __rest(_a, ["error", "inputKey"]);
    if (item.op === 'set-split-amount') {
        if (item.options.method === 'fixed-amount') {
            return __assign({}, item);
        }
        if (item.options.method === 'fixed-percent') {
            return __assign(__assign({}, item), { value: item.value && parseFloat(item.value) });
        }
        return item;
    }
    switch (item.type) {
        case 'number': {
            return __assign({}, item);
        }
        case 'string': {
            var unparsed = item.value == null ? '' : item.value;
            return __assign(__assign({}, item), { value: unparsed });
        }
        case 'boolean': {
            var unparsed = item.value == null ? false : item.value;
            return __assign(__assign({}, item), { value: unparsed });
        }
        default:
    }
    return item;
}
function makeValue(value, cond) {
    var isMulti = ['oneOf', 'notOneOf'].includes(cond.op);
    if (isMulti) {
        return __assign(__assign({}, cond), { error: null, value: value || [] });
    }
    if (cond.type === 'number' && value == null) {
        return __assign(__assign({}, cond), { error: null, value: 0 });
    }
    return __assign(__assign({}, cond), { error: null, value: value });
}
function getApproxNumberThreshold(number) {
    return Math.round(Math.abs(number) * 0.075);
}
