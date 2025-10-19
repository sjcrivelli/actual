import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgPencil1 } from '@actual-app/components/icons/v2';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { loadAllFiles } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
function FileLocationSettings() {
    const [documentDir, _setDocumentDirPref] = useGlobalPref('documentDir');
    const [_documentDirChanged, setDirChanged] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    async function onChooseDocumentDir() {
        const chosenDirectory = await window.Actual.openFileDialog({
            properties: ['openDirectory'],
        });
        if (chosenDirectory && documentDir && chosenDirectory[0] !== documentDir) {
            setDirChanged(true);
            dispatch(pushModal({
                modal: {
                    name: 'confirm-change-document-dir',
                    options: {
                        currentBudgetDirectory: documentDir,
                        newDirectory: chosenDirectory[0],
                    },
                },
            }));
        }
    }
    return (_jsxs(View, { style: {
            gap: 15,
            backgroundColor: theme.pillBackground,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            padding: 15,
            borderRadius: 4,
            border: '1px solid ' + theme.pillBorderDark,
            width: '100%',
        }, children: [_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Actual\u2019s data directory" }), ' ', _jsx("small", { style: { marginLeft: '0.5rem' }, children: _jsx("i", { children: "where your files are stored" }) })] }) }), _jsxs(View, { style: { flexDirection: 'row', gap: '0.5rem', width: '100%' }, children: [_jsx(Text, { title: documentDir, style: {
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
                        }, children: documentDir }), _jsx(Button, { onPress: onChooseDocumentDir, "aria-label": t('Change location'), children: _jsx(SvgPencil1, { style: {
                                width: 11,
                                height: 11,
                            } }) })] })] }));
}
function SelfSignedCertLocationSettings() {
    const [serverSelfSignedCertPref, _setServerSelfSignedCertPref] = useGlobalPref('serverSelfSignedCert');
    if (!serverSelfSignedCertPref) {
        return null;
    }
    return (_jsxs(View, { style: {
            gap: 15,
            backgroundColor: theme.pillBackground,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            padding: 15,
            borderRadius: 4,
            border: '1px solid ' + theme.pillBorderDark,
            width: '100%',
        }, children: [_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Server self-signed certificate" }), ' ', _jsx("small", { style: { marginLeft: '0.5rem' }, children: _jsx("i", { children: "enables a secure connection" }) })] }) }), _jsx(View, { style: { flexDirection: 'row', gap: '0.5rem', width: '100%' }, children: _jsx(Text, { title: serverSelfSignedCertPref, style: {
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
                    }, children: serverSelfSignedCertPref }) })] }));
}
export function FilesSettingsModal() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    function closeModal(close) {
        dispatch(loadAllFiles());
        close();
    }
    return (_jsx(Modal, { name: "files-settings", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Settings'), rightContent: _jsx(ModalCloseButton, { onPress: () => closeModal(close) }) }), _jsxs(View, { style: {
                        padding: 15,
                        gap: 15,
                        paddingTop: 0,
                        paddingBottom: 25,
                        maxWidth: 550,
                        lineHeight: '1.5em',
                    }, children: [_jsx(FileLocationSettings, {}), _jsx(SelfSignedCertLocationSettings, {}), _jsx(Button, { variant: "primary", style: {
                                padding: '10px 30px',
                                fontSize: 14,
                                alignSelf: 'center',
                            }, onPress: () => closeModal(close), children: _jsx(Trans, { children: "OK" }) })] })] })) }));
}
