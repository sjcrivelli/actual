import { jsx as _jsx } from "react/jsx-runtime";
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
export function ItemHeader({ title, style, type, ...props }) {
    const { isNarrowWidth } = useResponsive();
    const narrowStyle = isNarrowWidth
        ? {
            ...styles.largeText,
            paddingTop: 10,
            paddingBottom: 10,
        }
        : {};
    return (_jsx("div", { style: {
            color: theme.menuAutoCompleteTextHeader,
            padding: '4px 9px',
            ...narrowStyle,
            ...style,
        }, "data-testid": `${title}-${type}-item-group`, ...props, children: title }));
}
