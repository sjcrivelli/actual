import { jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { amountToInteger } from 'loot-core/shared/util';
import { useFormat } from '@desktop-client/hooks/useFormat';
export const WeekAutomationReadOnly = ({ template, }) => {
    const format = useFormat();
    return (_jsxs(Trans, { children: ["Budget", ' ', {
                amount: format(amountToInteger(template.amount, format.currency.decimalPlaces), 'financial'),
            }, ' ', "each week"] }));
};
