"use strict";
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
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var fast_check_1 = require("fast-check");
var __1 = require("..");
var arbs = require("../../../mocks/arbitrary-schema");
var query_1 = require("../../../shared/query");
var util_1 = require("../../../shared/util");
var db = require("../../db");
var index_1 = require("../../sync/index");
var executors_1 = require("./executors");
beforeEach(global.emptyDatabase());
function repeat(arr, times) {
    var result = [];
    for (var i = 0; i < times; i++) {
        result = result.concat(arr);
    }
    return result;
}
function isAlive(trans, allById) {
    if (trans.parent_id) {
        var parent_1 = allById[trans.parent_id];
        return !trans.tombstone && parent_1 && !parent_1.tombstone;
    }
    return !trans.tombstone;
}
function aliveTransactions(arr) {
    var all = (0, util_1.groupById)(arr);
    return arr.filter(function (t) { return isAlive(t, all); });
}
function insertTransactions(transactions, payeeIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, index_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _i, transactions_1, trans, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                for (_i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                                    trans = transactions_1[_i];
                                    db.insertTransaction(trans);
                                }
                                if (!payeeIds) return [3 /*break*/, 4];
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < payeeIds.length)) return [3 /*break*/, 4];
                                return [4 /*yield*/, db.insertPayee({
                                        id: payeeIds[i],
                                        name: 'payee' + (i + 1),
                                    })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function expectTransactionOrder(data, fields) {
    var expectedFields = fields || [
        { date: 'desc' },
        'starting_balance_flag',
        { sort_order: 'desc' },
        'id',
    ];
    var sorted = __spreadArray([], data, true).sort(function (i1, i2) {
        for (var _i = 0, expectedFields_1 = expectedFields; _i < expectedFields_1.length; _i++) {
            var field = expectedFields_1[_i];
            var order = 'asc';
            if (!(typeof field === 'string')) {
                var entries = Object.entries(field)[0];
                field = entries[0];
                order = entries[1];
            }
            var f1 = i1[field];
            var f2 = i2[field];
            var before = order === 'asc' ? -1 : 1;
            var after = order === 'asc' ? 1 : -1;
            expect(f1).not.toBeUndefined();
            expect(f2).not.toBeUndefined();
            if (f1 == null && f2 != null) {
                return before;
            }
            else if (f1 != null && f2 == null) {
                return after;
            }
            else if (f1 < f2) {
                return before;
            }
            else if (f1 > f2) {
                return after;
            }
        }
        return 0;
    });
    expect(data.map(function (t) { return t.id; })).toEqual(sorted.map(function (t) { return t.id; }));
}
function expectPagedData(query, numTransactions, allData) {
    return __awaiter(this, void 0, void 0, function () {
        var pageCount, pagedData, done, i, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pageCount = Math.max(Math.floor(numTransactions / 3), 3);
                    pagedData = [];
                    done = false;
                    i = 0;
                    _a.label = 1;
                case 1:
                    // No more than 100 loops, c'mon!
                    expect(i).toBeLessThanOrEqual(100);
                    return [4 /*yield*/, (0, __1.aqlQuery)(query.limit(pageCount).offset(pagedData.length).serialize())];
                case 2:
                    data = (_a.sent()).data;
                    expect(data.length).toBeLessThanOrEqual(pageCount);
                    if (data.length === 0) {
                        done = true;
                    }
                    else {
                        pagedData = pagedData.concat(data);
                    }
                    i++;
                    _a.label = 3;
                case 3:
                    if (!done) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    // All of the paged data together should be exactly the
                    // same as the full data
                    expect(pagedData).toEqual(allData);
                    return [2 /*return*/];
            }
        });
    });
}
describe('transaction executors', function () {
    it('queries with `splits: inline` returns only non-parents', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fast_check_1.default.assert(fast_check_1.default.asyncProperty(arbs.makeTransactionArray({
                        splitFreq: 2,
                        minLength: 2,
                        maxLength: 20,
                    }), function (arr) { return __awaiter(void 0, void 0, void 0, function () {
                        var data, defaultData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, insertTransactions(arr)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, __1.aqlQuery)((0, query_1.q)('transactions')
                                            .filter({ amount: { $lt: 0 } })
                                            .select('*')
                                            .options({ splits: 'inline' })
                                            .serialize())];
                                case 2:
                                    data = (_a.sent()).data;
                                    expect(data.filter(function (t) { return t.is_parent; }).length).toBe(0);
                                    expect(data.filter(function (t) { return t.tombstone; }).length).toBe(0);
                                    return [4 /*yield*/, (0, __1.aqlQuery)((0, query_1.q)('transactions')
                                            .filter({ amount: { $lt: 0 } })
                                            .select('*')
                                            .serialize())];
                                case 3:
                                    defaultData = (_a.sent()).data;
                                    // inline should be the default
                                    expect(defaultData).toEqual(data);
                                    return [2 /*return*/];
                            }
                        });
                    }); }), { numRuns: 50 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('queries with `splits: none` returns only parents', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fast_check_1.default.assert(fast_check_1.default.asyncProperty(arbs.makeTransactionArray({
                        splitFreq: 2,
                        minLength: 2,
                        maxLength: 8,
                    }), function (arr) { return __awaiter(void 0, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, insertTransactions(arr)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, __1.aqlQuery)((0, query_1.q)('transactions')
                                            .filter({ amount: { $lt: 0 } })
                                            .select('*')
                                            .options({ splits: 'none' })
                                            .serialize())];
                                case 2:
                                    data = (_a.sent()).data;
                                    expect(data.filter(function (t) { return t.is_child; }).length).toBe(0);
                                    return [2 /*return*/];
                            }
                        });
                    }); }), { numRuns: 50 })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('aggregate queries work with `splits: grouped`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var payeeIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payeeIds = ['payee1', 'payee2', 'payee3', 'payee4', 'payee5'];
                    return [4 /*yield*/, fast_check_1.default.assert(fast_check_1.default
                            .asyncProperty(arbs.makeTransactionArray({ splitFreq: 2, payeeIds: payeeIds, maxLength: 100 }), function (arr) { return __awaiter(void 0, void 0, void 0, function () {
                            var aggQuery, data, sum;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, insertTransactions(arr, payeeIds)];
                                    case 1:
                                        _a.sent();
                                        aggQuery = (0, query_1.q)('transactions')
                                            .filter({
                                            $or: [{ amount: { $lt: -5 } }, { amount: { $gt: -2 } }],
                                            'payee.name': { $gt: '' },
                                        })
                                            .options({ splits: 'grouped' })
                                            .calculate({ $sum: '$amount' });
                                        return [4 /*yield*/, (0, __1.aqlQuery)(aggQuery.serialize())];
                                    case 2:
                                        data = (_a.sent()).data;
                                        sum = aliveTransactions(arr).reduce(function (sum, trans) {
                                            var amount = trans.amount || 0;
                                            var matched = (amount < -5 || amount > -2) && trans.payee != null;
                                            if (!trans.tombstone && !trans.is_parent && matched) {
                                                return sum + amount;
                                            }
                                            return sum;
                                        }, 0);
                                        expect(data).toBe(sum);
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .beforeEach(function () {
                            (0, crdt_1.setClock)(null);
                            (0, index_1.setSyncingMode)('import');
                            return db.execQuery("\n            DELETE FROM transactions;\n            DELETE FROM payees;\n            DELETE FROM payee_mapping;\n          ");
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 20000);
    function runTest(makeQuery) {
        var payeeIds = ['payee1', 'payee2', 'payee3', 'payee4', 'payee5'];
        function check(arr) {
            return __awaiter(this, void 0, void 0, function () {
                var orderFields, allTransactions, _a, query, expectedIds, expectedMatchedIds, defaultOrderData, orderedQuery, data, matchedIds, _loop_1, _i, data_1, trans;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            orderFields = ['payee.name', 'amount', 'id'];
                            // Insert transactions and get a list of all the alive
                            // ones to make it easier to check the data later (don't
                            // have to always be filtering out dead ones)
                            return [4 /*yield*/, insertTransactions(arr, payeeIds)];
                        case 1:
                            // Insert transactions and get a list of all the alive
                            // ones to make it easier to check the data later (don't
                            // have to always be filtering out dead ones)
                            _b.sent();
                            allTransactions = aliveTransactions(arr);
                            _a = makeQuery(arr), query = _a.query, expectedIds = _a.expectedIds, expectedMatchedIds = _a.expectedMatchedIds;
                            return [4 /*yield*/, (0, __1.aqlQuery)(query.serialize())];
                        case 2:
                            defaultOrderData = (_b.sent()).data;
                            expectTransactionOrder(defaultOrderData);
                            expect(new Set(defaultOrderData.map(function (t) { return t.id; }))).toEqual(expectedIds);
                            orderedQuery = query.orderBy(orderFields);
                            return [4 /*yield*/, (0, __1.aqlQuery)(orderedQuery.serialize())];
                        case 3:
                            data = (_b.sent()).data;
                            expect(new Set(data.map(function (t) { return t.id; }))).toEqual(expectedIds);
                            // Validate paging and ordering
                            return [4 /*yield*/, expectPagedData(orderedQuery, arr.length, data)];
                        case 4:
                            // Validate paging and ordering
                            _b.sent();
                            expectTransactionOrder(data, orderFields);
                            matchedIds = new Set();
                            _loop_1 = function (trans) {
                                expect(trans.tombstone).toBe(false);
                                if (expectedMatchedIds) {
                                    if (!trans._unmatched) {
                                        expect(expectedMatchedIds.has(trans.id)).toBe(true);
                                        matchedIds.add(trans.id);
                                    }
                                    else {
                                        expect(expectedMatchedIds.has(trans.id)).not.toBe(true);
                                    }
                                }
                                if (trans.is_parent) {
                                    // Parent transactions should never have a category
                                    expect(trans.category).toBe(null);
                                    expect(trans.subtransactions.length).toBe(allTransactions.filter(function (t) { return t.parent_id === trans.id; }).length);
                                    // Subtransactions should be ordered as well
                                    expectTransactionOrder(trans.subtransactions, orderFields);
                                    trans.subtransactions.forEach(function (subtrans) {
                                        expect(subtrans.tombstone).toBe(false);
                                        if (expectedMatchedIds) {
                                            if (!subtrans._unmatched) {
                                                expect(expectedMatchedIds.has(subtrans.id)).toBe(true);
                                                matchedIds.add(subtrans.id);
                                            }
                                            else {
                                                expect(expectedMatchedIds.has(subtrans.id)).not.toBe(true);
                                            }
                                        }
                                    });
                                }
                            };
                            // Check that all the subtransactions were returned
                            for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                                trans = data_1[_i];
                                _loop_1(trans);
                            }
                            if (expectedMatchedIds) {
                                // Check that transactions that should be matched are
                                // marked as such
                                expect(matchedIds).toEqual(expectedMatchedIds);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        return fast_check_1.default.assert(fast_check_1.default
            .asyncProperty(arbs.makeTransactionArray({
            splitFreq: 0.1,
            payeeIds: payeeIds,
            maxLength: 100,
        }), check)
            .beforeEach(function () {
            (0, crdt_1.setClock)(null);
            (0, index_1.setSyncingMode)('import');
            return db.execQuery("\n            DELETE FROM transactions;\n            DELETE FROM payees;\n            DELETE FROM payee_mapping;\n          ");
        }), { numRuns: 300 });
    }
    it('queries the correct transactions without filters', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, runTest(function (arr) {
                    var expectedIds = new Set(arr.filter(function (t) { return !t.tombstone && !t.is_child; }).map(function (t) { return t.id; }));
                    // Even though we're applying some filters, these are always
                    // guaranteed to return the full split transaction so they
                    // should take the optimized path
                    var happyQuery = (0, query_1.q)('transactions')
                        .filter({
                        date: { $gt: '2017-01-01' },
                    })
                        .options({ splits: 'grouped' })
                        .select(['*', 'payee.name']);
                    // Make sure it's actually taking the happy path
                    expect((0, executors_1.isHappyPathQuery)(happyQuery.serialize())).toBe(true);
                    return {
                        expectedIds: expectedIds,
                        query: happyQuery,
                    };
                })];
        });
    }); }, 20000);
    it("queries the correct transactions with a filter", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, runTest(function (arr) {
                    var expectedIds = new Set();
                    // let parents = toGroup(
                    //   arr.filter(t => t.is_parent),
                    //   new Map(Object.entries(groupById(arr.filter(t => t.parent_id))))
                    // );
                    var parents = (0, util_1.groupById)(arr.filter(function (t) { return t.is_parent && !t.tombstone; }));
                    var matched = new Set();
                    // Pick out some ids to query
                    var ids = arr.reduce(function (ids, trans, idx) {
                        if (idx % 2 === 0) {
                            var amount = trans.amount == null ? 0 : trans.amount;
                            var matches = (amount < -2 || amount > -1) && trans.payee > '';
                            if (matches && isAlive(trans, parents)) {
                                expectedIds.add(trans.parent_id || trans.id);
                                matched.add(trans.id);
                            }
                            ids.push(trans.id);
                        }
                        return ids;
                    }, []);
                    // Because why not? It should deduplicate them
                    ids = repeat(ids, 100);
                    var unhappyQuery = (0, query_1.q)('transactions')
                        .filter({
                        id: [{ $oneof: ids }],
                        payee: { $gt: '' },
                        $or: [{ amount: { $lt: -2 } }, { amount: { $gt: -1 } }],
                    })
                        .options({ splits: 'grouped' })
                        .select(['*', 'payee.name'])
                        // Using this because we want `payee` to have ids for the above
                        // filter regardless if it points to a dead one or not
                        .withoutValidatedRefs();
                    expect((0, executors_1.isHappyPathQuery)(unhappyQuery.serialize())).toBe(false);
                    return {
                        expectedIds: expectedIds,
                        expectedMatchedIds: matched,
                        query: unhappyQuery,
                    };
                })];
        });
    }); }, 20000);
});
