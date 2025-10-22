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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROW_HEIGHT = void 0;
exports.TransactionListItem = TransactionListItem;
var react_1 = require("react");
var react_aria_1 = require("react-aria");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var interactions_1 = require("@react-aria/interactions");
var transactions_1 = require("loot-core/shared/transactions");
var util_1 = require("loot-core/shared/util");
var TransactionEdit_1 = require("./TransactionEdit");
var util_2 = require("@desktop-client/components/budget/util");
var useAccount_1 = require("@desktop-client/hooks/useAccount");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useDisplayPayee_1 = require("@desktop-client/hooks/useDisplayPayee");
var usePayee_1 = require("@desktop-client/hooks/usePayee");
var NotesTagFormatter_1 = require("@desktop-client/notes/NotesTagFormatter");
var redux_1 = require("@desktop-client/redux");
exports.ROW_HEIGHT = 60;
var getTextStyle = function (_a) {
    var isPreview = _a.isPreview;
    return (__assign(__assign(__assign({}, styles_1.styles.text), { fontSize: 14 }), (isPreview
        ? {
            fontStyle: 'italic',
            color: theme_1.theme.pageTextLight,
        }
        : {})));
};
var getScheduleIconStyle = function (_a) {
    var isPreview = _a.isPreview;
    return ({
        width: 12,
        height: 12,
        marginRight: 5,
        color: isPreview ? theme_1.theme.pageTextLight : theme_1.theme.menuItemText,
    });
};
function TransactionListItem(_a) {
    var onPress = _a.onPress, onLongPress = _a.onLongPress, props = __rest(_a, ["onPress", "onLongPress"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var categories = (0, useCategories_1.useCategories)().list;
    var transaction = props.value;
    var payee = (0, usePayee_1.usePayee)((transaction === null || transaction === void 0 ? void 0 : transaction.payee) || '');
    var displayPayee = (0, useDisplayPayee_1.useDisplayPayee)({ transaction: transaction });
    var account = (0, useAccount_1.useAccount)((transaction === null || transaction === void 0 ? void 0 : transaction.account) || '');
    var transferAccount = (0, useAccount_1.useAccount)((payee === null || payee === void 0 ? void 0 : payee.transfer_acct) || '');
    var isPreview = (0, transactions_1.isPreviewId)((transaction === null || transaction === void 0 ? void 0 : transaction.id) || '');
    var newTransactions = (0, redux_1.useSelector)(function (state) { return state.transactions.newTransactions; });
    var longPressProps = (0, interactions_1.useLongPress)({
        accessibilityDescription: 'Long press to select multiple transactions',
        onLongPress: function () {
            if (isPreview) {
                return;
            }
            onLongPress(transaction);
        },
    }).longPressProps;
    var pressProps = (0, interactions_1.usePress)({
        onPress: function () {
            onPress(transaction);
        },
    }).pressProps;
    if (!transaction) {
        return null;
    }
    var id = transaction.id, amount = transaction.amount, categoryId = transaction.category, isCleared = transaction.cleared, isReconciled = transaction.reconciled, isParent = transaction.is_parent, isChild = transaction.is_child, notes = transaction.notes, forceUpcoming = transaction.forceUpcoming;
    var previewStatus = forceUpcoming ? 'upcoming' : categoryId;
    var isAdded = newTransactions.includes(id);
    var categoryName = (0, TransactionEdit_1.lookupName)(categories, categoryId);
    var specialCategory = (account === null || account === void 0 ? void 0 : account.offbudget)
        ? t('Off budget')
        : transferAccount && !transferAccount.offbudget
            ? t('Transfer')
            : isParent
                ? t('Split')
                : null;
    var prettyCategory = specialCategory || categoryName;
    var textStyle = getTextStyle({ isPreview: isPreview });
    return (<react_aria_components_1.ListBoxItem textValue={id} {...props}>
      {function (itemProps) { return (<interactions_1.PressResponder {...(0, react_aria_1.mergeProps)(pressProps, longPressProps)}>
          <button_1.Button {...itemProps} style={__assign(__assign({ userSelect: 'none', height: exports.ROW_HEIGHT, width: '100%', borderRadius: 0 }, (itemProps.isSelected
                ? {
                    borderWidth: '0 0 0 4px',
                    borderColor: theme_1.theme.mobileTransactionSelected,
                    borderStyle: 'solid',
                }
                : {
                    borderWidth: '0 0 1px 0',
                    borderColor: theme_1.theme.tableBorder,
                    borderStyle: 'solid',
                })), (isPreview
                ? {
                    backgroundColor: theme_1.theme.tableRowHeaderBackground,
                }
                : {
                    backgroundColor: theme_1.theme.tableBackground,
                }))}>
            <view_1.View style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
            }}>
              <view_1.View style={{ flex: 1 }}>
                <view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <PayeeIcons transaction={transaction} transferAccount={transferAccount}/>
                  <text_one_line_1.TextOneLine style={__assign(__assign(__assign({}, textStyle), { fontWeight: isAdded ? '600' : '400' }), (!displayPayee && !isPreview
                ? {
                    color: theme_1.theme.pageTextLight,
                    fontStyle: 'italic',
                }
                : {}))}>
                    {displayPayee || t('(No payee)')}
                  </text_one_line_1.TextOneLine>
                </view_1.View>
                {isPreview ? (<TransactionEdit_1.Status status={previewStatus} isSplit={isParent || isChild}/>) : (<view_1.View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                }}>
                    {isReconciled ? (<v2_1.SvgLockClosed style={{
                        width: 11,
                        height: 11,
                        color: theme_1.theme.noticeTextLight,
                        marginRight: 5,
                    }}/>) : (<v2_1.SvgCheckCircle1 style={{
                        width: 11,
                        height: 11,
                        color: isCleared
                            ? theme_1.theme.noticeTextLight
                            : theme_1.theme.pageTextSubdued,
                        marginRight: 5,
                    }}/>)}
                    {(isParent || isChild) && (<v0_1.SvgSplit style={{
                        width: 12,
                        height: 12,
                        marginRight: 5,
                    }}/>)}
                    <text_one_line_1.TextOneLine style={{
                    fontSize: 11,
                    marginTop: 1,
                    fontWeight: '400',
                    color: prettyCategory
                        ? theme_1.theme.tableText
                        : theme_1.theme.menuItemTextSelected,
                    fontStyle: specialCategory || !prettyCategory
                        ? 'italic'
                        : undefined,
                    textAlign: 'left',
                }}>
                      {prettyCategory || t('Uncategorized')}
                    </text_one_line_1.TextOneLine>
                  </view_1.View>)}
                {notes && (<text_one_line_1.TextOneLine style={{
                    fontSize: 11,
                    marginTop: 4,
                    fontWeight: '400',
                    color: theme_1.theme.tableText,
                    textAlign: 'left',
                    opacity: 0.85,
                }}>
                    <NotesTagFormatter_1.NotesTagFormatter notes={notes}/>
                  </text_one_line_1.TextOneLine>)}
              </view_1.View>
              <view_1.View style={{ justifyContent: 'center' }}>
                <text_1.Text style={__assign(__assign({}, textStyle), (0, util_2.makeAmountFullStyle)(amount))}>
                  {(0, util_1.integerToCurrency)(amount)}
                </text_1.Text>
              </view_1.View>
            </view_1.View>
          </button_1.Button>
        </interactions_1.PressResponder>); }}
    </react_aria_components_1.ListBoxItem>);
}
function PayeeIcons(_a) {
    var transaction = _a.transaction, transferAccount = _a.transferAccount;
    var id = transaction.id, scheduleId = transaction.schedule;
    var _b = (0, useCachedSchedules_1.useCachedSchedules)(), isSchedulesLoading = _b.isLoading, _c = _b.schedules, schedules = _c === void 0 ? [] : _c;
    var isPreview = (0, transactions_1.isPreviewId)(id);
    var schedule = schedules.find(function (s) { return s.id === scheduleId; });
    var isScheduleRecurring = schedule && schedule._date && !!schedule._date.frequency;
    if (isSchedulesLoading) {
        return null;
    }
    return (<>
      {schedule &&
            (isScheduleRecurring ? (<v2_1.SvgArrowsSynchronize style={getScheduleIconStyle({ isPreview: isPreview })}/>) : (<v2_1.SvgCalendar3 style={getScheduleIconStyle({ isPreview: isPreview })}/>))}
      {transferAccount &&
            (transaction.amount > 0 ? (<v0_1.SvgLeftArrow2 style={{ width: 12, height: 12, marginRight: 5 }}/>) : (<v0_1.SvgRightArrow2 style={{ width: 12, height: 12, marginRight: 5 }}/>))}
    </>);
}
