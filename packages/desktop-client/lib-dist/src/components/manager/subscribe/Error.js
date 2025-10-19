import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { useLocation } from 'react-router';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
function getErrorMessage(reason) {
    switch (reason) {
        case 'network-failure':
            return 'Unable to access server. Make sure the configured URL for the server is accessible.';
        default:
            return 'Server returned an error while checking its status.';
    }
}
export function Error() {
    const navigate = useNavigate();
    const location = useLocation();
    const { error } = (location.state || {});
    function onTryAgain() {
        navigate('/');
    }
    return (_jsxs(View, { style: { alignItems: 'center', color: theme.pageText }, children: [_jsx(Text, { style: {
                    fontSize: 16,
                    color: theme.pageTextDark,
                    lineHeight: 1.4,
                }, children: getErrorMessage(error) }), _jsx(Button, { onPress: onTryAgain, style: { marginTop: 20 }, children: _jsx(Trans, { children: "Try again" }) })] }));
}
