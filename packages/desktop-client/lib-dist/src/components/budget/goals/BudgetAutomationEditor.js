import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { setType } from './actions';
import { displayTemplateTypes } from './constants';
import { HistoricalAutomation } from './editor/HistoricalAutomation';
import { PercentageAutomation } from './editor/PercentageAutomation';
import { ScheduleAutomation } from './editor/ScheduleAutomation';
import { SimpleAutomation } from './editor/SimpleAutomation';
import { WeekAutomation } from './editor/WeekAutomation';
import { FormField, FormLabel, FormTextLabel, } from '@desktop-client/components/forms';
const displayTypeToDescription = {
    simple: _jsx(Trans, { children: "Add a fixed amount to this category each month." }),
    week: (_jsx(Trans, { children: "Add a fixed amount to this category for each week in the month. For example, $100 per week would be $400 per month in a 4-week month." })),
    schedule: (_jsx(Trans, { children: "Add enough to this category to cover the selected schedule. If the schedule occurs multiple times in a month, an amount will be added for each occurrence. You can choose to save up for the next occurrence over time (e.g. save $100 each month for a $300 quarterly bill) or cover each occurrence when it occurs (e.g. only add the $300 when the bill is due)." })),
    percentage: (_jsx(Trans, { children: "Add a fixed percentage of your income to this category each month. You can choose to take the percentage from the current month or the previous month." })),
    historical: (_jsx(Trans, { children: "Add an amount to this category each month based on the values from previous months. For example, you can copy the amount from a year ago to budget for an annual expense, or budget the average of the last 3 months to account for seasonal changes." })),
};
export function BudgetAutomationEditor({ inline, state, dispatch, schedules, categories, }) {
    const { t } = useTranslation();
    let automationEditor;
    switch (state.displayType) {
        case 'simple':
            automationEditor = (_jsx(SimpleAutomation, { template: state.template, dispatch: dispatch }));
            break;
        case 'week':
            automationEditor = (_jsx(WeekAutomation, { template: state.template, dispatch: dispatch }));
            break;
        case 'schedule':
            automationEditor = (_jsx(ScheduleAutomation, { schedules: schedules, template: state.template, dispatch: dispatch }));
            break;
        case 'percentage':
            automationEditor = (_jsx(PercentageAutomation, { dispatch: dispatch, template: state.template, categories: categories }));
            break;
        case 'historical':
            automationEditor = (_jsx(HistoricalAutomation, { template: state.template, dispatch: dispatch }));
            break;
        default:
            automationEditor = (_jsx(Text, { children: _jsx(Trans, { children: "Unrecognized automation type." }) }));
    }
    return (_jsxs(Stack, { direction: "column", spacing: 2, style: {
            flex: 1,
            ...styles.editorPill,
            backgroundColor: theme.pillBackgroundLight,
            ...(inline ? { borderRadius: 0 } : {}),
            padding: 30,
            minHeight: 'fit-content',
        }, children: [_jsxs(Stack, { direction: "row", align: "flex-start", spacing: 4, children: [_jsxs(FormField, { style: { flexShrink: 0 }, children: [_jsx(FormLabel, { title: t('Type'), htmlFor: "type-field" }), _jsx(InitialFocus, { children: _jsx(Select, { id: "type-field", options: displayTemplateTypes, defaultLabel: t('Select an option'), value: state.displayType, onChange: type => type && dispatch(setType(type)), style: { width: 172 } }) })] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormTextLabel, { title: t('Description') }), _jsx(Text, { children: displayTypeToDescription[state.displayType] ?? (_jsx(Trans, { children: "No description available" })) })] })] }), automationEditor] }));
}
