import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Cell, TableHeader } from '@desktop-client/components/table';
export function AccountsHeader({ unlinked }) {
    const { t } = useTranslation();
    return (_jsxs(TableHeader, { children: [_jsx(Cell, { value: t('Account'), width: !unlinked ? 250 : 'flex', style: { paddingLeft: '10px' } }), !unlinked && (_jsxs(_Fragment, { children: [_jsx(Cell, { value: t('Bank'), width: "flex", style: { paddingLeft: '10px' } }), _jsx(Cell, { value: t('Last sync'), width: 160, style: { paddingLeft: '10px' } }), _jsx(Cell, { value: "", width: 100, style: { paddingLeft: '10px' } })] }))] }));
}
