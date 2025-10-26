// packages/desktop-client/vite.config.mts
import { defineConfig, loadEnv } from 'vite'
import type { PluginOption, ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import type { Plugin, ViteDevServer } from 'vite'
import type { PluginOption, ViteDevServer } from 'vite'

// If you hot-reload built files from a sibling package, keep this tiny helper.
// Otherwise, you can remove the addWatchers() plugin entirely.
import * as path from 'path'
function addWatchers(): PluginOption {
  return {
    name: 'add-watchers',
    configureServer(server: ViteDevServer) {
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Optional hardening for dev; remove if you don’t need COOP/COEP locally
  const devHeaders =
    mode === 'development'
      ? {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        }
      : undefined

  // If you don’t have JSX in .js files under src/, delete optimizeDeps entirely.
  const needsJsxInJs = false

  return {
    base: '/',
    envPrefix: 'REACT_APP_',

    resolve: {
      // Keep the usual web-first resolution
      extensions: [
        '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
        '.tsx', '.ts', '.jsx', '.js', '.mjs', '.mts', '.json',
      ],
    },

    server: {
      host: true,
      port: Number(env.PORT) || 5173,
      headers: devHeaders,
      // If you don’t want the browser to auto-open, set this to false
      open: true,
      watch: {
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

    // If you *must* support JSX in .js files, set needsJsxInJs = true above, then:
    optimizeDeps: needsJsxInJs
      ? { esbuildOptions: { loader: { '.js': 'jsx' } } }
      : undefined,

    // Transitional shim: lets existing code that reads process.env keep working.
    // Start migrating to import.meta.env and you can delete this later.
    define: {
      'process.env': {}, // minimal safe shim
    },

    plugins: [
      react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
      viteTsconfigPaths(),
      addWatchers(), // remove if not needed
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

