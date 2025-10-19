"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEvents = exports.send = exports.getNumClients = exports.init = void 0;
// @ts-strict-ignore
const errors_1 = require("../../../server/errors");
const mutators_1 = require("../../../server/mutators");
const exceptions_1 = require("../../exceptions");
function coerceError(error) {
    if (error.type && error.type === 'APIError') {
        return error;
    }
    return { type: 'InternalError', message: error.message };
}
const init = function (_socketName, handlers) {
    process.parentPort.on('message', ({ data }) => {
        const { id, name, args, undoTag, catchErrors } = data;
        if (handlers[name]) {
            (0, mutators_1.runHandler)(handlers[name], args, { undoTag, name }).then(result => {
                if (catchErrors) {
                    result = { data: result, error: null };
                }
                process.parentPort.postMessage({
                    type: 'reply',
                    id,
                    result,
                    mutated: (0, mutators_1.isMutating)(handlers[name]) && name !== 'undo' && name !== 'redo',
                    undoTag,
                });
            }, nativeError => {
                const error = coerceError(nativeError);
                if (name.startsWith('api/')) {
                    // The API is newer and does automatically forward
                    // errors
                    process.parentPort.postMessage({
                        type: 'reply',
                        id,
                        error,
                    });
                }
                else if (catchErrors) {
                    process.parentPort.postMessage({
                        type: 'reply',
                        id,
                        result: { error, data: null },
                    });
                }
                else {
                    process.parentPort.postMessage({ type: 'error', id });
                }
                if (error.type === 'InternalError' && name !== 'api/load-budget') {
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
            (0, exceptions_1.captureException)(new Error('Unknown server method: ' + name));
            process.parentPort.postMessage({
                type: 'reply',
                id,
                result: null,
                error: (0, errors_1.APIError)('Unknown method: ' + name),
            });
        }
    });
};
exports.init = init;
const getNumClients = function () {
    return 0;
};
exports.getNumClients = getNumClients;
const send = function (name, args) {
    process.parentPort.postMessage({ type: 'push', name, args });
};
exports.send = send;
const resetEvents = function () { };
exports.resetEvents = resetEvents;
