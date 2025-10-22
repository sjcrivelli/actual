"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePadding = computePadding;
/**
 * Calculates the left padding needed for chart axis based on formatted number length
 * @param values Array of numeric values
 * @param formatter Function to format numbers to strings
 * @returns Padding amount in pixels
 */
function computePadding(values, formatter) {
    if (values.length === 0) {
        return 0;
    }
    var maxLength = Math.max.apply(Math, values.map(function (value) {
        return formatter(Math.round(value)).length;
    }));
    return Math.max(0, (maxLength - 5) * 5);
}
