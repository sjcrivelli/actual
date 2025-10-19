import { jsx as _jsx } from "react/jsx-runtime";
import { TagRow } from './TagRow';
import { Table, useTableNavigator } from '@desktop-client/components/table';
export function TagsList({ tags, selectedItems, hoveredTag, onHover, }) {
    const tableNavigator = useTableNavigator(tags, [
        'select',
        'color',
        'description',
    ]);
    return (_jsx(Table, { navigator: tableNavigator, items: tags, backgroundColor: "none", renderItem: ({ item: tag, focusedField, onEdit }) => {
            const hovered = hoveredTag === tag.id;
            const selected = selectedItems.has(tag.id);
            return (_jsx(TagRow, { tag: tag, hovered: hovered, selected: selected, onHover: onHover, focusedField: focusedField, onEdit: onEdit }, tag.id));
        } }));
}
