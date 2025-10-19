import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { Fragment, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheckAll, SvgUncheckAll, SvgViewHide, SvgViewShow, } from '@actual-app/components/icons/v2';
import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import { GraphButton } from './GraphButton';
import { Checkbox } from '@desktop-client/components/forms';
export function CategorySelector({ categoryGroups, selectedCategories, setSelectedCategories, showHiddenCategories = true, }) {
    const { t } = useTranslation();
    const [uncheckedHidden, setUncheckedHidden] = useState(false);
    const filteredGroup = (categoryGroup) => {
        return categoryGroup.categories.filter(f => {
            return showHiddenCategories || !f.hidden ? true : false;
        });
    };
    const selectAll = [];
    categoryGroups.map(categoryGroup => filteredGroup(categoryGroup).map(category => selectAll.push(category)));
    if (selectedCategories === undefined) {
        selectedCategories = categoryGroups.flatMap(cg => cg.categories);
    }
    const selectedCategoryMap = useMemo(() => selectedCategories.map(selected => selected.id), [selectedCategories]);
    const allCategoriesSelected = selectAll.every(category => selectedCategoryMap.includes(category.id));
    const allCategoriesUnselected = !selectAll.some(category => selectedCategoryMap.includes(category.id));
    return (_jsxs(View, { children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                    flexShrink: 0,
                }, children: [_jsx(Button, { variant: "bare", onPress: () => setUncheckedHidden(state => !state), style: { padding: 8 }, children: _jsx(View, { children: uncheckedHidden ? (_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(SvgViewShow, { width: 15, height: 15, style: { marginRight: 5 } }), _jsx(Text, { children: _jsx(Trans, { children: "Show unchecked" }) })] })) : (_jsxs(View, { style: {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }, children: [_jsx(SvgViewHide, { width: 15, height: 15, style: { marginRight: 5 } }), _jsx(Text, { style: {
                                            maxWidth: 100,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }, children: _jsx(Trans, { children: "Hide unchecked" }) })] })) }) }), _jsx(View, { style: { flex: 1 } }), _jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(GraphButton, { selected: allCategoriesSelected, title: t('Select All'), onSelect: () => {
                                    setSelectedCategories(selectAll);
                                }, style: { marginRight: 5, padding: 8 }, children: _jsx(SvgCheckAll, { width: 15, height: 15 }) }), _jsx(GraphButton, { selected: allCategoriesUnselected, title: t('Unselect All'), onSelect: () => {
                                    setSelectedCategories([]);
                                }, style: { padding: 8 }, children: _jsx(SvgUncheckAll, { width: 15, height: 15 }) })] })] }), _jsx("ul", { style: {
                    listStyle: 'none',
                    marginLeft: 0,
                    paddingLeft: 0,
                    paddingRight: 10,
                    flexGrow: 1,
                    overflowY: 'auto',
                }, children: categoryGroups &&
                    categoryGroups.map(categoryGroup => {
                        const allCategoriesInGroupSelected = filteredGroup(categoryGroup).every(category => selectedCategories.some(selectedCategory => selectedCategory.id === category.id));
                        const noCategorySelected = filteredGroup(categoryGroup).every(category => !selectedCategories.some(selectedCategory => selectedCategory.id === category.id));
                        return (_jsxs(Fragment, { children: [_jsxs("li", { style: {
                                        display: noCategorySelected && uncheckedHidden ? 'none' : 'flex',
                                        marginBottom: 8,
                                        flexDirection: 'row',
                                    }, children: [_jsx(Checkbox, { id: `form_${categoryGroup.id}`, checked: allCategoriesInGroupSelected, onChange: () => {
                                                const selectedCategoriesExcludingGroupCategories = selectedCategories.filter(selectedCategory => !filteredGroup(categoryGroup).some(groupCategory => groupCategory.id === selectedCategory.id));
                                                if (allCategoriesInGroupSelected) {
                                                    setSelectedCategories(selectedCategoriesExcludingGroupCategories);
                                                }
                                                else {
                                                    setSelectedCategories(selectedCategoriesExcludingGroupCategories.concat(filteredGroup(categoryGroup)));
                                                }
                                            } }), _jsx("label", { htmlFor: `form_${categoryGroup.id}`, style: { userSelect: 'none', fontWeight: 'bold' }, children: categoryGroup.name })] }), _jsx("li", { children: _jsx("ul", { style: {
                                            listStyle: 'none',
                                            marginLeft: 0,
                                            marginBottom: 10,
                                            paddingLeft: 10,
                                        }, children: filteredGroup(categoryGroup).map(category => {
                                            const isChecked = selectedCategories.some(selectedCategory => selectedCategory.id === category.id);
                                            return (_jsxs("li", { style: {
                                                    display: !isChecked && uncheckedHidden ? 'none' : 'flex',
                                                    flexDirection: 'row',
                                                    marginBottom: 4,
                                                }, children: [_jsx(Checkbox, { id: `form_${category.id}`, checked: isChecked, onChange: () => {
                                                            if (isChecked) {
                                                                setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory.id !== category.id));
                                                            }
                                                            else {
                                                                setSelectedCategories([
                                                                    ...selectedCategories,
                                                                    category,
                                                                ]);
                                                            }
                                                        } }), _jsx("label", { htmlFor: `form_${category.id}`, style: { userSelect: 'none' }, children: category.name })] }, category.id));
                                        }) }) })] }, categoryGroup.id));
                    }) })] }));
}
