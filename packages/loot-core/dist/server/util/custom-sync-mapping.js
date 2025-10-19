"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMappings = exports.mappingsFromString = exports.mappingsToString = void 0;
const mappingsToString = (mapping) => JSON.stringify(Object.fromEntries([...mapping.entries()].map(([key, value]) => [
    key,
    Object.fromEntries(value),
])));
exports.mappingsToString = mappingsToString;
const mappingsFromString = (str) => {
    try {
        const parsed = JSON.parse(str);
        if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Invalid mapping format');
        }
        return new Map(Object.entries(parsed).map(([key, value]) => [
            key,
            new Map(Object.entries(value)),
        ]));
    }
    catch (e) {
        const message = e instanceof Error ? getErrorMessage(e) : e;
        throw new Error(`Failed to parse mapping: ${message}`);
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
