import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
export function ConfirmTransactionEditModal({ onCancel, onConfirm, confirmReason, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const narrowButtonStyle = isNarrowWidth
        ? {
            height: styles.mobileMinHeight,
        }
        : {};
    return (_jsx(Modal, { name: "confirm-transaction-edit", containerProps: { style: { width: '30vw' } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Reconciled Transaction'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { lineHeight: 1.5 }, children: [confirmReason === 'batchDeleteWithReconciled' ? (_jsx(Block, { children: _jsx(Trans, { children: "Deleting reconciled transactions may bring your reconciliation out of balance." }) })) : confirmReason === 'batchEditWithReconciled' ? (_jsx(Block, { children: _jsx(Trans, { children: "Editing reconciled transactions may bring your reconciliation out of balance." }) })) : confirmReason === 'batchDuplicateWithReconciled' ? (_jsx(Block, { children: _jsx(Trans, { children: "Duplicating reconciled transactions may bring your reconciliation out of balance." }) })) : confirmReason === 'editReconciled' ? (_jsx(Block, { children: _jsx(Trans, { children: "Saving your changes to this reconciled transaction may bring your reconciliation out of balance." }) })) : confirmReason === 'unlockReconciled' ? (_jsx(Block, { children: _jsx(Trans, { children: "Unlocking this transaction means you won\u2018t be warned about changes that can impact your reconciled balance. (Changes to amount, account, payee, etc)." }) })) : confirmReason === 'deleteReconciled' ? (_jsx(Block, { children: _jsx(Trans, { children: "Deleting reconciled transactions may bring your reconciliation out of balance." }) })) : (_jsx(Block, { children: _jsx(Trans, { children: "Are you sure you want to edit this transaction?" }) })), _jsxs(View, { style: {
                                marginTop: 20,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }, children: [_jsx(Button, { "aria-label": t('Cancel'), style: {
                                        marginRight: 10,
                                        ...narrowButtonStyle,
                                    }, onPress: () => {
                                        close();
                                        onCancel();
                                    }, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(InitialFocus, { children: _jsx(Button, { "aria-label": t('Confirm'), variant: "primary", style: {
                                            marginRight: 10,
                                            ...narrowButtonStyle,
                                        }, onPress: () => {
                                            close();
                                            onConfirm();
                                        }, children: _jsx(Trans, { children: "Confirm" }) }) })] })] })] })) }));
}
