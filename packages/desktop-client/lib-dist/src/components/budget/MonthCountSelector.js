import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { SvgCalendar } from '@actual-app/components/icons/v2';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { useBudgetMonthCount } from './BudgetMonthCountContext';
function Calendar({ color, onClick }) {
    return (_jsx(SvgCalendar, { style: { width: 13, height: 13, color, marginRight: 5 }, onClick: onClick }));
}
export function MonthCountSelector({ maxMonths, onChange, }) {
    const { t } = useTranslation();
    const { displayMax } = useBudgetMonthCount();
    // It doesn't make sense to show anything if we can only fit one
    // month
    if (displayMax <= 1) {
        return null;
    }
    const calendars = [];
    for (let i = 1; i <= displayMax; i++) {
        calendars.push(_jsx(Calendar, { color: maxMonths >= i ? theme.pageTextLight : theme.pageTextSubdued, onClick: () => onChange(i) }, i));
    }
    return (_jsx(View, { style: {
            flexDirection: 'row',
            marginRight: 20,
            marginTop: -1,
            WebkitAppRegion: 'no-drag',
            '& svg': {
                transition: 'transform .15s',
            },
            '& svg:hover': {
                transform: 'scale(1.2)',
            },
        }, title: t('Choose the number of months shown at a time'), children: calendars }));
}
