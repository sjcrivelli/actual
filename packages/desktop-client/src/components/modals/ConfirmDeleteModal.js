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
exports.ConfirmDeleteModal = ConfirmDeleteModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var paragraph_1 = require("@actual-app/components/paragraph");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
function ConfirmDeleteModal(_a) {
    var message = _a.message, onConfirm = _a.onConfirm;
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var narrowButtonStyle = isNarrowWidth
        ? {
            height: styles_1.styles.mobileMinHeight,
        }
        : {};
    return (<Modal_1.Modal name="confirm-delete">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Confirm Delete')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ lineHeight: 1.5 }}>
            <paragraph_1.Paragraph>{message}</paragraph_1.Paragraph>
            <view_1.View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
              <button_1.Button style={__assign({ marginRight: 10 }, narrowButtonStyle)} onPress={close}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>
              <initial_focus_1.InitialFocus>
                <button_1.Button variant="primary" style={narrowButtonStyle} onPress={function () {
                    onConfirm();
                    close();
                }}>
                  <react_i18next_1.Trans>Delete</react_i18next_1.Trans>
                </button_1.Button>
              </initial_focus_1.InitialFocus>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
