import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { theme } from '@actual-app/components/theme';
import { PayeeAutocomplete } from '@desktop-client/components/autocomplete/PayeeAutocomplete';
import { ModalCloseButton, Modal, ModalTitle, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { usePayees } from '@desktop-client/hooks/usePayees';
export function PayeeAutocompleteModal({ onSelect, onClose, }) {
    const { t } = useTranslation();
    const payees = usePayees() || [];
    const accounts = useAccounts() || [];
    const navigate = useNavigate();
    const { isNarrowWidth } = useResponsive();
    const defaultAutocompleteProps = {
        containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
    };
    const onManagePayees = () => navigate('/payees');
    return (_jsx(Modal, { name: "payee-autocomplete", noAnimation: !isNarrowWidth, onClose: onClose, containerProps: {
            style: {
                height: isNarrowWidth
                    ? 'calc(var(--visual-viewport-height) * 0.85)'
                    : 275,
                backgroundColor: theme.menuAutoCompleteBackground,
            },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [isNarrowWidth && (_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: t('Payee'), getStyle: () => ({ color: theme.menuAutoCompleteText }) }), rightContent: _jsx(ModalCloseButton, { onPress: close, style: { color: theme.menuAutoCompleteText } }) })), _jsx(PayeeAutocomplete, { payees: payees, accounts: accounts, focused: true, embedded: true, closeOnBlur: false, onClose: close, onManagePayees: onManagePayees, showManagePayees: !isNarrowWidth, showMakeTransfer: !isNarrowWidth, ...defaultAutocompleteProps, onSelect: onSelect, value: null })] })) }));
}
