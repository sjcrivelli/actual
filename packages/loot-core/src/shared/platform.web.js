import { UAParser } from 'ua-parser-js';
const isWindows = navigator.platform && navigator.platform.toLowerCase() === 'win32';
const isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
export const isPlaywright = navigator.userAgent === 'playwright';
export const OS = isWindows
    ? 'windows'
    : isMac
        ? 'mac'
        : 'linux';
export const env = 'web';
export const isBrowser = true;
const agent = UAParser(navigator.userAgent);
export const isIOSAgent = agent.browser.name === 'Mobile Safari';
