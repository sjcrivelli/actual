"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    test: {
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
        globalSetup: ['./vitest.globalSetup.js'],
        globals: true,
        coverage: {
            enabled: true,
            include: ['**/*.{js,ts,tsx}'],
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
                '**/coverage/**',
            ],
            reporter: ['html', 'lcov', 'text', 'text-summary'],
        },
    },
};
