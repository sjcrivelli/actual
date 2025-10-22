"use strict";
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
/// <reference lib="WebWorker" />
var workbox_precaching_1 = require("workbox-precaching");
self.__WB_DISABLE_DEV_LOGS = true;
// Injected by VitePWA
(0, workbox_precaching_1.precacheAndRoute)(self.__WB_MANIFEST);
var fileList = new Map();
// Log installation event
self.addEventListener('install', function (_event) {
    console.log('Plugins Worker installing...');
    self.skipWaiting(); // Forces activation immediately
});
// Log activation event
self.addEventListener('activate', function (_event) {
    self.clients.claim();
    self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            client.postMessage({
                type: 'service-worker-ready',
                timestamp: Date.now(),
            });
        });
    });
});
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
self.addEventListener('fetch', function (event) {
    var url = new URL(event.request.url);
    var pathSegments = url.pathname.split('/').filter(Boolean); // Split and remove empty segments
    var pluginsIndex = pathSegments.indexOf('plugin-data');
    var slugIndex = pluginsIndex + 1;
    if (pluginsIndex !== -1 && pathSegments[slugIndex]) {
        var slug = pathSegments[slugIndex];
        var fileName = pathSegments.length > slugIndex + 1
            ? pathSegments[slugIndex + 1].split('?')[0]
            : '';
        event.respondWith(handlePlugin(slug, fileName.replace('?import', '')));
    }
});
function handlePlugin(slug, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, key, content, contentType, clientsList, client;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    for (_i = 0, _a = fileList.keys(); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (key.startsWith("".concat(slug, "/"))) {
                            if (key.endsWith("/".concat(fileName))) {
                                content = fileList.get(key);
                                contentType = getContentType(fileName);
                                return [2 /*return*/, new Response(content, {
                                        headers: { 'Content-Type': contentType },
                                    })];
                            }
                        }
                    }
                    return [4 /*yield*/, self.clients.matchAll()];
                case 1:
                    clientsList = _b.sent();
                    if (clientsList.length === 0) {
                        return [2 /*return*/, new Response(JSON.stringify({ error: 'No active clients to process' }), {
                                status: 404,
                                headers: { 'Content-Type': 'application/json' },
                            })];
                    }
                    client = clientsList[0];
                    return [2 /*return*/, new Promise(function (resolve) {
                            var channel = new MessageChannel();
                            channel.port1.onmessage = function (messageEvent) {
                                var _a;
                                var responseData = messageEvent.data;
                                if (responseData && Array.isArray(responseData)) {
                                    responseData.forEach(function (_a) {
                                        var name = _a.name, content = _a.content;
                                        fileList.set("".concat(slug, "/").concat(encodeURIComponent(name)), content);
                                    });
                                }
                                var fileToCheck = fileName.length > 0 ? fileName : 'mf-manifest.json';
                                if (fileList.has("".concat(slug, "/").concat(fileToCheck))) {
                                    var content = fileList.get("".concat(slug, "/").concat(fileToCheck));
                                    var contentType = getContentType(fileToCheck);
                                    var headers = { 'Content-Type': contentType };
                                    if (fileToCheck === 'mf-manifest.json') {
                                        try {
                                            var manifest = JSON.parse(content);
                                            if ((_a = manifest.metaData) === null || _a === void 0 ? void 0 : _a.publicPath) {
                                                manifest.metaData.publicPath = "/plugin-data/".concat(slug, "/");
                                                content = JSON.stringify(manifest);
                                            }
                                        }
                                        catch (error) {
                                            console.error('Failed to parse manifest for publicPath rewrite:', error);
                                        }
                                        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                                        headers['Pragma'] = 'no-cache';
                                        headers['Expires'] = '0';
                                    }
                                    resolve(new Response(content, { headers: headers }));
                                }
                                else {
                                    resolve(new Response('File not found', { status: 404 }));
                                }
                            };
                            client.postMessage({ type: 'plugin-files', eventData: { pluginUrl: slug } }, [channel.port2]);
                        })];
            }
        });
    });
}
function getContentType(fileName) {
    var _a;
    var extension = ((_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
    var mimeTypes = {
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
        json: 'application/json',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        svg: 'image/svg+xml',
    };
    return mimeTypes[extension] || 'application/octet-stream';
}
