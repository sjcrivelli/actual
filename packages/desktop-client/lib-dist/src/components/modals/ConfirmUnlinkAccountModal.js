import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Paragraph } from '@actual-app/components/paragraph';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
export function ConfirmUnlinkAccountModal({ accountName, isViewBankSyncSettings, onUnlink, }) {
    const { t } = useTranslation();
    return (_jsx(Modal, { name: "confirm-unlink-account", containerProps: { style: { width: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Confirm Unlink'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { lineHeight: 1.5 }, children: [_jsx(Paragraph, { children: _jsxs(Trans, { children: ["Are you sure you want to unlink ", _jsx("strong", { children: accountName }), "?"] }) }), _jsx(Paragraph, { children: isViewBankSyncSettings
                                ? t('Transactions will no longer be synchronized with this account and must be manually entered. You will not be able to edit the bank sync settings for this account and the settings will close.')
                                : t('Transactions will no longer be synchronized with this account and must be manually entered.') }), _jsxs(View, { style: {
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }, children: [_jsx(Button, { style: { marginRight: 10 }, onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(InitialFocus, { children: _jsx(Button, { variant: "primary", onPress: () => {
                                            onUnlink();
                                            close();
                                        }, children: _jsx(Trans, { children: "Unlink" }) }) })] })] })] })) }));
}
