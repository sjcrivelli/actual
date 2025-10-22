"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverSchedules = DiscoverSchedules;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var stack_1 = require("@actual-app/components/stack");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var SchedulesTable_1 = require("./SchedulesTable");
var Modal_1 = require("@desktop-client/components/common/Modal");
var table_1 = require("@desktop-client/components/table");
var DisplayId_1 = require("@desktop-client/components/util/DisplayId");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSendPlatformRequest_1 = require("@desktop-client/hooks/useSendPlatformRequest");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
var ROW_HEIGHT = 43;
function DiscoverSchedulesTable(_a) {
    var schedules = _a.schedules, loading = _a.loading;
    var t = (0, react_i18next_1.useTranslation)().t;
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var locale = (0, useLocale_1.useLocale)();
    function renderItem(_a) {
        var item = _a.item;
        var selected = selectedItems.has(item.id);
        var amountOp = item._conditions.find(function (c) { return c.field === 'amount'; }).op;
        var recurDescription = (0, schedules_1.getRecurringDescription)(item.date, dateFormat, locale);
        return (<table_1.Row height={ROW_HEIGHT} inset={15} onClick={function (e) {
                dispatchSelected({
                    type: 'select',
                    id: item.id,
                    isRangeSelect: e.shiftKey,
                });
            }} style={{
                borderColor: selected ? theme_1.theme.tableBorderSelected : theme_1.theme.tableBorder,
                cursor: 'pointer',
                color: selected
                    ? theme_1.theme.tableRowBackgroundHighlightText
                    : theme_1.theme.tableText,
                backgroundColor: selected
                    ? theme_1.theme.tableRowBackgroundHighlight
                    : theme_1.theme.tableBackground,
                ':hover': {
                    backgroundColor: theme_1.theme.tableRowBackgroundHover,
                    color: theme_1.theme.tableText,
                },
            }}>
        <table_1.SelectCell exposed={true} focused={false} selected={selected} onSelect={function (e) {
                dispatchSelected({
                    type: 'select',
                    id: item.id,
                    isRangeSelect: e.shiftKey,
                });
            }}/>
        <table_1.Field width="flex">
          <DisplayId_1.DisplayId type="payees" id={item.payee}/>
        </table_1.Field>
        <table_1.Field width="flex">
          <DisplayId_1.DisplayId type="accounts" id={item.account}/>
        </table_1.Field>
        <table_1.Field width="auto" title={recurDescription} style={{ flex: 1.5 }}>
          {recurDescription}
        </table_1.Field>
        <SchedulesTable_1.ScheduleAmountCell amount={item.amount} op={amountOp}/>
      </table_1.Row>);
    }
    return (<view_1.View style={{ flex: 1 }}>
      <table_1.TableHeader height={ROW_HEIGHT} inset={15}>
        <table_1.SelectCell exposed={!loading} focused={false} selected={selectedItems.size > 0} onSelect={function (e) {
            return dispatchSelected({ type: 'select-all', isRangeSelect: e.shiftKey });
        }}/>
        <table_1.Field width="flex">
          <react_i18next_1.Trans>Payee</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width="flex">
          <react_i18next_1.Trans>Account</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width="auto" style={{ flex: 1.5 }}>
          <react_i18next_1.Trans>When</react_i18next_1.Trans>
        </table_1.Field>
        <table_1.Field width={100} style={{ textAlign: 'right' }}>
          <react_i18next_1.Trans>Amount</react_i18next_1.Trans>
        </table_1.Field>
      </table_1.TableHeader>
      <table_1.Table rowHeight={ROW_HEIGHT} style={{
            flex: 1,
            backgroundColor: 'transparent',
        }} items={schedules} loading={loading} isSelected={function (id) { return selectedItems.has(String(id)); }} renderItem={renderItem} renderEmpty={t('No schedules found')}/>
    </view_1.View>);
}
function DiscoverSchedules() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, useSendPlatformRequest_1.useSendPlatformRequest)('schedule/discover'), data = _a.data, isLoading = _a.isLoading;
    var schedules = data || [];
    var _b = (0, react_1.useState)(false), creating = _b[0], setCreating = _b[1];
    var selectedInst = (0, useSelected_1.useSelected)('discover-schedules', schedules, []);
    function onCreate() {
        return __awaiter(this, void 0, void 0, function () {
            var selected, _loop_1, _i, selected_1, schedule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selected = schedules.filter(function (s) { return selectedInst.items.has(s.id); });
                        setCreating(true);
                        _loop_1 = function (schedule) {
                            var scheduleId, filters, transactions;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, fetch_1.send)('schedule/create', {
                                            conditions: schedule._conditions,
                                            schedule: {},
                                        })];
                                    case 1:
                                        scheduleId = _b.sent();
                                        return [4 /*yield*/, (0, fetch_1.send)('make-filters-from-conditions', {
                                                conditions: schedule._conditions,
                                            })];
                                    case 2:
                                        filters = (_b.sent()).filters;
                                        if (!(filters.length > 0)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions').filter({ $and: filters }).select('id'))];
                                    case 3:
                                        transactions = (_b.sent()).data;
                                        return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                                                updated: transactions.map(function (t) { return ({
                                                    id: t.id,
                                                    schedule: scheduleId,
                                                }); }),
                                            })];
                                    case 4:
                                        _b.sent();
                                        _b.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, selected_1 = selected;
                        _a.label = 1;
                    case 1:
                        if (!(_i < selected_1.length)) return [3 /*break*/, 4];
                        schedule = selected_1[_i];
                        return [5 /*yield**/, _loop_1(schedule)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        setCreating(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="schedules-discover" containerProps={{ style: { width: 850, height: 650 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Found Schedules')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              We found some possible schedules in your current transactions.
              Select the ones you want to create.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              If you expected a schedule here and don’t see it, it might be
              because the payees of the transactions don’t match. Make sure you
              rename payees on all transactions for a schedule to be the same
              payee.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>

          <useSelected_1.SelectedProvider instance={selectedInst}>
            <DiscoverSchedulesTable loading={isLoading} schedules={schedules}/>
          </useSelected_1.SelectedProvider>

          <stack_1.Stack direction="row" align="center" justify="flex-end" style={{
                    paddingTop: 20,
                    paddingBottom: 0,
                }}>
            <button_1.ButtonWithLoading variant="primary" isLoading={creating} isDisabled={selectedInst.items.size === 0} onPress={function () {
                    onCreate();
                    close();
                }}>
              <react_i18next_1.Trans>Create schedules</react_i18next_1.Trans>
            </button_1.ButtonWithLoading>
          </stack_1.Stack>
        </>);
        }}
    </Modal_1.Modal>);
}
