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
var async_1 = require("./async");
function timeout(n) {
    return new Promise(function (resolve) { return setTimeout(resolve, n); });
}
function makeFunction(data) {
    return function fn(n_1) {
        return __awaiter(this, arguments, void 0, function (n, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.throwError, throwError = _c === void 0 ? false : _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        data.push(n);
                        return [4 /*yield*/, timeout(10)];
                    case 1:
                        _d.sent();
                        if (throwError) {
                            throw new Error('throwing error');
                        }
                        data.push(n);
                        return [4 /*yield*/, timeout(50)];
                    case 2:
                        _d.sent();
                        data.push(n);
                        return [2 /*return*/];
                }
            });
        });
    };
}
describe('async', function () {
    test('sequential fn should force concurrent calls to be in order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, data, seqData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fn(1);
                                    fn(2);
                                    return [4 /*yield*/, fn(3)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    data = [];
                    return [4 /*yield*/, test(makeFunction(data))];
                case 1:
                    _a.sent();
                    expect(data).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
                    seqData = [];
                    return [4 /*yield*/, test((0, async_1.sequential)(makeFunction(seqData)))];
                case 2:
                    _a.sent();
                    expect(seqData).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
                    expect(data.length).toEqual(seqData.length);
                    return [2 /*return*/];
            }
        });
    }); });
    test('sequential fn should always call function when queue is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, data, seqData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fn(1)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, fn(2)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, fn(3)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    data = [];
                    return [4 /*yield*/, test(makeFunction(data))];
                case 1:
                    _a.sent();
                    expect(data).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
                    seqData = [];
                    return [4 /*yield*/, test((0, async_1.sequential)(makeFunction(seqData)))];
                case 2:
                    _a.sent();
                    expect(seqData).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
                    expect(data.length).toEqual(seqData.length);
                    return [2 /*return*/];
            }
        });
    }); });
    test('sequential fn should still flush queue when error is thrown', function () { return __awaiter(void 0, void 0, void 0, function () {
        var test, data, seqData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test = function (fn) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fn(1);
                                    fn(2, { throwError: true }).catch(function () { });
                                    return [4 /*yield*/, fn(3)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    data = [];
                    return [4 /*yield*/, test(makeFunction(data))];
                case 1:
                    _a.sent();
                    expect(data).toEqual([1, 2, 3, 1, 3, 1, 3]);
                    seqData = [];
                    return [4 /*yield*/, test((0, async_1.sequential)(makeFunction(seqData)))];
                case 2:
                    _a.sent();
                    expect(seqData).toEqual([1, 1, 1, 2, 3, 3, 3]);
                    expect(data.length).toEqual(seqData.length);
                    return [2 /*return*/];
            }
        });
    }); });
    test('sequential fn should ignore promise chains in the future', function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = [];
                    fn = (0, async_1.sequential)(makeFunction(data));
                    fn(1).then(function () {
                        // The next call should already have started (so it should have
                        // already appended 2 to the end). It shouldn't depend on this
                        // promise chain at all (important part being that if any errors
                        // happened in here, it wouldn't effect anything else)
                        expect(data).toEqual([1, 1, 1, 2]);
                    });
                    fn(2, { throwError: true }).catch(function () {
                        // Same as above
                        expect(data).toEqual([1, 1, 1, 2, 3]);
                    });
                    return [4 /*yield*/, fn(3)];
                case 1:
                    _a.sent();
                    expect(data).toEqual([1, 1, 1, 2, 3, 3, 3]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('once fn should only be called once', function () { return __awaiter(void 0, void 0, void 0, function () {
        var timesCalled, fn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timesCalled = 0;
                    fn = (0, async_1.once)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, timeout(200)];
                                case 1:
                                    _a.sent();
                                    timesCalled++;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all([fn(), fn(), fn()])];
                case 1:
                    _a.sent();
                    // It should only have been called once
                    expect(timesCalled).toBe(1);
                    // Make sure it's called again now that it's done executing
                    return [4 /*yield*/, Promise.all([fn(), fn()])];
                case 2:
                    // Make sure it's called again now that it's done executing
                    _a.sent();
                    expect(timesCalled).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    test('once fn should coalesce multiple calls', function () { return __awaiter(void 0, void 0, void 0, function () {
        var timesCalled, fn, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timesCalled = 0;
                    fn = (0, async_1.once)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, timeout(200)];
                                case 1:
                                    _a.sent();
                                    timesCalled++;
                                    return [2 /*return*/, {}];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all([fn(), fn(), fn()])];
                case 1:
                    results = _a.sent();
                    // It should only have been called once
                    expect(timesCalled).toBe(1);
                    // The results should all be identical (`toBe` is a strict
                    // comparison, like ===)
                    expect(results[0]).toBe(results[1]);
                    expect(results[0]).toBe(results[2]);
                    return [2 /*return*/];
            }
        });
    }); });
});
