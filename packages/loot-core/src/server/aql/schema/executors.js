"use strict";
// @ts-strict-ignore
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaExecutors = void 0;
exports.isHappyPathQuery = isHappyPathQuery;
var __1 = require("..");
var query_1 = require("../../../shared/query");
var db = require("../../db");
var util_1 = require("../../db/util");
var compiler_1 = require("../compiler");
var exec_1 = require("../exec");
var schema_helpers_1 = require("../schema-helpers");
function toGroup(parents, children, mapper) {
    if (mapper === void 0) { mapper = function (x) { return x; }; }
    return parents.reduce(function (list, parent) {
        var childs = children.get(parent.id) || [];
        list.push(__assign(__assign({}, mapper(parent)), { subtransactions: childs.map(mapper) }));
        return list;
    }, []);
}
// These two queries will return very different things:
//
// q('transactions').select({ $count: 'id' })
// q('transactions', { splits: "grouped" }).select({ $count: 'id' })
//
// The first will return the count of non-split and child
// transactions, and the second will return the count of all parent
// (or non-split) transactions
function execTransactions(compilerState, queryState, sqlPieces, params, outputTypes) {
    var tableOptions = queryState.tableOptions || {};
    var splitType = tableOptions.splits
        ? tableOptions.splits
        : 'inline';
    if (!isValidSplitsOption(splitType)) {
        throw new Error("Invalid \u201Csplits\u201D option for transactions: \u201C".concat(splitType, "\u201D"));
    }
    if (splitType === 'all' || splitType === 'inline' || splitType === 'none') {
        return execTransactionsBasic(compilerState, queryState, sqlPieces, params, splitType, outputTypes);
    }
    else if (splitType === 'grouped') {
        return execTransactionsGrouped(compilerState, queryState, sqlPieces, params, outputTypes);
    }
}
function _isUnhappy(filter) {
    // These fields can be filtered - all split transactions will
    // still be returned regardless
    for (var _i = 0, _a = Object.keys(filter); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key === '$or' || key === '$and') {
            if (filter[key] && _isUnhappy(filter[key])) {
                return true;
            }
        }
        else if (!(key.indexOf('account') === 0 || key === 'date')) {
            return true;
        }
    }
    return false;
}
function isHappyPathQuery(queryState) {
    return queryState.filterExpressions.find(_isUnhappy) == null;
}
function execTransactionsGrouped(compilerState, queryState, sqlPieces, params, outputTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var withDead, whereDead, s, rows, matched, rowSql, rowSql, where, finalSql, allRows, _a, parents, children, mapper;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    withDead = queryState.withDead;
                    whereDead = withDead ? '' : "AND ".concat(sqlPieces.from, ".tombstone = 0");
                    // Aggregate queries don't make sense for a grouped transactions
                    // query. We never should include both parent and children
                    // transactions as it would duplicate amounts and the final number
                    // would never make sense. In this case, switch back to the "inline"
                    // type where only non-parent transactions are considered
                    if ((0, compiler_1.isAggregateQuery)(queryState)) {
                        s = __assign({}, sqlPieces);
                        // Modify the where to only include non-parents
                        s.where = "".concat(s.where, " AND ").concat(s.from, ".is_parent = 0");
                        // We also want to exclude deleted transactions. Normally we
                        // handle this manually down below, but now that we are doing a
                        // normal query we want to rely on the view. Unfortunately, SQL
                        // has already been generated so we can't easily change the view
                        // name here; instead, we change it and map it back to the name
                        // used elsewhere in the query. Ideally we'd improve this
                        if (!withDead) {
                            s.from = 'v_transactions_internal_alive v_transactions_internal';
                        }
                        return [2 /*return*/, (0, exec_1.execQuery)(queryState, compilerState, s, params, outputTypes)];
                    }
                    matched = null;
                    if (!isHappyPathQuery(queryState)) return [3 /*break*/, 2];
                    rowSql = "\n      SELECT ".concat(sqlPieces.from, ".id as group_id\n      FROM ").concat(sqlPieces.from, "\n      ").concat(sqlPieces.joins, "\n      ").concat(sqlPieces.where, " AND is_child = 0 ").concat(whereDead, "\n      ").concat(sqlPieces.orderBy, "\n      ").concat(sqlPieces.limit != null ? "LIMIT ".concat(sqlPieces.limit) : '', "\n      ").concat(sqlPieces.offset != null ? "OFFSET ".concat(sqlPieces.offset) : '', "\n    ");
                    return [4 /*yield*/, db.all(rowSql, params)];
                case 1:
                    rows = _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    rowSql = "\n      SELECT group_id, matched FROM (\n        SELECT\n          group_id,\n          GROUP_CONCAT(id) as matched\n          FROM (\n            SELECT ".concat(sqlPieces.from, ".id, IFNULL(").concat(sqlPieces.from, ".parent_id, ").concat(sqlPieces.from, ".id) as group_id\n            FROM ").concat(sqlPieces.from, "\n            LEFT JOIN transactions _t2 ON ").concat(sqlPieces.from, ".is_child = 1 AND _t2.id = ").concat(sqlPieces.from, ".parent_id\n            ").concat(sqlPieces.joins, "\n            ").concat(sqlPieces.where, " AND ").concat(sqlPieces.from, ".tombstone = 0 AND IFNULL(_t2.tombstone, 0) = 0\n          )\n        GROUP BY group_id\n      )\n      LEFT JOIN ").concat(sqlPieces.from, " ON ").concat(sqlPieces.from, ".id = group_id\n      ").concat(sqlPieces.joins, "\n      ").concat(sqlPieces.orderBy, "\n      ").concat(sqlPieces.limit != null ? "LIMIT ".concat(sqlPieces.limit) : '', "\n      ").concat(sqlPieces.offset != null ? "OFFSET ".concat(sqlPieces.offset) : '', "\n    ");
                    return [4 /*yield*/, db.all(rowSql, params)];
                case 3:
                    rows = _b.sent();
                    matched = new Set([].concat.apply([], rows.map(function (row) { return row.matched.split(','); })));
                    _b.label = 4;
                case 4:
                    where = (0, util_1.whereIn)(rows.map(function (row) { return row.group_id; }), "IFNULL(".concat(sqlPieces.from, ".parent_id, ").concat(sqlPieces.from, ".id)"));
                    finalSql = "\n    SELECT ".concat(sqlPieces.select, ", parent_id AS _parent_id FROM ").concat(sqlPieces.from, "\n    ").concat(sqlPieces.joins, "\n    WHERE ").concat(where, " ").concat(whereDead, "\n    ").concat(sqlPieces.orderBy, "\n  ");
                    return [4 /*yield*/, db.all(finalSql)];
                case 5:
                    allRows = _b.sent();
                    _a = allRows.reduce(function (acc, trans) {
                        var pid = trans._parent_id;
                        delete trans._parent_id;
                        if (pid == null) {
                            acc.parents.push(trans);
                        }
                        else {
                            var arr = acc.children.get(pid) || [];
                            arr.push(trans);
                            acc.children.set(pid, arr);
                        }
                        return acc;
                    }, { parents: [], children: new Map() }), parents = _a.parents, children = _a.children;
                    mapper = function (trans) {
                        Object.keys(trans).forEach(function (name) {
                            trans[name] = (0, schema_helpers_1.convertOutputType)(trans[name], outputTypes.get(name));
                        });
                        if (matched && !matched.has(trans.id)) {
                            trans._unmatched = true;
                        }
                        return trans;
                    };
                    return [2 /*return*/, toGroup(parents, children, mapper)];
            }
        });
    });
}
function execTransactionsBasic(compilerState, queryState, sqlPieces, params, splitType, outputTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var s;
        return __generator(this, function (_a) {
            s = __assign({}, sqlPieces);
            if (splitType !== 'all') {
                if (splitType === 'none') {
                    s.where = "".concat(s.where, " AND ").concat(s.from, ".parent_id IS NULL");
                }
                else {
                    s.where = "".concat(s.where, " AND ").concat(s.from, ".is_parent = 0");
                }
            }
            return [2 /*return*/, (0, exec_1.execQuery)(queryState, compilerState, s, params, outputTypes)];
        });
    });
}
function isValidSplitsOption(splits) {
    return ['all', 'inline', 'none', 'grouped'].includes(splits);
}
function execCategoryGroups(compilerState, queryState, sqlPieces, params, outputTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var tableOptions, categoriesOption;
        return __generator(this, function (_a) {
            tableOptions = queryState.tableOptions || {};
            categoriesOption = tableOptions.categories
                ? tableOptions.categories
                : 'all';
            if (!isValidCategoriesOption(categoriesOption)) {
                throw new Error("Invalid \u201Ccategories\u201D option for category_groups: \u201C".concat(categoriesOption, "\u201D"));
            }
            if (categoriesOption !== 'none') {
                return [2 /*return*/, execCategoryGroupsWithCategories(compilerState, queryState, sqlPieces, params, categoriesOption, outputTypes)];
            }
            return [2 /*return*/, execCategoryGroupsBasic(compilerState, queryState, sqlPieces, params, outputTypes)];
        });
    });
}
function execCategoryGroupsWithCategories(compilerState, queryState, sqlPieces, params, categoriesOption, outputTypes) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryGroups, categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execCategoryGroupsBasic(compilerState, queryState, sqlPieces, params, outputTypes)];
                case 1:
                    categoryGroups = _a.sent();
                    if (categoriesOption === 'none') {
                        return [2 /*return*/, categoryGroups];
                    }
                    return [4 /*yield*/, (0, __1.aqlQuery)((0, query_1.q)('categories')
                            .filter({
                            group: { $oneof: categoryGroups.map(function (cg) { return cg.id; }) },
                        })
                            .select('*'))];
                case 2:
                    categories = (_a.sent()).data;
                    return [2 /*return*/, categoryGroups.map(function (group) {
                            var cats = categories.filter(function (cat) { return cat.group === group.id; });
                            return __assign(__assign({}, group), { categories: cats });
                        })];
            }
        });
    });
}
function execCategoryGroupsBasic(compilerState, queryState, sqlPieces, params, outputTypes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exec_1.execQuery)(queryState, compilerState, sqlPieces, params, outputTypes)];
        });
    });
}
function isValidCategoriesOption(categories) {
    return ['all', 'none'].includes(categories);
}
exports.schemaExecutors = {
    transactions: execTransactions,
    category_groups: execCategoryGroups,
};
