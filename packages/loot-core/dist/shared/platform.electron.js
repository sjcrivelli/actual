"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIOSAgent = exports.isBrowser = exports.env = exports.OS = exports.isPlaywright = void 0;
const os = require('os');
const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';
exports.isPlaywright = false;
exports.OS = isWindows
    ? 'windows'
    : isMac
        ? 'mac'
        : isLinux
            ? 'linux'
            : 'unknown';
exports.env = 'unknown';
exports.isBrowser = false;
exports.isIOSAgent = false;
