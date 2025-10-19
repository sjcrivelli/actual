"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
const mockdate_1 = __importDefault(require("mockdate"));
const query_1 = require("../../shared/query");
const schedules_1 = require("../../shared/schedules");
const aql_1 = require("../aql");
const mappings_1 = require("../db/mappings");
const transaction_rules_1 = require("../transactions/transaction-rules");
const app_1 = require("./app");
beforeEach(async () => {
    await global.emptyDatabase()();
    await (0, mappings_1.loadMappings)();
    await (0, transaction_rules_1.loadRules)();
});
describe('schedule app', () => {
    describe('utility', () => {
        it('conditions are updated when they exist', () => {
            const conds = [
                { op: 'is', field: 'payee', value: 'FOO' },
                { op: 'is', field: 'date', value: '2020-01-01' },
            ];
            const updated = (0, app_1.updateConditions)(conds, [
                {
                    op: 'is',
                    field: 'payee',
                    value: 'bar',
                },
            ]);
            expect(updated.length).toBe(2);
            expect(updated[0].value).toBe('bar');
        });
        it('conditions are added if they don’t exist', () => {
            const conds = [
                { op: 'contains', field: 'payee', value: 'FOO' },
                { op: 'contains', field: 'notes', value: 'dflksjdflskdjf' },
            ];
            const updated = (0, app_1.updateConditions)(conds, [
                {
                    op: 'is',
                    field: 'payee',
                    value: 'bar',
                },
            ]);
            expect(updated.length).toBe(3);
        });
        it('getNextDate works with date conditions', () => {
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
    describe('methods', () => {
        it('createSchedule creates a schedule', async () => {
            const id = await (0, app_1.createSchedule)({
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
            });
            const { data: [row], } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).select('*'));
            expect(row).toBeTruthy();
            expect(row.rule).toBeTruthy();
            expect(row.next_date).toBe('2020-12-30');
            await expect((0, app_1.createSchedule)({
                conditions: [{ op: 'is', field: 'payee', value: 'p1' }],
            })).rejects.toThrow(/date condition is required/);
        });
        it('updateSchedule updates a schedule', async () => {
            const id = await (0, app_1.createSchedule)({
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
            });
            let res = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules')
                .filter({ id })
                .select(['next_date', 'posts_transaction']));
            let row = res.data[0];
            expect(row.next_date).toBe('2020-12-30');
            expect(row.posts_transaction).toBe(false);
            mockdate_1.default.set(new Date(2021, 4, 17));
            await (0, app_1.updateSchedule)({
                schedule: { id, posts_transaction: true },
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
            });
            res = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules')
                .filter({ id })
                .select(['next_date', 'posts_transaction']));
            row = res.data[0];
            // Updating the date condition updates `next_date`
            expect(row.next_date).toBe('2021-05-18');
            expect(row.posts_transaction).toBe(true);
        });
        it('deleteSchedule deletes a schedule', async () => {
            const id = await (0, app_1.createSchedule)({
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
            });
            const { data: schedules } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').select('*'));
            expect(schedules.length).toBe(1);
            await (0, app_1.deleteSchedule)({ id });
            const { data: schedules2 } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').select('*'));
            expect(schedules2.length).toBe(0);
        });
        it('setNextDate sets `next_date`', async () => {
            const id = await (0, app_1.createSchedule)({
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
            });
            const { data: ruleId } = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).calculate('rule'));
            // Manually update the rule
            await (0, transaction_rules_1.updateRule)({
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
            });
            let res = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).select(['next_date']));
            let row = res.data[0];
            expect(row.next_date).toBe('2020-12-30');
            await (0, app_1.setNextDate)({ id });
            res = await (0, aql_1.aqlQuery)((0, query_1.q)('schedules').filter({ id }).select(['next_date']));
            row = res.data[0];
            expect(row.next_date).toBe('2021-05-18');
        });
    });
});
