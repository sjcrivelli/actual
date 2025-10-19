// Ensure a Node-like `global` exists in browsers
const global = (typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this));
if (typeof window !== "undefined") { window.global = global; }

const process = {
  env: {
    ...import.meta.env,
    NODE_ENV: import.meta.env.MODE,
    PUBLIC_URL: import.meta.env.BASE_URL.slice(0, -1),
  },
};

export { process };

export { global };
