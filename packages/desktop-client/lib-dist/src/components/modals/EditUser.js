import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { Select } from '@actual-app/components/select';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { PossibleRoles } from 'loot-core/shared/user';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Checkbox, FormField, FormLabel, } from '@desktop-client/components/forms';
import { popModal, } from '@desktop-client/modals/modalsSlice';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
import { signOut } from '@desktop-client/users/usersSlice';
function useGetUserDirectoryErrors() {
    const { t } = useTranslation();
    function getUserDirectoryErrors(reason) {
        switch (reason) {
            case 'unauthorized':
                return t('You are not logged in.');
            case 'token-expired':
                return t('Login expired, please log in again.');
            case 'user-cant-be-empty':
                return t('Please enter a value for the username; the field cannot be empty.');
            case 'role-cant-be-empty':
                return t('Select a role; the field cannot be empty.');
            case 'user-already-exists':
                return t('The username you entered already exists. Please choose a different username.');
            case 'not-all-deleted':
                return t('Not all users were deleted. Check if one of the selected users is the server owner.');
            case 'role-does-not-exists':
                return t('Selected role does not exists, possibly a bug? Visit https://actualbudget.org/contact/ for support.');
            default:
                return t('An internal error occurred, sorry! Visit https://actualbudget.org/contact/ for support. (ref: {{reason}})', { reason });
        }
    }
    return { getUserDirectoryErrors };
}
function useSaveUser() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { getUserDirectoryErrors } = useGetUserDirectoryErrors();
    async function saveUser(method, user, setError) {
        const res = await send(method, user);
        if (!('error' in res)) {
            const newId = res.id;
            if (newId) {
                user.id = newId;
            }
        }
        else {
            const error = res.error;
            setError(getUserDirectoryErrors(error));
            if (error === 'token-expired') {
                dispatch(addNotification({
                    notification: {
                        type: 'error',
                        id: 'login-expired',
                        title: t('Login expired'),
                        sticky: true,
                        message: getUserDirectoryErrors(error),
                        button: {
                            title: t('Go to login'),
                            action: () => {
                                dispatch(signOut());
                            },
                        },
                    },
                }));
            }
            return false;
        }
        return true;
    }
    return { saveUser };
}
export function EditUserFinanceApp({ user: defaultUser, onSave: originalOnSave, }) {
    const { t } = useTranslation();
    const { saveUser } = useSaveUser();
    const isExistingUser = 'id' in defaultUser && !!defaultUser.id;
    return (_jsx(Modal, { name: "edit-user", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: isExistingUser
                        ? t('Edit user {{userName}}', {
                            userName: defaultUser.displayName ?? defaultUser.userName,
                        })
                        : t('Add user'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(EditUser, { defaultUser: defaultUser, onSave: async (method, user, setError) => {
                        if (await saveUser(method, user, setError)) {
                            originalOnSave(user);
                            close();
                        }
                    } })] })) }));
}
function EditUser({ defaultUser, onSave: originalOnSave }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isExistingUser = 'id' in defaultUser && !!defaultUser.id;
    const isOwner = 'owner' in defaultUser && defaultUser.owner;
    const [userName, setUserName] = useState(defaultUser.userName ?? '');
    const [displayName, setDisplayName] = useState(defaultUser.displayName ?? '');
    const [enabled, setEnabled] = useState(defaultUser.enabled);
    const [role, setRole] = useState(defaultUser.role ?? 'BASIC');
    const [error, setError] = useState('');
    async function onSave() {
        if (!userName.trim()) {
            setError(t('Username is required.'));
            return;
        }
        if (!role) {
            setError(t('Role is required.'));
            return;
        }
        const user = {
            ...defaultUser,
            id: isExistingUser ? defaultUser.id : '',
            owner: isOwner,
            userName,
            displayName,
            enabled,
            role,
        };
        const method = isExistingUser ? 'user-update' : 'user-add';
        await originalOnSave(method, user, setError);
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Stack, { direction: "row", style: { marginTop: 10 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Username'), htmlFor: "name-field" }), _jsx(Input, { id: "name-field", value: userName, onChangeValue: setUserName, style: {
                                    borderColor: theme.buttonMenuBorder,
                                } }), _jsx("label", { style: {
                                    ...styles.verySmallText,
                                    color: theme.pageTextLight,
                                    marginTop: 5,
                                }, children: _jsx(Trans, { children: "The username registered within the OpenID provider." }) })] }), _jsxs(View, { style: {
                            flexDirection: 'row',
                            alignItems: 'center',
                            userSelect: 'none',
                        }, children: [' ', _jsx(Checkbox, { id: "enabled-field", checked: enabled, disabled: isOwner, style: {
                                    color: isOwner ? theme.pageTextSubdued : 'inherit',
                                }, onChange: () => setEnabled(!enabled) }), _jsx("label", { htmlFor: "enabled-field", style: { userSelect: 'none' }, children: _jsx(Trans, { children: "Enabled" }) })] })] }), isOwner && (_jsx("label", { style: {
                    ...styles.verySmallText,
                    color: theme.errorText,
                    marginTop: 5,
                }, children: _jsx(Trans, { children: "Change this username with caution; it is the server owner." }) })), _jsx(Stack, { direction: "row", style: { marginTop: 10 }, children: _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Display Name'), htmlFor: "displayname-field" }), _jsx(Input, { id: "displayname-field", value: displayName, onChangeValue: setDisplayName, placeholder: t('(Optional)'), style: {
                                borderColor: theme.buttonMenuBorder,
                            } }), _jsx(View, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                                marginTop: 5,
                            }, children: _jsx(Trans, { children: "If left empty, it will be updated from your OpenID provider on the user's login, if available there." }) }), _jsx(View, { style: {
                                ...styles.verySmallText,
                                color: theme.pageTextLight,
                            }, children: _jsx(Trans, { children: "When displaying user information, this will be shown instead of the username." }) })] }) }), _jsx(Stack, { direction: "row", style: { marginTop: 10, width: '100px' }, children: _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Role'), htmlFor: "role-field" }), _jsx(Select, { id: "role-field", disabled: isOwner, options: Object.entries(PossibleRoles), value: role, onChange: newValue => setRole(newValue), style: {
                                borderColor: theme.buttonMenuBorder,
                            } })] }) }), _jsx(RoleDescription, {}), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 20 }, children: [error && _jsx(Text, { style: { color: theme.errorText }, children: error }), _jsx(Button, { variant: "bare", style: { marginRight: 10 }, onPress: () => dispatch(popModal()), children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", onPress: onSave, children: isExistingUser ? t('Save') : t('Add') })] })] }));
}
const RoleDescription = () => {
    return (_jsxs(View, { style: { paddingTop: 10 }, children: [_jsx(Text, { style: {
                    ...styles.verySmallText,
                    color: theme.pageTextLight,
                }, children: _jsx(Trans, { children: "In our user directory, each user is assigned a specific role that determines their permissions and capabilities within the system." }) }), _jsx(Text, { style: {
                    ...styles.verySmallText,
                    color: theme.pageTextLight,
                }, children: _jsx(Trans, { children: "Understanding these roles is essential for managing users and responsibilities effectively." }) }), _jsxs(View, { style: { paddingTop: 5 }, children: [_jsx("label", { style: {
                            ...styles.altMenuHeaderText,
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: _jsx(Trans, { children: "Basic" }) }), _jsx(Text, { style: {
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: _jsx(Trans, { children: "Users with the Basic role can create new budgets and be invited to collaborate on budgets created by others." }) }), _jsx(Text, { style: {
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: _jsx(Trans, { children: "This role is ideal for users who primarily need to manage their own budgets and participate in shared budget activities." }) })] }), _jsxs(View, { style: { paddingTop: 10 }, children: [_jsx("label", { style: {
                            ...styles.altMenuHeaderText,
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: _jsx(Trans, { children: "Admin" }) }), _jsx(Text, { style: {
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: _jsx(Trans, { children: "Can do everything that Basic users can. In addition, they have the ability to add new users to the directory and access budget files from all users." }) }), _jsx(Text, { style: {
                            ...styles.verySmallText,
                            color: theme.pageTextLight,
                        }, children: _jsx(Trans, { children: "Can also assign ownership of a budget to another person, ensuring efficient budget management." }) })] })] }));
};
