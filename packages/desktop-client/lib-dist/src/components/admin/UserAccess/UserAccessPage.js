import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { UserAccess } from './UserAccess';
import { Page } from '@desktop-client/components/Page';
export function UserAccessPage() {
    const { t } = useTranslation();
    return (_jsx(Page, { header: t('User Access'), style: {
            borderRadius: '5px',
            marginBottom: '25px',
        }, children: _jsx(UserAccess, { isModal: false }) }));
}
