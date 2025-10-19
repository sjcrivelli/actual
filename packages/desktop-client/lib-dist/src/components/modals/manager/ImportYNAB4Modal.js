import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { importBudget } from '@desktop-client/budgetfiles/budgetfilesSlice';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useDispatch } from '@desktop-client/redux';
function getErrorMessage(error) {
    switch (error) {
        case 'not-ynab4':
            return 'This file is not valid. Please select a compressed ynab4 zip file.';
        default:
            return 'An unknown error occurred while importing. Please report this as a new issue on GitHub.';
    }
}
export function ImportYNAB4Modal() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [importing, setImporting] = useState(false);
    async function onImport() {
        const res = await window.Actual.openFileDialog({
            properties: ['openFile'],
            filters: [{ name: 'ynab', extensions: ['zip'] }],
        });
        if (res) {
            setImporting(true);
            setError(null);
            try {
                await dispatch(importBudget({ filepath: res[0], type: 'ynab4' }));
                navigate('/budget');
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setImporting(false);
            }
        }
    }
    return (_jsx(Modal, { name: "import-ynab4", containerProps: { style: { width: 400 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Import from YNAB4'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { ...styles.smallText, lineHeight: 1.5, marginTop: 20 }, children: [error && (_jsx(Block, { style: { color: theme.errorText, marginBottom: 15 }, children: getErrorMessage(error) })), _jsxs(View, { style: { alignItems: 'center' }, children: [_jsx(Paragraph, { children: _jsxs(Trans, { children: ["To import data from YNAB4, locate where your YNAB4 data is stored. It is usually in your Documents folder under YNAB. Your data is a directory inside that with the", _jsx("code", { children: ".ynab4" }), " suffix."] }) }), _jsx(Paragraph, { children: _jsxs(Trans, { children: ["When you\u2019ve located your data,", ' ', _jsx("strong", { children: "compress it into a zip file" }), ". On macOS, right-click the folder and select \u201CCompress\u201D. On Windows, right-click and select \u201CSend to \u2192 Compressed (zipped) folder\u201D. Upload the zipped folder for importing."] }) }), _jsx(View, { children: _jsx(ButtonWithLoading, { variant: "primary", autoFocus: true, isLoading: importing, onPress: onImport, children: _jsx(Trans, { children: "Select zip file..." }) }) })] })] })] })) }));
}
