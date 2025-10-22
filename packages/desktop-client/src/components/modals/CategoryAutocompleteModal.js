"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryAutocompleteModal = CategoryAutocompleteModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
function CategoryAutocompleteModal(_a) {
    var title = _a.title, month = _a.month, onSelect = _a.onSelect, categoryGroups = _a.categoryGroups, showHiddenCategories = _a.showHiddenCategories, closeOnSelect = _a.closeOnSelect, clearOnSelect = _a.clearOnSelect, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var defaultAutocompleteProps = {
        containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
    };
    return (<Modal_1.Modal name="category-autocomplete" noAnimation={!isNarrowWidth} onClose={onClose} containerProps={{
            style: {
                height: isNarrowWidth
                    ? 'calc(var(--visual-viewport-height) * 0.85)'
                    : 275,
                backgroundColor: theme_1.theme.menuAutoCompleteBackground,
            },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          {isNarrowWidth && (<Modal_1.ModalHeader title={<Modal_1.ModalTitle title={title || t('Category')} getStyle={function () { return ({ color: theme_1.theme.menuAutoCompleteText }); }}/>} rightContent={<Modal_1.ModalCloseButton onPress={close} style={{ color: theme_1.theme.menuAutoCompleteText }}/>}/>)}
          <view_1.View>
            {!isNarrowWidth && (<forms_1.SectionLabel title={t('Category')} style={{
                        alignSelf: 'center',
                        color: theme_1.theme.menuAutoCompleteText,
                        marginBottom: 10,
                    }}/>)}
            <view_1.View style={{ flex: 1 }}>
              <useSheetName_1.SheetNameProvider name={month ? monthUtils.sheetForMonth(month) : ''}>
                <CategoryAutocomplete_1.CategoryAutocomplete focused={true} embedded={true} closeOnBlur={false} closeOnSelect={closeOnSelect} clearOnSelect={clearOnSelect} showSplitOption={false} onClose={close} {...defaultAutocompleteProps} onSelect={onSelect} categoryGroups={categoryGroups} showHiddenCategories={showHiddenCategories} value={null}/>
              </useSheetName_1.SheetNameProvider>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
