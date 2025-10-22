"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberFormatterTooltip = void 0;
var numberFormatterTooltip = function (value) {
    if (typeof value === 'number') {
        return Math.round(value);
    }
    return null; // or some default value for other cases
};
exports.numberFormatterTooltip = numberFormatterTooltip;
