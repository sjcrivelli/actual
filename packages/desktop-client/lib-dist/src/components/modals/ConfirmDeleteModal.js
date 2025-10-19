import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Paragraph } from '@actual-app/components/paragraph';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
export function ConfirmDeleteModal({ message, onConfirm, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const narrowButtonStyle = isNarrowWidth
        ? {
            height: styles.mobileMinHeight,
        }
        : {};
    return (_jsx(Modal, { name: "confirm-delete", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Confirm Delete'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { lineHeight: 1.5 }, children: [_jsx(Paragraph, { children: message }), _jsxs(View, { style: {
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }, children: [_jsx(Button, { style: {
                                        marginRight: 10,
                                        ...narrowButtonStyle,
                                    }, onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(InitialFocus, { children: _jsx(Button, { variant: "primary", style: narrowButtonStyle, onPress: () => {
                                            onConfirm();
                                            close();
                                        }, children: _jsx(Trans, { children: "Delete" }) }) })] })] })] })) }));
}
