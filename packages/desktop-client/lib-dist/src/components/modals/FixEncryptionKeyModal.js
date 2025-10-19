import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { BigInput } from '@actual-app/components/input';
import { Paragraph } from '@actual-app/components/paragraph';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { getTestKeyError } from 'loot-core/shared/errors';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalButtons, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
export function FixEncryptionKeyModal({ cloudFileId, hasExistingKey, onSuccess, }) {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { isNarrowWidth } = useResponsive();
    async function onUpdateKey(close) {
        if (password !== '' && !loading) {
            setLoading(true);
            setError(null);
            const { error } = await send('key-test', {
                password,
                cloudFileId,
            });
            if (error) {
                setError(getTestKeyError(error));
                setLoading(false);
                return;
            }
            onSuccess?.();
            close();
        }
    }
    return (_jsx(Modal, { name: "fix-encryption-key", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: hasExistingKey
                        ? t('Decrypt budget file')
                        : t('This file is encrypted'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(View, { style: {
                        maxWidth: 500,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        flex: 1,
                    }, children: hasExistingKey ? (_jsxs(Paragraph, { children: [t('Please provide the encryption key to unlock this budget file. You may be unlocking it for the first time, or the key has changed. Enter your password to continue.'), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", children: _jsx(Trans, { children: "Learn more" }) })] })) : (_jsxs(Paragraph, { children: [t('We don’t have a key that encrypts or decrypts this file. Enter the password for this file to create the key for encryption.'), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", children: _jsx(Trans, { children: "Learn more" }) })] })) }), _jsxs(Form, { onSubmit: e => {
                        e.preventDefault();
                        onUpdateKey(close);
                    }, children: [_jsxs(View, { style: {
                                marginTop: 15,
                                flexDirection: 'column',
                                alignItems: 'center',
                            }, children: [_jsx(Text, { style: { fontWeight: 600, marginBottom: 5 }, children: _jsx(Trans, { children: "Password" }) }), ' ', error && (_jsx(View, { style: {
                                        color: theme.errorText,
                                        textAlign: 'center',
                                        fontSize: 13,
                                        marginBottom: 3,
                                    }, children: error })), _jsx(InitialFocus, { children: _jsx(BigInput, { type: showPassword ? 'text' : 'password', style: {
                                            width: isNarrowWidth ? '100%' : '50%',
                                            height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                        }, onChangeValue: setPassword }) }), _jsx(Text, { style: { marginTop: 5 }, children: _jsxs("label", { style: { userSelect: 'none' }, children: [_jsx("input", { type: "checkbox", onClick: () => setShowPassword(!showPassword) }), ' ', _jsx(Trans, { children: "Show password" })] }) })] }), _jsxs(ModalButtons, { style: { marginTop: 20 }, children: [_jsx(Button, { variant: "normal", style: {
                                        height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                        marginRight: 10,
                                    }, onPress: close, children: _jsx(Trans, { children: "Back" }) }), _jsx(ButtonWithLoading, { type: "submit", variant: "primary", style: {
                                        height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                    }, isLoading: loading, children: hasExistingKey ? t('Unlock budget file') : t('Create key') })] })] })] })) }));
}
