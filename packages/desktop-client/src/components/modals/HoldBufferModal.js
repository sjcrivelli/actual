"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoldBufferModal = HoldBufferModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var EnvelopeBudgetComponents_1 = require("@desktop-client/components/budget/envelope/EnvelopeBudgetComponents");
var Modal_1 = require("@desktop-client/components/common/Modal");
var MobileForms_1 = require("@desktop-client/components/mobile/MobileForms");
var AmountInput_1 = require("@desktop-client/components/util/AmountInput");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function HoldBufferModal(_a) {
    var _b;
    var onSubmit = _a.onSubmit;
    var t = (0, react_i18next_1.useTranslation)().t; // Initialize i18next
    var available = (_b = (0, EnvelopeBudgetComponents_1.useEnvelopeSheetValue)(bindings_1.envelopeBudget.toBudget)) !== null && _b !== void 0 ? _b : 0;
    var _c = (0, react_1.useState)(0), amount = _c[0], setAmount = _c[1];
    (0, react_1.useEffect)(function () {
        setAmount(available);
    }, [available]);
    var _onSubmit = function (newAmount) {
        if (newAmount) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(newAmount);
        }
    };
    return (<Modal_1.Modal name="hold-buffer">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Hold for next month')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <MobileForms_1.FieldLabel title={t('Hold this amount:')}/>{' '}
            <initial_focus_1.InitialFocus>
              <AmountInput_1.AmountInput value={available} autoDecimals={true} zeroSign="+" style={{
                    marginLeft: styles_1.styles.mobileEditingPadding,
                    marginRight: styles_1.styles.mobileEditingPadding,
                }} inputStyle={{
                    height: styles_1.styles.mobileMinHeight,
                }} onUpdate={setAmount} onEnter={function () {
                    _onSubmit(amount);
                    close();
                }}/>
            </initial_focus_1.InitialFocus>
          </view_1.View>
          <view_1.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10,
                }}>
            <button_1.Button variant="primary" style={{
                    height: styles_1.styles.mobileMinHeight,
                    marginLeft: styles_1.styles.mobileEditingPadding,
                    marginRight: styles_1.styles.mobileEditingPadding,
                }} onPress={function () { return _onSubmit(amount); }}>
              <react_i18next_1.Trans>Hold</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
