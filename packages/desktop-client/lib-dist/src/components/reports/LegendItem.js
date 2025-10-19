import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
export function LegendItem({ color, label, style, }) {
    return (_jsxs(View, { style: {
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            ...style,
        }, children: [_jsx(View, { style: {
                    marginRight: 5,
                    borderRadius: 1000,
                    width: 14,
                    height: 14,
                    backgroundColor: color,
                } }), _jsx(Text, { style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                }, children: label })] }));
}
