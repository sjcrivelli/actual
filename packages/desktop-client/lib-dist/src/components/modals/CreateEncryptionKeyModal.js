import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { useTranslation, Trans } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { Paragraph } from '@actual-app/components/paragraph';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { send } from 'loot-core/platform/client/fetch';
import { getCreateKeyError } from 'loot-core/shared/errors';
import { sync } from '@desktop-client/app/appSlice';
import { loadAllFiles } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalButtons, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { loadGlobalPrefs } from '@desktop-client/prefs/prefsSlice';
import { useDispatch } from '@desktop-client/redux';
export function CreateEncryptionKeyModal({ recreate, }) {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isNarrowWidth } = useResponsive();
    const dispatch = useDispatch();
    const isRecreating = recreate;
    async function onCreateKey(close) {
        if (password !== '' && !loading) {
            setLoading(true);
            setError(null);
            const res = await send('key-make', { password });
            if (res.error) {
                setLoading(null);
                setError(getCreateKeyError(res.error));
                return;
            }
            dispatch(loadGlobalPrefs());
            dispatch(loadAllFiles());
            dispatch(sync());
            setLoading(false);
            close();
        }
    }
    return (_jsx(Modal, { name: "create-encryption-key", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: isRecreating ? t('Generate new key') : t('Enable encryption'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(View, { style: {
                        maxWidth: 600,
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        flex: 1,
                    }, children: !isRecreating ? (_jsxs(_Fragment, { children: [_jsxs(Paragraph, { style: { marginTop: 5 }, children: [_jsxs(Trans, { children: ["To enable end-to-end encryption, you need to create a key. We will generate a key based on a password and use it to encrypt from now on.", ' ', _jsx("strong", { children: "This requires a sync reset" }), " and all other devices will have to revert to this version of your data.", ' '] }), _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }), _jsx(Paragraph, { children: _jsxs("ul", { className: css({
                                        marginTop: 0,
                                        '& li': { marginBottom: 8 },
                                    }), children: [_jsx("li", { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Important:" }), " if you forget this password", ' ', _jsx("em", { children: "and" }), " you don\u2019t have any local copies of your data, you will lose access to all your data. The data cannot be decrypted without the password."] }) }), _jsx("li", { children: _jsx(Trans, { children: "This key only applies to this file. You will need to generate a new key for each file you want to encrypt." }) }), _jsx("li", { children: _jsx(Trans, { children: "If you\u2019ve already downloaded your data on other devices, you will need to reset them. Actual will automatically take you through this process." }) }), _jsx("li", { children: _jsx(Trans, { children: "It is recommended for the encryption password to be different than the log-in password in order to better protect your data." }) })] }) })] })) : (_jsxs(_Fragment, { children: [_jsxs(Paragraph, { style: { marginTop: 5 }, children: [_jsxs(Trans, { children: ["This will generate a new key for encrypting your data.", ' ', _jsx("strong", { children: "This requires a sync reset" }), " and all other devices will have to revert to this version of your data. Actual will take you through that process on those devices."] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }), _jsx(Paragraph, { children: _jsx(Trans, { children: "Key generation is randomized. The same password will create different keys, so this will change your key regardless of the password being different." }) })] })) }), _jsxs(Form, { onSubmit: e => {
                        e.preventDefault();
                        onCreateKey(close);
                    }, children: [_jsxs(View, { style: { alignItems: 'center' }, children: [_jsx(Text, { style: { fontWeight: 600, marginBottom: 3 }, children: _jsx(Trans, { children: "Password" }) }), error && (_jsx(View, { style: {
                                        color: theme.errorText,
                                        textAlign: 'center',
                                        fontSize: 13,
                                        marginBottom: 3,
                                    }, children: error })), _jsx(InitialFocus, { children: _jsx(Input, { type: showPassword ? 'text' : 'password', style: {
                                            width: isNarrowWidth ? '100%' : '50%',
                                            height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                        }, onChangeValue: setPassword }) }), _jsx(Text, { style: { marginTop: 5 }, children: _jsxs("label", { style: { userSelect: 'none' }, children: [_jsx("input", { type: "checkbox", onClick: () => setShowPassword(!showPassword) }), ' ', _jsx(Trans, { children: "Show password" })] }) })] }), _jsx(ModalButtons, { style: { marginTop: 20 }, children: _jsx(ButtonWithLoading, { type: "submit", style: {
                                    height: isNarrowWidth ? styles.mobileMinHeight : undefined,
                                }, isLoading: loading, variant: "primary", children: _jsx(Trans, { children: "Enable" }) }) })] })] })) }));
}
