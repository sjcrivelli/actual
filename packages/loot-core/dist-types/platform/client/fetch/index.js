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
exports.serverPush = exports.initServer = exports.clearServer = exports.unlisten = exports.listen = exports.sendCatch = exports.send = exports.init = void 0;
// @ts-strict-ignore
const uuid_1 = require("uuid");
const undo = __importStar(require("../undo"));
const replyHandlers = new Map();
const listeners = new Map();
let messageQueue = [];
let socketClient = null;
function connectSocket(onOpen) {
    global.Actual.ipcConnect(function (client) {
        client.on('message', data => {
            const msg = data;
            if (msg.type === 'error') {
                // An error happened while handling a message so cleanup the
                // current reply handler. We don't care about the actual error -
                // generic backend errors are handled separately and if you want
                // more specific handling you should manually forward the error
                // through a normal reply.
                const { id } = msg;
                replyHandlers.delete(id);
            }
            else if (msg.type === 'reply') {
                let { result } = msg;
                const { id, mutated, undoTag } = msg;
                // Check if the result is a serialized buffer, and if so
                // convert it to a Uint8Array. This is only needed when working
                // with node; the web version connection layer automatically
                // supports buffers
                if (result && result.type === 'Buffer' && Array.isArray(result.data)) {
                    result = new Uint8Array(result.data);
                }
                const handler = replyHandlers.get(id);
                if (handler) {
                    replyHandlers.delete(id);
                    if (!mutated) {
                        undo.gc(undoTag);
                    }
                    handler.resolve(result);
                }
            }
            else if (msg.type === 'push') {
                const { name, args } = msg;
                const listens = listeners.get(name);
                if (listens) {
                    for (let i = 0; i < listens.length; i++) {
                        const stop = listens[i](args);
                        if (stop === true) {
                            break;
                        }
                    }
                }
            }
            else {
                throw new Error('Unknown message type: ' + JSON.stringify(msg));
            }
        });
        socketClient = client;
        // Send any messages that were queued while closed
        if (messageQueue.length > 0) {
            messageQueue.forEach(msg => client.emit('message', msg));
            messageQueue = [];
        }
        onOpen();
    });
}
const init = async function () {
    return new Promise(connectSocket);
};
exports.init = init;
const send = function (...params) {
    const [name, args, { catchErrors = false } = {}] = params;
    return new Promise((resolve, reject) => {
        const id = (0, uuid_1.v4)();
        replyHandlers.set(id, { resolve, reject });
        if (socketClient) {
            socketClient.emit('message', {
                id,
                name,
                args,
                undoTag: undo.snapshot(),
                catchErrors: !!catchErrors,
            });
        }
        else {
            messageQueue.push({
                id,
                name,
                args,
                undoTag: undo.snapshot(),
                catchErrors,
            });
        }
    });
};
exports.send = send;
const sendCatch = function (name, args) {
    return (0, exports.send)(name, args, { catchErrors: true });
};
exports.sendCatch = sendCatch;
const listen = function (name, cb) {
    if (!listeners.get(name)) {
        listeners.set(name, []);
    }
    listeners.get(name).push(cb);
    return () => {
        const arr = listeners.get(name);
        if (arr) {
            listeners.set(name, arr.filter(cb_ => cb_ !== cb));
        }
    };
};
exports.listen = listen;
const unlisten = function (name) {
    listeners.set(name, []);
};
exports.unlisten = unlisten;
async function closeSocket(onClose) {
    socketClient.onclose = () => {
        socketClient = null;
        onClose();
    };
    await socketClient.close();
}
const clearServer = async function () {
    if (socketClient != null) {
        return new Promise(closeSocket);
    }
};
exports.clearServer = clearServer;
const initServer = async function () { };
exports.initServer = initServer;
const serverPush = async function () { };
exports.serverPush = serverPush;
//# sourceMappingURL=index.js.map