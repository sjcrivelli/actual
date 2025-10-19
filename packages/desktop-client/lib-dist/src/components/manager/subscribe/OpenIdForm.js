import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ButtonWithLoading } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { ResponsiveInput } from '@actual-app/components/input';
import { Menu } from '@actual-app/components/menu';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Link } from '@desktop-client/components/common/Link';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { useServerURL } from '@desktop-client/components/ServerContext';
export function OpenIdForm({ onSetOpenId, otherButtons, openIdData, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const [issuer, setIssuer] = useState('');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [clientIdRequired, setClientIdRequired] = useState(true);
    const [clientIdDisabled, setClientIdDisabled] = useState(false);
    const [clientSecretRequired, setClientSecretRequired] = useState(true);
    const [clientSecretDisabled, setClientSecretDisabled] = useState(false);
    const [providerName, setProviderName] = useState('other');
    const serverUrl = useServerURL();
    const location = useLocation();
    const [tip, setTip] = useState((_jsx(Text, {})));
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (openIdData) {
            setProviderName(openIdData.selectedProvider ?? 'other');
            setIssuer(openIdData.issuer ?? '');
            setClientId(openIdData.client_id ?? '');
            setClientSecret(openIdData.client_secret ?? '');
        }
    }, [openIdData]);
    const handleProviderChange = (provider) => {
        if (provider) {
            setProviderName(provider.value);
            const newIssuer = typeof provider.issuer === 'function'
                ? provider.issuer(location, serverUrl ?? '')
                : provider.issuer;
            setIssuer(newIssuer ?? '');
            const newClientId = typeof provider.clientId === 'function'
                ? provider.clientId(location, serverUrl ?? '')
                : provider.clientId;
            setClientId(newClientId ?? '');
            const newclientSecret = typeof provider.clientSecret === 'function'
                ? provider.clientSecret(location, serverUrl ?? '')
                : provider.clientSecret;
            setClientSecret(newclientSecret ?? '');
            setClientIdRequired(provider.clientIdRequired ?? true);
            setClientIdDisabled(provider.clientIdDisabled ?? false);
            setClientSecretRequired(provider.clientSecretRequired ?? true);
            setClientSecretDisabled(provider.clientSecretDisabled ?? false);
            setTip(provider.tip ?? _jsx(Text, {}));
            setSubmitButtonDisabled(provider.submitButtonDisabled ?? false);
        }
    };
    async function onSubmit() {
        if (loading) {
            return;
        }
        setLoading(true);
        await onSetOpenId({
            selectedProvider: providerName,
            discoveryURL: issuer ?? '',
            client_id: clientId ?? '',
            client_secret: clientSecret ?? '',
            server_hostname: serverUrl ?? '',
        });
        setLoading(false);
    }
    return (_jsxs(_Fragment, { children: [_jsx(OpenIdProviderSelector, { onProviderChange: handleProviderChange, defaultValue: providerName }), _jsx(Stack, { direction: "column", style: { marginTop: 5 }, children: _jsx(FormField, { style: { flex: 1 }, children: !submitButtonDisabled && (_jsx(View, { children: _jsx(ResponsiveInput, { id: "issuer-field", type: "text", value: issuer, placeholder: "https://accounts.domain.tld/", onChangeValue: newValue => setIssuer(newValue) }) })) }) }), _jsxs("label", { htmlFor: "issuer-field", style: {
                    ...styles.verySmallText,
                    color: theme.pageTextLight,
                    minWidth: '150px',
                    marginTop: 5,
                    marginBottom: 10,
                    maxWidth: '500px',
                }, children: [!submitButtonDisabled && t('The OpenID provider URL.'), ' ', _jsx(Text, { style: {
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: tip })] }), ' ', _jsxs(Stack, { children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Client ID'), htmlFor: "clientid-field" }), _jsx(ResponsiveInput, { type: "text", id: "clientid-field", value: clientId, disabled: clientIdDisabled, onChangeValue: newValue => setClientId(newValue), required: clientIdRequired }), _jsx("label", { htmlFor: "clientid-field", style: {
                                    ...styles.verySmallText,
                                    color: theme.pageTextLight,
                                }, children: _jsx(Trans, { children: "The Client ID generated by the OpenID provider." }) })] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Client secret'), htmlFor: "clientsecret-field" }), _jsx(ResponsiveInput, { type: "text", id: "clientsecret-field", value: clientSecret, onChangeValue: newValue => setClientSecret(newValue), disabled: clientSecretDisabled, required: clientSecretRequired }), _jsx("label", { htmlFor: "clientsecret-field", style: {
                                    ...styles.verySmallText,
                                    color: theme.pageTextLight,
                                }, children: _jsx(Trans, { children: "The client secret associated with the ID generated by the OpenID provider." }) })] }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", children: [otherButtons, _jsx(ButtonWithLoading, { variant: "primary", isLoading: loading, onPress: onSubmit, isDisabled: submitButtonDisabled, style: isNarrowWidth ? { padding: 10 } : undefined, children: "OK" })] })] })] }));
}
const openIdProviders = [
    ...[
        {
            label: 'Google Accounts',
            value: 'google',
            issuer: 'https://accounts.google.com',
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: false,
            tip: (_jsx(Link, { variant: "external", to: "https://developers.google.com/identity/sign-in/web/sign-in", children: _jsx(Trans, { children: "Integrating Google Sign-In into your web app" }) })),
        },
        {
            label: 'Passwordless.id',
            value: 'passwordless',
            issuer: 'https://api.passwordless.id',
            clientId: (location, serverUrl) => serverUrl
                ? serverUrl
                : window.location.href.replace(location.pathname, ''),
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: true,
            tip: (_jsx(Link, { variant: "external", to: "https://passwordless.id/", children: _jsx(Trans, { children: "Get started with passwordless.id" }) })),
        },
        {
            label: 'Microsoft Entra',
            value: 'microsoft',
            issuer: 'https://login.microsoftonline.com/{tenant-id}',
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: false,
            tip: (_jsx(Link, { variant: "external", to: "https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc", children: _jsx(Trans, { children: "OpenID Connect on the Microsoft identity platform" }) })),
        },
        {
            label: 'Auth0',
            value: 'auth0',
            issuer: 'https://{domain.region}.auth0.com/',
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: false,
            tip: (_jsxs(Text, { style: { color: theme.warningText }, children: [_jsx(Trans, { children: "Note that the URL depends on your application domain and region." }), ' ', _jsx(Link, { variant: "external", to: "https://auth0.com/docs/get-started/applications/application-settings", children: _jsx(Trans, { children: "Auth0 application settings" }) })] })),
        },
        {
            label: 'Keycloak',
            value: 'keycloak',
            issuer: 'https://{domain}/realms/{realm}/',
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: false,
            tip: (_jsxs(Text, { style: { color: theme.warningText }, children: [_jsx(Trans, { children: "Note that the URL depends on your Keycloak domain and realm." }), ' ', _jsx(Link, { variant: "external", to: "https://www.keycloak.org/docs/22.0.0/securing_apps/", children: _jsx(Trans, { children: "Securing Applications with Keycloak" }) })] })),
        },
        {
            label: 'GitHub',
            value: 'github',
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: true,
            clientIdDisabled: true,
            submitButtonDisabled: true,
            tip: (_jsxs(_Fragment, { children: [_jsx(Text, { style: { color: theme.errorText }, children: _jsx(Trans, { children: "GitHub does not support discovery. You need to configure it in the server." }) }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/", linkColor: "muted", children: _jsx(Trans, { children: "Learn more" }) })] })),
        },
        {
            label: 'authentik',
            value: 'authentik',
            issuer: 'https://{domain}/application/o/{provider-slug-name}/',
            clientIdRequired: true,
            clientSecretRequired: true,
            clientSecretDisabled: false,
            tip: (_jsxs(Text, { style: { color: theme.warningText }, children: [_jsx(Trans, { children: "Note that the URL depends on your authentik domain and provider slug name." }), ' ', _jsx(Link, { variant: "external", to: "https://integrations.goauthentik.io/miscellaneous/actual-budget/", children: _jsx(Trans, { children: "Configure OAuth2 provider" }) })] })),
        },
    ].sort((a, b) => a.label.localeCompare(b.label)),
    Menu.line,
    {
        label: 'Other',
        value: 'other',
        issuer: '',
        clientIdRequired: true,
        clientSecretRequired: true,
        clientSecretDisabled: false,
        tip: (_jsxs(Text, { children: [_jsxs(Trans, { children: ["Use any OpenId provider of your preference.", ' ', _jsx(Text, { style: { color: theme.warningText }, children: "If your provider does not support discovery, configure it manually from server" })] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/", linkColor: "muted", children: _jsx(Trans, { children: "Learn more" }) })] })),
    },
];
function OpenIdProviderSelector({ onProviderChange, defaultValue, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const handleProviderChange = (newValue) => {
        const selectedProvider = openIdProviders.find(provider => provider !== Menu.line ? provider.value === newValue : false);
        if (selectedProvider && selectedProvider !== Menu.line) {
            onProviderChange(selectedProvider);
        }
    };
    return (_jsxs(FormField, { style: { flex: 1, marginTop: 20 }, children: [_jsx(FormLabel, { title: t('OpenID provider'), htmlFor: "provider-selector" }), _jsx(Select, { options: openIdProviders.map(provider => provider === Menu.line ? Menu.line : [provider.value, provider.label]), defaultLabel: t('Select Provider'), value: defaultValue, onChange: handleProviderChange, style: isNarrowWidth ? { padding: 10 } : undefined })] }));
}
