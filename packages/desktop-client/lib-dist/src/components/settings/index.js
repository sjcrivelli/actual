import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Input } from '@actual-app/components/input';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { tokens } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { listen } from 'loot-core/platform/client/fetch';
import { isElectron } from 'loot-core/shared/environment';
import { AuthSettings } from './AuthSettings';
import { Backups } from './Backups';
import { BudgetTypeSettings } from './BudgetTypeSettings';
import { CurrencySettings } from './Currency';
import { EncryptionSettings } from './Encryption';
import { ExperimentalFeatures } from './Experimental';
import { ExportBudget } from './Export';
import { FormatSettings } from './Format';
import { LanguageSettings } from './LanguageSettings';
import { RepairTransactions } from './RepairTransactions';
import { ResetCache, ResetSync } from './Reset';
import { ThemeSettings } from './Themes';
import { AdvancedToggle, Setting } from './UI';
import { getLatestAppVersion } from '@desktop-client/app/appSlice';
import { closeBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Link } from '@desktop-client/components/common/Link';
import { Checkbox, FormField, FormLabel, } from '@desktop-client/components/forms';
import { MOBILE_NAV_HEIGHT } from '@desktop-client/components/mobile/MobileNavTabs';
import { Page } from '@desktop-client/components/Page';
import { useServerVersion } from '@desktop-client/components/ServerContext';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { loadPrefs } from '@desktop-client/prefs/prefsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
function About() {
    const version = useServerVersion();
    const versionInfo = useSelector(state => state.app.versionInfo);
    const [notifyWhenUpdateIsAvailable, setNotifyWhenUpdateIsAvailablePref] = useGlobalPref('notifyWhenUpdateIsAvailable', () => {
        dispatch(getLatestAppVersion());
    });
    const dispatch = useDispatch();
    return (_jsxs(Setting, { children: [_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Actual" }), " is a super fast privacy-focused app for managing your finances."] }) }), _jsxs(View, { style: {
                    flexDirection: 'column',
                    gap: 10,
                }, className: css({
                    [`@media (min-width: ${tokens.breakpoint_small})`]: {
                        display: 'grid',
                        gridTemplateRows: '1fr 1fr',
                        gridTemplateColumns: '50% 50%',
                        columnGap: '2em',
                        gridAutoFlow: 'column',
                    },
                }), "data-vrt-mask": true, children: [_jsx(Text, { children: _jsxs(Trans, { children: ["Client version: ", { version: `v${window.Actual?.ACTUAL_VERSION}` }] }) }), _jsx(Text, { children: _jsxs(Trans, { children: ["Server version: ", { version }] }) }), notifyWhenUpdateIsAvailable && versionInfo?.isOutdated ? (_jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/releases", linkColor: "purple", children: _jsxs(Trans, { children: ["New version available: ", versionInfo.latestVersion] }) })) : (_jsx(Text, { style: { color: theme.noticeText, fontWeight: 600 }, children: notifyWhenUpdateIsAvailable ? (_jsx(Trans, { children: "You\u2019re up to date!" })) : null })), _jsx(Text, { children: _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/releases", linkColor: "purple", children: _jsx(Trans, { children: "Release Notes" }) }) })] }), _jsx(View, { children: _jsxs(Text, { style: { display: 'flex' }, children: [_jsx(Checkbox, { id: "settings-notifyWhenUpdateIsAvailable", checked: notifyWhenUpdateIsAvailable, onChange: e => setNotifyWhenUpdateIsAvailablePref(e.currentTarget.checked) }), _jsx("label", { htmlFor: "settings-notifyWhenUpdateIsAvailable", children: _jsx(Trans, { children: "Display a notification when updates are available" }) })] }) })] }));
}
function IDName({ children }) {
    return _jsx(Text, { style: { fontWeight: 500 }, children: children });
}
function AdvancedAbout() {
    const [budgetId] = useMetadataPref('id');
    const [groupId] = useMetadataPref('groupId');
    const { t } = useTranslation();
    return (_jsxs(Setting, { children: [_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "IDs" }), " are the names Actual uses to identify your budget internally. There are several different IDs associated with your budget. The Budget ID is used to identify your budget file. The Sync ID is used to access the budget on the server."] }) }), _jsx(Text, { children: _jsxs(Trans, { children: [_jsx(IDName, { children: "Budget ID:" }), " ", { budgetId }] }) }), _jsx(Text, { style: { color: theme.pageText }, children: _jsxs(Trans, { children: [_jsx(IDName, { children: "Sync ID:" }), " ", { syncId: groupId || t('(none)') }] }) })] }));
}
export function Settings() {
    const { t } = useTranslation();
    const [floatingSidebar] = useGlobalPref('floatingSidebar');
    const [budgetName] = useMetadataPref('budgetName');
    const dispatch = useDispatch();
    const isCurrencyExperimentalEnabled = useFeatureFlag('currency');
    const [_, setDefaultCurrencyCodePref] = useSyncedPref('defaultCurrencyCode');
    const onCloseBudget = () => {
        dispatch(closeBudget());
    };
    useEffect(() => {
        const unlisten = listen('prefs-updated', () => {
            dispatch(loadPrefs());
        });
        dispatch(loadPrefs());
        return () => unlisten();
    }, [dispatch]);
    useEffect(() => {
        if (!isCurrencyExperimentalEnabled) {
            setDefaultCurrencyCodePref('');
        }
    }, [isCurrencyExperimentalEnabled, setDefaultCurrencyCodePref]);
    const { isNarrowWidth } = useResponsive();
    return (_jsx(Page, { header: t('Settings'), style: {
            marginInline: floatingSidebar && !isNarrowWidth ? 'auto' : 0,
        }, children: _jsxs(View, { "data-testid": "settings", style: {
                marginTop: 10,
                flexShrink: 0,
                maxWidth: 530,
                gap: 30,
                paddingBottom: MOBILE_NAV_HEIGHT,
            }, children: [isNarrowWidth && (_jsxs(View, { style: { gap: 10, flexDirection: 'row', alignItems: 'flex-end' }, children: [_jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Budget name') }), _jsx(Input, { value: budgetName, disabled: true, style: { color: theme.buttonNormalDisabledText } })] }), _jsx(Button, { onPress: onCloseBudget, children: _jsx(Trans, { children: "Switch file" }) })] })), _jsx(About, {}), _jsx(ThemeSettings, {}), _jsx(FormatSettings, {}), isCurrencyExperimentalEnabled && _jsx(CurrencySettings, {}), _jsx(LanguageSettings, {}), _jsx(AuthSettings, {}), _jsx(EncryptionSettings, {}), _jsx(BudgetTypeSettings, {}), isElectron() && _jsx(Backups, {}), _jsx(ExportBudget, {}), _jsxs(AdvancedToggle, { children: [_jsx(AdvancedAbout, {}), _jsx(ResetCache, {}), _jsx(ResetSync, {}), _jsx(RepairTransactions, {}), _jsx(ExperimentalFeatures, {})] })] }) }));
}
