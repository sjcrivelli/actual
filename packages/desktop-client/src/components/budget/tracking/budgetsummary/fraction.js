"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fraction = fraction;
// @ts-strict-ignore
function fraction(num, denom) {
    if (denom === 0) {
        if (num > 0) {
            return 1;
        }
        return 0;
    }
    return num / denom;
}
