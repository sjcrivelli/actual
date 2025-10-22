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
exports.makeViews = makeViews;
// @ts-strict-ignore
var compiler_1 = require("./compiler");
function selectFields(fields) {
    return Object.keys(fields)
        .map(function (as) {
        var field = fields[as];
        var needsAs = field !== as;
        // If it's just an identifier, we automatically prefix it with
        // `_.` which makes sure it references the root table
        if (!field.match(/[ .]/)) {
            field = "_.".concat(field);
        }
        return needsAs ? "".concat(field, " AS ").concat((0, compiler_1.quoteAlias)(as)) : "".concat(field);
    })
        .join(', ');
}
function makeViews(schema, schemaConfig) {
    var views = schemaConfig.views;
    var viewStrs = [];
    Object.keys(views).forEach(function (table) {
        var _a = views[table], _b = _a.fields, fieldMappings = _b === void 0 ? {} : _b, tableViews = __rest(_a, ["fields"]);
        var publicFields = Object.fromEntries(Object.keys(schema[table]).map(function (name) { return [name, name]; }));
        var internalFields = __assign(__assign({}, publicFields), fieldMappings);
        Object.keys(tableViews).forEach(function (viewName) {
            var publicMaker = function (overrides) {
                var fields = __assign(__assign({}, publicFields), overrides);
                return selectFields(fields);
            };
            var internalMaker = function (overrides) {
                var fields = __assign(__assign({}, internalFields), overrides);
                return selectFields(fields);
            };
            var sql;
            if (typeof tableViews[viewName] === 'function') {
                sql = tableViews[viewName](internalMaker, publicMaker);
            }
            else {
                sql = tableViews[viewName];
            }
            sql = sql.trim().replace(/;$/, '');
            viewStrs.push("\n        DROP VIEW IF EXISTS ".concat(viewName, ";\n        CREATE VIEW ").concat(viewName, " AS ").concat(sql, ";\n      "));
        });
    });
    return viewStrs.join('\n');
}
