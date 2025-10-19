import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@actual-app/components/button';
import { SvgFilter } from '@actual-app/components/icons/v1';
export function CompactFiltersButton({ onPress }) {
    return (_jsx(Button, { variant: "bare", onPress: onPress, style: { minWidth: 20 }, children: _jsx(SvgFilter, { width: 15, height: 15, style: { width: 15, height: 15, flexShrink: 0 } }) }));
}
