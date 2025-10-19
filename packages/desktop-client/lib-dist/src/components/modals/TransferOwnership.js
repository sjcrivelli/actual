import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { getUserAccessErrors } from 'loot-core/shared/errors';
import { closeAndLoadBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { popModal, } from '@desktop-client/modals/modalsSlice';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch, useSelector } from '@desktop-client/redux';
export function TransferOwnership({ onSave: originalOnSave, }) {
    const { t } = useTranslation();
    const userData = useSelector(state => state.user.data);
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [cloudFileId] = useMetadataPref('cloudFileId');
    const allFiles = useSelector(state => state.budgetfiles.allFiles || []);
    const remoteFiles = allFiles.filter(f => f.state === 'remote' || f.state === 'synced' || f.state === 'detached');
    const currentFile = remoteFiles.find(f => f.cloudFileId === cloudFileId);
    const dispatch = useDispatch();
    const [isTransferring, setIsTransferring] = useState(false);
    useEffect(() => {
        send('users-get').then((data) => {
            if (!data) {
                setAvailableUsers([]);
            }
            else if ('error' in data) {
                dispatch(addNotification({
                    notification: {
                        type: 'error',
                        title: t('Error getting users'),
                        message: t('Failed to complete ownership transfer. Please try again.'),
                        sticky: true,
                    },
                }));
            }
            else {
                setAvailableUsers(data
                    .filter(f => currentFile?.owner !== f.id)
                    .map(user => [
                    user.id,
                    user.displayName
                        ? `${user.displayName} (${user.userName})`
                        : user.userName,
                ]));
            }
        });
    }, [userData?.userId, currentFile?.owner, t, dispatch]);
    async function onSave() {
        if (cloudFileId) {
            const response = await send('transfer-ownership', {
                fileId: cloudFileId,
                newUserId: userId,
            });
            const { error } = response || {};
            if (!error) {
                originalOnSave?.();
            }
            else {
                setError(getUserAccessErrors(error));
            }
        }
        else {
            setError(t('Cloud file ID is missing.'));
        }
    }
    return (_jsx(Modal, { name: "transfer-ownership", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Transfer ownership'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Stack, { direction: "row", style: { marginTop: 10 }, children: _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('User'), htmlFor: "user-field" }), availableUsers.length > 0 && (_jsxs(View, { children: [_jsx(Select, { options: availableUsers, onChange: (newValue) => {
                                            setUserId(newValue);
                                        }, value: userId, defaultLabel: t('Select a user') }), _jsx("label", { style: {
                                            ...styles.verySmallText,
                                            color: theme.pageTextLight,
                                            marginTop: 5,
                                        }, children: _jsx(Trans, { children: "Select a user from the directory to designate as the new budget owner." }) }), _jsx("label", { style: {
                                            ...styles.verySmallText,
                                            color: theme.errorText,
                                            marginTop: 5,
                                        }, children: t('This action is irreversible, ownership of this budget file will only be able to be transferred by the server administrator or new owner.') }), _jsx("label", { style: {
                                            ...styles.verySmallText,
                                            color: theme.errorText,
                                            marginTop: 5,
                                        }, children: _jsx(Trans, { children: "Proceed with caution." }) })] })), availableUsers.length === 0 && (_jsx(Text, { style: {
                                    ...styles.verySmallText,
                                    color: theme.pageTextLight,
                                    marginTop: 5,
                                }, children: _jsx(Trans, { children: "No users available" }) }))] }) }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 20 }, children: [error && _jsx(Text, { style: { color: theme.errorText }, children: error }), _jsx(Button, { style: { marginRight: 10 }, onPress: () => dispatch(popModal()), children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", isDisabled: availableUsers.length === 0 || !userId || isTransferring, onPress: async () => {
                                setIsTransferring(true);
                                try {
                                    await onSave();
                                    await dispatch(closeAndLoadBudget({ fileId: currentFile.id }));
                                    close();
                                }
                                catch (error) {
                                    dispatch(addNotification({
                                        notification: {
                                            type: 'error',
                                            title: t('Failed to transfer ownership'),
                                            message: t('Failed to complete ownership transfer. Please try again.'),
                                            sticky: true,
                                        },
                                    }));
                                    setIsTransferring(false);
                                }
                            }, children: isTransferring ? t('Transferring...') : t('Transfer ownership') })] })] })) }));
}
