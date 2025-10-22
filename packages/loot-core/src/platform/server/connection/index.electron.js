"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEvents = exports.send = exports.getNumClients = exports.init = void 0;
// @ts-strict-ignore
var errors_1 = require("../../../server/errors");
var mutators_1 = require("../../../server/mutators");
var exceptions_1 = require("../../exceptions");
function coerceError(error) {
    if (error.type && error.type === 'APIError') {
        return error;
    }
    return { type: 'InternalError', message: error.message };
}
var init = function (_socketName, handlers) {
    process.parentPort.on('message', function (_a) {
        var data = _a.data;
        var id = data.id, name = data.name, args = data.args, undoTag = data.undoTag, catchErrors = data.catchErrors;
        if (handlers[name]) {
            (0, mutators_1.runHandler)(handlers[name], args, { undoTag: undoTag, name: name }).then(function (result) {
                if (catchErrors) {
                    result = { data: result, error: null };
                }
                process.parentPort.postMessage({
                    type: 'reply',
                    id: id,
                    result: result,
                    mutated: (0, mutators_1.isMutating)(handlers[name]) && name !== 'undo' && name !== 'redo',
                    undoTag: undoTag,
                });
            }, function (nativeError) {
                var error = coerceError(nativeError);
                if (name.startsWith('api/')) {
                    // The API is newer and does automatically forward
                    // errors
                    process.parentPort.postMessage({
                        type: 'reply',
                        id: id,
                        error: error,
                    });
                }
                else if (catchErrors) {
                    process.parentPort.postMessage({
                        type: 'reply',
                        id: id,
                        result: { error: error, data: null },
                    });
                }
                else {
                    process.parentPort.postMessage({ type: 'error', id: id });
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
                id: id,
                result: null,
                error: (0, errors_1.APIError)('Unknown method: ' + name),
            });
        }
    });
};
exports.init = init;
var getNumClients = function () {
    return 0;
};
exports.getNumClients = getNumClients;
var send = function (name, args) {
    process.parentPort.postMessage({ type: 'push', name: name, args: args });
};
exports.send = send;
var resetEvents = function () { };
exports.resetEvents = resetEvents;
