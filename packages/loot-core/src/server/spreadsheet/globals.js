"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.number = number;
function number(v) {
    if (typeof v === 'number') {
        return v;
    }
    else if (typeof v === 'string') {
        var parsed = parseFloat(v);
        if (isNaN(parsed)) {
            return 0;
        }
        return parsed;
    }
    return 0;
}
