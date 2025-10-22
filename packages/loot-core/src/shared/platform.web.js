"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIOSAgent = exports.isBrowser = exports.env = exports.OS = exports.isPlaywright = void 0;
var ua_parser_js_1 = require("ua-parser-js");
var isWindows = navigator.platform && navigator.platform.toLowerCase() === 'win32';
var isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
exports.isPlaywright = navigator.userAgent === 'playwright';
exports.OS = isWindows
    ? 'windows'
    : isMac
        ? 'mac'
        : 'linux';
exports.env = 'web';
exports.isBrowser = true;
var agent = (0, ua_parser_js_1.UAParser)(navigator.userAgent);
exports.isIOSAgent = agent.browser.name === 'Mobile Safari';
