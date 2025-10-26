// @ts-strict-ignore
import * as path from 'path'
import inject from '@rollup/plugin-inject'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const ENABLE_PWA = process.env.WEB_PWA === '1'

// --- helper: watch loot-core builds in dev ---
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
            wsc.send(JSON.stringify({ type: 'static-changed' }))
          }
        })
    },
  }
}

// --- helper: inject shims during build ---
function injectShims() {
  const buildShims = path.resolve('./src/build-shims.js')
  const commonInject = {
    include: ['**/*.js', '**/*.jsx'],
    exclude: ['src/setupTests.js', '**/*.ts', '**/*.tsx'],
    global: [buildShims, 'global'],
  }
  return [
    {
      name: 'inject-build-process',
      config: () => ({
        define: { 'process.env': '_process.env' },
      }),
      apply: 'build',
    },
    inject({ ...commonInject, process: [buildShims, 'process'] }),
    inject({ ...commonInject, _process: [buildShims, 'process'] }),
  ]
}

// --- main config ---
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devHeaders = {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  }

  let resolveExtensions = [
    '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
    '.tsx', '.ts', '.jsx', '.js', '.mjs', '.mts', '.json',
  ]

  if (env.IS_GENERIC_BROWSER) {
    resolveExtensions = [
      '.browser.tsx', '.browser.ts', '.browser.jsx', '.browser.js',
      ...resolveExtensions,
    ]
  }

  const browserOpen = env.BROWSER_OPEN ? `//${env.BROWSER_OPEN}` : true

  return {
    base: '/',
    envPrefix: 'REACT_APP_',

    server: {
  host: true,
  port: +env.PORT || 5173,
  headers: mode === 'development' ? devHeaders : undefined,
  open: env.BROWSER
    ? ['chrome', 'firefox', 'edge', 'browser', 'browserPrivate'].includes(env.BROWSER)
    : browserOpen,
  watch: {
    // Prevent Vite from watching too much (fixes runaway rebuilds)
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
      '**/.vite/**',
      '**/*.bak*',
    ],
    disableGlobbing: false,
  },
},

    resolve: { extensions: resolveExtensions },

    // --- critical JSX/TSX handling ---
    esbuild: {
      loader: 'tsx',
      include: /src\/.*\.(js|jsx|ts|tsx)$/,
      exclude: [],
      jsx: 'automatic',
      jsxDev: mode !== 'production',
      tsconfigRaw: { compilerOptions: { jsx: 'react-jsx' } },
    },

    optimizeDeps: {
      esbuildOptions: { loader: { '.js': 'jsx' } },
    },

    plugins: [
      mode === 'desktop'
        ? undefined
        : ENABLE_PWA &&
          VitePWA({
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
              maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
              swSrc: 'service-worker/sw-src.js',
            },
            devOptions: { enabled: true, type: 'module' },
            viteOptions: { build: { rollupOptions: { input: 'service-worker/sw.js' } } },
            workbox: {
              globPatterns: [
                '**/*.{js,css,html,txt,wasm,sql,sqlite,ico,png,woff2,webmanifest}',
              ],
              ignoreURLParametersMatching: [/^v$/],
              navigateFallback: '/index.html',
              navigateFallbackDenylist: [
                /^\/account\/.*$/, /^\/admin\/.*$/, /^\/secret\/.*$/,
                /^\/openid\/.*$/, /^\/plugins\/.*$/, /^\/kcab\/.*$/,
                /^\/plugin-data\/.*$/,
              ],
              maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
            },
          }),
      ...injectShims(),
      addWatchers(),
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
  viteTsconfigPaths(),
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
        return type === 'stderr'
      },
    },
  }
})
