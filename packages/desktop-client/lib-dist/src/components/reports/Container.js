import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { View } from '@actual-app/components/view';
export function Container({ style, children }) {
    const portalHost = useRef(null);
    return (_jsxs(View, { style: { height: 300, position: 'relative', flexShrink: 0, ...style }, children: [_jsx("div", { ref: portalHost }), _jsx(AutoSizer, { children: ({ width, height }) => (_jsx("div", { style: { width, height }, children: children(width, height, portalHost.current) })) })] }));
}
