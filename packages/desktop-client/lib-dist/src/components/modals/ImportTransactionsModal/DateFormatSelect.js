import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Select } from '@actual-app/components/select';
import { View } from '@actual-app/components/view';
import { dateFormats, } from './utils';
import { SectionLabel } from '@desktop-client/components/forms';
export function DateFormatSelect({ transactions, fieldMappings, parseDateFormat, onChange, }) {
    const { t } = useTranslation();
    // We don't actually care about the delimiter, but we try to render
    // it based on the data we have so far. Look in a transaction and
    // try to figure out what delimiter the date is using, and default
    // to space if we can't figure it out.
    let delimiter = '-';
    if (transactions.length > 0 && fieldMappings && fieldMappings.date != null) {
        const date = transactions[0][fieldMappings.date];
        const m = date && String(date).match(/[/.,\-/\\]/);
        delimiter = m ? m[0] : ' ';
    }
    return (_jsxs(View, { style: { width: 120 }, children: [_jsx(SectionLabel, { title: t('Date format') }), _jsx(Select, { options: dateFormats.map(f => [
                    f.format,
                    f.label.replace(/ /g, delimiter),
                ]), value: parseDateFormat || '', onChange: onChange })] }));
}
