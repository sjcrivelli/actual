// @ts-strict-ignore
import path from 'path';
import { defineConfig } from 'vite';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var isDev = mode === 'development';
    var outDir = path.resolve(__dirname, 'dist');
    var buildHash = Date.now().toString(36);
    return {
        mode: mode,
        build: {
            target: 'es2020',
            outDir: outDir,
            emptyOutDir: true,
            lib: {
                entry: path.resolve(__dirname, 'src/plugin-service-worker.ts'),
                name: 'plugin_sw',
                formats: ['iife'],
                fileName: function () {
                    return isDev ? "plugin-sw.dev.js" : "plugin-sw.".concat(buildHash, ".js");
                },
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
            extensions: ['.js', '.ts', '.json'],
        },
        define: {
            'process.env': '{}',
            'process.env.IS_DEV': JSON.stringify(isDev),
        },
    };
});
