/* Dev initializer: create the browser worker and expose a socket-like bridge.
 * We pass hash: 'dev' so browser-server.js imports `kcab.worker.dev.js`.
 * We also bypass the SharedArrayBuffer check for local dev.
 */

(function () {
  // If something already set the socket, keep it
  if (window.__actualWebSocket) return;

  // Start the worker that orchestrates loading the backend bundle
  let worker = new Worker(new URL('./browser-server.js', import.meta.url), {
  type: 'classic'
});

// Fallback: create a classic worker via a Blob shim
const code = `
  // classic worker bootstrap
  importScripts('${location.origin}/src/browser-server.js');
`;
const blob = new Blob([code], { type: 'text/javascript' });
worker = new Worker(URL.createObjectURL(blob)); // classic by construction

  // Minimal socket-like bridge that the app expects
  const socket = {
    send(message) {
      worker.postMessage(message);
    },
    onmessage: null,
    close() {
      try { worker.terminate(); } catch {}
    },
  };

  // Forward messages from the worker to whoever attaches `onmessage`
  worker.onmessage = evt => {
    if (socket.onmessage) socket.onmessage(evt);
  };

  // Expose to the app
  window.__actualWebSocket = socket;

  // Tell the worker to initialize. `hash: 'dev'` matches the output name
  // from `packages/loot-core/bin/build-browser` (kcab.worker.dev.js)
  worker.postMessage({
    type: 'init',
    isDev: true,
    publicUrl: import.meta.env.BASE_URL.replace(/\/$/, ''),
    hash: 'dev',
    // Skip SAB requirement in local dev environments
    isSharedArrayBufferOverrideEnabled: true,
  });
})();
