import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { Modal, ModalHeader, ModalCloseButton, } from '@desktop-client/components/common/Modal';
import { BudgetFileSelection } from '@desktop-client/components/manager/BudgetFileSelection';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useSelector } from '@desktop-client/redux';
export function BudgetFileSelectionModal() {
    const { t } = useTranslation();
    const [id] = useMetadataPref('id');
    const currentFile = useSelector(state => state.budgetfiles.allFiles?.find(f => 'id' in f && f.id === id));
    return (_jsx(Modal, { name: "budget-file-selection", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Switch Budget File'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '20px 0',
                    }, children: [_jsx(Text, { style: { fontSize: 17, fontWeight: 400 }, children: _jsx(Trans, { children: "Switching from:" }) }), _jsx(Text, { style: { fontSize: 17, fontWeight: 700 }, children: currentFile?.name })] }), _jsx(BudgetFileSelection, { showHeader: false, quickSwitchMode: true })] })) }));
}
