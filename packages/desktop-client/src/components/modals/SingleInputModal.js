"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleInputModal = SingleInputModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var button_1 = require("@actual-app/components/button");
var form_error_1 = require("@actual-app/components/form-error");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var styles_1 = require("@actual-app/components/styles");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
var MobileForms_1 = require("@desktop-client/components/mobile/MobileForms");
function SingleInputModal(_a) {
    var name = _a.name, Header = _a.Header, buttonText = _a.buttonText, onSubmit = _a.onSubmit, onValidate = _a.onValidate, inputPlaceholder = _a.inputPlaceholder;
    var _b = (0, react_1.useState)(''), value = _b[0], setValue = _b[1];
    var _c = (0, react_1.useState)(null), errorMessage = _c[0], setErrorMessage = _c[1];
    var _onSubmit = function (e) {
        e.preventDefault();
        var error = onValidate === null || onValidate === void 0 ? void 0 : onValidate(value);
        if (error) {
            setErrorMessage(error);
            return;
        }
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(value);
    };
    return (<Modal_1.Modal name={name}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Header rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <react_aria_components_1.Form onSubmit={function (e) {
                    _onSubmit(e);
                    close();
                }}>
            <view_1.View>
              <initial_focus_1.InitialFocus>
                <MobileForms_1.InputField placeholder={inputPlaceholder} defaultValue={value} onChangeValue={setValue}/>
              </initial_focus_1.InitialFocus>
              {errorMessage && (<form_error_1.FormError style={{
                        paddingTop: 5,
                        marginLeft: styles_1.styles.mobileEditingPadding,
                        marginRight: styles_1.styles.mobileEditingPadding,
                    }}>
                  * {errorMessage}
                </form_error_1.FormError>)}
            </view_1.View>
            <view_1.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10,
                }}>
              <button_1.Button type="submit" variant="primary" style={{
                    height: styles_1.styles.mobileMinHeight,
                    marginLeft: styles_1.styles.mobileEditingPadding,
                    marginRight: styles_1.styles.mobileEditingPadding,
                }}>
                {buttonText}
              </button_1.Button>
            </view_1.View>
          </react_aria_components_1.Form>
        </>);
        }}
    </Modal_1.Modal>);
}
