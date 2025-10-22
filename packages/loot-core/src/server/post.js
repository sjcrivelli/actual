"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = post;
exports.del = del;
exports.patch = patch;
exports.postBinary = postBinary;
exports.get = get;
// @ts-strict-ignore
var fetch_1 = require("../platform/server/fetch");
var log_1 = require("../platform/server/log");
var Platform = require("../shared/platform");
var errors_1 = require("./errors");
function throwIfNot200(res, text) {
    if (res.status !== 200) {
        if (res.status === 500) {
            throw new errors_1.PostError(res.status === 500 ? 'internal' : text);
        }
        var contentType = res.headers.get('Content-Type');
        if (contentType.toLowerCase().indexOf('application/json') !== -1) {
            var json = JSON.parse(text);
            throw new errors_1.PostError(json.reason);
        }
        // Actual Sync Server may be exposed via a tunnel (e.g. ngrok). Tunnel errors should be treated as network errors.
        var tunnelErrorHeaders = ['ngrok-error-code'];
        var tunnelError = tunnelErrorHeaders.some(function (header) {
            return res.headers.has(header);
        });
        if (tunnelError) {
            // Tunnel errors are present when the tunnel is active and the server is not reachable e.g. server is offline
            // When we experience a tunnel error we treat it as a network failure
            throw new errors_1.PostError('network-failure');
        }
        throw new errors_1.PostError(text);
    }
}
function post(url_1, data_1) {
    return __awaiter(this, arguments, void 0, function (url, data, headers, timeout) {
        var text, res, controller_1, timeoutId, signal, err_1, responseData;
        if (headers === void 0) { headers = {}; }
        if (timeout === void 0) { timeout = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    controller_1 = new AbortController();
                    timeoutId = setTimeout(function () { return controller_1.abort(); }, timeout);
                    signal = timeout ? controller_1.signal : null;
                    return [4 /*yield*/, (0, fetch_1.fetch)(url, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            signal: signal,
                            headers: __assign(__assign({}, headers), { 'Content-Type': 'application/json' }),
                        })];
                case 1:
                    res = _a.sent();
                    clearTimeout(timeoutId);
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    throw new errors_1.PostError('network-failure');
                case 4:
                    throwIfNot200(res, text);
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
                    return [2 /*return*/, responseData.data];
            }
        });
    });
}
function del(url_1, data_1) {
    return __awaiter(this, arguments, void 0, function (url, data, headers, timeout) {
        var text, res, controller_2, timeoutId, signal, err_2;
        if (headers === void 0) { headers = {}; }
        if (timeout === void 0) { timeout = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    controller_2 = new AbortController();
                    timeoutId = setTimeout(function () { return controller_2.abort(); }, timeout);
                    signal = timeout ? controller_2.signal : null;
                    return [4 /*yield*/, (0, fetch_1.fetch)(url, {
                            method: 'DELETE',
                            body: JSON.stringify(data),
                            signal: signal,
                            headers: __assign(__assign({}, headers), { 'Content-Type': 'application/json' }),
                        })];
                case 1:
                    res = _a.sent();
                    clearTimeout(timeoutId);
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    throw new errors_1.PostError('network-failure');
                case 4:
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
                    return [2 /*return*/, res.data];
            }
        });
    });
}
function patch(url_1, data_1) {
    return __awaiter(this, arguments, void 0, function (url, data, headers, timeout) {
        var text, res, controller_3, timeoutId, signal, err_3;
        if (headers === void 0) { headers = {}; }
        if (timeout === void 0) { timeout = null; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    controller_3 = new AbortController();
                    timeoutId = setTimeout(function () { return controller_3.abort(); }, timeout);
                    signal = timeout ? controller_3.signal : null;
                    return [4 /*yield*/, (0, fetch_1.fetch)(url, {
                            method: 'PATCH',
                            body: JSON.stringify(data),
                            signal: signal,
                            headers: __assign(__assign({}, headers), { 'Content-Type': 'application/json' }),
                        })];
                case 1:
                    res = _a.sent();
                    clearTimeout(timeoutId);
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    throw new errors_1.PostError('network-failure');
                case 4:
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
                    return [2 /*return*/, res.data];
            }
        });
    });
}
function postBinary(url, data, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_4, buffer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, fetch_1.fetch)(url, {
                            method: 'POST',
                            body: Platform.isBrowser ? data : Buffer.from(data),
                            headers: __assign({ 'Content-Length': data.length, 'Content-Type': 'application/actual-sync' }, headers),
                        })];
                case 1:
                    res = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _c.sent();
                    throw new errors_1.PostError('network-failure');
                case 3:
                    if (!res.arrayBuffer) return [3 /*break*/, 5];
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, res.arrayBuffer()];
                case 4:
                    buffer = _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, res.buffer()];
                case 6:
                    buffer = _c.sent();
                    _c.label = 7;
                case 7:
                    throwIfNot200(res, buffer.toString());
                    return [2 /*return*/, buffer];
            }
        });
    });
}
function get(url, opts) {
    return (0, fetch_1.fetch)(url, opts).then(function (res) { return res.text(); });
}
