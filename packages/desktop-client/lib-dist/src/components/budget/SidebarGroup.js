import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgExpandArrow } from '@actual-app/components/icons/v0';
import { SvgCheveronDown } from '@actual-app/components/icons/v1';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { NotesButton } from '@desktop-client/components/NotesButton';
import { InputCell } from '@desktop-client/components/table';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
export function SidebarGroup({ group, editing, collapsed, dragPreview, innerRef, style, onEdit, onSave, onDelete, onApplyBudgetTemplatesInGroup, onShowNewCategory, onHideNewGroup, onToggleCollapse, }) {
    const { t } = useTranslation();
    const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    const [categoryExpandedStatePref] = useGlobalPref('categoryExpandedState');
    const categoryExpandedState = categoryExpandedStatePref ?? 0;
    const temporary = group.id === 'new';
    const { setMenuOpen, menuOpen, handleContextMenu, resetPosition, position } = useContextMenu();
    const triggerRef = useRef(null);
    const displayed = (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            height: 20,
        }, ref: triggerRef, onClick: () => {
            onToggleCollapse(group.id);
        }, onContextMenu: handleContextMenu, children: [!dragPreview && (_jsx(SvgExpandArrow, { width: 8, height: 8, style: {
                    marginRight: 5,
                    marginLeft: 5,
                    flexShrink: 0,
                    transition: 'transform .1s',
                    transform: collapsed ? 'rotate(-90deg)' : '',
                } })), _jsxs("div", { style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    minWidth: 0,
                }, children: [dragPreview && _jsx(Text, { style: { fontWeight: 500 }, children: "Group: " }), group.name] }), !dragPreview && (_jsxs(_Fragment, { children: [_jsxs(View, { style: { marginLeft: 5, flexShrink: 0 }, children: [_jsx(Button, { variant: "bare", className: "hover-visible", onPress: () => {
                                    resetPosition();
                                    setMenuOpen(true);
                                }, style: { padding: 3 }, children: _jsx(SvgCheveronDown, { width: 14, height: 14 }) }), _jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), style: { width: 200, margin: 1 }, isNonModal: true, ...position, children: _jsx(Menu, { onMenuSelect: type => {
                                        if (type === 'rename') {
                                            onEdit(group.id);
                                        }
                                        else if (type === 'add-category') {
                                            onShowNewCategory(group.id);
                                        }
                                        else if (type === 'delete') {
                                            onDelete(group.id);
                                        }
                                        else if (type === 'toggle-visibility') {
                                            onSave({ ...group, hidden: !group.hidden });
                                        }
                                        else if (type === 'apply-multiple-category-template') {
                                            onApplyBudgetTemplatesInGroup?.(group.categories.filter(c => !c.hidden).map(c => c.id));
                                        }
                                        setMenuOpen(false);
                                    }, items: [
                                        { name: 'add-category', text: t('Add category') },
                                        { name: 'rename', text: t('Rename') },
                                        !group.is_income && {
                                            name: 'toggle-visibility',
                                            text: group.hidden ? t('Show') : t('Hide'),
                                        },
                                        onDelete && { name: 'delete', text: t('Delete') },
                                        ...(isGoalTemplatesEnabled
                                            ? [
                                                {
                                                    name: 'apply-multiple-category-template',
                                                    text: t('Apply budget templates'),
                                                },
                                            ]
                                            : []),
                                    ] }) })] }), _jsx(View, { style: { flex: 1 } }), _jsx(View, { style: { flexShrink: 0 }, children: _jsx(NotesButton, { id: group.id, style: dragPreview && { color: 'currentColor' }, defaultColor: theme.pageTextLight }) })] }))] }));
    return (_jsx(View, { innerRef: innerRef, style: {
            ...style,
            width: 200 + 100 * categoryExpandedState,
            backgroundColor: theme.tableRowHeaderBackground,
            overflow: 'hidden',
            '& .hover-visible': {
                display: 'none',
            },
            ...(!dragPreview && {
                '&:hover .hover-visible': {
                    display: 'flex',
                },
            }),
            ...(dragPreview && {
                paddingLeft: 10,
                zIndex: 10000,
                borderRadius: 6,
                overflow: 'hidden',
            }),
        }, onKeyDown: e => {
            if (e.key === 'Enter') {
                onEdit(null);
                e.stopPropagation();
            }
        }, children: _jsx(InputCell, { value: group.name, formatter: () => displayed, width: "flex", exposed: editing, onUpdate: value => {
                if (temporary) {
                    if (value === '') {
                        onHideNewGroup();
                    }
                    else if (value !== '') {
                        onSave({ id: group.id, name: value });
                    }
                }
                else {
                    onSave({ id: group.id, name: value });
                }
            }, onBlur: () => onEdit(null), style: { fontWeight: 600 }, inputProps: {
                style: { marginLeft: 20 },
                placeholder: temporary ? t('New group name') : '',
            } }) }));
}
