import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Label } from '@actual-app/components/label';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Setting } from './UI';
import { useMultiuserEnabled, useLoginMethod, } from '@desktop-client/components/ServerContext';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function AuthSettings() {
    const { t } = useTranslation();
    const multiuserEnabled = useMultiuserEnabled();
    const loginMethod = useLoginMethod();
    const dispatch = useDispatch();
    return (_jsx(Setting, { primaryAction: _jsxs(_Fragment, { children: [_jsxs("label", { children: [_jsx(Trans, { children: "OpenID is" }), ' ', _jsx("label", { style: { fontWeight: 'bold' }, children: loginMethod === 'openid' ? t('enabled') : t('disabled') })] }), loginMethod === 'password' && (_jsxs(_Fragment, { children: [_jsx(Button, { id: "start-using", style: {
                                marginTop: '10px',
                            }, variant: "normal", onPress: () => dispatch(pushModal({
                                modal: {
                                    name: 'enable-openid',
                                    options: {
                                        onSave: async () => { },
                                    },
                                },
                            })), children: _jsx(Trans, { children: "Start using OpenID" }) }), _jsx(Label, { style: { paddingTop: 5 }, title: t('OpenID is required to enable multi-user mode.') })] })), loginMethod !== 'password' && (_jsxs(_Fragment, { children: [_jsx(Button, { style: {
                                marginTop: '10px',
                            }, variant: "normal", onPress: () => dispatch(pushModal({
                                modal: {
                                    name: 'enable-password-auth',
                                    options: {
                                        onSave: async () => { },
                                    },
                                },
                            })), children: _jsx(Trans, { children: "Disable OpenID" }) }), multiuserEnabled && (_jsx("label", { style: { paddingTop: 5, color: theme.errorText }, children: _jsx(Trans, { children: "Disabling OpenID will deactivate multi-user mode." }) }))] }))] }), children: _jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Authentication method" }), " modifies how users log in to the system."] }) }) }));
}
