import { convertForInsert, convertForUpdate, convertFromSelect, schema, schemaConfig, } from './aql';
import { ValidationError } from './errors';
export function requiredFields(name, row, fields, update) {
    fields.forEach(field => {
        if (update) {
            if (row.hasOwnProperty(field) && row[field] == null) {
                throw new ValidationError(`${name} is missing field ${String(field)}`);
            }
        }
        else {
            if (!row.hasOwnProperty(field) || row[field] == null) {
                throw new ValidationError(`${name} is missing field ${String(field)}`);
            }
        }
    });
}
export function toDateRepr(str) {
    if (typeof str !== 'string') {
        throw new Error('toDateRepr not passed a string: ' + str);
    }
    return parseInt(str.replace(/-/g, ''));
}
export function fromDateRepr(number) {
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
export const accountModel = {
    validate(account, { update } = {}) {
        requiredFields('account', account, update ? ['name', 'offbudget', 'closed'] : ['name'], update);
        return account;
    },
};
export const categoryModel = {
    validate(category, { update } = {}) {
        requiredFields('category', category, update ? ['name', 'is_income', 'cat_group'] : ['name', 'cat_group'], update);
        const { sort_order, ...rest } = category;
        return { ...rest };
    },
    toDb(category, { update } = {}) {
        return (update
            ? convertForUpdate(schema, schemaConfig, 'categories', category)
            : convertForInsert(schema, schemaConfig, 'categories', category));
    },
    fromDb(category) {
        return convertFromSelect(schema, schemaConfig, 'categories', category);
    },
};
export const categoryGroupModel = {
    validate(categoryGroup, { update } = {}) {
        requiredFields('categoryGroup', categoryGroup, update ? ['name', 'is_income'] : ['name'], update);
        const { sort_order, ...rest } = categoryGroup;
        return { ...rest };
    },
    toDb(categoryGroup, { update } = {}) {
        return (update
            ? convertForUpdate(schema, schemaConfig, 'category_groups', categoryGroup)
            : convertForInsert(schema, schemaConfig, 'category_groups', categoryGroup));
    },
    fromDb(categoryGroup) {
        const { categories, ...rest } = categoryGroup;
        const categoryGroupEntity = convertFromSelect(schema, schemaConfig, 'category_groups', rest);
        return {
            ...categoryGroupEntity,
            categories: categories
                .filter(category => category.cat_group === categoryGroup.id)
                .map(categoryModel.fromDb),
        };
    },
};
export const payeeModel = {
    validate(payee, { update } = {}) {
        requiredFields('payee', payee, update ? [] : ['name'], update);
        return payee;
    },
    toDb(payee, { update } = {}) {
        return (update
            ? convertForUpdate(schema, schemaConfig, 'payees', payee)
            : convertForInsert(schema, schemaConfig, 'payees', payee));
    },
    fromDb(payee) {
        return convertFromSelect(schema, schemaConfig, 'payees', payee);
    },
};
