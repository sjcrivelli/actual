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
var arbs = require("../../mocks/arbitrary-schema");
var test_helpers_1 = require("../../shared/test-helpers");
var aql_1 = require("../aql");
var db = require("../db");
var migrate_1 = require("./migrate");
var index_1 = require("./index");
beforeEach(function () {
    (0, migrate_1.listen)();
    return global.emptyDatabase()();
});
afterEach(function () {
    (0, migrate_1.unlisten)();
});
var tableSchema = aql_1.schema.transactions;
var fields = Object.keys(tableSchema);
function toInternalField(publicField) {
    return aql_1.schemaConfig.views.transactions.fields[publicField];
}
var messageArb = fast_check_1.default
    .oneof.apply(fast_check_1.default, fields.filter(function (f) { return f !== 'id'; }).map(function (field) { return fast_check_1.default.constant(field); })).chain(function (field) {
    var value = arbs
        .typeArbitrary(tableSchema[field])
        .map(function (v) { return (0, aql_1.convertInputType)(v, tableSchema[field].type); });
    var timestamp = fast_check_1.default
        .noShrink(fast_check_1.default.noBias(fast_check_1.default.date({
        min: new Date('2020-01-01T00:00:00.000Z'),
        max: new Date('2020-05-01T00:00:00.000Z'),
    })))
        .map(function (date) { return date.toISOString() + '-0000-0123456789ABCDEF'; })
        .map(crdt_1.Timestamp.parse);
    return fast_check_1.default.record({
        timestamp: timestamp,
        dataset: fast_check_1.default.constant('transactions'),
        column: fast_check_1.default.constant(toInternalField(field) || field),
        row: fast_check_1.default.oneof(fast_check_1.default.integer({ min: 0, max: 5 }).map(function (i) { return "id".concat(i); }), fast_check_1.default.integer({ min: 0, max: 5 }).chain(function (i) {
            return fast_check_1.default.integer({ min: 0, max: 5 }).map(function (j) { return "id".concat(i, "/child").concat(j); });
        })),
        value: value,
    });
});
describe('sync migrations', function () {
    it('should set the parent_id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tracer, cleanup, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tracer = (0, test_helpers_1.execTracer)();
                    tracer.start();
                    cleanup = (0, index_1.addSyncListener)(function (oldValues, newValues) {
                        var transactionsMap = newValues.get('transactions');
                        tracer.event('applied', __spreadArray([], transactionsMap.keys(), true));
                    });
                    return [4 /*yield*/, db.insert('transactions', {
                            id: 'trans1/child1',
                            isChild: 1,
                            amount: 4500,
                        })];
                case 1:
                    _a.sent();
                    tracer.expectNow('applied', ['trans1/child1']);
                    return [4 /*yield*/, tracer.expectWait('applied', ['trans1/child1'])];
                case 2:
                    _a.sent();
                    transactions = db.runQuery('SELECT * FROM transactions', [], true);
                    expect(transactions.length).toBe(1);
                    expect(transactions[0].parent_id).toBe('trans1');
                    cleanup();
                    tracer.end();
                    return [2 /*return*/];
            }
        });
    }); });
    it('child transactions should always have a parent_id', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fast_check_1.default.assert(fast_check_1.default
                        .asyncProperty(fast_check_1.default.array(messageArb, { maxLength: 100 }), function (msgs) { return __awaiter(void 0, void 0, void 0, function () {
                        var tracer, cleanup, transactions, _loop_1, _i, transactions_1, trans;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    tracer = (0, test_helpers_1.execTracer)();
                                    tracer.start();
                                    cleanup = (0, index_1.addSyncListener)(function (oldValues, newValues) {
                                        var ts = newValues.get('transactions');
                                        if (ts &&
                                            __spreadArray([], ts.values(), true).find(function (t) {
                                                return t.isChild === 1 && t.parent_id == null && t.id.includes('/');
                                            })) {
                                        }
                                        else {
                                            tracer.event('applied');
                                        }
                                    });
                                    return [4 /*yield*/, (0, index_1.sendMessages)(msgs)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, tracer.expect('applied')];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, db.all('SELECT * FROM transactions', [])];
                                case 3:
                                    transactions = _a.sent();
                                    _loop_1 = function (trans) {
                                        var transMsgs = msgs
                                            .filter(function (msg) { return msg.row === trans.id; })
                                            .sort(function (m1, m2) {
                                            var t1 = m1.timestamp.toString();
                                            var t2 = m2.timestamp.toString();
                                            if (t1 < t2) {
                                                return 1;
                                            }
                                            else if (t1 > t2) {
                                                return -1;
                                            }
                                            return 0;
                                        });
                                        var msg = transMsgs.find(function (m) { return m.column === 'parent_id'; });
                                        if (trans.isChild === 1 &&
                                            trans.id.includes('/') &&
                                            (msg == null || msg.value == null)) {
                                            // This is a child transaction didn't have a `parent_id`
                                            // set in the messages. It should have gotten set from
                                            // the `id`
                                            var parentId = trans.id.split('/')[0];
                                            expect(parentId).not.toBe(null);
                                            expect(trans.parent_id).toBe(parentId);
                                        }
                                        else if (msg) {
                                            // At least one message set `parent_id`
                                            expect(trans.parent_id).toBe(msg.value);
                                        }
                                        else {
                                            // `parent_id` should never have been set
                                            expect(trans.parent_id).toBe(null);
                                        }
                                    };
                                    for (_i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
                                        trans = transactions_1[_i];
                                        _loop_1(trans);
                                    }
                                    cleanup();
                                    tracer.end();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .beforeEach(function () {
                        return db.execQuery("DELETE FROM transactions");
                    }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
