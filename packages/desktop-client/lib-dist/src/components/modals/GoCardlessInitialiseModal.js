import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { getSecretsError } from 'loot-core/shared/errors';
import { Error } from '@desktop-client/components/alerts';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalButtons, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField, FormLabel } from '@desktop-client/components/forms';
export const GoCardlessInitialiseModal = ({ onSuccess, }) => {
    const { t } = useTranslation();
    const [secretId, setSecretId] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(t('It is required to provide both the secret id and secret key.'));
    const onSubmit = async (close) => {
        if (!secretId || !secretKey) {
            setIsValid(false);
            setError(t('It is required to provide both the secret id and secret key.'));
            return;
        }
        setIsLoading(true);
        let { error, reason } = (await send('secret-set', {
            name: 'gocardless_secretId',
            value: secretId,
        })) || {};
        if (error) {
            setIsLoading(false);
            setIsValid(false);
            setError(getSecretsError(error, reason));
            return;
        }
        else {
            ({ error, reason } =
                (await send('secret-set', {
                    name: 'gocardless_secretKey',
                    value: secretKey,
                })) || {});
            if (error) {
                setIsLoading(false);
                setIsValid(false);
                setError(getSecretsError(error, reason));
                return;
            }
        }
        setIsValid(true);
        onSuccess();
        setIsLoading(false);
        close();
    };
    return (_jsx(Modal, { name: "gocardless-init", containerProps: { style: { width: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Set up GoCardless'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { display: 'flex', gap: 10 }, children: [_jsx(Text, { children: _jsxs(Trans, { children: ["In order to enable bank sync via GoCardless (only for EU banks) you will need to create access credentials. This can be done by creating an account with", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/advanced/bank-sync/", linkColor: "purple", children: "GoCardless" }), "."] }) }), _jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Secret ID:'), htmlFor: "secret-id-field" }), _jsx(InitialFocus, { children: _jsx(Input, { id: "secret-id-field", type: "password", value: secretId, onChangeValue: value => {
                                            setSecretId(value);
                                            setIsValid(true);
                                        } }) })] }), _jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Secret Key:'), htmlFor: "secret-key-field" }), _jsx(Input, { id: "secret-key-field", type: "password", value: secretKey, onChangeValue: value => {
                                        setSecretKey(value);
                                        setIsValid(true);
                                    } })] }), !isValid && _jsx(Error, { children: error })] }), _jsx(ModalButtons, { children: _jsx(ButtonWithLoading, { variant: "primary", isLoading: isLoading, onPress: () => {
                            onSubmit(close);
                        }, children: _jsx(Trans, { children: "Save and continue" }) }) })] })) }));
};
