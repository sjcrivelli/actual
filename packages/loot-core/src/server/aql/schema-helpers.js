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
exports.convertInputType = convertInputType;
exports.convertOutputType = convertOutputType;
exports.conform = conform;
exports.convertForInsert = convertForInsert;
exports.convertForUpdate = convertForUpdate;
exports.convertFromSelect = convertFromSelect;
// @ts-strict-ignore
var months_1 = require("../../shared/months");
var models_1 = require("../models");
function isRequired(name, fieldDesc) {
    return fieldDesc.required || name === 'id';
}
// TODO: All of the data type needs to check the input value. This
// doesn't just convert, it casts. See integer handling.
function convertInputType(value, type) {
    if (value === undefined) {
        throw new Error('Query value cannot be undefined');
    }
    else if (value === null) {
        if (type === 'boolean') {
            return 0;
        }
        return null;
    }
    switch (type) {
        case 'date':
            if (value instanceof Date) {
                return (0, models_1.toDateRepr)((0, months_1.dayFromDate)(value));
            }
            else if (value.match(/^\d{4}-\d{2}-\d{2}$/) == null ||
                value.date < '2000-01-01') {
                throw new Error('Invalid date: ' + value);
            }
            return (0, models_1.toDateRepr)(value);
        case 'date-month':
            return (0, models_1.toDateRepr)(value.slice(0, 7));
        case 'date-year':
            return (0, models_1.toDateRepr)(value.slice(0, 4));
        case 'boolean':
            return value ? 1 : 0;
        case 'id':
            if (typeof value !== 'string' && value !== null) {
                throw new Error('Invalid id, must be string: ' + value);
            }
            return value;
        case 'integer':
            if (typeof value === 'number' && Number.isInteger(value)) {
                return value;
            }
            else {
                throw new Error('Can’t convert to integer: ' + JSON.stringify(value));
            }
        case 'json':
            return JSON.stringify(value);
        default:
    }
    return value;
}
function convertOutputType(value, type) {
    if (value === null) {
        if (type === 'boolean') {
            return false;
        }
        return null;
    }
    switch (type) {
        case 'date':
            return (0, models_1.fromDateRepr)(value);
        case 'date-month':
            return (0, models_1.fromDateRepr)(value).slice(0, 7);
        case 'date-year':
            return (0, models_1.fromDateRepr)(value).slice(0, 4);
        case 'boolean':
            return value === 1;
        case 'json':
        case 'json/fallback':
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return type === 'json/fallback' ? value : null;
            }
        default:
    }
    return value;
}
function conform(schema, schemaConfig, table, obj, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.skipNull, skipNull = _c === void 0 ? false : _c;
    var tableSchema = schema[table];
    if (tableSchema == null) {
        throw new Error("Table \u201C".concat(table, "\u201D does not exist"));
    }
    var views = schemaConfig.views || {};
    // Rename fields if necessary
    var fieldRef = function (field) {
        if (views[table] && views[table].fields) {
            return views[table].fields[field] || field;
        }
        return field;
    };
    return Object.fromEntries(Object.keys(obj)
        .map(function (field) {
        // Fields that start with an underscore are ignored
        if (field[0] === '_') {
            return null;
        }
        var fieldDesc = tableSchema[field];
        if (fieldDesc == null) {
            throw new Error("Field \u201C".concat(field, "\u201D does not exist on table ").concat(table, ": ").concat(JSON.stringify(obj)));
        }
        if (isRequired(field, fieldDesc) && obj[field] == null) {
            throw new Error("\u201C".concat(field, "\u201D is required for table \u201C").concat(table, "\u201D: ").concat(JSON.stringify(obj)));
        }
        // This option removes null values (see `convertForInsert`)
        if (skipNull && obj[field] == null) {
            return null;
        }
        return [fieldRef(field), convertInputType(obj[field], fieldDesc.type)];
    })
        .filter(Boolean));
}
function convertForInsert(schema, schemaConfig, table, rawObj) {
    var obj = __assign({}, rawObj);
    var tableSchema = schema[table];
    if (tableSchema == null) {
        throw new Error("Error inserting: table \u201C".concat(table, "\u201D does not exist"));
    }
    // Inserting checks all the fields in the table and adds any default
    // values necessary
    Object.keys(tableSchema).forEach(function (field) {
        var fieldDesc = tableSchema[field];
        if (obj[field] == null) {
            if (fieldDesc.default !== undefined) {
                obj[field] =
                    typeof fieldDesc.default === 'function'
                        ? fieldDesc.default()
                        : fieldDesc.default;
            }
            else if (isRequired(field, fieldDesc)) {
                // Although this check is also done in `conform`, it only
                // checks the fields in `obj`. For insert, we need to do it
                // here to check that all required fields in the table exist
                throw new Error("\u201C".concat(field, "\u201D is required for table \u201C").concat(table, "\u201D: ").concat(JSON.stringify(obj)));
            }
        }
    });
    // We use `skipNull` to remove any null values. There's no need to
    // set those when inserting, that will be the default and it reduces
    // the amount of messages generated to sync
    return conform(schema, schemaConfig, table, obj, { skipNull: true });
}
function convertForUpdate(schema, schemaConfig, table, rawObj) {
    var obj = __assign({}, rawObj);
    var tableSchema = schema[table];
    if (tableSchema == null) {
        throw new Error("Error updating: table \u201C".concat(table, "\u201D does not exist"));
    }
    return conform(schema, schemaConfig, table, obj);
}
function convertFromSelect(schema, schemaConfig, table, obj) {
    var tableSchema = schema[table];
    if (tableSchema == null) {
        throw new Error("Table \u201C".concat(table, "\u201D does not exist"));
    }
    var fields = Object.keys(tableSchema);
    var result = {};
    for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i];
        var fieldDesc = tableSchema[fieldName];
        result[fieldName] = convertOutputType(obj[fieldName], fieldDesc.type);
    }
    return result;
}
