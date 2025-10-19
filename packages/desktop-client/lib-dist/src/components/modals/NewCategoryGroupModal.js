import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { SingleInputModal } from './SingleInputModal';
import { ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
export function NewCategoryGroupModal({ onValidate, onSubmit, }) {
    const { t } = useTranslation();
    return (_jsx(SingleInputModal, { name: "new-category-group", Header: props => (_jsx(ModalHeader, { ...props, title: _jsx(ModalTitle, { title: t('New Category Group'), shrinkOnOverflow: true }) })), inputPlaceholder: t('Category group name'), buttonText: t('Add'), onValidate: onValidate, onSubmit: onSubmit }));
}
