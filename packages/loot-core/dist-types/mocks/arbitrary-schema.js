"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category_group = exports.category = exports.account = exports.payee = exports.makeTransactionArray = void 0;
exports.typeArbitrary = typeArbitrary;
exports.flattenSortTransactions = flattenSortTransactions;
exports.makeTransaction = makeTransaction;
// @ts-strict-ignore
const fast_check_1 = __importDefault(require("fast-check"));
const aql_1 = require("../server/aql");
const months_1 = require("../shared/months");
function typeArbitrary(typeDesc, name) {
    let arb;
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
            arb = fast_check_1.default.integer({ min: 0, max: 365 * 4 }).map(n => {
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
        return fast_check_1.default.option(arb).map(val => {
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
    const flattened = arr.reduce((list, trans) => {
        const { subtransactions, ...fields } = trans;
        if (subtransactions.length > 0) {
            list.push({
                ...fields,
                is_parent: true,
                is_child: false,
                parent_id: null,
            });
            subtransactions.forEach(subtrans => {
                list.push({
                    ...subtrans,
                    is_parent: false,
                    is_child: true,
                    parent_id: trans.id,
                    date: trans.date,
                    account: trans.account,
                });
            });
        }
        else {
            list.push({
                ...fields,
                is_parent: false,
                is_child: false,
                parent_id: null,
            });
        }
        return list;
    }, []);
    return flattened.sort((t1, t2) => {
        if (t1.id < t2.id) {
            return -1;
        }
        else if (t1.id > t2.id) {
            return 1;
        }
        return 0;
    });
}
function tableArbitrary(tableSchema, extraArbs, requiredKeys = []) {
    const arb = fast_check_1.default.record({
        ...Object.fromEntries(Object.entries(tableSchema).map(([name, field]) => {
            return [name, typeArbitrary(field, name)];
        })),
        // Override the amount to make it a smaller integer
        amount: fast_check_1.default.integer({ min: -1000000, max: 1000000 }),
        ...extraArbs,
    }, {
        requiredKeys: [
            'id',
            ...requiredKeys,
            ...Object.keys(tableSchema).filter(name => tableSchema[name].required),
        ],
    });
    return arb;
}
function makeTransaction({ splitFreq = 1, payeeIds, } = {}) {
    const payeeField = payeeIds
        ? { payee: fast_check_1.default.oneof(...payeeIds.map(id => fast_check_1.default.constant(id))) }
        : null;
    const subtrans = tableArbitrary(aql_1.schema.transactions, payeeField);
    return tableArbitrary(aql_1.schema.transactions, {
        ...payeeField,
        subtransactions: fast_check_1.default.oneof({ arbitrary: fast_check_1.default.constant([]), weight: 100 }, { arbitrary: fast_check_1.default.array(subtrans), weight: splitFreq * 100 }),
    }, ['subtransactions']);
}
const makeTransactionArray = (options = {}) => {
    const { minLength, maxLength, ...transOpts } = options;
    return fast_check_1.default
        .array(makeTransaction(transOpts), { minLength, maxLength })
        .map(arr => flattenSortTransactions(arr));
};
exports.makeTransactionArray = makeTransactionArray;
exports.payee = tableArbitrary(aql_1.schema.payees);
exports.account = tableArbitrary(aql_1.schema.accounts);
exports.category = tableArbitrary(aql_1.schema.categories);
exports.category_group = tableArbitrary(aql_1.schema.category_groups);
//# sourceMappingURL=arbitrary-schema.js.map