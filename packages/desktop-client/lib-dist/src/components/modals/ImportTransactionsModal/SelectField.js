import { jsx as _jsx } from "react/jsx-runtime";
import { Select } from '@actual-app/components/select';
export function SelectField({ style, options, value, onChange, hasHeaderRow, firstTransaction, }) {
    const columns = options.map(option => [
        option,
        hasHeaderRow
            ? option
            : `Column ${parseInt(option) + 1} (${firstTransaction[option]})`,
    ]);
    // If selected column does not exist in transaction sheet, ignore
    if (!columns.find(col => col[0] === value))
        value = null;
    return (_jsx(Select, { options: [['choose-field', 'Choose field...'], ...columns], value: value === null ? 'choose-field' : value, onChange: onChange, style: style }));
}
