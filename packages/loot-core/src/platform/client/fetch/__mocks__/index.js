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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.sendCatch = exports.send = exports.serverPush = exports.clearServer = exports.initServer = void 0;
var listeners = new Map();
var serverHandler = null;
var initServer = function (handlers) {
    serverHandler = function (msg) {
        var name = msg.name, args = msg.args, catchErrors = msg.catchErrors;
        if (handlers[name]) {
            return Promise.resolve().then(function () {
                var promise = handlers[name](args);
                if (catchErrors) {
                    return promise.then(function (data) { return ({ data: data }); }, function (err) { return ({ error: { message: err.message } }); });
                }
                return promise;
            });
        }
    };
};
exports.initServer = initServer;
var clearServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        serverHandler = null;
        listeners = new Map();
        return [2 /*return*/];
    });
}); };
exports.clearServer = clearServer;
var serverPush = function (name, args) {
    Promise.resolve().then(function () {
        var listens = listeners.get(name);
        if (listens) {
            listens.forEach(function (listener) {
                listener(args);
            });
        }
    });
};
exports.serverPush = serverPush;
var send = function (name_1, args_1) {
    var args_2 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_2[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([name_1, args_1], args_2, true), void 0, function (name, args, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.catchErrors, catchErrors = _c === void 0 ? false : _c;
        return __generator(this, function (_d) {
            if (serverHandler) {
                return [2 /*return*/, serverHandler({ name: name, args: args, catchErrors: catchErrors })];
            }
            else {
                throw new Error('`send` called with no mock server installed');
            }
            return [2 /*return*/];
        });
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
