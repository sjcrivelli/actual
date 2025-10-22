"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDirectoryHeader = UserDirectoryHeader;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var table_1 = require("@desktop-client/components/table");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
function UserDirectoryHeader() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    return (<table_1.TableHeader style={{}}>
      <table_1.SelectCell exposed={true} focused={false} selected={selectedItems.size > 0} onSelect={function (e) {
            return dispatchSelected({ type: 'select-all', isRangeSelect: e.shiftKey });
        }}/>
      <table_1.Cell value={t('Username')} width="flex"/>
      <table_1.Cell value={t('Display Name')} width={250}/>
      <table_1.Cell value={t('Role')} width={100}/>
      <table_1.Cell value={t('Enabled')} width={100}/>
      <table_1.Cell value={t('Server Owner')} width={100}/>
      <table_1.Cell value="" width={80}/>
    </table_1.TableHeader>);
}
