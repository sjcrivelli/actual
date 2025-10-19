import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { ManageTags } from './ManageTags';
import { Page } from '@desktop-client/components/Page';
export const ManageTagsPage = () => {
    const { t } = useTranslation();
    return (_jsx(Page, { header: t('Tags'), children: _jsx(ManageTags, {}) }));
};
