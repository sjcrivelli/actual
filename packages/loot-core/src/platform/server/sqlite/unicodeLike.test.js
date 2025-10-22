"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unicodeLike_1 = require("./unicodeLike");
describe('unicode LIKE functionality', function () {
    it('empty pattern should not match to a value', function () {
        var result = (0, unicodeLike_1.unicodeLike)(null, 'value');
        expect(result).toBe(0);
    });
    it('empty pattern should not match to null', function () {
        var result = (0, unicodeLike_1.unicodeLike)(null, null);
        expect(result).toBe(0);
    });
    it('should match special characters', function () {
        var result = (0, unicodeLike_1.unicodeLike)('.*+^${}()|[]\\', '.*+^${}()|[]\\');
        expect(result).toBe(1);
    });
    it('should use ? as the single character placeholder', function () {
        var result = (0, unicodeLike_1.unicodeLike)('t?st', 'test');
        expect(result).toBe(1);
    });
    it('should use % as the zero-or-more characters placeholder', function () {
        var result = (0, unicodeLike_1.unicodeLike)('t%st', 'te123st');
        expect(result).toBe(1);
    });
    it('should ignore case for unicode', function () {
        var result = (0, unicodeLike_1.unicodeLike)('á', 'Ábcdefg');
        expect(result).toBe(1);
    });
    it('should ignore case for ascii', function () {
        var result = (0, unicodeLike_1.unicodeLike)('a', 'Abcdefg');
        expect(result).toBe(1);
    });
    it('should treat null value as empty string', function () {
        var result = (0, unicodeLike_1.unicodeLike)('%', null);
        expect(result).toBe(1);
    });
    it('should not match null value to the string “null”', function () {
        var result = (0, unicodeLike_1.unicodeLike)('null', null);
        expect(result).toBe(0);
    });
});
