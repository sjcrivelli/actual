"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var vitest_1 = require("vitest");
var util_1 = require("../../shared/util");
var aql = require("../aql");
var db = require("../db");
var actions = require("./actions");
var category_template_context_1 = require("./category-template-context");
// Mock getSheetValue and getCategories
vitest_1.vi.mock('./actions', function () { return ({
    getSheetValue: vitest_1.vi.fn(),
    getSheetBoolean: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('../db', function () { return ({
    getCategories: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('../aql', function () { return ({
    aqlQuery: vitest_1.vi.fn(),
}); });
// Test helper class to access constructor and methods
var TestCategoryTemplateContext = /** @class */ (function (_super) {
    __extends(TestCategoryTemplateContext, _super);
    function TestCategoryTemplateContext(templates, category, month, fromLastMonth, budgeted) {
        return _super.call(this, templates, category, month, fromLastMonth, budgeted) || this;
    }
    return TestCategoryTemplateContext;
}(category_template_context_1.CategoryTemplateContext));
describe('CategoryTemplateContext', function () {
    describe('runSimple', function () {
        it('should return monthly amount when provided', function () {
            var template = {
                type: 'simple',
                monthly: 100,
                directive: 'template',
                priority: 1,
            };
            var limit = 0;
            var result = category_template_context_1.CategoryTemplateContext.runSimple(template, limit);
            expect(result).toBe((0, util_1.amountToInteger)(100));
        });
        it('should return limit when monthly is not provided', function () {
            var template = {
                type: 'simple',
                limit: { amount: 500, hold: false, period: 'monthly' },
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runSimple(template, 500);
            expect(result).toBe(500);
        });
        it('should handle weekly limit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, template, instance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        template = {
                            type: 'simple',
                            limit: {
                                amount: 100,
                                hold: false,
                                period: 'weekly',
                                start: '2024-01-01',
                            },
                            directive: 'template',
                            priority: 1,
                        };
                        instance = new TestCategoryTemplateContext([template], category, '2024-01', 0, 0);
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 100000, 100000)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(50000); // 5 Mondays * 100
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle daily limit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, template, instance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        template = {
                            type: 'simple',
                            limit: { amount: 10, hold: false, period: 'daily' },
                            directive: 'template',
                            priority: 1,
                        };
                        instance = new TestCategoryTemplateContext([template], category, '2024-01', 0, 0);
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 100000, 100000)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(31000); // 31 days * 10
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('runCopy', function () {
        var instance;
        beforeEach(function () {
            var category = {
                id: 'test',
                name: 'Test Category',
                group: 'test-group',
                is_income: false,
            };
            instance = new TestCategoryTemplateContext([], category, '2024-01', 0, 0);
            vitest_1.vi.clearAllMocks();
        });
        it('should copy budget from previous month', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'copy',
                            lookBack: 1,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValue(100);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runCopy(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should copy budget from multiple months back', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'copy',
                            lookBack: 3,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValue(200);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runCopy(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle zero budget amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'copy',
                            lookBack: 1,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValue(0);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runCopy(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('runPeriodic', function () {
        var instance;
        beforeEach(function () {
            var category = {
                id: 'test',
                name: 'Test Category',
                group: 'test-group',
                is_income: false,
            };
            instance = new TestCategoryTemplateContext([], category, '2024-01', 0, 0);
        });
        //5 mondays in January 2024
        it('should calculate weekly amount for single week', function () {
            var template = {
                type: 'periodic',
                amount: 100,
                period: {
                    period: 'week',
                    amount: 1,
                },
                starting: '2024-01-01',
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runPeriodic(template, instance);
            expect(result).toBe((0, util_1.amountToInteger)(500));
        });
        it('should calculate weekly amount for multiple weeks', function () {
            var template = {
                type: 'periodic',
                amount: 100,
                period: {
                    period: 'week',
                    amount: 2,
                },
                starting: '2024-01-01',
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runPeriodic(template, instance);
            expect(result).toBe((0, util_1.amountToInteger)(300));
        });
        it('should handle weeks spanning multiple months', function () {
            var template = {
                type: 'periodic',
                amount: 100,
                period: {
                    period: 'week',
                    amount: 7,
                },
                starting: '2023-12-04',
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runPeriodic(template, instance);
            expect(result).toBe((0, util_1.amountToInteger)(100));
        });
        it('should handle periodic days', function () {
            var template = {
                type: 'periodic',
                amount: 100,
                period: {
                    period: 'day',
                    amount: 10,
                },
                starting: '2024-01-01',
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runPeriodic(template, instance);
            expect(result).toBe((0, util_1.amountToInteger)(400)); // for the 1st, 11th, 21st, 31st
        });
        it('should handle periodic years', function () {
            var template = {
                type: 'periodic',
                amount: 100,
                period: {
                    period: 'year',
                    amount: 1,
                },
                starting: '2023-01-01',
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runPeriodic(template, instance);
            expect(result).toBe((0, util_1.amountToInteger)(100));
        });
        it('should handle periodic months', function () {
            var template = {
                type: 'periodic',
                amount: 100,
                period: {
                    period: 'month',
                    amount: 2,
                },
                starting: '2023-11-01',
                directive: 'template',
                priority: 1,
            };
            var result = category_template_context_1.CategoryTemplateContext.runPeriodic(template, instance);
            expect(result).toBe((0, util_1.amountToInteger)(100));
        });
    });
    describe('runSpend', function () {
        var instance;
        beforeEach(function () {
            var category = {
                id: 'test',
                name: 'Test Category',
                group: 'test-group',
                is_income: false,
            };
            instance = new TestCategoryTemplateContext([], category, '2024-01', 0, 0);
            vitest_1.vi.clearAllMocks();
        });
        it('should calculate monthly amount needed to reach target', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'spend',
                            amount: 1000,
                            from: '2023-11',
                            month: '2024-01',
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue)
                            .mockResolvedValueOnce(-10000) // spent in Nov
                            .mockResolvedValueOnce(20000) // leftover in Nov
                            .mockResolvedValueOnce(10000); // budgeted in Dec
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runSpend(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(60000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle repeating spend template', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'spend',
                            amount: 1000,
                            from: '2023-11',
                            month: '2023-12',
                            //@ts-ignore this is what the template expects
                            repeat: 3,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue)
                            .mockResolvedValueOnce(-10000)
                            .mockResolvedValueOnce(20000)
                            .mockResolvedValueOnce(10000);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runSpend(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(33333);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return zero for past target date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'spend',
                            amount: 1000,
                            from: '2023-12',
                            month: '2023-12',
                            directive: 'template',
                            priority: 1,
                        };
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runSpend(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('runPercentage', function () {
        var instance;
        beforeEach(function () {
            var category = {
                id: 'test',
                name: 'Test Category',
                group: 'test-group',
                is_income: false,
            };
            instance = new TestCategoryTemplateContext([], category, '2024-01', 0, 0);
            vitest_1.vi.clearAllMocks();
        });
        it('should calculate percentage of all income', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'percentage',
                            percent: 10,
                            category: 'all income',
                            previous: false,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValue(10000);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runPercentage(template, 0, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(1000); // 10% of 10000
                        return [2 /*return*/];
                }
            });
        }); });
        it('should calculate percentage of available funds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'percentage',
                            percent: 20,
                            category: 'available funds',
                            previous: false,
                            directive: 'template',
                            priority: 1,
                        };
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runPercentage(template, 500, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(100); // 20% of 500
                        return [2 /*return*/];
                }
            });
        }); });
        it('should calculate percentage of specific income category', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'percentage',
                            percent: 15,
                            category: 'Salary',
                            previous: false,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(db.getCategories).mockResolvedValue([
                            {
                                id: 'income1',
                                name: 'Salary',
                                is_income: 1,
                                cat_group: 'income',
                                sort_order: 1,
                                hidden: 0,
                                tombstone: 0,
                            },
                        ]);
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValue(2000);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runPercentage(template, 0, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(300); // 15% of 2000
                        return [2 /*return*/];
                }
            });
        }); });
        it('should calculate percentage of previous month income', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'percentage',
                            percent: 10,
                            category: 'all income',
                            previous: true,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValue(10000);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runPercentage(template, 0, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(1000); // 10% of 10000
                        expect(actions.getSheetValue).toHaveBeenCalledWith('budget202312', 'total-income');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('runAverage', function () {
        var instance;
        beforeEach(function () {
            var category = {
                id: 'test',
                name: 'Test Category',
                group: 'test-group',
                is_income: false,
            };
            instance = new TestCategoryTemplateContext([], category, '2024-01', 0, 0);
            vitest_1.vi.clearAllMocks();
        });
        it('should calculate average of 3 months', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'average',
                            numMonths: 3,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue)
                            .mockResolvedValueOnce(-100) // Dec 2023
                            .mockResolvedValueOnce(-200) // Nov 2023
                            .mockResolvedValueOnce(-300); // Oct 2023
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runAverage(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(200); // Average of -100, -200, -300
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle zero amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'average',
                            numMonths: 3,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue)
                            .mockResolvedValueOnce(0)
                            .mockResolvedValueOnce(0)
                            .mockResolvedValueOnce(-300);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runAverage(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(100);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle mixed positive and negative amounts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var template, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        template = {
                            type: 'average',
                            numMonths: 3,
                            directive: 'template',
                            priority: 1,
                        };
                        vitest_1.vi.mocked(actions.getSheetValue)
                            .mockResolvedValueOnce(-100)
                            .mockResolvedValueOnce(200)
                            .mockResolvedValueOnce(-300);
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.runAverage(template, instance)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(67); // Average of -100, 200, -300
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('runBy', function () {
        var instance;
        beforeEach(function () {
            var category = {
                id: 'test',
                name: 'Test Category',
                group: 'test-group',
                is_income: false,
            };
            instance = new TestCategoryTemplateContext([
                {
                    type: 'by',
                    amount: 1000,
                    month: '2024-03',
                    directive: 'template',
                    priority: 1,
                },
                {
                    type: 'by',
                    amount: 2000,
                    month: '2024-06',
                    directive: 'template',
                    priority: 1,
                },
            ], category, '2024-01', 0, 0);
        });
        it('should calculate monthly amount needed for multiple targets', function () {
            var result = category_template_context_1.CategoryTemplateContext.runBy(instance);
            expect(result).toBe(66667);
        });
        it('should handle repeating targets', function () {
            instance = new TestCategoryTemplateContext([
                {
                    type: 'by',
                    amount: 1000,
                    month: '2023-03',
                    repeat: 12,
                    directive: 'template',
                    priority: 1,
                },
                {
                    type: 'by',
                    amount: 2000,
                    month: '2023-06',
                    repeat: 12,
                    directive: 'template',
                    priority: 1,
                },
            ], instance.category, '2024-01', 0, 0);
            var result = category_template_context_1.CategoryTemplateContext.runBy(instance);
            expect(result).toBe(83333);
        });
        it('should handle existing balance', function () {
            instance = new TestCategoryTemplateContext([
                {
                    type: 'by',
                    amount: 1000,
                    month: '2024-03',
                    directive: 'template',
                    priority: 1,
                },
                {
                    type: 'by',
                    amount: 2000,
                    month: '2024-06',
                    directive: 'template',
                    priority: 1,
                },
            ], instance.category, '2024-01', 500, 0);
            var result = category_template_context_1.CategoryTemplateContext.runBy(instance);
            expect(result).toBe(66500); // (1000 + 2000 - 5) / 3
        });
    });
    describe('template priorities', function () {
        it('should handle multiple templates with priorities and insufficient funds', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'simple',
                                monthly: 200,
                                directive: 'template',
                                priority: 1,
                            },
                        ];
                        instance = new TestCategoryTemplateContext(templates, category, '2024-01', 0, 0);
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 150, 150)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(150); // Max out at available funds
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('category limits', function () {
        it('should not budget over monthly limit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                limit: { amount: 150, hold: false, period: 'monthly' },
                                directive: 'template',
                                priority: 1,
                            },
                        ];
                        instance = new TestCategoryTemplateContext(templates, category, '2024-01', 9000, 0);
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 10000, 10000)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(6000); //150 - 90
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle hold flag when limit is reached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                limit: { amount: 200, hold: true, period: 'monthly' },
                                directive: 'template',
                                priority: 1,
                            },
                        ];
                        instance = new TestCategoryTemplateContext(templates, category, '2024-01', 300, 0);
                        return [4 /*yield*/, instance.getLimitExcess()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove funds if over limit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                limit: { amount: 200, hold: false, period: 'monthly' },
                                directive: 'template',
                                priority: 1,
                            },
                        ];
                        instance = new TestCategoryTemplateContext(templates, category, '2024-01', 30000, 0);
                        return [4 /*yield*/, instance.getLimitExcess()];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(10000);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('remainder templates', function () {
        it('should distribute available funds based on weight', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                category = {
                    id: 'test',
                    name: 'Test Category',
                    group: 'test-group',
                    is_income: false,
                };
                templates = [
                    {
                        type: 'remainder',
                        weight: 2,
                        directive: 'template',
                        priority: null,
                    },
                ];
                instance = new TestCategoryTemplateContext(templates, category, '2024-01', 0, 0);
                result = instance.runRemainder(100, 50);
                expect(result).toBe(100); // 2 * 50 = 100
                return [2 /*return*/];
            });
        }); });
        it('remainder should handle last cent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                category = {
                    id: 'test',
                    name: 'Test Category',
                    group: 'test-group',
                    is_income: false,
                };
                templates = [
                    {
                        type: 'remainder',
                        weight: 1,
                        directive: 'template',
                        priority: null,
                    },
                ];
                instance = new TestCategoryTemplateContext(templates, category, '2024-01', 0, 0);
                result = instance.runRemainder(101, 100);
                expect(result).toBe(101);
                return [2 /*return*/];
            });
        }); });
        it('remainder wont over budget', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result;
            return __generator(this, function (_a) {
                category = {
                    id: 'test',
                    name: 'Test Category',
                    group: 'test-group',
                    is_income: false,
                };
                templates = [
                    {
                        type: 'remainder',
                        weight: 1,
                        directive: 'template',
                        priority: null,
                    },
                ];
                instance = new TestCategoryTemplateContext(templates, category, '2024-01', 0, 0);
                result = instance.runRemainder(99, 100);
                expect(result).toBe(99);
                return [2 /*return*/];
            });
        }); });
    });
    describe('full process', function () {
        it('should handle priority limits through the entire process', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, priority1Result, priority2Result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'simple',
                                monthly: 200,
                                directive: 'template',
                                priority: 2,
                            },
                            {
                                type: 'remainder',
                                weight: 1,
                                directive: 'template',
                                priority: null,
                            },
                        ];
                        // Mock the sheet values needed for init
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValueOnce(0); // lastMonthBalance
                        vitest_1.vi.mocked(actions.getSheetBoolean).mockResolvedValueOnce(false); // carryover
                        vitest_1.vi.mocked(aql.aqlQuery).mockResolvedValueOnce({
                            data: [{ value: 'false' }],
                            dependencies: [],
                        });
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, '2024-01', 0)];
                    case 1:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 15000, 15000)];
                    case 2:
                        priority1Result = _a.sent();
                        return [4 /*yield*/, instance.runTemplatesForPriority(2, 15000 - priority1Result, 15000)];
                    case 3:
                        priority2Result = _a.sent();
                        values = instance.getValues();
                        // Verify the results
                        expect(priority1Result).toBe(10000); // Should get full amount for priority 1
                        expect(priority2Result).toBe(5000); // Should get remaining funds for priority 2
                        expect(values.budgeted).toBe(15000); // Should match the total of both priorities
                        expect(values.goal).toBe(30000); // Should be the sum of all template amounts
                        expect(values.longGoal).toBe(null); // No goal template
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle category limits through the entire process', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'simple',
                                monthly: 200,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'simple',
                                limit: { amount: 150, hold: false, period: 'monthly' },
                                directive: 'template',
                                priority: 1,
                            },
                        ];
                        // Mock the sheet values needed for init
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValueOnce(0); // lastMonthBalance
                        vitest_1.vi.mocked(actions.getSheetBoolean).mockResolvedValueOnce(false); // carryover
                        vitest_1.vi.mocked(aql.aqlQuery).mockResolvedValueOnce({
                            data: [{ value: 'false' }],
                            dependencies: [],
                        });
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, '2024-01', 0)];
                    case 1:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 100000, 100000)];
                    case 2:
                        result = _a.sent();
                        values = instance.getValues();
                        // Verify the results
                        expect(result).toBe(15000); // Should be limited by the category limit
                        expect(values.budgeted).toBe(15000); // Should match the limit
                        expect(values.goal).toBe(15000); // Should be the limit amount
                        expect(values.longGoal).toBe(null); // No goal template
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle remainder template at the end of the process', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, weight, result, perWeight, remainderResult, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'simple',
                                monthly: 200,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'remainder',
                                weight: 1,
                                directive: 'template',
                                priority: null,
                            },
                        ];
                        // Mock the sheet values needed for init
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValueOnce(0); // lastMonthBalance
                        vitest_1.vi.mocked(actions.getSheetBoolean).mockResolvedValueOnce(false); // carryover
                        vitest_1.vi.mocked(aql.aqlQuery).mockResolvedValueOnce({
                            data: [{ value: 'false' }],
                            dependencies: [],
                        });
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, '2024-01', 0)];
                    case 1:
                        instance = _a.sent();
                        weight = instance.getRemainderWeight();
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 100000, 100000)];
                    case 2:
                        result = _a.sent();
                        perWeight = (100000 - result) / weight;
                        remainderResult = instance.runRemainder(perWeight, perWeight);
                        values = instance.getValues();
                        // Verify the results
                        expect(result).toBe(30000); // Should get full amount for both simple templates
                        expect(remainderResult).toBe(70000); // Should get remaining funds
                        expect(values.budgeted).toBe(100000); // Should match the total of all templates
                        expect(values.goal).toBe(30000); // Should be the sum of the simple templates
                        expect(values.longGoal).toBe(null); // No goal template
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle goal template through the entire process', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'simple',
                                monthly: 200,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'goal',
                                amount: 1000,
                                directive: 'goal',
                            },
                        ];
                        // Mock the sheet values needed for init
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValueOnce(0); // lastMonthBalance
                        vitest_1.vi.mocked(actions.getSheetBoolean).mockResolvedValueOnce(false); // carryover
                        vitest_1.vi.mocked(aql.aqlQuery).mockResolvedValueOnce({
                            data: [{ value: 'false' }],
                            dependencies: [],
                        });
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, '2024-01', 0)];
                    case 1:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 100000, 100000)];
                    case 2:
                        result = _a.sent();
                        values = instance.getValues();
                        // Verify the results
                        expect(result).toBe(30000); // Should get full amount for both simple templates
                        expect(values.budgeted).toBe(30000); // Should match the result
                        expect(values.goal).toBe(100000); // Should be the goal amount
                        expect(values.longGoal).toBe(true); // Should have a long goal
                        expect(instance.isGoalOnly()).toBe(false); // Should not be goal only
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle goal-only template through the entire process', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'goal',
                                amount: 1000,
                                directive: 'goal',
                            },
                        ];
                        // Mock the sheet values needed for init
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValueOnce(10000); // lastMonthBalance
                        vitest_1.vi.mocked(actions.getSheetBoolean).mockResolvedValueOnce(false); // carryover
                        vitest_1.vi.mocked(aql.aqlQuery).mockResolvedValueOnce({
                            data: [{ value: 'false' }],
                            dependencies: [],
                        });
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, '2024-01', 10000)];
                    case 1:
                        instance = _a.sent();
                        expect(instance.isGoalOnly()).toBe(true); // Should be goal only
                        values = instance.getValues();
                        // Verify the results
                        expect(values.budgeted).toBe(10000);
                        expect(values.goal).toBe(100000); // Should be the goal amount
                        expect(values.longGoal).toBe(true); // Should have a long goal
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle hide fraction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var category, templates, instance, result, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        category = {
                            id: 'test',
                            name: 'Test Category',
                            group: 'test-group',
                            is_income: false,
                        };
                        templates = [
                            {
                                type: 'simple',
                                monthly: 100.89,
                                directive: 'template',
                                priority: 1,
                            },
                            {
                                type: 'goal',
                                amount: 1000,
                                directive: 'goal',
                            },
                        ];
                        // Mock the sheet values needed for init
                        vitest_1.vi.mocked(actions.getSheetValue).mockResolvedValueOnce(0); // lastMonthBalance
                        vitest_1.vi.mocked(actions.getSheetBoolean).mockResolvedValueOnce(false); // carryover
                        vitest_1.vi.mocked(aql.aqlQuery).mockResolvedValueOnce({
                            data: [{ value: 'true' }],
                            dependencies: [],
                        });
                        return [4 /*yield*/, category_template_context_1.CategoryTemplateContext.init(templates, category, '2024-01', 0)];
                    case 1:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.runTemplatesForPriority(1, 100000, 100000)];
                    case 2:
                        result = _a.sent();
                        values = instance.getValues();
                        // Verify the results
                        expect(result).toBe(10100); // Should get full amount rounded up
                        expect(values.budgeted).toBe(10100); // Should match the result
                        expect(values.goal).toBe(100000); // Should be the goal amount
                        expect(values.longGoal).toBe(true); // Should have a long goal
                        expect(instance.isGoalOnly()).toBe(false); // Should not be goal only
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
