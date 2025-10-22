"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPreviewEnvironment = isPreviewEnvironment;
exports.isDevelopmentEnvironment = isDevelopmentEnvironment;
exports.isNonProductionEnvironment = isNonProductionEnvironment;
exports.isElectron = isElectron;
function isPreviewEnvironment() {
    return String(process.env.REACT_APP_NETLIFY) === 'true';
}
function isDevelopmentEnvironment() {
    return process.env.NODE_ENV === 'development';
}
function isNonProductionEnvironment() {
    return isPreviewEnvironment() || isDevelopmentEnvironment();
}
function isElectron() {
    if (navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }
    return false;
}
