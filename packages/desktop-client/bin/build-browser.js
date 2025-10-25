#!/usr/bin/env node
// build-browser.js → forwards to package-browser.js
const { spawnSync } = require('child_process');
const { resolve } = require('path');
const target = resolve(__dirname, 'package-browser.js');
const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(result.status ?? 0);
