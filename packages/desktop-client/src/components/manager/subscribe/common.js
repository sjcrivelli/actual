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
exports.useBootstrapped = useBootstrapped;
exports.Title = Title;
// @ts-strict-ignore
var react_1 = require("react");
var react_router_1 = require("react-router");
var theme_1 = require("@actual-app/components/theme");
var fetch_1 = require("loot-core/platform/client/fetch");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
// There are two URLs that dance with each other: `/login` and
// `/bootstrap`. Both of these URLs check the state of the the server
// and make sure the user is looking at the right page. For example,
// it doesn't make sense to show the login page if the server doesn't
// have any accounts yet. It also doesn't make sense to show the
// bootstrap page if the server already has been set up with a
// password. Both pages will redirect to the other depending on state;
// they will also potentially redirect to other pages which do *not*
// do any checks.
function useBootstrapped(redirect) {
    if (redirect === void 0) { redirect = true; }
    var _a = (0, react_1.useState)(false), checked = _a[0], setChecked = _a[1];
    var navigate = (0, useNavigate_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    var setServerURL = (0, ServerContext_1.useSetServerURL)();
    var setMultiuserEnabled = (0, ServerContext_1.useSetMultiuserEnabled)();
    var setLoginMethods = (0, ServerContext_1.useSetLoginMethods)();
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var ensure, url, bootstrapped, serverURL, result, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ensure = function (url) {
                                if (location.pathname !== url) {
                                    if (redirect) {
                                        navigate(url);
                                    }
                                }
                                else {
                                    setChecked(true);
                                }
                            };
                            return [4 /*yield*/, (0, fetch_1.send)('get-server-url')];
                        case 1:
                            url = _a.sent();
                            return [4 /*yield*/, (0, fetch_1.send)('get-did-bootstrap')];
                        case 2:
                            bootstrapped = _a.sent();
                            if (!(url == null && !bootstrapped)) return [3 /*break*/, 5];
                            serverURL = window.location.origin;
                            return [4 /*yield*/, (0, fetch_1.send)('subscribe-needs-bootstrap', {
                                    url: serverURL,
                                })];
                        case 3:
                            result = _a.sent();
                            if ('error' in result || !result.hasServer) {
                                console.log('error' in result && result.error);
                                navigate('/config-server');
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, setServerURL(serverURL, { validate: false })];
                        case 4:
                            _a.sent();
                            setMultiuserEnabled(result.multiuser);
                            setLoginMethods(result.availableLoginMethods);
                            if (result.bootstrapped) {
                                ensure("/login");
                            }
                            else {
                                ensure('/bootstrap');
                            }
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, (0, fetch_1.send)('subscribe-needs-bootstrap')];
                        case 6:
                            result = _a.sent();
                            if ('error' in result) {
                                navigate('/error', { state: { error: result.error } });
                            }
                            else if (result.bootstrapped) {
                                ensure("/login");
                                if ('hasServer' in result && result.hasServer) {
                                    setMultiuserEnabled(result.multiuser);
                                    setLoginMethods(result.availableLoginMethods);
                                }
                            }
                            else {
                                ensure('/bootstrap');
                            }
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, [location]);
    return { checked: checked };
}
function Title(_a) {
    var text = _a.text;
    return (<h1 style={{
            fontSize: 40,
            fontWeight: 700,
            color: theme_1.theme.pageTextPositive,
            marginBottom: 20,
        }}>
      {text}
    </h1>);
}
