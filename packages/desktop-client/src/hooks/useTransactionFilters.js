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
exports.useTransactionFilters = useTransactionFilters;
// @ts-strict-ignore
var react_1 = require("react");
var query_1 = require("loot-core/shared/query");
var useQuery_1 = require("./useQuery");
function toJS(rows) {
    var filters = rows.map(function (row) {
        return __assign(__assign({}, row.fields), { id: row.id, name: row.name, tombstone: row.tombstone, conditionsOp: row.conditions_op, conditions: row.conditions });
    });
    return filters;
}
function useTransactionFilters() {
    var data = (0, useQuery_1.useQuery)(function () { return (0, query_1.q)('transaction_filters').select('*'); }, []).data;
    return (0, react_1.useMemo)(function () {
        return toJS(data ? __spreadArray([], data, true) : []).sort(function (a, b) {
            return a.name
                .trim()
                .localeCompare(b.name.trim(), undefined, { ignorePunctuation: true });
        });
    }, [data]);
}
