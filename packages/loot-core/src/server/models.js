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
exports.payeeModel = exports.categoryGroupModel = exports.categoryModel = exports.accountModel = void 0;
exports.requiredFields = requiredFields;
exports.toDateRepr = toDateRepr;
exports.fromDateRepr = fromDateRepr;
var aql_1 = require("./aql");
var errors_1 = require("./errors");
function requiredFields(name, row, fields, update) {
    fields.forEach(function (field) {
        if (update) {
            if (row.hasOwnProperty(field) && row[field] == null) {
                throw new errors_1.ValidationError("".concat(name, " is missing field ").concat(String(field)));
            }
        }
        else {
            if (!row.hasOwnProperty(field) || row[field] == null) {
                throw new errors_1.ValidationError("".concat(name, " is missing field ").concat(String(field)));
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
    var dateString = number.toString();
    return (dateString.slice(0, 4) +
        '-' +
        dateString.slice(4, 6) +
        '-' +
        dateString.slice(6));
}
exports.accountModel = {
    validate: function (account, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        requiredFields('account', account, update ? ['name', 'offbudget', 'closed'] : ['name'], update);
        return account;
    },
};
exports.categoryModel = {
    validate: function (category, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        requiredFields('category', category, update ? ['name', 'is_income', 'cat_group'] : ['name', 'cat_group'], update);
        var sort_order = category.sort_order, rest = __rest(category, ["sort_order"]);
        return __assign({}, rest);
    },
    toDb: function (category, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        return (update
            ? (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, 'categories', category)
            : (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, 'categories', category));
    },
    fromDb: function (category) {
        return (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, 'categories', category);
    },
};
exports.categoryGroupModel = {
    validate: function (categoryGroup, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        requiredFields('categoryGroup', categoryGroup, update ? ['name', 'is_income'] : ['name'], update);
        var sort_order = categoryGroup.sort_order, rest = __rest(categoryGroup, ["sort_order"]);
        return __assign({}, rest);
    },
    toDb: function (categoryGroup, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        return (update
            ? (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, 'category_groups', categoryGroup)
            : (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, 'category_groups', categoryGroup));
    },
    fromDb: function (categoryGroup) {
        var categories = categoryGroup.categories, rest = __rest(categoryGroup, ["categories"]);
        var categoryGroupEntity = (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, 'category_groups', rest);
        return __assign(__assign({}, categoryGroupEntity), { categories: categories
                .filter(function (category) { return category.cat_group === categoryGroup.id; })
                .map(exports.categoryModel.fromDb) });
    },
};
exports.payeeModel = {
    validate: function (payee, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        requiredFields('payee', payee, update ? [] : ['name'], update);
        return payee;
    },
    toDb: function (payee, _a) {
        var _b = _a === void 0 ? {} : _a, update = _b.update;
        return (update
            ? (0, aql_1.convertForUpdate)(aql_1.schema, aql_1.schemaConfig, 'payees', payee)
            : (0, aql_1.convertForInsert)(aql_1.schema, aql_1.schemaConfig, 'payees', payee));
    },
    fromDb: function (payee) {
        return (0, aql_1.convertFromSelect)(aql_1.schema, aql_1.schemaConfig, 'payees', payee);
    },
};
