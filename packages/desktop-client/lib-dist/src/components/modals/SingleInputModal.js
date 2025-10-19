import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, } from 'react';
import { Form } from 'react-aria-components';
import { Button } from '@actual-app/components/button';
import { FormError } from '@actual-app/components/form-error';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, } from '@desktop-client/components/common/Modal';
import { InputField } from '@desktop-client/components/mobile/MobileForms';
export function SingleInputModal({ name, Header, buttonText, onSubmit, onValidate, inputPlaceholder, }) {
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const _onSubmit = (e) => {
        e.preventDefault();
        const error = onValidate?.(value);
        if (error) {
            setErrorMessage(error);
            return;
        }
        onSubmit?.(value);
    };
    return (_jsx(Modal, { name: name, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(Header, { rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(Form, { onSubmit: e => {
                        _onSubmit(e);
                        close();
                    }, children: [_jsxs(View, { children: [_jsx(InitialFocus, { children: _jsx(InputField, { placeholder: inputPlaceholder, defaultValue: value, onChangeValue: setValue }) }), errorMessage && (_jsxs(FormError, { style: {
                                        paddingTop: 5,
                                        marginLeft: styles.mobileEditingPadding,
                                        marginRight: styles.mobileEditingPadding,
                                    }, children: ["* ", errorMessage] }))] }), _jsx(View, { style: {
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 10,
                            }, children: _jsx(Button, { type: "submit", variant: "primary", style: {
                                    height: styles.mobileMinHeight,
                                    marginLeft: styles.mobileEditingPadding,
                                    marginRight: styles.mobileEditingPadding,
                                }, children: buttonText }) })] })] })) }));
}
