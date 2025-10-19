import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { ItemContent } from './ItemContent';
export function Item({ children, Icon, title, style, to, onClick, indent = 0, forceHover = false, forceActive = false, }) {
    const hoverStyle = {
        backgroundColor: theme.sidebarItemBackgroundHover,
    };
    const content = (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 20,
        }, children: [_jsx(Icon, { width: 15, height: 15 }), _jsx(Block, { style: { marginLeft: 8 }, children: title }), _jsx(View, { style: { flex: 1 } })] }));
    return (_jsxs(View, { style: { flexShrink: 0, ...style }, children: [_jsx(ItemContent, { style: {
                    ...styles.mediumText,
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 19 + indent,
                    paddingRight: 10,
                    textDecoration: 'none',
                    color: theme.sidebarItemText,
                    ...(forceHover ? hoverStyle : {}),
                    ':hover': hoverStyle,
                }, forceActive: forceActive, activeStyle: {
                    borderLeft: '4px solid ' + theme.sidebarItemTextSelected,
                    paddingLeft: 19 + indent - 4,
                    color: theme.sidebarItemTextSelected,
                }, to: to, onClick: onClick, children: content }), children ? _jsx(View, { style: { marginTop: 5 }, children: children }) : null] }));
}
