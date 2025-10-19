import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
export function SaveReportMenu({ onMenuSelect, savedStatus, listReports, }) {
    const { t } = useTranslation();
    const savedMenu = savedStatus === 'saved'
        ? [
            { name: 'rename-report', text: t('Rename') },
            { name: 'delete-report', text: t('Delete') },
            Menu.line,
        ]
        : [];
    const modifiedMenu = savedStatus === 'modified'
        ? [
            { name: 'rename-report', text: t('Rename') },
            {
                name: 'update-report',
                text: t('Update report'),
            },
            {
                name: 'reload-report',
                text: t('Revert changes'),
            },
            { name: 'delete-report', text: t('Delete') },
            Menu.line,
        ]
        : [];
    const unsavedMenu = [
        {
            name: 'save-report',
            text: t('Save new report'),
        },
        {
            name: 'reset-report',
            text: t('Reset to default'),
        },
        Menu.line,
        {
            name: 'choose-report',
            text: t('Choose Report'),
            disabled: listReports > 0 ? false : true,
        },
    ];
    return (_jsx(Menu, { onMenuSelect: item => {
            onMenuSelect(item);
        }, items: [...savedMenu, ...modifiedMenu, ...unsavedMenu] }));
}
