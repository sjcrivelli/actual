import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Form } from 'react-aria-components';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Input } from '@actual-app/components/input';
import { View } from '@actual-app/components/view';
import { evalArithmetic } from 'loot-core/shared/arithmetic';
import { integerToCurrency, amountToInteger } from 'loot-core/shared/util';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
export function HoldMenu({ onSubmit, onClose }) {
    const [amount, setAmount] = useState(null);
    useSheetValue('to-budget', ({ value }) => {
        setAmount(integerToCurrency(Math.max(value || 0, 0)));
    });
    function _onSubmit(newAmount) {
        const parsedAmount = evalArithmetic(newAmount);
        if (parsedAmount) {
            onSubmit(amountToInteger(parsedAmount));
        }
        onClose();
    }
    if (amount === null) {
        // See `TransferMenu` for more info about this
        return null;
    }
    return (_jsx(Form, { onSubmit: e => {
            e.preventDefault();
            _onSubmit(amount);
        }, children: _jsxs(View, { style: { padding: 10 }, children: [_jsx(View, { style: { marginBottom: 5 }, children: _jsx(Trans, { children: "Hold this amount:" }) }), _jsx(View, { children: _jsx(InitialFocus, { children: _jsx(Input, { value: amount, onChangeValue: setAmount }) }) }), _jsx(View, { style: {
                        alignItems: 'flex-end',
                        marginTop: 10,
                    }, children: _jsx(Button, { type: "submit", variant: "primary", style: {
                            fontSize: 12,
                            paddingTop: 3,
                            paddingBottom: 3,
                        }, children: _jsx(Trans, { children: "Hold" }) }) })] }) }));
}
