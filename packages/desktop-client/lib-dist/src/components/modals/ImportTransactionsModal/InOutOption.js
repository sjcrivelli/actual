import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Input } from '@actual-app/components/input';
import { View } from '@actual-app/components/view';
import { CheckboxOption } from './CheckboxOption';
export function InOutOption({ inOutMode, outValue, disabled, onToggle, onChangeText, }) {
    const { t } = useTranslation();
    return (_jsxs(View, { style: { flexDirection: 'row', gap: 10, height: 28 }, children: [_jsx(CheckboxOption, { id: "form_inOut", checked: inOutMode, disabled: disabled, onChange: onToggle, children: inOutMode
                    ? t('In/Out outflow value')
                    : t('Select column to specify if amount goes in/out') }), inOutMode && (_jsx(Input, { type: "text", value: outValue, onChangeValue: onChangeText, placeholder: t('Value for out rows, e.g: ‘Credit’') }))] }));
}
