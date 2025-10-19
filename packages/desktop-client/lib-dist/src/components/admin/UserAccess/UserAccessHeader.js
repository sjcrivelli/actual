import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Cell, TableHeader } from '@desktop-client/components/table';
export function UserAccessHeader() {
    const { t } = useTranslation();
    return (_jsxs(TableHeader, { children: [_jsx(Cell, { value: t('Access'), width: 100, style: { paddingLeft: 15 } }), _jsx(Cell, { value: t('User'), width: "flex" }), _jsx(Cell, { value: t('Owner'), width: 100 })] }));
}
