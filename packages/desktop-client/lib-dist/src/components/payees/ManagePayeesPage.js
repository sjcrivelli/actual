import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ManagePayeesWithData } from './ManagePayeesWithData';
import { Page } from '@desktop-client/components/Page';
export function ManagePayeesPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const locationState = location.state;
    const initialSelectedIds = locationState && 'selectedPayee' in locationState
        ? [locationState.selectedPayee]
        : [];
    return (_jsx(Page, { header: t('Payees'), children: _jsx(ManagePayeesWithData, { initialSelectedIds: initialSelectedIds }) }));
}
