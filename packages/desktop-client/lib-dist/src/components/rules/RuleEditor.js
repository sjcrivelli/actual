import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState, useEffect, useRef, useMemo, } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgDelete, SvgAdd, SvgSubtract, } from '@actual-app/components/icons/v0';
import { SvgAlignLeft, SvgCode, SvgInformationOutline, } from '@actual-app/components/icons/v1';
import { Menu } from '@actual-app/components/menu';
import { Select } from '@actual-app/components/select';
import { SpaceBetween } from '@actual-app/components/space-between';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { v4 as uuid } from 'uuid';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { q } from 'loot-core/shared/query';
import { mapField, friendlyOp, getFieldError, parse, unparse, makeValue, FIELD_TYPES, getAllocationMethods, isValidOp, getValidOps, } from 'loot-core/shared/rules';
import { StatusBadge } from '@desktop-client/components/schedules/StatusBadge';
import { SimpleTransactionsTable } from '@desktop-client/components/transactions/SimpleTransactionsTable';
import { BetweenAmountInput } from '@desktop-client/components/util/AmountInput';
import { DisplayId } from '@desktop-client/components/util/DisplayId';
import { GenericInput } from '@desktop-client/components/util/GenericInput';
import { useDateFormat } from '@desktop-client/hooks/useDateFormat';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSchedules, } from '@desktop-client/hooks/useSchedules';
import { useSelected, SelectedProvider, } from '@desktop-client/hooks/useSelected';
import { getPayees } from '@desktop-client/payees/payeesSlice';
import { aqlQuery } from '@desktop-client/queries/aqlQuery';
import { useDispatch } from '@desktop-client/redux';
import { enableUndo, disableUndo } from '@desktop-client/undo';
function updateValue(array, value, update) {
    return array.map(v => (v === value ? update() : v));
}
function applyErrors(array, errorsArray) {
    return array.map((item, i) => {
        return { ...item, error: errorsArray[i] };
    });
}
function getTransactionFields(conditions, actions) {
    const fields = ['date'];
    if (conditions.find(c => c.field === 'imported_payee')) {
        fields.push('imported_payee');
    }
    fields.push('payee');
    if (actions.find(a => a.field === 'category')) {
        fields.push('category');
    }
    else if (actions.length > 0 &&
        !['payee', 'date', 'amount'].includes(actions[0].field)) {
        fields.push(actions[0].field);
    }
    fields.push('amount');
    return fields;
}
export function FieldSelect({ fields, style, value, onChange, }) {
    return (_jsx(View, { style: style, "data-testid": "field-select", children: _jsx(Select, { bare: true, options: fields, value: value, onChange: onChange, className: css({
                color: theme.pageTextPositive,
                '&[data-hovered]': { color: theme.pageTextPositive },
            }) }) }));
}
export function OpSelect({ ops, type, style, value, formatOp = friendlyOp, onChange, }) {
    const opOptions = useMemo(() => {
        const options = ops
            // We don't support the `contains`, `doesNotContain`, `matches` operators
            // for the id type rules yet
            // TODO: Add matches op support for payees, accounts, categories.
            .filter(op => type === 'id'
            ? !['contains', 'matches', 'doesNotContain', 'hasTags'].includes(op)
            : true)
            .map(op => [op, formatOp(op, type)]);
        if (type === 'string' || type === 'id') {
            // @ts-expect-error fix this
            options.splice(Math.ceil(options.length / 2), 0, Menu.line);
        }
        return options;
    }, [formatOp, ops, type]);
    return (_jsx(View, { "data-testid": "op-select", children: _jsx(Select, { bare: true, 
            // @ts-expect-error fix this
            options: opOptions, value: value, onChange: value => onChange('op', value), style: style }) }));
}
function SplitAmountMethodSelect({ options, style, value, onChange, }) {
    return (_jsx(View, { style: { color: theme.pageTextPositive, ...style }, "data-testid": "field-select", children: _jsx(Select, { bare: true, options: options, value: value, onChange: value => onChange('method', value) }) }));
}
function EditorButtons({ onAdd, onDelete }) {
    const { t } = useTranslation();
    return (_jsxs(_Fragment, { children: [onDelete && (_jsx(Button, { variant: "bare", onPress: onDelete, style: { padding: 7 }, "aria-label": t('Delete entry'), children: _jsx(SvgSubtract, { style: { width: 8, height: 8, color: 'inherit' } }) })), onAdd && (_jsx(Button, { variant: "bare", onPress: onAdd, style: { padding: 7 }, "aria-label": t('Add entry'), children: _jsx(SvgAdd, { style: { width: 10, height: 10, color: 'inherit' } }) }))] }));
}
function FieldError({ type }) {
    return (_jsx(Text, { style: {
            fontSize: 12,
            textAlign: 'center',
            color: theme.errorText,
            marginBottom: 5,
        }, children: getFieldError(type) }));
}
function Editor({ error, style, children }) {
    return (_jsxs(View, { style: style, "data-testid": "editor-row", children: [_jsx(Stack, { direction: "row", align: "center", spacing: 1, children: children }), error && _jsx(FieldError, { type: error })] }));
}
function ConditionEditor({ ops, condition, editorStyle, isSchedule, onChange, onDelete, onAdd, }) {
    const { field: originalField, op, value, type, options, error, inputKey, } = condition;
    const translatedConditions = useMemo(() => {
        const retValue = [...conditionFields];
        if (retValue && retValue.length > 0) {
            retValue.forEach(field => {
                field[1] = mapField(field[0]);
            });
        }
        return retValue;
    }, []);
    let field = originalField;
    if (field === 'amount' && options) {
        if (options.inflow) {
            field = 'amount-inflow';
        }
        else if (options.outflow) {
            field = 'amount-outflow';
        }
    }
    let valueEditor;
    if (type === 'number' && op === 'isbetween') {
        valueEditor = (_jsx(BetweenAmountInput, { defaultValue: value, onChange: v => onChange('value', v) }, inputKey));
    }
    else {
        valueEditor = (
        // @ts-expect-error fix this
        _jsx(GenericInput, { field: field, type: type, value: value, op: op, multi: op === 'oneOf' || op === 'notOneOf', onChange: v => onChange('value', v), numberFormatType: "currency" }, inputKey));
    }
    return (_jsxs(Editor, { style: editorStyle, error: error, children: [_jsx(FieldSelect
            // @ts-expect-error fix this
            , { 
                // @ts-expect-error fix this
                fields: translatedConditions, value: field, onChange: value => onChange('field', value) }), _jsx(OpSelect, { ops: ops, value: op, type: type, onChange: onChange }), _jsx(View, { style: { flex: 1, minWidth: 80 }, children: valueEditor }), _jsx(Stack, { direction: "row", children: _jsx(EditorButtons, { onAdd: onAdd, onDelete: isSchedule && field === 'date' ? null : onDelete }) })] }));
}
function formatAmount(amount, format) {
    if (!amount) {
        return format(0, 'financial');
    }
    else if (typeof amount === 'number') {
        return format(amount, 'financial');
    }
    else {
        return `${format(amount.num1, 'financial')} to ${format(amount.num2, 'financial')}`;
    }
}
function ScheduleDescription({ id }) {
    const { isNarrowWidth } = useResponsive();
    const dateFormat = useDateFormat() || 'MM/dd/yyyy';
    const format = useFormat();
    const scheduleQuery = useMemo(() => q('schedules').filter({ id }).select('*'), [id]);
    const { schedules, statusLabels, isLoading: isSchedulesLoading, } = useSchedules({ query: scheduleQuery });
    if (isSchedulesLoading) {
        return null;
    }
    const [schedule] = schedules;
    if (schedule && schedules.length === 0) {
        return _jsx(View, { style: { flex: 1 }, children: id });
    }
    const status = statusLabels.get(schedule.id);
    return (_jsxs(View, { style: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        }, children: [_jsxs(SpaceBetween, { gap: 5, style: {
                    marginRight: 15,
                }, children: [_jsxs(SpaceBetween, { gap: 5, style: { flexWrap: 'nowrap' }, children: [_jsx(Trans, { children: "Payee:" }), _jsx(DisplayId, { type: "payees", id: schedule._payee, noneColor: theme.pageTextLight })] }), _jsxs(Text, { style: { flexShrink: 0 }, children: [_jsx(Text, { children: " \u2014 " }), _jsx(Trans, { children: "Amount:" }), " ", formatAmount(schedule._amount, format)] }), _jsxs(Text, { style: { flexShrink: 0 }, children: [_jsx(Text, { children: " \u2014 " }), _jsxs(Trans, { children: ["Next: ", { month: monthUtils.format(schedule.next_date, dateFormat) }] })] })] }), !isNarrowWidth && _jsx(StatusBadge, { status: status })] }));
}
function getActionFields() {
    return [
        'category',
        'payee',
        'payee_name',
        'notes',
        'cleared',
        'account',
        'date',
        'amount',
    ].map(field => [field, mapField(field)]);
}
const parentOnlyFields = ['amount', 'cleared', 'account', 'date'];
function getSplitActionFields() {
    return getActionFields().filter(([field]) => !parentOnlyFields.includes(field));
}
function getAllocationMethodOptions() {
    return Object.entries(getAllocationMethods());
}
function ActionEditor({ action, editorStyle, onChange, onDelete, onAdd, }) {
    const { t } = useTranslation();
    const { field, op, value, type, error, inputKey = 'initial', 
    // @ts-expect-error fix this
    options, } = action;
    const templated = options?.template !== undefined;
    // Even if the feature flag is disabled, we still want to be able to turn off templating
    const actionTemplating = useFeatureFlag('actionTemplating');
    const isTemplatingEnabled = actionTemplating || templated;
    const fields = (options?.splitIndex ? getSplitActionFields() : getActionFields()).filter(([s]) => actionTemplating || !s.includes('_name') || field === s);
    return (_jsxs(Editor, { style: editorStyle, error: error, children: [op === 'set' ? (_jsxs(_Fragment, { children: [_jsx(OpSelect, { ops: ['set', 'prepend-notes', 'append-notes', 'delete-transaction'], value: op, onChange: onChange }), _jsx(FieldSelect
                    // @ts-expect-error fix this
                    , { 
                        // @ts-expect-error fix this
                        fields: fields, value: field, onChange: value => onChange('field', value) }), _jsx(View, { style: { flex: 1 }, children: _jsx(GenericInput, { field: field, type: templated ? 'string' : type, op: op, value: options?.template ?? value, onChange: v => onChange('value', v), numberFormatType: "currency" }, inputKey) }), isTemplatingEnabled &&
                        ['payee', 'category', 'account'].indexOf(field) === -1 && (_jsx(Button, { variant: "bare", style: {
                            padding: 5,
                        }, "aria-label": templated ? t('Disable templating') : t('Enable templating'), onPress: () => onChange('template', !templated), children: templated ? (_jsx(SvgCode, { style: { width: 12, height: 12, color: 'inherit' } })) : (_jsx(SvgAlignLeft, { style: { width: 12, height: 12, color: 'inherit' } })) }))] })) : op === 'set-split-amount' ? (_jsxs(_Fragment, { children: [_jsx(View, { style: {
                            padding: '5px 10px',
                            lineHeight: '1em',
                            flexShrink: 0,
                        }, children: t('allocate') }), _jsx(SplitAmountMethodSelect, { options: getAllocationMethodOptions(), value: options.method, onChange: onChange }), _jsx(View, { style: {
                            flex: 1,
                            minWidth: options.method === 'fixed-percent' ? 45 : 70,
                        }, children: options.method !== 'remainder' && (
                        // @ts-expect-error fix this
                        _jsx(GenericInput, { field: field, op: op, type: "number", numberFormatType: options.method === 'fixed-percent' ? 'percentage' : 'currency', value: value, onChange: v => onChange('value', v) }, inputKey)) })] })) : op === 'link-schedule' ? (_jsxs(_Fragment, { children: [_jsx(View, { style: {
                            padding: '5px 10px',
                            color: theme.pageTextPositive,
                        }, children: friendlyOp(op) }), _jsx(ScheduleDescription, { id: value || null })] })) : op === 'prepend-notes' || op === 'append-notes' ? (_jsxs(_Fragment, { children: [_jsx(OpSelect, { ops: ['set', 'prepend-notes', 'append-notes', 'delete-transaction'], value: op, onChange: onChange }), _jsx(View, { style: { flex: 1 }, children: _jsx(GenericInput, { field: field, type: "string", op: op, value: value, onChange: v => onChange('value', v) }, inputKey) })] })) : op === 'delete-transaction' ? (_jsx(OpSelect, { ops: ['set', 'prepend-notes', 'append-notes', 'delete-transaction'], value: op, onChange: onChange })) : null, op !== 'delete-transaction' && (_jsx(Stack, { direction: "row", style: { flexShrink: 0 }, children: _jsx(EditorButtons, { onAdd: onAdd, onDelete: (op === 'set' ||
                        op === 'prepend-notes' ||
                        op === 'append-notes') &&
                        onDelete }) }))] }));
}
function StageInfo() {
    return (_jsx(View, { style: { position: 'relative', marginLeft: 5 }, children: _jsx(Tooltip, { content: _jsx(Trans, { children: "The stage of a rule allows you to force a specific order. Pre rules always run first, and post rules always run last. Within each stage rules are automatically ordered from least to most specific." }), placement: "bottom start", style: {
                ...styles.tooltip,
                padding: 10,
                color: theme.pageTextLight,
                maxWidth: 450,
                lineHeight: 1.5,
            }, children: _jsx(SvgInformationOutline, { style: { width: 11, height: 11, color: theme.pageTextLight } }) }) }));
}
function StageButton({ selected, children, style, onSelect, }) {
    return (_jsx(Button, { variant: "bare", style: {
            fontSize: 'inherit',
            ...(selected && {
                backgroundColor: theme.pillBackgroundSelected,
                ':hover': { backgroundColor: theme.pillBackgroundSelected },
            }),
            ...style,
        }, onPress: onSelect, children: children }));
}
function newInput(item) {
    return { ...item, inputKey: uuid() };
}
function ConditionsList({ conditionsOp, conditions, editorStyle, isSchedule, onChangeConditions, }) {
    function addCondition(index) {
        if (conditionFields && conditionFields.length > 0) {
            conditionFields.forEach(field => {
                field[1] = mapField(field[0]);
            });
        }
        // (remove the inflow and outflow pseudo-fields since they’d be a pain to get right)
        let fields = conditionFields
            .map(f => f[0])
            .filter(f => f !== 'amount-inflow' && f !== 'amount-outflow');
        // suggest a sensible next field: the same if 'or' or different if 'and'
        if (conditions.length && conditionsOp === 'or') {
            fields = [conditions[0].field];
        }
        else {
            fields = fields.filter(f => !conditions.some(c => c.field.includes(f) || f.includes(c.field)));
        }
        const field = fields[0] || 'payee';
        const copy = [...conditions];
        copy.splice(index + 1, 0, {
            type: FIELD_TYPES.get(field),
            field,
            op: 'is',
            value: null,
            inputKey: uuid(),
        });
        onChangeConditions(copy);
    }
    function addInitialCondition() {
        addCondition(-1);
    }
    function removeCondition(cond) {
        onChangeConditions(conditions.filter(c => c !== cond));
    }
    function updateCondition(cond, field, value) {
        onChangeConditions(updateValue(conditions, cond, () => {
            if (field === 'field') {
                const newCond = { field: value };
                if (value === 'amount-inflow') {
                    newCond.field = 'amount';
                    // @ts-expect-error fix this
                    newCond.options = { inflow: true };
                }
                else if (value === 'amount-outflow') {
                    newCond.field = 'amount';
                    // @ts-expect-error fix this
                    newCond.options = { outflow: true };
                }
                // @ts-expect-error fix this
                newCond.type = FIELD_TYPES.get(newCond.field);
                const prevType = FIELD_TYPES.get(cond.field);
                if ((prevType === 'string' || prevType === 'number') &&
                    // @ts-expect-error fix this
                    prevType === newCond.type &&
                    cond.op !== 'isbetween' &&
                    isValidOp(newCond.field, cond.op)) {
                    // Don't clear the value & op if the type is string/number and
                    // the type hasn't changed
                    // @ts-expect-error fix this
                    newCond.op = cond.op;
                    return newInput(makeValue(cond.value, newCond));
                }
                else {
                    // @ts-expect-error fix this
                    newCond.op = getValidOps(newCond.field)[0];
                    return newInput(makeValue(null, newCond));
                }
            }
            else if (field === 'op') {
                const op = value;
                // Switching between oneOf and other operators is a
                // special-case. It changes the input type, so we need to
                // clear the value
                if (cond.op !== 'oneOf' &&
                    cond.op !== 'notOneOf' &&
                    (op === 'oneOf' || op === 'notOneOf')) {
                    return newInput(makeValue(cond.value != null ? [cond.value] : [], {
                        ...cond,
                        op: value,
                    }));
                }
                else if ((cond.op === 'oneOf' || cond.op === 'notOneOf') &&
                    op !== 'oneOf' &&
                    op !== 'notOneOf') {
                    return newInput(makeValue(cond.value.length > 0 ? cond.value[0] : null, {
                        ...cond,
                        op: value,
                    }));
                }
                else if (cond.op !== 'isbetween' && op === 'isbetween') {
                    // TODO: I don't think we need `makeValue` anymore. It
                    // tries to parse the value as a float and we had to
                    // special-case isbetween. I don't know why we need that
                    // behavior and we can probably get rid of `makeValue`
                    return makeValue({
                        num1: cond.value,
                        num2: cond.value,
                    }, { ...cond, op: value });
                }
                else if (cond.op === 'isbetween' && op !== 'isbetween') {
                    return makeValue(cond.value.num1 || 0, {
                        ...cond,
                        op: value,
                    });
                }
                else {
                    return { ...cond, op: value };
                }
            }
            else if (field === 'value') {
                return makeValue(value, cond);
            }
            return cond;
        }));
    }
    return conditions.length === 0 ? (_jsx(Button, { style: { alignSelf: 'flex-start' }, onPress: addInitialCondition, children: _jsx(Trans, { children: "Add condition" }) })) : (_jsx(Stack, { spacing: 2, "data-testid": "condition-list", children: conditions.map((cond, i) => {
            let ops = getValidOps(cond.field);
            // Hack for now, these ops should be the only ones available
            // for recurring dates
            if (cond.type === 'date' && cond.value && cond.value.frequency) {
                ops = ['is', 'isapprox'];
            }
            else if (cond.options &&
                (cond.options.inflow || cond.options.outflow)) {
                ops = ops.filter(op => op !== 'isbetween');
            }
            return (_jsx(View, { children: _jsx(ConditionEditor, { editorStyle: editorStyle, ops: ops, condition: cond, isSchedule: isSchedule, onChange: (name, value) => {
                        updateCondition(cond, name, value);
                    }, onDelete: () => removeCondition(cond), onAdd: () => addCondition(i) }) }, i));
        }) }));
}
const getActions = splits => splits.flatMap(s => s.actions);
const getUnparsedActions = splits => getActions(splits).map(unparse);
// TODO:
// * Dont touch child transactions?
const conditionFields = [
    'imported_payee',
    'account',
    'category',
    'date',
    'payee',
    'notes',
    'amount',
]
    .map(field => [field, mapField(field)])
    .concat([
    ['amount-inflow', mapField('amount', { inflow: true })],
    ['amount-outflow', mapField('amount', { outflow: true })],
]);
export function RuleEditor({ rule: defaultRule, onSave: originalOnSave = undefined, onDelete, onCancel, style, }) {
    const { t } = useTranslation();
    const [conditions, setConditions] = useState(defaultRule.conditions.map(parse).map(c => ({ ...c, inputKey: uuid() })));
    const [actionSplits, setActionSplits] = useState(() => {
        const parsedActions = defaultRule.actions.map(parse);
        return parsedActions.reduce((acc, action) => {
            const splitIndex = action.options?.splitIndex ?? 0;
            acc[splitIndex] = acc[splitIndex] ?? { id: uuid(), actions: [] };
            acc[splitIndex].actions.push({ ...action, inputKey: uuid() });
            return acc;
        }, 
        // The pre-split group is always there
        [{ id: uuid(), actions: [] }]);
    });
    const [stage, setStage] = useState(defaultRule.stage);
    const [conditionsOp, setConditionsOp] = useState(defaultRule.conditionsOp);
    const [transactions, setTransactions] = useState([]);
    const dispatch = useDispatch();
    const scrollableEl = useRef(undefined);
    const isSchedule = getActions(actionSplits).some(action => action.op === 'link-schedule');
    useEffect(() => {
        dispatch(getPayees());
        // Disable undo while this modal is open
        disableUndo();
        return () => enableUndo();
    }, [dispatch]);
    useEffect(() => {
        // Flash the scrollbar
        if (scrollableEl.current) {
            const el = scrollableEl.current;
            const top = el.scrollTop;
            el.scrollTop = top + 1;
            el.scrollTop = top;
        }
        // Run it here
        async function run() {
            const { filters } = await send('make-filters-from-conditions', {
                conditions: conditions.map(unparse),
            });
            if (filters.length > 0) {
                const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';
                const parentOnlyCondition = actionSplits.length > 1 ? { is_child: false } : {};
                const { data: transactions } = await aqlQuery(q('transactions')
                    .filter({ [conditionsOpKey]: filters, ...parentOnlyCondition })
                    .select('*'));
                setTransactions(transactions);
            }
            else {
                setTransactions([]);
            }
        }
        run();
    }, [actionSplits, conditions, conditionsOp]);
    const selectedInst = useSelected('transactions', transactions, []);
    function addInitialAction() {
        addActionToSplitAfterIndex(0, -1);
    }
    function addActionToSplitAfterIndex(splitIndex, actionIndex) {
        let newAction;
        if (splitIndex && !actionSplits[splitIndex]?.actions?.length) {
            actionSplits[splitIndex] = { id: uuid(), actions: [] };
            newAction = {
                op: 'set-split-amount',
                options: { method: 'remainder', splitIndex },
                value: null,
                inputKey: uuid(),
            };
        }
        else {
            const fieldsArray = splitIndex === 0 ? getActionFields() : getSplitActionFields();
            let fields = fieldsArray.map(f => f[0]);
            for (const action of actionSplits[splitIndex].actions) {
                fields = fields.filter(f => f !== action.field);
            }
            const field = fields[0] || 'category';
            newAction = {
                type: FIELD_TYPES.get(field),
                field,
                op: 'set',
                value: null,
                options: { splitIndex },
                inputKey: uuid(),
            };
        }
        const actionsCopy = [...actionSplits[splitIndex].actions];
        actionsCopy.splice(actionIndex + 1, 0, newAction);
        const copy = [...actionSplits];
        copy[splitIndex] = { ...actionSplits[splitIndex], actions: actionsCopy };
        setActionSplits(copy);
    }
    function onChangeAction(action, field, value) {
        setActionSplits(actionSplits.map(({ id, actions }) => ({
            id,
            actions: updateValue(actions, action, () => {
                const a = { ...action };
                if (field === 'method') {
                    a.options = { ...a.options, method: value };
                }
                else if (field === 'template') {
                    if (value) {
                        a.options = { ...a.options, template: a.value };
                    }
                    else {
                        a.options = { ...a.options, template: undefined };
                        if (a.type !== 'string')
                            a.value = null;
                    }
                }
                else {
                    a[field] = value;
                    if (a.options?.template !== undefined) {
                        a.options = {
                            ...a.options,
                            template: value,
                        };
                    }
                    if (field === 'field') {
                        a.type = FIELD_TYPES.get(a.field);
                        a.value = null;
                        a.options = { ...a.options, template: undefined };
                        return newInput(a);
                    }
                    else if (field === 'op') {
                        a.value = null;
                        a.inputKey = '' + Math.random();
                        a.options = { ...a.options, template: undefined };
                        return newInput(a);
                    }
                }
                return a;
            }),
        })));
    }
    function onChangeStage(stage) {
        setStage(stage);
    }
    function onChangeConditionsOp(value) {
        setConditionsOp(value);
    }
    function onRemoveAction(action) {
        setActionSplits(splits => splits.map(({ id, actions }) => ({
            id,
            actions: actions.filter(a => a !== action),
        })));
    }
    function onRemoveSplit(splitIndexToRemove) {
        setActionSplits(splits => {
            const copy = [];
            splits.forEach(({ id }, index) => {
                if (index === splitIndexToRemove) {
                    return;
                }
                copy.push({ id, actions: [] });
            });
            getActions(splits).forEach(action => {
                const currentSplitIndex = action.options?.splitIndex ?? 0;
                if (currentSplitIndex === splitIndexToRemove) {
                    return;
                }
                const newSplitIndex = currentSplitIndex > splitIndexToRemove
                    ? currentSplitIndex - 1
                    : currentSplitIndex;
                copy[newSplitIndex].actions.push({
                    ...action,
                    options: { ...action.options, splitIndex: newSplitIndex },
                });
            });
            return copy;
        });
    }
    function onApply() {
        const selectedTransactions = transactions.filter(({ id }) => selectedInst.items.has(id));
        send('rule-apply-actions', {
            transactions: selectedTransactions,
            actions: getUnparsedActions(actionSplits),
        }).then(() => {
            // This makes it refetch the transactions
            setActionSplits([...actionSplits]);
        });
    }
    async function onSave() {
        const rule = {
            ...defaultRule,
            stage,
            conditionsOp,
            conditions: conditions.map(unparse),
            actions: getUnparsedActions(actionSplits),
        };
        // @ts-expect-error fix this
        const method = rule.id ? 'rule-update' : 'rule-add';
        // @ts-expect-error fix this
        const { error, id: newId } = await send(method, rule);
        if (error) {
            // @ts-expect-error fix this
            if (error.conditionErrors) {
                // @ts-expect-error fix this
                setConditions(applyErrors(conditions, error.conditionErrors));
            }
            // @ts-expect-error fix this
            if (error.actionErrors) {
                let usedErrorIdx = 0;
                setActionSplits(actionSplits.map(item => ({
                    ...item,
                    actions: item.actions.map(action => ({
                        ...action,
                        // @ts-expect-error fix this
                        error: error.actionErrors[usedErrorIdx++] ?? null,
                    })),
                })));
            }
        }
        else {
            // If adding a rule, we got back an id
            if (newId) {
                // @ts-expect-error fix this
                rule.id = newId;
            }
            // @ts-expect-error fix this
            originalOnSave?.(rule);
        }
    }
    // Enable editing existing split rules even if the feature has since been disabled.
    const showSplitButton = actionSplits.length > 0;
    return (_jsxs(View, { style: style, children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 15,
                    padding: '0 20px',
                }, children: [_jsx(Text, { style: { marginRight: 15 }, children: _jsx(Trans, { children: "Stage of rule:" }) }), _jsxs(Stack, { direction: "row", align: "center", spacing: 1, children: [_jsx(StageButton, { selected: stage === 'pre', onSelect: () => onChangeStage('pre'), children: _jsx(Trans, { children: "Pre" }) }), _jsx(StageButton, { selected: stage === null, onSelect: () => onChangeStage(null), children: _jsx(Trans, { children: "Default" }) }), _jsx(StageButton, { selected: stage === 'post', onSelect: () => onChangeStage('post'), children: _jsx(Trans, { children: "Post" }) }), _jsx(StageInfo, {})] })] }), _jsx(View, { innerRef: scrollableEl, style: {
                    borderBottom: '1px solid ' + theme.tableBorder,
                    padding: '0 20px 20px 20px',
                    overflow: 'auto',
                    maxHeight: 'calc(100% - 300px)',
                    minHeight: 100,
                }, children: _jsxs(View, { style: { flexShrink: 0 }, children: [_jsxs(View, { style: { marginBottom: 30 }, children: [_jsx(Text, { style: { marginBottom: 15 }, children: _jsxs(Trans, { children: ["If", ' ', _jsx(FieldSelect, { "data-testid": "conditions-op", style: { display: 'inline-flex' }, fields: [
                                                    ['and', t('all')],
                                                    ['or', t('any')],
                                                ], value: conditionsOp, onChange: onChangeConditionsOp }), { allOrAny: '' }, " of these conditions match:"] }) }), _jsx(ConditionsList, { conditionsOp: conditionsOp, conditions: conditions, editorStyle: styles.editorPill, isSchedule: isSchedule, onChangeConditions: conds => setConditions(conds) })] }), _jsx(Text, { style: { marginBottom: 15 }, children: _jsx(Trans, { children: "Then apply these actions:" }) }), _jsxs(View, { style: { flex: 1 }, children: [actionSplits.length === 0 && (_jsx(Button, { style: { alignSelf: 'flex-start' }, onPress: addInitialAction, children: _jsx(Trans, { children: "Add action" }) })), _jsx(Stack, { spacing: 2, "data-testid": "action-split-list", children: actionSplits.map(({ id, actions }, splitIndex) => (_jsxs(View, { nativeStyle: actionSplits.length > 1
                                            ? {
                                                borderColor: theme.tableBorder,
                                                borderWidth: '1px',
                                                borderRadius: '5px',
                                                padding: '5px',
                                            }
                                            : {}, children: [actionSplits.length > 1 && (_jsxs(Stack, { direction: "row", justify: "space-between", spacing: 1, children: [_jsx(Text, { style: {
                                                            ...styles.smallText,
                                                            marginBottom: '10px',
                                                        }, children: splitIndex === 0
                                                            ? t('Apply to all')
                                                            : `${t('Split')} ${splitIndex}` }), splitIndex && (_jsx(Button, { variant: "bare", onPress: () => onRemoveSplit(splitIndex), style: {
                                                            width: 20,
                                                            height: 20,
                                                        }, "aria-label": t('Delete split'), children: _jsx(SvgDelete, { style: {
                                                                width: 8,
                                                                height: 8,
                                                                color: 'inherit',
                                                            } }) }))] })), _jsx(Stack, { spacing: 2, "data-testid": "action-list", children: actions.map((action, actionIndex) => (_jsx(View, { children: _jsx(ActionEditor, { action: action, editorStyle: styles.editorPill, onChange: (name, value) => {
                                                            onChangeAction(action, name, value);
                                                        }, onDelete: () => onRemoveAction(action), onAdd: () => addActionToSplitAfterIndex(splitIndex, actionIndex) }) }, actionIndex))) }), actions.length === 0 && (_jsx(Button, { style: { alignSelf: 'flex-start', marginTop: 5 }, onPress: () => addActionToSplitAfterIndex(splitIndex, -1), children: _jsx(Trans, { children: "Add action" }) }))] }, id))) }), showSplitButton && (_jsx(Button, { style: { alignSelf: 'flex-start', marginTop: 15 }, onPress: () => {
                                        addActionToSplitAfterIndex(actionSplits.length, -1);
                                    }, "data-testid": "add-split-transactions", children: actionSplits.length > 1
                                        ? t('Add another split')
                                        : t('Split into multiple transactions') }))] })] }) }), _jsx(SelectedProvider, { instance: selectedInst, children: _jsxs(View, { style: { padding: '20px', flex: 1 }, children: [_jsxs(SpaceBetween, { direction: "horizontal", gap: 5, style: {
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                justifyContent: 'space-between',
                                marginBottom: 12,
                            }, children: [_jsx(Text, { style: { color: theme.pageTextLight, marginBottom: 0 }, children: _jsx(Trans, { children: "This rule applies to these transactions:" }) }), _jsxs(Button, { isDisabled: selectedInst.items.size === 0, onPress: onApply, children: [_jsx(Trans, { children: "Apply actions" }), " (", selectedInst.items.size, ")"] })] }), _jsx(SimpleTransactionsTable, { transactions: transactions, fields: getTransactionFields(conditions, getActions(actionSplits)), style: {
                                border: '1px solid ' + theme.tableBorder,
                                borderRadius: '6px 6px 0 0',
                            } }), _jsxs(SpaceBetween, { style: {
                                marginTop: 20,
                                justifyContent: onDelete ? 'space-between' : 'flex-end',
                            }, children: [onDelete && (_jsx(Button, { onPress: onDelete, children: _jsx(Trans, { children: "Delete" }) })), _jsxs(SpaceBetween, { children: [_jsx(Button, { onPress: onCancel, children: _jsx(Trans, { children: "Cancel" }) }), _jsx(Button, { variant: "primary", onPress: onSave, children: _jsx(Trans, { children: "Save" }) })] })] })] }) })] }));
}
