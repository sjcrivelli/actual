import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonWithLoading } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Information } from '@desktop-client/components/alerts';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Checkbox } from '@desktop-client/components/forms';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { addNotification } from '@desktop-client/notifications/notificationsSlice';
import { useDispatch } from '@desktop-client/redux';
function DirectoryDisplay({ directory }) {
    return (_jsx(View, { style: { flexDirection: 'row', gap: '0.5rem', width: '100%' }, children: _jsx(Text, { title: directory, style: {
                backgroundColor: theme.pageBackground,
                padding: '5px 10px',
                borderRadius: 4,
                overflow: 'auto',
                whiteSpace: 'nowrap',
                width: '100%',
                ...styles.horizontalScrollbar,
                '::-webkit-scrollbar': {
                    height: '8px',
                },
            }, children: directory }) }));
}
export function ConfirmChangeDocumentDirModal({ currentBudgetDirectory, newDirectory, }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [moveFiles, setMoveFiles] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const restartElectronServer = useCallback(() => {
        globalThis.window.Actual.restartElectronServer();
    }, []);
    const [_documentDir, setDocumentDirPref] = useGlobalPref('documentDir', restartElectronServer);
    const moveDirectory = async (close) => {
        setError('');
        setLoading(true);
        try {
            if (moveFiles) {
                await globalThis.window.Actual.moveBudgetDirectory(currentBudgetDirectory, newDirectory);
            }
            setDocumentDirPref(newDirectory);
            dispatch(addNotification({
                notification: {
                    type: 'message',
                    message: t('Actual’s data directory successfully changed.'),
                },
            }));
            close();
        }
        catch (error) {
            console.error('There was an error changing your directory', error);
            setError(t('There was an error changing your directory, please check the directory and try again.'));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(Modal, { name: "confirm-change-document-dir", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Are you sure?'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        padding: 15,
                        gap: 15,
                        paddingTop: 0,
                        paddingBottom: 25,
                        maxWidth: 550,
                        lineHeight: '1.5em',
                    }, children: [_jsxs(View, { style: {
                                gap: 15,
                                backgroundColor: theme.pillBackground,
                                alignSelf: 'flex-start',
                                alignItems: 'flex-start',
                                padding: 15,
                                borderRadius: 4,
                                border: '1px solid ' + theme.pillBorderDark,
                                width: '100%',
                            }, children: [_jsx(Text, { children: _jsx(Trans, { children: "You are about to change Actual\u2019s data directory from:" }) }), _jsx(DirectoryDisplay, { directory: currentBudgetDirectory }), _jsx(Text, { children: _jsx(Trans, { children: "To:" }) }), _jsx(DirectoryDisplay, { directory: newDirectory }), _jsxs("label", { htmlFor: "moveFiles", style: {
                                        userSelect: 'none',
                                        flexDirection: 'row',
                                        gap: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }, children: [_jsx(Checkbox, { id: "moveFiles", name: "moveFiles", checked: moveFiles, onChange: () => setMoveFiles(!moveFiles) }), _jsx(Trans, { children: "Move files to new directory" })] }), moveFiles && (_jsx(Information, { style: { color: theme.warningText, padding: 0 }, children: _jsx(Trans, { children: "Files in the destination folder with the same name will be overwritten." }) })), !moveFiles && (_jsx(Information, { style: { padding: 0 }, children: _jsx(Trans, { children: "Your files won\u2019t be moved. You can manually move them to the folder." }) })), error && _jsx(Text, { style: { color: theme.errorText }, children: error })] }), _jsxs(View, { style: {
                                gap: '1rem',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }, children: [_jsx(Button, { variant: "normal", style: {
                                        padding: '10px 30px',
                                        fontSize: 14,
                                        alignSelf: 'center',
                                    }, onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(ButtonWithLoading, { variant: "primary", isLoading: loading, style: {
                                        padding: '10px 30px',
                                        fontSize: 14,
                                        alignSelf: 'center',
                                    }, onPress: () => moveDirectory(close), children: _jsx(Trans, { children: "Change directory" }) })] })] })] })) }));
}
