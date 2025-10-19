import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { memo, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgArrowThinRight, SvgBookmark, SvgLightBulb, } from '@actual-app/components/icons/v1';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { PayeeRuleCountLabel } from './PayeeRuleCountLabel';
import { Cell, CellButton, CustomCell, InputCell, Row, SelectCell, } from '@desktop-client/components/table';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useSelectedDispatch, useSelectedItems, } from '@desktop-client/hooks/useSelected';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
function RuleButton({ ruleCount, focused, onEdit, onClick }) {
    return (_jsx(Cell, { name: "rule-count", width: "auto", focused: focused, style: { padding: '0 10px' }, plain: true, children: _jsxs(CellButton, { style: {
                borderRadius: 4,
                padding: '3px 6px',
                backgroundColor: theme.noticeBackground,
                border: '1px solid ' + theme.noticeBackground,
                color: theme.noticeTextDark,
                fontSize: 12,
                cursor: 'pointer',
                ':hover': { backgroundColor: theme.noticeBackgroundLight },
            }, onEdit: onEdit, onSelect: onClick, children: [_jsx(PayeeRuleCountLabel, { count: ruleCount, style: { paddingRight: 5 } }), _jsx(SvgArrowThinRight, { style: { width: 8, height: 8 } })] }) }));
}
export const PayeeTableRow = memo(({ payee, ruleCount, selected, hovered, editing, focusedField, onViewRules, onCreateRule, onHover, onDelete, onEdit, onUpdate, style, }) => {
    const { id } = payee;
    const dispatchSelected = useSelectedDispatch();
    const selectedItems = useSelectedItems();
    const selectedIds = useMemo(() => {
        const ids = selectedItems && selectedItems.size > 0 ? selectedItems : [payee.id];
        return Array.from(new Set(ids));
    }, [payee, selectedItems]);
    const borderColor = selected
        ? theme.tableBorderSelected
        : theme.tableBorder;
    const backgroundFocus = hovered || focusedField === 'select';
    const [learnCategories = 'true'] = useSyncedPref('learn-categories');
    const isLearnCategoriesEnabled = String(learnCategories) === 'true';
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const { setMenuOpen, menuOpen, handleContextMenu, position } = useContextMenu();
    return (_jsxs(Row, { ref: triggerRef, style: {
            alignItems: 'stretch',
            ...style,
            borderColor,
            backgroundColor: hovered
                ? theme.tableRowBackgroundHover
                : selected
                    ? theme.tableRowBackgroundHighlight
                    : backgroundFocus
                        ? theme.tableRowBackgroundHover
                        : theme.tableBackground,
            ...(selected && {
                backgroundColor: theme.tableRowBackgroundHighlight,
                zIndex: 100,
            }),
        }, "data-focus-key": payee.id, onMouseEnter: () => onHover && onHover(payee.id), onContextMenu: handleContextMenu, children: [_jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), ...position, style: { width: 200, margin: 1 }, isNonModal: true, children: _jsx(Menu, { items: [
                        payee.transfer_acct == null && {
                            name: 'delete',
                            text: t('Delete'),
                        },
                        payee.transfer_acct == null && {
                            name: 'favorite',
                            text: payee.favorite ? t('Unfavorite') : t('Favorite'),
                        },
                        ruleCount > 0 && { name: 'view-rules', text: t('View rules') },
                        selectedIds.length === 1 && {
                            name: 'create-rule',
                            text: t('Create rule'),
                        },
                        isLearnCategoriesEnabled &&
                            (payee.learn_categories
                                ? {
                                    name: 'learn',
                                    text: t('Disable learning'),
                                }
                                : { name: 'learn', text: t('Enable learning') }),
                    ], onMenuSelect: name => {
                        switch (name) {
                            case 'delete':
                                onDelete(selectedIds);
                                break;
                            case 'favorite':
                                selectedIds.forEach(id => {
                                    onUpdate(id, 'favorite', !payee.favorite);
                                });
                                break;
                            case 'learn':
                                selectedIds.forEach(id => {
                                    onUpdate(id, 'learn_categories', !payee.learn_categories);
                                });
                                break;
                            case 'view-rules':
                                onViewRules(id);
                                break;
                            case 'create-rule':
                                onCreateRule(id);
                                break;
                            default:
                                throw new Error(`Unrecognized menu option: ${name}`);
                        }
                        setMenuOpen(false);
                    } }) }), _jsx(SelectCell, { exposed: payee.transfer_acct == null && (hovered || selected || editing), focused: focusedField === 'select', selected: selected, onSelect: e => {
                    if (payee.transfer_acct != null) {
                        return;
                    }
                    dispatchSelected({
                        type: 'select',
                        id: payee.id,
                        isRangeSelect: e.shiftKey,
                    });
                } }), _jsx(CustomCell, { width: 20, exposed: !payee.transfer_acct, onBlur: () => { }, onUpdate: () => { }, onClick: () => { }, style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }, children: () => {
                    return (_jsxs(_Fragment, { children: [payee.favorite ? _jsx(SvgBookmark, { style: { width: 10 } }) : null, isLearnCategoriesEnabled && !payee.learn_categories && (_jsx(Tooltip, { content: t('Category learning disabled'), children: _jsx(SvgLightBulb, { style: { color: 'red', width: 10 } }) }))] }));
                } }), _jsx(InputCell, { value: (payee.transfer_acct ? t('Transfer: ') : '') + payee.name, valueStyle: (!selected &&
                    payee.transfer_acct && { color: theme.pageTextSubdued }) ||
                    (!selected && !payee.transfer_acct && { color: theme.tableText }) ||
                    (selected && { color: theme.tableTextSelected }), exposed: focusedField === 'name', width: "flex", onUpdate: value => !payee.transfer_acct && onUpdate(id, 'name', value), onExpose: () => onEdit(id, 'name'), inputProps: { readOnly: !!payee.transfer_acct } }), _jsx(RuleButton, { ruleCount: ruleCount, focused: focusedField === 'rule-count', onEdit: () => onEdit(id, 'rule-count'), onClick: () => ruleCount > 0 ? onViewRules(payee.id) : onCreateRule(payee.id) })] }));
});
PayeeTableRow.displayName = 'PayeeTableRow';
