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
export function ImportActualModal() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [importing, setImporting] = useState(false);
    function getErrorMessage(error) {
        switch (error) {
            case 'parse-error':
                return t('Unable to parse file. Please select a JSON file exported from nYNAB.');
            case 'not-ynab5':
                return t('This file is not valid. Please select a JSON file exported from nYNAB.');
            case 'not-zip-file':
                return t('This file is not valid. Please select an unencrypted archive of Actual data.');
            case 'invalid-zip-file':
                return t('This archive is not a valid Actual export file.');
            case 'invalid-metadata-file':
                return t('The metadata file in the given archive is corrupted.');
            default:
                return t('An unknown error occurred while importing. Please report this as a new issue on GitHub.');
        }
    }
    async function onImport() {
        const res = await window.Actual.openFileDialog({
            properties: ['openFile'],
            filters: [{ name: 'actual', extensions: ['zip', 'blob'] }],
        });
        if (res) {
            setImporting(true);
            setError(null);
            try {
                await dispatch(importBudget({ filepath: res[0], type: 'actual' }));
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
    return (_jsx(Modal, { name: "import-actual", containerProps: { style: { width: 400 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Import from Actual export'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: { ...styles.smallText, lineHeight: 1.5, marginTop: 20 }, children: [error && (_jsx(Block, { style: { color: theme.errorText, marginBottom: 15 }, children: getErrorMessage(error) })), _jsxs(View, { style: { '& > div': { lineHeight: '1.7em' } }, children: [_jsx(Paragraph, { children: _jsxs(Trans, { children: ["You can import data from another Actual account or instance. First export your data from a different account, and it will give you a compressed file. This file is a simple zip file that contains the ", _jsx("code", { children: "db.sqlite" }), " and", ' ', _jsx("code", { children: "metadata.json" }), " files."] }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "Select one of these compressed files and import it here." }) }), _jsx(View, { style: { alignSelf: 'center' }, children: _jsx(ButtonWithLoading, { variant: "primary", autoFocus: true, isLoading: importing, onPress: onImport, children: _jsx(Trans, { children: "Select file..." }) }) })] })] })] })) }));
}
