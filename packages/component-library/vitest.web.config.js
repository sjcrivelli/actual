"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var vite_plugin_peggy_loader_1 = require("vite-plugin-peggy-loader");
var config_1 = require("vitest/config");
var resolveExtensions = [
    '.testing.ts',
    '.web.ts',
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
    '.wasm',
];
exports.default = (0, config_1.defineConfig)({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.web.test.(js|jsx|ts|tsx)'],
    },
    resolve: {
        alias: [
            {
                find: /^@actual-app\/crdt(\/.*)?$/,
                replacement: path_1.default.resolve('../../../crdt/src$1'),
            },
        ],
        extensions: resolveExtensions,
    },
    plugins: [(0, vite_plugin_peggy_loader_1.default)()],
});
