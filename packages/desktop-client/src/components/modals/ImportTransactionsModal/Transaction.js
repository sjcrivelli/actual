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
exports.Transaction = Transaction;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v2_1 = require("@actual-app/components/icons/v2");
var stack_1 = require("@actual-app/components/stack");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var util_1 = require("loot-core/shared/util");
var ParsedDate_1 = require("./ParsedDate");
var utils_1 = require("./utils");
var forms_1 = require("@desktop-client/components/forms");
var table_1 = require("@desktop-client/components/table");
function Transaction(_a) {
    var _b, _c;
    var rawTransaction = _a.transaction, fieldMappings = _a.fieldMappings, showParsed = _a.showParsed, parseDateFormat = _a.parseDateFormat, dateFormat = _a.dateFormat, splitMode = _a.splitMode, inOutMode = _a.inOutMode, outValue = _a.outValue, flipAmount = _a.flipAmount, multiplierAmount = _a.multiplierAmount, categories = _a.categories, onCheckTransaction = _a.onCheckTransaction, reconcile = _a.reconcile;
    var t = (0, react_i18next_1.useTranslation)().t;
    var categoryList = categories.map(function (category) { return category.name; });
    var transaction = (0, react_1.useMemo)(function () {
        return fieldMappings && !rawTransaction.isMatchedTransaction
            ? (0, utils_1.applyFieldMappings)(rawTransaction, fieldMappings)
            : rawTransaction;
    }, [rawTransaction, fieldMappings]);
    var _d = (0, react_1.useMemo)(function () {
        if (rawTransaction.isMatchedTransaction) {
            var amount_1 = rawTransaction.amount;
            return {
                amount: amount_1,
                outflow: splitMode ? (amount_1 < 0 ? -amount_1 : 0) : null,
                inflow: splitMode ? (amount_1 > 0 ? amount_1 : 0) : null,
            };
        }
        return (0, utils_1.parseAmountFields)(transaction, splitMode, inOutMode, outValue, flipAmount, multiplierAmount);
    }, [
        rawTransaction,
        transaction,
        splitMode,
        inOutMode,
        outValue,
        flipAmount,
        multiplierAmount,
    ]), amount = _d.amount, outflow = _d.outflow, inflow = _d.inflow;
    return (<table_1.Row style={{
            backgroundColor: theme_1.theme.tableBackground,
            textDecoration: transaction.tombstone ? 'line-through' : 'none',
            color: (transaction.isMatchedTransaction && !transaction.selected_merge) ||
                !transaction.selected ||
                transaction.tombstone
                ? theme_1.theme.tableTextInactive
                : theme_1.theme.tableText,
        }}>
      {reconcile && (<table_1.Field width={31}>
          {!transaction.isMatchedTransaction && (<tooltip_1.Tooltip content={transaction.tombstone
                    ? t('This transaction will be deleted by Rules')
                    : !transaction.existing && !transaction.ignored
                        ? t('New transaction. You can import it, or skip it.')
                        : transaction.ignored
                            ? t('Already imported transaction. You can skip it, or import it again.')
                            : transaction.existing
                                ? t('Updated transaction. You can update it, import it again, or skip it.')
                                : ''} placement="right top">
              <forms_1.Checkbox checked={transaction.selected && !transaction.tombstone} onChange={function () { return onCheckTransaction(transaction.trx_id); }} style={transaction.selected_merge
                    ? {
                        ':checked': {
                            '::after': {
                                background: theme_1.theme.checkboxBackgroundSelected +
                                    // update sign from packages/desktop-client/src/icons/v1/layer.svg
                                    // eslint-disable-next-line actual/typography
                                    ' url(\'data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="white" d="M10 1l10 6-10 6L0 7l10-6zm6.67 10L20 13l-10 6-10-6 3.33-2L10 15l6.67-4z" /></svg>\') 9px 9px',
                            },
                        },
                    }
                    : transaction.tombstone
                        ? {
                            '&': {
                                opacity: 0.3,
                                backgroundColor: theme_1.theme.buttonNormalDisabledBorder,
                            },
                        }
                        : {
                            '&': {
                                border: '1px solid ' + theme_1.theme.buttonNormalDisabledBorder,
                                backgroundColor: theme_1.theme.buttonNormalDisabledBorder,
                                '::after': {
                                    display: 'block',
                                    background: theme_1.theme.buttonNormalDisabledBorder +
                                        // minus sign adapted from packages/desktop-client/src/icons/v1/add.svg
                                        // eslint-disable-next-line actual/typography
                                        ' url(\'data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" className="path" d="M23,11.5 L23,11.5 L23,11.5 C23,12.3284271 22.3284271,13 21.5,13 L1.5,13 L1.5,13 C0.671572875,13 1.01453063e-16,12.3284271 0,11.5 L0,11.5 L0,11.5 C-1.01453063e-16,10.6715729 0.671572875,10 1.5,10 L21.5,10 L21.5,10 C22.3284271,10 23,10.6715729 23,11.5 Z" /></svg>\') 9px 9px',
                                    width: 9,
                                    height: 9,
                                    // eslint-disable-next-line actual/typography
                                    content: '" "',
                                },
                            },
                            ':checked': {
                                border: '1px solid ' + theme_1.theme.checkboxBorderSelected,
                                backgroundColor: theme_1.theme.checkboxBackgroundSelected,
                                '::after': {
                                    background: theme_1.theme.checkboxBackgroundSelected +
                                        // plus sign from packages/desktop-client/src/icons/v1/add.svg
                                        // eslint-disable-next-line actual/typography
                                        ' url(\'data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" className="path" d="M23,11.5 L23,11.5 L23,11.5 C23,12.3284271 22.3284271,13 21.5,13 L1.5,13 L1.5,13 C0.671572875,13 1.01453063e-16,12.3284271 0,11.5 L0,11.5 L0,11.5 C-1.01453063e-16,10.6715729 0.671572875,10 1.5,10 L21.5,10 L21.5,10 C22.3284271,10 23,10.6715729 23,11.5 Z" /><path fill="white" className="path" d="M11.5,23 C10.6715729,23 10,22.3284271 10,21.5 L10,1.5 C10,0.671572875 10.6715729,1.52179594e-16 11.5,0 C12.3284271,-1.52179594e-16 13,0.671572875 13,1.5 L13,21.5 C13,22.3284271 12.3284271,23 11.5,23 Z" /></svg>\') 9px 9px',
                                },
                            },
                        }}/>
            </tooltip_1.Tooltip>)}
        </table_1.Field>)}
      <table_1.Field width={200}>
        {transaction.isMatchedTransaction ? (<view_1.View>
            <stack_1.Stack direction="row" align="flex-start">
              <view_1.View>
                <v2_1.SvgDownAndRightArrow width={16} height={16}/>
              </view_1.View>
              <view_1.View>{(0, utils_1.formatDate)((_b = transaction.date) !== null && _b !== void 0 ? _b : null, dateFormat)}</view_1.View>
            </stack_1.Stack>
          </view_1.View>) : showParsed ? (<ParsedDate_1.ParsedDate parseDateFormat={parseDateFormat} dateFormat={dateFormat} date={transaction.date}/>) : ((0, utils_1.formatDate)((_c = transaction.date) !== null && _c !== void 0 ? _c : null, dateFormat))}
      </table_1.Field>
      <table_1.Field width="flex" title={transaction.imported_payee || transaction.payee_name}>
        {transaction.payee_name}
      </table_1.Field>
      <table_1.Field width="flex" title={transaction.notes}>
        {transaction.notes}
      </table_1.Field>
      <table_1.Field width="flex" title={transaction.category && categoryList.includes(transaction.category)
            ? transaction.category
            : undefined}>
        {transaction.category &&
            categoryList.includes(transaction.category) &&
            transaction.category}
      </table_1.Field>
      {inOutMode && (<table_1.Field width={90} contentStyle={__assign({ textAlign: 'left' }, styles_1.styles.tnum)} title={transaction.inOut === undefined
                ? undefined
                : String(transaction.inOut)}>
          {transaction.inOut}
        </table_1.Field>)}
      {splitMode ? (<>
          <table_1.Field width={90} contentStyle={__assign(__assign({ textAlign: 'right' }, styles_1.styles.tnum), (inflow === null && outflow === null
                ? { color: theme_1.theme.errorText }
                : {}))} title={outflow === null
                ? t('Invalid: unable to parse the value')
                : (0, util_1.amountToCurrency)(outflow)}>
            {(0, util_1.amountToCurrency)(outflow || 0)}
          </table_1.Field>
          <table_1.Field width={90} contentStyle={__assign(__assign({ textAlign: 'right' }, styles_1.styles.tnum), (inflow === null && outflow === null
                ? { color: theme_1.theme.errorText }
                : {}))} title={inflow === null
                ? t('Invalid: unable to parse the value')
                : (0, util_1.amountToCurrency)(inflow)}>
            {(0, util_1.amountToCurrency)(inflow || 0)}
          </table_1.Field>
        </>) : (<table_1.Field width={90} contentStyle={__assign(__assign({ textAlign: 'right' }, styles_1.styles.tnum), (amount === null ? { color: theme_1.theme.errorText } : {}))} title={amount === null
                ? t('Invalid: unable to parse the value ({{amount}})', {
                    amount: transaction.amount,
                })
                : (0, util_1.amountToCurrency)(amount)}>
          {(0, util_1.amountToCurrency)(amount || 0)}
        </table_1.Field>)}
    </table_1.Row>);
}
