"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.runMutator = void 0;
exports.mutator = mutator;
exports.isMutating = isMutating;
exports.runHandler = runHandler;
exports.enableGlobalMutations = enableGlobalMutations;
exports.disableGlobalMutations = disableGlobalMutations;
exports.withMutatorContext = withMutatorContext;
exports.getMutatorContext = getMutatorContext;
// @ts-strict-ignore
var exceptions_1 = require("../platform/exceptions");
var async_1 = require("../shared/async");
var runningMethods = new Set();
var currentContext = null;
var mutatingMethods = new WeakMap();
var globalMutationsEnabled = false;
var _latestHandlerNames = [];
function mutator(handler) {
    mutatingMethods.set(handler, true);
    return handler;
}
function isMutating(handler) {
    return mutatingMethods.has(handler);
}
function flushRunningMethods() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Give the client some time to invoke new requests
                return [4 /*yield*/, wait(200)];
                case 1:
                    // Give the client some time to invoke new requests
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(runningMethods.size > 0)) return [3 /*break*/, 5];
                    // Wait for all of them
                    return [4 /*yield*/, Promise.all(__spreadArray([], runningMethods.values(), true))];
                case 3:
                    // Wait for all of them
                    _a.sent();
                    // We give clients more time to make other requests. This lets them continue
                    // to do an async workflow
                    return [4 /*yield*/, wait(100)];
                case 4:
                    // We give clients more time to make other requests. This lets them continue
                    // to do an async workflow
                    _a.sent();
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function wait(time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
}
function runHandler(handler_1, args_1) {
    return __awaiter(this, arguments, void 0, function (handler, args, _a) {
        var promise;
        var _b = _a === void 0 ? {} : _a, undoTag = _b.undoTag, name = _b.name;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // For debug reasons, track the latest handlers that have been
                    // called
                    _latestHandlerNames.push(name);
                    if (_latestHandlerNames.length > 5) {
                        _latestHandlerNames = _latestHandlerNames.slice(-5);
                    }
                    if (mutatingMethods.has(handler)) {
                        return [2 /*return*/, (0, exports.runMutator)(function () { return handler(args); }, { undoTag: undoTag })];
                    }
                    if (!(name === 'close-budget')) return [3 /*break*/, 2];
                    return [4 /*yield*/, flushRunningMethods()];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    promise = handler(args);
                    runningMethods.add(promise);
                    promise.then(function () {
                        runningMethods.delete(promise);
                    });
                    return [2 /*return*/, promise];
            }
        });
    });
}
// These are useful for tests. Only use them in tests.
function enableGlobalMutations() {
    if (process.env.NODE_ENV === 'test') {
        globalMutationsEnabled = true;
    }
}
function disableGlobalMutations() {
    if (process.env.NODE_ENV === 'test') {
        globalMutationsEnabled = false;
    }
}
function _runMutator(func, initialContext) {
    if (initialContext === void 0) { initialContext = {}; }
    currentContext = initialContext;
    return func().finally(function () {
        currentContext = null;
    });
}
// Type cast needed as TS looses types over nested generic returns
exports.runMutator = (0, async_1.sequential)(_runMutator);
function withMutatorContext(context, func) {
    if (currentContext == null && !globalMutationsEnabled) {
        (0, exceptions_1.captureBreadcrumb)('Recent methods: ' + _latestHandlerNames.join(', '));
        (0, exceptions_1.captureException)(new Error('withMutatorContext: mutator not running'));
        // See comment below. This is not an error right now, but it will
        // be in the future.
        return func();
    }
    var prevContext = currentContext;
    currentContext = __assign(__assign({}, currentContext), context);
    return func().finally(function () {
        currentContext = prevContext;
    });
}
function getMutatorContext() {
    if (currentContext == null) {
        (0, exceptions_1.captureBreadcrumb)({
            category: 'server',
            message: 'Recent methods: ' + _latestHandlerNames.join(', '),
        });
        // captureException(new Error('getMutatorContext: mutator not running'));
        // For now, this is a non-fatal error. It will be in the future,
        // but this is relatively non-critical (undo just won't work) so
        // return an empty context. When we have more confidence that
        // everything is running inside a mutator, throw an error.
        return {};
    }
    if (currentContext == null && globalMutationsEnabled) {
        return {};
    }
    return currentContext;
}
