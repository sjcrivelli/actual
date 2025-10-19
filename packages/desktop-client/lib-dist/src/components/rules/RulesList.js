import { jsx as _jsx } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
import { RuleRow } from './RuleRow';
export function RulesList({ rules, selectedItems, hoveredRule, onHover, onEditRule, onDeleteRule, }) {
    if (rules.length === 0) {
        return null;
    }
    return (_jsx(View, { children: rules.map(rule => {
            const hovered = hoveredRule === rule.id;
            const selected = selectedItems.has(rule.id);
            return (_jsx(RuleRow, { rule: rule, hovered: hovered, selected: selected, onHover: onHover, onEditRule: onEditRule, onDeleteRule: onDeleteRule }, rule.id));
        }) }));
}
