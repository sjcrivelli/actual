import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { getSecretsError } from 'loot-core/shared/errors';
import { Error } from '@desktop-client/components/alerts';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalButtons, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField, FormLabel } from '@desktop-client/components/forms';
export const SimpleFinInitialiseModal = ({ onSuccess, }) => {
    const { t } = useTranslation();
    const [token, setToken] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(t('It is required to provide a token.'));
    const onSubmit = async (close) => {
        if (!token) {
            setIsValid(false);
            return;
        }
        setIsLoading(true);
        const { error, reason } = (await send('secret-set', {
            name: 'simplefin_token',
            value: token,
        })) || {};
        if (error) {
            setIsValid(false);
            setError(getSecretsError(error, reason));
        }
        else {
            onSuccess();
        }
        setIsLoading(false);
        close();
    };
    return (_jsx(Modal, { name: "simplefin-init", containerProps: { style: { width: 300 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Set-up SimpleFIN'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { display: 'flex', gap: 10 }, children: [_jsx(Text, { children: _jsxs(Trans, { children: ["In order to enable bank sync via SimpleFIN (only for North American banks), you will need to create a token. This can be done by creating an account with", ' ', _jsx(Link, { variant: "external", to: "https://bridge.simplefin.org/", linkColor: "purple", children: "SimpleFIN" }), "."] }) }), _jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Token:'), htmlFor: "token-field" }), _jsx(Input, { id: "token-field", type: "password", value: token, onChangeValue: value => {
                                        setToken(value);
                                        setIsValid(true);
                                    } })] }), !isValid && _jsx(Error, { children: error })] }), _jsx(ModalButtons, { children: _jsx(ButtonWithLoading, { variant: "primary", autoFocus: true, isLoading: isLoading, onPress: () => {
                            onSubmit(close);
                        }, children: _jsx(Trans, { children: "Save and continue" }) }) })] })) }));
};
