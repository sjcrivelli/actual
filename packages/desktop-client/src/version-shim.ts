declare global { interface Window { Actual: any } }
// ensure the global container exists
;(window as any).Actual = (window as any).Actual || {}
// default a version for dev if none injected by build
;(window as any).Actual.ACTUAL_VERSION = (window as any).Actual.ACTUAL_VERSION || 'dev'
export {}

// ---- runtime shims for browser dev (no Electron) ----
;(globalThis as any).Actual = (globalThis as any).Actual || {}

;(globalThis as any).Actual.isUpdateReadyForDownload =
  (globalThis as any).Actual.isUpdateReadyForDownload || (() => false)

;(globalThis as any).Actual.applyAppUpdate =
  (globalThis as any).Actual.applyAppUpdate || (async () => {})

// For web, return a socket-like object that talks to the browser worker.
// The real app sets this via Electron; here we mirror the minimal surface.
;(globalThis as any).Actual.getServerSocket =
  (globalThis as any).Actual.getServerSocket ||
  (async () => {
    // lazy-load the browser worker preload which registers the worker
    await import('./browser-preload.browser.js')
    // the preload attaches a singleton `window.__actualWebSocket`
    if ((globalThis as any).__actualWebSocket) {
      return (globalThis as any).__actualWebSocket
    }
    // super-minimal fallback: a fake socket that rejects sends
    return {
      send() {
        throw new Error('web socket not initialized')
      },
      onmessage: null as any,
      close() {},
    }
  })

// Provide a browser-safe ipcConnect that returns the same socket we expose via __actualWebSocket
;(globalThis as any).Actual = (globalThis as any).Actual || {}
;(globalThis as any).Actual.ipcConnect =
  (globalThis as any).Actual.ipcConnect ||
  (async () => {
    if ((globalThis as any).__actualWebSocket) return (globalThis as any).__actualWebSocket
    if ((globalThis as any).Actual.getServerSocket) {
      return await (globalThis as any).Actual.getServerSocket()
    }
    throw new Error('ipcConnect: no web socket available')
  })

// ----- ensure ipcConnect exists on both `global` and `globalThis` -----
;(function(){
  const g = (typeof global !== 'undefined' ? global : (globalThis as any));
  g.Actual = g.Actual || {};
  (globalThis as any).Actual = (globalThis as any).Actual || g.Actual;

  const impl = async () => {
    if ((globalThis as any).__actualWebSocket) return (globalThis as any).__actualWebSocket;
    if ((globalThis as any).Actual?.getServerSocket) {
      return await (globalThis as any).Actual.getServerSocket();
    }
    throw new Error('ipcConnect: no web socket available');
  };

  if (!g.Actual.ipcConnect) g.Actual.ipcConnect = impl;
  if (!(globalThis as any).Actual.ipcConnect) (globalThis as any).Actual.ipcConnect = impl;
})();
