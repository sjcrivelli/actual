import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
const HEADER_HEIGHT = 50;
export function PageHeader({ title, style }) {
    return (_jsx(View, { style: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 20,
            ...style,
        }, children: _jsx(View, { style: {
                flexDirection: 'row',
                fontSize: 25,
                fontWeight: 500,
            }, children: typeof title === 'string' ? _jsx(Text, { children: title }) : title }) }));
}
export function MobilePageHeader({ title, style, leftContent, rightContent, }) {
    return (_jsxs(View, { style: {
            alignItems: 'center',
            flexDirection: 'row',
            flexShrink: 0,
            height: HEADER_HEIGHT,
            backgroundColor: theme.mobileHeaderBackground,
            '& *': {
                color: theme.mobileHeaderText,
            },
            '& button[data-pressed]': {
                backgroundColor: theme.mobileHeaderTextHover,
            },
            ...style,
        }, children: [_jsx(View, { style: {
                    flexBasis: '25%',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                }, children: leftContent }), _jsx(View, { role: "heading", style: {
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    flexBasis: '50%',
                    fontSize: 17,
                    fontWeight: 500,
                    overflowY: 'auto',
                }, children: title }), _jsx(View, { style: {
                    flexBasis: '25%',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                }, children: rightContent })] }));
}
export function Page({ header, style, padding, children, footer }) {
    const { isNarrowWidth } = useResponsive();
    const childrenPadding = padding != null ? padding : isNarrowWidth ? 10 : 20;
    const headerToRender = typeof header === 'string' ? (isNarrowWidth ? (_jsx(MobilePageHeader, { title: header })) : (_jsx(PageHeader, { title: header }))) : (header);
    return (_jsxs(View, { style: {
            ...(!isNarrowWidth && styles.page),
            flex: 1,
            backgroundColor: isNarrowWidth
                ? theme.mobilePageBackground
                : theme.pageBackground,
            ...style,
        }, children: [headerToRender, _jsx(View, { role: "main", style: {
                    flex: 1,
                    overflowY: isNarrowWidth ? 'auto' : undefined,
                    padding: `0 ${childrenPadding}px`,
                }, children: children }), footer] }));
}
