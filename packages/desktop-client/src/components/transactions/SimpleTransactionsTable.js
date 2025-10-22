"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTransactionsTable = SimpleTransactionsTable;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var date_fns_1 = require("date-fns");
var monthUtils = require("loot-core/shared/months");
var table_1 = require("@desktop-client/components/table");
var DisplayId_1 = require("@desktop-client/components/util/DisplayId");
var useAccount_1 = require("@desktop-client/hooks/useAccount");
var useCategory_1 = require("@desktop-client/hooks/useCategory");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
function serializeTransaction(transaction, dateFormat) {
    var date = transaction.date;
    if (!(0, date_fns_1.isValid)((0, date_fns_1.parseISO)(date))) {
        date = monthUtils.currentDay();
    }
    return __assign(__assign({}, transaction), { date: (0, date_fns_1.format)((0, date_fns_1.parseISO)(date), dateFormat) });
}
var TransactionRow = (0, react_1.memo)(function TransactionRow(_a) {
    var transaction = _a.transaction, fields = _a.fields, selected = _a.selected, format = _a.format;
    var t = (0, react_i18next_1.useTranslation)().t;
    var category = (0, useCategory_1.useCategory)(transaction.category || '');
    var account = (0, useAccount_1.useAccount)(transaction.account);
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    return (<table_1.Row style={{ color: theme_1.theme.tableText }}>
      <table_1.SelectCell exposed={true} focused={false} onSelect={function (e) {
            dispatchSelected({
                type: 'select',
                id: transaction.id,
                isRangeSelect: e.shiftKey,
            });
        }} selected={selected}/>
      {fields.map(function (field, i) {
            switch (field) {
                case 'date':
                    return (<table_1.Field key={i} width={100}>
                {transaction.date}
              </table_1.Field>);
                case 'imported_payee':
                    return (<table_1.Field key={i} width="flex">
                {transaction.imported_payee}
              </table_1.Field>);
                case 'payee':
                    return (<table_1.Cell key={i} width="flex" exposed={true} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                {function () { return (<>
                    {transaction.schedule && (<v2_1.SvgArrowsSynchronize style={{
                                    width: 13,
                                    height: 13,
                                    margin: '0 5px',
                                }}/>)}
                    {transaction.payee && (<DisplayId_1.DisplayId type="payees" id={transaction.payee}/>)}
                  </>); }}
              </table_1.Cell>);
                case 'category':
                    return (<table_1.Field key={i} width="flex" title={category === null || category === void 0 ? void 0 : category.name}>
                {(category === null || category === void 0 ? void 0 : category.name) || ''}
              </table_1.Field>);
                case 'account':
                    return (<table_1.Field key={i} width="flex" title={(account === null || account === void 0 ? void 0 : account.name) || t('No account')}>
                {(account === null || account === void 0 ? void 0 : account.name) || t('No account')}
              </table_1.Field>);
                case 'notes':
                    return (<table_1.Field key={i} width="flex" title={transaction.notes}>
                {transaction.notes}
              </table_1.Field>);
                case 'amount':
                    return (<table_1.Field key={i} width={75} style={__assign({ textAlign: 'right' }, styles_1.styles.tnum)}>
                {format(transaction.amount, 'financial')}
              </table_1.Field>);
                default:
                    return null;
            }
        })}
    </table_1.Row>);
});
function SimpleTransactionsTable(_a) {
    var transactions = _a.transactions, renderEmpty = _a.renderEmpty, _b = _a.fields, fields = _b === void 0 ? ['date', 'payee', 'amount'] : _b, style = _a.style;
    var format = (0, useFormat_1.useFormat)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var memoFields = (0, react_1.useMemo)(function () { return fields; }, [fields]);
    var serializedTransactions = (0, react_1.useMemo)(function () {
        return transactions.map(function (trans) { return serializeTransaction(trans, dateFormat); });
    }, [transactions, dateFormat]);
    var renderItem = (0, react_1.useCallback)(function (_a) {
        var item = _a.item;
        return (<TransactionRow transaction={item} fields={memoFields} selected={selectedItems && selectedItems.has(item.id)} format={format}/>);
    }, [memoFields, selectedItems, format]);
    return (<table_1.Table style={style} items={serializedTransactions} renderEmpty={renderEmpty} headers={<>
          <table_1.SelectCell exposed={true} focused={false} selected={selectedItems.size > 0} width={20} onSelect={function (e) {
                return dispatchSelected({
                    type: 'select-all',
                    isRangeSelect: e.shiftKey,
                });
            }}/>
          {fields.map(function (field, i) {
                switch (field) {
                    case 'date':
                        return (<table_1.Field key={i} width={100}>
                    <react_i18next_1.Trans>Date</react_i18next_1.Trans>
                  </table_1.Field>);
                    case 'imported_payee':
                        return (<table_1.Field key={i} width="flex">
                    <react_i18next_1.Trans>Imported payee</react_i18next_1.Trans>
                  </table_1.Field>);
                    case 'payee':
                        return (<table_1.Field key={i} width="flex">
                    <react_i18next_1.Trans>Payee</react_i18next_1.Trans>
                  </table_1.Field>);
                    case 'category':
                        return (<table_1.Field key={i} width="flex">
                    <react_i18next_1.Trans>Category</react_i18next_1.Trans>
                  </table_1.Field>);
                    case 'account':
                        return (<table_1.Field key={i} width="flex">
                    <react_i18next_1.Trans>Account</react_i18next_1.Trans>
                  </table_1.Field>);
                    case 'notes':
                        return (<table_1.Field key={i} width="flex">
                    <react_i18next_1.Trans>Notes</react_i18next_1.Trans>
                  </table_1.Field>);
                    case 'amount':
                        return (<table_1.Field key={i} width={75} style={{ textAlign: 'right' }}>
                    <react_i18next_1.Trans>Amount</react_i18next_1.Trans>
                  </table_1.Field>);
                    default:
                        return null;
                }
            })}
        </>} renderItem={renderItem}/>);
}
