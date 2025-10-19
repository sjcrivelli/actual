import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useEffect, useReducer } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { InitialFocus } from '@actual-app/components/initial-focus';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { t } from 'i18next';
import { send, sendCatch } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { q } from 'loot-core/shared/query';
import { extractScheduleConds } from 'loot-core/shared/schedules';
import { AccountAutocomplete } from '@desktop-client/components/autocomplete/AccountAutocomplete';
import { PayeeAutocomplete } from '@desktop-client/components/autocomplete/PayeeAutocomplete';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { FormField, FormLabel, Checkbox, } from '@desktop-client/components/forms';
import { OpSelect } from '@desktop-client/components/rules/RuleEditor';
import { DateSelect } from '@desktop-client/components/select/DateSelect';
import { RecurringSchedulePicker } from '@desktop-client/components/select/RecurringSchedulePicker';
import { SelectedItemsButton } from '@desktop-client/components/table';
import { SimpleTransactionsTable } from '@desktop-client/components/transactions/SimpleTransactionsTable';
import { AmountInput, BetweenAmountInput, } from '@desktop-client/components/util/AmountInput';
import { GenericInput } from '@desktop-client/components/util/GenericInput';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { useSelected, SelectedProvider, } from '@desktop-client/hooks/useSelected';
import { pushModal, } from '@desktop-client/modals/modalsSlice';
import { getPayeesById } from '@desktop-client/payees/payeesSlice';
import { aqlQuery } from '@desktop-client/queries/aqlQuery';
import { liveQuery } from '@desktop-client/queries/liveQuery';
import { useDispatch } from '@desktop-client/redux';
function updateScheduleConditions(schedule, fields) {
    const conds = extractScheduleConds(schedule._conditions);
    const updateCond = (cond, op, field, value) => {
        if (cond) {
            return { ...cond, value };
        }
        if (value != null || field === 'payee') {
            return { op, field, value };
        }
        return null;
    };
    // Validate
    if (fields.date == null) {
        return { error: t('Date is required') };
    }
    if (fields.amount == null) {
        return { error: t('A valid amount is required') };
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
        ].filter(val => !!val),
    };
}
export function ScheduleDetails({ id, transaction }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const adding = id == null;
    const fromTrans = transaction != null;
    const payees = getPayeesById(usePayees());
    const globalDispatch = useDispatch();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'set-schedule': {
                const schedule = action.schedule;
                // See if there are custom rules
                const conds = extractScheduleConds(schedule._conditions);
                const condsSet = new Set(Object.values(conds));
                const isCustom = !!(schedule._conditions?.find(c => !condsSet.has(c)) ||
                    schedule._actions?.find(a => a.op !== 'link-schedule'));
                return {
                    ...state,
                    schedule: action.schedule,
                    isCustom,
                    fields: {
                        payee: schedule._payee ?? null,
                        account: schedule._account ?? null,
                        amount: schedule._amount || 0,
                        amountOp: schedule._amountOp || 'isapprox',
                        date: schedule._date ?? null,
                        posts_transaction: action.schedule.posts_transaction ?? false,
                        name: schedule.name ?? null,
                    },
                };
            }
            case 'set-field': {
                if (!(action.field in state.fields)) {
                    throw new Error('Unknown field: ' + action.field);
                }
                const fields = {
                    [action.field]: action.value,
                };
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
                                : state.fields.amount?.num1;
                    }
                }
                return {
                    ...state,
                    fields: { ...state.fields, ...fields },
                };
            }
            case 'set-transactions': {
                if (fromTrans && action.transactions) {
                    action.transactions.sort(a => {
                        return transaction.id === a.id ? -1 : 1;
                    });
                }
                return { ...state, transactions: action.transactions };
            }
            case 'set-repeats': {
                return {
                    ...state,
                    fields: {
                        ...state.fields,
                        date: action.repeats
                            ? {
                                frequency: 'monthly',
                                endMode: 'never',
                                start: monthUtils.currentDay(),
                                patterns: [],
                            }
                            : monthUtils.currentDay(),
                    },
                };
            }
            case 'set-upcoming-dates': {
                return {
                    ...state,
                    upcomingDates: action.dates,
                };
            }
            case 'form-error': {
                return { ...state, error: action.error };
            }
            case 'switch-transactions': {
                return { ...state, transactionsMode: action.mode };
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
    });
    async function loadSchedule() {
        const { data } = await aqlQuery(q('schedules').filter({ id }).select('*'));
        return data[0];
    }
    useEffect(() => {
        async function run() {
            if (adding) {
                const date = {
                    start: monthUtils.currentDay(),
                    frequency: 'monthly',
                    patterns: [],
                    skipWeekend: false,
                    weekendSolveMode: 'after',
                    endMode: 'never',
                    endOccurrences: 1,
                    endDate: monthUtils.currentDay(),
                };
                const schedule = fromTrans
                    ? {
                        posts_transaction: false,
                        _conditions: [{ op: 'isapprox', field: 'date', value: date }],
                        _actions: [],
                        _account: transaction.account,
                        _amount: transaction.amount,
                        _amountOp: 'is',
                        name: transaction.payee ? payees[transaction.payee].name : '',
                        _payee: transaction.payee ? transaction.payee : '',
                        _date: {
                            ...date,
                            frequency: 'monthly',
                            start: transaction.date,
                            patterns: [],
                        },
                    }
                    : {
                        posts_transaction: false,
                        _date: date,
                        _conditions: [{ op: 'isapprox', field: 'date', value: date }],
                        _actions: [],
                    };
                dispatch({ type: 'set-schedule', schedule });
            }
            else {
                const schedule = await loadSchedule();
                if (schedule && state.schedule == null) {
                    dispatch({ type: 'set-schedule', schedule });
                }
            }
        }
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        async function run() {
            const date = state.fields.date;
            if (date === null) {
                dispatch({ type: 'set-upcoming-dates', dates: null });
                return;
            }
            if (typeof date === 'string') {
                const today = monthUtils.currentDay();
                if (date === today || monthUtils.isAfter(date, today)) {
                    dispatch({ type: 'set-upcoming-dates', dates: [date] });
                }
                else {
                    dispatch({ type: 'set-upcoming-dates', dates: null });
                }
                return;
            }
            const { data } = await sendCatch('schedule/get-upcoming-dates', {
                config: date,
                count: 3,
            });
            dispatch({ type: 'set-upcoming-dates', dates: data });
        }
        run();
    }, [state.fields.date]);
    useEffect(() => {
        if (state.schedule &&
            state.schedule.id &&
            state.transactionsMode === 'linked') {
            const live = liveQuery(q('transactions')
                .filter({ schedule: state.schedule.id })
                .select('*')
                .options({ splits: 'all' }), {
                onData: data => dispatch({ type: 'set-transactions', transactions: data }),
            });
            return live.unsubscribe;
        }
    }, [state.schedule, state.transactionsMode]);
    useEffect(() => {
        let current = true;
        let unsubscribe;
        if (state.schedule && state.transactionsMode === 'matched') {
            const updated = updateScheduleConditions(state.schedule, state.fields);
            if ('error' in updated) {
                dispatch({ type: 'form-error', error: updated.error });
                return;
            }
            // *Extremely* gross hack because the rules are not mapped to
            // public names automatically. We really should be doing that
            // at the database layer
            const conditions = updated.conditions.map(cond => {
                if (cond.field === 'description') {
                    return { ...cond, field: 'payee' };
                }
                else if (cond.field === 'acct') {
                    return { ...cond, field: 'account' };
                }
                return cond;
            });
            send('make-filters-from-conditions', {
                conditions,
            }).then(({ filters }) => {
                if (current) {
                    const live = liveQuery(q('transactions')
                        .filter({ $and: filters })
                        .select('*')
                        .options({ splits: 'all' }), {
                        onData: data => dispatch({ type: 'set-transactions', transactions: data }),
                    });
                    unsubscribe = live.unsubscribe;
                }
            });
        }
        return () => {
            current = false;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [state.schedule, state.transactionsMode, state.fields]);
    const selectedInst = useSelected('transactions', state.transactions, transaction ? [transaction.id] : []);
    async function onSave(close, schedule) {
        dispatch({ type: 'form-error', error: null });
        if (state.fields.name) {
            const { data: sameName } = await aqlQuery(q('schedules').filter({ name: state.fields.name }).select('id'));
            if (sameName.length > 0 && sameName[0].id !== schedule.id) {
                dispatch({
                    type: 'form-error',
                    error: t('There is already a schedule with this name'),
                });
                return;
            }
        }
        const { error, conditions } = updateScheduleConditions(schedule, state.fields);
        if (error) {
            dispatch({ type: 'form-error', error });
            return;
        }
        const res = await sendCatch(adding ? 'schedule/create' : 'schedule/update', {
            schedule: {
                id: schedule.id,
                posts_transaction: state.fields.posts_transaction,
                name: state.fields.name,
            },
            conditions,
        });
        if (res.error) {
            dispatch({
                type: 'form-error',
                error: t('An error occurred while saving. Please visit https://actualbudget.org/contact/ for support.'),
            });
            return;
        }
        if (adding) {
            await onLinkTransactions([...selectedInst.items], res.data);
        }
        close();
    }
    async function onEditRule(id) {
        const rule = await send('rule-get', { id });
        if (!rule) {
            return;
        }
        globalDispatch(pushModal({
            modal: {
                name: 'edit-rule',
                options: {
                    rule,
                    onSave: async () => {
                        const schedule = await loadSchedule();
                        dispatch({ type: 'set-schedule', schedule });
                    },
                },
            },
        }));
    }
    async function onLinkTransactions(ids, scheduleId) {
        await send('transactions-batch-update', {
            updated: ids.map(id => ({
                id,
                schedule: scheduleId,
            })),
        });
        selectedInst.dispatch({ type: 'select-none' });
    }
    async function onUnlinkTransactions(ids) {
        await send('transactions-batch-update', {
            updated: ids.map(id => ({ id, schedule: null })),
        });
        selectedInst.dispatch({ type: 'select-none' });
    }
    const { schedule } = state;
    if (schedule == null) {
        return null;
    }
    function onSwitchTransactions(mode) {
        dispatch({ type: 'switch-transactions', mode });
        selectedInst.dispatch({ type: 'select-none' });
    }
    const payee = payees && state.fields.payee ? payees[state.fields.payee] : null;
    // This is derived from the date
    const repeats = state.fields.date && typeof state.fields.date !== 'string'
        ? !!state.fields.date.frequency
        : false;
    return (_jsx(Modal, { name: "schedule-edit", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: payee
                        ? t(`Schedule: {{name}}`, { name: payee.name })
                        : t('Schedule'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Stack, { direction: "row", style: { marginTop: 10 }, children: _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Schedule Name'), htmlFor: "name-field" }), _jsx(InitialFocus, { children: _jsx(GenericInput, { field: "string", type: "string", value: state.fields.name, multi: false, onChange: e => {
                                        dispatch({ type: 'set-field', field: 'name', value: e });
                                    } }) })] }) }), _jsxs(Stack, { direction: "row", style: { marginTop: 20 }, children: [_jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Payee'), id: "payee-label", htmlFor: "payee-field" }), _jsx(PayeeAutocomplete, { value: state.fields.payee, labelProps: { id: 'payee-label' }, inputProps: { id: 'payee-field', placeholder: t('(none)') }, onSelect: id => dispatch({ type: 'set-field', field: 'payee', value: id }) })] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsx(FormLabel, { title: t('Account'), id: "account-label", htmlFor: "account-field" }), _jsx(AccountAutocomplete, { includeClosedAccounts: false, value: state.fields.account, labelProps: { id: 'account-label' }, inputProps: { id: 'account-field', placeholder: t('(none)') }, onSelect: id => dispatch({ type: 'set-field', field: 'account', value: id }) })] }), _jsxs(FormField, { style: { flex: 1 }, children: [_jsxs(Stack, { direction: "row", align: "center", style: { marginBottom: 3 }, children: [_jsx(FormLabel, { title: t('Amount'), htmlFor: "amount-field", style: { margin: 0, flex: 1 } }), _jsx(OpSelect, { ops: ['isapprox', 'is', 'isbetween'], value: state.fields.amountOp, formatOp: op => {
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
                                            }, style: {
                                                padding: '0 10px',
                                                color: theme.pageTextLight,
                                                fontSize: 12,
                                            }, onChange: (_, op) => dispatch({
                                                type: 'set-field',
                                                field: 'amountOp',
                                                value: op,
                                            }) })] }), state.fields.amountOp === 'isbetween' ? (_jsx(BetweenAmountInput
                                // @ts-expect-error fix me
                                , { 
                                    // @ts-expect-error fix me
                                    defaultValue: state.fields.amount, onChange: value => dispatch({
                                        type: 'set-field',
                                        field: 'amount',
                                        value,
                                    }) })) : (_jsx(AmountInput, { id: "amount-field", 
                                    // @ts-expect-error fix me
                                    value: state.fields.amount, onUpdate: value => dispatch({
                                        type: 'set-field',
                                        field: 'amount',
                                        value,
                                    }) }))] })] }), _jsx(View, { style: { marginTop: 20 }, children: _jsx(FormLabel, { title: t('Date') }) }), _jsxs(Stack, { direction: "row", align: "flex-start", justify: "space-between", children: [_jsxs(View, { style: { width: '13.44rem' }, children: [repeats ? (_jsx(RecurringSchedulePicker
                                // @ts-expect-error fix me
                                , { 
                                    // @ts-expect-error fix me
                                    value: state.fields.date, onChange: value => dispatch({ type: 'set-field', field: 'date', value }) })) : (_jsx(DateSelect
                                // @ts-expect-error fix me
                                , { 
                                    // @ts-expect-error fix me
                                    value: state.fields.date, onSelect: date => dispatch({ type: 'set-field', field: 'date', value: date }), dateFormat: dateFormat })), state.upcomingDates && (_jsxs(View, { style: { fontSize: 13, marginTop: 20 }, children: [_jsx(Text, { style: { color: theme.pageTextLight, fontWeight: 600 }, children: _jsx(Trans, { children: "Upcoming dates" }) }), _jsx(Stack, { direction: "column", spacing: 1, style: { marginTop: 10, color: theme.pageTextLight }, children: state.upcomingDates.map(date => (_jsx(View, { children: monthUtils.format(date, `${dateFormat} EEEE`, locale) }, date))) })] }))] }), _jsxs(View, { style: {
                                marginTop: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                userSelect: 'none',
                            }, children: [_jsx(Checkbox, { id: "form_repeats", checked: repeats, onChange: e => {
                                        dispatch({ type: 'set-repeats', repeats: e.target.checked });
                                    } }), _jsx("label", { htmlFor: "form_repeats", style: { userSelect: 'none' }, children: _jsx(Trans, { children: "Repeats" }) })] }), _jsxs(Stack, { align: "flex-end", children: [_jsxs(View, { style: {
                                        marginTop: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        userSelect: 'none',
                                        justifyContent: 'flex-end',
                                    }, children: [_jsx(Checkbox, { id: "form_posts_transaction", checked: state.fields.posts_transaction, onChange: e => {
                                                dispatch({
                                                    type: 'set-field',
                                                    field: 'posts_transaction',
                                                    value: e.target.checked,
                                                });
                                            } }), _jsx("label", { htmlFor: "form_posts_transaction", style: { userSelect: 'none' }, children: _jsx(Trans, { children: "Automatically add transaction" }) })] }), _jsx(Text, { style: {
                                        width: 350,
                                        textAlign: 'right',
                                        color: theme.pageTextLight,
                                        marginTop: 10,
                                        fontSize: 13,
                                        lineHeight: '1.4em',
                                    }, children: _jsx(Trans, { children: "If checked, the schedule will automatically create transactions for you in the specified account" }) }), !adding && schedule.rule && (_jsxs(Stack, { direction: "row", align: "center", style: { marginTop: 20 }, children: [state.isCustom && (_jsx(Text, { style: {
                                                color: theme.pageTextLight,
                                                fontSize: 13,
                                                textAlign: 'right',
                                                width: 350,
                                            }, children: _jsx(Trans, { children: "This schedule has custom conditions and actions" }) })), _jsx(Button, { onPress: () => onEditRule(schedule.rule), isDisabled: adding, children: _jsx(Trans, { children: "Edit as rule" }) })] }))] })] }), _jsx(View, { style: { marginTop: 30, flex: 1 }, children: _jsxs(SelectedProvider, { instance: selectedInst, children: [adding ? (_jsxs(View, { style: { flexDirection: 'row', padding: '5px 0' }, children: [_jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "These transactions match this schedule:" }) }), _jsx(View, { style: { flex: 1 } }), _jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Select transactions to link on save" }) })] })) : (_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center' }, children: [_jsx(Button, { variant: "bare", style: {
                                            color: state.transactionsMode === 'linked'
                                                ? theme.pageTextLink
                                                : theme.pageTextSubdued,
                                            marginRight: 10,
                                            fontSize: 14,
                                        }, onPress: () => onSwitchTransactions('linked'), children: _jsx(Trans, { children: "Linked transactions" }) }), ' ', _jsx(Button, { variant: "bare", style: {
                                            color: state.transactionsMode === 'matched'
                                                ? theme.pageTextLink
                                                : theme.pageTextSubdued,
                                            fontSize: 14,
                                        }, onPress: () => onSwitchTransactions('matched'), children: _jsx(Trans, { children: "Find matching transactions" }) }), _jsx(View, { style: { flex: 1 } }), _jsx(SelectedItemsButton, { id: "transactions", name: count => t('{{count}} transactions', { count }), items: state.transactionsMode === 'linked'
                                            ? [{ name: 'unlink', text: t('Unlink from schedule') }]
                                            : [{ name: 'link', text: t('Link to schedule') }], onSelect: (name, ids) => {
                                            switch (name) {
                                                case 'link':
                                                    onLinkTransactions(ids, schedule.id);
                                                    break;
                                                case 'unlink':
                                                    onUnlinkTransactions(ids);
                                                    break;
                                                default:
                                            }
                                        } })] })), _jsx(SimpleTransactionsTable, { renderEmpty: _jsx(NoTransactionsMessage, { error: state.error, transactionsMode: state.transactionsMode }), transactions: state.transactions, fields: ['date', 'payee', 'notes', 'amount'], style: {
                                    border: '1px solid ' + theme.tableBorder,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    marginTop: 5,
                                    maxHeight: 200,
                                } })] }) }), _jsxs(Stack, { direction: "row", justify: "flex-end", align: "center", style: { marginTop: 20 }, children: [state.error && (_jsx(Text, { style: { color: theme.errorText }, children: state.error })), _jsx(Button, { style: { marginRight: 10 }, onPress: close, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", onPress: () => {
                                onSave(close, schedule);
                            }, children: adding ? t('Add') : t('Save') })] })] })) }));
}
function NoTransactionsMessage(props) {
    const { t } = useTranslation();
    return (_jsx(View, { style: {
            padding: 20,
            color: theme.pageTextLight,
            textAlign: 'center',
        }, children: props.error ? (_jsx(Text, { style: { color: theme.errorText }, children: _jsxs(Trans, { children: ["Could not search: ", { errorReason: props.error }] }) })) : props.transactionsMode === 'matched' ? (t('No matching transactions')) : (t('No linked transactions')) }));
}
