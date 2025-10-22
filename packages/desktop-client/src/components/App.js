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
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = App;
// @ts-strict-ignore
var react_1 = require("react");
var react_dnd_1 = require("react-dnd");
var react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
var react_error_boundary_1 = require("react-error-boundary");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var Platform = require("loot-core/shared/platform");
var AppBackground_1 = require("./AppBackground");
var BudgetMonthCountContext_1 = require("./budget/BudgetMonthCountContext");
var DevelopmentTopBar_1 = require("./DevelopmentTopBar");
var FatalError_1 = require("./FatalError");
var FinancesApp_1 = require("./FinancesApp");
var ManagementApp_1 = require("./manager/ManagementApp");
var Modals_1 = require("./Modals");
var SidebarProvider_1 = require("./sidebar/SidebarProvider");
var UpdateNotification_1 = require("./UpdateNotification");
var appSlice_1 = require("@desktop-client/app/appSlice");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var global_events_1 = require("@desktop-client/global-events");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useSpreadsheet_1 = require("@desktop-client/hooks/useSpreadsheet");
var i18n_1 = require("@desktop-client/i18n");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var polyfills_1 = require("@desktop-client/polyfills");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
var style_1 = require("@desktop-client/style");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
var router_tools_1 = require("@desktop-client/util/router-tools");
function AppInner() {
    var _this = this;
    var budgetId = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var t = (0, react_i18next_1.useTranslation)().t;
    var showErrorBoundary = (0, react_error_boundary_1.useErrorBoundary)().showBoundary;
    var dispatch = (0, redux_1.useDispatch)();
    var userData = (0, redux_1.useSelector)(function (state) { return state.user.data; });
    (0, react_1.useEffect)(function () {
        (0, i18n_1.setI18NextLanguage)(null);
    }, []);
    (0, react_1.useEffect)(function () {
        var maybeUpdate = function (cb) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!global.Actual.isUpdateReadyForDownload()) return [3 /*break*/, 2];
                        dispatch((0, appSlice_1.setAppState)({
                            loadingText: t('Downloading and applying update...'),
                        }));
                        return [4 /*yield*/, global.Actual.applyAppUpdate()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, cb === null || cb === void 0 ? void 0 : cb()];
                }
            });
        }); };
        function init() {
            return __awaiter(this, void 0, void 0, function () {
                var serverSocket, budgetId, files, remoteFile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, maybeUpdate(function () {
                                return global.Actual.getServerSocket();
                            })];
                        case 1:
                            serverSocket = _a.sent();
                            dispatch((0, appSlice_1.setAppState)({
                                loadingText: t('Initializing the connection to the local database...'),
                            }));
                            return [4 /*yield*/, (0, fetch_1.init)(serverSocket)];
                        case 2:
                            _a.sent();
                            // Load any global prefs
                            dispatch((0, appSlice_1.setAppState)({
                                loadingText: t('Loading global preferences...'),
                            }));
                            return [4 /*yield*/, dispatch((0, prefsSlice_1.loadGlobalPrefs)())];
                        case 3:
                            _a.sent();
                            // Open the last opened budget, if any
                            dispatch((0, appSlice_1.setAppState)({
                                loadingText: t('Opening last budget...'),
                            }));
                            return [4 /*yield*/, (0, fetch_1.send)('get-last-opened-backup')];
                        case 4:
                            budgetId = _a.sent();
                            if (!budgetId) return [3 /*break*/, 8];
                            return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.loadBudget)({ id: budgetId }))];
                        case 5:
                            _a.sent();
                            // Check to see if this file has been remotely deleted (but
                            // don't block on this in case they are offline or something)
                            dispatch((0, appSlice_1.setAppState)({
                                loadingText: t('Retrieving remote files...'),
                            }));
                            return [4 /*yield*/, (0, fetch_1.send)('get-remote-files')];
                        case 6:
                            files = _a.sent();
                            if (files) {
                                remoteFile = files.find(function (f) { return f.fileId === cloudFileId; });
                                if (remoteFile && remoteFile.deleted) {
                                    dispatch((0, budgetfilesSlice_1.closeBudget)());
                                }
                            }
                            return [4 /*yield*/, maybeUpdate()];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            });
        }
        function initAll() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // TEMP DEV BYPASS: skip local DB worker init for web dev
                        return [4 /*yield*/, (0, polyfills_1.installPolyfills)()];
                        case 1:
                            // TEMP DEV BYPASS: skip local DB worker init for web dev
                            _a.sent();
                            dispatch((0, appSlice_1.setAppState)({ loadingText: null }));
                            return [2 /*return*/];
                        case 2:
                            _a.sent();
                            dispatch((0, appSlice_1.setAppState)({ loadingText: null }));
                            return [2 /*return*/];
                    }
                });
            });
        }
        initAll().catch(showErrorBoundary);
        // Removed cloudFileId & t from dependencies to prevent hard crash when closing budget in Electron
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, showErrorBoundary]);
    (0, react_1.useEffect)(function () {
        if (userData === null || userData === void 0 ? void 0 : userData.tokenExpired) {
            dispatch((0, notificationsSlice_1.addNotification)({
                notification: {
                    type: 'error',
                    id: 'login-expired',
                    title: t('Login expired'),
                    sticky: true,
                    message: t('Login expired, please log in again.'),
                    button: {
                        title: t('Go to login'),
                        action: function () {
                            dispatch((0, usersSlice_1.signOut)());
                        },
                    },
                },
            }));
        }
    }, [dispatch, t, userData === null || userData === void 0 ? void 0 : userData.tokenExpired]);
    return budgetId ? <FinancesApp_1.FinancesApp /> : <ManagementApp_1.ManagementApp />;
}
function ErrorFallback(_a) {
    var error = _a.error;
    return (<>
      <AppBackground_1.AppBackground />
      <FatalError_1.FatalError error={error}/>
    </>);
}
function App() {
    var store = (0, redux_1.useStore)();
    (0, react_1.useEffect)(function () { return (0, global_events_1.handleGlobalEvents)(store); }, [store]);
    var _a = (0, react_1.useState)((0, style_1.hasHiddenScrollbars)()), hiddenScrollbars = _a[0], setHiddenScrollbars = _a[1];
    var dispatch = (0, redux_1.useDispatch)();
    (0, react_1.useEffect)(function () {
        function checkScrollbars() {
            if (hiddenScrollbars !== (0, style_1.hasHiddenScrollbars)()) {
                setHiddenScrollbars((0, style_1.hasHiddenScrollbars)());
            }
        }
        var isSyncing = false;
        function onVisibilityChange() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!isSyncing) return [3 /*break*/, 2];
                            console.debug('triggering sync because of visibility change');
                            isSyncing = true;
                            return [4 /*yield*/, dispatch((0, appSlice_1.sync)())];
                        case 1:
                            _a.sent();
                            isSyncing = false;
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }
        window.addEventListener('focus', checkScrollbars);
        window.addEventListener('visibilitychange', onVisibilityChange);
        return function () {
            window.removeEventListener('focus', checkScrollbars);
            window.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [dispatch, hiddenScrollbars]);
    var theme = (0, style_1.useTheme)()[0];
    return (<react_router_1.BrowserRouter>
      <router_tools_1.ExposeNavigate />
      <react_hotkeys_hook_1.HotkeysProvider initiallyActiveScopes={['app']}>
        <useSpreadsheet_1.SpreadsheetProvider>
          <SidebarProvider_1.SidebarProvider>
            <BudgetMonthCountContext_1.BudgetMonthCountProvider>
              <react_dnd_1.DndProvider backend={react_dnd_html5_backend_1.HTML5Backend}>
                <view_1.View data-theme={theme} style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
                  <view_1.View key={hiddenScrollbars ? 'hidden-scrollbars' : 'scrollbars'} style={__assign({ flexGrow: 1, overflow: 'hidden' }, styles_1.styles.lightScrollbar)}>
                    <react_error_boundary_1.ErrorBoundary FallbackComponent={ErrorFallback}>
                      {process.env.REACT_APP_REVIEW_ID &&
            !Platform.isPlaywright && <DevelopmentTopBar_1.DevelopmentTopBar />}
                      <AppInner />
                    </react_error_boundary_1.ErrorBoundary>
                    <style_1.ThemeStyle />
                    <react_error_boundary_1.ErrorBoundary FallbackComponent={FatalError_1.FatalError}>
                      <Modals_1.Modals />
                    </react_error_boundary_1.ErrorBoundary>
                    <UpdateNotification_1.UpdateNotification />
                  </view_1.View>
                </view_1.View>
              </react_dnd_1.DndProvider>
            </BudgetMonthCountContext_1.BudgetMonthCountProvider>
          </SidebarProvider_1.SidebarProvider>
        </useSpreadsheet_1.SpreadsheetProvider>
      </react_hotkeys_hook_1.HotkeysProvider>
    </react_router_1.BrowserRouter>);
}
