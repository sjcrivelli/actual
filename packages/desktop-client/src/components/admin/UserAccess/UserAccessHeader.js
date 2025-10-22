"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessHeader = UserAccessHeader;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var table_1 = require("@desktop-client/components/table");
function UserAccessHeader() {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<table_1.TableHeader>
      <table_1.Cell value={t('Access')} width={100} style={{ paddingLeft: 15 }}/>
      <table_1.Cell value={t('User')} width="flex"/>
      <table_1.Cell value={t('Owner')} width={100}/>
    </table_1.TableHeader>);
}
