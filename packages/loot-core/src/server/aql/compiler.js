"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.quoteAlias = quoteAlias;
exports.isAggregateQuery = isAggregateQuery;
exports.compileQuery = compileQuery;
exports.defaultConstructQuery = defaultConstructQuery;
exports.generateSQLWithState = generateSQLWithState;
var normalisation_1 = require("../../shared/normalisation");
// @ts-strict-ignore
var _uid = 0;
function resetUid() {
    _uid = 0;
}
function uid(tableName) {
    _uid++;
    return tableName + _uid;
}
var CompileError = /** @class */ (function (_super) {
    __extends(CompileError, _super);
    function CompileError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CompileError;
}(Error));
function nativeDateToInt(date) {
    var pad = function (x) { return (x < 10 ? '0' : '') + x; };
    return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate());
}
function dateToInt(date) {
    return parseInt(date.replace(/-/g, ''));
}
function addTombstone(schema, tableName, tableId, whereStr) {
    var hasTombstone = schema[tableName].tombstone != null;
    return hasTombstone ? "".concat(whereStr, " AND ").concat(tableId, ".tombstone = 0") : whereStr;
}
function popPath(path) {
    var parts = path.split('.');
    return { path: parts.slice(0, -1).join('.'), field: parts[parts.length - 1] };
}
function isKeyword(str) {
    return str === 'group';
}
function quoteAlias(alias) {
    // eslint-disable-next-line actual/typography
    return alias.indexOf('.') === -1 && !isKeyword(alias) ? alias : "\"".concat(alias, "\"");
}
function typed(value, type, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.literal, literal = _c === void 0 ? false : _c;
    return { value: value, type: type, literal: literal };
}
function getFieldDescription(schema, tableName, field) {
    if (schema[tableName] == null) {
        throw new CompileError("Table \u201C".concat(tableName, "\u201D does not exist in the schema"));
    }
    var fieldDesc = schema[tableName][field];
    if (fieldDesc == null) {
        throw new CompileError("Field \u201C".concat(field, "\u201D does not exist in table \u201C").concat(tableName, "\u201D"));
    }
    return fieldDesc;
}
function makePath(state, path) {
    var schema = state.schema, paths = state.paths;
    var parts = path.split('.');
    if (parts.length < 2) {
        throw new CompileError('Invalid path: ' + path);
    }
    var initialTable = parts[0];
    var tableName = parts.slice(1).reduce(function (tableName, field) {
        var table = schema[tableName];
        if (table == null) {
            throw new CompileError("Path error: ".concat(tableName, " table does not exist"));
        }
        if (!table[field] || table[field].ref == null) {
            throw new CompileError("Field not joinable on table ".concat(tableName, ": \u201C").concat(field, "\u201D"));
        }
        return table[field].ref;
    }, initialTable);
    var joinTable;
    var parentParts = parts.slice(0, -1);
    if (parentParts.length === 1) {
        joinTable = parentParts[0];
    }
    else {
        var parentPath = parentParts.join('.');
        var parentDesc = paths.get(parentPath);
        if (!parentDesc) {
            throw new CompileError('Path does not exist: ' + parentPath);
        }
        joinTable = parentDesc.tableId;
    }
    return {
        tableName: tableName,
        tableId: uid(tableName),
        joinField: parts[parts.length - 1],
        joinTable: joinTable,
    };
}
function resolvePath(state, path) {
    var paths = path.split('.');
    paths = paths.reduce(function (acc, name) {
        var fullName = acc.context + '.' + name;
        return {
            context: fullName,
            path: __spreadArray(__spreadArray([], acc.path, true), [fullName], false),
        };
    }, { context: state.implicitTableName, path: [] }).path;
    paths.forEach(function (path) {
        if (!state.paths.get(path)) {
            state.paths.set(path, makePath(state, path));
        }
    });
    var pathInfo = state.paths.get(paths[paths.length - 1]);
    return pathInfo;
}
function transformField(state, name) {
    if (typeof name !== 'string') {
        throw new CompileError('Invalid field name, must be a string');
    }
    var _a = popPath(name), path = _a.path, originalField = _a.field;
    var field = originalField;
    var pathInfo;
    if (path === '') {
        pathInfo = {
            tableName: state.implicitTableName,
            tableId: state.implicitTableId,
        };
    }
    else {
        pathInfo = resolvePath(state, path);
    }
    var fieldDesc = getFieldDescription(state.schema, pathInfo.tableName, field);
    // If this is a field that references an item in another table, that
    // item could have been deleted. If that's the case, we want to
    // return `null` instead of an id pointing to a deleted item. This
    // converts an id reference into a path that pulls the id through a
    // table join which will filter out dead items, resulting in a
    // `null` id if the item is deleted
    if (state.validateRefs &&
        fieldDesc.ref &&
        fieldDesc.type === 'id' &&
        field !== 'id') {
        var refPath = state.implicitTableName + '.' + name;
        var refPathInfo = state.paths.get(refPath);
        if (!refPathInfo) {
            refPathInfo = makePath(state, refPath);
            refPathInfo.noMapping = true;
            state.paths.set(refPath, refPathInfo);
        }
        field = 'id';
        pathInfo = refPathInfo;
    }
    var fieldStr = pathInfo.tableId + '.' + field;
    return typed(fieldStr, fieldDesc.type);
}
function parseDate(str) {
    var m = str.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (m) {
        return typed(dateToInt(m[1]), 'date', { literal: true });
    }
    return null;
}
function parseMonth(str) {
    var m = str.match(/^(\d{4}-\d{2})$/);
    if (m) {
        return typed(dateToInt(m[1]), 'date', { literal: true });
    }
    return null;
}
function parseYear(str) {
    var m = str.match(/^(\d{4})$/);
    if (m) {
        return typed(dateToInt(m[1]), 'date', { literal: true });
    }
    return null;
}
function badDateFormat(str, type) {
    throw new CompileError("Bad ".concat(type, " format: ").concat(str));
}
function inferParam(param, type) {
    var existingType = param.paramType;
    if (existingType) {
        var casts = {
            date: ['string'],
            'date-month': ['date'],
            'date-year': ['date', 'date-month'],
            id: ['string'],
            float: ['integer'],
        };
        if (existingType !== type &&
            (!casts[type] || !casts[type].includes(existingType))) {
            throw new Error("Parameter \u201C".concat(param.paramName, "\u201D can\u2019t convert to ").concat(type, " (already inferred as ").concat(existingType, ")"));
        }
    }
    else {
        param.paramType = type;
    }
}
function castInput(state, expr, type) {
    if (expr.type === type) {
        return expr;
    }
    else if (expr.type === 'param') {
        inferParam(expr, type);
        return typed(expr.value, type);
    }
    else if (expr.type === 'null') {
        if (!expr.literal) {
            throw new CompileError('A non-literal null doesn’t make sense');
        }
        if (type === 'boolean') {
            return typed(0, 'boolean', { literal: true });
        }
        return expr;
    }
    // These are all things that can be safely casted automatically
    if (type === 'date') {
        if (expr.type === 'string') {
            if (expr.literal) {
                return parseDate(expr.value) || badDateFormat(expr.value, 'date');
            }
            else {
                throw new CompileError('Casting string fields to dates is not supported');
            }
        }
        throw new CompileError("Can\u2019t cast ".concat(expr.type, " to date"));
    }
    else if (type === 'date-month') {
        var expr2 = void 0;
        if (expr.type === 'date') {
            expr2 = expr;
        }
        else if (expr.type === 'string' || expr.type === 'any') {
            expr2 =
                parseMonth(expr.value) ||
                    parseDate(expr.value) ||
                    badDateFormat(expr.value, 'date-month');
        }
        else {
            throw new CompileError("Can\u2019t cast ".concat(expr.type, " to date-month"));
        }
        if (expr2.literal) {
            return typed(dateToInt(expr2.value.toString().slice(0, 6)), 'date-month', { literal: true });
        }
        else {
            return typed("CAST(SUBSTR(".concat(expr2.value, ", 1, 6) AS integer)"), 'date-month');
        }
    }
    else if (type === 'date-year') {
        var expr2 = void 0;
        if (expr.type === 'date' || expr.type === 'date-month') {
            expr2 = expr;
        }
        else if (expr.type === 'string') {
            expr2 =
                parseYear(expr.value) ||
                    parseMonth(expr.value) ||
                    parseDate(expr.value) ||
                    badDateFormat(expr.value, 'date-year');
        }
        else {
            throw new CompileError("Can\u2019t cast ".concat(expr.type, " to date-year"));
        }
        if (expr2.literal) {
            return typed(dateToInt(expr2.value.toString().slice(0, 4)), 'date-year', {
                literal: true,
            });
        }
        else {
            return typed("CAST(SUBSTR(".concat(expr2.value, ", 1, 4) AS integer)"), 'date-year');
        }
    }
    else if (type === 'id') {
        if (expr.type === 'string') {
            return typed(expr.value, 'id', { literal: expr.literal });
        }
    }
    else if (type === 'float') {
        if (expr.type === 'integer') {
            return typed(expr.value, 'float', { literal: expr.literal });
        }
    }
    if (expr.type === 'any') {
        return typed(expr.value, type, { literal: expr.literal });
    }
    throw new CompileError("Can\u2019t convert ".concat(expr.type, " to ").concat(type));
}
// TODO: remove state from these functions
function val(state, expr, type) {
    var castedExpr = expr;
    // Cast the type if necessary
    if (type) {
        castedExpr = castInput(state, expr, type);
    }
    if (castedExpr.literal) {
        /* eslint-disable actual/typography */
        if (castedExpr.type === 'id') {
            return "'".concat(castedExpr.value, "'");
        }
        else if (castedExpr.type === 'string') {
            // Escape quotes
            var value = castedExpr.value.replace(/'/g, "''");
            return "'".concat(value, "'");
        }
        /* eslint-enable actual/typography */
    }
    return castedExpr.value;
}
function valArray(state, arr, types) {
    return arr.map(function (value, idx) { return val(state, value, types ? types[idx] : null); });
}
function validateArgLength(arr, min, max) {
    if (max == null) {
        max = min;
    }
    if (min != null && arr.length < min) {
        throw new CompileError('Too few arguments');
    }
    if (max != null && arr.length > max) {
        throw new CompileError('Too many arguments');
    }
}
//// Nice errors
function saveStack(type, func) {
    return function (state) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (state == null || state.compileStack == null) {
            throw new CompileError('This function cannot track error data. ' +
                'It needs to accept the compiler state as the first argument.');
        }
        state.compileStack.push({ type: type, args: args });
        var ret = func.apply(void 0, __spreadArray([state], args, false));
        state.compileStack.pop();
        return ret;
    };
}
function prettyValue(value) {
    if (typeof value === 'string') {
        return value;
    }
    else if (value === undefined) {
        return 'undefined';
    }
    var str = JSON.stringify(value);
    if (str.length > 70) {
        var expanded = JSON.stringify(value, null, 2);
        return expanded.split('\n').join('\n  ');
    }
    return str;
}
function getCompileError(error, stack) {
    if (stack.length === 0) {
        return error;
    }
    var stackStr = stack
        .slice(1)
        .reverse()
        .map(function (entry) {
        var _a;
        switch (entry.type) {
            case 'expr':
            case 'function':
                return prettyValue(entry.args[0]);
            case 'op': {
                var _b = entry.args, fieldRef = _b[0], opData = _b[1];
                return prettyValue((_a = {}, _a[fieldRef] = opData, _a));
            }
            case 'value':
                return prettyValue(entry.value);
            default:
                return '';
        }
    })
        .map(function (str) { return '\n  ' + str; })
        .join('');
    var rootMethod = stack[0].type;
    var methodArgs = stack[0].args[0];
    stackStr += "\n  ".concat(rootMethod, "(").concat(prettyValue(methodArgs.length === 1 ? methodArgs[0] : methodArgs), ")");
    // In production, hide internal stack traces
    if (process.env.NODE_ENV === 'production') {
        var err = new CompileError();
        err.message = "".concat(error.message, "\n\nExpression stack:") + stackStr;
        err.stack = null;
        return err;
    }
    error.message = "".concat(error.message, "\n\nExpression stack:") + stackStr;
    return error;
}
//// Compiler
function compileLiteral(value) {
    if (value === undefined) {
        throw new CompileError('`undefined` is not a valid query value');
    }
    else if (value === null) {
        return typed('NULL', 'null', { literal: true });
    }
    else if (value instanceof Date) {
        return typed(nativeDateToInt(value), 'date', { literal: true });
    }
    else if (typeof value === 'string') {
        // Allow user to escape $, and quote the string to make it a
        // string literal in the output
        value = value.replace(/\\\$/g, '$');
        return typed(value, 'string', { literal: true });
    }
    else if (typeof value === 'boolean') {
        return typed(value ? 1 : 0, 'boolean', { literal: true });
    }
    else if (typeof value === 'number') {
        return typed(value, Number.isInteger(value) ? 'integer' : 'float', {
            literal: true,
        });
    }
    else if (Array.isArray(value)) {
        return typed(value, 'array', { literal: true });
    }
    else {
        throw new CompileError('Unsupported type of expression: ' + JSON.stringify(value));
    }
}
var compileExpr = saveStack('expr', function (state, expr) {
    if (typeof expr === 'string') {
        // Field reference
        if (expr[0] === '$') {
            var fieldRef = expr === '$' ? state.implicitField : expr.slice(1);
            if (fieldRef == null || fieldRef === '') {
                throw new CompileError('Invalid field reference: ' + expr);
            }
            return transformField(state, fieldRef);
        }
        // Named parameter
        if (expr[0] === ':') {
            var param = { value: '?', type: 'param', paramName: expr.slice(1) };
            state.namedParameters.push(param);
            return param;
        }
    }
    if (expr !== null) {
        if (Array.isArray(expr)) {
            return compileLiteral(expr);
        }
        else if (typeof expr === 'object' &&
            Object.keys(expr).find(function (k) { return k[0] === '$'; })) {
            // It's a function call
            return compileFunction(state, expr);
        }
    }
    return compileLiteral(expr);
});
var compileFunction = saveStack('function', function (state, func) {
    var name = Object.keys(func)[0];
    var argExprs = func[name];
    if (!Array.isArray(argExprs)) {
        argExprs = [argExprs];
    }
    if (name[0] !== '$') {
        throw new CompileError("Unknown property \u201C".concat(name, ".\u201D Did you mean to call a function? Try prefixing it with $"));
    }
    var args = argExprs;
    // `$condition` is a special-case where it will be evaluated later
    if (name !== '$condition') {
        args = argExprs.map(function (arg) { return compileExpr(state, arg); });
    }
    switch (name) {
        // aggregate functions
        case '$sum': {
            validateArgLength(args, 1);
            var arg1_1 = valArray(state, args, ['float'])[0];
            return typed("SUM(".concat(arg1_1, ")"), args[0].type);
        }
        case '$sumOver': {
            var arg1_2 = valArray(state, args, ['float'])[0];
            var order = state.orders
                ? 'ORDER BY ' + compileOrderBy(state, state.orders)
                : '';
            return typed("(SUM(".concat(arg1_2, ") OVER (").concat(order, " ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING))"), args[0].type);
        }
        case '$count': {
            validateArgLength(args, 1);
            var arg1_3 = valArray(state, args)[0];
            return typed("COUNT(".concat(arg1_3, ")"), 'integer');
        }
        // string functions
        case '$substr': {
            validateArgLength(args, 2, 3);
            var _a = valArray(state, args, [
                'string',
                'integer',
                'integer',
            ]), arg1_4 = _a[0], arg2 = _a[1], arg3 = _a[2];
            return typed("SUBSTR(".concat(arg1_4, ", ").concat(arg2, ", ").concat(arg3, ")"), 'string');
        }
        case '$lower': {
            validateArgLength(args, 1);
            var arg1_5 = valArray(state, args, ['string'])[0];
            return typed("UNICODE_LOWER(".concat(arg1_5, ")"), 'string');
        }
        // integer/float functions
        case '$neg': {
            validateArgLength(args, 1);
            valArray(state, args, ['float']);
            return typed("(-".concat(val(state, args[0]), ")"), args[0].type);
        }
        case '$abs': {
            validateArgLength(args, 1);
            valArray(state, args, ['float']);
            return typed("ABS(".concat(val(state, args[0]), ")"), args[0].type);
        }
        case '$idiv': {
            validateArgLength(args, 2);
            valArray(state, args, ['integer', 'integer']);
            return typed("(".concat(val(state, args[0]), " / ").concat(val(state, args[1]), ")"), args[0].type);
        }
        // id functions
        case '$id': {
            validateArgLength(args, 1);
            return typed(val(state, args[0]), args[0].type);
        }
        // date functions
        case '$day': {
            validateArgLength(args, 1);
            return castInput(state, args[0], 'date');
        }
        case '$month': {
            validateArgLength(args, 1);
            return castInput(state, args[0], 'date-month');
        }
        case '$year': {
            validateArgLength(args, 1);
            return castInput(state, args[0], 'date-year');
        }
        // various functions
        case '$condition':
            validateArgLength(args, 1);
            var conds = compileConditions(state, args[0]);
            return typed(conds.join(' AND '), 'boolean');
        case '$nocase':
            validateArgLength(args, 1);
            var arg1 = valArray(state, args, ['string'])[0];
            return typed("".concat(arg1, " COLLATE NOCASE"), args[0].type);
        case '$literal': {
            validateArgLength(args, 1);
            if (!args[0].literal) {
                throw new CompileError('Literal not passed to $literal');
            }
            return args[0];
        }
        default:
            throw new CompileError("Unknown function: ".concat(name));
    }
});
var compileOp = saveStack('op', function (state, fieldRef, opData) {
    var _a;
    var $transform = opData.$transform, opExpr = __rest(opData, ["$transform"]);
    var op = Object.keys(opExpr)[0];
    var rhs = compileExpr(state, opData[op]);
    var lhs;
    if ($transform) {
        lhs = compileFunction(__assign(__assign({}, state), { implicitField: fieldRef }), typeof $transform === 'string' ? (_a = {}, _a[$transform] = '$', _a) : $transform);
    }
    else {
        lhs = compileExpr(state, '$' + fieldRef);
    }
    switch (op) {
        case '$gte': {
            var _b = valArray(state, [lhs, rhs], [null, lhs.type]), left = _b[0], right = _b[1];
            return "".concat(left, " >= ").concat(right);
        }
        case '$lte': {
            var _c = valArray(state, [lhs, rhs], [null, lhs.type]), left = _c[0], right = _c[1];
            return "".concat(left, " <= ").concat(right);
        }
        case '$gt': {
            var _d = valArray(state, [lhs, rhs], [null, lhs.type]), left = _d[0], right = _d[1];
            return "".concat(left, " > ").concat(right);
        }
        case '$lt': {
            var _e = valArray(state, [lhs, rhs], [null, lhs.type]), left = _e[0], right = _e[1];
            return "".concat(left, " < ").concat(right);
        }
        case '$eq': {
            if (castInput(state, rhs, lhs.type).type === 'null') {
                return "".concat(val(state, lhs), " IS NULL");
            }
            var _f = valArray(state, [lhs, rhs], [null, lhs.type]), left = _f[0], right = _f[1];
            if (rhs.type === 'param') {
                var orders = state.namedParameters.map(function (param) {
                    return param === rhs || param === lhs ? [param, __assign({}, param)] : param;
                });
                state.namedParameters = [].concat.apply([], orders);
                return "CASE\n          WHEN ".concat(left, " IS NULL THEN ").concat(right, " IS NULL\n          ELSE ").concat(left, " = ").concat(right, "\n        END");
            }
            return "".concat(left, " = ").concat(right);
        }
        case '$ne': {
            if (castInput(state, rhs, lhs.type).type === 'null') {
                return "".concat(val(state, lhs), " IS NOT NULL");
            }
            var _g = valArray(state, [lhs, rhs], [null, lhs.type]), left = _g[0], right = _g[1];
            if (rhs.type === 'param') {
                var orders = state.namedParameters.map(function (param) {
                    return param === rhs || param === lhs ? [param, __assign({}, param)] : param;
                });
                state.namedParameters = [].concat.apply([], orders);
                return "CASE\n          WHEN ".concat(left, " IS NULL THEN ").concat(right, " IS NOT NULL\n          ELSE ").concat(left, " IS NOT ").concat(right, "\n        END");
            }
            return "(".concat(left, " != ").concat(right, " OR ").concat(left, " IS NULL)");
        }
        case '$oneof': {
            var _h = valArray(state, [lhs, rhs], [null, 'array']), left = _h[0], right = _h[1];
            // Dedupe the ids
            var ids = __spreadArray([], new Set(right), true);
            // eslint-disable-next-line actual/typography
            return "".concat(left, " IN (") + ids.map(function (id) { return "'".concat(id, "'"); }).join(',') + ')';
        }
        case '$like': {
            var _j = valArray(state, [lhs, rhs], ['string', 'string']), left = _j[0], right = _j[1];
            return "UNICODE_LIKE(".concat((0, normalisation_1.getNormalisedString)(right), ", NORMALISE(").concat(left, "))");
        }
        case '$regexp': {
            var _k = valArray(state, [lhs, rhs], ['string', 'string']), left = _k[0], right = _k[1];
            return "REGEXP(".concat(right, ", ").concat(left, ")");
        }
        case '$notlike': {
            var _l = valArray(state, [lhs, rhs], ['string', 'string']), left = _l[0], right = _l[1];
            return "(NOT UNICODE_LIKE(".concat((0, normalisation_1.getNormalisedString)(right), ", NORMALISE(").concat(left, "))\n OR ").concat(left, " IS NULL)");
        }
        default:
            throw new CompileError("Unknown operator: ".concat(op));
    }
});
function compileConditions(state, conds) {
    if (!Array.isArray(conds)) {
        // Convert the object form `{foo: 1, bar:2}` into the array form
        // `[{foo: 1}, {bar:2}]`
        conds = Object.entries(conds).map(function (cond) {
            var _a;
            return _a = {}, _a[cond[0]] = cond[1], _a;
        });
    }
    return conds.filter(Boolean).reduce(function (res, condsObj) {
        var compiled = Object.entries(condsObj)
            .map(function (_a) {
            var field = _a[0], cond = _a[1];
            // Allow a falsy value in the lhs of $and and $or to allow for
            // quick forms like `$or: amount != 0 && ...`
            if (field === '$and') {
                if (!cond) {
                    return null;
                }
                return compileAnd(state, cond);
            }
            else if (field === '$or') {
                if (!cond || (Array.isArray(cond) && cond.length === 0)) {
                    return null;
                }
                return compileOr(state, cond);
            }
            if (typeof cond === 'string' ||
                typeof cond === 'number' ||
                typeof cond === 'boolean' ||
                cond instanceof Date ||
                cond == null) {
                return compileOp(state, field, { $eq: cond });
            }
            if (Array.isArray(cond)) {
                // An array of conditions for a field is implicitly an `and`
                return cond.map(function (c) { return compileOp(state, field, c); }).join(' AND ');
            }
            return compileOp(state, field, cond);
        })
            .filter(Boolean);
        return __spreadArray(__spreadArray([], res, true), compiled, true);
    }, []);
}
function compileOr(state, conds) {
    // Same as above
    if (!conds) {
        return '0';
    }
    var res = compileConditions(state, conds);
    if (res.length === 0) {
        return '0';
    }
    return '(' + res.join('\n  OR ') + ')';
}
function compileAnd(state, conds) {
    // Same as above
    if (!conds) {
        return '1';
    }
    var res = compileConditions(state, conds);
    if (res.length === 0) {
        return '1';
    }
    return '(' + res.join('\n  AND ') + ')';
}
var compileWhere = saveStack('filter', function (state, conds) {
    return compileAnd(state, conds);
});
function compileJoins(state, tableRef, internalTableFilters) {
    var joins = [];
    state.paths.forEach(function (desc, path) {
        var _a = state.paths.get(path), tableName = _a.tableName, tableId = _a.tableId, joinField = _a.joinField, joinTable = _a.joinTable, noMapping = _a.noMapping;
        var on = "".concat(tableId, ".id = ").concat(tableRef(joinTable), ".").concat(quoteAlias(joinField));
        var filters = internalTableFilters(tableName);
        if (filters.length > 0) {
            on +=
                ' AND ' +
                    compileAnd(__assign(__assign({}, state), { implicitTableName: tableName, implicitTableId: tableId }), filters);
        }
        joins.push("LEFT JOIN ".concat(noMapping ? tableName : tableRef(tableName, true), " ").concat(tableId, " ON ").concat(addTombstone(state.schema, tableName, tableId, on)));
        if (state.dependencies.indexOf(tableName) === -1) {
            state.dependencies.push(tableName);
        }
    });
    return joins.join('\n');
}
function expandStar(state, expr) {
    var path;
    var pathInfo;
    if (expr === '*') {
        pathInfo = {
            tableName: state.implicitTableName,
            tableId: state.implicitTableId,
        };
    }
    else if (expr.match(/\.\*$/)) {
        var result = popPath(expr);
        path = result.path;
        pathInfo = resolvePath(state, result.path);
    }
    var table = state.schema[pathInfo.tableName];
    if (table == null) {
        throw new Error("Table \u201C".concat(pathInfo.tableName, "\u201D does not exist"));
    }
    return Object.keys(table).map(function (field) { return (path ? "".concat(path, ".").concat(field) : field); });
}
var compileSelect = saveStack('select', function (state, exprs, isAggregate, orders) {
    // Always include the id if it's not an aggregate
    if (!isAggregate && !exprs.includes('id') && !exprs.includes('*')) {
        exprs = exprs.concat(['id']);
    }
    var select = exprs.map(function (expr) {
        if (typeof expr === 'string') {
            if (expr.indexOf('*') !== -1) {
                var fields = expandStar(state, expr);
                return fields
                    .map(function (field) {
                    var compiled = compileExpr(state, '$' + field);
                    state.outputTypes.set(field, compiled.type);
                    return compiled.value + ' AS ' + quoteAlias(field);
                })
                    .join(', ');
            }
            var compiled_1 = compileExpr(state, '$' + expr);
            state.outputTypes.set(expr, compiled_1.type);
            return compiled_1.value + ' AS ' + quoteAlias(expr);
        }
        var _a = Object.entries(expr)[0], name = _a[0], value = _a[1];
        if (name[0] === '$') {
            state.compileStack.push({ type: 'value', value: expr });
            throw new CompileError("Invalid field \u201C".concat(name, "\u201D, are you trying to select a function? You need to name the expression"));
        }
        if (typeof value === 'string') {
            var compiled_2 = compileExpr(state, '$' + value);
            state.outputTypes.set(name, compiled_2.type);
            return "".concat(compiled_2.value, " AS ").concat(quoteAlias(name));
        }
        var compiled = compileFunction(__assign(__assign({}, state), { orders: orders }), value);
        state.outputTypes.set(name, compiled.type);
        return compiled.value + " AS ".concat(quoteAlias(name));
    });
    return select.join(', ');
});
var compileGroupBy = saveStack('groupBy', function (state, exprs) {
    var groupBy = exprs.map(function (expr) {
        if (typeof expr === 'string') {
            return compileExpr(state, '$' + expr).value;
        }
        return compileFunction(state, expr).value;
    });
    return groupBy.join(', ');
});
var compileOrderBy = saveStack('orderBy', function (state, exprs) {
    var orderBy = exprs.map(function (expr) {
        var compiled;
        var dir = null;
        if (typeof expr === 'string') {
            compiled = compileExpr(state, '$' + expr).value;
        }
        else {
            var entries = Object.entries(expr);
            var entry = entries[0];
            // Check if this is a field reference
            if (entries.length === 1 && entry[0][0] !== '$') {
                dir = entry[1];
                compiled = compileExpr(state, '$' + entry[0]).value;
            }
            else {
                // Otherwise it's a function
                var $dir = expr.$dir, func = __rest(expr, ["$dir"]);
                dir = $dir;
                compiled = compileFunction(state, func).value;
            }
        }
        if (dir != null) {
            if (dir !== 'desc' && dir !== 'asc') {
                throw new CompileError('Invalid order direction: ' + dir);
            }
            return "".concat(compiled, " ").concat(dir);
        }
        return compiled;
    });
    return orderBy.join(', ');
});
var AGGREGATE_FUNCTIONS = ['$sum', '$count'];
function isAggregateFunction(expr) {
    if (typeof expr !== 'object' || Array.isArray(expr)) {
        return false;
    }
    var _a = Object.entries(expr)[0], name = _a[0], originalArgExprs = _a[1];
    var argExprs = originalArgExprs;
    if (!Array.isArray(argExprs)) {
        argExprs = [argExprs];
    }
    if (AGGREGATE_FUNCTIONS.indexOf(name) !== -1) {
        return true;
    }
    return !!argExprs.find(function (ex) { return isAggregateFunction(ex); });
}
function isAggregateQuery(queryState) {
    // it's aggregate if:
    // either an aggregate function is used in `select`
    // or a `groupBy` exists
    if (queryState.groupExpressions.length > 0) {
        return true;
    }
    return !!queryState.selectExpressions.find(function (expr) {
        if (typeof expr !== 'string') {
            var _a = Object.entries(expr)[0], _1 = _a[0], value = _a[1];
            return isAggregateFunction(value);
        }
        return false;
    });
}
function compileQuery(queryState, schema, schemaConfig) {
    if (schemaConfig === void 0) { schemaConfig = {}; }
    var withDead = queryState.withDead, _a = queryState.validateRefs, validateRefs = _a === void 0 ? true : _a, tableOptions = queryState.tableOptions, rawMode = queryState.rawMode;
    var _b = schemaConfig.tableViews, tableViews = _b === void 0 ? {} : _b, _c = schemaConfig.tableFilters, tableFilters = _c === void 0 ? function () { return []; } : _c, _d = schemaConfig.customizeQuery, customizeQuery = _d === void 0 ? function (queryState) { return queryState; } : _d;
    var internalTableFilters = function (name) {
        var filters = tableFilters(name);
        // These filters cannot join tables and must be simple strings
        for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
            var filter = filters_1[_i];
            if (Array.isArray(filter)) {
                throw new CompileError('Invalid internal table filter: only object filters are supported');
            }
            if (Object.keys(filter)[0].indexOf('.') !== -1) {
                throw new CompileError('Invalid internal table filter: field names cannot contain paths');
            }
        }
        return filters;
    };
    var tableRef = function (name, isJoin) {
        var view = typeof tableViews === 'function'
            ? tableViews(name, { withDead: withDead, isJoin: isJoin, tableOptions: tableOptions })
            : tableViews[name];
        return view || name;
    };
    var tableName = queryState.table;
    var _e = customizeQuery(queryState), filterExpressions = _e.filterExpressions, selectExpressions = _e.selectExpressions, groupExpressions = _e.groupExpressions, orderExpressions = _e.orderExpressions, limit = _e.limit, offset = _e.offset;
    var select = '';
    var where = '';
    var joins = '';
    var groupBy = '';
    var orderBy = '';
    var state = {
        schema: schema,
        implicitTableName: tableName,
        implicitTableId: tableRef(tableName),
        paths: new Map(),
        dependencies: [tableName],
        compileStack: [],
        outputTypes: new Map(),
        validateRefs: validateRefs,
        namedParameters: [],
    };
    resetUid();
    try {
        select = compileSelect(state, selectExpressions, isAggregateQuery(queryState), orderExpressions);
        if (filterExpressions.length > 0) {
            var result = compileWhere(state, filterExpressions);
            where = 'WHERE ' + result;
        }
        else {
            where = 'WHERE 1';
        }
        if (!rawMode) {
            var filters = internalTableFilters(tableName);
            if (filters.length > 0) {
                where += ' AND ' + compileAnd(state, filters);
            }
        }
        if (groupExpressions.length > 0) {
            var result = compileGroupBy(state, groupExpressions);
            groupBy = 'GROUP BY ' + result;
        }
        // Orders don't matter if doing a single calculation
        if (orderExpressions.length > 0) {
            var result = compileOrderBy(state, orderExpressions);
            orderBy = 'ORDER BY ' + result;
        }
        if (state.paths.size > 0) {
            joins = compileJoins(state, tableRef, internalTableFilters);
        }
    }
    catch (e) {
        if (e instanceof CompileError) {
            throw getCompileError(e, state.compileStack);
        }
        throw e;
    }
    var sqlPieces = {
        select: select,
        from: tableRef(tableName),
        joins: joins,
        where: where,
        groupBy: groupBy,
        orderBy: orderBy,
        limit: limit,
        offset: offset,
    };
    return {
        sqlPieces: sqlPieces,
        state: state,
    };
}
function defaultConstructQuery(queryState, compilerState, sqlPieces) {
    var s = sqlPieces;
    var where = queryState.withDead
        ? s.where
        : addTombstone(compilerState.schema, compilerState.implicitTableName, compilerState.implicitTableId, s.where);
    return "\n    SELECT ".concat(s.select, " FROM ").concat(s.from, "\n    ").concat(s.joins, "\n    ").concat(where, "\n    ").concat(s.groupBy, "\n    ").concat(s.orderBy, "\n    ").concat(s.limit != null ? "LIMIT ".concat(s.limit) : '', "\n    ").concat(s.offset != null ? "OFFSET ".concat(s.offset) : '', "\n  ");
}
function generateSQLWithState(queryState, schema, schemaConfig) {
    var _a = compileQuery(queryState, schema, schemaConfig), sqlPieces = _a.sqlPieces, state = _a.state;
    return { sql: defaultConstructQuery(queryState, state, sqlPieces), state: state };
}
