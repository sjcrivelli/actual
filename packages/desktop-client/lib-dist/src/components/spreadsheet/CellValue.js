import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSheetName } from '@desktop-client/hooks/useSheetName';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
export function CellValue({ type, binding, children, ...props }) {
    const { fullSheetName } = useSheetName(binding);
    const sheetValue = useSheetValue(binding);
    return typeof children === 'function' ? (_jsx(_Fragment, { children: children({ type, name: fullSheetName, value: sheetValue }) })) : (_jsx(CellValueText, { type: type, name: fullSheetName, value: sheetValue, ...props }));
}
const PRIVACY_FILTER_TYPES = ['financial', 'financial-with-sign'];
export function CellValueText({ type, name, value, formatter, style, ...props }) {
    const format = useFormat();
    const isFinancial = type === 'financial' ||
        type === 'financial-with-sign' ||
        type === 'financial-no-decimals';
    return (_jsx(Text, { style: {
            ...(isFinancial && styles.tnum),
            ...(isFinancial && { whiteSpace: 'nowrap' }),
            ...style,
        }, "data-testid": name, "data-cellname": name, ...props, children: _jsx(PrivacyFilter, { activationFilters: [PRIVACY_FILTER_TYPES.includes(type)], children: formatter ? formatter(value, type) : format(value, type) }) }));
}
