"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unicodeLike = unicodeLike;
const lru_cache_1 = require("lru-cache");
const likePatternCache = new lru_cache_1.LRUCache({ max: 500 });
function unicodeLike(pattern, value) {
    if (!pattern) {
        return 0;
    }
    if (!value) {
        value = '';
    }
    let cachedRegExp = likePatternCache.get(pattern);
    if (!cachedRegExp) {
        // we don't escape ? and % because we don't know
        // whether they originate from the user input or from our query compiler.
        // Maybe improve the query compiler to correctly process these characters?
        const processedPattern = pattern
            .replace(/[.*+^${}()|[\]\\]/g, '\\$&')
            .replaceAll('?', '.')
            .replaceAll('%', '.*');
        cachedRegExp = new RegExp(processedPattern, 'i');
        likePatternCache.set(pattern, cachedRegExp);
    }
    return cachedRegExp.test(value) ? 1 : 0;
}
//# sourceMappingURL=unicodeLike.js.map