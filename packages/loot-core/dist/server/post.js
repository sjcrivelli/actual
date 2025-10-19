"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = post;
exports.del = del;
exports.patch = patch;
exports.postBinary = postBinary;
exports.get = get;
// @ts-strict-ignore
const fetch_1 = require("../platform/server/fetch");
const log_1 = require("../platform/server/log");
const Platform = __importStar(require("../shared/platform"));
const errors_1 = require("./errors");
function throwIfNot200(res, text) {
    if (res.status !== 200) {
        if (res.status === 500) {
            throw new errors_1.PostError(res.status === 500 ? 'internal' : text);
        }
        const contentType = res.headers.get('Content-Type');
        if (contentType.toLowerCase().indexOf('application/json') !== -1) {
            const json = JSON.parse(text);
            throw new errors_1.PostError(json.reason);
        }
        // Actual Sync Server may be exposed via a tunnel (e.g. ngrok). Tunnel errors should be treated as network errors.
        const tunnelErrorHeaders = ['ngrok-error-code'];
        const tunnelError = tunnelErrorHeaders.some(header => res.headers.has(header));
        if (tunnelError) {
            // Tunnel errors are present when the tunnel is active and the server is not reachable e.g. server is offline
            // When we experience a tunnel error we treat it as a network failure
            throw new errors_1.PostError('network-failure');
        }
        throw new errors_1.PostError(text);
    }
}
async function post(url, data, headers = {}, timeout = null) {
    let text;
    let res;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const signal = timeout ? controller.signal : null;
        res = await (0, fetch_1.fetch)(url, {
            method: 'POST',
            body: JSON.stringify(data),
            signal,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });
        clearTimeout(timeoutId);
        text = await res.text();
    }
    catch (err) {
        throw new errors_1.PostError('network-failure');
    }
    throwIfNot200(res, text);
    let responseData;
    try {
        responseData = JSON.parse(text);
    }
    catch (err) {
        // Something seriously went wrong. TODO handle errors
        throw new errors_1.PostError('parse-json', { meta: text });
    }
    if (responseData.status !== 'ok') {
        log_1.logger.log('API call failed: ' +
            url +
            '\nData: ' +
            JSON.stringify(data, null, 2) +
            '\nResponse: ' +
            JSON.stringify(res, null, 2));
        throw new errors_1.PostError(responseData.description || responseData.reason || 'unknown');
    }
    return responseData.data;
}
async function del(url, data, headers = {}, timeout = null) {
    let text;
    let res;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const signal = timeout ? controller.signal : null;
        res = await (0, fetch_1.fetch)(url, {
            method: 'DELETE',
            body: JSON.stringify(data),
            signal,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });
        clearTimeout(timeoutId);
        text = await res.text();
    }
    catch (err) {
        throw new errors_1.PostError('network-failure');
    }
    throwIfNot200(res, text);
    try {
        res = JSON.parse(text);
    }
    catch (err) {
        // Something seriously went wrong. TODO handle errors
        throw new errors_1.PostError('parse-json', { meta: text });
    }
    if (res.status !== 'ok') {
        log_1.logger.log('API call failed: ' +
            url +
            '\nData: ' +
            JSON.stringify(data, null, 2) +
            '\nResponse: ' +
            JSON.stringify(res, null, 2));
        throw new errors_1.PostError(res.description || res.reason || 'unknown');
    }
    return res.data;
}
async function patch(url, data, headers = {}, timeout = null) {
    let text;
    let res;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const signal = timeout ? controller.signal : null;
        res = await (0, fetch_1.fetch)(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            signal,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });
        clearTimeout(timeoutId);
        text = await res.text();
    }
    catch (err) {
        throw new errors_1.PostError('network-failure');
    }
    throwIfNot200(res, text);
    try {
        res = JSON.parse(text);
    }
    catch (err) {
        // Something seriously went wrong. TODO handle errors
        throw new errors_1.PostError('parse-json', { meta: text });
    }
    if (res.status !== 'ok') {
        log_1.logger.log('API call failed: ' +
            url +
            '\nData: ' +
            JSON.stringify(data, null, 2) +
            '\nResponse: ' +
            JSON.stringify(res, null, 2));
        throw new errors_1.PostError(res.description || res.reason || 'unknown');
    }
    return res.data;
}
async function postBinary(url, data, headers) {
    let res;
    try {
        res = await (0, fetch_1.fetch)(url, {
            method: 'POST',
            body: Platform.isBrowser ? data : Buffer.from(data),
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/actual-sync',
                ...headers,
            },
        });
    }
    catch (err) {
        throw new errors_1.PostError('network-failure');
    }
    let buffer;
    if (res.arrayBuffer) {
        buffer = Buffer.from(await res.arrayBuffer());
    }
    else {
        buffer = await res.buffer();
    }
    throwIfNot200(res, buffer.toString());
    return buffer;
}
function get(url, opts) {
    return (0, fetch_1.fetch)(url, opts).then(res => res.text());
}
