import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { SelectCell, Cell, TableHeader, } from '@desktop-client/components/table';
import { useSelectedItems, useSelectedDispatch, } from '@desktop-client/hooks/useSelected';
export function UserDirectoryHeader() {
    const { t } = useTranslation();
    const selectedItems = useSelectedItems();
    const dispatchSelected = useSelectedDispatch();
    return (_jsxs(TableHeader, { style: {}, children: [_jsx(SelectCell, { exposed: true, focused: false, selected: selectedItems.size > 0, onSelect: e => dispatchSelected({ type: 'select-all', isRangeSelect: e.shiftKey }) }), _jsx(Cell, { value: t('Username'), width: "flex" }), _jsx(Cell, { value: t('Display Name'), width: 250 }), _jsx(Cell, { value: t('Role'), width: 100 }), _jsx(Cell, { value: t('Enabled'), width: 100 }), _jsx(Cell, { value: t('Server Owner'), width: 100 }), _jsx(Cell, { value: "", width: 80 })] }));
}
