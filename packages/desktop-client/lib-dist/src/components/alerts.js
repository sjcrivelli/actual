import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SvgExclamationOutline, SvgInformationOutline, } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
const Alert = ({ icon: Icon, color, backgroundColor, style, children, }) => {
    return (_jsxs(View, { style: {
            color,
            fontSize: 13,
            ...styles.shadow,
            borderRadius: 4,
            backgroundColor,
            padding: 10,
            flexDirection: 'row',
            '& a, & a:active, & a:visited': {
                color: theme.formLabelText,
            },
            ...style,
        }, children: [_jsx(View, { style: {
                    paddingLeft: 2,
                    paddingTop: '.11em',
                    alignSelf: 'stretch',
                    flexShrink: 0,
                    marginRight: 5,
                }, children: _jsx(Icon, { width: 13, style: { marginTop: 2 } }) }), _jsx(Text, { style: { zIndex: 1, lineHeight: 1.5 }, children: children })] }));
};
export const Information = ({ style, children }) => {
    return (_jsx(Alert, { icon: SvgInformationOutline, color: theme.pageTextLight, backgroundColor: "transparent", style: {
            boxShadow: 'none',
            padding: 5,
            ...style,
        }, children: children }));
};
export const Warning = ({ style, children }) => {
    return (_jsx(Alert, { icon: SvgExclamationOutline, color: theme.warningText, backgroundColor: theme.warningBackground, style: style, children: children }));
};
export const Error = ({ style, children }) => {
    return (_jsx(Alert, { icon: SvgExclamationOutline, color: theme.errorTextDarker, backgroundColor: theme.errorBackground, style: style, children: children }));
};
