import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { Title } from './common';
import { ConfirmPasswordForm } from './ConfirmPasswordForm';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
export function ChangePassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [msg, setMessage] = useState(null);
    function getErrorMessage(error) {
        switch (error) {
            case 'invalid-password':
                return t('Password cannot be empty');
            case 'password-match':
                return t('Passwords do not match');
            case 'network-failure':
                return t('Unable to contact the server');
            default:
                return t('Internal error');
        }
    }
    async function onSetPassword(password) {
        setError(null);
        const { error } = await send('subscribe-change-password', { password });
        if (error) {
            setError(error);
        }
        else {
            setMessage(t('Password successfully changed'));
            await send('subscribe-sign-in', { password });
            navigate('/');
        }
    }
    return (_jsxs(View, { style: { maxWidth: 500, marginTop: -30 }, children: [_jsx(Title, { text: t('Change server password') }), _jsx(Text, { style: {
                    fontSize: 16,
                    color: theme.pageTextDark,
                    lineHeight: 1.4,
                }, children: _jsx(Trans, { children: "This will change the password for this server instance. All existing sessions will stay logged in." }) }), error && (_jsx(Text, { style: {
                    marginTop: 20,
                    color: theme.errorText,
                    borderRadius: 4,
                    fontSize: 15,
                }, children: getErrorMessage(error) })), msg && (_jsx(Text, { style: {
                    marginTop: 20,
                    color: theme.noticeTextLight,
                    borderRadius: 4,
                    fontSize: 15,
                }, children: msg })), _jsx(ConfirmPasswordForm, { buttons: _jsx(Button, { variant: "bare", style: { fontSize: 15, marginRight: 10 }, onPress: () => navigate('/'), children: _jsx(Trans, { children: "Cancel" }) }), onSetPassword: onSetPassword, onError: setError })] }));
}
