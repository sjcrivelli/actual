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
exports.Query = void 0;
exports.getPrimaryOrderBy = getPrimaryOrderBy;
exports.q = q;
var Query = /** @class */ (function () {
    function Query(state) {
        this.state = __assign({ tableOptions: state.tableOptions || {}, filterExpressions: state.filterExpressions || [], selectExpressions: state.selectExpressions || [], groupExpressions: state.groupExpressions || [], orderExpressions: state.orderExpressions || [], calculation: false, rawMode: false, withDead: false, validateRefs: true, limit: null, offset: null }, state);
    }
    Query.prototype.filter = function (expr) {
        return new Query(__assign(__assign({}, this.state), { filterExpressions: __spreadArray(__spreadArray([], this.state.filterExpressions, true), [expr], false) }));
    };
    Query.prototype.unfilter = function (exprs) {
        // Remove all filters if no arguments are passed
        if (!exprs) {
            return new Query(__assign(__assign({}, this.state), { filterExpressions: [] }));
        }
        var exprSet = new Set(exprs);
        return new Query(__assign(__assign({}, this.state), { filterExpressions: this.state.filterExpressions.filter(function (expr) { return !exprSet.has(Object.keys(expr)[0]); }) }));
    };
    Query.prototype.select = function (exprs) {
        if (exprs === void 0) { exprs = []; }
        if (!Array.isArray(exprs)) {
            exprs = [exprs];
        }
        return new Query(__assign(__assign({}, this.state), { selectExpressions: exprs, calculation: false }));
    };
    Query.prototype.calculate = function (expr) {
        return new Query(__assign(__assign({}, this.state), { selectExpressions: [{ result: expr }], calculation: true }));
    };
    Query.prototype.groupBy = function (exprs) {
        if (!Array.isArray(exprs)) {
            exprs = [exprs];
        }
        return new Query(__assign(__assign({}, this.state), { groupExpressions: __spreadArray(__spreadArray([], this.state.groupExpressions, true), exprs, true) }));
    };
    Query.prototype.orderBy = function (exprs) {
        if (!Array.isArray(exprs)) {
            exprs = [exprs];
        }
        return new Query(__assign(__assign({}, this.state), { orderExpressions: __spreadArray(__spreadArray([], this.state.orderExpressions, true), exprs, true) }));
    };
    Query.prototype.limit = function (num) {
        return new Query(__assign(__assign({}, this.state), { limit: num }));
    };
    Query.prototype.offset = function (num) {
        return new Query(__assign(__assign({}, this.state), { offset: num }));
    };
    Query.prototype.raw = function () {
        return new Query(__assign(__assign({}, this.state), { rawMode: true }));
    };
    Query.prototype.withDead = function () {
        return new Query(__assign(__assign({}, this.state), { withDead: true }));
    };
    Query.prototype.withoutValidatedRefs = function () {
        return new Query(__assign(__assign({}, this.state), { validateRefs: false }));
    };
    Query.prototype.options = function (opts) {
        return new Query(__assign(__assign({}, this.state), { tableOptions: opts }));
    };
    Query.prototype.reset = function () {
        return q(this.state.table);
    };
    Query.prototype.serialize = function () {
        return this.state;
    };
    Query.prototype.serializeAsString = function () {
        return JSON.stringify(this.serialize());
    };
    return Query;
}());
exports.Query = Query;
function getPrimaryOrderBy(query, defaultOrderBy) {
    var orderExprs = query.serialize().orderExpressions;
    if (orderExprs.length === 0) {
        if (defaultOrderBy) {
            return __assign({ order: 'asc' }, defaultOrderBy);
        }
        return null;
    }
    var firstOrder = orderExprs[0];
    if (typeof firstOrder === 'string') {
        return { field: firstOrder, order: 'asc' };
    }
    // Handle this form: { field: 'desc' }
    var field = Object.keys(firstOrder)[0];
    return { field: field, order: firstOrder[field] };
}
function q(table) {
    return new Query({ table: table });
}
