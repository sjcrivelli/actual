import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgArrowsSynchronize, SvgCalendar3, } from '@actual-app/components/icons/v2';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { AutoTextSize } from 'auto-text-size';
import { getColumnWidth, PILL_STYLE } from './BudgetTable';
import { makeAmountGrey } from '@desktop-client/components/budget/util';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { CellValue } from '@desktop-client/components/spreadsheet/CellValue';
import { useCategoryScheduleGoalTemplateIndicator } from '@desktop-client/hooks/useCategoryScheduleGoalTemplateIndicator';
import { useFormat } from '@desktop-client/hooks/useFormat';
export function SpentCell({ binding, category, month, show3Columns, onPress, }) {
    const { t } = useTranslation();
    const format = useFormat();
    const columnWidth = getColumnWidth({
        show3Columns,
    });
    const { schedule, scheduleStatus, isScheduleRecurring } = useCategoryScheduleGoalTemplateIndicator({
        category,
        month,
    });
    return (_jsx(CellValue, { binding: binding, type: "financial", "aria-label": t('Spent amount for {{categoryName}} category', {
            categoryName: category.name,
        }), children: ({ type, value }) => (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "bare", style: {
                        ...PILL_STYLE,
                    }, onPress: onPress, "aria-label": t('Show transactions for {{categoryName}} category', {
                        categoryName: category.name,
                    }), children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: {
                                ...makeAmountGrey(value),
                                maxWidth: columnWidth,
                                textAlign: 'right',
                                fontSize: 12,
                            }, children: format(value, type) }, value) }) }), schedule && scheduleStatus && (_jsx(View, { style: {
                        position: 'absolute',
                        right: '-3px',
                        top: '-5px',
                        borderRadius: '50%',
                        color: scheduleStatus === 'missed'
                            ? theme.errorText
                            : scheduleStatus === 'due'
                                ? theme.warningText
                                : theme.upcomingText,
                    }, children: isScheduleRecurring ? (_jsx(SvgArrowsSynchronize, { width: 11, height: 11 })) : (_jsx(SvgCalendar3, { width: 10, height: 10 })) }))] })) }));
}
