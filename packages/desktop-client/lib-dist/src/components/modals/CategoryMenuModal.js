import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgDotsHorizontalTriple, SvgTrash, } from '@actual-app/components/icons/v1';
import { SvgNotesPaper, SvgViewHide, SvgViewShow, } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, ModalTitle, } from '@desktop-client/components/common/Modal';
import { Notes } from '@desktop-client/components/Notes';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { useCategoryGroup } from '@desktop-client/hooks/useCategoryGroup';
import { useNotes } from '@desktop-client/hooks/useNotes';
export function CategoryMenuModal({ categoryId, onSave, onEditNotes, onDelete, onToggleVisibility, onClose, }) {
    const { t } = useTranslation();
    const category = useCategory(categoryId);
    const categoryGroup = useCategoryGroup(category?.group);
    const originalNotes = useNotes(category.id);
    const onRename = newName => {
        if (newName && newName !== category.name) {
            onSave?.({
                ...category,
                name: newName,
            });
        }
    };
    const _onToggleVisibility = () => {
        onToggleVisibility?.(category.id);
    };
    const _onEditNotes = () => {
        onEditNotes?.(category.id);
    };
    const _onDelete = () => {
        onDelete?.(category.id);
    };
    const buttonStyle = {
        ...styles.mediumText,
        height: styles.mobileMinHeight,
        color: theme.formLabelText,
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%',
    };
    return (_jsx(Modal, { name: "category-menu", onClose: onClose, containerProps: {
            style: { height: '45vh' },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { leftContent: _jsx(AdditionalCategoryMenu, { category: category, categoryGroup: categoryGroup, onDelete: _onDelete, onToggleVisibility: _onToggleVisibility }), title: _jsx(ModalTitle, { isEditable: true, title: category.name, onTitleUpdate: onRename }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        flex: 1,
                        flexDirection: 'column',
                    }, children: [_jsx(View, { style: {
                                overflowY: 'auto',
                                flex: 1,
                            }, children: _jsx(Notes, { notes: originalNotes?.length > 0 ? originalNotes : t('No notes'), editable: false, focused: false, getStyle: () => ({
                                    borderRadius: 6,
                                    ...((!originalNotes || originalNotes.length === 0) && {
                                        justifySelf: 'center',
                                        alignSelf: 'center',
                                        color: theme.pageTextSubdued,
                                    }),
                                }) }) }), _jsx(View, { style: {
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignContent: 'space-between',
                                paddingTop: 10,
                            }, children: _jsxs(Button, { style: buttonStyle, onPress: _onEditNotes, children: [_jsx(SvgNotesPaper, { width: 20, height: 20, style: { paddingRight: 5 } }), _jsx(Trans, { children: "Edit notes" })] }) })] })] })) }));
}
function AdditionalCategoryMenu({ category, categoryGroup, onDelete, onToggleVisibility, }) {
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const itemStyle = {
        ...styles.mediumText,
        height: styles.mobileMinHeight,
    };
    const getItemStyle = item => ({
        ...itemStyle,
        ...(item.name === 'delete' && { color: theme.errorTextMenu }),
    });
    return (_jsx(View, { children: _jsxs(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Menu'), onPress: () => {
                setMenuOpen(true);
            }, children: [_jsx(SvgDotsHorizontalTriple, { width: 17, height: 17, style: { color: 'currentColor' } }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, placement: "bottom start", onOpenChange: () => setMenuOpen(false), children: _jsx(Menu, { getItemStyle: getItemStyle, items: [
                            !categoryGroup?.hidden && {
                                name: 'toggleVisibility',
                                text: category.hidden ? t('Show') : t('Hide'),
                                icon: category.hidden ? SvgViewShow : SvgViewHide,
                                iconSize: 16,
                            },
                            !categoryGroup?.hidden && Menu.line,
                            {
                                name: 'delete',
                                text: t('Delete'),
                                icon: SvgTrash,
                                iconSize: 15,
                            },
                        ], onMenuSelect: itemName => {
                            setMenuOpen(false);
                            if (itemName === 'delete') {
                                onDelete();
                            }
                            else if (itemName === 'toggleVisibility') {
                                onToggleVisibility();
                            }
                        } }) })] }) }));
}
