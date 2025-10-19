import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Input } from '@actual-app/components/input';
import { View } from '@actual-app/components/view';
import { CheckboxOption } from './CheckboxOption';
export function MultiplierOption({ multiplierEnabled, multiplierAmount, onToggle, onChangeAmount, }) {
    const { t } = useTranslation();
    return (_jsxs(View, { style: { flexDirection: 'row', gap: 10, height: 28 }, children: [_jsx(CheckboxOption, { id: "add_multiplier", checked: multiplierEnabled, onChange: onToggle, children: _jsx(Trans, { children: "Multiply amount" }) }), _jsx(Input, { type: "text", style: { display: multiplierEnabled ? 'inherit' : 'none' }, value: multiplierAmount, placeholder: t('Multiplier'), onChangeValue: onChangeAmount })] }));
}
