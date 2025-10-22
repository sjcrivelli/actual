"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditRuleModal = EditRuleModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var Modal_1 = require("@desktop-client/components/common/Modal");
var RuleEditor_1 = require("@desktop-client/components/rules/RuleEditor");
function EditRuleModal(_a) {
    var defaultRule = _a.rule, originalOnSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Modal_1.Modal name="edit-rule">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Rule')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <RuleEditor_1.RuleEditor rule={defaultRule} onSave={function (rule) {
                    originalOnSave === null || originalOnSave === void 0 ? void 0 : originalOnSave(rule);
                    close();
                }} onCancel={close} style={{
                    maxWidth: '100%',
                    width: 900,
                    height: '80vh',
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto',
                    overflow: 'hidden',
                    color: theme_1.theme.pageTextLight,
                }}/>
        </>);
        }}
    </Modal_1.Modal>);
}
