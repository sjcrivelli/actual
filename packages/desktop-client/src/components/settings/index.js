"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = Settings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var input_1 = require("@actual-app/components/input");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var fetch_1 = require("loot-core/platform/client/fetch");
var environment_1 = require("loot-core/shared/environment");
var AuthSettings_1 = require("./AuthSettings");
var Backups_1 = require("./Backups");
var BudgetTypeSettings_1 = require("./BudgetTypeSettings");
var Currency_1 = require("./Currency");
var Encryption_1 = require("./Encryption");
var Experimental_1 = require("./Experimental");
var Export_1 = require("./Export");
var Format_1 = require("./Format");
var LanguageSettings_1 = require("./LanguageSettings");
var RepairTransactions_1 = require("./RepairTransactions");
var Reset_1 = require("./Reset");
var Themes_1 = require("./Themes");
var UI_1 = require("./UI");
var appSlice_1 = require("@desktop-client/app/appSlice");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var forms_1 = require("@desktop-client/components/forms");
var MobileNavTabs_1 = require("@desktop-client/components/mobile/MobileNavTabs");
var Page_1 = require("@desktop-client/components/Page");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var redux_1 = require("@desktop-client/redux");
function About() {
    var _a;
    var _b;
    var version = (0, ServerContext_1.useServerVersion)();
    var versionInfo = (0, redux_1.useSelector)(function (state) { return state.app.versionInfo; });
    var _c = (0, useGlobalPref_1.useGlobalPref)('notifyWhenUpdateIsAvailable', function () {
        dispatch((0, appSlice_1.getLatestAppVersion)());
    }), notifyWhenUpdateIsAvailable = _c[0], setNotifyWhenUpdateIsAvailablePref = _c[1];
    var dispatch = (0, redux_1.useDispatch)();
    return (<UI_1.Setting>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Actual</strong> is a super fast privacy-focused app for
          managing your finances.
        </react_i18next_1.Trans>
      </text_1.Text>
      <view_1.View style={{
            flexDirection: 'column',
            gap: 10,
        }} className={(0, css_1.css)((_a = {},
            _a["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gridTemplateColumns: '50% 50%',
                columnGap: '2em',
                gridAutoFlow: 'column',
            },
            _a))} data-vrt-mask>
        <text_1.Text>
          <react_i18next_1.Trans>
            Client version: {{ version: "v".concat((_b = window.Actual) === null || _b === void 0 ? void 0 : _b.ACTUAL_VERSION) }}
          </react_i18next_1.Trans>
        </text_1.Text>
        <text_1.Text>
          <react_i18next_1.Trans>Server version: {{ version: version }}</react_i18next_1.Trans>
        </text_1.Text>

        {notifyWhenUpdateIsAvailable && (versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.isOutdated) ? (<Link_1.Link variant="external" to="https://actualbudget.org/docs/releases" linkColor="purple">
            <react_i18next_1.Trans>New version available: {versionInfo.latestVersion}</react_i18next_1.Trans>
          </Link_1.Link>) : (<text_1.Text style={{ color: theme_1.theme.noticeText, fontWeight: 600 }}>
            {notifyWhenUpdateIsAvailable ? (<react_i18next_1.Trans>You’re up to date!</react_i18next_1.Trans>) : null}
          </text_1.Text>)}
        <text_1.Text>
          <Link_1.Link variant="external" to="https://actualbudget.org/docs/releases" linkColor="purple">
            <react_i18next_1.Trans>Release Notes</react_i18next_1.Trans>
          </Link_1.Link>
        </text_1.Text>
      </view_1.View>
      <view_1.View>
        <text_1.Text style={{ display: 'flex' }}>
          <forms_1.Checkbox id="settings-notifyWhenUpdateIsAvailable" checked={notifyWhenUpdateIsAvailable} onChange={function (e) {
            return setNotifyWhenUpdateIsAvailablePref(e.currentTarget.checked);
        }}/>
          <label htmlFor="settings-notifyWhenUpdateIsAvailable">
            <react_i18next_1.Trans>Display a notification when updates are available</react_i18next_1.Trans>
          </label>
        </text_1.Text>
      </view_1.View>
    </UI_1.Setting>);
}
function IDName(_a) {
    var children = _a.children;
    return <text_1.Text style={{ fontWeight: 500 }}>{children}</text_1.Text>;
}
function AdvancedAbout() {
    var budgetId = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    var groupId = (0, useMetadataPref_1.useMetadataPref)('groupId')[0];
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<UI_1.Setting>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>IDs</strong> are the names Actual uses to identify your budget
          internally. There are several different IDs associated with your
          budget. The Budget ID is used to identify your budget file. The Sync
          ID is used to access the budget on the server.
        </react_i18next_1.Trans>
      </text_1.Text>
      <text_1.Text>
        <react_i18next_1.Trans>
          <IDName>Budget ID:</IDName> {{ budgetId: budgetId }}
        </react_i18next_1.Trans>
      </text_1.Text>
      <text_1.Text style={{ color: theme_1.theme.pageText }}>
        <react_i18next_1.Trans>
          <IDName>Sync ID:</IDName> {{ syncId: groupId || t('(none)') }}
        </react_i18next_1.Trans>
      </text_1.Text>
      {/* low priority todo: eliminate some or all of these, or decide when/if to show them */}
      {/* <Text>
          <IDName>Cloud File ID:</IDName> {prefs.cloudFileId || t('(none)')}
        </Text>
        <Text>
          <IDName>User ID:</IDName> {prefs.userId || t('(none)')}
        </Text> */}
    </UI_1.Setting>);
}
function Settings() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var floatingSidebar = (0, useGlobalPref_1.useGlobalPref)('floatingSidebar')[0];
    var budgetName = (0, useMetadataPref_1.useMetadataPref)('budgetName')[0];
    var dispatch = (0, redux_1.useDispatch)();
    var isCurrencyExperimentalEnabled = (0, useFeatureFlag_1.useFeatureFlag)('currency');
    var _a = (0, useSyncedPref_1.useSyncedPref)('defaultCurrencyCode'), _ = _a[0], setDefaultCurrencyCodePref = _a[1];
    var onCloseBudget = function () {
        dispatch((0, budgetfilesSlice_1.closeBudget)());
    };
    (0, react_1.useEffect)(function () {
        var unlisten = (0, fetch_1.listen)('prefs-updated', function () {
            dispatch((0, prefsSlice_1.loadPrefs)());
        });
        dispatch((0, prefsSlice_1.loadPrefs)());
        return function () { return unlisten(); };
    }, [dispatch]);
    (0, react_1.useEffect)(function () {
        if (!isCurrencyExperimentalEnabled) {
            setDefaultCurrencyCodePref('');
        }
    }, [isCurrencyExperimentalEnabled, setDefaultCurrencyCodePref]);
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    return (<Page_1.Page header={t('Settings')} style={{
            marginInline: floatingSidebar && !isNarrowWidth ? 'auto' : 0,
        }}>
      <view_1.View data-testid="settings" style={{
            marginTop: 10,
            flexShrink: 0,
            maxWidth: 530,
            gap: 30,
            paddingBottom: MobileNavTabs_1.MOBILE_NAV_HEIGHT,
        }}>
        {isNarrowWidth && (<view_1.View style={{ gap: 10, flexDirection: 'row', alignItems: 'flex-end' }}>
            {/* The only spot to close a budget on mobile */}
            <forms_1.FormField>
              <forms_1.FormLabel title={t('Budget name')}/>
              <input_1.Input value={budgetName} disabled style={{ color: theme_1.theme.buttonNormalDisabledText }}/>
            </forms_1.FormField>
            <button_1.Button onPress={onCloseBudget}>
              <react_i18next_1.Trans>Switch file</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>)}
        <About />
        <Themes_1.ThemeSettings />
        <Format_1.FormatSettings />
        {isCurrencyExperimentalEnabled && <Currency_1.CurrencySettings />}
        <LanguageSettings_1.LanguageSettings />
        <AuthSettings_1.AuthSettings />
        <Encryption_1.EncryptionSettings />
        <BudgetTypeSettings_1.BudgetTypeSettings />
        {(0, environment_1.isElectron)() && <Backups_1.Backups />}
        <Export_1.ExportBudget />
        <UI_1.AdvancedToggle>
          <AdvancedAbout />
          <Reset_1.ResetCache />
          <Reset_1.ResetSync />
          <RepairTransactions_1.RepairTransactions />
          <Experimental_1.ExperimentalFeatures />
        </UI_1.AdvancedToggle>
      </view_1.View>
    </Page_1.Page>);
}
