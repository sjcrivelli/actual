import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { amountToInteger, integerToAmount } from 'loot-core/shared/util';
import { updateTemplate, } from '@desktop-client/components/budget/goals/actions';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { AmountInput } from '@desktop-client/components/util/AmountInput';
import { useFormat } from '@desktop-client/hooks/useFormat';
export const SimpleAutomation = ({ template, dispatch, }) => {
    const { t } = useTranslation();
    const { currency } = useFormat();
    return (_jsxs(FormField, { children: [_jsx(FormLabel, { title: t('Amount'), htmlFor: "amount-field" }), _jsx(AmountInput, { id: "amount-field", value: amountToInteger(template.monthly ?? 0, currency.decimalPlaces), zeroSign: "+", onUpdate: (value) => dispatch(updateTemplate({
                    type: 'simple',
                    monthly: integerToAmount(value, currency.decimalPlaces),
                })) }, "amount-input")] }));
};
