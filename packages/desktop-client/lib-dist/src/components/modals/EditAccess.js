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
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField, FormLabel } from '@desktop-client/components/forms';
import { popModal, } from '@desktop-client/modals/modalsSlice';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
import { signOut } from '@desktop-client/users/usersSlice';
export function EditUserAccess({ access: defaultUserAccess, onSave: originalOnSave, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(defaultUserAccess.userId ?? '');
    const [error, setSetError] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    useEffect(() => {
        send('access-get-available-users', defaultUserAccess.fileId).then(data => {
            if ('error' in data) {
                setSetError(data.error);
            }
            else {
                setAvailableUsers(data.map(user => [
                    user.userId,
                    user.displayName
                        ? `${user.displayName} (${user.userName})`
                        : user.userName,
                ]));
            }
        });
    }, [defaultUserAccess.fileId]);
    async function onSave(close) {
        const userAccess = {
            ...defaultUserAccess,
            userId,
        };
        const { error } = await send('access-add', userAccess);
        if (!error) {
            originalOnSave?.(userAccess);
            close();
        }
        else {
            if (error === 'token-expired') {
                dispatch(addNotification({
                    notification: {
                        type: 'error',
                        id: 'login-expired',
                        title: t('Login expired'),
                        sticky: true,
                        message: getUserAccessErrors(error),
                        button: {
                            title: t('Go to login'),
                            action: () => {
                                dispatch(signOut());
                            },
                        },
                    },
                }));
            }
            else {
                setSetError(getUserAccessErrors(error));
            }
        }
    }
    return (_jsx(Modal, { name: "edit-access", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('User Access'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Stack, { direction: "row", style: { marginTop: 10 }, children: _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('User'), htmlFor: "user-field" }), availableUsers.length > 0 && (_jsxs(View, { children: [_jsx(Select, { options: availableUsers, onChange: (newValue) => setUserId(newValue), value: userId }), _jsx("label", { style: {
                                            ...styles.verySmallText,
                                            color: theme.pageTextLight,
                                            marginTop: 5,
                                        }, children: _jsx(Trans, { children: "Select a user from the directory" }) })] })), availableUsers.length === 0 && (_jsx(Text, { style: {
                                    ...styles.verySmallText,
                                    color: theme.pageTextLight,
                                    marginTop: 5,
                                }, children: _jsx(Trans, { children: "No users available to give access" }) }))] }) }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 20 }, children: [error && _jsx(Text, { style: { color: theme.errorText }, children: error }), _jsx(Button, { variant: "bare", style: { marginRight: 10 }, onPress: () => dispatch(popModal()), children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", isDisabled: availableUsers.length === 0, onPress: () => onSave(close), children: defaultUserAccess.userId ? t('Save') : t('Add') })] })] })) }));
}
