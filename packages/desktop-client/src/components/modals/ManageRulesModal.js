"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageRulesModal = ManageRulesModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var environment_1 = require("loot-core/shared/environment");
var Modal_1 = require("@desktop-client/components/common/Modal");
var ManageRules_1 = require("@desktop-client/components/ManageRules");
function ManageRulesModal(_a) {
    var payeeId = _a.payeeId;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var location = (0, react_router_1.useLocation)();
    if ((0, environment_1.isNonProductionEnvironment)()) {
        if (location.pathname !== '/payees') {
            throw new Error("Possibly invalid use of ManageRulesModal, add the current url `".concat(location.pathname, "` to the allowlist if you\u2019re confident the modal can never appear on top of the `/rules` page."));
        }
    }
    return (<Modal_1.Modal name="manage-rules" isLoading={loading}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Rules')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <ManageRules_1.ManageRules isModal payeeId={payeeId} setLoading={setLoading}/>
        </>);
        }}
    </Modal_1.Modal>);
}
