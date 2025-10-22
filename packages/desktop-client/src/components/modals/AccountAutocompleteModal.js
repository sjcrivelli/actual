"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAutocompleteModal = AccountAutocompleteModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var AccountAutocomplete_1 = require("@desktop-client/components/autocomplete/AccountAutocomplete");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
function AccountAutocompleteModal(_a) {
    var onSelect = _a.onSelect, includeClosedAccounts = _a.includeClosedAccounts, hiddenAccounts = _a.hiddenAccounts, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var defaultAutocompleteProps = {
        containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
    };
    return (<Modal_1.Modal name="account-autocomplete" noAnimation={!isNarrowWidth} onClose={onClose} containerProps={{
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
          {isNarrowWidth && (<Modal_1.ModalHeader title={<Modal_1.ModalTitle title={t('Account')} getStyle={function () { return ({ color: theme_1.theme.menuAutoCompleteText }); }}/>} rightContent={<Modal_1.ModalCloseButton onPress={close} style={{ color: theme_1.theme.menuAutoCompleteText }}/>}/>)}
          <view_1.View>
            {!isNarrowWidth && (<forms_1.SectionLabel title={t('Account')} style={{
                        alignSelf: 'center',
                        color: theme_1.theme.menuAutoCompleteText,
                        marginBottom: 10,
                    }}/>)}
            <view_1.View style={{ flex: 1 }}>
              <AccountAutocomplete_1.AccountAutocomplete focused={true} embedded={true} closeOnBlur={false} onClose={close} {...defaultAutocompleteProps} onSelect={onSelect} includeClosedAccounts={includeClosedAccounts} hiddenAccounts={hiddenAccounts} value={null}/>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
