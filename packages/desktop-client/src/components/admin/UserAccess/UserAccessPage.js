"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessPage = UserAccessPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var UserAccess_1 = require("./UserAccess");
var Page_1 = require("@desktop-client/components/Page");
function UserAccessPage() {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Page_1.Page header={t('User Access')} style={{
            borderRadius: '5px',
            marginBottom: '25px',
        }}>
      <UserAccess_1.UserAccess isModal={false}/>
    </Page_1.Page>);
}
