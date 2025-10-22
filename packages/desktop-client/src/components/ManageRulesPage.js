"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageRulesPage = ManageRulesPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var ManageRules_1 = require("./ManageRules");
var Page_1 = require("./Page");
function ManageRulesPage() {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Page_1.Page header={t('Rules')}>
      <ManageRules_1.ManageRules isModal={false} payeeId={null}/>
    </Page_1.Page>);
}
