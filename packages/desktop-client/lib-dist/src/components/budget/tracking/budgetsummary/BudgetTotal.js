import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
export function BudgetTotal({ title, current, target, ProgressComponent, style, }) {
    return (_jsxs(View, { style: {
            lineHeight: 1.5,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 14,
            ...style,
        }, children: [_jsx(ProgressComponent, { current: current, target: target }), _jsxs(View, { style: { marginLeft: 10 }, children: [_jsx(View, { children: _jsx(Text, { style: { color: theme.pageTextLight }, children: title }) }), _jsx(Text, { children: _jsx(Trans, { i18nKey: "<allocatedAmount /> <italic>of <totalAmount /></italic>", components: {
                                allocatedAmount: _jsx(CellValue, { binding: current, type: "financial" }),
                                italic: (_jsx(Text, { style: { color: theme.pageTextSubdued, fontStyle: 'italic' } })),
                                totalAmount: (_jsx(CellValue, { binding: target, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: styles.notFixed })) })),
                            } }) })] })] }));
}
