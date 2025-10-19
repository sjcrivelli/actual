import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
export function PayeeRuleCountLabel({ count, isLoading, style, }) {
    return (_jsx(Text, { style: style, children: isLoading ? (_jsx(View, { children: _jsx(AnimatedLoading, { style: { width: 12, height: 12 } }) })) : count > 0 ? (_jsxs(Trans, { count: count, children: [{ count }, " associated rules"] })) : (_jsx(Trans, { children: "Create rule" })) }));
}
