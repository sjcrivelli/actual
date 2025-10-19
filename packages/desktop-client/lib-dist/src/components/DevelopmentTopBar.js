import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Link } from './common/Link';
export function DevelopmentTopBar() {
    return (_jsxs(View, { style: {
            padding: '6px 20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            color: theme.warningText,
            backgroundColor: theme.warningBackground,
            borderBottom: `1px solid ${theme.warningBorder}`,
            zIndex: 1,
            flexShrink: 0,
        }, children: [_jsx(View, { children: "This is a demo build of Actual." }), _jsx(View, { children: _jsxs(Link, { variant: "external", linkColor: "purple", to: `https://github.com/actualbudget/actual/pull/${process.env.REACT_APP_REVIEW_ID}`, children: ["Open the PR: #", process.env.REACT_APP_REVIEW_ID] }) })] }));
}
