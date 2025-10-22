"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsHeader = AccountsHeader;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var table_1 = require("@desktop-client/components/table");
function AccountsHeader(_a) {
    var unlinked = _a.unlinked;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<table_1.TableHeader>
      <table_1.Cell value={t('Account')} width={!unlinked ? 250 : 'flex'} style={{ paddingLeft: '10px' }}/>
      {!unlinked && (<>
          <table_1.Cell value={t('Bank')} width="flex" style={{ paddingLeft: '10px' }}/>
          <table_1.Cell value={t('Last sync')} width={160} style={{ paddingLeft: '10px' }}/>
          <table_1.Cell value="" width={100} style={{ paddingLeft: '10px' }}/>
        </>)}
    </table_1.TableHeader>);
}
