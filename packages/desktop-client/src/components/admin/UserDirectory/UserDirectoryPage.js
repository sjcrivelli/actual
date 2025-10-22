"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDirectoryPage = UserDirectoryPage;
exports.BackToFileListButton = BackToFileListButton;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var view_1 = require("@actual-app/components/view");
var UserDirectory_1 = require("./UserDirectory");
var Page_1 = require("@desktop-client/components/Page");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function UserDirectoryPage(_a) {
    var bottomContent = _a.bottomContent;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Page_1.Page header={t('User Directory')} style={{
            borderRadius: '5px',
            marginBottom: '25px',
        }}>
      <UserDirectory_1.UserDirectory isModal={false}/>
      <view_1.View style={{
            flexGrow: 1,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginBottom: 15,
        }}>
        {bottomContent}
      </view_1.View>
    </Page_1.Page>);
}
function BackToFileListButton() {
    var navigate = (0, useNavigate_1.useNavigate)();
    return (<button_1.Button style={{ maxWidth: '200px' }} onPress={function () { return navigate('/'); }}>
      <react_i18next_1.Trans>Back to file list</react_i18next_1.Trans>
    </button_1.Button>);
}
