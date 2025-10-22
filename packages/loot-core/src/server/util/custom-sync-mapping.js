"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMappings = exports.mappingsFromString = exports.mappingsToString = void 0;
var mappingsToString = function (mapping) {
    return JSON.stringify(Object.fromEntries(__spreadArray([], mapping.entries(), true).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [
            key,
            Object.fromEntries(value),
        ];
    })));
};
exports.mappingsToString = mappingsToString;
var mappingsFromString = function (str) {
    try {
        var parsed = JSON.parse(str);
        if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Invalid mapping format');
        }
        return new Map(Object.entries(parsed).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [
                key,
                new Map(Object.entries(value)),
            ];
        }));
    }
    catch (e) {
        var message = e instanceof Error ? e.message : e;
        throw new Error("Failed to parse mapping: ".concat(message));
    }
};
exports.mappingsFromString = mappingsFromString;
exports.defaultMappings = new Map([
    [
        'payment',
        new Map([
            ['date', 'date'],
            ['payee', 'payeeName'],
            ['notes', 'notes'],
        ]),
    ],
    [
        'deposit',
        new Map([
            ['date', 'date'],
            ['payee', 'payeeName'],
            ['notes', 'notes'],
        ]),
    ],
]);
