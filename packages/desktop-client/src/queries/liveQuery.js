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
exports.LiveQuery = void 0;
exports.liveQuery = liveQuery;
// @ts-strict-ignore
var fetch_1 = require("loot-core/platform/client/fetch");
var aqlQuery_1 = require("./aqlQuery");
function liveQuery(query, _a) {
    var onData = _a.onData, onError = _a.onError, _b = _a.options, options = _b === void 0 ? {} : _b;
    return LiveQuery.runLiveQuery(query, onData, onError, options);
}
// Subscribe and refetch
var LiveQuery = /** @class */ (function () {
    function LiveQuery(query, onData, onError, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.addListener = function (func) {
            _this._listeners.push(func);
            return function () {
                _this._listeners = _this._listeners.filter(function (l) { return l !== func; });
            };
        };
        this.onData = function (data, prevData) {
            for (var i = 0; i < _this._listeners.length; i++) {
                _this._listeners[i](data, prevData);
            }
        };
        this.onError = function (error) {
            _this._onError(error);
        };
        this.onUpdate = function (tables) {
            // We might not know the dependencies if the first query result
            // hasn't come back yet
            if (_this._dependencies == null ||
                tables.find(function (table) { return _this._dependencies.has(table); })) {
                _this.run();
            }
        };
        this.run = function () {
            _this.subscribe();
            return _this.fetchData(function () { return (0, aqlQuery_1.aqlQuery)(_this._query); });
        };
        this.subscribe = function () {
            if (_this._unsubscribeSyncEvent == null) {
                _this._unsubscribeSyncEvent = (0, fetch_1.listen)('sync-event', function (event) {
                    // If the user is doing optimistic updates, they don't want to
                    // always refetch whenever something changes because it would
                    // refetch all data after they've already updated the UI. This
                    // voids the perf benefits of optimistic updates. Allow querys
                    // to only react to remote syncs. By default, queries will
                    // always update to all changes.
                    if ((event.type === 'applied' || event.type === 'success') &&
                        _this._supportedSyncTypes.has(event.type)) {
                        _this.onUpdate(event.tables);
                    }
                });
            }
        };
        this.unsubscribe = function () {
            if (_this._unsubscribeSyncEvent) {
                _this._unsubscribeSyncEvent();
                _this._unsubscribeSyncEvent = null;
            }
        };
        this._optimisticUpdate = function (updateFn) {
            var previousData = _this.data;
            _this.updateData(updateFn);
            _this.onData(_this.data, previousData);
        };
        this.optimisticUpdate = function (dataFunc) {
            _this._optimisticUpdate(dataFunc);
        };
        this.updateData = function (updateFn) {
            _this.data = updateFn(_this.data);
        };
        this.fetchData = function (runQuery) { return __awaiter(_this, void 0, void 0, function () {
            var reqId, _a, data, dependencies, previousData, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reqId = Math.random();
                        this.inflightRequestId = reqId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, runQuery()];
                    case 2:
                        _a = _b.sent(), data = _a.data, dependencies = _a.dependencies;
                        // Regardless if this request was cancelled or not, save the
                        // dependencies. The query can't change so all requests will
                        // return the same deps.
                        if (this._dependencies == null) {
                            this._dependencies = new Set(dependencies);
                        }
                        // Only fire events if this hasn't been cancelled and if we're
                        // still subscribed (`this.unsubscribeSyncEvent` will exist)
                        if (this.inflightRequestId === reqId && this._unsubscribeSyncEvent) {
                            previousData = this.data;
                            // For calculate queries, data is a raw value, not an array
                            // Convert it to an array format to maintain consistency
                            if (this._query.state.calculation) {
                                this.data = [data];
                            }
                            else {
                                this.data = data;
                            }
                            this.onData(this.data, previousData);
                            this.inflightRequestId = null;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.log('Error fetching data', e_1);
                        this.onError(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this._query = query;
        this._data = null;
        this._dependencies = null;
        this._listeners = [];
        this._onError = onError || (function () { });
        // TODO: error types?
        this._supportedSyncTypes = options.onlySync
            ? new Set(['success'])
            : new Set(['applied', 'success']);
        if (onData) {
            this.addListener(onData);
        }
    }
    Object.defineProperty(LiveQuery.prototype, "query", {
        get: function () {
            return this._query;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LiveQuery.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (data) {
            this._data = data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LiveQuery.prototype, "isRunning", {
        get: function () {
            return this._unsubscribeSyncEvent != null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LiveQuery.prototype, "inflightRequestId", {
        get: function () {
            return this._inflightRequestId;
        },
        set: function (id) {
            this._inflightRequestId = id;
        },
        enumerable: false,
        configurable: true
    });
    LiveQuery.runLiveQuery = function (query, onData, onError, options) {
        if (options === void 0) { options = {}; }
        var liveQuery = new LiveQuery(query, onData, onError, options);
        liveQuery.run();
        return liveQuery;
    };
    return LiveQuery;
}());
exports.LiveQuery = LiveQuery;
