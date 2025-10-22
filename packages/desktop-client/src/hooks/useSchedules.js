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
exports.useSchedules = useSchedules;
exports.getSchedulesQuery = getSchedulesQuery;
var react_1 = require("react");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var useSyncedPref_1 = require("./useSyncedPref");
var queries_1 = require("@desktop-client/queries");
var liveQuery_1 = require("@desktop-client/queries/liveQuery");
function loadStatuses(schedules, onData, onError, upcomingLength) {
    if (upcomingLength === void 0) { upcomingLength = '7'; }
    return (0, liveQuery_1.liveQuery)((0, schedules_1.getHasTransactionsQuery)(schedules), {
        onData: function (data) {
            var hasTrans = new Set(data.filter(Boolean).map(function (row) { return row.schedule; }));
            var scheduleStatuses = new Map(schedules.map(function (s) { return [
                s.id,
                (0, schedules_1.getStatus)(s.next_date, s.completed, hasTrans.has(s.id), upcomingLength),
            ]; }));
            onData === null || onData === void 0 ? void 0 : onData(scheduleStatuses);
        },
        onError: onError,
    });
}
function useSchedules(_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, query = _b.query;
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(undefined), error = _d[0], setError = _d[1];
    var _e = (0, react_1.useState)({
        schedules: [],
        statuses: new Map(),
        statusLabels: new Map(),
    }), data = _e[0], setData = _e[1];
    var upcomingLength = (0, useSyncedPref_1.useSyncedPref)('upcomingScheduledTransactionLength')[0];
    var scheduleQueryRef = (0, react_1.useRef)(null);
    var statusQueryRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var isUnmounted = false;
        setError(undefined);
        if (!query) {
            // This usually means query is not yet set on this render cycle.
            return;
        }
        function onError(error) {
            if (!isUnmounted) {
                setError(error);
                setIsLoading(false);
            }
        }
        if (query.state.table !== 'schedules') {
            onError(new Error('Query must be a schedules query.'));
            return;
        }
        setIsLoading(true);
        scheduleQueryRef.current = (0, liveQuery_1.liveQuery)(query, {
            onData: function (schedules) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    statusQueryRef.current = loadStatuses(schedules, function (statuses) {
                        if (!isUnmounted) {
                            setData({
                                schedules: schedules,
                                statuses: statuses,
                                statusLabels: new Map(__spreadArray([], statuses.keys(), true).map(function (key) { return [
                                    key,
                                    (0, schedules_1.getStatusLabel)(statuses.get(key) || ''),
                                ]; })),
                            });
                            setIsLoading(false);
                        }
                    }, onError, upcomingLength);
                    return [2 /*return*/];
                });
            }); },
            onError: onError,
        });
        return function () {
            var _a, _b;
            isUnmounted = true;
            (_a = scheduleQueryRef.current) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            (_b = statusQueryRef.current) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        };
    }, [query, upcomingLength]);
    return __assign({ isLoading: isLoading, error: error }, data);
}
function getSchedulesQuery(view) {
    var filterByAccount = (0, queries_1.accountFilter)(view, '_account');
    var filterByPayee = (0, queries_1.accountFilter)(view, '_payee.transfer_acct');
    var query = (0, query_1.q)('schedules')
        .select('*')
        .filter({
        $and: [{ '_account.closed': false }],
    });
    if (view) {
        if (view === 'uncategorized') {
            query = query.filter({ next_date: null });
        }
        else {
            query = query.filter({
                $or: [filterByAccount, filterByPayee],
            });
        }
    }
    return query.orderBy({ next_date: 'desc' });
}
