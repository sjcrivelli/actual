import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
export const ScheduleAutomationReadOnly = ({ template, }) => {
    if (!template.name) {
        return _jsx(Trans, { children: "Budget for a schedule" });
    }
    if (template.full) {
        return (_jsxs(Trans, { children: ["Cover the occurrences of the schedule \u2018", { name: template.name }, "\u2019 this month"] }));
    }
    return (_jsxs(Trans, { children: ["Save up for the schedule \u2018", { name: template.name }, "\u2019"] }));
};
