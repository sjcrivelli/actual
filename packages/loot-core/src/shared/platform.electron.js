const os = require('os');
const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';
export const isPlaywright = false;
export const OS = isWindows
    ? 'windows'
    : isMac
        ? 'mac'
        : isLinux
            ? 'linux'
            : 'unknown';
export const env = 'unknown';
export const isBrowser = false;
export const isIOSAgent = false;
