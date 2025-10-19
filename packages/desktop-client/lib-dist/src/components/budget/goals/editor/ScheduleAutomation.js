import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { updateTemplate, } from '@desktop-client/components/budget/goals/actions';
import { Link } from '@desktop-client/components/common/Link';
import { FormField, FormLabel } from '@desktop-client/components/forms';
export const ScheduleAutomation = ({ schedules, template, dispatch, }) => {
    const { t } = useTranslation();
    return schedules.length ? (_jsxs(Stack, { direction: "row", align: "center", spacing: 10, style: { marginTop: 10 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Schedule'), htmlFor: "schedule-field" }), _jsx(Select, { id: "schedule-field", defaultLabel: t('Select a schedule'), value: template.name, onChange: schedule => dispatch(updateTemplate({
                            type: 'schedule',
                            name: schedule,
                        })), options: schedules.flatMap(schedule => schedule.name ? [[schedule.name, schedule.name]] : []) }, "schedule-picker")] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Savings mode'), htmlFor: "schedule-full-field" }), _jsx(Select, { id: "schedule-full-field", options: [
                            ['false', t('Save up for the next occurrence')],
                            ['true', t('Cover each occurrence when it occurs')],
                        ], value: String(!!template.full), onChange: full => dispatch(updateTemplate({
                            type: 'schedule',
                            full: full === 'true',
                        })) }, "schedule-full")] })] })) : (_jsx(Text, { style: { marginTop: 10 }, children: _jsxs(Trans, { children: ["No schedules found, create one in the", ' ', _jsx(Link, { variant: "internal", to: "/schedules", children: "schedules" }), ' ', "page."] }) }));
};
