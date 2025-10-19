"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payeeModel = exports.categoryGroupModel = exports.categoryModel = exports.accountModel = void 0;
exports.requiredFields = requiredFields;
exports.toDateRepr = toDateRepr;
exports.fromDateRepr = fromDateRepr;
const aql_1 = require("./aql");
const errors_1 = require("./errors");
function requiredFields(name, row, fields, update) {
    fields.forEach(field => {
        if (update) {
            if (row.hasOwnProperty(field) && row[field] == null) {
                throw new errors_1.ValidationError(`${name} is missing field ${String(field)}`);
            }
        }
        else {
            if (!row.hasOwnProperty(field) || row[field] == null) {
                throw new errors_1.ValidationError(`${name} is missing field ${String(field)}`);
            }
        }
    });
}
function toDateRepr(str) {
    if (typeof str !== 'string') {
        throw new Error('toDateRepr not passed a string: ' + str);
    }
    return parseInt(str.replace(/-/g, ''));
}
function fromDateRepr(number) {
    if (typeof number !== 'number') {
        throw new Error('fromDateRepr not passed a number: ' + number);
    }
    const dateString = number.toString();
    return (dateString.slice(0, 4) +
        '-' +
        dateString.slice(4, 6) +
        '-' +
        dateString.slice(6));
}
exports.accountModel = {
    validate(account, { update } = {}) {
        requiredFields('account', account, update ? ['name', 'offbudget', 'closed'] : ['name'], update);
        return account;
    },
};
exports.categoryModel = {
    validate(category, { update } = {}) {
        requiredFields('category', category, update ? ['name', 'is_income', 'cat_group'] : ['name', 'cat_group'], update);
        const { sort_order, ...rest } = category;
        return { ...rest };
    },
    toDb(category, { update } = {}) {
        return (update
            ? (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, 'categories', category)
            : (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, 'categories', category));
    },
    fromDb(category) {
        return (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, 'categories', category);
    },
};
exports.categoryGroupModel = {
    validate(categoryGroup, { update } = {}) {
        requiredFields('categoryGroup', categoryGroup, update ? ['name', 'is_income'] : ['name'], update);
        const { sort_order, ...rest } = categoryGroup;
        return { ...rest };
    },
    toDb(categoryGroup, { update } = {}) {
        return (update
            ? (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, 'category_groups', categoryGroup)
            : (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, 'category_groups', categoryGroup));
    },
    fromDb(categoryGroup) {
        const { categories, ...rest } = categoryGroup;
        const categoryGroupEntity = (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, 'category_groups', rest);
        return {
            ...categoryGroupEntity,
            categories: categories
                .filter(category => category.cat_group === categoryGroup.id)
                .map(exports.categoryModel.fromDb),
        };
    },
};
exports.payeeModel = {
    validate(payee, { update } = {}) {
        requiredFields('payee', payee, update ? [] : ['name'], update);
        return payee;
    },
    toDb(payee, { update } = {}) {
        return (update
            ? (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, 'payees', payee)
            : (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, 'payees', payee));
    },
    fromDb(payee) {
        return (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, 'payees', payee);
    },
};
