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
var db = require("../db");
var goal_template_pegjs_1 = require("./goal-template.pegjs");
var statements_1 = require("./statements");
var template_notes_1 = require("./template-notes");
vi.mock('../db');
vi.mock('./statements');
function mockGetTemplateNotesForCategories(templateNotes) {
    vi.mocked(statements_1.getCategoriesWithTemplateNotes).mockResolvedValue(templateNotes);
}
function mockGetActiveSchedules(schedules) {
    vi.mocked(statements_1.getActiveSchedules).mockResolvedValue(schedules);
}
function mockDbUpdate() {
    vi.mocked(db.updateWithSchema).mockResolvedValue(undefined);
}
describe('storeNoteTemplates', function () {
    beforeEach(function () {
        vi.clearAllMocks();
    });
    var testCases = [
        {
            description: 'Stores templates for categories with valid template notes',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template 10',
                },
            ],
            expectedTemplates: [
                {
                    type: 'simple',
                    monthly: 10,
                    limit: null,
                    priority: 0,
                    directive: 'template',
                },
            ],
        },
        {
            description: 'Stores negative templates for categories with valid template notes',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template -103.23',
                },
            ],
            expectedTemplates: [
                {
                    type: 'simple',
                    monthly: -103.23,
                    limit: null,
                    priority: 0,
                    directive: 'template',
                },
            ],
        },
        {
            description: 'Stores template when prefix is used with valid template notes',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: 'test: #template 12',
                },
            ],
            expectedTemplates: [
                {
                    type: 'simple',
                    monthly: 12,
                    limit: null,
                    priority: 0,
                    directive: 'template',
                },
            ],
        },
        {
            description: 'Stores templates for categories with valid goal directive template notes',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#goal 10',
                },
            ],
            expectedTemplates: [
                {
                    type: 'goal',
                    amount: 10,
                    priority: null,
                    directive: 'goal',
                },
            ],
        },
        {
            description: 'Does not store empty template notes',
            mockTemplateNotes: [{ id: 'cat1', name: 'Category 1', note: '' }],
            expectedTemplates: [],
        },
        {
            description: 'Does not store non template notes',
            mockTemplateNotes: [
                { id: 'cat1', name: 'Category 1', note: 'Not a template note' },
            ],
            expectedTemplates: [],
        },
    ];
    it.each(testCases)('$description', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var mockTemplateNotes = _b.mockTemplateNotes, expectedTemplates = _b.expectedTemplates;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // Given
                    mockGetTemplateNotesForCategories(mockTemplateNotes);
                    mockDbUpdate();
                    // When
                    return [4 /*yield*/, (0, template_notes_1.storeNoteTemplates)()];
                case 1:
                    // When
                    _c.sent();
                    // Then
                    if (expectedTemplates.length === 0) {
                        expect(db.updateWithSchema).not.toHaveBeenCalled();
                        expect(statements_1.resetCategoryGoalDefsWithNoTemplates).toHaveBeenCalled();
                        return [2 /*return*/];
                    }
                    mockTemplateNotes.forEach(function (_a) {
                        var id = _a.id;
                        expect(db.updateWithSchema).toHaveBeenCalledWith('categories', {
                            id: id,
                            goal_def: JSON.stringify(expectedTemplates),
                            template_settings: { source: 'notes' },
                        });
                    });
                    expect(statements_1.resetCategoryGoalDefsWithNoTemplates).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('checkTemplates', function () {
    beforeEach(function () {
        vi.clearAllMocks();
    });
    var testCases = [
        {
            description: 'Returns success message when templates pass',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template 10',
                },
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template schedule Mock Schedule 1',
                },
            ],
            mockSchedules: mockSchedules(),
            expected: {
                type: 'message',
                message: 'All templates passed! 🎉',
            },
        },
        {
            description: 'Skips notes that are not templates',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: 'Not a template note',
                },
            ],
            mockSchedules: mockSchedules(),
            expected: {
                type: 'message',
                message: 'All templates passed! 🎉',
            },
        },
        {
            description: 'Returns errors for templates with parsing errors',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template broken template',
                },
            ],
            mockSchedules: mockSchedules(),
            expected: {
                sticky: true,
                message: 'There were errors interpreting some templates:',
                pre: 'Category 1: #template broken template',
            },
        },
        {
            description: 'Returns errors for non-existent schedules',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template schedule Non-existent Schedule',
                },
            ],
            mockSchedules: mockSchedules(),
            expected: {
                sticky: true,
                message: 'There were errors interpreting some templates:',
                pre: 'Category 1: Schedule “Non-existent Schedule” does not exist',
            },
        },
        {
            description: 'Returns errors for invalid increase schedule adjustments',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template schedule Mock Schedule 1 [increase 1001%]',
                },
            ],
            mockSchedules: mockSchedules(),
            expected: {
                sticky: true,
                message: 'There were errors interpreting some templates:',
                pre: 'Category 1: #template schedule Mock Schedule 1 [increase 1001%]\nError: Invalid adjustment percentage (1001%). Must be between -100% and 1000%',
            },
        },
        {
            description: 'Returns errors for invalid decrease schedule adjustments',
            mockTemplateNotes: [
                {
                    id: 'cat1',
                    name: 'Category 1',
                    note: '#template schedule Mock Schedule 1 [decrease 101%]',
                },
            ],
            mockSchedules: mockSchedules(),
            expected: {
                sticky: true,
                message: 'There were errors interpreting some templates:',
                pre: 'Category 1: #template schedule Mock Schedule 1 [decrease 101%]\nError: Invalid adjustment percentage (-101%). Must be between -100% and 1000%',
            },
        },
    ];
    it.each(testCases)('$description', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var result;
        var mockTemplateNotes = _b.mockTemplateNotes, mockSchedules = _b.mockSchedules, expected = _b.expected;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // Given
                    mockGetTemplateNotesForCategories(mockTemplateNotes);
                    mockGetActiveSchedules(mockSchedules);
                    return [4 /*yield*/, (0, template_notes_1.checkTemplateNotes)()];
                case 1:
                    result = _c.sent();
                    // Then
                    expect(result).toEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
});
function mockSchedules() {
    return [
        {
            id: 'mock-schedule-1',
            rule: 'mock-rule',
            active: 1,
            completed: 0,
            posts_transaction: 0,
            tombstone: 0,
            name: 'Mock Schedule 1',
        },
        {
            id: 'mock-schedule-2',
            rule: 'mock-rule',
            active: 1,
            completed: 0,
            posts_transaction: 0,
            tombstone: 0,
            name: 'Mock Schedule 2',
        },
    ];
}
describe('unparse/parse round-trip', function () {
    var cases = [
        // simple
        '#template 10',
        '#template up to 50',
        '#template up to 25 per day hold',
        '#template up to 100 per week starting 2025-01-01',
        '#template-2 123.45',
        // schedule
        '#template schedule Rent',
        '#template schedule full Mortgage',
        '#template schedule Netflix [increase 10%]',
        '#template schedule full Groceries [decrease 5%]',
        // percentage
        '#template 50% of Utilities',
        '#template 75% of previous Dining Out',
        // periodic
        '#template 200 repeat every 2 months starting 2025-06-01',
        '#template 300 repeat every week starting 2025-01-07',
        '#template 400 repeat every year starting 2025-01-01 up to 50',
        // by / spend
        '#template 500 by 2025-12',
        '#template 600 by 2025-11 repeat every month',
        '#template 700 by 2025-10 repeat every 2 months',
        '#template 800 by 2025-09 repeat every year',
        '#template 900 by 2025-08 repeat every 3 years',
        '#template 1000 by 2025-07 spend from 2025-01 repeat every month',
        '#template 1100 by 2025-06 spend from 2025-02 repeat every 2 months',
        // remainder
        '#template remainder',
        '#template remainder 2',
        '#template remainder 3 up to 10',
        // average
        '#template average 6 months',
        '#template-5 average 12 months',
        // copy
        '#template copy from 3 months ago',
        '#template copy from 6 months ago',
        // goal
        '#goal 1234',
    ];
    it.each(cases)('round-trips: %s', function (original) { return __awaiter(void 0, void 0, void 0, function () {
        var parsed, serialized, reparsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsed = (0, goal_template_pegjs_1.parse)(original);
                    return [4 /*yield*/, (0, template_notes_1.unparse)([parsed])];
                case 1:
                    serialized = _a.sent();
                    reparsed = (0, goal_template_pegjs_1.parse)(serialized);
                    expect(parsed).toEqual(reparsed);
                    return [2 /*return*/];
            }
        });
    }); });
});
