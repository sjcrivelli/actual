import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { Select } from '@actual-app/components/select';
import { SpaceBetween } from '@actual-app/components/space-between';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { getLiveRange } from './getLiveRange';
import { calculateTimeRange, getFullRange, getLatestRange, validateEnd, validateStart, } from './reportRanges';
import { AppliedFilters } from '@desktop-client/components/filters/AppliedFilters';
import { FilterButton } from '@desktop-client/components/filters/FiltersMenu';
import { useLocale } from '@desktop-client/hooks/useLocale';
export function Header({ start, end, mode, show1Month, allMonths, earliestTransaction, latestTransaction, firstDayOfWeekIdx, onChangeDates, filters, conditionsOp, onApply, onUpdateFilter, onDeleteFilter, onConditionsOpChange, children, inlineContent, }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    function convertToMonth(start, end, _, mode) {
        return [monthUtils.getMonth(start), monthUtils.getMonth(end), mode];
    }
    return (_jsxs(View, { style: {
            padding: 20,
            paddingTop: 15,
            flexShrink: 0,
        }, children: [_jsxs(View, { style: {
                    display: 'grid',
                    alignItems: isNarrowWidth ? 'flex-start' : 'center',
                }, children: [_jsxs(View, { style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                        }, children: [_jsxs(SpaceBetween, { gap: isNarrowWidth ? 5 : undefined, children: [mode && (_jsx(Button, { variant: mode === 'static' ? 'normal' : 'primary', onPress: () => {
                                            const newMode = mode === 'static' ? 'sliding-window' : 'static';
                                            const [newStart, newEnd] = calculateTimeRange({
                                                start,
                                                end,
                                                mode: newMode,
                                            });
                                            onChangeDates(newStart, newEnd, newMode);
                                        }, children: mode === 'static' ? t('Static') : t('Live') })), _jsxs(SpaceBetween, { gap: 5, children: [_jsx(Select, { onChange: newValue => onChangeDates(...validateStart(allMonths[allMonths.length - 1].name, allMonths[0].name, newValue, end)), value: start, defaultLabel: monthUtils.format(start, 'MMMM, yyyy', locale), options: allMonths.map(({ name, pretty }) => [name, pretty]) }), _jsx(View, { children: t('to') }), _jsx(Select, { onChange: newValue => onChangeDates(...validateEnd(allMonths[allMonths.length - 1].name, allMonths[0].name, start, newValue)), value: end, options: allMonths.map(({ name, pretty }) => [name, pretty]), style: { marginRight: 10 } })] })] }), _jsxs(SpaceBetween, { gap: 3, children: [show1Month && (_jsx(Button, { variant: "bare", onPress: () => onChangeDates(...getLatestRange(0)), children: _jsx(Trans, { children: "1 month" }) })), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...getLatestRange(2)), children: _jsx(Trans, { children: "3 months" }) }), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...getLatestRange(5)), children: _jsx(Trans, { children: "6 months" }) }), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...getLatestRange(11)), children: _jsx(Trans, { children: "1 year" }) }), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...convertToMonth(...getLiveRange('Year to date', earliestTransaction, latestTransaction, true, firstDayOfWeekIdx), 'yearToDate')), children: _jsx(Trans, { children: "Year to date" }) }), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...convertToMonth(...getLiveRange('Last year', earliestTransaction, latestTransaction, false, firstDayOfWeekIdx), 'lastYear')), children: _jsx(Trans, { children: "Last year" }) }), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...convertToMonth(...getLiveRange('Prior year to date', earliestTransaction, latestTransaction, false, firstDayOfWeekIdx), 'priorYearToDate')), children: _jsx(Trans, { children: "Prior year to date" }) }), _jsx(Button, { variant: "bare", onPress: () => onChangeDates(...getFullRange(allMonths[allMonths.length - 1].name, allMonths[0].name)), children: _jsx(Trans, { children: "All time" }) }), filters && (_jsx(FilterButton, { compact: isNarrowWidth, onApply: onApply, hover: false, exclude: undefined }))] }), _jsx(SpaceBetween, { gap: 0, children: inlineContent })] }), children && (_jsx(View, { style: {
                            gridColumn: 2,
                            flexDirection: 'row',
                            justifySelf: 'flex-end',
                            alignSelf: 'flex-start',
                        }, children: children }))] }), filters && filters.length > 0 && (_jsx(View, { style: { marginTop: 5 }, children: _jsx(AppliedFilters, { conditions: filters, onUpdate: onUpdateFilter, onDelete: onDeleteFilter, conditionsOp: conditionsOp, onConditionsOpChange: onConditionsOpChange }) }))] }));
}
