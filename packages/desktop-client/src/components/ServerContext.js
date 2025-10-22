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
exports.useSetLoginMethods = exports.useSetMultiuserEnabled = exports.useRefreshLoginMethods = exports.useAvailableLoginMethods = exports.useLoginMethod = exports.useMultiuserEnabled = exports.useSetServerURL = exports.useServerVersion = exports.useServerURL = void 0;
exports.ServerProvider = ServerProvider;
var react_1 = require("react");
var i18next_1 = require("i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
var ServerContext = (0, react_1.createContext)({
    url: null,
    version: '',
    multiuserEnabled: false,
    availableLoginMethods: [],
    setURL: function () { return Promise.reject(new Error('ServerContext not initialized')); },
    refreshLoginMethods: function () {
        return Promise.reject(new Error('ServerContext not initialized'));
    },
    setMultiuserEnabled: function () { },
    setLoginMethods: function () { },
});
var useServerURL = function () { return (0, react_1.useContext)(ServerContext).url; };
exports.useServerURL = useServerURL;
var useServerVersion = function () { return (0, react_1.useContext)(ServerContext).version; };
exports.useServerVersion = useServerVersion;
var useSetServerURL = function () { return (0, react_1.useContext)(ServerContext).setURL; };
exports.useSetServerURL = useSetServerURL;
var useMultiuserEnabled = function () {
    var multiuserEnabled = (0, react_1.useContext)(ServerContext).multiuserEnabled;
    var loginMethod = (0, exports.useLoginMethod)();
    return multiuserEnabled && loginMethod === 'openid';
};
exports.useMultiuserEnabled = useMultiuserEnabled;
var useLoginMethod = function () {
    var _a, _b;
    var availableLoginMethods = (0, react_1.useContext)(ServerContext).availableLoginMethods;
    if (!availableLoginMethods || availableLoginMethods.length === 0) {
        return 'password';
    }
    return (_b = (_a = availableLoginMethods.filter(function (m) { return m.active; })[0]) === null || _a === void 0 ? void 0 : _a.method) !== null && _b !== void 0 ? _b : 'password';
};
exports.useLoginMethod = useLoginMethod;
var useAvailableLoginMethods = function () {
    return (0, react_1.useContext)(ServerContext).availableLoginMethods;
};
exports.useAvailableLoginMethods = useAvailableLoginMethods;
function getServerVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('get-server-version')];
                case 1:
                    result = _a.sent();
                    if ('version' in result) {
                        return [2 /*return*/, result.version];
                    }
                    return [2 /*return*/, ''];
            }
        });
    });
}
var useRefreshLoginMethods = function () {
    return (0, react_1.useContext)(ServerContext).refreshLoginMethods;
};
exports.useRefreshLoginMethods = useRefreshLoginMethods;
var useSetMultiuserEnabled = function () {
    return (0, react_1.useContext)(ServerContext).setMultiuserEnabled;
};
exports.useSetMultiuserEnabled = useSetMultiuserEnabled;
var useSetLoginMethods = function () {
    return (0, react_1.useContext)(ServerContext).setLoginMethods;
};
exports.useSetLoginMethods = useSetLoginMethods;
function ServerProvider(_a) {
    var _this = this;
    var children = _a.children;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(''), serverURL = _b[0], setServerURL = _b[1];
    var _c = (0, react_1.useState)(''), version = _c[0], setVersion = _c[1];
    var _d = (0, react_1.useState)(false), multiuserEnabled = _d[0], setMultiuserEnabled = _d[1];
    var _e = (0, react_1.useState)([]), availableLoginMethods = _e[0], setAvailableLoginMethods = _e[1];
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var serverURL, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, fetch_1.send)('get-server-url')];
                        case 1:
                            serverURL = _b.sent();
                            if (!serverURL) {
                                return [2 /*return*/];
                            }
                            setServerURL(serverURL);
                            _a = setVersion;
                            return [4 /*yield*/, getServerVersion()];
                        case 2:
                            _a.apply(void 0, [_b.sent()]);
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, []);
    var refreshLoginMethods = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!serverURL) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, fetch_1.send)('subscribe-get-login-methods')];
                case 1:
                    data = _b.sent();
                    if ('error' in data) {
                        dispatch((0, notificationsSlice_1.addNotification)({
                            notification: {
                                type: 'error',
                                title: (0, i18next_1.t)('Failed to refresh login methods'),
                                message: (_a = data.error) !== null && _a !== void 0 ? _a : (0, i18next_1.t)('Unknown'),
                            },
                        }));
                        setAvailableLoginMethods([]);
                    }
                    else if (data.methods) {
                        setAvailableLoginMethods(data.methods);
                    }
                    else {
                        setAvailableLoginMethods([]);
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [dispatch, serverURL]);
    (0, react_1.useEffect)(function () {
        if (serverURL) {
            (0, fetch_1.send)('subscribe-needs-bootstrap').then(function (data) {
                if ('hasServer' in data && data.hasServer) {
                    setAvailableLoginMethods(data.availableLoginMethods || []);
                    setMultiuserEnabled(data.multiuser || false);
                }
            });
        }
    }, [serverURL]);
    var setURL = (0, react_1.useCallback)(function (url_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([url_1], args_1, true), void 0, function (url, opts) {
            var error, serverURL_1, _a;
            if (opts === void 0) { opts = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('set-server-url', __assign(__assign({}, opts), { url: url }))];
                    case 1:
                        error = (_b.sent()).error;
                        if (!!error) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, fetch_1.send)('get-server-url')];
                    case 2:
                        serverURL_1 = _b.sent();
                        setServerURL(serverURL_1);
                        _a = setVersion;
                        return [4 /*yield*/, getServerVersion()];
                    case 3:
                        _a.apply(void 0, [_b.sent()]);
                        _b.label = 4;
                    case 4: return [2 /*return*/, { error: error }];
                }
            });
        });
    }, [setServerURL]);
    return (<ServerContext.Provider value={{
            url: serverURL,
            multiuserEnabled: multiuserEnabled,
            availableLoginMethods: availableLoginMethods,
            setURL: setURL,
            version: version ? "v".concat(version) : 'N/A',
            refreshLoginMethods: refreshLoginMethods,
            setMultiuserEnabled: setMultiuserEnabled,
            setLoginMethods: setAvailableLoginMethods,
        }}>
      {children}
    </ServerContext.Provider>);
}
