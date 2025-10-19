import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Paragraph } from '@actual-app/components/paragraph';
import { View } from '@actual-app/components/view';
import { Modal, ModalHeader } from '@desktop-client/components/common/Modal';
export function GoCardlessLink() {
    const { t } = useTranslation();
    window.close();
    return (_jsxs(Modal, { name: "gocardless-link", isDismissable: false, children: [_jsx(ModalHeader, { title: t('Account sync') }), _jsxs(View, { style: { maxWidth: 500 }, children: [_jsx(Paragraph, { children: _jsx(Trans, { children: "Please wait..." }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "The window should close automatically. If nothing happened you can close this window or tab." }) })] })] }));
}
