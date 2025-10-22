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
// @ts-strict-ignore
var fetch = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var test_helpers_1 = require("loot-core/shared/test-helpers");
var liveQuery_1 = require("./liveQuery");
function wait(n) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve("wait(".concat(n, ")")); }, n); });
}
function isCountQuery(query) {
    if (query.selectExpressions.length === 1) {
        var select = query.selectExpressions[0];
        return select.result && select.result.$count === '*';
    }
    return false;
}
var eventListeners = new Map();
function clearEventListeners() {
    eventListeners.clear();
}
function mockListen(name, listener) {
    if (!eventListeners.get(name)) {
        eventListeners.set(name, []);
    }
    eventListeners.get(name).push(listener);
    return function () {
        var arr = eventListeners.get(name);
        eventListeners.set(name, arr.filter(function (l) { return l !== listener; }));
    };
}
function mockPublishEvent(name, args) {
    var listeners = eventListeners.get(name);
    if (listeners) {
        listeners.forEach(function (listener) { return listener(args); });
    }
}
function mockSend(name_1, args_1, _a) {
    return __awaiter(this, arguments, void 0, function (name, args, _b) {
        var _c, query;
        var delay = _b.delay;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _c = name;
                    switch (_c) {
                        case 'query': return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 4];
                case 1:
                    query = args;
                    if (!isCountQuery(query)) {
                        test_helpers_1.tracer.event('server-query');
                    }
                    if (!delay) return [3 /*break*/, 3];
                    return [4 /*yield*/, wait(delay)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [2 /*return*/, { data: query.selectExpressions, dependencies: ['transactions'] }];
                case 4: throw new Error("Command not implemented: ".concat(name));
            }
        });
    });
}
function mockServer(_a) {
    var _b = _a.send, send = _b === void 0 ? mockSend : _b, _c = _a.listen, listen = _c === void 0 ? mockListen : _c;
    vi.spyOn(fetch, 'send').mockImplementation(function (name, args) {
        return send(name, args, { delay: 0 });
    });
    vi.spyOn(fetch, 'listen').mockImplementation(listen);
}
function clearMockServer() {
    clearEventListeners();
    vi.clearAllMocks();
}
function mockBasicServer(delay) {
    mockServer({
        send: function (name, args) {
            return mockSend(name, args, { delay: delay });
        },
    });
}
describe('liveQuery', function () {
    beforeEach(function () {
        (0, test_helpers_1.resetTracer)();
        clearMockServer();
    });
    it("runs and subscribes to a query", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBasicServer();
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    (0, liveQuery_1.liveQuery)(query, { onData: function (data) { return test_helpers_1.tracer.event('data', data); } });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 2:
                    _a.sent();
                    // Simulate a sync event
                    mockPublishEvent('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("runs but ignores applied events (onlySync: true)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query, p, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mockBasicServer();
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    (0, liveQuery_1.liveQuery)(query, {
                        onData: function (data) { return test_helpers_1.tracer.event('data', data); },
                        options: { onlySync: true },
                    });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 2:
                    _b.sent();
                    // Simulate a sync event
                    mockPublishEvent('sync-event', {
                        type: 'applied',
                        tables: ['transactions'],
                    });
                    p = Promise.race([test_helpers_1.tracer.wait('server-query'), wait(100)]);
                    _a = expect;
                    return [4 /*yield*/, p];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toEqual('wait(100)');
                    return [2 /*return*/];
            }
        });
    }); });
    it("runs and updates with sync events (onlySync: true)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBasicServer();
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    (0, liveQuery_1.liveQuery)(query, {
                        onData: function (data) { return test_helpers_1.tracer.event('data', data); },
                        options: { onlySync: true },
                    });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 2:
                    _a.sent();
                    // Simulate a sync event
                    mockPublishEvent('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("cancels existing requests", function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestId, query, lq;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestId = 0;
                    mockServer({
                        send: function (name, args) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, query_2;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = name;
                                        switch (_a) {
                                            case 'query': return [3 /*break*/, 1];
                                        }
                                        return [3 /*break*/, 3];
                                    case 1:
                                        query_2 = args;
                                        if (!isCountQuery(query_2)) {
                                            requestId++;
                                        }
                                        return [4 /*yield*/, wait(500)];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/, { data: requestId, dependencies: ['transactions'] }];
                                    case 3: throw new Error("Command not implemented: ".concat(name));
                                }
                            });
                        }); },
                    });
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    lq = (0, liveQuery_1.liveQuery)(query, {
                        onData: function (data) { return test_helpers_1.tracer.event('data', data); },
                        options: { onlySync: true },
                    });
                    // Users should never call `run` manually but we'll do it to
                    // test
                    lq.run();
                    return [4 /*yield*/, wait(0)];
                case 1:
                    _a.sent();
                    lq.run();
                    return [4 /*yield*/, wait(0)];
                case 2:
                    _a.sent();
                    lq.run();
                    return [4 /*yield*/, wait(0)];
                case 3:
                    _a.sent();
                    lq.run();
                    return [4 /*yield*/, wait(0)];
                case 4:
                    _a.sent();
                    lq.run();
                    // Wait for the same delay the server has
                    return [4 /*yield*/, wait(500)];
                case 5:
                    // Wait for the same delay the server has
                    _a.sent();
                    // Data should only be returned once
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', 6)];
                case 6:
                    // Data should only be returned once
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("cancels requests when server pushes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBasicServer();
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    (0, liveQuery_1.liveQuery)(query, {
                        onData: function (data) { return test_helpers_1.tracer.event('data', data); },
                        options: { onlySync: true },
                    });
                    // Simulate a sync event
                    // Send a push in the middle of the query running for the first run
                    mockPublishEvent('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    // The first request should get handled, but there should be no
                    // `data` event
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 1:
                    // The first request should get handled, but there should be no
                    // `data` event
                    _a.sent();
                    // The live query simply reruns the query, ignoring the first result
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 2:
                    // The live query simply reruns the query, ignoring the first result
                    _a.sent();
                    // And we have data!
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 3:
                    // And we have data!
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("reruns if data changes in the middle of *any* request", function () { return __awaiter(void 0, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBasicServer(500);
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    (0, liveQuery_1.liveQuery)(query, {
                        onData: function (data) { return test_helpers_1.tracer.event('data', data); },
                        options: { onlySync: true },
                    });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 2:
                    _a.sent();
                    // Simulate a sync event
                    // Send two pushes in a row
                    mockPublishEvent('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    mockPublishEvent('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    // Two requests will be made to the server, but the first one
                    // should be ignored and we only get one data back
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 3:
                    // Two requests will be made to the server, but the first one
                    // should be ignored and we only get one data back
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("unsubscribes correctly", function () { return function (done) { return __awaiter(void 0, void 0, void 0, function () {
        var query, lq, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockBasicServer();
                    test_helpers_1.tracer.start();
                    query = (0, query_1.q)('transactions').select('*');
                    lq = (0, liveQuery_1.liveQuery)(query, {
                        onData: function (data) { return test_helpers_1.tracer.event('data', data); },
                    });
                    return [4 /*yield*/, test_helpers_1.tracer.expect('server-query')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, test_helpers_1.tracer.expect('data', ['*'])];
                case 2:
                    _a.sent();
                    lq.unsubscribe();
                    // Simulate a sync event
                    mockPublishEvent('sync-event', {
                        type: 'success',
                        tables: ['transactions'],
                    });
                    p = Promise.race([test_helpers_1.tracer.expect('server-query'), wait(100)]);
                    return [4 /*yield*/, expect(p).resolves.toEqual('wait(100)')];
                case 3:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); }; });
});
