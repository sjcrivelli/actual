import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Menu } from '@actual-app/components/menu';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
export function BudgetPageMenuModal({ onAddCategoryGroup, onToggleHiddenCategories, onSwitchBudgetFile, }) {
    const defaultMenuItemStyle = {
        ...styles.mobileMenuItem,
        color: theme.menuItemText,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
    };
    return (_jsx(Modal, { name: "budget-page-menu", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { showLogo: true, rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(BudgetPageMenu, { getItemStyle: () => defaultMenuItemStyle, onAddCategoryGroup: onAddCategoryGroup, onToggleHiddenCategories: onToggleHiddenCategories, onSwitchBudgetFile: onSwitchBudgetFile })] })) }));
}
function BudgetPageMenu({ onAddCategoryGroup, onToggleHiddenCategories, onSwitchBudgetFile, ...props }) {
    const [showHiddenCategories] = useLocalPref('budget.showHiddenCategories');
    const onMenuSelect = (name) => {
        switch (name) {
            case 'add-category-group':
                onAddCategoryGroup?.();
                break;
            // case 'edit-mode':
            //   onEditMode?.(true);
            //   break;
            case 'toggle-hidden-categories':
                onToggleHiddenCategories?.();
                break;
            case 'switch-budget-file':
                onSwitchBudgetFile?.();
                break;
            default:
                throw new Error(`Unrecognized menu item: ${name}`);
        }
    };
    const { t } = useTranslation();
    return (_jsx(Menu, { ...props, onMenuSelect: onMenuSelect, items: [
            {
                name: 'add-category-group',
                text: t('Add category group'),
            },
            {
                name: 'toggle-hidden-categories',
                text: `${!showHiddenCategories ? t('Show hidden categories') : t('Hide hidden categories')}`,
            },
            {
                name: 'switch-budget-file',
                text: t('Switch budget file'),
            },
        ] }));
}
