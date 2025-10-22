"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmCategoryDeleteModal = ConfirmCategoryDeleteModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next"); // Import useTranslation
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
function ConfirmCategoryDeleteModal(_a) {
    var groupId = _a.group, categoryId = _a.category, onDelete = _a.onDelete;
    var t = (0, react_i18next_1.useTranslation)().t; // Initialize translation hook
    var _b = (0, react_1.useState)(null), transferCategory = _b[0], setTransferCategory = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, useCategories_1.useCategories)(), categoryGroups = _d.grouped, categories = _d.list;
    var group = categoryGroups.find(function (g) { return g.id === groupId; });
    var category = categories.find(function (c) { return c.id === categoryId; });
    var renderError = function (error) {
        var msg;
        switch (error) {
            case 'required-transfer':
                msg = 'You must select a category';
                break;
            default:
                msg = 'Something bad happened, sorry!';
        }
        return (<text_1.Text style={{
                marginTop: 15,
                color: theme_1.theme.errorText,
            }}>
        {msg}
      </text_1.Text>);
    };
    var isIncome = !!(category || group).is_income;
    return (<Modal_1.Modal name="confirm-category-delete" containerProps={{ style: { width: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Confirm Delete')} // Use translation for title
             rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ lineHeight: 1.5 }}>
            {group ? (<block_1.Block>
                {!isIncome ? (<react_i18next_1.Trans>
                    Categories in the group{' '}
                    <strong>
                      {{ group: group.name }}
                    </strong>{' '}
                    are used by existing transactions.
                  </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
                    Categories in the group{' '}
                    <strong>
                      {{ group: group.name }}
                    </strong>{' '}
                    are used by existing transactions or it has a positive
                    leftover balance currently.
                  </react_i18next_1.Trans>)}
                <react_i18next_1.Trans>
                  <strong>Are you sure you want to delete it?</strong> If so,
                  you must select another category to transfer existing
                  transactions and balance to.
                </react_i18next_1.Trans>
              </block_1.Block>) : (<block_1.Block>
                {!isIncome ? (<react_i18next_1.Trans>
                    <strong>
                      {{ category: category.name }}
                    </strong>{' '}
                    is used by existing transactions.
                  </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
                    <strong>
                      {{ category: category.name }}
                    </strong>{' '}
                    is used by existing transactions or it has a positive
                    leftover balance currently.
                  </react_i18next_1.Trans>)}
                <react_i18next_1.Trans>
                  <strong>Are you sure you want to delete it?</strong> If so,
                  you must select another category to transfer existing
                  transactions and balance to.
                </react_i18next_1.Trans>
              </block_1.Block>)}

            {error && renderError(error)}

            <view_1.View style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
              <text_1.Text>
                <react_i18next_1.Trans>Transfer to:</react_i18next_1.Trans>
              </text_1.Text>

              <view_1.View style={{ flex: 1, marginLeft: 10, marginRight: 30 }}>
                <CategoryAutocomplete_1.CategoryAutocomplete categoryGroups={group
                    ? categoryGroups.filter(function (g) { return g.id !== group.id && !!g.is_income === isIncome; })
                    : categoryGroups
                        .filter(function (g) { return !!g.is_income === isIncome; })
                        .map(function (g) { return (__assign(__assign({}, g), { categories: g.categories.filter(function (c) { return c.id !== category.id; }) })); })} value={transferCategory} focused={true} inputProps={{
                    placeholder: t('Select category...'),
                }} onSelect={function (category) { return setTransferCategory(category); }} showHiddenCategories={true}/>
              </view_1.View>

              <button_1.Button variant="primary" onPress={function () {
                    if (!transferCategory) {
                        setError('required-transfer');
                    }
                    else {
                        onDelete(transferCategory);
                        close();
                    }
                }}>
                <react_i18next_1.Trans>Delete</react_i18next_1.Trans>
              </button_1.Button>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
