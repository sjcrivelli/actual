import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Trans, useTranslation } from 'react-i18next';
import { Routes, Route, useLocation } from 'react-router';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgArrowLeft } from '@actual-app/components/icons/v1';
import { SvgAlertTriangle, SvgNavigationMenu, SvgViewHide, SvgViewShow, } from '@actual-app/components/icons/v2';
import { SpaceBetween } from '@actual-app/components/space-between';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { listen } from 'loot-core/platform/client/fetch';
import { isDevelopmentEnvironment } from 'loot-core/shared/environment';
import * as Platform from 'loot-core/shared/platform';
import { AccountSyncCheck } from './accounts/AccountSyncCheck';
import { AnimatedRefresh } from './AnimatedRefresh';
import { MonthCountSelector } from './budget/MonthCountSelector';
import { Link } from './common/Link';
import { HelpMenu } from './HelpMenu';
import { LoggedInUser } from './LoggedInUser';
import { useServerURL } from './ServerContext';
import { useSidebar } from './sidebar/SidebarProvider';
import { ThemeSelector } from './ThemeSelector';
import { sync } from '@desktop-client/app/appSlice';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useDispatch } from '@desktop-client/redux';
import * as bindings from '@desktop-client/spreadsheet/bindings';
function UncategorizedButton() {
    const count = useSheetValue(bindings.uncategorizedCount());
    if (count === null || count <= 0) {
        return null;
    }
    return (_jsx(Link, { variant: "button", buttonVariant: "bare", to: "/categories/uncategorized", style: {
            color: theme.errorText,
        }, children: _jsxs(Trans, { count: count, children: [{ count }, " uncategorized transactions"] }) }));
}
function PrivacyButton({ style }) {
    const { t } = useTranslation();
    const [isPrivacyEnabledPref, setPrivacyEnabledPref] = useSyncedPref('isPrivacyEnabled');
    const isPrivacyEnabled = String(isPrivacyEnabledPref) === 'true';
    const privacyIconStyle = { width: 15, height: 15 };
    useHotkeys('shift+ctrl+p, shift+cmd+p, shift+meta+p', () => {
        setPrivacyEnabledPref(String(!isPrivacyEnabled));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [setPrivacyEnabledPref, isPrivacyEnabled]);
    return (_jsx(Button, { variant: "bare", "aria-label": isPrivacyEnabled ? t('Disable privacy mode') : t('Enable privacy mode'), onPress: () => setPrivacyEnabledPref(String(!isPrivacyEnabled)), style: style, children: isPrivacyEnabled ? (_jsx(SvgViewHide, { style: privacyIconStyle })) : (_jsx(SvgViewShow, { style: privacyIconStyle })) }));
}
function SyncButton({ style, isMobile = false }) {
    const { t } = useTranslation();
    const [cloudFileId] = useMetadataPref('cloudFileId');
    const dispatch = useDispatch();
    const [syncing, setSyncing] = useState(false);
    const [syncState, setSyncState] = useState(null);
    useEffect(() => {
        const unlisten = listen('sync-event', event => {
            if (event.type === 'start') {
                setSyncing(true);
                setSyncState(null);
            }
            else {
                // Give the layout some time to apply the starting animation
                // so we always finish it correctly even if it's almost
                // instant
                setTimeout(() => {
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
    const mobileColor = syncState === 'error'
        ? theme.errorText
        : syncState === 'disabled' ||
            syncState === 'offline' ||
            syncState === 'local'
            ? theme.mobileHeaderTextSubdued
            : theme.mobileHeaderText;
    const desktopColor = syncState === 'error'
        ? theme.errorTextDark
        : syncState === 'disabled' ||
            syncState === 'offline' ||
            syncState === 'local'
            ? theme.tableTextLight
            : 'inherit';
    const activeStyle = isMobile
        ? {
            color: mobileColor,
        }
        : {};
    const hoveredStyle = isMobile
        ? {
            color: mobileColor,
            background: theme.mobileHeaderTextHover,
        }
        : {};
    const mobileIconStyle = {
        color: mobileColor,
        justifyContent: 'center',
        margin: 10,
        paddingLeft: 5,
        paddingRight: 3,
    };
    const mobileTextStyle = {
        ...styles.text,
        fontWeight: 500,
        marginLeft: 2,
        marginRight: 5,
    };
    const onSync = () => dispatch(sync());
    useHotkeys('ctrl+s, cmd+s, meta+s', onSync, {
        enableOnFormTags: true,
        preventDefault: true,
        scopes: ['app'],
    }, [onSync]);
    return (_jsxs(Button, { variant: "bare", "aria-label": t('Sync'), className: css({
            ...(isMobile
                ? {
                    ...style,
                    WebkitAppRegion: 'none',
                    ...mobileIconStyle,
                }
                : {
                    ...style,
                    WebkitAppRegion: 'none',
                    color: desktopColor,
                }),
            '&[data-hovered]': hoveredStyle,
            '&[data-pressed]': activeStyle,
        }), onPress: onSync, children: [isMobile ? (syncState === 'error' ? (_jsx(SvgAlertTriangle, { width: 14, height: 14 })) : (_jsx(AnimatedRefresh, { width: 18, height: 18, animating: syncing }))) : syncState === 'error' ? (_jsx(SvgAlertTriangle, { width: 13 })) : (_jsx(AnimatedRefresh, { animating: syncing })), _jsx(Text, { style: isMobile ? { ...mobileTextStyle } : { marginLeft: 3 }, children: syncState === 'disabled'
                    ? t('Disabled')
                    : syncState === 'offline'
                        ? t('Offline')
                        : t('Sync') })] }));
}
function BudgetTitlebar() {
    const [maxMonths, setMaxMonthsPref] = useGlobalPref('maxMonths');
    return (_jsx(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: _jsx(MonthCountSelector, { maxMonths: maxMonths || 1, onChange: value => setMaxMonthsPref(value) }) }));
}
export function Titlebar({ style }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const sidebar = useSidebar();
    const { isNarrowWidth } = useResponsive();
    const serverURL = useServerURL();
    const [floatingSidebar] = useGlobalPref('floatingSidebar');
    return isNarrowWidth ? null : (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 10px 0 15px',
            height: 36,
            pointerEvents: 'none',
            '& *': {
                pointerEvents: 'auto',
            },
            ...(!Platform.isBrowser && Platform.OS === 'mac' && floatingSidebar
                ? { paddingLeft: 80 }
                : {}),
            ...style,
        }, children: [(floatingSidebar || sidebar.alwaysFloats) && (_jsx(Button, { "aria-label": t('Sidebar menu'), variant: "bare", style: { marginRight: 8 }, onHoverStart: e => {
                    if (e.pointerType === 'mouse') {
                        sidebar.setHidden(false);
                    }
                }, onPress: e => {
                    if (e.pointerType !== 'mouse') {
                        sidebar.setHidden(!sidebar.hidden);
                    }
                }, children: _jsx(SvgNavigationMenu, { className: "menu", style: { width: 15, height: 15, color: theme.pageText, left: 0 } }) })), _jsxs(Routes, { children: [_jsx(Route, { path: "/accounts", element: location.state?.goBack ? (_jsxs(Button, { variant: "bare", onPress: () => navigate(-1), children: [_jsx(SvgArrowLeft, { width: 10, height: 10, style: { marginRight: 5, color: 'currentColor' } }), ' ', _jsx(Trans, { children: "Back" })] })) : null }), _jsx(Route, { path: "/accounts/:id", element: _jsx(AccountSyncCheck, {}) }), _jsx(Route, { path: "/budget", element: _jsx(BudgetTitlebar, {}) }), _jsx(Route, { path: "*", element: null })] }), _jsx(View, { style: { flex: 1 } }), _jsxs(SpaceBetween, { gap: 10, children: [_jsx(UncategorizedButton, {}), isDevelopmentEnvironment() && !Platform.isPlaywright && (_jsx(ThemeSelector, {})), _jsx(PrivacyButton, {}), serverURL ? _jsx(SyncButton, {}) : null, _jsx(LoggedInUser, {}), _jsx(HelpMenu, {})] })] }));
}
