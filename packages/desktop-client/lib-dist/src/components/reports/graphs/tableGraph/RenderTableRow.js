import { jsx as _jsx } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
export function RenderTableRow({ index, parent_index, renderRow, mode, metadata, style, }) {
    const child = metadata[index];
    const parent = parent_index !== undefined ? metadata[parent_index] : {};
    const item = parent_index === undefined
        ? child
        : (parent.categories && parent.categories[index]) ||
            {};
    return (_jsx(View, { children: renderRow({
            item,
            mode,
            style,
        }) }));
}
