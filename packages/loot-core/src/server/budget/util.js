"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.number = void 0;
exports.sumAmounts = sumAmounts;
exports.flatten2 = flatten2;
exports.unflatten2 = unflatten2;
// @ts-strict-ignore
var util_1 = require("../../shared/util");
var globals_1 = require("../spreadsheet/globals");
var globals_2 = require("../spreadsheet/globals");
Object.defineProperty(exports, "number", { enumerable: true, get: function () { return globals_2.number; } });
function sumAmounts() {
    var amounts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        amounts[_i] = arguments[_i];
    }
    return (0, util_1.safeNumber)(amounts.reduce(function (total, amount) {
        return total + (0, globals_1.number)(amount);
    }, 0));
}
function flatten2(arr) {
    return Array.prototype.concat.apply([], arr);
}
function unflatten2(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i += 2) {
        res.push([arr[i], arr[i + 1]]);
    }
    return res;
}
