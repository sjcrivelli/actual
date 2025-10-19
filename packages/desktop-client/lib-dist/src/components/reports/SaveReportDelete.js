import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
export function SaveReportDelete({ onDelete, onClose, name, }) {
    return (_jsxs(_Fragment, { children: [_jsx(View, { style: { align: 'center' }, children: _jsx(Text, { style: { color: theme.errorText, marginBottom: 5 }, children: _jsxs(Trans, { children: ["Are you sure you want to delete the report named", ' ‘', _jsx(Text, { style: { display: 'inline' }, children: { name } }), "\u2019?"] }) }) }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 15 }, children: [_jsx(View, { style: { flex: 1 } }), _jsx(Button, { variant: "primary", autoFocus: true, onPress: onDelete, children: _jsx(Trans, { children: "Yes" }) }), _jsx(Button, { variant: "primary", onPress: onClose, children: _jsx(Trans, { children: "No" }) })] })] }));
}
