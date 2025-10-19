import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Setting } from './UI';
import { Link } from '@desktop-client/components/common/Link';
import { useServerURL } from '@desktop-client/components/ServerContext';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function EncryptionSettings() {
    const dispatch = useDispatch();
    const serverURL = useServerURL();
    const [encryptKeyId] = useMetadataPref('encryptKeyId');
    const missingCryptoAPI = !(window.crypto && crypto.subtle);
    function onChangeKey() {
        dispatch(pushModal({
            modal: { name: 'create-encryption-key', options: { recreate: true } },
        }));
    }
    return encryptKeyId ? (_jsx(Setting, { primaryAction: _jsx(Button, { onPress: onChangeKey, children: _jsx(Trans, { children: "Generate new key" }) }), children: _jsxs(Text, { children: [_jsx(Text, { style: { color: theme.noticeTextLight, fontWeight: 600 }, children: _jsx(Trans, { children: "End-to-end Encryption is turned on." }) }), ' ', _jsx(Trans, { children: "Your data is encrypted with a key that only you have before sending it it out to the cloud. Local data remains unencrypted so if you forget your password you can re-encrypt it." }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }) })) : missingCryptoAPI ? (_jsx(Setting, { primaryAction: _jsx(Button, { isDisabled: true, children: _jsx(Trans, { children: "Enable encryption" }) }), children: _jsxs(Text, { children: [_jsxs(Trans, { children: [_jsx("strong", { children: "End-to-end encryption" }), " is not available when making an unencrypted connection to a remote server. You\u2019ll need to enable HTTPS on your server to use end-to-end encryption. This problem may also occur if your browser is too old to work with Actual."] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/config/https", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }) })) : serverURL ? (_jsx(Setting, { primaryAction: _jsx(Button, { onPress: () => dispatch(pushModal({
                modal: { name: 'create-encryption-key', options: {} },
            })), children: _jsx(Trans, { children: "Enable encryption" }) }), children: _jsxs(Text, { children: [_jsxs(Trans, { children: [_jsx("strong", { children: "End-to-end encryption" }), " is not enabled. Any data on the server is still protected by the server password, but it\u2019s not end-to-end encrypted which means the server owners have the ability to read it. If you want, you can use an additional password to encrypt your data on the server."] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }) })) : (_jsx(Setting, { primaryAction: _jsx(Button, { isDisabled: true, children: _jsx(Trans, { children: "Enable encryption" }) }), children: _jsxs(Text, { children: [_jsxs(Trans, { children: [_jsx("strong", { children: "End-to-end encryption" }), " is not available when running without a server. Budget files are always kept unencrypted locally, and encryption is only applied when sending data to a server."] }), ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption", linkColor: "purple", children: _jsx(Trans, { children: "Learn more" }) })] }) }));
}
