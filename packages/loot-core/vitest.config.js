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
    '.electron.ts',
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
];
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        setupFiles: ['./src/mocks/setup.ts'],
        exclude: ['src/**/*.web.test.(js|jsx|ts|tsx)', 'node_modules'],
        onConsoleLog(log, type) {
            // print only console.error
            return type === 'stderr';
        },
    },
    resolve: {
        alias: [
            {
                find: /^@actual-app\/crdt(\/.*)?$/,
                replacement: path_1.default.resolve('../crdt/src$1'),
            },
        ],
        extensions: resolveExtensions,
    },
    plugins: [(0, vite_plugin_peggy_loader_1.default)()],
});
