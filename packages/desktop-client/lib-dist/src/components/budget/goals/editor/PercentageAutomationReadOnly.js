import { jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
export const PercentageAutomationReadOnly = ({ template, categoryNameMap, }) => {
    const { t } = useTranslation();
    if (template.category === 'total') {
        return template.previous ? (_jsxs(Trans, { children: ["Budget ", { percent: template.percent }, "% of total income last month"] })) : (_jsxs(Trans, { children: ["Budget ", { percent: template.percent }, "% of total income this month"] }));
    }
    if (template.category === 'to-budget') {
        return template.previous ? (_jsxs(Trans, { children: ["Budget ", { percent: template.percent }, "% of available funds to budget last month"] })) : (_jsxs(Trans, { children: ["Budget ", { percent: template.percent }, "% of available funds to budget this month"] }));
    }
    // Regular income categories
    return template.previous ? (_jsxs(Trans, { children: ["Budget ", { percent: template.percent }, "% of \u2018", {
                category: categoryNameMap[template.category] ?? t('Unknown category'),
            }, "\u2019 last month"] })) : (_jsxs(Trans, { children: ["Budget ", { percent: template.percent }, "% of \u2018", {
                category: categoryNameMap[template.category] ?? t('Unknown category'),
            }, "\u2019 this month"] }));
};
