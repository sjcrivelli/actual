import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, useEffect, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { BigInput } from '@actual-app/components/input';
import { Label } from '@actual-app/components/label';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { isNonProductionEnvironment, isElectron, } from 'loot-core/shared/environment';
import { Title } from './subscribe/common';
import { createBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Link } from '@desktop-client/components/common/Link';
import { useServerURL, useSetServerURL, } from '@desktop-client/components/ServerContext';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { saveGlobalPrefs } from '@desktop-client/prefs/prefsSlice';
import { useDispatch } from '@desktop-client/redux';
import { loggedIn, signOut } from '@desktop-client/users/usersSlice';
export function ElectronServerConfig({ onDoNotUseServer, onSetServerConfigView, }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const setServerUrl = useSetServerURL();
    const currentUrl = useServerURL();
    const dispatch = useDispatch();
    const [syncServerConfig, setSyncServerConfig] = useGlobalPref('syncServerConfig');
    const [electronServerPort, setElectronServerPort] = useState(syncServerConfig?.port || 5007);
    const [configError, setConfigError] = useState(null);
    const canShowExternalServerConfig = !syncServerConfig?.port && !currentUrl;
    const hasInternalServerConfig = syncServerConfig?.port;
    const [startingSyncServer, setStartingSyncServer] = useState(false);
    const onConfigureSyncServer = async () => {
        if (startingSyncServer) {
            return; // Prevent multiple clicks
        }
        if (isNaN(electronServerPort) ||
            electronServerPort <= 0 ||
            electronServerPort > 65535) {
            setConfigError(t('Ports must be within range 1 - 65535'));
            return;
        }
        try {
            setConfigError(null);
            setStartingSyncServer(true);
            // Ensure config is saved before starting the server
            await dispatch(saveGlobalPrefs({
                prefs: {
                    syncServerConfig: {
                        ...syncServerConfig,
                        port: electronServerPort,
                        autoStart: true,
                    },
                },
            })).unwrap();
            await window.globalThis.Actual.stopSyncServer();
            await window.globalThis.Actual.startSyncServer();
            setStartingSyncServer(false);
            initElectronSyncServerRunningStatus();
            await setServerUrl(`http://localhost:${electronServerPort}`);
            navigate('/');
        }
        catch (error) {
            setStartingSyncServer(false);
            setConfigError(t('Failed to configure sync server'));
            console.error('Failed to configure sync server:', error);
        }
    };
    const [electronSyncServerRunning, setElectronSyncServerRunning] = useState(false);
    const initElectronSyncServerRunningStatus = async () => {
        setElectronSyncServerRunning(await window.globalThis.Actual.isSyncServerRunning());
    };
    useEffect(() => {
        initElectronSyncServerRunningStatus();
    }, []);
    async function dontUseSyncServer() {
        setSyncServerConfig(null);
        if (electronSyncServerRunning) {
            await window.globalThis.Actual.stopSyncServer();
        }
        onDoNotUseServer();
    }
    return (_jsxs(_Fragment, { children: [_jsx(Title, { text: t('Configure your server') }), _jsxs(View, { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                }, children: [_jsx(Text, { style: {
                            fontSize: 16,
                            color: theme.pageText,
                            lineHeight: 1.5,
                        }, children: _jsx(Trans, { children: "Set up your server below to enable seamless data synchronization across your devices, bank sync and more..." }) }), _jsx(Text, { style: {
                            fontSize: 16,
                            color: theme.pageText,
                            lineHeight: 1.5,
                        }, children: _jsxs(Trans, { children: ["Need to expose your server to the internet? Follow our step-by-step", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/install/desktop-app", children: "guide" }), ' ', "for more information."] }) }), configError && (_jsx(Text, { style: { color: theme.errorText, marginTop: 10 }, children: configError })), _jsxs(View, { style: {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10,
                        }, children: [_jsxs(View, { style: { flexDirection: 'column', gap: 5, flex: 1 }, children: [_jsx(Label, { title: t('Domain'), style: { textAlign: 'left' } }), _jsx(BigInput, { value: "localhost", disabled: true, type: "text", className: css({
                                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
                                            },
                                        }) })] }), _jsxs(View, { style: { flexDirection: 'column', gap: 5 }, children: [_jsx(Label, { title: t('Port'), style: { textAlign: 'left', width: '7ch' } }), _jsx(BigInput, { name: "port", value: String(electronServerPort), "aria-label": t('Port'), type: "number", className: css({
                                            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
                                            },
                                            width: '7ch',
                                            textAlign: 'center',
                                        }), autoFocus: true, maxLength: 5, onChange: event => setElectronServerPort(Number(event.target.value)) })] }), _jsxs(View, { style: {
                                    flexDirection: 'column',
                                    gap: 5,
                                    justifyContent: 'end',
                                }, children: [_jsx(Label, { title: t(''), style: { textAlign: 'left', width: '7ch' } }), !electronSyncServerRunning ? (_jsx(ButtonWithLoading, { variant: "primary", style: { padding: 10, width: '8ch' }, onPress: onConfigureSyncServer, isLoading: startingSyncServer, children: _jsx(Trans, { children: "Start" }) })) : (_jsx(ButtonWithLoading, { variant: "primary", style: { padding: 10, width: '8ch' }, onPress: onConfigureSyncServer, isLoading: startingSyncServer, children: _jsx(Trans, { children: "Save" }) }))] })] })] }), _jsxs(View, { style: {
                    flexDirection: 'row',
                    marginTop: 20,
                    gap: 15,
                    flexFlow: 'row wrap',
                    justifyContent: 'center',
                }, children: [hasInternalServerConfig && (_jsx(Button, { variant: "bare", style: { color: theme.pageTextLight, margin: 5 }, onPress: () => navigate(-1), children: _jsx(Trans, { children: "Cancel" }) })), _jsx(Button, { variant: "bare", style: { color: theme.pageTextLight, margin: 5 }, onPress: dontUseSyncServer, children: _jsx(Trans, { children: "Don\u2019t use a server" }) }), canShowExternalServerConfig && (_jsx(Button, { variant: "bare", style: { color: theme.pageTextLight, margin: 5 }, onPress: () => onSetServerConfigView('external'), children: _jsx(Trans, { children: "Use an external server" }) }))] })] }));
}
export function ConfigServer() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const currentUrl = useServerURL();
    const setServerUrl = useSetServerURL();
    useEffect(() => {
        setUrl(currentUrl);
    }, [currentUrl]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const restartElectronServer = useCallback(() => {
        globalThis.window.Actual.restartElectronServer();
        setError(null);
    }, []);
    const [_serverSelfSignedCert, setServerSelfSignedCert] = useGlobalPref('serverSelfSignedCert', restartElectronServer);
    function getErrorMessage(error) {
        switch (error) {
            case 'network-failure':
                return t('Server is not running at this URL. Make sure you have HTTPS set up properly.');
            default:
                return t('Server does not look like an Actual server. Is it set up correctly?');
        }
    }
    async function onSubmit() {
        if (url === null || url === '' || loading) {
            return;
        }
        setError(null);
        setLoading(true);
        let httpUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            httpUrl = 'https://' + url;
        }
        const { error } = await setServerUrl(httpUrl);
        setUrl(httpUrl);
        if (error) {
            setLoading(false);
            setError(error);
        }
        else {
            setLoading(false);
            await dispatch(signOut());
            navigate('/');
        }
    }
    function onSameDomain() {
        setUrl(window.location.origin);
    }
    async function onSelectSelfSignedCertificate() {
        const selfSignedCertificateLocation = await window.Actual.openFileDialog({
            properties: ['openFile'],
            filters: [
                {
                    name: 'Self Signed Certificate',
                    extensions: ['crt', 'pem'],
                },
            ],
        });
        if (selfSignedCertificateLocation) {
            setServerSelfSignedCert(selfSignedCertificateLocation[0]);
        }
    }
    async function onSkip() {
        await setServerUrl(null);
        await dispatch(loggedIn());
        navigate('/');
    }
    async function onCreateTestFile() {
        await setServerUrl(null);
        await dispatch(createBudget({ testMode: true }));
        navigate('/');
    }
    const [syncServerConfig] = useGlobalPref('syncServerConfig');
    const hasExternalServerConfig = !syncServerConfig?.port && !!currentUrl;
    const [serverConfigView, onSetServerConfigView] = useState(() => {
        if (isElectron() && !hasExternalServerConfig) {
            return 'internal';
        }
        return 'external';
    });
    return (_jsxs(View, { style: { maxWidth: 500, marginTop: -30 }, children: [serverConfigView === 'internal' && (_jsx(ElectronServerConfig, { onDoNotUseServer: onSkip, onSetServerConfigView: onSetServerConfigView })), serverConfigView === 'external' && (_jsxs(_Fragment, { children: [_jsx(Title, { text: t('Where’s the server?') }), _jsx(Text, { style: {
                            fontSize: 16,
                            color: theme.tableRowHeaderText,
                            lineHeight: 1.5,
                        }, children: currentUrl ? (_jsx(Trans, { children: "Existing sessions will be logged out and you will log in to this server. We will validate that Actual is running at this URL." })) : (_jsx(Trans, { children: "There is no server configured. After running the server, specify the URL here to use the app. You can always change this later. We will validate that Actual is running at this URL." })) }), error && (_jsxs(_Fragment, { children: [_jsx(Text, { style: {
                                    marginTop: 20,
                                    color: theme.errorText,
                                    borderRadius: 4,
                                    fontSize: 15,
                                }, children: getErrorMessage(error) }), isElectron() && (_jsx(View, { style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginTop: 20,
                                }, children: _jsx(Text, { style: {
                                        color: theme.errorText,
                                        borderRadius: 4,
                                        fontSize: 15,
                                    }, children: _jsxs(Trans, { children: ["If the server is using a self-signed certificate", ' ', _jsx(Link, { variant: "text", style: { fontSize: 15 }, onClick: onSelectSelfSignedCertificate, children: "select it here" }), "."] }) }) }))] })), _jsxs(View, { style: { display: 'flex', flexDirection: 'row', marginTop: 30 }, children: [_jsx(BigInput, { autoFocus: true, placeholder: t('https://example.com'), value: url || '', onChangeValue: setUrl, style: { flex: 1, marginRight: 10 }, onEnter: onSubmit }), _jsx(ButtonWithLoading, { variant: "primary", isLoading: loading, style: { fontSize: 15 }, onPress: onSubmit, children: _jsx(Trans, { children: "OK" }) }), currentUrl && (_jsx(Button, { variant: "bare", style: { fontSize: 15, marginLeft: 10 }, onPress: () => navigate(-1), children: _jsx(Trans, { children: "Cancel" }) }))] }), _jsx(View, { style: {
                            flexDirection: 'row',
                            flexFlow: 'row wrap',
                            justifyContent: 'center',
                            marginTop: 15,
                        }, children: currentUrl ? (_jsx(Button, { variant: "bare", style: { color: theme.pageTextLight }, onPress: onSkip, children: _jsx(Trans, { children: "Stop using a server" }) })) : (_jsxs(_Fragment, { children: [!isElectron() && (_jsx(Button, { variant: "bare", style: {
                                        color: theme.pageTextLight,
                                        margin: 5,
                                        marginRight: 15,
                                    }, onPress: onSameDomain, children: _jsx(Trans, { children: "Use current domain" }) })), _jsx(Button, { variant: "bare", style: { color: theme.pageTextLight, margin: 5 }, onPress: onSkip, children: _jsx(Trans, { children: "Don\u2019t use a server" }) }), isNonProductionEnvironment() && (_jsx(Button, { variant: "primary", style: { marginLeft: 15 }, onPress: async () => {
                                        await onCreateTestFile();
                                        navigate('/');
                                    }, children: _jsx(Trans, { children: "Create test file" }) }))] })) })] }))] }));
}
