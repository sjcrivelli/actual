"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureBreadcrumb = exports.captureException = void 0;
const captureException = function (exc) {
    console.error('[Exception]', exc);
};
exports.captureException = captureException;
// eslint-disable-next-line
const captureBreadcrumb = function (crumb) { };
exports.captureBreadcrumb = captureBreadcrumb;
