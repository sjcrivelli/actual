import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
export function FilterMenu({ filterId, onFilterMenuSelect, }) {
    const { t } = useTranslation();
    return (_jsx(Menu, { onMenuSelect: item => {
            onFilterMenuSelect(item);
        }, items: !filterId?.id
            ? [
                { name: 'save-filter', text: t('Save new filter') },
                { name: 'clear-filter', text: t('Clear all conditions') },
            ]
            : filterId?.id !== null && filterId?.status === 'saved'
                ? [
                    { name: 'rename-filter', text: t('Rename') },
                    { name: 'delete-filter', text: t('Delete') },
                    Menu.line,
                    {
                        name: 'save-filter',
                        text: t('Save new filter'),
                        disabled: true,
                    },
                    { name: 'clear-filter', text: t('Clear all conditions') },
                ]
                : [
                    { name: 'rename-filter', text: t('Rename') },
                    { name: 'update-filter', text: t('Update conditions') },
                    { name: 'reload-filter', text: t('Revert changes') },
                    { name: 'delete-filter', text: t('Delete') },
                    Menu.line,
                    { name: 'save-filter', text: t('Save new filter') },
                    { name: 'clear-filter', text: t('Clear all conditions') },
                ] }));
}
