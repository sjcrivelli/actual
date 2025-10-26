// Minimal dev worker bootstrap: always load the dev bundle using a full absolute URL,
// ignore any extra args/hash that could append "undefined".
const __URL = self.location.origin + '/kcab/kcab.worker.dev.js';

function importScriptsWithRetry() {
  try {
    importScripts(__URL);
  } catch (e) {
    // Retry gently in dev; if the bundle hasn't been served yet, give it a moment.
    setTimeout(importScriptsWithRetry, 1000);
  }
}

importScriptsWithRetry();
