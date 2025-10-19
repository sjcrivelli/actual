import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
export function CategoryLearning() {
    const { t } = useTranslation();
    const [learnCategories = 'true', setLearnCategories] = useSyncedPref('learn-categories');
    const isLearnCategoriesEnabled = String(learnCategories) === 'true';
    return (_jsx(Modal, { name: "payee-category-learning", containerProps: { style: { width: 600 } }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Category Learning'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Paragraph, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Category Learning" }), " will automatically determine the best category for a transaction and create a rule that sets the category for the payee.", ' ', _jsx(Link, { variant: "external", to: "https://actualbudget.org/docs/budgeting/rules/#automatic-rules", linkColor: "purple", children: "Learn more" })] }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "Disabling Category Learning will not delete any existing rules but will prevent new rules from being created automatically on a global level." }) }), _jsx(Button, { onPress: () => setLearnCategories(String(!isLearnCategoriesEnabled)), variant: isLearnCategoriesEnabled ? 'normal' : 'primary', children: isLearnCategoriesEnabled ? (_jsx(Trans, { children: "Disable category learning" })) : (_jsx(Trans, { children: "Enable category learning" })) })] })) }));
}
