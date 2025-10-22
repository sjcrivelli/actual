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
exports.ConfirmTransactionEditModal = ConfirmTransactionEditModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
function ConfirmTransactionEditModal(_a) {
    var onCancel = _a.onCancel, onConfirm = _a.onConfirm, confirmReason = _a.confirmReason;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowButtonStyle = isNarrowWidth
        ? {
            height: styles_1.styles.mobileMinHeight,
        }
        : {};
    return (<Modal_1.Modal name="confirm-transaction-edit" containerProps={{ style: { width: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Reconciled Transaction')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ lineHeight: 1.5 }}>
            {confirmReason === 'batchDeleteWithReconciled' ? (<block_1.Block>
                <react_i18next_1.Trans>
                  Deleting reconciled transactions may bring your reconciliation
                  out of balance.
                </react_i18next_1.Trans>
              </block_1.Block>) : confirmReason === 'batchEditWithReconciled' ? (<block_1.Block>
                <react_i18next_1.Trans>
                  Editing reconciled transactions may bring your reconciliation
                  out of balance.
                </react_i18next_1.Trans>
              </block_1.Block>) : confirmReason === 'batchDuplicateWithReconciled' ? (<block_1.Block>
                <react_i18next_1.Trans>
                  Duplicating reconciled transactions may bring your
                  reconciliation out of balance.
                </react_i18next_1.Trans>
              </block_1.Block>) : confirmReason === 'editReconciled' ? (<block_1.Block>
                <react_i18next_1.Trans>
                  Saving your changes to this reconciled transaction may bring
                  your reconciliation out of balance.
                </react_i18next_1.Trans>
              </block_1.Block>) : confirmReason === 'unlockReconciled' ? (<block_1.Block>
                <react_i18next_1.Trans>
                  Unlocking this transaction means you won‘t be warned about
                  changes that can impact your reconciled balance. (Changes to
                  amount, account, payee, etc).
                </react_i18next_1.Trans>
              </block_1.Block>) : confirmReason === 'deleteReconciled' ? (<block_1.Block>
                <react_i18next_1.Trans>
                  Deleting reconciled transactions may bring your reconciliation
                  out of balance.
                </react_i18next_1.Trans>
              </block_1.Block>) : (<block_1.Block>
                <react_i18next_1.Trans>Are you sure you want to edit this transaction?</react_i18next_1.Trans>
              </block_1.Block>)}
            <view_1.View style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
              <button_1.Button aria-label={t('Cancel')} style={__assign({ marginRight: 10 }, narrowButtonStyle)} onPress={function () {
                    close();
                    onCancel();
                }}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>
              <initial_focus_1.InitialFocus>
                <button_1.Button aria-label={t('Confirm')} variant="primary" style={__assign({ marginRight: 10 }, narrowButtonStyle)} onPress={function () {
                    close();
                    onConfirm();
                }}>
                  <react_i18next_1.Trans>Confirm</react_i18next_1.Trans>
                </button_1.Button>
              </initial_focus_1.InitialFocus>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
