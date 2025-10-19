// ensure the global container exists
;
window.Actual = window.Actual || {};
window.Actual.ACTUAL_VERSION = window.Actual.ACTUAL_VERSION || 'dev';
globalThis.Actual = globalThis.Actual || {};
globalThis.Actual.isUpdateReadyForDownload =
    globalThis.Actual.isUpdateReadyForDownload || (() => false);
globalThis.Actual.applyAppUpdate =
    globalThis.Actual.applyAppUpdate || (async () => { });
globalThis.Actual.getServerSocket =
    globalThis.Actual.getServerSocket ||
        (async () => {
            // lazy-load the browser worker preload which registers the worker
            await import('./browser-preload.browser.js');
            // the preload attaches a singleton `window.__actualWebSocket`
            if (globalThis.__actualWebSocket) {
                return globalThis.__actualWebSocket;
            }
            // super-minimal fallback: a fake socket that rejects sends
            return {
                send() {
                    throw new Error('web socket not initialized');
                },
                onmessage: null,
                close() { },
            };
        });
globalThis.Actual = globalThis.Actual || {};
globalThis.Actual.ipcConnect =
    globalThis.Actual.ipcConnect ||
        (async () => {
            if (globalThis.__actualWebSocket)
                return globalThis.__actualWebSocket;
            if (globalThis.Actual.getServerSocket) {
                return await globalThis.Actual.getServerSocket();
            }
            throw new Error('ipcConnect: no web socket available');
        });
(function () {
    const g = (typeof global !== 'undefined' ? global : globalThis);
    g.Actual = g.Actual || {};
    globalThis.Actual = globalThis.Actual || g.Actual;
    const impl = async () => {
        if (globalThis.__actualWebSocket)
            return globalThis.__actualWebSocket;
        if (globalThis.Actual?.getServerSocket) {
            return await globalThis.Actual.getServerSocket();
        }
        throw new Error('ipcConnect: no web socket available');
    };
    if (!g.Actual.ipcConnect)
        g.Actual.ipcConnect = impl;
    if (!globalThis.Actual.ipcConnect)
        globalThis.Actual.ipcConnect = impl;
})();
export {};
