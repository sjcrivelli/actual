import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { useEnvelopeSheetValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FieldLabel } from '@desktop-client/components/mobile/MobileForms';
import { AmountInput } from '@desktop-client/components/util/AmountInput';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function HoldBufferModal({ onSubmit }) {
    const { t } = useTranslation(); // Initialize i18next
    const available = useEnvelopeSheetValue(envelopeBudget.toBudget) ?? 0;
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        setAmount(available);
    }, [available]);
    const _onSubmit = (newAmount) => {
        if (newAmount) {
            onSubmit?.(newAmount);
        }
    };
    return (_jsx(Modal, { name: "hold-buffer", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Hold for next month'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { children: [_jsx(FieldLabel, { title: t('Hold this amount:') }), ' ', _jsx(InitialFocus, { children: _jsx(AmountInput, { value: available, autoDecimals: true, zeroSign: "+", style: {
                                    marginLeft: styles.mobileEditingPadding,
                                    marginRight: styles.mobileEditingPadding,
                                }, inputStyle: {
                                    height: styles.mobileMinHeight,
                                }, onUpdate: setAmount, onEnter: () => {
                                    _onSubmit(amount);
                                    close();
                                } }) })] }), _jsx(View, { style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                    }, children: _jsx(Button, { variant: "primary", style: {
                            height: styles.mobileMinHeight,
                            marginLeft: styles.mobileEditingPadding,
                            marginRight: styles.mobileEditingPadding,
                        }, onPress: () => _onSubmit(amount), children: _jsx(Trans, { children: "Hold" }) }) })] })) }));
}
