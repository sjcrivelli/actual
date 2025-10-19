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
exports.clearServer = exports.serverPush = exports.initServer = exports.unlisten = exports.listen = exports.sendCatch = exports.send = exports.init = void 0;
// @ts-strict-ignore
const i18next_1 = require("i18next");
const uuid_1 = require("uuid");
const exceptions_1 = require("../../exceptions");
const undo = __importStar(require("../undo"));
const replyHandlers = new Map();
const listeners = new Map();
let messageQueue = [];
let globalWorker = null;
class ReconstructedError extends Error {
    url;
    line;
    column;
    constructor(message, stack, url, line, column) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Object.defineProperty(this, 'stack', {
            get: function () {
                return 'extended ' + this._stack;
            },
            set: function (value) {
                this._stack = value;
            },
        });
        this.stack = stack;
        this.url = url;
        this.line = line;
        this.column = column;
    }
}
function handleMessage(msg) {
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
        const { id, result, mutated, undoTag } = msg;
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
        // Ignore internal messages that start with __
        if (!msg.type.startsWith('__')) {
            throw new Error('Unknown message type: ' + JSON.stringify(msg));
        }
    }
}
// Note that this does not support retry. If the worker
// dies, it will permanently be disconnected. That should be OK since
// I don't think a worker should ever die due to a system error.
function connectWorker(worker, onOpen, onError) {
    globalWorker = worker;
    worker.onmessage = event => {
        const msg = event.data;
        // The worker implementation implements its own concept of a
        // 'connect' event because the worker is immediately
        // available, but we don't know when the backend is actually
        // ready to handle messages.
        if (msg.type === 'connect') {
            // Send any messages that were queued while closed
            if (messageQueue?.length > 0) {
                messageQueue.forEach(msg => worker.postMessage(msg));
                messageQueue = null;
            }
            // signal to the backend that we're connected to it
            globalWorker.postMessage({
                name: 'client-connected-to-backend',
            });
            onOpen();
        }
        else if (msg.type === 'app-init-failure') {
            globalWorker.postMessage({
                name: '__app-init-failure-acknowledged',
            });
            onError(msg);
        }
        else if (msg.type === 'capture-exception') {
            (0, exceptions_1.captureException)(msg.stack
                ? new ReconstructedError(msg.message, msg.stack, msg.url, msg.line, msg.column)
                : msg.exc);
            if (msg.message && msg.message.includes('indexeddb-quota-error')) {
                alert((0, i18next_1.t)('We hit a limit on the local storage available. Edits may not be saved. Please get in touch https://actualbudget.org/contact/ so we can help debug this.'));
            }
        }
        else if (msg.type === 'capture-breadcrumb') {
            (0, exceptions_1.captureBreadcrumb)(msg.data);
        }
        else {
            handleMessage(msg);
        }
    };
    // In browsers that don't support wasm in workers well (Safari),
    // we run the server on the main process for now. This might not
    // actually be a worker, but instead a message port which we
    // need to start.
    if (worker instanceof MessagePort) {
        worker.start();
    }
}
const init = async function (worker) {
    return new Promise((resolve, reject) => connectWorker(worker, resolve, reject));
};
exports.init = init;
const send = function (...params) {
    const [name, args, { catchErrors = false } = {}] = params;
    return new Promise((resolve, reject) => {
        const id = (0, uuid_1.v4)();
        replyHandlers.set(id, { resolve, reject });
        const message = {
            id,
            name,
            args,
            undoTag: undo.snapshot(),
            catchErrors,
        };
        if (messageQueue) {
            messageQueue.push(message);
        }
        else {
            globalWorker.postMessage(message);
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
        listeners.set(name, arr.filter(cb_ => cb_ !== cb));
    };
};
exports.listen = listen;
const unlisten = function (name) {
    listeners.set(name, []);
};
exports.unlisten = unlisten;
const initServer = async function () { };
exports.initServer = initServer;
const serverPush = async function () { };
exports.serverPush = serverPush;
const clearServer = async function () { };
exports.clearServer = clearServer;
