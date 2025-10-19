import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { formatDate, parseDate } from './utils';
export function ParsedDate({ parseDateFormat, dateFormat, date, }) {
    const parsed = date &&
        formatDate(parseDateFormat ? parseDate(date, parseDateFormat) : date, dateFormat);
    return (_jsxs(Text, { children: [_jsxs(Text, { children: [date || (_jsx(Text, { style: { color: theme.pageTextLight, fontStyle: 'italic' }, children: _jsx(Trans, { children: "Empty" }) })), ' ', "\u2192", ' '] }), _jsx(Text, { style: { color: parsed ? theme.noticeTextLight : theme.errorText }, children: parsed || _jsx(Trans, { children: "Invalid" }) })] }));
}
