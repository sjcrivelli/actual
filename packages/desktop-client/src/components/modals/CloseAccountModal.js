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
exports.CloseAccountModal = CloseAccountModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var form_error_1 = require("@actual-app/components/form-error");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var paragraph_1 = require("@actual-app/components/paragraph");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var util_1 = require("loot-core/shared/util");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var AccountAutocomplete_1 = require("@desktop-client/components/autocomplete/AccountAutocomplete");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function needsCategory(account, currentTransfer, accounts) {
    var acct = accounts.find(function (a) { return a.id === currentTransfer; });
    var isOffBudget = acct && acct.offbudget === 1;
    // The user must select a category if transferring from a budgeted
    // account to an off budget account
    return account.offbudget === 0 && isOffBudget;
}
function CloseAccountModal(_a) {
    var account = _a.account, balance = _a.balance, canDelete = _a.canDelete;
    var t = (0, react_i18next_1.useTranslation)().t; // Initialize translation hook
    var accounts = (0, useAccounts_1.useAccounts)().filter(function (a) { return a.closed === 0; });
    var _b = (0, useCategories_1.useCategories)(), categoryGroups = _b.grouped, categories = _b.list;
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), transferAccountId = _d[0], setTransferAccountId = _d[1];
    var transferAccount = accounts.find(function (a) { return a.id === transferAccountId; });
    var _e = (0, react_1.useState)(''), categoryId = _e[0], setCategoryId = _e[1];
    var category = categories.find(function (c) { return c.id === categoryId; });
    var _f = (0, react_1.useState)(false), transferError = _f[0], setTransferError = _f[1];
    var _g = (0, react_1.useState)(false), categoryError = _g[0], setCategoryError = _g[1];
    var dispatch = (0, redux_1.useDispatch)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var onSelectAccount = function (accId) {
        setTransferAccountId(accId);
        if (transferError && accId) {
            setTransferError(false);
        }
    };
    var onSelectCategory = function (catId) {
        setCategoryId(catId);
        if (categoryError && catId) {
            setCategoryError(false);
        }
    };
    var narrowStyle = isNarrowWidth
        ? __assign({ userSelect: 'none', height: styles_1.styles.mobileMinHeight }, styles_1.styles.mediumText) : {};
    var onSubmit = function (event) {
        event.preventDefault();
        var transferError = balance !== 0 && !transferAccountId;
        setTransferError(transferError);
        var categoryError = needsCategory(account, transferAccountId, accounts) && !categoryId;
        setCategoryError(categoryError);
        if (transferError || categoryError) {
            return false;
        }
        setLoading(true);
        dispatch((0, accountsSlice_1.closeAccount)({
            id: account.id,
            transferAccountId: transferAccountId || null,
            categoryId: categoryId || null,
        }));
        return true;
    };
    return (<Modal_1.Modal name="close-account" isLoading={loading} containerProps={{ style: { width: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Close Account')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <paragraph_1.Paragraph>
              <react_i18next_1.Trans>
                Are you sure you want to close{' '}
                <strong>
                  {{ accountName: account.name }}
                </strong>
                ?{' '}
              </react_i18next_1.Trans>
              {canDelete ? (<span>
                  <react_i18next_1.Trans>
                    This account has no transactions so it will be permanently
                    deleted.
                  </react_i18next_1.Trans>
                </span>) : (<span>
                  <react_i18next_1.Trans>
                    This account has transactions so we can’t permanently delete
                    it.
                  </react_i18next_1.Trans>
                </span>)}
            </paragraph_1.Paragraph>
            <react_aria_components_1.Form onSubmit={function (e) {
                    if (onSubmit(e)) {
                        close();
                    }
                }}>
              {balance !== 0 && (<view_1.View>
                  <paragraph_1.Paragraph>
                    <react_i18next_1.Trans>
                      This account has a balance of{' '}
                      <strong>
                        {{
                        balance: (0, util_1.integerToCurrency)(balance),
                    }}
                      </strong>
                      . To close this account, select a different account to
                      transfer this balance to:
                    </react_i18next_1.Trans>
                  </paragraph_1.Paragraph>

                  <view_1.View style={{ marginBottom: 15 }}>
                    <AccountAutocomplete_1.AccountAutocomplete includeClosedAccounts={false} hiddenAccounts={[account.id]} value={transferAccountId} inputProps={__assign({ placeholder: t('Select account...'), autoFocus: true }, (isNarrowWidth && {
                        value: (transferAccount === null || transferAccount === void 0 ? void 0 : transferAccount.name) || '',
                        style: __assign({}, narrowStyle),
                        onClick: function () {
                            dispatch((0, modalsSlice_1.pushModal)({
                                modal: {
                                    name: 'account-autocomplete',
                                    options: {
                                        includeClosedAccounts: false,
                                        hiddenAccounts: [account.id],
                                        onSelect: onSelectAccount,
                                    },
                                },
                            }));
                        },
                    }))} onSelect={onSelectAccount}/>
                  </view_1.View>

                  {transferError && (<form_error_1.FormError style={{ marginBottom: 15 }}>
                      <react_i18next_1.Trans>Transfer is required</react_i18next_1.Trans>
                    </form_error_1.FormError>)}

                  {needsCategory(account, transferAccountId, accounts) && (<view_1.View style={{ marginBottom: 15 }}>
                      <paragraph_1.Paragraph>
                        <react_i18next_1.Trans>
                          Since you are transferring the balance from an on
                          budget account to an off budget account, this
                          transaction must be categorized. Select a category:
                        </react_i18next_1.Trans>
                      </paragraph_1.Paragraph>

                      <CategoryAutocomplete_1.CategoryAutocomplete categoryGroups={categoryGroups} value={categoryId} inputProps={__assign({ placeholder: t('Select category...') }, (isNarrowWidth && {
                            value: (category === null || category === void 0 ? void 0 : category.name) || '',
                            style: __assign({}, narrowStyle),
                            onClick: function () {
                                dispatch((0, modalsSlice_1.pushModal)({
                                    modal: {
                                        name: 'category-autocomplete',
                                        options: {
                                            categoryGroups: categoryGroups,
                                            showHiddenCategories: true,
                                            onSelect: onSelectCategory,
                                        },
                                    },
                                }));
                            },
                        }))} onSelect={onSelectCategory}/>

                      {categoryError && (<form_error_1.FormError>
                          <react_i18next_1.Trans>Category is required</react_i18next_1.Trans>
                        </form_error_1.FormError>)}
                    </view_1.View>)}
                </view_1.View>)}

              {!canDelete && (<view_1.View style={{ marginBottom: 15 }}>
                  <text_1.Text style={{ fontSize: 12 }}>
                    <react_i18next_1.Trans>
                      You can also{' '}
                      <Link_1.Link variant="text" onClick={function () {
                        setLoading(true);
                        dispatch((0, accountsSlice_1.closeAccount)({
                            id: account.id,
                            forced: true,
                        }));
                        close();
                    }} style={{ color: theme_1.theme.errorText }}>
                        force close
                      </Link_1.Link>{' '}
                      the account which will delete it and all its transactions
                      permanently. Doing so may change your budget unexpectedly
                      since money in it may vanish.
                    </react_i18next_1.Trans>
                  </text_1.Text>
                </view_1.View>)}

              <view_1.View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                <button_1.Button style={{
                    marginRight: 10,
                    height: isNarrowWidth ? styles_1.styles.mobileMinHeight : undefined,
                }} onPress={close}>
                  <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
                </button_1.Button>
                <button_1.Button type="submit" variant="primary" style={{
                    height: isNarrowWidth ? styles_1.styles.mobileMinHeight : undefined,
                }}>
                  <react_i18next_1.Trans>Close Account</react_i18next_1.Trans>
                </button_1.Button>
              </view_1.View>
            </react_aria_components_1.Form>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
