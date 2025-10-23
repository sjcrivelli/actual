"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
exports.getPrimaryOrderBy = getPrimaryOrderBy;
exports.q = q;
class Query {
    state;
    constructor(state) {
        this.state = {
            tableOptions: state.tableOptions || {},
            filterExpressions: state.filterExpressions || [],
            selectExpressions: state.selectExpressions || [],
            groupExpressions: state.groupExpressions || [],
            orderExpressions: state.orderExpressions || [],
            calculation: false,
            rawMode: false,
            withDead: false,
            validateRefs: true,
            limit: null,
            offset: null,
            ...state,
        };
    }
    filter(expr) {
        return new Query({
            ...this.state,
            filterExpressions: [...this.state.filterExpressions, expr],
        });
    }
    unfilter(exprs) {
        // Remove all filters if no arguments are passed
        if (!exprs) {
            return new Query({
                ...this.state,
                filterExpressions: [],
            });
        }
        const exprSet = new Set(exprs);
        return new Query({
            ...this.state,
            filterExpressions: this.state.filterExpressions.filter(expr => !exprSet.has(Object.keys(expr)[0])),
        });
    }
    select(exprs = []) {
        if (!Array.isArray(exprs)) {
            exprs = [exprs];
        }
        return new Query({
            ...this.state,
            selectExpressions: exprs,
            calculation: false,
        });
    }
    calculate(expr) {
        return new Query({
            ...this.state,
            selectExpressions: [{ result: expr }],
            calculation: true,
        });
    }
    groupBy(exprs) {
        if (!Array.isArray(exprs)) {
            exprs = [exprs];
        }
        return new Query({
            ...this.state,
            groupExpressions: [...this.state.groupExpressions, ...exprs],
        });
    }
    orderBy(exprs) {
        if (!Array.isArray(exprs)) {
            exprs = [exprs];
        }
        return new Query({
            ...this.state,
            orderExpressions: [...this.state.orderExpressions, ...exprs],
        });
    }
    limit(num) {
        return new Query({ ...this.state, limit: num });
    }
    offset(num) {
        return new Query({ ...this.state, offset: num });
    }
    raw() {
        return new Query({ ...this.state, rawMode: true });
    }
    withDead() {
        return new Query({ ...this.state, withDead: true });
    }
    withoutValidatedRefs() {
        return new Query({ ...this.state, validateRefs: false });
    }
    options(opts) {
        return new Query({ ...this.state, tableOptions: opts });
    }
    reset() {
        return q(this.state.table);
    }
    serialize() {
        return this.state;
    }
    serializeAsString() {
        return JSON.stringify(this.serialize());
    }
}
exports.Query = Query;
function getPrimaryOrderBy(query, defaultOrderBy) {
    const orderExprs = query.serialize().orderExpressions;
    if (orderExprs.length === 0) {
        if (defaultOrderBy) {
            return { order: 'asc', ...defaultOrderBy };
        }
        return null;
    }
    const firstOrder = orderExprs[0];
    if (typeof firstOrder === 'string') {
        return { field: firstOrder, order: 'asc' };
    }
    // Handle this form: { field: 'desc' }
    const [field] = Object.keys(firstOrder);
    return { field, order: firstOrder[field] };
}
function q(table) {
    return new Query({ table });
}
//# sourceMappingURL=query.js.map