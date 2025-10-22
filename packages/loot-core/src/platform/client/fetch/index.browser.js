"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.clearServer = exports.serverPush = exports.initServer = exports.unlisten = exports.listen = exports.sendCatch = exports.send = exports.init = void 0;
// @ts-strict-ignore
var i18next_1 = require("i18next");
var uuid_1 = require("uuid");
var exceptions_1 = require("../../exceptions");
var undo = require("../undo");
var replyHandlers = new Map();
var listeners = new Map();
var messageQueue = [];
var globalWorker = null;
var ReconstructedError = /** @class */ (function (_super) {
    __extends(ReconstructedError, _super);
    function ReconstructedError(message, stack, url, line, column) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        _this.message = message;
        Object.defineProperty(_this, 'stack', {
            get: function () {
                return 'extended ' + this._stack;
            },
            set: function (value) {
                this._stack = value;
            },
        });
        _this.stack = stack;
        _this.url = url;
        _this.line = line;
        _this.column = column;
        return _this;
    }
    return ReconstructedError;
}(Error));
function handleMessage(msg) {
    if (msg.type === 'error') {
        // An error happened while handling a message so cleanup the
        // current reply handler. We don't care about the actual error -
        // generic backend errors are handled separately and if you want
        // more specific handling you should manually forward the error
        // through a normal reply.
        var id = msg.id;
        replyHandlers.delete(id);
    }
    else if (msg.type === 'reply') {
        var id = msg.id, result = msg.result, mutated = msg.mutated, undoTag = msg.undoTag;
        var handler = replyHandlers.get(id);
        if (handler) {
            replyHandlers.delete(id);
            if (!mutated) {
                undo.gc(undoTag);
            }
            handler.resolve(result);
        }
    }
    else if (msg.type === 'push') {
        var name_1 = msg.name, args = msg.args;
        var listens = listeners.get(name_1);
        if (listens) {
            for (var i = 0; i < listens.length; i++) {
                var stop_1 = listens[i](args);
                if (stop_1 === true) {
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
    worker.onmessage = function (event) {
        var msg = event.data;
        // The worker implementation implements its own concept of a
        // 'connect' event because the worker is immediately
        // available, but we don't know when the backend is actually
        // ready to handle messages.
        if (msg.type === 'connect') {
            // Send any messages that were queued while closed
            if ((messageQueue === null || messageQueue === void 0 ? void 0 : messageQueue.length) > 0) {
                messageQueue.forEach(function (msg) { return worker.postMessage(msg); });
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
var init = function (worker) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    return connectWorker(worker, resolve, reject);
                })];
        });
    });
};
exports.init = init;
var send = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    var name = params[0], args = params[1], _a = params[2], _b = _a === void 0 ? {} : _a, _c = _b.catchErrors, catchErrors = _c === void 0 ? false : _c;
    return new Promise(function (resolve, reject) {
        var id = (0, uuid_1.v4)();
        replyHandlers.set(id, { resolve: resolve, reject: reject });
        var message = {
            id: id,
            name: name,
            args: args,
            undoTag: undo.snapshot(),
            catchErrors: catchErrors,
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
var sendCatch = function (name, args) {
    return (0, exports.send)(name, args, { catchErrors: true });
};
exports.sendCatch = sendCatch;
var listen = function (name, cb) {
    if (!listeners.get(name)) {
        listeners.set(name, []);
    }
    listeners.get(name).push(cb);
    return function () {
        var arr = listeners.get(name);
        listeners.set(name, arr.filter(function (cb_) { return cb_ !== cb; }));
    };
};
exports.listen = listen;
var unlisten = function (name) {
    listeners.set(name, []);
};
exports.unlisten = unlisten;
var initServer = function () {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
};
exports.initServer = initServer;
var serverPush = function () {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
};
exports.serverPush = serverPush;
var clearServer = function () {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
};
exports.clearServer = clearServer;
