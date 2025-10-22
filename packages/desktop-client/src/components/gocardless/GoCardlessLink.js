"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoCardlessLink = GoCardlessLink;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var paragraph_1 = require("@actual-app/components/paragraph");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
function GoCardlessLink() {
    var t = (0, react_i18next_1.useTranslation)().t;
    window.close();
    return (<Modal_1.Modal name="gocardless-link" isDismissable={false}>
      <Modal_1.ModalHeader title={t('Account sync')}/>
      <view_1.View style={{ maxWidth: 500 }}>
        <paragraph_1.Paragraph>
          <react_i18next_1.Trans>Please wait...</react_i18next_1.Trans>
        </paragraph_1.Paragraph>
        <paragraph_1.Paragraph>
          <react_i18next_1.Trans>
            The window should close automatically. If nothing happened you can
            close this window or tab.
          </react_i18next_1.Trans>
        </paragraph_1.Paragraph>
      </view_1.View>
    </Modal_1.Modal>);
}
