"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("../db"));
const rules_1 = require("../rules");
const app_1 = require("../schedules/app");
const actions_1 = require("./actions");
const schedule_template_1 = require("./schedule-template");
vi.mock('../db');
vi.mock('./actions');
vi.mock('../schedules/app', async () => {
    const actualModule = await vi.importActual('../schedules/app');
    return {
        ...actualModule,
        getRuleForSchedule: vi.fn(),
    };
});
describe('runSchedule', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should return correct budget when recurring schedule set', async () => {
        // Given
        const template_lines = [
            {
                type: 'schedule',
                name: 'Test Schedule',
                priority: 0,
                directive: 'template',
            },
        ];
        const current_month = '2024-08-01';
        const balance = 0;
        const remainder = 0;
        const last_month_balance = 0;
        const to_budget = 0;
        const errors = [];
        const category = { id: '1', name: 'Test Category' };
        vi.mocked(db.first).mockResolvedValue({ id: 1, completed: 0 });
        vi.mocked(app_1.getRuleForSchedule).mockResolvedValue(new rules_1.Rule({
            id: 'test',
            stage: 'pre',
            conditionsOp: 'and',
            conditions: [
                {
                    op: 'is',
                    field: 'date',
                    value: {
                        start: '2024-08-01',
                        interval: 1,
                        frequency: 'monthly',
                        patterns: [],
                        skipWeekend: false,
                        weekendSolveMode: 'before',
                        endMode: 'never',
                        endOccurrences: 1,
                        endDate: '2024-08-04',
                    },
                    type: 'date',
                },
                {
                    op: 'is',
                    field: 'amount',
                    value: -10000,
                    type: 'number',
                },
            ],
            actions: [],
        }));
        vi.mocked(actions_1.isReflectBudget).mockReturnValue(false);
        // When
        const result = await (0, schedule_template_1.runSchedule)(template_lines, current_month, balance, remainder, last_month_balance, to_budget, errors, category);
        // Then
        expect(result.to_budget).toBe(10000);
        expect(result.errors).toHaveLength(0);
        expect(result.remainder).toBe(0);
    });
    it('should return correct budget when yearly recurring schedule set and balance is greater than target', async () => {
        // Given
        const template_lines = [
            {
                type: 'schedule',
                name: 'Test Schedule',
                directive: 'template',
                priority: 0,
            },
        ];
        const current_month = '2024-09-01';
        const balance = 12000;
        const remainder = 0;
        const last_month_balance = 12000;
        const to_budget = 0;
        const errors = [];
        const category = { id: '1', name: 'Test Category' };
        vi.mocked(db.first).mockResolvedValue({ id: 1, completed: 0 });
        vi.mocked(app_1.getRuleForSchedule).mockResolvedValue(new rules_1.Rule({
            id: 'test',
            stage: 'pre',
            conditionsOp: 'and',
            conditions: [
                {
                    op: 'is',
                    field: 'date',
                    value: {
                        start: '2024-08-01',
                        interval: 1,
                        frequency: 'yearly',
                        patterns: [],
                        skipWeekend: false,
                        weekendSolveMode: 'before',
                        endMode: 'never',
                        endOccurrences: 1,
                        endDate: '2024-08-04',
                    },
                    type: 'date',
                },
                {
                    op: 'is',
                    field: 'amount',
                    value: -12000,
                    type: 'number',
                },
            ],
            actions: [],
        }));
        vi.mocked(actions_1.isReflectBudget).mockReturnValue(false);
        // When
        const result = await (0, schedule_template_1.runSchedule)(template_lines, current_month, balance, remainder, last_month_balance, to_budget, errors, category);
        // Then
        expect(result.to_budget).toBe(1000);
        expect(result.errors).toHaveLength(0);
        expect(result.remainder).toBe(0);
    });
});
