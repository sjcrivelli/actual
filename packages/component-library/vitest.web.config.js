"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const vite_plugin_peggy_loader_1 = __importDefault(require("vite-plugin-peggy-loader"));
const config_1 = require("vitest/config");
const resolveExtensions = [
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
