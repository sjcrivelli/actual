import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { isNonProductionEnvironment } from 'loot-core/shared/environment';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { ManageRules } from '@desktop-client/components/ManageRules';
export function ManageRulesModal({ payeeId }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    if (isNonProductionEnvironment()) {
        if (location.pathname !== '/payees') {
            throw new Error(`Possibly invalid use of ManageRulesModal, add the current url \`${location.pathname}\` to the allowlist if you’re confident the modal can never appear on top of the \`/rules\` page.`);
        }
    }
    return (_jsx(Modal, { name: "manage-rules", isLoading: loading, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Rules'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(ManageRules, { isModal: true, payeeId: payeeId, setLoading: setLoading })] })) }));
}
