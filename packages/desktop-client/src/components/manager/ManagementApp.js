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
exports.ManagementApp = ManagementApp;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var BudgetFileSelection_1 = require("./BudgetFileSelection");
var ConfigServer_1 = require("./ConfigServer");
var ServerURL_1 = require("./ServerURL");
var Bootstrap_1 = require("./subscribe/Bootstrap");
var ChangePassword_1 = require("./subscribe/ChangePassword");
var Error_1 = require("./subscribe/Error");
var Login_1 = require("./subscribe/Login");
var OpenIdCallback_1 = require("./subscribe/OpenIdCallback");
var WelcomeScreen_1 = require("./WelcomeScreen");
var appSlice_1 = require("@desktop-client/app/appSlice");
var ProtectedRoute_1 = require("@desktop-client/auth/ProtectedRoute");
var types_1 = require("@desktop-client/auth/types");
var UserDirectoryPage_1 = require("@desktop-client/components/admin/UserDirectory/UserDirectoryPage");
var AppBackground_1 = require("@desktop-client/components/AppBackground");
var LoggedInUser_1 = require("@desktop-client/components/LoggedInUser");
var Notifications_1 = require("@desktop-client/components/Notifications");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useMetaThemeColor_1 = require("@desktop-client/hooks/useMetaThemeColor");
var redux_1 = require("@desktop-client/redux");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
function Version() {
    var _a;
    var _b, _c;
    var version = (0, ServerContext_1.useServerVersion)();
    return (<text_1.Text style={_a = {
                color: theme_1.theme.pageTextSubdued,
                ':hover': { color: theme_1.theme.pageText },
                margin: 15,
                marginLeft: 17
            },
            _a["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginLeft: 15,
                marginRight: 17,
                zIndex: 5001,
            },
            _a}>
      <react_i18next_1.Trans>
        App: v{{ appVersion: (_c = (_b = window === null || window === void 0 ? void 0 : window.Actual) === null || _b === void 0 ? void 0 : _b.ACTUAL_VERSION) !== null && _c !== void 0 ? _c : "dev" }} | Server:{' '}
        {{ serverVersion: version }}
      </react_i18next_1.Trans>
    </text_1.Text>);
}
function ManagementApp() {
    /* DEV: force ConfigServer */
    return <ConfigServer_1.ConfigServer />;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    (0, useMetaThemeColor_1.useMetaThemeColor)(isNarrowWidth ? theme_1.theme.mobileConfigServerViewTheme : undefined);
    var files = (0, redux_1.useSelector)(function (state) { return state.budgetfiles.allFiles; });
    var isLoading = (0, redux_1.useSelector)(function (state) { return state.app.loadingText !== null; });
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    var managerHasInitialized = (0, redux_1.useSelector)(function (state) { return state.app.managerHasInitialized; });
    var dispatch = (0, redux_1.useDispatch)();
    // runs on mount only
    (0, react_1.useEffect)(function () {
        function fetchData() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dispatch((0, usersSlice_1.loggedIn)())];
                        case 1:
                            _a.sent();
                            dispatch((0, appSlice_1.setAppState)({ managerHasInitialized: true }));
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchData();
    }, [dispatch]);
    return (<view_1.View style={{ height: '100%', color: theme_1.theme.pageText }}>
      <AppBackground_1.AppBackground />
      <view_1.View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            WebkitAppRegion: 'drag',
        }}/>
      <view_1.View style={{
            position: 'absolute',
            bottom: 40,
            right: 15,
        }}>
        <Notifications_1.Notifications style={{
            position: 'relative',
            left: 'initial',
            right: 'initial',
        }}/>
      </view_1.View>

      {managerHasInitialized && !isLoading && (<view_1.View style={{
                alignItems: 'center',
                bottom: 0,
                justifyContent: 'center',
                left: 0,
                padding: 20,
                position: 'absolute',
                right: 0,
                top: 0,
            }}>
          {userData && files ? (<>
              <react_router_1.Routes>
                <react_router_1.Route path="/config-server" element={<ConfigServer_1.ConfigServer />}/>

                <react_router_1.Route path="/change-password" element={<ChangePassword_1.ChangePassword />}/>
                {files && files.length > 0 ? (<react_router_1.Route path="/" element={<BudgetFileSelection_1.BudgetFileSelection />}/>) : (<react_router_1.Route path="/" element={<WelcomeScreen_1.WelcomeScreen />}/>)}

                {multiuserEnabled && (<react_router_1.Route path="/user-directory" element={<ProtectedRoute_1.ProtectedRoute permission={types_1.Permissions.ADMINISTRATOR} element={<UserDirectoryPage_1.UserDirectoryPage bottomContent={<UserDirectoryPage_1.BackToFileListButton />}/>}/>}/>)}
                {/* Redirect all other pages to this route */}
                <react_router_1.Route path="/*" element={<react_router_1.Navigate to="/"/>}/>
              </react_router_1.Routes>

              <view_1.View style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '6px 10px',
                    zIndex: 4000,
                }}>
                <react_router_1.Routes>
                  <react_router_1.Route path="/config-server" element={null}/>
                  <react_router_1.Route path="/*" element={<LoggedInUser_1.LoggedInUser hideIfNoServer style={{ padding: '4px 7px' }}/>}/>
                </react_router_1.Routes>
              </view_1.View>
            </>) : (<react_router_1.Routes>
              <react_router_1.Route path="/login" element={<Login_1.Login />}/>
              <react_router_1.Route path="/openid-cb" element={<OpenIdCallback_1.OpenIdCallback />}/>
              <react_router_1.Route path="/error" element={<Error_1.Error />}/>
              <react_router_1.Route path="/config-server" element={<ConfigServer_1.ConfigServer />}/>
              <react_router_1.Route path="/bootstrap" element={<Bootstrap_1.Bootstrap />}/>
              {multiuserEnabled && (<react_router_1.Route path="/userdirectory" element={<ProtectedRoute_1.ProtectedRoute permission={types_1.Permissions.ADMINISTRATOR} element={<UserDirectoryPage_1.UserDirectoryPage />}/>}/>)}

              {/* Redirect all other pages to this route */}
              <react_router_1.Route path="/*" element={<react_router_1.Navigate to="/bootstrap" replace/>}/>
            </react_router_1.Routes>)}
        </view_1.View>)}

      <react_router_1.Routes>
        <react_router_1.Route path="/config-server" element={null}/>
        <react_router_1.Route path="/*" element={<ServerURL_1.ServerURL />}/>
      </react_router_1.Routes>
      <Version />
    </view_1.View>);
}
