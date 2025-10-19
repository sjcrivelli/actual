import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { View } from '@actual-app/components/view';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { updateTemplate, } from '@desktop-client/components/budget/goals/actions';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { PercentInput } from '@desktop-client/components/util/PercentInput';
export const PercentageAutomation = ({ dispatch, template, categories, }) => {
    const { t } = useTranslation();
    return (_jsxs(_Fragment, { children: [_jsxs(Stack, { direction: "row", align: "center", spacing: 10, style: { marginTop: 10 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Category'), htmlFor: "category-field" }), _jsx(CategoryAutocomplete, { inputProps: { id: 'category-field' }, onSelect: (category) => dispatch(updateTemplate({ type: 'percentage', category })), value: template.category, categoryGroups: template.previous
                                    ? categories.map(group => ({
                                        ...group,
                                        categories: group.categories?.filter(category => category.id !== 'to-budget'),
                                    }))
                                    : categories })] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Percentage'), htmlFor: "percent-field" }), _jsx(PercentInput, { id: "percent-field", value: template.percent, onUpdatePercent: (percent) => dispatch(updateTemplate({
                                    type: 'percentage',
                                    percent,
                                })) }, "percent-input")] })] }), _jsxs(Stack, { direction: "row", align: "center", spacing: 10, style: { marginTop: 10 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Percentage of'), htmlFor: "previous-field" }), _jsx(Select, { id: "previous-field", options: [
                                    [false, t('This month')],
                                    [true, t('Last month')],
                                ], value: template.previous, onChange: previous => {
                                    if (template.type !== 'percentage') {
                                        return;
                                    }
                                    return dispatch(updateTemplate({
                                        type: 'percentage',
                                        previous,
                                        ...(previous && template.category === 'to-budget'
                                            ? { category: '' }
                                            : {}),
                                    }));
                                } }, "previous-month")] }), _jsx(View, { style: { flex: 1 } })] })] }));
};
