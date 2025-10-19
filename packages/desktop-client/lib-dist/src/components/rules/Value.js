import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { format as formatDate, parseISO } from 'date-fns';
import { getMonthYearFormat } from 'loot-core/shared/months';
import { getRecurringDescription } from 'loot-core/shared/schedules';
import { Link } from '@desktop-client/components/common/Link';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { usePayees } from '@desktop-client/hooks/usePayees';
export function Value({ value, field, valueIsRaw, inline = false, data: dataProp, 
// @ts-expect-error fix this later
describe = x => x.name, style, }) {
    const { t } = useTranslation();
    const format = useFormat();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const payees = usePayees();
    const { list: categories } = useCategories();
    const accounts = useAccounts();
    const valueStyle = {
        color: theme.pageTextPositive,
        ...style,
    };
    const locale = useLocale();
    const data = dataProp ||
        (field === 'payee'
            ? payees
            : field === 'category'
                ? categories
                : field === 'account'
                    ? accounts
                    : []);
    const [expanded, setExpanded] = useState(false);
    function onExpand(e) {
        e.preventDefault();
        setExpanded(true);
    }
    function formatValue(value) {
        if (value == null || value === '') {
            return t('(nothing)');
        }
        else if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        }
        else {
            switch (field) {
                case 'amount':
                    return format(value, 'financial');
                case 'date':
                    if (value) {
                        if (value.frequency) {
                            return getRecurringDescription(value, dateFormat, locale);
                        }
                        return formatDate(parseISO(value), dateFormat);
                    }
                    return null;
                case 'month':
                    return value
                        ? formatDate(parseISO(value), getMonthYearFormat(dateFormat))
                        : null;
                case 'year':
                    return value ? formatDate(parseISO(value), 'yyyy') : null;
                case 'notes':
                case 'imported_payee':
                case 'payee_name':
                    return value;
                case 'payee':
                case 'category':
                case 'account':
                case 'rule':
                    if (valueIsRaw) {
                        return value;
                    }
                    if (data && Array.isArray(data)) {
                        const item = data.find(item => item.id === value);
                        if (item) {
                            return describe(item);
                        }
                        else {
                            return t('(deleted)');
                        }
                    }
                    return '…';
                default:
                    throw new Error(`Unknown field ${field}`);
            }
        }
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return _jsx(Text, { style: valueStyle, children: "(empty)" });
        }
        else if (value.length === 1) {
            return (_jsxs(Text, { children: ["[", _jsx(Text, { style: valueStyle, children: formatValue(value[0]) }), "]"] }));
        }
        let displayed = value;
        if (!expanded && value.length > 4) {
            displayed = value.slice(0, 3);
        }
        const numHidden = value.length - displayed.length;
        return (_jsxs(Text, { style: { color: theme.tableText }, children: ["[", displayed.map((v, i) => {
                    const text = _jsx(Text, { style: valueStyle, children: formatValue(v) });
                    let spacing;
                    if (inline) {
                        spacing = i !== 0 ? ' ' : '';
                    }
                    else {
                        spacing = (_jsxs(_Fragment, { children: [i === 0 && _jsx("br", {}), "\u00A0\u00A0"] }));
                    }
                    return (_jsxs(Text, { children: [spacing, text, i === value.length - 1 ? '' : ',', !inline && _jsx("br", {})] }, i));
                }), numHidden > 0 && (_jsxs(Text, { style: valueStyle, children: ["\u00A0\u00A0", _jsx(Link, { variant: "text", onClick: onExpand, style: valueStyle, children: t('{{num}} more items...', { num: numHidden }) }), !inline && _jsx("br", {})] })), "]"] }));
        // @ts-expect-error Fix typechecker here
    }
    else if (value && value.num1 != null && value.num2 != null) {
        // An "in between" type
        // @ts-expect-error Fix typechecker here
        const { num1, num2 } = value;
        return (_jsxs(Text, { children: [_jsx(Text, { style: valueStyle, children: formatValue(num1) }), " ", t('and'), ' ', _jsx(Text, { style: valueStyle, children: formatValue(num2) })] }));
    }
    else {
        return _jsx(Text, { style: valueStyle, children: formatValue(value) });
    }
}
