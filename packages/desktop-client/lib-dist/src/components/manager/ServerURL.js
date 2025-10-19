import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { Link } from '@desktop-client/components/common/Link';
import { useServerURL } from '@desktop-client/components/ServerContext';
export function ServerURL() {
    const url = useServerURL();
    return (_jsxs(View, { style: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 15,
            zIndex: 5000,
        }, children: [_jsx(Text, { children: url ? (_jsxs(Trans, { children: ["Using server: ", _jsx("strong", { children: url })] })) : (_jsx(Trans, { children: _jsx("strong", { children: "No server configured" }) })) }), _jsx(Link, { variant: "internal", to: "/config-server", style: { marginLeft: 15 }, children: _jsx(Trans, { children: "Change" }) })] }));
}
