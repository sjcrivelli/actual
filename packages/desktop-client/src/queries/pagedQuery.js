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
exports.PagedQuery = void 0;
exports.pagedQuery = pagedQuery;
// @ts-strict-ignore
var async_1 = require("loot-core/shared/async");
var query_1 = require("loot-core/shared/query");
var aqlQuery_1 = require("./aqlQuery");
var liveQuery_1 = require("./liveQuery");
function pagedQuery(query, _a) {
    var onData = _a.onData, onError = _a.onError, onPageData = _a.onPageData, _b = _a.options, options = _b === void 0 ? {} : _b;
    return PagedQuery.runPagedQuery(query, onData, onError, onPageData, options);
}
// Paging
var PagedQuery = /** @class */ (function (_super) {
    __extends(PagedQuery, _super);
    function PagedQuery(query, onData, onError, onPageData, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, query, onData, onError, options) || this;
        _this.fetchCount = function () {
            return (0, aqlQuery_1.aqlQuery)(_this.query.calculate({ $count: '*' })).then(function (_a) {
                var data = _a.data;
                _this._totalCount = data;
            });
        };
        _this.run = function () {
            _this.subscribe();
            _this._fetchDataPromise = _this.fetchData(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._hasReachedEnd = false;
                    // Also fetch the total count
                    this.fetchCount();
                    // If data is null, we haven't fetched anything yet so just
                    // fetch the first page
                    return [2 /*return*/, (0, aqlQuery_1.aqlQuery)(this.query.limit(this.data == null
                            ? this._pageCount
                            : Math.max(this.data.length, this._pageCount)))];
                });
            }); });
            return _this._fetchDataPromise;
        };
        _this.refetchUpToRow = function (id, defaultOrderBy) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this._fetchDataPromise = this.fetchData(function () { return __awaiter(_this, void 0, void 0, function () {
                    var orderDesc, field, order, result, fullRow, data;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                this._hasReachedEnd = false;
                                // Also fetch the total count
                                this.fetchCount();
                                orderDesc = (0, query_1.getPrimaryOrderBy)(this.query, defaultOrderBy);
                                if (orderDesc == null) {
                                    throw new Error("refetchUpToRow requires a query with orderBy");
                                }
                                field = orderDesc.field, order = orderDesc.order;
                                return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.query.filter({ id: id }).select(field))];
                            case 1:
                                result = _e.sent();
                                if (result.data.length === 0) {
                                    // This row is not part of this set anymore, we can't do
                                    // this. We stop early to avoid possibly pulling in a ton of
                                    // data that we don't need
                                    return [2 /*return*/];
                                }
                                fullRow = result.data[0];
                                return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.query.filter((_a = {},
                                        _a[field] = (_b = {},
                                            _b[order === 'asc' ? '$lte' : '$gte'] = fullRow[field],
                                            _b),
                                        _a)))];
                            case 2:
                                result = _e.sent();
                                data = result.data;
                                return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.query
                                        .filter((_c = {},
                                        _c[field] = (_d = {},
                                            _d[order === 'asc' ? '$gt' : '$lt'] = fullRow[field],
                                            _d),
                                        _c))
                                        .limit(this._pageCount))];
                            case 3:
                                // Load in an extra page to make room for the UI to show some
                                // data after it
                                result = _e.sent();
                                return [2 /*return*/, {
                                        data: data.concat(result.data),
                                        dependencies: result.dependencies,
                                    }];
                        }
                    });
                }); });
                return [2 /*return*/, this._fetchDataPromise];
            });
        }); };
        _this.onPageData = function (data) {
            _this._onPageData(data);
        };
        // The public version of this function is created below and
        // throttled by `once`
        _this._fetchNext = function () { return __awaiter(_this, void 0, void 0, function () {
            var previousData, data_1, prevData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.inflightRequestId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._fetchDataPromise];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 2:
                        previousData = this.data;
                        if (!!this._hasReachedEnd) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)(this.query.limit(this._pageCount).offset(previousData.length))];
                    case 3:
                        data_1 = (_a.sent()).data;
                        // If either there is an existing request in flight or the data
                        // has already changed underneath it, we can't reliably concat
                        // the data since it's different now. Need to re-run the whole
                        // process again
                        if (this.inflightRequestId || previousData !== this.data) {
                            return [2 /*return*/, this._fetchNext()];
                        }
                        else {
                            if (data_1.length === 0) {
                                this._hasReachedEnd = true;
                            }
                            else {
                                this._hasReachedEnd = data_1.length < this._pageCount;
                                prevData = this.data;
                                this.updateData(function (currentData) { return currentData.concat(data_1); });
                                // Handle newly loaded page data
                                this.onPageData(data_1);
                                // Handle entire data
                                this.onData(this.data, prevData);
                            }
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.fetchNext = (0, async_1.once)(_this._fetchNext);
        _this.optimisticUpdate = function (updateFn) {
            var previousData = _this.data;
            _this._optimisticUpdate(updateFn);
            _this._totalCount += _this.data.length - previousData.length;
        };
        _this._totalCount = 0;
        _this._pageCount = options.pageCount || 500;
        _this._fetchDataPromise = null;
        _this._hasReachedEnd = false;
        _this._onPageData = onPageData || (function () { });
        return _this;
    }
    Object.defineProperty(PagedQuery.prototype, "hasNext", {
        get: function () {
            return !this._hasReachedEnd;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PagedQuery.prototype, "totalCount", {
        get: function () {
            return this._totalCount;
        },
        enumerable: false,
        configurable: true
    });
    PagedQuery.runPagedQuery = function (query, onData, onError, onPageData, options) {
        if (options === void 0) { options = {}; }
        var pagedQuery = new PagedQuery(query, onData, onError, onPageData, options);
        pagedQuery.run();
        return pagedQuery;
    };
    return PagedQuery;
}(liveQuery_1.LiveQuery));
exports.PagedQuery = PagedQuery;
