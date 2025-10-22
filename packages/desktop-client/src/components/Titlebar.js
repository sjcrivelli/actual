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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Titlebar = Titlebar;
var react_1 = require("react");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var space_between_1 = require("@actual-app/components/space-between");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var fetch_1 = require("loot-core/platform/client/fetch");
var environment_1 = require("loot-core/shared/environment");
var Platform = require("loot-core/shared/platform");
var AccountSyncCheck_1 = require("./accounts/AccountSyncCheck");
var AnimatedRefresh_1 = require("./AnimatedRefresh");
var MonthCountSelector_1 = require("./budget/MonthCountSelector");
var Link_1 = require("./common/Link");
var HelpMenu_1 = require("./HelpMenu");
var LoggedInUser_1 = require("./LoggedInUser");
var ServerContext_1 = require("./ServerContext");
var SidebarProvider_1 = require("./sidebar/SidebarProvider");
var ThemeSelector_1 = require("./ThemeSelector");
var appSlice_1 = require("@desktop-client/app/appSlice");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var redux_1 = require("@desktop-client/redux");
var bindings = require("@desktop-client/spreadsheet/bindings");
function UncategorizedButton() {
    var count = (0, useSheetValue_1.useSheetValue)(bindings.uncategorizedCount());
    if (count === null || count <= 0) {
        return null;
    }
    return (<Link_1.Link variant="button" buttonVariant="bare" to="/categories/uncategorized" style={{
            color: theme_1.theme.errorText,
        }}>
      <react_i18next_1.Trans count={count}>{{ count: count }} uncategorized transactions</react_i18next_1.Trans>
    </Link_1.Link>);
}
function PrivacyButton(_a) {
    var style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useSyncedPref_1.useSyncedPref)('isPrivacyEnabled'), isPrivacyEnabledPref = _b[0], setPrivacyEnabledPref = _b[1];
    var isPrivacyEnabled = String(isPrivacyEnabledPref) === 'true';
    var privacyIconStyle = { width: 15, height: 15 };
    (0, react_hotkeys_hook_1.useHotkeys)('shift+ctrl+p, shift+cmd+p, shift+meta+p', function () {
        setPrivacyEnabledPref(String(!isPrivacyEnabled));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [setPrivacyEnabledPref, isPrivacyEnabled]);
    return (<button_1.Button variant="bare" aria-label={isPrivacyEnabled ? t('Disable privacy mode') : t('Enable privacy mode')} onPress={function () { return setPrivacyEnabledPref(String(!isPrivacyEnabled)); }} style={style}>
      {isPrivacyEnabled ? (<v2_1.SvgViewHide style={privacyIconStyle}/>) : (<v2_1.SvgViewShow style={privacyIconStyle}/>)}
    </button_1.Button>);
}
function SyncButton(_a) {
    var style = _a.style, _b = _a.isMobile, isMobile = _b === void 0 ? false : _b;
    var t = (0, react_i18next_1.useTranslation)().t;
    var cloudFileId = (0, useMetadataPref_1.useMetadataPref)('cloudFileId')[0];
    var dispatch = (0, redux_1.useDispatch)();
    var _c = (0, react_1.useState)(false), syncing = _c[0], setSyncing = _c[1];
    var _d = (0, react_1.useState)(null), syncState = _d[0], setSyncState = _d[1];
    (0, react_1.useEffect)(function () {
        var unlisten = (0, fetch_1.listen)('sync-event', function (event) {
            if (event.type === 'start') {
                setSyncing(true);
                setSyncState(null);
            }
            else {
                // Give the layout some time to apply the starting animation
                // so we always finish it correctly even if it's almost
                // instant
                setTimeout(function () {
                    setSyncing(false);
                }, 200);
            }
            if (event.type === 'error') {
                // Use the offline state if either there is a network error or
                // if this file isn't a "cloud file". You can't sync a local
                // file.
                if (event.subtype === 'network') {
                    setSyncState('offline');
                }
                else if (!cloudFileId) {
                    setSyncState('local');
                }
                else {
                    setSyncState('error');
                }
            }
            else if (event.type === 'success') {
                setSyncState(event.syncDisabled ? 'disabled' : null);
            }
        });
        return unlisten;
    }, [cloudFileId]);
    var mobileColor = syncState === 'error'
        ? theme_1.theme.errorText
        : syncState === 'disabled' ||
            syncState === 'offline' ||
            syncState === 'local'
            ? theme_1.theme.mobileHeaderTextSubdued
            : theme_1.theme.mobileHeaderText;
    var desktopColor = syncState === 'error'
        ? theme_1.theme.errorTextDark
        : syncState === 'disabled' ||
            syncState === 'offline' ||
            syncState === 'local'
            ? theme_1.theme.tableTextLight
            : 'inherit';
    var activeStyle = isMobile
        ? {
            color: mobileColor,
        }
        : {};
    var hoveredStyle = isMobile
        ? {
            color: mobileColor,
            background: theme_1.theme.mobileHeaderTextHover,
        }
        : {};
    var mobileIconStyle = {
        color: mobileColor,
        justifyContent: 'center',
        margin: 10,
        paddingLeft: 5,
        paddingRight: 3,
    };
    var mobileTextStyle = __assign(__assign({}, styles_1.styles.text), { fontWeight: 500, marginLeft: 2, marginRight: 5 });
    var onSync = function () { return dispatch((0, appSlice_1.sync)()); };
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+s, cmd+s, meta+s', onSync, {
        enableOnFormTags: true,
        preventDefault: true,
        scopes: ['app'],
    }, [onSync]);
    return (<button_1.Button variant="bare" aria-label={t('Sync')} className={(0, css_1.css)(__assign(__assign({}, (isMobile
            ? __assign(__assign(__assign({}, style), { WebkitAppRegion: 'none' }), mobileIconStyle) : __assign(__assign({}, style), { WebkitAppRegion: 'none', color: desktopColor }))), { '&[data-hovered]': hoveredStyle, '&[data-pressed]': activeStyle }))} onPress={onSync}>
      {isMobile ? (syncState === 'error' ? (<v2_1.SvgAlertTriangle width={14} height={14}/>) : (<AnimatedRefresh_1.AnimatedRefresh width={18} height={18} animating={syncing}/>)) : syncState === 'error' ? (<v2_1.SvgAlertTriangle width={13}/>) : (<AnimatedRefresh_1.AnimatedRefresh animating={syncing}/>)}
      <text_1.Text style={isMobile ? __assign({}, mobileTextStyle) : { marginLeft: 3 }}>
        {syncState === 'disabled'
            ? t('Disabled')
            : syncState === 'offline'
                ? t('Offline')
                : t('Sync')}
      </text_1.Text>
    </button_1.Button>);
}
function BudgetTitlebar() {
    var _a = (0, useGlobalPref_1.useGlobalPref)('maxMonths'), maxMonths = _a[0], setMaxMonthsPref = _a[1];
    return (<view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MonthCountSelector_1.MonthCountSelector maxMonths={maxMonths || 1} onChange={function (value) { return setMaxMonthsPref(value); }}/>
    </view_1.View>);
}
function Titlebar(_a) {
    var _b;
    var style = _a.style;
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    var sidebar = (0, SidebarProvider_1.useSidebar)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var serverURL = (0, ServerContext_1.useServerURL)();
    var floatingSidebar = (0, useGlobalPref_1.useGlobalPref)('floatingSidebar')[0];
    return isNarrowWidth ? null : (<view_1.View style={__assign(__assign({ flexDirection: 'row', alignItems: 'center', padding: '0 10px 0 15px', height: 36, pointerEvents: 'none', '& *': {
                pointerEvents: 'auto',
            } }, (!Platform.isBrowser && Platform.OS === 'mac' && floatingSidebar
            ? { paddingLeft: 80 }
            : {})), style)}>
      {(floatingSidebar || sidebar.alwaysFloats) && (<button_1.Button aria-label={t('Sidebar menu')} variant="bare" style={{ marginRight: 8 }} onHoverStart={function (e) {
                if (e.pointerType === 'mouse') {
                    sidebar.setHidden(false);
                }
            }} onPress={function (e) {
                if (e.pointerType !== 'mouse') {
                    sidebar.setHidden(!sidebar.hidden);
                }
            }}>
          <v2_1.SvgNavigationMenu className="menu" style={{ width: 15, height: 15, color: theme_1.theme.pageText, left: 0 }}/>
        </button_1.Button>)}

      <react_router_1.Routes>
        <react_router_1.Route path="/accounts" element={((_b = location.state) === null || _b === void 0 ? void 0 : _b.goBack) ? (<button_1.Button variant="bare" onPress={function () { return navigate(-1); }}>
                <v1_1.SvgArrowLeft width={10} height={10} style={{ marginRight: 5, color: 'currentColor' }}/>{' '}
                <react_i18next_1.Trans>Back</react_i18next_1.Trans>
              </button_1.Button>) : null}/>

        <react_router_1.Route path="/accounts/:id" element={<AccountSyncCheck_1.AccountSyncCheck />}/>

        <react_router_1.Route path="/budget" element={<BudgetTitlebar />}/>

        <react_router_1.Route path="*" element={null}/>
      </react_router_1.Routes>
      <view_1.View style={{ flex: 1 }}/>
      <space_between_1.SpaceBetween gap={10}>
        <UncategorizedButton />
        {(0, environment_1.isDevelopmentEnvironment)() && !Platform.isPlaywright && (<ThemeSelector_1.ThemeSelector />)}
        <PrivacyButton />
        {serverURL ? <SyncButton /> : null}
        <LoggedInUser_1.LoggedInUser />
        <HelpMenu_1.HelpMenu />
      </space_between_1.SpaceBetween>
    </view_1.View>);
}
