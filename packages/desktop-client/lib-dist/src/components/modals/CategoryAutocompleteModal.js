import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { CategoryAutocomplete } from '@desktop-client/components/autocomplete/CategoryAutocomplete';
import { ModalCloseButton, Modal, ModalTitle, ModalHeader, } from '@desktop-client/components/common/Modal';
import { SectionLabel } from '@desktop-client/components/forms';
import { SheetNameProvider } from '@desktop-client/hooks/useSheetName';
export function CategoryAutocompleteModal({ title, month, onSelect, categoryGroups, showHiddenCategories, closeOnSelect, clearOnSelect, onClose, }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const defaultAutocompleteProps = {
        containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
    };
    return (_jsx(Modal, { name: "category-autocomplete", noAnimation: !isNarrowWidth, onClose: onClose, containerProps: {
            style: {
                height: isNarrowWidth
                    ? 'calc(var(--visual-viewport-height) * 0.85)'
                    : 275,
                backgroundColor: theme.menuAutoCompleteBackground,
            },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [isNarrowWidth && (_jsx(ModalHeader, { title: _jsx(ModalTitle, { title: title || t('Category'), getStyle: () => ({ color: theme.menuAutoCompleteText }) }), rightContent: _jsx(ModalCloseButton, { onPress: close, style: { color: theme.menuAutoCompleteText } }) })), _jsxs(View, { children: [!isNarrowWidth && (_jsx(SectionLabel, { title: t('Category'), style: {
                                alignSelf: 'center',
                                color: theme.menuAutoCompleteText,
                                marginBottom: 10,
                            } })), _jsx(View, { style: { flex: 1 }, children: _jsx(SheetNameProvider, { name: month ? monthUtils.sheetForMonth(month) : '', children: _jsx(CategoryAutocomplete, { focused: true, embedded: true, closeOnBlur: false, closeOnSelect: closeOnSelect, clearOnSelect: clearOnSelect, showSplitOption: false, onClose: close, ...defaultAutocompleteProps, onSelect: onSelect, categoryGroups: categoryGroups, showHiddenCategories: showHiddenCategories, value: null }) }) })] })] })) }));
}
