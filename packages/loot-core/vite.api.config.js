"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const rollup_plugin_visualizer_1 = require("rollup-plugin-visualizer");
const vite_1 = require("vite");
const vite_plugin_peggy_loader_1 = __importDefault(require("vite-plugin-peggy-loader"));
// eslint-disable-next-line import/no-default-export
exports.default = (0, vite_1.defineConfig)(({ mode }) => {
    const outDir = path_1.default.resolve(__dirname, '../api/app');
    const crdtDir = path_1.default.resolve(__dirname, '../crdt');
    return {
        mode,
        ssr: { noExternal: true, external: ['better-sqlite3'] },
        build: {
            target: 'node18',
            outDir,
            emptyOutDir: false,
            ssr: true,
            lib: {
                entry: path_1.default.resolve(__dirname, 'src/server/main.ts'),
                formats: ['cjs'],
            },
            sourcemap: true,
            rollupOptions: {
                output: {
                    entryFileNames: 'bundle.api.js',
                    format: 'cjs',
                    name: 'api',
                },
            },
        },
        resolve: {
            extensions: [
                '.api.js',
                '.api.ts',
                '.api.tsx',
                '.electron.js',
                '.electron.ts',
                '.electron.tsx',
                '.js',
                '.ts',
                '.tsx',
                '.json',
            ],
            alias: [
                {
                    find: 'handlebars',
                    replacement: require.resolve('handlebars/dist/handlebars.js'),
                },
                {
                    find: /^@actual-app\/crdt(\/.*)?$/,
                    replacement: path_1.default.resolve(crdtDir, 'src') + '$1',
                },
            ],
        },
        plugins: [
            (0, vite_plugin_peggy_loader_1.default)(),
            (0, rollup_plugin_visualizer_1.visualizer)({ template: 'raw-data', filename: `${outDir}/stats.json` }),
        ],
    };
});
