import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function ImportModal() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [error] = useState(false);
    function onSelectType(type) {
        switch (type) {
            case 'ynab4':
                dispatch(pushModal({ modal: { name: 'import-ynab4' } }));
                break;
            case 'ynab5':
                dispatch(pushModal({ modal: { name: 'import-ynab5' } }));
                break;
            case 'actual':
                dispatch(pushModal({ modal: { name: 'import-actual' } }));
                break;
            default:
        }
    }
    function getErrorMessage(error) {
        switch (error) {
            case 'not-ynab4':
                return t('This file is not valid. Please select a .ynab4 file');
            default:
                return t('An unknown error occurred while importing. Please report this as a new issue on GitHub.');
        }
    }
    const itemStyle = {
        padding: 10,
        border: '1px solid ' + theme.tableBorder,
        borderRadius: 6,
        marginBottom: 10,
        display: 'block',
    };
    return (_jsx(Modal, { name: "import", containerProps: { style: { width: 400 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Import From'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { ...styles.smallText, lineHeight: 1.5 }, children: [error && (_jsx(Block, { style: { color: theme.errorText, marginBottom: 15 }, children: getErrorMessage(error) })), _jsx(Text, { style: { marginBottom: 15 }, children: _jsx(Trans, { children: "Select an app to import from, and we\u2019ll guide you through the process." }) }), _jsxs(Button, { style: itemStyle, onPress: () => onSelectType('ynab4'), children: [_jsx("span", { style: { fontWeight: 700 }, children: "YNAB4" }), _jsx(View, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "The old unsupported desktop app" }) })] }), _jsxs(Button, { style: itemStyle, onPress: () => onSelectType('ynab5'), children: [_jsx("span", { style: { fontWeight: 700 }, children: "nYNAB" }), _jsx(View, { style: { color: theme.pageTextLight }, children: _jsx("div", { children: _jsx(Trans, { children: "The newer web app" }) }) })] }), _jsxs(Button, { style: itemStyle, onPress: () => onSelectType('actual'), children: [_jsx("span", { style: { fontWeight: 700 }, children: "Actual" }), _jsx(View, { style: { color: theme.pageTextLight }, children: _jsx("div", { children: _jsx(Trans, { children: "Import a file exported from Actual" }) }) })] })] })] })) }));
}
