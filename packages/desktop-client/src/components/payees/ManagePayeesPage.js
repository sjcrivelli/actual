"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagePayeesPage = ManagePayeesPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var ManagePayeesWithData_1 = require("./ManagePayeesWithData");
var Page_1 = require("@desktop-client/components/Page");
function ManagePayeesPage() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var location = (0, react_router_1.useLocation)();
    var locationState = location.state;
    var initialSelectedIds = locationState && 'selectedPayee' in locationState
        ? [locationState.selectedPayee]
        : [];
    return (<Page_1.Page header={t('Payees')}>
      <ManagePayeesWithData_1.ManagePayeesWithData initialSelectedIds={initialSelectedIds}/>
    </Page_1.Page>);
}
