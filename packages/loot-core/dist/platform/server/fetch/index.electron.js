"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
const fetch = async (input, options) => {
    try {
        return await globalThis.fetch(input, {
            ...options,
            headers: {
                ...options?.headers,
                origin: 'app://actual',
            },
        });
    }
    catch (error) {
        console.error(error); // log error
        throw error;
    }
};
exports.fetch = fetch;
