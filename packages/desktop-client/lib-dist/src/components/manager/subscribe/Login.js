import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { SvgCheveronDown } from '@actual-app/components/icons/v1';
import { BigInput, ResponsiveInput } from '@actual-app/components/input';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { isElectron } from 'loot-core/shared/environment';
import { useBootstrapped, Title } from './common';
import { OpenIdForm } from './OpenIdForm';
import { Link } from '@desktop-client/components/common/Link';
import { useAvailableLoginMethods, useLoginMethod, } from '@desktop-client/components/ServerContext';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useDispatch } from '@desktop-client/redux';
import { warningBackground } from '@desktop-client/style/themes/dark';
import { loggedIn } from '@desktop-client/users/usersSlice';
function PasswordLogin({ setError, dispatch }) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    async function onSubmitPassword() {
        if (password === '' || loading) {
            return;
        }
        setError(null);
        setLoading(true);
        const { error } = await send('subscribe-sign-in', {
            password,
            loginMethod: 'password',
        });
        setLoading(false);
        if (error) {
            setError(error);
        }
        else {
            dispatch(loggedIn());
        }
    }
    return (_jsxs(View, { style: {
            flexDirection: isNarrowWidth ? 'column' : 'row',
            marginTop: 5,
            gap: '1rem',
        }, children: [_jsx(BigInput, { autoFocus: true, placeholder: t('Password'), type: "password", onChangeValue: setPassword, style: { flex: 1 }, onEnter: onSubmitPassword }), _jsx(ButtonWithLoading, { variant: "primary", isLoading: loading, style: {
                    fontSize: 15,
                    width: isNarrowWidth ? '100%' : 170,
                    ...(isNarrowWidth ? { padding: 10 } : null),
                }, onPress: onSubmitPassword, children: _jsx(Trans, { children: "Sign in" }) })] }));
}
function OpenIdLogin({ setError }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const [warnMasterCreation, setWarnMasterCreation] = useState(false);
    const loginMethods = useAvailableLoginMethods();
    const [askForPassword, setAskForPassword] = useState(false);
    const [reviewOpenIdConfiguration, setReviewOpenIdConfiguration] = useState(false);
    const navigate = useNavigate();
    const [openIdConfig, setOpenIdConfig] = useState(null);
    const [firstLoginPassword, setFirstLoginPassword] = useState('');
    async function onSetOpenId(config) {
        setError(null);
        const { error } = await send('subscribe-bootstrap', { openId: config });
        if (error) {
            setError(error);
        }
        else {
            navigate('/');
        }
    }
    useEffect(() => {
        send('owner-created').then(created => setWarnMasterCreation(!created));
    }, []);
    useEffect(() => {
        if (loginMethods.some(method => method.method === 'password')) {
            setAskForPassword(true);
        }
        else {
            setAskForPassword(false);
        }
    }, [loginMethods]);
    async function onSubmitOpenId() {
        const { error, redirectUrl } = await send('subscribe-sign-in', {
            returnUrl: isElectron()
                ? await window.Actual.startOAuthServer()
                : window.location.origin,
            loginMethod: 'openid',
            password: firstLoginPassword,
        });
        if (error) {
            setError(error);
        }
        else {
            if (isElectron()) {
                window.Actual?.openURLInBrowser(redirectUrl);
            }
            else {
                window.location.href = redirectUrl;
            }
        }
    }
    return (_jsxs(View, { children: [!reviewOpenIdConfiguration && (_jsxs(_Fragment, { children: [_jsxs(View, { style: {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: 5,
                            gap: '1rem',
                        }, children: [warnMasterCreation && askForPassword && (_jsx(ResponsiveInput, { autoFocus: true, placeholder: t('Enter server password'), type: "password", onChangeValue: newValue => {
                                    setFirstLoginPassword(newValue);
                                }, style: { flex: 1 } })), _jsx(Button, { variant: "primary", onPress: onSubmitOpenId, style: warningBackground && {
                                    padding: 6,
                                    fontSize: 14,
                                    width: 170,
                                }, isDisabled: firstLoginPassword === '' &&
                                    askForPassword &&
                                    warnMasterCreation, children: warnMasterCreation ? (_jsx(Trans, { children: "Start using OpenID" })) : (_jsx(Trans, { children: "Sign in with OpenID" })) })] }), warnMasterCreation && (_jsxs(_Fragment, { children: [_jsx("label", { style: { color: theme.warningText, marginTop: 10 }, children: _jsxs(Trans, { children: ["The first user to login with OpenID will be the", ' ', _jsx(Text, { style: { fontWeight: 'bold' }, children: "server owner" }), ". This can't be changed using UI."] }) }), askForPassword && (_jsx(Button, { variant: "bare", isDisabled: firstLoginPassword === '' && warnMasterCreation, onPress: () => {
                                    send('get-openid-config', {
                                        password: firstLoginPassword,
                                    }).then(config => {
                                        if ('error' in config) {
                                            setError(config.error);
                                        }
                                        else if ('openId' in config) {
                                            setError(null);
                                            setOpenIdConfig(config.openId);
                                            setReviewOpenIdConfiguration(true);
                                        }
                                    });
                                }, style: {
                                    marginTop: 5,
                                    ...(isNarrowWidth ? { padding: 10 } : null),
                                }, children: _jsx(Trans, { children: "Review OpenID configuration" }) }))] }))] })), reviewOpenIdConfiguration && (_jsxs(View, { style: { marginTop: 20 }, children: [_jsx(Text, { style: {
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                            fontWeight: 'bold ',
                            width: '100%',
                            textAlign: 'center',
                        }, children: _jsx(Trans, { children: "Review OpenID configuration" }) }), _jsx(OpenIdForm, { openIdData: openIdConfig, otherButtons: [
                            _jsx(Button, { variant: "bare", style: {
                                    marginRight: 10,
                                    ...(isNarrowWidth && { padding: 10 }),
                                }, onPress: () => {
                                    setReviewOpenIdConfiguration(false);
                                    setOpenIdConfig(null);
                                    setFirstLoginPassword('');
                                }, children: _jsx(Trans, { children: "Cancel" }) }, "cancel"),
                        ], onSetOpenId: async (config) => {
                            onSetOpenId(config);
                        } })] }))] }));
}
function HeaderLogin({ error }) {
    return (_jsx(View, { style: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
        }, children: error ? (_jsx(Link, { variant: "button", type: "button", style: { fontSize: 15 }, to: '/login/password?error=' + error, children: _jsx(Trans, { children: "Log in with password" }) })) : (_jsxs("span", { children: [_jsx(Trans, { children: "Checking Header Token Login ..." }), ' ', _jsx(AnimatedLoading, { style: { width: 20, height: 20 } })] })) }));
}
export function Login() {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const dispatch = useDispatch();
    const defaultLoginMethod = useLoginMethod();
    const [method, setMethod] = useState(defaultLoginMethod);
    const [searchParams, _setSearchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const { checked } = useBootstrapped();
    const loginMethods = useAvailableLoginMethods();
    const loginMethodRef = useRef(null);
    const [loginMethodMenuOpen, setLoginMethodMenuOpen] = useState(false);
    useEffect(() => {
        setMethod(defaultLoginMethod);
    }, [defaultLoginMethod]);
    useEffect(() => {
        if (checked && !searchParams.has('error')) {
            (async () => {
                if (method === 'header') {
                    setError(null);
                    const { error } = await send('subscribe-sign-in', {
                        password: '',
                        loginMethod: method,
                    });
                    if (error) {
                        setError(error);
                    }
                    else {
                        dispatch(loggedIn());
                    }
                }
            })();
        }
    }, [loginMethods, checked, searchParams, method, dispatch]);
    function getErrorMessage(error) {
        switch (error) {
            case 'invalid-header':
                return t('Auto login failed - No header sent');
            case 'proxy-not-trusted':
                return t('Auto login failed - Proxy not trusted');
            case 'invalid-password':
                return t('Invalid password');
            case 'network-failure':
                return t('Unable to contact the server');
            case 'internal-error':
                return t('Internal error');
            default:
                return t(`An unknown error occurred: {{error}}`, { error });
        }
    }
    if (!checked) {
        return null;
    }
    return (_jsxs(View, { style: { maxWidth: 450, marginTop: -30, color: theme.pageText }, children: [_jsx(Title, { text: t('Sign in to this Actual instance') }), loginMethods?.length > 1 && (_jsx(Text, { style: {
                    fontSize: 16,
                    color: theme.pageTextDark,
                    lineHeight: 1.4,
                    marginBottom: 10,
                }, children: _jsx(Trans, { children: "If you lost your password, you likely still have access to your server to manually reset it." }) })), method === 'password' && (_jsx(PasswordLogin, { setError: setError, dispatch: dispatch })), method === 'openid' && _jsx(OpenIdLogin, { setError: setError }), method === 'header' && _jsx(HeaderLogin, { error: error }), loginMethods?.length > 1 && (_jsxs(View, { style: { marginTop: 10 }, children: [_jsx(View, { style: {
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'end',
                        }, children: _jsxs(Button, { variant: "bare", ref: loginMethodRef, onPress: () => setLoginMethodMenuOpen(true), style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                                paddingTop: 5,
                                width: 'fit-content',
                                ...(isNarrowWidth ? { padding: 10 } : null),
                            }, children: [_jsx(Trans, { children: "Select the login method" }), ' ', _jsx(SvgCheveronDown, { width: 12, height: 12 })] }) }), _jsx(Popover, { triggerRef: loginMethodRef, onOpenChange: value => {
                            setLoginMethodMenuOpen(value);
                        }, isOpen: loginMethodMenuOpen, children: _jsx(Menu, { items: loginMethods
                                ?.filter(f => f.method !== method)
                                .map(m => ({
                                name: m.method,
                                text: m.displayName,
                            })), onMenuSelect: selected => {
                                setError(null);
                                setMethod(selected);
                                setLoginMethodMenuOpen(false);
                            } }) })] })), error && (_jsx(Text, { style: {
                    marginTop: 20,
                    color: theme.errorText,
                    borderRadius: 4,
                    fontSize: 15,
                }, children: getErrorMessage(error) }))] }));
}
