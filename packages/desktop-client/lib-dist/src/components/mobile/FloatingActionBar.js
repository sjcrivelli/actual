import { jsx as _jsx } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
export function FloatingActionBar({ style, children }) {
    return (_jsx(View, { style: {
            backgroundColor: theme.floatingActionBarBackground,
            color: theme.floatingActionBarText,
            position: 'fixed',
            bottom: 10,
            margin: '0 10px',
            width: '95vw',
            height: 60,
            zIndex: 100,
            borderRadius: 8,
            border: `1px solid ${theme.floatingActionBarBorder}`,
            ...style,
        }, children: children }));
}
