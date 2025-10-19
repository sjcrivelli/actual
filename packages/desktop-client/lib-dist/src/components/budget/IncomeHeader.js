import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { View } from '@actual-app/components/view';
import { RenderMonths } from './RenderMonths';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
export function IncomeHeader({ MonthComponent, onShowNewGroup, }) {
    const [categoryExpandedStatePref] = useGlobalPref('categoryExpandedState');
    const categoryExpandedState = categoryExpandedStatePref ?? 0;
    return (_jsxs(View, { style: { flexDirection: 'row', flex: 1 }, children: [_jsx(View, { style: {
                    width: 200 + 100 * categoryExpandedState,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }, children: _jsx(Button, { onPress: onShowNewGroup, style: { fontSize: 12, margin: 10 }, children: _jsx(Trans, { children: "Add group" }) }) }), _jsx(RenderMonths, { component: MonthComponent, style: { border: 0, justifyContent: 'flex-end' } })] }));
}
