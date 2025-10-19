import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { AccountAutocomplete } from '@desktop-client/components/autocomplete/AccountAutocomplete';
import { ModalCloseButton, Modal, ModalTitle, ModalHeader, } from '@desktop-client/components/common/Modal';
import { SectionLabel } from '@desktop-client/components/forms';
export function AccountAutocompleteModal({ onSelect, includeClosedAccounts, hiddenAccounts, onClose, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const defaultAutocompleteProps = {
        containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
    };
    return (_jsx(Modal, { name: "account-autocomplete", noAnimation: !isNarrowWidth, onClose: onClose, containerProps: {
            style: {
                height: isNarrowWidth
                    ? 'calc(var(--visual-viewport-height) * 0.85)'
                    : 275,
                backgroundColor: theme.menuAutoCompleteBackground,
            },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [isNarrowWidth && (_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: t('Account'), getStyle: () => ({ color: theme.menuAutoCompleteText }) }), rightContent: _jsx(ModalCloseButton, { onPress: close, style: { color: theme.menuAutoCompleteText } }) })), _jsxs(View, { children: [!isNarrowWidth && (_jsx(SectionLabel, { title: t('Account'), style: {
                                alignSelf: 'center',
                                color: theme.menuAutoCompleteText,
                                marginBottom: 10,
                            } })), _jsx(View, { style: { flex: 1 }, children: _jsx(AccountAutocomplete, { focused: true, embedded: true, closeOnBlur: false, onClose: close, ...defaultAutocompleteProps, onSelect: onSelect, includeClosedAccounts: includeClosedAccounts, hiddenAccounts: hiddenAccounts, value: null }) })] })] })) }));
}
