import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { ItemHeader } from './ItemHeader';
export function FilterList({ items, getItemProps, highlightedIndex, embedded, }) {
    const { t } = useTranslation();
    return (_jsx(View, { children: _jsxs(View, { style: {
                overflow: 'auto',
                padding: '5px 0',
                ...(!embedded && { maxHeight: 175 }),
            }, children: [_jsx(ItemHeader, { title: t('Saved Filters'), type: "filter" }), items.map((item, idx) => {
                    return [
                        _createElement("div", { ...(getItemProps ? getItemProps({ item }) : null), key: item.id, style: {
                                backgroundColor: highlightedIndex === idx
                                    ? theme.menuAutoCompleteBackgroundHover
                                    : 'transparent',
                                padding: 4,
                                paddingLeft: 20,
                                borderRadius: embedded ? 4 : 0,
                            }, "data-testid": `${item.name}-filter-item`, "data-highlighted": highlightedIndex === idx || undefined }, item.name),
                    ];
                })] }) }));
}
