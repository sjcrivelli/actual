import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { updateTemplate, } from '@desktop-client/components/budget/goals/actions';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { GenericInput } from '@desktop-client/components/util/GenericInput';
export const HistoricalAutomation = ({ template, dispatch, }) => {
    const { t } = useTranslation();
    return (_jsxs(Stack, { direction: "row", align: "center", spacing: 10, style: { marginTop: 10 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Mode'), htmlFor: "mode-field" }), _jsx(Select, { id: "mode-field", options: [
                            ['copy', t('Copy a previous month')],
                            ['average', t('Average of previous months')],
                        ], value: template.type, onChange: type => dispatch(updateTemplate({ type })) }, "mode-picker")] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Number of months back'), htmlFor: "look-back-field" }), _jsx(GenericInput, { type: "number", value: template.type === 'average' ? template.numMonths : template.lookBack, onChange: (value) => dispatch(updateTemplate(template.type === 'average'
                            ? { type: 'average', numMonths: value }
                            : { type: 'copy', lookBack: value })) }, "look-back-input")] })] }));
};
