// @ts-strict-ignore
import * as path from 'path';
import inject from '@rollup/plugin-inject';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
const ENABLE_PWA = process.env.WEB_PWA === '1';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import jsxInJs from './plugins/jsx-js.js';

function addWatchers() {
    return {
        name: 'add-watchers',
        configureServer(server) {
            server.watcher
                .add([
                    path.resolve('../loot-core/lib-dist/electron/*.js'),
                    path.resolve('../loot-core/lib-dist/browser/*.js'),
                ])
                .on('all', () => {
                    for (const wsc of server.ws.clients) {
                        wsc.send(JSON.stringify({ type: 'static-changed' }));
                    }
                });
        },
    };
}

// Get service worker filename from environment variable
export function getServiceWorkerFilename() {
    const hash = process.env.REACT_APP_PLUGIN_SERVICE_WORKER_HASH;
    if (hash) {
        return `plugin-sw.${hash}.js`;
    }
    return 'plugin-sw.js'; // fallback
}

// Inject build shims using the inject plugin
function injectShims() {
    const buildShims = path.resolve('./src/build-shims.js');
    const commonInject = {
        include: ['**/*.js', '**/*.jsx'],
        exclude: ['src/setupTests.js', '**/*.ts', '**/*.tsx'],
        global: [buildShims, 'global'],
    };
    return [
        {
            name: 'inject-build-process',
            config: () => ({
                // rename process.env in build mode so it doesn't get set to an empty object up by the vite:define plugin
                // this isn't needed in serve mode, because vite:define doesn't empty it in serve mode. And defines also happen last anyways in serve mode.
                define: {
                    'process.env': '_process.env',
                },
            }),
            apply: 'build',
        },
        inject({ ...commonInject, process: [buildShims, 'process'] }),
        inject({ ...commonInject, _process: [buildShims, 'process'] }),
    ];
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const devHeaders = {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
    };
    // Forward Netlify env variables
    if (process.env.REVIEW_ID) {
        process.env.REACT_APP_REVIEW_ID = process.env.REVIEW_ID;
    }
    let resolveExtensions = [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
    ];
    if (env.IS_GENERIC_BROWSER) {
        resolveExtensions = [
            '.browser.js',
            '.browser.jsx',
            '.browser.ts',
            '.browser.tsx',
            ...resolveExtensions,
        ];
    }
    const browserOpen = env.BROWSER_OPEN ? `//${env.BROWSER_OPEN}` : true;
    return {
        base: '/',
        envPrefix: 'REACT_APP_',
        server: {
            host: true,
            headers: mode === 'development' ? devHeaders : undefined,
            port: +env.PORT || 5173,
            open: env.BROWSER
                ? ['chrome', 'firefox', 'edge', 'browser', 'browserPrivate'].includes(env.BROWSER)
                : browserOpen,
            watch: {
                disableGlobbing: false,
            },
        },
        resolve: {
            extensions: resolveExtensions,
        },
        esbuild: {
            loader: 'jsx',
            include: /src\/.*\.(js|jsx)$/,
            exclude: [],
        },
        optimizeDeps: {
            esbuildOptions: {
                loader: { '.js': 'jsx' },
            },
        },
        plugins: [
            // electron (desktop) builds do not support PWA
            mode === 'desktop'
                ? undefined
                : (ENABLE_PWA ? VitePWA({
                        registerType: 'prompt',
                        strategies: 'injectManifest',
                        srcDir: 'service-worker',
                        filename: 'sw.js',
                        manifest: {
                            name: 'Actual',
                            short_name: 'Actual',
                            description: 'A local-first personal finance tool',
                            theme_color: '#8812E1',
                            background_color: '#8812E1',
                            display: 'standalone',
                            start_url: './',
                        },
                        injectManifest: {
                            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
                            swSrc: 'service-worker/sw-src.js',
                        },
                        devOptions: {
                            enabled: true, // We need service worker in dev mode to work with plugins
                            type: 'module',
                        },
                        viteOptions: { build: { rollupOptions: { input: 'service-worker/sw.js' } } },
                        workbox: {
                            globPatterns: [
                                '**/*.{js,css,html,txt,wasm,sql,sqlite,ico,png,woff2,webmanifest}',
                            ],
                            ignoreURLParametersMatching: [/^v$/],
                            navigateFallback: '/index.html',
                            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
                            navigateFallbackDenylist: [
                                /^\/account\/.*$/,
                                /^\/admin\/.*$/,
                                /^\/secret\/.*$/,
                                /^\/openid\/.*$/,
                                /^\/plugins\/.*$/,
                                /^\/kcab\/.*$/,
                                /^\/plugin-data\/.*$/,
                            ],
                        },
                    }) : undefined),
            ...injectShims(),
            addWatchers(),
            jsxInJs(),
            react({
                babel: {
                    // n.b. Must be a string to ensure plugin resolution order. See https://github.com/actualbudget/actual/pull/5853
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            viteTsconfigPaths({ root: '../..' }),
            visualizer({ template: 'raw-data' }),
            !!env.HTTPS && basicSsl(),
        ],
        test: {
            include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
            environment: 'jsdom',
            globals: true,
            setupFiles: './src/setupTests.js',
            testTimeout: 10000,
            onConsoleLog(log, type) {
                // print only console.error
                return type === 'stderr';
            },
        },
    };
});
