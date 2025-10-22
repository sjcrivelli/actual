var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// @ts-strict-ignore
import * as path from 'path';
import inject from '@rollup/plugin-inject';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteTsconfigPaths from 'vite-tsconfig-paths';
var addWatchers = function () { return ({
    name: 'add-watchers',
    configureServer: function (server) {
        server.watcher
            .add([
            path.resolve('../loot-core/lib-dist/electron/*.js'),
            path.resolve('../loot-core/lib-dist/browser/*.js'),
        ])
            .on('all', function () {
            for (var _i = 0, _a = server.ws.clients; _i < _a.length; _i++) {
                var wsc = _a[_i];
                wsc.send(JSON.stringify({ type: 'static-changed' }));
            }
        });
    },
}); };
// Get service worker filename from environment variable
function getServiceWorkerFilename() {
    var hash = process.env.REACT_APP_PLUGIN_SERVICE_WORKER_HASH;
    if (hash) {
        return "plugin-sw.".concat(hash, ".js");
    }
    return 'plugin-sw.js'; // fallback
}
// Inject build shims using the inject plugin
var injectShims = function () {
    var buildShims = path.resolve('./src/build-shims.js');
    var commonInject = {
        exclude: ['src/setupTests.js'],
        global: [buildShims, 'global'],
    };
    return [
        {
            name: 'inject-build-process',
            config: function () { return ({
                // rename process.env in build mode so it doesn't get set to an empty object up by the vite:define plugin
                // this isn't needed in serve mode, because vite:define doesn't empty it in serve mode. And defines also happen last anyways in serve mode.
                define: {
                    'process.env': "_process.env",
                },
            }); },
            apply: 'build',
        },
        __assign(__assign({}, inject(__assign(__assign({}, commonInject), { process: [buildShims, 'process'] }))), { enforce: 'post', apply: 'serve' }),
        __assign(__assign({}, inject(__assign(__assign({}, commonInject), { _process: [buildShims, 'process'] }))), { enforce: 'post', apply: 'build' }),
    ];
};
// https://vitejs.dev/config/
export default defineConfig(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var env, devHeaders, resolveExtensions, browserOpen;
    var mode = _b.mode;
    return __generator(this, function (_c) {
        env = loadEnv(mode, process.cwd(), '');
        devHeaders = {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        };
        // Forward Netlify env variables
        if (process.env.REVIEW_ID) {
            process.env.REACT_APP_REVIEW_ID = process.env.REVIEW_ID;
        }
        resolveExtensions = [
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
            resolveExtensions = __spreadArray([
                '.browser.js',
                '.browser.jsx',
                '.browser.ts',
                '.browser.tsx'
            ], resolveExtensions, true);
        }
        browserOpen = env.BROWSER_OPEN ? "//".concat(env.BROWSER_OPEN) : true;
        return [2 /*return*/, {
                base: '/',
                envPrefix: 'REACT_APP_',
                build: {
                    terserOptions: {
                        compress: false,
                        mangle: false,
                    },
                    target: 'es2022',
                    sourcemap: true,
                    outDir: mode === 'desktop' ? 'build-electron' : 'build',
                    assetsDir: 'static',
                    manifest: true,
                    assetsInlineLimit: 0,
                    chunkSizeWarningLimit: 1500,
                    rollupOptions: {
                        output: {
                            assetFileNames: function (assetInfo) {
                                var info = assetInfo.name.split('.');
                                var extType = info[info.length - 1];
                                if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                                    extType = 'img';
                                }
                                else if (/woff|woff2/.test(extType)) {
                                    extType = 'media';
                                }
                                return "static/".concat(extType, "/[name].[hash][extname]");
                            },
                            chunkFileNames: 'static/js/[name].[hash].chunk.js',
                            entryFileNames: 'static/js/[name].[hash].js',
                        },
                    },
                },
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
                plugins: [
                    // electron (desktop) builds do not support PWA
                    mode === 'desktop'
                        ? undefined
                        : VitePWA({
                            registerType: 'prompt',
                            strategies: 'injectManifest',
                            srcDir: 'service-worker',
                            filename: getServiceWorkerFilename(),
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
                                swSrc: "service-worker/".concat(getServiceWorkerFilename()),
                            },
                            devOptions: {
                                enabled: true, // We need service worker in dev mode to work with plugins
                                type: 'module',
                            },
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
                        }),
                    injectShims(),
                    addWatchers(),
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
                    onConsoleLog: function (log, type) {
                        // print only console.error
                        return type === 'stderr';
                    },
                },
            }];
    });
}); });
