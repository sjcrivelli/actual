"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
var path_1 = require("path");
var rollup_plugin_visualizer_1 = require("rollup-plugin-visualizer");
var vite_1 = require("vite");
var vite_plugin_node_polyfills_1 = require("vite-plugin-node-polyfills");
var vite_plugin_peggy_loader_1 = require("vite-plugin-peggy-loader");
// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
exports.default = (0, vite_1.defineConfig)(function (_a) {
    var mode = _a.mode;
    var isDev = mode === 'development';
    var outDir = path_1.default.resolve(__dirname, 'lib-dist/browser');
    var crdtDir = path_1.default.resolve(__dirname, '../crdt');
    return {
        mode: mode,
        base: '/kcab/',
        build: {
            target: 'es2020',
            outDir: outDir,
            emptyOutDir: true,
            lib: {
                entry: path_1.default.resolve(__dirname, 'src/server/main.ts'),
                name: 'backend',
                formats: ['iife'],
                fileName: function () {
                    return isDev ? 'kcab.worker.dev.js' : "kcab.worker.[hash].js";
                },
            },
            rollupOptions: {
                onwarn: function (warning, warn) {
                    var _a;
                    // Suppress sourcemap warnings from peggy-loader
                    if (warning.plugin === 'peggy-loader' &&
                        ((_a = warning.message) === null || _a === void 0 ? void 0 : _a.includes('Sourcemap'))) {
                        return;
                    }
                    // Use default warning handler for other warnings
                    warn(warning);
                },
                output: {
                    chunkFileNames: isDev
                        ? '[name].kcab.worker.dev.js'
                        : '[id].[name].kcab.worker.[hash].js',
                    format: 'iife',
                    name: 'backend',
                    globals: {
                        buffer: 'Buffer',
                        'process/browser': 'process',
                    },
                },
                external: [],
            },
            sourcemap: true,
            minify: isDev ? false : 'terser',
            terserOptions: {
                compress: {
                    drop_debugger: false,
                },
                mangle: false,
            },
        },
        resolve: {
            extensions: [
                '.web.js',
                '.web.ts',
                '.web.tsx',
                '.js',
                '.ts',
                '.tsx',
                '.json',
            ],
            alias: [
                {
                    find: /^@actual-app\/crdt(\/.*)?$/,
                    replacement: path_1.default.resolve(crdtDir, 'src') + '$1',
                },
            ],
        },
        define: {
            'process.env': '{}',
            'process.env.IS_DEV': JSON.stringify(isDev),
            'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '/'),
            'process.env.ACTUAL_DATA_DIR': JSON.stringify('/'),
            'process.env.ACTUAL_DOCUMENT_DIR': JSON.stringify('/documents'),
        },
        plugins: [
            (0, vite_plugin_peggy_loader_1.default)(),
            (0, vite_plugin_node_polyfills_1.nodePolyfills)({
                include: [
                    'process',
                    'stream',
                    'path',
                    'zlib',
                    'fs',
                    'assert',
                    'buffer',
                ],
                globals: {
                    process: true,
                    global: true,
                },
            }),
            (0, rollup_plugin_visualizer_1.visualizer)({ template: 'raw-data', filename: "".concat(outDir, "/stats.json") }),
        ],
        optimizeDeps: {
            include: [
                'buffer',
                'process',
                'assert',
                'path-browserify',
                'stream-browserify',
                'browserify-zlib',
            ],
        },
    };
});
