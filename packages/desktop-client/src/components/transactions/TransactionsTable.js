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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.TransactionTable = void 0;
var react_1 = require("react");
var react_hotkeys_hook_1 = require("react-hotkeys-hook");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var popover_1 = require("@actual-app/components/popover");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var monthUtils = require("loot-core/shared/months");
var schedules_1 = require("loot-core/shared/schedules");
var transactions_1 = require("loot-core/shared/transactions");
var util_1 = require("loot-core/shared/util");
var utils_1 = require("./table/utils");
var TransactionMenu_1 = require("./TransactionMenu");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var AccountAutocomplete_1 = require("@desktop-client/components/autocomplete/AccountAutocomplete");
var CategoryAutocomplete_1 = require("@desktop-client/components/autocomplete/CategoryAutocomplete");
var PayeeAutocomplete_1 = require("@desktop-client/components/autocomplete/PayeeAutocomplete");
var StatusBadge_1 = require("@desktop-client/components/schedules/StatusBadge");
var DateSelect_1 = require("@desktop-client/components/select/DateSelect");
var table_1 = require("@desktop-client/components/table");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useDisplayPayee_1 = require("@desktop-client/hooks/useDisplayPayee");
var useLocalPref_1 = require("@desktop-client/hooks/useLocalPref");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
var usePrevious_1 = require("@desktop-client/hooks/usePrevious");
var useProperFocus_1 = require("@desktop-client/hooks/useProperFocus");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSheetName_1 = require("@desktop-client/hooks/useSheetName");
var useSplitsExpanded_1 = require("@desktop-client/hooks/useSplitsExpanded");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var NotesTagFormatter_1 = require("@desktop-client/notes/NotesTagFormatter");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
var TransactionHeader = (0, react_1.memo)(function (_a) {
    var hasSelected = _a.hasSelected, showAccount = _a.showAccount, showCategory = _a.showCategory, showBalance = _a.showBalance, showCleared = _a.showCleared, scrollWidth = _a.scrollWidth, onSort = _a.onSort, ascDesc = _a.ascDesc, field = _a.field, showSelection = _a.showSelection;
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+a, cmd+a, meta+a', function () { return dispatchSelected({ type: 'select-all' }); }, {
        preventDefault: true,
        scopes: ['app'],
    }, [dispatchSelected]);
    return (<table_1.Row style={{
            fontWeight: 300,
            zIndex: 200,
            color: theme_1.theme.tableHeaderText,
            backgroundColor: theme_1.theme.tableBackground,
            paddingRight: "".concat(5 + (scrollWidth !== null && scrollWidth !== void 0 ? scrollWidth : 0), "px"),
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: theme_1.theme.tableBorder,
        }}>
        {showSelection && (<table_1.SelectCell exposed={true} focused={false} selected={hasSelected} width={20} style={{
                borderTopWidth: 0,
                borderBottomWidth: 0,
            }} icon={<v2_1.SvgSubtract width={6} height={6}/>} onSelect={function (e) {
                return dispatchSelected({
                    type: 'select-all',
                    isRangeSelect: e.shiftKey,
                });
            }}/>)}
        {!showSelection && (<table_1.Field style={{
                width: '20px',
                border: 0,
            }}/>)}
        <HeaderCell value={t('Date')} width={110} alignItems="flex" marginLeft={-5} id="date" icon={field === 'date' ? ascDesc : 'clickable'} onClick={function () {
            return onSort('date', (0, utils_1.selectAscDesc)(field, ascDesc, 'date', 'desc'));
        }}/>
        {showAccount && (<HeaderCell value={t('Account')} width="flex" alignItems="flex" marginLeft={-5} id="account" icon={field === 'account' ? ascDesc : 'clickable'} onClick={function () {
                return onSort('account', (0, utils_1.selectAscDesc)(field, ascDesc, 'account', 'asc'));
            }}/>)}
        <HeaderCell value={t('Payee')} width="flex" alignItems="flex" marginLeft={-5} id="payee" icon={field === 'payee' ? ascDesc : 'clickable'} onClick={function () {
            return onSort('payee', (0, utils_1.selectAscDesc)(field, ascDesc, 'payee', 'asc'));
        }}/>
        <HeaderCell value={t('Notes')} width="flex" alignItems="flex" marginLeft={-5} id="notes" icon={field === 'notes' ? ascDesc : 'clickable'} onClick={function () {
            return onSort('notes', (0, utils_1.selectAscDesc)(field, ascDesc, 'notes', 'asc'));
        }}/>
        {showCategory && (<HeaderCell value={t('Category')} width="flex" alignItems="flex" marginLeft={-5} id="category" icon={field === 'category' ? ascDesc : 'clickable'} onClick={function () {
                return onSort('category', (0, utils_1.selectAscDesc)(field, ascDesc, 'category', 'asc'));
            }}/>)}
        <HeaderCell value={t('Payment')} width={100} alignItems="flex-end" marginRight={-5} id="payment" icon={field === 'payment' ? ascDesc : 'clickable'} onClick={function () {
            return onSort('payment', (0, utils_1.selectAscDesc)(field, ascDesc, 'payment', 'asc'));
        }}/>
        <HeaderCell value={t('Deposit')} width={100} alignItems="flex-end" marginRight={-5} id="deposit" icon={field === 'deposit' ? ascDesc : 'clickable'} onClick={function () {
            return onSort('deposit', (0, utils_1.selectAscDesc)(field, ascDesc, 'deposit', 'desc'));
        }}/>
        {showBalance && (<HeaderCell value={t('Balance')} width={103} alignItems="flex-end" marginRight={-5} id="balance"/>)}
        {showCleared && (<HeaderCell value="✓" width={38} alignItems="center" id="cleared" icon={field === 'cleared' ? ascDesc : 'clickable'} onClick={function () {
                onSort('cleared', (0, utils_1.selectAscDesc)(field, ascDesc, 'cleared', 'asc'));
            }}/>)}
      </table_1.Row>);
});
TransactionHeader.displayName = 'TransactionHeader';
function StatusCell(_a) {
    var id = _a.id, focused = _a.focused, selected = _a.selected, status = _a.status, isChild = _a.isChild, isPreview = _a.isPreview, onEdit = _a.onEdit, onUpdate = _a.onUpdate;
    var isClearedField = status === 'cleared' || status === 'reconciled' || status == null;
    var statusProps = (0, StatusBadge_1.getStatusProps)(status);
    var statusColor = status === 'cleared'
        ? theme_1.theme.noticeTextLight
        : status === 'reconciled'
            ? theme_1.theme.noticeTextLight
            : status === 'missed'
                ? theme_1.theme.errorText
                : status === 'due'
                    ? theme_1.theme.warningText
                    : selected
                        ? theme_1.theme.pageTextLinkLight
                        : theme_1.theme.pageTextSubdued;
    function onSelect() {
        if (isClearedField) {
            onUpdate('cleared', !(status === 'cleared'));
        }
    }
    return (<table_1.Cell name="cleared" width={38} alignItems="center" focused={focused} style={{ padding: 1 }} plain>
      <table_1.CellButton style={__assign({ padding: 3, backgroundColor: 'transparent', border: '1px solid transparent', borderRadius: 50, ':focus': __assign({}, (isPreview
                ? {
                    boxShadow: 'none',
                }
                : {
                    border: '1px solid ' + theme_1.theme.formInputBorderSelected,
                    boxShadow: '0 1px 2px ' + theme_1.theme.formInputBorderSelected,
                })), cursor: isClearedField ? 'pointer' : 'default' }, (isChild && { visibility: 'hidden' }))} disabled={isPreview || isChild} onEdit={function () { return onEdit(id, 'cleared'); }} onSelect={onSelect}>
        {(0, react_1.createElement)(statusProps.Icon, {
            style: {
                width: 13,
                height: 13,
                color: statusColor,
                marginTop: status === 'due' ? -1 : 0,
            },
        })}
      </table_1.CellButton>
    </table_1.Cell>);
}
function HeaderCell(_a) {
    var value = _a.value, id = _a.id, width = _a.width, alignItems = _a.alignItems, marginLeft = _a.marginLeft, marginRight = _a.marginRight, icon = _a.icon, onClick = _a.onClick;
    var style = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme_1.theme.tableHeaderText,
        fontWeight: 300,
        marginLeft: marginLeft,
        marginRight: marginRight,
    };
    return (<table_1.CustomCell width={width} name={id} alignItems={alignItems} value={value} style={{
            borderTopWidth: 0,
            borderBottomWidth: 0,
        }} unexposedContent={function (_a) {
            var cellValue = _a.value;
            return onClick ? (<button_1.Button variant="bare" onPress={onClick} style={style}>
            <table_1.UnexposedCellContent value={cellValue}/>
            {icon === 'asc' && (<v1_1.SvgArrowDown width={10} height={10} style={{ marginLeft: 5 }}/>)}
            {icon === 'desc' && (<v1_1.SvgArrowUp width={10} height={10} style={{ marginLeft: 5 }}/>)}
          </button_1.Button>) : (<text_1.Text style={style}>{cellValue}</text_1.Text>);
        }}/>);
}
function PayeeCell(_a) {
    var _this = this;
    var id = _a.id, payee = _a.payee, focused = _a.focused, payees = _a.payees, accounts = _a.accounts, transferAccountsByTransaction = _a.transferAccountsByTransaction, valueStyle = _a.valueStyle, transaction = _a.transaction, importedPayee = _a.importedPayee, isPreview = _a.isPreview, onEdit = _a.onEdit, onUpdate = _a.onUpdate, onCreatePayee = _a.onCreatePayee, onManagePayees = _a.onManagePayees, onNavigateToTransferAccount = _a.onNavigateToTransferAccount, onNavigateToSchedule = _a.onNavigateToSchedule;
    var isCreatingPayee = (0, react_1.useRef)(false);
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var transferAccount = transferAccountsByTransaction[transaction.id];
    var displayPayee = (0, useDisplayPayee_1.useDisplayPayee)({ transaction: transaction });
    return transaction.is_parent ? (<table_1.Cell name="payee" width="flex" focused={focused} style={{ padding: 0 }} plain>
      <table_1.CellButton bare style={{
            alignSelf: 'stretch',
            borderRadius: 4,
            border: '1px solid transparent', // so it doesn't shift on hover
            ':hover': isPreview
                ? {}
                : {
                    border: '1px solid ' + theme_1.theme.buttonNormalBorder,
                },
        }} disabled={isPreview} onSelect={function () {
            return dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'payee-autocomplete',
                    options: {
                        onSelect: function (payeeId) {
                            onUpdate('payee', payeeId);
                        },
                    },
                },
            }));
        }}>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: 4,
            flex: 1,
            padding: 4,
            color: theme_1.theme.pageTextSubdued,
        }}>
          <PayeeIcons transaction={transaction} transferAccount={transferAccount} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule}/>
          <v0_1.SvgSplit style={{
            color: 'inherit',
            width: 14,
            height: 14,
            marginRight: 5,
            flexShrink: 0,
        }}/>
          <text_1.Text style={{
            fontStyle: 'italic',
            fontWeight: 300,
            userSelect: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
            borderBottom: importedPayee
                ? "1px dashed ".concat(theme_1.theme.pageTextSubdued)
                : 'none',
        }}>
            {importedPayee ? (<tooltip_1.Tooltip content={<view_1.View style={{ padding: 10 }}>
                    <text_1.Text style={{ fontWeight: 'bold' }}>
                      <react_i18next_1.Trans>Imported Payee</react_i18next_1.Trans>
                    </text_1.Text>
                    <text_1.Text style={{ fontWeight: 'normal' }}>
                      {importedPayee}
                    </text_1.Text>
                  </view_1.View>} style={__assign(__assign({}, styles_1.styles.tooltip), { borderRadius: '0px 5px 5px 0px' })} placement="bottom" triggerProps={{ delay: 750 }}>
                {displayPayee}
              </tooltip_1.Tooltip>) : (displayPayee)}
          </text_1.Text>
        </view_1.View>
      </table_1.CellButton>
    </table_1.Cell>) : (<table_1.CustomCell width="flex" name="payee" textAlign="flex" value={payee === null || payee === void 0 ? void 0 : payee.id} valueStyle={valueStyle} exposed={focused} onExpose={function (name) { return !isPreview && onEdit(id, name); }} onUpdate={function (value) { return __awaiter(_this, void 0, void 0, function () {
            var id_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onUpdate('payee', value);
                        if (!(value && value.startsWith('new:') && !isCreatingPayee.current)) return [3 /*break*/, 2];
                        isCreatingPayee.current = true;
                        return [4 /*yield*/, onCreatePayee(value.slice('new:'.length))];
                    case 1:
                        id_1 = _a.sent();
                        onUpdate('payee', id_1 !== null && id_1 !== void 0 ? id_1 : undefined);
                        isCreatingPayee.current = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); }} formatter={function () {
            if (!displayPayee && isPreview) {
                return t('(No payee)');
            }
            return displayPayee;
        }} unexposedContent={function (props) {
            var payeeName = (<table_1.UnexposedCellContent {...props} style={importedPayee
                    ? { borderBottom: "1px dashed ".concat(theme_1.theme.pageTextSubdued) }
                    : {}}/>);
            return (<>
            <PayeeIcons transaction={transaction} transferAccount={transferAccount} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule}/>
            <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                }}>
              {importedPayee ? (<tooltip_1.Tooltip content={<view_1.View style={{ padding: 10 }}>
                      <text_1.Text style={{ fontWeight: 'bold' }}>
                        <react_i18next_1.Trans>Imported Payee</react_i18next_1.Trans>
                      </text_1.Text>
                      <text_1.Text style={{ fontWeight: 'normal' }}>
                        {importedPayee}
                      </text_1.Text>
                    </view_1.View>} style={__assign(__assign({}, styles_1.styles.tooltip), { borderRadius: '0px 5px 5px 0px' })} placement="bottom" triggerProps={{ delay: 750 }}>
                  {payeeName}
                </tooltip_1.Tooltip>) : (payeeName)}
            </div>
          </>);
        }}>
      {function (_a) {
            var _b;
            var onBlur = _a.onBlur, onKeyDown = _a.onKeyDown, onUpdate = _a.onUpdate, onSave = _a.onSave, shouldSaveFromKey = _a.shouldSaveFromKey, inputStyle = _a.inputStyle;
            return (<PayeeAutocomplete_1.PayeeAutocomplete payees={payees} accounts={accounts} value={(_b = payee === null || payee === void 0 ? void 0 : payee.id) !== null && _b !== void 0 ? _b : null} shouldSaveFromKey={shouldSaveFromKey} inputProps={{
                    onBlur: onBlur,
                    onKeyDown: onKeyDown,
                    style: inputStyle,
                }} showManagePayees={true} clearOnBlur={false} focused={true} onUpdate={function (_, value) { return onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(value); }} onSelect={onSave} onManagePayees={function () { return onManagePayees(payee === null || payee === void 0 ? void 0 : payee.id); }}/>);
        }}
    </table_1.CustomCell>);
}
var payeeIconButtonStyle = {
    marginLeft: -5,
    marginRight: 2,
    width: 23,
    height: 23,
    color: 'inherit',
};
var scheduleIconStyle = { width: 13, height: 13 };
var transferIconStyle = { width: 10, height: 10 };
function PayeeIcons(_a) {
    var transaction = _a.transaction, transferAccount = _a.transferAccount, onNavigateToTransferAccount = _a.onNavigateToTransferAccount, onNavigateToSchedule = _a.onNavigateToSchedule;
    var t = (0, react_i18next_1.useTranslation)().t;
    var scheduleId = transaction.schedule;
    var _b = (0, useCachedSchedules_1.useCachedSchedules)(), isLoading = _b.isLoading, _c = _b.schedules, schedules = _c === void 0 ? [] : _c;
    if (isLoading) {
        return null;
    }
    var schedule = scheduleId ? schedules.find(function (s) { return s.id === scheduleId; }) : null;
    if (schedule == null && transferAccount == null) {
        // Neither a valid scheduled transaction nor a transfer.
        return null;
    }
    var recurring = schedule && schedule._date && !!schedule._date.frequency;
    var isDeposit = transaction.amount > 0;
    return (<>
      {schedule && (<button_1.Button variant="bare" data-testid="schedule-icon" aria-label={t('See schedule details')} style={payeeIconButtonStyle} onPress={function () {
                if (scheduleId) {
                    onNavigateToSchedule(scheduleId);
                }
            }}>
          {recurring ? (<v2_1.SvgArrowsSynchronize style={scheduleIconStyle}/>) : (<v2_1.SvgCalendar3 style={scheduleIconStyle}/>)}
        </button_1.Button>)}
      {transferAccount && (<button_1.Button variant="bare" data-testid="transfer-icon" aria-label={t('See transfer account')} style={payeeIconButtonStyle} onPress={function () {
                if (!(0, transactions_1.isTemporaryId)(transaction.id)) {
                    onNavigateToTransferAccount(transferAccount.id);
                }
            }}>
          {isDeposit ? (<v0_1.SvgLeftArrow2 style={transferIconStyle}/>) : (<v0_1.SvgRightArrow2 style={transferIconStyle}/>)}
        </button_1.Button>)}
    </>);
}
var Transaction = (0, react_1.memo)(function Transaction(_a) {
    var _this = this;
    var _b;
    var allTransactions = _a.allTransactions, originalTransaction = _a.transaction, subtransactions = _a.subtransactions, transferAccountsByTransaction = _a.transferAccountsByTransaction, editing = _a.editing, showAccount = _a.showAccount, showBalance = _a.showBalance, showCleared = _a.showCleared, showZeroInDeposit = _a.showZeroInDeposit, style = _a.style, selected = _a.selected, highlighted = _a.highlighted, added = _a.added, matched = _a.matched, expanded = _a.expanded, focusedField = _a.focusedField, categoryGroups = _a.categoryGroups, payees = _a.payees, accounts = _a.accounts, balance = _a.balance, _c = _a.dateFormat, dateFormat = _c === void 0 ? 'MM/dd/yyyy' : _c, hideFraction = _a.hideFraction, onSave = _a.onSave, onEdit = _a.onEdit, onDelete = _a.onDelete, onBatchDelete = _a.onBatchDelete, onBatchDuplicate = _a.onBatchDuplicate, onBatchLinkSchedule = _a.onBatchLinkSchedule, onBatchUnlinkSchedule = _a.onBatchUnlinkSchedule, onCreateRule = _a.onCreateRule, onScheduleAction = _a.onScheduleAction, onMakeAsNonSplitTransactions = _a.onMakeAsNonSplitTransactions, onSplit = _a.onSplit, onManagePayees = _a.onManagePayees, onCreatePayee = _a.onCreatePayee, onToggleSplit = _a.onToggleSplit, onNavigateToTransferAccount = _a.onNavigateToTransferAccount, onNavigateToSchedule = _a.onNavigateToSchedule, onNotesTagClick = _a.onNotesTagClick, splitError = _a.splitError, listContainerRef = _a.listContainerRef, showSelection = _a.showSelection, allowSplitTransaction = _a.allowSplitTransaction, showHiddenCategories = _a.showHiddenCategories;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var triggerRef = (0, react_1.useRef)(null);
    var _d = (0, react_1.useState)(showZeroInDeposit), prevShowZero = _d[0], setPrevShowZero = _d[1];
    var _e = (0, react_1.useState)(originalTransaction), prevTransaction = _e[0], setPrevTransaction = _e[1];
    var _f = (0, react_1.useState)(function () {
        return (0, utils_1.serializeTransaction)(originalTransaction, showZeroInDeposit);
    }), transaction = _f[0], setTransaction = _f[1];
    var isPreview = (0, transactions_1.isPreviewId)(transaction.id);
    if (originalTransaction !== prevTransaction ||
        showZeroInDeposit !== prevShowZero) {
        setTransaction((0, utils_1.serializeTransaction)(originalTransaction, showZeroInDeposit));
        setPrevTransaction(originalTransaction);
        setPrevShowZero(showZeroInDeposit);
    }
    var _g = (0, react_1.useState)(false), showReconciliationWarning = _g[0], setShowReconciliationWarning = _g[1];
    var onUpdate = function (name, value) {
        // Had some issues with this is called twice which is a problem now that we are showing a warning
        // modal if the transaction is locked. I added a boolean to guard against showing the modal twice.
        // I'm still not completely happy with how the cells update pre/post modal. Sometimes you have to
        // click off of the cell manually after confirming your change post modal for example. The last
        // row seems to have more issues than others but the combination of tab, return, and clicking out
        // of the cell all have different implications as well.
        if (transaction[name] !== value) {
            if (transaction.reconciled === true &&
                (name === 'credit' ||
                    name === 'debit' ||
                    name === 'payee' ||
                    name === 'account' ||
                    name === 'date')) {
                if (showReconciliationWarning === false) {
                    setShowReconciliationWarning(true);
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'confirm-transaction-edit',
                            options: {
                                onCancel: function () {
                                    setShowReconciliationWarning(false);
                                },
                                onConfirm: function () {
                                    setShowReconciliationWarning(false);
                                    onUpdateAfterConfirm(name, value);
                                },
                                confirmReason: 'editReconciled',
                            },
                        },
                    }));
                }
            }
            else {
                onUpdateAfterConfirm(name, value);
            }
        }
        // Allow un-reconciling (unlocking) transactions
        if (name === 'cleared' && transaction.reconciled) {
            dispatch((0, modalsSlice_1.pushModal)({
                modal: {
                    name: 'confirm-transaction-edit',
                    options: {
                        onConfirm: function () {
                            onUpdateAfterConfirm('reconciled', false);
                        },
                        confirmReason: 'unlockReconciled',
                    },
                },
            }));
        }
    };
    var onUpdateAfterConfirm = function (name, value) {
        var _a;
        var newTransaction = __assign(__assign({}, transaction), (_a = {}, _a[name] = value, _a));
        // Don't change the note to an empty string if it's null (since they are both rendered the same)
        if (name === 'notes' && value === '' && transaction.notes == null) {
            return;
        }
        if (name === 'account' &&
            value &&
            (0, accountsSlice_1.getAccountsById)(accounts)[value].offbudget) {
            newTransaction.category = undefined;
        }
        // If entering an amount in either of the credit/debit fields, we
        // need to clear out the other one or both so it's always properly
        // translated into the desired amount (see
        // `deserializeTransaction`)
        if (name === 'credit') {
            newTransaction['debit'] = '';
        }
        else if (name === 'debit') {
            newTransaction['credit'] = '';
        }
        else {
            newTransaction['debit'] = '';
            newTransaction['credit'] = '';
        }
        if (name === 'account' && transaction.account !== value) {
            newTransaction.reconciled = false;
        }
        // Don't save a temporary value (a new payee) which will be
        // filled in with a real id later
        if (name === 'payee' &&
            value &&
            (value === null || value === void 0 ? void 0 : value.startsWith('new:'))) {
            setTransaction(newTransaction);
        }
        else {
            var deserialized = (0, utils_1.deserializeTransaction)(newTransaction, originalTransaction);
            // Run the transaction through the formatting so that we know
            // it's always showing the formatted result
            setTransaction((0, utils_1.serializeTransaction)(deserialized, showZeroInDeposit));
            var deserializedName = ['credit', 'debit'].includes(name)
                ? 'amount'
                : name;
            onSave(deserialized, subtransactions, deserializedName);
        }
    };
    var id = transaction.id, amount = transaction.amount, debit = transaction.debit, credit = transaction.credit, payeeId = transaction.payee, importedPayee = transaction.imported_payee, notes = transaction.notes, date = transaction.date, accountId = transaction.account, categoryId = transaction.category, cleared = transaction.cleared, reconciled = transaction.reconciled, forceUpcoming = transaction.forceUpcoming, isParent = transaction.is_parent, _h = transaction._unmatched, _unmatched = _h === void 0 ? false : _h;
    var _j = (0, useCachedSchedules_1.useCachedSchedules)().schedules, schedules = _j === void 0 ? [] : _j;
    var schedule = transaction.schedule
        ? schedules.find(function (s) { return s.id === transaction.schedule; })
        : null;
    var previewStatus = forceUpcoming ? 'upcoming' : categoryId;
    // Join in some data
    var payee = (payees && payeeId && (0, payeesSlice_1.getPayeesById)(payees)[payeeId]) || undefined;
    var account = accounts && accountId && (0, accountsSlice_1.getAccountsById)(accounts)[accountId];
    var isChild = transaction.is_child;
    var transferAcct = (0, transactions_1.isTemporaryId)(id) && (payee === null || payee === void 0 ? void 0 : payee.transfer_acct)
        ? (0, accountsSlice_1.getAccountsById)(accounts)[payee.transfer_acct]
        : transferAccountsByTransaction[id];
    var isBudgetTransfer = transferAcct && transferAcct.offbudget === 0;
    var isOffBudget = account && account.offbudget === 1;
    var valueStyle = added ? { fontWeight: 600 } : null;
    var backgroundFocus = focusedField === 'select';
    var amountStyle = hideFraction ? { letterSpacing: -0.5 } : null;
    var runningBalance = !(0, transactions_1.isTemporaryId)(id) ? balance : balance + amount;
    // Ok this entire logic is a dirty, dirty hack.. but let me explain.
    // Problem: the split-error Popover (which has the buttons to distribute/add split)
    // renders before schedules are added to the table. After schedules finally load
    // the entire table gets pushed down. But the Popover does not re-calculate
    // its positioning. This is because there is nothing in react-aria that would be
    // watching for the position of the trigger element.
    // Solution: when transactions (this includes schedules) change - we increment
    // a variable (with a small delay in order for the next render cycle to pick up
    // the change instead of the current). We pass the integer to the Popover which
    // causes it to re-calculate the positioning. Thus fixing the problem.
    var _k = (0, react_1.useState)(1), _ = _k[0], setUpdateId = _k[1];
    (0, react_1.useEffect)(function () {
        // The hack applies to only transactions with split errors
        if (!splitError) {
            return;
        }
        setTimeout(function () {
            setUpdateId(function (state) { return state + 1; });
        }, 1);
    }, [splitError, allTransactions]);
    var _l = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _l.setMenuOpen, menuOpen = _l.menuOpen, handleContextMenu = _l.handleContextMenu, position = _l.position;
    return (<table_1.Row ref={triggerRef} style={__assign(__assign(__assign(__assign({ backgroundColor: selected
                ? theme_1.theme.tableRowBackgroundHighlight
                : backgroundFocus
                    ? theme_1.theme.tableRowBackgroundHover
                    : theme_1.theme.tableBackground, ':hover': !(backgroundFocus || selected) && {
                backgroundColor: theme_1.theme.tableRowBackgroundHover,
            }, '& .hover-visible': {
                opacity: 0,
            }, ':hover .hover-visible': {
                opacity: 1,
            } }, (highlighted || selected
            ? { color: theme_1.theme.tableRowBackgroundHighlightText }
            : { color: theme_1.theme.tableText })), style), (isPreview && {
            color: theme_1.theme.tableTextInactive,
            fontStyle: 'italic',
        })), (_unmatched && { opacity: 0.5 }))} onContextMenu={handleContextMenu}>
      <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} {...position} style={{ width: 200, margin: 1 }} isNonModal>
        <TransactionMenu_1.TransactionMenu transaction={transaction} getTransaction={function (id) { return allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions.find(function (t) { return t.id === id; }); }} onDelete={function (ids) { return onBatchDelete === null || onBatchDelete === void 0 ? void 0 : onBatchDelete(ids); }} onDuplicate={function (ids) { return onBatchDuplicate === null || onBatchDuplicate === void 0 ? void 0 : onBatchDuplicate(ids); }} onLinkSchedule={function (ids) { return onBatchLinkSchedule === null || onBatchLinkSchedule === void 0 ? void 0 : onBatchLinkSchedule(ids); }} onUnlinkSchedule={function (ids) { return onBatchUnlinkSchedule === null || onBatchUnlinkSchedule === void 0 ? void 0 : onBatchUnlinkSchedule(ids); }} onCreateRule={function (ids) { return onCreateRule === null || onCreateRule === void 0 ? void 0 : onCreateRule(ids); }} onScheduleAction={function (name, ids) { return onScheduleAction === null || onScheduleAction === void 0 ? void 0 : onScheduleAction(name, ids); }} onMakeAsNonSplitTransactions={function (ids) {
            return onMakeAsNonSplitTransactions === null || onMakeAsNonSplitTransactions === void 0 ? void 0 : onMakeAsNonSplitTransactions(ids);
        }} closeMenu={function () { return setMenuOpen(false); }}/>
      </popover_1.Popover>

      {splitError && (listContainerRef === null || listContainerRef === void 0 ? void 0 : listContainerRef.current) && (<popover_1.Popover triggerRef={triggerRef} isOpen isNonModal style={{
                maxWidth: 500,
                minWidth: 375,
                padding: 5,
                maxHeight: '38px !important',
            }} shouldFlip={false} placement="bottom end" UNSTABLE_portalContainer={listContainerRef.current}>
          {splitError}
        </popover_1.Popover>)}

      {isChild && (<table_1.Field 
        /* Checkmark blank placeholder for Child transaction */
        width={110} style={{
                width: 110,
                backgroundColor: theme_1.theme.tableRowBackgroundHover,
                border: 0, // known z-order issue, bottom border for parent transaction hidden
            }}/>)}

      {isChild && showAccount && (<table_1.Field 
        /* Account blank placeholder for Child transaction */
        style={{
                flex: 1,
                backgroundColor: theme_1.theme.tableRowBackgroundHover,
                border: 0,
            }}/>)}

      {/* Checkmark - for Child transaction
        between normal Date and Payee or Account and Payee if needed */}
      {(0, transactions_1.isTemporaryId)(transaction.id) ? (isChild ? (<table_1.DeleteCell onDelete={function () { return onDelete && onDelete(transaction.id); }} exposed={editing} style={__assign(__assign({}, (isChild && { borderLeftWidth: 1 })), { lineHeight: 0 })}/>) : (<table_1.Cell width={20}/>)) : (isPreview && isChild) || !showSelection ? (<table_1.Cell width={20}/>) : (<table_1.SelectCell 
        /* Checkmark field for non-child transaction */
        exposed buttonProps={{
                className: selected || editing ? undefined : 'hover-visible',
            }} focused={focusedField === 'select'} onSelect={function (e) {
                dispatchSelected({
                    type: 'select',
                    id: transaction.id,
                    isRangeSelect: e.shiftKey,
                });
            }} onEdit={function () { return onEdit(id, 'select'); }} selected={selected} style={__assign({}, (isChild && { borderLeftWidth: 1 }))} value={matched
                ? // TODO: this will require changes in table.tsx
                    (<v2_1.SvgHyperlink2 style={{ width: 13, height: 13, color: 'inherit' }}/>)
                : undefined}/>)}
      {!isChild && (<table_1.CustomCell 
        /* Date field for non-child transaction */
        name="date" width={110} textAlign="flex" exposed={focusedField === 'date'} value={date} valueStyle={valueStyle} formatter={function (date) {
                return date ? (0, date_fns_1.format)((0, date_fns_1.parseISO)(date), dateFormat) : '';
            }} onExpose={function (name) { return !isPreview && onEdit(id, name); }} onUpdate={function (value) {
                onUpdate('date', value);
            }}>
          {function (_a) {
                var onBlur = _a.onBlur, onKeyDown = _a.onKeyDown, onUpdate = _a.onUpdate, onSave = _a.onSave, shouldSaveFromKey = _a.shouldSaveFromKey, inputStyle = _a.inputStyle;
                return (<DateSelect_1.DateSelect value={date || ''} dateFormat={dateFormat} inputProps={{ onBlur: onBlur, onKeyDown: onKeyDown, style: inputStyle }} shouldSaveFromKey={shouldSaveFromKey} clearOnBlur={true} onUpdate={onUpdate} onSelect={onSave}/>);
            }}
        </table_1.CustomCell>)}

      {!isChild && showAccount && (<table_1.CustomCell 
        /* Account field for non-child transaction */
        name="account" width="flex" textAlign="flex" value={accountId} formatter={function (acctId) {
                var acct = acctId && (0, accountsSlice_1.getAccountsById)(accounts)[acctId];
                if (acct) {
                    return acct.name;
                }
                return '';
            }} valueStyle={valueStyle} exposed={focusedField === 'account'} onExpose={function (name) { return !isPreview && onEdit(id, name); }} onUpdate={function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Only ever allow non-null values
                    if (value) {
                        onUpdate('account', value);
                    }
                    return [2 /*return*/];
                });
            }); }}>
          {function (_a) {
                var onBlur = _a.onBlur, onKeyDown = _a.onKeyDown, onUpdate = _a.onUpdate, onSave = _a.onSave, shouldSaveFromKey = _a.shouldSaveFromKey, inputStyle = _a.inputStyle;
                return (<AccountAutocomplete_1.AccountAutocomplete includeClosedAccounts={false} value={accountId} shouldSaveFromKey={shouldSaveFromKey} clearOnBlur={false} focused={true} inputProps={{ onBlur: onBlur, onKeyDown: onKeyDown, style: inputStyle }} onUpdate={onUpdate} onSelect={onSave}/>);
            }}
        </table_1.CustomCell>)}
      {(function () { return (<PayeeCell 
        /* Payee field for all transactions */
        id={id} payee={payee} focused={focusedField === 'payee'} 
        /* Filter out the account we're currently in as it is not a valid transfer */
        accounts={accounts.filter(function (account) { return account.id !== accountId; })} payees={payees.filter(function (payee) { return !payee.transfer_acct || payee.transfer_acct !== accountId; })} valueStyle={valueStyle} transaction={transaction} transferAccountsByTransaction={transferAccountsByTransaction} importedPayee={importedPayee} isPreview={isPreview} onEdit={onEdit} onUpdate={onUpdate} onCreatePayee={onCreatePayee} onManagePayees={onManagePayees} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule}/>); })()}

      <table_1.InputCell width="flex" name="notes" textAlign="flex" exposed={focusedField === 'notes'} focused={focusedField === 'notes'} value={(_b = notes !== null && notes !== void 0 ? notes : (isPreview ? schedule === null || schedule === void 0 ? void 0 : schedule.name : null)) !== null && _b !== void 0 ? _b : ''} valueStyle={valueStyle} formatter={function (value) {
            return (0, NotesTagFormatter_1.NotesTagFormatter)({ notes: value, onNotesTagClick: onNotesTagClick });
        }} onExpose={function (name) { return !isPreview && onEdit(id, name); }} inputProps={{
            value: notes || '',
            onUpdate: onUpdate.bind(null, 'notes'),
        }}/>

      {(isPreview && !isChild) || isParent ? (<table_1.Cell 
        /* Category field (Split button) for parent transactions */
        name="category" width="flex" focused={focusedField === 'category'} style={{
                padding: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100%',
            }} plain>
          {isPreview && (<view_1.View style={{
                    color: previewStatus === 'missed'
                        ? theme_1.theme.errorText
                        : previewStatus === 'due'
                            ? theme_1.theme.warningText
                            : selected
                                ? theme_1.theme.formLabelText
                                : theme_1.theme.upcomingText,
                    backgroundColor: previewStatus === 'missed'
                        ? theme_1.theme.errorBackground
                        : previewStatus === 'due'
                            ? theme_1.theme.warningBackground
                            : selected
                                ? theme_1.theme.formLabelBackground
                                : theme_1.theme.upcomingBackground,
                    margin: '0 5px',
                    padding: '3px 7px',
                    borderRadius: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                }}>
              {(0, util_1.titleFirst)((0, schedules_1.getStatusLabel)(previewStatus !== null && previewStatus !== void 0 ? previewStatus : ''))}
            </view_1.View>)}
          <table_1.CellButton bare style={{
                borderRadius: 4,
                border: '1px solid transparent', // so it doesn't shift on hover
                ':hover': {
                    border: '1px solid ' + theme_1.theme.buttonNormalBorder,
                },
            }} disabled={(0, transactions_1.isTemporaryId)(transaction.id)} onEdit={function () { return !isPreview && onEdit(id, 'category'); }} onSelect={function () { return onToggleSplit(id); }}>
            <view_1.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'stretch',
                borderRadius: 4,
                flex: 1,
                padding: 4,
                color: theme_1.theme.pageTextSubdued,
            }}>
              {isParent && (<v1_1.SvgCheveronDown style={{
                    color: 'inherit',
                    width: 14,
                    height: 14,
                    transition: 'transform .08s',
                    transform: expanded ? 'rotateZ(0)' : 'rotateZ(-90deg)',
                }}/>)}
              {!isPreview && (<text_1.Text style={{
                    fontStyle: 'italic',
                    fontWeight: 300,
                    userSelect: 'none',
                }}>
                  <react_i18next_1.Trans>Split</react_i18next_1.Trans>
                </text_1.Text>)}
            </view_1.View>
          </table_1.CellButton>
        </table_1.Cell>) : isBudgetTransfer || isOffBudget ? (<table_1.InputCell 
        /* Category field for transfer and off budget transactions
   (NOT preview, it is covered first) */
        name="category" width="flex" exposed={focusedField === 'category'} focused={focusedField === 'category'} onExpose={function (name) { return onEdit(id, name); }} value={isParent
                ? t('Split')
                : isOffBudget
                    ? t('Off budget')
                    : isBudgetTransfer
                        ? categoryId != null
                            ? t('Needs Repair')
                            : t('Transfer')
                        : ''} valueStyle={valueStyle} style={{
                fontStyle: 'italic',
                color: theme_1.theme.pageTextSubdued,
                fontWeight: 300,
            }} inputProps={{
                readOnly: true,
                style: { fontStyle: 'italic' },
            }}/>) : (<table_1.CustomCell 
        /* Category field for normal and child transactions */
        name="category" width="flex" textAlign="flex" value={categoryId} formatter={function (value) {
                var _a, _b;
                return value
                    ? ((_b = (_a = (0, budgetSlice_1.getCategoriesById)(categoryGroups)[value]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '')
                    : transaction.id
                        ? t('Categorize')
                        : '';
            }} exposed={focusedField === 'category'} onExpose={function (name) { return !isPreview && onEdit(id, name); }} valueStyle={!categoryId
                ? {
                    // uncategorized transaction
                    fontStyle: 'italic',
                    fontWeight: 300,
                    color: theme_1.theme.formInputTextHighlight,
                }
                : valueStyle} onUpdate={function (value) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (value === 'split') {
                        onSplit(transaction.id);
                    }
                    else {
                        onUpdate('category', value);
                    }
                    return [2 /*return*/];
                });
            }); }}>
          {function (_a) {
                var onBlur = _a.onBlur, onKeyDown = _a.onKeyDown, onUpdate = _a.onUpdate, onSave = _a.onSave, shouldSaveFromKey = _a.shouldSaveFromKey, inputStyle = _a.inputStyle;
                return (<useSheetName_1.SheetNameProvider name={monthUtils.sheetForMonth(monthUtils.monthFromDate(transaction.date))}>
              <CategoryAutocomplete_1.CategoryAutocomplete categoryGroups={categoryGroups} value={categoryId !== null && categoryId !== void 0 ? categoryId : null} focused={true} clearOnBlur={false} showSplitOption={!isChild && !isParent && allowSplitTransaction} shouldSaveFromKey={shouldSaveFromKey} inputProps={{ onBlur: onBlur, onKeyDown: onKeyDown, style: inputStyle }} onUpdate={onUpdate} onSelect={onSave} showHiddenCategories={showHiddenCategories}/>
            </useSheetName_1.SheetNameProvider>);
            }}
        </table_1.CustomCell>)}

      <table_1.InputCell 
    /* Debit field for all transactions */
    type="input" width={100} name="debit" exposed={focusedField === 'debit'} focused={focusedField === 'debit'} value={debit === '' && credit === '' ? (0, util_1.amountToCurrency)(0) : debit} formatter={function (value) {
            // reformat value so since we might have kept decimals
            return value ? (0, util_1.amountToCurrency)((0, util_1.currencyToAmount)(value) || 0) : '';
        }} valueStyle={valueStyle} textAlign="right" title={debit} onExpose={function (name) { return !isPreview && onEdit(id, name); }} style={__assign(__assign(__assign({}, (isParent && { fontStyle: 'italic' })), styles_1.styles.tnum), amountStyle)} inputProps={{
            value: debit === '' && credit === '' ? (0, util_1.amountToCurrency)(0) : debit,
            onUpdate: onUpdate.bind(null, 'debit'),
            'data-1p-ignore': true,
        }} privacyFilter={{
            activationFilters: [!(0, transactions_1.isTemporaryId)(transaction.id)],
        }}/>

      <table_1.InputCell 
    /* Credit field for all transactions */
    type="input" width={100} name="credit" exposed={focusedField === 'credit'} focused={focusedField === 'credit'} value={credit} formatter={function (value) {
            // reformat value so since we might have kept decimals
            return value ? (0, util_1.amountToCurrency)((0, util_1.currencyToAmount)(value) || 0) : '';
        }} valueStyle={valueStyle} textAlign="right" title={credit} onExpose={function (name) { return !isPreview && onEdit(id, name); }} style={__assign(__assign(__assign({}, (isParent && { fontStyle: 'italic' })), styles_1.styles.tnum), amountStyle)} inputProps={{
            value: credit,
            onUpdate: onUpdate.bind(null, 'credit'),
            'data-1p-ignore': true,
        }} privacyFilter={{
            activationFilters: [!(0, transactions_1.isTemporaryId)(transaction.id)],
        }}/>

      {showBalance && (<table_1.Cell 
        /* Balance field for all transactions */
        name="balance" value={runningBalance == null || isChild || (0, transactions_1.isTemporaryId)(id)
                ? ''
                : (0, util_1.integerToCurrency)(runningBalance)} valueStyle={{
                color: runningBalance < 0 ? theme_1.theme.errorText : theme_1.theme.noticeTextLight,
            }} style={__assign(__assign({}, styles_1.styles.tnum), amountStyle)} width={103} textAlign="right" privacyFilter/>)}

      {showCleared && (<StatusCell 
        /* Icon field for all transactions */
        id={id} focused={focusedField === 'cleared'} selected={selected} isPreview={isPreview} status={isPreview
                ? previewStatus
                : reconciled
                    ? 'reconciled'
                    : cleared
                        ? 'cleared'
                        : null} isChild={isChild} onEdit={onEdit} onUpdate={onUpdate}/>)}

      <table_1.Cell width={5}/>
    </table_1.Row>);
});
function TransactionError(_a) {
    var error = _a.error, isDeposit = _a.isDeposit, onAddSplit = _a.onAddSplit, onDistributeRemainder = _a.onDistributeRemainder, style = _a.style, canDistributeRemainder = _a.canDistributeRemainder;
    switch (error.type) {
        case 'SplitTransactionError':
            if (error.version === 1) {
                return (<view_1.View style={__assign({ flexDirection: 'row', alignItems: 'center', padding: '0 5px' }, style)} data-testid="transaction-error">
            <text_1.Text style={{ whiteSpace: 'nowrap' }}>
              <react_i18next_1.Trans>Amount left:</react_i18next_1.Trans>{' '}
              <text_1.Text style={{ fontWeight: 500 }}>
                {(0, util_1.integerToCurrency)(isDeposit ? error.difference : -error.difference)}
              </text_1.Text>
            </text_1.Text>
            <view_1.View style={{ flex: 1 }}/>
            <button_1.Button variant="normal" style={{ marginLeft: 15 }} onPress={onDistributeRemainder} data-testid="distribute-split-button" isDisabled={!canDistributeRemainder}>
              <react_i18next_1.Trans>Distribute</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="primary" style={{ marginLeft: 10, padding: '4px 10px' }} onPress={onAddSplit} data-testid="add-split-button">
              <react_i18next_1.Trans>Add Split</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>);
            }
            break;
        default:
            return null;
    }
}
function NewTransaction(_a) {
    var transactions = _a.transactions, accounts = _a.accounts, categoryGroups = _a.categoryGroups, payees = _a.payees, transferAccountsByTransaction = _a.transferAccountsByTransaction, editingTransaction = _a.editingTransaction, focusedField = _a.focusedField, showAccount = _a.showAccount, showBalance = _a.showBalance, showCleared = _a.showCleared, dateFormat = _a.dateFormat, hideFraction = _a.hideFraction, onClose = _a.onClose, onSplit = _a.onSplit, onToggleSplit = _a.onToggleSplit, onEdit = _a.onEdit, onDelete = _a.onDelete, onSave = _a.onSave, onAdd = _a.onAdd, onAddSplit = _a.onAddSplit, onDistributeRemainder = _a.onDistributeRemainder, onManagePayees = _a.onManagePayees, onCreatePayee = _a.onCreatePayee, onNavigateToTransferAccount = _a.onNavigateToTransferAccount, onNavigateToSchedule = _a.onNavigateToSchedule, onNotesTagClick = _a.onNotesTagClick, balance = _a.balance, showHiddenCategories = _a.showHiddenCategories;
    var error = transactions[0].error;
    var isDeposit = transactions[0].amount > 0;
    var childTransactions = transactions.filter(function (t) { return t.parent_id === transactions[0].id; });
    var emptyChildTransactions = childTransactions.filter(function (t) { return t.amount === 0; });
    var addButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(addButtonRef, focusedField === 'add');
    var cancelButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(cancelButtonRef, focusedField === 'cancel');
    return (<view_1.View style={{
            borderBottom: '1px solid ' + theme_1.theme.tableBorderHover,
            paddingBottom: 6,
            backgroundColor: theme_1.theme.tableBackground,
        }} data-testid="new-transaction" onKeyDown={function (e) {
            if (e.key === 'Escape') {
                onClose();
            }
        }}>
      {transactions.map(function (transaction) { return (<Transaction key={transaction.id} editing={editingTransaction === transaction.id} transaction={transaction} subtransactions={transaction.is_parent ? childTransactions : null} transferAccountsByTransaction={transferAccountsByTransaction} showAccount={showAccount} showBalance={showBalance} showCleared={showCleared} focusedField={editingTransaction === transaction.id ? focusedField : undefined} showZeroInDeposit={isDeposit} accounts={accounts} categoryGroups={categoryGroups} payees={payees} dateFormat={dateFormat} hideFraction={!!hideFraction} expanded={true} onEdit={onEdit} onSave={onSave} onSplit={onSplit} onToggleSplit={onToggleSplit} onDelete={onDelete} onManagePayees={onManagePayees} onCreatePayee={onCreatePayee} style={{ marginTop: -1 }} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule} onNotesTagClick={onNotesTagClick} balance={balance !== null && balance !== void 0 ? balance : 0} showSelection={true} allowSplitTransaction={true} showHiddenCategories={showHiddenCategories}/>); })}
      <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 6,
            marginRight: 20,
        }}>
        <button_1.Button style={{ marginRight: 10, padding: '4px 10px' }} onPress={function () { return onClose(); }} data-testid="cancel-button" ref={cancelButtonRef}>
          <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
        </button_1.Button>
        {error ? (<TransactionError error={error} isDeposit={isDeposit} onAddSplit={function () { return onAddSplit(transactions[0].id); }} onDistributeRemainder={function () {
                return onDistributeRemainder(transactions[0].id);
            }} canDistributeRemainder={emptyChildTransactions.length > 0}/>) : (<button_1.Button variant="primary" style={{ padding: '4px 10px' }} onPress={onAdd} data-testid="add-button" ref={addButtonRef}>
            <react_i18next_1.Trans>Add</react_i18next_1.Trans>
          </button_1.Button>)}
      </view_1.View>
    </view_1.View>);
}
function TransactionTableInner(_a) {
    var tableNavigator = _a.tableNavigator, tableRef = _a.tableRef, listContainerRef = _a.listContainerRef, _b = _a.dateFormat, dateFormat = _b === void 0 ? 'MM/dd/yyyy' : _b, newNavigator = _a.newNavigator, renderEmpty = _a.renderEmpty, showHiddenCategories = _a.showHiddenCategories, props = __rest(_a, ["tableNavigator", "tableRef", "listContainerRef", "dateFormat", "newNavigator", "renderEmpty", "showHiddenCategories"]);
    var containerRef = (0, react_1.createRef)();
    var isAddingPrev = (0, usePrevious_1.usePrevious)(props.isAdding);
    var _c = (0, react_1.useState)(0), scrollWidth = _c[0], setScrollWidth = _c[1];
    function saveScrollWidth(parent, child) {
        var width = parent > 0 && child > 0 && parent - child;
        setScrollWidth(!width ? 0 : width);
    }
    var onCloseAddTransactionProp = props.onCloseAddTransaction, onNavigateToTransferAccountProp = props.onNavigateToTransferAccount, onNavigateToScheduleProp = props.onNavigateToSchedule, onNotesTagClickProp = props.onNotesTagClick;
    var onNavigateToTransferAccount = (0, react_1.useCallback)(function (accountId) {
        onCloseAddTransactionProp();
        onNavigateToTransferAccountProp(accountId);
    }, [onCloseAddTransactionProp, onNavigateToTransferAccountProp]);
    var onNavigateToSchedule = (0, react_1.useCallback)(function (scheduleId) {
        onCloseAddTransactionProp();
        onNavigateToScheduleProp(scheduleId);
    }, [onCloseAddTransactionProp, onNavigateToScheduleProp]);
    var onNotesTagClick = (0, react_1.useCallback)(function (noteTag) {
        onCloseAddTransactionProp();
        onNotesTagClickProp(noteTag);
    }, [onCloseAddTransactionProp, onNotesTagClickProp]);
    (0, react_1.useEffect)(function () {
        if (!isAddingPrev && props.isAdding) {
            newNavigator.onEdit('temp', 'date');
        }
    }, [isAddingPrev, props.isAdding, newNavigator]);
    // Don't render reconciled transactions if we're hiding them.
    var transactionsToRender = (0, react_1.useMemo)(function () {
        return props.showReconciled
            ? props.transactions
            : props.transactions.filter(function (t) { return !t.reconciled; });
    }, [props.transactions, props.showReconciled]);
    var renderRow = function (_a) {
        var _b, _c;
        var item = _a.item, index = _a.index, editing = _a.editing;
        var transactions = props.transactions, selectedItems = props.selectedItems, accounts = props.accounts, categoryGroups = props.categoryGroups, payees = props.payees, showCleared = props.showCleared, showAccount = props.showAccount, showBalances = props.showBalances, balances = props.balances, hideFraction = props.hideFraction, isNew = props.isNew, isMatched = props.isMatched, isExpanded = props.isExpanded, showSelection = props.showSelection, allowSplitTransaction = props.allowSplitTransaction;
        var trans = item;
        var selected = selectedItems.has(trans.id);
        var parent = trans.parent_id && props.transactionMap.get(trans.parent_id);
        var isChildDeposit = parent ? parent.amount > 0 : undefined;
        var expanded = isExpanded && isExpanded((parent || trans).id);
        // For backwards compatibility, read the error of the transaction
        // since in previous versions we stored it there. In the future we
        // can simplify this to just the parent
        var error = expanded
            ? (parent && parent.error) || trans.error
            : trans.error;
        var hasSplitError = (trans.is_parent || trans.is_child) &&
            (!expanded || (0, utils_1.isLastChild)(transactions, index)) &&
            error &&
            error.type === 'SplitTransactionError';
        var childTransactions = trans.is_parent
            ? props.transactionsByParent[trans.id]
            : null;
        var emptyChildTransactions = (_b = props.transactionsByParent[(trans.is_parent ? trans.id : trans.parent_id) || '']) === null || _b === void 0 ? void 0 : _b.filter(function (t) { return t.amount === 0; });
        return (<Transaction allTransactions={props.transactions} editing={editing} transaction={trans} transferAccountsByTransaction={props.transferAccountsByTransaction} subtransactions={childTransactions} showAccount={showAccount} showBalance={showBalances} showCleared={showCleared} selected={selected} highlighted={false} added={isNew === null || isNew === void 0 ? void 0 : isNew(trans.id)} expanded={isExpanded === null || isExpanded === void 0 ? void 0 : isExpanded(trans.id)} matched={isMatched === null || isMatched === void 0 ? void 0 : isMatched(trans.id)} showZeroInDeposit={isChildDeposit} balance={(_c = balances === null || balances === void 0 ? void 0 : balances[trans.id]) !== null && _c !== void 0 ? _c : 0} focusedField={editing ? tableNavigator.focusedField : undefined} accounts={accounts} categoryGroups={categoryGroups} payees={payees} dateFormat={dateFormat} hideFraction={hideFraction} onEdit={tableNavigator.onEdit} onSave={props.onSave} onDelete={props.onDelete} onBatchDelete={props.onBatchDelete} onBatchDuplicate={props.onBatchDuplicate} onBatchLinkSchedule={props.onBatchLinkSchedule} onBatchUnlinkSchedule={props.onBatchUnlinkSchedule} onCreateRule={props.onCreateRule} onScheduleAction={props.onScheduleAction} onMakeAsNonSplitTransactions={props.onMakeAsNonSplitTransactions} onSplit={props.onSplit} onManagePayees={props.onManagePayees} onCreatePayee={props.onCreatePayee} onToggleSplit={props.onToggleSplit} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule} onNotesTagClick={onNotesTagClick} splitError={hasSplitError && (<TransactionError error={error} isDeposit={!!isChildDeposit} onAddSplit={function () { return props.onAddSplit(trans.id); }} onDistributeRemainder={function () {
                    return props.onDistributeRemainder(trans.id);
                }} canDistributeRemainder={emptyChildTransactions.length > 0}/>)} listContainerRef={listContainerRef} showSelection={showSelection} allowSplitTransaction={allowSplitTransaction} showHiddenCategories={showHiddenCategories}/>);
    };
    return (<view_1.View innerRef={containerRef} style={__assign({ flex: 1, cursor: 'default' }, props.style)}>
      <view_1.View>
        <TransactionHeader hasSelected={props.selectedItems.size > 0} showAccount={props.showAccount} showCategory={props.showCategory} showBalance={props.showBalances} showCleared={props.showCleared} scrollWidth={scrollWidth} onSort={props.onSort} ascDesc={props.ascDesc} field={props.sortField} showSelection={props.showSelection}/>

        {props.isAdding && (<view_1.View {...newNavigator.getNavigatorProps({
            onKeyDown: function (e) { return props.onCheckNewEnter(e); },
        })}>
            <NewTransaction transactions={props.newTransactions} transferAccountsByTransaction={props.transferAccountsByTransaction} editingTransaction={newNavigator.editingId} focusedField={newNavigator.focusedField} accounts={props.accounts} categoryGroups={props.categoryGroups} payees={props.payees || []} showAccount={props.showAccount} showBalance={props.showBalances} showCleared={props.showCleared} dateFormat={dateFormat} hideFraction={props.hideFraction} onClose={props.onCloseAddTransaction} onAdd={props.onAddTemporary} onAddSplit={props.onAddSplit} onToggleSplit={props.onToggleSplit} onSplit={props.onSplit} onEdit={newNavigator.onEdit} onSave={props.onSave} onDelete={props.onDelete} onManagePayees={props.onManagePayees} onCreatePayee={props.onCreatePayee} onNavigateToTransferAccount={onNavigateToTransferAccount} onNavigateToSchedule={onNavigateToSchedule} onNotesTagClick={onNotesTagClick} onDistributeRemainder={props.onDistributeRemainder} showHiddenCategories={showHiddenCategories}/>
          </view_1.View>)}
      </view_1.View>
      {/*// * On Windows, makes the scrollbar always appear
           //   the full height of the container ??? */}

      <view_1.View style={{ flex: 1, overflow: 'hidden' }} data-testid="transaction-table">
        <table_1.Table navigator={tableNavigator} ref={tableRef} listContainerRef={listContainerRef} items={transactionsToRender} renderItem={renderRow} renderEmpty={renderEmpty} loadMore={props.loadMoreTransactions} isSelected={function (id) { return props.selectedItems.has(id); }} onKeyDown={function (e) { return props.onCheckEnter(e); }} saveScrollWidth={saveScrollWidth}/>

        {props.isAdding && (<div key="shadow" style={{
                position: 'absolute',
                top: -20,
                left: 0,
                right: 0,
                height: 20,
                backgroundColor: theme_1.theme.errorText,
                boxShadow: '0 0 6px rgba(0, 0, 0, .20)',
            }}/>)}
      </view_1.View>
    </view_1.View>);
}
exports.TransactionTable = (0, react_1.forwardRef)(function (props, ref) {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var showHiddenCategories = (0, useLocalPref_1.useLocalPref)('budget.showHiddenCategories')[0];
    var _a = (0, react_1.useState)(null), newTransactions = _a[0], setNewTransactions = _a[1];
    var _b = (0, react_1.useState)(false), prevIsAdding = _b[0], setPrevIsAdding = _b[1];
    var splitsExpanded = (0, useSplitsExpanded_1.useSplitsExpanded)();
    var splitsExpandedDispatch = splitsExpanded.dispatch;
    var prevSplitsExpanded = (0, react_1.useRef)(null);
    var tableRef = (0, react_1.useRef)(null);
    var listContainerRef = (0, react_1.useRef)(null);
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(tableRef, ref);
    var transactionsWithExpandedSplits = (0, react_1.useMemo)(function () {
        var _a, _b;
        var result;
        if (splitsExpanded.state.transitionId != null) {
            var index_1 = props.transactions.findIndex(function (t) { return t.id === splitsExpanded.state.transitionId; });
            result = props.transactions.filter(function (t, idx) {
                if (t.parent_id) {
                    if (idx >= index_1) {
                        return splitsExpanded.isExpanded(t.parent_id);
                    }
                    else if (prevSplitsExpanded.current) {
                        return prevSplitsExpanded.current.isExpanded(t.parent_id);
                    }
                }
                return true;
            });
        }
        else {
            if (prevSplitsExpanded.current &&
                prevSplitsExpanded.current.state.transitionId != null) {
                (_a = tableRef.current) === null || _a === void 0 ? void 0 : _a.anchor();
                (_b = tableRef.current) === null || _b === void 0 ? void 0 : _b.setRowAnimation(false);
            }
            prevSplitsExpanded.current = splitsExpanded;
            result = props.transactions.filter(function (t) {
                if (t.parent_id) {
                    return splitsExpanded.isExpanded(t.parent_id);
                }
                return true;
            });
        }
        prevSplitsExpanded.current = splitsExpanded;
        return result;
    }, [props.transactions, splitsExpanded]);
    var transactionMap = (0, react_1.useMemo)(function () {
        return new Map(transactionsWithExpandedSplits.map(function (trans) { return [trans.id, trans]; }));
    }, [transactionsWithExpandedSplits]);
    var transactionsByParent = (0, react_1.useMemo)(function () {
        return props.transactions.reduce(function (acc, trans) {
            var _a;
            if (trans.is_child && trans.parent_id) {
                acc[trans.parent_id] = __spreadArray(__spreadArray([], ((_a = acc[trans.parent_id]) !== null && _a !== void 0 ? _a : []), true), [trans], false);
            }
            return acc;
        }, {});
    }, [props.transactions]);
    var transferAccountsByTransaction = (0, react_1.useMemo)(function () {
        if (!props.accounts) {
            return {};
        }
        var accounts = (0, accountsSlice_1.getAccountsById)(props.accounts);
        var payees = (0, payeesSlice_1.getPayeesById)(props.payees);
        return Object.fromEntries(props.transactions.map(function (t) {
            if (!props.accounts) {
                return [t.id, null];
            }
            var payee = (t.payee && payees[t.payee]) || undefined;
            var transferAccount = (payee === null || payee === void 0 ? void 0 : payee.transfer_acct) && accounts[payee.transfer_acct];
            return [t.id, transferAccount || null];
        }));
    }, [props.transactions, props.payees, props.accounts]);
    var hasPrevSplitsExpanded = prevSplitsExpanded.current;
    (0, react_1.useEffect)(function () {
        var _a;
        // If it's anchored that means we've also disabled animations. To
        // reduce the chance for side effect collision, only do this if
        // we've actually anchored it
        if ((_a = tableRef.current) === null || _a === void 0 ? void 0 : _a.isAnchored()) {
            tableRef.current.unanchor();
            tableRef.current.setRowAnimation(true);
        }
    }, [hasPrevSplitsExpanded]);
    var newNavigator = (0, table_1.useTableNavigator)(newTransactions !== null && newTransactions !== void 0 ? newTransactions : [], getFieldsNewTransaction);
    var tableNavigator = (0, table_1.useTableNavigator)(transactionsWithExpandedSplits, getFieldsTableTransaction);
    var shouldAdd = (0, react_1.useRef)(false);
    var latestState = (0, react_1.useRef)({
        newTransactions: newTransactions !== null && newTransactions !== void 0 ? newTransactions : [],
        newNavigator: newNavigator,
        tableNavigator: tableNavigator,
        transactions: [],
    });
    var savePending = (0, react_1.useRef)(false);
    var afterSaveFunc = (0, react_1.useRef)(null);
    var _c = (0, react_1.useState)({}), _ = _c[0], forceRerender = _c[1];
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    latestState.current = {
        newTransactions: newTransactions !== null && newTransactions !== void 0 ? newTransactions : [],
        newNavigator: newNavigator,
        tableNavigator: tableNavigator,
        transactions: props.transactions,
    };
    // Derive new transactions from the `isAdding` prop
    if (prevIsAdding !== props.isAdding) {
        if (!prevIsAdding && props.isAdding) {
            setNewTransactions((0, utils_1.makeTemporaryTransactions)(props.currentAccountId, props.currentCategoryId));
        }
        setPrevIsAdding(props.isAdding);
    }
    if (shouldAdd.current) {
        if ((newTransactions === null || newTransactions === void 0 ? void 0 : newTransactions[0]) && newTransactions[0].account == null) {
            dispatch((0, notificationsSlice_1.addNotification)({
                notification: {
                    type: 'error',
                    message: t('Account is a required field'),
                },
            }));
            newNavigator.onEdit('temp', 'account');
        }
        else {
            var transactions = latestState.current.newTransactions;
            var lastDate = transactions.length > 0 ? transactions[0].date : null;
            setNewTransactions((0, utils_1.makeTemporaryTransactions)(props.currentAccountId, props.currentCategoryId, lastDate));
            newNavigator.onEdit('temp', 'date');
            props.onAdd(transactions);
        }
        shouldAdd.current = false;
    }
    (0, react_1.useEffect)(function () {
        if (savePending.current && afterSaveFunc.current) {
            afterSaveFunc.current();
            afterSaveFunc.current = null;
        }
        savePending.current = false;
    }, [newTransactions, props, props.transactions]);
    function getFieldsNewTransaction(item) {
        var fields = [
            'select',
            'date',
            'account',
            'payee',
            'notes',
            'category',
            'debit',
            'credit',
            'cleared',
            'cancel',
            'add',
        ];
        return getFields(item, fields);
    }
    function getFieldsTableTransaction(item) {
        var fields = [
            'select',
            'date',
            'account',
            'payee',
            'notes',
            'category',
            'debit',
            'credit',
            'cleared',
        ];
        return getFields(item, fields);
    }
    function getFields(item, fields) {
        fields = (item === null || item === void 0 ? void 0 : item.is_child)
            ? ['select', 'payee', 'notes', 'category', 'debit', 'credit']
            : fields.filter(function (f) {
                return (props.showAccount || f !== 'account') &&
                    (props.showCategory || f !== 'category');
            });
        if ((item === null || item === void 0 ? void 0 : item.id) && (0, transactions_1.isPreviewId)(item.id)) {
            fields = ['select'];
        }
        if ((item === null || item === void 0 ? void 0 : item.id) && (0, transactions_1.isTemporaryId)(item.id)) {
            // You can't focus the select/delete button of temporary
            // transactions
            fields = fields.slice(1);
        }
        return fields;
    }
    function afterSave(func) {
        if (savePending.current) {
            afterSaveFunc.current = func;
        }
        else {
            func();
        }
    }
    function onCheckNewEnter(e) {
        if (e.key === 'Enter') {
            if (e.metaKey) {
                e.stopPropagation();
                onAddTemporary();
            }
            else if (!e.shiftKey) {
                function getLastTransaction(state) {
                    var newTransactions = state.current.newTransactions;
                    return newTransactions[newTransactions.length - 1];
                }
                // Right now, the table navigator does some funky stuff with
                // focus, so we want to stop it from handling this event. We
                // still want enter to move up/down normally, so we only stop
                // it if we are on the last transaction (where we are about to
                // do some logic). I don't like this.
                if (newNavigator.editingId === getLastTransaction(latestState).id) {
                    e.stopPropagation();
                }
                afterSave(function () {
                    var lastTransaction = getLastTransaction(latestState);
                    var isSplit = lastTransaction.parent_id || lastTransaction.is_parent;
                    if (latestState.current.newTransactions[0].error &&
                        newNavigator.editingId === lastTransaction.id) {
                        // add split
                        onAddSplit(lastTransaction.id);
                    }
                    else if (newNavigator.editingId === lastTransaction.id &&
                        (!isSplit || !lastTransaction.error)) {
                        onAddTemporary();
                    }
                });
            }
        }
    }
    function onCheckEnter(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            var id_2 = tableNavigator.editingId, focusedField_1 = tableNavigator.focusedField;
            afterSave(function () {
                var transactions = latestState.current.transactions;
                var idx = transactions.findIndex(function (t) { return t.id === id_2; });
                var parent = transactions.find(function (t) { var _a; return t.id === ((_a = transactions[idx]) === null || _a === void 0 ? void 0 : _a.parent_id); });
                if ((0, utils_1.isLastChild)(transactions, idx) &&
                    parent &&
                    parent.error &&
                    focusedField_1 !== 'select') {
                    e.stopPropagation();
                    onAddSplit(id_2);
                }
            });
        }
    }
    var onAddTemporary = (0, react_1.useCallback)(function () {
        shouldAdd.current = true;
        // A little hacky - this forces a rerender which will cause the
        // effect we want to run. We have to wait for all updates to be
        // committed (the input could still be saving a value).
        forceRerender({});
    }, []);
    var onSaveProp = props.onSave, onApplyRulesProp = props.onApplyRules, onBatchDeleteProp = props.onBatchDelete, onBatchDuplicateProp = props.onBatchDuplicate, onBatchLinkScheduleProp = props.onBatchLinkSchedule, onBatchUnlinkScheduleProp = props.onBatchUnlinkSchedule, onCreateRuleProp = props.onCreateRule, onScheduleActionProp = props.onScheduleAction, onMakeAsNonSplitTransactionsProp = props.onMakeAsNonSplitTransactions, onSplitProp = props.onSplit;
    var onSave = (0, react_1.useCallback)(function (transaction_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([transaction_1], args_1, true), void 0, function (transaction, subtransactions, updatedFieldName) {
            var groupedTransaction, newTrans;
            if (subtransactions === void 0) { subtransactions = null; }
            if (updatedFieldName === void 0) { updatedFieldName = null; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        savePending.current = true;
                        groupedTransaction = subtransactions
                            ? (0, transactions_1.groupTransaction)(__spreadArray([transaction], subtransactions, true))
                            : transaction;
                        if (!(0, transactions_1.isTemporaryId)(transaction.id)) return [3 /*break*/, 3];
                        if (!onApplyRulesProp) return [3 /*break*/, 2];
                        return [4 /*yield*/, onApplyRulesProp(groupedTransaction, updatedFieldName)];
                    case 1:
                        groupedTransaction = _a.sent();
                        _a.label = 2;
                    case 2:
                        newTrans = latestState.current.newTransactions;
                        // Future refactor: we shouldn't need to iterate through the entire
                        // transaction list to ungroup, just the new transactions.
                        setNewTransactions((0, transactions_1.ungroupTransactions)((0, transactions_1.updateTransaction)(newTrans, groupedTransaction).data));
                        return [3 /*break*/, 4];
                    case 3:
                        onSaveProp(groupedTransaction);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [onSaveProp, onApplyRulesProp]);
    var onDelete = (0, react_1.useCallback)(function (id) {
        var temporary = (0, transactions_1.isTemporaryId)(id);
        if (temporary) {
            var newTrans = latestState.current.newTransactions;
            if (id === newTrans[0].id) {
                // You can never delete the parent new transaction
                return;
            }
            setNewTransactions((0, transactions_1.deleteTransaction)(newTrans, id).data);
        }
    }, []);
    var onBatchDelete = (0, react_1.useCallback)(function (ids) {
        onBatchDeleteProp(ids);
    }, [onBatchDeleteProp]);
    var onBatchDuplicate = (0, react_1.useCallback)(function (ids) {
        onBatchDuplicateProp(ids);
    }, [onBatchDuplicateProp]);
    var onBatchLinkSchedule = (0, react_1.useCallback)(function (ids) {
        onBatchLinkScheduleProp(ids);
    }, [onBatchLinkScheduleProp]);
    var onBatchUnlinkSchedule = (0, react_1.useCallback)(function (ids) {
        onBatchUnlinkScheduleProp(ids);
    }, [onBatchUnlinkScheduleProp]);
    var onCreateRule = (0, react_1.useCallback)(function (ids) {
        onCreateRuleProp(ids);
    }, [onCreateRuleProp]);
    var onScheduleAction = (0, react_1.useCallback)(function (action, ids) {
        onScheduleActionProp(action, ids);
    }, [onScheduleActionProp]);
    var onMakeAsNonSplitTransactions = (0, react_1.useCallback)(function (ids) {
        onMakeAsNonSplitTransactionsProp(ids);
    }, [onMakeAsNonSplitTransactionsProp]);
    var onSplit = (0, react_1.useMemo)(function () {
        return function (id) {
            if ((0, transactions_1.isTemporaryId)(id)) {
                var newNavigator_1 = latestState.current.newNavigator;
                var newTrans = latestState.current.newTransactions;
                var _a = (0, transactions_1.splitTransaction)(newTrans, id), data = _a.data, diff = _a.diff;
                setNewTransactions(data);
                // Jump next to "debit" field if it is empty
                // Otherwise jump to the same field as before, but downwards
                // to the added split transaction
                if (newTrans[0].amount === null) {
                    newNavigator_1.onEdit(newTrans[0].id, 'debit');
                }
                else {
                    newNavigator_1.onEdit(diff.added[0].id, latestState.current.newNavigator.focusedField);
                }
            }
            else {
                var trans = latestState.current.transactions.find(function (t) { return t.id === id; });
                var newId = onSplitProp(id);
                if (!trans) {
                    return;
                }
                splitsExpandedDispatch({ type: 'open-split', id: trans.id });
                var tableNavigator_1 = latestState.current.tableNavigator;
                if (trans.amount === null) {
                    tableNavigator_1.onEdit(trans.id, 'debit');
                }
                else {
                    tableNavigator_1.onEdit(newId, tableNavigator_1.focusedField);
                }
            }
        };
    }, [onSplitProp, splitsExpandedDispatch]);
    var onAddSplitProp = props.onAddSplit;
    var onAddSplit = (0, react_1.useCallback)(function (id) {
        var _a = latestState.current, tableNavigator = _a.tableNavigator, newNavigator = _a.newNavigator, newTrans = _a.newTransactions;
        if ((0, transactions_1.isTemporaryId)(id)) {
            var _b = (0, transactions_1.addSplitTransaction)(newTrans, id), data = _b.data, diff = _b.diff;
            setNewTransactions(data);
            newNavigator.onEdit(diff.added[0].id, latestState.current.newNavigator.focusedField);
        }
        else {
            var newId = onAddSplitProp(id);
            tableNavigator.onEdit(newId, latestState.current.tableNavigator.focusedField);
        }
    }, [onAddSplitProp]);
    var onDistributeRemainder = (0, react_1.useCallback)(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, transactions, newNavigator, tableNavigator, newTransactions, targetTransactions, transaction, parentTransaction, siblingTransactions, emptyTransactions, remainingAmount, amountPerTransaction, remainingCents, amounts, amountIndex, _b, _c, _d, _i, transactionIndex;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = latestState.current, transactions = _a.transactions, newNavigator = _a.newNavigator, tableNavigator = _a.tableNavigator, newTransactions = _a.newTransactions;
                    targetTransactions = (0, transactions_1.isTemporaryId)(id)
                        ? newTransactions
                        : transactions;
                    transaction = targetTransactions.find(function (t) { return t.id === id; });
                    parentTransaction = (transaction === null || transaction === void 0 ? void 0 : transaction.is_parent)
                        ? transaction
                        : targetTransactions.find(function (t) { return t.id === (transaction === null || transaction === void 0 ? void 0 : transaction.parent_id); });
                    siblingTransactions = targetTransactions.filter(function (t) {
                        return t.parent_id &&
                            t.parent_id ===
                                ((transaction === null || transaction === void 0 ? void 0 : transaction.is_parent)
                                    ? transaction === null || transaction === void 0 ? void 0 : transaction.id
                                    : transaction === null || transaction === void 0 ? void 0 : transaction.parent_id);
                    });
                    emptyTransactions = siblingTransactions.filter(function (t) { return t.amount === 0; });
                    if (!parentTransaction) {
                        console.error('Parent transaction not found for transaction', transaction);
                        return [2 /*return*/];
                    }
                    remainingAmount = parentTransaction.amount -
                        siblingTransactions.reduce(function (acc, t) { return acc + t.amount; }, 0);
                    amountPerTransaction = Math.floor(remainingAmount / emptyTransactions.length);
                    remainingCents = remainingAmount - amountPerTransaction * emptyTransactions.length;
                    amounts = new Array(emptyTransactions.length).fill(amountPerTransaction);
                    for (amountIndex in amounts) {
                        if (remainingCents === 0)
                            break;
                        amounts[amountIndex] += 1;
                        remainingCents--;
                    }
                    if ((0, transactions_1.isTemporaryId)(id)) {
                        newNavigator.onEdit(null);
                    }
                    else {
                        tableNavigator.onEdit(null);
                    }
                    _b = emptyTransactions;
                    _c = [];
                    for (_d in _b)
                        _c.push(_d);
                    _i = 0;
                    _e.label = 1;
                case 1:
                    if (!(_i < _c.length)) return [3 /*break*/, 4];
                    _d = _c[_i];
                    if (!(_d in _b)) return [3 /*break*/, 3];
                    transactionIndex = _d;
                    return [4 /*yield*/, onSave(__assign(__assign({}, emptyTransactions[transactionIndex]), { amount: amounts[transactionIndex] }))];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [onSave]);
    function onCloseAddTransaction() {
        setNewTransactions((0, utils_1.makeTemporaryTransactions)(props.currentAccountId, props.currentCategoryId));
        props.onCloseAddTransaction();
    }
    var onToggleSplit = (0, react_1.useCallback)(function (id) {
        return splitsExpandedDispatch({ type: 'toggle-split', id: id });
    }, [splitsExpandedDispatch]);
    return (<TransactionTableInner tableRef={mergedRef} listContainerRef={listContainerRef} {...props} transactions={transactionsWithExpandedSplits} transactionMap={transactionMap} transactionsByParent={transactionsByParent} transferAccountsByTransaction={transferAccountsByTransaction} selectedItems={selectedItems} isExpanded={splitsExpanded.isExpanded} onSave={onSave} onDelete={onDelete} onBatchDelete={onBatchDelete} onBatchDuplicate={onBatchDuplicate} onBatchLinkSchedule={onBatchLinkSchedule} onBatchUnlinkSchedule={onBatchUnlinkSchedule} onCreateRule={onCreateRule} onScheduleAction={onScheduleAction} onMakeAsNonSplitTransactions={onMakeAsNonSplitTransactions} onSplit={onSplit} onCheckNewEnter={onCheckNewEnter} onCheckEnter={onCheckEnter} onAddTemporary={onAddTemporary} onAddSplit={onAddSplit} onDistributeRemainder={onDistributeRemainder} onCloseAddTransaction={onCloseAddTransaction} onToggleSplit={onToggleSplit} newTransactions={newTransactions !== null && newTransactions !== void 0 ? newTransactions : []} tableNavigator={tableNavigator} newNavigator={newNavigator} showSelection={props.showSelection} allowSplitTransaction={props.allowSplitTransaction} showHiddenCategories={showHiddenCategories}/>);
});
exports.TransactionTable.displayName = 'TransactionTable';
