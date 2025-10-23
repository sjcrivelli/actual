"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unicodeLike_1 = require("./unicodeLike");
describe('unicode LIKE functionality', () => {
    it('empty pattern should not match to a value', () => {
        const result = (0, unicodeLike_1.unicodeLike)(null, 'value');
        expect(result).toBe(0);
    });
    it('empty pattern should not match to null', () => {
        const result = (0, unicodeLike_1.unicodeLike)(null, null);
        expect(result).toBe(0);
    });
    it('should match special characters', () => {
        const result = (0, unicodeLike_1.unicodeLike)('.*+^${}()|[]\\', '.*+^${}()|[]\\');
        expect(result).toBe(1);
    });
    it('should use ? as the single character placeholder', () => {
        const result = (0, unicodeLike_1.unicodeLike)('t?st', 'test');
        expect(result).toBe(1);
    });
    it('should use % as the zero-or-more characters placeholder', () => {
        const result = (0, unicodeLike_1.unicodeLike)('t%st', 'te123st');
        expect(result).toBe(1);
    });
    it('should ignore case for unicode', () => {
        const result = (0, unicodeLike_1.unicodeLike)('á', 'Ábcdefg');
        expect(result).toBe(1);
    });
    it('should ignore case for ascii', () => {
        const result = (0, unicodeLike_1.unicodeLike)('a', 'Abcdefg');
        expect(result).toBe(1);
    });
    it('should treat null value as empty string', () => {
        const result = (0, unicodeLike_1.unicodeLike)('%', null);
        expect(result).toBe(1);
    });
    it('should not match null value to the string “null”', () => {
        const result = (0, unicodeLike_1.unicodeLike)('null', null);
        expect(result).toBe(0);
    });
});
//# sourceMappingURL=unicodeLike.test.js.map