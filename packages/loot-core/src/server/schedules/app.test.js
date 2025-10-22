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
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var mockdate_1 = require("mockdate");
var query_1 = require("../../shared/query");
var schedules_1 = require("../../shared/schedules");
var aql_1 = require("../aql");
var mappings_1 = require("../db/mappings");
var transaction_rules_1 = require("../transactions/transaction-rules");
var app_1 = require("./app");
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, global.emptyDatabase()()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, mappings_1.loadMappings)()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, transaction_rules_1.loadRules)()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('schedule app', function () {
    describe('utility', function () {
        it('conditions are updated when they exist', function () {
            var conds = [
                { op: 'is', field: 'payee', value: 'FOO' },
                { op: 'is', field: 'date', value: '2020-01-01' },
            ];
            var updated = (0, app_1.updateConditions)(conds, [
                {
                    op: 'is',
                    field: 'payee',
                    value: 'bar',
                },
            ]);
            expect(updated.length).toBe(2);
            expect(updated[0].value).toBe('bar');
        });
        it('conditions are added if they don’t exist', function () {
            var conds = [
                { op: 'contains', field: 'payee', value: 'FOO' },
                { op: 'contains', field: 'notes', value: 'dflksjdflskdjf' },
            ];
            var updated = (0, app_1.updateConditions)(conds, [
                {
                    op: 'is',
                    field: 'payee',
                    value: 'bar',
                },
            ]);
            expect(updated.length).toBe(3);
        });
        it('getNextDate works with date conditions', function () {
            expect((0, schedules_1.getNextDate)({ op: 'is', field: 'date', value: '2021-04-30' })).toBe('2021-04-30');
            expect((0, schedules_1.getNextDate)({
                op: 'is',
                field: 'date',
                value: {
                    start: '2020-12-20',
                    frequency: 'monthly',
                    patterns: [
                        { type: 'day', value: 15 },
                        { type: 'day', value: 30 },
                    ],
                },
            })).toBe('2020-12-30');
        });
    });
    describe('methods', function () {
        it('createSchedule creates a schedule', function () { return __awaiter(void 0, void 0, void 0, function () {
            var id, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_1.createSchedule)({
                            conditions: [
                                {
                                    op: 'is',
                                    field: 'date',
                                    value: {
                                        start: '2020-12-20',
                                        frequency: 'monthly',
                                        patterns: [
                                            { type: 'day', value: 15 },
                                            { type: 'day', value: 30 },
                                        ],
                                    },
                                },
                            ],
                        })];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).select('*'))];
                    case 2:
                        row = (_a.sent()).data[0];
                        expect(row).toBeTruthy();
                        expect(row.rule).toBeTruthy();
                        expect(row.next_date).toBe('2020-12-30');
                        return [4 /*yield*/, expect((0, app_1.createSchedule)({
                                conditions: [{ op: 'is', field: 'payee', value: 'p1' }],
                            })).rejects.toThrow(/date condition is required/)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('updateSchedule updates a schedule', function () { return __awaiter(void 0, void 0, void 0, function () {
            var id, res, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_1.createSchedule)({
                            conditions: [
                                { op: 'is', field: 'payee', value: 'foo' },
                                {
                                    op: 'is',
                                    field: 'date',
                                    value: {
                                        start: '2020-12-20',
                                        frequency: 'monthly',
                                        patterns: [
                                            { type: 'day', value: 15 },
                                            { type: 'day', value: 30 },
                                        ],
                                    },
                                },
                            ],
                        })];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules')
                                .filter({ id: id })
                                .select(['next_date', 'posts_transaction']))];
                    case 2:
                        res = _a.sent();
                        row = res.data[0];
                        expect(row.next_date).toBe('2020-12-30');
                        expect(row.posts_transaction).toBe(false);
                        mockdate_1.default.set(new Date(2021, 4, 17));
                        return [4 /*yield*/, (0, app_1.updateSchedule)({
                                schedule: { id: id, posts_transaction: true },
                                conditions: [
                                    {
                                        op: 'is',
                                        field: 'date',
                                        value: {
                                            start: '2020-12-20',
                                            frequency: 'monthly',
                                            patterns: [
                                                { type: 'day', value: 18 },
                                                { type: 'day', value: 29 },
                                            ],
                                        },
                                    },
                                ],
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules')
                                .filter({ id: id })
                                .select(['next_date', 'posts_transaction']))];
                    case 4:
                        res = _a.sent();
                        row = res.data[0];
                        // Updating the date condition updates `next_date`
                        expect(row.next_date).toBe('2021-05-18');
                        expect(row.posts_transaction).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('deleteSchedule deletes a schedule', function () { return __awaiter(void 0, void 0, void 0, function () {
            var id, schedules, schedules2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_1.createSchedule)({
                            conditions: [
                                {
                                    op: 'is',
                                    field: 'date',
                                    value: {
                                        start: '2020-12-20',
                                        frequency: 'monthly',
                                        patterns: [
                                            { type: 'day', value: 15 },
                                            { type: 'day', value: 30 },
                                        ],
                                    },
                                },
                            ],
                        })];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').select('*'))];
                    case 2:
                        schedules = (_a.sent()).data;
                        expect(schedules.length).toBe(1);
                        return [4 /*yield*/, (0, app_1.deleteSchedule)({ id: id })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').select('*'))];
                    case 4:
                        schedules2 = (_a.sent()).data;
                        expect(schedules2.length).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('setNextDate sets `next_date`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var id, ruleId, res, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, app_1.createSchedule)({
                            conditions: [
                                {
                                    op: 'is',
                                    field: 'date',
                                    value: {
                                        start: '2020-12-20',
                                        frequency: 'monthly',
                                        patterns: [
                                            { type: 'day', value: 15 },
                                            { type: 'day', value: 30 },
                                        ],
                                    },
                                },
                            ],
                        })];
                    case 1:
                        id = _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).calculate('rule'))];
                    case 2:
                        ruleId = (_a.sent()).data;
                        // Manually update the rule
                        return [4 /*yield*/, (0, transaction_rules_1.updateRule)({
                                id: ruleId,
                                conditions: [
                                    {
                                        op: 'is',
                                        field: 'date',
                                        value: {
                                            start: '2020-12-20',
                                            frequency: 'monthly',
                                            patterns: [
                                                { type: 'day', value: 18 },
                                                { type: 'day', value: 28 },
                                            ],
                                        },
                                    },
                                ],
                            })];
                    case 3:
                        // Manually update the rule
                        _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).select(['next_date']))];
                    case 4:
                        res = _a.sent();
                        row = res.data[0];
                        expect(row.next_date).toBe('2020-12-30');
                        return [4 /*yield*/, (0, app_1.setNextDate)({ id: id })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).select(['next_date']))];
                    case 6:
                        res = _a.sent();
                        row = res.data[0];
                        expect(row.next_date).toBe('2021-05-18');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
