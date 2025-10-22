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
exports.serverPush = exports.initServer = exports.clearServer = exports.unlisten = exports.listen = exports.sendCatch = exports.send = exports.init = void 0;
// @ts-strict-ignore
var uuid_1 = require("uuid");
var undo = require("../undo");
var replyHandlers = new Map();
var listeners = new Map();
var messageQueue = [];
var socketClient = null;
function connectSocket(onOpen) {
    global.Actual.ipcConnect(function (client) {
        client.on('message', function (data) {
            var msg = data;
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
                var result = msg.result;
                var id = msg.id, mutated = msg.mutated, undoTag = msg.undoTag;
                // Check if the result is a serialized buffer, and if so
                // convert it to a Uint8Array. This is only needed when working
                // with node; the web version connection layer automatically
                // supports buffers
                if (result && result.type === 'Buffer' && Array.isArray(result.data)) {
                    result = new Uint8Array(result.data);
                }
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
                throw new Error('Unknown message type: ' + JSON.stringify(msg));
            }
        });
        socketClient = client;
        // Send any messages that were queued while closed
        if (messageQueue.length > 0) {
            messageQueue.forEach(function (msg) { return client.emit('message', msg); });
            messageQueue = [];
        }
        onOpen();
    });
}
var init = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(connectSocket)];
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
        if (socketClient) {
            socketClient.emit('message', {
                id: id,
                name: name,
                args: args,
                undoTag: undo.snapshot(),
                catchErrors: !!catchErrors,
            });
        }
        else {
            messageQueue.push({
                id: id,
                name: name,
                args: args,
                undoTag: undo.snapshot(),
                catchErrors: catchErrors,
            });
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
        if (arr) {
            listeners.set(name, arr.filter(function (cb_) { return cb_ !== cb; }));
        }
    };
};
exports.listen = listen;
var unlisten = function (name) {
    listeners.set(name, []);
};
exports.unlisten = unlisten;
function closeSocket(onClose) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    socketClient.onclose = function () {
                        socketClient = null;
                        onClose();
                    };
                    return [4 /*yield*/, socketClient.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var clearServer = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (socketClient != null) {
                return [2 /*return*/, new Promise(closeSocket)];
            }
            return [2 /*return*/];
        });
    });
};
exports.clearServer = clearServer;
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
