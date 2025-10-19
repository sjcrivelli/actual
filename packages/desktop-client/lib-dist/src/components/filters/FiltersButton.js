import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgFilter } from '@actual-app/components/icons/v1';
export function FiltersButton({ onPress }) {
    return (_jsxs(Button, { variant: "bare", onPress: onPress, children: [_jsx(SvgFilter, { style: { width: 12, height: 12, marginRight: 5, flexShrink: 0 } }), ' ', _jsx(Trans, { children: "Filter" })] }));
}
