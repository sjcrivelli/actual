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
exports.ROW_HEIGHT = void 0;
exports.ScheduleAmountCell = ScheduleAmountCell;
exports.SchedulesTable = SchedulesTable;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var months_1 = require("loot-core/shared/months");
var normalisation_1 = require("loot-core/shared/normalisation");
var schedules_1 = require("loot-core/shared/schedules");
var StatusBadge_1 = require("./StatusBadge");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var table_1 = require("@desktop-client/components/table");
var DisplayId_1 = require("@desktop-client/components/util/DisplayId");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
exports.ROW_HEIGHT = 43;
function OverflowMenu(_a) {
    var schedule = _a.schedule, status = _a.status, onAction = _a.onAction;
    var t = (0, react_i18next_1.useTranslation)().t;
    var getMenuItems = function () {
        var menuItems = [];
        menuItems.push({
            name: 'post-transaction',
            text: t('Post transaction'),
        }, {
            name: 'post-transaction-today',
            text: t('Post transaction today'),
        });
        if (status === 'completed') {
            menuItems.push({
                name: 'restart',
                text: t('Restart'),
            });
        }
        else {
            menuItems.push({
                name: 'skip',
                text: t('Skip next scheduled date'),
            }, {
                name: 'complete',
                text: t('Complete'),
            });
        }
        menuItems.push({ name: 'delete', text: t('Delete') });
        return menuItems;
    };
    return (<menu_1.Menu onMenuSelect={function (name) {
            onAction(name, schedule.id);
        }} items={getMenuItems()}/>);
}
function ScheduleAmountCell(_a) {
    var amount = _a.amount, op = _a.op;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var num = (0, schedules_1.getScheduledAmount)(amount);
    var currencyAmount = format(Math.abs(num || 0), 'financial');
    var isApprox = op === 'isapprox' || op === 'isbetween';
    return (<table_1.Cell width={100} plain style={{
            textAlign: 'right',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 5px',
        }} name="amount">
      {isApprox && (<view_1.View style={{
                textAlign: 'left',
                color: theme_1.theme.pageTextSubdued,
                lineHeight: '1em',
                marginRight: 10,
            }} title={isApprox
                ? t('Approximately {{currencyAmount}}', { currencyAmount: currencyAmount })
                : currencyAmount}>
          ~
        </view_1.View>)}
      <text_1.Text style={{
            flex: 1,
            color: num > 0 ? theme_1.theme.noticeTextLight : theme_1.theme.tableText,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }} title={isApprox
            ? t('Approximately {{currencyAmount}}', { currencyAmount: currencyAmount })
            : currencyAmount}>
        <PrivacyFilter_1.PrivacyFilter>
          {num > 0 ? "+".concat(currencyAmount) : "".concat(currencyAmount)}
        </PrivacyFilter_1.PrivacyFilter>
      </text_1.Text>
    </table_1.Cell>);
}
function ScheduleRow(_a) {
    var schedule = _a.schedule, onAction = _a.onAction, onSelect = _a.onSelect, minimal = _a.minimal, statuses = _a.statuses, dateFormat = _a.dateFormat;
    var t = (0, react_i18next_1.useTranslation)().t;
    var rowRef = (0, react_1.useRef)(null);
    var buttonRef = (0, react_1.useRef)(null);
    var _b = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _b.setMenuOpen, menuOpen = _b.menuOpen, handleContextMenu = _b.handleContextMenu, resetPosition = _b.resetPosition, position = _b.position, asContextMenu = _b.asContextMenu;
    return (<table_1.Row ref={rowRef} height={exports.ROW_HEIGHT} inset={15} onClick={function () { return onSelect(schedule.id); }} style={{
            cursor: 'pointer',
            backgroundColor: theme_1.theme.tableBackground,
            color: theme_1.theme.tableText,
            ':hover': { backgroundColor: theme_1.theme.tableRowBackgroundHover },
        }} onContextMenu={handleContextMenu}>
      {!minimal && (<popover_1.Popover triggerRef={asContextMenu ? rowRef : buttonRef} isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} isNonModal placement="bottom start" {...position} style={{ margin: 1 }}>
          <OverflowMenu schedule={schedule} status={statuses.get(schedule.id)} onAction={function (action, id) {
                onAction(action, id);
                resetPosition();
                setMenuOpen(false);
            }}/>
        </popover_1.Popover>)}
      <table_1.Field width="flex" name="name">
        <text_1.Text style={schedule.name == null
            ? { color: theme_1.theme.buttonNormalDisabledText }
            : null} title={schedule.name ? schedule.name : ''}>
          {schedule.name ? schedule.name : t('None')}
        </text_1.Text>
      </table_1.Field>
      <table_1.Field width="flex" name="payee">
        <DisplayId_1.DisplayId type="payees" id={schedule._payee}/>
      </table_1.Field>
      <table_1.Field width="flex" name="account">
        <DisplayId_1.DisplayId type="accounts" id={schedule._account}/>
      </table_1.Field>
      <table_1.Field width={110} name="date">
        {schedule.next_date
            ? (0, months_1.format)(schedule.next_date, dateFormat)
            : null}
      </table_1.Field>
      <table_1.Field width={120} name="status" style={{ alignItems: 'flex-start' }}>
        <StatusBadge_1.StatusBadge status={statuses.get(schedule.id)}/>
      </table_1.Field>
      <ScheduleAmountCell amount={schedule._amount} op={schedule._amountOp}/>
      {!minimal && (<table_1.Field width={80} style={{ textAlign: 'center' }}>
          {schedule._date && schedule._date.frequency && (<v2_1.SvgCheck style={{ width: 13, height: 13 }}/>)}
        </table_1.Field>)}
      {!minimal && (<table_1.Field width={40} name="actions">
          <view_1.View>
            <button_1.Button ref={buttonRef} variant="bare" aria-label={t('Menu')} onPress={function () {
                resetPosition();
                setMenuOpen(true);
            }}>
              <v1_1.SvgDotsHorizontalTriple width={15} height={15} style={{ transform: 'rotateZ(90deg)' }}/>
            </button_1.Button>
          </view_1.View>
        </table_1.Field>)}
    </table_1.Row>);
}
function SchedulesTable(_a) {
    var isLoading = _a.isLoading, schedules = _a.schedules, statuses = _a.statuses, filter = _a.filter, minimal = _a.minimal, allowCompleted = _a.allowCompleted, style = _a.style, onSelect = _a.onSelect, onAction = _a.onAction, tableStyle = _a.tableStyle;
    var t = (0, react_i18next_1.useTranslation)().t;
    var format = (0, useFormat_1.useFormat)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var _b = (0, react_1.useState)(false), showCompleted = _b[0], setShowCompleted = _b[1];
    var payees = (0, usePayees_1.usePayees)();
    var accounts = (0, useAccounts_1.useAccounts)();
    var filteredSchedules = (0, react_1.useMemo)(function () {
        if (!filter) {
            return schedules;
        }
        var filterIncludes = function (str) {
            return str
                ? (0, normalisation_1.getNormalisedString)(str).includes((0, normalisation_1.getNormalisedString)(filter)) ||
                    (0, normalisation_1.getNormalisedString)(filter).includes((0, normalisation_1.getNormalisedString)(str))
                : false;
        };
        return schedules.filter(function (schedule) {
            var payee = payees.find(function (p) { return schedule._payee === p.id; });
            var account = accounts.find(function (a) { return schedule._account === a.id; });
            var amount = (0, schedules_1.getScheduledAmount)(schedule._amount);
            var amountStr = (schedule._amountOp === 'isapprox' || schedule._amountOp === 'isbetween'
                ? '~'
                : '') +
                (amount > 0 ? '+' : '') +
                format(Math.abs(amount || 0), 'financial');
            var dateStr = schedule.next_date
                ? (0, months_1.format)(schedule.next_date, dateFormat)
                : null;
            return (filterIncludes(schedule.name) ||
                filterIncludes(payee && payee.name) ||
                filterIncludes(account && account.name) ||
                filterIncludes(amountStr) ||
                filterIncludes(statuses.get(schedule.id)) ||
                filterIncludes(dateStr));
        });
    }, [payees, accounts, schedules, filter, statuses]);
    var items = (0, react_1.useMemo)(function () {
        var unCompletedSchedules = filteredSchedules.filter(function (s) { return !s.completed; });
        if (!allowCompleted) {
            return unCompletedSchedules;
        }
        if (showCompleted) {
            return filteredSchedules;
        }
        var hasCompletedSchedule = filteredSchedules.find(function (s) { return s.completed; });
        if (!hasCompletedSchedule)
            return unCompletedSchedules;
        return __spreadArray(__spreadArray([], unCompletedSchedules, true), [{ id: 'show-completed' }], false);
    }, [filteredSchedules, showCompleted, allowCompleted]);
    function renderItem(_a) {
        var item = _a.item;
        if (item.id === 'show-completed') {
            return (<table_1.Row height={exports.ROW_HEIGHT} inset={15} style={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    ':hover': { backgroundColor: theme_1.theme.tableRowBackgroundHover },
                }} onClick={function () { return setShowCompleted(true); }}>
          <table_1.Field width="flex" style={{
                    fontStyle: 'italic',
                    textAlign: 'center',
                    color: theme_1.theme.tableText,
                }}>
            <react_i18next_1.Trans>Show completed schedules</react_i18next_1.Trans>
          </table_1.Field>
        </table_1.Row>);
        }
        return (<ScheduleRow schedule={item} {...{ statuses: statuses, dateFormat: dateFormat, onSelect: onSelect, onAction: onAction, minimal: minimal }}/>);
    }
    return (<view_1.View style={__assign({ flex: 1 }, tableStyle)}>
      <table_1.TableHeader height={exports.ROW_HEIGHT} inset={15}>
        <table_1.Field width="flex">
          <react_i18next_1.Trans>Name</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width="flex">
          <react_i18next_1.Trans>Payee</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width="flex">
          <react_i18next_1.Trans>Account</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width={110}>
          <react_i18next_1.Trans>Next date</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width={120}>
          <react_i18next_1.Trans>Status</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width={100} style={{ textAlign: 'right' }}>
          <react_i18next_1.Trans>Amount</react_i18next_1.Trans>
        </table_1.Field>
        {!minimal && (<table_1.Field width={80} style={{ textAlign: 'center' }}>
            <react_i18next_1.Trans>Recurring</react_i18next_1.Trans>
          </table_1.Field>)}
        {!minimal && <table_1.Field width={40}/>}
      </table_1.TableHeader>
      <table_1.Table loading={isLoading} rowHeight={exports.ROW_HEIGHT} backgroundColor="transparent" style={__assign({ flex: 1, backgroundColor: 'transparent' }, style)} items={items} renderItem={renderItem} renderEmpty={filter ? t('No matching schedules') : t('No schedules')}/>
    </view_1.View>);
}
