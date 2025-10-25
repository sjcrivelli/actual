#!/usr/bin/env node
/**
 * build-browser.js
 * Temporary Yarn 4 compatibility patch.
 * Forwards build-browser calls to package-browser.js
 */

const { spawnSync } = require('child_process');
const { resolve, dirname } = require('path');
const { fileURLToPath } = require('url');

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// locate package-browser.js in the same bin folder
const target = resolve(__dirname, 'package-browser.js');

// forward all CLI args
const result = spawnSync('node', [target, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

// exit with same code as the child process
process.exit(result.status ?? 0);
