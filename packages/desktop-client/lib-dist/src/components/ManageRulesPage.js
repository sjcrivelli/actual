import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { ManageRules } from './ManageRules';
import { Page } from './Page';
export function ManageRulesPage() {
    const { t } = useTranslation();
    return (_jsx(Page, { header: t('Rules'), children: _jsx(ManageRules, { isModal: false, payeeId: null }) }));
}
