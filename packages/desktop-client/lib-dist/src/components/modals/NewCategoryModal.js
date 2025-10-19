import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { SingleInputModal } from './SingleInputModal';
import { ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
export function NewCategoryModal({ onValidate, onSubmit, }) {
    const { t } = useTranslation();
    return (_jsx(SingleInputModal, { name: "new-category", Header: props => (_jsx(ModalHeader, { ...props, title: _jsx(ModalTitle, { title: t('New Category'), shrinkOnOverflow: true }) })), inputPlaceholder: t('Category name'), buttonText: t('Add'), onValidate: onValidate, onSubmit: onSubmit }));
}
