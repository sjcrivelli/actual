import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import * as d from 'date-fns';
import * as monthUtils from 'loot-core/shared/months';
import { useLocale } from '@desktop-client/hooks/useLocale';
function checkDate(date) {
    const dateParsed = monthUtils.parseDate(date);
    if (dateParsed) {
        return d.format(dateParsed, 'yyyy-MM-dd');
    }
    else {
        return null;
    }
}
export function DateRange({ start, end, type }) {
    const { t } = useTranslation();
    const locale = useLocale();
    const checkStart = checkDate(start);
    const checkEnd = checkDate(end);
    let startDate;
    let endDate;
    if (checkStart && checkEnd) {
        startDate = d.parseISO(checkStart);
        endDate = d.parseISO(checkEnd);
    }
    else {
        return (_jsx(Text, { style: { ...styles.mediumText, color: theme.errorText }, children: _jsx(Trans, { children: "There was a problem loading your date range" }) }));
    }
    const formattedStartDate = d.format(startDate, 'MMM yyyy', { locale });
    const formattedEndDate = d.format(endDate, 'MMM yyyy', { locale });
    let typeOrFormattedEndDate;
    if (type && ['budget', 'average'].includes(type)) {
        typeOrFormattedEndDate = type === 'budget' ? t('budgeted') : t('average');
    }
    else {
        typeOrFormattedEndDate = formattedEndDate;
    }
    let content;
    if (['budget', 'average'].includes(type || '')) {
        content = (_jsx("div", { children: _jsxs(Trans, { children: ["Compare ", { formattedStartDate }, " to ", { typeOrFormattedEndDate }] }) }));
    }
    else if (startDate.getFullYear() !== endDate.getFullYear() ||
        startDate.getMonth() !== endDate.getMonth()) {
        content = (_jsx("div", { children: type ? (_jsxs(Trans, { children: ["Compare ", { formattedStartDate }, " to ", { typeOrFormattedEndDate }] })) : (_jsxs(_Fragment, { children: [formattedStartDate, " - ", formattedEndDate] })) }));
    }
    else {
        content = d.format(endDate, 'MMMM yyyy', { locale });
    }
    return _jsx(Block, { style: { color: theme.pageTextSubdued }, children: content });
}
