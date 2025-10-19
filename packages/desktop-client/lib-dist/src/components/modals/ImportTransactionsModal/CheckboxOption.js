import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Checkbox } from '@desktop-client/components/forms';
export function CheckboxOption({ id, checked, disabled, onChange, children, style, }) {
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
            minHeight: 28,
            ...style,
        }, children: [_jsx(Checkbox, { id: id, checked: checked, disabled: disabled, onChange: onChange }), _jsx("label", { htmlFor: id, style: {
                    userSelect: 'none',
                    color: disabled ? theme.pageTextSubdued : undefined,
                }, children: children })] }));
}
