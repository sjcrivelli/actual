import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Block } from '@actual-app/components/block';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { accountNameStyle } from './Account';
import { ItemContent } from './ItemContent';
const fontWeight = 600;
export function SecondaryItem({ Icon, title, style, to, onClick, bold, indent = 0, }) {
    const content = (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 16,
        }, children: [Icon && _jsx(Icon, { width: 12, height: 12 }), _jsx(Block, { style: { marginLeft: Icon ? 8 : 0, color: 'inherit' }, children: title })] }));
    return (_jsx(View, { style: { flexShrink: 0, ...style }, children: _jsx(ItemContent, { style: {
                ...accountNameStyle,
                color: theme.sidebarItemText,
                paddingLeft: 14 + indent,
                fontWeight: bold ? fontWeight : null,
                ':hover': { backgroundColor: theme.sidebarItemBackgroundHover },
            }, to: to, onClick: onClick, activeStyle: {
                borderLeft: '4px solid ' + theme.sidebarItemTextSelected,
                paddingLeft: 14 - 4 + indent,
                color: theme.sidebarItemTextSelected,
                fontWeight: bold ? fontWeight : null,
            }, children: content }) }));
}
