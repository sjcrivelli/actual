import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { BigInput } from '@actual-app/components/input';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
export function ConfirmPasswordForm({ buttons, onSetPassword, onError, }) {
    const { t } = useTranslation();
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    async function onSubmit() {
        if (loading) {
            return;
        }
        if (password1 === password2) {
            setLoading(true);
            await onSetPassword(password1);
            setLoading(false);
        }
        else {
            onError('password-match');
        }
    }
    function onShowPassword(e) {
        setShowPassword(e.target.checked);
    }
    return (_jsxs(View, { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            marginTop: 30,
        }, children: [_jsx(BigInput, { autoFocus: true, placeholder: t('Password'), type: showPassword ? 'text' : 'password', value: password1, onChangeValue: setPassword1, onEnter: onSubmit }), _jsx(BigInput, { placeholder: t('Confirm password'), type: showPassword ? 'text' : 'password', value: password2, onChangeValue: setPassword2, style: { marginTop: 10 }, onEnter: onSubmit }), _jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    fontSize: 15,
                    marginTop: 20,
                }, children: [_jsxs("label", { style: { userSelect: 'none' }, children: [_jsx("input", { type: "checkbox", onChange: onShowPassword }), ' ', _jsx(Trans, { children: "Show password" })] }), _jsx(View, { style: { flex: 1 } }), buttons, _jsx(ButtonWithLoading, { variant: "primary", isLoading: loading, onPress: onSubmit, children: _jsx(Trans, { children: "OK" }) })] })] }));
}
export function ConfirmOldPasswordForm({ buttons, onSetPassword, style = null, }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    async function onSubmit() {
        if (loading) {
            return;
        }
        setLoading(true);
        await onSetPassword(password);
        setLoading(false);
    }
    function onShowPassword(e) {
        setShowPassword(e.target.checked);
    }
    return (_jsxs(View, { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            marginTop: 30,
            ...style,
        }, children: [_jsx(BigInput, { autoFocus: true, placeholder: t('Password'), type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), onEnter: onSubmit, className: css({
                    borderColor: theme.buttonMenuBorder,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    '&[data-focused]': {},
                }) }), _jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    fontSize: 15,
                    marginTop: 20,
                }, children: [_jsxs("label", { style: { userSelect: 'none' }, children: [_jsx("input", { type: "checkbox", onChange: onShowPassword }), ' ', _jsx(Trans, { children: "Show password" })] }), _jsx(View, { style: { flex: 1 } }), buttons, _jsx(ButtonWithLoading, { variant: "primary", isLoading: loading, onPress: onSubmit, children: _jsx(Trans, { children: "OK" }) })] })] }));
}
