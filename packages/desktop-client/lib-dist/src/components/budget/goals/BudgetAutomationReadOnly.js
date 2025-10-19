import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgDelete } from '@actual-app/components/icons/v0';
import { SvgCheveronDown, SvgCheveronUp, } from '@actual-app/components/icons/v1';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { HistoricalAutomationReadOnly } from './editor/HistoricalAutomationReadOnly';
import { PercentageAutomationReadOnly } from './editor/PercentageAutomationReadOnly';
import { ScheduleAutomationReadOnly } from './editor/ScheduleAutomationReadOnly';
import { SimpleAutomationReadOnly } from './editor/SimpleAutomationReadOnly';
import { WeekAutomationReadOnly } from './editor/WeekAutomationReadOnly';
export function BudgetAutomationReadOnly({ state, categoryNameMap, isEditing, setIsEditing, onDelete, style, inline, }) {
    const { t } = useTranslation();
    let automationReadOnly;
    switch (state.displayType) {
        case 'simple':
            automationReadOnly = (_jsx(SimpleAutomationReadOnly, { template: state.template }));
            break;
        case 'week':
            automationReadOnly = _jsx(WeekAutomationReadOnly, { template: state.template });
            break;
        case 'schedule':
            automationReadOnly = (_jsx(ScheduleAutomationReadOnly, { template: state.template }));
            break;
        case 'percentage':
            automationReadOnly = (_jsx(PercentageAutomationReadOnly, { template: state.template, categoryNameMap: categoryNameMap }));
            break;
        case 'historical':
            automationReadOnly = (_jsx(HistoricalAutomationReadOnly, { template: state.template }));
            break;
        default:
            automationReadOnly = (_jsx(Text, { children: _jsx(Trans, { children: "Unrecognized automation type." }) }));
            break;
    }
    return (_jsxs(Stack, { direction: "row", align: "center", spacing: 2, style: style, children: [inline && (_jsx(View, { style: {
                    borderLeft: `1px solid ${theme.tableBorder}`,
                    height: 'calc(100% - 4px)',
                } })), _jsx(Text, { style: { color: theme.tableText, fontSize: 13 }, children: automationReadOnly }), _jsx(View, { style: { flex: 1 } }), _jsx(Button, { variant: "bare", onPress: () => setIsEditing(prev => !prev), style: { padding: 2 }, "aria-label": t('Edit template'), children: isEditing ? (_jsx(SvgCheveronUp, { style: { width: 16, height: 16, color: 'inherit' } })) : (_jsx(SvgCheveronDown, { style: { width: 16, height: 16, color: 'inherit' } })) }), _jsx(Button, { variant: "bare", onPress: onDelete, style: { padding: 5 }, "aria-label": t('Delete template'), children: _jsx(SvgDelete, { style: { width: 8, height: 8, color: 'inherit' } }) })] }));
}
