import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgAdd } from '@actual-app/components/icons/v1';
import { SvgSearchAlternate } from '@actual-app/components/icons/v2';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { getNormalisedString } from 'loot-core/shared/normalisation';
import { TagCreationRow } from './TagCreationRow';
import { TagsHeader } from './TagsHeader';
import { TagsList } from './TagsList';
import { Search } from '@desktop-client/components/common/Search';
import { SelectedProvider, useSelected, } from '@desktop-client/hooks/useSelected';
import { useTags } from '@desktop-client/hooks/useTags';
import { useDispatch } from '@desktop-client/redux';
import { deleteAllTags, findTags } from '@desktop-client/tags/tagsSlice';
export function ManageTags() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');
    const [hoveredTag, setHoveredTag] = useState();
    const [create, setCreate] = useState(false);
    const tags = useTags();
    const filteredTags = useMemo(() => {
        return filter === ''
            ? tags
            : tags.filter(tag => getNormalisedString(tag.tag).includes(getNormalisedString(filter)));
    }, [filter, tags]);
    const selectedInst = useSelected('manage-tags', filteredTags, []);
    const onDeleteSelected = useCallback(async () => {
        dispatch(deleteAllTags([...selectedInst.items]));
        selectedInst.dispatch({ type: 'select-none' });
    }, [dispatch, selectedInst]);
    return (_jsx(SelectedProvider, { instance: selectedInst, children: _jsxs(View, { children: [_jsx(View, { style: {
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0 0 15px',
                        flexShrink: 0,
                    }, children: _jsx(View, { style: {
                            color: theme.pageTextLight,
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '50%',
                        }, children: _jsx(Trans, { children: "User defined tags with color and description." }) }) }), _jsxs(Stack, { spacing: 2, direction: "row", align: "center", style: { marginTop: 12 }, children: [_jsxs(Button, { variant: "bare", onPress: () => setCreate(true), children: [_jsx(SvgAdd, { width: 10, height: 10, style: { marginRight: 3 } }), _jsx(Trans, { children: "Add New" })] }), _jsxs(Button, { variant: "bare", onPress: () => dispatch(findTags()), children: [_jsx(SvgSearchAlternate, { width: 10, height: 10, style: { marginRight: 3 } }), _jsx(Trans, { children: "Find Existing Tags" })] }), _jsx(View, { style: { flex: 1 } }), _jsx(Search, { placeholder: t('Filter tags...'), value: filter, onChange: setFilter })] }), _jsxs(View, { style: { flex: 1, marginTop: 12 }, children: [_jsx(TagsHeader, {}), create && (_jsx(TagCreationRow, { onClose: () => setCreate(false), tags: tags })), tags.length ? (_jsx(TagsList, { tags: filteredTags, selectedItems: selectedInst.items, hoveredTag: hoveredTag, onHover: id => setHoveredTag(id ?? undefined) })) : (_jsx(View, { style: {
                                background: theme.tableBackground,
                                fontStyle: 'italic',
                            }, children: _jsx(Text, { style: { margin: 'auto', padding: '20px' }, children: _jsx(Trans, { children: "No Tags" }) }) }))] }), _jsx(View, { style: {
                        paddingBlock: 15,
                        paddingInline: 0,
                        borderTop: theme.pillBorder,
                        flexShrink: 0,
                    }, children: _jsx(Stack, { direction: "row", align: "center", justify: "flex-end", spacing: 2, children: selectedInst.items.size > 0 && (_jsx(Button, { onPress: onDeleteSelected, children: _jsxs(Trans, { count: selectedInst.items.size, children: ["Delete ", selectedInst.items.size, " tags"] }) })) }) })] }) }));
}
