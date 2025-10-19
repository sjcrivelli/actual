import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheveronLeft } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
export function MobileBackButton({ onPress, style, ...props }) {
    const navigate = useNavigate();
    return (_jsxs(Button, { variant: "bare", style: {
            margin: 10,
            ...style,
        }, onPress: onPress || (() => navigate(-1)), ...props, children: [_jsx(SvgCheveronLeft, { style: { width: 30, height: 30, margin: -10, marginLeft: -5 } }), _jsx(Text, { style: {
                    ...styles.text,
                    fontWeight: 500,
                    marginLeft: 5,
                    marginRight: 5,
                }, children: _jsx(Trans, { children: "Back" }) })] }));
}
