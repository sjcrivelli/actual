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
exports.ReconcilingMessage = ReconcilingMessage;
exports.ReconcileMenu = ReconcileMenu;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var input_1 = require("@actual-app/components/input");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var i18next_1 = require("i18next");
var arithmetic_1 = require("loot-core/shared/arithmetic");
var util_1 = require("loot-core/shared/util");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
var bindings = require("@desktop-client/spreadsheet/bindings");
function ReconcilingMessage(_a) {
    var _b;
    var balanceQuery = _a.balanceQuery, targetBalance = _a.targetBalance, onDone = _a.onDone, onCreateTransaction = _a.onCreateTransaction;
    var cleared = (_b = (0, useSheetValue_1.useSheetValue)({
        name: (balanceQuery.name +
            '-cleared'),
        value: 0,
        query: balanceQuery.query.filter({ cleared: true }),
    })) !== null && _b !== void 0 ? _b : 0;
    var format = (0, useFormat_1.useFormat)();
    var targetDiff = targetBalance - cleared;
    var clearedBalance = format(cleared, 'financial');
    var bankBalance = format(targetBalance, 'financial');
    var difference = (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');
    return (<view_1.View style={__assign(__assign({ flexDirection: 'row', alignSelf: 'center', backgroundColor: theme_1.theme.tableBackground }, styles_1.styles.shadow), { borderRadius: 4, marginTop: 5, marginBottom: 15, padding: 10 })}>
      <view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {targetDiff === 0 ? (<view_1.View style={{
                color: theme_1.theme.noticeTextLight,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <v2_1.SvgCheckCircle1 style={{
                width: 13,
                height: 13,
                color: 'inherit',
                marginRight: 3,
            }}/>
            <react_i18next_1.Trans>All reconciled!</react_i18next_1.Trans>
          </view_1.View>) : (<view_1.View style={{ color: theme_1.theme.tableText }}>
            <text_1.Text style={{ fontStyle: 'italic', textAlign: 'center' }}>
              <react_i18next_1.Trans>
                Your cleared balance{' '}
                <strong>{{ clearedBalance: clearedBalance }}</strong>{' '}
                needs <strong>{{ difference: difference }}</strong> to
                match
                <br /> your bank&apos;s balance of{' '}
                <text_1.Text style={{ fontWeight: 700 }}>
                  {{ bankBalance: bankBalance }}
                </text_1.Text>
              </react_i18next_1.Trans>
            </text_1.Text>
          </view_1.View>)}
        <view_1.View style={{ marginLeft: 15 }}>
          <button_1.Button variant="primary" onPress={onDone}>
            <react_i18next_1.Trans>Done reconciling</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
        {targetDiff !== 0 && (<view_1.View style={{ marginLeft: 15 }}>
            <button_1.Button onPress={function () { return onCreateTransaction(targetDiff); }}>
              <react_i18next_1.Trans>Create reconciliation transaction</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>)}
      </view_1.View>
    </view_1.View>);
}
function ReconcileMenu(_a) {
    var _b;
    var account = _a.account, onReconcile = _a.onReconcile, onClose = _a.onClose;
    var balanceQuery = bindings.accountBalance(account.id);
    var clearedBalance = (0, useSheetValue_1.useSheetValue)({
        name: (balanceQuery.name + '-cleared'),
        value: null,
        query: balanceQuery.query.filter({ cleared: true }),
    });
    var lastSyncedBalance = account.balance_current;
    var format = (0, useFormat_1.useFormat)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var locale = (0, useLocale_1.useLocale)();
    var _c = (0, react_1.useState)(), inputValue = _c[0], setInputValue = _c[1];
    // useEffect is needed here. clearedBalance does not work as a default value for inputValue and
    // to use a button to update inputValue we can't use defaultValue in the input form below
    (0, react_1.useEffect)(function () {
        if (clearedBalance != null) {
            setInputValue(format(clearedBalance, 'financial'));
        }
    }, [clearedBalance, format]);
    function onSubmit(e) {
        e.preventDefault();
        if (inputValue === '') {
            return;
        }
        var evaluatedAmount = inputValue != null ? (0, arithmetic_1.evalArithmetic)(inputValue) : null;
        var amount = evaluatedAmount != null
            ? (0, util_1.amountToInteger)(evaluatedAmount)
            : clearedBalance;
        onReconcile(amount);
        onClose();
    }
    return (<react_aria_components_1.Form onSubmit={onSubmit}>
      <view_1.View style={{ padding: '5px 8px' }}>
        <text_1.Text>
          <react_i18next_1.Trans>
            Enter the current balance of your bank account that you want to
            reconcile with:
          </react_i18next_1.Trans>
        </text_1.Text>
        {inputValue != null && (<initial_focus_1.InitialFocus>
            <input_1.Input value={inputValue} onChangeValue={setInputValue} style={{ margin: '7px 0' }}/>
          </initial_focus_1.InitialFocus>)}
        {lastSyncedBalance != null && (<view_1.View>
            <text_1.Text>
              <react_i18next_1.Trans>Last Balance from Bank: </react_i18next_1.Trans>
              {format(lastSyncedBalance, 'financial')}
            </text_1.Text>
            <button_1.Button onPress={function () {
                return setInputValue(format(lastSyncedBalance, 'financial'));
            }} style={{ marginBottom: 7 }}>
              <react_i18next_1.Trans>Use last synced total</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>)}
        <text_1.Text style={{ color: theme_1.theme.pageTextSubdued, paddingBottom: 6 }}>
          {(account === null || account === void 0 ? void 0 : account.last_reconciled)
            ? (0, i18next_1.t)('Reconciled {{ relativeTimeAgo }} ({{ absoluteDate }})', {
                relativeTimeAgo: (0, util_1.tsToRelativeTime)(account.last_reconciled, locale),
                absoluteDate: (0, date_fns_1.format)(new Date(parseInt((_b = account.last_reconciled) !== null && _b !== void 0 ? _b : '0', 10)), dateFormat, { locale: locale }),
            })
            : (0, i18next_1.t)('Not yet reconciled')}
        </text_1.Text>
        <button_1.Button type="submit" variant="primary">
          <react_i18next_1.Trans>Reconcile</react_i18next_1.Trans>
        </button_1.Button>
      </view_1.View>
    </react_aria_components_1.Form>);
}
