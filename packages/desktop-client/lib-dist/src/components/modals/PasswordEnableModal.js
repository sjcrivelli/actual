import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Label } from '@actual-app/components/label';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import * as asyncStorage from 'loot-core/platform/server/asyncStorage';
import { closeBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Error as ErrorAlert } from '@desktop-client/components/alerts';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField } from '@desktop-client/components/forms';
import { ConfirmOldPasswordForm, ConfirmPasswordForm, } from '@desktop-client/components/manager/subscribe/ConfirmPasswordForm';
import { useAvailableLoginMethods, useMultiuserEnabled, useRefreshLoginMethods, } from '@desktop-client/components/ServerContext';
import { popModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function PasswordEnableModal({ onSave: originalOnSave, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const multiuserEnabled = useMultiuserEnabled();
    const availableLoginMethods = useAvailableLoginMethods();
    const refreshLoginMethods = useRefreshLoginMethods();
    const errorMessages = {
        'invalid-password': t('Invalid password'),
        'password-match': t('Passwords do not match'),
        'network-failure': t('Unable to contact the server'),
        'unable-to-change-file-config-enabled': t('Unable to disable OpenID. Please update the config.json file in this case.'),
    };
    function getErrorMessage(error) {
        return (errorMessages[error] || t('Internal error'));
    }
    async function onSetPassword(password) {
        setError(null);
        const { error } = (await send('enable-password', { password })) || {};
        if (!error) {
            originalOnSave?.();
            await refreshLoginMethods();
            await asyncStorage.removeItem('user-token');
            await dispatch(closeBudget());
        }
        else {
            setError(getErrorMessage(error));
        }
    }
    return (_jsx(Modal, { name: "enable-password-auth", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Revert to server password'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { flexDirection: 'column' }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [!availableLoginMethods.some(login => login.method === 'password') && (_jsx(ConfirmPasswordForm, { buttons: _jsx(Button, { variant: "bare", style: { fontSize: 15, marginRight: 10 }, onPress: () => dispatch(popModal()), children: _jsx(Trans, { children: "Cancel" }) }), onSetPassword: onSetPassword, onError: (error) => setError(getErrorMessage(error)) })), availableLoginMethods.some(login => login.method === 'password') && (_jsx(ConfirmOldPasswordForm, { buttons: _jsx(Button, { variant: "bare", style: { fontSize: 15, marginRight: 10 }, onPress: () => dispatch(popModal()), children: _jsx(Trans, { children: "Cancel" }) }), onSetPassword: onSetPassword }))] }), _jsx(Label, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                                paddingTop: 5,
                            }, title: t('Type the server password to disable OpenID') }), _jsx(Label, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                                paddingTop: 5,
                            }, title: t('After disabling OpenID all sessions will be closed') }), multiuserEnabled && (_jsx(Label, { style: {
                                ...styles.verySmallText,
                                color: theme.errorText,
                            }, title: t('Multi-user will not work after disabling') })), error && _jsx(ErrorAlert, { children: error })] })] })) }));
}
