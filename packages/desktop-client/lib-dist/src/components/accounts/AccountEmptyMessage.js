import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
export function AccountEmptyMessage({ onAdd }) {
    return (_jsx(View, { style: {
            color: theme.tableText,
            backgroundColor: theme.tableBackground,
            flex: 1,
            alignItems: 'center',
            borderTopWidth: 1,
            borderColor: theme.tableBorder,
        }, children: _jsxs(View, { style: {
                width: 550,
                marginTop: 75,
                fontSize: 15,
                alignItems: 'center',
            }, children: [_jsx(Text, { style: { textAlign: 'center', lineHeight: '1.4em' }, children: _jsxs(Trans, { children: ["For Actual to be useful, you need to ", _jsx("strong", { children: "add an account" }), ". You can link an account to automatically download transactions, or manage it locally yourself."] }) }), _jsx(Button, { variant: "primary", style: { marginTop: 20 }, autoFocus: true, onPress: onAdd, children: _jsx(Trans, { children: "Add account" }) }), _jsx(View, { style: { marginTop: 20, fontSize: 13, color: theme.tableTextLight }, children: _jsx(Trans, { children: "In the future, you can add accounts from the sidebar." }) })] }) }));
}
