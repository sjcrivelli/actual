"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmUnlinkAccountModal = ConfirmUnlinkAccountModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var paragraph_1 = require("@actual-app/components/paragraph");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
function ConfirmUnlinkAccountModal(_a) {
    var accountName = _a.accountName, isViewBankSyncSettings = _a.isViewBankSyncSettings, onUnlink = _a.onUnlink;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Modal_1.Modal name="confirm-unlink-account" containerProps={{ style: { width: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Confirm Unlink')} // Use translation for title
             rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ lineHeight: 1.5 }}>
            <paragraph_1.Paragraph>
              <react_i18next_1.Trans>
                Are you sure you want to unlink <strong>{accountName}</strong>?
              </react_i18next_1.Trans>
            </paragraph_1.Paragraph>

            <paragraph_1.Paragraph>
              {isViewBankSyncSettings
                    ? t('Transactions will no longer be synchronized with this account and must be manually entered. You will not be able to edit the bank sync settings for this account and the settings will close.')
                    : t('Transactions will no longer be synchronized with this account and must be manually entered.')}
            </paragraph_1.Paragraph>

            <view_1.View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
              <button_1.Button style={{ marginRight: 10 }} onPress={close}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>
              <initial_focus_1.InitialFocus>
                <button_1.Button variant="primary" onPress={function () {
                    onUnlink();
                    close();
                }}>
                  <react_i18next_1.Trans>Unlink</react_i18next_1.Trans>
                </button_1.Button>
              </initial_focus_1.InitialFocus>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
