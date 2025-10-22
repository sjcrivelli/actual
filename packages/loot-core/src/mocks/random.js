"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
var Platform = require("../shared/platform");
// Fake "random" function used to have stable data structures for
// e2e and visual regression tests
var pseudoRandomIterator = 0;
function pseudoRandom() {
    pseudoRandomIterator += 0.45;
    if (pseudoRandomIterator > 1) {
        pseudoRandomIterator = 0;
    }
    return pseudoRandomIterator;
}
exports.random = Platform.isPlaywright ? pseudoRandom : Math.random;
