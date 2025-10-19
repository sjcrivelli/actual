import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { deleteBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useSyncServerStatus } from '@desktop-client/hooks/useSyncServerStatus';
import { useDispatch } from '@desktop-client/redux';
export function DeleteFileModal({ file }) {
    const { t } = useTranslation();
    // If the state is "broken" that means it was created by another
    // user. The current user should be able to delete the local file,
    // but not the remote one
    const isCloudFile = 'cloudFileId' in file && file.state !== 'broken';
    const serverStatus = useSyncServerStatus();
    const dispatch = useDispatch();
    const [loadingState, setLoadingState] = useState(null);
    return (_jsx(Modal, { name: "delete-budget", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Delete {{fileName}}', { fileName: file.name }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        padding: 15,
                        gap: 15,
                        paddingTop: 0,
                        paddingBottom: 25,
                        maxWidth: 512,
                        lineHeight: '1.5em',
                    }, children: [isCloudFile && (_jsxs(_Fragment, { children: [_jsx(Text, { children: _jsxs(Trans, { children: ["This is a ", _jsx("strong", { children: "hosted file" }), " which means it is stored on your server to make it available for download on any device. You can delete it from the server, which will also remove it from all of your devices."] }) }), serverStatus === 'online' ? (_jsx(ButtonWithLoading, { variant: "primary", isLoading: loadingState === 'cloud', style: {
                                        backgroundColor: theme.errorText,
                                        alignSelf: 'center',
                                        border: 0,
                                        padding: '10px 30px',
                                        fontSize: 14,
                                    }, onPress: async () => {
                                        setLoadingState('cloud');
                                        await dispatch(deleteBudget({
                                            id: 'id' in file ? file.id : undefined,
                                            cloudFileId: file.cloudFileId,
                                        }));
                                        setLoadingState(null);
                                        close();
                                    }, children: _jsx(Trans, { children: "Delete file from all devices" }) })) : (_jsx(Button, { isDisabled: true, style: {
                                        alignSelf: 'center',
                                        padding: '10px 30px',
                                        fontSize: 14,
                                    }, children: _jsx(Trans, { children: "Server is not available" }) }))] })), 'id' in file && (_jsxs(_Fragment, { children: [isCloudFile ? (_jsx(Text, { children: _jsx(Trans, { children: "You can also delete just the local copy. This will remove all local data and the file will be listed as available for download." }) })) : (_jsxs(Text, { children: [file.state === 'broken' ? (_jsxs(Trans, { children: ["This is a ", _jsx("strong", { children: "hosted file" }), " but it was created by another user. You can only delete the local copy."] })) : (_jsxs(Trans, { children: ["This a ", _jsx("strong", { children: "local file" }), " which is not stored on a server."] })), ' ', _jsx(Trans, { children: "Deleting it will remove it and all of its backups permanently." })] })), _jsx(ButtonWithLoading, { variant: isCloudFile ? 'normal' : 'primary', isLoading: loadingState === 'local', style: {
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        padding: '10px 30px',
                                        fontSize: 14,
                                        ...(isCloudFile
                                            ? {
                                                color: theme.errorText,
                                                borderColor: theme.errorText,
                                            }
                                            : {
                                                border: 0,
                                                backgroundColor: theme.errorText,
                                            }),
                                    }, onPress: async () => {
                                        setLoadingState('local');
                                        await dispatch(deleteBudget({ id: file.id }));
                                        setLoadingState(null);
                                        close();
                                    }, children: _jsx(Trans, { children: "Delete file locally" }) })] }))] })] })) }));
}
