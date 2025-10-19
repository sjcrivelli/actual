import { jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
export const HistoricalAutomationReadOnly = ({ template, }) => {
    return template.type === 'copy' ? (_jsxs(Trans, { children: ["Budget the same amount as ", { amount: template.lookBack }, " months ago"] })) : (_jsxs(Trans, { children: ["Budget the average of the last ", { amount: template.numMonths }, " months"] }));
};
