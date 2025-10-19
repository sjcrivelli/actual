import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { memo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgRightArrow2 } from '@actual-app/components/icons/v0';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { friendlyOp, translateRuleStage } from 'loot-core/shared/rules';
import { ActionExpression } from './ActionExpression';
import { ConditionExpression } from './ConditionExpression';
import { SelectCell, Row, Field, Cell } from '@desktop-client/components/table';
import { useContextMenu } from '@desktop-client/hooks/useContextMenu';
import { useSelectedDispatch } from '@desktop-client/hooks/useSelected';
import { groupActionsBySplitIndex } from '@desktop-client/util/ruleUtils';
export const RuleRow = memo(({ rule, hovered, selected, onHover, onEditRule, onDeleteRule, }) => {
    const dispatchSelected = useSelectedDispatch();
    const borderColor = selected ? theme.tableBorderSelected : 'none';
    const backgroundFocus = hovered;
    const actionSplits = groupActionsBySplitIndex(rule.actions);
    const hasSplits = actionSplits.length > 1;
    const hasSchedule = rule.actions.some(({ op }) => op === 'link-schedule');
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const { setMenuOpen, menuOpen, handleContextMenu, position } = useContextMenu();
    return (_jsxs(Row, { ref: triggerRef, height: "auto", style: {
            fontSize: 13,
            zIndex: selected ? 101 : 'auto',
            borderColor,
            backgroundColor: selected
                ? theme.tableRowBackgroundHighlight
                : backgroundFocus
                    ? theme.tableRowBackgroundHover
                    : theme.tableBackground,
        }, collapsed: true, onMouseEnter: () => onHover && onHover(rule.id), onMouseLeave: () => onHover && onHover(null), onContextMenu: handleContextMenu, children: [_jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), ...position, style: { width: 200, margin: 1 }, isNonModal: true, children: _jsx(Menu, { items: [
                        onEditRule && { name: 'edit', text: t('Edit') },
                        onDeleteRule &&
                            !hasSchedule && { name: 'delete', text: t('Delete') },
                    ], onMenuSelect: name => {
                        switch (name) {
                            case 'delete':
                                onDeleteRule(rule);
                                break;
                            case 'edit':
                                onEditRule(rule);
                                break;
                            default:
                                throw new Error(`Unrecognized menu option: ${name}`);
                        }
                        setMenuOpen(false);
                    } }) }), _jsx(SelectCell, { exposed: hovered || selected, focused: true, onSelect: e => {
                    dispatchSelected({
                        type: 'select',
                        id: rule.id,
                        isRangeSelect: e.shiftKey,
                    });
                }, selected: selected }), _jsx(Cell, { name: "stage", width: 50, plain: true, style: { color: theme.tableText }, children: rule.stage && (_jsx(View, { style: {
                        alignSelf: 'flex-start',
                        margin: 5,
                        backgroundColor: theme.pillBackgroundSelected,
                        color: theme.pillTextSelected,
                        borderRadius: 4,
                        padding: '3px 5px',
                    }, children: translateRuleStage(rule.stage) })) }), _jsx(Field, { width: "flex", style: { padding: '15px 0' }, truncate: false, children: _jsxs(Stack, { direction: "row", align: "center", children: [_jsx(View, { style: { flex: 1, alignItems: 'flex-start' }, "data-testid": "conditions", children: rule.conditions.map((cond, i) => (_jsx(ConditionExpression, { field: cond.field, op: cond.op, inline: true, value: cond.value, options: cond.options, prefix: i > 0 ? friendlyOp(rule.conditionsOp) : null, style: i !== 0 && { marginTop: 3 } }, i))) }), _jsx(Text, { children: _jsx(SvgRightArrow2, { style: { width: 12, height: 12, color: theme.tableText } }) }), _jsx(View, { style: { flex: 1, alignItems: 'flex-start' }, "data-testid": "actions", children: hasSplits
                                ? actionSplits.map((split, i) => (_jsxs(View, { style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        marginTop: i > 0 ? 3 : 0,
                                        padding: '5px',
                                        borderColor: theme.tableBorder,
                                        borderWidth: '1px',
                                        borderRadius: '5px',
                                    }, children: [_jsx(Text, { style: {
                                                ...styles.smallText,
                                                color: theme.pageTextLight,
                                                marginBottom: 6,
                                            }, children: i ? t('Split {{num}}', { num: i }) : t('Apply to all') }), split.actions.map((action, j) => (_jsx(ActionExpression, { ...action, style: j !== 0 && { marginTop: 3 } }, j)))] }, split.id)))
                                : rule.actions.map((action, i) => (_jsx(ActionExpression, { ...action, style: i !== 0 && { marginTop: 3 } }, i))) })] }) }), _jsx(Cell, { name: "edit", plain: true, style: { padding: '0 15px', paddingLeft: 5 }, children: _jsx(Button, { onPress: () => onEditRule(rule), children: _jsx(Trans, { children: "Edit" }) }) })] }));
});
RuleRow.displayName = 'RuleRow';
