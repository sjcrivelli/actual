import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, Navigate, useLocation, useHref } from 'react-router';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as undo from 'loot-core/platform/client/undo';
import { UserAccessPage } from './admin/UserAccess/UserAccessPage';
import { BankSync } from './banksync';
import { BankSyncStatus } from './BankSyncStatus';
import { CommandBar } from './CommandBar';
import { GlobalKeys } from './GlobalKeys';
import { MobileNavTabs } from './mobile/MobileNavTabs';
import { TransactionEdit } from './mobile/transactions/TransactionEdit';
import { Notifications } from './Notifications';
import { Reports } from './reports';
import { LoadingIndicator } from './reports/LoadingIndicator';
import { NarrowAlternate, WideComponent } from './responsive';
import { UserDirectoryPage } from './responsive/wide';
import { ScrollProvider } from './ScrollProvider';
import { useMultiuserEnabled } from './ServerContext';
import { Settings } from './settings';
import { FloatableSidebar } from './sidebar';
import { ManageTagsPage } from './tags/ManageTagsPage';
import { Titlebar } from './Titlebar';
import { getLatestAppVersion, sync } from '@desktop-client/app/appSlice';
import { ProtectedRoute } from '@desktop-client/auth/ProtectedRoute';
import { Permissions } from '@desktop-client/auth/types';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { useMetaThemeColor } from '@desktop-client/hooks/useMetaThemeColor';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
function NarrowNotSupported({ redirectTo = '/budget', children, }) {
    const { isNarrowWidth } = useResponsive();
    const navigate = useNavigate();
    useEffect(() => {
        if (isNarrowWidth) {
            navigate(redirectTo);
        }
    }, [isNarrowWidth, navigate, redirectTo]);
    return isNarrowWidth ? null : children;
}
function WideNotSupported({ children, redirectTo = '/budget' }) {
    const { isNarrowWidth } = useResponsive();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isNarrowWidth) {
            navigate(redirectTo);
        }
    }, [isNarrowWidth, navigate, redirectTo]);
    return isNarrowWidth ? children : null;
}
function RouterBehaviors() {
    const location = useLocation();
    const href = useHref(location);
    useEffect(() => {
        undo.setUndoState('url', href);
    }, [href]);
    return null;
}
export function FinancesApp() {
    const { isNarrowWidth } = useResponsive();
    useMetaThemeColor(isNarrowWidth ? theme.mobileViewTheme : null);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const accounts = useAccounts();
    const isAccountsLoaded = useSelector(state => state.account.isAccountsLoaded);
    const versionInfo = useSelector(state => state.app.versionInfo);
    const [notifyWhenUpdateIsAvailable] = useGlobalPref('notifyWhenUpdateIsAvailable');
    const [lastUsedVersion, setLastUsedVersion] = useLocalPref('flags.updateNotificationShownForVersion');
    const multiuserEnabled = useMultiuserEnabled();
    useEffect(() => {
        // Wait a little bit to make sure the sync button will get the
        // sync start event. This can be improved later.
        setTimeout(async () => {
            await dispatch(sync());
        }, 100);
    }, []);
    useEffect(() => {
        async function run() {
            await global.Actual.waitForUpdateReadyForDownload(); // This will only resolve when an update is ready
            dispatch(addNotification({
                notification: {
                    type: 'message',
                    title: t('A new version of Actual is available!'),
                    message: t('Click the button below to reload and apply the update.'),
                    sticky: true,
                    id: 'update-reload-notification',
                    button: {
                        title: t('Update now'),
                        action: async () => {
                            await global.Actual.applyAppUpdate();
                        },
                    },
                },
            }));
        }
        run();
    }, []);
    useEffect(() => {
        dispatch(getLatestAppVersion());
    }, [dispatch]);
    useEffect(() => {
        if (notifyWhenUpdateIsAvailable && versionInfo) {
            if (versionInfo.isOutdated &&
                lastUsedVersion !== versionInfo.latestVersion) {
                dispatch(addNotification({
                    notification: {
                        type: 'message',
                        title: t('A new version of Actual is available!'),
                        message: (process.env.REACT_APP_IS_PIKAPODS ?? '').toLowerCase() ===
                            'true'
                            ? t('A new version of Actual is available! Your Pikapods instance will be automatically updated in the next few days - no action needed.')
                            : t('Version {{latestVersion}} of Actual was recently released.', { latestVersion: versionInfo.latestVersion }),
                        sticky: true,
                        id: 'update-notification',
                        button: {
                            title: t('Open changelog'),
                            action: () => {
                                window.open('https://actualbudget.org/docs/releases');
                            },
                        },
                        onClose: () => {
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
    const scrollableRef = useRef(null);
    return (_jsxs(View, { style: { height: '100%' }, children: [_jsx(RouterBehaviors, {}), _jsx(GlobalKeys, {}), _jsx(CommandBar, {}), _jsxs(View, { style: {
                    flexDirection: 'row',
                    backgroundColor: theme.pageBackground,
                    flex: 1,
                }, children: [_jsx(FloatableSidebar, {}), _jsx(View, { style: {
                            color: theme.pageText,
                            backgroundColor: theme.pageBackground,
                            flex: 1,
                            overflow: 'hidden',
                            width: '100%',
                        }, children: _jsxs(ScrollProvider, { isDisabled: !isNarrowWidth, scrollableRef: scrollableRef, children: [_jsxs(View, { ref: scrollableRef, style: {
                                        flex: 1,
                                        overflow: 'auto',
                                        position: 'relative',
                                    }, children: [_jsx(Titlebar, { style: {
                                                WebkitAppRegion: 'drag',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                zIndex: 1000,
                                            } }), _jsx(Notifications, {}), _jsx(BankSyncStatus, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: isAccountsLoaded ? (accounts.length > 0 ? (_jsx(Navigate, { to: "/budget", replace: true })) : (
                                                    // If there are no accounts, we want to redirect the user to
                                                    // the All Accounts screen which will prompt them to add an account
                                                    _jsx(Navigate, { to: "/accounts", replace: true }))) : (_jsx(LoadingIndicator, {})) }), _jsx(Route, { path: "/reports/*", element: _jsx(Reports, {}) }), _jsx(Route, { path: "/budget", element: _jsx(NarrowAlternate, { name: "Budget" }) }), _jsx(Route, { path: "/schedules", element: _jsx(NarrowNotSupported, { children: _jsx(WideComponent, { name: "Schedules" }) }) }), _jsx(Route, { path: "/payees", element: _jsx(NarrowAlternate, { name: "Payees" }) }), _jsx(Route, { path: "/rules", element: _jsx(NarrowAlternate, { name: "Rules" }) }), _jsx(Route, { path: "/rules/:id", element: _jsx(NarrowAlternate, { name: "RuleEdit" }) }), _jsx(Route, { path: "/bank-sync", element: _jsx(BankSync, {}) }), _jsx(Route, { path: "/tags", element: _jsx(ManageTagsPage, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/gocardless/link", element: _jsx(NarrowNotSupported, { children: _jsx(WideComponent, { name: "GoCardlessLink" }) }) }), _jsx(Route, { path: "/accounts", element: _jsx(NarrowAlternate, { name: "Accounts" }) }), _jsx(Route, { path: "/accounts/:id", element: _jsx(NarrowAlternate, { name: "Account" }) }), _jsx(Route, { path: "/transactions/:transactionId", element: _jsx(WideNotSupported, { children: _jsx(TransactionEdit, {}) }) }), _jsx(Route, { path: "/categories/:id", element: _jsx(NarrowAlternate, { name: "Category" }) }), multiuserEnabled && (_jsx(Route, { path: "/user-directory", element: _jsx(ProtectedRoute, { permission: Permissions.ADMINISTRATOR, element: _jsx(UserDirectoryPage, {}) }) })), multiuserEnabled && (_jsx(Route, { path: "/user-access", element: _jsx(ProtectedRoute, { permission: Permissions.ADMINISTRATOR, validateOwner: true, element: _jsx(UserAccessPage, {}) }) })), _jsx(Route, { path: "/*", element: _jsx(Navigate, { to: "/budget", replace: true }) })] })] }), _jsxs(Routes, { children: [_jsx(Route, { path: "/budget", element: _jsx(MobileNavTabs, {}) }), _jsx(Route, { path: "/accounts", element: _jsx(MobileNavTabs, {}) }), _jsx(Route, { path: "/settings", element: _jsx(MobileNavTabs, {}) }), _jsx(Route, { path: "/reports", element: _jsx(MobileNavTabs, {}) }), _jsx(Route, { path: "/rules", element: _jsx(MobileNavTabs, {}) }), _jsx(Route, { path: "/payees", element: _jsx(MobileNavTabs, {}) }), _jsx(Route, { path: "*", element: null })] })] }) })] })] }));
}
