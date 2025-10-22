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
exports.ScheduleDetails = ScheduleDetails;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var i18next_1 = require("i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var schedules_1 = require("loot-core/shared/schedules");
var AccountAutocomplete_1 = require("@desktop-client/components/autocomplete/AccountAutocomplete");
var PayeeAutocomplete_1 = require("@desktop-client/components/autocomplete/PayeeAutocomplete");
var Modal_1 = require("@desktop-client/components/common/Modal");
var forms_1 = require("@desktop-client/components/forms");
var RuleEditor_1 = require("@desktop-client/components/rules/RuleEditor");
var DateSelect_1 = require("@desktop-client/components/select/DateSelect");
var RecurringSchedulePicker_1 = require("@desktop-client/components/select/RecurringSchedulePicker");
var table_1 = require("@desktop-client/components/table");
var SimpleTransactionsTable_1 = require("@desktop-client/components/transactions/SimpleTransactionsTable");
var AmountInput_1 = require("@desktop-client/components/util/AmountInput");
var GenericInput_1 = require("@desktop-client/components/util/GenericInput");
var useDateFormat_1 = require("@desktop-client/hooks/useDateFormat");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
var liveQuery_1 = require("@desktop-client/queries/liveQuery");
var redux_1 = require("@desktop-client/redux");
function updateScheduleConditions(schedule, fields) {
    var conds = (0, schedules_1.extractScheduleConds)(schedule._conditions);
    var updateCond = function (cond, op, field, value) {
        if (cond) {
            return __assign(__assign({}, cond), { value: value });
        }
        if (value != null || field === 'payee') {
            return { op: op, field: field, value: value };
        }
        return null;
    };
    // Validate
    if (fields.date == null) {
        return { error: (0, i18next_1.t)('Date is required') };
    }
    if (fields.amount == null) {
        return { error: (0, i18next_1.t)('A valid amount is required') };
    }
    return {
        conditions: [
            updateCond(conds.payee, 'is', 'payee', fields.payee),
            updateCond(conds.account, 'is', 'account', fields.account),
            updateCond(conds.date, 'isapprox', 'date', fields.date),
            // We don't use `updateCond` for amount because we want to
            // overwrite it completely
            {
                op: fields.amountOp,
                field: 'amount',
                value: fields.amount,
            },
        ].filter(function (val) { return !!val; }),
    };
}
function ScheduleDetails(_a) {
    var id = _a.id, transaction = _a.transaction;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var adding = id == null;
    var fromTrans = transaction != null;
    var payees = (0, payeesSlice_1.getPayeesById)((0, usePayees_1.usePayees)());
    var globalDispatch = (0, redux_1.useDispatch)();
    var dateFormat = (0, useDateFormat_1.useDateFormat)() || 'MM/dd/yyyy';
    var _b = (0, react_1.useReducer)(function (state, action) {
        var _a;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        switch (action.type) {
            case 'set-schedule': {
                var schedule_1 = action.schedule;
                // See if there are custom rules
                var conds = (0, schedules_1.extractScheduleConds)(schedule_1._conditions);
                var condsSet_1 = new Set(Object.values(conds));
                var isCustom = !!(((_b = schedule_1._conditions) === null || _b === void 0 ? void 0 : _b.find(function (c) { return !condsSet_1.has(c); })) ||
                    ((_c = schedule_1._actions) === null || _c === void 0 ? void 0 : _c.find(function (a) { return a.op !== 'link-schedule'; })));
                return __assign(__assign({}, state), { schedule: action.schedule, isCustom: isCustom, fields: {
                        payee: (_d = schedule_1._payee) !== null && _d !== void 0 ? _d : null,
                        account: (_e = schedule_1._account) !== null && _e !== void 0 ? _e : null,
                        amount: schedule_1._amount || 0,
                        amountOp: schedule_1._amountOp || 'isapprox',
                        date: (_f = schedule_1._date) !== null && _f !== void 0 ? _f : null,
                        posts_transaction: (_g = action.schedule.posts_transaction) !== null && _g !== void 0 ? _g : false,
                        name: (_h = schedule_1.name) !== null && _h !== void 0 ? _h : null,
                    } });
            }
            case 'set-field': {
                if (!(action.field in state.fields)) {
                    throw new Error('Unknown field: ' + action.field);
                }
                var fields = (_a = {},
                    _a[action.field] = action.value,
                    _a);
                // If we are changing the amount operator either to or
                // away from the `isbetween` operator, the amount value is
                // different and we need to convert it
                if (action.field === 'amountOp' &&
                    action.value !== state.fields.amountOp) {
                    if (action.value === 'isbetween') {
                        // We need a range if switching to `isbetween`. The
                        // amount field should be a number since we are
                        // switching away from the other ops, but check just in
                        // case
                        fields.amount =
                            typeof state.fields.amount === 'number'
                                ? { num1: state.fields.amount, num2: state.fields.amount }
                                : { num1: 0, num2: 0 };
                    }
                    else if (state.fields.amountOp === 'isbetween') {
                        // We need just a number if switching away from
                        // `isbetween`. The amount field should be a range, but
                        // also check just in case. We grab just the first
                        // number and use it
                        fields.amount =
                            typeof state.fields.amount === 'number'
                                ? state.fields.amount
                                : (_j = state.fields.amount) === null || _j === void 0 ? void 0 : _j.num1;
                    }
                }
                return __assign(__assign({}, state), { fields: __assign(__assign({}, state.fields), fields) });
            }
            case 'set-transactions': {
                if (fromTrans && action.transactions) {
                    action.transactions.sort(function (a) {
                        return transaction.id === a.id ? -1 : 1;
                    });
                }
                return __assign(__assign({}, state), { transactions: action.transactions });
            }
            case 'set-repeats': {
                return __assign(__assign({}, state), { fields: __assign(__assign({}, state.fields), { date: action.repeats
                            ? {
                                frequency: 'monthly',
                                endMode: 'never',
                                start: monthUtils.currentDay(),
                                patterns: [],
                            }
                            : monthUtils.currentDay() }) });
            }
            case 'set-upcoming-dates': {
                return __assign(__assign({}, state), { upcomingDates: action.dates });
            }
            case 'form-error': {
                return __assign(__assign({}, state), { error: action.error });
            }
            case 'switch-transactions': {
                return __assign(__assign({}, state), { transactionsMode: action.mode });
            }
            default: {
                throw new Error('Unknown action');
            }
        }
    }, {
        schedule: null,
        upcomingDates: null,
        error: null,
        fields: {
            payee: null,
            account: null,
            amount: null,
            amountOp: null,
            date: null,
            posts_transaction: false,
            name: null,
        },
        transactions: [],
        transactionsMode: adding ? 'matched' : 'linked',
    }), state = _b[0], dispatch = _b[1];
    function loadSchedule() {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('schedules').filter({ id: id }).select('*'))];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data[0]];
                }
            });
        });
    }
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var date, schedule_2, schedule_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!adding) return [3 /*break*/, 1];
                            date = {
                                start: monthUtils.currentDay(),
                                frequency: 'monthly',
                                patterns: [],
                                skipWeekend: false,
                                weekendSolveMode: 'after',
                                endMode: 'never',
                                endOccurrences: 1,
                                endDate: monthUtils.currentDay(),
                            };
                            schedule_2 = fromTrans
                                ? {
                                    posts_transaction: false,
                                    _conditions: [{ op: 'isapprox', field: 'date', value: date }],
                                    _actions: [],
                                    _account: transaction.account,
                                    _amount: transaction.amount,
                                    _amountOp: 'is',
                                    name: transaction.payee ? payees[transaction.payee].name : '',
                                    _payee: transaction.payee ? transaction.payee : '',
                                    _date: __assign(__assign({}, date), { frequency: 'monthly', start: transaction.date, patterns: [] }),
                                }
                                : {
                                    posts_transaction: false,
                                    _date: date,
                                    _conditions: [{ op: 'isapprox', field: 'date', value: date }],
                                    _actions: [],
                                };
                            dispatch({ type: 'set-schedule', schedule: schedule_2 });
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, loadSchedule()];
                        case 2:
                            schedule_3 = _a.sent();
                            if (schedule_3 && state.schedule == null) {
                                dispatch({ type: 'set-schedule', schedule: schedule_3 });
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(function () {
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var date, today, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            date = state.fields.date;
                            if (date === null) {
                                dispatch({ type: 'set-upcoming-dates', dates: null });
                                return [2 /*return*/];
                            }
                            if (typeof date === 'string') {
                                today = monthUtils.currentDay();
                                if (date === today || monthUtils.isAfter(date, today)) {
                                    dispatch({ type: 'set-upcoming-dates', dates: [date] });
                                }
                                else {
                                    dispatch({ type: 'set-upcoming-dates', dates: null });
                                }
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, (0, fetch_1.sendCatch)('schedule/get-upcoming-dates', {
                                    config: date,
                                    count: 3,
                                })];
                        case 1:
                            data = (_a.sent()).data;
                            dispatch({ type: 'set-upcoming-dates', dates: data });
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    }, [state.fields.date]);
    (0, react_1.useEffect)(function () {
        if (state.schedule &&
            state.schedule.id &&
            state.transactionsMode === 'linked') {
            var live = (0, liveQuery_1.liveQuery)((0, query_1.q)('transactions')
                .filter({ schedule: state.schedule.id })
                .select('*')
                .options({ splits: 'all' }), {
                onData: function (data) {
                    return dispatch({ type: 'set-transactions', transactions: data });
                },
            });
            return live.unsubscribe;
        }
    }, [state.schedule, state.transactionsMode]);
    (0, react_1.useEffect)(function () {
        var current = true;
        var unsubscribe;
        if (state.schedule && state.transactionsMode === 'matched') {
            var updated = updateScheduleConditions(state.schedule, state.fields);
            if ('error' in updated) {
                dispatch({ type: 'form-error', error: updated.error });
                return;
            }
            // *Extremely* gross hack because the rules are not mapped to
            // public names automatically. We really should be doing that
            // at the database layer
            var conditions = updated.conditions.map(function (cond) {
                if (cond.field === 'description') {
                    return __assign(__assign({}, cond), { field: 'payee' });
                }
                else if (cond.field === 'acct') {
                    return __assign(__assign({}, cond), { field: 'account' });
                }
                return cond;
            });
            (0, fetch_1.send)('make-filters-from-conditions', {
                conditions: conditions,
            }).then(function (_a) {
                var filters = _a.filters;
                if (current) {
                    var live = (0, liveQuery_1.liveQuery)((0, query_1.q)('transactions')
                        .filter({ $and: filters })
                        .select('*')
                        .options({ splits: 'all' }), {
                        onData: function (data) {
                            return dispatch({ type: 'set-transactions', transactions: data });
                        },
                    });
                    unsubscribe = live.unsubscribe;
                }
            });
        }
        return function () {
            current = false;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [state.schedule, state.transactionsMode, state.fields]);
    var selectedInst = (0, useSelected_1.useSelected)('transactions', state.transactions, transaction ? [transaction.id] : []);
    function onSave(close, schedule) {
        return __awaiter(this, void 0, void 0, function () {
            var sameName, _a, error, conditions, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dispatch({ type: 'form-error', error: null });
                        if (!state.fields.name) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('schedules').filter({ name: state.fields.name }).select('id'))];
                    case 1:
                        sameName = (_b.sent()).data;
                        if (sameName.length > 0 && sameName[0].id !== schedule.id) {
                            dispatch({
                                type: 'form-error',
                                error: t('There is already a schedule with this name'),
                            });
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        _a = updateScheduleConditions(schedule, state.fields), error = _a.error, conditions = _a.conditions;
                        if (error) {
                            dispatch({ type: 'form-error', error: error });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, (0, fetch_1.sendCatch)(adding ? 'schedule/create' : 'schedule/update', {
                                schedule: {
                                    id: schedule.id,
                                    posts_transaction: state.fields.posts_transaction,
                                    name: state.fields.name,
                                },
                                conditions: conditions,
                            })];
                    case 3:
                        res = _b.sent();
                        if (res.error) {
                            dispatch({
                                type: 'form-error',
                                error: t('An error occurred while saving. Please visit https://actualbudget.org/contact/ for support.'),
                            });
                            return [2 /*return*/];
                        }
                        if (!adding) return [3 /*break*/, 5];
                        return [4 /*yield*/, onLinkTransactions(__spreadArray([], selectedInst.items, true), res.data)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        close();
                        return [2 /*return*/];
                }
            });
        });
    }
    function onEditRule(id) {
        return __awaiter(this, void 0, void 0, function () {
            var rule;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('rule-get', { id: id })];
                    case 1:
                        rule = _a.sent();
                        if (!rule) {
                            return [2 /*return*/];
                        }
                        globalDispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'edit-rule',
                                options: {
                                    rule: rule,
                                    onSave: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var schedule;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, loadSchedule()];
                                                case 1:
                                                    schedule = _a.sent();
                                                    dispatch({ type: 'set-schedule', schedule: schedule });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                },
                            },
                        }));
                        return [2 /*return*/];
                }
            });
        });
    }
    function onLinkTransactions(ids, scheduleId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                            updated: ids.map(function (id) { return ({
                                id: id,
                                schedule: scheduleId,
                            }); }),
                        })];
                    case 1:
                        _a.sent();
                        selectedInst.dispatch({ type: 'select-none' });
                        return [2 /*return*/];
                }
            });
        });
    }
    function onUnlinkTransactions(ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', {
                            updated: ids.map(function (id) { return ({ id: id, schedule: null }); }),
                        })];
                    case 1:
                        _a.sent();
                        selectedInst.dispatch({ type: 'select-none' });
                        return [2 /*return*/];
                }
            });
        });
    }
    var schedule = state.schedule;
    if (schedule == null) {
        return null;
    }
    function onSwitchTransactions(mode) {
        dispatch({ type: 'switch-transactions', mode: mode });
        selectedInst.dispatch({ type: 'select-none' });
    }
    var payee = payees && state.fields.payee ? payees[state.fields.payee] : null;
    // This is derived from the date
    var repeats = state.fields.date && typeof state.fields.date !== 'string'
        ? !!state.fields.date.frequency
        : false;
    return (<Modal_1.Modal name="schedule-edit">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={payee
                    ? t("Schedule: {{name}}", { name: payee.name })
                    : t('Schedule')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <stack_1.Stack direction="row" style={{ marginTop: 10 }}>
            <forms_1.FormField style={{ flex: 1 }}>
              <forms_1.FormLabel title={t('Schedule Name')} htmlFor="name-field"/>
              <initial_focus_1.InitialFocus>
                {/* @ts-expect-error should be auto-patched once GenericInput is converted to TS */}
                <GenericInput_1.GenericInput field="string" type="string" value={state.fields.name} multi={false} onChange={function (e) {
                    dispatch({ type: 'set-field', field: 'name', value: e });
                }}/>
              </initial_focus_1.InitialFocus>
            </forms_1.FormField>
          </stack_1.Stack>
          <stack_1.Stack direction="row" style={{ marginTop: 20 }}>
            <forms_1.FormField style={{ flex: 1 }}>
              <forms_1.FormLabel title={t('Payee')} id="payee-label" htmlFor="payee-field"/>
              <PayeeAutocomplete_1.PayeeAutocomplete value={state.fields.payee} labelProps={{ id: 'payee-label' }} inputProps={{ id: 'payee-field', placeholder: t('(none)') }} onSelect={function (id) {
                    return dispatch({ type: 'set-field', field: 'payee', value: id });
                }}/>
            </forms_1.FormField>

            <forms_1.FormField style={{ flex: 1 }}>
              <forms_1.FormLabel title={t('Account')} id="account-label" htmlFor="account-field"/>
              <AccountAutocomplete_1.AccountAutocomplete includeClosedAccounts={false} value={state.fields.account} labelProps={{ id: 'account-label' }} inputProps={{ id: 'account-field', placeholder: t('(none)') }} onSelect={function (id) {
                    return dispatch({ type: 'set-field', field: 'account', value: id });
                }}/>
            </forms_1.FormField>

            <forms_1.FormField style={{ flex: 1 }}>
              <stack_1.Stack direction="row" align="center" style={{ marginBottom: 3 }}>
                <forms_1.FormLabel title={t('Amount')} htmlFor="amount-field" style={{ margin: 0, flex: 1 }}/>
                <RuleEditor_1.OpSelect ops={['isapprox', 'is', 'isbetween']} value={state.fields.amountOp} formatOp={function (op) {
                    switch (op) {
                        case 'is':
                            return t('is exactly');
                        case 'isapprox':
                            return t('is approximately');
                        case 'isbetween':
                            return t('is between');
                        default:
                            throw new Error('Invalid op for select: ' + op);
                    }
                }} style={{
                    padding: '0 10px',
                    color: theme_1.theme.pageTextLight,
                    fontSize: 12,
                }} onChange={function (_, op) {
                    return dispatch({
                        type: 'set-field',
                        field: 'amountOp',
                        value: op,
                    });
                }}/>
              </stack_1.Stack>
              {state.fields.amountOp === 'isbetween' ? (<AmountInput_1.BetweenAmountInput 
                // @ts-expect-error fix me
                defaultValue={state.fields.amount} onChange={function (value) {
                        return dispatch({
                            type: 'set-field',
                            field: 'amount',
                            value: value,
                        });
                    }}/>) : (<AmountInput_1.AmountInput id="amount-field" 
                // @ts-expect-error fix me
                value={state.fields.amount} onUpdate={function (value) {
                        return dispatch({
                            type: 'set-field',
                            field: 'amount',
                            value: value,
                        });
                    }}/>)}
            </forms_1.FormField>
          </stack_1.Stack>

          <view_1.View style={{ marginTop: 20 }}>
            <forms_1.FormLabel title={t('Date')}/>
          </view_1.View>

          <stack_1.Stack direction="row" align="flex-start" justify="space-between">
            <view_1.View style={{ width: '13.44rem' }}>
              {repeats ? (<RecurringSchedulePicker_1.RecurringSchedulePicker 
                // @ts-expect-error fix me
                value={state.fields.date} onChange={function (value) {
                        return dispatch({ type: 'set-field', field: 'date', value: value });
                    }}/>) : (<DateSelect_1.DateSelect 
                // @ts-expect-error fix me
                value={state.fields.date} onSelect={function (date) {
                        return dispatch({ type: 'set-field', field: 'date', value: date });
                    }} dateFormat={dateFormat}/>)}

              {state.upcomingDates && (<view_1.View style={{ fontSize: 13, marginTop: 20 }}>
                  <text_1.Text style={{ color: theme_1.theme.pageTextLight, fontWeight: 600 }}>
                    <react_i18next_1.Trans>Upcoming dates</react_i18next_1.Trans>
                  </text_1.Text>
                  <stack_1.Stack direction="column" spacing={1} style={{ marginTop: 10, color: theme_1.theme.pageTextLight }}>
                    {state.upcomingDates.map(function (date) { return (<view_1.View key={date}>
                        {monthUtils.format(date, "".concat(dateFormat, " EEEE"), locale)}
                      </view_1.View>); })}
                  </stack_1.Stack>
                </view_1.View>)}
            </view_1.View>

            <view_1.View style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    userSelect: 'none',
                }}>
              <forms_1.Checkbox id="form_repeats" checked={repeats} onChange={function (e) {
                    dispatch({ type: 'set-repeats', repeats: e.target.checked });
                }}/>
              <label htmlFor="form_repeats" style={{ userSelect: 'none' }}>
                <react_i18next_1.Trans>Repeats</react_i18next_1.Trans>
              </label>
            </view_1.View>

            <stack_1.Stack align="flex-end">
              <view_1.View style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    userSelect: 'none',
                    justifyContent: 'flex-end',
                }}>
                <forms_1.Checkbox id="form_posts_transaction" checked={state.fields.posts_transaction} onChange={function (e) {
                    dispatch({
                        type: 'set-field',
                        field: 'posts_transaction',
                        value: e.target.checked,
                    });
                }}/>
                <label htmlFor="form_posts_transaction" style={{ userSelect: 'none' }}>
                  <react_i18next_1.Trans>Automatically add transaction</react_i18next_1.Trans>
                </label>
              </view_1.View>

              <text_1.Text style={{
                    width: 350,
                    textAlign: 'right',
                    color: theme_1.theme.pageTextLight,
                    marginTop: 10,
                    fontSize: 13,
                    lineHeight: '1.4em',
                }}>
                <react_i18next_1.Trans>
                  If checked, the schedule will automatically create
                  transactions for you in the specified account
                </react_i18next_1.Trans>
              </text_1.Text>

              {!adding && schedule.rule && (<stack_1.Stack direction="row" align="center" style={{ marginTop: 20 }}>
                  {state.isCustom && (<text_1.Text style={{
                            color: theme_1.theme.pageTextLight,
                            fontSize: 13,
                            textAlign: 'right',
                            width: 350,
                        }}>
                      <react_i18next_1.Trans>
                        This schedule has custom conditions and actions
                      </react_i18next_1.Trans>
                    </text_1.Text>)}
                  <button_1.Button onPress={function () { return onEditRule(schedule.rule); }} isDisabled={adding}>
                    <react_i18next_1.Trans>Edit as rule</react_i18next_1.Trans>
                  </button_1.Button>
                </stack_1.Stack>)}
            </stack_1.Stack>
          </stack_1.Stack>

          <view_1.View style={{ marginTop: 30, flex: 1 }}>
            <useSelected_1.SelectedProvider instance={selectedInst}>
              {adding ? (<view_1.View style={{ flexDirection: 'row', padding: '5px 0' }}>
                  <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
                    <react_i18next_1.Trans>These transactions match this schedule:</react_i18next_1.Trans>
                  </text_1.Text>
                  <view_1.View style={{ flex: 1 }}/>
                  <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
                    <react_i18next_1.Trans>Select transactions to link on save</react_i18next_1.Trans>
                  </text_1.Text>
                </view_1.View>) : (<view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <button_1.Button variant="bare" style={{
                        color: state.transactionsMode === 'linked'
                            ? theme_1.theme.pageTextLink
                            : theme_1.theme.pageTextSubdued,
                        marginRight: 10,
                        fontSize: 14,
                    }} onPress={function () { return onSwitchTransactions('linked'); }}>
                    <react_i18next_1.Trans>Linked transactions</react_i18next_1.Trans>
                  </button_1.Button>{' '}
                  <button_1.Button variant="bare" style={{
                        color: state.transactionsMode === 'matched'
                            ? theme_1.theme.pageTextLink
                            : theme_1.theme.pageTextSubdued,
                        fontSize: 14,
                    }} onPress={function () { return onSwitchTransactions('matched'); }}>
                    <react_i18next_1.Trans>Find matching transactions</react_i18next_1.Trans>
                  </button_1.Button>
                  <view_1.View style={{ flex: 1 }}/>
                  <table_1.SelectedItemsButton id="transactions" name={function (count) { return t('{{count}} transactions', { count: count }); }} items={state.transactionsMode === 'linked'
                        ? [{ name: 'unlink', text: t('Unlink from schedule') }]
                        : [{ name: 'link', text: t('Link to schedule') }]} onSelect={function (name, ids) {
                        switch (name) {
                            case 'link':
                                onLinkTransactions(ids, schedule.id);
                                break;
                            case 'unlink':
                                onUnlinkTransactions(ids);
                                break;
                            default:
                        }
                    }}/>
                </view_1.View>)}

              <SimpleTransactionsTable_1.SimpleTransactionsTable renderEmpty={<NoTransactionsMessage error={state.error} transactionsMode={state.transactionsMode}/>} transactions={state.transactions} fields={['date', 'payee', 'notes', 'amount']} style={{
                    border: '1px solid ' + theme_1.theme.tableBorder,
                    borderRadius: 4,
                    overflow: 'hidden',
                    marginTop: 5,
                    maxHeight: 200,
                }}/>
            </useSelected_1.SelectedProvider>
          </view_1.View>

          <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ marginTop: 20 }}>
            {state.error && (<text_1.Text style={{ color: theme_1.theme.errorText }}>{state.error}</text_1.Text>)}
            <button_1.Button style={{ marginRight: 10 }} onPress={close}>
              <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="primary" onPress={function () {
                    onSave(close, schedule);
                }}>
              {adding ? t('Add') : t('Save')}
            </button_1.Button>
          </stack_1.Stack>
        </>);
        }}
    </Modal_1.Modal>);
}
function NoTransactionsMessage(props) {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{
            padding: 20,
            color: theme_1.theme.pageTextLight,
            textAlign: 'center',
        }}>
      {props.error ? (<text_1.Text style={{ color: theme_1.theme.errorText }}>
          <react_i18next_1.Trans>Could not search: {{ errorReason: props.error }}</react_i18next_1.Trans>
        </text_1.Text>) : props.transactionsMode === 'matched' ? (t('No matching transactions')) : (t('No linked transactions'))}
    </view_1.View>);
}
