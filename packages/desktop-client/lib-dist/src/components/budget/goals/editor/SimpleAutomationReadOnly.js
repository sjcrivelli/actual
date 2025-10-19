import { jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { amountToInteger } from 'loot-core/shared/util';
import { useFormat } from '@desktop-client/hooks/useFormat';
export const SimpleAutomationReadOnly = ({ template, }) => {
    const format = useFormat();
    return (_jsxs(Trans, { children: ["Budget", ' ', {
                monthly: format(amountToInteger(template.monthly ?? 0, format.currency.decimalPlaces), 'financial'),
            }, ' ', "each month"] }));
};
