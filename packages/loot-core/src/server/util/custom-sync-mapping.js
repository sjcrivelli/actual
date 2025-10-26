export const mappingsToString = (mapping) => JSON.stringify(Object.fromEntries([...mapping.entries()].map(([key, value]) => [
    key,
    Object.fromEntries(value),
])));
export const mappingsFromString = (str) => {
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
        const message = e instanceof Error ? e.message : e;
        throw new Error(`Failed to parse mapping: ${message}`);
    }
};
export const defaultMappings = new Map([
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
