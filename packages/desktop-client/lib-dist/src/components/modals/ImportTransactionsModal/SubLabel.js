import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
export function SubLabel({ title }) {
    return (_jsx(Text, { style: { fontSize: 13, marginBottom: 3, color: theme.pageText }, children: title }));
}
