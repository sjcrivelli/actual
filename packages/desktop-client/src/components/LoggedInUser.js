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
exports.LoggedInUser = LoggedInUser;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var PrivacyFilter_1 = require("./PrivacyFilter");
var ServerContext_1 = require("./ServerContext");
var AuthProvider_1 = require("@desktop-client/auth/AuthProvider");
var types_1 = require("@desktop-client/auth/types");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function LoggedInUser(_a) {
    var _this = this;
    var hideIfNoServer = _a.hideIfNoServer, style = _a.style, color = _a.color;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var navigate = (0, useNavigate_1.useNavigate)();
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(false), menuOpen = _c[0], setMenuOpen = _c[1];
    var serverUrl = (0, ServerContext_1.useServerURL)();
    var triggerRef = (0, react_1.useRef)(null);
    var budgetId = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var location = (0, react_router_1.useLocation)();
    var hasPermission = (0, AuthProvider_1.useAuth)().hasPermission;
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var allFiles = (0, redux_1.useSelector)(function (state) { return state.budgetfiles.allFiles || []; });
    var remoteFiles = allFiles.filter(function (f) { return f.state === 'remote' || f.state === 'synced' || f.state === 'detached'; });
    var currentFile = remoteFiles.find(function (f) { return f.cloudFileId === cloudFileId; });
    var hasSyncedPrefs = (0, redux_1.useSelector)(function (state) { return state.prefs.synced; });
    var initializeUserData = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, dispatch((0, usersSlice_1.getUserData)())];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to initialize user data:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        initializeUserData();
    }, []);
    (0, react_1.useEffect)(function () {
        return (0, fetch_1.listen)('sync-event', function (_a) {
            var type = _a.type;
            if (type === 'start') {
                setLoading(true);
                return;
            }
            var shouldReinitialize = userData &&
                ((type === 'success' && userData.offline) ||
                    (type === 'error' && !userData.offline));
            if (shouldReinitialize) {
                initializeUserData();
            }
            else {
                setLoading(false);
            }
        });
    }, [userData]);
    function onCloseBudget() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.closeBudget)())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function onChangePassword() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, onCloseBudget()];
                    case 1:
                        _a.sent();
                        navigate('/change-password');
                        return [2 /*return*/];
                }
            });
        });
    }
    var handleMenuSelect = function (type) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setMenuOpen(false);
                    _a = type;
                    switch (_a) {
                        case 'change-password': return [3 /*break*/, 1];
                        case 'sign-in': return [3 /*break*/, 2];
                        case 'user-access': return [3 /*break*/, 4];
                        case 'user-directory': return [3 /*break*/, 5];
                        case 'index': return [3 /*break*/, 6];
                        case 'sign-out': return [3 /*break*/, 7];
                        case 'config-server': return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 1:
                    onChangePassword();
                    return [3 /*break*/, 11];
                case 2: return [4 /*yield*/, onCloseBudget()];
                case 3:
                    _b.sent();
                    navigate('/login');
                    return [3 /*break*/, 11];
                case 4:
                    navigate('/user-access');
                    return [3 /*break*/, 11];
                case 5:
                    navigate('/user-directory');
                    return [3 /*break*/, 11];
                case 6:
                    navigate('/');
                    return [3 /*break*/, 11];
                case 7:
                    dispatch((0, usersSlice_1.signOut)());
                    return [3 /*break*/, 11];
                case 8: return [4 /*yield*/, onCloseBudget()];
                case 9:
                    _b.sent();
                    navigate('/config-server');
                    return [3 /*break*/, 11];
                case 10: return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    function serverMessage() {
        if (!serverUrl) {
            return t('No server');
        }
        if (userData === null || userData === void 0 ? void 0 : userData.offline) {
            return t('Server offline');
        }
        return t('Server online');
    }
    if (hideIfNoServer && !serverUrl)
        return null;
    if (loading && serverUrl) {
        return (<text_1.Text style={__assign(__assign({ color: theme_1.theme.pageTextLight, fontStyle: 'italic' }, styles_1.styles.delayedFadeIn), style)}>
        <react_i18next_1.Trans>Connecting...</react_i18next_1.Trans>
      </text_1.Text>);
    }
    var getMenuItems = function () {
        var isAdmin = hasPermission(types_1.Permissions.ADMINISTRATOR);
        var baseMenu = [];
        if (serverUrl &&
            !(userData === null || userData === void 0 ? void 0 : userData.offline) &&
            (userData === null || userData === void 0 ? void 0 : userData.loginMethod) === 'password') {
            baseMenu.push({ name: 'change-password', text: t('Change password') });
        }
        if (serverUrl) {
            baseMenu.push({ name: 'sign-out', text: t('Sign out') });
        }
        baseMenu.push({
            name: 'config-server',
            text: serverUrl ? t('Change server URL') : t('Start using a server'),
        });
        var adminMenu = [];
        if (multiuserEnabled && isAdmin) {
            if (!budgetId && location.pathname !== '/') {
                adminMenu.push({ name: 'index', text: t('View file list') });
            }
            else if (serverUrl &&
                !(userData === null || userData === void 0 ? void 0 : userData.offline) &&
                location.pathname !== '/user-directory') {
                adminMenu.push({ name: 'user-directory', text: t('User Directory') });
            }
        }
        if (multiuserEnabled &&
            ((currentFile && userData && currentFile.owner === userData.userId) ||
                isAdmin) &&
            serverUrl &&
            !(userData === null || userData === void 0 ? void 0 : userData.offline) &&
            cloudFileId &&
            location.pathname !== '/user-access') {
            adminMenu.push({
                name: 'user-access',
                text: t('User Access Management'),
            });
        }
        if (adminMenu.length > 0) {
            adminMenu.push(menu_1.Menu.line);
        }
        return __spreadArray(__spreadArray([], adminMenu, true), baseMenu, true);
    };
    return (<view_1.View style={__assign({ flexDirection: 'row', alignItems: 'center' }, style)}>
      <button_1.Button ref={triggerRef} variant="bare" onPress={function () { return setMenuOpen(true); }} style={{ color: color || 'inherit' }}>
        {serverMessage()}
      </button_1.Button>
      {!loading &&
            multiuserEnabled &&
            userData &&
            (userData === null || userData === void 0 ? void 0 : userData.displayName) &&
            !hasSyncedPrefs && (<small>
            (
            <react_i18next_1.Trans>
              logged in as:{' '}
              <span>
                {{ userName: userData === null || userData === void 0 ? void 0 : userData.displayName }}
              </span>
            </react_i18next_1.Trans>
            )
          </small>)}
      {!loading &&
            multiuserEnabled &&
            userData &&
            (userData === null || userData === void 0 ? void 0 : userData.displayName) &&
            hasSyncedPrefs && (<small>
            (
            <react_i18next_1.Trans>
              logged in as:{' '}
              <span>
                <PrivacyFilter_1.PrivacyFilter>
                  {{ userName: userData === null || userData === void 0 ? void 0 : userData.displayName }}
                </PrivacyFilter_1.PrivacyFilter>
              </span>
            </react_i18next_1.Trans>
            )
          </small>)}

      <popover_1.Popover offset={8} triggerRef={triggerRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }}>
        <menu_1.Menu onMenuSelect={handleMenuSelect} items={getMenuItems().filter(Boolean)}/>
      </popover_1.Popover>
    </view_1.View>);
}
