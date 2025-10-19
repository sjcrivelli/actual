import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { tokens } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';
import { BudgetFileSelection } from './BudgetFileSelection';
import { ConfigServer } from './ConfigServer';
import { ServerURL } from './ServerURL';
import { Bootstrap } from './subscribe/Bootstrap';
import { ChangePassword } from './subscribe/ChangePassword';
import { Error } from './subscribe/Error';
import { Login } from './subscribe/Login';
import { OpenIdCallback } from './subscribe/OpenIdCallback';
import { WelcomeScreen } from './WelcomeScreen';
import { setAppState } from '@desktop-client/app/appSlice';
import { ProtectedRoute } from '@desktop-client/auth/ProtectedRoute';
import { Permissions } from '@desktop-client/auth/types';
import { BackToFileListButton, UserDirectoryPage, } from '@desktop-client/components/admin/UserDirectory/UserDirectoryPage';
import { AppBackground } from '@desktop-client/components/AppBackground';
import { LoggedInUser } from '@desktop-client/components/LoggedInUser';
import { Notifications } from '@desktop-client/components/Notifications';
import { useMultiuserEnabled, useServerVersion, } from '@desktop-client/components/ServerContext';
import { useMetaThemeColor } from '@desktop-client/hooks/useMetaThemeColor';
import { useSelector, useDispatch } from '@desktop-client/redux';
import { loggedIn } from '@desktop-client/users/usersSlice';
function Version() {
    const version = useServerVersion();
    return (_jsx(Text, { style: {
            color: theme.pageTextSubdued,
            ':hover': { color: theme.pageText },
            margin: 15,
            marginLeft: 17,
            [`@media (min-width: ${tokens.breakpoint_small})`]: {
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginLeft: 15,
                marginRight: 17,
                zIndex: 5001,
            },
        }, children: _jsxs(Trans, { children: ["App: v", { appVersion: window?.Actual?.ACTUAL_VERSION ?? "dev" }, " | Server:", ' ', { serverVersion: version }] }) }));
}
export function ManagementApp() {
    /* DEV: force ConfigServer */
    return _jsx(ConfigServer, {});
    const { isNarrowWidth } = useResponsive();
    useMetaThemeColor(isNarrowWidth ? theme.mobileConfigServerViewTheme : undefined);
    const files = useSelector(state => state.budgetfiles.allFiles);
    const isLoading = useSelector(state => state.app.loadingText !== null);
    const userData = useSelector(state => state.user.data);
    const multiuserEnabled = useMultiuserEnabled();
    const managerHasInitialized = useSelector(state => state.app.managerHasInitialized);
    const dispatch = useDispatch();
    // runs on mount only
    useEffect(() => {
        async function fetchData() {
            await dispatch(loggedIn());
            dispatch(setAppState({ managerHasInitialized: true }));
        }
        fetchData();
    }, [dispatch]);
    return (_jsxs(View, { style: { height: '100%', color: theme.pageText }, children: [_jsx(AppBackground, {}), _jsx(View, { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 40,
                    WebkitAppRegion: 'drag',
                } }), _jsx(View, { style: {
                    position: 'absolute',
                    bottom: 40,
                    right: 15,
                }, children: _jsx(Notifications, { style: {
                        position: 'relative',
                        left: 'initial',
                        right: 'initial',
                    } }) }), managerHasInitialized && !isLoading && (_jsx(View, { style: {
                    alignItems: 'center',
                    bottom: 0,
                    justifyContent: 'center',
                    left: 0,
                    padding: 20,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                }, children: userData && files ? (_jsxs(_Fragment, { children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/config-server", element: _jsx(ConfigServer, {}) }), _jsx(Route, { path: "/change-password", element: _jsx(ChangePassword, {}) }), files && files.length > 0 ? (_jsx(Route, { path: "/", element: _jsx(BudgetFileSelection, {}) })) : (_jsx(Route, { path: "/", element: _jsx(WelcomeScreen, {}) })), multiuserEnabled && (_jsx(Route, { path: "/user-directory", element: _jsx(ProtectedRoute, { permission: Permissions.ADMINISTRATOR, element: _jsx(UserDirectoryPage, { bottomContent: _jsx(BackToFileListButton, {}) }) }) })), _jsx(Route, { path: "/*", element: _jsx(Navigate, { to: "/" }) })] }), _jsx(View, { style: {
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                padding: '6px 10px',
                                zIndex: 4000,
                            }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/config-server", element: null }), _jsx(Route, { path: "/*", element: _jsx(LoggedInUser, { hideIfNoServer: true, style: { padding: '4px 7px' } }) })] }) })] })) : (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/openid-cb", element: _jsx(OpenIdCallback, {}) }), _jsx(Route, { path: "/error", element: _jsx(Error, {}) }), _jsx(Route, { path: "/config-server", element: _jsx(ConfigServer, {}) }), _jsx(Route, { path: "/bootstrap", element: _jsx(Bootstrap, {}) }), multiuserEnabled && (_jsx(Route, { path: "/userdirectory", element: _jsx(ProtectedRoute, { permission: Permissions.ADMINISTRATOR, element: _jsx(UserDirectoryPage, {}) }) })), _jsx(Route, { path: "/*", element: _jsx(Navigate, { to: "/bootstrap", replace: true }) })] })) })), _jsxs(Routes, { children: [_jsx(Route, { path: "/config-server", element: null }), _jsx(Route, { path: "/*", element: _jsx(ServerURL, {}) })] }), _jsx(Version, {})] }));
}
