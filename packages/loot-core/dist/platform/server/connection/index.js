"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEvents = exports.getNumClients = exports.send = exports.init = void 0;
// @ts-strict-ignore
const errors_1 = require("../../../server/errors");
const mutators_1 = require("../../../server/mutators");
const exceptions_1 = require("../../exceptions");
function getGlobalObject() {
    const obj = typeof window !== 'undefined'
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
const init = function (serverChn, handlers) {
    const serverChannel = serverChn;
    getGlobalObject().__globalServerChannel = serverChannel;
    serverChannel.addEventListener('message', e => {
        const data = e.data;
        const msg = typeof data === 'string' ? JSON.parse(data) : data;
        if (msg.type && (msg.type === 'init' || msg.type.startsWith('__'))) {
            return;
        }
        if (msg.name === 'client-connected-to-backend') {
            // the client is indicating that it is connected to this backend. Stop attempting to connect
            console.info('Backend: Client connected');
            clearInterval(reconnectToClientInterval);
            return;
        }
        const { id, name, args, undoTag, catchErrors } = msg;
        if (handlers[name]) {
            (0, mutators_1.runHandler)(handlers[name], args, { undoTag, name }).then(result => {
                serverChannel.postMessage({
                    type: 'reply',
                    id,
                    result: catchErrors ? { data: result, error: null } : result,
                    mutated: (0, mutators_1.isMutating)(handlers[name]),
                    undoTag,
                });
            }, nativeError => {
                const error = coerceError(nativeError);
                if (name.startsWith('api/')) {
                    // The API is newer and does automatically forward
                    // errors
                    serverChannel.postMessage({ type: 'reply', id, error });
                }
                else if (catchErrors) {
                    serverChannel.postMessage({
                        type: 'reply',
                        id,
                        result: { error, data: null },
                    });
                }
                else {
                    serverChannel.postMessage({ type: 'error', id });
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
                id,
                result: null,
                error: (0, errors_1.APIError)('Unknown method: ' + name),
            });
        }
    }, false);
    const RECONNECT_INTERVAL_MS = 200;
    const MAX_RECONNECT_ATTEMPTS = 500;
    let reconnectAttempts = 0;
    const reconnectToClientInterval = setInterval(() => {
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
const send = function (name, args) {
    const { __globalServerChannel } = getGlobalObject();
    if (__globalServerChannel) {
        __globalServerChannel.postMessage({
            type: 'push',
            name,
            args,
        });
    }
};
exports.send = send;
const getNumClients = function () {
    return 1;
};
exports.getNumClients = getNumClients;
const resetEvents = function () { };
exports.resetEvents = resetEvents;
