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
import { getOpenIdErrors } from 'loot-core/shared/errors';
import { closeBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Error } from '@desktop-client/components/alerts';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { OpenIdForm } from '@desktop-client/components/manager/subscribe/OpenIdForm';
import { useRefreshLoginMethods } from '@desktop-client/components/ServerContext';
import { popModal, } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function OpenIDEnableModal({ onSave: originalOnSave, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const refreshLoginMethods = useRefreshLoginMethods();
    async function onSave(config) {
        try {
            const { error } = (await send('enable-openid', { openId: config })) || {};
            if (!error) {
                originalOnSave?.();
                try {
                    await refreshLoginMethods();
                    await asyncStorage.removeItem('user-token');
                    await dispatch(closeBudget());
                }
                catch (e) {
                    console.error('Failed to cleanup after OpenID enable:', e);
                    setError(t('OpenID was enabled but cleanup failed. Please refresh the application.'));
                }
            }
            else {
                setError(getOpenIdErrors(error));
            }
        }
        catch (e) {
            console.error('Failed to enable OpenID:', e);
            setError(t('Failed to enable OpenID. Please try again.'));
        }
    }
    return (_jsx(Modal, { name: "enable-openid", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Enable OpenID'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { flexDirection: 'column' }, children: [_jsx(OpenIdForm, { onSetOpenId: onSave, otherButtons: [
                                _jsx(Button, { variant: "bare", style: { marginRight: 10 }, onPress: () => dispatch(popModal()), children: _jsx(Trans, { children: "Cancel" }) }, "cancel"),
                            ] }), _jsx(Label, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                                paddingTop: 5,
                            }, title: t('After enabling OpenID all sessions will be closed') }), _jsx(Label, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                            }, title: t('The first user to login will become the server owner') }), _jsx(Label, { style: {
                                ...styles.verySmallText,
                                color: theme.warningText,
                            }, title: t('The current password will be disabled') }), error && _jsx(Error, { children: error })] })] })) }));
}
