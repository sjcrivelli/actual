"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEvents = exports.getNumClients = exports.send = exports.init = void 0;
// @ts-strict-ignore
var errors_1 = require("../../../server/errors");
var mutators_1 = require("../../../server/mutators");
var exceptions_1 = require("../../exceptions");
function getGlobalObject() {
    var obj = typeof window !== 'undefined'
        ? window
        : typeof self !== 'undefined'
            ? self
            : null;
    if (!obj) {
        throw new Error('Cannot get global object');
    }
    return obj;
}
getGlobalObject().__globalServerChannel = null;
function coerceError(error) {
    if (error.type && error.type === 'APIError') {
        return error;
    }
    return { type: 'InternalError', message: error.message };
}
var init = function (serverChn, handlers) {
    var serverChannel = serverChn;
    getGlobalObject().__globalServerChannel = serverChannel;
    serverChannel.addEventListener('message', function (e) {
        var data = e.data;
        var msg = typeof data === 'string' ? JSON.parse(data) : data;
        if (msg.type && (msg.type === 'init' || msg.type.startsWith('__'))) {
            return;
        }
        if (msg.name === 'client-connected-to-backend') {
            // the client is indicating that it is connected to this backend. Stop attempting to connect
            console.info('Backend: Client connected');
            clearInterval(reconnectToClientInterval);
            return;
        }
        var id = msg.id, name = msg.name, args = msg.args, undoTag = msg.undoTag, catchErrors = msg.catchErrors;
        if (handlers[name]) {
            (0, mutators_1.runHandler)(handlers[name], args, { undoTag: undoTag, name: name }).then(function (result) {
                serverChannel.postMessage({
                    type: 'reply',
                    id: id,
                    result: catchErrors ? { data: result, error: null } : result,
                    mutated: (0, mutators_1.isMutating)(handlers[name]),
                    undoTag: undoTag,
                });
            }, function (nativeError) {
                var error = coerceError(nativeError);
                if (name.startsWith('api/')) {
                    // The API is newer and does automatically forward
                    // errors
                    serverChannel.postMessage({ type: 'reply', id: id, error: error });
                }
                else if (catchErrors) {
                    serverChannel.postMessage({
                        type: 'reply',
                        id: id,
                        result: { error: error, data: null },
                    });
                }
                else {
                    serverChannel.postMessage({ type: 'error', id: id });
                }
                // Only report internal errors
                if (error.type === 'InternalError') {
                    (0, exceptions_1.captureException)(nativeError);
                }
                if (!catchErrors) {
                    // Notify the frontend that something bad happend
                    (0, exports.send)('server-error');
                }
            });
        }
        else {
            console.warn('Unknown method: ' + name);
            serverChannel.postMessage({
                type: 'reply',
                id: id,
                result: null,
                error: (0, errors_1.APIError)('Unknown method: ' + name),
            });
        }
    }, false);
    var RECONNECT_INTERVAL_MS = 200;
    var MAX_RECONNECT_ATTEMPTS = 500;
    var reconnectAttempts = 0;
    var reconnectToClientInterval = setInterval(function () {
        console.info('Backend: Trying to connect to client');
        serverChannel.postMessage({ type: 'connect' });
        reconnectAttempts++;
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            // Failed to connect to client - signal server error
            (0, exports.send)('server-error');
            clearInterval(reconnectToClientInterval);
        }
    }, RECONNECT_INTERVAL_MS);
};
exports.init = init;
var send = function (name, args) {
    var __globalServerChannel = getGlobalObject().__globalServerChannel;
    if (__globalServerChannel) {
        __globalServerChannel.postMessage({
            type: 'push',
            name: name,
            args: args,
        });
    }
};
exports.send = send;
var getNumClients = function () {
    return 1;
};
exports.getNumClients = getNumClients;
var resetEvents = function () { };
exports.resetEvents = resetEvents;
