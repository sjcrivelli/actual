"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arithmetic_1 = require("./arithmetic");
var util_1 = require("./util");
describe('arithmetic', function () {
    test('handles negative numbers', function () {
        expect((0, arithmetic_1.evalArithmetic)('-4')).toBe(-4);
        expect((0, arithmetic_1.evalArithmetic)('10 + -4')).toBe(6);
    });
    test('handles simple addition', function () {
        expect((0, arithmetic_1.evalArithmetic)('10 + 10')).toEqual(20);
        expect((0, arithmetic_1.evalArithmetic)('1.5 + 1.5')).toEqual(3);
        expect((0, arithmetic_1.evalArithmetic)('(12 + 3) + (10)')).toEqual(25);
        expect((0, arithmetic_1.evalArithmetic)('10 + 20 + 30 + 40')).toEqual(100);
    });
    test('handles simple subtraction', function () {
        expect((0, arithmetic_1.evalArithmetic)('10 - 10')).toEqual(0);
        expect((0, arithmetic_1.evalArithmetic)('4.5 - 1.5')).toEqual(3);
        expect((0, arithmetic_1.evalArithmetic)('(12 - 3) - (10)')).toEqual(-1);
        expect((0, arithmetic_1.evalArithmetic)('10 - 20 - 30 - 40')).toEqual(-80);
    });
    test('handles multiplication', function () {
        expect((0, arithmetic_1.evalArithmetic)('10 * 10')).toEqual(100);
        expect((0, arithmetic_1.evalArithmetic)('1.5 * 1.5')).toEqual(2.25);
        expect((0, arithmetic_1.evalArithmetic)('10 * 20 * 30 * 40')).toEqual(240000);
    });
    test('handles division', function () {
        expect((0, arithmetic_1.evalArithmetic)('10 / 10')).toEqual(1);
        expect((0, arithmetic_1.evalArithmetic)('1.5 / .5')).toEqual(3);
        expect((0, arithmetic_1.evalArithmetic)('2400 / 2 / 5')).toEqual(240);
    });
    test('handles order of operations', function () {
        expect((0, arithmetic_1.evalArithmetic)('(5 + 3) * 10')).toEqual(80);
        expect((0, arithmetic_1.evalArithmetic)('5 + 3 * 10')).toEqual(35);
        expect((0, arithmetic_1.evalArithmetic)('20^3 - 5 * (10 / 2)')).toEqual(7975);
    });
    test('respects current number format', function () {
        expect((0, arithmetic_1.evalArithmetic)('1,222.45')).toEqual(1222.45);
        (0, util_1.setNumberFormat)({ format: 'space-comma', hideFraction: false });
        expect((0, arithmetic_1.evalArithmetic)('1\u202F222,45')).toEqual(1222.45);
        (0, util_1.setNumberFormat)({ format: 'apostrophe-dot', hideFraction: false });
        expect((0, arithmetic_1.evalArithmetic)('1’222.45')).toEqual(1222.45);
    });
});
