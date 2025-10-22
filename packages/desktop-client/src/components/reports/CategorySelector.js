"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySelector = CategorySelector;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var GraphButton_1 = require("./GraphButton");
var forms_1 = require("@desktop-client/components/forms");
function CategorySelector(_a) {
    var categoryGroups = _a.categoryGroups, selectedCategories = _a.selectedCategories, setSelectedCategories = _a.setSelectedCategories, _b = _a.showHiddenCategories, showHiddenCategories = _b === void 0 ? true : _b;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _c = (0, react_1.useState)(false), uncheckedHidden = _c[0], setUncheckedHidden = _c[1];
    var filteredGroup = function (categoryGroup) {
        return categoryGroup.categories.filter(function (f) {
            return showHiddenCategories || !f.hidden ? true : false;
        });
    };
    var selectAll = [];
    categoryGroups.map(function (categoryGroup) {
        return filteredGroup(categoryGroup).map(function (category) { return selectAll.push(category); });
    });
    if (selectedCategories === undefined) {
        selectedCategories = categoryGroups.flatMap(function (cg) { return cg.categories; });
    }
    var selectedCategoryMap = (0, react_1.useMemo)(function () { return selectedCategories.map(function (selected) { return selected.id; }); }, [selectedCategories]);
    var allCategoriesSelected = selectAll.every(function (category) {
        return selectedCategoryMap.includes(category.id);
    });
    var allCategoriesUnselected = !selectAll.some(function (category) {
        return selectedCategoryMap.includes(category.id);
    });
    return (<view_1.View>
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
            flexShrink: 0,
        }}>
        <button_1.Button variant="bare" onPress={function () { return setUncheckedHidden(function (state) { return !state; }); }} style={{ padding: 8 }}>
          <view_1.View>
            {uncheckedHidden ? (<view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <v2_1.SvgViewShow width={15} height={15} style={{ marginRight: 5 }}/>
                <text_1.Text>
                  <react_i18next_1.Trans>Show unchecked</react_i18next_1.Trans>
                </text_1.Text>
              </view_1.View>) : (<view_1.View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <v2_1.SvgViewHide width={15} height={15} style={{ marginRight: 5 }}/>
                <text_1.Text style={{
                maxWidth: 100,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
                  <react_i18next_1.Trans>Hide unchecked</react_i18next_1.Trans>
                </text_1.Text>
              </view_1.View>)}
          </view_1.View>
        </button_1.Button>
        <view_1.View style={{ flex: 1 }}/>
        <view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <GraphButton_1.GraphButton selected={allCategoriesSelected} title={t('Select All')} onSelect={function () {
            setSelectedCategories(selectAll);
        }} style={{ marginRight: 5, padding: 8 }}>
            <v2_1.SvgCheckAll width={15} height={15}/>
          </GraphButton_1.GraphButton>
          <GraphButton_1.GraphButton selected={allCategoriesUnselected} title={t('Unselect All')} onSelect={function () {
            setSelectedCategories([]);
        }} style={{ padding: 8 }}>
            <v2_1.SvgUncheckAll width={15} height={15}/>
          </GraphButton_1.GraphButton>
        </view_1.View>
      </view_1.View>

      <ul style={{
            listStyle: 'none',
            marginLeft: 0,
            paddingLeft: 0,
            paddingRight: 10,
            flexGrow: 1,
            overflowY: 'auto',
        }}>
        {categoryGroups &&
            categoryGroups.map(function (categoryGroup) {
                var allCategoriesInGroupSelected = filteredGroup(categoryGroup).every(function (category) {
                    return selectedCategories.some(function (selectedCategory) { return selectedCategory.id === category.id; });
                });
                var noCategorySelected = filteredGroup(categoryGroup).every(function (category) {
                    return !selectedCategories.some(function (selectedCategory) { return selectedCategory.id === category.id; });
                });
                return (<react_1.Fragment key={categoryGroup.id}>
                <li style={{
                        display: noCategorySelected && uncheckedHidden ? 'none' : 'flex',
                        marginBottom: 8,
                        flexDirection: 'row',
                    }}>
                  <forms_1.Checkbox id={"form_".concat(categoryGroup.id)} checked={allCategoriesInGroupSelected} onChange={function () {
                        var selectedCategoriesExcludingGroupCategories = selectedCategories.filter(function (selectedCategory) {
                            return !filteredGroup(categoryGroup).some(function (groupCategory) {
                                return groupCategory.id === selectedCategory.id;
                            });
                        });
                        if (allCategoriesInGroupSelected) {
                            setSelectedCategories(selectedCategoriesExcludingGroupCategories);
                        }
                        else {
                            setSelectedCategories(selectedCategoriesExcludingGroupCategories.concat(filteredGroup(categoryGroup)));
                        }
                    }}/>
                  <label htmlFor={"form_".concat(categoryGroup.id)} style={{ userSelect: 'none', fontWeight: 'bold' }}>
                    {categoryGroup.name}
                  </label>
                </li>
                <li>
                  <ul style={{
                        listStyle: 'none',
                        marginLeft: 0,
                        marginBottom: 10,
                        paddingLeft: 10,
                    }}>
                    {filteredGroup(categoryGroup).map(function (category) {
                        var isChecked = selectedCategories.some(function (selectedCategory) { return selectedCategory.id === category.id; });
                        return (<li key={category.id} style={{
                                display: !isChecked && uncheckedHidden ? 'none' : 'flex',
                                flexDirection: 'row',
                                marginBottom: 4,
                            }}>
                          <forms_1.Checkbox id={"form_".concat(category.id)} checked={isChecked} onChange={function () {
                                if (isChecked) {
                                    setSelectedCategories(selectedCategories.filter(function (selectedCategory) {
                                        return selectedCategory.id !== category.id;
                                    }));
                                }
                                else {
                                    setSelectedCategories(__spreadArray(__spreadArray([], selectedCategories, true), [
                                        category,
                                    ], false));
                                }
                            }}/>
                          <label htmlFor={"form_".concat(category.id)} style={{ userSelect: 'none' }}>
                            {category.name}
                          </label>
                        </li>);
                    })}
                  </ul>
                </li>
              </react_1.Fragment>);
            })}
      </ul>
    </view_1.View>);
}
