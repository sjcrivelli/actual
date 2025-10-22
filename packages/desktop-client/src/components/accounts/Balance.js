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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balances = Balances;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var usehooks_ts_1 = require("usehooks-ts");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var transactions_1 = require("loot-core/shared/transactions");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var CellValue_1 = require("@desktop-client/components/spreadsheet/CellValue");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSheetValue_1 = require("@desktop-client/hooks/useSheetValue");
function DetailedBalance(_a) {
    var name = _a.name, balance = _a.balance, _b = _a.isExactBalance, isExactBalance = _b === void 0 ? true : _b;
    var format = (0, useFormat_1.useFormat)();
    return (<text_1.Text style={{
            borderRadius: 4,
            padding: '4px 6px',
            color: theme_1.theme.pillText,
            backgroundColor: theme_1.theme.pillBackground,
        }}>
      {name}{' '}
      <PrivacyFilter_1.PrivacyFilter>
        <text_1.Text style={{ fontWeight: 600 }}>
          {!isExactBalance && '~ '}
          {format(balance, 'financial')}
        </text_1.Text>
      </PrivacyFilter_1.PrivacyFilter>
    </text_1.Text>);
}
function SelectedBalance(_a) {
    var selectedItems = _a.selectedItems, account = _a.account;
    var t = (0, react_i18next_1.useTranslation)().t;
    var name = "selected-balance-".concat(__spreadArray([], selectedItems, true).join('-'));
    var rows = (0, useSheetValue_1.useSheetValue)({
        name: name,
        query: (0, query_1.q)('transactions')
            .filter({
            id: { $oneof: __spreadArray([], selectedItems, true) },
            parent_id: { $oneof: __spreadArray([], selectedItems, true) },
        })
            .select('id'),
    });
    var ids = new Set((rows || []).map(function (r) { return r.id; }));
    var finalIds = __spreadArray([], selectedItems, true).filter(function (id) { return !ids.has(id); });
    var balance = (0, useSheetValue_1.useSheetValue)({
        name: (name + '-sum'),
        query: (0, query_1.q)('transactions')
            .filter({ id: { $oneof: finalIds } })
            .options({ splits: 'all' })
            .calculate({ $sum: '$amount' }),
    });
    var scheduleBalance = 0;
    var _b = (0, useCachedSchedules_1.useCachedSchedules)(), isLoading = _b.isLoading, _c = _b.schedules, schedules = _c === void 0 ? [] : _c;
    if (isLoading) {
        return null;
    }
    var previewIds = __spreadArray([], selectedItems, true).filter(function (id) { return (0, transactions_1.isPreviewId)(id); })
        .map(function (id) { return id.slice(8); });
    var isExactBalance = true;
    for (var _i = 0, schedules_2 = schedules; _i < schedules_2.length; _i++) {
        var s = schedules_2[_i];
        if (previewIds.includes(s.id)) {
            // If a schedule is `between X and Y` then we calculate the average
            if (s._amountOp === 'isbetween') {
                isExactBalance = false;
            }
            if (!account || account.id === s._account) {
                scheduleBalance += (0, schedules_1.getScheduledAmount)(s._amount);
            }
            else {
                scheduleBalance -= (0, schedules_1.getScheduledAmount)(s._amount);
            }
        }
    }
    if (!balance && !scheduleBalance) {
        return null;
    }
    else {
        balance = (balance !== null && balance !== void 0 ? balance : 0) + scheduleBalance;
    }
    return (<DetailedBalance name={t('Selected balance:')} balance={balance} isExactBalance={isExactBalance}/>);
}
function FilteredBalance(_a) {
    var filteredAmount = _a.filteredAmount;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<DetailedBalance name={t('Filtered balance:')} balance={filteredAmount !== null && filteredAmount !== void 0 ? filteredAmount : 0} isExactBalance={true}/>);
}
function MoreBalances(_a) {
    var balanceQuery = _a.balanceQuery;
    var t = (0, react_i18next_1.useTranslation)().t;
    var cleared = (0, useSheetValue_1.useSheetValue)({
        name: (balanceQuery.name + '-cleared'),
        query: balanceQuery.query.filter({ cleared: true }),
    });
    var uncleared = (0, useSheetValue_1.useSheetValue)({
        name: (balanceQuery.name +
            '-uncleared'),
        query: balanceQuery.query.filter({ cleared: false }),
    });
    return (<>
      <DetailedBalance name={t('Cleared total:')} balance={cleared !== null && cleared !== void 0 ? cleared : 0}/>
      <DetailedBalance name={t('Uncleared total:')} balance={uncleared !== null && uncleared !== void 0 ? uncleared : 0}/>
    </>);
}
function Balances(_a) {
    var balanceQuery = _a.balanceQuery, showExtraBalances = _a.showExtraBalances, onToggleExtraBalances = _a.onToggleExtraBalances, account = _a.account, isFiltered = _a.isFiltered, filteredAmount = _a.filteredAmount;
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var buttonRef = (0, react_1.useRef)(null);
    var isButtonHovered = (0, usehooks_ts_1.useHover)(buttonRef);
    return (<view_1.View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: -5,
            marginLeft: -5,
            gap: 10,
        }}>
      <button_1.Button ref={buttonRef} data-testid="account-balance" variant="bare" onPress={onToggleExtraBalances} style={{
            paddingTop: 1,
            paddingBottom: 1,
        }}>
        <CellValue_1.CellValue binding={__assign(__assign({}, balanceQuery), { value: 0 })} type="financial">
          {function (props) { return (<CellValue_1.CellValueText {...props} style={{
                fontSize: 22,
                fontWeight: 400,
                color: props.value < 0
                    ? theme_1.theme.errorText
                    : props.value > 0
                        ? theme_1.theme.noticeTextLight
                        : theme_1.theme.pageTextSubdued,
            }}/>); }}
        </CellValue_1.CellValue>

        <v2_1.SvgArrowButtonRight1 style={{
            width: 10,
            height: 10,
            marginLeft: 10,
            color: theme_1.theme.pillText,
            transform: showExtraBalances ? 'rotateZ(180deg)' : 'rotateZ(0)',
            opacity: isButtonHovered || selectedItems.size > 0 || showExtraBalances
                ? 1
                : 0,
        }}/>
      </button_1.Button>

      {showExtraBalances && <MoreBalances balanceQuery={balanceQuery}/>}

      {selectedItems.size > 0 && (<SelectedBalance selectedItems={selectedItems} account={account}/>)}
      {isFiltered && <FilteredBalance filteredAmount={filteredAmount}/>}
    </view_1.View>);
}
