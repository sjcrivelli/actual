import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useRef, useState, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgClose, SvgDotsHorizontalTriple, SvgLockOpen, } from '@actual-app/components/icons/v1';
import { SvgNotesPaper } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { Notes } from '@desktop-client/components/Notes';
import { validateAccountName } from '@desktop-client/components/util/accountValidation';
import { useAccount } from '@desktop-client/hooks/useAccount';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useNotes } from '@desktop-client/hooks/useNotes';
export function AccountMenuModal({ accountId, onSave, onCloseAccount, onReopenAccount, onEditNotes, onClose, }) {
    const { t } = useTranslation();
    const account = useAccount(accountId);
    const accounts = useAccounts();
    const originalNotes = useNotes(`account-${accountId}`);
    const [accountNameError, setAccountNameError] = useState('');
    const [currentAccountName, setCurrentAccountName] = useState(account?.name || t('New Account'));
    const onRename = (newName) => {
        newName = newName.trim();
        if (!account) {
            return;
        }
        if (!newName) {
            setCurrentAccountName(t('Account'));
        }
        else {
            setCurrentAccountName(newName);
        }
        if (newName !== account.name) {
            const renameAccountError = validateAccountName(newName, accountId, accounts);
            if (renameAccountError) {
                setAccountNameError(renameAccountError);
            }
            else {
                setAccountNameError('');
                onSave?.({
                    ...account,
                    name: newName,
                });
            }
        }
    };
    const _onEditNotes = () => {
        if (!account) {
            return;
        }
        onEditNotes?.(account.id);
    };
    const buttonStyle = {
        ...styles.mediumText,
        height: styles.mobileMinHeight,
        color: theme.formLabelText,
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%',
    };
    if (!account) {
        return null;
    }
    return (_jsx(Modal, { name: "account-menu", onClose: onClose, containerProps: {
            style: {
                height: '45vh',
            },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { leftContent: _jsx(AdditionalAccountMenu, { account: account, onClose: onCloseAccount, onReopen: onReopenAccount }), title: _jsxs(Fragment, { children: [_jsx(ModalTitle, { isEditable: true, title: currentAccountName, onTitleUpdate: onRename }), accountNameError && (_jsx(View, { style: { color: theme.warningText }, children: accountNameError }))] }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        flex: 1,
                        flexDirection: 'column',
                    }, children: [_jsx(View, { style: {
                                overflowY: 'auto',
                                flex: 1,
                            }, children: _jsx(Notes, { notes: originalNotes && originalNotes.length > 0
                                    ? originalNotes
                                    : t('No notes'), editable: false, focused: false, getStyle: () => ({
                                    borderRadius: 6,
                                    ...((!originalNotes || originalNotes.length === 0) && {
                                        justifySelf: 'center',
                                        alignSelf: 'center',
                                        color: theme.pageTextSubdued,
                                    }),
                                }) }) }), _jsx(View, { style: {
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                paddingTop: 10,
                            }, children: _jsxs(Button, { style: buttonStyle, onPress: _onEditNotes, children: [_jsx(SvgNotesPaper, { width: 20, height: 20, style: { paddingRight: 5 } }), _jsx(Trans, { children: "Edit notes" })] }) })] })] })) }));
}
function AdditionalAccountMenu({ account, onClose, onReopen, }) {
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const itemStyle = {
        ...styles.mediumText,
        height: styles.mobileMinHeight,
    };
    const getItemStyle = item => ({
        ...itemStyle,
        ...(item.name === 'close' && { color: theme.errorTextMenu }),
    });
    return (_jsx(View, { children: _jsxs(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Menu'), onPress: () => {
                setMenuOpen(true);
            }, children: [_jsx(SvgDotsHorizontalTriple, { width: 17, height: 17, style: { color: 'currentColor' } }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, placement: "bottom start", onOpenChange: () => setMenuOpen(false), children: _jsx(Menu, { getItemStyle: getItemStyle, items: [
                            account.closed
                                ? {
                                    name: 'reopen',
                                    text: t('Reopen account'),
                                    icon: SvgLockOpen,
                                    iconSize: 15,
                                }
                                : {
                                    name: 'close',
                                    text: t('Close account'),
                                    icon: SvgClose,
                                    iconSize: 15,
                                },
                        ], onMenuSelect: name => {
                            setMenuOpen(false);
                            switch (name) {
                                case 'close':
                                    onClose?.(account.id);
                                    break;
                                case 'reopen':
                                    onReopen?.(account.id);
                                    break;
                                default:
                                    throw new Error(`Unrecognized menu option: ${name}`);
                            }
                        } }) })] }) }));
}
