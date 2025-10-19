import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { RuleEditor } from '@desktop-client/components/rules/RuleEditor';
export function EditRuleModal({ rule: defaultRule, onSave: originalOnSave, }) {
    const { t } = useTranslation();
    return (_jsx(Modal, { name: "edit-rule", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Rule'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(RuleEditor, { rule: defaultRule, onSave: rule => {
                        originalOnSave?.(rule);
                        close();
                    }, onCancel: close, style: {
                        maxWidth: '100%',
                        width: 900,
                        height: '80vh',
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: 'auto',
                        overflow: 'hidden',
                        color: theme.pageTextLight,
                    } })] })) }));
}
