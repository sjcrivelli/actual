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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category_group = exports.category = exports.account = exports.payee = exports.makeTransactionArray = void 0;
exports.typeArbitrary = typeArbitrary;
exports.flattenSortTransactions = flattenSortTransactions;
exports.makeTransaction = makeTransaction;
// @ts-strict-ignore
var fast_check_1 = require("fast-check");
var aql_1 = require("../server/aql");
var months_1 = require("../shared/months");
function typeArbitrary(typeDesc, name) {
    var arb;
    switch (typeDesc.type) {
        case 'id':
            arb = fast_check_1.default.uuid();
            break;
        case 'boolean':
            arb = fast_check_1.default.boolean();
            break;
        case 'integer':
            arb = fast_check_1.default.integer();
            break;
        case 'float':
            arb = fast_check_1.default.float();
            break;
        case 'string':
            arb = fast_check_1.default.string();
            break;
        case 'date':
            arb = fast_check_1.default.integer({ min: 0, max: 365 * 4 }).map(function (n) {
                return (0, months_1.addDays)('2018-01-01', n);
            });
            break;
        case 'json':
            arb = fast_check_1.default.constant(null);
            break;
        default:
            throw new Error('Unknown schema field type: ' + typeDesc.type);
    }
    if (!typeDesc.required && name !== 'id') {
        return fast_check_1.default.option(arb).map(function (val) {
            if (val == null) {
                if (typeDesc.default !== undefined) {
                    return typeof typeDesc.default === 'function'
                        ? typeDesc.default()
                        : typeDesc.default;
                }
                else if (typeDesc.type === 'boolean') {
                    return false;
                }
            }
            return val;
        });
    }
    return arb;
}
function flattenSortTransactions(arr) {
    var flattened = arr.reduce(function (list, trans) {
        var subtransactions = trans.subtransactions, fields = __rest(trans, ["subtransactions"]);
        if (subtransactions.length > 0) {
            list.push(__assign(__assign({}, fields), { is_parent: true, is_child: false, parent_id: null }));
            subtransactions.forEach(function (subtrans) {
                list.push(__assign(__assign({}, subtrans), { is_parent: false, is_child: true, parent_id: trans.id, date: trans.date, account: trans.account }));
            });
        }
        else {
            list.push(__assign(__assign({}, fields), { is_parent: false, is_child: false, parent_id: null }));
        }
        return list;
    }, []);
    return flattened.sort(function (t1, t2) {
        if (t1.id < t2.id) {
            return -1;
        }
        else if (t1.id > t2.id) {
            return 1;
        }
        return 0;
    });
}
function tableArbitrary(tableSchema, extraArbs, requiredKeys) {
    if (requiredKeys === void 0) { requiredKeys = []; }
    var arb = fast_check_1.default.record(__assign(__assign(__assign({}, Object.fromEntries(Object.entries(tableSchema).map(function (_a) {
        var name = _a[0], field = _a[1];
        return [name, typeArbitrary(field, name)];
    }))), { 
        // Override the amount to make it a smaller integer
        amount: fast_check_1.default.integer({ min: -1000000, max: 1000000 }) }), extraArbs), {
        requiredKeys: __spreadArray(__spreadArray([
            'id'
        ], requiredKeys, true), Object.keys(tableSchema).filter(function (name) { return tableSchema[name].required; }), true),
    });
    return arb;
}
function makeTransaction(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.splitFreq, splitFreq = _c === void 0 ? 1 : _c, payeeIds = _b.payeeIds;
    var payeeField = payeeIds
        ? { payee: fast_check_1.default.oneof.apply(fast_check_1.default, payeeIds.map(function (id) { return fast_check_1.default.constant(id); })) }
        : null;
    var subtrans = tableArbitrary(aql_1.schema.transactions, payeeField);
    return tableArbitrary(aql_1.schema.transactions, __assign(__assign({}, payeeField), { subtransactions: fast_check_1.default.oneof({ arbitrary: fast_check_1.default.constant([]), weight: 100 }, { arbitrary: fast_check_1.default.array(subtrans), weight: splitFreq * 100 }) }), ['subtransactions']);
}
var makeTransactionArray = function (options) {
    if (options === void 0) { options = {}; }
    var minLength = options.minLength, maxLength = options.maxLength, transOpts = __rest(options, ["minLength", "maxLength"]);
    return fast_check_1.default
        .array(makeTransaction(transOpts), { minLength: minLength, maxLength: maxLength })
        .map(function (arr) { return flattenSortTransactions(arr); });
};
exports.makeTransactionArray = makeTransactionArray;
exports.payee = tableArbitrary(aql_1.schema.payees);
exports.account = tableArbitrary(aql_1.schema.accounts);
exports.category = tableArbitrary(aql_1.schema.categories);
exports.category_group = tableArbitrary(aql_1.schema.category_groups);
