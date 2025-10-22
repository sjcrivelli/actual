"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidBaseURL = isValidBaseURL;
exports.setServer = setServer;
exports.getServer = getServer;
var fs = require("../platform/server/fs");
var log_1 = require("../platform/server/log");
var config = null;
function joinURL(base) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var url = new URL(base);
    url.pathname = fs.join.apply(fs, __spreadArray([url.pathname], paths, false));
    return url.toString();
}
function isValidBaseURL(base) {
    try {
        return Boolean(new URL(base));
    }
    catch (error) {
        return false;
    }
}
function setServer(url) {
    if (url == null) {
        config = null;
    }
    else {
        config = getServer(url);
    }
}
// `url` is optional; if not given it will provide the global config
function getServer(url) {
    if (url) {
        try {
            return {
                BASE_SERVER: url,
                SYNC_SERVER: joinURL(url, '/sync'),
                SIGNUP_SERVER: joinURL(url, '/account'),
                GOCARDLESS_SERVER: joinURL(url, '/gocardless'),
                SIMPLEFIN_SERVER: joinURL(url, '/simplefin'),
                PLUGGYAI_SERVER: joinURL(url, '/pluggyai'),
            };
        }
        catch (error) {
            log_1.logger.warn('Unable to parse server URL - using the global config.', { config: config }, error);
            return config;
        }
    }
    return config;
}
