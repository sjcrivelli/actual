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
exports.FinancesApp = FinancesApp;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var undo = require("loot-core/platform/client/undo");
var UserAccessPage_1 = require("./admin/UserAccess/UserAccessPage");
var banksync_1 = require("./banksync");
var BankSyncStatus_1 = require("./BankSyncStatus");
var CommandBar_1 = require("./CommandBar");
var GlobalKeys_1 = require("./GlobalKeys");
var MobileNavTabs_1 = require("./mobile/MobileNavTabs");
var TransactionEdit_1 = require("./mobile/transactions/TransactionEdit");
var Notifications_1 = require("./Notifications");
var reports_1 = require("./reports");
var LoadingIndicator_1 = require("./reports/LoadingIndicator");
var responsive_1 = require("./responsive");
var wide_1 = require("./responsive/wide");
var ScrollProvider_1 = require("./ScrollProvider");
var ServerContext_1 = require("./ServerContext");
var settings_1 = require("./settings");
var sidebar_1 = require("./sidebar");
var ManageTagsPage_1 = require("./tags/ManageTagsPage");
var Titlebar_1 = require("./Titlebar");
var appSlice_1 = require("@desktop-client/app/appSlice");
var ProtectedRoute_1 = require("@desktop-client/auth/ProtectedRoute");
var types_1 = require("@desktop-client/auth/types");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useMetaThemeColor_1 = require("@desktop-client/hooks/useMetaThemeColor");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function NarrowNotSupported(_a) {
    var _b = _a.redirectTo, redirectTo = _b === void 0 ? '/budget' : _b, children = _a.children;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var navigate = (0, useNavigate_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        if (isNarrowWidth) {
            navigate(redirectTo);
        }
    }, [isNarrowWidth, navigate, redirectTo]);
    return isNarrowWidth ? null : children;
}
function WideNotSupported(_a) {
    var children = _a.children, _b = _a.redirectTo, redirectTo = _b === void 0 ? '/budget' : _b;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var navigate = (0, useNavigate_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        if (!isNarrowWidth) {
            navigate(redirectTo);
        }
    }, [isNarrowWidth, navigate, redirectTo]);
    return isNarrowWidth ? children : null;
}
function RouterBehaviors() {
    var location = (0, react_router_1.useLocation)();
    var href = (0, react_router_1.useHref)(location);
    (0, react_1.useEffect)(function () {
        undo.setUndoState('url', href);
    }, [href]);
    return null;
}
function FinancesApp() {
    var _this = this;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    (0, useMetaThemeColor_1.useMetaThemeColor)(isNarrowWidth ? theme_1.theme.mobileViewTheme : null);
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var accounts = (0, useAccounts_1.useAccounts)();
    var isAccountsLoaded = (0, redux_1.useSelector)(function (state) { return state.account.isAccountsLoaded; });
    var versionInfo = (0, redux_1.useSelector)(function (state) { return state.app.versionInfo; });
    var notifyWhenUpdateIsAvailable = (0, useGlobalPref_1.useGlobalPref)('notifyWhenUpdateIsAvailable')[0];
    var _a = (0, useLocalPref_1.useLocalPref)('flags.updateNotificationShownForVersion'), lastUsedVersion = _a[0], setLastUsedVersion = _a[1];
    var multiuserEnabled = (0, ServerContext_1.useMultiuserEnabled)();
    (0, react_1.useEffect)(function () {
        // Wait a little bit to make sure the sync button will get the
        // sync start event. This can be improved later.
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatch((0, appSlice_1.sync)())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 100);
    }, []);
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, global.Actual.waitForUpdateReadyForDownload()];
                        case 1:
                            _a.sent(); // This will only resolve when an update is ready
                            dispatch((0, notificationsSlice_1.addNotification)({
                                notification: {
                                    type: 'message',
                                    title: t('A new version of Actual is available!'),
                                    message: t('Click the button below to reload and apply the update.'),
                                    sticky: true,
                                    id: 'update-reload-notification',
                                    button: {
                                        title: t('Update now'),
                                        action: function () { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, global.Actual.applyAppUpdate()];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); },
                                    },
                                },
                            }));
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, []);
    (0, react_1.useEffect)(function () {
        dispatch((0, appSlice_1.getLatestAppVersion)());
    }, [dispatch]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (notifyWhenUpdateIsAvailable && versionInfo) {
            if (versionInfo.isOutdated &&
                lastUsedVersion !== versionInfo.latestVersion) {
                dispatch((0, notificationsSlice_1.addNotification)({
                    notification: {
                        type: 'message',
                        title: t('A new version of Actual is available!'),
                        message: ((_a = process.env.REACT_APP_IS_PIKAPODS) !== null && _a !== void 0 ? _a : '').toLowerCase() ===
                            'true'
                            ? t('A new version of Actual is available! Your Pikapods instance will be automatically updated in the next few days - no action needed.')
                            : t('Version {{latestVersion}} of Actual was recently released.', { latestVersion: versionInfo.latestVersion }),
                        sticky: true,
                        id: 'update-notification',
                        button: {
                            title: t('Open changelog'),
                            action: function () {
                                window.open('https://actualbudget.org/docs/releases');
                            },
                        },
                        onClose: function () {
                            setLastUsedVersion(versionInfo.latestVersion);
                        },
                    },
                }));
            }
        }
    }, [
        dispatch,
        lastUsedVersion,
        notifyWhenUpdateIsAvailable,
        setLastUsedVersion,
        t,
        versionInfo,
    ]);
    var scrollableRef = (0, react_1.useRef)(null);
    return (<view_1.View style={{ height: '100%' }}>
      <RouterBehaviors />
      <GlobalKeys_1.GlobalKeys />
      <CommandBar_1.CommandBar />
      <view_1.View style={{
            flexDirection: 'row',
            backgroundColor: theme_1.theme.pageBackground,
            flex: 1,
        }}>
        <sidebar_1.FloatableSidebar />

        <view_1.View style={{
            color: theme_1.theme.pageText,
            backgroundColor: theme_1.theme.pageBackground,
            flex: 1,
            overflow: 'hidden',
            width: '100%',
        }}>
          <ScrollProvider_1.ScrollProvider isDisabled={!isNarrowWidth} scrollableRef={scrollableRef}>
            <view_1.View ref={scrollableRef} style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative',
        }}>
              <Titlebar_1.Titlebar style={{
            WebkitAppRegion: 'drag',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
        }}/>
              <Notifications_1.Notifications />
              <BankSyncStatus_1.BankSyncStatus />

              <react_router_1.Routes>
                <react_router_1.Route path="/" element={isAccountsLoaded ? (accounts.length > 0 ? (<react_router_1.Navigate to="/budget" replace/>) : (
        // If there are no accounts, we want to redirect the user to
        // the All Accounts screen which will prompt them to add an account
        <react_router_1.Navigate to="/accounts" replace/>)) : (<LoadingIndicator_1.LoadingIndicator />)}/>

                <react_router_1.Route path="/reports/*" element={<reports_1.Reports />}/>

                <react_router_1.Route path="/budget" element={<responsive_1.NarrowAlternate name="Budget"/>}/>

                <react_router_1.Route path="/schedules" element={<NarrowNotSupported>
                      <responsive_1.WideComponent name="Schedules"/>
                    </NarrowNotSupported>}/>

                <react_router_1.Route path="/payees" element={<responsive_1.NarrowAlternate name="Payees"/>}/>
                <react_router_1.Route path="/rules" element={<responsive_1.NarrowAlternate name="Rules"/>}/>
                <react_router_1.Route path="/rules/:id" element={<responsive_1.NarrowAlternate name="RuleEdit"/>}/>
                <react_router_1.Route path="/bank-sync" element={<banksync_1.BankSync />}/>
                <react_router_1.Route path="/tags" element={<ManageTagsPage_1.ManageTagsPage />}/>
                <react_router_1.Route path="/settings" element={<settings_1.Settings />}/>

                <react_router_1.Route path="/gocardless/link" element={<NarrowNotSupported>
                      <responsive_1.WideComponent name="GoCardlessLink"/>
                    </NarrowNotSupported>}/>

                <react_router_1.Route path="/accounts" element={<responsive_1.NarrowAlternate name="Accounts"/>}/>

                <react_router_1.Route path="/accounts/:id" element={<responsive_1.NarrowAlternate name="Account"/>}/>

                <react_router_1.Route path="/transactions/:transactionId" element={<WideNotSupported>
                      <TransactionEdit_1.TransactionEdit />
                    </WideNotSupported>}/>

                <react_router_1.Route path="/categories/:id" element={<responsive_1.NarrowAlternate name="Category"/>}/>
                {multiuserEnabled && (<react_router_1.Route path="/user-directory" element={<ProtectedRoute_1.ProtectedRoute permission={types_1.Permissions.ADMINISTRATOR} element={<wide_1.UserDirectoryPage />}/>}/>)}
                {multiuserEnabled && (<react_router_1.Route path="/user-access" element={<ProtectedRoute_1.ProtectedRoute permission={types_1.Permissions.ADMINISTRATOR} validateOwner={true} element={<UserAccessPage_1.UserAccessPage />}/>}/>)}
                {/* redirect all other traffic to the budget page */}
                <react_router_1.Route path="/*" element={<react_router_1.Navigate to="/budget" replace/>}/>
              </react_router_1.Routes>
            </view_1.View>

            <react_router_1.Routes>
              <react_router_1.Route path="/budget" element={<MobileNavTabs_1.MobileNavTabs />}/>
              <react_router_1.Route path="/accounts" element={<MobileNavTabs_1.MobileNavTabs />}/>
              <react_router_1.Route path="/settings" element={<MobileNavTabs_1.MobileNavTabs />}/>
              <react_router_1.Route path="/reports" element={<MobileNavTabs_1.MobileNavTabs />}/>
              <react_router_1.Route path="/rules" element={<MobileNavTabs_1.MobileNavTabs />}/>
              <react_router_1.Route path="/payees" element={<MobileNavTabs_1.MobileNavTabs />}/>
              <react_router_1.Route path="*" element={null}/>
            </react_router_1.Routes>
          </ScrollProvider_1.ScrollProvider>
        </view_1.View>
      </view_1.View>
    </view_1.View>);
}
