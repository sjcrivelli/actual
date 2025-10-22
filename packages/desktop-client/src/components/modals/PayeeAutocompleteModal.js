"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayeeAutocompleteModal = PayeeAutocompleteModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var theme_1 = require("@actual-app/components/theme");
var PayeeAutocomplete_1 = require("@desktop-client/components/autocomplete/PayeeAutocomplete");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
function PayeeAutocompleteModal(_a) {
    var onSelect = _a.onSelect, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var payees = (0, usePayees_1.usePayees)() || [];
    var accounts = (0, useAccounts_1.useAccounts)() || [];
    var navigate = (0, useNavigate_1.useNavigate)();
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var defaultAutocompleteProps = {
        containerProps: { style: { height: isNarrowWidth ? '90vh' : 275 } },
    };
    var onManagePayees = function () { return navigate('/payees'); };
    return (<Modal_1.Modal name="payee-autocomplete" noAnimation={!isNarrowWidth} onClose={onClose} containerProps={{
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
          {isNarrowWidth && (<Modal_1.ModalHeader title={<Modal_1.ModalTitle title={t('Payee')} getStyle={function () { return ({ color: theme_1.theme.menuAutoCompleteText }); }}/>} rightContent={<Modal_1.ModalCloseButton onPress={close} style={{ color: theme_1.theme.menuAutoCompleteText }}/>}/>)}
          <PayeeAutocomplete_1.PayeeAutocomplete payees={payees} accounts={accounts} focused={true} embedded={true} closeOnBlur={false} onClose={close} onManagePayees={onManagePayees} showManagePayees={!isNarrowWidth} showMakeTransfer={!isNarrowWidth} {...defaultAutocompleteProps} onSelect={onSelect} value={null}/>
        </>);
        }}
    </Modal_1.Modal>);
}
