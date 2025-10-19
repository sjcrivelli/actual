import { jsx as _jsx } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
import { Link } from '@desktop-client/components/common/Link';
export function ItemContent({ style, to, onClick, activeStyle, forceActive, children, }) {
    return onClick ? (_jsx(View, { role: "button", tabIndex: 0, style: {
            ...style,
            touchAction: 'auto',
            userSelect: 'none',
            userDrag: 'none',
            cursor: 'pointer',
            ...(forceActive ? activeStyle : {}),
        }, onClick: onClick, children: children })) : (_jsx(Link, { variant: "internal", to: to, style: style, activeStyle: activeStyle, children: children }));
}
