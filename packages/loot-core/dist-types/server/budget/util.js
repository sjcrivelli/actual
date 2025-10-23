"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.number = void 0;
exports.sumAmounts = sumAmounts;
exports.flatten2 = flatten2;
exports.unflatten2 = unflatten2;
// @ts-strict-ignore
const util_1 = require("../../shared/util");
const globals_1 = require("../spreadsheet/globals");
var globals_2 = require("../spreadsheet/globals");
Object.defineProperty(exports, "number", { enumerable: true, get: function () { return globals_2.number; } });
function sumAmounts(...amounts) {
    return (0, util_1.safeNumber)(amounts.reduce((total, amount) => {
        return total + (0, globals_1.number)(amount);
    }, 0));
}
function flatten2(arr) {
    return Array.prototype.concat.apply([], arr);
}
function unflatten2(arr) {
    const res = [];
    for (let i = 0; i < arr.length; i += 2) {
        res.push([arr[i], arr[i + 1]]);
    }
    return res;
}
//# sourceMappingURL=util.js.map