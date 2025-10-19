import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
import { SvgDelete, SvgMerge } from '@actual-app/components/icons/v0';
import { SvgBookmark, SvgLightBulb } from '@actual-app/components/icons/v1';
import { Menu } from '@actual-app/components/menu';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
export function PayeeMenu({ payeesById, selectedPayees, onDelete, onMerge, onFavorite, onLearn, onClose, }) {
    const { t } = useTranslation();
    const [learnCategories = 'true'] = useSyncedPref('learn-categories');
    const isLearnCategoriesEnabled = String(learnCategories) === 'true';
    // Transfer accounts are never editable
    const isDisabled = [...selectedPayees].some(id => payeesById[id] == null || payeesById[id].transfer_acct);
    const selectedPayeeNames = [...selectedPayees]
        .slice(0, 4)
        .map(id => payeesById[id].name)
        .join(', ');
    const items = [
        {
            icon: SvgDelete,
            name: 'delete',
            text: t('Delete'),
            disabled: isDisabled,
        },
        {
            icon: SvgBookmark,
            iconSize: 9,
            name: 'favorite',
            text: t('Favorite'),
            disabled: isDisabled,
        },
        {
            icon: SvgMerge,
            iconSize: 9,
            name: 'merge',
            text: t('Merge'),
            disabled: isDisabled || selectedPayees.size < 2,
        },
    ];
    if (isLearnCategoriesEnabled) {
        items.push({
            icon: SvgLightBulb,
            iconSize: 9,
            name: 'learn',
            text: t('Category Learning'),
            disabled: isDisabled,
        });
    }
    items.push(Menu.line);
    return (_jsx(Menu, { onMenuSelect: type => {
            onClose();
            switch (type) {
                case 'delete':
                    onDelete();
                    break;
                case 'merge':
                    onMerge();
                    break;
                case 'favorite':
                    onFavorite();
                    break;
                case 'learn':
                    onLearn();
                    break;
                default:
            }
        }, footer: _jsx(View, { style: {
                padding: 3,
                fontSize: 11,
                fontStyle: 'italic',
                color: theme.pageTextSubdued,
            }, children: selectedPayees.size > 4 ? (_jsxs(Trans, { children: [{ selectedPayeeNames }, ", and more"] })) : (selectedPayeeNames) }), items: items }));
}
